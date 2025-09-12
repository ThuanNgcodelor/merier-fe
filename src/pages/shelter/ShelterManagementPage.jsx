import React, { useEffect, useState } from "react";
import {
  createOrGetShelterProfile,
  updateShelterProfile,
} from "../../api/shelter";
import { useForm } from "react-hook-form";

function extractErrorMessage(error, fallback) {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    if (data.detail) return data.detail;
    if (data.title) return data.title;
    try { return JSON.stringify(data); } catch { return fallback; }
  }
  return fallback;
}

export default function ShelterManagementPage() {
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shelterName: "",
      contactEmail: "",
      hotline: "",
      address: "",
      description: "",
    },
  });

  const {
    register: registerStaff,
    handleSubmit: handleSubmitStaff,
    reset: resetStaff,
    formState: { errors: staffErrors },
  } = useForm();

  const [message, setMessage] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingStaff, setSubmittingStaff] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      // HÀM NÀY trả ra .data sẵn => không cần {data:...}
      const profile = await createOrGetShelterProfile();
      resetProfile({
        shelterName: profile?.shelterName || "",
        contactEmail: profile?.contactEmail || "",
        hotline: profile?.hotline || "",
        address: profile?.address || "",
        description: profile?.description || "",
      });

      const staffList = await getStaff();
      setStaff(Array.isArray(staffList) ? staffList : []);
    } catch (e) {
      console.error(e);
      setMessage(extractErrorMessage(e, "Lỗi tải dữ liệu shelter"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const onSubmitProfile = async (form) => {
    try {
      setSubmittingProfile(true);
      await updateShelterProfile(form);
      setMessage("Cập nhật profile thành công");
      await loadData();
    } catch (e) {
      console.error(e);
      setMessage(extractErrorMessage(e, "Cập nhật profile thất bại"));
    } finally {
      setSubmittingProfile(false);
    }
  };

  const onSubmitStaff = async (data) => {
    try {
      setSubmittingStaff(true);
      await addStaff({ ...data, primary_role: "shelter_staff" });
      resetStaff();
      await loadData();
      setMessage("Thêm nhân viên thành công");
    } catch (error) {
      console.error("Error adding staff:", error);
      setMessage(extractErrorMessage(error, "Thêm nhân viên thất bại"));
    } finally {
      setSubmittingStaff(false);
    }
  };

  const updateStaffMember = async (id, updates) => {
    try {
      await updateStaff(id, updates);
      await loadData();
      setMessage("Cập nhật nhân viên thành công");
    } catch (error) {
      console.error("Error updating staff:", error);
      setMessage(extractErrorMessage(error, "Cập nhật nhân viên thất bại"));
    }
  };

  const removeStaff = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      try {
        await deleteStaff(id);
        await loadData();
        setMessage("Xoá nhân viên thành công");
      } catch (error) {
        console.error("Error deleting staff:", error);
        setMessage(extractErrorMessage(error, "Xoá nhân viên thất bại"));
      }
    }
  };

  const isActive = (val) =>
    typeof val === "boolean" ? val : String(val).toLowerCase() === "active";

  if (loading) {
    return <div className="container py-3">Đang tải...</div>;
  }

  return (
    <div className="container py-3">
      {message && (
        <div className="alert alert-info">
          {typeof message === "string" ? message : JSON.stringify(message)}
        </div>
      )}

      {/* FORM PROFILE */}
      <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="mb-4">
        <div className="mb-2">
          <label className="form-label">Shelter Name</label>
          <input
            className="form-control"
            {...registerProfile("shelterName", {
              required: "Shelter name is required",
              maxLength: { value: 100, message: "Shelter name must not exceed 100 characters" },
            })}
          />
          {errors.shelterName && <div className="text-danger">{errors.shelterName.message}</div>}
        </div>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            {...registerProfile("contactEmail", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            })}
          />
          {errors.contactEmail && <div className="text-danger">{errors.contactEmail.message}</div>}
        </div>
        <div className="mb-2">
          <label className="form-label">Hotline</label>
          <input
            className="form-control"
            {...registerProfile("hotline", { maxLength: { value: 20, message: "Hotline must not exceed 20 characters" } })}
          />
          {errors.hotline && <div className="text-danger">{errors.hotline.message}</div>}
        </div>
        <div className="mb-2">
          <label className="form-label">Địa chỉ</label>
          <input
            className="form-control"
            {...registerProfile("address", { maxLength: { value: 255, message: "Address must not exceed 255 characters" } })}
          />
          {errors.address && <div className="text-danger">{errors.address.message}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <textarea
            rows={3}
            className="form-control"
            {...registerProfile("description", { maxLength: { value: 1000, message: "Description must not exceed 1000 characters" } })}
          />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>
        <button className="btn btn-primary w-100" disabled={submittingProfile}>
          {submittingProfile ? "Đang lưu..." : "Lưu"}
        </button>
      </form>

      {/* STAFF */}
      <div className="card">
        <div className="card-header"><h5>Manage Staff</h5></div>
        <div className="card-body">
          <form onSubmit={handleSubmitStaff(onSubmitStaff)} className="mb-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input {...registerStaff("first_name", { required: "First name is required" })} className="form-control" placeholder="First Name" />
                {staffErrors.first_name && <div className="text-danger">{staffErrors.first_name.message}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input {...registerStaff("last_name", { required: "Last name is required" })} className="form-control" placeholder="Last Name" />
                {staffErrors.last_name && <div className="text-danger">{staffErrors.last_name.message}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  {...registerStaff("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } })}
                  type="email" className="form-control" placeholder="Email"
                />
                {staffErrors.email && <div className="text-danger">{staffErrors.email.message}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input {...registerStaff("phone_number")} className="form-control" placeholder="Phone Number" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submittingStaff}>
              {submittingStaff ? "Đang thêm..." : "Add Staff"}
            </button>
          </form>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th style={{ width: 220 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => {
                  const active = isActive(member.active);
                  return (
                    <tr key={member.id}>
                      <td>{member.first_name} {member.last_name}</td>
                      <td>{member.email}</td>
                      <td>{member.phone_number}</td>
                      <td>
                        <span className={`badge ${active ? "bg-success" : "bg-secondary"}`}>
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => updateStaffMember(member.id, { active: !active })}
                        >
                          {active ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeStaff(member.id)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {staff.length === 0 && (
                  <tr><td colSpan="5" className="text-center">Chưa có nhân viên</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
