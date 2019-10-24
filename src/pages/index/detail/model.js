import {initCompanyDetailData, getRelation, follow, cancelFollow, fetchCompanyUserList, fetchCompanyFollowUser } from '@/services/api'
import {fromJS} from "immutable";
import { Toast } from 'antd-mobile';

export default {
    namespace: 'companyDetail',
    state: fromJS({
        companyData: {},
        isFollow: false,
        jifen: 0,
        isVIP: false,
        companyUserList:[],//公司人
        companyFollowUser:[]//关注公司得人
    }),
    reducers: {
        initCompanyDataR(state, {payload: {companyData, isFollow}}) {
            return state.set('companyData', companyData).set('isFollow', isFollow)
        },
        switchCheckedTrueR(state) {
            return state.set('isFollow', true)
        },
        switchCheckedFalseR(state){
            return state.set('isFollow', false)
        },
        fetchCompanyUserListR(state,{payload}){
            return state.set('companyUserList',payload)
        },
        fetchCompanyFollowUserR(state,{payload}){
            return state.set('companyFollowUser',payload)
        }
    },
    effects: {
        * initCompanyData({payload}, {call, put}) {
            let data = yield call(initCompanyDetailData, payload);
            let isFollowResult = yield call(getRelation, payload);
            yield put({
                type: 'initCompanyDataR', payload: {
                    companyData: data.data,
                    isFollow: isFollowResult.isFollow
                }
            });
        },

        * switchCheckedTrue({payload}, {call, put}) {
            let data = yield call(follow, payload);
            if (data.suncess) {
                Toast.success(data.message, 1);
                yield put({type: 'switchCheckedTrueR'});
            }else{
                Toast.fail(data.message, 2);
            }
        },

        * switchCheckedFalse({payload}, {call, put}) {
            let data = yield call(cancelFollow, payload);
            if (data.suncess) {
                yield put({type: 'switchCheckedFalseR'});
            }
        },
        * fetchCompanyUserList({payload}, {call, put}){
            let data = yield call(fetchCompanyUserList, payload);
            if(data.suncess){
                yield put({type: 'fetchCompanyUserListR',payload:data.data});
            }
        },
        * fetchCompanyFollowUser({payload}, {call, put}){
            let data = yield call(fetchCompanyFollowUser, payload);
            if(data.suncess){
                yield put({type: 'fetchCompanyFollowUserR',payload:data.data});
            }
        }
    }
}