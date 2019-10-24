import { fromJS } from 'immutable';
import { getSysData } from '@/services/api';
export default {
    namespace: 'settings',
    state:fromJS({
        footerNavselectedTab:'blueTab',
        address:[],
        gsgm:[],
        gsyw:[],
        ewmImg:''
    }),
    effects: {
        *initData(action,{call, put}) {
            let data = yield call(getSysData);
            yield put({type: 'init',payload:data.data});
        },
    },
    reducers: {
        init(state,{payload:{ address, gsgm, gsyw, ewmImg }}) {
            return state.set('address',address).set('gsgm',gsgm).set('gsyw',gsyw).set('ewmImg',ewmImg)
        },
        switchSelectedTab(state,{payload}){
            return state.set('footerNavselectedTab',payload)
        }
    },
}