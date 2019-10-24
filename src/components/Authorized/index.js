import React, { Component } from 'react';
import store from 'store';
import router from 'umi/router'

class Authorized extends Component{
    componentDidMount() {
        if(!store.get('user')){
            store.set('URLBeforeJumping',window.location.href.replace("https://www.tonghangbao178.com/",""));
            router.push('/login')
        }
    }

    render(){
        return (
            <></>
        )
    }
}

export default Authorized;