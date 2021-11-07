import React from "react";
import Papa from 'papaparse';
import {Bar} from 'react-chartjs-2'

import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import chartTrendline from "chartjs-plugin-trendline";
Chart.register(annotationPlugin);
Chart.register(chartTrendline);

class Table extends React.Component{
  constructor(props){
    super(props);

    //Keep form values
    this.state = {
        datasets: ['df_add', 'df_avg', 'df_rm'],
        dataset: 'df_add',

        medicines: ["Cholecap", "Zap-a-Pain", "Nasalclear", "Nova-Itch"],
        medicine: "Cholecap",

        metrics: ["Mean NRx", "Mean TRx", "NRx Growth", "TRx Growth"],
        metric: "Mean NRx",

        numVals: [5, 10, 25, 50],
        numVal: 25,
        
        chartData: [],
        metricData: [1,2,3,4,5,6]
    };

    this.handleDatasetChange = this.handleDatasetChange.bind(this);
    this.handleMedicineChange = this.handleMedicineChange.bind(this);
    this.handleMetricChange = this.handleMetricChange.bind(this);
    this.handleNumValChange = this.handleNumValChange.bind(this);
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
    let ds = event.target.value;
    let med = this.state.medicine;
    let met = this.state.metric;
    let nv  = this.state.numVal;
    this.getChartData(ds, med, met, nv);
  }
  
  handleMedicineChange(event){
    this.setState({medicine: event.target.value});
    let ds = this.state.dataset
    let med = event.target.value;
    let met = this.state.metric;
    let nv  = this.state.numVal;
    this.getChartData(ds, med, met, nv);
  }

  handleMetricChange(event){
    this.setState({metric: event.target.value});
    let ds = this.state.dataset
    let med = this.state.medicine;
    let met = event.target.value;
    let nv  = this.state.numVal;
    this.getChartData(ds, med, met, nv);
  }

  handleNumValChange(event){
    this.setState({numVal: event.target.value});
    let ds = this.state.dataset
    let med = this.state.medicine;
    let met = this.state.metric;
    let nv  = event.target.value;
    this.getChartData(ds, med, met, nv);
  }

  getChartData(ds, med, met, nv){
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
    
    var chartData = [];
    var metricData = [];
    Promise.resolve(dataSet).then(function(value) {
      var tableData = new Array();
      var sortingIndex = 20;
      if (met === "Mean NRx"){
        sortingIndex = 20;
      } else if (met === "Mean TRx"){
        sortingIndex = 23;
      } else if (met === "NRx Growth") {
        sortingIndex = 18;
      } else {
        sortingIndex = 21;
      }
      for (let row of value){
        if(row[5] === med){
          tableData.push(row);
        }
      }

      tableData.sort( function(a, b) {
        let fA = parseFloat(a[sortingIndex]);
        let fB = parseFloat(b[sortingIndex]);
        if (fA < fB) return -1;
        if (fA > fB) return 1;
        return 0;
      });

      chartData = []
      for (let i = 0; i < nv; i++){
        let topVal = tableData.pop();
        metricData.push(topVal[sortingIndex]);
        topVal.shift()
        topVal.shift()
        chartData.push(topVal);
      }

    }).then( () => {
      metricData.reverse();
      this.setState({ chartData: chartData })
      let low = parseFloat(metricData[0]);
      let high = parseFloat(metricData[nv-1]);
      let mid = (low + high) / 2
      let quart1 = (low + mid) / 2;
      let quart3 = (mid + high) / 2;
      let labels = [low, quart1, mid, quart3, high];

      var data = new Array(5).fill(0)
      for (let i = 0; i < metricData.length; i++){
        var val = metricData[i]
        if (val < (low+quart1)/ 2){
          data[0] += 1;
        } else if (val < (quart1 + mid)/2){
          data[1] += 1;
        } else if (val < (mid + quart3)/2) {
          data[2] += 1;
        } else if (val < (quart3 + high)/2){
          data[3] += 1;
        } else {
          data[4] += 1;
        }
      }
      this.setState({ metricData: data })
      this.setState({ labels: labels})
      this.setState({ max: high})
    });
  }

  render(){
    var renderDatasets = [];
    var renderMedicines = [];
    var renderMetrics = [];
    var renderNumVals = [];
    var renderChartData = [];
    for (let value of this.state.datasets){
      renderDatasets.push(<option value={value}>{value}</option>);  
    }
    for (let value of this.state.medicines){
      renderMedicines.push(<option value={value}>{value}</option>);  
    }
    for (let value of this.state.metrics){
      renderMetrics.push(<option value={value}>{value}</option>);  
    }
    for (let value of this.state.numVals){
      renderNumVals.push(<option value={value}>{value}</option>);  
    }

    renderChartData.push(<tr>
        <th>First &</th>
        <th>Last Name</th>
        <th>State</th>
        <th>NRx1</th>
        <th>NRx2</th>
        <th>NRx3</th>
        <th>NRx4</th>
        <th>NRx5</th>
        <th>NRx6</th>
        <th>TRx1</th>
        <th>TRx2</th>
        <th>TRx3</th>
        <th>TRx4</th>
        <th>TRx5</th>
        <th>TRx6</th>
        <th>NRx Slope</th>
        <th>NRx Mean</th>
        <th>TRx Slope</th>
        <th>TRx Mean</th>
    </tr>)

    for (let value of this.state.chartData){
      console.log(value)
      renderChartData.push(<tr>
        <td>{value[0]}</td>
        <td>{value[1]}</td>
        <td>{value[2]}</td>
        <td>{value[4]}</td>
        <td>{value[5]}</td>
        <td>{value[6]}</td>
        <td>{value[7]}</td>
        <td>{value[8]}</td>
        <td>{value[9]}</td>
        <td>{value[10]}</td>
        <td>{value[11]}</td>
        <td>{value[12]}</td>
        <td>{value[13]}</td>
        <td>{value[14]}</td>
        <td>{value[15]}</td>
        <td>{value[16]}</td>
        <td>{value[18]}</td>
        <td>{value[19]}</td>
        <td>{value[21]}</td>
        </tr>)
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
        Medicines:
        <select value={this.state.medicine} onChange={this.handleMedicineChange}> 
          {renderMedicines}
        </select>
      </label>
      <label>
        Metrics:
        <select value={this.state.metric} onChange={this.handleMetricChange}> 
          {renderMetrics}
        </select>
      </label>
      <label>
        # Values:
        <select value={this.state.numVal} onChange={this.handleNumValChange}> 
          {renderNumVals}
        </select>
      </label>
      <div className="histogram">
      <Bar
            data={{
            labels: this.state.labels,
            datasets: [{
                data: this.state.metricData,
                borderWidth: 1,
            }]
          }}
             width={200}
             height={100}
             options={{
                 }}
             />
      </div>
      <div>
        <table>
          {renderChartData}
        </table>
      </div>
    </div>
    );
  }
}

export default Table;
