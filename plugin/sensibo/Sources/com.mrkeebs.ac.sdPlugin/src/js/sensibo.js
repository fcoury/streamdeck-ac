const PREFIX = 'http://localhost:3000';

class Sensibo {
  get(path) {
    return fetch(`${PREFIX}${path}`).then(res => res.json());
  }

  post(path, data) {
    return fetch(`${PREFIX}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  getTemp() {
    return this.get('/temp');
  }

  getState() {
    return this.get('/state');
  }

  setState(acState) {
    return this.post('/state', acState);
  }
}
