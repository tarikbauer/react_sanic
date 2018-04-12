export default class Request {

    post(path, body) {
        return new Promise((resolve, reject) => {
            fetch('http://lab-project.us-east-1.elasticbeanstalk.com/api' + (path.startsWith('/') ? path : '/' + path),
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(body),
            }).then(response => resolve(response.json())).catch(error => reject(error))
        })
    }
}