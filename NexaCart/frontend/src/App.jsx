import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

function App() {
  // Registration
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const [registered, setRegistered] = useState(false);
  const [registrationCode, setRegistrationCode] = useState("");

  // Checkout
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] =
    useState("");

  // User recognition
  const [recognizedUser, setRecognizedUser] =
    useState(null);

  const [loggedInUser, setLoggedInUser] =
    useState(null);

  // Login modal
  const [showLoginModal, setShowLoginModal] =
    useState(false);

  const [loginCode, setLoginCode] = useState("");
  const [loginError, setLoginError] = useState("");

  // Messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("info");

  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);


  // ==============================
  // Email validation
  // ==============================

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };


  // ==============================
  // Registration
  // ==============================

  const registerUser = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !registerEmail) {
      showMessage(
        "Please complete all registration fields.",
        "error"
      );
      return;
    }

    if (!isValidEmail(registerEmail)) {
      showMessage(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/api/users/register`,
        {
          firstName,
          lastName,
          email: registerEmail
        }
      );

      setRegistrationCode(
        response.data.verificationCode
      );

      setRegistered(true);

      setEmail(registerEmail);

      showMessage(
        "Registration successful. Your login code is displayed below.",
        "success"
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Registration failed.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // Email recognition
  // ==============================

  useEffect(() => {
    if (!isValidEmail(email)) {
      setRecognizedUser(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${API}/api/users/recognize`,
          {
            params: { email }
          }
        );

        if (response.data.registered) {
          setRecognizedUser(response.data.user);

          if (
            !loggedInUser ||
            loggedInUser.email !== email
          ) {
            setShowLoginModal(true);
            setLoginError("");
          }
        } else {
          setRecognizedUser(null);
        }
      } catch (error) {
        console.error(
          "Recognition error:",
          error
        );
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [email]);


  // ==============================
  // Login
  // ==============================

  const loginUser = async () => {
    if (!loginCode) {
      setLoginError(
        "Please enter your verification code."
      );
      return;
    }

    try {
      setLoading(true);
      setLoginError("");

      const response = await axios.post(
        `${API}/api/users/login`,
        {
          email,
          code: loginCode
        }
      );

      setLoggedInUser(response.data.user);

      setShowLoginModal(false);

      setLoginCode("");

      showMessage(
        `Welcome back, ${response.data.user.firstName}!`,
        "success"
      );
    } catch (error) {
      setLoginError(
        error.response?.data?.message ||
          "Incorrect verification code."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // Skip login
  // ==============================

  const skipLogin = () => {
    setShowLoginModal(false);
    setLoginCode("");
    setLoginError("");

    showMessage(
      "You can continue checkout without logging in.",
      "info"
    );
  };


  // ==============================
  // Submit checkout
  // ==============================

  const submitCheckout = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      showMessage(
        "Please enter a valid email address.",
        "error"
      );
      return;
    }

    if (!phone.trim()) {
      showMessage(
        "Please enter your phone number.",
        "error"
      );
      return;
    }

    if (!shippingAddress.trim()) {
      showMessage(
        "Please enter your shipping address.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/api/checkout/submit`,
        {
          email,
          phone,
          shippingAddress,
          userId: loggedInUser?.id || null
        }
      );

      setSubmitted(true);

      showMessage(
        response.data.message,
        "success"
      );
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Unable to submit checkout.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // Message
  // ==============================

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };


  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">
          <div className="brand-mark">
            NC
          </div>

          <div>
            <h1>NexaCheckout</h1>
            <span>Simple. Secure. Personal.</span>
          </div>
        </div>

        <div className="secure">
          <span className="secure-dot"></span>
          Secure Checkout
        </div>

      </header>


      {/* MAIN */}

      <main className="container">

        <section className="hero">

          <div className="hero-text">

            <span className="eyebrow">
              WELCOME
            </span>

            <h2>
              Checkout that
              <span> remembers you.</span>
            </h2>

            <p>
              Register once and enjoy a smoother
              checkout experience whenever you return.
            </p>

            <div className="hero-points">

              <div>
                <span>01</span>
                Secure identity
              </div>

              <div>
                <span>02</span>
                Smart recognition
              </div>

              <div>
                <span>03</span>
                Fast checkout
              </div>

            </div>

          </div>


          <div className="hero-visual">

            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>

            <div className="visual-card">

              <div className="visual-icon">
                ✓
              </div>

              <strong>
                Your information
              </strong>

              <span>
                stays protected
              </span>

            </div>

          </div>

        </section>


        {/* MESSAGE */}

        {message && (
          <div className={`message ${messageType}`}>
            <span>
              {messageType === "success"
                ? "✓"
                : messageType === "error"
                ? "!"
                : "i"}
            </span>

            {message}
          </div>
        )}


        {/* REGISTRATION */}

        {!registered && (

          <section className="register-section">

            <div className="section-heading">

              <div className="number">
                01
              </div>

              <div>
                <p>FIRST TIME HERE?</p>
                <h3>Create your account</h3>
              </div>

            </div>


            <form
              className="register-form"
              onSubmit={registerUser}
            >

              <div className="input-row">

                <div className="field">
                  <label>First name</label>

                  <input
                    value={firstName}
                    onChange={(e) =>
                      setFirstName(e.target.value)
                    }
                    placeholder="Sahana"
                  />
                </div>


                <div className="field">
                  <label>Last name</label>

                  <input
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    placeholder="Karjigi"
                  />
                </div>

              </div>


              <div className="field">

                <label>Email address</label>

                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(
                      e.target.value
                    )
                  }
                  placeholder="you@example.com"
                />

              </div>


              <button
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Creating account..."
                  : "Create account →"}
              </button>

            </form>

          </section>

        )}


        {/* REGISTRATION CODE */}

        {registered && (

          <section className="code-card">

            <div className="code-icon">
              ✓
            </div>

            <div>

              <span className="code-label">
                YOUR LOGIN CODE
              </span>

              <div className="code">
                {registrationCode}
              </div>

              <p>
                Keep this 6-digit code. You'll use it
                when you return with this email.
              </p>

            </div>

          </section>

        )}


        {/* CHECKOUT */}

        <section className="checkout-section">

          <div className="section-heading">

            <div className="number">
              02
            </div>

            <div>
              <p>READY TO CONTINUE?</p>

              <h3>
                Complete your checkout
              </h3>
            </div>

          </div>


          {loggedInUser && (

            <div className="welcome-user">

              <div className="avatar">
                {loggedInUser.firstName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <span>
                  SIGNED IN AS
                </span>

                <strong>
                  {loggedInUser.firstName}{" "}
                  {loggedInUser.lastName}
                </strong>

              </div>

              <span className="verified">
                ✓ Verified
              </span>

            </div>

          )}


          <form
            className="checkout-form"
            onSubmit={submitCheckout}
          >

            <div className="field">

              <label>
                Email address
              </label>

              <div className="email-wrapper">

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                />

                {recognizedUser && (
                  <span className="recognized">
                    Registered
                  </span>
                )}

              </div>

              <small>
                We'll automatically recognize
                returning users.
              </small>

            </div>


            <div className="input-row">

              <div className="field">

                <label>
                  Phone number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+91 98765 43210"
                />

              </div>


              <div className="field">

                <label>
                  Shipping address
                </label>

                <input
                  value={shippingAddress}
                  onChange={(e) =>
                    setShippingAddress(
                      e.target.value
                    )
                  }
                  placeholder="House, street, city..."
                />

              </div>

            </div>


            <div className="checkout-bottom">

              <div className="privacy">

                <span>🔒</span>

                <p>
                  Your checkout information is
                  securely stored.
                </p>

              </div>


              <button
                className="primary-button submit-button"
                disabled={loading || submitted}
              >
                {submitted
                  ? "Checkout submitted ✓"
                  : loading
                  ? "Submitting..."
                  : "Submit checkout →"}
              </button>

            </div>

          </form>

        </section>


        {/* SUCCESS */}

        {submitted && (

          <section className="success-card">

            <div className="success-big">
              ✓
            </div>

            <h3>
              You're all set.
            </h3>

            <p>
              Your checkout information has been
              successfully recorded.
            </p>

          </section>

        )}


        <footer>
          <span>
            NexaCheckout
          </span>

          <span>
            Secure checkout experience
          </span>
        </footer>

      </main>


      {/* LOGIN MODAL */}

      {showLoginModal && recognizedUser && (

        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-button"
              onClick={skipLogin}
            >
              ×
            </button>


            <div className="modal-icon">
              👋
            </div>

            <span className="modal-label">
              WELCOME BACK
            </span>

            <h3>
              We recognize you,
              <br />
              {recognizedUser.firstName}.
            </h3>

            <p>
              Enter your 6-digit verification code
              to sign in and personalize your checkout.
            </p>


            <input
              className="login-code"
              maxLength="6"
              inputMode="numeric"
              value={loginCode}
              onChange={(e) =>
                setLoginCode(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              placeholder="000000"
            />


            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}


            <button
              className="primary-button full"
              onClick={loginUser}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify & continue →"}
            </button>


            <button
              className="skip-button"
              onClick={skipLogin}
            >
              Continue without signing in
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;