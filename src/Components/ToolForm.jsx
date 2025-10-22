import React, { useState } from "react";
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.mjs";
import axios from "axios";


// curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC_GXyfTSkb_ejsrKGfE3nPJ_YJN0cVwWk" \
//   -H 'Content-Type: application/json' \
//   -H 'X-goog-api-key: AIzaSyC_GXyfTSkb_ejsrKGfE3nPJ_YJN0cVwWk' \
//   -X POST \
//   -d '{
//     "contents": [
//       {
//         "parts": [
//           {
//             "text": "Explain how AI works in a few words"
//           }
//         ]
//       }
//     ]
//   }'





// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.worker.mjs";

const ToolForm = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [AiResult, setAiResult] = useState(null)

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

  const handleSubmit =  async (e) => {
    e.preventDefault();

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
    
    const response = await axios ({
      url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC_GXyfTSkb_ejsrKGfE3nPJ_YJN0cVwWk",
      method:"post",
      data: {
    contents: [
      {
        "parts": [
          {
            "text": prompt
          }
        ]
      }
    ]
  },
    })
    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    setAiResult(text)
    console.log(AiResult)
  };

  return (
    <div className="h-[100%] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className=" shadow-lg rounded-2xl text-white p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 ">
          Resume Upload & Job Details
        </h2>

        {/* Job Title */}
        <label className="block mb-3">
          <span className=" font-medium">Job Title</span>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter job title"
            className="mt-1 w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        {/* Job Description */}
        <label className="block mb-3">
          <span className=" font-medium">Job Description</span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description"
            className="mt-1 w-full border rounded-lg p-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </label>

        {/* Resume Upload */}
        <label className="block mb-3">
          <span className=" font-medium">Upload Resume (PDF)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
          />
          {fileName && (
            <p className="text-sm text-green-600 mt-1">Uploaded: {fileName}</p>
          )}
        </label>

        

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 mt-5 rounded-lg transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ToolForm;
