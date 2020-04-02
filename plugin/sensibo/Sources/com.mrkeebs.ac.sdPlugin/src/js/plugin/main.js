const DestinationEnum = Object.freeze({ "HARDWARE_AND_SOFTWARE": 0, "HARDWARE_ONLY": 1, "SOFTWARE_ONLY": 2 })
const actions = {};

function fmtEvent(name) {
  return `on${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

function connectElgatoStreamDeckSocket(inPort, uuid, event, info) {
  const websocket = new WebSocket("ws://127.0.0.1:" + inPort);
  console.log('info', JSON.parse(info));
  actions.sensor = new Sensor(websocket);
  actions.increaseTemp = new IncreaseTemperature(actions.sensor, websocket);
  actions.decreaseTemp = new DecreaseTemperature(actions.sensor, websocket);

  function registerPlugin() {
    websocket.send(JSON.stringify({ event, uuid }));
  };

  websocket.onopen = function () {
    registerPlugin();
  };

  websocket.onmessage = function(evt) {
    // Received message from Stream Deck
    const msg = JSON.parse(evt.data);
    const {
      context,
      payload={},
    } = msg;

    const event = fmtEvent(msg.event);

    if (msg.action) {
      const actionName = msg.action.split('.').pop();
      const action = actions[actionName];
      window.uuid = msg.context;
      if (action && action[event]) {
        console.log(`*** Received`, actionName, event, msg.payload);
        action[event](msg);
      }
      return;
    }

    if (msg.event) {
      Object.keys(actions).forEach(key => {
        const action = actions[key];
        if (action[event]) {
          console.log(`*** Received`, key, event, msg.payload);
          action[event](msg);
        }
      })
    }
  };

  websocket.onclose = function() {
    // Websocket is closed
  };
};
