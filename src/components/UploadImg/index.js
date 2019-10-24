import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './style.less';
import wx from 'weixin-js-sdk';
import { getJssdkConfig } from "@/services/wechatApi";
import {Icon, Row, Col } from "antd";
import  { appId, iconUrl } from '@/config';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl:iconUrl
});

class UploadImg extends Component{
    async componentDidMount() {
        let res;
        if(window.__wxjs_is_wkwebview){//true 时 为 IOS 设备
            res = await getJssdkConfig({url:'https://www.tonghangbao178.com/'});
        }else{
            res = await getJssdkConfig({url: window.location.href});
        }

        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.noncestr, // 必填，生成签名的随机串
            signature: res.signature,// 必填，签名
            jsApiList: [
                'chooseImage',
                'getLocalImgData'
            ] // 必填，需要使用的JS接口列表
        });
        // wx.error(function(res){
        //     // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        //     alert('微信jssdk配置失败')
        // });
    }

    getLocalImgData = (localIds) =>{
        let _this = this;
        var localId = localIds.pop();
        wx.getLocalImgData({
            localId:localId, // 图片的localID
            success: async function (res) {
                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                if(window.__wxjs_is_wkwebview){
                    localData = localData.replace('jgp', 'jpeg');
                }else {
                    localData = 'data:image/jpeg;base64,'+localData;
                }
                let newImgList = [..._this.props.imgList].concat(localData)
                _this.props.onChange(newImgList)
                if(localIds.length > 0){
                    window.setTimeout(function(){
                        _this.getLocalImgData(localIds);
                    },100);
                }
            },
        });
    };

    handleDelImg = (key) => {
        let newImgList = [...this.props.imgList].filter((item,index)=>index!==key);
        this.props.onChange(newImgList)
    }

    handleUpload = async () => {
        let _this = this;
        await wx.chooseImage({
            count: _this.props.imgListLimit - _this.props.imgList.length, // 默认9
            sizeType: ['original', 'compressed'],  // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                let localIds = res.localIds;
                if (window.__wxjs_is_wkwebview) {
                    _this.getLocalImgData(localIds);
                }else{
                    _this.getLocalImgData(localIds);
                }

            },
            fail:(err)=>{
                alert('上传失败');
            }
        });
    }

    render(){
        let { imgList, imgListLimit, col } = this.props;
        return(
            <div className={styles.wrap}>
                <Row gutter={16}>
                    {
                        imgList.map((item,key)=>(
                            <Col key={key} className={styles.img_wrap} span={col||6}>
                                <IconFont className={styles.delImg} onClick={()=>this.handleDelImg(key)} type="icon-shanchu"/>
                                <img src={item} alt=""/>
                            </Col>
                        ))
                    }
                    {
                        imgList.length < imgListLimit && (
                            <Col className={styles.img_wrap}  span={col||6}>
                                <IconFont onClick={this.handleUpload} type="icon-web-icon-"/>
                            </Col>
                        )
                    }
                </Row>
            </div>
        )
    }
}

UploadImg.propTypes = {
    imgList: PropTypes.array.isRequired,
    imgListLimit:PropTypes.number.isRequired,
    onChange:PropTypes.func.isRequired
};

export default UploadImg;