import React, { Component, Fragment } from 'react'
import styles from './style.less'
import router from 'umi/router'
import { List, InputItem, Button, Toast, Picker, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import { Checkbox, Icon, Radio } from 'antd';
import { createForm } from 'rc-form';
import NavBarWrap from '@/components/NavbarWrap'
import { uploadImg, regCompany } from '@/services/api'
import { connect } from 'dva'
import { appId, iconUrl } from "@/config";
import { getJssdkConfig } from "@/services/wechatApi";
import wx from "weixin-js-sdk";
import addOption from '@/utils/addOption';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
});
const Item = List.Item;

@connect(({ settings }) => ({
    settings
}))
@createForm()
class AddCompanyPage extends Component {
    state = {
        asyncValue: [],
        value: 1,
        companyLogoUrl: '',
        yewu: [],
        yewu2: [],
        yewu3: []
    }

    async componentDidMount() {
        let res;
        if (window.__wxjs_is_wkwebview) {//true 时 为 IOS 设备
            res = await getJssdkConfig({ url: 'https://www.tonghangbao178.com/' });
        } else {
            res = await getJssdkConfig({ url: window.location.href });
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
    }

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, async (error) => {
            if (!error) {
                if (this.state.asyncValue.length === 0) {
                    Toast.fail('所在区域未选择', 1.5);
                    return;
                }
                let companyLogoUrl = await uploadImg({ imgData: this.state.companyLogoUrl });
                let data = Object.assign({}, this.props.form.getFieldsValue(), {
                    companyLogo: companyLogoUrl.imgPath,
                    description: this.refs.description.value,
                    yewu: this.state.yewu,
                    yewu2: this.state.yewu2,
                    yewu3: this.state.yewu3,
                    addressQuyu: this.state.asyncValue
                })
                let result = await regCompany(data);
                result.suncess ?
                    Toast.success(result.message, 1, () => router.push('/'))
                    :
                    Toast.fail(result.message, 1);

            } else {
                alert('Validation failed');
            }
        });
    }

    handleOk = (e) => {
        this.setState({
            asyncValue: e
        })
    }

    getLocalImgData = (localIds) => {
        // let _this = this;
        // wx.getLocalImgData({
        //     localId:localId, // 图片的localID
        //     success: async function (res) {
        //         let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
        //         if(window.__wxjs_is_wkwebview){
        //             localData = localData.replace('jgp', 'jpeg');
        //         }else {
        //             localData = 'data:image/jpeg;base64,'+localData;
        //         }
        //         _this.setState({
        //             companyLogoUrl:localData
        //         })
        //     },
        //     fail:(err)=>{
        //         alert('上传失败2131231');
        //     }
        // });

        let _this = this;
        var localId = localIds.pop();
        wx.getLocalImgData({
            localId: localId, // 图片的localID
            success: async function (res) {
                let localData = res.localData; // localData是图片的base64数据，可以用img标签显示
                if (window.__wxjs_is_wkwebview) {
                    localData = localData.replace('jgp', 'jpeg');
                } else {
                    localData = 'data:image/jpeg;base64,' + localData;
                }
                // let newImgList = [..._this.props.imgList].concat(localData)
                // _this.props.onChange(newImgList)
                _this.setState({
                    companyLogoUrl: localData
                })
                if (localIds.length > 0) {
                    window.setTimeout(function () {
                        _this.getLocalImgData(localIds);
                    }, 100);
                }
            },
        });
    };

    handleUpload = async () => {
        let _this = this;
        await wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: async function (res) {
                let localIds = res.localIds;
                await _this.getLocalImgData(localIds);
            },
            fail: (err) => {
                alert(JSON.stringify(err))
            }
        });
    }

    onChange = (value, arg2) => {
        if (arg2 && arg2 === 2) {
            if (value.length > 5) {
                Toast.fail('最多选择5个', 1.5)
                return false;
            } else {
                this.setState({
                    yewu2: value,
                });
            }

        } else if (arg2 && arg2 === 3) {
            if (value.length > 3) {
                Toast.fail('最多选择3个', 1.5)
                return false;
            } else {
                this.setState({
                    yewu3: value,
                });
            }
        } else {
            if (value.length > 1) {
                Toast.fail('最多选择1个', 1.5)
                return false;
            } else {
                this.setState({
                    yewu: value,
                });
            }
        }

    };

    render() {
        const { getFieldProps, getFieldError } = this.props.form;
        let { companyLogoUrl, yewu, yewu2, yewu3 } = this.state;
        const options = [
            { label: '公积金贷', value: '公积金贷' },
            { label: '保单贷', value: '保单贷' },
            { label: '社保贷', value: '社保贷' },
            { label: '按揭房贷', value: '按揭房贷' },
            { label: '打卡工资贷', value: '打卡工资贷' },
            { label: '退休金贷', value: '退休金贷' },
            { label: '微粒贷', value: '微粒贷' },
            { label: '信用卡贷', value: '信用卡贷' },
            { label: '同业贷', value: '同业贷' },
            { label: '营业执照贷', value: '营业执照贷' },
            { label: '国企事业单位贷', value: '国企事业单位贷' },
            { label: '银行车抵贷', value: '银行车抵贷' },
            { label: '机构车抵贷', value: '机构车抵贷' },
            { label: '银行车信贷', value: '银行车信贷' },
            { label: '银行房抵贷', value: '银行房抵贷' },
            { label: '民间房抵贷', value: '民间房抵贷' },
            { label: '民间一对一', value: '民间一对一' },
            { label: '公司资金垫资', value: '公司资金垫资' },
            { label: '企业税贷', value: '企业税贷' },
            { label: '企业信贷', value: '企业信贷' },
            { label: '企业资产抵押贷', value: '企业资产抵押贷' },
        ];
        const yewuOptions = [
            { label: '信贷', value: '信贷' },
            { label: '车贷', value: '车贷' },
            { label: '房贷', value: '房贷' },
            { label: '垫资', value: '垫资' },
            { label: '企业贷', value: '企业贷' },
            { label: '生意贷', value: '生意贷' },
            { label: '装修贷', value: '装修贷' },
            { label: '综合金融', value: '综合金融' },
        ];
        return (
            <Fragment>
                <NavBarWrap
                    title={'新增公司'}
                />

                <Item
                    extra={
                        <div className={styles.p_headerImgBox}>
                            {
                                companyLogoUrl === '' ? <IconFont onClick={this.handleUpload} type="icon-web-icon-" /> :
                                    <img src={companyLogoUrl} onClick={this.handleUpload} alt="公司logo" />
                            }

                        </div>
                    }
                >公司-logo</Item>
                <InputItem
                    {...getFieldProps('shortName', {
                        rules: [
                            { required: true, message: '请填写公司简称' },
                        ],
                    })}
                    clear
                    placeholder="请填写公司简称"
                >公司简称</InputItem>
                <InputItem
                    {...getFieldProps('companyName', {
                        rules: [
                            { required: true, message: '请填写公司名称' },
                        ],
                    })}
                    clear
                    placeholder="请填写公司全称"
                >公司全称</InputItem>
                <InputItem {...getFieldProps('guimo')} placeholder="请填写公司人数" clear type='number'>
                    公司人数
                </InputItem>

                {/* 主营业务 */}
                <WingBlank size="lg">
                    <WhiteSpace size="lg" />
                    <Card>
                        <Card.Header
                            title="主营业务"
                            extra={<span>以下业务选择1个</span>}
                        />
                        <Card.Body>
                            <Checkbox.Group options={yewuOptions} value={yewu} onChange={this.onChange} />
                        </Card.Body>
                    </Card>
                </WingBlank>
                <WhiteSpace size="lg" />

                {/* 次营业务 */}
                <WingBlank size="lg">
                    <Card>
                        <Card.Header
                            title="次营业务"
                            extra={<span>最多选择5个</span>}
                        />
                        <Card.Body>
                            <Checkbox.Group options={options} value={yewu2} onChange={(e) => this.onChange(e, 2)} />
                        </Card.Body>
                    </Card>
                </WingBlank>
                <WhiteSpace size="lg" />

                {/* 其他业务 */}
                {/* <WingBlank size="lg">
                    <Card>
                        <Card.Header
                            title="次营业务"
                            extra={<span>最多选择三个</span>}
                        />
                        <Card.Body>
                            <Checkbox.Group options={options} value={yewu3} onChange={(e) => this.onChange(e, 3)} />
                        </Card.Body>
                    </Card>
                </WingBlank> */}


                <Picker
                    data={addOption}
                    cols={3}
                    value={this.state.asyncValue}
                    onOk={(e) => this.handleOk(e)}
                >
                    <List.Item arrow="horizontal" onClick={this.onClick}>所在区域</List.Item>
                </Picker>
                <InputItem
                    {...getFieldProps('address', {
                        rules: [
                            { required: true, message: '请填写公司地址' }
                        ]
                    })}
                    clear
                    placeholder="请填写公司地址"
                >公司地址</InputItem>
                <InputItem
                    {...getFieldProps('lxrName', {
                        rules: [
                            { required: true, message: 'Please input account' }
                        ],
                    })}
                    clear
                    placeholder="添加人姓名"
                >添加人姓名</InputItem>
                <InputItem
                    {...getFieldProps('lxrTel', {
                        rules: [
                            { required: true, message: 'Please input account' }
                        ],
                    })}
                    clear
                    type={'phone'}
                    placeholder="添加人电话"
                >添加人电话</InputItem>
                <Item>
                    <div>公司简介</div>
                    <textarea ref='description' rows={3} placeholder={'请输入公司简介，最多60字'} maxLength={60} />
                </Item>
                <Item>
                    <Button type="primary" size="large" onClick={this.onSubmit}>提交</Button>
                </Item>
            </Fragment>
        )
    }
}

export default AddCompanyPage


