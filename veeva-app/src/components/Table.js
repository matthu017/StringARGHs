import React from "react";
import Papa from 'papaparse';
import AvgChart from './AvgChart';
import Line from 'react-chartjs-2';

class Table extends React.Component{
  constructor(props){
    super(props);

    //Keep form values
    this.state = {
        datasets: ['df_add', 'df_avg', 'df_rm'],
        dataset: 'df_add',

        states: [],
        state: "Virginia",

        medicines: ["Cholecap", "Zap-a-Pain", "Nasalclear", "Nova-Itch"],
        medicine: "Cholecap",

        rx_types: ["NRx", "TRx"],
        rx_type: "NRx",
        
        chartData: []
    };

    this.handleDatasetChange = this.handleDatasetChange.bind(this);
    this.handleMedicineChange = this.handleMedicineChange.bind(this);
    this.handleRXtypeChange = this.handleRXtypeChange.bind(this);
    this.handleStatesChange = this.handleStatesChange.bind(this);
  }

  componentWillMount() {
    this.setState({ df_add: this.getCsvData('/data/df_add.csv') });
    this.setState({ df_avg: this.getCsvData('/data/df_avg.csv') });
    this.setState({ df_rm: this.getCsvData('/data/df_rm.csv') });
  }

  fetchCsv() {
    return fetch('/data/df_add.csv').then(function (response) {
      let reader = response.body.getReader();
      let decoder = new TextDecoder('utf-8');

      return reader.read().then(function (result) {
        return decoder.decode(result.value);
      });
    });
  }

  async getCsvData() {
    let csvData = await this.fetchCsv();
    Papa.parse(csvData, {
        complete: (csvParsedResults) => {
          csvData = csvParsedResults.data;
          //Clean the data
          csvData.shift();
          csvData.pop();
        }
    });
    return csvData
  }

  handleDatasetChange(event){
    this.setState({dataset: event.target.value});
    this.getNewState(event.target.value);
    let ds = event.target.value;
    let st = this.state.state;
    let med = this.state.medicine;
    let ty  = this.state.rx_type;
    this.getChartData(ds, st, med, ty);
  }

  getNewState(ds){
    let dataSet = [];
    let set1 = new Set();
    if (ds === "df_add"){
        dataSet = this.state.df_add;
    } else if (ds === "df_avg"){
        dataSet = this.state.df_avg;
    } else {
        dataSet = this.state.df_rm;
    }

    Promise.resolve(dataSet).then(function(value) {
      for (let row of value){
        set1.add(row[4]);
      }
    }).then(() => {this.setState({ states: set1 }) });
  }
  
  handleStatesChange(event){
    this.setState({state: event.target.value});
    let ds = this.state.dataset
    let st = event.target.value;
    let med = this.state.medicine
    let ty  = this.state.rx_type
    this.getChartData(ds, st, med, ty);
  }

  handleMedicineChange(event){
    this.setState({medicine: event.target.value});
    let ds = this.state.dataset
    let st = this.state.state
    let med = event.target.value;
    let ty  = this.state.rx_type
    this.getChartData(ds, st, med, ty);
  }

  handleRXtypeChange(event){
    this.setState({rx_type: event.target.value});
    let ds = this.state.dataset
    let st = this.state.state
    let med = this.state.medicine
    let ty  = event.target.value;
    this.getChartData(ds, st, med, ty);
  }

  getChartData(ds, st, med, ty){
    //datasets, medicines, rx_types
    this.state.chartData = [];
    let dataSet = []
    if (ds === "df_add"){
        dataSet = this.state.df_add;
    } else if (ds === "df_avg"){
        dataSet = this.state.df_avg;
    } else {
        dataSet = this.state.df_rm;
    }
    
    var newChartData = new Array();
    Promise.resolve(dataSet).then(function(value) {
      for (let row of value){
        let nrx = row.slice(6, 12);
        let trx = row.slice(12, 18);
        let rx = new Array(nrx);
        if (ty === "TRx") {
          rx = new Array(trx);
        }
        if(row[5] === med && row[4] === st){
          newChartData.push(rx);
        }
      }
    }).then( () => {
      this.setState({ chartData: newChartData });
    });
  }

  render(){
    var renderDatasets = [];
    var renderStates = [];
    var renderMedicines = [];
    var renderRXtypes = [];
    for (let value of this.state.datasets){
      renderDatasets.push(<option value={value}>{value}</option>);  
    }
    for (let value of this.state.states){
      renderStates.push(<option value={value}>{value}</option>);  
    }
    for (let value of this.state.medicines){
      renderMedicines.push(<option value={value}>{value}</option>);  
    }
    for (let value of this.state.rx_types){
      renderRXtypes.push(<option value={value}>{value}</option>);  
    }

    return(
    <div>
      <label>
        Datasets:
        <select value={this.state.dataset} onChange={this.handleDatasetChange}> 
          {renderDatasets}
        </select>
      </label>
      <label>
        States:
        <select value={this.state.state} onChange={this.handleStatesChange}> 
          {renderStates}
        </select>
      </label>
      <label>
        Medicines:
        <select value={this.state.medicine} onChange={this.handleMedicineChange}> 
          {renderMedicines}
        </select>
      </label>
      <label>
        Rx Type:
        <select value={this.state.rx_type} onChange={this.handleRXtypeChange}> 
          {renderRXtypes}
        </select>
      </label>
      <AvgChart data={this.state.chartData}/>
    </div>
    );
  }
}

export default Table;
