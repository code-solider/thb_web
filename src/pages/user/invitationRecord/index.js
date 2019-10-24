import React, { Component } from 'react'
import styles from './style.less'
import { NavBar, Icon, List    } from 'antd-mobile';
import router from 'umi/router';
import { connect } from "dva";

const Item = List.Item;
const Brief = Item.Brief;

@connect(({user})=>({
    invitationRecord:user.toJS().invitationRecord
}))
class InvitationRecord extends Component{

    handleBack = () => {
        router.goBack()
    }

    componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'user/initInvitationRecord'
        })
    }

    render(){
        let { invitationRecord } =this.props;
        return(
            <div className={styles.wrap}>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick = {this.handleBack}
                >邀请记录</NavBar>
                <List>

                    {
                        invitationRecord.map((item,key)=>(
                            <Item
                                key={key}
                                thumb={item.headimgurl}
                                arrow="horizontal"
                                onClick={() => {}}
                            >{item.realName}<Brief>{item.regTime}</Brief></Item>
                        ))
                    }

                </List>
            </div>
        )
    }
}

export default InvitationRecord