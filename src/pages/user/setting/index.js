import React, { Component, Fragment } from 'react';
import { List, Modal, Toast } from 'antd-mobile';
import NavBarWrap from "@/components/NavbarWrap";
import { Icon } from 'antd';
import {loginOut} from '@/utils/request';
import router from 'umi/router'
import {iconUrl} from '@/config'
import EWMImg from '@/assets/img/_20190612234302.png'
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
});
const Item = List.Item;
const Brief = Item.Brief;

class Page extends Component{
    state = {
        isShow:false
    }

    handleClickReLogin = () => {
        loginOut();
        Toast.info('重新登陆中',1.5,()=>{router.push('/login')})
    }

    render(){
        return(
            <Fragment>
                <Modal
                    visible={this.state.isShow}
                    transparent
                    onClose={()=>this.setState({isShow: false})}
                    title="识别图中二维码添加好友"
                >
                    <img style={{ width: '150px', height:'150px'}}  src={EWMImg} alt="微信二维码"/>
                </Modal>
                <NavBarWrap
                    title={'设置'}
                />
                <List>
                    <Item
                        thumb=<IconFont type="icon-guanlingzhongxindenglu" style={{ fontSize: '20px'}}/>
                        arrow="horizontal"
                        multipleLine
                        onClick={this.handleClickReLogin}>
                        重新登录<Brief>如果遇到使用问题，可以尝试重新登录</Brief>
                    </Item>
                    {/*<Item*/}
                        {/*thumb=<IconFont type="icon-lianxiwomen" style={{ fontSize: '20px'}}/>*/}
                        {/*arrow="horizontal"*/}
                        {/*multipleLine*/}
                {/*onClick={()=>this.setState({isShow: true})}*/}
                        {/*>*/}
                        {/*技术支持*/}
                        {/*<Brief>如果你有好建议，可联系我们</Brief>*/}
                    {/*</Item>*/}
                </List>
            </Fragment>
        )
    }
}

export default Page