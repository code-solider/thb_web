import styles from './index.less';
import FooterNav from '@/components/FooterNav';
import Authorized from '@/components/Authorized';

function BasicLayout(props) {

    if (
        RegExp(/^\/index\/detail/).exec(props.location.pathname) ||
        RegExp(/^\/thml\/detail/).exec(props.location.pathname) ||
        RegExp(/^\/user\//).exec(props.location.pathname) ||
        RegExp(/^\/gam\//).exec(props.location.pathname) ||
        RegExp(/^\/addcompany/).exec(props.location.pathname)
    ) {
        return (
            <div className={styles.wrap}>
                <Authorized />
                {props.children}
            </div>
        )
    } else if (RegExp(/^\/login/).exec(props.location.pathname)) {
        return (<> {props.children}</>)
    }

    return (
        <div className={styles.wrap}>
            <Authorized />
            <div className={styles.content}>
                {props.children}
            </div>
            <div className={styles.footerNav}>
                <FooterNav />
            </div>

        </div>
    );
}

export default BasicLayout;
