const ws = require("ws");

const wss = new ws.WebSocketServer({ port: 3001 });

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    wss.clients.forEach((client) => {
      if (!client.OPEN) return;
      if (client === ws) return;

      ws.send({ data });
    });
  });
});
