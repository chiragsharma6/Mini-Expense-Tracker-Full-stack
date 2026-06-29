function Hero({ user, onLogout }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Personal Finance</p>

        <h1 className="brand-title">
          EXPENDEE
        </h1>

        <p className="hero-copy">
          Spend smarter. Save better. Grow faster.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "15px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <strong>
            Welcome, {user?.name}
          </strong>

          <button
            onClick={onLogout}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;