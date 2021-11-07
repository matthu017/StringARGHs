import React from "react";
import Dropdown from "./Dropdown";
import Chart from "./Chart";
import Papa from 'papaparse';

class Table extends React.Component{
  constructor(props){
    super(props);
    //Keep form values
    this.state = {
        datasets: ['df_add', 'df_avg', 'df_rm'],
        dataset: 'df_add',

        states: ["All", "Ohio", "Indiana", "New York", "California"],
        state: "Virginia",

        medicines: ["Cholecap", "Zap-a-Pain", "Nasalclear", "Nova-Itch"],
        medicine: "Cholecap",

        rx_types: ["NRx", "TRx"],
        rx_type: "NRx",
        
        chartData: []
    };
  }

  componentWillMount() {
    this.state.df_add = this.getCsvData('/data/df_add.csv');
    this.state.df_avg = this.getCsvData('/data/df_avg.csv');
    this.state.df_rm = this.getCsvData('/data/df_rm.csv');
    this.getStatesChange();
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
    this.getStatesChange();
    this.getChartData();
  }
  
  handleStatesChange(event){
    this.setState({state: event.target.value});
    this.getChartData();
  }

  handleMedicineChange(event){
    this.setState({medicine: event.target.value});
    this.getChartData();
  }

  handleRXtypeChange(event){
    this.setState({rx_type: event.target.value});
    this.getChartData();
  }

  getChartData(){
    //datasets, medicines, rx_types
    this.state.chartData = [];
    let ds = this.state.dataset;
    let dataSet = []
    if (ds === "df_add"){
        dataSet = this.state.df_add;
    } else if (ds === "df_avg"){
        dataSet = this.state.df_avg;
    } else {
        dataSet = this.state.df_rm;
    }

    var ty = this.state.rx_type;
    var med = this.state.medicine;
    //var st = this.state.state;
    var newChartData = new Array();
    Promise.resolve(dataSet).then(function(value) {
      for (let row of value){
        let nrx = row.slice(6, 12);
        let trx = row.slice(12, 18);
        let rx = new Array(nrx);
        if (ty === "TRx") {
          rx = new Array(trx);
        }
        if(row[5] === med){
          newChartData.push(rx);
        }
      }
    });
    this.state.chartData = newChartData
    console.log(this.state.chartData);
  }
  
  getStatesChange(){
    let dataSet = [];
    let set1 = new Set();
    let ds = this.state.dataset;
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
    });

    this.state.states = set1;
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
