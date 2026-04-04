## Handbook 
对优秀 software tool 的描述：
1. 要对 wet lab 设计/执行有帮助
2. 对没有编程背景的人也可用
3. 文档和安装说明清楚
4. 最好有 API/架构图/执行脚本/性能说明
5. 实验验证会显著加分

围绕真实实验痛点做出可直接被别人接手的工具

### Fudan 2023 RAP
不是单纯网页，而是设计工作流 + API + 实验验证的完整工具链

2025 Judge Handbook提到：
1. RAP 是一个帮助合成生物学设计与优化的软件套件，强调了三点：直观 web 界面、详细教程/文档、给高级用户的API；
2. 同时兼容 GenBank，并能与 SnapGene 这类工具衔接；
3. 软件输出的序列被 wet lab 实验验证过。

软件页面要讲**workflow**，而不是只讲 feature list。 judge 想看到的是：输入什么、内部怎么处理、输出什么、为什么可信、跟实验怎么连上。Fudan 2023 这点做得非常标准。

### Vilnius-Lithuania 2024

Vilnius-Lithuania 2024 的软件不是独立 app，而是围绕他们的 DIY bioreactor 做实时监控和控制。

官方 handbook 点名表扬了它的几个方面：
1. 软件来自真实实验需求；
2. 能实时读取temperature 等参数；
3. 通过文档化 API 和 Docker 部署支持扩展；
4. 并且给了安装说明、演示视频、API 说明，方便非程序员上手。它们的软件页也写了 docker compose up --build 的一键部署方式。

## 总结software主要思路
1. 实验设计工具
2. 实验执行/监控工具
3. 研究资源/数据库平台

## Fudan software
### 2022 Parthub
一个面向 iGEM Parts Registry 的增强型检索与关联分析工具
![](image-1.png)
1. 把 2004 年以来几乎整个 Registry 的 part 信息抓取下来做成自己的数据库；
2. 提供比原 Registry 更丰富的检索方式；
3. 把 part 和 part 之间的关系可视化出来，帮助设计和复用。
4. 跨平台兼容

#### 主要内容
##### 目标
wiki的software页面写了：
1. 快速高效地辅助新 part 构建与设计
2. 提供多种搜索现有 parts 的方式
3. 可视化 parts 之间的关系

##### 具体功能
1. 支持按这些字段搜：
- ID
- Name
- Sequence
- Designer
- Team
- Content
2. 支持：
- 大小写不区分
- partial match，部分词匹配
- 布尔搜索：xxx AND xxx, xxx OR xxx
- 模糊搜索：fuzzy search(处理打字错误，拼写变体等)
- 多种排序方式：Most cited, best match, recommended
3. part关系网络图
点进某个 part 后，它不是只给你一个条目，而是会展示这个 part 的关系网络图：
- 节点代表 part
- 边代表 citation / cited 或 twin parts 关系
- 节点大小和颜色还能反映引用量和发布时间。

![](image.png)

#### 核心亮点
1. 解决的是一个真实而普遍的痛点
（1）他们在wiki说，做这个软件的直接动机，是觉得 Registry 虽然有很多数据，但队伍很难快速找到和自己项目真正相关的 part。
（2）而且他们还把它嵌进了自己项目的 DBTL 流程里；在 parts 页写了他们在 DBTL pipeline 中用 PartHub 做 gene 和相似 sequence 的检索。
2. 不是只做 keyword search，而是做了关系梳理
（1）搜索parts这个需求，在Registry页面也有，但效果没那么好。
help页面说可以：
- 直接搜 part name 或文本
- 找用了这个 part 的 parts
- 找包含这段文字的 parts
- 查看 catalog、distribution 等浏览入口
- 对 composite part 做assembly help一类查询。

![](image-2.png)

（2）官方搜索更像，想知道有没有这个 part。但设计的时候，更多想知道，别人怎么用过它、它和哪些 part 常一起出现、能不能借它改造

3. 覆盖范围大
（1）PartHub 页里说它包含了 2004 年以来几乎全部 Registry 信息
（2）而且官方 blog 在回顾 2022 software时，也把 Fudan 2022 概括为包含几乎全部 Registry parts 信息的软件工具。
（3）wiki页面说，对于这个网络爬虫，由于标准生物零件注册处页面数量庞大，建议使用高性能计算机或计算团队，尤其是高性能计算平台。笔记本电脑可能不适合这种高负载工作。数据量实在是大

