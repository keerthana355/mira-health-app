import { useState } from "react";

const initialForm = {
  full_name: "",
  date_of_birth: "",
  email: "",
  glucose: "",
  haemoglobin: "",
  cholesterol: "",
};

export default function PatientForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = "Full name is required.";
    if (!form.date_of_birth) errs.date_of_birth = "Date of birth is required.";
    else if (new Date(form.date_of_birth) > new Date()) errs.date_of_birth = "Date of birth cannot be in the future.";
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (form.glucose === "") errs.glucose = "Glucose is required.";
    else if (isNaN(form.glucose) || Number(form.glucose) < 0) errs.glucose = "Must be a positive number.";
    if (form.haemoglobin === "") errs.haemoglobin = "Haemoglobin is required.";
    else if (isNaN(form.haemoglobin) || Number(form.haemoglobin) < 0) errs.haemoglobin = "Must be a positive number.";
    if (form.cholesterol === "") errs.cholesterol = "Cholesterol is required.";
    else if (isNaN(form.cholesterol) || Number(form.cholesterol) < 0) errs.cholesterol = "Must be a positive number.";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const success = await onSubmit({
      ...form,
      glucose: parseFloat(form.glucose),
      haemoglobin: parseFloat(form.haemoglobin),
      cholesterol: parseFloat(form.cholesterol),
    });
    if (success) setForm(initialForm);
  };

  const fields = [
    { name: "full_name", label: "Full Name", type: "text", placeholder: "e.g. John Smith" },
    { name: "date_of_birth", label: "Date of Birth", type: "date" },
    { name: "email", label: "Email Address", type: "email", placeholder: "e.g. john@example.com" },
    { name: "glucose", label: "Glucose (mg/dL)", type: "number", placeholder: "e.g. 95", step: "0.01" },
    { name: "haemoglobin", label: "Haemoglobin (g/dL)", type: "number", placeholder: "e.g. 14.5", step: "0.01" },
    { name: "cholesterol", label: "Cholesterol (mg/dL)", type: "number", placeholder: "e.g. 180", step: "0.01" },
  ];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header border-0 pt-2 pb-2 px-4 text-center" style={{ background: "#1a3c5e" }}>
        <h5 className="fw-bold mb-0 text-white">
          <i className="bi bi-plus-circle-fill me-2"></i>Add New Patient
        </h5>
        <small className="text-white opacity-75">AI remarks auto-generated on save</small>
      </div>
      <div className="card-body px-4 py-2">
        <form onSubmit={handleSubmit} noValidate>
          {fields.map((f) => (
            <div className="mb-2" key={f.name}>
              <label className="form-label fw-semibold small text-muted text-uppercase" style={{ letterSpacing: "0.05em" }}>
                {f.label}
              </label>
              <input
                type={f.type}
                name={f.name}
                className={`form-control ${errors[f.name] ? "is-invalid" : ""}`}
                placeholder={f.placeholder || ""}
                value={form[f.name]}
                onChange={handleChange}
                step={f.step}
                max={f.type === "date" ? new Date().toISOString().split("T")[0] : undefined}
              />
              {errors[f.name] && <div className="invalid-feedback">{errors[f.name]}</div>}
            </div>
          ))}
          <button
            type="submit"
            className="btn w-100 fw-semibold mt-1"
            style={{ background: "#1a3c5e", color: "#fff" }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Generating AI Prediction...
              </>
            ) : (
              <><i className="bi bi-floppy-fill me-2"></i>Analyse & Save</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
