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



## 数值(Number)
### 数值的介绍
- 所有的整数和浮点数都是Number类型
- 数值在控制台中会显示成蓝色
- 数值并不是无限大，当数值超过一定范围后会显示近似值
- Infinity是一个特殊的数值，表示无穷大
- 进行一些精度比较高的运算时要十分注意
- NaN也是一个特殊的数值，表示非法的数值
```html
<script>
    let a = 10;
    a = 3.14;
    a = 99999999999999999991;//99999999999999999992
    a = Infinity;
    a = 1.11111111111111111111111111111;
    a = 0.00000000000000000000000000001; //科学计数法
    a = 0.1 + 0.2; //0.30000000000000004
    a = 1 - 'a'; //NaN(Not a Number)
    a = NaN;
    console.log(a);
</script>
```

### 大整数(BigInt)
- 用来表示一些比较大的整数
- 在数字后面加上n就可以表示一个大整数，如：1234567890123456789012345678901234567890n
- 表示的数字范围是无穷大
```html
<script>
    a = 1234567890123456789012345678901234567890n;
    console.log(a);
</script>
```

### 其他进制的数字：
- 二进制 0b
- 八进制 0o
- 十六进制 0x
打印都会显示成十进制的数值


## 类型检查
使用**typeof**运算符
```html
<script>
    let a = 10;
    let b = 10n;
    let c = 'hello';

    console.log(typeof a); //number
    console.log(typeof b); //bigint
    console.log(typeof c); //string
</script>
```

## 字符串
- 单引号或双引号
- 使用typeof -> string
### 转义字符 \ 
- \n 换行
- \t 制表符
- \" 双引号
- \' 单引号
- \\ 反斜杠

### 模板字符串
- 用反引号``包裹起来的字符串
- 可以换行
- 可以在字符串中嵌入变量、表达式，使用${}包裹表达式

```html
<script>
    let a = "这是一个\"字符串\"";

    a = "今天天\
    气很好，我们去公园玩吧";

    let name = "小明";
    let str = `你好，${name}！`;

    console.log(a); //这是一个"字符串"
    console.log(str); //你好，小明！
    console.log(`a=${a}`); 
</script>
```

## 其他的数据类型

### 布尔值(boolean)
- 只有两个值：true和false
- 用于表示逻辑上的真和假
- 使用typeof -> boolean

### 空值(null)
- 表示没有值
- 是一个特殊的值，表示空对象引用
- 使用typeof -> object
- 使用typeof无法检查空值，可以使用===来检查

### 未定义(undefined)
- 表示变量未定义，只是声明了而没有赋值
- 使用typeof -> undefined

### 符号（symbol）
- 用于创建唯一的标识符
- 每个Symbol都是唯一的，即使它们有相同的描述
- 使用typeof -> symbol
```html
<script>
    let c = Symbol();
    console.log(c); //Symbol()
</script>
```

## 原始值
JS中原始值一共有七种：
- 数值(number)
- 大整数(bigint)
- 字符串(string)
- 布尔值(boolean)
- 空值(null)
- 未定义(undefined)
- 符号(symbol)
一旦创建了一个原始值，就不能修改它的内容了，如果需要修改，就需要创建一个新的值

## 类型转换
类型转换值将一种数据类型转换为其他类型
如：将其他类型转换为：字符串、数值、布尔值
1. 转换为字符串
（1）显式：String()
（2）隐式：+""
2. 转换为数值
（1）显式：Number()
（2）隐式：+ (加个正号)
2. 转换为布尔值
（1）显式：Boolean()
（2）隐式：!! (两次取反)

### 类型转换-字符串
转换为字符串
1. 使用**String()函数或toString()**方法
2. 由于null和undefined没有toString()方法，所以只能使用String()函数来转换
3. 所有数据类型都可以转换为字符串

代码示例：
```html
<script>
    let a = 10;
    a = true;
    a = 11n;

    console.log(typeof a,a); // "bigint"

    a = a.toString();// "11"

    a = String(a); // "11"
    
    console.log(typeof a,a); // "string"
</script>
```

