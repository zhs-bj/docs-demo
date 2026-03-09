## 选择器进阶

### 复合选择器

#### 后代选择器：空格
1. 作用: 根据 HTML标签的嵌套关系，选择父元素**后代中**满足条件的元素
2. 选择器语法: **选择器1 选择器2{css}**
3. 结果: 在选择器1所找到标签的后代(儿子、孙子、重孙子..)中，找到满足选择器2的标签，设置样式
4. 注意点:
- 后代包括:儿子、孙子、重孙子..
- 后代选择器中，选择器与选择器之前通过**空格**隔开
5. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后代选择器</title>
    <style>
        /* 父选择器 后代选择器{} */
        div p {
            color: red;
        }
    </style>
</head>
<body>
    <p>这是一个p标签</p>
    <div>
        <p>这是div的儿子</p>
    </div>
</body>
</html>
```

#### 子代选择器: >
1. 作用: 根据 HTML 标签的嵌套关系，选择父元素 **子代中** 满足条件的元素
2. 选择器语法: **选择器1 > 选择器2{css}**
3. 结果: 在选择器1所找到标签的子代(儿子)中，找到满足选择器2的标签，设置样式
4. 注意点:
- 子代只包括:儿子
- 子代选择器中，选择器与选择器之前通过 > 隔开
5. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>子代选择器</title>
    <style>
        /* 只选儿子：父级>儿子 */
        div > a {
                   color: red;
                }
    </style>
</head>
<body>
    <div>
        父级
        <br>
        <a href="#">这是div里面的a</a>
        <p>
            <a href="#">这是div里面的p里面的a</a>
        </p>
    </div>
</body>
</html>
```

### 井集选择器: ,
1. 作用: 同时选择多组标签，设置相同的样式
2. 选择器语法: **选择器1 ，选择器2{css }**
3. 结果: 找到 选择器1 和 选择器2 选中的标签，设置样式
4. 注意点:
- 并集选择器中的每组选择器之间通过 ，分隔
- 并集选择器中的每组选择器可以是基础选择器或者复合选择器
- 并集选择器中的每组选择器通常一行写一个，提高代码的可读性
5. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>并集选择器</title>
    <style>
        /* 选择器1，选择器2 {} */
        p, 
        div, 
        span, 
        h1 {
            color: red;
        }
    </style>
</head>
<body>
    <p>ppp</p>
    <div>div</div>
    <span>span</span>
    <h1>h1</h1>
    <h2>h2</h2>
</body>
</html>
```

### 交集选择器: 紧挨着
1. 作用: 选中页面中**同时满足**多个选择器的标签
2. 选择器语法: **选择器1选择器2{css }**
3. 结果: 找到页面中**既**能被选择器1选中，**又**能被选择器2选中的标签，设置样式
4. 注意点:
- 交集选择器中的选择器之间是紧挨着的，没有东西分隔
- 交集选择器中如果有标签选择器，标签选择器必须写在最前面
5. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>交集选择器</title>
    <style>
        p.box {
            color: red;
        }

    </style>
</head>
<body>
    <!-- 找到第一个p,带box类的，设置文字颜色是红色 -->
    <p class="box">这是p标签:box</p>
    <p>ppppp</p>
    <div class="box">这是div标签:box</div>
</body>
</html>
```

### hover伪类选择器
1. 作用: 选中鼠标**悬停**在元素上的**状态**，设置样式
2. 选择器语法: 选择器:**hover**{css}
3. 注意点:
- 伪类选择器选中的元素的某种状态
4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>伪类选择器</title>
    <style>
        /* 鼠标悬停的时候文字是红色，背景是黄色 */
        a:hover {
            color: red;
            background-color: yellow;
        }
        div:hover {
            color: green;
        }
    </style>
</head>
<body>
    <a href="#">一个超链接</a>
    <!-- 任何标签都可以添加伪类，任何一个标签都可以鼠标悬停 -->
    <div>div</div>
