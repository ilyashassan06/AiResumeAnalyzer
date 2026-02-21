import React, { useState } from "react";
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.mjs";
import axios from "axios";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../Context/firebaseConfig";
import { useAi } from "../Context/AiResult";
import { useTheme } from "../Context/ThemeContext";

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.worker.mjs";

const ToolForm = () => {
  const navigate = useNavigate();
  const { setAiData } = useAi();
  const { theme } = useTheme();

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  /** -----------------------
   * FILE UPLOAD HANDLER
   * ------------------------*/
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file?.name || "");

    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((it) => it.str).join(" ");
        text += pageText + "\n";
      }
      setResumeText(text);
    };

    reader.readAsArrayBuffer(file);
  };
const MAX_CHARS = 1200; // safe
const trimmedResume = resumeText.slice(0, MAX_CHARS);
  /** -----------------------
   * LOGOUT HANDLER
   * ------------------------*/
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /** -----------------------
   * SUBMIT HANDLER
   * ------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `
You are an AI Resume Analyzer. 
Analyze this resume for the job role.make sure 
to return ats score in percentage strictly

---

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Resume:
${trimmedResume}

---

Return valid JSON only:
{
  "ats_score": "",
  "pros": [],
  "cons": [],
  "missing_keywords": [],
  "suggestions": []
}`;

    try {
      const response = await axios.post("/api/analyze", {
  prompt: prompt,
});

      const text =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setAiData(text);

      navigate("/Result", { state: { aiData: text } });
    } catch (err) {
      console.error("AI Error:", err);
      alert("Unable to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-6 ${
          theme === "light"
            ? "text-gray-800"
            : "text-gray-100"
        }`}
      >
        {/* Title */}
        <h2
          className={`text-2xl md:text-3xl font-bold text-center mb-4 ${
            theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        >
          📄 Resume Upload & Job Details
        </h2>

        {/* Job Title */}
        <label className="flex flex-col gap-2">
          <span
            className={`font-semibold ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Job Title
          </span>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className={`w-full rounded-2xl p-3 focus:outline-none focus:ring-2 ${
              theme === "light"
                ? "border border-gray-200 bg-gray-50 placeholder-gray-500 focus:ring-amber-300"
                : "border border-gray-600 bg-gray-700 placeholder-gray-400 focus:ring-amber-400"
            }`}
            placeholder="Enter job title"
            required
          />
        </label>

        {/* Job Description */}
        <label className="flex flex-col gap-2">
          <span
            className={`font-semibold ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Job Description
          </span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={`w-full rounded-2xl p-3 h-28 resize-none focus:outline-none focus:ring-2 ${
              theme === "light"
                ? "border border-gray-200 bg-gray-50 placeholder-gray-500 focus:ring-amber-300"
                : "border border-gray-600 bg-gray-700 placeholder-gray-400 focus:ring-amber-400"
            }`}
            placeholder="Enter job description"
            required
          />
        </label>

        {/* Resume Upload */}
        <label className="flex flex-col gap-2">
          <span
            className={`font-semibold ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Upload Resume (PDF)
          </span>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className={`block w-full text-sm file:py-2 file:px-4 file:rounded-2xl file:border ${
              theme === "light"
                ? "file:bg-gray-100 file:border-gray-200 hover:file:bg-gray-200"
                : "file:bg-gray-700 file:border-gray-600 hover:file:bg-gray-600"
            }`}
          />

          {fileName && (
            <p className="text-sm text-green-600 mt-1">Uploaded: {fileName}</p>
          )}
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-2xl shadow-md transition-all duration-300 ${
            theme === "light"
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-gray-900"
          }`}
        >
          {loading ? "⏳ Analyzing..." : "✅ Submit"}
        </button>
      </form>

      {/* LOGOUT floating button */}
      <button
        onClick={handleLogout}
        className={`fixed bottom-6 left-6 z-50 px-5 py-2 rounded-2xl text-lg font-semibold flex items-center gap-2 shadow-lg transition-all duration-300
        ${
          theme === "light"
            ? "bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:scale-105"
            : "bg-amber-500 text-gray-900 hover:scale-105"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3H6.75A2.25 2.25 0 004.5 5.25v13.5A2.25 2.25 0 006.75 21h6.75a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
          />
        </svg>
        Logout
      </button>
    </div>
  );
};

export default ToolForm;
