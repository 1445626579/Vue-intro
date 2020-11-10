# intro

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```


Attributes
|参数|说明|类型|默认值|必须
|----|----|----|----|----|
|introList|新手引导元素列表，属性值见下表|Array|是
visible

是否可见	Boolean	false	是
nextButtonText

下一步按钮文案	String	下一步	否
startButtonText

开始按钮文案	String	开始引导	否
endButtonText

完成按钮文案	String	完成引导	否
prevButtonText

上一步按钮文案	String	上一步	否
initInsetPadding

目标元素框与目标元素间的间距	Number	5	否
initPadding

目标元素框与border之间的间距	Number	0	否
indent

目标元素框与提示信息之间的间距	Number	10	否
maskClick

是否开启点击遮罩下一步	Boolean	false	否
showClose

是否展示关闭按钮	Boolean	true	否
customBackground



是否自定义背景图，为true时不显示默认的背景图	Boolean	false	否
IntroList属性说明,如不需要额外的配置，数组元素可以只写目标元素选择器字符串，否则为对象

targetEl

新手引导指向的目标元素，会根据元素所在位置自动计算新手引导位置，

值为css选择器或DOM，推荐使用选择器，DOM可能会有未加载完成的可能

第一步时或isStart时，此属性无效

String|DOM	
是
isStart	是否为开始引导，当展示第一步时默认为true	Boolean	false	否
hasPrevButton

是否展示上一步按钮，当展示第一步时默认为false	Boolean	true	否
hasNextButton

是否展示下一步按钮	Boolean	true	否
nextButtonText	下一步按钮文案，权重大于组件属性	String	下一步	否
prevButtonText	上一步按钮文案，权重大于组件属性	String	上一步	否
introTipsClass	引导提示框的自定义class	String	
否
introTipsStyle

引导提示框样式,宽高请使用px为单位	Object	{}	否
controlStyle

控制按钮区域样式	Object	{}	否
beforeEnter

进入该步骤的新手引导之前的操作，支持Promise。	Function	
否
events

next	点击下一步时的回调	当前索引
prev	点击上一步时的回调	当前索引
theEnd	新手引导结束时的回调	当前索引
close	点击关闭按钮时的回调	当前索引
beforeEnter	不支持Promise，在进入之前调用	当前索引
slots
default	
默认插槽为新手引导的提示信息，会根据元素顺序展示为新手引导的提示信息，第一个子级元素为第一步新手引导的提示信息，以此类推。

子级数量不可低于新手引导步骤数，否则会报错


是
control	控制按钮区域的插槽	
1.config，本次新手引导的设置信息

2.prev，上一步的响应函数

3.next,下一步的响应函数

否
小提示：
1.尽量在mountd后使用

2.如果页面中有图片，mountd后可能有图片未加载完成，图片加载完成时可能会引起页面的重排，重排会导致新手引导获取位置不正确，请等待图片加载完成后开始调用

const imgsLoadFinish = Array.prototype.map.call(document.querySelectorAll('img'),img=>new Promise((resolve,reject)=>{
     img.onload = resolve
     img.onerror = reject
}))
Promise.all(imgsLoadFinish).finally(()=>{
    //开始执行新手引导
})


3.当需要切换tab或请求数据后进行下一步引导时,可以在beforeEnter中等待操作完成执行resolve。

4.当目标元素不在当前可视区域时，需要自行将目标元素调整到可视区域，如使用ScrollTo函数。这时不使用异步函数也可以
