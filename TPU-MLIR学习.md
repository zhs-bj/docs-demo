## 参考资料
1. 官方TPU-MLIR使用手册：https://doc.sophgo.com/bm1688_sdk-docs/v1.8/docs_latest_release/docs/tpu-mlir/quick_start_en/01_introduction.html
2. 描述TPU-MLIR整体设计思路的论文：https://arxiv.org/abs/2210.15016
3. 知乎对于上面所说论文的讲解：https://zhuanlan.zhihu.com/p/649076502
4. github开源代码：https://github.com/sophgo/tpu-mlir
5. 算能官方gitee网站：https://gitee.com/sophgo/tpu-mlir#https://gitee.com/link?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1SW4y1H7Uu%2F%3Fshare_source%3Dcopy_web%26vd_source%3D90fd7c624ed0c40af96748bd0b8dd3e8
6. AI技术栈解析及应用github网站：https://aii-sdu.github.io/AI-Technology-Stack/Chapter9/Chapter9.1/91-tpu-mlir.html
7. B站算能官方视频：https://www.bilibili.com/video/BV1yP4y1d7gz?spm_id_from=333.788.videopod.sections
8. 硬件盒的说明文件：https://docs.radxa.com/fogwise/airbox/getting-started

## TPU-MLIR整体设计思路论文学习
### 一、摘要
```text
Abstract

    Multi-level intermediate representations (MLIR) show great promise for reducing the cost of building domain-specific compilers by providing a reusable and extensible compiler infrastructure. 
This work presents TPU-MLIR, an end-to-end compiler based on MLIR that deploys pre-trained neural network (NN) models to a custom ASIC called a Tensor Processing Unit (TPU).
    TPU-MLIR defines two new dialects to implement its functionality: 
1. a Tensor operation (TOP) dialect that encodes the deep learning graph semantics and independent of the deep learning framework and 
2. a TPU kernel dialect to provide a standard kernel computation on TPU. 
    A NN model is translated to the TOP dialect and then lowered to the TPU dialect for different TPUs according to the chip’s configuration. 
We demonstrate how to use the MLIR pass pipeline to organize and perform optimization on TPU to generate machine code.
    The paper also presents a verification procedure to ensure the correctness of each transform stage
```
翻译：
```text
    多级中间表示（MLIR）在通过提供可重用和可扩展的编译器基础设施来降低构建领域特定编译器的成本方面显示出巨大的潜力。
本研究提出了TPU-MLIR，这是一个基于MLIR的端到端编译器，用于将预训练的神经网络（NN）模型部署到名为张量处理单元（TPU）的定制ASIC上。
    TPU-MLIR定义了两个新的方言以实现其功能：
1. 张量操作（TOP）方言，用于编码深度学习图的语义，并且独立于深度学习框架；
2. TPU内核方言，用于在TPU上提供标准的内核计算。
    神经网络模型被转换为TOP方言，然后根据芯片的配置降低到TPU方言以适应不同的TPU。
我们展示了如何使用MLIR的pass流水线来组织和执行TPU上的优化以生成机器代码。
    论文还提出了一种验证程序，以确保每个转换阶段的正确性。
```

