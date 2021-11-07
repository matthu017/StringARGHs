import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class AvgChart extends Component{
    constructor(props){
        super(props);

        var avgData = new Array(6).fill(0);

        this.state = {
            data: props.data,
            avgData: avgData
        }
    }

    render(){
        return (
            <div className="chart">
                <Line
	            data={{
                    labels: ['Month1','Month2','Month3','Month4','Month5','Month6'],
                    datasets: [{
                        label: '# of Votes',
                        data: this.state.data,
                        borderWidth: 1
                    }]
                }}
	            width={400}
	            height={400}
	            options={{ 
                    annotation: {
                        annotations: [{
                          type: 'line',
                          mode: 'horizontal',
                          scaleID: 'y-axis-0',
                          value: 2225,
                          endValue: 0,
                          borderColor: 'rgb(75, 192, 192)',
                          borderWidth: 4,
                          label: {
                            enabled: true,
                            content: 'Trendline',
                            yAdjust: -16,
                          }
                        }]
                      }
                    }}
                />
            </div>
        );
    }

}

export default AvgChart;
