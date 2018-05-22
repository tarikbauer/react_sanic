import React, {Component} from "react";
import {Bar} from 'react-chartjs-2';

export default class ScoresChart extends Component {

    render() {
        let options = {responsive: true, scales: {yAxes: [{stacked: false, ticks: {min: 0, stepSize: 20, max: 180}}]}};
        return (
            <div className={this.props.class}>
                <Bar data={{labels: this.props.labels, datasets: [
                    {label: this.props.name, type:'line', data: this.props.data, fill: false,
                        borderColor: 'rgba(75,192,192,1)', backgroundColor: 'rgba(75,192,192,0.2)',
                        pointBorderColor: 'rgba(75,192,192,1)', pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)', pointHoverBorderColor: 'rgba(75,192,192,1)'},
                    {label: this.props.minimum_name, type:'line', data: this.props.minimum_data, fill: false,
                        borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.2)',
                        pointBorderColor: 'rgba(255,99,132,1)', pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(255,99,132,1)', pointHoverBorderColor: 'rgba(255,99,132,1)'}]}}
                     options={options}/>
            </div>
        )
    }
}