// src/pages/Categories.jsx
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // 👈 for full-screen modal

  // ✅ Matches PostItem.jsx
  const categories = [
    "Clothes",
    "Shoes",
    "Electronics",
    "Books",
    "Accessories",
    "Food",
    "Services",
    "Furniture",
    "Other",
  ];

  // Fetch posts for the selected category
  const fetchPosts = async (category) => {
    setLoading(true);
    setPosts([]);

    try {
      const q = query(collection(db, "posts"), where("category", "==", category));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Runs when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchPosts(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
        Categories
      </h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium border transition ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Display */}
      {loading ? (
        <p className="text-center">Loading {selectedCategory}...</p>
      ) : selectedCategory ? (
        posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-40 object-cover rounded-lg mb-2 cursor-pointer"
                    onClick={() => setSelectedImage(post.image)} // 👈 click to open modal
                  />
                )}

                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-700 mt-2 text-sm line-clamp-2">
                  {post.description}
                </p>
                <p className="text-blue-600 font-bold mt-2">KES {post.price}</p>

                {/* ✅ Seller info and contact */}
                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Seller:</span>{" "}
                    {post.seller}
                  </p>
                  <p>
                    <span className="font-semibold">Contact:</span>{" "}
                    {post.contact}
                  </p>

                  {/* ✅ Call & Text buttons */}
                  {post.contact && (
                    <div className="flex gap-3 mt-2">
                      <a
                        href={`tel:${post.contact}`}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        📞 Call
                      </a>
                      <a
                        href={`sms:${post.contact}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        💬 Text
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No posts found in {selectedCategory}.
          </p>
        )
      ) : (
        <p className="text-gray-600 text-center">
          Please select a category to view posts.
        </p>
      )}

      {/* 👇 Fullscreen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
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
              Close ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
