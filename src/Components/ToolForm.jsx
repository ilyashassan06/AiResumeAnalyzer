import React, { useState } from "react";
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@4.3.136/build/pdf.mjs";
import { useNavigate } from "react-router-dom";
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

  const MAX_CHARS = 12000;

  /* ---------------- FILE UPLOAD ---------------- */
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

      setResumeText(text.slice(0, MAX_CHARS));
    };

    reader.readAsArrayBuffer(file);
  };

  /* ---------------- LOGOUT (Puter) ---------------- */
  const handleLogout = async () => {
    try {
      await window.puter.auth.signOut();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ---------------- SUBMIT (Puter Chat AI) ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeText) {
      alert("Please upload a resume first.");
      return;
    }

    setLoading(true);

    const prompt = `
You are an AI Resume Analyzer.

Analyze the resume strictly for ATS compatibility.

Return ATS score in percentage.

---

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Resume:
${resumeText}

---

Return ONLY valid JSON:
{
  "ats_score": "",
  "pros": [],
  "cons": [],
  "missing_keywords": [],
  "suggestions": []
}
`;

    try {
      const response = await window.puter.ai.chat(prompt);

      const text = response?.message?.content || response;

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      if (!parsed) throw new Error("Invalid AI response");

      setAiData(parsed);
      navigate("/Result");
    } catch (err) {
      console.error("AI Error:", err);
      alert("Unable to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-6 ${
          theme === "light" ? "text-gray-800" : "text-gray-100"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          📄 Resume Upload & Job Details
        </h2>

        {/* Job Title */}
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Job Title</span>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className={`rounded-2xl p-3 focus:outline-none focus:ring-2 ${
              theme === "light"
                ? "border border-gray-200 bg-gray-50 focus:ring-amber-300"
                : "border border-gray-600 bg-gray-700 focus:ring-amber-400"
            }`}
            required
          />
        </label>

        {/* Job Description */}
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Job Description</span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={`rounded-2xl p-3 h-28 resize-none focus:outline-none focus:ring-2 ${
              theme === "light"
                ? "border border-gray-200 bg-gray-50 focus:ring-amber-300"
                : "border border-gray-600 bg-gray-700 focus:ring-amber-400"
            }`}
            required
          />
        </label>

        {/* Upload Resume */}
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Upload Resume (PDF)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            className="block w-full text-sm"
          />
          {fileName && (
            <p className="text-sm text-green-600 mt-1">
              Uploaded: {fileName}
            </p>
          )}
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-2xl transition-all ${
            theme === "light"
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-gray-900"
          }`}
        >
          {loading ? "⏳ Analyzing..." : "✅ Submit"}
        </button>
      </form>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`fixed bottom-6 left-6 px-5 py-2 rounded-2xl font-semibold shadow-lg ${
          theme === "light"
            ? "bg-amber-600 text-white"
            : "bg-amber-500 text-gray-900"
        }`}
      >
        Logout
      </button>
    </div>
  );
};

export default ToolForm;