import React from "react";
import Dropdown from "./Dropdown";

class Table extends React.Component{
  constructor(props){
    super(props);
    //Load the data here 
   // fs.createReadStream('../data/df.csv').pipe(csv()).on('data',


    //Keep form values
    this.state = {
        datasets: ['df', 'df_add', 'df_avg', 'df_rm'],
        dataset: 'df',

        states: ["All", "Ohio", "Indiana", "New York", "California"],
        state: "All",

        medicines: ["Cholecap", "Zap-a-Pain", "Nasalclear", "Nova-Itch"],
        medicine: "Cholecap",

        rx_types: ["NRx", "TRx"],
        rx_type: "NRx"
    };
  }

  handleDatasetChange(event){
    this.setState({dataset: event.target.value});
    console.log(this.state.dataset);
    this.render();
  }

  handleStatesChange(event){
    this.setState({states: event.target.value});
  }

  handleMedicineChange(event){
    this.setState({medicine: event.target.value});
  }

  handleRXtypeChange(event){
    this.setState({rx_type: event.target.value});
  }

  render(){
    return(
    <div>
      <Dropdown onChange={(event) => this.handleDatasetChange(event)} values={this.state.datasets} value={this.state.dataset} category=" Dataset: "/>
      <Dropdown onChange={(event) => this.handleStatesChange(event)} values={this.state.states} value={this.state.state} category=" State: "/>
      <Dropdown onChange={(event) => this.handleMedicineChange(event)} values={this.state.medicines} value={this.state.medicine} category=" Medicine: "/>
      <Dropdown onChange={(event) => this.handleRXtypeChange(event)} values={this.state.rx_types} value={this.state.rx_type} category=" RX Type: "/>
    </div>
    );
  }

}

export default Table;
