import React from "react";
// import { useNavigate } from 'react-router-dom';

const ExtractingUnknownField = () => {
  // const navigate = useNavigate();

  return (
    <div className="testing-panel">
      <h2>Extracting Unknown Field</h2>
      <div className="button-group">
        <button
          onClick={() =>
            window.open("/test/extract-unknowfield/vulnerable", "_blank")
          }
          className="normal-test-button"
        >
          Run Vulnerable Test
        </button>
        <button
          onClick={() =>
            window.open("/test/extract-unknowfield/secure", "_blank")
          }
          className="injection-test-button"
        >
          Run Secure Test
        </button>
      </div>
    </div>
  );
};

export default ExtractingUnknownField;
