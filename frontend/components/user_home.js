import React, {Component} from 'react';
import Select from 'react-select';
import Request from '../helpers/request';
import {Bar} from 'react-chartjs-2';

export default class UserHome extends Component {

    constructor(props) {
        super(props);
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.state = {
            bars: [],
            targets: ['Notas', 'Faltas'],
            selected_target: '',
            filters: ['01/2015', '02/2015', '02/2016', '02/2016',
                '01/2017', '02/2017', '01/2018', '02/2018'],
            selected_filters: []}
    }

    create_bar(name, labels, data) {
        let bar_content = {
            labels: labels,
            datasets: [
                {
                    label: name,
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: data
                }]};
        return (
            <div className="col-6 margin-top-25">
                <Bar data={bar_content}/>
            </div>
        )
    }

    make_post(event) {
        event.preventDefault();
        this.request.post(this.state.selected_target.value, this.state.selected_filters).then((response) => {
            response.map(value => {
                let new_bars = this.state.bars.concat(this.create_bar(value.name, value.labels, value.data));
                this.setState({bars: new_bars})
            })
        }).catch((error) => console.log(error));
        this.setState({bars: [], selected_target: '', selected_filters: []})
    }

    render() {
        let api_path = '';
        return (
            <div>
                <div className="row">
                    <div className="col-5">
                        <h3>Target</h3>
                        <Select options={this.state.targets.map(value => {
                            value === 'Notas' ? api_path = 'get_scores' : api_path = 'get_faults';
                            return {label: value, value: api_path}
                        })}
                                onChange={(value) => this.setState({selected_target: value})}
                                value={this.state.selected_target}/>
                    </div>
                    <div className="col-6">
                        <h3>Filters</h3>
                        <Select multi={true}
                                // ref={(select) => {if (select) select.setState({isOpen: true})}}
                                options={this.state.filters.map(value => {return {label: value, value: value}})}
                                onChange={(values) => this.setState({selected_filters: values})}
                                value={this.state.selected_filters}/>
                    </div>
                    <div className="col-1 relative">
                        <a href="" className="element-bottom" onClick={(event) => this.make_post(event)}>
                            <button className="btn btn-success">Search</button>
                        </a>
                    </div>
                </div>
                {this.state.bars.length ?
                    <div className="margin-top-25">
                        <h4>Results:</h4>
                        <div className="row">
                            {this.state.bars.map(value => {return value})}
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}