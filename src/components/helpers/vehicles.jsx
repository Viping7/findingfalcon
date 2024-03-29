import React from 'react'

function Vehicles(props){
    let vehicleList = [];
    props.vehicles.map((vehicle,i) => {
        vehicleList.push(
            <label className={`checkbox ${(vehicle.total_no <= 0 && props.vehiclesIndex[props.index] != i || (vehicle.max_distance < props.selectedPlanets[props.index].distance))?'disabled':'ds'}`} htmlFor={"vehicle"+i+'_'+props.index} key={i} >
            <h6>{vehicle.name} <span>({vehicle.total_no})</span></h6>
            <div className='checkbox-container'>
                <input type='radio' disabled={vehicle.total_no <= 0 || vehicle.max_distance < props.selectedPlanets[props.index].distance } value={i} name={"vehicle"+props.index} id={"vehicle"+i+'_'+props.index} onChange={(e) => props.handleVehicleChange(e)} />
                <span className="checkmark"></span>
            </div>
        </label>
        )
        })
    return(
        vehicleList
    )
}
export default Vehicles;