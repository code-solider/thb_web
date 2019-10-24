import { fromJS, List } from "immutable";
import { findCompanyByWhere, getCompanyData } from '@/services/api';

export default {
    namespace: 'company',
    state: List([]),
    reducers: {
        updateR(state,{payload}) {
            return state.clear().concat(fromJS(payload));
        },
        loadMoreR(state,{payload}){
            return state.concat(fromJS(payload));
        }
    },
    effects: {
        * initData({payload,callback}, {call, put}) {
            let data = yield call(getCompanyData,payload);
            yield put({type: 'updateR',payload:data.data});
            if(callback) callback();
        },
        * loadMore({payload,callback}, {call, put}){
            let data = yield call(getCompanyData,payload);
            yield put({type: 'loadMoreR',payload:data.data});
            let isEnd = data.data.length===0?true:false;
            if(callback) callback(isEnd);
        },
        *findCompanyByWhere({payload}, {call, put}) {
            let data = yield call(findCompanyByWhere,payload);
            if(data.suncess){
                yield put({type: 'updateR',payload:data.data})
            }
        },
    },
}