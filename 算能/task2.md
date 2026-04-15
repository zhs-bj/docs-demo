## 任务描述
实现单个Airbox的底层数据调取，包括，同时实现此Airbox的向外数据广播和接受外界数据功能，一位老师负责
预期ddl：4/22

## 参考资料
1. 
2. 

## 模块一：状态采集
### 模块描述
1. 采用 Linux 内核提供的 procfs 与 sysfs 接口进行状态采集。其中：
- `/proc` 用于获取系统运行状态（CPU、内存等）
- `/sys` 用于获取硬件设备状态（温度、TPU 利用率等）
- 算能设备airbox通过驱动将加速器状态映射到这些接口中

2. `bm-smi`是算能的官方封装工具，可以读取`/proc`和`/sys`，有图形化界面，适合于给人看
- 辅以算能官方工具 `bm-smi` 进行状态校验与展示

3. 分层：
- 采集层：负责从 /proc、/sys 读原始数据
- 封装层：负责把原始数据变成有意义的字段
- 表示层：负责整合成统一 JSON
- 通信层：后面再负责广播和接收

#### 确认原始数据
1. 数据源确认，哪些能用
```bash
cat /etc/hostname
hostname -I
date +%s
cat /proc/uptime
cat /proc/stat
cat /proc/meminfo
cat /proc/loadavg
df -h /mnt/sdcard

# TPU利用率
bm-smi
find /sys -name "*tpu*" 2>/dev/null
find /sys -name "*util*" 2>/dev/null

# 网络流量
cat /proc/net/dev

# 温度
cat /sys/class/thermal/thermal_zone0/temp 
cat /sys/class/thermal/thermal_zone1/temp 
```

2. 根据输出结果，已确认可用

|节点状态|命令|
|---|---|
|CPU 使用率|`/proc/stat`|
|内存使用率|`/proc/meminfo`|
|系统负载|`/proc/loadavg`|
|运行时间|`/proc/uptime`|
|TF 卡使用率|`df -h /mnt/sdcard`|
|IP 地址|`ip addr / hostname -I`|
|网络流量|`/proc/net/dev`|
|TPU 利用率|`bm-smi`|
|温度|`/sys/class/thermal/thermal_zone*/temp`|

#### 代码实现
1. 从系统里读取原始状态
2. 把原始数据转成有意义的指标，比如：有些原始字段很多，对它进行计算
3. 把这些指标整合成统一字典
4. 再转成JSON输出
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Airbox Task2 - Node Status Collector (Phase 1)

功能：
1. 采集本机基础状态：
   - hostname
   - ip_address
   - timestamp
   - uptime
   - cpu_usage
   - memory_usage
   - load_avg
   - sdcard_usage
   - temperatures
   - tpu_util
   - eth0 rx/tx

2. 输出统一 JSON
3. 支持单次采集 / 循环采集

