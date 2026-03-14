## 结构伪类选择器

1. 作用与优势:
（1）作用: 根据元素在HTML中的结构关系查找元素
（2）优势: 减少对于HTML中类的依赖，有利于保持代码整洁
（3）场景: 常用于查找某父级选择器中的子元素
2. 选择器
|选择器|说明|
|---|---|
|E:first-child {}|匹配父元素中第一个子元素，并且是E元素|
|E:last-child {}|匹配父元素中最后一个子元素，并且是E元素|
|E:nth-child(n) {}|匹配父元素中第n个子元素，并且是E元素|
|E:nth-last-child(n) {}|匹配父元素中倒数第n个子元素，并且是E元素|

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        li:first-child {
            color: red;
        }

        li:last-child {
            color: green;
        }

        li:nth-child(2) {
            color: blue;
        }

        li:nth-last-child(2) {
            color: orange;
        }
    </style>
</head>
<body>
    <!-- ul>li{这是第$个li*8 -->
    <ul>
        <li>这是第1个li</li>
        <li>这是第2个li</li>
        <li>这是第3个li</li>
        <li>这是第4个li</li>
        <li>这是第5个li</li>
        <li>这是第6个li</li>
        <li>这是第7个li</li>
        <li>这是第8个li</li>
    </ul>
</body>
</html>
```

3. 注意：E:后面紧接第几个孩子，冒号后面不能空格！！!
4. n的注意点:
(1)n为:0、1、2、3、4、5、6、...
(2)通过n可以组成常见公式（括号里面可以写公式）
|功能|公式|
|---|---|
|偶数|2n、even|
|奇数|2n+1、2n-1、odd|
|找到前5个|-n+5|
|找到从第5个往后|n+5|

```html
<style>
    /* 偶数 */
    li:nth-child(even) {
        color: red;
    } 
    /* 奇数 */
    li:nth-child(odd) {
        color: green;
    }
    li:nth-child(3n) {
        color: blue;
    }
    li:nth-child(-n+5) {
        color: orange;
    }
</style>
```

## 伪元素
1. 伪元素:一般页面中的**非主体内容**（装饰性的小图）可以使用伪元素
2. 区别:
（1）元素:HTML设置的标签
（2）伪元素:由**CSS**模拟出的标签效果
3. 种类:
|伪元素|作用|
|---|---|
|::before|在父元素内容的最前添加一个伪元素|
|::after|在父元素内容的最后添加一个伪元素|

4. 注意点:
- 必须设置**content属性**才能生效
- 伪元素默认是行内元素

5. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .father {
            width: 200px;
            height: 200px;
            background-color: pink;
        }
        .father::before {
            content:'老鼠';
            color: red;
        }
        .father::after {
            content:'大米';
        }
    </style>
</head>
<body>
    <div class="father">爱</div>
</body>
</html>
```

6. 效果：
![](https://picui.ogmua.cn/s1/2026/03/09/69ae4034d6ece.webp)


## 标准流
1. 标准流:又称文档流，是浏览器在渲染显示网页内容时默认采用的一套排版规则，规定了应该以何种方式排列元素
2. 常见标准流排版规则:
- 块级元素:从上往下，垂直布局，独占一行
- 行内元素或行内块元素:从左往右，水平布局，空间不够自动折行


## 浮动
### 关于行内块或行内标签
1. 浏览器解析行内块或行内标签的时候，如果标签换行书写会产生间隙
![](https://picui.ogmua.cn/s1/2026/03/09/69aeb32d775bc.webp)
2. 如果不换行就不会有间距
![](https://picui.ogmua.cn/s1/2026/03/09/69aeb37baad5c.webp)
3. 但是要所有div都在一行写？所以转行内块并不能很好地解决问题->浮动

### 浮动的作用
#### 早期的作用：图文环绕
![](https://picui.ogmua.cn/s1/2026/03/09/69aeb3e349cdf.webp)

代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        img {
            float: left;
        }
    </style>
</head>
<body>
    <img src="../橘猫.svg" alt="">
    手动阀道法打客服哈卡大姐夫啊都是开发的数据恢复阿昆达是否会健康花城呢期户籍卡请问豁然开朗承认汽车库出去玩惹快吃切卡了复合材料鄂温克加起来出去玩奶茶了瑞卡全额我经常入乎其内尾款日期差
</body>
</html>
```

#### 现在的作用：页面布局
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
         div {
                width: 200px;
                height: 200px;
         }
        .one {
            float: left;
            background-color: pink;
        }
        .two {
            float: left;
            background-color: skyblue;
        }
    </style>
</head>
<body>
    <div class="one">one</div>
    <div class="two">two</div>
</body>
</html>
```
![](https://picui.ogmua.cn/s1/2026/03/09/69aeb610b3a27.webp)

### 浮动的特点
1. 浮动元素会脱离标准流，在标准流中不占位置
2. 浮动元素比标准流高半个级别，可以覆盖标准流的元素
![](https://picui.ogmua.cn/s1/2026/03/09/69aeb7b40b6a3.webp)
3. 浮动找浮动，下一个浮动元素会在上一个浮动元素的后面
4. 浮动的标签：顶对齐（可以加margin来往下挪）
![](https://picui.ogmua.cn/s1/2026/03/09/69aeb7dcf10fe.webp)
5. 浮动后的标签具备行内块特点：在一行排列，宽高生效
6. 注意点：浮动的元素不能设置margin:0 auto。不能垂直居中了。浮动要么在左边要么在右边


## CSS属性顺序（拓展）
CSS书写顺序：（style从上到下）浏览器加载速度会加快
1. 浮动/display
2. 盒子模型：margin border padding 宽度高度背景色（可先写这个让我们看见这个盒子在哪）
3. 文字样式


## 清除浮动
### 清除浮动的介绍
1. 含义: 清除浮动带来的影响
2. 影响: 如果子元素浮动了，此时子元素不能撑开标准流的块级父元素
3. 原因: 子元素浮动后脱标，不占位置
4. 目的: 需要父元素有高度，从而不影响其他网页元素的布局

意思是：子级浮动，父级没有加宽高，子级又不占标准流位置，这样后面的就会挤上来

### 清除浮动的方法
#### 1.直接设置父元素高度
（1）优点:简单粗暴，方便
（2）缺点:有些布局中不能固定父元素高度。如:新闻列表、京东推荐模块

#### 2.额外标签法
1. 操作:
- 在父元素内容的最后添加一个块级元素
- 给添加的块级元素设置clear:both
2. 缺点:会在页面中添加额外的标签，会让页面的HTML结构变得复杂







