class DecreaseTemperature extends ChangeTemperature {
  getNewTemp(current) {
    return current - 1;
  }
}
