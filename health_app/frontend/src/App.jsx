import { useState, useEffect } from "react";
import PatientTable from "./components/PatientTable";
import PatientForm from "./components/PatientForm";
import EditModal from "./components/EditModal";
import DeleteModal from "./components/DeleteModal";
import ViewModal from "./components/ViewModal";
import Toast from "./components/Toast";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [deletePatient, setDeletePatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/patients/`);
      const data = await res.json();
      setPatients(data);
    } catch {
      showToast("Failed to fetch patients.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/patients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
      }
      const newPatient = await res.json();
      await fetchPatients();
      showToast("Patient added successfully with AI health prediction!");
      setViewPatient(newPatient); // Auto-open the AI report
      return true;
    } catch (e) {
      showToast(`Error: ${e.message}`, "error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/patients/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(JSON.stringify(err));
      }
      await fetchPatients();
      setEditPatient(null);
      showToast("Patient updated successfully!");
    } catch (e) {
      showToast(`Error: ${e.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/patients/${id}/`, { method: "DELETE" });
      await fetchPatients();
      setDeletePatient(null);
      showToast("Patient deleted successfully.");
    } catch {
      showToast("Failed to delete patient.", "error");
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-vh-100" style={{ background: "#f0f4f8" }}>
      {/* Navbar */}
      <nav className="navbar navbar-dark shadow-sm" style={{ background: "#1a3c5e" }}>
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold fs-4">
            <i className="bi bi-heart-pulse-fill me-2" style={{ color: "#4fc3f7" }}></i>MIRA Health Platform
          </span>
          <span className="text-light opacity-75 small">Medical Intelligence Robotic Automation</span>
        </div>
      </nav>

      <div className="container-fluid px-4 py-3">
        {/* Header */}
        <div className="row mb-3">
          <div className="col">
            <h2 className="fw-bold mb-1" style={{ color: "#1a3c5e" }}>Patient Records</h2>
            <p style={{ color: "#4a5568" }} className="mb-0">Manage patient blood test data with AI-powered health predictions</p>
          </div>
          <div className="col-auto d-flex align-items-center gap-2">
            <span className="badge rounded-pill px-3 py-2" style={{ background: "#e3f2fd", color: "#1a3c5e", fontSize: "0.85rem" }}>
              {patients.length} Total Patients
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-3">
          {/* Total Patients */}
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body py-2 px-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <i className="bi bi-people-fill" style={{ fontSize: "1.6rem", color: "#1a3c5e" }}></i>
                  <span className="fw-semibold" style={{ color: "#2c3e50", fontSize: "0.95rem" }}>Total Patients</span>
                </div>
                <div className="fw-bold" style={{ color: "#1a3c5e", fontSize: "1.8rem", lineHeight: 1.2 }}>{patients.length}</div>
              </div>
            </div>
          </div>
          {/* Reference Range Cards */}
          {[
            { label: "Glucose", icon: "bi-activity", color: "#e53935", normal: "70 – 100 mg/dL", note: "Normal fasting blood sugar level" },
            { label: "Haemoglobin", icon: "bi-droplet-fill", color: "#e67e22", normal: "12 – 17.5 g/dL", note: "Men: 13.5–17.5 · Women: 12–15.5 g/dL" },
            { label: "Cholesterol", icon: "bi-heart-pulse-fill", color: "#8e44ad", normal: "< 200 mg/dL", note: "Desirable total cholesterol level" },
          ].map((stat) => (
            <div className="col-6 col-md-3" key={stat.label}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body py-2 px-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i className={`bi ${stat.icon}`} style={{ fontSize: "1.6rem", color: stat.color }}></i>
                    <span className="fw-semibold" style={{ color: "#2c3e50", fontSize: "0.95rem" }}>{stat.label}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px", color: "#7f8c8d" }}>Healthy Range</div>
                  <div className="fw-bold" style={{ color: stat.color, fontSize: "1.15rem" }}>{stat.normal}</div>
                  <div style={{ fontSize: "0.8rem", marginTop: "3px", color: "#555e6e" }}>{stat.note}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Add Patient Form */}
          <div className="col-12 col-lg-4">
            <PatientForm onSubmit={handleCreate} submitting={submitting} />
          </div>

          {/* Table */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-2 px-3">
                <div className="d-flex flex-column gap-2">
                  <h5 className="fw-bold mb-0" style={{ color: "#1a3c5e" }}>All Patients</h5>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <PatientTable
                  patients={filteredPatients}
                  loading={loading}
                  onEdit={setEditPatient}
                  onDelete={setDeletePatient}
                  onView={setViewPatient}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {editPatient && (
        <EditModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSubmit={handleUpdate}
          submitting={submitting}
        />
      )}
      {deletePatient && (
        <DeleteModal
          patient={deletePatient}
          onClose={() => setDeletePatient(null)}
          onConfirm={() => handleDelete(deletePatient.id)}
        />
      )}
      {viewPatient && (
        <ViewModal patient={viewPatient} onClose={() => setViewPatient(null)} />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
