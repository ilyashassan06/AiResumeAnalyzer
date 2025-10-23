import React, { useState } from "react";
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.mjs";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth } from "../Context/firebaseConfig";
import { useAi } from "../Context/AiResult";



// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.worker.mjs";

const ToolForm = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const { setAiData } = useAi();
  const [loading, setLoading] = useState(false); 

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
        }

        setResumeText(text);
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  const handleLogout = async ()=>{
     try {
      await signOut(auth);
      console.log("Logged out successfully");
      navigate("/Login");// or use navigate("/login") if using react-router
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const prompt = `
You are an AI Resume Analyzer. 
Analyze the resume content below for the given job title and description. 
Provide a detailed JSON response with the following structure:

{
  "ats_score": "number between 0 and 100",
  "pros": ["list of strengths"],
  "cons": ["list of weaknesses"],
  "missing_keywords": ["important skills or terms missing in resume"],
  "suggestions": ["specific improvements to increase ATS match"]
}

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Resume Text:
${resumeText}

Return only a valid JSON response (no extra commentary).
`;

  try {
    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC_GXyfTSkb_ejsrKGfE3nPJ_YJN0cVwWk",
      method: "post",
      data: {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    setAiData(text);

    // ✅ Corrected navigation
    navigate("/Result", { state: { aiData: text } });
  } catch (error) {
    console.error("AI Request Error:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
   <div className=" bg-gray-50 flex items-center justify-center  ">
  <div className="w-full max-w-lg">
    <form
      onSubmit={handleSubmit}
      className=" bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-800
 rounded-3xl shadow-xl p-8 md:p-10 flex flex-col gap-6 text-gray-800 mt-6 md:mt-0"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">
        📄 Resume Upload & Job Details
      </h2>

      {/* Job Title */}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-white">Job Title</span>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter job title"
          className="w-full border text-white border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
      </label>

      {/* Job Description */}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-white">Job Description</span>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description"
          className="w-full text-white border border-gray-300 rounded-2xl p-3 h-28 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          required
        />
      </label>

      {/* Resume Upload */}
      <label className="flex flex-col gap-2">
        <span className="font-semibold text-white">Upload Resume (PDF)</span>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="block w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border file:border-gray-300 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
        />
        {fileName && (
          <p className="text-sm text-green-600 mt-1">Uploaded: {fileName}</p>
        )}
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-2xl shadow-md transition-all duration-300"
      >
          {loading ? "⏳ Loading Result..." : "✅ Submit"}
      </button>
    </form>
  </div>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="fixed top-6 right-6 z-50 
               bg-gradient-to-r from-amber-500 to-amber-700 
               text-white font-semibold 
               px-5 py-2 rounded-2xl text-lg 
               shadow-lg shadow-amber-500/30 
               hover:scale-105 hover:shadow-amber-600/40 
               active:scale-95 transition-all duration-300 ease-out 
               flex items-center gap-2"
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
