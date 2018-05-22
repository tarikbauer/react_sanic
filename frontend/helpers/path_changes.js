export default function set_api_path(value) {
    let api_path = '';
    if (value === 'Scores') api_path = 'get_year_scores';
    else if (value === 'Faults') api_path = 'get_faults';
    else api_path = 'get_subject_scores';
    return {label: value, value: api_path}
}