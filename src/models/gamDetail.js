import { fromJS } from "immutable";
import { getArtPraiseList } from "@/services/api";

export default {
    namespace:'gamDetail',
    state:fromJS({
        animating:true,
        artData:{},
        commentData:[],
        praiseData:[]
    }),
    reducers:{
        initR(state,{payload:{artData,commentData,praiseData}}){
            return state.set('animating',false)
                        .set('artData',artData)
                        .set('commentData',commentData)
                        .set('praiseData',praiseData);
        },
        updataComment(state,{payload}){
            return state.set('commentData',payload);
        },
        updatePraiseData(state,{payload}){
            return state.set('praiseData',payload);
        }
    },
    effects:{
        * init({payload}, {call, put}) {
            let data = yield call(getArtPraiseList,payload);
            if(data.suncess){
                yield put({type: 'initR',payload:data.data});
            }
        },
    }
}