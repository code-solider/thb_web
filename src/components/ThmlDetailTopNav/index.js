import  React , {Component, Fragment } from 'react'
import { connect } from "dva";
import { Tabs, NavBar, Icon  } from 'antd-mobile';
import router from 'umi/router';

@connect(({thml})=>({
    thml
}))
class CompanyDetailTopNav extends Component{
    handleBack = () => {
        router.push(`/thml`)
    }
    render(){
        let {_id} = this.props.thml.toJS().userDetail;
        const tabs = [
            { title: '个人介绍' ,url:`/thml/detail/info?id=${_id}`},
            { title: '发的动态' ,url:`/thml/detail/dynamic?id=${_id}`},
        ];
        return(
            <Fragment>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    onLeftClick = {this.handleBack}
                >个人详情</NavBar>

                <Tabs
                    tabs={tabs}
                    renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
                    onChange={(a,b)=>{
                        router.push(a.url);
                    }}
                >
                </Tabs>
            </Fragment>

        )
    }
}

export default CompanyDetailTopNav