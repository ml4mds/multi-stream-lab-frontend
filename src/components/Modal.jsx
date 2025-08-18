import React from 'react';

export const AlertModal = ({ alertMessage, setAlertMessage }) => {
  return (
    <div className="info-modal-outer-container">
      <div className="info-modal-inner-container">
        <div
          className={alertMessage.startsWith("Error") ? "info-modal-alert-content" : "info-modal-content"}
        >{alertMessage}</div>
        <button onClick={() => setAlertMessage(null)}>Close</button>
      </div>
    </div>
  );
};

export const DatasetModal = ({ dataset, description, setDatasetModalOpen }) => {
  return (
    <div className="info-modal-outer-container">
      <div className="info-modal-inner-container">
        <h4>{dataset}</h4>
        <div className="info-modal-content">{description || "No information available."}</div>
        <button onClick={() => setDatasetModalOpen(false)}>Close</button>
      </div>
    </div>
  );
};

export const AlgorithmModal = ({ algorithm, description, setAlgorithmModalOpen }) => {
  return (
    <div className="info-modal-outer-container">
      <div className="info-modal-inner-container">
        <h4>{algorithm}</h4>
        <div className="info-modal-content">{description || "No information available."}</div>
        <button onClick={() => setAlgorithmModalOpen(false)}>Close</button>
      </div>
    </div>
  );
};
