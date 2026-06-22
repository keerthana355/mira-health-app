export default function PatientTable({ patients, loading, onEdit, onDelete, onView }) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: "#1a3c5e" }} />
        <p className="text-muted mt-2 small">Loading patients...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <div style={{ fontSize: "3rem" }}><i className="bi bi-hospital-fill" style={{ color: "#1a3c5e", opacity: 0.4 }}></i></div>
        <p className="mt-2">No patients found. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead style={{ background: "#f8fafc" }}>
          <tr>
            <th className="ps-4 py-2 text-muted small text-uppercase fw-semibold border-0">Patient</th>
            <th className="py-2 text-muted small text-uppercase fw-semibold border-0">DOB</th>
            <th className="py-2 text-muted small text-uppercase fw-semibold border-0">Glucose</th>
            <th className="py-2 text-muted small text-uppercase fw-semibold border-0">Hgb</th>
            <th className="py-2 text-muted small text-uppercase fw-semibold border-0">Chol</th>
            <th className="py-2 text-muted small text-uppercase fw-semibold border-0">AI Remarks</th>
            <th className="py-2 text-muted small text-uppercase fw-semibold border-0 pe-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="ps-4">
                <div className="fw-semibold" style={{ color: "#1a3c5e" }}>{p.full_name}</div>
                <div className="text-muted small">{p.email}</div>
              </td>
              <td className="text-muted small">{p.date_of_birth}</td>
              <td>
                <BloodBadge value={p.glucose} low={70} high={100} unit="mg/dL" />
              </td>
              <td>
                <BloodBadge value={p.haemoglobin} low={12} high={17} unit="g/dL" />
              </td>
              <td>
                <BloodBadge value={p.cholesterol} low={0} high={200} unit="mg/dL" />
              </td>
              <td style={{ maxWidth: "200px" }}>
                {p.remarks ? (
                  <span
                    className="text-muted small"
                    style={{ cursor: "pointer", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                    onClick={() => onView(p)}
                    title="Click to view full remarks"
                  >
                    <i className="bi bi-robot me-1"></i>{p.remarks}
                  </span>
                ) : (
                  <span className="text-muted small fst-italic">No remarks</span>
                )}
              </td>
              <td className="pe-4">
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-outline-info" onClick={() => onView(p)} title="View">
                    <i className="bi bi-eye-fill"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(p)} title="Edit">
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(p)} title="Delete">
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BloodBadge({ value, low, high, unit }) {
  let color = "#2e7d32", bg = "#e8f5e9", label = "Normal";
  if (value < low) { color = "#1565c0"; bg = "#e3f2fd"; label = "Low"; }
  else if (value > high) { color = "#c62828"; bg = "#ffebee"; label = "High"; }
  return (
    <span className="badge rounded-pill px-2 py-1" style={{ background: bg, color, fontSize: "0.75rem" }}>
      {value} <span className="fw-normal opacity-75">{unit}</span>
    </span>
  );
}
