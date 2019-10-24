import React, { Component, Fragment } from 'react';
import styles from './style.less';
import wx from 'weixin-js-sdk';
import NavBarWrap from '@/components/NavbarWrap';
import { Toast, Picker, List, InputItem, Button, Modal } from 'antd-mobile';
import UploadImg from '@/components/UploadImg'
import { connect } from "dva";
import { uploadImg, updatefirst } from "@/services/api";
import router from 'umi/router';
import { getJssdkConfig } from "@/services/wechatApi";
import {appId} from "@/config";
import { createForm } from 'rc-form';
import addOption from '@/utils/addOption';
import store from 'store';

const alert = Modal.alert;

@connect(({user, company})=>({
    userData:user.toJS().userData,
    company
}))
class Page extends Component{
    state = {
        tgm:'',
        sexListData: [
            {
                label:'男',
                value: '1',
            },
            {
                label:'女',
                value: '2',
            }
        ],
        sexValue:[],
        addressValue:[],
        imgList: [],
        companyListData:[],
        companyValue:[]
    };

    async componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'company/initData'
        })
        /**
         * 判断是不是用户推荐进来的这个页面
         */
        if(this.props.location.query.tgm){
            await this.setState({
                tgm:this.props.location.query.tgm
            });
        }
        alert('注意事项', (
            <ol className={styles.ol1}>
                <li>完善个人信息前请备好自己的微信二维码</li>
                <li>请确认自己所在公司信息已添加，如未添加，请到用户中心添加</li>
            </ol>), [
            { text: '确定', onPress: () => console.log('确定') },
        ])
        /**
         * end
         */
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

    async componentWillReceiveProps({company}){
        let arr = [];
        company!==undefined && company.map((item)=>{
            let obj={
                label:item.get('shortName')||item.get('companyName'),
                value: item.get('_id'),
            }
            arr.push(obj);
        });
        this.setState({
            companyListData:arr
        })
    }

    handleChangeSexPicker = (value) => {
        this.setState({
            sexValue:value
        })
    }
    handleChangeCompanyPicker = (value) => {
        this.setState({
            companyValue:value
        })
    }
    handleChangeAddressPicker = (value) => {
        this.setState({
            addressValue:value
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, async (error) => {
            if (!error) {
                let data = this.props.form.getFieldsValue();
                if(this.state.addressValue.length===0){
                    Toast.fail('家乡省市县未填写',1.5);
                    return;
                }
                data.jiaxiang = this.state.addressValue;
                data.age = Number(data.age);
                if(this.state.sexValue.length===0){
                    Toast.fail('未选择性别',1.5);
                    return;
                }else{
                    data.sex = Number(this.state.sexValue[0]);
                }
                if(this.state.companyValue.length===0){
                    Toast.fail('未选择公司',1.5);
                    return;
                }else{
                    data.companyId = this.state.companyValue[0];
                }
                if(this.state.tgm!==''){
                    data.yqm = this.state.tgm;
                }
                if(this.state.imgList.length===0){
                    Toast.offline('未上传微信二维码', 1)
                    return
                }
                let ewmImg = await uploadImg({imgData:this.state.imgList[0]});
                data.ewm = ewmImg.imgPath;
                let res = await updatefirst(data);
                if(res.suncess){
                    store.remove('tgm');
                    let { dispatch } = this.props;
                    dispatch({
                        type:'user/updataUserData',
                        payload:res.data
                    });
                    Toast.success(res.message, 1,()=>{
                        router.push('/user')
                    })
                }else{
                    Toast.fail(res.message, 1);
                }
            } else {
                Toast.offline('未填写完整', 1)
            }
        });
    }
    handleImgListChange = (e) => {
        this.setState({
            imgList:e
        })
    }
    render(){
        let { imgList, sexListData,sexValue, addressValue, companyListData, companyValue } = this.state;
        const { getFieldProps } = this.props.form;
        return(
            <Fragment>
                <NavBarWrap
                    title={'注册'}
                    rightContent={[
                        <div onClick={this.handleSubmit} key={1}>保存</div>
                    ]}
                />
                <Picker
                    data={companyListData}
                    value={companyValue}
                    cols={1}
                    onChange={this.handleChangeCompanyPicker}
                >
                    <List.Item arrow="horizontal">所在公司</List.Item>
                </Picker>
                <div className={styles.inputItemWrap}>
                    <div className={styles.inputItem}>
                        <label htmlFor="">微信二维码名片：</label>
                        <UploadImg
                            imgList={imgList}
                            imgListLimit = {1}
                            onChange={this.handleImgListChange}
                        />
                    </div>
                </div>
                <List>
                    <InputItem
                        {...getFieldProps('realName', {
                            rules: [
                                { required: true, message: '姓名未填写' },
                            ]
                        })}
                        clear
                        placeholder="真实姓名"
                    >姓名</InputItem>
                    <InputItem
                        {...getFieldProps('tel', {
                            rules: [
                                { required: true, message: '手机号未填写' },
                            ]
                        })}
                        type={'phone'}
                        clear
                        placeholder="手机号"
                    >手机号码</InputItem>
                    <InputItem
                        {...getFieldProps('age', {
                            rules: [
                                { required: true, message: '年龄未填写' },
                            ]
                        })}
                        type={'number'}
                        clear
                        placeholder="年龄"
                    >年龄</InputItem>

                    <Picker
                        data={sexListData}
                        value={sexValue}
                        cols={1}
                        onChange={this.handleChangeSexPicker}
                    >
                        <List.Item arrow="horizontal">性别</List.Item>
                    </Picker>
                    <Picker
                        data={addOption}
                        value={addressValue}
                        cols={3}
                        onChange={this.handleChangeAddressPicker}
                    >
                        <List.Item arrow="horizontal">家乡</List.Item>
                    </Picker>
                </List>
                <Button type="primary"  onClick={this.handleSubmit} className={styles.submitBtn}>提交</Button>
            </Fragment>
        )
    }
}
const TestWrapper = createForm()(Page);
export default TestWrapper