import React, {Component} from "react";
import {Line} from 'react-chartjs-2';

export default class FaultsChart extends Component {

    render() {
        let options = {responsive: true, scales: {yAxes: [{stacked: true, ticks: {min: 0, stepSize: 20, max: 120}}]}};
        return (
            <div className="col-12 margin-top-25">
                <Line data={{labels: this.props.labels, datasets: [{label: this.props.name,
                        fill: false, lineTension: 0.1, backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)', borderCapStyle: 'butt', borderDash: [],
                        borderDashOffset: 0.0, borderJoinStyle: 'miter', pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff', pointBorderWidth: 1, pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)', pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 2, pointRadius: 1, pointHitRadius: 10, data: this.props.data}]}}
                options={options} height={100}/>
            </div>
        )
    }
}