### 类型转换-数值
将其他数据类型转换为数值
1. **Number()**函数
2. 转换情况：
（1）字符串：合法数字则可以转，不是数字则转换为NaN，空串或纯空格则转换为0
```html
<script>
    let a = '123' // 123
    a = 'abc' // NaN
    a = '3.1415926' // 3.1415926
    a = '11px' // NaN
    a = '' // 0
    a = '   ' // 0
</script>
```
（2）布尔值：ture->1, false->0
（3）null: -> 0
（4）undefined: -> NaN
3. 专门用来将字符串转换为数值
（1）parseInt()，转成整数，会从左到右读取字符串提取有效数字，eg:123px也能转成123，用Number()就不行
（2）parseFloat()，转成浮点数 

### 类型转换-布尔值
1. 使用**Boolean()**函数，将其他类型转换为布尔值
2. 转换情况：
（1）数字：0和NaN->false，其余都是true
（2）字符串：空串或者全是空格的串->false，其余都是true
（3）null: -> false
（4）undefined: -> false
（5）对象：都会转换为true
3. 即：所有表示空性的没有的错误的值，都会转换为false


## 运算符
运算符（操作符），可以用来对一个或多个操作数进行运算

### 算术运算符
1. 介绍：
（1） 加法 +
（2）减法 -
（3）乘法 *
（4）除法 /  （不是整除），除以0返回Infinity
（5）幂 **， 10 ** 2 = 100
（6） 开方 ** .
（7）模运算 %， 两个数相除取余数
2. JS是一门弱类型语言，会自动类型转换
（1）字符串加法：任意值和字符串做加法，会先将该值转换为字符串，然后拼接字符串（和空串相加可以**自动**转换为字符串）
（2）操作数是非数值，会转换为数值再运算

### 赋值运算符
1. 用来将一个值（右边）赋值给一个变量（左边）
2. 一个变量，在等号左边，是变量；在等号右边，是值
3. ??= 空赋值，只有当变量的值为null或undefined才能成功赋值

### 一元±
1. +：不会改变数值的符号
2. —：对数值进行符号位的取反
3. 对非数值类型进行正负运算，会先转换为数值再运算
4. + 相当于 Number()

### 自增和自减
1. ++： 使用后会使得原来的**变量**立刻增加1
2. ++a: 表达式的结果立刻加1，是新值
3. a++: 表达式的结果是自增前的值，是旧值
4. --

### 逻辑运算符
1. ！逻辑非
（1）对布尔值取反
（2）非布尔值：会先转为布尔值
（3）!!可用来进行类型转换
2. && 逻辑与
（1）对两个值进行与运算
（2）左右都为true，返回true，否则返回false
（3）是短路的与，如果第一个值为false，则不看第二个值
（4）找false，找到false则直接返回，没有false才会返回true
（5）非布尔值：先转换为布尔值，但是会**返回原值**（第一个值为false，则直接返回第一个值，否则返回第二个值）**注：不会返回true/false**
```html
<script>
    result = 1 && 2 // 2
    result = 1 && 0 // 0
    result = 0 && 123 // 0
</script>
```
3. || 逻辑或
（1）找true，有true就返回，没有往下找，找不到就false
（2）非布尔值，先转换，返回原值（规则同&&）

### 关系运算符
#### 不等关系
用来检查两个值之间的关系是否成立，成立返回true，不成立返回false
1. 分类：
(1) > 
(2) >=
(3) <
(4) <=
2. 对非数值，先转换为数值，再比较
（1）但当两个是字符串时，不会将字符串转换为数值，而是**逐位**比较字符的Unicode编码
（2）利用该特点可以对字符串按照字母排序
（3）注意比较两个字符串格式的数字时，一定要进行类型转换
```html
<script>
    result = "abc" < "b" // true
    result = "12" > "2" // false,1和2比较
    result = 5 < 6 < 10 //没法判断6是否在5和10之间，会左边得出true，然后true和10比
</script>
```

#### 相等关系
1. == 相等运算符：
（1）比较两个值是否相等
（2）不同类型，会先转换为相同的类型（通常数值），然后再比较
（3）类型转换后值相同也会返回true
（4）null和undefined，会返回true
（5）**NaN不和任何值相等，包括它自身**
2. === 全等运算符：**（用得比较多）**
（1）不会自动类型转换，类型不同直接返回false
（2）null和undefined，会返回false
3. != 不等
（1）自动类型转换
4. !== 不全等
（1）不会自动类型转换


### 条件运算符
1. 结构：条件表达式 ? 表达式1 : 表达式2
（1）先对条件表达式求值：ture则执行表达式1，false则执行表达式2





