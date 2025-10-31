import React, { useEffect, useMemo, useState } from "react";
import { getOrdersByUser } from "../../../api/order.js";

const PAGE_SIZE = 5;

const STATUS_MAP = {
  PENDING: { label: "Pending", cls: "badge badge-warning" },
  APPROVED: { label: "Approved", cls: "badge badge-success" },
  REJECTED: { label: "Rejected", cls: "badge badge-danger" },
  CANCELLED: { label: "Cancelled", cls: "badge badge-secondary" },
  COMPLETED: { label: "Completed", cls: "badge badge-primary" },
};

const formatVND = (n) =>
  (Number(n) || 0).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " VND";

const fmtDateTime = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("en-US");
  } catch {
    return "-";
  }
};

// Build compact page list with ellipsis
function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total, total - 1, current, current - 1, current + 1]);
  const arr = Array.from(pages).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withEllipsis = [];
  for (let i = 0; i < arr.length; i++) {
    withEllipsis.push(arr[i]);
    if (i < arr.length - 1 && arr[i + 1] - arr[i] > 1) withEllipsis.push("…");
  }
  return withEllipsis;
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrdersByUser();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load your orders. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));

  useEffect(() => {
    setExpandedOrderId(null);
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedOrders = useMemo(
    () => orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [orders, page]
  );

  const handleView = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="tab-pane fade show active">
      <div className="myaccount-content">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="mb-0">My Orders</h3>
          <span className="text-muted small">
            Total orders: <b>{orders.length}</b>
          </span>
        </div>

        {loading && <div className="alert alert-info">Loading your orders…</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="alert alert-secondary">You don’t have any orders yet.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="myaccount-table table-responsive text-center">
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: 80 }}>#</th>
                  <th>Last Updated</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th style={{ width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pagedOrders.map((order, idx) => {
                  const statusInfo =
                    STATUS_MAP[order.orderStatus] || {
                      label: order.orderStatus || "Unknown",
                      cls: "badge badge-secondary",
                    };
                  const rowIndex = (page - 1) * PAGE_SIZE + idx + 1;

                  return (
                    <React.Fragment key={order.id}>
                      <tr>
                        <td>{rowIndex}</td>
                        <td>{fmtDateTime(order.updateTimestamp)}</td>
                        <td>
                          <span className={statusInfo.cls}>{statusInfo.label}</span>
                        </td>
                        <td>{formatVND(order.totalPrice)}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => handleView(order.id)}
                          >
                            {expandedOrderId === order.id ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {expandedOrderId === order.id && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "left" }}>
                            <div className="p-3" style={{ background: "#fafafa", borderRadius: 8 }}>
                              <h6 className="mb-3">Order Items</h6>
                              <div className="table-responsive">
                                <table className="table table-sm mb-0">
                                  <thead>
                                    <tr>
                                      <th style={{ width: 60 }}>#</th>
                                      <th>Product</th>
                                      <th className="text-center" style={{ width: 100 }}>
                                        Size
                                      </th>
                                      <th className="text-center" style={{ width: 100 }}>
                                        Qty
                                      </th>
                                      <th className="text-right" style={{ width: 140 }}>
                                        Unit Price
                                      </th>
                                      <th className="text-right" style={{ width: 160 }}>
                                        Total
                                      </th>
                                      <th style={{ width: 200 }}>Created At</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(order.orderItems || []).map((item, i) => (
                                      <tr key={item.id}>
                                        <td style={{ backgroundColor: "transparent" }}>{i + 1}</td>
                                        <td>
                                          <div>
                                            <span className="text-monospace">{item.productName}</span>
                                          </div>
                                        </td>
                                        <td className="text-center">
                                          {item.sizeName ? (
                                            <span className="badge badge-secondary">{item.sizeName}</span>
                                          ) : (
                                            <span className="text-muted">-</span>
                                          )}
                                        </td>
                                        <td className="text-center">{item.quantity}</td>
                                        <td className="text-right">{formatVND(item.unitPrice)}</td>
                                        <td className="text-right">{formatVND(item.totalPrice)}</td>
                                        <td>{fmtDateTime(item.creationTimestamp)}</td>
                                      </tr>
                                    ))}
                                    {(!order.orderItems || order.orderItems.length === 0) && (
                                      <tr>
                                        <td colSpan={7} className="text-center">
                                          No items found in this order.
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <nav aria-label="Order pagination">
              <ul className="pagination pagination-sm justify-content-center">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous"
                  >
                    «
                  </button>
                </li>

                {pageNumbers.map((p, i) =>
                  p === "…" ? (
                    <li key={`el-${i}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>
                        {p}
                      </button>
                    </li>
                  )
                )}

                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next"
                  >
                    »
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
