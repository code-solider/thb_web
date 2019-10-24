import  { fromJS } from 'immutable'
import { getSysData } from '@/services/api';

export default {
    namespace: 'vip',
    state:fromJS({
        num:1,
        VIPPrice:0
    }),
    effects: {
        *initData(action,{ call, put }) {
            const result = yield call(getSysData);
            yield put({ type: 'init',payload:result.data });
        },
    },
    reducers:{
        init(state,{payload:{ VIPPrice}}){
            return state.set('VIPPrice',VIPPrice)
        },
        add(state) {
            return state.set('num',state.get('num')+1)
        },
        jian(state){
            if(state.get('num')<2){
                return state
            }
            return state.set('num',state.get('num')-1)
        },
    }
}