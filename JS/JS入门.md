学习参考视频：https://www.bilibili.com/video/BV1mG411h7aD/?spm_id_from=333.337.search-card.all.click

## JavaScript认识
### 解释型
JavaScript是一门解释型编程语言，解释型编程语言指代码不需要手动编译，而是通过解释器边编译边执行。所以要运行JS，我们必须现在计算机中安装JS的解释器。像是我们使用的浏览器都已经自动集成了JS的解释器(我们也称它是JS引擎)。Node.Js也是JS引擎，它使得JS可以直接在计算机中运行。无论是浏览器还是Node.js都需要遵循ECMAScript(ES)标准。
### 函数式编程
在JavaScript中函数是一等公民，它可以像其他类型的值一样赋值给任意变量，也可以作为参数传递给其他函数。所以在JS中函数非常非常重要，通过函数式编程可以编写出功能强大又灵活的代码。
### 单线程
JavaScript是一个单线程的编程语言。简言之，JS同一时间只能做一件事，一件事完成才会继续做另一件事。单线程降低了JS代码的复杂度，也在某些场景下使得JS性能变差，所以JS又为我们提供了异步的编程方式，以提高代码的运行速度。

### 面向对象
几乎所有的现代的编程语言都是面向对象的编程语言，JS也不例外。所谓的面向对象，指将一组相关的功能(数据)统一封装到一个对象中，使用功能时无需考虑其实现的细节，直接找到对应的对象即可完成功能的调用。

### 扩展ES
ECMAScript只是为我们定义最基本的语法，像是数据类型(原始值、对象)、运算符、流程控制语句等内容。为了使JS可以适用于不同的场景，在不同的JS解释器中还为我们提供了不同的扩展以增强其功能。像是浏览器中的DOM、BOM使得我们可以通过JS操作网页和浏览器NodeJs中的fs模块可以使我们直接操作计算机系统中的各种文件。所以我们学习JS时，除了要学习ES标准以外，还要学习它的各种扩展，才能在不同的环境中发挥出JS的最大威力。

## 输出语句
js代码需要编写到script中
### 警告框输出
1. alert: 进入页面会弹出

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a1531acc2f0.webp" width="700">

2. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello world!</title>
    <script>
        alert("警告框");//输出语：警告框
    </script>
</head>
<body>  
</body>
</html>
```

### 控制台输出
1. console.log: 在控制台输出内容
2. 控制台的查看：在页面右键点击“检查”，再进入控制台

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a15594e765a.webp" width="700">

3. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello world!</title>
    <script>        
        console.log("在控制台输出内容");//输出语：在控制台
    </script>
</head>
<body> 
</body>
</html>
```

### 页面输出
1. document.write： 在页面上输出内容

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a156472a27c.webp" width="700">

2. 代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>hello world!</title>
    <script>
        document.write("在页面上输出内容");//输出语：在页面上输出内容
    </script>
</head>
<body> 
</body>
</html>
```


## JS编写位置

### js代码编写到script中
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>1.js代码编写到script中</title>
     <script>
        alert("js代码编写到script中");
     </script>
</head>
<body>

</body>
</html>
```

### js编写到外部的js文件中
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS的编写位置</title>
     <!-- 2.可以将js编写到外部的js文件中，然后通过script标签引入 -->
     <script src="02_编写位置.js"></script> 
</head>
<body>
 
</body>
</html>
```

外部的.js文件
```js
alert('外部的js文件')
```

### js代码编写到指定属性中
代码：
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS的编写位置</title>
</head>
<body>
    <!-- 3.可以将js代码编写到指定属性中 -->
      <button onclick="alert('你点我干嘛！')">点我一下</button>
      <hr>
      <a href="javascript:alert(123);">超链接</a>    
</body>
</html>
```
效果：
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a159a37f9d4.webp" width="700">


## 基本语法

### 多行注释
快捷键：shift+alt+a
```html
<script>
        /*
            1.多行注释
            - 注释中的内容会被解释器忽略
        */
</script>
```

### 单行注释
```html
<script>
    // 2.单行注释
</script>
```

### 大小写问题
JS严格区分大小写，比如：Alert和alert是不同的
- 前者会报错
- 后者会弹出警告框

### 多个空格或换行
多个空格和换行会被忽略，只会识别成一个，可以利用这个特点来对代码进行格式化

### 分号结尾
每条语句都应该以分号结尾
- JS具有自动分号插入机制，如果没有分号，JS会自动在行末添加分号
- 但有时可能会导致错误，所以建议每条语句都以分号结尾


## 字面量 变量 常量

### 字面量
- 字面量就是一个值，它所代表的含义就是它字面的意思
- 比如：1 2 3 100 "hello" true...
- 可以直接使用

### 变量
1. 变量的介绍
- 可以存储字面量
- 变量中存储的字面量可以随意的修改
- 通过变量可以对字面量进行描述，变量比较方便修改
2. 变量的使用
- 声明变量： let 变量名 / var 变量名 / const 变量名.  多用let，少用var，const用来声明常量
- 变量赋值： 变量名 = 值
- 一般声明和赋值同时进行： let 变量名 = 值

```html
<script>
    console.log(80);
    let x = 80;//将字面量80存储到变量x中
    console.log(x);
</script>
```

3. 变量的内存结构
- 变量中并不存储任何值，而是存储值的内存地址
- 会先检查内存中是否已存有同样的值，没有的话会新开辟内存来存，有的话就直接使用这个内存地址

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a15cb108475.webp" width="500">

### 常量
- 常量是指在程序运行过程中值不能改变的量
- 使用 const 来声明常量，必须在声明时初始化，并且不能再被赋值（只能赋值一次，重复赋值会报错）
```html
<script>
    const PI = 3.1415926;
    console.log(PI);
</script>
```

## 标识符
1. 所有可以由我们自主命名的内容，都可以认为是一个标识符，像函数名、变量名、类名...

2. 命名规范：
- 只能含字母、数字、下划线、$，且不能以数字开头
- 不能是关键字或保留字(let)，也不建议使用内置函数名(alert，会把原来的alert函数覆盖掉)
- 驼峰命名法：第一个单词首字母小写，后面每个单词首字母大写，如：myName、getUserInfo
- **类名**通常使用大驼峰命名法：每个单词首字母都大写，如：MyName、GetUserInfo
- **常量**通常使用全大写字母命名，如：MAX_SIZE、DEFAULT_COLOR


