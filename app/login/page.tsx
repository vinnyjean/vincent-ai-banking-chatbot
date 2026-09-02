"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Login failed.");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-brand">
          <div className="brand-mark">V</div>

          <div>
            <div className="brand-name">VINCENT AI</div>
            <div className="brand-version">
              V4 • Banking Intelligence
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-icon">🔐</div>

          <div className="eyebrow">SECURE ACCESS</div>

          <h1>Welcome to Vincent AI V4</h1>

          <p className="subtitle">
            Banking, Finance & Customer Experience Intelligence
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username or Email</label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
            />

            <label htmlFor="password">Password</label>

            <div className="password-wrap">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />

              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <div className="login-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in securely →"}
            </button>
          </form>

          <div className="security-panel">
            <div>🛡️</div>

            <div>
              <strong>Security-first banking AI</strong>
              <p>
                Never enter your banking PIN, OTP, CVV or confidential
                banking credentials into Vincent AI.
              </p>
            </div>
          </div>

          <div className="mfa-note">
            🔑 Multi-factor authentication ready
          </div>
        </section>

        <footer>
          VINCENT AI V4 • Banking • Finance • Customer Experience •
          Fraud • Risk • Tanzania
        </footer>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: #eef4fb;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          font-family: Arial, Helvetica, sans-serif;
          color: #10233f;
        }

        .login-shell {
          width: 100%;
          max-width: 480px;
        }

        .login-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 22px;
        }

        .brand-mark {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #2879e8;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(40, 121, 232, 0.25);
        }

        .brand-name {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .brand-version {
          color: #6680a1;
          font-size: 12px;
          margin-top: 3px;
        }

        .login-card {
          background: white;
          border: 1px solid #dbe6f2;
          border-radius: 22px;
          padding: 34px;
          box-shadow: 0 20px 55px rgba(25, 55, 90, 0.12);
        }

        .login-icon {
          font-size: 30px;
          margin-bottom: 12px;
        }

        .eyebrow {
          color: #2879e8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        h1 {
          margin: 8px 0;
          font-size: 28px;
          line-height: 1.2;
        }

        .subtitle {
          margin: 0 0 28px;
          color: #6d8098;
          font-size: 14px;
          line-height: 1.5;
        }
.login-card form {
  display: block;
  padding: 0;
  border-top: 0;
  background: transparent;
}
        label {
          display: block;
          margin: 16px 0 7px;
          font-size: 13px;
          font-weight: 700;
        }

        input {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #cfdbea;
          border-radius: 10px;
          padding: 13px 14px;
          font-size: 14px;
          outline: none;
          background: #fbfdff;
        }

        input:focus {
          border-color: #2879e8;
          box-shadow: 0 0 0 3px rgba(40, 121, 232, 0.1);
        }

        .password-wrap {
          position: relative;
        }

        .password-wrap input {
          padding-right: 70px;
        }

        .show-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #2879e8;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .login-button {
          width: 100%;
          margin-top: 24px;
          border: 0;
          border-radius: 10px;
          padding: 14px;
          background: #2879e8;
          color: white;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .login-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-error {
          margin-top: 14px;
          padding: 11px 12px;
          border-radius: 9px;
          background: #fff2f2;
          border: 1px solid #f0cccc;
          color: #a52a2a;
          font-size: 13px;
        }

        .security-panel {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding: 14px;
          border-radius: 12px;
          background: #f4f8fd;
          border: 1px solid #e1eaf5;
        }

        .security-panel strong {
          font-size: 13px;
        }

        .security-panel p {
          margin: 5px 0 0;
          color: #6b7e96;
          font-size: 11px;
          line-height: 1.5;
        }

        .mfa-note {
          text-align: center;
          margin-top: 18px;
          color: #527092;
          font-size: 12px;
          font-weight: 600;
        }

        footer {
          text-align: center;
          margin-top: 18px;
          color: #7d8fa6;
          font-size: 10px;
          line-height: 1.5;
        }

        @media (max-width: 520px) {
          .login-card {
            padding: 25px 20px;
          }

          h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}
