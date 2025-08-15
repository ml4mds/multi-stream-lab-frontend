import React, { useState } from 'react';
import Header from './Header';
import Body from './Body';

const MainPage = () => {
  const [dataset, setDataset] = useState('');
  const [algorithm, setAlgorithm] = useState('');
  const [runState, setRunState] = useState(false);
  const toggleRunState = () => {
      setRunState(!runState)
  }

  return (
    <div className="main-page-container">
      <Header
        dataset={dataset}
        setDataset={setDataset}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        runState={runState}
        toggleRunState={toggleRunState}
      />
      <Body runState={runState} toggleRunState={toggleRunState}/>
    </div>
  );
};

export default MainPage;
