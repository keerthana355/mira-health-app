export default function DeleteModal({ patient, onClose, onConfirm }) {
  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content border-0 shadow">
          <div className="modal-body text-center py-4 px-4">
            <div style={{ fontSize: "3rem" }}><i className="bi bi-trash-fill text-danger"></i></div>
            <h5 className="fw-bold mt-2">Delete Patient?</h5>
            <p className="text-muted small">
              Are you sure you want to delete <strong>{patient.full_name}</strong>? This cannot be undone.
            </p>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-light flex-fill" onClick={onClose}>Cancel</button>
              <button className="btn btn-danger flex-fill fw-semibold" onClick={onConfirm}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}