import React, { Component, Fragment } from 'react';
import styles from './style.less';
import NavBarWrap from '@/components/NavbarWrap';
import { Button, DatePicker, Picker, Toast, List, InputItem, TextareaItem } from 'antd-mobile';
import router from 'umi/router';
import { connect } from "dva";
import UploadImg from '@/components/UploadImg'
import {uploadImg, updateUser } from "@/services/api";
import addOption from "@/utils/addOption";
import { createForm } from 'rc-form';

@connect(({user,company})=>({
    userData:user.toJS().userData,
    company
}))
class Page extends Component{
    state = {
        companyListData:[],
        companyId:[],
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
        headerImg:[],
    };
    async componentDidMount (){
        let { dispatch, userData } = this.props;
        dispatch({
            type:'company/initData'
        })
        this.setState({
            imgList:[userData.ewm],
            headerImg:[userData.headimgurl],
            companyId:[userData.companyId],
            addressValue:userData.jiaxiang,
            sexValue:[userData.sex+'']
        })
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
    handleChangeCompanyPicker = (value) => {
        this.setState({
            companyId: value
        });
    };
    handleChangeSexPicker = (value) => {
        this.setState({
            sexValue:value
        })
    }
    handleChangeAddressPicker = (value) => {
        this.setState({
            addressValue:value
        })
    }
    handleImgListChange = (e) => {
        this.setState({
            imgList:e
        })
    }
    handleHeaderImgChange = (e) => {
        this.setState({
            headerImg:e
        })
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, async (error) => {
            if (!error) {
                let data = this.props.form.getFieldsValue();
                data.cyTime = new Date(data.cyTime).getTime();
                data.jiaxiang = this.state.addressValue;
                data.age = Number(data.age);
                data.cyTime +='';
                data.companyId = this.state.companyId[0];
                if(data.companyId===''){
                    Toast.offline('未选择公司', 1)
                    return
                }
                data.sex = Number(this.state.sexValue[0]);
                if(this.state.imgList.length===0){
                    Toast.offline('未上传微信二维码', 1)
                    return
                }
                if(this.state.headerImg.length===0){
                    Toast.offline('未上传头像', 1)
                    return
                }
                if(!(/^http:/.test(this.state.headerImg[0]))){
                    data.headimgurl = (await uploadImg({imgData:this.state.headerImg[0]})).imgPath;

                }else{
                    data.headimgurl = this.state.headerImg[0];
                }
                if(!(/^http:/.test(this.state.imgList[0]))){
                    data.ewm = (await uploadImg({imgData:this.state.imgList[0]})).imgPath;
                }else{
                    data.ewm = this.state.imgList[0];
                }
                if(data.info===''){
                    delete data.info;
                }
                let res = await updateUser(data);
                if(res.suncess){
                    let { dispatch } = this.props;
                    dispatch({
                        type:'user/updataUserData',
                        payload:res.data
                    });
                    Toast.success(res.message, 1,()=>router.push('/user'))
                }else{
                    Toast.fail(res.message, 1.5);
                }
            } else {
                Toast.offline('未填写完整', 1.5)
            }
        });
    }

    render(){
        let { headerImg, companyListData, sexListData, addressValue,imgList, companyId, sexValue } = this.state;
        let { realName, tel, info, age, cyTime } = this.props.userData;
        const { getFieldProps } = this.props.form;
        return(
            <Fragment>
                <NavBarWrap
                    title={'编辑个人资料'}
                    rightContent={[
                        <div onClick={this.handleSubmit} key={1}>保存</div>
                    ]}
                />

                <List>
                    <InputItem
                        {...getFieldProps('realName', {
                            initialValue:realName,
                            rules: [
                                { required: true, message: '姓名未填写' },
                            ]
                        })}
                        clear
                        placeholder="真实姓名"
                    >姓名</InputItem>
                    <InputItem
                        {...getFieldProps('tel', {
                            initialValue:tel,
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
                            initialValue:age,
                            rules: [
                                { required: true, message: '年龄未填写' },
                            ]
                        })}
                        type={'number'}
                        clear
                        placeholder="年龄"
                    >年龄</InputItem>
                    <Picker
                        data={companyListData}
                        value={companyId}
                        cols={1}
                        onChange={this.handleChangeCompanyPicker}
                    >
                        <List.Item arrow="horizontal">公司</List.Item>
                    </Picker>
                    <DatePicker
                        mode={'date'}
                        format={'YYYY-MM-DD'}
                        {...getFieldProps('cyTime', {
                            initialValue:new Date(parseInt(cyTime)),
                            rules: [
                                { required: true, message: '未选择入行时间' },
                            ],
                        })}
                    >
                        <List.Item arrow="horizontal">入行时间</List.Item>
                    </DatePicker>
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
                    <TextareaItem
                        {...getFieldProps('info', {
                            initialValue:info||'',
                        })}
                        rows={2}
                        count={60}
                        placeholder={'请填写简要描述，60字以内'}
                    />
                </List>
                <div className={styles.inputItemWrap}>
                    <div className={styles.inputItem}>
                        <label htmlFor="">微信二维码名片：</label>
                        <UploadImg
                            imgList={imgList}
                            imgListLimit = {1}
                            col={12}
                            onChange={this.handleImgListChange}
                        />
                    </div>
                    <div className={styles.inputItem}>
                        <label htmlFor="">头像：</label>
                        <UploadImg
                            imgList={headerImg}
                            imgListLimit = {1}
                            col={12}
                            onChange={this.handleHeaderImgChange}
                        />
                    </div>

                </div>
                <Button type="primary"  onClick={this.handleSubmit} className={styles.submitBtn}>提交</Button>
            </Fragment>
        )
    }
}
const TestWrapper = createForm()(Page);
export default TestWrapper