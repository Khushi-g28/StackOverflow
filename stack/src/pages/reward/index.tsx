
import { useEffect, useState } from "react";
import axios from "axios";

interface Answer {
  _id: string;
  content: string;
  upvotes: number;
}

const RewardPage = () => {
  const [content, setContent] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [points, setPoints] = useState(0);
  const [receiverId, setReceiverId] = useState("");
  const [transferPoints, setTransferPoints] = useState("");

  const API = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // Attach token
  API.interceptors.request.use((req) => {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return req;
  });

  // 🔹 Fetch profile + answers
  const fetchData = async () => {
    try {
      const userRes = await API.get("/user/profile");
      setPoints(userRes.data.points);

      const ansRes = await API.get("/answers"); // create this route in backend
      setAnswers(ansRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Add Answer
  const handleAddAnswer = async () => {
    await API.post("/rewards/answer", { content });
    setContent("");
    fetchData();
    alert("Answer added (+5 points)");
  };

  // 🔹 Upvote
  const handleUpvote = async (id:any) => {
    await API.post(`/rewards/upvote/${id}`);
    fetchData();
  };

  // 🔹 Transfer Points
  const handleTransfer = async () => {
    try {
      const res = await API.post("/rewards/transfer", {
        receiverId,
        points: Number(transferPoints),
      });

      alert(res.data.message);
      fetchData();

    } catch (err: any) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔹 Profile */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h1 className="text-xl text-black font-bold">My Points</h1>
        <p className="text-2xl text-green-600">{points}</p>
      </div>

      {/* 🔹 Add Answer */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold text-black mb-2">Add Answer</h2>
        <textarea
          className="w-full border text-gray-700 p-2 mb-2"
          placeholder="Write your answer..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={handleAddAnswer}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit Answer
        </button>
      </div>

      {/* 🔹 Answers List */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold text-black mb-2">Answers</h2>

        {answers.map((ans) => (
          <div
            key={ans._id}
            className="border p-3 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <p className="text-black">{ans.content}</p>
              <p className="text-sm text-gray-500">
                Upvotes: {ans.upvotes}
              </p>
            </div>

            <button
              onClick={() => handleUpvote(ans._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Upvote
            </button>
          </div>
        ))}
      </div>

      {/* 🔹 Transfer Points */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-black  mb-2">Transfer Points</h2>

        <input
          type="text"
          placeholder="Receiver ID"
          className="border text-gray-700 p-2 w-full mb-2"
          onChange={(e) => setReceiverId(e.target.value)}
        />

        <input
          type="number"
          placeholder="Points"
          className="border text-gray-700 p-2 w-full mb-2"
          onChange={(e) => setTransferPoints(e.target.value)}
        />

        <button
          onClick={handleTransfer}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Transfer
        </button>
      </div>
    </div>
  );
}
export default RewardPage;