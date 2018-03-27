export default class Request {
    post(path, body) {
        return new Promise((resolve, reject) => {
            fetch('http://0.0.0.0:8080/api' + (path.startsWith('/') ? path : '/' + path), {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
            }).then(resolve).catch(reject)
        })
    }
}