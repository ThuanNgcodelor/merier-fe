import React, { useState } from 'react';
import { createRoleRequest, getUserRoleRequests } from '../../../api/user.js';
import './RoleRequestForm.css';

export default function RoleRequestForm() {
    const [selectedRole, setSelectedRole] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [userRequests, setUserRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedRole) {
            setMessage('Vui lòng chọn role bạn muốn yêu cầu');
            setMessageType('error');
            return;
        }

        if (!reason.trim()) {
            setMessage('Vui lòng nhập lý do yêu cầu role');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            await createRoleRequest({
                role: selectedRole,
                reason: reason.trim()
            });

            setMessage('Yêu cầu role đã được gửi thành công! Admin sẽ xem xét và phản hồi sớm nhất.');
            setMessageType('success');
            
            // Reset form
            setSelectedRole('');
            setReason('');
            
            // Refresh requests list
            loadUserRequests();
            
        } catch (error) {
            console.error('Error creating role request:', error);
            setMessage('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadUserRequests = async () => {
        try {
            const requests = await getUserRoleRequests();
            setUserRequests(requests);
        } catch (error) {
            console.error('Error loading user requests:', error);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': { text: 'Đang chờ', class: 'badge-warning' },
            'APPROVED': { text: 'Đã duyệt', class: 'badge-success' },
            'REJECTED': { text: 'Từ chối', class: 'badge-danger' }
        };
        
        const statusInfo = statusMap[status] || { text: status, class: 'badge-secondary' };
        return <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>;
    };

    return (
        <div className="myaccount-content">
            <h3>Yêu cầu Role</h3>
            
            {/* Form để tạo role request */}
            <div className="account-details-form">
                <form onSubmit={handleSubmit}>
                    <div className="single-input-item">
                        <label htmlFor="role" className="required">Chọn Role bạn muốn yêu cầu</label>
                        <select 
                            id="role" 
                            value={selectedRole} 
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-control"
                        >
                            <option value="">-- Chọn Role --</option>
                            <option value="VET">Vet (Bác sĩ thú y)</option>
                            <option value="SHELTER">Shelter (Trại cứu hộ)</option>
                        </select>
                    </div>
                    
                    <div className="single-input-item">
                        <label htmlFor="reason" className="required">Lý do yêu cầu</label>
                        <textarea 
                            id="reason" 
                            value={reason} 
                            onChange={(e) => setReason(e.target.value)}
                            rows="4"
                            className="form-control"
                            placeholder="Vui lòng mô tả lý do bạn muốn có role này..."
                        />
                    </div>
                    
                    {message && (
                        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message}
                        </div>
                    )}
                    
                    <div className="single-input-item">
                        <button 
                            type="submit" 
                            className="check-btn sqr-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danh sách các yêu cầu đã gửi */}
            <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>Lịch sử yêu cầu</h4>
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                            setShowRequests(!showRequests);
                            if (!showRequests) {
                                loadUserRequests();
                            }
                        }}
                    >
                        {showRequests ? 'Ẩn' : 'Xem'} lịch sử
                    </button>
                </div>
                
                {showRequests && (
                    <div className="myaccount-table table-responsive">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th>Role yêu cầu</th>
                                    <th>Lý do</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th>Ghi chú Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">Chưa có yêu cầu nào</td>
                                    </tr>
                                ) : (
                                    userRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <strong>
                                                    {request.requestedRole === 'VET' ? 'Vet (Bác sĩ thú y)' : 
                                                     request.requestedRole === 'SHELTER' ? 'Shelter (Trại cứu hộ)' : 
                                                     request.requestedRole}
                                                </strong>
                                            </td>
                                            <td>{request.reason}</td>
                                            <td>{getStatusBadge(request.status)}</td>
                                            <td>{new Date(request.creationTimestamp).toLocaleDateString('vi-VN')}</td>
                                            <td>{request.adminNote || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
