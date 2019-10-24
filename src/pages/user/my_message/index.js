import React, { Component, Fragment } from 'react';
import { List, SwipeAction, NoticeBar, Modal } from 'antd-mobile';
import NavBarWrap from "@/components/NavbarWrap";
import { connect } from "dva";
import router from 'umi/router';
const Item = List.Item;

const alert = Modal.alert;
@connect(({user})=>({
    myMessageList:user.get('myMessageList'),
    userId:user.getIn(['userData','_id'])
}))
class Page extends Component{
    componentDidMount(){
        let { dispatch, userId } = this.props;
        dispatch({
            type:'user/initMyMessageList',
            payload:{
                id:userId
            }
        })
    }

    handleDel = (id) => {
        let { dispatch } = this.props;
        dispatch({
            type:'user/delArtById',
            payload:{
                id
            }
        })
    }

    render(){
        let { myMessageList } = this.props;
        return(
            <Fragment>
                <NavBarWrap
                    title={'我的发布'}
                />
                <NoticeBar mode="closable" icon={null}>向左滑动信息可删除消息</NoticeBar>
                <List className="my-list">
                    {
                        myMessageList.size>0 && myMessageList.map((item,key)=>(

                            <SwipeAction
                                key={key}
                                style={{ backgroundColor: 'gray' }}
                                autoClose
                                right={[
                                    {
                                        text: '删除',
                                        onPress: ()=>alert('删除', '确定删除???', [
                                            { text: '取消', onPress: () => {return false} },
                                            { text: '确定', onPress: () => this.handleDel(item.get('_id'))},
                                        ]),
                                        style: { backgroundColor: '#F4333C', color: 'white' },
                                    },
                                ]}
                            >
                                <Item arrow="horizontal" multipleLine onClick={() => {router.push(`/gam/detail?id=${item.get('_id')}`)}}>
                                    {item.get('title')}
                                </Item>
                            </SwipeAction>
                        ))
                    }
                </List>
            </Fragment>

        )
    }
}

export default Page