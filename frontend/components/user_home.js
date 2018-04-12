import React, {Component} from 'react';
import Select from 'react-select';
import Request from '../helpers/request';
import FaultsChart from './faults_chart';
import ScoresChart from './scores_chart';
import show_alert from '../helpers/utils';


export default class UserHome extends Component {

    constructor(props) {
        super(props);
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.state = {scores: [], faults: null, targets: ['Notas', 'Faltas'], selected_target: '', filters: [],
            selected_filters: []}
    }

    componentWillMount() {
        this.request.post('get_year_range', {}).then(response => {
            this.setState({filters: response})
        }).catch(error => console.log(error));
    }

    make_post(event) {
        event.preventDefault();
        let api_path = this.state.selected_target.value;
        if (api_path && this.state.selected_filters.length !== 0) {
            this.request.post(api_path, this.state.selected_filters).then(response => {
                if (api_path === 'get_scores') {
                    response.map(value => {
                        let new_score = this.state.scores.concat(<ScoresChart name={value.name} labels={value.labels}
                                                                              data={value.data}/>);
                        this.setState({scores: new_score})
                    })
                }
                else {
                    this.setState({faults: <FaultsChart name={response.name} labels={response.labels}
                                                        data={response.data}/>})
                }
            }).catch(error => console.log(error));
        this.setState({scores: [], faults: null, selected_target: '', selected_filters: []})
        }
        else {
            show_alert('Unfilled input')
        }
    }

    render() {
        let api_path = '';
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
                    <div className="col-5">
                        <h3>Target</h3>
                        <Select options={this.state.targets.map(value => {
                            value === 'Notas' ? api_path = 'get_scores' : api_path = 'get_faults';
                            return {label: value, value: api_path}})}
                                onChange={value => {(!value) ? this.setState({selected_target: ''}) :
                                    this.setState({selected_target: value})}}
                                value={this.state.selected_target}/>
                    </div>
                    <div className="col-6">
                        <h3>Filters</h3>
                        <Select multi={true} closeOnSelect={false} value={this.state.selected_filters}
                                options={this.state.filters.map(value => {return {label: value, value: value}})}
                                onChange={(values) => this.setState({selected_filters: values})}/>
                    </div>
                    <div className="col-1 relative">
                        <a href="" className="element-bottom" onClick={(event) => this.make_post(event)}>
                            <button className="btn btn-success">Search</button>
                        </a>
                    </div>
                </div>
                {chart}
            </div>
        );
    }
}