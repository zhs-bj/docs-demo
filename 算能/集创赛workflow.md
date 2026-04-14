# 集创赛Workflow

## 初赛ddl：2026/5/7

## 任务一：硬件感知与“社交身份”初始化

**目标：** 让每个 BM168X 盒子能够“自我审计”并对外发布身份。

- **步骤 1：获取硬件底层数据**
  - **方法：** 编写一个 `StatusReporter` 类，利用 `libsophon` 的 C++ 接口或 Python 包装。
  - **调用：** `bm_get_stat` (或通过 `bm-smi` 命令行工具解析)。
  - **怎么调用：** 每隔 500ms 调用一次，提取 `tpu_utilization`（计算压力）和 `mem_used`（显存压力）。
- **步骤 2：定义社交报文 (Heartbeat)**
  - **方法：** 使用 **ROS2 Topic** 广播。
  - **数据结构：** `{"node_id": "Edge_01", "cpu": 20, "tpu": 45, "mem": 30, "status": "AVAILABLE"}`。

## 任务二：模型硬件适配与极致量化

**目标：** 证明你对 BM168X 架构的深度理解（赛题核心要求）。

- **步骤 1：模型转换与算子检查**
  - **工具：** `model_transform.py` (TPU-MLIR)。
  - **动作：** 将 ONNX 转换为 MLIR 格式，查看生成的 `top.mlir` 文件，确认是否有算子被拆分到了 CPU。
- **步骤 2：INT8 量化与精度对齐**
  - **调用 API/脚本：** `run_calibration.py` (生成量化表) -> `model_deploy.py` (生成 bmodel)。
  - **关键参数：** 设置 `--quantize INT8`。如果精度下降严重，调用 `run_qtable.py` 进行**混合精度量化**（部分层保留 FP16）。
- **步骤 3：性能分析 (Profiling)**
  - **工具：** `bmprofile`。
  - **动作：** 观察 **GDMA（数据搬运）** 和 **BDU（计算单元）** 的占比。如果 GDMA 过高，说明内存带宽是瓶颈，需要优化模型层次结构。

##  任务三：分布式社交协议 (Contract Net) 实现

**目标：** 实现“任务分配”的逻辑闭环。

- **步骤 1：任务招标 (Announcement)**
  - **逻辑：** 当本地检测到输入帧率 > 30FPS 且 TPU 负载 > 80% 时触发。
  - **动作：** 广播 `Task_Request` 报文。
- **步骤 2：竞标与选标 (Bidding & Awarding)**
  - **逻辑：** 其他盒子收到请求，计算自身“剩余价值”：$Score = (1 - TPU_{util}) \times 0.7 + (1 - Mem_{util}) \times 0.3$。
  - **动作：** 分数最高的盒子获得 `Task_Token`。
- **步骤 3：任务迁移与数据拉取**
  - **调用 ：** **Sophon-Pipeline** 的 `provider` 和 `consumer` 节点。
  - **怎么调用：** 使用 `Socket` 或 `FastDDS` 传输经过 **BMCV** 编码后的特征向量（Feature Map），而不是原图。

## 任务四：基于 BM-CV 的图像预处理加速

**目标：** 体现“云边端”互联中的低延迟传输技术。

- **步骤 1：硬件缩放与色域转换**
  - **调用 ：** `bm_cv_image_vpp_csc`。
  - **具体做法：** 在图片进入推理前，直接在 TPU 内存中完成 `BGR -> RGB` 和 `Resize`。不使用 `cv2.resize`
- **步骤 2：硬件抠图 (Crop)**
  - **调用：** `bm_cv_image_vpp_basic`。
  - **场景：** 盒子 A 检测到目标，只把目标的区域（ROI）抠出来传给盒子 B 做精细识别。这大大减少了组网带宽压力。





### TASK1 底层数据调取

```python
import subprocess
import json

def get_tpu_metrics():
    """
    调用算能官方 bm-smi 获取硬件状态
    """
    try:
        # 使用命令行工具获取 JSON 格式的状态
        cmd = "bm-smi --api_get_stat"
        output = subprocess.check_output(cmd, shell=True).decode('utf-8')
        data = json.loads(output)
        
        # 提取关键社交指标
        tpu_util = data['Devices'][0]['tpu_utilization'] # TPU 利用率
        mem_used = data['Devices'][0]['mem_used']        # 显存占用
        temp = data['Devices'][0]['board_temp']          # 板卡温度
        
        return {
            "node_id": "FogNode_01",
            "tpu": tpu_util,
            "mem": mem_used,
            "status": "HEALTHY" if temp < 80 else "OVERHEAT"
        }
    except Exception as e:
        return {"error": str(e)}

# 社交决策逻辑
status = get_tpu_metrics()
if status['tpu'] > 85:
    broadcast_help_request(status) # 触发分布式招标
```



### TASK2 基于 ROS2 的社交协议的分布式通信

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String
import json

class SocialFogNode(Node):
    def __init__(self):
        super().__init__('fog_node_01')
        # 1. 广播自己的负载状态 (Heartbeat)
        self.publisher_ = self.create_publisher(String, 'cluster_status', 10)
        # 2. 监听他人的任务请求 (Task Auction)
        self.subscription = self.create_subscription(String, 'task_announcement', self.listener_callback, 10)
        
        self.timer = self.create_timer(1.0, self.publish_status)

    def publish_status(self):
        msg = String()
        # 调用上面的硬件感知函数
        msg.data = json.dumps(get_tpu_metrics())
        self.publisher_.publish(msg)

    def listener_callback(self, msg):
        request = json.loads(msg.data)
        if request['load_needed'] < (100 - get_tpu_metrics()['tpu']):
            self.get_logger().info(f"我可以帮 {request['node_id']} 处理任务，准备竞标！")
            # 此处发送竞标报文 (Bid)
```

