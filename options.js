// options.js
function saveOptions() {
    const interval = document.getElementById('interval').value;
    const message = document.getElementById('message').value || "Time to drink some water! 💧";
    
    // Basic validation
    if (message.length > 50) {
        showStatus('Message must be 50 characters or less.', 'error');
        return;
    }

    chrome.storage.sync.set({ 
        interval: parseInt(interval), 
        message: message 
    }, () => {
        showStatus('Settings saved successfully!', 'success');
    });
}

function restoreOptions() {
    chrome.storage.sync.get({ 
        interval: 30, 
        message: "Time to drink some water! 💧" 
    }, (items) => {
        document.getElementById('interval').value = items.interval;
        document.getElementById('intervalSlider').value = items.interval;
        document.getElementById('intervalValue').textContent = items.interval;
        document.getElementById('message').value = items.message;
        document.getElementById('messageLength').textContent = items.message.length;
        updateSliderFill(document.getElementById('intervalSlider'));
    });
}

function showStatus(text, type) {
    const status = document.getElementById('status');
    status.textContent = text;
    status.className = type === 'success' ? 'success' : '';
    
    setTimeout(() => {
        status.textContent = '';
        status.className = '';
    }, 2000);
}

function updateSliderFill(slider) {
    const value = slider.value;
    const min = slider.min || 1;
    const max = slider.max || 120;
    const percent = ((value - min) / (max - min)) * 100;
    slider.style.setProperty('--fill-percent', percent + '%');
}

// Event listeners when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    
    // Sync slider and number input
    const slider = document.getElementById('intervalSlider');
    const numberInput = document.getElementById('interval');
    const valueDisplay = document.getElementById('intervalValue');
    
    slider.addEventListener('input', () => {
        numberInput.value = slider.value;
        valueDisplay.textContent = slider.value;
        updateSliderFill(slider);
    });
    
    numberInput.addEventListener('input', () => {
        slider.value = numberInput.value;
        valueDisplay.textContent = numberInput.value;
        updateSliderFill(slider);
    });
    
    // Character counter for message
    const messageInput = document.getElementById('message');
    messageInput.addEventListener('input', () => {
        document.getElementById('messageLength').textContent = messageInput.value.length;
    });
    
    // Save button
    document.getElementById('save').addEventListener('click', saveOptions);
});