import React from 'react';

export const datasetModal = ({ dataset, setDatasetModalOpen }) => {
  return (
    <div className="info-modal-outer-container">
      <div className="info-modal-inner-container">
        <h4>Dataset Information</h4>
        <p>You have selected: {dataset || 'Nothing'}</p>
        <button onClick={() => setDatasetModalOpen(false)}>x</button>
      </div>
    </div>
  );
};

export const algorithmModal = ({ algorithm, setAlgorithmModalOpen }) => {
  return (
    <div className="info-modal-outer-container">
      <div className="info-modal-inner-container">
        <h4>Algorithm Information</h4>
        <p>You have selected: {algorithm || 'Nothing'}</p>
        <button onClick={() => setAlgorithmModalOpen(false)}>x</button>
      </div>
    </div>
  );
};
