import {get, getAuth, getToken, delToken, postToken, post, putToken, loginIn} from "@/utils/request";

/**
 * 传入code get access_token
 * */
export async function initWeChatAccessToken(params){
        return get(`/wechat/${params}`).then(data=>data.data).catch(err=>err)
}
/**
 * 传入access_token and openId get用户数据
 * */
export async function getWeChatUserData(params){
    return get(`/wechat/${params.access_token}/${params.openid}`).then(data=>{
        loginIn(data.data.data._id+'',data.data.data.openid)
        return data.data
    }).catch(err=>err)
}

export async function getJssdkConfig(params){
    return get(`/wechat/js_sdk`,params).then(data=>data.data).catch(err=>err)
}

export async function pay(payload){
    return postToken(`/wechat/payment/config`,await getAuth(`/wechat/payment/config`),payload)
        .then(data=>data.data).catch(err=>err)
}

export async function dashang(payload){
    return postToken(`/wechat/payment/reward`,await getAuth(`/wechat/payment/reward`),payload)
        .then(data=>data.data).catch(err=>err)
}