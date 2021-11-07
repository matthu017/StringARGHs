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
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                }}
	            width={400}
	            height={400}
	            options={{ 
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Number of Votes',
                        fontSize: 25
                    },

                    }}
                />
            </div>
        );
    }

}

export default AvgChart;
