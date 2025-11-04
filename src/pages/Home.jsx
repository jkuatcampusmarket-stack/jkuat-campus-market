import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const postsArray = [];

        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() });
        });

        setPosts(postsArray);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

  // Filter logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(search) ||
      post.description?.toLowerCase().includes(search);
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          Campus Market 🏫
        </h1>

        <div className="flex items-center gap-4">
          <p className="text-gray-600 text-sm hidden sm:block">
            Hi, {user?.email || "Guest"}
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Sticky Search and Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">All Categories</option>
            {Array.from(new Set(posts.map((p) => p.category))).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            No posts match your search or filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 border border-blue-50"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-52 w-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(post.image)}
                  />
                ) : (
                  <div className="h-52 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{post.category}</p>
                  <p className="text-blue-600 font-bold mt-2 text-lg">
                    KES {post.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="mt-3 text-sm text-gray-500 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-700">Seller:</span>{" "}
                      {post.seller}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Contact:</span>{" "}
                      {post.contact}
                    </p>
                  </div>

                  {post.contact && (
                    <div className="flex gap-3 mt-4">
                      <a
                        href={`tel:${post.contact}`}
                        className="flex-1 text-center px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        📞 Call
                      </a>
                      <a
                        href={`sms:${post.contact}`}
                        className="flex-1 text-center px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        💬 Text
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <img
              src={selectedImage}
              alt="Full view"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-white text-gray-800 px-3 py-1 rounded-md font-semibold shadow hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ✅ Floating “+ Post Item” Button */}
      {user && (
        <button
          onClick={() => navigate("/post")}
          className="group fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-5 py-4 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200"
          title="Add Post"
        >
          <span className="text-2xl leading-none">＋</span>
          <span className="hidden sm:inline text-sm font-medium">Post Item</span>

          {/* Tooltip */}
          <span className="absolute bottom-16 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            Post Item
          </span>
        </button>
      )}
    </div>
  );
}
