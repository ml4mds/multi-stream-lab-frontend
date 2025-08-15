import React, { useState, useEffect, useRef } from 'react';

const Body = ({ dataset, algorithm, runState, toggleRunState }) => {
  // State for the tabs. An empty array initially.
  const [labels, setLabels] = useState([]); 
  // State to store images, with labels as keys.
  const [images, setImages] = useState({}); 
  // State to manage which tab is currently active.
  const [activeTab, setActiveTab] = useState(null); 
  const [message, setMessage] = useState('Click "Start" to begin image generation.');
  const ws = useRef(null);

  useEffect(() => {
    if (runState) {
      ws.current = new WebSocket('ws://localhost:8889/ws');

      ws.current.onopen = () => {
        ws.current.send({
          "message_type": "start",
          "data": {
            "dataset": dataset,
            "algorithm": algorithm,
          }
        })
        setMessage('WebSocket connection established. Waiting for data...');
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Check if the message is valid
        if (
          typeof data !== 'object' || data === null ||
          !('message_type' in data) || !('data' in data)
        ) {
          console.error('Error: cannot parse the data.');
          setMessage('Connection error. Please try again.');
        } else {
          if (data.message_type == 'labels') {
            setLabels(data.data);
            if (data.data.length > 0) {
              setActiveTab(data.data[0]);
            }
            setMessage('Labels received. Images will start streaming shortly.');
          } else if (data.message_type == 'image') {
            setImages(prevImages => ({
              ...prevImages,
              [data.data.label]: `data:image/jpeg;base64,${data.data.image}`
            }));
            setMessage('Generating images...');
          } else {
            ws.current.send({
              "message_type": "start",
              "data": {
                "dataset": dataset,
                "algorithm": algorithm,
              }
            })
            setMessage('WebSocket connection established. Waiting for data...');
          };
        };
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
        setMessage('Connection error. Please try again.');
      };

      ws.current.onclose = () => {
        console.log('WebSocket connection closed.');
        setMessage('Generation stopped.');
      };

      toggleRunState();
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [runState]);

  return (
    <div style={{ flexGrow: 1, padding: '20px', textAlign: 'center' }}>
      {/* Tab headers */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        {labels.length > 0 ? (
          labels.map(label => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              style={{
                padding: '10px 20px',
                margin: '0 5px',
                cursor: 'pointer',
                backgroundColor: activeTab === label ? '#007bff' : '#f0f0f0',
                color: activeTab === label ? 'white' : 'black',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              {label}
            </button>
          ))
        ) : (
          <p>{message}</p>
        )}
      </div>

      {/* Image display area */}
      <div style={{ border: '1px solid #ccc', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {activeTab && images[activeTab] ? (
          <img
            src={images[activeTab]}
            alt={`Generated content for label: ${activeTab}`}
            style={{ maxWidth: '100%', maxHeight: '300px' }}
          />
        ) : (
          <p>{!labels.length ? message : `Waiting for image for label: ${activeTab}`}</p>
        )}
      </div>
    </div>
  );
};

export default Body;
