// src/pages/admin/OrdersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getAllOrders } from "../../api/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null); // normalized order

  // Utils
  const formatMoney = (n) =>
    (Number(n) || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) +
    " đ";
  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      // date + time for clarity
      return d.toLocaleString("vi-VN");
    } catch {
      return String(iso).replace("T", " ");
    }
  };

  const normalizeOrder = (o) => ({
    id: o?.id ?? "-",
    customer: o?.userId ? `User #${o.userId}` : "-",
    createdAt: o?.creationTimestamp ?? null,
    updatedAt: o?.updateTimestamp ?? null,
    total: o?.totalPrice ?? 0,
    status: o?.orderStatus ?? "PENDING",
    notes: o?.notes ?? null,
    shippingAddress: o?.shippingAddress ?? null,
    paymentMethod: o?.paymentMethod ?? null,
    items: Array.isArray(o?.orderItems) ? o.orderItems : [],
    raw: o,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllOrders();
        // data may be an array or an object with an "items" array
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
          ? data.items
          : data
          ? [data]
          : [];
        setOrders(list.filter(Boolean).map(normalizeOrder));
      } catch (e) {
        setError(
          e?.response?.data?.message || e.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        String(o.id).toLowerCase().includes(q) ||
        String(o.customer).toLowerCase().includes(q) ||
        String(o.status).toLowerCase().includes(q)
    );
  }, [orders, keyword]);

  // Modal helpers
  const onView = (o) => {
    setActive(o);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setActive(null);
  };

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onEdit = (o) => {
    console.log("Edit order:", o.raw);
    // TODO: navigate to edit page or open edit modal
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Orders Management</h1>
        <input
          placeholder="Search by order ID / customer / status"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.search}
        />
      </header>

      <div style={styles.card}>
        {loading ? (
          <div style={{ padding: 24 }}>Loading…</div>
        ) : error ? (
          <div style={{ padding: 24, color: "#b91c1c" }}>{error}</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Created At</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        padding: 24,
                        color: "#888",
                      }}
                    >
                      No orders
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o.id}>
                      <td style={styles.td}>#{o.id}</td>
                      <td style={styles.td}>{o.customer}</td>
                      <td style={styles.td}>{formatDate(o.createdAt)}</td>
                      <td style={styles.td}>{formatMoney(o.total)}</td>
                      <td style={styles.td}>
                        <span
                          style={{ ...styles.badge, ...badgeColor(o.status) }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            style={styles.ghostBtn}
                            onClick={() => onView(o)}
                          >
                            Details
                          </button>
                          <button
                            style={styles.primaryBtn}
                            onClick={() => onEdit(o)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {open && active && (
        <>
          <div style={styles.backdrop} onClick={onClose} />
          <div role="dialog" aria-modal="true" style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0 }}>Order Details</h2>
              <button
                aria-label="Close"
                style={styles.closeBtn}
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailsGrid}>
                <Detail label="Order ID" value={active.id} />
                <Detail label="Customer" value={active.customer} />
                <Detail label="Status" value={active.status} badge />
                <Detail label="Total" value={formatMoney(active.total)} />
                <Detail
                  label="Created At"
                  value={formatDate(active.createdAt)}
                />
                <Detail
                  label="Updated At"
                  value={formatDate(active.updatedAt)}
                />
                <Detail
                  label="Payment Method"
                  value={active.paymentMethod || "-"}
                />
                <Detail
                  label="Shipping Address"
                  value={active.shippingAddress || "-"}
                  full
                />
                {active.notes ? (
                  <Detail label="Notes" value={active.notes} full />
                ) : null}
              </div>

              {/* Items */}
              <h3 style={{ marginTop: 20, marginBottom: 8 }}>Items</h3>
              {active.items?.length ? (
                <div style={{ overflowX: "auto" }}>
                  <table style={styles.itemsTable}>
                    <thead>
                      <tr>
                        <th style={styles.itemsTh}>#</th>
                        <th style={styles.itemsTh}>Product</th>
                        <th style={styles.itemsTh}>Qty</th>
                        <th style={styles.itemsTh}>Price</th>
                        <th style={styles.itemsTh}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.items.map((it, idx) => {
                        const name =
                          it?.productName ||
                          it?.name ||
                          it?.productId ||
                          `Item ${idx + 1}`;
                        const qty = it?.quantity ?? it?.qty ?? 1;
                        const price = it?.price ?? it?.unitPrice ?? 0;
                        const subtotal = (qty || 0) * (price || 0);
                        return (
                          <tr key={idx}>
                            <td style={styles.itemsTd}>{idx + 1}</td>
                            <td style={styles.itemsTd}>{String(name)}</td>
                            <td style={styles.itemsTd}>{qty}</td>
                            <td style={styles.itemsTd}>{formatMoney(price)}</td>
                            <td style={styles.itemsTd}>
                              {formatMoney(subtotal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ color: "#6b7280" }}>No items</div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.ghostBtn} onClick={onClose}>
                Close
              </button>
              <button style={styles.primaryBtn} onClick={() => onEdit(active)}>
                Edit Order
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Small helper to render a labeled field (optionally as a badge, optionally full width)
function Detail({ label, value, badge = false, full = false }) {
  return (
    <div
      style={{
        ...styles.detailItem,
        ...(full ? { gridColumn: "1 / -1" } : {}),
      }}
    >
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>
        {badge ? (
          <span style={{ ...styles.badge, ...badgeColor(value) }}>{value}</span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

// Status colors
function badgeColor(status) {
  const s = String(status || "").toUpperCase();
  if (s === "PENDING" || s === "PROCESSING")
    return { background: "#fef3c7", color: "#92400e" };
  if (s === "SHIPPED") return { background: "#dbeafe", color: "#1e40af" };
  if (s === "COMPLETED" || s === "DELIVERED")
    return { background: "#dcfce7", color: "#166534" };
  if (s === "CANCELLED" || s === "FAILED")
    return { background: "#fee2e2", color: "#991b1b" };
  return { background: "#f3f4f6", color: "#111827" };
}

const styles = {
  page: {
    maxWidth: 1000,
    margin: "32px auto",
    padding: "0 16px",
    fontFamily: "Inter, system-ui, Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  search: {
    padding: "10px 12px",
    border: "1px solid #d0d7de",
    borderRadius: 8,
    minWidth: 320,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    borderBottom: "1px solid #eee",
    background: "#fafafa",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #f2f2f2",
    verticalAlign: "middle",
  },
  badge: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
  },

  // Buttons
  primaryBtn: {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: 0,
    borderRadius: 6,
    cursor: "pointer",
  },
  ghostBtn: {
    padding: "6px 12px",
    background: "#f3f4f6",
    color: "#111827",
    border: 0,
    borderRadius: 6,
    cursor: "pointer",
  },

  // Modal
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)" },
  modal: {
    position: "fixed",
    insetInline: 0,
    top: "10%",
    marginInline: "auto",
    width: "min(880px, 92vw)",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 20px 80px rgba(0,0,0,0.25)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    maxHeight: "80vh",
  },
  modalHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeBtn: {
    background: "transparent",
    border: 0,
    fontSize: 20,
    lineHeight: 1,
    cursor: "pointer",
    color: "#6b7280",
  },
  modalBody: { padding: 16, overflow: "auto" },
  modalFooter: {
    padding: 14,
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },

  // Details grid
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  detailItem: {
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: 8,
    padding: "8px 10px",
  },
  detailLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  detailValue: { fontSize: 14, color: "#111827", wordBreak: "break-word" },

  // Items table inside modal
  itemsTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  itemsTh: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid #eee",
    background: "#f9fafb",
    whiteSpace: "nowrap",
  },
  itemsTd: {
    padding: "10px 12px",
    borderBottom: "1px solid #f2f2f2",
    verticalAlign: "middle",
  },
};
