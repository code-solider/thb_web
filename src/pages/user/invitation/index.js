import React, { Component } from 'react'
import styles from './style.less'
import { NavBar, Icon } from 'antd-mobile';
import router from 'umi/router'
import { connect } from "dva";
import QRCode from 'qrcode.react';

@connect(({user})=>({
    userData:user.toJS().userData
}))
class Page extends Component{
    handleBack = () => {
        router.goBack()
    }
    render(){
        let { userData } = this.props;
        return(
            <div className={styles.wrap}>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick = {this.handleBack}
                >邀请好友赚金币</NavBar>
                <div className={styles.content}>
                    <div className={styles.title}>
                        {userData.realName||userData.nickname} 的专属二维码：
                    </div>
                    <div className={styles.body}>
                        <QRCode
                            value={`http://www.tonghangbao178.com/user/register?tgm=${userData.tgm}`}
                        />
                    </div>
                </div>

            </div>
        )
    }
}

export default Page