### 二、TPU-MLIR的整体架构：
![](https://picui.ogmua.cn/s1/2026/03/02/69a4f834a57db.webp)

### 三、引言部分
1. 背景：深度学习发展迅速，现有框架（Caffe、PyTorch 等）存在专属图表示，导致模型部署繁琐；GPU 非深度学习推理专用，专用 TPU 等加速器更具能效优势。
2. 现有解决方案：领域专用编译器（TVM、XLA 等）可解决框架兼容、硬件优化问题，能生成高效代码并做针对性优化。
3. 本文核心工作：提出开源 TPU 编译器 TPU-MLIR，基于 ONNX（输入格式）和 MLIR（编译基础设施），设计专属方言、明确编译流程，保障转换正确性。
4. 后续结构：介绍编译器依赖基础、详细设计及验证，最后总结与展望。


## 使用步骤(防自己忘记)
### 1.查看WSL发行版
打开powershell，输入下方代码：
```powershell
wsl -l -v
```
可以查看当前windows系统中已安装的所有WSL发行版，并显示发行版的运行状态和版本，其中星号标注的是默认启动的WSL发行版。示例输出结果如下：
```powershell

  NAME              STATE           VERSION
* Ubuntu-22.04      Stopped         2
  Ubuntu            Stopped         2
  docker-desktop    Stopped         2

```

### 2. 启动WSL发行版
（1）启动默认 WSL 发行版
```powershell
# 启动默认 WSL 发行版
wsl
# 或完整写法
wsl.exe
```
（2）启动指定 WSL 发行版
```powershell
# 启动 Ubuntu-22.04（替换为你要启动的发行版名称）
wsl -d Ubuntu-22.04
```
成功启动会显示如下：
```powershell
PS C:\Users\91587> wsl
wslWelcome to Ubuntu 22.04.5 LTS (GNU/Linux 6.6.87.2-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Wed Mar  4 08:37:18 CST 2026

  System load:  0.0                 Processes:             78
  Usage of /:   1.2% of 1006.85GB   Users logged in:       0
  Memory usage: 2%                  IPv4 address for eth0: 172.28.89.85
  Swap usage:   0%

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   https://ubuntu.com/engage/secure-kubernetes-at-the-edge

This message is shown once a day. To disable it please create the
/root/.hushlogin file.
root@LAPTOP-B2KEBDGI:/mnt/c/Users/91587#
```

### 3.安装TPU-MLIR依赖
这里就是安装tpu_mlir，具体的我不太记得了，运行过程中发现有些依赖没装运行中断，就按照下面的代码来装。运行后powershell会告诉你因为哪些依赖没有才导致出错，比如没有torch，按照下面代码来装就行。
```powershell
# 安装onnx依赖
$ pip install tpu_mlir[onnx]
# 安装torch依赖
$ pip install tpu_mlir[torch]
```

### 4.编译ONNX模型
#### 准备工作
（1）根据官方文档 https://doc.sophgo.com/bm1688_sdk-docs/v1.8/docs_latest_release/docs/tpu-mlir/quick_start_en/03_onnx.html 
下载并整理好所需的模型和图片。
文件夹目录如下：
![](https://picui.ogmua.cn/s1/2026/03/04/69a7826e8811c.webp)

（2）进入 workspace 文件夹
```powershell
# 切换到 D:\TPU-MLIR\model_yolov5s\workspace 目录
cd /mnt/d/TPU-MLIR/model_yolov5s/workspace
```
#### ONNX转MLIR：model_transform
（1）使用model_transform
```powershell
model_transform \
    --model_name yolov5s \
    --model_def ../yolov5s.onnx \
    --input_shapes [[1,3,640,640]] \
    --mean 0.0,0.0,0.0 \
    --scale 0.0039216,0.0039216,0.0039216 \
    --keep_aspect_ratio \
    --pixel_format rgb \
    --output_names 350,498,646 \
    --test_input ../image/dog.jpg \
    --test_result yolov5s_top_outputs.npz \
    --mlir yolov5s.mlir
```
（2）model_transform主要参数说明
我把官方文档里面的参数说明表格抄在这里，但我实际还没有按照这里的说明来改参数，我就直接复制了上面的模型转换代码来试

|参数名|必选？|说明|
|---|---|---|
|model_name|是|指定模型名称|
|model_def|是|指定模型定义文件, 比如 .onnx 或 .tflite 或 .prototxt 文件|
|input_shapes|否|指定输入的shape, 例如 [[1,3,640,640]] ; 二维数组, 可以支持多输入情况|
|input_types|否|指定输入的类型, 例如int32; 多输入用,隔开; 不指定情况下默认处理为float32|
|resize_dims|否|原始图片需要resize之后的尺寸; 如果不指定, 则resize成模型的输入尺寸|
|keep_aspect_ratio|否|在Resize时是否保持长宽比, 默认为false; 设置时会对不足部分补0|
|mean|否|图像每个通道的均值, 默认为0.0,0.0,0.0|
|scale|否|图片每个通道的比值, 默认为1.0,1.0,1.0|
|pixel_format|否|图片类型, 可以是rgb、bgr、gray、rgbd四种格式, 默认为bgr|
|channel_format|否|通道类型, 对于图片输入可以是nhwc或nchw, 非图片输入则为none, 默认为nchw|
|output_names|否|指定输出的名称, 如果不指定, 则用模型的输出; 指定后用该指定名称做输出|
|test_input|否|指定输入文件用于验证, 可以是图片或npy或npz; 可以不指定, 则不会进行正确性验证|
|test_result|否|指定验证后的输出文件|
|excepts|否|指定需要排除验证的网络层的名称, 多个用 , 隔开|
|mlir|是|指定输出的mlir文件名称和路径|

（3）输出结果：
我把powershell输出结果直接粘贴在下面了，方便自己以后查看和分析
```powershell
root@LAPTOP-B2KEBDGI:/mnt/d/TPU-MLIR/model_yolov5s/workspace# 
model_transform \
    --model_name yolov5s \
    --model_def ../yolov5s.onnx \
    --input_shapes [[1,3,640,640]] \
    --mean 0.0,0.0,0.0 \
    --scale 0.0039216,0.0039216,0.0039216 \
    --keep_aspect_ratio \
    --pixel_format rgb \
    --output_names 350,498,646 \
    --test_input ../image/dog.jpg \
    --test_result yolov5s_top_outputs.npz \
    --mlir yolov5s.mlir
2026/03/04 08:50:20 - INFO : TPU-MLIR v1.27-20260206
2026/03/04 08:50:21 - INFO :
         _____________________________________________________
        | preprocess:                                           |
        |   (x - mean) * scale                                  |
        '-------------------------------------------------------'
  config Preprocess args :
        resize_dims           : same to net input dims
        keep_aspect_ratio     : True
        keep_ratio_mode       : letterbox
        pad_value             : 0
        pad_type              : center
        --------------------------
        mean                  : [0.0, 0.0, 0.0]
        scale                 : [0.0039216, 0.0039216, 0.0039216]
        --------------------------
        pixel_format          : rgb
        channel_format        : nchw
        yuv_type              :

2026/03/04 08:50:25 - INFO : Input_shape assigned
2026/03/04 08:50:25 - INFO : ConstantFolding finished
2026/03/04 08:50:25 - INFO : skip_fuse_bn:False
2026/03/04 08:50:26 - INFO : Onnxsim opt finished
2026/03/04 08:50:26 - INFO : ConstantFolding finished
2026/03/04 08:50:26 - INFO : Save mlir file: yolov5s_origin.mlir
[Running]: tpuc-opt yolov5s_origin.mlir --struct-optimize --shape-infer --canonicalize --extra-optimize -o yolov5s.mlir
[Success]: tpuc-opt yolov5s_origin.mlir --struct-optimize --shape-infer --canonicalize --extra-optimize -o yolov5s.mlir
2026/03/04 08:50:27 - INFO : Mlir file generated:yolov5s.mlir
2026/03/04 08:50:27 - INFO :
  load_config Preprocess args :
        resize_dims           : [640, 640]
        keep_aspect_ratio     : True
        keep_ratio_mode       : letterbox
        pad_value             : 0
        pad_type              : center
        input_dims            : [640, 640]
        --------------------------
        mean                  : [0.0, 0.0, 0.0]
        scale                 : [0.0039216, 0.0039216, 0.0039216]
        --------------------------
        pixel_format          : rgb
        channel_format        : nchw
        yuv_type              :

[CMD]: model_runner.py --input yolov5s_in_f32.npz --model ../yolov5s.onnx --output yolov5s_ref_outputs.npz
2026/03/04 08:50:28 - INFO : Saving yolov5s_ref_outputs.npz
[CMD]: model_runner.py --input yolov5s_in_f32.npz --model yolov5s.mlir --output yolov5s_top_outputs.npz
[##################################################] 100%
2026/03/04 08:50:35 - INFO : Saving yolov5s_top_outputs.npz
[Running]: npz_tool.py compare yolov5s_top_outputs.npz yolov5s_ref_outputs.npz --tolerance 0.99,0.99 --except - -vv
compare 646_Transpose:  99%|█████████████████████████████████████████████████████████▌| 147/148 [00:05<00:00, 31.05it/s]

[122_Conv                        ]      SIMILAR [PASSED]
    (1, 32, 320, 320) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 129.113531
[124_Mul                         ]      SIMILAR [PASSED]
    (1, 32, 320, 320) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 125.423861
[125_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.284674
[127_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.710077
[128_Conv                        ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 126.175337
[130_Mul                         ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.442987
[131_Conv                        ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999998
    sqnr_similarity        = 114.355078
[133_Mul                         ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999998
    sqnr_similarity        = 113.579140
[134_Conv                        ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 116.801291
[136_Mul                         ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 116.531477
[137_Add                         ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 116.443129
[138_Conv                        ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 125.633535
[140_Mul                         ]      SIMILAR [PASSED]
    (1, 32, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 123.524981
[141_Concat                      ]      SIMILAR [PASSED]
    (1, 64, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.150282
[142_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.105822
[144_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 160, 160) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.192554
[145_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.785786
[147_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.471897
[148_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.192368
[150_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.007698
[151_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.226336
[153_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.417999
[154_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.286757
[156_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.677740
[157_Add                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.488182
[158_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.730892
[160_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.262312
[161_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.930344
[163_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.390087
[164_Add                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.741411
[165_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000001
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.037209
[167_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.093910
[168_Concat                      ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.170589
[169_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.266247
[171_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.342680
[172_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.229921
[174_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.279671
[175_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.436708
[177_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.370981
[178_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.125580
[180_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.848448
[181_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.075802
[183_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.837313
[184_Add                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.927032
[185_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.096054
[187_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.461040
[188_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.640030
[190_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.342813
[191_Add                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.576849
[192_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.190897
[194_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.881849
[195_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.384073
[197_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.126768
[198_Add                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.889412
[199_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.442225
[201_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.605528
[202_Concat                      ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.395256
[203_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.669775
[205_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.337454
[206_Conv                        ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.141891
[208_Mul                         ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.440651
[209_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.582518
[211_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.766502
[212_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.029055
[214_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.509270
[215_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.854492
[217_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.172882
[218_Add                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.126562
[219_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.937868
[221_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.004707
[222_Concat                      ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.736881
[223_Conv                        ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.006880
[225_Mul                         ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.439888
[226_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.006298
[228_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.367493
[229_MaxPool                     ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 120.933504
[230_MaxPool                     ]        CLOSE [PASSED]
    (1, 256, 20, 20) float32
    close order            = 4
[231_MaxPool                     ]        CLOSE [PASSED]
    (1, 256, 20, 20) float32
    close order            = 5
[232_Concat                      ]      SIMILAR [PASSED]
    (1, 1024, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 122.712317
[233_Conv                        ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.291080
[235_Mul                         ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.260836
[236_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.693054
[238_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.577045
[243_Resize                      ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.577045
[244_Concat                      ]      SIMILAR [PASSED]
    (1, 512, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.489164
[245_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 122.208042
[247_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.644812
[248_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.426620
[250_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 121.278458
[251_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.178471
[253_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.503593
[254_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.747766
[256_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.158300
[257_Concat                      ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.827156
[258_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.728661
[260_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.950071
[261_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.947542
[263_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.558214
[268_Resize                      ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.558214
[269_Concat                      ]      SIMILAR [PASSED]
    (1, 256, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.213661
[270_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 122.918596
[272_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.551426
[273_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 123.653898
[275_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 126.129389
[276_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.215178
[278_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.469322
[279_Conv                        ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.349150
[281_Mul                         ]      SIMILAR [PASSED]
    (1, 64, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.453602
[282_Concat                      ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 120.128088
[283_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.234339
[285_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.312082
[286_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.663059
[288_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 116.418343
[289_Concat                      ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.273554
[290_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.793646
[292_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.444363
[293_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.518543
[295_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.206955
[296_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.244658
[298_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.677994
[299_Conv                        ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.721714
[301_Mul                         ]      SIMILAR [PASSED]
    (1, 128, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.571186
[302_Concat                      ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.005629
[303_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.905216
[305_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.141794
[306_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.032583
[308_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.188753
[309_Concat                      ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.858786
[310_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.481258
[312_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.324890
[313_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.642988
[315_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 117.414331
[316_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.296522
[318_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.039780
[319_Conv                        ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.701614
[321_Mul                         ]      SIMILAR [PASSED]
    (1, 256, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 119.032993
[322_Concat                      ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.433294
[323_Conv                        ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.502750
[325_Mul                         ]      SIMILAR [PASSED]
    (1, 512, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999999
    sqnr_similarity        = 118.622618
[326_Conv                        ]      SIMILAR [PASSED]
    (1, 255, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.638033
[349_Reshape                     ]      SIMILAR [PASSED]
    (1, 3, 85, 80, 80) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.638033
[350_Transpose                   ]      SIMILAR [PASSED]
    (1, 3, 80, 80, 85) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.638023
[474_Conv                        ]      SIMILAR [PASSED]
    (1, 255, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.027891
[497_Reshape                     ]      SIMILAR [PASSED]
    (1, 3, 85, 40, 40) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.027891
[498_Transpose                   ]      SIMILAR [PASSED]
    (1, 3, 40, 40, 85) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.027891
[622_Conv                        ]      SIMILAR [PASSED]
    (1, 255, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.375401
[645_Reshape                     ]      SIMILAR [PASSED]
    (1, 3, 85, 20, 20) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.375401
[646_Transpose                   ]      SIMILAR [PASSED]
    (1, 3, 20, 20, 85) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 1.000000
    sqnr_similarity        = 124.375401
148 compared
148 passed
  0 equal, 2 close, 146 similar
0 failed
  0 not equal, 0 not similar
min_similiarity = (0.9999998211860657, 0.9999981357100098, 113.57913970947266)
Target    yolov5s_top_outputs.npz
Reference yolov5s_ref_outputs.npz
npz compare PASSED.
compare 646_Transpose: 100%|██████████████████████████████████████████████████████████| 148/148 [00:07<00:00, 20.53it/s]
[Success]: npz_tool.py compare yolov5s_top_outputs.npz yolov5s_ref_outputs.npz --tolerance 0.99,0.99 --except - -vv
```
(5) 关键信息解读：
- 模型转换成功：
输出中明确出现 
```powershell
[Success]: tpuc-opt ... -o yolov5s.mlir
Mlir file generated:yolov5s.mlir，
```
说明已经成功生成了 yolov5s.mlir 文件（这是转换的核心产物）
![](https://picui.ogmua.cn/s1/2026/03/04/69a7888a25fb8.webp)
- 推理结果验证通过：
工具自动对比原始ONNX模型推理结果和转换后MLIR模型推理结果，最终输出：

![](https://picui.ogmua.cn/s1/2026/03/04/69a7e5bc02bf9.webp)
148 compared, 148 passed（148 个节点全部验证通过）
0 failed（无失败节点）
npz compare PASSED（结果对比通过）
这证明转换后的 MLIR 模型和原始 ONNX 模型的推理效果几乎一致（余弦相似度接近 1.0），没有精度损失。
- 无报错和异常：
整个过程没有出现 Error、Failed、No such file 等错误提示，所有步骤都正常执行

(6) 然后在workspace文件夹里面也有了这些文件
![](https://picui.ogmua.cn/s1/2026/03/04/69a78796d6e52.webp)

#### MLIR转F16或INT8模型：model_deploy
##### model_deploy主要参数说明
|参数名|必选？|说明|
|---|---|---|
|mlir|是|指定mlir文件|
|quantize|是|指定默认量化类型, 支持F32/F16/BF16/INT8|
|processor|是|指定模型将要用到的平台, 支持bm1690, bm1688, bm1684x, bm1684, cv186x, cv183x, cv182x, cv181x, cv180x|
|calibration_table|否|指定校准表路径, 当存在INT8量化的时候需要校准表|
|tolerance|否|表示 MLIR 量化后的结果与 MLIR fp32推理结果相似度的误差容忍度|
|test_input|否|指定输入文件用于验证, 可以是图片或npy或npz; 可以不指定, 则不会进行正确性验证|
|test_reference|否|用于验证模型正确性的参考数据(使用npz格式)。其为各算子的计算结果|
|compare_all|否|验证正确性时是否比较所有中间结果, 默认不比较中间结果|
|excepts|否|指定需要排除验证的网络层的名称, 多个用,隔开|
|op_divide|否|cv183x/cv182x/cv181x/cv180x only, 尝试将较大的op拆分为多个小op以达到节省ion内存的目的, 适用少数特定模型|
|model|是|指定输出的model文件名称和路径|
|num_core|否|当target选择为bm1688时,用于选择并行计算的tpu核心数量,默认设置为1个tpu核心|
|skip_validation|否|跳过验证bmodel正确性环节，用于提升模型部署的效率，默认执行bmodel验证|

##### MLIR转F16
(1)若要将.mlir文件转换成f16的.bmodel文件，代码为：、
```powershell
 model_deploy \
    --mlir yolov5s.mlir \
    --quantize F16 \
    --processor bm1684x \
    --test_input yolov5s_in_f32.npz \
    --test_reference yolov5s_top_outputs.npz \
    --model yolov5s_1684x_f16.bmodel
```
(2)输出结果：
```powershell
root@LAPTOP-B2KEBDGI:/mnt/d/TPU-MLIR/model_yolov5s/workspace# 
model_deploy \
    --mlir yolov5s.mlir \
    --quantize F16 \
    --processor bm1684x \
    --test_input yolov5s_in_f32.npz \
    --test_reference yolov5s_top_outputs.npz \
    --model yolov5s_1684x_f16.bmodel
2026/03/04 16:24:20 - INFO : TPU-MLIR v1.27-20260206

[Success] Create config file 'yolov5s_bm1684x_f16.layer_group_config.json'.
Content:
{
  "shape_secs_search_strategy": 0,
  "structure_detect_opt": true,
  "sc_method_configs": [
    {
      "sc_method": "sc_method_quick_search",
      "MAX_TRY_NUM": 20
    },
    {
      "sc_method": "sc_method_search_better_v1",
      "NSECS_SEARCH_RECORD_THRESHOLD": 3,
      "CSECS_SEARCH_RECORD_THRESHOLD": 3,
      "DSECS_SEARCH_RECORD_THRESHOLD": 3,
      "HSECS_SEARCH_RECORD_THRESHOLD": 3,
      "WSECS_SEARCH_RECORD_THRESHOLD": 3
    },
    {
      "sc_method": "sc_method_search_better_v2",
      "MAX_NSECS": 32,
      "MAX_CSECS": 32,
      "MAX_DSECS": 32,
      "MAX_HSECS": 32,
      "MAX_WSECS": 32,
      "NSECS_SEARCH_RECORD_THRESHOLD": 2,
      "CSECS_SEARCH_RECORD_THRESHOLD": 2,
      "DSECS_SEARCH_RECORD_THRESHOLD": 2,
      "HSECS_SEARCH_RECORD_THRESHOLD": 2,
      "WSECS_SEARCH_RECORD_THRESHOLD": 2
    }
  ]
}
[Running]: tpuc-opt yolov5s.mlir --processor-assign="chip=bm1684x mode=F16 num_device=1 num_core=1 addr_mode=auto high_precision=False" --processor-top-optimize --convert-top-to-tpu="weightFileName=yolov5s_bm1684x_f16_tpu_weights.npz asymmetric=False doWinograd=False q_group_size=0 q_symmetric=False matmul_perchannel=False gelu_mode=normal" --canonicalize --weight-fold -o yolov5s_bm1684x_f16_tpu.mlir
The dir path of compiler_profile is "./"
bmcpu init: skip cpu_user_defined
Cannot open libusercpu.so, disable user cpu layer.
[Success]: tpuc-opt yolov5s.mlir --processor-assign="chip=bm1684x mode=F16 num_device=1 num_core=1 addr_mode=auto high_precision=False" --processor-top-optimize --convert-top-to-tpu="weightFileName=yolov5s_bm1684x_f16_tpu_weights.npz asymmetric=False doWinograd=False q_group_size=0 q_symmetric=False matmul_perchannel=False gelu_mode=normal" --canonicalize --weight-fold -o yolov5s_bm1684x_f16_tpu.mlir
[CMD]: model_runner.py --input yolov5s_in_f32.npz --model yolov5s_bm1684x_f16_tpu.mlir --output yolov5s_bm1684x_f16_tpu_outputs.npz
[##################################################] 100%
[Running]: npz_tool.py compare yolov5s_bm1684x_f16_tpu_outputs.npz yolov5s_top_outputs.npz --tolerance 0.99,0.90 --except - -vv
compare 646_Transpose:  67%|████████████████████████████████████████▋                    | 2/3 [00:00<00:00, 401.31it/s]

[350_Transpose                   ]      SIMILAR [PASSED]
    (1, 3, 80, 80, 85) float32
    cosine_similarity      = 0.999994
    euclidean_similarity   = 0.999591
    sqnr_similarity        = 58.624740
[498_Transpose                   ]      SIMILAR [PASSED]
    (1, 3, 40, 40, 85) float32
    cosine_similarity      = 0.999997
    euclidean_similarity   = 0.999599
    sqnr_similarity        = 58.107114
[646_Transpose                   ]      SIMILAR [PASSED]
    (1, 3, 20, 20, 85) float32
    cosine_similarity      = 0.999999
    euclidean_similarity   = 0.999620
    sqnr_similarity        = 58.521681
3 compared
3 passed
  0 equal, 0 close, 3 similar
0 failed
  0 not equal, 0 not similar
min_similiarity = (0.9999942183494568, 0.999590610857529, 58.1071138381958)
Target    yolov5s_bm1684x_f16_tpu_outputs.npz
Reference yolov5s_top_outputs.npz
npz compare PASSED.
compare 646_Transpose: 100%|██████████████████████████████████████████████████████████████| 3/3 [00:00<00:00, 10.95it/s]
[Success]: npz_tool.py compare yolov5s_bm1684x_f16_tpu_outputs.npz yolov5s_top_outputs.npz --tolerance 0.99,0.90 --except - -vv
[Running]: tpuc-opt yolov5s_bm1684x_f16_tpu.mlir --mlir-disable-threading --strip-io-quant="quant_input=False quant_output=False quant_input_list= quant_output_list= quant_output_bf16=False quant_input_int8=False quant_output_int8=False " --processor-tpu-optimize --dev-parallel --weight-reorder  --subnet-divide="dynamic=False" --op-reorder --topo-sort --layer-group="opt=2 group_by_cores=auto compress_mode=none debugger=0 disable_group_overlap=false lgcache=true config_filename= enable_lghash=False lghash_dir="  --core-parallel  --after-layergroup-weight-reorder --address-assign -o yolov5s_bm1684x_f16_final.mlir --debug_cmd=
The dir path of compiler_profile is "./"
bmcpu init: skip cpu_user_defined
Cannot open libusercpu.so, disable user cpu layer.
Dumping LgConfig!
Global Configs:
  shape_secs_search_strategy = 0
  structure_detect_opt = 1
Search Method Config: sc_method_quick_search
  CSECS_SEARCH_RECORD_THRESHOLD = -1
  DSECS_SEARCH_RECORD_THRESHOLD = -1
  HSECS_SEARCH_RECORD_THRESHOLD = -1
  MAX_CSECS = 32
  MAX_DSECS = 32
  MAX_HSECS = 32
  MAX_NSECS = 32
  MAX_TRY_NUM = 20
  MAX_WSECS = 32
  NSECS_SEARCH_RECORD_THRESHOLD = -1
  WSECS_SEARCH_RECORD_THRESHOLD = -1
Search Method Config: sc_method_search_better_v1
  CSECS_SEARCH_RECORD_THRESHOLD = 3
  DSECS_SEARCH_RECORD_THRESHOLD = 3
  HSECS_SEARCH_RECORD_THRESHOLD = 3
  MAX_CSECS = 32
  MAX_DSECS = 32
  MAX_HSECS = 32
  MAX_NSECS = 32
  MAX_TRY_NUM = 20
  MAX_WSECS = 32
  NSECS_SEARCH_RECORD_THRESHOLD = 3
  WSECS_SEARCH_RECORD_THRESHOLD = 3
Search Method Config: sc_method_search_better_v2
  CSECS_SEARCH_RECORD_THRESHOLD = 2
  DSECS_SEARCH_RECORD_THRESHOLD = 2
  HSECS_SEARCH_RECORD_THRESHOLD = 2
  MAX_CSECS = 32
  MAX_DSECS = 32
  MAX_HSECS = 32
  MAX_NSECS = 32
  MAX_TRY_NUM = 20
  MAX_WSECS = 32
  NSECS_SEARCH_RECORD_THRESHOLD = 2
  WSECS_SEARCH_RECORD_THRESHOLD = 2
Load debugger file "yolov5s_bm1684x_f16.layer_group_config.json" success!
output_bytes: 8568000, before group, NetStatisticPass total_bytes: 370589684
==---------------------------==
Run LayerGroupSearchPass :
    Searching the optimal layer groups
==---------------------------==
Failed to open hash file from all available paths:
  - current directory: 5271196299298802193

=======================================================
***** Dynamic Programming layer group with cluster ****
=======================================================
total num of base_group is 9
Getting clusters using dynamic programming...
Getting single group cost...
[                               #               #] 100%
Getting cost_table...
[##################################################] 100%
process base group 0, layer_num=257, cluster_num=62
Searching best group slices...
Getting single group cost...
[  ##  ###  ###  ###  ###  ###  ###  ###  ###  ##] 100%
Getting cost table...
[  ##  ###  ###  ###  ###  ###  ###  ###  ###  ##] 100%
process base group 1, layer_num=1, cluster_num=1
process base group 2, layer_num=1, cluster_num=1
process base group 3, layer_num=1, cluster_num=1
process base group 4, layer_num=1, cluster_num=1
process base group 5, layer_num=1, cluster_num=1
process base group 6, layer_num=1, cluster_num=1
process base group 7, layer_num=3, cluster_num=3
Searching best group slices...
Getting single group cost...
[                                               #] 100%
Getting cost table...
[                                               #] 100%
process base group 8, layer_num=1, cluster_num=1
================FINAL GROUP================
GroupMethod_process time:2981085
==---------------------------==
Run GroupPostTransformPass :
    Some transform after layer groups is determined
==---------------------------==
==---------------------------==
Run TimeStepAssignmentPass :
    Assign timestep task for each group.
==---------------------------==
==---------------------------==
Run LocalMemoryAllocationPass :
    Allocate local memory for all layer groups
==---------------------------==
==---------------------------==
Run TimeStepCombinePass :
    Combine time step for better parallel balance
==---------------------------==
===group idx: 1
merge timestep 33 to timestep 32
===group idx: 2
merge timestep 161 to timestep 160
==---------------------------==
Run GroupDataMoveOverlapPass :
    Overlap data move between two layer group
==---------------------------==
GmemAllocator use OpSizeOrderAssign
[Success]: tpuc-opt yolov5s_bm1684x_f16_tpu.mlir --mlir-disable-threading --strip-io-quant="quant_input=False quant_output=False quant_input_list= quant_output_list= quant_output_bf16=False quant_input_int8=False quant_output_int8=False " --processor-tpu-optimize --dev-parallel --weight-reorder  --subnet-divide="dynamic=False" --op-reorder --topo-sort --layer-group="opt=2 group_by_cores=auto compress_mode=none debugger=0 disable_group_overlap=false lgcache=true config_filename= enable_lghash=False lghash_dir="  --core-parallel  --after-layergroup-weight-reorder --address-assign -o yolov5s_bm1684x_f16_final.mlir --debug_cmd=
[Running]: tpuc-opt yolov5s_bm1684x_f16_final.mlir --codegen="model_file=yolov5s_1684x_f16.bmodel embed_debug_info=False model_version=latest bmodel_only=False gdma_check=True" -o /dev/null
The dir path of compiler_profile is "./"
bmcpu init: skip cpu_user_defined
Cannot open libusercpu.so, disable user cpu layer.
in cmodel, enable profile.
The dir path of compiler_profile is ".//"
in cmodel, enable profile.
[Success]: tpuc-opt yolov5s_bm1684x_f16_final.mlir --codegen="model_file=yolov5s_1684x_f16.bmodel embed_debug_info=False model_version=latest bmodel_only=False gdma_check=True" -o /dev/null
[Running]: mv net_0.profile yolov5s_1684x_f16.bmodel.net_0.profile
[Success]: mv net_0.profile yolov5s_1684x_f16.bmodel.net_0.profile
[CMD]: model_runner.py --input yolov5s_in_f32.npz --model yolov5s_1684x_f16.bmodel --output yolov5s_bm1684x_f16_model_outputs.npz
ln -sf /usr/local/lib/python3.10/dist-packages/tpu_mlir/lib/libcmodel_1684x.so /usr/local/lib/python3.10/dist-packages/tpu_mlir/lib/libcmodel.so
begin to cmodel init...
mult engine c_model init
bmcpu init: skip cpu_user_defined
Cannot open libusercpu.so, disable user cpu layer.
bmcpu init: skip cpu_user_defined
Cannot open libusercpu.so, disable user cpu layer.
[0] do_allreduce: 0.
BMLIB Send Quit Message
cmodel_deinit complete
[Running]: npz_tool.py compare yolov5s_bm1684x_f16_model_outputs.npz yolov5s_bm1684x_f16_tpu_outputs.npz --tolerance 0.99,0.90 --except - -vv
compare 646_Transpose_f32:  67%|██████████████████████████████████████                   | 2/3 [00:00<00:00, 669.21it/s]

[350_Transpose_f32               ]      SIMILAR [PASSED]
    (1, 3, 80, 80, 85) float32
    cosine_similarity      = 0.999997
    euclidean_similarity   = 0.999691
    sqnr_similarity        = 61.056585
[498_Transpose_f32               ]      SIMILAR [PASSED]
    (1, 3, 40, 40, 85) float32
    cosine_similarity      = 0.999999
    euclidean_similarity   = 0.999712
    sqnr_similarity        = 60.996799
[646_Transpose_f32               ]      SIMILAR [PASSED]
    (1, 3, 20, 20, 85) float32
    cosine_similarity      = 1.000000
    euclidean_similarity   = 0.999739
    sqnr_similarity        = 61.792116
3 compared
3 passed
  0 equal, 0 close, 3 similar
0 failed
  0 not equal, 0 not similar
min_similiarity = (0.9999972581863403, 0.9996911539666068, 60.99679946899414)
Target    yolov5s_bm1684x_f16_model_outputs.npz
Reference yolov5s_bm1684x_f16_tpu_outputs.npz
npz compare PASSED.
compare 646_Transpose_f32: 100%|██████████████████████████████████████████████████████████| 3/3 [00:00<00:00, 11.29it/s]
[Success]: npz_tool.py compare yolov5s_bm1684x_f16_model_outputs.npz yolov5s_bm1684x_f16_tpu_outputs.npz --tolerance 0.99,0.90 --except - -vv
```
(3)输出结果分析：
- 模型转换成功：成功生成BM1684X可用的F16精度bmodel文件
![](https://picui.ogmua.cn/s1/2026/03/04/69a7f198b1025.webp)





## 缩写整理
1. MLIR: multi-level intermediate representations
2. NN: neural network
3. TPU: tensor proessing unit
4. TOP: tensor operation
5. DL: deep learning
6. ONNX: Open Neural Network Exchange
7. SSA: Static Single Assignment 静态单赋值
8. MSE: Mean Squared Error 均方差
9. TOSA: Tensor Operator Set Architecture 张量运算符集合架构