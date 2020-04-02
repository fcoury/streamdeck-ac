const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const axios = require('axios');

require('dotenv').config();

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

const port = process.env.PORT || 3000;

const {
  API_KEY,
  POD_ID,
} = process.env;

function getUrl(action, params={}) {
  params.apiKey = API_KEY;
  const qs = Object.keys(params).map(k => `${k}=${params[k]}`).join('&')
  return `https://home.sensibo.com/api/v2${action}?${qs}`;
}

function podAction(action) {
  return `/pods/${POD_ID}${action}`;
}

async function get(action, params={}) {
  const url = getUrl(action, params);
  console.log('GET', url);
  return await axios.get(url);
}

async function getPod(action, params) {
  console.log('action', action);
  return get(podAction(action), params);
}

async function getState(params) {
  return getPod(`/acStates`, params);
}

async function post(action, data) {
  const url = getUrl(action);
  console.log('POST', url, data);
  return await axios.post(url, data);
}

async function setState(acState) {
  return await post(podAction('/acStates'), { acState });
}

async function getMeasurements() {
  return getPod('', { fields: 'measurements' });
}

app.get('/temp', cors(), async (req, res) => {
  try {
    const { data } = await getMeasurements();
    console.log('data', data);
    const { result } = data;
    res.send(result.measurements);
  } catch (err) {
    // console.error(err);
    return res.status(522).send(err.toString());
  }
});

app.get('/state', cors(), async (req, res) => {
  try {
    const { data } = await getState();
    const result = data.result[0];
    res.send(result.acState);
  } catch (err) {
    // console.error(err);
    return res.status(522).send(err.toString());
  }
});

app.post('/state', cors(), async (req, res) => {
  try {
    console.log('req.body', req.body);
    const { data } = await setState(req.body);
    res.send(data.result);
  } catch (err) {
    console.error(err.toString());
    return res.status(522).send(err.toString());
  }
});

app.get('/up', (req, res) => {

});

app.listen(port, () => console.log(`Listening at port ${port}`))
