## 综合案例1-新闻

#### 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>综合案例1-新闻</title>
    <style>
        div {
            width: 800px;
            height: 600px;
            /* background-color: pink; */
            margin: 0 auto;
        }

        /* h1 {
            text-align: center;
        } */

        .center {
            text-align: center;
        }

        .color1 {
            color: #808080;
        }

        .color2 {
            color: #87ceeb;
            font-weight: 700;
        }

        a {
            text-decoration: none;
        }

        .suojin {
            text-indent: 2em;
        }
    </style>
</head>
<body>
    <div>
        <h1 class="center">《自然》评选改变科学的10个计算机代码项目</h1>
        <p class="center">
            <span class="color1">2077年01月28月14:58 </span>
            <span class="color2">新浪科技</span> 
            <a href="#">收藏本文</a>
        </p>
        <hr>
        <p class="suojin">2019年，事件视界望远镜团队让世界首次看到了黑洞的样子。不过，研究人员公布的这张发光环形物体的图像并不是传统的图片，而是经过计算获得的。利用位于美国、墨西哥、智利、西班牙和南极地区的射电望远镜所得到的数据，研究人员进行了数学转换，最终合成了这张标志性的图片。研究团队还发布了实现这一壮举所用的编程代码，并撰文记录这一发现，其他研究者也可以在此基础上进一步加以分析。</p>
        <p class="suojin">这种模式正变得越来越普遍。从天文学到动物学，在现代每一项重大科学发现的背后，都有计算机的参与。美国斯坦福大学的计算生物学家迈克尔·菜维特因"为复杂化学系统创造了多尺度模型”与另两位研究者分享了2013年诺贝尔化学奖，他指出，今天的笔记本电脑内存和时钟速度是他在1967年开始获奖工作时实验室制造的计算机的1万倍。“我们今天确实拥有相当可观的计算能力，”他说，“问题在于，我们仍然需要思考。"</p>
        <p class="suojin">如果没有能够解决研究问题的软件，以及知道如何编写并使用软件的研究人员，一台计算机无论再强大，也是毫无用处的。如今的科学研究从根本上已经与计算机软件联系在一起，后者已经渗透到研究工作的各个方面。近日，《自然》 (Nature)杂志将目光投向了幕后，着眼于过去几十年来改变科学研究的关键计算机代码，并列出了其中10个关键的计算机项目。</p>
        <p class="suojin">最初的现代计算机并不容易操作。当时的编程实际上是手工将电线连接成一排排电路来实现的。后来出现了机器语言和汇编语言，允许用户用代码为计算机编程，但这两种语言都需要对计算机的架构有深入的了解，使得许多科学家难以掌握。20世纪50年代，随着符号语言的发展，特别是由约翰·巴克斯及其团队在加州圣何塞的IBM开发的“公式翻译”语言Fortran，这种情况发生了变化。利用Fortran，用户可以用人类可读的指令来编程，例如x=3 +5。然后由编译器将这些指令转换成快速、高效的机器代码。</p>
    </div>
</body>
</html>
```

#### 渲染结果：
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a13f964b905.webp" width="700">


## 综合案例2-产品

#### 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>综合案例2-产品</title>
    <style>
        body {
            background-color: #f5f5f5;
        }

        .goods {
            width: 234px;
            height: 300px;
            background-color: #fff;
            /* 标签div居中 */
            margin: 0 auto;
            /* 内容居中 */
            text-align: center;
        }

        img {
            width:160px;
            /* text-align: center; */
        }

        .title{
            font-size: 14px;
            line-height: 25px;
        }

        .info {
            font-size: 12px;
            color: #ccc;
            line-height: 30px;
        }

        .money {
            font-size: 14px;
            color: #ffa500;
        }
    </style>
</head>
<body>
    <!-- div 用来网页布局，一个页面可能用无数次，原则：如果使用div，尽量使用类名控制样式 -->
    <div class="goods">
        <img src="../橘猫.svg">
        <div class="title">九号平衡车</div>
        <div class="info">成年人的玩具</div>
        <div class="money">1999元</div>
    </div>
</body>
</html>
```

#### 渲染结果：
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a13fe16695c.webp" width="700">


## 综合案例3-导航1
#### 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    a {
        text-decoration: none;
        /* 不转换成块的话，宽高会不生效 */
        /* 行内块：一行可以放多个 */
        display: inline-block;
        width: 100px;
        height: 50px;
        background-color: red;
        color: white;
        text-align: center;
        line-height: 50px;
        
    }

    a:hover {
        background-color: orange;
    }
</style>
<body>
    <!-- a{导航$}*5 -->
     <!-- 选多行加内容：alt + shift + 鼠标左键单击 -->
    <a href="#">导航1</a>
    <a href="#">导航2</a>
    <a href="#">导航3</a>
    <a href="#">导航4</a>
    <a href="#">导航5</a>
</body>
</html>
```

#### 渲染结果：
![](https://picui.ogmua.cn/s1/2026/03/06/69aa413042f64.webp)
![](https://picui.ogmua.cn/s1/2026/03/06/69aa41621f9a5.webp)


## 综合案例4-导航2
#### 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        a {
            text-decoration: none;
            display: inline-block;
            text-align: center;
            width: 200px;
            height: 100px;
            line-height: 70px;
            color: white;
            background-size: 100% 100%;
        }
        /* 每个a的背景图都不同，需要单独找 */
        .one {           
            background-image: url(../docs-demo/public/导航栏1.png);
        }
        .two {
            background-image: url(../docs-demo/public/导航栏2.png);
        }
        .three {
            /* line-height: 80px; */
            background-image: url(../docs-demo/public/导航栏3.png);
        }
        .four {
            background-image: url(../docs-demo/public/导航栏4.png);
        }
        .five {
            background-image: url(../docs-demo/public/导航栏5.png);
        }
        .one:hover {
            background-image: url(../docs-demo/public/导航栏2.png);
        }

    </style>
</head>
<body>
    <a href="#" class="one">五彩导航</a>
    <a href="#" class="two">五彩导航</a>
    <a href="#" class="three">五彩导航</a>
    <a href="#" class="four">五彩导航</a>
    <a href="#" class="five">五彩导航</a>
</body>
</html>
```

#### 结果:
![](https://picui.ogmua.cn/s1/2026/03/07/69ac1c9234142.webp)