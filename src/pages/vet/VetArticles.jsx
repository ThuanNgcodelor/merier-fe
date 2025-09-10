import React, { useEffect, useState } from "react";
import { getVetArticles,  } from "../../api/vetMock.js";

export default function VetArticles() {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getVetArticles().then(data => setArticles(data));
  }, []);



  return (
    <div className="container py-4">
      <h2>Vet Articles</h2>

      {/* Toggle Create Form */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "➕ Create New Article"}
      </button>

      {/* Article Form */}
      {showForm && (
        <form  className="card p-3 mb-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="4"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </form>
      )}

      {/* Article List */}
      <div className="list-group">
        {articles.map((a) => (
          <div key={a.id} className="list-group-item">
            <h5>{a.title}</h5>
            <small className="text-muted">Published: {a.date}</small>
            <p className="mt-2">{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
