import React, { Component, Fragment } from "react";
import { Tabs } from 'antd-mobile';
import NavbarWrap from '@/components/NavbarWrap'
import Info from './Info';
import Product from './Product';
import Zxywy from './Zxywy';
import Gz from './Gz';

const tabs = [
    { title: '公司介绍' },
    { title: '公司产品'},
    { title: '在线业务员'},
    { title: '关注的人'},
];

class TabExample extends Component{
    render(){
        return(
            <Fragment>
                <NavbarWrap
                    title={'公司详情'}
                />
                <Tabs tabs={tabs}
                      initialPage={0}
                >
                    <Info
                        id={this.props.location.query.id}
                    />
                    <Product/>
                    <Zxywy
                        id={this.props.location.query.id}
                    />
                    <Gz
                        id={this.props.location.query.id}
                    />
                </Tabs>
            </Fragment>
        )
    }
};

export default TabExample