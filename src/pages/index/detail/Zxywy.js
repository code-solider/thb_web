import React, { Component } from 'react'
import {List, Result } from 'antd-mobile';
import {connect} from "dva";
import router from 'umi/router';
import {Icon} from "antd";
import {iconUrl} from '@/config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
});

const Item = List.Item;

@connect(({companyDetail}) => ({
    companyUserList: companyDetail.get('companyUserList')
}))
class CompanyDetailRyPage extends Component {
    componentDidMount() {
        let {dispatch, id} = this.props;
        dispatch({
            type: 'companyDetail/fetchCompanyUserList',
            payload: {
                id: id
            }
        })
    }

    render() {
        let {companyUserList} = this.props;
        return (
            <div  style={{minHeight:`calc(100vh - 100px)`}}>
                {
                    companyUserList.length > 0 ?
                        (
                            companyUserList.map((item,key)=>(
                                <Item
                                    key={key}
                                    thumb={item.headimgurl}
                                    arrow="horizontal"
                                    onClick={() => {router.push(`/thml/detail?id=${item._id}`);}}
                                >{item.realName}</Item>
                            ))
                        )
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

export default CompanyDetailRyPage