
import React from "react";  
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

interface Comment {
  user: string;
  text: string;
}

interface Post {
  _id: string;
  user: string;
  content: string;
  media: string;
  mediaType: "image" | "video";
  likes: string[];
  comments: Comment[];
}

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({});

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // 📥 Fetch Posts
  const fetchPosts = async () => {
    const res = await fetch(`${API}/posts`);
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 📤 Create Post
  const handlePost = async () => {
    if (!token) return alert("Login required");

    const formData = new FormData();
    formData.append("content", text);
    if (file) formData.append("file", file);

    const res = await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const newPost = await res.json();
    setPosts([newPost, ...posts]);
    setText("");
    setFile(null);
  };

  // ❤️ Like
  const handleLike = async (id: string) => {
    if (!token) return alert("Login required");

    const res = await fetch(`${API}/posts/like/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedPost = await res.json();

    setPosts(posts.map(p => (p._id === id ? updatedPost : p)));
  };

  // 💬 Comment
  const handleComment = async (id: string) => {
    if (!token) return alert("Login required");

    const res = await fetch(`${API}/posts/comment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentInput[id] }),
    });

    const updatedPost = await res.json();

    setPosts(posts.map(p => (p._id === id ? updatedPost : p)));
    setCommentInput({ ...commentInput, [id]: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-xl space-y-6">

        {/* 🧾 Create Post */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-3"
          />

          <button
            onClick={handlePost}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Post
          </button>
        </div>

        {/* 📱 Feed */}
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-2xl shadow overflow-hidden">

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold">{post.user}</h3>
              <p className="mt-2">{post.content}</p>
            </div>

            {/* Media */}
            {post.media && post.mediaType === "image" && (
              <img
                src={`http://localhost:5000/${post.media}`}
                className="w-full h-72 object-cover"
              />
            )}

            {post.media && post.mediaType === "video" && (
              <video controls className="w-full h-72">
                <source src={`http://localhost:5000/${post.media}`} />
              </video>
            )}

            {/* Actions */}
            <div className="p-4">
              <div className="flex gap-6">
                <button
                  onClick={() => handleLike(post._id)}
                  className="text-red-500"
                >
                  ❤️ {post.likes.length}
                </button>

                <button className="text-blue-500">🔗 Share</button>
              </div>

              {/* Comment Input */}
              <div className="mt-3">
                <input
                  placeholder="Add comment..."
                  value={commentInput[post._id] || ""}
                  onChange={(e) =>
                    setCommentInput({
                      ...commentInput,
                      [post._id]: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />

                <button
                  onClick={() => handleComment(post._id)}
                  className="mt-2 text-sm text-blue-500"
                >
                  Post Comment
                </button>

                {/* Comments */}
                <div className="mt-2 space-y-1">
                  {post.comments.map((c, i) => (
                    <p key={i} className="bg-gray-100 p-2 rounded">
                      {c.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}
export default Home;