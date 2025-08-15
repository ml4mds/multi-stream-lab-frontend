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
  const [datasets, setDatasets] = useState([]);
  const [datasetInfo, setDatasetInfo] = useState("");
  const [datasetModalOpen, setDatasetModalOpen] = useState(false);
  const [algorithms, setAlgorithms] = useState([]);
  const [algorithmInfo, setAlgorithmInfo] = useState("");
  const [algorithmModalOpen, setAlgorithmModalOpen] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [datasetsResponse, algorithmsResponse] = await Promise.all([
          axios.get("/api/datasets"),
          axios.get("/api/algorithms")
        ]);
        
        setDatasets(datasetsResponse.data.data);
        setAlgorithms(algorithmsResponse.data.data);
      } catch (err) {
        setAlertMessage("Failed to fetch available datasets and algorithms.");
        console.error("Failed to fetch available datasets and algorithms.", err);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    setDataset(Object.keys(datasets)[0]);
    setDatasetInfo(Object.values(datasets)[0]);
  }, [datasets]);

  useEffect(() => {
    setAlgorithm(Object.keys(algorithms)[0]);
    setAlgorithmInfo(Object.values(algorithms)[0]);
  }, [algorithms]);

  return (
    <div className="header-container">
      <h1>MultiStreamLab</h1>
      <div className="panel-container">
        <div className="button-container">
          <label>
            Dataset:
            <select value={dataset} onChange={(e) => {
              setDataset(e.target.key);
              setDatasetInfo(e.target.value);
            }}>
              {Object.entries(datasets).map(([key, value]) => (
                <option key={key} value={value}>{key}</option>
              ))}
            </select>
          </label>
          <button className="info-button" onClick={() => setDatasetModalOpen(true)}>i</button>
        </div>
        <div className="button-container">
          <label>
            Algorithm:
            <select value={algorithm} onChange={(e) => {
              setAlgorithm(e.target.key);
              setAlgorithmInfo(e.target.value);
            }}>
              {Object.entries(algorithms).map(([key, value]) => (
                <option key={key} value={value}>{key}</option>
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
        <DatasetModal dataset={dataset} description={datasetInfo} setDatasetModalOpen={setDatasetModalOpen} />
      )}

      {algorithmModalOpen && (
        <AlgorithmModal algorithm={algorithm} description={algorithmInfo} setAlgorithmModalOpen={setAlgorithmModalOpen} />
      )}
    </div>
  );
};

export default Header;
