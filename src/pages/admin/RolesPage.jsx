import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const initialRoles = [
  { name: "Admin", role_request: "Full Access" },
  { name: "Editor", role_request: "Edit Content" },
  { name: "Viewer", role_request: "Read Only" },
];

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Accept role
  const handleAccept = (name) => {
    setRoles(
      roles.map((r) => (r.name === name ? { ...r, status: "Accepted" } : r))
    );
  };

  // Reject role
  const handleReject = (name) => {
    setRoles(
      roles.map((r) => (r.name === name ? { ...r, status: "Rejected" } : r))
    );
  };

  // Lọc theo tìm kiếm
  const filtered = roles.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role_request.toLowerCase().includes(search.toLowerCase())
  );

  // Phân trang
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const current = filtered.slice(start, start + pageSize);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Roles</h2>

      {/* Ô tìm kiếm */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="form-control"
        />
      </div>

      {/* Bảng roles */}
      <table className="table table-bordered table-hover text-center">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Role Request</th>
            <th>Status</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {current.map((r) => (
            <tr key={r.name}>
              <td>{r.name}</td>
              <td>{r.role_request}</td>
              <td>
                {r.status ? (
                  <span
                    className={
                      r.status === "Accepted"
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }
                  >
                    {r.status}
                  </span>
                ) : (
                  <span className="badge bg-secondary">Pending</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleAccept(r.name)}
                  disabled={r.status === "Accepted"}
                  className="btn btn-sm btn-success me-2"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(r.name)}
                  disabled={r.status === "Rejected"}
                  className="btn btn-sm btn-danger"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
          {current.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-muted py-3">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Phân trang */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {page} of {totalPages}
            </span>
          </li>
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
