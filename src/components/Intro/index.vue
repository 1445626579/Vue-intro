<template>
  <div v-if="visible" v-show="isShow" class="intro_mask" @click.self="maskClickNext">
    <div class="visibleBlock"  @click.self="maskClickNext" :class="{isStart:config.isStart}" :style="visibleBlockStyle">
      <div :style="msgStyle" :class="['intro_msg',config.introTipsClass||'']">
        <init-bg  v-if="!customBackground" :isStart="config.isStart"></init-bg>
        <div class="intro_content">
          <div class="intro_tips">
            <intro-tips :node="$slots.default[index]"></intro-tips>
          </div>
          <div class="intro_control" :style="controlStyle">
            <slot name="control" :config="config" :prev="prev" :next="next">
              <button v-if="config.hasPrevButton&&index!==0" class="intro_control_prev" type="button" @click="prev">{{ config.prevButtonText || prevButtonText }}</button>
              <button v-if="config.hasNextButton" class="intro_control_next" type="button" @click="next">{{ this.getNextBtnText() }}</button>
            </slot>
          </div>
          <button v-if="showClose" class="intro_control_close" type="button" @click="close">关闭引导</button>
        </div>
        <div v-if="config.isStart&&showClose" class="intro_close" @click="close">
          <span class="intro_close_icon"></span>关闭
        </div>
      </div>
    </div>
    <div class="visibleBlockInset" :style="visibleBlockInsetStyle" />
  </div>
