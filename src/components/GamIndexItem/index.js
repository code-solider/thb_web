import styles from './style.less';
import React, {Component, Fragment} from 'react'
import {Avatar, Icon, Row, Col} from 'antd';
import { Toast, Modal, Badge } from 'antd-mobile';
import {appId, iconUrl} from '@/config'
import router from 'umi/router';
import Link from 'umi/link';
import { formatDateDetail } from '@/utils/request';
import {praise, getArtPraiseList, postComment } from '@/services/api';
import store from 'store';
import wx from "weixin-js-sdk";
import { getJssdkConfig, dashang } from '@/services/wechatApi';
import 'react-photoswipe/lib/photoswipe.css';
import {PhotoSwipe} from 'react-photoswipe';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
});
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

class GamIndexItem extends Component {
    state = {
        ModalIsShow:false,
        isShow: false,
        commentState:false,
        placeholderText:'',
        currentItem:null,
        imgIsOpen:false,
        imgInitKey:0,
        praiseData:[],
        commentData:[]
    }

    async componentDidMount(){
        let { data } = this.props;
        this.setState({
            praiseData:data.praiseData,
            commentData:data.commentData
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
                'chooseWXPay'
            ] // 必填，需要使用的JS接口列表
        });
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            praiseData:nextProps.data.praiseData,
            commentData:nextProps.data.commentData
        })
    }

    handleReward = async (e) => {
        let _this = this;
        if(e%1 !== 0 ){
            Toast.fail('不能输入小数', 2);
            return;
        }
        let { data:artData } = this.props;
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

    showModal =() => {
        this.setState({
            ModalIsShow: true,
        });
    }
    onClose = () => {
        this.setState({
            ModalIsShow: false,
        });
    }

    showHide = () => {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    hide = () => {
        this.setState({
            isShow: false
        })
    }
    tz = (e) => {
        router.push(e);
    }
    handleDz = async () => {
        this.hide();
        let { data } = this.props;
        let res = await praise(data._id+'');
        if(res.suncess){
            this.setState({
                praiseData:res.data
            })
        }
    }
    showComment = (e) => {
        if(e.userId===store.get('user').userId){
            return
        }
        this.hide();
        this.setState({
            commentState: true,
            placeholderText:e.username?`回复${e.username}:`:'评论',
            currentItem:e||null
        })
    }

    handleSubmitComment = async () => {
        this.setState({
            commentState: false
        });
        let {data:{_id}} = this.props;
        let payload = {};
        if(this.state.currentItem){
            payload = {
                id:_id+'',
                data:{
                    message:this.refs.comment.value,
                    authorid:this.state.currentItem.userId,
                    author:this.state.currentItem.username
                }
            }
        }else{
            payload = {
                id:_id+'',
                data:{
                    message:this.refs.comment.value
                }
            }
        }

        let res = await postComment(payload);
        if(res.suncess){
            this.setState({
                commentData: res.data
            })
        }else{
            Toast.fail(res.message, 1.5);
        }
    }

    hideComment = () => {
        this.setState({
            commentState: false
        })
    }

    handleClickHeaderImg = (e) => {router.push(`/thml/detail?id=${e}`)}
    handleShowImg = (e) => {this.setState({imgInitKey:e,imgIsOpen:true})}
    handleCloseImg = () => {this.setState({imgIsOpen:false})}

    render() {
        let { ModalIsShow, isShow, placeholderText, imgIsOpen, imgInitKey, praiseData, commentData } = this.state;
        let {data} = this.props;
        let items = data.thumbImg.map((item,key)=>{
            return {
                src: item,
                w: 1200,
                h: 900,
                key
            }
        });
        return (
            <Fragment>
                <PhotoSwipe
                    isOpen={imgIsOpen}
                    items={items}
                    options={{index:imgInitKey,shareEl:false,zoomEl:false,fullscreenEl:false,arrowEl:false,tapToClose:true}}
                    onClose={this.handleCloseImg}
                />
                <Modal
                    visible={ModalIsShow}
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
                <div
                    className={styles.wrap_second}
                >
                    <div className={styles.one_line} onClick={()=>this.handleClickHeaderImg(data.userId)}>
                        <div className={styles.headerImg}>
                            <Avatar shape="square" size={36} src={data.userHeaderImg}/>
                            {
                                data.userSex===1?<IconFont type="icon-nan"/>:<IconFont type="icon-nv"/>
                            }

                        </div>
                        <div className={styles.username_conpany}>
                            <div className={styles.title}>{data.username}</div>
                            <div>{data.companyName||'暂未填写'}</div>
                        </div>
                        <Badge text={data.type}  style={{ padding: '0 10px', backgroundColor: '#21b68a', borderRadius: 2 }} />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.title}>
                            {data.title}
                        </div>
                        <div className={styles.des}>
                            <div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content}} onClick={() => this.tz(`/gam/detail?id=${data._id+''}`)}></div>
                            {
                                data.thumbImg.length > 0 && (
                                    <Row gutter={3} className={styles.img_wrap}>
                                        {
                                            data.thumbImg.map((item, key) => {
                                                return (
                                                    <Col key={key} span={8}>
                                                        <img onClick={()=>this.handleShowImg(key)} src={item} alt="图片"/>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                )
                            }
                        </div>
                        <div className={styles.footer} onMouseLeave={this.hide}>
                            <div className={styles.oneLine}>
                                <div>{formatDateDetail(parseInt(data.createTime))}</div>
                                <div className={styles.d2}>
                                    <div className={isShow === true ? styles.icon_wrap : styles.icon_wrap_none}>
                                        <IconFont type="icon-dianzan" onClick={this.handleDz}/>
                                        <IconFont type="icon-dashang" onClick={this.showModal}/>
                                        <IconFont type="icon-comment" onClick={this.showComment}/>
                                    </div>
                                    <Icon onClick={this.showHide} style={{fontSize: '25px'}} type="ellipsis"/>
                                </div>
                            </div>
                            {
                                praiseData.length > 0 && (
                                    <div className={styles.dianzan}>
                                        <IconFont type="icon-dianzan1" style={{fontSize: '18px'}}/>
                                        {
                                            praiseData.map((item, key) => {
                                                return (
                                                    <span key={key}>{item.username}</span>
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
                                            commentData.filter((item,key)=>key<5).map((item,key)=>{
                                                if(item.authorid){
                                                    return (
                                                        <div key={key}>
                                                            <Link to={`/thml/detail?id=${item.userId}`}>
                                                                {item.username}
                                                            </Link>
                                                            回复
                                                            <Link to={`/thml/detail?id=${item.authorid}`}>
                                                                {item.author}
                                                            </Link> : {item.message}
                                                        </div>
                                                    )
                                                }else{
                                                    return (
                                                        <div key={key}>
                                                            <Link to={`/thml/detail?id=${item.userId}`}>
                                                                {item.username}
                                                            </Link> : <span onClick={()=>this.showComment(item)}>{item.message}</span></div>)
                                                }
                                            })
                                        }
                                        {commentData.length>5?(<Link to={`/gam/detail?id=${data._id+''}`}>查看更多</Link>):''}
                                    </div>
                                ):''
                            }

                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default GamIndexItem