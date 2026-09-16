export default function Loading() {
  return (
    <div
      className="page-loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="page-loader" aria-hidden="true">
        <div className="page-loader-bar" />
      </div>
      <div className="page-loading-message">
        <span className="page-loading-spinner" aria-hidden="true" />
        <p>Səhifə yüklənir…</p>
      </div>
    </div>
  );
}
