class QuickAppSocket {

  constructor(url) {
    this.instance = quickapp.websocketfactory.create({
      url: url
    });
  }

  onopen(cb) {
    this.instance.onopen = cb
  }

  onmessage(cb) {
    this.instance.onmessage = cb
  }

  onerror(cb) {
    this.instance.onmessage = cb
  }

  onclose(cb) {
    this.instance.onclose = cb
  }

  send(data) {
    data = JSON.stringify(data);
    this.instance.send({
      data
    });
  }

  close() {
    this.instance.close();
  }
}

export default QuickAppSocket;
