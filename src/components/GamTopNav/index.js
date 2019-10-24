import  React , {Component } from 'react'
import { connect } from "dva";
import { Tabs, SearchBar, NoticeBar, Toast } from 'antd-mobile';
import router from "umi/router";
import styles from './style.less'

@connect(({gam})=>({
    gam
}))
class TopNav extends Component{
    state={
        searchBar:''
    }
    componentDidMount(){
        let { dispatch, gam } =this.props;
        if(gam.get('dataList').size === 0){
            dispatch({
                type:'gam/initDataList',
                payload:{
                    type:{ title: '全部',key:0 },
                    data:{
                        page:1,
                        size:10
                    }
                }
            })
        }
    }
    handleClick = (e) => {
        let { dispatch } =this.props;
        this.setState({
            searchBar:''
        })
        dispatch({
            type:'gam/initDataList',
            payload:{
                type:e,
                data:{
                    page:1,
                    size:10
                }
            }
        })
    }
    handleChange = (val) => {
        this.setState({
            searchBar:val
        })
    }
    handleSub = (value) => {
        let {dispatch} = this.props;
        this.setState({
            searchBar:value
        })
        dispatch({
            type: 'gam/findArtByWhere',
            payload: {
                where:
                    {
                        $or: [
                            {username: {$regex: value, $options: 'i'}},
                            {title: {$regex: value, $options: 'i'}},
                            {type: {$regex: value, $options: 'i'}},
                            {content: {$regex: value, $options: 'i'}}
                        ]
                    },
                page:1,
                size:100
            },
            callback:(e)=>{
                if(e){
                    Toast.info('无更多数据')
                }
            }
        })
    }
    render(){
        let { searchBar } = this.state;
        const tabs = [
            { title: '全部',key:0 },
            { title: '我的关注',key:1 },
            { title: '贷款产品',key:3 },
            { title: '同行转单',key:4 },
            { title: '同行交流',key:5 },
            { title: '经验分享',key:6 },
            { title: '约跑同行',key:7 },
            { title: '招聘信息',key:8 },
        ];

        return(
            <div className={styles.fixedTop}>
                <SearchBar
                    placeholder="可按标题或内容搜索"
                    value={searchBar}
                    onChange={this.handleChange}
                    onCancel={this.handleSub}
                    cancelText={'搜索'}
                />
                <NoticeBar style={{fontSize:'18px'}} mode="link" onClick={()=>router.push('/user/release')}>
                    点击这里，发布消息，推广您的产品
                </NoticeBar>
                <Tabs
                    tabs={tabs}
                    initialPage={0}
                    onTabClick = {this.handleClick}
                >
                </Tabs>
            </div>
        )
    }
}

export default TopNav