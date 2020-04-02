class Api {
  constructor(context, websocket) {
    this.context = context;
    this.websocket = websocket;
    this.callbacks = {};
  }

  onDidReceive(msg) {
    const { event } = msg;
    console.log('event', event);
    console.log('this.callbacks', this.callbacks);
    const callback = this.callbacks[event];
    console.log('callback', callback);
    if (callback) {
      return callback(msg.payload);
    }
  }

  send(event, payload) {
    const data = { event, context: this.context };
    if (payload) data.payload = payload;
    console.log('*** Sending', event, data);
    this.websocket.send(JSON.stringify(data));
  }

  getGlobalSettings(cb) {
    this.callbacks.didReceiveGlobalSettings = cb;
    this.send('getGlobalSettings');
  }

  setGlobalSettings(settings) {
    this.send('setGlobalSettings', settings);
  }
}
