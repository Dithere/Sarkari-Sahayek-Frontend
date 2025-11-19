import React from "react";

// --- FAQCard Component ---
// Displays a single frequently asked question card
const FAQCard = ({ question, summary, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 p-5 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border border-gray-700 h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-2">
          {question}
        </h3>
        <p className="text-sm text-gray-400">{summary}</p>
      </div>
      <div className="text-indigo-400 text-sm font-medium mt-3">
        Learn more &rarr;
      </div>
    </div>
  );
};

export default FAQCard;
