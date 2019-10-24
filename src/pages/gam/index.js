import  React , {Component} from 'react'
import { connect } from "dva";
import GamIndexItem from '@/components/GamIndexItem';
import { Toast, Result } from 'antd-mobile';
import styles from './style.less';
import Tloader from 'react-touch-loader';
import {Icon} from "antd";
import {iconUrl} from '@/config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl:iconUrl
});

@connect(({ gam })=>({
    gam
}))
class GamPage extends Component{
    state={
        hasMore:true,
        autoLoadMore:true,
        initializing: 0,
        currentPage:1
    }

    handleLoadMore = (resove) => {
        let { dispatch, gam } = this.props;
        if(gam.get('type')===null){
            dispatch({
                type:'gam/findArtByWhere',
                payload:{
                    where:gam.get('searchWhere'),
                    page:gam.get('currentPage')+1,
                    size:gam.get('size')
                },
                callback:(e)=>{
                    if(e){
                        Toast.info('无更多数据',1.5)
                    }
                    resove()
                }
            });
        }else{
            dispatch({
                type:'gam/loadMore',
                payload:{
                    type:gam.get('type'),
                    data:{
                        page:gam.get('currentPage')+1,
                        size:gam.get('size')
                    }
                },
                callback:(e)=>{
                    if(e){
                        Toast.info('无更多数据',1.5)
                    }
                    resove()
                }
            });
        }
    }

    render(){
        let { gam } = this.props;
        let { hasMore, autoLoadMore, initializing } =this.state;
        return(
            <div className={styles.wrap}>
                {
                    gam.get('dataList').length>0?
                        <Tloader
                            initializing={initializing}
                            hasMore={hasMore}
                            onLoadMore={this.handleLoadMore}
                            autoLoadMore={autoLoadMore}
                        >
                            {
                                gam.toJS().dataList.map((item,key)=>(
                                    <GamIndexItem
                                        key={key}
                                        data={item}
                                    />
                                ))
                            }
                        </Tloader>
                        :
                        <Result
                            img={<IconFont style={{ fontSize: '30px' }} type="icon-weizhaodaojilu" />}
                            message={'暂无数据'}
                        />
                }
            </div>
        )
    }
}

export default GamPage