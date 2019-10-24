import React from 'react'
import Tloader from 'react-touch-loader';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasMore:false,
            autoLoadMore:true,
            initializing: 2
        };
    }
    handleRefresh = (resove, reject) => {
        console.log(resove,reject,111);
    }
    handleLoadMore = (resove) => {
        console.log(2);
    }


    render() {
        let {hasMore, autoLoadMore, initializing} = this.state;
        return (
            <Tloader
                initializing={initializing}
                onRefresh={this.handleRefresh}
                hasMore={hasMore}
                onLoadMore={this.handleLoadMore}
                autoLoadMore={autoLoadMore}
                className="tloader some class">

                <ul><li>some items</li></ul>
            </Tloader>
        );
    }
}
export default App