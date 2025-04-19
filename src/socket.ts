import { WebSocketServer } from 'ws';

let wss: WebSocketServer | null = null;

const dataMap = new Map();

const createWebSockets = () => {
  wss = new WebSocketServer({
    port: 8888,
  });
  wss!.on('connection', (client) => {
    client!.on('message', (type) => {
      if (type instanceof Buffer) {
        const uint8Array = new Uint8Array(type);
        const decoder = new TextDecoder('utf-8'); // 指定编码（默认UTF-8）
        const text = decoder.decode(uint8Array);
        if (dataMap.has(text)) {
          sendAllClient(dataMap.get(text));
        }
      }
    });
  });
};

const sendAllClient = (data: any) => {
  wss!.clients.forEach(function each(client: any) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data), { binary: false });
    }
  });
};

const sendMessage = (msg: any): void => {
  dataMap.set(msg.type, msg);
  if (!wss) {
    createWebSockets();
  } else {
    sendAllClient(msg);
  }
};

export { sendMessage };
