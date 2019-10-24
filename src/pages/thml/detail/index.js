import React, { Fragment } from "react";
import { Tabs } from 'antd-mobile';
import NavbarWrap from '@/components/NavbarWrap'
import Info from './Info';
import Article from './Article';

const tabs = [
    { title: '个人介绍' },
    { title: '发的动态'}
];

const TabExample = (props) => {
        return(
            <Fragment>
                <NavbarWrap
                    title={'个人详情'}
                />
                <Tabs tabs={tabs}
                      initialPage={0}
                >
                    <Info
                        id={props.location.query.id}
                    />
                    <Article
                        id={props.location.query.id}
                    />
                </Tabs>
            </Fragment>
        )
};

export default TabExample