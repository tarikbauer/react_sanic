import React, {Component} from 'react';
import Select from 'react-select';
import Request from '../helpers/request';
import show_error from '../helpers/alert';
import get_charts from '../helpers/get_charts';
import set_api_path from '../helpers/path_changes';
import set_filter_changes from '../helpers/filter_changes';


export default class Admin extends Component {

    constructor(props) {
        super(props);
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.get_charts = get_charts.bind(this);
        this.set_api_path = set_api_path.bind(this);
        this.set_filter_changes = set_filter_changes.bind(this);
        this.set_students_changes = this.set_students_changes.bind(this);
        this.state = {scores: [], targets: ['Faults', 'Scores', 'Subjects'], selected_target: null, filters: [],
            selected_filters: [], disabled: true, students: [], selected_students: [], disabled_target: true}
    }

    componentWillMount() {
        this.request.post('get_users', {}).then(response => this.setState({students: response}))
            .catch(error => {console.log(error); window.location.replace('/home')});
    }

    set_students_changes(students) {
        if (students.length !== 0)
            this.setState({selected_students: students, filters: [], disabled: true, selected_filters: [],
                disabled_target: false, selected_target: null});
        else
            this.setState({selected_students: students, filters: [], disabled: true, selected_filters: [],
                disabled_target: true, selected_target: null});
    }

    make_post(event) {
        event.preventDefault();
        if (!this.state.selected_target) show_error('Unfilled input');
        else {
            if (this.state.selected_target.label !== 'Faults' && this.state.selected_filters.length === 0)
                show_error('Unfilled input');
            else {
                let chart_list = [];
                this.state.selected_students.map(student => {this.request.post(this.state.selected_target.value,
                    {data: this.state.selected_filters, usercode: student.value}).then(
                    response => {
                        chart_list = this.get_charts(chart_list, response, student.label + ': ');
                        this.setState({scores: chart_list});
                    }).catch(error => {console.log(error); window.location.replace('/home')
                    });
                });
            }
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
        return (
            <div>
                <div className="row">
                    <div className="col-12 margin-bottom-15">
                        <h3>Students</h3>
                        <Select multi={true} closeOnSelect={false} value={this.state.selected_students}
                                options={this.state.students.map(value => {return value})}
                                onChange={(values) => this.set_students_changes(values)}/>
                    </div>
                    <div className="col-2">
                        <h3>Target</h3>
                        <Select options={this.state.targets.map(value => this.set_api_path(value))}
                                onChange={value => this.set_filter_changes(value, {usercode: this.state.selected_students[0].value})}
                                value={this.state.selected_target} disabled={this.state.disabled_target}/>
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
                            this.setState({scores: []});
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