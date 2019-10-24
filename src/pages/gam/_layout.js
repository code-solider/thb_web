import React, { Fragment } from 'react';
import GamTopNav from '@/components/GamTopNav';

function BasicLayout(props) {
    if(
        RegExp(/^\/gam\/detail/).exec(props.location.pathname)
    ){
        return(
            <Fragment>
                {props.children}
            </Fragment>
        )
    }
    return (
        <Fragment>
            <GamTopNav />

            {props.children}
        </Fragment>
    );
}

export default BasicLayout;
