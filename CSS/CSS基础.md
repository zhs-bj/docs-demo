## 基础认知

### CSS的介绍
1. CSS：层叠样式表(Cascading style sheets)
2. CSS的作用：给页面中的HTML标签设置样式

### CSS 语法规则
1. 写在哪里
css写在style标签中，style标签一般写在head标签里面，title标签下面
2. 怎么写?
![](https://picui.ogmua.cn/s1/2026/02/27/69a12197d7483.webp)

### CSS引入方式
1. **内嵌式**:CSS写在style标签中
- 提示:style标签虽然可以写在页面任意位置，但是通常约定写在head标签中
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        p {
            color: red;
        }
    </style>
</head>
<body>
    <p>这是一个p标签</p>
</body>
</html>
```
2. **外联式**:CSS写在一个单独的.css文件中
- 提示:需要通过link标签在网页中引入
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="my.css">
</head>
<body>
    <p>这是一个p标签</p>
</body>
</html>
```
```css
p{
    color: red;
}
```
3. **行内式**:CSS写在标签的style属性中
- 提示:之后会配合js使用
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="color: green; font-size: 30px;">这是div标签</div>
</body>
</html>
```

### CSS常见三种引入方式的特点区别

|引入方式|书写位置|作用范围|使用场景|
|---|---|---|---|
|内嵌式|CSS 写在style标签中|当前页面|小案例|
|外联式|CSS 写在单独的css文件!中，通过link标签引入|多个页面|项目中|
|行内式|CSS 写在标签的style属性中|当前标签|配合js使用|


## 基础选择器

### 标签选择器
1. 结构:**标签名**{css属性名:属性值;}
2. 作用:通过标签名，找到页面中所有这类标签，设置样式
3. 注意点:
- 标签选择器选择的是一类标签，而不是单独某一个
- 标签选择器无论嵌套关系有多深，都能找到对应的标签
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a12197d7483.webp" width="300">


### 类选择器
1. 结构:**.类名**{css属性名:属性值;}
2. 作用:通过类名，找到页面中所有带有这个类名的标签，设置样式
3. 注意点:
- 所有标签上都有class属性，class属性的属性值称为**类名(类似于名字)**
- 类名可以由数字、字母、下划线、中划线组成，但不能以数字或者中划线开头
- 一个标签可以同时有多个类名，类名之间以空格隔开
- 类名可以重复，一个类选择器可以同时选中多个标签
4. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .red {
            color: red;
        }
        .size {
            font-size: 66px;
        }
    </style>
</head>
<body>
    <!-- 类：定义和使用 -->
     <p>111</p>
     <!-- 一个标签可以使用多个类名，用空格隔开即可 -->
     <p class="red size">222</p>
     <div class="red">这个文字也要变红</div>
</body>
</html>
```

### id选择器
1. 结构: **#id属性值**{css属性名:属性值;}
2. 作用:通过id属性值，找到页面中带有这个id属性值的标签，设置样式
3. 注意点:
- 所有标签上都有id属性
- id属性值类似于身份证号码，在一个页面中是唯一的，不可重复的
- 一个标签上只能有一个id属性值
- 一个id选择器只能选中一个标签
4. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        /* 定义id选择器 */
        #blue {
            color: blue;
        }  
    </style>
</head>
<body>
    <div id="blue">这个div文字是蓝色的</div>
</body>
</html>
```

### 通配符选择器
1. 结构：*{css属性名:属性值;}
2. 作用:找到页面中**所有**的标签，设置样式
3. 注意点:
- 开发中使用极少，只会在极特殊情况下才会用到
- 在小页面中可能会用于去除标签默认的margin和padding
![](https://picui.ogmua.cn/s1/2026/02/27/69a12e27b800f.webp)
4. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            color: red;
        }
    </style>
</head>
<body>
    <div>div</div>
    <p>ppp</p>
    <h1>h1</h1>
    <span>span</span>
</body>
</html>
```


## 字体样式

### 字体大小
1. 属性名：font-size
2. 取值: 数字 + px
3. 注意点:
- 谷歌浏览器默认文字大小是16px
- 单位需要设置，否则无效
4. 代码示例：
```html
<style>
    p {
        font-size: 30px;
    }
</style>
```

