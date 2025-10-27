import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("🗑️ Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(posts.filter((post) => post.id !== id));
      alert("✅ Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("❌ Failed to delete post.");
    }
  };

  const handleEdit = (id) => {
    // Optional — navigate to an Edit page if you create one
    navigate(`/edit/${id}`);
  };

  if (loading) return <p className="text-center mt-10">Loading your posts...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">My Posts</h2>

      {posts.length === 0 ? (
        <p className="text-gray-600 text-center">You have no posts yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 shadow-sm bg-white flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <p className="text-gray-700 mt-2">{post.description}</p>
                <p className="text-sm text-gray-500 mt-1">KES {post.price}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="bg-yellow-400 text-blue-700 px-3 py-1 rounded-md font-semibold hover:bg-yellow-300 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
