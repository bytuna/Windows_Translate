// Eklenti yüklendiğinde sağ tık menüsüne ekle
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lumina-translate",
    title: "Lumina ile Çevir",
    contexts: ["selection"] // Sadece bir metin seçildiğinde görünsün
  });
});

// Sağ tık menüsüne tıklandığında
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "lumina-translate" && info.selectionText) {
    // Masaüstünde arka planda çalışan Lumina Express sunucusuna metni ilet
    fetch("http://127.0.0.1:3456/api/open-with-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: info.selectionText })
    }).catch(err => {
      console.error("Lumina uygulamasına ulaşılamadı. Uygulamanın açık olduğundan emin olun.", err);
    });
  }
// Eklenti yüklendiğinde sağ tık menüsüne ekle
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "lumina-translate",
    title: "Lumina ile Çevir",
    contexts: ["selection"] // Sadece bir metin seçildiğinde görünsün
  });
});

// Sağ tık menüsüne tıklandığında
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "lumina-translate" && info.selectionText) {
    // Masaüstünde arka planda çalışan Lumina Express sunucusuna metni ilet
    fetch("http://127.0.0.1:3456/api/open-with-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: info.selectionText })
    }).catch(err => {
      console.error("Lumina uygulamasına ulaşılamadı. Uygulamanın açık olduğundan emin olun.", err);
    });
  }
});