</body>
</html>
```


## Emmet语法

1. 作用:通过简写语法，快速生成代码
2. 语法: 类似于刚刚学习的选择器的写法

|记忆|示例|效果|
|---|---|---|
|标签名|div|\<div>\</div>|
|类选择器|.red|\<div class="red'>\</div>|
|id选择器|#one|\<div id='one">\</div>|
|交集选择器|p.red#one|\<p class="red" id="one">\</p>|
|子代选择器|ul>li|\<ul>\<li>\</li>\</ul>|
|内部文本|ul>li{我是li的内容}|\<ul>\<li>我是li的内容\</li>\</ul>|
|创建多个|ul>li*3|\<ul>\<li>\</li>\<li>\</li>\<li>\</li>\</ul>|


## 背景相关属性

### 背景颜色
1. 属性名: **background-color** (bgc)
2. 属性值:
- 颜色取值:关键字、rgb表示法、rgba表示法、十六进制.…
3. 注意点:
- 背景颜色默认值是透明:rgba(0,0,0,0)、transparent
- 背景颜色不会影响盒子大小，并且还能看清盒子的大小和位置，一般在布局中会习惯先给盒子设置背景颜色
4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>背景-背景色</title>
    <style>
        div {
            background-color: pink;
            width: 400px;
            height: 400px;
            background-color: #ccc;
            /* rgba:红绿蓝，透明度 */
            background-color: rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>
    <div>div</div>
</body>
</html>
```

### 背景图片
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14948c7f75.webp" width="200">

1. 属性名: **background-image** (bgi)
2. 属性值: background-image:url('图片的路径');
3. 注意点:
- 背景图片中url中可以省略引号
- 背景图片默认是在水平和垂直方向平铺的
- 背景图片仅仅是指给盒子起到装饰效果，类似于背景颜色，是不能撑开盒子的
4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>背景-背景图片</title>
    <style>
        div {
            width: 400px;
            height: 400px;
            background-image: url(../橘猫.svg);
        }
    </style>

</head>
<body>
    <div></div>
</body>
</html>
```

### 背景平铺
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14a5e589b9.webp" width="200">

1. 属性名: **background-repeat**(bgr)
2. 属性值:

|取值|效果|
|---|---|
|repeat|(默认值)水平和垂直方向都平铺|
|no-repeat|(常用)不平铺|
|repeat-x|沿着水平方向(x轴)平铺|
|repeat-y|沿着垂直方向(y轴)平铺|

3. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>背景-背景平铺</title>
    <style>
        div {
            width: 400px;
            height: 400px;
            background-color: pink;
            background-image: url(../橘猫.svg);
            background-repeat: no-repeat;
            background-repeat: repeat-x;
        }
        
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

### 背景位置
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14bd0e86cf.webp" width="200">

1. 属性名：**background-position**(bgp)
2. 属性值: background-position: 水平方向位置 垂直方向位置;
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14c51907cc.webp" width="400">

3. 注意点:
- 方位名词取值和坐标取值可以混使用，第一个取值表示水平，第二个取值表示垂直

4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>背景-背景位置</title>
    <style>
        div {
            width: 400px;
            height: 400px;
            background-color: pink;
            background-image: url(../橘猫.svg);
            background-repeat: no-repeat;

            /* background-position:水平位置 垂直位置 */
            /* 背景图只显示在盒子里面 */
            background-position: center;
            background-position: 0 0;
            background-position: right 0;
            background-position: right bottom;
            background-position: -50px -100px;
        }
        
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```


### 背景相关属性的连写形式
1. 属性名: **background** (bg)
2. 属性值: 单个属性值的合写，取值之间以空格隔开
3. 书写顺序: 推荐:background:colorimage repeat position (打乱也没问题)
4. 省略问题:
- 可以按照需求省略
- 特殊情况:在pc端，如果盒子大小和背景图片大小一样，此时可以直接写 background:url()
5. 注意点：
- 如果需要设置单独的样式和连写
- ① 要么把单独的样式写在连写的**下面**
- ② 要么把单独的样式写在连写的**里面**
6. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>背景-背景相关属性连写</title>
    <style>
        div {
            width: 400px;
            height: 400px;
            /* background-color: pink;
            background-image: url(../橘猫.svg); */
            background: pink url(../橘猫.svg) no-repeat center bottom;
            /* 注：英文单词类的位置写法可以颠倒顺序（垂直、水平），若为数值写法，则不可颠倒顺序 */
        }
    </style>
