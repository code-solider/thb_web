import React, {Component} from 'react'
import styles from './style.less'
import wx from 'weixin-js-sdk';
import router from 'umi/router';
import Editor from './EditorComponent'; // ES6
import UploadImg from '@/components/UploadImg'
import {NavBar, List, InputItem, WingBlank, Picker, Toast, Button } from 'antd-mobile';
import { Icon, Spin } from 'antd';
import {createForm} from 'rc-form';
import { releaseArt, uploadImg } from '@/services/api'
import { getJssdkConfig } from "@/services/wechatApi";
import {appId} from "@/config";

class ReleaseInfo extends Component {
    state = {
        imgList:[],//图片
        previewVisible: false,
        previewImage: '',
        title:'',
        type:'',
        editorHtml: "",
        loading:false
    };

    handleChange = (value) => {
        this.setState({ editorHtml: value },()=>{
            console.log(this.state.editorHtml);
        })
    }


    async componentDidMount() {
        let res = await getJssdkConfig({url: window.location.href});
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
    }


    handleBack = () => {
        router.goBack()
    }

    handleSubmit = async ()=>{
        this.setState({loading:true})
        if(this.state.title===''){
            Toast.offline('标题未填写', 1)
            return
        }
        if(this.state.type===''){
            Toast.offline('未选择类型', 1)
            return
        }
        if(this.state.editorHtml===''){
            Toast.offline('内容未填写', 1)
            return
        }
        let thumbImgUrl =[];
        for(let i = 0; i<this.state.imgList.length;i++){
            const data = await uploadImg({imgData:this.state.imgList[i]});
            data.suncess ? thumbImgUrl.push(data.imgPath) : Toast.offline('上传失败', 2)
        }
        let data = {
            title:this.state.title,
            type:this.state.type,
            content:this.state.editorHtml,
            thumbImg:thumbImgUrl
        }
        let result = await releaseArt(data);
        if(result.suncess){
            this.setState({
                title:'',
                type:'',
                editorHtml:'',
                loading:false
            })
            Toast.success(result.message, 1,()=>router.goBack())
        }else{
            this.setState({loading:false})
            Toast.fail(result.message, 2)
        }
    }
    handleChangeTitle = (e) => {
        this.setState({
            title:e
        })
    }

    handleChangeType = (e) => {
        this.setState({
            type:e[0]
        })
    }
    handleImgListChange = (e) => {
        this.setState({
            imgList:e
        })
    }

    render() {
        const {getFieldProps} = this.props.form;
        let data = [
            {label: '贷款产品', value: '贷款产品'},
            {label: '同行转单', value: '同行转单'},
            {label: '同行交流', value: '同行交流'},
            {label: '经验分享', value: '经验分享'},
            {label: '约跑同行', value: '约跑同行'},
            {label: '招聘信息', value: '招聘信息'},
        ];
        let { imgList, loading } = this.state;
        return (
            <div className={styles.wrap}>
                <Spin spinning={loading}>
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left"/>}
                        onLeftClick={this.handleBack}
                    >发布信息</NavBar>
                    <List>
                        <Picker data={data} cols={1} onOk={this.handleChangeType} {...getFieldProps('district3')}>
                            <List.Item arrow="horizontal">类型</List.Item>
                        </Picker>
                        <InputItem
                            {...getFieldProps('title')}
                            clear
                            placeholder="输入标题"
                            maxLength={25}
                            value={this.state.title}
                            onChange={this.handleChangeTitle}
                        >标题</InputItem>
                        <WingBlank>
                            <div className={styles.contnet}>
                                <Editor
                                    handleChange={this.handleChange}
                                />
                            </div>
                            <div className={styles.upload_wrap}>
                                <UploadImg
                                    imgList={imgList}
                                    imgListLimit = {6}
                                    onChange={this.handleImgListChange}
                                />
                            </div>

                        </WingBlank>
                    </List>
                    <WingBlank>
                        <Button onClick={this.handleSubmit} className={styles.submit} type="primary">发布</Button>
                    </WingBlank>
                </Spin>
            </div>
        )
    }
}

const BasicInputExampleWrapper = createForm()(ReleaseInfo);

export default BasicInputExampleWrapper