适用环境：
- Airbox / Linux
- Python 3.8+
"""

import json
import re
import shutil
import socket
import subprocess
import time
from typing import Dict, Optional, Tuple, List

# 全局常量
DEVICE_ID = "airbox_01"       
SDCARD_MOUNT = "/mnt/sdcard"
NET_IFACE = "eth0"
BM_SMI_CMD = ["bm-smi"]

# 读取文本文件，失败时返回 None
def read_text_file(path: str) -> Optional[str]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().strip()
    except Exception:
        return None


# 执行系统命令，失败时返回 None
def run_command(cmd: List[str], timeout: int = 3) -> Optional[str]:
    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout,
            check=False,
        )
        if result.returncode == 0:
            return result.stdout
        return None
    except Exception:
        return None

# 获取主机名
def get_hostname() -> str:
    try:
        return socket.gethostname()
    except Exception:
        return "unknown"

# 获取指定网卡的 IPv4 地址
def get_ip_address(interface: str = NET_IFACE) -> str:  
    # 优先从 `ip addr show <iface>` 解析
    output = run_command(["ip", "addr", "show", interface])
    if output:
        match = re.search(r"inet\s+(\d+\.\d+\.\d+\.\d+)/", output)
        if match:
            return match.group(1)
    # 失败时回退到 hostname -I
    fallback = run_command(["hostname", "-I"])
    if fallback:
        for token in fallback.split():
            if re.fullmatch(r"\d+\.\d+\.\d+\.\d+", token):
                if not token.startswith("127."):
                    return token

    return "0.0.0.0"

# 返回当前 Unix 时间戳
def get_timestamp() -> int:
    return int(time.time())

# 读取系统已运行秒数
def get_uptime_seconds() -> float:
    text = read_text_file("/proc/uptime")
    if not text:
        return 0.0

    try:
        return float(text.split()[0]) # 只取第一项（第二项为CPU空闲时间总和）
    except Exception:
        return 0.0

"""
读取 /proc/stat 第一行，返回：
- total_time
- idle_time
"""
def parse_proc_stat_cpu() -> Optional[Tuple[int, int]]:
    text = read_text_file("/proc/stat") # 读取CPU统计信息
    if not text:
        return None

    first_line = text.splitlines()[0] # 只取第一行
    parts = first_line.split() # 按空格拆开，拆成列表，eg:["cpu", "2226", "0", "1638", "450646", ...]

    # 基本合法性检查
    if len(parts) < 8 or parts[0] != "cpu":
        return None

    try:
        values = list(map(int, parts[1:]))
        user, nice, system, idle, iowait, irq, softirq = values[:7]
        steal = values[7] if len(values) > 7 else 0  # 有些系统会有 steal 字段，有些没有，所以做兼容

        idle_all = idle + iowait  # 空闲类事件
        total = user + nice + system + idle + iowait + irq + softirq + steal  # 总时间
        return total, idle_all  # 后面 CPU 利用率函数会拿这两个值做差分计算
    except Exception:
        return None


# 通过两次采样 /proc/stat 计算 CPU 利用率
def get_cpu_usage_percent(interval: float = 0.2) -> float:
    stat1 = parse_proc_stat_cpu()
    if stat1 is None:
        return 0.0

    time.sleep(interval)

    stat2 = parse_proc_stat_cpu()
    if stat2 is None:
        return 0.0

    total1, idle1 = stat1
    total2, idle2 = stat2

    total_delta = total2 - total1
    idle_delta = idle2 - idle1

    if total_delta <= 0:
        return 0.0

    # 总时间里，减去空闲增长的部分，剩下的就是“忙”的部分
    usage = (total_delta - idle_delta) / total_delta * 100.0
    return round(max(0.0, usage), 2) 

# 从 /proc/meminfo 计算内存使用率
def get_memory_usage_percent() -> float:
    text = read_text_file("/proc/meminfo")
    if not text:
        return 0.0

    mem_total = None
    mem_available = None

    for line in text.splitlines():  # 逐行找关键字段
        if line.startswith("MemTotal:"):
            mem_total = int(line.split()[1])
        elif line.startswith("MemAvailable:"):
            mem_available = int(line.split()[1])

    if not mem_total or mem_available is None:
        return 0.0

    used = mem_total - mem_available
    usage = used / mem_total * 100.0
    return round(max(0.0, usage), 2)


# 获取1分钟平均负载(最近1分钟内，系统排队等待CPU的平均任务量)
def get_load_avg_1min() -> float:
    text = read_text_file("/proc/loadavg")
    if not text:
        return 0.0

    try:
        return float(text.split()[0])
    except Exception:
        return 0.0

# 获取TF卡挂载路径使用率
def get_sdcard_usage_percent(path: str = SDCARD_MOUNT) -> float:
    try:
        usage = shutil.disk_usage(path)
        if usage.total <= 0:
            return 0.0
        percent = usage.used / usage.total * 100.0
        return round(percent, 2)
    except Exception:
        return 0.0


# 读取温度，单位转换
def get_temperatures() -> Dict[str, float]:
    temps: Dict[str, float] = {}

    for zone in [0, 1]:
        path = f"/sys/class/thermal/thermal_zone{zone}/temp"
        text = read_text_file(path)
        key = f"temperature_zone{zone}_c"

        if text is None:
            temps[key] = 0.0
            continue

        try:
            temps[key] = round(int(text) / 1000.0, 2)
        except Exception:
            temps[key] = 0.0

    return temps

# 从 bm-smi 输出中解析 Tpu-Util
def get_tpu_util_percent() -> float:
    output = run_command(BM_SMI_CMD, timeout=2)
    if not output:
        return 0.0

    match = re.search(r"\b(\d+)%\s*\|", output)
    if match:
        try:
            return float(match.group(1))
        except Exception:
            return 0.0

    # 更稳一点，再尝试直接找 Tpu-Util 所在行
    for line in output.splitlines():
        if "1684X-SOC" in line or "Tpu-Util" in line:
            util_match = re.search(r"(\d+)%", line)
            if util_match:
                try:
                    return float(util_match.group(1))
                except Exception:
                    return 0.0

    return 0.0

# 从 /proc/net/dev 获取指定网卡收发字节数
def get_net_dev_stats(interface: str = NET_IFACE) -> Dict[str, int]:
    text = read_text_file("/proc/net/dev")
    stats = {
        "rx_bytes": 0,
        "tx_bytes": 0,
    }

    if not text:
        return stats

    for line in text.splitlines():
        if ":" not in line:   # 真正的网卡数据行才有冒号
            continue

        iface_name, data = line.split(":", 1)
        iface_name = iface_name.strip()

        if iface_name != interface:
            continue

        parts = data.split()
        if len(parts) < 16:
            return stats

        try:
            stats["rx_bytes"] = int(parts[0]) # 第1个数是接收字节数
            stats["tx_bytes"] = int(parts[8]) # 第9个数是发送字节数
            return stats
        except Exception:
            return stats

    return stats

# 节点在线状态。第一版直接固定 online
def get_status() -> str:
    return "online"

# 核心函数：调用所有函数，统一成一个字典
def collect_status(device_id: str = DEVICE_ID) -> Dict[str, object]:
    # 这两项本身返回字典，所以先单独拿出来
    net_stats = get_net_dev_stats(NET_IFACE)
    temperatures = get_temperatures()

    status = {
        "device_id": device_id,
        "hostname": get_hostname(),
        "ip_address": get_ip_address(NET_IFACE),
        "timestamp": get_timestamp(),
        "uptime_seconds": get_uptime_seconds(),
        "cpu_usage_percent": get_cpu_usage_percent(interval=1.0),
        "memory_usage_percent": get_memory_usage_percent(),
        "load_avg_1min": get_load_avg_1min(),
        "sdcard_usage_percent": get_sdcard_usage_percent(SDCARD_MOUNT),
        "tpu_util_percent": get_tpu_util_percent(),
        "eth0_rx_bytes": net_stats["rx_bytes"],
        "eth0_tx_bytes": net_stats["tx_bytes"],
        "status": get_status(),
    }

    status.update(temperatures)
    return status

# 将状态字典转成 JSON 字符串
def status_to_json(status: Dict[str, object]) -> str:
    return json.dumps(status, ensure_ascii=False)


"""
默认每 2 秒采集一次并打印 JSON。
按 Ctrl+C 退出。
"""
def main() -> None:
    print("Airbox collector started. Press Ctrl+C to stop.")
    try:
        while True:
            status = collect_status()
            print(status_to_json(status))
            time.sleep(2)
    except KeyboardInterrupt:
        print("\nCollector stopped.")


# 如果这个文件是被直接运行的，就执行 main()
if __name__ == "__main__":
    main()
```

## 模块二：广播
### 通过UDP广播
#### 代码实现：broadcaster.py
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Airbox Task2 - UDP Broadcaster

功能：
1. 调用 collector.collect_status() 获取本机状态
2. 将状态字典编码为 JSON
3. 通过 UDP 广播发送到局域网
4. 本地打印发送日志，便于调试

运行方式：
    python3 broadcaster.py
"""