</head>
<body>
    <div></div>
</body>
</html>
```

### (拓展)img标签和背景图片的区别
1. 需求:需要在网页中展示一张图片的效果
2. 方法一:直接写上img标签即可
img标签是一个标签，不设置宽高默认会以原尺寸显示
3. 方法二:div标签+背景图片
**需要设置div的宽高**，因为背景图片只是装饰的CSS样式，不能撑开div标签


## 元素显示模式

### 块级元素
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14e7a3ae8d.webp" width="200">

1. 显示特点:
- 独占一行(一行只能显示一个)
- 宽度默认是父元素的宽度，高度默认由内容撑开
- 可以设置宽高
2. 代表标签:
**div、p、h系列**、ul、li、dl、dt、dd、form、header、nav、footer..

### 行内元素
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14f1e531ef.webp" width="200">

1. 显示特点:
- 一行可以显示多个
- 宽度和高度默认由内容撑开
- 不可以设置宽高
2. 代表标签:
**a、span**、b、u、i、s、strong、ins、em、del...

### 行内块元素 
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a14fa1eef7d.webp" width="200">
1. 显示特点:
- 一行可以显示多个
- 可以设置宽高
2. 代表标签:
- **input、textarea**、 button、select.....
- 特殊情况:img标签有行内块元素特点，但是Chrome调试工具中显示结果是inline


### 元素显示模式转换
1. 目的:改变元素默认的显示特点，让元素符合布局要求
2. 语法:

|属性|效果|使用频率|
|display:block|转换成块级元素|较多|
|display:inline-block|转换成行内块元素|较多|
|display:inline|转换成行内元素|较少|

3. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>显示模式转换</title>
    <style>
        div {
            display: inline-block;

            width: 100px;
            height: 100px;
            background-color: red;
        }
        span {
            display: block;

            width: 100px;
            height: 100px;
            background-color: green;
        }
    </style>
</head>
<body>
    <div>111</div>
    <div>222</div>

    <span>span</span>
    <span>span</span>
</body>
</html>
```

