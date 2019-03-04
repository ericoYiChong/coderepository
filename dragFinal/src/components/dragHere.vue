<template>
  <div class="dragPanel">
    <draggable :options="dragOption_2" class="app-sort item">
        <div class="" v-for="(i,v) in dragContent" :key="v">
            <div
                :is="i.dragcomponentName"
                :index="v"
                @changeUsedNum="changeUsedNum"
            >
            </div>
        </div>
    </draggable>
  </div>
</template>
<script>
import { mapState,mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import bannerModel from './bannerModel';
import singlePicModel from './singlePicModel';
export default {
  data(){
      return {
          dragOption_2: {
              group: {
                  name: 'drag', //这个很重要，其他的与之能产生关联的拖拽框就靠这name 一定要一致
                  pull: false,
                  put: true,
              },
              sort: false,
              animation: 150,
              filter:'.item'
          },
      }
    },
    components:{
        draggable,bannerModel,singlePicModel
    },
    computed:{
      ...mapState(['dragContent'])
    },
    methods:{
      changeUsedNum(data){
          this.$emit('changeUsedNum',data);
      },
    }
}
</script>
<style lang="less" scoped>
  @import url('http://at.alicdn.com/t/font_841014_xtn0hsu7p8.css');
    .dragPanel{
        width: 100%;
        text-align: center;
        .app-sort{
            width: 100%;
            min-height: 100px;
            border: 1px solid #e6e6e6;
        }
    }
</style>

