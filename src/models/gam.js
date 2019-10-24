import { fromJS } from "immutable";
import { initDataList, getArtListByWhere } from "@/services/api";

export default {
    namespace:'gam',
    state:fromJS({
        type:{ title: '全部',key:0 },
        dataList:[],
        currentPage:1,
        size:10,
        searchWhere:{}
    }),
    reducers:{
        initDataListR(state,{payload}){
            return state.set('dataList',payload.data).set('currentPage',1).set('type',payload.type)
        },
        loadMoreR(state,{payload}){
            return state.set('dataList',state.get('dataList').concat(payload)).set('currentPage',state.get('currentPage')+1)
        },
        findArtByWhereR(state,{payload}){
            if(state.get('currentPage')!==payload.page){
                return state.set('dataList', state.get('dataList').concat(payload.data)).set('currentPage',payload.page)
                    .set('searchWhere',payload.where)
                    .set('type',null)
            }else{
                return state.set('dataList',payload.data).set('currentPage',payload.page)
                    .set('searchWhere',payload.where)
                    .set('type',null)
            }
        },
    },
    effects:{
        * initDataList({payload}, {call, put}) {
            let data = yield call(initDataList,payload);
            if(data.suncess){
                yield put({
                    type: 'initDataListR',
                    payload:{
                        data:data.data,
                        type:payload.type
                    }
                });
            }
        },
        * loadMore({payload, callback }, {call, put}) {
            let data = yield call(initDataList,payload);
            if(data.suncess){
                yield put({type: 'loadMoreR',payload:data.data});
            }
            let isEnd = data.data.length===0?true:false;
            if(callback) callback(isEnd);
        },
        * findArtByWhere({payload, callback }, {call, put}) {
            let data = yield call(getArtListByWhere,payload);
            if(data.suncess){
                yield put({type: 'findArtByWhereR',payload:{
                    data:data.data.list, where:payload.where,page:payload.page
                }});
            }
            let isEnd = data.data.list.length===0?true:false;
            if(callback) callback(isEnd);
        },
    }
}