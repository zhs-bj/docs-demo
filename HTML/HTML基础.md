学习参考视频：https://www.bilibili.com/video/BV1Kg411T7t9/?spm_id_from=333.337.search-card.all.click&vd_source=a792cef94b4f097094af2d83b2abe623

## 列表标签

### 列表的应用场景
1. 场景:在网页中按照行展示关联性的内容，如:新闻列表、排行榜、账单等
2. 特点:按照行的方式，整齐显示内容
3. 种类:无序列表、有序列表、自定义列表
![](https://picui.ogmua.cn/s1/2026/02/26/69a05fece2b8e.webp)

### 无序列表
1. 场景:在网页中表示一组无顺序之分的列表，如:新闻列表。
2. 标签组成:

|标签名|说明|
|---|---|
|ul|表示无序列表的整体，用于包惠li标签|
|li|表示无序列表的每一项，用于包含每一行的内容|

3. 显示特点:
- 列表的每一项前默认显示圆点标识
4. 注意点:
- ul标签中只允许包含li标签
- li标签可以包含任意内容
5. 代码示例：
```html
<ul>
    <li>苹果</li>
    <li>橘子</li>
    <li>香蕉</li>
</ul>
```

### 有序列表
1. 场景:在网页中表示一组有顺序之分的列表，如:排行榜。
2. 标签组成:

|标签名|说明|
|---|---|
|ol|表示有序列表的整体，用于包惠li标签|
|li|表示有序列表的每一项，用于包含每一行的内容|

3. 显示特点:
- 列表的每一项前默认显示序号标识
4. 注意点:
- ol标签中只允许包含li标签
- li标签可以包含任意内容
5. 代码示例：
```html
<ol>
    <li>张三：100</li>
    <li>李四：95</li>
    <li>赵五：85</li>
</ol>
```

### 自定义列表
1. 场景:在网页的**底部导航**中通常会使用自定义列表实现。
2. 标签组成:

|标签名|说明|
|---|---|
|dl|表示自定义列表的整体，用于包裹dt/dd标签|
|dt|表示自定义列表的主题|
|dd|表示自定义列表的针对主题的每一项内容|

3. 显示特点:
- dd前会默认显示缩进效果
4. 注意点:
- dl标签中只允许包含dt/dd标签
- dt/dd标签可以包含任意内容
5. 代码示例：
```html
<dl>
    <dt>帮助中心</dt>
    <dd>账户管理</dd>
    <dd>购物指南</dd>
</dl>
```

## 表格标签

### 表格的基本标签
1. 场景:在网页中以行+列的单元格的方式整齐展示和数据，如:学生成绩表

2. 基本标签:

|标签名|说明|
|---|---|
|table|表格整体，可用于包裹多个tr|
|tr|表格每行，可用于包裹td|
|td|表格单元格，可用于包裹内容|

3. 注意点:
- 标签的嵌套关系:table>tr>td

4. 代码示例：但此时表格没有表格线
```html
<table>
    <tr>
        <td>姓名</td>
        <td>成绩</td>
        <td>评语</td>
    </tr>
    <tr>
        <td>张三</td>
        <td>100分</td>
        <td>满分！</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>95分</td>
        <td>不错！</td>
    </tr>
    <tr>
        <td>总结</td>
        <td>都很棒</td>
        <td>很好</td>
    </tr>
</table>
```

### 表格相关属性
1. 场景:设置表格基本展示效果
2. 常见相关属性：

|属性名|属性值|效果|
|---|---|---|
|border|数字|边框宽度|
|width|数字|表格宽度|
|height|数字|表格高度|

3. 注意点:
- 实际开发时针对于样式效果推荐用CSS设置

4. 代码示例：
```html
<table border="1" width="500" height="300">
    <tr>
        <td>姓名</td>
        <td>成绩</td>
        <td>评语</td>
    </tr>
    <tr>
        <td>张三</td>
        <td>100分</td>
        <td>满分！</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>95分</td>
        <td>不错！</td>
    </tr>
    <tr>
        <td>总结</td>
        <td>都很棒</td>
        <td>很好</td>
    </tr>
</table>
```

### 表格标题和表头单元格标签
1. 场景:在表格中表示**整体大标题**和**一列小标题**
2. 其他标签：

|标签名|名称|说明|
|---|---|---|
|caption|表格大标题|表示表格整体大标题，默认在表格整体顶部居中位置显示|
|th|表头单元格|表示一列小标题，通常用于表格第一行，默认内部文字加粗并居中显示|

3. 注意点:
- caption标签书写在table标签内部
- th标签书写在tr标签内部(用于替换td标签)

4. 代码示例：
```html
<table border="1" caption="学生成绩单">
    <tr>
        <th>姓名</th>
        <th>成绩</th>
        <th>评语</th>
    </tr>
    <tr>
        <td>张三</td>
        <td>100分</td>
        <td>满分！</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>95分</td>
        <td>不错！</td>
    </tr>
    <tr>
        <td>总结</td>
        <td>都很棒</td>
        <td>很好</td>
    </tr>
</table>
```

### 表格的结构标签
1. 场景:让表格的内容结构分组，突出表格的不同部分(头部、主体、底部)，使语义更清晰
2. 结构标签：

|标签名|名称|
|---|---|
|thead|表格头部|
|tbody|表格主体|
|tfoot|表格底部（一般是“总结”）|

3. 注意点:
- 表格结构标签内部用于包裹tr标签
- 表格的结构标签可以省略
- 加不加这个结构标签，最后在浏览器中的渲染效果不变，但是加了之后浏览器的执行效率会更高

4. 代码示例：
```html
<table border="1" caption="学生成绩单">
    <thead>
    <tr>
        <th>姓名</th>
        <th>成绩</th>
        <th>评语</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>张三</td>
        <td>100分</td>
        <td>满分！</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>95分</td>
        <td>不错！</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td>总结</td>
        <td>都很棒</td>
        <td>很好</td>
    </tr>
    </tfoot>
</table>
```

### 合并单元格

#### 思路
1. 场景：将水平或垂直多个单元格合并成一个单元格
2. 分类：
- 跨行合并：垂直合并成一个
- 跨列合并：水平衡合并成一个

#### 实现
一、合并单元格步骤
1. 明确合并哪几个单元格
2. 通过左上原则，确定保留谁删除谁
- 上下合并→只保留最上的，删除其他
- 左右合并一只保留最左的，删除其他
3. 给保留的单元格设置:跨行合并(rowspan)或者跨列合并(colspan)

|属性名|属性值|说明|
|---|---|---|
|rowspan|合并单元格的个数|跨行合井，将多行的单元格垂直合并|
|colspan|合并单元格的个数|跨列合并，将多列的单元格水平合并|

4. 注意点:
- 只有同一个结构标签中的单元格才能合并，不能跨结构标签合并（不能跨：thead、tbody、tfoot）

5. 代码示例：
```html
<!-- 合并100分的成绩表格（跨行），合并总结的表格（跨列） -->
<table border="1" caption="学生成绩单">
    <thead>
    <tr>
        <th>姓名</th>
        <th>成绩</th>
        <th>评语</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>张三</td>
        <td rowspan="2">100分</td>
        <td>满分！</td>
    </tr>
    <tr>
        <td>李四</td>
        <!-- <td>95分</td> -->
        <td>不错！</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
        <td>总结</td>
        <td colspan="2">都很棒</td>
        <!-- <td>很好</td> -->
    </tr>
    </tfoot>
</table>
```

## 表单标签
场景：做**登录、注册、搜索**功能的时候
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a0fd15b456a.webp" width="300">
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a0fd1709bad.webp" width="300">
<img src="https://picui.ogmua.cn/s1/2026/02/27/69a0fd16e8808.webp" width="300">

### input系列标签的基本介绍
1. 场景:在网页中显示收集用户信息的表单效果，如:登录页、注册页
2. 标签名:input
- input标签可以通过type属性值的不同，展示不同效果
3. type属性值:

|标签名|type属性值|说明|
|---|---|---|
|input|text|文本框，用于输入单行文本|
|input|password|密码框，用于输入密码|
|input|radio|单选框，用于多选一|
|input|checkbox|多选框，用于多选多|
|input|file|文件选择，用于之后上传文件|
|input|submit|提交按钮，用于提交|
|input|reset|重置按钮，用于重置|
|input|button|普通按钮，默认无功能，之后配合js添加功能|

4. 代码示例：
```html
<!-- 写什么就是什么 -->
文本框：<input type="text">
```
```html
<!-- 书写的内容都会变成点点·····显示 -->
密码框：<input type="password">
```
```html
<!-- 单选框：多选一 -->
单选框：<input type="radio">
性别：<input type="radio">男  <input type="radio">女
```
```html
多选框：<input type="checkbox">
兴趣爱好：<input type="checkbox">篮球 <input type="checkbox">足球 <input
type="checkbox">羽毛球
```
```html
上传文件：<input type="file">
```
```html
<!-- 按钮 -->
<input type="submit">
<input type="reset">
<!-- value用来给按钮显示字 -->
<input type="button" value="普通按钮">
```

#### input系列标签-文本框
1. 场景:在网页中显示输入单行文本的表单控件
2. type属性值:text
3. 常用属性:

|属性名|说明|
|---|---|
|placeholder|占位符，提示用户输入内容的文本|

4. 代码：
```html
文本框：<input type="text" placeholder="请输入用户名">
密码框：<input type="password" placeholder="请输入密码">
```

#### input系列标签-单选框
1. 场景:在网页中显示**多选一的单选**表单控件
2. type属性值:radio
3. 常用属性:

|属性名|说明|
|---|---|
|name|分组，有相同name属性值的单选框为一组，一组中同时只能有一个被选中|
|checked|默认选中|

4. 注意点:
- name属性对于单选框有分组功能
- 有相同name属性值的单选框为一组，一组中只能同时有一个被选中

5. 代码：
```html
性别：<input type="radio" name="sex">男  <input type="radio" name="sex" checked>女
<!-- “我同意···”默认选中，checkbox是为了得到小方框 -->
<input type="checkbox" checked> 我同意注册条款和会员加入标准
<!-- 多选框 -->
兴趣爱好：<input type="checkbox" name="hobby" >篮球 <input type="checkbox" name="hobby">足球 <input type="checkbox" name="hobby">羽毛球
```

#### input系列标签-文件选择
1. 场景:在网页中显示文件选择的表单控件
2. type属性值:file
3. 常用属性:

|属性名|说明|
|---|---|
|multiple|多文件选择|

4. 代码：
```html
上传文件：<input type="file" multiple>
```

#### input系列标签-按钮
1. 场景:在网页中显示不同功能的按钮表单控件
2. type属性值:

|标签名|type属性值|说明|
|---|---|---|
|input|submit|提交按钮，点击之后提交数据给后端服务器|
|input|reset|重置按钮，点击之后恢复表单默认值|
|input|button|普通按钮，默认无功能，之后配合is添加功能|

3. 注意点:
- 如果需要实现以上按钮功能，需要配合form标签使用
- form使用方法:用form标签把表单标签一起包裹起来即可

4. 代码：
```html
<!-- form表示表单域 -->
    <form action="">
    文本框：<input type="text" placeholder="请输入用户名">
    密码框：<input type="password" placeholder="请输入密码">
    单选框：<input type="radio">
    性别：<input type="radio" name="sex">男 
    <input type="radio" name="sex" checked>女
    多选框：<input type="checkbox">
    兴趣爱好：<input type="checkbox" name="hobby" >篮球 <input type="checkbox" name="hobby">足球 <input type="checkbox" name="hobby">羽毛球
    上传文件：<input type="file" multiple>
    <!-- 按钮 -->
    <input type="submit">
    <input type="reset">
    <input type="button" value="普通按钮">
    </form>
```

### button按钮标签
1. 场景:在网页中显示用户点击的按钮
2. 标签名:button
3. type属性值(同input的按钮系列)

|标签名|type属性值|说明|
|---|---|---|
|button|submit|提交按钮，点击之后提交数据给后端服务器|
|button|reset|重置按钮，点击之后恢复表单默认值普通按钮。|
|button|button|默认无功能，之后配合js添加功能|

4. 注意点:
- 谷歌浏览器中button默认是提交按钮
- button标签是**双标签**，更便于包裹其他内容:**文字、图片**等

5. 代码：
```html
<h1>button标签</h1>
    <button>我是按钮</button>
    <button type="submit">提交按钮</button>
    <button type="reset">重置按钮</button>
    <button type="button">普通按钮，没有任何功能</button>
```

### select下拉菜单标签
1. 场景:在网页中提供多个选择项的下拉菜单表单控件
2. 标签组成:
- select标签:下拉菜单的整体
- option标签:下拉菜单的每一项
3. 常见属性:
- selected:下拉菜单的默认选中
4. 代码：
```html
<h1>select下拉菜单标签</h1>
     来自地区：
     <select>
        <option>北京</option>
        <option selected>上海</option>
        <option>广州</option>
        <option>深圳</option>
     </select>
```

### textarea文本域标签
1. 场景:在网页中提供可输入多行文本的表单控件
2. 标签名:textarea
3. 常见属性:
- cols:规定了文本域内可见宽度
- rows:规定了文本域内可见行数
4. 注意点:
- 右下角可以拖拽改变大小
- 实际开发时针对于样式效果推荐用CSS设置

<img src="https://picui.ogmua.cn/s1/2026/02/27/69a10d8224f43.webp" width="200">

5. 代码：
```html
<textarea cols="60">     </textarea>
```

###  label标签
1. 场景:常用于绑定内容与表单标签的关系,这样子点文字内容也可以点到方框的勾选
2. 标签名:label
3. 使用方法①:
(1)使用label标签把内容(如:文本)包裹起来
(2)在表单标签上添加id属性
(3)在label标签的for属性中设置对应的id属性值
```html
<input type="radio" name="sex" id="male"> <label for="male">男</label>
<input type="radio" name="sex" id="female"> <label for="female">女</label>
```
4. 使用方法②:
(1)直接使用label标签把内容(如:文本)和表单标签一起包裹起来 
(2)需要把label标签的for属性删除即可
```html
<label><input type="radio" name="sex"> 女</label>
```

### 语义化标签
#### 没有语义的布局标签-div和span
1. 场景:实际开发网页时会大量频繁的使用到div和span这两个没语义的布局标签
2. div标签:一行只显示一个(独占一行)
3. span标签:一行可以显示多个
4. 代码：
```html
<div>这是div标签</div>
<span>这是span标签</span>
```

#### 有语义的布局标签
1. 场景:在HTML5新版本中，推出了一些有语义的布局标签供开发者使用
2. 标签：

|标签名|语义|
|---|---|
|header|网页头部|
|nav|网页导航|
|footer|网页底部|
|aside|网页侧边栏|
|section|网页区块|
|article|网页文章|

3. 注意点:
- 以上标签显示特点和div一致，但是比div多了不同的语义

4. 代码：
```html
<header>网页头部</header>
<nav>网页导航</nav>
<footer>网页底部</footer>
<aside>侧边栏</aside>
<section>网页区块</section>
<article>文章</article>
```


## 字符实体
### HTML的空格合并现象
如果在html代码中同时并列出现**多个空格、换行、缩进**等，
最终浏览器只会解析出一个空格

### 常见字符实体
1. 场景:在网页中展示特殊符号效果时，需要使用字符实体替代
2. 结构: &英文;
3. 常见字符实体:

|显示结果|描述|实体名称|
|---|---|---|
|   |空格|\&nbsp;|
|<|小于号|\&lt;|
|>|大于号|\&gt;|
|&|和号|\&amp;|
|"|引号|\&quot;|
|'|撇号|\&apos;(IE不支持)|
|&cent;|分(cent)|\&cent;|
|&pound;|镑(pound)|\&pound;|
|&yen;|元(yen)|\&yen;|
|&euro;|欧元(euro)|\&euro;|
&sect;|小节|\&sect;|
|©|版权(copyright)|\&copy;|