#### 可能的局限
从wiki披露的实现看，这套系统比较依赖 crawler 抓取、预处理和自建数据库更新；这意味着维护成本不低，而且数据新鲜度和稳定性会受到 Registry 页面结构影响。

#### 以前有吗
在Fudan 2022之前，有
##### Registry 自己的search tools
这个在上面核心亮点第二点讲了
##### 2021 Leiden
1. 做过 DiKST（Distribution Kit Search Tool），目的就是帮助未来队伍更容易搜索 distribution kit 中的 biobricks；
2. 它同样是 Python 程序 + 网站界面，也是把 Registry 数据抓出来做数据库和检索。
3. wiki写：他们在春季规划实验时，频繁使用 Distribution Kit，发现官方关于 Distribution Kit 的页面里主要只显示 part ID，虽然也能查，但过程比较费时间，不方便快速判断 kit 里有没有自己需要的构件。于是他们就做了 DiKST。
4. 解决的问题：现在手里官方发来的这盒 DNA 样品里，到底有没有适合实验的元件，更方便的查询


### 2023 RAP
一个围绕 pRAP 设计的软件套件
#### 主要内容
一个从找 part，到算酶比例，再到生成构建序列，完整工作流工具链。由3部分组成：
1. KineticHub：搜索酶、反应动力学信息，并计算酶的最优浓度比例
2. RAP Builder：根据目标表达需求，设计 pRAP 系统中的调控元件，并组装序列
3. PartHub 2：搜索 iGEM Registry parts，并提供网络关系分析与推荐。

#### why
1. Fudan 2023 说，2022 年他们已经证明了 pRAP 系统有用：通过 ribozyme-assisted polycistronic co-expression，可以改善底盘代谢、优化多酶级联表达。
2. 但他们认为 2022 方案有两个局限：
（1）缺少**定量调控**：2022 主要是通过换不同强度的 RBS 来相对地调表达量，本质上偏定性；
（2）仅关注核酶切割和核糖体结合，忽视降解问题，因为降解对许多被切割的mRNA来说是个问题。
3. 把 pRAP 从经验式、定性式设计, 升级成定量式、全调控元件的设计工具。

#### 具体怎么做
![](image-3.png)
##### 总体流程
1. 先在 PartHub 2 找合适的 part / sequence
2. 再在 KineticHub 查目标反应、酶学参数、估计酶浓度比
3. 再用 RAP Builder 设计 RBS / stem-loop 等调控元件
4. 最后输出 GenBank 格式序列 和注释文件，可直接接到 SnapGene 等工具。

wiki中说他们把这个流程具体到了DBTL各阶段：
- Design 阶段用 PartHub 2 找 part 和序列，再用 KineticHub 算最优酶浓度；
- Build 阶段用 RAP Builder 设计 RBS / stem-loop 并构建 pRAP；
- Test 和 Learn 阶段再结合实验结果迭代。

##### KineticHub
![](image-4.png)
1. 根据级联反应和酶动力学参数，帮助用户估算最优酶浓度比。
2. 用户需要先搜索目标反应和对应酶记录，再构建 cascade reaction，系统会返回基于数据的最优酶比例。
3. 数据来源：BRENDA（公开可使用），但这个原始数据是文本文件，fudan做了转化

##### RAP Builder
![](image-5.png)
1. 整个软件的核心设计器，任务是：
- 根据目标酶表达需求
- 设计 pRAP 中对应的 RBS 和 stem-loop
- 自动生成构建序列
2. 模型上：
- 热力学模型
- Monte Carlo 算法
- 对转录/翻译的 cell-scale dynamic model
- 在 stem-loop 设计里还用了 scikit-learn 的 SVR
3. 实现：
- Python 3.10
- ViennaRNA package 2 做 RNA 二级结构与自由能计算
- 借鉴开源 RBS Calculator 的 Monte Carlo 思路生成 synthetic RBS
- scikit-learn 实现 stem-loop 相关回归
- Biopython 生成 GenBank 文件与 annotation 文件
- 输出结果可直接导入 SnapGene

##### PartHub 2
![](image-6.png)
1. PartHub 2 是对 2022 PartHub 的升级版，几项升级：
- 更新到 2022 Registry 数据，包含 6 万多个 parts
- 根据用户反馈优化交互界面，删掉不必要选项
- 开始加入**推荐算法**
- 用户可以直接下载 GenBank 格式序列
2. 底层实现上，PartHub 2 延续了图数据库路线：
- 用 web crawler 抓取 2022 Registry parts
- 用 Neo4j 做图数据库
- 用 Flask 提供 RESTful APIs
- 用 Neo4j GDS 做 PageRank 和 Louvain community detection
- 推荐逻辑优先展示 PageRank 高、同时不属于同一 Louvain 社区的 parts
- 支持 Docker 安装
- 用 Biopython 导出 GenBank
- 用 Neovis.js 做网络可视化

