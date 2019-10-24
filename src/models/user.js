import  {
    initFollowCompanyMessage, initFollowUserMessage, initInvitationRecord, initCustomerListData,
    initCustomerDetailData, delOneCustomerData, putCustomerData, getArtListByUserId, delArtById,
    userloginIn
} from '@/services/api';
import {getIntergralRecords, singnIn} from '@/services/intergralApi'
import { initWeChatAccessToken, getWeChatUserData } from '@/services/wechatApi'
import { fromJS } from "immutable";
import { Toast } from 'antd-mobile';

export default {
    namespace: 'user',
    state: fromJS({
        userData:{},
        followCompanyMessage:[],
        followUserMessage:[],
        invitationRecord:[],
        customerList:[],
        customerDetailData:{},
        myMessageList:[],
        intergralArr:{
            signInRecords:[],
            otherRecords:[]
        }
    }),
    reducers: {
        updataUserData(state,{payload}){
            return state.set('userData', fromJS(payload))
        },
        initFollowCompanyMessageR(state,{payload}) {
            return state.set('followCompanyMessage', fromJS(payload))
        },
        initFollowUserMessageR(state,{payload}) {
            return state.set('followUserMessage',payload)
        },
        initInvitationRecordR(state,{payload}) {
            return state.set('invitationRecord',payload)
        },
        initCustomerListDataR(state,{payload}) {
            return state.set('customerList',payload)
        },
        initCustomerDetailDataR(state,{payload}) {
            return state.set('customerDetailData',payload)
        },
        delCustomerDetailData(state){
            return state.set('customerDetailData',{})
        },
        delOneCustomerDataR(state,{payload}){
            return state.set('customerList',state.toJS().customerList.filter((item,key)=>item._id+''!==payload))
        },
        addProcessR(state,{payload:{process}}){
            let newCustomerDetailData = state.toJS().customerDetailData;
            newCustomerDetailData.process=process;
            return state.set('customerDetailData',newCustomerDetailData)
        },
        initMyMessageListR(state,{payload}){
            return state.set('myMessageList',fromJS(payload))
        },
        delArtByIdR(state,{payload}){
            return state.set('myMessageList',state.toJS().myMessageList.filter((item,key)=>item._id+''!==payload.id))
        },
        getIntergralRecordsR(state,{payload}){
            return state.setIn(['intergralArr','signInRecords'],fromJS(payload.signInRecords))
                .setIn(['intergralArr','otherRecords'],fromJS(payload.otherRecords))
        },
        singnInR(state,{payload}){
            return state.setIn(['intergralArr','signInRecords'],state.getIn(['intergralArr','signInRecords']).unshift(fromJS(payload)))
                .setIn(['userData','intergral'],state.getIn(['userData','intergral'])+payload.val)
        }
    },
    effects: {
        // * initWeChatUserData({payload}, {call, put}){
        //     let res = yield call(initWeChatAccessToken,payload);
        //     let res2 = yield call(getWeChatUserData,res);
        //     if(res2.suncess){
        //         yield put({type: 'updataUserData',payload:res2.data});
        //     }
        // },
        * initFollowCompanyMessage(action, {call, put}) {
            let data = yield call(initFollowCompanyMessage);
            if(data.suncess){
                yield put({type: 'initFollowCompanyMessageR',payload:data.data});
            }
        },
        * initFollowUserMessage(action, {call, put}) {
            let data = yield call(initFollowUserMessage);
            if(data.suncess){
                yield put({type: 'initFollowUserMessageR',payload:data.data});
            }
        },
        * initInvitationRecord(action, {call, put}) {
            let data = yield call(initInvitationRecord);
            if(data.suncess){
                yield put({type: 'initInvitationRecordR',payload:data.data});
            }
        },
        * initCustomerListData(action, {call, put}) {
            let data = yield call(initCustomerListData);
            if(data.suncess){
                yield put({type: 'initCustomerListDataR',payload:data.data});
            }
        },
        * initCustomerDetailData({payload}, {call, put}) {
            let data = yield call(initCustomerDetailData,payload);
            if(data.suncess){
                yield put({type: 'initCustomerDetailDataR',payload:data.data});
            }
        },
        * delOneCustomerData({payload}, {call, put}) {
            let data = yield call(delOneCustomerData,payload);
            if(data.suncess){
                yield put({type: 'delOneCustomerDataR',payload});
            }
        },
        * addProcess({payload}, {call, put}) {
            let data = yield call(putCustomerData,payload);
            if(data.suncess){
                yield put({type: 'addProcessR',payload})
            }
        },
        *initMyMessageList({payload}, {call, put}) {
            let data = yield call(getArtListByUserId,payload);
            if(data.suncess){
                yield put({type: 'initMyMessageListR',payload:data.data})
            }
        },
         * delArtById({payload}, {call, put}){
             let data = yield call(delArtById,payload);
             if(data.suncess){
                 yield put({type: 'delArtByIdR',payload})
             }
         },
        * fetchUserData({payload}, {call, put}){
            let data = yield call(userloginIn);
            if(data.suncess){
                yield put({type: 'updataUserData',payload:data.user})
            }
        },
        * getIntergralRecords(action, {call, put}){
            let data = yield call(getIntergralRecords);
            if(data.suncess){
                yield put({type: 'getIntergralRecordsR',payload:data.data})
            }
        },
        * singnIn(action, {call, put}){
            let data = yield call(singnIn);
            if(data.suncess){
                Toast.success(data.message, 1);
                yield put({type: 'singnInR',payload:data.data})
            }else{
                Toast.fail(data.message, 2);
            }
        }
    },
}
