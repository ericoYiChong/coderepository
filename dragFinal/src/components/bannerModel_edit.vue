<template>
    <div class="bannerEdit" @click.stop="onFocus">
        <div class="head">
            <p>{{dragContent[index].componentName}}</p>
            <div class="hidePanel">
                <i class="iconfont icon-close" @click="hideEdit"></i>
            </div>
        </div>
        <div class="content">
            <div class="tips">
                <p class="tipTitle">
                    <span class="title">上传图片</span>
                    <span class="tipRequired">*</span>
                </p>
                <p class="tipContent">建议图片宽度750,高度275，支持类型:jpg、png。要求一组内的图片高度必须完全一致。</p>
            </div>
            <div class="picContent">
                <div  class="picItem" :index="i" v-for="(v,i) in saveContent" :key="i">
                    <div class="itemMove">
                        <div class="up">
                            <i :class="[{'notAllow':i == 0},'iconfont','icon-arrowup']" @click="toUp(i)"></i>
                        </div>
                        <div class="down">
                            <i :class="[{'notAllow':i == saveContent.length-1},'iconfont','icon-arrowdown']" @click="toDown(i)"></i>
                        </div>
                    </div>
                    <div class="addPic">
                        <div :class="['add',{'alert':v.imgRequired}]" @mouseover="mouseover(i)" @mouseout="mouseout(i)">
                            <span class="addicon" v-show=" v.srcImg===''|| v.srcImg === defaultImg ">
                                <i class="iconfont icon-i-add"></i>
                            </span>
                            <img :class="'showPic'+i" :src="v.srcImg" ref="uploadPic" v-show="v.srcImg && v.srcImg !== defaultImg">
                            <div class="hoverContent" v-show="v.showAdd">
                                <span class="upload" @click="addPic(i)">{{v.uploadButtonName}}</span>
                            </div>
                            <div class="loadingContent" v-show="isShowLoading&&i==nowUpload">
                                <div class="loading">
		  							              <i class="el-icon-loading"></i>
		  						              </div>
                            </div>
                        </div>
                        <div class="picLink">
                            <span class="linkContent">
                                <input class="link text" v-model="v.url" type="text" placeholder="请输入合法的无线连接">
                                <i class="iconfont icon-close" @click="clearItem" v-show="v.url"></i>
                                <i class="iconfont icon-link"></i>
                            </span>
                        </div>
                    </div>
                    <div class="deletePic" @click="deleteThis(i)">
                        <i :class="[{'notAllow': saveContent.length == 1},'iconfont','icon-trash']"></i>
                    </div>
                </div>
                <div class="panelAdd" @click="addContent">
                    <i class="iconfont icon-i-add"></i>
                    添加 {{saveContent.length}} / {{maxPicContainer}}
                </div>
            </div>
        </div>
        <div class="whiteSpace">
            <label>
                <span class="iconfont">
                    <span class="boxChecked">
                        <i class="iconfont icon-check" v-show="checkboxvalue"></i>
                    </span>
                    <input type="checkbox" v-model="checkboxvalue" class="checkbox" style="display:none">
                </span>
                <span class="checkboxLabel">隐藏模块下方的间隙</span>
            </label>
        </div>
        <div class="editorFooter">
            <button class="saveBtn" @click="saveChange">保存</button>
        </div>
        <input type="file" accept="image/*" @change="picUpload" ref="file">
    </div>
