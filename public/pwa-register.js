// Register Service Worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✓ Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

// Detect PWA installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('✓ App is installable on this device');
  
  // You can show an "Add to Home Screen" button here
  // For now, just log it
});

window.addEventListener('appinstalled', () => {
  console.log('✓ PWA was successfully installed');
  deferredPrompt = null;
});
