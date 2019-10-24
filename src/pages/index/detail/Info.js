import React, { Component } from 'react'
import styles from './Info.less';
import { connect } from "dva";
import { Avatar, Switch } from 'antd';

@connect(({ companyDetail }) => ({
    companyDetail
}))
class CompanyDetailInfoPage extends Component {
    componentDidMount() {
        let { dispatch, id } = this.props;
        dispatch({
            type: 'companyDetail/initCompanyData',
            payload: id
        })
    }
    onChange = (checked) => {
        let { dispatch, id } = this.props;
        if (checked) {
            dispatch({
                type: 'companyDetail/switchCheckedTrue',
                payload: id
            })
        } else {
            dispatch({
                type: 'companyDetail/switchCheckedFalse',
                payload: id
            })
        }
    }
    render() {
        let {
            companyName, companyLogo, shortName, addressQuyu, guimo, lxrName, lxrTel, address, yewu, yewu2, yewu3, description
        } = this.props.companyDetail.toJS().companyData;
        let { isFollow } = this.props.companyDetail.toJS();
        return (
            <div className={styles.wrap}>
                <div className={styles.line_One}>
                    <Avatar size={50} className={styles.avatar} shape="square" src={companyLogo} />
                    <div className={styles.all_name}>
                        <div>简称: {shortName}</div>
                        <div>全称: {companyName}</div>
                    </div>
                    <div className={styles.d1}>
                        <Switch platform="android" checked={isFollow} onChange={this.onChange} />
                        <div>关注我们</div>
                    </div>
                </div>
                <div className={styles.d2}>
                    <div>
                        <div className={styles.d1}>所在区域：</div>
                        <div className={styles.d2}>{addressQuyu !== undefined ? addressQuyu.join('-') : addressQuyu}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>地址：</div>
                        <div className={styles.d2}>{address}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>人数：</div>
                        <div className={styles.d2}>{guimo}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>主营业务：</div>
                        <div className={styles.d2}>{yewu !== undefined ? yewu.join('-') : yewu}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>次营业务：</div>
                        <div className={styles.d2}>{yewu2 !== undefined ? yewu2.join('-') : '暂未录入'}</div>
                    </div>
                    {/* <div>
                        <div className={styles.d1}>其他业务：</div>
                        <div className={styles.d2}>{yewu3 !== undefined ? yewu3.join('-') : '暂未录入'}</div>
                    </div> */}
                    <div>
                        <div className={styles.d1}>简介：</div>
                        <div className={styles.d2}>{description}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>添加人姓名：</div>
                        <div className={styles.d2}>{lxrName}</div>
                    </div>
                    <div>
                        <div className={styles.d1}>添加人电话：</div>
                        <div className={styles.d2}>{lxrTel}<a href={`tel://${lxrTel}`}>拨打电话</a></div>
                    </div>
                </div>
            </div>
        )
    }
}
export default CompanyDetailInfoPage