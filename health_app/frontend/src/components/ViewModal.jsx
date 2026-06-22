export default function ViewModal({ patient, onClose }) {
  const fields = [
    { label: "Full Name", value: patient.full_name },
    { label: "Date of Birth", value: patient.date_of_birth },
    { label: "Email", value: patient.email },
    { label: "Glucose", value: `${patient.glucose} mg/dL` },
    { label: "Haemoglobin", value: `${patient.haemoglobin} g/dL` },
    { label: "Cholesterol", value: `${patient.cholesterol} mg/dL` },
  ];

  const parseRemarks = (remarks) => {
    if (!remarks) return null;
    const get = (key) => {
      const match = remarks.match(new RegExp(`${key}:\\s*(.+)`));
      return match ? match[1].trim() : null;
    };
    return {
      riskScore: get("RISK_SCORE"),
      urgency: get("URGENCY"),
      diabetesRisk: get("DIABETES_RISK"),
      cardiovascularRisk: get("CARDIOVASCULAR_RISK"),
      anaemiaRisk: get("ANAEMIA_RISK"),
      trend: get("TREND"),
      diet: get("DIET"),
      summary: get("SUMMARY"),
    };
  };

  const getRiskColor = (level) => {
    if (!level) return "#666";
    const l = level.toLowerCase();
    if (l.includes("low")) return "#2e7d32";
    if (l.includes("moderate")) return "#f57c00";
    if (l.includes("high")) return "#c62828";
    return "#666";
  };

  const getUrgencyStyle = (urgency) => {
    if (!urgency) return { bg: "#f5f5f5", color: "#666", icon: "bi-circle" };
    const u = urgency.toLowerCase();
    if (u.includes("normal")) return { bg: "#e8f5e9", color: "#2e7d32", icon: "bi-check-circle-fill" };
    if (u.includes("monitor")) return { bg: "#fff8e1", color: "#f57c00", icon: "bi-exclamation-circle-fill" };
    if (u.includes("critical")) return { bg: "#ffebee", color: "#c62828", icon: "bi-x-octagon-fill" };
    return { bg: "#f5f5f5", color: "#666", icon: "bi-circle" };
  };

  const getScoreColor = (score) => {
    const s = parseInt(score);
    if (s <= 30) return "#2e7d32";
    if (s <= 60) return "#f57c00";
    return "#c62828";
  };

  const parsed = parseRemarks(patient.remarks);

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0" style={{ background: "#1a3c5e" }}>
            <h5 className="modal-title text-white fw-bold">
              <i className="bi bi-eye-fill me-2"></i>Patient Details
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>
          <div className="modal-body px-4 py-3">

            {/* Patient Info */}
            <div className="row g-3 mb-4">
              {fields.map((f) => (
                <div className="col-6 col-md-4" key={f.label}>
                  <div className="small text-muted fw-semibold text-uppercase" style={{ letterSpacing: "0.05em" }}>{f.label}</div>
                  <div className="fw-semibold" style={{ color: "#1a3c5e" }}>{f.value}</div>
                </div>
              ))}
            </div>

            {parsed ? (
              <>
                {/* Risk Score + Urgency */}
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <div className="card border-0 h-100" style={{ background: "#f8fafc" }}>
                      <div className="card-body text-center py-3">
                        <div className="small text-muted fw-semibold mb-1">RISK SCORE</div>
                        <div className="fw-bold" style={{ fontSize: "2.5rem", color: getScoreColor(parsed.riskScore) }}>
                          {parsed.riskScore}<span style={{ fontSize: "1rem" }}>/100</span>
                        </div>
                        <div className="progress mt-2" style={{ height: "8px" }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${parsed.riskScore}%`,
                              background: getScoreColor(parsed.riskScore)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card border-0 h-100" style={{ background: "#f8fafc" }}>
                      <div className="card-body text-center py-3">
                        <div className="small text-muted fw-semibold mb-1">URGENCY LEVEL</div>
                        <div
                          className="rounded-pill px-3 py-2 fw-bold mt-2 d-inline-block"
                          style={{
                            background: getUrgencyStyle(parsed.urgency).bg,
                            color: getUrgencyStyle(parsed.urgency).color,
                            fontSize: "1.1rem"
                          }}
                        >
                          <i className={`bi ${getUrgencyStyle(parsed.urgency).icon} me-1`}></i>{parsed.urgency}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disease Risks */}
                <div className="card border-0 mb-3" style={{ background: "#f8fafc" }}>
                  <div className="card-body">
                    <div className="fw-bold mb-3" style={{ color: "#1a3c5e" }}>
                      <i className="bi bi-clipboard2-pulse-fill me-2"></i>Disease Risk Assessment
                    </div>
                    {[
                      { label: "🩸 Diabetes Risk", icon: "bi-droplet-half", value: parsed.diabetesRisk },
                      { label: "🫀 Cardiovascular Risk", icon: "bi-heart-pulse", value: parsed.cardiovascularRisk },
                      { label: "💉 Anaemia Risk", icon: "bi-bandaid-fill", value: parsed.anaemiaRisk },
                    ].map((r) => {
                      const level = r.value ? r.value.split("-")[0].trim() : "";
                      const reason = r.value ? r.value.split("-").slice(1).join("-").trim() : "";
                      return (
                        <div key={r.label} className="d-flex align-items-start gap-3 mb-2">
                          <div style={{ minWidth: "170px" }} className="fw-semibold small">
                            {r.label}
                          </div>
                          <span
                            className="badge rounded-pill px-2"
                            style={{ background: getRiskColor(level) + "22", color: getRiskColor(level), minWidth: "70px", textAlign: "center" }}
                          >
                            {level}
                          </span>
                          <div className="text-muted small">{reason}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trend */}
                {parsed.trend && (
                  <div className="card border-0 mb-3" style={{ background: "#f0f7ff", border: "1px solid #cce5ff" }}>
                    <div className="card-body py-2 px-3">
                      <span className="fw-bold small" style={{ color: "#1a3c5e" }}>
                        <i className="bi bi-graph-up me-1"></i>Trend:{" "}
                      </span>
                      <span className="text-muted small">{parsed.trend}</span>
                    </div>
                  </div>
                )}

                {/* Diet */}
                {parsed.diet && (
                  <div className="card border-0 mb-3" style={{ background: "#f1f8e9" }}>
                    <div className="card-body py-2 px-3">
                      <span className="fw-bold small" style={{ color: "#2e7d32" }}>
                        <i className="bi bi-leaf-fill me-1"></i>Dietary Recommendations:{" "}
                      </span>
                      <span className="text-muted small">{parsed.diet}</span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {parsed.summary && (
                  <div className="card border-0" style={{ background: "#f0f4f8" }}>
                    <div className="card-body py-2 px-3">
                      <span className="fw-bold small" style={{ color: "#1a3c5e" }}>
                        <i className="bi bi-robot me-1"></i>AI Summary:{" "}
                      </span>
                      <span className="text-muted small">{parsed.summary}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted small fst-italic">No AI remarks available.</div>
            )}
          </div>
          <div className="modal-footer border-0 pt-0">
            <button className="btn btn-light" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}