import { fromJS, List } from "immutable";
import { getUserListData, initUserDetail, followUser, cancelFollowUser, getUsereRelation, findUserByWhere, getArtListByUserId } from '@/services/api';

export default {
    namespace: 'thml',
    state: fromJS({
        data:[],// /thml页面 下的data
        userDetail:{},
        ArtData:[], //  /thml/detail用到
        isFollow:false
    }),
    reducers: {
        fetchMyArtDataR(state,{payload}){
            return state.set('ArtData',payload)
        },
        updateR(state,{payload}) {
            return state.set('data',payload)
        },
        loadMoreR(state,{payload}) {
            return state.set('data',state.get('data').concat(payload));
        },
        initUserDetailR(state,{payload:{userData,relation}}) {
            return state.set('userDetail',userData).set('isFollow',relation)
        },
        switchFollowR(state){
            return state.set('isFollow',true)
        },
        switchCancelFollowR(state){
            return state.set('isFollow',false)
        }
    },
    effects: {
        * initData({payload}, {call, put}) {
            let data = yield call(getUserListData,payload);
            yield put({type: 'updateR',payload:data.data});
        },
        * loadMore({payload,callback}, {call, put}) {
            let data = yield call(getUserListData,payload);
            yield put({type: 'loadMoreR',payload:data.data});
            let isEnd = data.data.length===0?true:false;
            if(callback) callback(isEnd);
        },
        * findUserByWhere({payload}, {call, put}){
            let data = yield call(findUserByWhere,payload);
            yield put({type: 'updateR',payload:data.data});
        },
        * initUserDetail({payload}, {call, put}) {
            let result = yield call(initUserDetail,payload);
            let relationResult = yield call(getUsereRelation,payload);
            yield put({type: 'initUserDetailR',payload:{
                userData:result.data,
                relation:relationResult.isFollow
            }});
        },
        * switchFollow({payload}, {call, put}) {
            let result = yield call(followUser,payload);
            if(result.suncess){
                yield put({type: 'switchFollowR'});
            }
        },
        * switchCancelFollow({payload}, {call, put}) {
            let result = yield call(cancelFollowUser,payload);
            if(result.suncess){
                yield put({type: 'switchCancelFollowR'});
            }
        },
        * fetchMyArtData({payload}, {call, put}){
            let result = yield call(getArtListByUserId,payload);
            if(result.suncess){
                yield put({type: 'fetchMyArtDataR',payload:result.data});
            }
        }
    },
}