import React, {Component} from 'react';
import Select from 'react-select';
import Request from '../helpers/request';
import FaultsChart from './faults_chart';
import ScoresChart from './scores_chart';
import show_error from '../helpers/utils';


export default class UserHome extends Component {

    constructor(props) {
        super(props);
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.set_api_path = this.set_api_path.bind(this);
        this.set_filter_changes = this.set_filter_changes.bind(this);
        this.state = {scores: [], faults: null, targets: ['Faults', 'Scores', 'Subjects'],
            selected_target: null, filters: [], selected_filters: [], disabled: true}
    }

    make_post(event) {
        event.preventDefault();
        if (!this.state.selected_target) show_error('Unfilled input');
        else {
            if (this.state.selected_target.label !== 'Faults' && this.state.selected_filters.length === 0)
                show_error('Unfilled input');
            else {
                this.request.post(this.state.selected_target.value, this.state.selected_filters).then(response => {
                    if (response.hasOwnProperty('alert')) {
                        response.alert.map(alert => show_error(alert))
                    }
                    else if (this.state.selected_target.value === 'get_faults') {
                        this.setState({
                            faults: <FaultsChart name={response.name} labels={response.labels} data={response.data}/>
                        })
                    }
                    else {
                        let new_score = [];
                        let class_name = '';
                        (this.state.selected_target.value === 'get_year_scores') ? class_name = 'col-12 margin-top-25' :
                            class_name = 'col-6 margin-top-25';
                        response.map(value => {
                            new_score = this.state.scores.concat(<ScoresChart name={value.name} data={value.data}
                                                                              labels={value.labels} class={class_name}
                                                                              line_name={value.line_name}
                                                                              line_data={value.line_data}/>);
                            this.setState({scores: new_score})
                        });
                    }
                }).catch(error => {console.log(error); window.location.replace('/home')});
            }
        }
    }

    // noinspection JSMethodCanBeStatic
    set_api_path(value) {
        let api_path = '';
        if (value === 'Scores') api_path = 'get_year_scores';
        else if (value === 'Faults') api_path = 'get_faults';
        else api_path = 'get_subject_scores';
        return {label: value, value: api_path}
    }

    set_filter_changes(target) {
        let value;
        (target) ? value = target.label : value = 'Faults';
        if (value === 'Faults')
            this.setState({filters: [], disabled: true, selected_target: target, selected_filters: []});
        else {
            let path = '';
            (value === 'Scores') ? path = 'get_years' : path = 'get_subjects';
            this.request.post(path, {}).then(response => {this.setState({
            filters: response, disabled: false, selected_target: target, selected_filters: []})})
            .catch(error => {console.log(error); window.location.replace('/home')});
        }
    }

    render() {
        let chart = null;
        if (this.state.scores.length) chart = (
            <div className="margin-top-25">
                <h4>Results:</h4>
                <div className="row">
                    {this.state.scores.map(value => {return value})}
                </div>
            </div>
        );
        if (this.state.faults) chart = (
            <div className="margin-top-25">
                <h4>Result:</h4>
                <div className="row">
                    {this.state.faults}
                </div>
            </div>
        );
        return (
            <div>
                <div className="row">
                    <div className="col-2">
                        <h3>Target</h3>
                        <Select options={this.state.targets.map(value => this.set_api_path(value))}
                                onChange={value => this.set_filter_changes(value)}
                                value={this.state.selected_target}/>
                    </div>
                    <div className="col-9">
                        <h3>Filters</h3>
                        <Select multi={true} closeOnSelect={false} value={this.state.selected_filters}
                                options={this.state.filters.map(value => {return {label: value, value: value}})}
                                onChange={(values) => this.setState({selected_filters: values})}
                                disabled={this.state.disabled}/>
                    </div>
                    <div className="col-1 relative">
                        <a href="" className="element-bottom" onClick={(event) => {
                            this.setState({scores: [], faults: null});
                            this.make_post(event)}}>
                            <button className="btn btn-success">Search</button>
                        </a>
                    </div>
                </div>
                {chart}
            </div>
        );
    }
}