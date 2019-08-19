import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { setResetBack,resetAll } from '../../actions/resetAction';
import './Response.scss'

class ResponseComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            timeTaken: 0,
            message :''
        }
        this.startOver = this.startOver.bind(this);
        // if(!props.timeTaken){
        //     props.history.push('/search');
        //     return;
        // }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.resetTriggered){
            this.props.history.push('/search');
            this.props.setResetBack();
        }
    }
    componentDidMount(){
        let message = '';
        if(this.props.findFalconeError){
            message = 'Oopsiee! Counldnt find falcone '
        }else{
            message = 'Success! Congratulations on finding Falcone. King Shah is pleased'
        }
        this.setState({
            timeTaken  :this.props.timeTaken,
            message: message,
            planetName :this.props.findFalconeResp,
        })
    }
    startOver(){
        this.props.resetAll();
        this.props.history.push('/search');
    }
    render(){
        return(
            <section>
                <div className='container'>
                    <div className='row align-items-center vh-100'>
                        <div className='col-12'>
                            <h1>{this.state.message}</h1>
                            <div className ='stats'> 
                                <h4>Time Taken: {this.state.timeTaken}</h4>
                                {this.state.planetName ? <h4>Planet Found: {this.state.planetName}</h4>: ''}
                            </div>
                            <button className='btn btn-primary btn-custom' onClick={this.startOver}>Start Over</button>    
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
const mapStatesToProps = state => ({
    findFalconeResp: state.search.findFalconeResp,
    timeTaken : state.search.timeTaken,
    findFalconeError: state.search.findFalconeError,
    resetTriggered: state.search.resetTriggered
})
export default withRouter(connect(mapStatesToProps,{setResetBack,resetAll})(ResponseComponent))