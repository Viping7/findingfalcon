import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';

class ResponseComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            timeTaken: 0,
            message :''
        }
        if(!props.timeTaken){
            props.history.push('/search');
            return;
        }
    }
    componentWillReceiveProps(nextProps){
        this.props.history.push('/search');
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
            successMessage: message,
            planetName :this.props.findFalconeResp,
        })
    }
    render(){
        return(
            <section>
                <h1>{this.state.message}</h1>
                <h4>Time Taken: {this.state.timeTaken}</h4>
                <h4>Planet Found: {this.state.planetName}</h4>
            </section>
        )
    }
}
const mapStatesToProps = state => ({
    findFalconeResp: state.search.findFalconeResp,
    timeTaken : state.search.timeTaken,
    findFalconeError: state.search.findFalconeError
})
export default withRouter(connect(mapStatesToProps,{})(ResponseComponent))