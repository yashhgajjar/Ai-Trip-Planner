import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import im1 from "./assets/im1.jpg";
import im2 from "./assets/im2.jpg";
import im3 from "./assets/im3.jpg";
import im4 from "./assets/im4.jpg";
import im5 from "./assets/im5.jpg";
import im6 from "./assets/back.jpg";
import im7 from "./assets/im7.avif";
import im8 from "./assets/im8.jpg";
import im9 from "./assets/im9.webp";
import im10 from "./assets/im10.jpg";
import im0 from "./assets/Trip.png";
import Header from "./header-footer/header";
import Footer from "./header-footer/footer";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentImage, setCurrentImage] = useState(0); // State for images
  const [currentImageContent, setCurrentImageContent] = useState(0); // State for content

  const [currentContent, setCurrentContent] = useState(0); // State for content
  const images = [im1, im2, im3, im4, im5, im6, im7, im8, im9, im10]; // Array for images

  const contentImage = [
    {
      title: "Mountain Village in Switzerland",
      description:
        "Explore the picturesque rural village nestled in the Swiss Alps, surrounded by towering mountains and crystal-clear lakes.",
      placesNearby: [
        "Swiss Alps",
        "Lake Geneva",
        "Matterhorn Mountain",
        "Zermatt",
      ],
    },
    {
      title: "Jungle Retreat in Costa Rica",
      description:
        "Experience the lush rainforest of Costa Rica, where you can hear the sounds of wildlife and explore the abundant flora.",
      placesNearby: [
        "Corcovado National Park",
        "Manuel Antonio Beach",
        "Monteverde Cloud Forest",
      ],
    },
    {
      title: "Lakeside Village in the Himalayas",
      description:
        "A serene village located by a sparkling lake in the Indian Himalayas, surrounded by majestic snow-capped peaks.",
      placesNearby: [
        "Leh-Ladakh",
        "Pangong Lake",
        "Tso Moriri Lake",
        "Nubra Valley",
      ],
    },
    {
      title: "Mountain Hideaway in Bhutan",
      description:
        "A peaceful retreat in the Himalayan kingdom of Bhutan, surrounded by forests, mountains, and tranquil monasteries.",
      placesNearby: ["Paro Taktsang", "Punakha Dzong", "Bumthang Valley"],
    },
    {
      title: "Jungle Safari in Tanzania",
      description:
        "Dive into the heart of Tanzania's Serengeti, where you can spot exotic wildlife amidst the vast savanna and lush jungle.",
      placesNearby: [
        "Serengeti National Park",
        "Ngorongoro Crater",
        "Tarangire National Park",
      ],
    },
    {
      title: "Rural Countryside in the French Alps",
      description:
        "Stroll through the quiet villages in the French Alps, where rolling hills meet dense forests and traditional alpine homes.",
      placesNearby: ["Chamonix", "Annecy", "Mont Blanc"],
    },
    {
      title: "Waterfront Village in New Zealand",
      description:
        "This beautiful village lies at the edge of a crystal-clear lake, surrounded by mountains and lush greenery in New Zealand.",
      placesNearby: ["Lake Tekapo", "Mount Cook", "Queenstown"],
    },
    {
      title: "Jungle Adventure in Amazon Rainforest",
      description:
        "Venture deep into the Amazon rainforest, where the rich biodiversity and lush greenery make it a paradise for adventure lovers.",
      placesNearby: ["Manaus", "Iguazu Falls", "Madidi National Park"],
    },
    {
      title: "Mountain Escape in Nepal",
      description:
        "Trek through remote villages in Nepal's Annapurna Range, where towering peaks, terraced fields, and rushing rivers await.",
      placesNearby: ["Annapurna Base Camp", "Pokhara", "Chitwan National Park"],
    },
    {
      title: "Island Village in Indonesia",
      description:
        "Enjoy the tranquility of a rural village on a remote Indonesian island, surrounded by pristine beaches, coral reefs, and tropical jungles.",
      placesNearby: ["Komodo National Park", "Gili Islands", "Bali"],
    },
  ];

  const content = [
    {
      title: "Tell Us About Your Trip",
      text: "Simply fill out our quick and easy form with details like your travel dates, preferred destinations, accommodation choices, and budget. Our AI takes care of the rest! You'll get a fully personalized itinerary that suits your needs.",
    },
    {
      title: "Personalized Recommendations",
      text: "Based on your inputs, our AI will suggest the best destinations, accommodations, and travel routes to create a customized plan that matches your unique preferences. With tailored recommendations, we make planning your trip effortless.",
    },
    {
      title: "Get Your Trip Plan",
      text: "Receive a comprehensive travel itinerary, including recommended activities, transportation options, and budget-friendly tips, all tailored to your needs. The plan will include everything from departure to arrival, making your trip stress-free.",
    },
  ];

  const navigate = useNavigate();

 
 

  // Handle next image
  const nextImage = () => {
    setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handle next content
  const nextContent = () => {
    setCurrentContent((prevIndex) => (prevIndex + 1) % content.length);
  };

  // Handle previous content
  const prevContent = () => {
    setCurrentContent((prevIndex) =>
      prevIndex === 0 ? content.length - 1 : prevIndex - 1
    );
  };

  const handleChange = (e) => {
    navigate("/tripPlan");
  };

  const s3ImageUrl = "https://meetvisodiya.s3.eu-north-1.amazonaws.com/Trip.png"; 
  return (
    <div className="min-h-screen flex flex-col">
      <Header
  buttons={[
    { label: "Plan Trip", path: "/tripPlan" },
    { label: "History", path: "/tripHistory" },
    { label: "Ask Ai", path: "/chatbot" },
    
  ]}
/>


      {/* Image Section */}

      <div
        className="flex-grow bg-cover bg-center w-full h-screen"
        style={{
          backgroundImage: `url(${s3ImageUrl})`, 
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
      </div>

      <div className="p-8 bg-gray-200 text-center">
        <p className="text-lg text-gray-700">
          Plan Your Perfect Getaway, Hassle-Free with AI. At TripPlanning AI, we
          believe that planning a trip should be exciting, not overwhelming. Our
          intelligent platform uses advanced AI to curate personalized travel
          plans based on your preferences, interests, and budget, ensuring a
          memorable and stress-free journey. Whether you’re looking for an
          adventure, cultural experiences, or a relaxing retreat, we’ve got you
          covered.
        </p>
      </div>

      {/* Image and Content Section */}
      <div className="flex items-center justify-center p-8 h-auto md:h-screen">
  <div className="w-full h-full flex flex-col md:flex-row ">
    {/* Image Section */}
    <div
      className="w-full md:w-1/2 h-[300px] md:h-[450px] bg-cover bg-center rounded-lg mt-6 md:mt-0"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      {/* Navigation Buttons on Image */}
      
    </div>

    {/* Content Section */}
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white bg-opacity-70 rounded-lg">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        {contentImage[currentImage]?.title}
      </h2>
      <p className="text-lg text-gray-700 mb-4 overflow-hidden text-ellipsis">
        {contentImage[currentImage]?.description}
      </p>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Places Nearby:
      </h3>
      <ul className="list-disc pl-6 text-gray-600">
        {contentImage[currentImage]?.placesNearby.map((place, index) => (
          <li key={index}>{place}</li>
        ))}
      </ul>
    </div>
  </div>
</div>


      {/* Content Section */}
      <div className="p-8 bg-gray-200 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          {content[currentContent].title}
        </h2>
        <p className="text-lg text-gray-700 mb-4 overflow-hidden text-ellipsis">
          {content[currentContent].text}
        </p>

        {/* Navigation Buttons for Content */}
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 border-1 border-blue-500 text-gray-500 hover:bg-blue-400 hover:text-white rounded-full"
            onClick={prevContent}
          >
            &#8592; {/* Left Arrow */}
          </button>
          <button
            className="px-4 py-2 border-1 border-blue-500 text-gray-500 hover:bg-blue-400 hover:text-white rounded-full"
            onClick={nextContent}
          >
            &#8594; {/* Right Arrow */}
          </button>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="flex items-center justify-center p-8 h-auto md:h-screen">
        <div className="w-full h-full flex flex-col md:flex-row">
          {/* Image Section */}

          <div
            className="w-full md:w-1/2 h-[300px] md:h-[450px] bg-cover bg-center rounded-lg mt-6 md:mt-0"
            style={{ backgroundImage: `url(${im10})` }}
          ></div>
          {/* Content Section */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Why Choose TripPlanning AI?
            </h2>

            <ul className="text-lg text-gray-700 space-y-4 md:space-y-6">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">&#10003;</span>
                <strong>Custom Plan:</strong> Our AI analyzes your travel
                preferences, including destinations, accommodation, and
                activities, to create a completely personalized travel itinerary
                that suits your interests.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">&#10003;</span>
                <strong>Smart Picks:</strong> Based on your inputs, our AI
                provides the best recommendations for destinations,
                accommodations, and travel routes, ensuring your trip is
                optimized for your unique preferences.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">&#10003;</span>
                <strong>Book Now:</strong> We integrate with trusted booking
                platforms, making it easy for you to book flights, hotels, and
                activities directly from your trip plan in one place.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">&#10003;</span>
                <strong>Adjust Plan:</strong> Our AI can dynamically adjust your
                itinerary based on real-time factors like weather,
                transportation availability, and other variables, ensuring you
                always have the best plan.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8 bg-gray-200 text-center ">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Start Planning Your Dream Trip Today
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Click{" "}
          <button onClick={handleChange} className="text-blue-500">
            Get Started
          </button>{" "}
          to fill out the form and watch our AI craft a trip just for you.
        </p>
      </div>
      {/* Why Choose Us Section */}
 <div className="flex items-center justify-center p-8 h-auto md:h-screen">
  <div className="w-full h-full flex flex-col md:flex-row">
    {/* Image Section */}
    <div
      className="w-full md:w-1/2 h-[300px] md:h-[450px] bg-cover bg-center rounded-lg mt-6 md:mt-0"
      style={{ backgroundImage: `url(${im8})` }}
    ></div>

    {/* Content Section */}
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        Explore the Possibilities with Our AI Trip Planner
      </h2>
      <p className="text-gray-700 text-lg mb-4">
        Discover the future of travel planning with our AI-powered platform.
        We make creating your dream itinerary easier and more personalized
        than ever before.
      </p>

      <ul className="text-lg text-gray-700 space-y-4 md:space-y-6">
        <li className="flex items-start">
          <span className="text-blue-500 mr-2">&#10003;</span>
          <div>
            <strong className="font-semibold">Vast Destination Database:</strong>
            Access a world of possibilities! Our AI is trained on a database
            of over 1 million destinations, uncovering hidden gems and iconic
            landmarks alike.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 mr-2">&#10003;</span>
          <div>
            <strong className="font-semibold">Hyper-Personalized Plans:</strong>
            Tired of generic itineraries? Our AI learns your unique travel
            style, budget, and preferences to craft a plan that's perfectly
            suited to you.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 mr-2">&#10003;</span>
          <div>
            <strong className="font-semibold">Real-Time Optimization:</strong>
            Travel with confidence! Our AI monitors real-time data on weather,
            traffic, and local events to dynamically adjust your itinerary,
            ensuring a seamless experience.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 mr-2">&#10003;</span>
          <div>
            <strong className="font-semibold">Integrated Booking:</strong>
            Effortlessly book flights, hotels, tours, and activities all in one
            place. Our AI connects you to the best deals from trusted travel
            providers.
          </div>
        </li>
        <li className="flex items-start">
          <span className="text-blue-500 mr-2">&#10003;</span>
          <div>
            <strong className="font-semibold">AI-Powered Recommendations:</strong>
            Our algorithms are designed to suggest destination, activities,
            restaurants and more based on a variety of factors.
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>


{/* Floating Chatbot Button */}
<button
  onClick={() => navigate("/chatbot")}
  className="fixed bottom-6 right-6 md:bottom-10 md:right-5 bg-blue-400 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-500 transition duration-300 "
>
  ?
</button>

      <Footer />
    </div>
  );
};

export default Home;
