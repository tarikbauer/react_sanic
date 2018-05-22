import React, {Component} from "react";
import {Bar} from 'react-chartjs-2';

export default class GradesChart extends Component {

    render() {
        let options = {responsive: true, scales: {yAxes: [{stacked: false, ticks: {min: 0, stepSize: 1, max: 10}}]}};
        return (
            <div className={this.props.class}>
                <Bar data={{labels: this.props.labels, datasets: [
                    {label: this.props.name, backgroundColor: 'rgba(75,192,192,0.2)', borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 1, hoverBackgroundColor: 'rgba(75,192,192,0.4)',
                        hoverBorderColor: 'rgba(75,192,192,1)', data: this.props.data},
                    {label: this.props.average_name, type:'line', data: this.props.average_data, fill: false,
                        borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.2)',
                        pointBorderColor: 'rgba(255,99,132,1)', pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(255,99,132,1)', pointHoverBorderColor: 'rgba(255,99,132,1)'},
                    {label: this.props.minimum_name, type:'line', data: this.props.minimum_data, fill: false,
                        borderColor: 'rgba(63,191,127,1)', backgroundColor: 'rgba(63,191,127,0.2)',
                        pointBorderColor: 'rgba(63,191,127,1)', pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(63,191,127,1)', pointHoverBorderColor: 'rgba(63,191,127,1)'}]}}
                     options={options}/>
            </div>
        )
    }
}