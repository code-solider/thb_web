import React from 'react'
import { NavBar, Icon } from 'antd-mobile';
import router from 'umi/router';

function handleBack (){
    router.goBack()
}
const  NavBarWrap = (props) =>{
    return(
        <NavBar
            mode="dark"
            icon={<Icon type="left" />}
            onLeftClick = {handleBack}
            rightContent={props.rightContent}
        >{props.title}</NavBar>
    )
}

export default NavBarWrap