export const PageWrapper = ({
  alerts,
  header,
  footer,
  content,
  modals,
  config,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          backgroundImage: `url("${config.bg}")`,
          filter: "blur(8px)",
          height: "100vh",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      {alerts}
      {header}
      {content}
      {footer}
      {modals}
    </div>
  );
};
