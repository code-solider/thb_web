import React, { Component, Fragment } from 'react';
import styles from './style.less';
import NavBarWrap from '@/components/NavbarWrap'
import { connect } from "dva";
import { formatDateDetail } from '@/utils/request';
import { DatePicker, Toast } from 'antd-mobile';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

function formatDate(date) {
    /* eslint no-confusing-arrow: 0 */
    const pad = n => n < 10 ? `0${n}` : n;
    const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    return `${dateStr} ${timeStr}`;
}

@connect(({user})=>({
    customerDetailData:user.toJS().customerDetailData
}))
class Page extends Component{
    state = {date: now}
    componentDidMount(){
        let { dispatch } =this.props;
        dispatch({
            type:'user/initCustomerDetailData',
            payload:this.props.location.query.id
        })
    }
    handleAddProcess = () => {
        if(this.refs.processInfo.value===""){
            Toast.fail('描述未填写', 1);
            return
        }
        let addProcessData = {
            time:formatDate(this.state.date).split(' ')[0]+'',
            info:this.refs.processInfo.value
        }
        let { process } =this.props.customerDetailData;
        process.push(addProcessData);
        let { dispatch } =this.props;
        let data = {
            id:this.props.location.query.id,
            process
        }
        dispatch({
            type:'user/addProcess',
            payload:data
        })
    }
    handleDel = (e) => {
        let { process } =this.props.customerDetailData;
        process.splice(e,1);
        let { dispatch } =this.props;
        let data = {
            id:this.props.location.query.id,
            process
        }
        dispatch({
            type:'user/addProcess',
            payload:data
        })
    }
    render(){
        let { customerName, loanAmount, bank, houseDetail, pggs, pgjz, tsfk, qdgg, cutomerTel, createTime, process } =this.props.customerDetailData;
        return(
            <Fragment>
                <NavBarWrap
                    title={'客户详情'}
                />
                <div className={styles.itemWrap}>
                    <div className={styles.item}>
                        <div className={styles.title}>贷款客户 :</div>
                        <div className={styles.info}>{customerName}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>贷款金额 :</div>
                        <div className={styles.info}>{loanAmount}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>贷款银行 :</div>
                        <div className={styles.info}>{bank}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>房屋详情 :</div>
                        <div className={styles.info}>{houseDetail}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>评估公司 :</div>
                        <div className={styles.info}>{pggs}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>评估价值 :</div>
                        <div className={styles.info}>{pgjz}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>提速放款 :</div>
                        <div className={styles.info}>{tsfk?'是':'否'}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>渠道公司 :</div>
                        <div className={styles.info}>{qdgg}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.title}>客户电话 :</div>
                        <div className={styles.info}>{cutomerTel}</div>
                    </div>
                </div>
                <div className={styles.processWrap}>
                    <div className={styles.oneLine}>
                        <div>办理时间</div>
                        <div>流程内容</div>
                        <div>操作</div>
                    </div>
                    {
                        process!==undefined &&  process.map((item,key)=>{
                            return (
                                <div key={key} className={styles.item}>
                                    <div>{item.time}</div>
                                    <div>{item.info}</div>
                                    <div><button onClick={()=>this.handleDel(key)}>删除流程</button></div>
                                </div>
                            )
                        })
                    }
                    <div className={styles.addProcess}>
                        <DatePicker
                            mode="date"
                            title="选择时间"
                            value={this.state.date}
                            onChange={date => this.setState({ date })}
                        >
                            <div>{formatDate(this.state.date).split(' ')[0]}</div>
                        </DatePicker>

                        <div><input className={styles.inp} ref={'processInfo'} type="text" placeholder={'点击添加'}/></div>
                    </div>
                    <div onClick={this.handleAddProcess} className={styles.addProcessBtn}>添加流程</div>
                </div>
                <div className={styles.time}>录入时间：{formatDateDetail(parseInt(createTime))} </div>
            </Fragment>
        )
    }
}

export default Page