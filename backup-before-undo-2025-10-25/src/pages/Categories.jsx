import React from "react";
import { Link } from "react-router-dom";

export default function Categories() {
  const cats = ["Electronics", "Furniture", "Clothes & Accessories", "Books & Stationery", "Miscellaneous"];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cats.map(c => (
          <Link key={c} className="border rounded p-4 bg-white hover:shadow" to="/">
            <div className="font-semibold">{c}</div>
            <div className="text-sm text-slate-500">Browse items in {c}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
