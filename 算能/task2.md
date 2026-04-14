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
from typing import Dict, Optional, Tuple

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
def run_command(cmd: list[str], timeout: int = 3) -> Optional[str]:
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
def get_cpu_usage_percent(interval: float = 1.0) -> float:
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
    output = run_command(BM_SMI_CMD, timeout=5)
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
BROADCAST_IP = "255.255.255.255"   # 通用广播地址，第一版先用它，后续可改成当前网段的广播地址：192.168.31.255
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