</template>
<script>
import IntroUtils from "./utils"
import initBg from "./bg"
export default {
  name: 'Intro',
  props: {
    introList: {
      type: Array,
      default: () => [{}]
    },
    visible:{
      type:Boolean,
      default:false
    },
    customBackground:{
      type:Boolean,
      default:false
    },
    nextButtonText:{
      type:String,
      default:"下一步"
    },
    startButtonText:{
      type:String,
      default:"开始引导"
    },
    endButtonText:{
      type:String,
      default:"完成引导"
    },
    prevButtonText:{
      type:String,
      default:"上一步"
    },
    // 目标元素框与元素之间的间距
    initInsetPadding:{
      type:Number,
      default:5
    },
    // 目标元素框与border之间的间距
    initPadding:{
      type:Number,
      default:0
    },
    // 目标元素框与提示信息之间的间距
    indent:{
      type:Number,
      default:10
    },
    maskClick:{
      type:Boolean,
      default:false
    },
    showClose:{
      type:Boolean,
      default:true
    }
  },
  components:{
    introTips:{
      render(){
        return this.node
      },
      props:{
        node:{
          type:[Object,Array],
          required:true
        }
      }
    },
    initBg
  },
  watch:{
    visible(val){
      if(val){
        this.setVisibleStyle()
        const body = document.querySelector('body')
        const { height, overflow } = body.style
        this.bodyStyle = { height, overflow }
        if (height !== '100%') {
          body.style.height = '100%'
        }
        if (overflow !== 'hidden') {
          body.style.overflow = 'hidden'
        }
      }else{
        const body = document.querySelector('body')
        body.style.height = this.bodyStyle.height
        body.style.overflow = this.bodyStyle.overflow
      }
    }
  },

  data() {
    return {
      index: 0,
      visibleBlockStyle: {},
      msgStyle: {},
      visibleBlockInsetStyle: {},
      bodyStyle: {
        height: '',
        overflow: ''
      },
      controlStyle: {},
      isShow:true,
      config:{},
    }
  },
  methods: {
    maskClickNext(){
      if(this.maskClick||this.config.isStart){
        this.next()
      }
    },
    async setVisibleStyle() {
      await this.beforeEnter(this.index)
      if(this.$slots.default.length<this.introList.length){
        console.error("新手引导提示信息个数小于步骤数,请确认新手引导信息")
        return
      }
      IntroUtils.initInsetPadding = this.initInsetPadding
      IntroUtils.initPadding = this.initPadding
      IntroUtils.indent = this.indent
      IntroUtils.nextButtonText = this.nextButtonText
      IntroUtils.prevButtonText = this.prevButtonText
      const { width : tipsWidth, height :tipsHeight } = this.introList[this.index].introTipsStyle||{}
      const introUtils = new IntroUtils(this.introList[this.index],{ offsetWidth:parseInt(tipsWidth) || 397, offsetHeight:parseInt(tipsHeight) || 207 },this.index)
      this.config = introUtils.config
      if (this.config.isStart) {
        this.visibleBlockStyle = { border: 'none', width: '100%', height: '100%' }
        this.msgStyle={}
        this.visibleBlockInsetStyle={}
        return
      }

      const { width, height, isVisible } = introUtils.getElementPosition()

      if (width === 0 || height === 0) {
        console.error('元素的宽度或高度为0，请检查一下元素是否已加载完成')
        return
      }

      if (!isVisible) {
        console.error('元素不在可见区域')
        introUtils.domScrollToVisble()
        return
      }

      // 可视区域外边框样式
      this.visibleBlockStyle = introUtils.getVisbleBlockStyle()

      // 可视区域边框样式
      this.visibleBlockInsetStyle = introUtils.getInsetStyle()

      this.msgStyle = { ...introUtils.getIntroTipsPosition(), ...introUtils.config.introTipsStyle }
      this.controlStyle = introUtils.config.controlStyle
    },
    async beforeEnter(index){
      if(typeof this.introList[index].beforeEnter==="function"){
        try{
          await this.introList[index].beforeEnter(index)
        }catch(e){
          console.error( `第${index}步的beforeEnter函数出错了，\n错误信息：` + e)
        }
      }
      this.$emit('beforeEnter',index) 
    },
    async next() {
      this.isShow = false
      if (this.index >= this.introList.length - 1) {
        this.theEnd(this.index)
      } else {
        this.index++
        this.$emit('update:introIndex',this.index)
        await this.setVisibleStyle()
        this.$emit('next', this.index)
      }
      this.isShow = true
    },
    async prev() {
      this.isShow = false
      if (this.index !== 0) {
        this.index--
        this.$emit('update:introIndex',this.index)
        await this.setVisibleStyle()
        this.$emit('prev',this.index)
      }
      this.isShow = true
    },
    theEnd(index) {
      this.$emit('update:visible',false)
      this.$emit('theEnd', index)
    },
    //当this.close return false时 不触发close事件
    close() {
      this.$emit('update:visible',false)
      this.$emit('close',this.index)
    },
    getNextBtnText(){
      switch(this.index){
        case 0 :
          return this.startButtonText
        case this.introList.length - 1:
          return this.endButtonText
        default:
          return this.config.nextButtonText || this.nextButtonText
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
.intro_mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  & *{
    box-sizing:border-box ;
  }
  .visibleBlock {
    border-radius: 5px;
    box-sizing: border-box;
    position: absolute;
    border-style:dashed;
    border-color: #448AFF;
    border-width: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .intro_content{
    position: relative;
    padding-left: 15px;
    .intro_tips{
      min-height: 77px;
      font-size: 14px;
      line-height: 26px;
      color: #2B2B2B;
    }
  }
  .visibleBlockInset{
      position: absolute;
      border-radius: 5px;
      box-shadow: 0 0 0 150vw rgba($color: #000, $alpha: 0.3);
  }
  .intro_control_close {
      background-color: transparent;
      border: none;
      outline: none;
      color: #2b2b2b;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      text-decoration: underline;
      display: none;
      margin-top: 20px;
    }
  .intro_control {
    display: flex;
    align-items: center;
    justify-content:center;
    margin-top: 11px;
    button {
      background-color: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      margin: 0 11px;
    }
    
    .intro_control_next {
      background-color: #ffb12b;
      border-radius: 16px;
      padding: 5px 22px;
      //position: relative;
      box-shadow: 0 4px 0 0px #bf8320;
    }
    .intro_control_prev {
      background-color: #357dfa;
      box-shadow: 0 4px 0 0px #00389e;
      border-radius: 16px;
      padding: 5px 22px;
    }

  }
  .intro_close{
    width: 50px;
    position: absolute;
    right: 23px;
    top: 14px;
    font-size: 14px;
    text-decoration: underline;
    color: #fff;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .intro_msg {
    position: absolute;
    z-index: 100001;
    width: 397px;
    height: 207px;
    padding-top: 42px;
    svg{
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .intro_close_icon{
    width: 16px;
    height: 16px;
    margin-right: 4px;
    position: relative;
    display: inline-block;
    &::before,&::after{
      position: absolute;
      left: 7px;
      top: 0;
      content: '';
      width: 4px;
      height: 16px;
      transform: rotate(45deg) scaleX(.5);
      border-radius: 1px;
      background-color: #fff;
    }
    &::after{
      content: '';
      transform: rotate(-45deg) scaleX(.5);
    }
  }
  .isStart{
    .intro_control_close{
      display:inline-block;
    }
    .intro_msg{
      width: 446px;
      height: 314px;
    }
    .intro_tips{
      line-height: 45px;
      padding-left: 55px;
      padding-right:75px ;
      min-height: 127px;
    }
  }
}
</style>
