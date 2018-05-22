export default function set_filter_changes(target, student_info) {
    let value;
    (target) ? value = target.label : value = 'Faults';
    if (value === 'Faults')
        this.setState({filters: [], disabled: true, selected_target: target, selected_filters: []});
    else {
        let path = '';
        (value === 'Scores') ? path = 'get_years' : path = 'get_subjects';
        this.request.post(path, student_info).then(response => {this.setState({
        filters: response, disabled: false, selected_target: target, selected_filters: []})})
        .catch(error => {console.log(error); window.location.replace('/home')});
    }
}