import json
import socket
import time
from typing import Tuple

from collector import collect_status


# ===== 可修改配置 =====
BROADCAST_IP = "192.168.31.255"   # 通用广播地址为255.255.255.255，后续可改成当前网段的广播地址：192.168.31.255
BROADCAST_PORT = 5005              # 广播端口（发送端和接收端一致）
SEND_INTERVAL = 2.0                # 每隔多少秒广播一次
SOCKET_TIMEOUT = 2.0               # socket 超时时间
# =====================


# 创建一个支持广播的 UDP socket
def create_udp_broadcast_socket() -> socket.socket:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.settimeout(SOCKET_TIMEOUT)
    return sock

# 将状态字典编码为 UTF-8 JSON 字节串（UDP 真正发出去的是字节流）
def encode_status_to_bytes(status: dict) -> bytes:
    json_str = json.dumps(status, ensure_ascii=False)
    return json_str.encode("utf-8")

# 发送一帧 UDP 广播数据,返回发送的字节数
def send_broadcast(sock: socket.socket, data: bytes, addr: Tuple[str, int]) -> int:
    return sock.sendto(data, addr)

# 主循环：周期性采集状态并广播
def main() -> None:
    target = (BROADCAST_IP, BROADCAST_PORT)
    sock = create_udp_broadcast_socket()

    print(f"UDP broadcaster started. target={target}, interval={SEND_INTERVAL}s")

    try:
        while True:
            # 1. 采集当前状态
            status = collect_status()

            # 2. 编码为 JSON 字节串
            payload = encode_status_to_bytes(status)

            # 3. 发送广播
            sent_bytes = send_broadcast(sock, payload, target)

            # 4. 本地打印日志
            print(f"[SEND] {sent_bytes} bytes -> {target}")
            print(payload.decode("utf-8"))

            # 5. 等待下一次发送
            time.sleep(SEND_INTERVAL)

    except KeyboardInterrupt:
        print("\nBroadcaster stopped by user.")
    finally:
        sock.close()