### 字体粗细
1. 属性名:font-weight
2. 取值:
- 关键字:
<table>
  <tr>
    <td>正常</td>
    <td>normal</td>
  </tr>
  <tr>
    <td>加粗</td>
    <td>bold</td>
  </tr>
</table>

- 纯数字:100~900的整百数:
<table>
  <tr>
    <td>正常</td>
    <td>400</td>
  </tr>
  <tr>
    <td>加粗</td>
    <td>700</td>
  </tr>
</table>

3. 注意点:
- 不是所有字体都提供了九种粗细，因此部分取值页面中无变化
- 实际开发中以:正常、加粗两种取值使用最多。
4. 代码示例：
```html
<style>
    div {
         font-weight: 700;
        }
    p {
        font-weight: bold;
    }
</style>
```

### 字体样式(是否倾斜)
1. 属性名:font-style
2. 取值:
- 正常(默认值):normal
- 倾斜:italic
3. 代码示例：
```html
<style>
    span {
        font-style: italic;
         }
    em {
        font-style: normal;
       }
</style>
```

### 字体系列font-family
1. 属性名:font-family
2. 常见取值:**具体字体1,具体字体2,具体字体3,具体字体4..字体系列**
- 具体字体:"Microsoft YaHei"、微软雅黑、黑体、宋体、楷体等..
- 字体系列:sans-serif、serif、monospace等..
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a1320320b83.webp" width="100">
3. 渲染规则:
- 从左往右按照顺序查找，如果电脑中未安装该字体，则显示下一个字体
- 如果都不支持，此时会根据操作系统，显示最后字体系列的默认字体

|系统|默认字体|
|---|---|
|Windows|微软雅黑|
|macOS|苹方|

4. 注意点:
- 如果字体名称中存在多个单词，推荐使用引号包裹
- 最后一项字体系列不需要引号包裹
- 网页开发时，尽量使用系统常见自带字体，保证不同用户浏览网页都可以正确显示

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a133cbc86e2.webp">

5. 代码示例：
```html
<style>
    div { 
        /* 看用户电脑是否有安装对应字体，没有就下一个 */
        font-family: 微软雅黑,黑体,sans-serif;
    }
</style>
```

### 常见字体系列
一、无衬线字体(sans-serif)
1. 特点:文字笔画粗细均匀，并且首尾无装饰
2. 场景:网页中大多采用无衬线字体
3. 常见该系列字体:黑体、Arial

二、衬线字体(serif)
1. 特点:文字笔画粗细不均，并且首尾有笔锋装饰
2. 场景:报刊书籍中应用广泛
3. 常见该系列字体:宋体、Times New Roman

三、等宽字体(monospace)
1. 特点:每个字母或文字的宽度相等
2. 场景:一般用于程序代码编写，有利于代码的阅读和编写
3. 常见该系列字体:Consolas、fira code

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a132c945e48.webp" width="200">

### 样式的层叠问题
1. 如果给同一个标签设置了相同的属性，此时样式会层叠(覆盖)，写在最下面的会生效
2. TIP :
- CSS(Cascading style sheets) **层叠样式表**
- 所谓的层叠即叠加的意思，表示样式可以一层一层的层叠覆盖

### 字体font相关属性的连写
1. 属性名:font(复合属性)
2. 取值:
- font : style weight size family;
3. 省略要求:
- 只能省略前两个，如果省略了相当于设置了默认值
4. 注意点:如果需要同时设置**单独和连写**形式
- 要么把单独的样式写在连写的**下面**
- 要么把单独的样式写在连写的**里面**
5. 代码示例：
```html
<style>
    /* font简写方式 : 复合属性*/
    p {
        font: italic 700 66px 宋体;
        /* 后面的会覆盖前面的 */
        font-style: normal;
    }
</style>
```

## 文本样式

### 文本缩进
1. 属性名: text-indent
2. 取值:
- 数字+px
- 数字+em (推荐: 1em=当前标签的font-size的大小)
3. 代码示例：
```html
<style>
    p{
        text-indent:32px;
        /* 或者 */
        text-indent:2em;
    }
</style>
```

### 文本水平对齐方式
1. 属性名: text-align
2. 取值:

