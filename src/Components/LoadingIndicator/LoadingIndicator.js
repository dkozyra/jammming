import React from 'react';
import './LoadingIndicator.css'
// import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';


class LoadingIndicator extends React.Component {

    render() {
        // const { promiseInProgress } = usePromiseTracker();
        return (
            // promiseInProgress && 
            <div className="loading"><Loader type="ThreeDots" color="#2BAD60" height="100" width="100" timeout={3000}/></div>
        );
    }
}

export default LoadingIndicator;