</template>
<script>
import {mapState,mapMutations } from 'vuex';
export default {
    props:{
        index:{
            type:Number,
            required:false
        }
    },
    data(){
        return {
            picSrc:[],
            defaultImg:'https://gw.alicdn.com/tfs/TB1nkM1SXXXXXXmaXXXXXXXXXXX-750-359.gif',
            isShowLoading:false,//加载动画
            nowUpload:0,//当前进行图片上传的位置
            goodCategory:0, //查询类别选择
            checkboxvalue:this.$store.state.dragContent[this.index].data.hideBlank,//隐藏下方空白
            maxPicContainer:7
        }
    },
    computed:{
        ...mapState(['dragContent','curIndex']),
        saveContent(){
            this.picSrc = this.$store.state.dragContent[this.index].data.swiperImg;
            return this.picSrc;
        }
    },
    watch:{
        checkboxvalue(){
            this.$emit('whiteSpace',this.checkboxvalue);
        },
        goodCategory(curVal,oldVal){
            if(parseInt(curVal) == 0){
                this.linkPlaceholder = '输入商品ID或者商品名称';
            }else{
                this.linkPlaceholder = '输入类目名称';
            }
        },
    },
    methods:{
        prevent(){},
        //鼠标移入
        mouseover(i){
            let data = {
                pIndex:this.index,
                index:i
            }
            this.$store.commit('mouseover',data)
        },
        //鼠标移出
        mouseout(i){
            let data = {
                pIndex:this.index,
                index:i
            }
            this.$store.commit('mouseout',data)
        },
        //上传图片触发
        addPic(i){
            this.nowUpload = i;
            this.$refs.file.click();
        },
        //图片上传
        picUpload(){
            this.isShowLoading = true;
            let reader = new FileReader();
            let file = this.$refs.file.files[0];
            let imgUrlBase64;
            if(file){
              imgUrlBase64 = reader.readAsDataURL(file);
              reader.onload = (e)=>{
                let index = this.nowUpload
                this.picSrc[index].srcImg = reader.result;
                this.picSrc[index].imgRequired = false;
                this.picSrc[index].uploadButtonName = "替换图片";
                this.isShowLoading = false;
              }
            }
        },
        //清除商品
        clearItem(){
            this.picSrc[this.popIndex].url = '';
        },
        //增加图片容器
        addContent(){
            if(this.picSrc.length < this.maxPicContainer){
                this.picSrc.push({
                    showAdd:false,
                    imgRequired:false,
                    srcImg:this.defaultImg,
                    url:'',
                    uploadButtonName:'上传图片',//按钮提示文字
                })
            }else{
                this.$message({type:'error',message:'最多只能有'+this.maxPicContainer+'张图片！'})
            }
        },
        //容器上移
        toUp(index){
            let data = {
                pIndex:this.index,
                index:index
            };
            this.$store.commit('bannerToUp',data);
        },
        //容器下移
        toDown(index){
            let data = {
                pIndex:this.index,
                index:index
            };
            this.$store.commit('bannerToDown',data);
        },
        deleteThis(index){
            this.picSrc.splice(index,1);
        },
        saveChange(){
            let checkEmpty = (()=>{
                for(let i=0;i<this.picSrc.length;i++){
                    if(this.picSrc[i].srcImg == this.defaultImg){
                        this.picSrc[i].imgRequired = true;
                        this.$message({type:'error',message:'图片必须上传'});
                        return false;
                    }
                }
                return true;
            })()
            if(checkEmpty){
                this.$message({type:'success',message:'保存成功'});
                this.$store.state.curIndex = undefined;
            }
        },
        hideEdit(){
            this.$store.state.dragContent[this.index].isShowEdit = false;
        },
        onFocus(evt){
            if(evt.target.nodeName == 'INPUT'){
                evt.target.focus()
            }else{
                let len = document.getElementsByClassName('text').length;
                for(let i=0;i<len;i++){
                    document.getElementsByClassName('text')[i].blur();
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .head{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 49px;
        border-bottom: 1px solid #ccc;
        p{
            color: #999999;
            flex: 1;
        }
        i{
            color: #999999;
        }
    }
    .content{
        margin: 15px 0;
        .tips{
            .tipTitle{
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-bottom: 6px;
                .title{
                    color: #999;
                    font-size: 12px;
                    line-height: 12px;
                    margin-bottom: 0;
                }
                .tipRequired{
                    color: red;
                    margin: 0 5px;
                }
            }
            .tipContent{
                color: #a2a2a2;
                font-size: 12px;
                line-height: 16px;
                margin-bottom: 10px;
            }
        }
        .picContent{
            .picItem{
                display: flex;
                flex-direction: row;
                margin-bottom: 10px;
                background-color: #f9f9f9;
                .itemMove{
                    width: 25px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    cursor: pointer;
                    i{
                        color: #999;
                        font-size: 12px;
                        margin: 8px 0;
                    }
                }
                .addPic{
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    .add{
                        width: 70px;
                        height: 50px;
                        position: relative;
                        background: #f4f4f4;
                        position: relative;
                        text-align: center;
                        border: 1px solid #f4f4f4;
                        margin-right: 5px;
                        display: flex;
                        align-items: center;
                        cursor: pointer;
                        &.alert{
                            border-color: red;
                        }
                        .addicon{
                            display: inline-block;
                            width: 100%;
                            height: 100%;
                            line-height: 50px;
                            text-align: center;
                        }
                        img[class*='showPic']{
                            max-width: 100%;
                            max-height: 100%;
                            margin: 0 auto;
                        }
                        .hoverContent{
                            flex-direction: row;
                            align-items: center;
                            position: absolute;
                            top: 0;
                            left: 73px;
                            width: 210px;
                            height: 100%;
                            background-color: #f9f9f9;
                            text-align: center;
                            z-index: 1;
                            .upload{
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 80px;
                                height: 30px;
                                margin:9px auto;
                                background-color: #fff;
                                border: 1px solid #666;
                                border-radius: 2px;
                                font-size: 12px;
                                color: #333;
                            }
                        }
                        .loadingContent{
                            position: absolute;
                            top: 0;
                            left: 0;
                            bottom: 0;
                            right: 0;
                            background: rgba(200, 200, 200, .5);
                            .loading{
                                margin: 18px 0 0 0;

                            }
                        }
                    }
                    .picLink{
                        // width: 170px;
                        position: relative;
                        display: flex;
                        flex-direction: row;
                        .linkContent{
                            position: relative;
                            padding-right: 25px;
                            display: inline-table;
                            border-collapse: separate;
                            overflow: visible;
                            border: 1px solid #E6E6E6;
                            border-spacing: 0;
                            background-color: #FFFFFF;
                            transition: all 0.3s ease-out;
                            .link{
                                display: table-cell;
                                outline: none;
                                font-size: 12px;
                                color: #999;
                                height: 26px;
                                line-height: 26px;
                                margin: 0;
                                padding: 0 12px 0 8px;
                                border: none;
                            }
                            i.icon-link{
                                position: absolute;
                                top: 5px;
                                bottom: 0;
                                right: 5px;
                                color: #666;
                                &:hover{
                                    color: #3089DC;
                                }
                            }
                            i.icon-close{
                                display: inline-block;
                                width: 10px;
                                height: 10px;
                                padding: 2px;
                                position: absolute;
                                top: 6px;
                                right: 25px;
                                background: #ccc;
                                border-radius: 50%;
                                font-size: 10px;
                                color: #fff;
                            }
                        }
                    }
                }
                .deletePic{
                    color: #999;
                    width: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    i{
                        font-size: 16px;
                    }
                }
            }
            .panelAdd{
                margin-top: 16px;
                display: flex;
                width: 100%;
                height: 40px;
                line-height: 40px;
                justify-content: center;
                background-color: #f4f4f4;
                color: #666;
                font-size: 12px;
                cursor: pointer;
                i{
                    display: inline;
                    font-size: 12px;
                    padding-right: 5px;
                }
            }
        }
    }
    .whiteSpace{
        margin:15px 0;
        .iconfont{
            display: inline-block;
            vertical-align: middle;
            position: relative;
            width: 14px;
            height: 14px;
            line-height: 12px;
            .boxChecked{
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #FFFFFF;
                border-radius: 2px;
                border: 1px solid #999999;
                transition: ease all 0.3s 0s;
                &:hover{
                    border-color: #3089DC;
                    background-color: #F1F7FE;
                }
                i{
                    font-size: 12px;
                    color: #3089DC;
                    // opacity: 0;
                }
            }
        }
        .checkboxLabel{
            margin-top: 2px;
            font-size: 12px;
            color: #666;
        }
    }
    .editorFooter{
        padding-top: 10px;
        border-top: 1px solid #ccc;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .saveBtn{
            margin: 0 10px 0;
            color: #333333;
            border-color: #333333;
            text-decoration: none;
            outline: 0;
            height: 28px;
            padding: 0 16px;
            font-size: 12px;
            line-height: 26px;
            border-width: 1px;
            border-style: solid;
            position: relative;
            display: inline-block;
            background: transparent;
            transition: all .3s ease-out;
            cursor: pointer;
            box-shadow: none;
            border-radius: 2px;
            text-align: center;
            &:hover{
                background-color: #E6E6E6;
            }
        }
    }
    i.notAllow{
        color: #ddd!important;
        cursor: not-allowed;
    }
    input[type='file']{
        display: none;
    }
    input[type='radio']{
        vertical-align: middle;
        margin-right: 3px;
    }
    .rrg-pop .checkGood {
        width: 600px;
        .popTitle{
            display: flex;
            justify-content: space-between;
            padding-left: 10px;
            label{
                height: 100%;
                line-height: 38px;
            }
        }
        .picBoc{
            width: 570px;
            height: 256px;
            margin: 14px;
            border: 1px solid #BEBEBE;
            input{
                border-bottom: 1px solid #BEBEBE;
                height: 39px;
                padding: 0 5px;
                width: 419px;
            }
            .search{
                width: 106px;
                line-height: 18px;
                float: right;
            }
            .main{
                width: 100%;
                ul{
                    overflow: auto;
                    height: 215px;
                    li{
                        line-height: 30px;
                        color: #666;
                        span:first-child{
                            overflow: hidden;
                            padding: 0 8px;
                            line-height: 40px;
                            cursor: pointer;
                            &:hover{
                                background: #f1f1f1;
                            }
                            & + span::before {
                                content: "》";
                            }
                        }
                        &.active{
                            color: #fff;
                            background: #A2CEEB;
                        }
                    }
                }
                .loading{
                    padding: 30px 0;
                    text-align: center;
                    color: #ccc;
                    i{
                        display: block;
                        font-size: 30px;
                        color: #ccc;
                    }
                }
            }
        }
        .curentSelect{
            margin: 0 0 0 15px;
            height: 30px;
            span{
                font-size: 14px;
                color: #333333;
                line-height: 30px;
                b{
                    color: #d15b47;
                    & + b:before{
                        content: '》';
                        margin-left: 5px;
                    }
                }
            }
        }
	}
</style>


