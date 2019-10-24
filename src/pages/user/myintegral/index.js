import React, {Component} from 'react'
import styles from './style.less'
import {NavBar, Icon, List, Button, Toast} from 'antd-mobile';
import router from 'umi/router';
import {connect} from "dva";
import {formatDateDetail} from '@/utils/request'

const Item = List.Item;
const Brief = Item.Brief;

@connect(({user}) => ({
    signInRecords: user.getIn(['intergralArr', 'signInRecords']),
    otherRecords: user.getIn(['intergralArr', 'otherRecords']),
    userData:user.getIn(['userData'])
}))
class MyIntegral extends Component {
    componentDidMount() {
        let {dispatch} = this.props;
        dispatch({
            type: 'user/getIntergralRecords'
        })
    }

    handleBack = () => {
        router.goBack()
    }

    handleSignIn = async () => {
        let {dispatch} = this.props;
        dispatch({
            type:'user/singnIn'
        })
    }

    render() {
        let {signInRecords, otherRecords} = this.props;
        return (
            <div className={styles.wrap}>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left"/>}
                    onLeftClick={this.handleBack}
                >我的金币</NavBar>
                <div className={styles.d1}>
                    <div className={styles.item}>
                        <div className={styles.item_1}>当前可用金币</div>
                        <div className={styles.item_2}>{this.props.userData.get('intergral')}</div>
                    </div>
                    <div className={styles.sign_in}>
                        <Button onClick={this.handleSignIn} type="primary" inline>签到</Button>
                    </div>

                    <List renderHeader={() => '签到记录'}>
                        {
                            signInRecords.map((item, key) => (
                                <Item
                                    key={key}
                                    extra={`+${item.get('val')}金币`}>{formatDateDetail(Number(item.get('createTime')))}</Item>
                            ))
                        }
                    </List>
                    <List renderHeader={() => '其他获得'}>
                        {
                            otherRecords.map((item, key) => (
                                <Item
                                    key={key}
                                    multipleLine
                                    extra={`+${item.get('val')}金币`}
                                >
                                    {item.get('type')===2?'发布信息':item.get('type')===3?'推荐用户':'其他'} ({item.get('username')}) <Brief>{formatDateDetail(Number(item.get('createTime')))}</Brief>
                                </Item>
                            ))
                        }
                    </List>
                </div>
            </div>
        )
    }
}

export default MyIntegral