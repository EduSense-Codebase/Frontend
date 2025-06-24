"use client";
import { useEffect, useState } from "react";
import Button from "./Button";
import { AI_ENDPOINT, API_PREFIX } from "../global";
import { httpPost } from "../utils";
import { IFrontendAIResponse } from "../typedef";
import { IQuiz } from "../typedef";
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import ReactMarkdown from "react-markdown"

interface IChatWidgetProps {
  pageContext: string
  enrollmentId: number
  quiz: IQuiz | null | undefined
  article: string | null | undefined
  userSelection: string
}

const ChatWidget = (props: IChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [panelWidth, setPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const [currentContext, setCurrentContext] = useState<IChatWidgetProps>();

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    setCurrentContext(props);
  }, [props]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - e.clientX;
        setPanelWidth(Math.min(Math.max(newWidth, 300), 1800));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    document.body.style.userSelect = isResizing ? "none" : "auto";
  }, [isResizing]);

  const stringifyContext = () => {
    let context = `This is what the user is seeing currently: ${currentContext?.pageContext}\n`;
    if (currentContext?.article !== "" || currentContext.article !== null) {
      context += `This is the article: ${currentContext?.article}\n`;
    }
    if (currentContext?.quiz !== null) {
      context += `This is the quiz: ${JSON.stringify(currentContext?.quiz)}\n`;
    }
    if (currentContext?.userSelection !== "") {
      context += `This is what the user has selected within the article when asking question: ${currentContext?.userSelection}\n`;
    }
    context += "This is the previous conversation you had with this person:\n";
    messages.forEach((currMessage) => {
      context += `Sender ${currMessage.sender} Message: ${currMessage.text}\n`;
    });
    return context;
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    setMessages((currMessages) => [...currMessages, { sender: "user", text: input }]);
    setInput("");

    const context = stringifyContext() + `New User Message ${input}\n`;

    const queryParams = { section: "generate_ai_content" };

    const prompt_parameters = { message: context };

    const formData = {
      enrollment_id: props.enrollmentId,
      prompt_type: "frontend_ai",
      prompt_parameters: JSON.stringify(prompt_parameters)
    };

    const API_URL = API_PREFIX + AI_ENDPOINT;

    const requestResponse = httpPost<IFrontendAIResponse>(API_URL, formData, queryParams);

    requestResponse.then((response) => {
      setMessages((currMessage) => [
        ...currMessage,
        { sender: "ai", text: response.data.data.response }
      ]);
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 relative scale-180">
            <Image
              src="/chat_icon.svg"
              alt="Chat Icon"
              fill
              className="object-contain"
            />
          </div>
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="z-50 fixed bottom-0 right-0 top-0 bg-white shadow-xl flex flex-col border-l border-gray-200"
            style={{ width: `${panelWidth}px` }}
          >
            {/* Resize Handle */}
            <div
              className="absolute left-0 top-0 h-full w-2 cursor-ew-resize z-50"
              onMouseDown={() => setIsResizing(true)}
            />

            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-gray-700 text-lg">EduSense AI Chat</h2>
              <button onClick={toggleChat}>
                <svg
                  className="w-5 h-5 text-gray-600 hover:text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
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
                    {msg.sender === "ai" ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                    msg.text
                    )}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
