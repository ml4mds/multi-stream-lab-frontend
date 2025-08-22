import React, { useState, useEffect, useRef } from 'react';

const Body = ({ dataset, algorithm, runState, setRunState, setAlertMessage }) => {
  const [labels, setLabels] = useState([]); 
  const [images, setImages] = useState({}); 
  const [activeTab, setActiveTab] = useState(null); 
  const ws = useRef(null);

  useEffect(() => {
    if (runState) {
      ws.current = new WebSocket(`ws://${window.location.host}/ws`);

      ws.current.onopen = () => {
        const message = {
          type: "data",
          data: {
            dataset: dataset,
            algorithm: algorithm,
          }
        };
        ws.current.send(JSON.stringify(message));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "data") {
            if ("labels" in data.data) {
              setLabels(data.data.labels);
              const message = {
                type: "action",
                data: "start"
              };
              ws.current.send(JSON.stringify(message));
            } else if ("image" in data.data) {
              setImages(prev => ({
                ...prev,
                [data.data.image.label]: `data:image/jpeg;base64,${data.data.image.content}`
              }));
            } else {
              console.error("Unknown data type.");
              setAlertMessage("Error: Unknown data type, which is usually caused by the incompatibility between the server and the client.");
              ws.current.close();
            };
          } else if (data.type === "action") {
            if (data.data === "completion") {
              setAlertMessage("The program completed successfully.");
              ws.current.close();
            } else {
              console.error("Unknown action type.");
              setAlertMessage("Error: Unknown action type, which is usually caused by the incompatibility between the server and the client.");
              ws.current.close();
            };
          } else if (data.type === "error") {
            console.error("Receive error from the server: ", data.data);
            setAlertMessage(`Error: Receive error from the server. Refer to the following received error information:\n${data.data}`);
            ws.current.close();
          } else {
            console.error("Unknown message type.");
            setAlertMessage("Error: Unknown message type, which is usually caused by the incompatibility between the server and the client.");
            ws.current.close();
          };
        } catch (err) {
          console.error("Unknown format, cannot parse it.", err);
          setAlertMessage("Error: Cannot parse the message.");
          ws.current.close();
        };
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setAlertMessage("Error: WebSocket connection failed.");
      };

      ws.current.onclose = () => {
        setRunState(false);
      };

    } else {
      if (ws.current) {
        ws.current.close();
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [runState]);

  useEffect(() => {
    if (labels.length > 0) {
      setActiveTab(labels[0]);
    }
  }, [labels]);

  return (
    <div className="body-container">
      {(labels.length > 0) ? (
        <div>
          <div className="label-container">
            {labels.map((label) => (
              <button
                className={label === activeTab ? "label-button-active" : "label-button"}
                key={label}
                onClick={() => setActiveTab(label)}
              >{label}</button>
            ))}
          </div>

          <div className="image-container">
            {activeTab && images[activeTab] ? (
              <img
                src={images[activeTab]}
                alt={`Evaluation results for ${activeTab}`}
              />
            ) : (
              <p style={{ color: "grey" }}>"Waiting for evaluation results from server..."</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h1>Welcome to use MultStreamLab.</h1>
          <p>Select dataset and algorithm and click the "Run" button.</p>
        </div>
      )}
    </div>
  );
};

export default Body;
