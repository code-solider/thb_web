import React, { Component } from 'react'
import { connect } from "dva";
import GamIndexItem from "@/components/GamIndexItem";
import { Result } from 'antd-mobile';
import {Icon} from "antd";
import {iconUrl} from '@/config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl:iconUrl
});

@connect(({thml})=>({
    ArtData:thml.toJS().ArtData
}))
class CompanyDetailProductPage extends Component{
    componentDidMount(){
        let { dispatch, id } = this.props;
        dispatch({
            type:'thml/fetchMyArtData',
            payload:{
                id
            }
        })
    }

    render(){
        let { ArtData } =this.props;
        return(
            <div  style={{minHeight:`calc(100vh - 100px)`}}>
                {
                    ArtData.length>0?
                        (ArtData.map((item,key)=>(
                            <GamIndexItem
                                key={key}
                                data={item}
                            />)
                        ))
                        :
                        (
                            <Result
                                img={<IconFont style={{ fontSize: '30px' }} type="icon-weizhaodaojilu" />}
                                message={'暂无数据'}
                            />
                        )
                }

            </div>
        )
    }
}
export default CompanyDetailProductPage