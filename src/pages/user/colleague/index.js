import React, { Component } from 'react'
import styles from './style.less'
import { NavBar, Icon, List    } from 'antd-mobile';
import router from 'umi/router';
import { connect } from "dva";
const Item = List.Item;

@connect(({user})=>({
    followUserMessage:user.toJS().followUserMessage
}))
class Colleague extends Component{

    handleBack = () => {
        router.goBack()
    }

    componentDidMount(){
        let { dispatch } = this.props;
        dispatch({
            type:'user/initFollowUserMessage'
        })
    }

    handleClick = (e) => {
        router.push(`/thml/detail/info?id=${e}`)
    }

    render(){
        let { followUserMessage } = this.props;
        return(
            <div className={styles.wrap}>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick = {this.handleBack}
                >关注的同行</NavBar>
                <List>
                    {
                        followUserMessage.map((item,key)=>{
                            return (
                                <Item
                                    key={key}
                                    thumb={item.userHeaderImg}
                                    arrow="horizontal"
                                    onClick={() =>this.handleClick(item.userId2)}
                                >{item.username2}</Item>
                            )
                        })
                    }
                    {/*<Item*/}
                        {/*thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png"*/}
                        {/*arrow="horizontal"*/}
                        {/*onClick={() => {}}*/}
                    {/*>同行名字1</Item>*/}
                    {/*<Item*/}
                        {/*thumb="https://zos.alipayobjects.com/rmsportal/UmbJMbWOejVOpxe.png"*/}
                        {/*onClick={() => {}}*/}
                        {/*arrow="horizontal"*/}
                    {/*>*/}
                        {/*同行名字2*/}
                    {/*</Item>*/}

                </List>
            </div>
        )
    }
}

export default Colleague