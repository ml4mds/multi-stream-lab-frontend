import React, { useState, useEffect, useRef } from 'react';

const Body = ({ dataset, algorithm, runState, setRunState, setAlertMessage }) => {
  const [labels, setLabels] = useState([]); 
  const [images, setImages] = useState({}); 
  const [activeTab, setActiveTab] = useState(null); 
  const ws = useRef(null);

  useEffect(() => {
    if (runState) {
      ws.current = new WebSocket("ws://localhost:8889/ws");

      ws.current.onopen = () => {
        ws.current.send({
          "type": "data",
          "data": {
            "dataset": dataset,
            "algorithm": algorithm,
          }
        })
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if data.type === "data" {
            if "labels" in data.data {
              setLabels(data.data.labels);
              setActiveTab(labels[0]);
              ws.current.send({
                "type": "action",
                "data": "start"
              });
            } else if "image" in data.data {
              if labels.length === 0 {
                console.error("Receive images before labels.");
                setAlertMessage("Error: Receive images before labels.");
                ws.current.close();
              } else {
                setImages(prev => ({
                  ...prev,
                  [data.data.image.label]: `data:image/jpeg;base64,${data.data.image.content}`
                }));
              };
            } else {
              console.error("Unknown data type.");
              setAlertMessage("Error: Unknown data type.");
              ws.current.close();
            };
          } else if data.type === "action" {
            if data.data === "completion" {
              setAlertMessage("The program completed successfully.");
              ws.current.close();
            } else {
              console.error("Unknown action type.");
              setAlertMessage("Error: Unknown action type.");
              ws.current.close();
            };
          } else {
            console.error("Unknown message type.");
            setAlertMessage("Error: Unknown message type.");
            ws.current.close();
          };
        } catch (err) {
          console.error("Unknown format, cannot parse it.");
          setAlertMessage("Error: Cannot parse the message.");
          ws.current.close();
        };
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setAlertMessage("Error: WebSocket connection failed. Please try again.");
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

  return (
    <div className="body-container">
      {(labels.length > 0) ? (
        <div>
          <div className="label-container">
            {labels.map((label) => {
              (activeTab === label) ? (
                <button className="label-button-active" key={label} onClick={() => setActiveTab(label)}>{label}</button>
              ) : (
                <button className="label-button" key={label} onClick={() => setActiveTab(label)}>{label}</button>
              )
            })}
          </div>

          <div className="image-container">
            {activeTab && images[activeTab] ? (
              <img
                src={images[activeTab]}
                alt={`Performance monitor for ${activeTab}`}
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            ) : (
              <p>{`Waiting for image for ${activeTab} from server...`}</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h4>Welcome to use MultStreamLab.</h4>
          <p>Select dataset and algorithm and click the "Run" button.</p>
        </div>
      )}
    </div>
  );
};

export default Body;
