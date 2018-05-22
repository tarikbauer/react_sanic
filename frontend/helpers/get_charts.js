import React from 'react';
import FaultsChart from '../components/charts/faults';
import GradesChart from '../components/charts/grades';
import show_error from './alert';

export default function get_charts(chart_list, response, label='') {
    let class_name = 'col-12 margin-top-25';
    if (response.hasOwnProperty('alert')) {
        response.alert.map(alert => show_error(alert))
    }
    else if (this.state.selected_target.value === 'get_faults') {
        chart_list = chart_list.concat(<FaultsChart data={response.data} labels={response.labels} class={class_name}
            name={label + response.name} minimum_name={response.minimum_name} minimum_data={response.minimum_data}/>);
    }
    else {
        if (this.state.selected_target.value === 'get_subject_scores')
            class_name = 'col-6 margin-top-25';
        response.map(value => {
            chart_list = chart_list.concat(<GradesChart name={label + value.name} data={value.data}
                labels={value.labels} class={class_name} minimum_name={value.minimum_name}
                minimum_data={value.minimum_data} average_name={value.average_name}
                average_data={value.average_data}/>);
        });
    }
    return chart_list
}