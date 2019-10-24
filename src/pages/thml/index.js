import React, {Component, Fragment} from 'react'
import {connect} from "dva";
import styles from './style.less';
import router from 'umi/router'
import { Picker, List, SearchBar, NoticeBar, Toast } from 'antd-mobile';
import ThmlItem from '@/components/ThmlItem';
import Tloader from 'react-touch-loader';

@connect(({ thml, loading, user }) => ({
    thml, loading, user
}))
class Thml extends Component {
    state = {
        hasMore:true,
        autoLoadMore:true,
        initializing: 0,
        currentPage:1,
        sValue:false,
        seasons:[
            [
                {
                    label: '不限',
                    value: '',
                },
                {
                    label: '男',
                    value: 1,
                },
                {
                    label: '女',
                    value: 2,
                }
            ],
            [
                {
                    label: '不限',
                    value: '',
                },
                {
                    label: '20岁以下',
                    value: [0,20],
                },
                {
                    label: '20-30岁',
                    value: [20,30],
                },
                {
                    label: '30-40岁',
                    value: [30,40],
                },
                {
                    label: '40岁以上',
                    value: [40,99999],
                }
            ]
        ]
    }

    handleLoadMore = (resove) => {
        let { dispatch } = this.props;
        dispatch({
            type:'thml/loadMore',
            payload:{
                page:this.state.currentPage+1,
                size:10
            },
            callback:(e)=>{
                if(e){
                    Toast.info('无更多数据',1.5)
                    this.setState({
                        hasMore:false
                    })
                }
                resove()
            }
        });
        this.setState({
            currentPage:this.state.currentPage+1
        })
    }

    handleChange = (e) => {
        this.setState({ sValue: e })
        let { dispatch } = this.props;
        dispatch({
            type:'thml/findUserByWhere',
            payload:{
                where:{sex:e[0]===''?undefined:Number(e[0]),age:e[1]===''?undefined:{$gte:e[1][0],$lt:e[1][1]},regTime:{$ne:''}}
            }
        })
    }

    componentDidMount() {
        let { dispatch, thml } = this.props;
        if(thml.get('data').size===0){
            dispatch({
                type: 'thml/initData',
                payload:{
                    page:1,
                    size:10
                }
            });
            dispatch({
                type: 'user/fetchUserData'
            })
        }
    }

    handleSub = (value) => {
        let {dispatch} = this.props;
        dispatch({
            type: 'thml/findUserByWhere',
            payload: {
                where:
                    {
                        $or: [
                            {realName: {$regex: value, $options: 'i'}},
                            {nickname: {$regex: value, $options: 'i'}},
                            {gsyw: {$regex: value, $options: 'i'}},
                            {company: {$regex: value, $options: 'i'}},
                            {tel: {$regex: value, $options: 'i'}}
                        ]
                    }
            }
        })

    };

    render() {
        let {data} = this.props.thml.toJS();
        let { sValue, seasons, hasMore, autoLoadMore, initializing } =this.state;
        return (
            <Fragment>
                <div className={styles.fixTop}>
                    <SearchBar
                        placeholder="可按名字或地址或业务搜索"
                        onCancel={this.handleSub}
                        cancelText={'搜索'}
                    />
                    <Picker
                        data={seasons}
                        title="选择条件"
                        cascade={false}
                        extra="请选择(可选)"
                        value={sValue}
                        onOk={this.handleChange}
                    >
                        <List.Item arrow="horizontal">按条件搜索</List.Item>
                    </Picker>
                    {
                        this.props.user.getIn(['userData','regTime'])===''?(
                            <NoticeBar style={{fontSize:'18px'}} className={styles.notice} onClick={()=>router.push('/user/register')} mode="link">
                                点击这里，完善你的个人信息
                            </NoticeBar>
                        ):''
                    }
                </div>
                <div className={this.props.user.getIn(['userData','regTime'])===''?styles.d2_134:styles.d2_88}>
                    <Tloader
                        initializing={initializing}
                        hasMore={hasMore}
                        onLoadMore={this.handleLoadMore}
                        autoLoadMore={autoLoadMore}
                    >
                        {
                            data.map((item, key) => {
                                return (
                                    <ThmlItem
                                        data={item}
                                        key={key}
                                    />
                                )
                            })
                        }
                    </Tloader>
                </div>
            </Fragment>
        )
    }
}

export default Thml