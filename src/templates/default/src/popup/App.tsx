import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 从 storage 读取保存的计数
    chrome.storage.local.get(['count'], (result) => {
      if (result.count !== undefined) {
        setCount(result.count);
      }
    });
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);
    // 保存到 storage
    chrome.storage.local.set({ count: newCount });
  };

  const handleReset = () => {
    setCount(0);
    chrome.storage.local.set({ count: 0 });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>浏览器插件示例</h1>
      <div style={{ margin: '20px 0', fontSize: '24px' }}>
        计数: <strong>{count}</strong>
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={handleIncrement}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          增加
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          重置
        </button>
      </div>
    </div>
  );
};

export default App;

