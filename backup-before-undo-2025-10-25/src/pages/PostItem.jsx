import { useState } from "react";
import { ref, push, set } from "firebase/database";
import { db } from "../firebase";

export default function PostItem() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const itemsRef = ref(db, "items");
    const newItemRef = push(itemsRef);
    set(newItemRef, {
      title,
      price,
      description,
      createdAt: Date.now(),
    });
    alert("Item added successfully!");
    setTitle("");
    setPrice("");
    setDescription("");
  }

  return (
    <div>
      <h2>Post an Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
