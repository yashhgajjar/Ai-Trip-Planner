import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import im13 from "../assets/im13.jpg";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatbotMessages")) || [];
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = "Sxf5ojkwkMnihjJBYwAKtioNbndr2faw";
  const modelName = "mistral-medium";

  useEffect(() => {
    localStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    return()=>{
        localStorage.removeItem("chatbotMessages");

    };
  }, []);

  const handleSendMessage = async () => {
    if (!apiKey) {
      setErrorMessage(
        "API key is missing. Please set the REACT_APP_MISTRAL_API_KEY environment variable."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const userMessage = {
      id: Date.now(),
      text: input.trim() === "" ? "Tell me about trip planning." : input,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const payload = {
        model: modelName,
        messages: [{ role: "user", content: input }], // Use the user's input directly
      };

      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Correct Authorization header
            "Content-Type": "application/json",
          },
        }
      );

      let botResponseText = "I am unable to answer that.";
      if (
        response.data &&
        response.data.choices &&
        response.data.choices[0] &&
        response.data.choices[0].message &&
        response.data.choices[0].message.content
      ) {
        botResponseText = response.data.choices[0].message.content.replace(
          /\n/g,
          "\n\n"
        );
      }

      const botMessage = {
        id: Date.now(),
        text: botResponseText,
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response from Mistral AI API:", error);
      let errorMessageText = "Sorry, I encountered an error.";

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        errorMessageText = `Error: ${error.response.status} - ${
          error.response.data.message || "Something went wrong"
        }`;
      } else if (error.request) {
        console.error("Request:", error.request);
        errorMessageText = "Failed to connect to the server.";
      } else {
        console.error("Error message:", error.message);
        errorMessageText = `Error: ${error.message}`;
      }
      setErrorMessage(errorMessageText);

      const errorMessage = {
        id: Date.now(),
        text: "Sorry, I encountered an error.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    setInput("");
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <Header />
      <div
        className="flex flex-col items-center justify-center bg-gray-100 p-4"
        style={{
          backgroundImage: `url(${im13})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="w-full  bg-transparent-50 rounded-lg shadow-lg p-6  mt-5 mb-3"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.48)", // Light semi-transparent white
            // backdropFilter: 'blur(10px)', // Add blur effect
          }}
        >
          <h1 className="text-2xl font-bold text-center mb-4">
            Ask Any Trip Related Question
          </h1>
          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}
          <div className="h-80 overflow-y-auto mb-4 border border-black p-4 bg-transparent-50 ">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-3 p-4 rounded-lg ${
                  message.sender === "user"
                    ? "bg-sky-300 text-blue-800 ml-auto w-fit"
                    : "bg-gray-300 text-gray-800 mr-auto w-fit"
                }`}
                style={{
                  maxWidth: "70%",
                  float: message.sender === "user" ? "right" : "left",
                  clear: "both",
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me about trips..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Send"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatbot;
