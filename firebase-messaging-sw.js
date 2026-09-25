// firebase-messaging-sw.js
// Handles push notifications from FCM when a Dead Hand alert fires.

importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey:            "AIzaSyDNF5lQPOykjetuB4fPQ6XalQJnuWvc9PQ",
    authDomain:        "dead-man-s-switch-3344a.firebaseapp.com",
    databaseURL:       "https://dead-man-s-switch-3344a-default-rtdb.firebaseio.com",
    projectId:         "dead-man-s-switch-3344a",
    storageBucket:     "dead-man-s-switch-3344a.firebasestorage.app",
    messagingSenderId: "643809059953",
    appId:             "1:643809059953:web:387f2b42f7acc480cc67d0"
});

const messaging = firebase.messaging();

// Background message handler — fires when the app is not in focus
messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw] Background message:", payload);

    const title = (payload.notification && payload.notification.title) || "DEAD HAND ALERT";
    const body = (payload.notification && payload.notification.body) ||
                 (payload.data && payload.data.message) ||
                 "A safety alert was triggered.";

    const mapLink = (payload.data && payload.data.mapLink) || "";

    const options = {
        body: body,
        icon: "icon-192.png",
        badge: "icon-192.png",
        vibrate: [200, 100, 200, 100, 300],
        tag: "deadhand-alert",
        requireInteraction: true,
        data: { mapLink: mapLink, url: mapLink || "./" }
    };

    self.registration.showNotification(title, options);
});

// When user taps the notification, open the app (or the map link)
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const target = (event.notification.data && event.notification.data.url) || "./";
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
            for (const c of list) {
                if ("focus" in c) { c.focus(); return; }
            }
            if (clients.openWindow) return clients.openWindow(target);
        })
    );
});
