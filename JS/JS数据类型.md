学习参考视频：https://www.bilibili.com/video/BV1mG411h7aD/?spm_id_from=333.337.search-card.all.click

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

## 类型转换-字符串
转换为字符串
1. 使用**String()函数或toString()**方法
2. 由于null和undefined没有toString()方法，所以只能使用String()函数来转换

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