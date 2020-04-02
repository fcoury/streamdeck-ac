class Sensor extends StreamDeckAction {
  constructor(websocket) {
    super(websocket);
    this.acState = null;
    this.temperature = null;
  }

  makeTitle(ctx) {
    const parts = [];
    if (this.temperature) parts.push(this.temperature);
    if (this.acState) parts.push(this.acState.targetTemperature);
    this.setTitle(ctx, parts.join('\n'));
  }

  setAcState(acState) {
    this.acState = acState;
    this.makeTitle(null);
  }

  fetchTemp(ctx) {
    Promise.all([
      this.sensibo.getTemp(),
      this.sensibo.getState(),
    ]).then(([tempData, stateData]) => {
      this.temperature = tempData.temperature;
      this.acState = stateData;
      this.setGlobalSettings(ctx, { temperature: stateData.target });
      this.makeTitle(ctx);
    });
  }

  onWillAppear({ payload, context }) {
    this.setTitle(context, '...');
    this.fetchTemp(context);
  }

  onKeyDown({ context }) {
    this.setTitle(context, '...');
  }

  onKeyUp() {
    this.fetchTemp();
  }
}
