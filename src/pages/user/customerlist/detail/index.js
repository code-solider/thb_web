import React, { Component, Fragment } from 'react'
import styles from './style.less'
import router from 'umi/router';
import { List, WhiteSpace, Icon, Button, WingBlank, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect } from "dva";
import NavBarWrap from '@/components/NavbarWrap'
import { addCustomer } from '@/services/api'
const Item = List.Item;

@connect(({user})=>({
    customerDetailData:user.toJS().customerDetailData
}))
class AddCustomer extends Component{
    state={
        radioValue:this.props.customerDetailData.tsfk
    }
    componentDidMount(){
        let { dispatch } =this.props;
        dispatch({
            type:'user/initCustomerDetailData',
            payload:this.props.location.query.id
        })
    }
    componentWillUnmount(){
        let { dispatch } =this.props;
        dispatch({
            type:'user/delCustomerDetailData'
        })
    }
    handleChange = (e) => {
        this.setState({radioValue: e.target.value});
    }
    handleSubmit = async () => {
        if(
            this.refs.customerName.value  === ''||
            this.refs.loanAmount.value  === ''||
            this.refs.bank.value  === ''||
            this.refs.houseDetail.value  === ''||
            this.refs.pggs.value  === ''||
            this.refs.pgjz.value  === ''||
            this.refs.qdgg.value  === ''||
            this.refs.cutomerTel.value === '' ||
            this.state.radioValue ===''
        ){
            Toast.fail('信息未录入完整', 2);
            return
        }
        let data = {
            customerName: this.refs.customerName.value,
            loanAmount: this.refs.loanAmount.value,
            bank: this.refs.bank.value,
            houseDetail: this.refs.houseDetail.value,
            pggs: this.refs.pggs.value,
            pgjz:this.refs.pgjz.value,
            tsfk: this.state.radioValue,
            qdgg: this.refs.qdgg.value,
            cutomerTel: this.refs.cutomerTel.value
        }
        let res = await addCustomer(data);
        res.suncess?Toast.success(res.message, 2,()=>router.goBack()):Toast.fail(res.message, 2);
    }
    render(){
        let { customerName, loanAmount, bank, houseDetail, pggs, pgjz, tsfk, qdgg, cutomerTel } =this.props.customerDetailData;
        return(
            <div className={styles.wrap}>
                <NavBarWrap
                    title={'编辑客户'}
                />
                <List>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">客户姓名</label>
                            <input type="text" ref={'customerName'} defaultValue={customerName}/>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">贷款金额</label>
                            <input type="text" ref={'loanAmount'} defaultValue={loanAmount}/>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">贷款银行</label>
                            <input type="text" ref={'bank'} defaultValue={bank}/>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">房屋详情</label>
                            <input type="text" ref={'houseDetail'} defaultValue={houseDetail}/>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">评估公司</label>
                            <input type="text" ref={'pggs'} defaultValue={pggs}/>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">评估价值</label>
                            <input type="text" ref={'pgjz'} defaultValue={pgjz}/>
                        </div>
                    </Item>
                    <Item>
                        是否提速放款
                        <div className={styles.radioWrap}>
                            <label><input onChange={this.handleChange} defaultChecked={tsfk?'checked' :false}   name="Fruit" type="radio" value={true} />是 </label>
                            <label><input onChange={this.handleChange} defaultChecked={tsfk?false:'checked' }   name="Fruit"  type="radio" value={false} />否 </label>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">渠道公司</label>
                            <input type="text" ref={'qdgg'} defaultValue={qdgg}/>
                        </div>
                    </Item>
                    <Item>
                        <div className={styles.item}>
                            <label htmlFor="">手机号码</label>
                            <input type="text" ref={'cutomerTel'} defaultValue={cutomerTel}/>
                        </div>
                    </Item>
                </List>
                <WhiteSpace/>
                <WingBlank>
                    <Button onClick={this.handleSubmit} className={styles.btn_submit} type="primary" size={'small'}  inline>提交</Button>
                    <Button type="warning"  size={'small'}  inline>取消</Button>
                </WingBlank>
            </div>
        )
    }
}
export default AddCustomer