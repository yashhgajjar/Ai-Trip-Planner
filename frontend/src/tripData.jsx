import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";
import axios from "axios";
import { jsPDF } from "jspdf";
import im14 from "./assets/im14.jpg";
import im16 from "./assets/im16.png";

const TripData = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("tripData");
    return savedData ? JSON.parse(savedData) : location.state?.formData || null;
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatMessages")) || [];
  });
  const [isLoading, setIsLoading] = useState(false); // ADD THIS LINE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [botResponses, setBotResponses] = useState([]);
  const navigate = useNavigate();
  const apiKey = "Sxf5ojkwkMnihjJBYwAKtioNbndr2faw"; // Securely manage your API key
  const modelName = "mistral-medium";

  useEffect(() => {
    if (formData) {
      localStorage.setItem("tripData", JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    setMessages([]); // Clear old messages when the component loads
    localStorage.removeItem("chatMessages"); // Ensure localStorage is cleared
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Clear localStorage when the user leaves the page (optional)
  useEffect(() => {
    return () => {
      localStorage.removeItem("tripData");
      localStorage.removeItem("chatMessages");
    };
  }, []);

  // Function to calculate the number of days between two dates
  const calculateNumberOfDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
  };

  const handleSendMessage = async () => {
    if (!formData) {
      console.error("Form data is not available.");
      return;
    }
    setIsLoading(true); // Display loading indicator

    // Add user message to the chat
    const userMessage = {
      id: Date.now(),
      text: input.trim() === "" ? "Trip details requested" : input,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Check if the user's input is related to the trip
    const isTripRelated = checkIfInputIsTripRelated(input);

    if (!isTripRelated) {
      const botMessage = {
        id: Date.now(),
        text: "I can only answer questions related to your trip details. Please ask about your itinerary, destinations, budget, or other trip-related information.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setBotResponses([botMessage]);
      setIsLoading(false);
      setInput("");
      return;
    }

    const numberOfDays = calculateNumberOfDays(
      formData.startDate,
      formData.endDate
    );

    const enhancedInput = `
Generate a **highly detailed travel itinerary** with **at least 9000 words** based on the following details:
- **Trip Duration:** ${formData.startDate} to ${
      formData.endDate
    } (${numberOfDays} days)
- **Destinations:** ${formData.destinations.join(", ")}
- **Budget:** ${formData.budget}
- **Transportation:** ${formData.transportation}
- **Accommodation:** ${formData.accommodation}
- **Companions:** ${formData.companions}
- **Weather Preferences:** ${formData.weather}
- **Additional Notes:** ${formData.additionalNotes}
- **Preferences:** ${JSON.stringify(formData.preferences)}

### **Response Requirements**
1. **Day-wise Breakdown:** Divide the trip into **${numberOfDays} days**, with each day divided into **Morning, Afternoon, Evening, and Night** with exact time slots.
2. **Activities:** Clearly describe what the user will do at each place and why.
3. **Food & Drinks:** Recommend **breakfast, lunch, snacks, and dinner**, with local specialties.
4. **Travel Time & Cost:** Estimate time taken for travel and cost breakdown.
5. **Hidden Gems:** Suggest offbeat locations not commonly visited.
6. **Safety & Budget Tips:** Provide local safety tips and cost-effective alternatives.
7. **Cultural Insights:** Share historical or cultural background of places.
8. **Shopping Recommendations:** Suggest markets, souvenirs, and local specialties.

Make sure your response is **long, structured, and covers every detail**.
- **Each day should be divided into Morning, Afternoon, Evening, and Night**.
- **For every place visited**, provide:
  - **Exact time slots** (e.g., 8:00 AM - 11:30 AM)
  - **Activities to do at each location**
  - **Local cultural insights or hidden gems**
  - **Special events or seasonal attractions**
  - **Cost estimation per place visited**
- **Break down food recommendations for breakfast, lunch, dinner, and snacks** with famous local options.
- **Provide safety tips, transportation routes, and estimated travel time** between locations.
- **Suggest free/low-cost alternatives** if the user has a low budget.
- **Include historical or interesting facts** for each place visited.
- **List shopping or souvenir recommendations** based on the destination.`;

    try {
      // Log the prompt for debugging
      console.log("Prompt being sent to Mistral AI:", enhancedInput);

      const payload = {
        model: modelName,
        messages: [{ role: "user", content: enhancedInput }],
      };

      // Log the complete payload
      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

      // Call the Mistral AI API
      const response = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        payload,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Log the entire response for debugging
      console.log("Full Mistral AI API response:", response);

      // Extract the bot's response (handle potential undefined values)
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
      setBotResponses([botMessage]);
    } catch (error) {
      console.error("Error fetching response from Mistral AI API:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);

      const errorMessage = {
        id: Date.now(),
        text: "Sorry, I encountered an error.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }

    // Clear the input field
    setInput("");
  };

  const handleDownloadPDF = async (message) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;
    let yOffset = 35; // Start Y position after logo

    // Load and add logo
    const logo = new Image();
    logo.src = im16;

    logo.onload = () => {
      doc.addImage(logo, "PNG", (pageWidth - 40) / 2, 10, 40, 15);

      // Add Title with professional styling
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Trip Plan", pageWidth / 2, yOffset, { align: "center" });

      yOffset += 10; // Space after title

      // Format message content for readability
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const messageText = message.text.replace(/\n/g, "\n");

      // Convert text to structured sections
      const formattedLines = formatTextForPDF(
        messageText,
        doc,
        pageWidth - 2 * margin
      );
      formattedLines.forEach((line) => {
        if (yOffset > 275) {
          doc.addPage();
          yOffset = 30;
          doc.addImage(logo, "PNG", (pageWidth - 40) / 2, 10, 40, 15);
        }
        doc.text(line, margin, yOffset);
        yOffset += 6; // Reduced space between lines for a clean look
      });

      // Convert PDF to Blob after content is fully added
      const pdfBlob = doc.output("blob");

      // 🔹 Trigger Local Download
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `trip_plan_${message.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pdfUrl);

      // 🔹 Upload to AWS
      uploadPDFToAWS(pdfBlob, message.id);
    };
  };

  // Function to structure text into sections with proper indentation
  const formatTextForPDF = (text, doc, maxWidth) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const formattedLines = [];

    lines.forEach((line) => {
      // 🔹 Fix: Ensure proper currency symbol
      if (line.match(/(Cost|Price|Budget):\s?(\d+)/)) {
        line = line.replace(
          /(Cost|Price|Budget):\s?(\d+)/,
          (match, label, amount) => {
            return `${label}: ₹ ${amount}`; // Change ₹ to your desired currency
          }
        );
      }

      if (
        line.startsWith("Day") ||
        line.startsWith("Budget") ||
        line.startsWith("Accommodation") ||
        line.startsWith("Transportation") ||
        line.startsWith("Activities") ||
        line.startsWith("Food and Drinks") ||
        line.startsWith("Total Estimated Budget")
      ) {
        formattedLines.push(""); // Add spacing before sections
        doc.setFont("helvetica", "bold"); // Bold section headers
      } else {
        doc.setFont("helvetica", "normal");
      }

      formattedLines.push(...doc.splitTextToSize(line, maxWidth));
    });

    return formattedLines;
  };

  // 🔹 Upload Function
  const uploadPDFToAWS = async (pdfBlob, messageId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;
    const tripId = JSON.parse(localStorage.getItem("trip"));

    if (!userId || !tripId) {
      console.error("User ID or Trip ID missing.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfBlob, `trip_plan_${messageId}.pdf`);
    formData.append("userId", userId);
    formData.append("tripId", tripId);

    try {
      const res = await axios.post(
        "https://ai-trip-planner-qok6.onrender.com/api/upload-pdf",
        formData
      );
      alert("PDF uploaded successfully!");
      console.log("PDF URL:", res.data.pdfUrl);
    } catch (err) {
      console.error("Error uploading PDF:", err);
    }
  };

  const handlecheckwether = () => {
    navigate("/checkWether", {
      state: {
        destinations: formData.destinations,
        startDate: formData.startDate,
        endDate: formData.endDate,
      },
    });
  };

  // Function to check if user input is trip-related
  const checkIfInputIsTripRelated = (input) => {
    const keywords = [
      "trip",
      "itinerary",
      "destination",
      "budget",
      "accommodation",
      "transportation",
      "activity",
      "food",
      "travel",
      "day",
      "place",
      "cost",
      "hotel",
      "flight",
      "route",
      "schedule",
    ];
    const lowerCaseInput = input.toLowerCase();
    return keywords.some((keyword) => lowerCaseInput.includes(keyword));
  };

  if (!formData) {
    return (
      <div>
        <Header
          buttons={
            isLoggedIn
              ? [
                  { label: "Plan Trip", path: "/tripPlan" },
                  { label: "History", path: "/tripHistory" },
                  { label: "Ask Ai", path: "/chatbot" },
                ]
              : [
                  { label: "Plan Trip", path: "/tripPlan" },
                  { label: "History", path: "/tripHistory" },
                  { label: "Ask Ai", path: "/chatbot" },
                ]
          }
        />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <p className="text-xl text-gray-700">
            No trip data available. Please go back and plan your trip.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        buttons={
          isLoggedIn
            ? [
                { label: "Plan Trip", path: "/tripPlan" },
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
            : [
                { label: "Plan Trip", path: "/tripPlan" },
                { label: "History", path: "/tripHistory" },
                { label: "Ask Ai", path: "/chatbot" },
              ]
        }
      />
      <div
        className="flex-grow bg-gray-50 p-8 pt-20 pb-20"
        style={{
          backgroundImage: `url(${im14})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex-grow p-8 bg-transparent-50 pt-3 pb-20 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.23)", // Light semi-transparent white
          }}
        >
          <h1 className="text-3xl font-bold text-blue-400 text-center mb-6">
            Trip Details
          </h1>
          <div className="space-y-4">
            {/* Display trip details */}
            <p className="text-gray-900">
              <strong className="font-semibold">Start Date:</strong>{" "}
              {formData.startDate}
            </p>
            <p className="text-gray-900">
              <strong className="font-semibold">End Date:</strong>{" "}
              {formData.endDate}
            </p>
            <p className="text-gray-900">
              <strong className="font-semibold">Destinations:</strong>{" "}
              {formData.destinations.map((destination, index) => (
                <span key={`${destination}-${index}`}>
                  {destination} <br />
                </span>
              ))}
            </p>
            <p className="text-gray-900">
              <strong className="font-semibold">Budget:</strong> 
              {formData.budget}
            </p>
            <p className="text-gray-900">
              <strong className="font-semibold">Trip Start Place:</strong>{" "}
              {formData.tripStartPlace}
            </p>
            {formData.accommodation && (
              <p className="text-gray-900">
                <strong className="font-semibold">Accommodation:</strong>{" "}
                {formData.accommodation.charAt(0).toUpperCase() +
                  formData.accommodation.slice(1)}
              </p>
            )}
            {formData.transportation && (
              <p className="text-gray-900">
                <strong className="font-semibold">Transportation Mode:</strong>{" "}
                {formData.transportation.charAt(0).toUpperCase() +
                  formData.transportation.slice(1)}
              </p>
            )}
            <p className="text-gray-900">
              <strong className="font-semibold">Preferred Weather:</strong>{" "}
              {formData.weather}
            </p>
            <p className="text-gray-900">
              <strong className="font-semibold">Companions:</strong>{" "}
              {formData.companions}
            </p>
            <p className="text-gray-900">
              <strong className="font-semibold">Additional Notes:</strong>{" "}
              {formData.additionalNotes}
            </p>
            <div>
              <strong className="font-semibold">Preferences:</strong>
              {formData.preferences &&
                Object.entries(formData.preferences).map(
                  ([key, value], index) => (
                    <div key={index}>
                      <span className="text-gray-900">
                        {key}: {value.toString()}
                      </span>
                    </div>
                  )
                )}
            </div>
            <button
              onClick={handlecheckwether}
              className="inline-flex items-center px-4 h-12 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Check Weather
            </button>
          </div>
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <input
                type="text"
                className="shadow-sm focus:ring-indigo-500 h-12 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mr-2"
                placeholder="  Ask me anything about your trip..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="inline-flex items-center px-4 h-12 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Send"}
              </button>
            </div>
            <div className="h-96 overflow-y-auto p-4 border rounded-lg ">
              <div className="mt-4 space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-100 text-blue-800 ml-auto w-fit max-w-md"
                        : "bg-gray-100 text-gray-800 mr-auto w-fit max-w-md"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    {message.sender === "bot" && (
                      <button
                        onClick={() => handleDownloadPDF(message)}
                        className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Download PDF
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripData;
