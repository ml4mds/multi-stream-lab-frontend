import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatasetModal, AlgorithmModal } from './Modal';

const Header = ({
  dataset,
  setDataset,
  algorithm,
  setAlgorithm,
  runState,
  toggleRunState,
  setAlertMessage,
}) => {
  const [datasets, setDatasets] = useState({});
  const [datasetModalOpen, setDatasetModalOpen] = useState(false);
  const [algorithms, setAlgorithms] = useState({});
  const [algorithmModalOpen, setAlgorithmModalOpen] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/api/options");
        
        setDatasets(response.data.data.datasets);
        setAlgorithms(response.data.data.algorithms);
      } catch (err) {
        setAlertMessage("Error: Failed to fetch available datasets and algorithms.");
        console.error("Failed to fetch available datasets and algorithms.", err);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const datasetsArray = Object.keys(datasets);
    if (datasetsArray.length > 0) {
      setDataset(datasetsArray[0]);
    }
  }, [datasets]);

  useEffect(() => {
    const algorithmArray = Object.keys(algorithms);
    if (algorithmArray.length > 0) {
      setAlgorithm(algorithmArray[0]);
    }
  }, [algorithms]);

  return (
    <div className="header-container">
      <h1>MultiStreamLab</h1>
      <div className="panel-container">
        <div className="button-container">
          <label>
            Dataset:
            <select value={dataset} onChange={(e) => {
              setDataset(e.target.value);
            }}>
              {Object.keys(datasets).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </label>
          <button className="info-button" onClick={() => setDatasetModalOpen(true)}>i</button>
        </div>
        <div className="button-container">
          <label>
            Algorithm:
            <select value={algorithm} onChange={(e) => {
              setAlgorithm(e.target.value);
            }}>
              {Object.keys(algorithms).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </label>
          <button className="info-button" onClick={() => setAlgorithmModalOpen(true)}>i</button>
        </div>
        <div className="button-container">
          <button onClick={toggleRunState}>{runState? "Stop" : "Run"}</button>
        </div>
      </div>

      {datasetModalOpen && (
        <DatasetModal dataset={dataset} description={datasets[dataset]} setDatasetModalOpen={setDatasetModalOpen} />
      )}

      {algorithmModalOpen && (
        <AlgorithmModal algorithm={algorithm} description={algorithms[algorithm]} setAlgorithmModalOpen={setAlgorithmModalOpen} />
      )}
    </div>
  );
};

export default Header;
