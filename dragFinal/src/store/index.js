import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        dragContent: [],
        allChildren: 0,
        curIndex: 0,
        saveContent: {}
    },
    mutations: {
        //放下时添加
        newDrag(state, res) {
            let obj = {};
            for (let k in res.drag) {
                obj[k] = res.drag[k];
                obj.index = state.dragContent.length;
                this.commit('addData', res.drag.dragcomponentName);
                obj.data = state.saveContent;
            }
            state.dragContent.splice(res.index, 0, obj)
            console.log(state.dragContent);
        },
        addData(state, name) {
            let obj = {};
            switch (name) {
                case 'bannerModel':
                    obj.autoplay = 3000;
                    obj.hideBlank = true;
                    obj.swiperImg = [{
                        showAdd: false,
                        imgRequired: false,
                        srcImg: 'https://gw.alicdn.com/tfs/TB1nkM1SXXXXXXmaXXXXXXXXXXX-750-359.gif',
                        url: '',
                        uploadButtonName: '上传图片', //按钮提示文字
                    }];
                    break;
                case 'singlePicModel':
                    obj = {
                        imgUrl: "http://gw.alicdn.com/tfs/TB1kV3QRVXXXXa.XFXXXXXXXXXX-750-376.png_790x10000.jpg",
                        textContent: "",
                        url: "",
                        isMargin: true,
                        uploadButtonName: '上传图片', //按钮提示文字
                    }
                    break;
                case 'titleModel':
                    obj = {
                        title: "标题名称",
                        url: "",
                        hideBlank: true
                    };
                    break;

            }
            state.saveContent = obj
        },
        goUp(state, index) {
            let temArr = state.dragContent;
            if (index == 0) {
                return false;
            } else {
                state.dragContent = [];
                let temp = temArr[index];
                temArr[index] = temArr[index - 1];
                temArr[index - 1] = temp;
            }
            state.curIndex = index - 1;
            state.dragContent = temArr;
        },
        goDown(state, index) {
            let temArr = state.dragContent;
            if (index == (temArr.length - 1)) {
                return false;
            } else {
                state.dragContent = [];
                let temp = temArr[index];
                temArr[index] = temArr[index + 1];
                temArr[index + 1] = temp;
            }
            state.curIndex = index + 1;
            state.dragContent = temArr;
        },
        deleteThis(state, index) {
            state.dragContent.splice(index, 1)
        },
        mouseover(state, res) {
            Vue.set(state.dragContent[res.pIndex].data.swiperImg[res.index], 'showAdd', true)
        },
        mouseout(state, res) {
            state.dragContent[res.pIndex].data.swiperImg[res.index].showAdd = false;
        },
        bannerToUp(state, res) {
            let tempArr = state.dragContent[res.pIndex].data.swiperImg;
            if (res.index == 0) {
                return false;
            } else {
                state.dragContent[res.pIndex].data.swiperImg = [];
                let temp = tempArr[res.index];
                tempArr[res.index] = tempArr[res.index - 1];
                tempArr[res.index - 1] = temp;
            }
            console.log(tempArr)
            state.dragContent[res.pIndex].data.swiperImg = tempArr;
        },
        bannerToDown(state, res) {
            let tempArr = state.dragContent[res.pIndex].data.swiperImg;
            if (res.index == (tempArr.length - 1)) {
                return false;
            } else {
                state.dragContent[res.pIndex].data.swiperImg = [];
                let temp = tempArr[res.index];
                tempArr[res.index] = tempArr[res.index + 1];
                tempArr[res.index + 1] = temp;
            }
            state.dragContent[res.pIndex].data.swiperImg = tempArr;
        }
    }
})
export default store;