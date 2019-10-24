import React, { Component } from 'react'
import styles from './style.less'
import { NavBar, Icon, List    } from 'antd-mobile';
import router from 'umi/router';
import { connect } from "dva";

const Item = List.Item;

@connect(({user})=>({
    followCompanyMessage:user.toJS().followCompanyMessage
}))
class Company extends Component{

    handleBack = () => {
        router.goBack()
    }

    componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'user/initFollowCompanyMessage'
        })
    }

    handleClick = (e) => {
        router.push(`/index/detail/info?id=${e}`)
    }

    render(){
        let { followCompanyMessage } = this.props;
        return(
            <div className={styles.wrap}>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick = {this.handleBack}
                >关注的公司</NavBar>
                <List>
                    {
                        followCompanyMessage.map((item,key)=>{
                            return (
                                <Item
                                    key={key}
                                    thumb={item.companyLogo}
                                    arrow="horizontal"
                                    onClick={() =>this.handleClick(item.companyId)}
                                >{item.companyName}</Item>
                            )
                        })
                    }
                </List>
            </div>
        )
    }
}

export default Company