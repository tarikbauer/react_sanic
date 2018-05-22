import Alert from 'react-s-alert';

export default function show_error(message) {

    // noinspection JSUnresolvedFunction
    Alert.error(message, {
            position: 'top-right',
            effect: 'slide',
        });
}