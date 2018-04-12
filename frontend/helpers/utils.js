import Alert from 'react-s-alert';

export default function show_alert(message) {

    Alert.error(message, {
            position: 'top-right',
            effect: 'slide',
        });
}