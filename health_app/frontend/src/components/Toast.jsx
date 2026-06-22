export default function Toast({ message, type }) {
  const isError = type === "error";
  return (
    <div
      className="position-fixed bottom-0 end-0 m-4 p-3 rounded shadow text-white fw-semibold d-flex align-items-center gap-2"
      style={{
        background: isError ? "#c62828" : "#2e7d32",
        zIndex: 9999,
        maxWidth: "360px",
        animation: "slideIn 0.3s ease",
      }}
    >
      <i className={`bi ${isError ? "bi-x-circle-fill" : "bi-check-circle-fill"}`}></i>
      <span className="small">{message}</span>
      <style>{`@keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
