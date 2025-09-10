// Create the alarm when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    setAlarmFromStorage();
});

// Listen for when the alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'waterReminder') {
        showNotification();
    }
});

// Function to set the alarm using values from storage
function setAlarmFromStorage() {
    chrome.storage.sync.get({ interval: 30 }, (items) => {
        // Clear any existing alarm to avoid duplicates
        chrome.alarms.clear('waterReminder', () => {
            // Create a new alarm with the user's interval
            chrome.alarms.create('waterReminder', {
                periodInMinutes: items.interval
            });
        });
    });
}

// Function to show the notification
function showNotification() {
    chrome.storage.sync.get({ message: "Time to drink some water!" }, (items) => {
        chrome.notifications.create('waterNotification', {
            type: 'basic',
            iconUrl: 'icons/icon16.png',
            title: 'Water Drink Reminder',
            message: items.message,
            priority: 2
        });
    });
}

// Listen for changes in storage (e.g., when user updates interval)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.interval) {
        setAlarmFromStorage(); // Reset the alarm with the new interval
    }
});