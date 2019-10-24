import React from 'react'
import styles from './style.less'
import {Avatar} from 'antd';
import {Tag, Icon} from 'antd';
import router from 'umi/router';
import {iconUrl} from "@/config";
const IconFont = Icon.createFromIconfontCN({
    scriptUrl:iconUrl
});
function handleClick(e) {
    router.push(`/index/detail?id=${e}`);
}

const CompanyItem = (props) => {
    let {companyLogo, shortName, guimo, yewu, address, proNumber, gzNumber, _id } = props.data.toJS();
    return (
        <div
            className={styles.wrap}
            onClick={()=>handleClick(_id)}
        >
            <div className={styles.header_img_wrap}>
                <Avatar shape="square" size={50}  src={companyLogo}/>
            </div>

            <div className={styles.rightContent}>
                <div className={styles.d1}>
                    <div className={styles.item}>
                        <div className={styles.d1}>公司：</div>
                        <div className={styles.d2+' '+styles.companyName}>{shortName}</div>
                    </div>
                    <div className={styles.item+' '+styles.itemRed}>
                        <div className={styles.d1}>业务：</div>
                        <div className={styles.d2}>{yewu.map((item, key) => item + '  ')}</div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.d1}>地址：</div>
                        <div className={styles.d2}>{address}</div>
                    </div>
                    
                    {/* <div className={styles.item}>
                        <div className={styles.d1}>人数：</div>
                        <div className={styles.d2}>{guimo}人</div>
                    </div> */}
                    <div className={styles.tag}>
                        <Tag color="#2db7f5">产品 {proNumber} &</Tag> <Tag color="#87d068">关注 {gzNumber} &</Tag>
                    </div>
                </div>
                <div className={styles.d2}>
                    <IconFont type="icon-you"/>
                </div>
            </div>
        </div>
    )
}
export default CompanyItem