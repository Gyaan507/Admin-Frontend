import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../App.css";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/department", { state: { activeMenuItem: "department" } });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-container">
        <img
            src="https://i.ibb.co/SxNcYtP/JOBRICK.png"
            alt="JobBrick Logo"
            className="logo"
            style={{
              width: '180px', 
              height: '80px', 
              objectFit: 'cover'  
            }}
          />
        </div>

        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail Address</label>
            <input
              type="email"
              id="email"
              placeholder="Your e-mail"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="********"
              required
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>

        <div className="divider">
          <span className="divider-text">Or Login With</span>
        </div>

        <div className="social-login">
  <button className="social-button">
    <a
      href="https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=581179420439-rhk5g8bo8fkp176c9gi05r731hbabddh.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fapi.niranthra.xyz%2Fusers%2Fapi%2Fusers%2Fgoogle%2Ftoken&scope=openid%20email%20profile&state=kqP5TVM05pMqi83AQYcqFqPngGTX91&nonce=D0QCEAqE8EIlmjkJsJ5v&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://w7.pngwing.com/pngs/882/225/png-transparent-google-logo-google-logo-google-search-icon-google-text-logo-business.png"
        alt="Google"
        className="social-icon"
        style={{
          borderRadius: '10px', // Optional: Border radius for the image
          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)', // Optional: Shadow below the image
        }}
      />
    </a>
  </button>

  <button className="social-button">
    <a
      href="https://www.linkedin.com/uas/login?session_redirect=%2Foauth%2Fv2%2Flogin-success%3Fapp_id%3D220398841%26auth_type%3DAC%26flow%3D%257B%2522state%2522%253A%25224QjPHPXSXKqoGbtqNiIivFVNPOWKYT%2522%252C%2522creationTime%2522%253A1734664381419%252C%2522appId%2522%253A220398841%252C%2522scope%2522%253A%2522openid%2Bprofile%2Bemail%2522%252C%2522authorizationType%2522%253A%2522OAUTH2_AUTHORIZATION_CODE%2522%252C%2522redirectUri%2522%253A%2522https%253A%252F%252Fapi.niranthra.xyz%252Fusers%252Fapi%252Fusers%252Flinkedin%252Ftoken%2522%252C%2522currentStage%2522%253A%2522LOGIN_SUCCESS%2522%252C%2522currentSubStage%2522%253A0%252C%2522authFlowName%2522%253A%2522generic-permission-list%2522%257D"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
        alt="LinkedIn"
        className="social-icon"
        style={{
          borderRadius: '10px', // Optional: Border radius for the image
          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)', // Optional: Shadow below the image
        }}
      />
    </a>
  </button>
</div>

        <div className="register-prompt">
          Don't have an account?{" "}
          <a href="/register" className="register-link">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

