// Content Script - 在网页中运行的脚本
console.log('Content script loaded');

// 示例：修改页面标题
const originalTitle = document.title;
document.title = `[Extension] ${originalTitle}`;

// 监听来自 popup 或 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_PAGE_INFO') {
    sendResponse({
      title: document.title,
      url: window.location.href,
    });
  }
  return true;
});

