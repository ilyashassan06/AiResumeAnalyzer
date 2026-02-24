import React, { useEffect } from "react";
import { useAi } from "../Context/AiResult";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";

function Result() {
  const { aiData } = useAi();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Redirect if no AI data (like after refresh)
  useEffect(() => {
    if (!aiData) {
      navigate("/Home");
    }
  }, [aiData, navigate]);

  if (!aiData) return null;

  // ✅ Use aiData directly (already parsed object from backend)
  const {
    ats_score = "N/A",
    pros = [],
    cons = [],
    missing_keywords = [],
    suggestions = []
  } = aiData;

  return (
    <div
      className={
        theme === "light"
          ? "min-h-screen w-[100%] bg-gray-50 py-10 px-6 md:px-16 lg:px-32"
          : "min-h-screen w-[100%] bg-gray-900 py-10 px-4 md:px-12 lg:px-28"
      }
    >
      <div
        className={
          theme === "light"
            ? "max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 md:p-10"
            : "max-w-4xl mx-auto bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-3xl p-6 md:p-8"
        }
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1
            className={
              theme === "light"
                ? "text-3xl md:text-4xl font-bold text-gray-800"
                : "text-3xl md:text-4xl font-bold text-gray-100"
            }
          >
            🧠 AI Resume Analysis Result
          </h1>
        </div>

        {/* ATS Score */}
        <div
          className={
            theme === "light"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6 mb-6 shadow-md text-center"
              : "bg-amber-500 text-gray-900 rounded-2xl p-6 mb-6 shadow-md text-center"
          }
        >
          <p className="text-lg font-semibold mb-2">ATS Match Score</p>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            {ats_score}
          </h2>
          <p className="text-sm mt-2 opacity-90">
            Higher is better — aim for 80%+ for strong ATS compatibility
          </p>
        </div>

        {/* Pros & Cons */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <section
            className={
              theme === "light"
                ? "bg-green-50 border border-green-200 p-6 rounded-2xl shadow-sm"
                : "bg-gray-700/40 border border-green-800/40 p-6 rounded-2xl shadow-sm"
            }
          >
            <h3
              className={
                theme === "light"
                  ? "text-xl font-bold text-green-700 mb-3"
                  : "text-xl font-bold text-green-300 mb-3"
              }
            >
              ✅ Strengths
            </h3>

            <ul className="list-disc pl-5 space-y-2">
              {pros.length ? (
                pros.map((item, index) => (
                  <li
                    key={index}
                    className={
                      theme === "light"
                        ? "text-gray-700"
                        : "text-gray-200"
                    }
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
                  No strengths detected
                </li>
              )}
            </ul>
          </section>

          {/* Weaknesses */}
          <section
            className={
              theme === "light"
                ? "bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm"
                : "bg-gray-700/40 border border-red-800/40 p-6 rounded-2xl shadow-sm"
            }
          >
            <h3
              className={
                theme === "light"
                  ? "text-xl font-bold text-red-700 mb-3"
                  : "text-xl font-bold text-red-300 mb-3"
              }
            >
              ⚠️ Weaknesses
            </h3>

            <ul className="list-disc pl-5 space-y-2">
              {cons.length ? (
                cons.map((item, index) => (
                  <li
                    key={index}
                    className={
                      theme === "light"
                        ? "text-gray-700"
                        : "text-gray-200"
                    }
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
                  No weaknesses found
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Missing Keywords */}
        <div
          className={
            theme === "light"
              ? "bg-yellow-50 border border-yellow-200 p-6 rounded-2xl shadow-sm mb-6"
              : "bg-gray-700/30 border border-yellow-800/30 p-6 rounded-2xl shadow-sm mb-6"
          }
        >
          <h3
            className={
              theme === "light"
                ? "text-xl font-bold text-yellow-700 mb-3"
                : "text-xl font-bold text-yellow-300 mb-3"
            }
          >
            🧩 Missing Keywords
          </h3>

          <div className="flex flex-wrap gap-3">
            {missing_keywords.length ? (
              missing_keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={
                    theme === "light"
                      ? "bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium"
                      : "bg-yellow-600/30 text-yellow-200 px-3 py-1 rounded-full text-sm font-medium"
                  }
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
                No missing keywords
              </p>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div
          className={
            theme === "light"
              ? "bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm"
              : "bg-gray-700/30 border border-blue-800/30 p-6 rounded-2xl shadow-sm"
          }
        >
          <h3
            className={
              theme === "light"
                ? "text-xl font-bold text-blue-700 mb-3"
                : "text-xl font-bold text-blue-300 mb-3"
            }
          >
            💡 Suggestions
          </h3>

          <ul className="list-disc pl-5 space-y-2">
            {suggestions.length ? (
              suggestions.map((s, i) => <li key={i}>{s}</li>)
            ) : (
              <li className={theme === "light" ? "text-gray-600" : "text-gray-300"}>
                No suggestions available
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
          >
            🔙 Back to Tool
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(aiData, null, 2));
              alert("Result JSON copied to clipboard");
            }}
            className={
              theme === "light"
                ? "border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-xl shadow-sm"
                : "border border-gray-600 bg-gray-800 text-gray-200 px-4 py-2 rounded-xl shadow-sm"
            }
          >
            Copy JSON
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;