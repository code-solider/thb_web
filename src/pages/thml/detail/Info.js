import React, { Component } from 'react'
import styles from './Info.less';
import { Switch, Icon, Avatar } from 'antd';
import { connect } from "dva";
import { Card, WhiteSpace, Drawer} from 'antd-mobile';
import global from '@/config'
import {formatDateDetail} from '@/utils/request';
import router from 'umi/router';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: global.iconUrl
});

@connect(({ thml, user })=>({
    thml,
    user,
    isVIP:user.getIn(['userData','isVIP'])
}))
class Info extends Component{
    componentDidMount(){
        let { dispatch, id } = this.props;
        dispatch({
            type:'thml/initUserDetail',
            payload:id
        })
    }
    state = {
        open: false,
    }
    onOpenChange = () => {
        this.setState({ open: !this.state.open });
    }
    onChange = (checked) => {
        let { dispatch, id } = this.props;
        if(checked){
            dispatch({
                type:'thml/switchFollow',
                payload:id
            })
        }else{
            dispatch({
                type:'thml/switchCancelFollow',
                payload:id
            })
        }
    }
    render(){
        let { ewm, realName, sex, age, jiaxiang, headimgurl, cyTime, companyName, info, gsyw, tel } = this.props.thml.toJS().userDetail;
        let { isFollow } = this.props.thml.toJS();
        let { isVIP } = this.props;
        const sidebar = (
            <div className={styles.erm_wrap}>
                <div className={styles.ewm_img}>
                    <img src={ewm} alt="二维码图片"/>
                </div>
                <div className={styles.info}>
                    长按识别二维码添加好友
                </div>
            </div>
        );
        return(
            <div className={styles.wrap}>
                <div className={styles.line_One}>
                    <Avatar size={50} className={styles.avatar} shape="square" src={headimgurl} />
                    <div className={styles.all_name}>
                        <div>姓名: {realName}</div>
                        <div>性别: {sex===1?'男':'女'} <span>年龄:{age}</span></div>
                    </div>
                    <div className={styles.d1}>
                        <Switch platform="android" checked={isFollow} onChange={this.onChange} />
                        <div>关注ta</div>
                    </div>
                </div>
                <div className={styles.d2}>
                    <div>
                        <div className={styles.d1}>公司：</div>
                        <div className={styles.d2}>{companyName||'暂未填写'}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>公司业务：</div>
                        <div className={styles.d2}>{gsyw!==undefined?gsyw.join(', '):'暂未填写'}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>家乡：</div>
                        <div className={styles.d2}>{jiaxiang}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>从业时间：</div>
                        <div className={styles.d2}>{cyTime!==''?formatDateDetail(parseInt(cyTime)).split(' ')[0]:'暂未填写'}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>简介：</div>
                        <div className={styles.d2}>{info||'暂未填写'}</div>
                    </div>
                </div>
                <WhiteSpace/>

                <div className={isVIP?styles.disn:styles.vip_message} onClick={()=>router.push('/user/vip')}>
                    <IconFont type="icon-vip" />
                    <dl>
                        <dt>开通会员</dt>
                        <dd>可拨打电话 + 添加微信好友</dd>
                    </dl>
                </div>

                <Card className={isVIP?styles.card:styles.disn}>
                    <Card.Header
                        title={`会员权限 (电话:${tel})`}
                    />
                    <Card.Body>
                        <div className={styles.icon_wrap}>
                            <a href={`tel://${tel}`}><IconFont type="icon-dianhua"/></a>
                            <IconFont onClick={this.onOpenChange} type="icon-weixin" />
                        </div>
                    </Card.Body>
                </Card>
                <Drawer
                    className={this.state.open===true? styles.my_drawer:styles.my_drawer_hide}
                    contentStyle={{ color:'rgba(0,0,0,0)'}}
                    sidebar={sidebar}
                    open={this.state.open}
                    onOpenChange={this.onOpenChange}
                    position={'bottom'}
                >
                    Click upper-left corner
                </Drawer>
                {/*<div className={styles.photo_wall}>*/}
                {/*<div>照片墙</div>*/}
                {/*<Row>*/}
                {/*<Col span={6}>col-6</Col>*/}
                {/*<Col span={6}>col-6</Col>*/}
                {/*<Col span={6}>col-6</Col>*/}
                {/*<Col span={6}>col-6</Col>*/}
                {/*</Row>*/}
                {/*</div>*/}
            </div>
        )
    }
}
export default Info