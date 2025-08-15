import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { datasetModal, algorithmModal } from './Modal.jsx';

const Header = ({ dataset, setDataset, algorithm, setAlgorithm, runState, toggleRunState }) => {
  const [datasets, setDatasets] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [error, setError] = useState(null);
  const [datasetModalOpen, setDatasetModalOpen] = useState(false);
  const [algorithmModalOpen, setAlgorithmModalOpen] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [datasetsResponse, algorithmsResponse] = await Promise.all([
          axios.get('/api/datasets'),
          axios.get('/api/algorithms')
        ]);
        
        setDatasets(datasetsResponse.data.data);
        setAlgorithms(algorithmsResponse.data.data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", err);
      } finally {
        setFetched(true);
      }
    };

    fetchDropdownData();
  }, []);

  if (!fetched) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="header-container">
      <h1>MultiStreamLab</h1>
      <div className="panel-container">
        <div className="button-container">
          <label>
            Dataset:
            <select value={dataset} onChange={(e) => setDataset(e.target.value)}>
              {datasets.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <button onClick={() => setDatasetModalOpen(true)}>i</button>
        </div>
        <div className="button-container">
          <label>
            Algorithm:
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
              {algorithms.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <button onClick={() => setAlgorithmModalOpen(true)}>i</button>
        </div>
        <div className="button-container">
          <button onClick={toggleRunState}>{runState? 'Stop' : 'Run'}</button>
        </div>
      </div>

      {datasetModalOpen && (
        <datasetModal dataset={dataset} setDatasetModalOpen={setDatasetModalOpen} />
      )}

      {algorithmModalOpen && (
        <algorithmModal algorithm={algorithm} setAlgorithmModalOpen={setAlgorithmModalOpen} />
      )}
    </div>
  );
};

export default Header;
