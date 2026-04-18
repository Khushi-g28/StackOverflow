"use client";
import { useState } from "react";

const languages = [
  "English",
  "Spanish",
  "Hindi",
  "Portuguese",
  "Chinese",
  "French",
];

export default function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState("");
  const [step, setStep] = useState("select");
  const [otp, setOtp] = useState("");

  const handleLanguageChange = (lang) => {
    setSelectedLang(lang);
    setStep("verify");

    // Simulate OTP sending
    if (lang === "French") {
      alert("OTP sent to your Email 📧");
    } else {
      alert("OTP sent to your Mobile 📱");
    }
  };

  const handleVerify = () => {
    if (otp === "123456") {
      alert(`Language switched to ${selectedLang} ✅`);
      setStep("select");
      setOtp("");
    } else {
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white text-gray-900 rounded-2xl shadow-lg justify-center">
      
      <h2 className="text-xl font-bold mb-4 text-center text-decoration-underline text-blue-600">
        Language Settings
      </h2>

      {step === "select" && (
        <div className="space-y-3">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className="w-full py-2 bg-gray-200 hover:bg-gray-700 rounded-lg transition"
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-300 text-center">
            {selectedLang === "French"
              ? "Enter OTP sent to your Email"
              : "Enter OTP sent to your Mobile"}
          </p>

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 focus:outline-none"
          />

          <button
            onClick={handleVerify}
            className="w-full py-2 bg-gray-200 hover:bg-gray-700 rounded-lg"
          >
            Verify & Switch
          </button>

          <button
            onClick={() => setStep("select")}
            className="w-full py-2 bg-gray-500 rounded-lg"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}