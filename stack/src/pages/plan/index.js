import React from 'react'
import { useEffect, useState } from "react";


const PlanPage = () => {

  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [question, setQuestion] = useState("");
  const [questionsToday, setQuestionsToday] = useState(0);

  const plans = [
    { name: "FREE", price: 0, limit: 1 },
    { name: "BRONZE", price: 100, limit: 5 },
    { name: "SILVER", price: 300, limit: 10 },
    { name: "GOLD", price: 1000, limit: Infinity },
  ];

  const currentLimit =
    plans.find((p) => p.name === currentPlan)?.limit || 1;

  const handlePostQuestion = () => {
    if (questionsToday >= currentLimit) {
      alert("Daily limit reached!");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    setQuestionsToday(questionsToday + 1);
    setQuestion("");
    alert("Question Posted 🚀");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row p-6 gap-6">

      {/* LEFT SECTION */}
      <div className="flex-1 space-y-10">

        {/* PLANS */}
        <div>
          <h1 className="text-3xl font-bold mb-6">
            Choose Your Subscription Plan
          </h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl bg-slate-900 border border-slate-800 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  currentPlan === plan.name
                    ? "border-blue-500"
                    : "hover:border-slate-600"
                }`}
              >
                <h2 className="text-xl font-semibold mb-2">
                  {plan.name}
                </h2>

                <p className="text-2xl font-bold mb-2">
                  ₹{plan.price}
                  <span className="text-sm text-gray-400"> /month</span>
                </p>

                <p className="text-gray-400 mb-4">
                  {plan.limit === Infinity
                    ? "Unlimited Questions"
                    : `${plan.limit} Questions / day`}
                </p>

                <button
                  onClick={() => setCurrentPlan(plan.name)}
                  className={`w-full py-2 rounded-lg font-medium transition-all duration-300 ${
                    currentPlan === plan.name
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {currentPlan === plan.name
                    ? "Current Plan"
                    : `Buy ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* POST QUESTION UI */}
        <div className="bg-slate-800 text-white border-slate-800 rounded-2xl p-6 hover:shadow-lg transition">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ask a Question</h2>
            <span className="text-sm text-gray-400">
              Today: {questionsToday} /{" "}
              {currentLimit === Infinity ? "∞" : currentLimit}
            </span>
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full p-4 rounded-lg bg-slate-800 text-white border-white focus:outline-none focus:border-blue-500 mb-4 resize-none"
            rows={4}
          />

          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              Your limit depends on your subscription plan
            </p>

            <button
              onClick={handlePostQuestion}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium transition-all"
            >
              Post Question
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-80 space-y-6">

        {/* CURRENT PLAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-3">
            Current Subscription
          </h2>

          <div className="space-y-2 text-sm text-gray-300">
            <p>
              Plan: <span className="text-white">{currentPlan}</span>
            </p>
            <p>
              Status: <span className="text-green-400">Active</span>
            </p>
            <p>
              Questions Today: {questionsToday} /{" "}
              {currentLimit === Infinity ? "∞" : currentLimit}
            </p>
          </div>
        </div>

        {/* PAYMENT WINDOW */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all duration-300">
          <h3 className="text-lg font-semibold mb-2">
            Payment Window
          </h3>

          <p className="text-sm opacity-90 mb-2">
            Payments allowed only between:
          </p>

          <p className="font-bold text-lg">
            10:00 AM – 11:00 AM IST
          </p>

          <p className="mt-2 text-green-300 text-sm">
            ● Open Now
          </p>

          <button className="mt-4 w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            Pay Now
          </button>
        </div>

        {/* INFO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-gray-400 hover:border-slate-600 transition">
          Payments are restricted to a 1-hour window daily to ensure secure processing.
        </div>
      </div>
    </div>
  );
}

export default PlanPage;