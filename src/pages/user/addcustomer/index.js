import React, { Component } from 'react'
import styles from './style.less'
import router from 'umi/router';
import { List, InputItem, WhiteSpace, Icon, Button, WingBlank, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import NavBarWrap from '@/components/NavbarWrap'
import { addCustomer } from '@/services/api'
const Item = List.Item;
class AddCustomer extends Component{
    state={
        radioValue:''
    }
    handleChange = (e) => {
        this.setState({radioValue: e.target.value});
    }
    handleSubmit = async () => {
        if(
            this.props.form.getFieldValue('a')  === undefined||
            this.props.form.getFieldValue('b')  === undefined||
            this.props.form.getFieldValue('c')  === undefined||
            this.props.form.getFieldValue('d')  === undefined||
            this.props.form.getFieldValue('e')  === undefined||
            this.props.form.getFieldValue('f')  === undefined||
            this.props.form.getFieldValue('h')  === undefined||
            this.props.form.getFieldValue('i') === undefined ||
            this.state.radioValue ===''
        ){
            Toast.fail('信息未录入完整', 2);
            return
        }
        let data = {
            customerName: this.props.form.getFieldValue('a'),
            loanAmount: this.props.form.getFieldValue('b'),
            bank: this.props.form.getFieldValue('c'),
            houseDetail: this.props.form.getFieldValue('d'),
            pggs: this.props.form.getFieldValue('e'),
            pgjz:this.props.form.getFieldValue('f'),
            tsfk: this.state.radioValue,
            qdgg: this.props.form.getFieldValue('h'),
            cutomerTel: this.props.form.getFieldValue('i')
        }
        let res = await addCustomer(data);
        res.suncess?Toast.success(res.message, 2,()=>router.goBack()):Toast.fail(res.message, 2);
    }
    render(){
        const { getFieldProps } = this.props.form;
        return(
            <div className={styles.wrap}>
                <NavBarWrap
                    title={'新增客户'}
                />
                <List>
                    <InputItem
                        {...getFieldProps('a')}
                        clear
                        placeholder="客户姓名"
                    >贷款客户</InputItem>
                    <InputItem
                        {...getFieldProps('b')}
                        clear
                        placeholder="贷款金额"
                    >贷款金额</InputItem>
                    <InputItem
                        {...getFieldProps('c')}
                        clear
                        placeholder="贷款银行"
                    >贷款银行</InputItem>
                    <InputItem
                        {...getFieldProps('d')}
                        clear
                        placeholder="房屋详情"
                    >房屋详情</InputItem>
                    <InputItem
                        {...getFieldProps('e')}
                        clear
                        placeholder="评估公司"
                    >评估公司</InputItem>
                    <InputItem
                        {...getFieldProps('f')}
                        clear
                        placeholder="评估价值"
                    >评估价值</InputItem>
                    <Item>
                        是否提速放款
                        <div className={styles.radioWrap}>
                            <label><input onChange={this.handleChange} name="Fruit" type="radio" value={true} />是 </label>
                            <label><input onChange={this.handleChange} name="Fruit" type="radio" value={false} />否 </label>
                        </div>
                    </Item>
                    <InputItem
                        {...getFieldProps('h')}
                        clear
                        placeholder="渠道公司"
                    >渠道公司</InputItem>
                    <InputItem
                        {...getFieldProps('i')}
                        clear
                        type="phone"
                        placeholder="手机号码"
                    >手机号码</InputItem>
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
const BasicInputExampleWrapper = createForm()(AddCustomer);
export default BasicInputExampleWrapper