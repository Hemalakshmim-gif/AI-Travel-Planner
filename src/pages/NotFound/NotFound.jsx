import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "#F8FAFC",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "120px",
          marginBottom: "10px",
          color: "#2563EB",
        }}
      >
        404
      </h1>

      <h2>Oops! Page Not Found</h2>

      <p
        style={{
          color: "#64748B",
          marginTop: "10px",
        }}
      >
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        style={{
          marginTop: "30px",
          padding: "12px 28px",
          background: "#2563EB",
          color: "#fff",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;