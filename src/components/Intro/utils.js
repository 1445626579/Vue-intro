export default 
class IntroConfig {
  /**
   * 
   * @param {Object} config 本次新手引导的设置
   * @param {*} tipsElSize 新手引导提示信息的大小，用来判断新手引导提示的位置
   */
  constructor(config,tipsElSize,index){
    const defaultSetting={
      hasPrevButton:true,
      hasNextButton:true,
      introTipsStyle:{},
      controlStyle:{},
      isStart:index===0,
      ...(Object.keys(IntroConfig).reduce((obj,key)=>{obj[key]=IntroConfig[key]; return obj},{}))
    }
    if(typeof config === "string"){
      config={
        targetEl:config,
        ...defaultSetting
      }
    }else if(this.isObject(config)){
      config={
        ...defaultSetting,
        ...config
      }
    }else{
      console.error("config必须是一个对象或DOM选择器字符串")
      return
    }
    this.el = this.getElment(config.targetEl)
    if(!this.el&&!config.isStart){
      console.error(config.targetEl+"元素不存在")
      return 
    }
    this.config = config
    // 设置初始边距与边框
    
    const { offsetWidth, offsetHeight }= tipsElSize
    
    this.tipsElWidth = offsetWidth
    this.tipsElHeight = offsetHeight
    console.log(offsetWidth, offsetHeight)
    const INDENT = 10
    this.tipsIndent = this.config.indent || INDENT
    const INIT_PADDING = 0
    this.initPadding = this.config.initPadding || INIT_PADDING
    this.initInsetPadding = this.config.initInsetPadding || INIT_PADDING
  }
  /**
   * 获取真正的距离元素顶部距离
   * @param {DOM} el 目标元素
   * @param {Number} init 初始值
   * @param {Boolean} isTop 获取的值是否为top
   */
  getOffsetValue=(el, isTop=true, init=0)=>{
    const attr = isTop ? 'offsetTop':'offsetLeft'
    if(el.offsetParent===document.querySelector('body')){
      return el[attr]+init
    }
    return this.getOffsetValue(el.offsetParent,el[attr]+init,isTop)
  }
  getElment(el){
    return typeof el === 'string' ? document.querySelector(el) : el
  }
  isObject(target){
    return Object.prototype.toString.call(target)==="[object Object]"
  }
  //获取元素的位置信息
  getElementPosition() {
    if(this.elementPosition) return this.elementPosition
    const { bottom, top, left, right } = this.el.getBoundingClientRect()
    const {
      scrollX,
      scrollY,
      screen: { height: screenHeight, width: screenWidth }
    } = window
    const width = right - left
    const height = bottom - top
    const absoTop = top - scrollY
    const asboLeft = left - scrollX
    this.elementPosition = {
      bottom,
      left,
      top,
      right,
      scrollX,
      scrollY,
      screenHeight,
      screenWidth,
      width,
      height,
      asboLeft,
      absoTop,
      isVisible:
        top >= 0 &&
        left >= 0 &&
        top - scrollY <= screenHeight &&
        left - scrollX <= screenWidth,
      offsetTop:this.getOffsetValue(this.el),
      offsetLeft: this.getOffsetValue(this.el,false)
    }
    return this.elementPosition
  }
  //获取引导指向的元素样式
  getVisbleBlockStyle(){
    const {
      extraPaddingTop = this.initPadding,
      extraPaddingLeft = this.initPadding,
      insetPaddingTop = this.initInsetPadding,
      insetPaddingLeft = this.initInsetPadding,
      borderWidth = 3,
      isStart = false,
    } = this.config
    const { width, height, top, left } = this.getElementPosition()
    if (isStart) {
     return { border: 'none', width: '100%', height: '100%' }
    }
    return {
      width: width + (extraPaddingLeft + insetPaddingLeft + borderWidth) * 2  + 'px',
      height: height + (extraPaddingLeft + insetPaddingTop + borderWidth) * 2  + 'px',
      left: left - extraPaddingLeft - insetPaddingLeft - borderWidth  + 'px',
      top: top - extraPaddingTop - insetPaddingTop - borderWidth  + 'px',
      padding: `${extraPaddingTop}px ${extraPaddingLeft}px `,
      borderWidth:borderWidth+'px'
    }
  }
  //引导指向的元素
  getInsetStyle(){
    const {
      insetPaddingTop = this.initInsetPadding,
      insetPaddingLeft = this.initInsetPadding,
      // extraPaddingTop = this.initPadding,
      // extraPaddingLeft = this.initPadding
    } = this.config
    const { width, height, top, left } = this.getElementPosition()
    return {
      width: width + insetPaddingLeft * 2 + 'px',
      height: height + insetPaddingTop * 2 + 'px',
      left: left - insetPaddingLeft + 'px',
      top: top - insetPaddingTop + 'px',
      padding: `${insetPaddingTop}px ${insetPaddingLeft}px `
    }
  }
  //获取新手引导提示信息的位置
  getIntroTipsPosition(){
    const { left, right, top, bottom, screenHeight, screenWidth } = this.getElementPosition(this.el)
    let style = { }
    //判断左右可以放下提示信息的位置
    if( screenWidth - right > this.tipsElWidth + this.tipsIndent ) {
      style.left = `calc(100% + ${this.tipsIndent}px)`
    } else if ( left > this.tipsElWidth + this.tipsIndent) {
      style.right = `calc(100% + ${this.tipsIndent}px)`
    } else {
      style.left = "50%"
      style.transform = "translateX(-50%)"
    }
    if( screenHeight - bottom  > this.tipsElHeight) {
      style.top = Reflect.has(style,'transform') ? `calc(100% + ${this.tipsIndent}px)`:'0px'
    } else if ( top  > this.tipsElHeight) { 
      style.bottom = Reflect.has(style,'transform') ? `calc(100% + ${this.tipsIndent}px)`:'0px' 
    } else {
      style.top = "50%"
      style.transform = Reflect.has(style,'transform') ? "translate(-50%)" : "translateY(-50%)"
    }
    return style
  }
  /**
   * 当元素在当前DOM中如果不可见,则滚动至可见区域
   * 后续优化
   */
  domScrollToVisble () {
    const  offsetTop = this.getOffsetValue(this.el)
    //const  offsetLeft = this.getOffsetValue(this.el,false)
    window.scrollTo(0, offsetTop)
  }
  
}