import React, { Component, Fragment } from 'react';
import NavBarWrap from '@/components/NavbarWrap';
import wx from 'weixin-js-sdk';
import { connect } from "dva";
import styles from './style.less';
import {Avatar, Button, Icon, Col, Row } from 'antd';
import { Modal, ActivityIndicator, Toast } from 'antd-mobile';
import { iconUrl, appId } from '@/config'
import { formatDateDetail } from '@/utils/request'
import Link from 'umi/link';
import router from 'umi/router';
import store from "store";
import {postComment, praise, delArtById} from "@/services/api";
import { getJssdkConfig, dashang } from '@/services/wechatApi';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl:iconUrl
});
const alert = Modal.alert;
@connect(({gamDetail,user})=>({
    gamDetail,
    user
}))
class GamDetailPage extends Component{
    state = {
        commentState:false,
        placeholderText:'',
        currentItem:null,
        clicked1: 'none',
        modal1: false
    }

    async componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'gamDetail/init',
            payload:this.props.location.query.id
        });
        //微信 js-sdk配置
        let res;
        if(window.__wxjs_is_wkwebview){//true 时 为 IOS 设备
            res = await getJssdkConfig({url: 'http://www.tonghangbao178.com/'});
        }else{
            res = await getJssdkConfig({url: window.location.href});
        }
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp:res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature,// 必填，签名
            jsApiList: [
                'updateAppMessageShareData',//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                'updateTimelineShareData',//自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                'onMenuShareAppMessage',  //旧的接口，即将废弃
                'onMenuShareTimeline', //旧的接口，即将废弃
                'chooseWXPay'
            ] // 必填，需要使用的JS接口列表
        });
        wx.ready(() => {   //需在用户可能点击分享按钮前就先调用
            wx.updateAppMessageShareData({
                title: this.props.gamDetail.toJS().artData.title||'', // 分享标题
                desc: this.props.gamDetail.toJS().artData.content||'', // 分享描述
                link: `http://www.tonghangbao178.com/gam/detail?id=${this.props.location.query.id}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: this.props.gamDetail.toJS().artData.thumbImg[0]||'', // 分享图标
                success: function () {

                }
            });
            wx.updateTimelineShareData({
                title: this.props.gamDetail.toJS().artData.title||'', // 分享标题
                link: `http://www.tonghangbao178.com/gam/detail?id=${this.props.location.query.id}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: this.props.gamDetail.toJS().artData.thumbImg[0]||'', // 分享图标
                success: function () {

                }
            })
        });
    }

    showModal =() => {
        this.setState({
            modal1: true,
        });
    }
    onClose = () => {
        this.setState({
            modal1: false,
        });
    }

    showComment = (e) => {
        if(e.userId===store.get('user').userId){
            return
        }
        this.setState({
            commentState: true,
            placeholderText:e.username?`回复${e.username}:`:'评论',
            currentItem:e||null
        })
    }

    handleDz = async () => {
        let res = await praise(this.props.location.query.id);
        let { dispatch } = this.props;
        dispatch({
            type:'gamDetail/updatePraiseData',
            payload:res.data
        })
    }

    handleSubmitComment = async () => {
        this.setState({
            commentState: false
        });
        let payload = {};
        if(this.state.currentItem){
            payload = {
                id:this.props.location.query.id,
                data:{
                    message:this.refs.comment.value,
                    authorid:this.state.currentItem.userId,
                    author:this.state.currentItem.username
                }
            }
        }else{
            payload = {
                id:this.props.location.query.id,
                data:{
                    message:this.refs.comment.value
                }
            }
        }

        let res = await postComment(payload);
        if(res.suncess){
            let { dispatch } = this.props;
            dispatch({
                type:'gamDetail/updataComment',
                payload:res.data
            });
            this.refs.comment.value='';
        }else{
            Toast.fail(res.message, 2);
        }
    }

    handleReward = async (e) => {
        let _this = this;
        if(e%1 !== 0 ){
            Toast.fail('不能输入小数', 2);
            return;
        }
        let { artData } = this.props.gamDetail.toJS();
        let res = await dashang({
            val:e,
            rewardedUserId:artData.userId,
            articleId:artData._id+''
        })
        wx.chooseWXPay({
            timestamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
            package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: res.paySign, // 支付签名
            success: function (res) {
                // 支付成功后的回调函数
                _this.onClose();
                Toast.success('支付成功', 1);
            },
            fail:function(res){
                Toast.fail(res.message, 2);
            }
        });
    }

    handleDel = async (id) => {
        let res = await delArtById({id});
        if(res.suncess){
            Toast.success(res.message, 1.5);
            router.goBack();
        }else{
            Toast.fail(res.message, 2);
        }
    }

    render(){
        let { placeholderText, modal1 } = this.state;
        let { animating, artData, commentData, praiseData } = this.props.gamDetail.toJS();
        if(animating){
            return(<ActivityIndicator toast text="正在加载" />)
        }else{
            return(
                <Fragment>
                    <Modal
                        visible={modal1}
                        transparent
                        maskClosable={false}
                        onClose={this.onClose}
                        title="选择金额"
                        footer={[{ text: '取消', onPress: () => {this.onClose()}}]}
                    >
                        <div>
                            <Row gutter={16}>
                                <Col className={styles.gutter_row} span={8}>
                                    <button onClick={()=>this.handleReward(6)}>6元</button>
                                </Col>
                                <Col className={styles.gutter_row} span={8}>
                                    <button onClick={()=>this.handleReward(16)}>16元</button>
                                </Col>
                                <Col className={styles.gutter_row} span={8}>
                                    <button onClick={()=>this.handleReward(26)}>26元</button>
                                </Col>
                                <Col className={styles.gutter_row} span={24}>
                                    <input type='number' ref={'zdy'} placeholder={'自定义金额'}/>
                                    <input type="submit" onClick={()=>this.handleReward(Number(this.refs.zdy.value))} value={'提交'}/>
                                </Col>
                            </Row>
                        </div>
                    </Modal>
                    <div className={this.state.commentState?styles.commentBlock:styles.comment}>
                        <textarea type="text" ref={'comment'} placeholder={placeholderText}></textarea>
                        <IconFont type="icon-biaoqing"/>
                        <button onClick={this.handleSubmitComment}>提交</button>
                    </div>
                    <NavBarWrap
                        title={"详情"}
                    />
                    <div className={styles.wrap}>
                        <div className={styles.headerTitle}>
                            <Avatar size={40} src={artData.userHeaderImg} />
                            <div className={styles.dd}>
                                <div className={styles.title}>{artData.title}</div>
                                <div className={styles.timeanduser}>
                                    <div>{formatDateDetail(Number(artData.createTime))}</div>
                                    <div>发布人：{artData.username}</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.content} dangerouslySetInnerHTML={{ __html: artData.content}}></div>
                        {
                            artData.thumbImg.length > 0 && (
                                artData.thumbImg.map((item, key) => {
                                    return (<img key={key} src={item} alt=""/>)
                                })
                            )
                        }
                        {
                            praiseData.length > 0 && (
                                <div className={styles.dianzan}>
                                    <IconFont type="icon-dianzan" />
                                    {
                                        praiseData.map((item, key) => {
                                            return (
                                                <span key={key}>{item.username } </span>
                                            )
                                        })
                                    }
                                </div>
                            )
                        }
                        {
                            commentData.length>0?(
                                <div className={styles.commentList}>
                                    {
                                        commentData.map((item,key)=>{
                                            if(item.authorid){
                                                return (
                                                    <div>
                                                        <Link to={`/thml/detail/info?id=${item.userId}`}>
                                                            {item.username}
                                                        </Link>
                                                        回复
                                                        <Link to={`/thml/detail/info?id=${item.authorid}`}>
                                                            {item.author}
                                                        </Link> : {item.message}
                                                    </div>
                                                )
                                            }else{
                                                return (
                                                    <div>
                                                        <Link to={`/thml/detail/info?id=${item.userId}`}>
                                                            {item.username}
                                                        </Link> : <span onClick={()=>this.showComment(item)}>{item.message}</span>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            ):''
                        }
                    </div>
                    <div className={styles.caozuo}>
                        <div onClick={this.showModal}><IconFont type="icon-dashang"/> 打赏</div>
                        <div onClick={this.handleDz}><IconFont type="icon-dianzan"/> 点赞</div>
                        <div onClick={this.showComment}><IconFont type="icon-comment" /> 评论</div>
                        {
                            this.props.user.getIn(['userData','_id']) === artData.userId?
                                (<div onClick={()=>
                                    alert('Delete', '确定删除???', [
                                        { text: '取消', onPress: () => {return false} },
                                        { text: '确定', onPress: () => this.handleDel(artData._id)},
                                    ])
                                }><IconFont type="icon-shanchu1" /> 删除</div>):''
                        }
                    </div>
                </Fragment>
            )
        }

    }
}

export default GamDetailPage