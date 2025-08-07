import React from 'react';

const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#1a202c', 
      color: 'white', 
      minHeight: '100vh',
      fontSize: '24px'
    }}>
      <h1>Test App - Working!</h1>
      <p>If you can see this, React is working correctly.</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4299e1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestApp;
