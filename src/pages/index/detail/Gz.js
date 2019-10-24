import React, { Component } from 'react'
import {List, Result} from 'antd-mobile';
import {connect} from "dva";
import router from 'umi/router';
import {Icon} from "antd";
import {iconUrl} from '@/config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
})

const Item = List.Item;

@connect(({companyDetail}) => ({
    companyFollowUser: companyDetail.get('companyFollowUser')
}))
class CompanyDetailGzPage extends Component {
    componentDidMount() {
        let {dispatch, id} = this.props;
        dispatch({
            type: 'companyDetail/fetchCompanyFollowUser',
            payload: {
                id
            }
        })
    }

    render() {
        let {companyFollowUser} = this.props;
        return (
            <div  style={{minHeight:`calc(100vh - 100px)`}}>
                {


                    companyFollowUser.length > 0 ?
                        (
                            companyFollowUser.map((item,key)=>(
                                <Item
                                    key={key}
                                    thumb={item.userHeaderImg}
                                    arrow="horizontal"
                                    onClick={() => {router.push(`/thml/detail/info?id=${item.userId}`);}}
                                >{item.username}</Item>
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

export default CompanyDetailGzPage