#### 核心亮点
1. 完整工作流
（1）官方 handbook 对它的评价也是 “a software suite designed to streamline the design and optimization of synthetic biology constructs”。
（2）解决了：找 part，查反应/酶参数，算最优酶比例，设计表达调控元件，输出可用序列

2. 把wet lab问题接入software
直接面向 多酶级联代谢优化 这个问题

3. 与既有生物信息学工具兼容很好
采用 GenBank 格式，方便和 SnapGene 这类现有序列工具衔接

4. 有实验验证


#### 以前有没有类似的
1. PartHub 2 就是在 Fudan 2022的基础上改进的，对于搜索parts这一块，前面也提到registry官方也有search tools
2. KineticHub, 接入的就是BRENDA的酶学动力学数据库。
（1）USTC 2022 MEI：给定反应，预测可能的酶候选。把公开酶学数据按反应层—酶层—动力学层分开整理，做成了自己软件后台的三类数据库
3. RBS Builder: 
（1）2013 XMU 的 RBS-decoder，它就是专门做 RBS 强度评估与 SD 位点定位 的软件工具。
（2）Monte Carlo 设计思路参考了开源版 RBS Calculator


### 2024 PartHub 3
主页
![](image-9.png)
来自2024wiki的表格，对比了3个version
![](image-7.png)
所以2024的software强调了这个PartHub的burden prediction和similarity estimation

#### 主要内容
1. Burden Predictor：预测一个 composite part 带来的 burden，既支持 monocistron，也支持基于 pRAP system 的 polycistron。
2. Similarity Estimator：在 PartHub 中搜索目标 part，并寻找与其相似的 parts。

#### why
1. 他们认为过去的 PartHub 更偏知识组织和关系发现，但对合成生物学来说，序列本身才是决定功能、兼容性和宿主表现的核心信息。citation 和 search 当然有用，但研究者真正想知道的往往还包括：
（1）这个 part 的序列会不会给宿主造成很大负担？
（2）我能不能快速找到和它序列相近、功能可能相近的其它 part？
2. part 最本质的信息其实是 sequence
3. overview 里说，过去两年的 PartHub 1.0 和 2.0 在 citation relation 和 search function 上都做得不错，但仍有一个关键缺口，对 sequence information 的重视不够

#### 具体功能
![](image-8.png)
##### Burden Predictor
1. 想解决的问题：
（1）随着合成生物学构建越来越复杂，外源 part 会消耗宿主细胞的 ribosomes、tRNAs、ATP 等资源，从而增加 metabolic burden、降低生长速率，并加速“回变”或使低功能突变体在竞争中占优势
（2）此前没有方法能仅根据一个 genetic part 的 sequence 和 structure 来预测 burden。因此他们要做一个只基于 **part 输入信息**进行 **burden 预测**的工具
2. 如果用户选的 basic parts 不在他们自建的小型 validated library 里，系统支持三种方式导入：
手动输入 sequence、上传 GenBank/FASTA 文件、或者直接从 PartHub 搜索导入。
对于未知的 promoter 和 RBS，他们调用 Promoter Calculator 和 RBS Calculator 来从序列估计 promoter strength 与 RBS strength。

![](image-10.png)

##### Similarity Estimator
1. 如果两个 parts 在 sequence 上更相似，它们更可能具有相似的 biological characteristics 和 functions。
2. 进一步提供了基于 sequence 的 similar parts discovery。它直接整合到 PartHub 2.0 的基础上，使用户能够同时看到 citation relationships 和 similarity relationships
3. 公开了DBTL迭代过程，第一轮采用的similarity计算方法，结果不如预期，于是改了。这个失败经历展示到wiki页面
![](image-11.png)
4. 用户可以直接在 PartHub 页面输入关键词、序列或上传文件；进入 part detail page 后，软件会自动开始寻找 similar parts。
![](image-12.png)

#### 前人做过
1. Burden prediction
模型核心来自 Weiße 与 Nikolados 等人的框架，host burden mechanistic modeling 以前就有
![](image-13.png)

2. Similar part search
以前就有 BLAST 这类通用序列比对工具，Fudan 2024 最后也选择了 BLAST 路线