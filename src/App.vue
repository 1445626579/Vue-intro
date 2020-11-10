<template>
  <div id="app">
    <div id="box">
      <div id="test1"></div>
      <div id="test2">
        <div id="test6"></div>
        <div id="test7"></div>
        <div id="test8"></div>
      </div>
      <div id="test3">
        <div id="test4"></div>
        <div id="test5"></div>
      </div>
    </div>
    <abk-intro :visible.sync="visible" :introList="introList" maskClick>
      <!-- <template v-slot:control="props">
        <span @click="props.next">{{props.config.nextButtonText}}</span>
        <span @click="props.prev">{{props.config.prevButtonText}}</span>
      </template> -->
      <div><span>start</span></div>
      <div>test1</div>
      <div>test2</div>
      <div>test3</div>
      <div>test7</div>
      <div>test6</div>
      <div>test8</div>
    </abk-intro>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'


export default {
  name: 'App',

  data(){
    return {
      introList:['start','#test1','#test2',
      {
        targetEl:"#test3",
        nextButtonText:'接下来',
        prevButtonText:'回头看看',
        beforeEnter(){
          return new Promise((resolve)=>{setTimeout(resolve,1000)})
        },
        introTipsStyle:{
          width:'500px',
          height:'600px'
        }
      },'#test7','#test6','#test8'],
      visible:false
    }
  },
  mounted(){
    this.visible=true
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#box{
  height: 100vh;
}
#test1{
  height: 100px;
}
#test2{
  height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#test2>div{
  width: 200px;
  height: 100%;
}
#test3{
  height: 400px;
  overflow: scroll;
  position: relative;
}
#test4,#test5{
  height: 900px;
  background-color: #2c3e50;
}

#test5{
  background-color: blue;
}
</style>
