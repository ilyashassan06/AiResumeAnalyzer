import React, { useEffect } from "react";
import { useAi } from "../Context/AiResult";
import { useNavigate } from "react-router-dom";

function Result() {
  const { aiData } = useAi();
  const navigate = useNavigate()

  // Clean the AI text before parsing
  let parsedData = null;

if (aiData) {
  const cleanJsonString = aiData
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    parsedData = JSON.parse(cleanJsonString);
  } catch (error) {
    console.error("Invalid JSON from AI:", error);
  }
}


 // Redirect if AI data is missing (e.g., after page refresh)
  useEffect(() => {
    if (!aiData) {
      navigate("/Home"); // or "/login" or any safe page
    }
  }, [aiData, navigate]);

  if (!aiData) {
    return null; // optional: show nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          🧠 AI Resume Analysis Result
        </h1>

        {/* ATS Score */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 mb-8 shadow-md flex flex-col items-center justify-center">
          <p className="text-xl font-semibold mb-2">ATS Match Score</p>
          <h2 className="text-5xl font-extrabold">
            {parsedData?.ats_score || "N/A"}%
          </h2>
        </div>

        {/* Pros & Cons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-green-700 mb-3">✅ Strengths</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {parsedData?.pros?.length
                ? parsedData.pros.map((item, index) => <li key={index}>{item}</li>)
                : <li>No strengths detected</li>}
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-xl font-bold text-red-700 mb-3">⚠️ Weaknesses</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {parsedData?.cons?.length
                ? parsedData.cons.map((item, index) => <li key={index}>{item}</li>)
                : <li>No weaknesses found</li>}
            </ul>
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl shadow-sm mb-8">
          <h3 className="text-xl font-bold text-yellow-700 mb-3">🧩 Missing Keywords</h3>
          <div className="flex flex-wrap gap-3">
            {parsedData?.missing_keywords?.length ? (
              parsedData.missing_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No missing keywords</p>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-bold text-blue-700 mb-3">💡 Suggestions</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {parsedData?.suggestions?.length
              ? parsedData.suggestions.map((s, i) => <li key={i}>{s}</li>)
              : <li>No suggestions available</li>}
          </ul>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => window.history.back()}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
        >
          🔙 Back to Tool
        </button>
      </div>
    </div>
  );
}

export default Result;
