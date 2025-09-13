import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import productAdminApi from "../../../api/productAdminApi";
import categoryApi from "../../../api/categoryApi";
import ProductForm from "./ProductForm";
import ProductSearch from "./ProductSearch";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formInitial, setFormInitial] = useState({
    name: "", description: "", price: 0, originalPrice: 0, discountPercent: 0,
    stock: 0, status: "IN_STOCK", categoryId: ""
  });

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [dark, setDark] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const [p, c] = await Promise.all([productAdminApi.list(), categoryApi.getAll()]);
      setItems(p ?? []);
      setCats(c ?? []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load products");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (form, id, file) => {
    setSaving(true); setErr("");
    try {
      if (id) await productAdminApi.update({ ...form, id }, file);
      else await productAdminApi.create(form, file);
      await load();
      setEditingId(null);
      setFormInitial({ name: "", description: "", price: 0, originalPrice: 0, discountPercent: 0, stock: 0, status: "IN_STOCK", categoryId: "" });
      setShowForm(false);
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormInitial({
      name: p.name,
      description: p.description ?? "",
      price: p.price ?? 0,
      originalPrice: p.originalPrice ?? 0,
      discountPercent: p.discountPercent ?? 0,
      stock: p.stock ?? 0,
      status: p.status ?? "IN_STOCK",
      categoryId: p.categoryId || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setErr("");
    try {
      // Bước 1: Kiểm tra xem sản phẩm có liên kết với danh mục nào không
      const product = await productAdminApi.getById(id);
      if (product.categoryId) {
        // Nếu sản phẩm có liên kết với danh mục, thông báo cho người dùng và không cho phép xóa
        alert("Sản phẩm này đang liên kết với một danh mục. Vui lòng xóa danh mục trước khi xóa sản phẩm.");
        return; // Dừng quá trình xóa nếu sản phẩm có danh mục
      }

      // Bước 2: Nếu không có danh mục liên kết, tiến hành xóa sản phẩm
      await productAdminApi.remove(id);
      await load();  // Tải lại danh sách sản phẩm sau khi xóa
      alert("Sản phẩm đã được xóa thành công.");
    } catch (e) {
      setErr(e?.response?.data?.message || "Xóa thất bại");
    }
  };



  // Search + Sort + Pagination Logic
  const filtered = useMemo(() => {
    let list = items;
    if (q.trim()) {
      const k = q.toLowerCase();
      list = list.filter(p =>
        (p.name || "").toLowerCase().includes(k) ||
        (p.description || "").toLowerCase().includes(k) ||
        (p.categoryName || "").toLowerCase().includes(k)
      );
    }
    return [...list].sort((a, b) => {
      const na = (a.name || "").toLowerCase(), nb = (b.name || "").toLowerCase();
      if (na < nb) return sortOrder === "asc" ? -1 : 1;
      if (na > nb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, q, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > totalPages) setPage(1); }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));
  const money = (n) => n != null ? `$${Number(n).toLocaleString()}` : "";

  return (
    <div className={dark ? "bg-dark text-light min-vh-100" : "min-vh-100"}>
      <div className="container my-4">
        <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
          <h2 className={`m-0 ${dark ? "text-light" : "text-dark"}`}>Products</h2>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <ProductSearch value={q} onChange={(v) => { setQ(v); setPage(1); }} dark={dark} />
            <div className="d-flex align-items-center gap-2">
              <label className={`form-label m-0 ${dark ? "text-light" : "text-dark"}`}>Sort</label>
              <select
                className={`form-select form-select-sm ${dark ? "bg-dark text-light border-secondary" : ""}`}
                style={{ width: 120 }}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">A → Z</option>
                <option value="desc">Z → A</option>
              </select>
            </div>
            <div className="form-check form-switch ms-3">
              <input className="form-check-input" type="checkbox" id="themeSwitch"
                checked={dark} onChange={(e) => setDark(e.target.checked)} />
              <label className="form-check-label ms-1" htmlFor="themeSwitch">
                {dark ? "Dark" : "Light"}
              </label>
            </div>
          </div>
        </div>

        {err && <div className={`alert alert-danger ${dark ? "bg-danger-subtle text-dark" : ""}`}>{err}</div>}
        {loading && <div className={`alert alert-info ${dark ? "bg-info-subtle text-dark" : ""}`}>Loading...</div>}

        {/* Add Button */}
        <button
          className="btn btn-primary mb-3"
          onClick={() => setShowForm((prev) => !prev)} // Toggle the form visibility
        >
          {showForm ? "Close" : "Add Product"}
        </button>

        {/* Conditionally show the ProductForm */}
        {showForm && (
          <ProductForm
            initial={formInitial}
            categories={cats}
            editingId={editingId}
            onSubmit={handleSubmit}
            onCancel={() => { setEditingId(null); setFormInitial({ name: "", description: "", price: 0, originalPrice: 0, discountPercent: 0, stock: 0, status: "IN_STOCK", categoryId: "" }); setShowForm(false); }}
            submitting={saving}
            dark={dark}
          />
        )}

        {/* Product Table */}
        <div className={`card shadow-sm ${dark ? "bg-dark text-light border-secondary" : ""}`}>
          <div className="card-body p-2 p-md-3">
            <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
              <div className={dark ? "text-light" : "text-muted"}>
                Showing {pageItems.length} of {filtered.length} items
              </div>
              <div className="d-flex align-items-center gap-2">
                <label className="form-label m-0">Per page</label>
                <select className="form-select form-select-sm" style={{ width: 90 }}
                  value={pageSize} onChange={(e) => { setPageSize(+e.target.value); setPage(1); }}>
                  {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className={`table table-bordered table-hover align-middle mb-2 ${dark ? "table-dark border-secondary" : ""}`}>
                <thead className={`text-center ${dark ? "" : "table-light"}`}>
                  <tr>
                    <th style={{ minWidth: 200 }}>Name</th>
                    <th>Category</th>
                    <th>Description</th> {/* New Column */}
                    <th>Original Price</th> {/* New Column */}
                    <th>Discount (%)</th> {/* New Column */}
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th style={{ width: 220 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map(p => (
                    <tr key={p.id} className="text-center">
                      <td className="text-start">{p.name}</td>
                      <td>{p.categoryName || ""}</td>
                      <td className="text-start">{p.description || "No description"}</td> {/* New Data */}
                      <td>{money(p.originalPrice)}</td> {/* New Data */}
                      <td>{p.discountPercent}%</td> {/* New Data */}
                      <td>{money(p.price)}</td>
                      <td>{p.stock}</td>
                      <td>{p.status}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-sm btn-warning text-white" onClick={() => handleEdit(p)}>
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && !loading && (
                    <tr><td colSpan="9" className="text-center p-4 text-muted">No products</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <nav aria-label="Pagination" className="d-flex justify-content-center">
              <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button className={`page-link ${dark ? "bg-dark text-light border-secondary" : ""}`}
                    onClick={() => goTo(page - 1)} title="Previous">
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                    <button className={`page-link ${dark ? (p === page ? "bg-primary text-light border-primary" : "bg-dark text-light border-secondary") : ""}`}
                      onClick={() => goTo(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button className={`page-link ${dark ? "bg-dark text-light border-secondary" : ""}`}
                    onClick={() => goTo(page + 1)} title="Next">
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
