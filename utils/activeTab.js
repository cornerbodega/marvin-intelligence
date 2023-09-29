export function startActiveTab() {
  console.log("Trying to set active tab...");
  const currentTimestamp = Date.now();
  const lastActiveTimestamp = parseInt(localStorage.getItem("activeTab"), 10);

  if (!lastActiveTimestamp || currentTimestamp - lastActiveTimestamp > 500) {
    console.log("Setting this as the ACTIVE TAB");
    localStorage.setItem("activeTab", currentTimestamp.toString());
    localStorage.setItem("activeTabId", window.tabId);
  }

  window.activeTabInterval = setInterval(() => {
    if (isActiveTab()) {
      localStorage.setItem("activeTab", Date.now().toString());
    }
  }, 5000);
}

export function stopActiveTab() {
  clearInterval(window.activeTabInterval);
}

export function isActiveTab() {
  const activeTabId = localStorage.getItem("activeTabId");
  return window.tabId === activeTabId;
}
