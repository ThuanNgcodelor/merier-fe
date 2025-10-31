import React, { useState } from 'react';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Đơn hàng của bạn đã được xác nhận',
      message: 'Đơn hàng #12345 đã được xác nhận và đang được chuẩn bị',
      time: '5 phút trước',
      isRead: false,
      icon: 'fa-check-circle',
      color: 'success'
    },
    {
      id: 2,
      type: 'order',
      title: 'Đơn hàng đã được giao',
      message: 'Đơn hàng #12340 đã được giao thành công',
      time: '2 giờ trước',
      isRead: false,
      icon: 'fa-truck',
      color: 'primary'
    },
    {
      id: 3,
      type: 'promotion',
      title: 'Ưu đãi đặc biệt',
      message: 'Giảm giá 50% cho tất cả sản phẩm thời trang trong tuần này',
      time: '1 ngày trước',
      isRead: true,
      icon: 'fa-tags',
      color: 'warning'
    },
    {
      id: 4,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Chúng tôi đã cập nhật phiên bản mới với nhiều tính năng mới',
      time: '3 ngày trước',
      isRead: true,
      icon: 'fa-info-circle',
      color: 'info'
    },
    {
      id: 5,
      type: 'order',
      title: 'Đơn hàng đã được thanh toán',
      message: 'Đơn hàng #12330 đã được thanh toán thành công',
      time: '1 tuần trước',
      isRead: true,
      icon: 'fa-credit-card',
      color: 'success'
    }
  ]);

  const [filter, setFilter] = useState('all'); // all, unread, order, promotion, system
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '2px solid #ee4d2d',
        paddingBottom: '16px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#333', fontWeight: 600 }}>
            Thông báo
          </h2>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
            Bạn có {unreadCount} thông báo chưa đọc
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && (
            <button 
              className="btn btn-sm"
              onClick={handleMarkAllAsRead}
              style={{ backgroundColor: '#ee4d2d', color: 'white', border: 'none' }}
            >
              <i className="fas fa-check-double me-1"></i>
              Đánh dấu tất cả đã đọc
            </button>
          )}
          {notifications.length > 0 && (
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={handleDeleteAll}
            >
              <i className="fas fa-trash me-1"></i>
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('all')}
          style={{ 
            backgroundColor: filter === 'all' ? '#ee4d2d' : 'white', 
            color: filter === 'all' ? 'white' : '#ee4d2d',
            border: filter === 'all' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('unread')}
          style={{ 
            backgroundColor: filter === 'unread' ? '#ee4d2d' : 'white', 
            color: filter === 'unread' ? 'white' : '#ee4d2d',
            border: filter === 'unread' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          Chưa đọc ({unreadCount})
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('order')}
          style={{ 
            backgroundColor: filter === 'order' ? '#ee4d2d' : 'white', 
            color: filter === 'order' ? 'white' : '#ee4d2d',
            border: filter === 'order' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          <i className="fas fa-shopping-cart me-1"></i>
          Đơn hàng
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('promotion')}
          style={{ 
            backgroundColor: filter === 'promotion' ? '#ee4d2d' : 'white', 
            color: filter === 'promotion' ? 'white' : '#ee4d2d',
            border: filter === 'promotion' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          <i className="fas fa-tags me-1"></i>
          Khuyến mãi
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setFilter('system')}
          style={{ 
            backgroundColor: filter === 'system' ? '#ee4d2d' : 'white', 
            color: filter === 'system' ? 'white' : '#ee4d2d',
            border: filter === 'system' ? 'none' : '1px solid #ee4d2d'
          }}
        >
          <i className="fas fa-info-circle me-1"></i>
          Hệ thống
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm thông báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <i className="fas fa-bell-slash" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
          <p style={{ color: '#999', fontSize: '16px', margin: 0 }}>
            Không có thông báo nào
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          {filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={notification.isRead ? '' : 'unread'}
              style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: notification.isRead ? 'white' : '#f8f9ff',
                borderLeft: notification.isRead ? 'none' : '4px solid #ee4d2d'
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
                  background: notification.isRead ? '#f0f0f0' : '#ffede8',
                  opacity: 1
                }}
              >
                <i 
                  className={`fas ${notification.icon}`} 
                  style={{color: notification.isRead ? '#999' : '#ee4d2d', fontSize: '20px'}}
                ></i>
              </div>
              
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h6 style={{margin: 0, marginBottom: '4px', fontWeight: notification.isRead ? 500 : 600, color: notification.isRead ? '#333' : '#000'}}>
                      {notification.title}
                    </h6>
                    <p style={{margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px'}}>
                      {notification.message}
                    </p>
                    <span style={{fontSize: '12px', color: getTimeAgoColor(notification.time)}}>
                      {notification.time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {notification.type === 'order' && !notification.isRead && (
                      <button 
                        className="btn btn-sm"
                        style={{ 
                          fontSize: '12px',
                          backgroundColor: '#ee4d2d',
                          color: 'white',
                          border: 'none'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle view order detail
                          alert('Xem chi tiết đơn hàng');
                        }}
                      >
                        <i className="fas fa-eye me-1"></i> Xem đơn
                      </button>
                    )}
                    <button 
                      className="btn btn-sm"
                      style={{ 
                        fontSize: '12px',
                        backgroundColor: 'transparent',
                        color: '#ee4d2d',
                        border: '1px solid #ee4d2d'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

