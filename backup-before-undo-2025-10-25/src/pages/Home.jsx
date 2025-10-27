import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Home() {
  const [posts, setPosts] = useState([]);

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
    <div style={{ padding: "20px" }}>
      <h1>Campus Market</h1>
      {posts.length === 0 ? (
        <p>No posts yet. Add some in Firestore!</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
          {posts.map((post) => (
            <div key={post.id} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "10px" }}>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
              )}
              <h3>{post.title}</h3>
              <p><strong>Category:</strong> {post.category}</p>
              <p><strong>Price:</strong> KES {post.price}</p>
              <p>{post.description}</p>
              <p><strong>Seller:</strong> {post.seller}</p>
              <p><strong>Contact:</strong> {post.contact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
