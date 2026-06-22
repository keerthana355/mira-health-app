import { useState, useEffect } from "react";

export default function EditModal({ patient, onClose, onSubmit, submitting }) {
  const [form, setForm] = useState({ ...patient });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...patient });
  }, [patient]);

  const validate = () => {
    const errs = {};
    if (!form.full_name?.trim()) errs.full_name = "Full name is required.";
    if (!form.date_of_birth) errs.date_of_birth = "Date of birth is required.";
    else if (new Date(form.date_of_birth) > new Date()) errs.date_of_birth = "Cannot be a future date.";
    if (!form.email?.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (form.glucose === "" || isNaN(form.glucose) || Number(form.glucose) < 0) errs.glucose = "Must be a positive number.";
    if (form.haemoglobin === "" || isNaN(form.haemoglobin) || Number(form.haemoglobin) < 0) errs.haemoglobin = "Must be a positive number.";
    if (form.cholesterol === "" || isNaN(form.cholesterol) || Number(form.cholesterol) < 0) errs.cholesterol = "Must be a positive number.";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(patient.id, {
      ...form,
      glucose: parseFloat(form.glucose),
      haemoglobin: parseFloat(form.haemoglobin),
      cholesterol: parseFloat(form.cholesterol),
    });
  };

  const fields = [
    { name: "full_name", label: "Full Name", type: "text" },
    { name: "date_of_birth", label: "Date of Birth", type: "date" },
    { name: "email", label: "Email Address", type: "email" },
    { name: "glucose", label: "Glucose (mg/dL)", type: "number", step: "0.01" },
    { name: "haemoglobin", label: "Haemoglobin (g/dL)", type: "number", step: "0.01" },
    { name: "cholesterol", label: "Cholesterol (mg/dL)", type: "number", step: "0.01" },
  ];

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0" style={{ background: "#1a3c5e" }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-pencil-fill me-2"></i>Edit Patient
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <div className="modal-body px-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                {fields.map((f) => (
                  <div className="col-12 col-sm-6" key={f.name}>
                    <label className="form-label fw-semibold small text-muted">{f.label}</label>
                    <input
                      type={f.type}
                      name={f.name}
                      className={`form-control ${errors[f.name] ? "is-invalid" : ""}`}
                      value={form[f.name] ?? ""}
                      onChange={handleChange}
                      step={f.step}
                      max={f.type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                    />
                    {errors[f.name] && <div className="invalid-feedback">{errors[f.name]}</div>}
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2 mt-4">
                <button type="button" className="btn btn-light flex-fill" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn flex-fill fw-semibold text-white" style={{ background: "#1a3c5e" }} disabled={submitting}>
                  {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</> : <><i className="bi bi-floppy-fill me-2"></i>Update Patient</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
