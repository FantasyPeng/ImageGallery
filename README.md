# ImageGallery
a simple JavaScript imageGallery

## 案例研究：JavaScript图片库
- 初学JavaScript做的小案例

## 平稳退化
- 让访问者在浏览器不支持JavaScript的情况下仍能正确的浏览你的网站，虽然某些功能无法使用，但最基本的操作仍能顺利完成
- 可以大大提高可访问性，只有少数搜索引擎能够理解JavaScript代码，当JavaScript网页不能平稳退化，可能会大大影响在搜索引擎上的排名。
- JavaScript伪协议，可以通过一个链接来调用JavaScript函数，如
```
<a href="javascript:popUp('http://www.example.com/');">Example</a>
```
可以调用popUp函数，**这种做法很不好，如果JavaScript被禁用，链接失效**
- 内嵌的事件处理函数
```
<a href="#" onclick="popUp('http://www.example.com/');return flase;">Example</a>
```
也不能实现平稳退化
- 以下方法可以实现平稳退化      
```
<a href="http://www.example.com" onclick="popUp('http://www.example.com/');return flase;">Example</a>
```
- 可以利用this.href代替popUp()函数中的参数。

## 分离JavaScript
- popUp()在窗口打开指定链接
```
function popUp(winURL) {
    window.open(winURL,"popup","width=320,height=480");
}
```
- 以下步骤可以将内嵌的事件处理函数分离，在HTML文档中使用onclick之类的属性就像使用style属性一样，很容易引发问题。
  - JavaScript语言不要求事件必须在HTML文档中处理，我们可以在外部JavaScript文件中把一个事件添加到HTML文档中的某个元素上
  ```
  element.event = action
  ```
  - 将该链接的href属性值传递给popUp()函数
  - 取消该链接的默认行为，不让这个链接把访问者带离当前窗口
  - 代码：
  ```
  var links = document.getElementsByTagName('a');
  for (var i=0; i<links.length; i++) {
      if (links[i].getAttribute("class") == "popup") {
          links[i].onclick = function(){
              popUp(this.getAttribute("href"));
              return false;
          }
      }
  }
  ```
  - 但是还有一个问题，代码的第一行是
  ```
  var links = document.getElementByTagName('a');
  ```
  - 这条语句将在JavaScript文件被加载时立刻执行，如果在head部分调用，它将在HTML文档加载之前被加载到浏览器中。同样，如果<script>标签位于文档底部</body>之前，就不能保证哪个文件最先结束加载（浏览器可能一次加载多个）。如果文档不完整，么有完整的DOM,getElementByTagName等方法就不能正常执行。
  - 必须在HTML文档全部加载到浏览器之后马上开始执行，因此可以使用window.onload，当window除法onload事件时，document对象已经存在。
  - 代码：
  ```
  window.onload = prepareLinks;
  function prepareLinks() {
    var links = document.getElementsByTagName('a');
    for (var i=0; i<links.length; i++) {
      if (links[i].getAttribute("class") == "popup") {
          links[i].onclick = function(){
              popUp(this.getAttribute("href"));
              return false;
            }
        }
    }    
  }
  
  ```
  
## 向后兼容
- 对象检测，在使用某个JavaScript方法时，先判断浏览器是否支持该方法，再判断下一步的动作，这样可以避免脚本无法正常工作
  - 比如上面的函数可以改为 
  ```
  window.onload = function() {
      if (!document.getElementsByTagName)  return false;
      ....
  }
  ```
  - 注意document.getElementsByTagName返回值为true方法则存在，否则，反之；
  - 在函数尾部不能加括号，加上括号就是方法的结果了。
- 浏览器嗅探技术，通过提取浏览器供应商提供的信息来解决向后兼容问题，但是有些浏览器可能会撒谎，而且为了脚本可以适应不同的浏览器，代码会变得很复杂。

## 性能考虑
- 尽量减少DOM和尽量减少标记，访问DOM的方式对脚本性能会产生非常大的影响。
例如：
```
if (document.getElementByTagName("a").length > 0) {
    var links = document.getElementByTagName("a");
    for (var i=0; i < links.length; i++){
        //对每个链接点做点处理
    }
}
```
这里使用了两次getElementByTagName方法，**注意，只要是查询DOM中的某些元素，浏览器都会搜索整个DOM树**,因此这样子效率是很低的，浪费了一次搜索，我们可以改成以下：
```
var links = document.getElementsByTagName("a");
if (links.length > 0) {
    for (var i=0; i<links.length; i++){
        //对每个链接做点处理
    }
}
```
- 合并和放置脚本，将多个脚本合并，可以减少加载页面时发送的请求数量。
- 压缩脚本

## 共享onload事件
- 如果想让onload事件绑定多个函数
```
window.onload = firstFunction();
window.onload = secondFunction();
```
这样写只有最后一句会被实际执行
- 简单的方法
```
window.onload = function() {
    firstFunction();
    secondFunction();
}
```
- 弹性最佳的方法
```
function addLoadEvent(func) {
    var oldLoad = window.onload;
    if (typeof window.onload != "function") {
        window.onload = func;
    } else {
        window.onload = function() {
            oldLoad();
            func();
        }
    }
}
```

## 不要做太多的架设
- 不要假设getElementById一定可以返回正确的对象，也许ID是不存在的
- 不要假设showPic()一定能正常返回，要考虑到当函数未返回预期值，页面也能正确的执行

## 键盘访问
- onkeypress事件处理函数
- 实际上，onclick也可以会被回车键触发
- 尽量多使用onclick,因为onkeypress可能会导致一些问题

