class StreamDeckAction {
  constructor(websocket) {
    this.sensibo = new Sensibo();
    this.websocket = websocket;
    this.pendingAction = null;
    this.settings = {};
  }

  send(inContext, event, payload) {
    const context = inContext || this.lastContext;
    this.lastContext = context;

    const data = { event, context };
    if (payload) data.payload = payload;
    console.log('*** Sending', event, this, data.payload);
    this.websocket.send(JSON.stringify(data));
  }

  getGlobalSettings(ctx) {
    this.send(ctx, 'getGlobalSettings');
  }

  setGlobalSettings(ctx, settings) {
    this.send(ctx, 'setGlobalSettings', settings);
  }

  getSettings(ctx, cb) {
    this.pendingAction = cb;
    this.send(ctx, 'getSettings');
  }

  onDidReceiveSettings({ settings }) {
    console.log('received settings', settings);
    if (this.pendingAction) {
      const { pendingAction } = this;
      this.pendingAction = null;
      pendingAction(settings);
    }
  }

  set(ctx, key, value) {
    this.settings[key] = value;
    console.log('setting', key, 'to', value);
    this.send(ctx, 'setSettings', this.settings)
  }

  setTitle(ctx, title) {
    this.send(ctx, 'setTitle', {
      title: `${title}`,
      target: DestinationEnum.HARDWARE_AND_SOFTWARE
    });
  }
}