|属性值|效果|
|---|---|
|left|左对齐|
|center|居中对齐|
|right|右对齐|

3. 注意点:
- 如果需要让文本水平居中，text-align属性给**文本所在标签(文本的父元素)**设置

4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        h1 {
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- 默认左对齐 -->
    <h1>新闻标题</h1>
</body>
</html>
```

### 水平居中方法总结text-align:center
1. text-align:center 能让哪些元素水平居中?
- 文本
- span标签
- a标签
- input标签
- img标签
2. 注意点:
- 如果需要让以上元素水平居中，需要给以上元素的**父元素**设置

3. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- 注意：图就是img，而不是图在img里面，父元素标签应该为body -->
    <img src="../橘猫.svg">
</body>
</html>
```

### 文本修饰
1. 属性名: text-decoration
2. 取值:

|属性值|效果|
|---|---|
|underline|下划线(常用)|
|line-through|删除线(不常用)|
|overline|上划线(几乎不用)|
|none|无装饰线(常用)|

3. 注意点:
- 开发中常会使用 text-decoration: none;清除**a标签默认的下划线**

4. 代码示例：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文本修饰</title>
    <style>
        div {
            text-decoration: underline;
        }
        p {
            text-decoration: line-through;
        }
        h2 {
            text-decoration: overline;
        }
        a {
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div>div</div>
    <p>ppp</p>
    <h1>h1</h1>
    <a href="#">我是超链接，点呀</a>
</body>
</html>
```

### 行高
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a138c8ded12.webp" width="300">

1. 作用:控制一行的上下行间距
2. 属性名:line-height
3. 取值:
- 数字+px
- 倍数(当前标签font-size的倍数)
4. 应用:
(1)让**单行文本**垂直居中可以设置 line-height:文字父元素高度
(2)网页精准布局时，会设置line-heiqht:1, 可以取消上下间距
5. 行高与font连写的注意点:
- 如果同时设置了行高和font连写，注意覆盖问题
- font :style weight size/**line-height** family ;
6. 代码示例：
```html
<style>
    p{
        line-height: 1.5;
        text-indent: 2em; 

        /* 66px 宋体 倾斜 加粗 行高是2倍 */
        font: italic 700 66px/2 宋体;
            /* 后面的会覆盖前面的 */
    }
</style>
```

## Chrome调试工具
一、打开网页，右键点击检查，可以看到elements的属性
二、可能的结果：
1. 被覆盖
![](https://picui.ogmua.cn/s1/2026/02/27/69a13c8835258.webp)
2. 有语法错误
![](https://picui.ogmua.cn/s1/2026/02/27/69a13c889ec9d.webp)
3. 可以自由选择勾或不勾来实时查看页面内容，调整合适了再回到编辑器修改
![](https://picui.ogmua.cn/s1/2026/02/27/69a13c88ba9bf.webp)


## 拓展
### 颜色常见取值
1. 属性名:
- 如:文字颜色:color
- 如:背景颜色:background-color
2. 属性值:

|颜色表示方式|表示含义|属性值|
|---|---|---|
|关键词|预定义的颜色名|red、green、 blue、yellow.....|
|rgb表示法|红绿蓝三原色。每项取值范围:0~255|rgb(0,0,0)、rgb(255,255,255)、rgb(255,0,0)..|
|rgba表示法|红绿蓝三原色+a表示透明度，取值范围是0~1|rgba(255,255,255,0.5)、rgba(255,0,0,0.3)..|
|十六进制表示法|#开头，将数字转换成十六进制表示|#000000、#ff0000、#e92322，（两两一组），简写:#000、#f00|


### 标签水平居中方法总结 margin: 0 auto
1. 如果需要让div、p、h(大盒子)水平居中
可以通过margin:0 auto; 实现
2. 注意点:
- 如果需要让 div、p、h(大盒子)水平居中，直接给**当前元素本身**设置即可
- margin:0 auto 一般针对于固定宽度的盒子，如果大盒子没有设置宽度，此时会默认占满父元素的宽度

3. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>标签水平居中</title>
        <style>
            div {
                width: 200px;
                height: 200px;
                background-color: red;

                margin: 0 auto;
            }
        </style>
</head>
<body>
    <div></div>
</body>
</html>
```







