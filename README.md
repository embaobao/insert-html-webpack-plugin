# insert-html-webpack-plugin

### 1、简介（Introduction）
webpack的plugin插件，用于在webpack编译时自动往html模板里插入js和css代码。
（A plugin for webpack. Auto insert js and css into html template when webpack compiling.）

+ 依赖html-webpack-plugin插件（depend on html-webpack-plugin）

### 2、安装（Install）
```bash
npm i insert-html-webpack-plugin -D
```

### 3、用法（Usage）
```js
const InsertHtmlWebpackPlugin = require('insert-html-webpack-plugin')

new InsertHtmlWebpackPlugin(
  // 第一个参数，必填，配置文件列表
  {
    js: [
      // 可以配置多个，按顺序依次插入
      { path: 'a.js' }, // path属性表示使用script内联方式
      { path: 'b.js' },
      { url: 'https://c.com/c.js' } // url属性表示使用script外部引入方式
    ],
    css: [
      { path: 'd.css' }, // path属性表示使用style内联方式
      { url: 'https://e.com/e.css' } // url属性表示使用link外部引入方式
    ]
  },
  // 第二个参数，可选，配置插入位置，默认值如下
  {
    jsNode: '<body>', // 指定js要插入的节点位置
    jsSide: 'after', // js要插入在节点位置处的前面还是后面，可选值'after'、'before'
    cssNode: '</title>', // 指定css要插入的节点位置
    cssSide: 'after', // css要插入在节点位置处的前面还是后面，可选值'after'、'before'
  }
)
```
+ path属性值为相对于webpack命令运行目录（一般是项目根目录）的路径
+ url属性值会直接赋值为script标签src属性（用于js）或link标签的href属性（用于css）的值
+ js是默认插入到html模板字符串的"\<body>"后面
+ css是默认插入到html模板字符串的"\</title>"后面

### 4、示例说明（Example）
#### （1）使用js
```js
new InsertHtmlWebpackPlugin({
  js: [
    { path: '/insert/aaa.js' },
    { url: 'https://abc.com/bbb.js' }
  ]
})
```
插入后的伪代码：
```html
<html>
  <head>
    <title></title>
  </head>
  <body>
    <script>
      // 这里就是aaa.js里的js代码
    </script>
    <script src="https://abc.com/bbb.js"></script>
    <div id="app"></div>
  </body>
</html>
```

#### （2）使用css
```js
new InsertHtmlWebpackPlugin({
  css: [
    { path: '/insert/dd.css' },
    { url: 'https://abc.com/ee.css' }
  ]
})
```
插入后的伪代码：
```html
<html>
  <head>
    <title></title>
    <style>
      /* 这里是dd.css里的css代码 */
    </style>
    <link rel="stylesheet" href="https://abc.com/ee.css" />
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### 5、注意点（Warnings）
+ 插入的js或css不会再经过webpack的任何处理，所以在插入之前请检查待插入的代码兼容性。