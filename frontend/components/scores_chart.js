import React, {Component} from "react";
import {Bar} from 'react-chartjs-2';

export default class ScoresChart extends Component {

    render() {
        let options = {responsive: true, scales: {yAxes: [{stacked: true, ticks: {min: 0, stepSize: 1, max: 10}}]}};
        return (
            <div className="col-6 margin-top-25">
                <Bar data={{labels: this.props.labels, datasets: [{label: this.props.name,
                        backgroundColor: 'rgba(75,192,192,0.2)', borderColor: 'rgba(75,192,192,1)', borderWidth: 1,
                        hoverBackgroundColor: 'rgba(75,192,192,0.4)', hoverBorderColor: 'rgba(75,192,192,1)',
                        data: this.props.data}]}} options={options}/>
            </div>
        )
    }
}