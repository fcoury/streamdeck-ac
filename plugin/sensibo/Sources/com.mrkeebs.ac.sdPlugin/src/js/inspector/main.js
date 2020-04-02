function connectElgatoStreamDeckSocket(port, uuid, event, info, actionInfo) {
  const websocket = new WebSocket(`ws://localhost:${port}`);
  const data = JSON.parse(info);
  const actionData = JSON.parse(actionInfo);

  console.log('info1', data);
  console.log('info2', actionData);

  function getInitialState() {
    const sensibo = new Sensibo();
    sensibo.getState().then(acState => {
      this.api.setGlobalSettings(acState);
      this.api.getGlobalSettings(({ settings }) => {
        console.log(' *** SETTINGS', settings);
      });
    });
  }

  websocket.onopen = () => {
    websocket.send(JSON.stringify({ event, uuid }));
    this.api = new Api(uuid, websocket);
    getInitialState();
  };

  websocket.onmessage = (evt) => {
    // Received message from Stream Deck
    const msg = JSON.parse(evt.data);
    console.log('*** [inspector] Received', msg.event, msg);
    const {
      context,
      payload={},
    } = msg;

    console.log('payload', payload);
    this.api.onDidReceive(msg);
  }
}
