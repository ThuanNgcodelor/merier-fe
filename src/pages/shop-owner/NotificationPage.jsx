import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getNotificationsByShopId, 
  markNotificationAsRead, 
  deleteNotification,
  deleteAllShopNotifications,
  markAllShopNotificationsAsRead
} from '../../api/notification';
import '../../components/shop-owner/ShopOwnerLayout.css';

// Format notification from API to frontend format
const formatNotification = (notification) => {
  const now = new Date();
  const createdAt = new Date(notification.creationTimestamp);
  const diffMs = now - createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let timeAgo = '';
  if (diffMins < 1) {
    timeAgo = 'Vừa xong';
  } else if (diffMins < 60) {
    timeAgo = `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours} giờ trước`;
  } else {
    timeAgo = `${diffDays} ngày trước`;
  }

  let type = 'order';
  let icon = 'fa-shopping-cart';
  let color = 'primary';
  let title = 'Đơn hàng mới';

  if (notification.message) {
    if (notification.message.includes('đơn hàng mới')) {
      type = 'order';
      icon = 'fa-shopping-cart';
      color = 'primary';
      title = 'Đơn hàng mới';
    } else if (notification.message.includes('thanh toán')) {
      type = 'order';
      icon = 'fa-check-circle';
      color = 'success';
      title = 'Đơn hàng đã được thanh toán';
    } else if (notification.message.includes('vận chuyển')) {
      type = 'order';
      icon = 'fa-truck';
      color = 'info';
      title = 'Đơn hàng đã được vận chuyển';
    } else if (notification.message.includes('hủy')) {
      type = 'order';
      icon = 'fa-times-circle';
      color = 'danger';
      title = 'Đơn hàng bị hủy';
    } else if (notification.message.includes('đánh giá')) {
      type = 'order';
      icon = 'fa-star';
      color = 'warning';
      title = 'Đánh giá mới';
    } else if (notification.message.includes('hết hàng') || notification.message.includes('sắp hết hàng')) {
      type = 'product';
      icon = 'fa-exclamation-triangle';
      color = 'warning';
      title = notification.message.includes('sắp hết hàng') ? 'Sản phẩm sắp hết hàng' : 'Sản phẩm đã hết hàng';
    } else if (notification.message.includes('thêm')) {
      type = 'product';
      icon = 'fa-plus-circle';
      color = 'success';
      title = 'Sản phẩm đã được thêm';
    } else {
      type = 'system';
      icon = 'fa-bell';
      color = 'secondary';
      title = 'Thông báo hệ thống';
    }
  }

  return {
    id: notification.id,
    type,
    title,
    message: notification.message,
    time: timeAgo,
    isRead: notification.isRead,
    icon,
    color,
    orderId: notification.orderId
  };
};

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, order, product, system
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        // Backend automatically extracts userId from JWT token and queries by shopId
        // No need to pass shopId as parameter
        const data = await getNotificationsByShopId();
        const formattedNotifications = Array.isArray(data) 
          ? data.map(formatNotification)
          : [];
        setNotifications(formattedNotifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message || 'Unable to load notifications');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Refresh notifications after actions
  const refreshNotifications = async () => {
    try {
      // Backend automatically extracts userId from JWT token and queries by shopId
      const data = await getNotificationsByShopId();
      const formattedNotifications = Array.isArray(data) 
        ? data.map(formatNotification)
        : [];
      setNotifications(formattedNotifications);
    } catch (err) {
      console.error('Error refreshing notifications:', err);
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' 
      ? true 
      : filter === 'unread' 
        ? !notification.isRead 
        : notification.type === filter;

    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id, orderId) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n));
      
      // If notification has orderId, navigate to order page
      if (orderId) {
        handleViewOrder(orderId);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      alert('Không thể đánh dấu thông báo đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllShopNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      alert('Không thể đánh dấu tất cả thông báo đã đọc');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      alert('Không thể xóa thông báo');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
      return;
    }

    try {
      await deleteAllShopNotifications();
      setNotifications([]);
    } catch (err) {
      console.error('Error deleting all notifications:', err);
      alert('Không thể xóa tất cả thông báo');
    }
  };

  const handleViewOrder = (orderId) => {
    if (orderId) {
      navigate(`/shop-owner/orders/bulk-shipping?orderId=${orderId}`);
    }
  };

  const getTimeAgoColor = (time) => {
    if (time.includes('phút') || time.includes('giờ') || time === 'Vừa xong') {
      return '#ee4d2d';
    }
    return '#6c757d';
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{textAlign: 'center', padding: '60px 20px'}}>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{marginTop: '16px', color: '#666'}}>Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div style={{textAlign: 'center', padding: '60px 20px'}}>
          <i className="fas fa-exclamation-circle" style={{fontSize: '64px', color: '#dc3545', marginBottom: '16px', display: 'block'}}></i>
          <h5 style={{color: '#dc3545', marginBottom: '8px'}}>Lỗi khi tải thông báo</h5>
          <p style={{color: '#666'}}>{error}</p>
          <button className="btn btn-primary-shop" onClick={() => window.location.reload()}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1>Thông Báo</h1>
            <p className="text-muted">
              {unreadCount > 0 ? (
                <span style={{color: '#ee4d2d', fontWeight: '600'}}>
                  Bạn có {unreadCount} thông báo chưa đọc
                </span>
              ) : (
                'Tất cả thông báo đã được đọc'
              )}
            </p>
          </div>
          <div>
            {unreadCount > 0 && (
              <button 
                className="btn btn-primary-shop"
                onClick={handleMarkAllAsRead}
                style={{marginRight: '10px'}}
              >
                <i className="fas fa-check-double"></i> Đánh dấu tất cả đã đọc
              </button>
            )}
            {notifications.length > 0 && (
              <button 
                className="btn btn-outline-danger"
                onClick={handleDeleteAll}
              >
                <i className="fas fa-trash"></i> Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="card" style={{marginBottom: '20px'}}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm thông báo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{width: '100%'}}
              />
            </div>
            <div className="col-md-6">
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                <button 
                  className={`btn ${filter === 'all' ? 'btn-primary-shop' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('all')}
                >
                  Tất cả ({notifications.length})
                </button>
                <button 
                  className={`btn ${filter === 'unread' ? 'btn-primary-shop' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('unread')}
                >
                  Chưa đọc ({unreadCount})
                </button>
                <button 
                  className={`btn ${filter === 'order' ? 'btn-primary-shop' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('order')}
                >
                  Đơn hàng
                </button>
                <button 
                  className={`btn ${filter === 'product' ? 'btn-primary-shop' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('product')}
                >
                  Sản phẩm
                </button>
                <button 
                  className={`btn ${filter === 'system' ? 'btn-primary-shop' : 'btn-outline-secondary'}`}
                  onClick={() => setFilter('system')}
                >
                  Hệ thống
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        <div className="card-body" style={{padding: 0}}>
          {filteredNotifications.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 20px'}}>
              <i className="fas fa-bell-slash" style={{fontSize: '64px', color: '#ddd', marginBottom: '16px', display: 'block'}}></i>
              <h5 style={{color: '#666', marginBottom: '8px'}}>Không có thông báo</h5>
              <p style={{color: '#999'}}>Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="notification-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? '' : 'unread'}`}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: notification.isRead ? 'white' : '#f8f9ff'
                  }}
                  onClick={() => handleMarkAsRead(notification.id, notification.orderId)}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor: `var(--bs-${notification.color})`,
                      opacity: notification.isRead ? 0.6 : 1
                    }}
                  >
                    <i 
                      className={`fas ${notification.icon}`} 
                      style={{color: 'white', fontSize: '20px'}}
                    ></i>
                  </div>

                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px'}}>
                      <h6 style={{margin: 0, fontWeight: notification.isRead ? 500 : 600, color: notification.isRead ? '#333' : '#000'}}>
                        {notification.title}
                      </h6>
                      <span style={{fontSize: '12px', color: getTimeAgoColor(notification.time)}}>
                        {notification.time}
                      </span>
                    </div>
                    <p style={{margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5'}}>
                      {notification.message}
                    </p>

                    {notification.type === 'order' && notification.orderId && (
                      <button 
                        className="btn btn-sm btn-outline-primary mt-2"
                        style={{fontSize: '12px'}}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(notification.orderId);
                        }}
                      >
                        <i className="fas fa-eye"></i> Xem đơn hàng
                      </button>
                    )}
                  </div>

                  <div style={{display: 'flex', gap: '8px', flexShrink: 0}}>
                    {!notification.isRead && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#ee4d2d',
                        marginTop: '8px'
                      }}></div>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .notification-item:hover {
            background: #f5f5f5 !important;
          }

          .notification-item.unread {
            border-left: 4px solid #ee4d2d;
          }

          .btn-outline-danger:hover {
            background-color: #dc3545;
            border-color: #dc3545;
          }
        `}
      </style>
    </div>
  );
}
