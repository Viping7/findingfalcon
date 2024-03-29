import React, {Component} from 'react';
import { http } from '../../services/http';
import Vehicles from '../helpers/vehicles';
import { findFalcon } from '../../actions/findAction';
import { setResetBack } from '../../actions/resetAction';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Search.scss'
var vehiclesPlaceHolder; //to handle reset

class SearchComponent extends Component{
    constructor(props){
        super(props);
        this.findFalcone = this.findFalcone.bind(this);
        this.state = {
            planets: [],
            vehicles: [],
            time:0,
            selectedData: {
                planets: [],
                vehicles: [],
                planetsIndex: [],
                vehiclesIndex: []
            },
        }
        toast.configure();
    }    
    componentWillReceiveProps(nextProps){
        if(nextProps.resetTriggered){
            this.setState({
                time:0,
                vehicles: vehiclesPlaceHolder,
                selectedData: {
                    planets: [],
                    vehicles: [],
                    planetsIndex: new Array(4).fill(''),
                    vehiclesIndex: new Array(4).fill('')
                }
            })
            this.props.setResetBack();
        }
    }

    componentDidMount(){
        this.getPlanets();
        this.getVehicles();
    }

    getPlanets(){
        http('get','/planets').then(response=>{
            this.setState({
                planets:response.data
            })
        },err =>{
            toast.error("Error while getting planets !");
        })
    }
    
    getVehicles(){
        http('get','/vehicles').then(response=>{
            vehiclesPlaceHolder =  JSON.parse(JSON.stringify(response.data));
            this.setState({
                vehicles:response.data
            })
        },err =>{
            toast.error("Error while getting vehicle !");
        })
    }

    handleChange(index,event,type){
        let newSelections = this.state.selectedData[type];
        let indexName = `${type}Index`;
        let prevIndex = newSelections[index]; // To reset the previous count and timetaken
        let indexArray = this.state.selectedData[indexName] // Array of selected elements indexes
        indexArray[index] = event.target.value; 
        let timeTaken = this.state.time;
        if(type=='vehicles'){
            // To change time taken and vehicle count
            let selectedVehicle =  this.state['vehicles'][event.target.value];
            let selectedPlanet = this.state['planets'][this.state.selectedData.planetsIndex[index]];
            selectedVehicle.total_no -= 1
            if(prevIndex){
            this.state[type][this.state[type].indexOf(prevIndex)].total_no += 1;
            timeTaken -=  selectedPlanet.distance / this.state[type][this.state[type].indexOf(prevIndex)].speed
            }
            timeTaken += selectedPlanet.distance / selectedVehicle.speed;       
        }else{
            // To change the time taken based on planet selected for that vehicle
            let selectedPlanet =  this.state['planets'][event.target.value];
            let selectedVehicle = this.state['vehicles'][this.state.selectedData.vehiclesIndex[index]];
            let prevVehicle = this.state.selectedData['vehicles'][index];
            let prevPlanet = this.state.selectedData['planets'][index];
            if(selectedPlanet && selectedVehicle){
                if(prevVehicle && prevPlanet){
                    timeTaken -=  this.state['planets'][this.state['planets'].indexOf(prevPlanet)].distance / this.state['vehicles'][this.state['vehicles'].indexOf(prevVehicle)].speed;
                }
                timeTaken += selectedPlanet.distance / selectedVehicle.speed;
            }
        }
        newSelections[index] = this.state[type][event.target.value];
        this.setState({
                time: timeTaken,
                selectedPlanets : {
                [type]: newSelections,
                [indexName]: indexArray
            }
        })
    }
    checkValidity(item){
        if(item.length < 4){
            return true;
        }else{
            for(let i=0;i<item.length;i++){
                if(!item[i]){
                    return true;
                }
            }
            return false;
        }
    }
    findFalcone(){
        http('post','/token',{},{'Accept':'application/json'}).then(response=>{
            if(response.data && response.data.token){
                let payload = {};
                payload.planet_names = this.state.selectedData['planets'].map((x)=>{
                    return x.name
                })
                payload.vehicle_names = this.state.selectedData['vehicles'].map((x)=>{
                    return x.name
                })
                payload.token = response.data.token;
                let header = {
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                }
                this.props.findFalcon('/find',payload,header,this.state.time).then(()=>{
                 if(this.props.findFalconeSuccess){
                    this.props.history.push('/response');
                 }else if(this.props.findFalconeError){
                    this.props.history.push('/response');
                 }   
                })
            }
        },err=>{
            toast.error("Error while finding falcone !");
        })
    }

    render(){
        let planetsList = [];
        this.state.planets.map((planet,i)=>{
            planetsList.push(
                <option style={{display: this.state.selectedData.planets.includes(planet)? "none": "block"}} disabled={this.state.selectedData.planets.includes(planet)} value={i} key={i}>{planet.name}</option> 
            )
        })
        let seletList = [];
        if(planetsList.length > 0){
            for(let i=0;i<4;i++){
                seletList.push(
                    <div className='col-md-3' key={i}>
                        <h6>Destination {i+1}</h6>
                        <select className='form-control' onChange={(e)=>this.handleChange(i,e,'planets')} value={this.state.selectedData.planetsIndex[i]} defaultValue=''>
                        <option disabled value=''>Select</option>
                                        {planetsList}
                        </select>
                        <div className='vehicle-container'>
                        {(this.state.selectedData.planetsIndex[i]) ? <Vehicles vehicles={this.state.vehicles} index={i} handleVehicleChange = {(e)=>this.handleChange(i,e,'vehicles')} vehiclesIndex={this.state.selectedData.vehiclesIndex} selectedPlanets = {this.state.selectedData.planets}/>  : null}
                        </div>
                    </div>
                )
            }
        }

        return(
            <section className='search'>
                <div className='container'>
                    <div className='row align-items-center vh-100'>
                        <div className='col-12'>
                            <div className='row'>
                                <div className='col-12'>
                                    <h1 className='header-title'>Select Planets you want to search in:</h1>
                                </div>
                            </div>
                            <div className='row'>
                                {seletList}
                            </div>
                            <div className='row'>
                                <div className='col-12 text-center time-taken'>
                                        <h2>Time taken : <span>{this.state.time}</span></h2>
                                </div>
                            </div>
                            <button className='btn btn-primary btn-custom' onClick={this.findFalcone} disabled={this.checkValidity(this.state.selectedData.planets) || this.checkValidity(this.state.selectedData.vehicles)}>Find Falcone</button>    
                        </div>
                    </div>
                </div>
            </section>
        )
    }
} 
const mapStatesToProps = state => ({
    findFalconeResp: state.search.findFalconeResp,
    findFalconeSuccess: state.search.findFalconeSuccess,
    findFalconeError: state.search.findFalconeError,
    findFalconeServerError: state.search.findFalconeServerError, 
    resetTriggered: state.search.resetTriggered
})
export default withRouter(connect(mapStatesToProps, {findFalcon,setResetBack})(SearchComponent));