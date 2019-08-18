import React, {Component} from 'react';
import { http } from '../../services/http';
import Vehicles from '../helpers/vehicles';
import { findFalcon } from '../../actions/findAction';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            planetsError:''
        }
        toast.configure()

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
                },
                planetsError:''
            })
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
            this.setState({
                planetsError: err
            })
        })
    }
    
    getVehicles(){
        http('get','/vehicles').then(response=>{
            vehiclesPlaceHolder =  JSON.parse(JSON.stringify(response.data));
            this.setState({
                vehicles:response.data
            })
        },err =>{
            this.setState({
                planetsError: err
            })
        })
    }

    handleChange(index,event,type){

       let newSelections = this.state.selectedData[type];
       let indexName = `${type}Index`;
       let prevIndex = newSelections[index]; // To reset the previous count and timetake
       newSelections[index] = this.state[type][event.target.value];
       let indexArray = this.state.selectedData[indexName] // Array of selected elements index
       indexArray[index] = event.target.value; 
        if(type=='vehicles'){
           let timeTaken = this.state.time;
           let selectedVehicle =  this.state[type][event.target.value];
           let selectedPlanet = this.state['planets'][this.state.selectedData.planetsIndex[index]];
           selectedVehicle.total_no -= 1
           if(prevIndex){
            this.state[type][this.state[type].indexOf(prevIndex)].total_no += 1;
            timeTaken -=  selectedPlanet.distance / this.state[type][this.state[type].indexOf(prevIndex)].speed
           }
           timeTaken += selectedPlanet.distance / selectedVehicle.speed;
           this.setState({
               time: timeTaken,
               distanceError: ''
           })
        }
       this.setState({
           selectedPlanets : {
               [type]: newSelections,
               [indexName]: indexArray
           }
       })
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
                    <div className='col-md-2' key={i}>
                        <select onChange={(e)=>this.handleChange(i,e,'planets')} value={this.state.selectedData.planetsIndex[i]} defaultValue=''>
                        <option disabled value=''>Select</option>
                                        {planetsList}
                        </select>
                        <div>
                        {(this.state.selectedData.planetsIndex[i]) ? <Vehicles vehicles={this.state.vehicles} index={i} handleVehicleChange = {(e)=>this.handleChange(i,e,'vehicles')} vehiclesIndex={this.state.selectedData.vehiclesIndex}/>  : null}
                        </div>
                    </div>
                )
            }
        }

        return(
            <section>
                <div className='container'>
                    <div className='row'>
                            {seletList}
                            <div className='col-md-4'>
                                <h2>Time Taken</h2>
                                <h3>{this.state.time}</h3>
                            </div>
                    </div>
                    {this.state.distanceError}
                    <div className='row'>
                        <div className='col-md-12'>
                            <button onClick={this.findFalcone} disabled={this.state.selectedData.planets.length != 4 || this.state.selectedData.vehicles.length != 4 }>Find Falcone</button>
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
export default withRouter(connect(mapStatesToProps, {findFalcon})(SearchComponent));