const GameEvent = {
  System: 'system',
  End: 'gameEnd',
  Start: 'gameStart',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class GameEventNotifier {
  events = [];
  handlers = [];

  constructor() {
    // Simulate scores that will eventually come over WebSocket
    setInterval(() => {
      const randomMinutes = Math.floor(Math.random() * 5);
      const randomSeconds = Math.floor(Math.random() * 60);
      const randomMilliseconds = Math.floor(Math.random() * 100);
      const timeStr = `${String(randomMinutes).padStart(2,'0')}:${String(randomSeconds).padStart(2,'0')}:${String(randomMilliseconds).padStart(2,'0')}`;

      const users = ['Abe','Babe','Cabe','Dave','Egg'];
      const userName = users[Math.floor(Math.random() * users.length)];

      this.broadcastEvent(userName, GameEvent.End, { userName, time: timeStr });
    }, 5000);
  }

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);
    this.receiveEvent(event);
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);

    this.handlers.forEach((handler) => {
      handler(event);
    });
  }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier };
