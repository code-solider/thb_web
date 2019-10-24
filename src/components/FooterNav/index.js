import React, {Component} from 'react'
import router from 'umi/router';
import {TabBar} from 'antd-mobile';
import {Icon} from 'antd';
import global from '@/config'
import { connect } from "dva";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: global.iconUrl
});

@connect(({settings})=>({
    settings
}))
class FooterNav extends Component {
    handlePress = (a, b) => {
        let { dispatch } = this.props;
        dispatch({
            type:'settings/switchSelectedTab',
            payload:a
        })
        router.push(b);
    }


    render() {
        let { footerNavselectedTab } = this.props.settings.toJS();
        return (
            <TabBar
                noRenderContent={true}
            >
                <TabBar.Item
                    title="公司名录"
                    key="Life"
                    icon={<IconFont type="icon-mulu" style={{fontSize: '23px'}}/>}
                    selectedIcon={<IconFont type="icon-mulu-copy" style={{fontSize: '23px'}}/>}
                    selected={footerNavselectedTab === 'blueTab'}
                    onPress={() => this.handlePress('blueTab', '/')}
                >
                </TabBar.Item>
                <TabBar.Item
                    icon={<IconFont type="icon-wenjianjia" style={{fontSize: '23px'}}/>}
                    selectedIcon={<IconFont type="icon-wenjianjia-copy" style={{fontSize: '23px'}}/>}
                    title="同行名录"
                    key="Koubei"
                    selected={footerNavselectedTab === 'redTab'}
                    onPress={() => this.handlePress('redTab', '/thml')}
                >
                </TabBar.Item>
                <TabBar.Item
                    icon={<IconFont type="icon-shejiao" style={{fontSize: '23px'}}/>}
                    selectedIcon={<IconFont type="icon-shejiao-copy" style={{fontSize: '23px'}}/>}
                    title="同行社交"
                    key="Friend"
                    selected={footerNavselectedTab === 'greenTab'}
                    onPress={() => this.handlePress('greenTab', '/gam')}
                >
                </TabBar.Item>
                <TabBar.Item
                    icon={<IconFont type="icon-gerenzhongxin" style={{fontSize: '23px'}}/>}
                    selectedIcon={<IconFont type="icon-gerenzhongxin-copy" style={{fontSize: '23px'}}/>}
                    title="个人中心"
                    key="userCenter"
                    selected={footerNavselectedTab === 'userCenter'}
                    onPress={() => this.handlePress('userCenter', '/user')}
                >
                </TabBar.Item>
            </TabBar>
        )
    }
}

export default FooterNav