<template>
    <div :class="[{'active':index == curIndex},'singlePicContent']" ref="singlePicContent"  @click.stop.prevent="getIndex">
        <div class="picContent">
            <div class="imgItem">
                <img :src="dragContent[index].data.imgUrl">
            </div>
            <div class="textContent" v-show="dragContent[index].data.textContent">
                {{dragContent[index].data.textContent}}
            </div>
        </div>
        <div class="editContainer" @click.stop="prevent">
            <div class="modelName" v-show="index !== curIndex">{{dragContent[index].componentName}}</div>
            <div class="editPanel" v-show="index === curIndex">
                <div :class="[{'active':dragContent[index].isShowEdit},'edit']">
                    <i class="iconfont icon-setting" @click.stop="showEdit(index)"></i>
                </div>
                <div class="up">
                    <i @click.stop="goUp" :class="[{'notAllow':index == 0},'iconfont','icon-arrowup']"></i>
                </div>
                <div class="down">
                    <i @click.stop="goDown" :class="[{'notAllow':index == dragContent.length-1},'iconfont','icon-arrowdown']"></i>
                </div>
                <div class="delete">
                    <i @click.stop="deleteThis" class="iconfont icon-trash"></i>
                </div>
                <singlePicModel @whiteSpace="whiteSpace" :index="this.index" v-show="dragContent[index].isShowEdit"></singlePicModel>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState,mapMutations } from 'vuex';
import singlePicModel from './singlePicModel_edit';
export default {
    props:{
        index:{
            type:Number
        }
    },
    components:{
        singlePicModel
    },
    computed:{
        ...mapState(['dragContent','curIndex']),
    },
    methods:{
        prevent(evt){},
        getIndex(evt){
            console.log(evt.target)
            if(this.index !== this.$store.state.curIndex){
                this.$store.state.curIndex = this.index;
            }else{
                this.$store.state.curIndex = undefined;
            }
        },
        showEdit(){
            this.$store.state.dragContent[this.index].isShowEdit = !this.$store.state.dragContent[this.index].isShowEdit;
        },
        goUp(){
            this.$store.commit('goUp',this.index);
        },
        goDown(){
            this.$store.commit('goDown',this.index);
        },
        deleteThis(){
            console.log('delete')
            let data = {
                ccId:this.$store.state.dragContent[this.index].ccId,
                componentId:this.$store.state.dragContent[this.index].componentId
            }
            this.$emit('changeUsedNum',data);
            this.$store.commit('deleteThis',this.index);
        },
        whiteSpace(res){
            console.log(res)
            if(!res){
                this.$refs.singlePicContent.style.marginBottom = '20px';
            }else{
                this.$refs.singlePicContent.style.marginBottom = '15px';
            }
        },

    }
}
</script>
<style lang="less" scoped>
    .singlePicContent{
        position: relative;
        height: 171px;
        margin-bottom: 15px;
        // border-width: 2px;
        // border-style: solid;
        // border-color: #F7F7F9 #F7F7F9 transparent #F7F7F9;
        border: 2px solid transparent;
        .picContent{
            height: 100%;
            .imgItem{
                height: 100%;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .textContent{
                width: 100%;
                height: 20px;
                line-height: 20px;
                color: #fff;
                text-align: left;
                text-indent: 10px;
                font-size: 12px;
                position:absolute;
                bottom: 0;
                background:rgba(0, 0, 0, 0.5);
            }
        }
        .modelName{
            position: absolute;
            top: 0;
            right: -40px;
            width: 20px;
            padding: 10px 4px;
            color: #A2A2A2;
            line-height: 1.1em;
            // border: 1px solid #e6e6e6;
            background: #fff;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 6px;
        }
        .editPanel{
            position: absolute;
            top: 0;
            right: -40px;
            padding: 10px 0;
            width: 28px;
            // border: 1px solid #e6e6e6;
            background: #fff;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
            border-radius: 0;
            div{
                padding: 7px 5px;
                font-size: 0;
                background-color: #fff;
                color: #999999;
                text-align: center;
                &.active{
                    color: #3089DC;
                }
            }
            .iconfont{
                cursor: pointer;
                &:hover{
                    color: #3089DC;
                }
            }
            .notAllow{
                color: #ddd;
                cursor: not-allowed;
                &:hover{
                    color: #ddd;
                }
            }
            .singlePicEdit{
                    position: absolute;
                    top: 0;
                    right: -350px;
                    padding: 0 15px 10px;
                    background-color: #fff;
                    // display: flex;
                    flex-direction: column;
                    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
                    width: 330px;
                    // height: 100px;
                    color: #000;
                    font-size: 1em;
                    box-sizing: border-box !important;
                    text-align: left;
            }
        }
    }
    .active{
        border-color: #3089DC;
    }
</style>


