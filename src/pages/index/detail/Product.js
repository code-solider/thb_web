import React, { Component } from 'react';
import {List, Result} from 'antd-mobile';
import {Icon} from "antd";
import {iconUrl} from '@/config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
})

class CompanyDetailProductPage extends Component{
    render(){
        return(
            <Result
                img={<IconFont style={{ fontSize: '30px' }} type="icon-kaifa" />}
                message={'页面开发中'}
                style={{minHeight:`calc(100vh - 100px)`}}
            />
        )
    }
}
export default CompanyDetailProductPage