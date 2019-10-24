import React, { Component, Fragment } from 'react'
import { connect } from 'dva';
import CompanyItem from '@/components/CompanyItem'
import { Toast, Picker, List, SearchBar, NoticeBar } from 'antd-mobile';
import Authorized from '@/components/Authorized';
import router from "umi/router";
import addOption from '@/utils/addOption';
import styles from './style.less';
import Tloader from 'react-touch-loader';

@connect(state =>({
    settings:state.settings,
    company:state.company,
}))
class IndexPage extends Component{
    state = {
        sValue:[],
        hasMore:true,
        autoLoadMore:true,
        initializing: 0,
        currentPage:1
    }

    handleLoadMore = (resove) => {
        let { dispatch } = this.props;
        dispatch({
            type:'company/loadMore',
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

    async componentDidMount(){
        let { dispatch, company } = this.props;
        dispatch({
            type:'user/fetchUserData'
        })
        if(company.size===0){
            dispatch({
                type:'company/initData',
                payload:{
                    page:1,
                    size:10
                }
            },{
                type:'settings/initData'
            });
        }
    }

    handleChange = (e) => {
        this.setState({ sValue: e })
        let { dispatch } = this.props;
        dispatch({
            type:'company/findCompanyByWhere',
            payload:{
                where:{addressQuyu:e===''?undefined:e}
            }
        })
    }

    handleSub = (value) => {
        let {dispatch} = this.props;
        dispatch({
            type: 'company/findCompanyByWhere',
            payload: {
                where:
                    {
                        $or: [
                            {companyName: {$regex: value, $options: 'i'}},
                            {shortName: {$regex: value, $options: 'i'}},
                            {addressQuyu: {$regex: value, $options: 'i'}},
                            {address: {$regex: value, $options: 'i'}},
                            {yewu: {$regex: value, $options: 'i'}},
                            {description: {$regex: value, $options: 'i'}}
                        ]
                    }

            }
        })
    };

    tz = () => {
        router.push('/addcompany');
    }

    render(){
        let { company } = this.props;
        let { sValue, hasMore, autoLoadMore, initializing } =this.state;
        return(
            <Fragment>
                {/*<Authorized/>*/}
                <div className={styles.fixTop}>
                    <SearchBar
                        placeholder="可按公司名字或地址或业务搜索"
                        onCancel={this.handleSub}
                        cancelText={'搜索'}
                    />
                    <Picker
                        data={addOption}
                        title="选择条件"
                        value={sValue}
                        onOk={this.handleChange}
                    >
                        <List.Item arrow="horizontal">按区域搜索</List.Item>
                    </Picker>
                    <NoticeBar style={{fontSize:'18px'}} mode="link" onClick={this.tz}>
                        点击这里，添加您的公司
                    </NoticeBar>
                </div>
                <div className={styles.d2}>
                    <Tloader
                        initializing={initializing}
                        hasMore={hasMore}
                        onLoadMore={this.handleLoadMore}
                        autoLoadMore={autoLoadMore}
                    >
                        {
                            company.map((item,key)=>{
                                return (
                                    <CompanyItem
                                        key={key}
                                        data={item}
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
export default IndexPage