// src/pages/PostItem.jsx
import React, { useState } from "react";
import { db, storage, auth } from "../firebase"; // ✅ added auth here
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ UPDATED handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Check if user is logged in
      const user = auth.currentUser;
      if (!user) {
        setMessage("⚠️ You must be logged in to post an item.");
        setLoading(false);
        return;
      }

      // ✅ Upload image if any
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}-${Date.now()}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // ✅ Add post data + link to user
      await addDoc(collection(db, "posts"), {
        ...formData,
        image: imageUrl,
        userId: user.uid,        // 🔗 Link post to the user
        createdAt: new Date(),   // 🕒 Add timestamp
      });

      setMessage("✅ Post added successfully!");
      setFormData({
        title: "",
        category: "",
        price: "",
        description: "",
        seller: "",
        contact: "",
      });
      setImage(null);
    } catch (err) {
      console.error("Error adding post:", err);
      setMessage("❌ Error adding post");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        overflowY: "auto",
      }}
    >
      <h2>Post an Item</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (KES)"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
        ></textarea>
        <input
          type="text"
          name="seller"
          placeholder="Your Name"
          value={formData.seller}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Info"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Posting..." : "Post Item"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
