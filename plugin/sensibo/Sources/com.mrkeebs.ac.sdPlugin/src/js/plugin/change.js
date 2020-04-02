class ChangeTemperature extends StreamDeckAction {
  constructor(sensor, websocket) {
    super(websocket);
    this.sensor = sensor;
  }

  initState(context, acState) {
    this.sensibo.getState().then(acState => {
      this.set('acState', acState);
      this.setGlobalSettings(context, { acState });
    });
  }

  setState(ctx, acState) {
    this.sensibo.setState(acState).then(res => {
      console.log('res', res);
      if (res.ok) {
        this.sensor.setAcState(acState);
        this.initState(ctx, acState);
      }
    });
  }

  onDidReceiveGlobalSettings({ payload, context }) {
    const { settings } = payload || {};
    this.set(context, 'temperature', settings.targetTemperature);
  }

  onKeyDown({ context }) {
    this.sensibo.getState().then(acState => {
      console.log('acState', acState);
      acState.targetTemperature = this.getNewTemp(acState.targetTemperature);
      this.setState(context, acState);
    });
  }
}
