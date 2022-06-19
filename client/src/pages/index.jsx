import { useState, useEffect } from "react";
import { useInterval } from "usehooks-ts";

const { floor, random } = Math;

function handleMessageSend(socket, data) {
  if (!socket.OPEN) return;
  socket.send(data);
}

function handleMovement(json) {
  const data = JSON.parse(json);
  console.dir({ data });
}

export default function Homepage() {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [socket, setSocket] = useState(undefined);

  useEffect(() => {
    setSocket(new WebSocket("ws://localhost:3001"));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.addEventListener("message", async (e) => {
      const json = await e.data.text();
      switch (json.type) {
        case "message":
          return setMessages((prev) => [...prev, json.text]);
        case "movement":
          return handleMovement(JSON.stringify(json));
      }
    });
  }, [socket]);

  useInterval(() => {
    socket.send(
      JSON.stringify({
        type: "movement",
        x: floor(random() * 100),
        y: floor(random() * 100),
      })
    );
  }, 1000);

  function doChat() {
    if (chatInput.length < 2) return;
    handleMessageSend(socket, {
      type: "message",
      name: "game user",
      text: chatInput,
    });
    setMessages((prev) => [...prev, chatInput]);
    setChatInput("");
  }

  return (
    <div className="mt-16 container mx-auto md:px-16">
      <div className="md:w-1/2">
        <ul>
          {messages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>

        <div className="flex items-center">
          <input
            className="block text-gray-900 p-2 w-full"
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <div className="w-32">
            <button
              onClick={doChat}
              className="border border-gray-500 bg-gray-300 text-gray-900 py-2 px-8 mx-auto w-full">
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
