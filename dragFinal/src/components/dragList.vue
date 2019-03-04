<template>
  <div class="drag">
    <draggable class="listContainer" v-model="dragList" :options="dragOption" :move="getData" @end="onEnd">
      <div class="listItem" v-for="v in dragList" :key="v.componentId">
        <div class="componentName">
          <p class="itemPic"></p>
          <p>{{v.componentName}}</p>
          <p>{{v.usedNum?v.usedNum:0}}/{{v.componentMax}}</p>
        </div>
      </div>
    </draggable>
    <div class="dragPlace">
      <dragHere @changeUsedNum="changeUsedNum"></dragHere>
    </div>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
import list from '../state/dragList.js'
import draggable from 'vuedraggable';
import dragHere from './dragHere';
export default {
  name: 'dragList',
  data () {
    return {
      dragList:list.dragList,
      dragOption: {
          group: {
              name: 'drag', //这个很重要，其他的与之能产生关联的拖拽框就靠这name 一定要一致
              pull: 'clone',
              put: false
          },
          sort: false,//默然为true。这里我们只需要他拖拽，无需能拖动排序,
          animation: 150,
      },
      currentDrag:{}
    }
  },
  components:{
    draggable,dragHere
  },
  methods:{
    getData(evt){
      console.log(evt.draggedContext.element);
      this.currentDrag = evt.draggedContext.element;
    },
    onEnd(evt){
      if(evt.from !== evt.to){
        let data = {
          index:evt.newIndex,
          drag:this.currentDrag
        }
        this.$store.commit('newDrag',data);
        this.dragList.forEach(ele=>{
          if(this.currentDrag.componentId == ele.componentId){
            if(ele.usedNum < ele.componentMax){
              ele.usedNum += 1;
            }else{
              this.$message({ type: 'error', message: '已经超过使用次数' });
              this.$store.commit('deleteThis',evt.newIndex)
            }
          }
        })
        this.$store.state.curIndex = evt.newIndex;
      }
    },
    changeUsedNum(res){
      this.dragList.forEach(ele=>{
        if(res.componentId == ele.componentId){
          ele.usedNum -= 1;
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .drag{
    position:relative;
    .listContainer{
      position:fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 1010%;
      font-size: 12px;
      text-align: center;
      border-right: 1px solid #ddd;
      width: 300px;
      .listItem{
        width: 50%;
        cursor: pointer;
        display: inline-block;
        p{
          margin: 0;
          padding: 0;
        }
        .itemPic{
          height: 60px;
          width: 60px;
          margin: 0 auto;
        }
        &:first-child{
          .itemPic{
            background: url('http://gdp.alicdn.com/tps/i2/TB1xURfKFXXXXcHXFXX5fbeYFXX-60-120.png') 0 -20%;
          }
        }
        &:last-child{
          .itemPic{
            background: url('http://gdp.alicdn.com/tps/i1/TB1aVpzKFXXXXbZXXXX5fbeYFXX-60-120.png') 0 -20%;
          }
        }
        &:hover{
          .itemPic{
            background-position: 0 80%;
          }
        }
      }
    }
  }
  .dragPlace{
      width: 375px;
      margin: 0 auto;
      padding: 80px 0;
  }
</style>

