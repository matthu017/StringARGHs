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
