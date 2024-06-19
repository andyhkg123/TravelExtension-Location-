let flashyIcon = false;

function updateIcon() {
  flashyIcon = !flashyIcon;
  const iconPath = flashyIcon ? "icon2.png" : "icon1.png";

  chrome.action.setIcon({ path: iconPath });
}

// 切換圖標，每隔一秒切換一次
setInterval(updateIcon, 1000);