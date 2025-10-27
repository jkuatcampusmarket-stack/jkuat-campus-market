// src/pages/PostItem.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

export default function PostItem() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    seller: "",
    contact: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { id: postId } = useParams(); // get post ID from URL if editing

  const categories = [
    "Clothes", "Shoes", "Electronics", "Books",
    "Accessories", "Food", "Services", "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate image preview
  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  // If editing, fetch post data
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          title: data.title || "",
          category: data.category || "",
          price: data.price || "",
          description: data.description || "",
          seller: data.seller || "",
          contact: data.contact || "",
        });
        if (data.image) setImagePreview(data.image);
      } else {
        setMessage("❌ Post not found");
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setProgress(0);

    try {
      let imageUrl = imagePreview || "";

      if (image) {
        imageUrl = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const url = `https://api.cloudinary.com/v1_1/ddb8x53xl/image/upload`;
          const formDataImage = new FormData();
          formDataImage.append("file", image);
          formDataImage.append("upload_preset", "unsigned_upload"); // Replace with your preset

          xhr.open("POST", url);

          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percent = (event.loaded / event.total) * 100;
              setProgress(percent.toFixed(0));
            }
          });

          xhr.onload = () => {
            const response = xhr.responseText;
            if (xhr.status === 200) {
              const data = JSON.parse(response);
              resolve(data.secure_url);
            } else {
              const errorData = JSON.parse(response);
              reject(new Error(errorData.error?.message || `Upload failed`));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(formDataImage);
        });
      }

      await savePost(imageUrl);
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
      setLoading(false);
    }
  };

  const savePost = async (imageUrl) => {
    const user = auth.currentUser;

    if (postId) {
      // Update existing post
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        ...formData,
        image: imageUrl,
        updatedAt: new Date(),
      });
      setMessage("✅ Post updated successfully!");
    } else {
      // Create new post
      await addDoc(collection(db, "posts"), {
        ...formData,
        image: imageUrl,
        userId: user ? user.uid : "anonymous",
        createdAt: new Date(),
      });
      setMessage("✅ Post added successfully!");
    }

    setLoading(false);
    setTimeout(() => navigate("/"), 1500); // Redirect to home
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          {postId ? "Edit Post" : "Post an Item"}
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter title"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter description"
            required
          />
        </div>

        {/* Seller */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Seller</label>
          <input
            type="text"
            name="seller"
            value={formData.seller}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter phone/email"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-600">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mt-1"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Progress */}
        {progress > 0 && (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{progress}% uploaded</p>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          {loading ? (postId ? "Updating..." : "Posting...") : (postId ? "Update Post" : "Post Item")}
        </button>

        {/* Message */}
        {message && (
          <p className={`text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
