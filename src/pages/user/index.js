import styles from './style.less';
import { Avatar, Icon } from 'antd';
import  React , {Component} from 'react'
import { connect } from "dva";
import router from'umi/router'
import Link from 'umi/link';
import global from '@/config'
import { ActivityIndicator, Modal, Button, Toast } from 'antd-mobile';
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: global.iconUrl
});

@connect(({ user, settings})=>({
    userData:user.toJS().userData,
    settings
}))
class User extends Component{

    state = {
        isShow: false,
    };

    componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'user/fetchUserData'
        })
        dispatch({
            type:'settings/initData'
        })
    }

    handleTx = () => {
        Toast.info('功能开发中',1.5)
    }

    tz = (a) => {
        router.push(a)
    }
    render(){
        let { realName, money, intergral,  nickname, isVIP, headimgurl } = this.props.userData
        return (
            <div className={styles.wrap}>
                <Modal
                    visible={this.state.isShow}
                    transparent
                    onClose={()=>this.setState({isShow: false})}
                    title="识别图中二维码添加好友"
                >
                    <img className={styles.ewm} src={this.props.settings.get('ewmImg')} alt="微信二维码"/>
                </Modal>
                <div className={styles.d1}>
                    <div className={styles.dd}>
                        <div>我的钱包</div>
                        <div>{money}</div>
                        <Button onClick={this.handleTx} type="warning" size="small" inline>提现</Button>
                    </div>
                    <div  className={styles.info}>
                        <Avatar shape="square" size={40} src={headimgurl} />
                        <div>{realName?realName:nickname}</div>
                        <div className={styles.isVip}>{realName?(isVIP?'钻石会员':'[普通会员]'):(<Link to="/user/register">尚未注册</Link>)}</div>
                    </div>
                    <div className={styles.dd}>
                        <div>我的金币</div>
                        <div>{intergral}</div>
                        <Button onClick={()=>this.tz('/user/myintegral')} type="warning" size="small" inline>查看</Button>
                    </div>
                </div>
                <div className={styles.d2}>
                    <div onClick={realName?()=>this.tz('/user/userinfo'):()=>this.tz('/user/register')}>
                        <IconFont className={styles.icon} type="icon-icon-test" />
                        <p>{realName?'我的资料':'去注册'}</p>
                    </div>
                    <div onClick={()=>this.setState({isShow: true})}>
                        <IconFont className={styles.icon} type="icon-kefu" />
                        <p>添加客服</p>
                    </div>
                    <div onClick={()=>this.tz('/addcompany')}>
                        <IconFont className={styles.icon} type="icon-nb-" />
                        <p>公司入驻</p>
                    </div>
                    <div onClick={()=>this.tz('/user/vip')}>
                        <IconFont  className={styles.icon} type="icon-vip" />
                        <p>VIP会员</p>
                    </div>
                </div>
                <div className={styles.d3}>
                    <div onClick={()=>this.tz('/user/company')}>
                        <IconFont type="icon-gongsi"/>
                        <div>我关注的公司</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/colleague')}>
                        <IconFont type="icon-icon-"/>
                        <div>我关注的同行</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/invitation')}>
                        <IconFont type="icon-tianjia"/>
                        <div>邀请好友赚金币</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/invitationRecord')}>
                        <IconFont type="icon-jilu"/>
                        <div>我的邀请记录</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/addcustomer')}>
                        <IconFont type="icon-iconyq"/>
                        <div>添加客户赚金币</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/customerlist')}>
                        <IconFont type="icon-jilu"/>
                        <div>我的客户列表</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/release')}>
                        <IconFont type="icon-fabu"/>
                        <div>发布信息赚金币</div><Icon type="right" />
                    </div>
                    <div onClick={()=>this.tz('/user/my_message')}>
                        <IconFont type="icon-jilu"/>
                        <div>我的信息列表</div><Icon type="right"/>
                    </div>
                    <div onClick={()=>this.tz('/user/setting')}>
                        <IconFont type="icon-shezhi"/>
                        <div>设置</div><Icon type="right"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default User