if __name__ == "__main__":
    main()
```

#### 测试
1. 先在 Airbox 上跑发送端
```bash
python3 broadcaster.py
```
2. 然后在同一局域网另一台 Linux 设备上，用这个命令监听：
```bash
nc -ul 5005
```


## 模块三：接收
### 思路
`receiver.py`支持两类输入：
1. 收到别的 Airbox 广播来的状态包
- 自动解析
- 自动存进本地 peer_table
- 方便后面做组网节点列表
2. 收到外部设备发来的命令包
- 支持这几个命令：ping，get_status，get_peers
### 代码
```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Airbox Task2 - UDP Receiver

功能：
1. 接收局域网内其他节点广播过来的状态 JSON
2. 维护一个本地 peer_table（记录最近收到的节点状态）
3. 接收外部控制命令，并返回响应
   支持命令：
   - ping
   - get_status
   - get_peers

运行方式：
    python3 receiver.py
"""

import json
import socket
import time
from typing import Any, Dict, Optional, Tuple

from collector import collect_status


# ===== 可修改配置 =====
LISTEN_IP = "0.0.0.0"     # 监听所有网卡，写成某个具体IP就只监听那个地址
LISTEN_PORT = 5005        # 与 broadcaster.py 保持一致，便于接收广播
BUFFER_SIZE = 4096        # 一次最多接收4096字节
SOCKET_TIMEOUT = 1.0
PEER_EXPIRE_SECONDS = 10  # 超过这个时间没更新，就认为该节点暂时失活
# =====================


#  创建 UDP 接收 socket
def create_udp_receiver_socket() -> socket.socket:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock.bind((LISTEN_IP, LISTEN_PORT))
    sock.settimeout(SOCKET_TIMEOUT)
    return sock


# 将收到的字节串解码成 JSON 对象
def decode_json_bytes(data: bytes) -> Optional[Dict[str, Any]]:   
    try:
        text = data.decode("utf-8")
        obj = json.loads(text)     
        if isinstance(obj, dict):   # 协议设计里默认收到的包应该是一个 JSON 对象，也就是字典
            return obj
        return None
    except Exception:    # 解码失败或者JSON格式错了
        return None


# 发送 JSON 响应
def send_json(sock: socket.socket, payload: Dict[str, Any], addr: Tuple[str, int]) -> None:
    try:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        sock.sendto(data, addr)
    except Exception:
        pass


    """
    判断是否是状态包（来自 broadcaster / 其他节点）
    只要有 device_id 和 timestamp，就先视为状态包
    """
def is_status_packet(obj: Dict[str, Any]) -> bool:
    return ("device_id" in obj) and ("timestamp" in obj)


# 判断是否是命令包
def is_command_packet(obj: Dict[str, Any]) -> bool:
    return "command" in obj


# 删除超时未更新的节点
def prune_expired_peers(peer_table: Dict[str, Dict[str, Any]]) -> None:
    now = time.time()
    expired = []

    for device_id, info in peer_table.items():
        last_seen = info.get("_last_seen_local", 0)
        if now - last_seen > PEER_EXPIRE_SECONDS:
            expired.append(device_id)

    for device_id in expired:
        del peer_table[device_id]


# 处理来自其他节点的状态广播
def handle_status_packet(
    obj: Dict[str, Any],
    addr: Tuple[str, int],
    peer_table: Dict[str, Dict[str, Any]],
) -> None:

    device_id = str(obj.get("device_id", "unknown"))

    # 给本地维护用的信息
    peer_info = dict(obj)
    peer_info["_sender_ip"] = addr[0]
    peer_info["_sender_port"] = addr[1]
    peer_info["_last_seen_local"] = time.time()

    peer_table[device_id] = peer_info

    print(f"[PEER] device_id={device_id} from={addr}")
    print(json.dumps(obj, ensure_ascii=False))


# 处理外部命令
def handle_command_packet(
    obj: Dict[str, Any],
    addr: Tuple[str, int],
    sock: socket.socket,
    peer_table: Dict[str, Dict[str, Any]],
) -> None:

    command = str(obj.get("command", "")).strip()

    if command == "ping":
        reply = {
            "msg_type": "pong",
            "timestamp": int(time.time()),
            "status": "online",
        }
        send_json(sock, reply, addr)
        print(f"[CMD] ping from {addr} -> pong")

    elif command == "get_status":
        reply = {
            "msg_type": "status_reply",
            "timestamp": int(time.time()),
            "status": collect_status(),
        }
        send_json(sock, reply, addr)
        print(f"[CMD] get_status from {addr} -> status_reply")

    elif command == "get_peers":
        # 返回对外可见的 peer_table，去掉内部字段
        peers_out = {}
        for device_id, info in peer_table.items():
            clean_info = dict(info)
            clean_info.pop("_last_seen_local", None)  # 去掉内部维护字段
            peers_out[device_id] = clean_info

        reply = {
            "msg_type": "peer_table_reply",
            "timestamp": int(time.time()),
            "peer_count": len(peers_out),
            "peers": peers_out,
        }
        send_json(sock, reply, addr)
        print(f"[CMD] get_peers from {addr} -> peer_table_reply")

# 不支持的命令
    else:
        reply = {
            "msg_type": "error",
            "timestamp": int(time.time()),
            "error": f"unsupported command: {command}",
            "supported_commands": ["ping", "get_status", "get_peers"],
        }
        send_json(sock, reply, addr)
        print(f"[CMD] unsupported command from {addr}: {command}")


def main() -> None:
    sock = create_udp_receiver_socket()
    peer_table: Dict[str, Dict[str, Any]] = {}

    print(f"UDP receiver started on {LISTEN_IP}:{LISTEN_PORT}")

# 开始异常保护，后面支持 Ctrl+C 退出
    try:
        while True:
            prune_expired_peers(peer_table)  # 每轮循环先清理一下超时节点

            try:
                data, addr = sock.recvfrom(BUFFER_SIZE)
            except socket.timeout:
                continue
            except Exception as e:
                print(f"[ERROR] recvfrom failed: {e}")
                continue

            # 解码数据
            obj = decode_json_bytes(data)
            if obj is None:
                print(f"[WARN] invalid JSON from {addr}")
                continue

            # 判断数据类型并分流
            if is_command_packet(obj):
                handle_command_packet(obj, addr, sock, peer_table)
            elif is_status_packet(obj):
                handle_status_packet(obj, addr, peer_table)
            else:
                print(f"[WARN] unknown packet type from {addr}")
                print(json.dumps(obj, ensure_ascii=False))

    # 按 Ctrl + C，程序会抛出 KeyboardInterrupt
    except KeyboardInterrupt:
        print("\nReceiver stopped by user.")
    finally:
        sock.close()


if __name__ == "__main__":
    main()
```


## 盒子测试
### 写入代码
1. 安装nano编辑器
```bash
sudo apt update
sudo apt install -y nano
```
装完后检查
```bash
nano --version
```

2. 创建目录
```bash
mkdir -p ~/airbox_task2
cd ~/airbox_task2
```

3. 创建函数文件
```bash
nano collector.py
```
保存退出
- ctrl + o
- 回车 enter
- ctrl + x

4. 同理创建
```bash
nano broadcaster.py
```
```bash
nano receiver.py
```

5. 做语法检查
```bash
python3 -m py_compile collector.py broadcaster.py receiver.py
```
没有输出，说明没问题

### 第一次测试
#### 采集模块
1. 用一段一次性脚本跑
```bash
python3 - <<'PY'
from collector import *

print("hostname =", get_hostname())
print("ip_address =", get_ip_address())
print("timestamp =", get_timestamp())
print("uptime_seconds =", get_uptime_seconds())
print("cpu_usage_percent =", get_cpu_usage_percent())
print("memory_usage_percent =", get_memory_usage_percent())
print("load_avg_1min =", get_load_avg_1min())
print("sdcard_usage_percent =", get_sdcard_usage_percent())
print("temperatures =", get_temperatures())
print("tpu_util_percent =", get_tpu_util_percent())
print("net_dev_stats =", get_net_dev_stats())
print("collect_status =", collect_status())
PY
```
结果为
```bash
hostname = Airbox
ip_address = 192.168.31.70
timestamp = 1776176175
uptime_seconds = 1327.45
cpu_usage_percent = 0.62
memory_usage_percent = 41.46
load_avg_1min = 0.12
sdcard_usage_percent = 0.0
temperatures = {'temperature_zone0_c': 41.0, 'temperature_zone1_c': 56.0}
tpu_util_percent = 0.0
net_dev_stats = {'rx_bytes': 1881177, 'tx_bytes': 266572}
collect_status = {'device_id': 'airbox_01', 'hostname': 'Airbox', 'ip_address': '192.168.31.70', 'timestamp': 1776176181, 'uptime_seconds': 1333.47, 'cpu_usage_percent': 0.12, 'memory_usage_percent': 41.46, 'load_avg_1min': 0.11, 'sdcard_usage_percent': 0.0, 'tpu_util_percent': 0.0, 'eth0_rx_bytes': 1881177, 'eth0_tx_bytes': 266726, 'status': 'online', 'temperature_zone0_c': 41.0, 'temperature_zone1_c': 56.0}
```

#### 广播模块
1. 运行
```bash
cd ~/airbox_task2
python3 broadcaster.py
```
2. 得到：
```bash
linaro@Airbox:~/airbox_task2$ python3 broadcaster.py
UDP broadcaster started. target=('192.168.31.255', 5005), interval=2.0s
[SEND] 394 bytes -> ('192.168.31.255', 5005)
{"device_id": "airbox_01", "hostname": "Airbox", "ip_address": "192.168.31.70", "timestamp": 1776176593, "uptime_seconds": 1745.53, "cpu_usage_percent": 0.12, "memory_usage_percent": 41.47, "load_avg_1min": 0.0, "sdcard_usage_percent": 0.0, "tpu_util_percent": 0.0, "eth0_rx_bytes": 1886577, "eth0_tx_bytes": 277105, "status": "online", "temperature_zone0_c": 41.0, "temperature_zone1_c": 57.0}
[SEND] 394 bytes -> ('192.168.31.255', 5005)
{"device_id": "airbox_01", "hostname": "Airbox", "ip_address": "192.168.31.70", "timestamp": 1776176601, "uptime_seconds": 1753.55, "cpu_usage_percent": 0.12, "memory_usage_percent": 41.47, "load_avg_1min": 0.0, "sdcard_usage_percent": 0.0, "tpu_util_percent": 0.0, "eth0_rx_bytes": 1886839, "eth0_tx_bytes": 278331, "status": "online", "temperature_zone0_c": 41.0, "temperature_zone1_c": 57.0}
[SEND] 393 bytes -> ('192.168.31.255', 5005)
{"device_id": "airbox_01", "hostname": "Airbox", "ip_address": "192.168.31.70", "timestamp": 1776176609, "uptime_seconds": 1761.56, "cpu_usage_percent": 0.0, "memory_usage_percent": 41.48, "load_avg_1min": 0.0, "sdcard_usage_percent": 0.0, "tpu_util_percent": 0.0, "eth0_rx_bytes": 1886899, "eth0_tx_bytes": 279297, "status": "online", "temperature_zone0_c": 41.0, "temperature_zone1_c": 57.0}
^C
Broadcaster stopped by user.
```
可见有持续在发送，`ctrl+c`可退出

#### 接收模块
1. 在原终端运行广播端`python3 broadcaster.py`
2. 新开一个终端，登录进入airbox，运行接收端
```bash
cd ~/airbox_task2
python3 receiver.py
```
3. 结果
<img src="./image-9.png" width="350">

#### 测试节点表的查询
1. 打开第三个终端，登录进入airbox
2. 发送一个`get_peers`命令：
```bash
cd ~/airbox_task2
python3 - <<'PY'
import json, socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.settimeout(3)

sock.sendto(json.dumps({"command": "get_peers"}).encode("utf-8"), ("127.0.0.1", 5005))
data, addr = sock.recvfrom(4096)

print("from:", addr)
print(data.decode("utf-8"))
PY
```
3. 结果为：
```bash
from: ('127.0.0.1', 5005)
{"msg_type": "peer_table_reply", "timestamp": 1776177600, "peer_count": 1, "peers": {"airbox_01": {"device_id": "airbox_01", "hostname": "Airbox", "ip_address": "192.168.31.70", "timestamp": 1776177588, "uptime_seconds": 2740.92, "cpu_usage_percent": 0.25, "memory_usage_percent": 42.67, "load_avg_1min": 0.0, "sdcard_usage_percent": 0.0, "tpu_util_percent": 0.0, "eth0_rx_bytes": 2712093, "eth0_tx_bytes": 384163, "status": "online", "temperature_zone0_c": 41.0, "temperature_zone1_c": 57.0, "_sender_ip": "192.168.31.70", "_sender_port": 42033}}}
```

#### 测试命令接收
1. 在第三个终端进入airbox
2. 执行：
```bash
cd ~/airbox_task2
python3 - <<'PY'
import json, socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.settimeout(3)

sock.sendto(json.dumps({"command": "ping"}).encode("utf-8"), ("127.0.0.1", 5005))
data, addr = sock.recvfrom(4096)

print("from:", addr)
print(data.decode("utf-8"))
PY
```
3. 返回：
```bash
from: ('127.0.0.1', 5005)
{"msg_type": "pong", "timestamp": 1776177957, "status": "online"}
```

#### 测试状态接收
1. 在第三个终端进入airbox后输入
```bash
cd ~/airbox_task2
python3 - <<'PY'
import json, socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.settimeout(5)

sock.sendto(json.dumps({"command": "get_status"}).encode("utf-8"), ("127.0.0.1", 5005))
data, addr = sock.recvfrom(4096)

print("from:", addr)
print(data.decode("utf-8"))
PY
```
2. 结果，超时，失败
```bash
Traceback (most recent call last):
  File "<stdin>", line 7, in <module>
socket.timeout: timed out
```

3. 在测试脚本中，去掉超时时间设定，先测耗时，执行
```bash
cd ~/airbox_task2
python3 - <<'PY'
import time
from collector import collect_status

t0 = time.time()
status = collect_status()
t1 = time.time()

print("elapsed =", round(t1 - t0, 3), "seconds")
PY
```
输出
```bash
elapsed = 6.012 seconds
```
确实是超过设定的5秒了

4. 将超时设定为10秒，重新跑
```bash
python3 - <<'PY'
import json, socket

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.settimeout(10)

sock.sendto(json.dumps({"command": "get_status"}).encode("utf-8"), ("127.0.0.1", 5005))
data, addr = sock.recvfrom(4096)

print("from:", addr)
print(data.decode("utf-8"))
PY
```

5. 成功了
```bash
from: ('127.0.0.1', 5005)
{"msg_type": "status_reply", "timestamp": 1776178630, "status": {"device_id": "airbox_01", "hostname": "Airbox", "ip_address": "192.168.31.70", "timestamp": 1776178630, "uptime_seconds": 3783.04, "cpu_usage_percent": 0.5, "memory_usage_percent": 42.99, "load_avg_1min": 0.14, "sdcard_usage_percent": 0.0, "tpu_util_percent": 0.0, "eth0_rx_bytes": 2792572, "eth0_tx_bytes": 651410, "status": "online", "temperature_zone0_c": 42.0, "temperature_zone1_c": 58.0}}
```




