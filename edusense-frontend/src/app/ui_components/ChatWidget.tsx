"use client";
import { useState } from "react";
import Button from "./Button";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    
    //TO-DO: SEND CHAT AS CONTEXT TO BACKEND
    console.log("Chat sent")
    
    if (input.trim() === "") return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulated AI response (replace with API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "I'm Edusense AI, here to help!" },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
        >
          {/* Chat icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5A8.5 8.5 0 0121 11v.5z" />
          </svg>
        </button>
      )}

            {/* Full-screen close button (top right corner) */}
        {isOpen && (
            <button
            onClick={toggleChat}
            className="fixed top-4 right-4 z-50 bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
            >
            <svg className="z-50 w-5 h-5 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="z-50 fixed bottom-0 right-0 top-0 w-full sm:w-[400px] bg-white shadow-xl z-40 flex flex-col border-l border-gray-200 transition-all">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-700 text-lg">Edusense AI Chat</h2>
            <button onClick={toggleChat}>
              <svg className="w-5 h-5 text-gray-600 hover:text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex text-gray-400 items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 text-gray-500 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask me anything..."
            />
            <Button displayName="Send" onClick={sendMessage} />

          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
