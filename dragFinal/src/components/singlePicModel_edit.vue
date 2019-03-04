<template>
    <div class="singlePicEdit" @click="onFocus">
        <div class="head">
            <p>{{dragContent[index].componentName}}</p>
            <div class="hidePanel">
                <i class="iconfont icon-close" @click="hideEdit"></i>
            </div>
        </div>
        <div class="content">
            <div class="tips">
                <p class="tipTitle">
                    <span class="title">图片</span>
                    <span class="tipRequired">*</span>
                </p>
                <p class="tipContent">建议图片宽度750高度350，支持类型:jpg、png。</p>
            </div>
            <div class="picContent" @mouseover="mouseover" @mouseout="mouseout">
                <div :class="['addTip',{'alert':imgRequired}]">
                    <span v-show=" dragContent[index].data.imgUrl===''|| dragContent[index].data.imgUrl === defaultImg "><i class="iconfont icon-i-add"></i>添加图片</span>
                    <img v-show="dragContent[index].data.imgUrl && dragContent[index].data.imgUrl !== defaultImg" :src="dragContent[index].data.imgUrl">
                </div>
                <div class="hoverContent" v-show="showAdd">
                    <span class="upload" @click="addPic">{{dragContent[index].data.uploadButtonName}}</span>
                    <span class="upload">在线制作</span>
                </div>
            </div>
            <div class="textContent">
                <p class="title">文本内容</p>
                <p class="inputContainer">
                    <input type="text" ref="input_this" class="text" v-model="textContent" placeholder="请输入文本">
                    <span class="wordsLimite" ref="wordsLimite">{{dragContent[index].data.textContent.length}}/19</span>
                </p>

            </div>
            <div class="linkContent">
                <p class="title">链接</p>
                <p class="inputContainer">
                    <input type="text" ref="input_this" class="text" v-model="dragContent[index].data.url" placeholder="请输入无线链接">
                    <i class="iconfont icon-close" @click="clearItem" v-show="dragContent[index].data.url"></i>
                    <i class="iconfont icon-link"></i>
                </p>

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
import { mapState,mapMutations } from 'vuex';
export default {
    props:{
        index:{
            type:Number,
            required:false
        }
    },
    data(){
        return {
            defaultImg:'http://gw.alicdn.com/tfs/TB1kV3QRVXXXXa.XFXXXXXXXXXX-750-376.png_790x10000.jpg',
            showAdd:false,
            textContent:this.$store.state.dragContent[this.index].data.textContent,
            checkboxvalue:this.$store.state.dragContent[this.index].data.isMargin,//隐藏下方空白
            imgRequired:false,//图片必传
            goodCategory:0, //查询类别选择
            checkboxvalue:this.$store.state.dragContent[this.index].data.hideBlank,//隐藏下方空白
        }
    },
    computed:{
        ...mapState(['dragContent','curIndex'])
    },
    watch:{
        textContent(){
            this.$store.state.dragContent[this.index].data.textContent = this.textContent;
            if(this.textContent.length>19){
                this.$refs.wordsLimite.style.color = 'red';
            }else{
                this.$refs.wordsLimite.style.color = '#666';
            }
        },
        checkboxvalue(){
            this.$emit('whiteSpace',this.checkboxvalue);
        },
    },
    methods:{
        prevent(){},
        //显示隐藏编辑
        hideEdit(){
            this.$store.state.dragContent[this.index].isShowEdit = false;
        },
        mouseover(){
            this.showAdd = !this.showAdd;
        },
        mouseout(){
            this.showAdd = !this.showAdd;
        },
        //上传图片触发
        addPic(){
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
                let index = this.nowUpload;
                this.$store.state.dragContent[this.index].data.imgUrl = reader.result;
                this.isShowLoading = false;
              }
            }
        },
        //
        onFocus(evt){
            if(evt.target.nodeName == 'INPUT'){
                evt.target.focus()
            }else{
                let len = document.getElementsByClassName('text').length;
                for(let i=0;i<len;i++){
                    document.getElementsByClassName('text')[i].blur();
                }
            }
        },
        saveChange(){
            let checkEmpty = (()=>{
                if(this.$store.state.dragContent[this.index].data.imgUrl == this.defaultImg){
                    this.imgRequired = true;
                    this.$message({type:'error',message:'图片必须上传'});
                    return false;
                }else if(this.$store.state.dragContent[this.index].data.textContent.length>19){
                    this.$message({type:'error',message:'文本内容字数需控制在19个字符以内！'});
                    return false;
                }
                return true;
            })()
            if(checkEmpty){
                this.$message({type:'success',message:'保存成功'});
                this.$store.state.curIndex = undefined;
            }
        },
        //显示商品或类别选择弹窗
        showPop(){
            this.isShowPop = true;
            this.selectGoodItem = {};
            this.firstName = '';
            this.secondName = '';
            this.thirdName = '';
        },
        //清除商品
        clearItem(){
            this.goodLink = '';
            this.$store.state.dragContent[this.index].data.url = '';
        },
        //搜索商品或类别
        search(){
            this.isShowGoodList = true;
            this.searchGoodsList = [];
            if(this.goodCategory == 0){
                this.searchGoods(this.searchContent)
            }else{
                this.searchCategory(this.searchContent)
            }

        },
        closePop(){
            this.isShowPop = false;
            this.searchContent = '';
            this.searchGoodsList = [];
            this.selectGoodIndex = 0;
            this.isShowGoodList = false;
        },
        //匹配商品接口
        searchGoods(content){
            let _this = this;
            let token = JSON.parse(localStorage.getItem('token')).token
            let adminId = JSON.parse(localStorage.getItem('token')).adminId
            this.$http({
                method:'post',
                url:'/decorateModuleGetGoodsList',
                data:{
                    adminId:adminId,
                    token:token,
                    searchContent:content
                }
            }).then((res) =>{
                if(res.data.code == 10000){
                    _this.searchGoodsList = res.data.extend.success;
                    if(_this.searchGoodsList.length){
                        _this.selectGoodItem = _this.searchGoodsList[0]
                    }
                }else if(res.data.code == 20000) {
                    if(res.data.extend.err_code != '令牌失效'){
                        _this.$message({type: 'error',message: res.data.extend.err_code});
                    }
                    _this.isShowGoodList = false
                }else{
                    _this.isShowGoodList = false
                }
            }).catch(function(err) {
                _this.isShowGoodList = false
            })
        },
        //查找分类接口
        searchCategory(content){
            let _this = this;
            let token = JSON.parse(localStorage.getItem('token')).token;
            let adminId = JSON.parse(localStorage.getItem('token')).adminId;
            this.$http({
                method:'post',
                url:'/cateSelect',
                data:{
                    adminId:adminId,
                    token:token,
                    params:content
                }
            }).then((res) =>{
                if(res.data.code == 10000){
                    _this.searchGoodsList = res.data.extend.success;
                    if(_this.searchGoodsList.length){
                        _this.selectGoodItem = _this.searchGoodsList[0]
                    }
                }else if(res.data.code == 20000) {
                    if(res.data.extend.err_code != '令牌失效'){
                        _this.$message({type: 'error',message: res.data.extend.err_code});
                    }
                    _this.isShowGoodList = false;
                }else{
                    _this.isShowGoodList = false;
                }
            }).catch(function(err) {
                console.log(err);
                _this.isShowGoodList = false;
            })
        },
        //选择商品
        selectedGood(item, index) {
            this.selectGoodItem = item;
            this.selectGoodIndex = index;
            this.secondName = ''
            this.thirdName = ''
            this.firstName = item.name
            this.firstId = item.categoryId
            if (item.child_goods_category && item.child_goods_category.length) {
                this.secondName = item.child_goods_category[0].name
                this.secondId = item.child_goods_category[0].categoryId
                if (item.child_goods_category[0].child_goods_category && item.child_goods_category[0].child_goods_category.length) {
                    this.thirdName = item.child_goods_category[0].child_goods_category[0].name
                    this.thirdId = item.child_goods_category[0].child_goods_category[0].categoryId
                }
            }
        },
        //确认选择商品或者分类
        confirmSelect() {
            if(this.goodCategory == 0){
                this.goodLink = 'http://mall.paycore.cc/#/product_details/'+this.selectGoodItem.goodId;
            }else{
                this.goodLink = 'http://mall.paycore.cc/#/sort?categoryId='+this.selectGoodItem.categoryId;
            }
            this.$store.state.dragContent[this.index].data.url = this.goodLink;
            this.closePop();
        },
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
            position: relative;
            width: 100%;
            text-align: center;
            height: 150px;
            background: #f4f4f4;
            line-height: 150px;
            cursor: pointer;
            .addTip{
                border: 1px solid transparent;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                span{
                    font-size: 12px;
                    color:#666;
                }
                img{
                    width: 100%;
                    height: 100%;
                }
                &.alert{
                    border-color: red;
                }
            }
            .hoverContent{
                display: flex;
                flex-flow: column;
                padding-top: 20px;
                background: #fff;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                border: 1px solid #f4f4f4;
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
        }
        .textContent{
            width: 100%;
            display: flex;
            flex-flow: column;
            p.title{
                color: #a2a2a2;
                font-size: 12px;
                line-height: 16px;
                margin: 10px 0;
            }
            p.inputContainer{
                position: relative;
                display: flex;
                flex-flow: column;
                input.text{
                    flex: 1 0 auto;
                    border: 1px solid #f4f4f4;
                    height: 2em;
                    line-height: 2em;
                    padding: 0 30px 0 5px;
                    outline: none;
                    font-size: 12px;
                    &::placeholder{
                        color: #a2a2a2;

                    }
                }
                .wordsLimite{
                    position: absolute;
                    top: 8px;
                    right: 5px;
                    color: #a2a2a2;
                    font-size: 12px;
                }
            }

        }
        .linkContent{
            width: 100%;
            display: flex;
            flex-flow: column;
            p.title{
                color: #a2a2a2;
                font-size: 12px;
                line-height: 16px;
                margin: 10px 0;
            }
            p.inputContainer{
                position: relative;
                display: flex;
                flex-flow: column;
                input.text{
                    flex: 1 0 auto;
                    border: 1px solid #f4f4f4;
                    height: 2em;
                    line-height: 2em;
                    padding: 0 40px 0 5px;
                    outline: none;
                    &::placeholder{
                        color: #a2a2a2;
                        font-size: 12px;
                    }
                }
            }
            transition: all 0.3s ease-out;
            i.icon-link{
                position: absolute;
                top: 8px;
                bottom: 0;
                right: 5px;
                color: #666;
                cursor: pointer;
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
                top: 8px;
                right: 25px;
                background: #ccc;
                border-radius: 50%;
                font-size: 10px;
                color: #fff;
                cursor: pointer;
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


