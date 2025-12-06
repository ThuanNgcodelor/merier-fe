import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrdersByUser } from "../../../api/order.js";

const PAGE_SIZE = 5;

const STATUS_CONFIG = {
  ALL: { label: "Tất cả", color: "#555", bg: "#f8f8f8" },
  PENDING: { label: "Chờ xác nhận", color: "#ee4d2d", bg: "#fff5f0" },
  APPROVED: { label: "Vận chuyển", color: "#2673dd", bg: "#e8f4ff" },
  COMPLETED: { label: "Hoàn thành", color: "#26aa99", bg: "#e8f9f7" },
  CANCELLED: { label: "Đã hủy", color: "#999", bg: "#f5f5f5" },
  REJECTED: { label: "Trả hàng/Hoàn tiền", color: "#ee4d2d", bg: "#fff5f0" }
};

const formatVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

const fmtDateTime = (iso) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("vi-VN");
  } catch {
    return "-";
  }
};

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getOrdersByUser();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Không thể tải đơn hàng. Vui lòng thử lại.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Auto expand order from URL
  useEffect(() => {
    const orderIdFromUrl = searchParams.get('orderId');
    if (orderIdFromUrl && orders.length > 0) {
      setTimeout(() => {
        const element = document.querySelector(`[data-order-id="${orderIdFromUrl}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [searchParams, orders]);

  // Filter orders by tab and search
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status tab
    if (activeTab !== "ALL") {
      result = result.filter(order => order.orderStatus === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(order =>
        order.id?.toLowerCase().includes(query) ||
        order.orderItems?.some(item =>
          item.productName?.toLowerCase().includes(query)
        )
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredOrders, page]
  );

  const pageNumbers = getPageNumbers(page, totalPages);

  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    return (
      <span
        style={{
          color: config.color,
          background: config.bg,
          padding: '4px 12px',
          borderRadius: '2px',
          fontSize: '13px',
          fontWeight: 500,
          textTransform: 'uppercase'
        }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="tab-pane fade show active">
      <div className="myaccount-content">
        {/* Status Tabs */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #E8ECEF',
          marginBottom: '20px',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div className="d-flex" style={{ overflowX: 'auto' }}>
            {Object.keys(STATUS_CONFIG).map(status => (
              <button
                key={status}
                onClick={() => {
                  setActiveTab(status);
                  setPage(1);
                }}
                style={{
                  flex: '1',
                  minWidth: '120px',
                  padding: '16px 12px',
                  border: 'none',
                  background: 'transparent',
                  color: activeTab === status ? '#EE4D2D' : '#555',
                  borderBottom: activeTab === status ? '2px solid #EE4D2D' : '2px solid transparent',
                  fontWeight: activeTab === status ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
              >
                {STATUS_CONFIG[status].label}
              </button>
            ))}
          </div>
        </div>


        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center py-5">
            <img
              src="/assets/images/no-orders.png"
              alt="No orders"
              style={{ maxWidth: '100px', opacity: 0.5, marginBottom: '16px' }}
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <p style={{ color: '#999', fontSize: '14px' }}>
              {searchQuery ? 'Không tìm thấy đơn hàng phù hợp' : 'Chưa có đơn hàng'}
            </p>
          </div>
        )}

        {!loading && !error && pagedOrders.length > 0 && (
          <>
            {/* Order Cards */}
            <div className="order-list">
              {pagedOrders.map((order) => (
                <div
                  key={order.id}
                  data-order-id={order.id}
                  style={{
                    background: 'white',
                    border: '1px solid #E8ECEF',
                    borderRadius: '4px',
                    marginBottom: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Header */}
                  <div
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{
                      borderBottom: '1px solid #F5F5F5',
                      background: '#FAFAFA'
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span
                        style={{
                          background: '#EE4D2D',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        HOT
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#222' }}>
                        MERIER STORE
                      </span>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: 'transparent',
                          border: '1px solid #EE4D2D',
                          color: '#EE4D2D',
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '2px'
                        }}
                      >
                        <i className="fa fa-comment me-1"></i> Chat
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{
                          background: 'transparent',
                          border: '1px solid #E8ECEF',
                          color: '#555',
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '2px'
                        }}
                      >
                        <i className="fa fa-store me-1"></i> Xem Shop
                      </button>
                    </div>
                    <div className="text-end">
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-3">
                    {(order.orderItems || []).map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="d-flex gap-3 mb-3 pb-3"
                        style={{
                          borderBottom: idx < order.orderItems.length - 1 ? '1px solid #F5F5F5' : 'none'
                        }}
                      >
                        {/* Product Image */}
                        <div
                          style={{
                            width: '80px',
                            height: '80px',
                            border: '1px solid #E8ECEF',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#F5F5F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="fa fa-image" style={{ fontSize: '24px', color: '#CCC' }}></i>
                        </div>

                        {/* Product Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', color: '#222', marginBottom: '4px' }}>
                            {item.productName}
                          </div>
                          {item.sizeName && (
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                              Phân loại hàng: {item.sizeName}
                            </div>
                          )}
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            x{item.quantity}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-end" style={{ minWidth: '100px' }}>
                          <div style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through', marginBottom: '4px' }}>
                            {formatVND(item.unitPrice * 1.2)}
                          </div>
                          <div style={{ fontSize: '14px', color: '#EE4D2D', fontWeight: 500 }}>
                            {formatVND(item.unitPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{
                      borderTop: '1px solid #F5F5F5',
                      background: '#FFFAF5'
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#555' }}>
                      <i className="fa fa-calendar me-1"></i> {fmtDateTime(order.updateTimestamp)}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-end">
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                          Thành tiền:
                        </div>
                        <div style={{ fontSize: '18px', color: '#EE4D2D', fontWeight: 500 }}>
                          {formatVND(order.totalPrice)}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        {order.orderStatus === 'COMPLETED' && (
                          <button
                            className="btn"
                            style={{
                              background: '#EE4D2D',
                              color: 'white',
                              border: 'none',
                              padding: '8px 20px',
                              fontSize: '13px',
                              borderRadius: '2px',
                              fontWeight: 500
                            }}
                          >
                            Mua Lại
                          </button>
                        )}
                        {order.orderStatus === 'PENDING' && (
                          <button
                            className="btn"
                            style={{
                              background: 'white',
                              color: '#555',
                              border: '1px solid #E8ECEF',
                              padding: '8px 20px',
                              fontSize: '13px',
                              borderRadius: '2px'
                            }}
                          >
                            Liên Hệ Người Bán
                          </button>
                        )}
                        <button
                          className="btn"
                          onClick={() => navigate(`/information/orders?orderId=${order.id}`)}
                          style={{
                            background: 'white',
                            color: '#555',
                            border: '1px solid #E8ECEF',
                            padding: '8px 20px',
                            fontSize: '13px',
                            borderRadius: '2px'
                          }}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      style={{
                        border: '1px solid #E8ECEF',
                        color: '#555',
                        borderRadius: '2px 0 0 2px'
                      }}
                    >
                      ‹
                    </button>
                  </li>

                  {pageNumbers.map((p, i) =>
                    p === "…" ? (
                      <li key={`el-${i}`} className="page-item disabled">
                        <span className="page-link" style={{ border: '1px solid #E8ECEF', color: '#999' }}>…</span>
                      </li>
                    ) : (
                      <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(p)}
                          style={{
                            border: '1px solid #E8ECEF',
                            color: p === page ? 'white' : '#555',
                            background: p === page ? '#EE4D2D' : 'white'
                          }}
                        >
                          {p}
                        </button>
                      </li>
                    )
                  )}

                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      style={{
                        border: '1px solid #E8ECEF',
                        color: '#555',
                        borderRadius: '0 2px 2px 0'
                      }}
                    >
                      ›
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
