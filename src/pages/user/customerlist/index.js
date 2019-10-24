import React, { Component } from 'react'
import styles from './style.less'
import { NavBar, Icon, List, Modal, SwipeAction } from 'antd-mobile';
import router from 'umi/router';
import { connect } from "dva";
import { formatDateDetail } from '@/utils/request'

const Item = List.Item;
const alert = Modal.alert;
@connect(({user})=>({
    customerList:user.toJS().customerList
}))
class CustomerList extends Component{

    handleBack = () => {
        router.goBack()
    }

    componentDidMount(){
        let { dispatch } =this.props;
        dispatch({
            type:'user/initCustomerListData'
        })
    }

    handleTz = (e) => {
        router.push(e)
    }
    handleDel = (e) => {
        let { dispatch } =this.props;
        dispatch({
            type:'user/delOneCustomerData',
            payload:e
        })
    }

    render(){
        let { customerList } = this.props;
        return(
            <div className={styles.wrap}>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick = {this.handleBack}
                >我的客户</NavBar>
                <List>
                    {
                        customerList.map((item,key)=>(
                            <SwipeAction
                                key={key}
                                style={{ backgroundColor: 'gray' }}
                                autoClose
                                right={[
                                    {
                                        text: 'Delete',
                                        onPress: ()=>alert('删除', '确定删除???', [
                                            { text: '取消', onPress: () => {return false} },
                                            { text: '确定', onPress: () => this.handleDel(item._id)},
                                        ]),
                                        style: { backgroundColor: '#F4333C', color: 'white' },
                                    },
                                ]}
                            >
                                <Item>
                                    <div className={styles.item}>
                                        <div className={styles.left_body}>
                                            <div className={styles.d1}>客户：{item.customerName} | 贷额：{item.loanAmount}</div>
                                            <div className={styles.d2}>贷款银行：{item.bank}</div>
                                            <div className={styles.d3}>录入时间：{formatDateDetail(parseInt(item.createTime))}</div>
                                        </div>
                                        <div className={styles.right_body}>
                                            <div onClick={()=>this.handleTz(`/user/customerlist/detail2?id=${item._id}`)} className={styles.detail}>详情</div>
                                            <div onClick={()=>this.handleTz(`/user/customerlist/detail?id=${item._id}`)} className={styles.edit}>编辑</div>
                                        </div>
                                    </div>
                                </Item>
                            </SwipeAction>
                        ))
                    }
                </List>
            </div>
        )
    }
}

export default CustomerList