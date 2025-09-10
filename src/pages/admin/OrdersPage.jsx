import React, { useMemo, useState } from "react";

// ---- OrderPage.jsx ----
// Layout quản lý Orders (dữ liệu cứng). Dùng trực tiếp trong app.
// Cách dùng nhanh:
//   import OrderPage from "./OrderPage";
//   <OrderPage />

const initialOrders = [
  { id: 101, customer: "Nguyen Van A", total: 350000, status: "PENDING", createdAt: "2025-09-05" },
  { id: 102, customer: "Tran Thi B", total: 120000, status: "COMPLETED", createdAt: "2025-09-08" },
  { id: 103, customer: "Le Van C", total: 560000, status: "CANCELLED", createdAt: "2025-09-09" },
];

export default function OrdersPage() {
  const [orders] = useState(initialOrders);
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    let data = [...orders];
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      data = data.filter(
        (o) =>
          o.customer.toLowerCase().includes(q) ||
          String(o.id).includes(q) ||
          o.status.toLowerCase().includes(q)
      );
    }
    return data;
  }, [orders, keyword]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Quản lý Orders</h1>
        <input
          placeholder="Tìm theo mã đơn / khách hàng / trạng thái"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={styles.search}
        />
      </header>

      <div style={styles.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã đơn</th>
                <th style={styles.th}>Khách hàng</th>
                <th style={styles.th}>Ngày tạo</th>
                <th style={styles.th}>Tổng tiền</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#888" }}>
                    Không có đơn hàng
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id}>
                    <td style={styles.td}>#{o.id}</td>
                    <td style={styles.td}>{o.customer}</td>
                    <td style={styles.td}>{o.createdAt}</td>
                    <td style={styles.td}>{o.total.toLocaleString()} đ</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, ...badgeColor(o.status) }}>{o.status}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={styles.ghostBtn}>Chi tiết</button>
                        <button style={styles.primaryBtn}>Sửa</button>
                        <button style={styles.dangerBtn}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function badgeColor(status) {
  switch (status) {
    case "PENDING":
      return { background: "#fef3c7", color: "#92400e" };
    case "COMPLETED":
      return { background: "#dcfce7", color: "#166534" };
    case "CANCELLED":
      return { background: "#fee2e2", color: "#991b1b" };
    default:
      return { background: "#f3f4f6", color: "#111827" };
  }
}

const styles = {
  page: { maxWidth: 1000, margin: "32px auto", padding: "0 16px", fontFamily: "Inter, system-ui, Arial" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  search: { padding: "10px 12px", border: "1px solid #d0d7de", borderRadius: 8, minWidth: 320 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { textAlign: "left", padding: "12px 14px", borderBottom: "1px solid #eee", background: "#fafafa", whiteSpace: "nowrap" },
  td: { padding: "12px 14px", borderBottom: "1px solid #f2f2f2", verticalAlign: "middle" },
  badge: { padding: "4px 8px", borderRadius: 999, fontSize: 12, fontWeight: 500 },
  primaryBtn: { padding: "6px 12px", background: "#2563eb", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" },
  ghostBtn: { padding: "6px 12px", background: "#f3f4f6", color: "#111827", border: 0, borderRadius: 6, cursor: "pointer" },
  dangerBtn: { padding: "6px 12px", background: "#ef4444", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer" },
};