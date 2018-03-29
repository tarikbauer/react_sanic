export default class Request {
    post(path, body) {
        return new Promise((resolve, reject) => {
            fetch('http://0.0.0.0:8080/api' + (path.startsWith('/') ? path : '/' + path), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': 'd163126c6b834cd0a4ec6417ad00ca1e'
                },
                body: JSON.stringify(body),
            }).then(response => resolve(response.json())).catch(error => reject(error.json()))
        })
    }
}