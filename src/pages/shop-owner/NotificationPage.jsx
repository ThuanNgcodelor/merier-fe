import React, { useState } from 'react';
import '../../components/shop-owner/ShopOwnerLayout.css';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Đơn hàng mới',
      message: 'Bạn có đơn hàng #12345 mới từ khách hàng Nguyễn Văn A',
      time: '5 phút trước',
      isRead: false,
      icon: 'fa-shopping-cart',
      color: 'primary'
    },
    {
      id: 2,
      type: 'order',
      title: 'Đơn hàng đã được thanh toán',
      message: 'Đơn hàng #12340 đã được thanh toán thành công',
      time: '15 phút trước',
      isRead: false,
      icon: 'fa-check-circle',
      color: 'success'
    },
    {
      id: 3,
      type: 'product',
      title: 'Sản phẩm sắp hết hàng',
      message: 'Sản phẩm "Áo khoác denim" chỉ còn 5 sản phẩm trong kho',
      time: '1 giờ trước',
      isRead: true,
      icon: 'fa-exclamation-triangle',
      color: 'warning'
    },
    {
      id: 4,
      type: 'order',
      title: 'Đơn hàng đã được vận chuyển',
      message: 'Đơn hàng #12335 đã được gửi đi bởi đối tác vận chuyển',
      time: '2 giờ trước',
      isRead: true,
      icon: 'fa-truck',
      color: 'info'
    },
    {
      id: 5,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật với các tính năng mới. Vui lòng kiểm tra!',
      time: '3 giờ trước',
      isRead: true,
      icon: 'fa-bell',
      color: 'secondary'
    },
    {
      id: 6,
      type: 'product',
      title: 'Sản phẩm đã được thêm',
      message: 'Sản phẩm mới "Áo thun cổ tròn" đã được thêm vào cửa hàng',
      time: '5 giờ trước',
      isRead: true,
      icon: 'fa-plus-circle',
      color: 'success'
    },
    {
      id: 7,
      type: 'order',
      title: 'Đơn hàng bị hủy',
      message: 'Đơn hàng #12320 đã bị hủy bởi khách hàng',
      time: '1 ngày trước',
      isRead: true,
      icon: 'fa-times-circle',
      color: 'danger'
    },
    {
      id: 8,
      type: 'order',
      title: 'Đánh giá mới',
      message: 'Khách hàng đã để lại đánh giá 5 sao cho đơn hàng #12300',
      time: '1 ngày trước',
      isRead: true,
      icon: 'fa-star',
      color: 'warning'
    },
    {
      id: 9,
      type: 'product',
      title: 'Sản phẩm đã hết hàng',
      message: 'Sản phẩm "Quần jean slim" đã hết hàng',
      time: '2 ngày trước',
      isRead: true,
      icon: 'fa-box',
      color: 'danger'
    },
    {
      id: 10,
      type: 'system',
      title: 'Thanh toán được xử lý',
      message: 'Thanh toán tháng này đã được xử lý thành công',
      time: '3 ngày trước',
      isRead: true,
      icon: 'fa-money-bill',
      color: 'success'
    },
    {
      id: 11,
      type: 'order',
      title: 'Đơn hàng hoàn trả',
      message: 'Đơn hàng #12290 đã được hoàn trả',
      time: '4 ngày trước',
      isRead: true,
      icon: 'fa-undo',
      color: 'warning'
    },
    {
      id: 12,
      type: 'system',
      title: 'Thông báo bảo trì',
      message: 'Hệ thống sẽ bảo trì vào ngày mai từ 2:00 - 4:00',
      time: '5 ngày trước',
      isRead: true,
      icon: 'fa-tools',
      color: 'info'
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, order, product, system
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả thông báo?')) {
      setNotifications([]);
    }
  };

  const getTimeAgoColor = (time) => {
    if (time.includes('phút') || time.includes('giờ')) {
      return '#ee4d2d';
    }
    return '#6c757d';
  };

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
                  Chưa đọc ({notifications.filter(n => !n.isRead).length})
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
                  onClick={() => handleMarkAsRead(notification.id)}
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
                    
                    {notification.type === 'order' && (
                      <button 
                        className="btn btn-sm btn-outline-primary mt-2"
                        style={{fontSize: '12px'}}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view order detail
                          alert('Xem chi tiết đơn hàng');
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

