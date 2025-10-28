import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // 👈 for modal

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Campus Market 🏫
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">
            No posts yet. Add some in Firestore!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-48 w-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(post.image)} // 👈 click to open modal
                  />
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">{post.category}</p>
                  <p className="text-blue-600 font-bold mt-1">
                    KES {post.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="mt-3 text-sm text-gray-500">
                    <p>
                      <span className="font-semibold">Seller:</span>{" "}
                      {post.seller}
                    </p>

                    <p>
                      <span className="font-semibold">Contact:</span>{" "}
                      {post.contact}
                    </p>

                    {/* ✅ Call & Text Buttons */}
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
              </div>
            ))}
          </div>
        )}
      </div>

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
