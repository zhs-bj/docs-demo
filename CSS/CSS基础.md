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
![](https://picui.ogmua.cn/s1/2026/02/27/69a12197d7483.webp)
### 







