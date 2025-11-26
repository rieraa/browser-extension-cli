// Background Service Worker
console.log('Background service worker loaded');

// 监听扩展安装
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // 首次安装时的初始化
    chrome.storage.local.set({ installed: true });
  }
});

// 监听来自 popup 或 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'HELLO') {
    console.log('Received message from:', sender);
    sendResponse({ success: true, message: 'Hello from background!' });
  }
  return true;
});