### 拓展：HTML嵌套规范注意点
1. 块级元素一般作为大容器，可以嵌套:文本、块级元素、行内元素、行内块元素等等等...
但是:p标签中不要嵌套div、p、h等块级元素。假设这样写了，浏览器会自动帮你改，会把父子关系改成并列的兄弟关系
2. a标签内部可以嵌套**任意元素**
但是:a标签不能嵌套a标签，浏览器都不知道到底跳转到哪个链接
![](https://picui.ogmua.cn/s1/2026/03/06/69aa3afaa5c04.webp)


## CSS特性
### 继承性
#### 继承性的介绍
1. 特性: 子元素有默认继承父元素样式的特点(子承父业)
2. 可以继承的常见属性 (**文字控制属性**都可以继承，不是文字控制的属性不可以继承)
- color
- font-style、font-weight、font-size、font-family
- text-indent、text-align
- line-height
3. 注意点: 可以通过调试工具（谷歌浏览器点检查）判断样式是否可以继承
![](https://picui.ogmua.cn/s1/2026/03/06/69aa3ce6a24b6.webp)

#### 拓展：继承失效的特殊情况
1. 超链接的颜色属性color会继承失效（超链接自己有颜色蓝色，不会再继承父级的颜色属性）
2. <h1-h6>标题标签有自己默认的字号，不会继承父级的字号属性font-size

### 层叠性
#### 层叠性的介绍
1. 特性:
- 给同一个标签设置**不同**的样式 → 此时样式会层叠叠加 → 会共同作用在标签上
- 给同一个标签设置**相同**的样式 → 此时样式会层叠覆盖 → 最终写在最后的样式会生效
2. 注意点:
当样式冲突时，只有当选择器**优先级相同**时才能通过层叠性判断结果

### 优先级
#### 优先级的介绍
1. 特性:不同选择器具有不同的优先级，优先级高的选择器样式会覆盖优先级低选择器样式。当一个标签使用了多个选择器，样式冲突的时候，到底谁生效？
2. 优先级公式:
继承 < 通配符选择器 < 标签选择器 < 类选择器 < id选择器 < 行内样式 < !important
ps:谁更精准，谁的优先级更高；谁的范围更广，谁的优先级更低
3. 注意点:
- !important写在属性值的后面，分号的前面
- !important不能提升继承的优先级，只要是继承优先级最低
- 实际开发中不建议使用!important。
4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* 从上往下优先级升高 */
        /* body为继承 */
        /* 不能给继承加!important，自己有的就没法继承父级的了 */
        body {
            color: red;
        }
        /* div为标签 */
        div {
            color: green !important; /* !important写在分号前面（分号就表示这个样式结束了），优先级最高，覆盖所有样式 */
        }
        /* .body为类 */
        .body {
            color: blue;
        }
        /* #body为ID */
        #body {
            color: yellow;
        }

    </style>
</head>

<body>
    <!-- 在这里写style是行内样式 -->
    <div class="body" id="body" style="color: pink;">这是一个div标签</div>
</body>
</html>
```

#### 权重叠加计算
1. 场景:如果是复合选择器，此时需要通过权重叠加计算方法，判断最终哪个选择器优先级最高会生效
2. 权重叠加计算公式:(每一级之间不存在进位)
![](https://picui.ogmua.cn/s1/2026/03/07/69ac40a94aa3e.webp)
3. 比较规则:
- 先比较第一级数字，如果比较出来了，之后的统统不看
- 如果第一级数字相同，此时再去比较第二级数字，如果比较出来了，之后的统统不看
- 如果最终所有数字都相同，表示优先级相同，则比较层叠性(谁写在下面，谁说了算!)
4. 注意点:!important如果不是继承，则权重最高，天下第一!
5. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>

        /* (行内，id，类，标签) */

        /* (0,1,0,1)  权重最高 */
        div #one {
            color: red;
        }

        /* (0,0,2,0) */
        .father .son {
            color: green;
        }

        /* 选的是继承，优先级最低 */
        .father {
            color: blue;
        }

        /* (0,0,0,2) */
        div p {
            color: yellow;
        }
    </style>
</head>
<body>
    <div class="father">
        <p class="son" id="one">我是一个p标签</p>
    </div>
</body>
</html>
```

## 谷歌排错
![](https://picui.ogmua.cn/s1/2026/03/08/69ad0f8caffe5.webp)

如果检查发现，字对应的style里面没有，要么是没写style，要么是**选择器写错**了
![](https://picui.ogmua.cn/s1/2026/03/08/69ad102226c55.webp)

(1)错法1：选择器名词写错
```text
<style>
    /* father写错单词 */
    .fahter .son .sun {
        color: blue;
    }
</style>
</head>
<body>
    <div class="father">
        <div class="son">
            <div class="sun">孙子</div>
        </div>
    </div>
</body>
```
(2)错法2：选择器写法出错
```text
<style>
    /* 多写了一个标签选择器div */
    .fahter .son .sun div{
        color: blue;
    }
</style>
</head>
<body>
    <div class="father">
        <div class="son">
            <div class="sun">孙子</div>
        </div>
    </div>
</body>
```
(3)错法3：css上一行代码出错，会导致下一行也不生效
```text
<style>
    /* 写多了一个大括号 */
    }
    .fahter .son .sun {
        color: blue;
    }
</style>
</head>
<body>
    <div class="father">
        <div class="son">
            <div class="sun">孙子</div>
        </div>
    </div>
</body>
```
(4)错法4：语法错误
黄色叹号表示有语法错误
![](https://picui.ogmua.cn/s1/2026/03/08/69ad136ea903f.webp)
```text
<style>
    .fahter .son .sun {
        /* 下面一句少了分号 */
        /* 还要注意所有标点符号都要是英文的，否则也会报错 */
        color: blue
    }
</style>
</head>
<body>
    <div class="father">
        <div class="son">
            <div class="sun">孙子</div>
        </div>
    </div>
</body>
```














