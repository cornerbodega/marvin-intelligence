// // heartbeat.js
// export function startHeartbeat() {
//   localStorage.setItem("heartbeat", Date.now().toString());
//   localStorage.setItem("activeTabId", window.tabId);
//   window.heartbeatInterval = setInterval(() => {
//     localStorage.setItem("heartbeat", Date.now().toString());
//   }, 5000);
// }

// export function stopHeartbeat() {
//   clearInterval(window.heartbeatInterval);
// }

// export function isActiveTab() {
//   const heartbeat = localStorage.getItem("heartbeat");
//   const activeTabId = localStorage.getItem("activeTabId");
//   if (heartbeat && Date.now() - parseInt(heartbeat, 10) < 10000) {
//     return window.tabId === activeTabId;
//   }
//   return false;
// }
