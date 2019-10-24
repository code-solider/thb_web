import React, { Component } from 'react';
import store from 'store';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { appId, redirect_uri } from '@/config';
import { initWeChatAccessToken, getWeChatUserData } from '@/services/wechatApi';

class LoginPage extends Component{
    async componentDidMount() {
        if(store.get('user') === undefined && this.props.location.query.code===undefined){
            window.location.href=`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
        }else if(store.get('user') === undefined && this.props.location.query.code!==undefined||null||''){
            let res = await initWeChatAccessToken(this.props.location.query.code);
            let res2 = await getWeChatUserData(res);
            if(res2.suncess){
                    if(store.get('URLBeforeJumping')){
                        let URLBeforeJumping = store.get('URLBeforeJumping');
                        store.remove('URLBeforeJumping');
                        router.push(URLBeforeJumping);
                    }else{
                        router.push('/')
                    }
            }else{
                Toast.fail('登陆失败，请联系平常管理员',3,()=>{
                    window.close();
                })
            }
        }
    }

    render(){
        return (
            <></>
        )
    }
}

export default LoginPage;
