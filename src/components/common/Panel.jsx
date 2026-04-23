export default function Panel({ title, children, className = "" }) {
  return (
    <section className={`panel ${className}`.trim()}>
      {title ? <h3 className="panel-title">{title}</h3> : null}
      {children}
    </section>
  );
}
