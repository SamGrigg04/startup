const GameEvent = {
  System: 'system',
  End: 'gameEnd',
  Start: 'gameStart',
  TopTen: 'topTen',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class GameEventNotifier {
  handlers = [];
  socket;

  constructor() {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}/ws`);

    this.socket.onopen = () => {
      this.receiveEvent(new EventMessage('system', GameEvent.System, { msg: 'connected' }));
    };

    this.socket.onclose = () => {
      this.receiveEvent(new EventMessage('system', GameEvent.System, { msg: 'disconnected' }));
    };

    this.socket.onmessage = async (msg) => {
      try {
        const event = JSON.parse(await msg.data);
        this.receiveEvent(event);
      } catch {
        // Ignore badly formed messages
      }
    };
  }

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);

    // Check to see if it is open before sending the message
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.handlers.forEach((handler) => handler(event));
  }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier };
