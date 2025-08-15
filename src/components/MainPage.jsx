import React, { useState } from 'react';
import Header from './Header';
import Body from './Body';
import { AlertModal } from './Modal';

const MainPage = () => {
  const [dataset, setDataset] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [runState, setRunState] = useState(false);
  const toggleRunState = () => {
      setRunState(!runState)
  };
  const [alertMessage, setAlertMessage] = useState(null);

  return (
    <div className="main-page-container">
      <Header
        dataset={dataset}
        setDataset={setDataset}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        runState={runState}
        toggleRunState={toggleRunState}
        setAlertMessage={setAlertMessage}
      />
      <Body
        dataset={dataset}
        algorithm={algorithm}
        runState={runState}
        setRunState={setRunState}
        setAlertMessage={setAlertMessage}
      />
      {alertMessage &&(
        <AlertModal alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
      )}
    </div>
  );
};

export default MainPage;
