import React from 'react'
import styles from './style.less'
import { Avatar, Icon  } from 'antd';
import router from 'umi/router';
import {iconUrl} from '@/config';

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconUrl
});

function handleClick (e){
    router.push(`/thml/detail?id=${e}`);
}

const CompanyItem = (props) => {
    let { realName, nickname, sex, companyName, headimgurl, _id, gsyw } = props.data;
    return(
        <div
            className={styles.wrap}
            onClick={()=>handleClick(_id)}
        >
            <div className={styles.header_img_wrap}>
                <IconFont type={sex===1?"icon-nan":'icon-nv'}/>
                <Avatar shape="square" size={36} src={headimgurl} />
            </div>

            <div className={styles.rightContent}>
                <div className={styles.item}>
                    <div className={styles.d1}>姓名：</div>
                    <div className={styles.d2+' '+ styles.name}>{realName || nickname}</div>
                </div>
                <div className={styles.item}>
                    <div className={styles.d1}>公司：</div>
                    <div className={styles.d2}>{companyName || '暂未填写'}</div>
                </div>
                <div className={styles.item}>
                    <div className={styles.d1}>业务：</div>
                    <div className={styles.d2}>{gsyw.length!==0?gsyw.join('-'):'暂未填写'}</div>
                </div>
            </div>
        </div>
    )
}


export default CompanyItem