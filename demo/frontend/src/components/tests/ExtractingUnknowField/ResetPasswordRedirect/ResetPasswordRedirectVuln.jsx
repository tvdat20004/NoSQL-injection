import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResetPasswordRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      navigate(
        `/test/extract-unknowfield/vulnerable/reset-password?token=${token}`
      );
    } else {
      navigate("/test/extract-unknowfield/vulnerable/forgot-password");
    }
  }, [navigate]);

  return <div className="redirect-message">Redirecting...</div>;
};

export default ResetPasswordRedirect;
