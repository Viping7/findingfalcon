import React, {Component} from 'react';
import { http } from '../../services/http';
import Vehicles from '../helpers/vehicles';

class SearchComponent extends Component{
    constructor(){
        super();
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
       let prevIndex = newSelections[index];
       newSelections[index] = this.state[type][event.target.value];
       let indexArray = this.state.selectedData[indexName]
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
           if(selectedPlanet.distance > selectedVehicle.max_distance){
               this.setState({
                   distanceError:"The distance cant be convered by this vehicle"
               })
               return false;
           }
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
    
    render(){
        let planetsList = [];
        this.state.planets.map((planet,i)=>{
            planetsList.push(
                <option disabled={this.state.selectedData.planets.includes(planet)} value={i} key={i}>{planet.name}</option>
            )
        })
        let seletList = [];
        if(planetsList.length > 0){
            for(let i=0;i<4;i++){
                seletList.push(
                    <div className='col-md-2' key={i}>
                        <select onChange={(e)=>this.handleChange(i,e,'planets')} value={this.state.selectedData.planetsIndex[i]} >
                        <option disabled selected>Select</option>
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
                </div>
            </section>
        )
    }
} 

export default SearchComponent