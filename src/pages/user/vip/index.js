import React, { Component, Fragment } from 'react'
import styles from './style.less'
import { Card, WingBlank, WhiteSpace, NoticeBar } from 'antd-mobile';
import router from 'umi/router';
import { Icon } from 'antd'
import global, {appId} from '@/config'
import { connect } from "dva";
import NavbarWrap from '@/components/NavbarWrap';
import { formatDateDetail } from '@/utils/request'
import { getJssdkConfig, pay } from "@/services/wechatApi";
import { Toast } from 'antd-mobile';
import wx from 'weixin-js-sdk';


const IconFont = Icon.createFromIconfontCN({
    scriptUrl:global.iconUrl
});

@connect(({vip,user})=>({
    vip,
    userData:user.toJS().userData
}))
class VipPage extends Component{

    async componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'vip/initData'
        })
        let res = await getJssdkConfig({url:window.location.href});
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp:res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature,// 必填，签名
            jsApiList: [
                'chooseWXPay'
            ] // 必填，需要使用的JS接口列表
        });
    }

    handleClick = (e) => {
        let { dispatch } = this.props;
        dispatch({
            type:`vip/${e}`
        })
    }

    handleBack = () => {
        router.goBack()
    }

    handlePay = async () => {
        let { regTime } = this.props.userData;
        if(regTime===''){
            Toast.fail('完善信息后才可以开通会员', 2);
            return;
        }
        let { num, VIPPrice } = this.props.vip.toJS()
        let res = await pay({
            buyNum:num,
            buyPrice:VIPPrice
        })
        wx.chooseWXPay({
            timestamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
            package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: res.paySign, // 支付签名
            success: function (res) {
                // 支付成功后的回调函数
                Toast.success('支付成功', 1);
            }
        });
    }

    render(){
        let { num, VIPPrice } = this.props.vip.toJS();
        let { isVIP, VIPEndTime } = this.props.userData;
        return(
            <div className={styles.wrap}>
                <NavbarWrap
                    title={'VIP'}
                />
                <div className={styles.d1}>
                    {
                        isVIP?(<NoticeBar mode="closable" >会员将于 { formatDateDetail(Number(VIPEndTime)) } 到期 </NoticeBar>):''
                    }
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                            <Card.Body>
                                <div className={styles.item}>
                                    <div className={styles.item_1}>时长(年)</div>
                                    <div className={styles.item_2}>
                                        <Icon onClick={()=>this.handleClick('add')} type="plus-circle" /> {num} <Icon onClick={()=>this.handleClick('jian')}  type="minus-circle" />
                                    </div>
                                </div>
                                <WhiteSpace size="sm" />
                                <div className={styles.item}>
                                    <div className={styles.item_1}>合计</div>
                                    <div className={styles.item_2}>{num*VIPPrice} 元</div>
                                </div>
                                <div className={styles.submit_btn}>
                                    <button onClick={this.handlePay}><IconFont  type="icon-weixin" />{isVIP?'立即续费':'立即开通'}</button>
                                </div>

                            </Card.Body>
                        </Card>
                        <WhiteSpace size="lg" />
                    </WingBlank>
                    <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card
                            className={styles.card}
                        >
                            <Card.Header
                                title="VIP权益"
                            />
                            <Card.Body>
                                <Fragment>
                                    <h4>1、手机号</h4>
                                    <p>可以查看发布信息人的手机号，一键拨打电话</p>
                                </Fragment>
                                <Fragment>
                                    <h4>2、微信</h4>
                                    <p>在线交友，识别二维码添加好友</p>
                                </Fragment>
                            </Card.Body>
                        </Card>
                        <WhiteSpace size="lg" />
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default VipPage