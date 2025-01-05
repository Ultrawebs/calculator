// script.js

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Menu toggle
function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

// Load dark mode preference
window.onload = () => {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    checkPermission();
    if (localStorage.getItem('historyPermission') === 'granted') {
        loadHistory();
    }
};

// Function to clear the display
function clearDisplay() {
    document.getElementById('display').value = '';
}

// Function to append value to the display
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

// Function to handle backspace
function backspace() {
    const display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

// Function to calculate the result
function calculateResult() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value);
        addToHistory(display.value + ' = ' + result);
        display.value = result;
    } catch (e) {
        display.value = 'Error';
    }
}

// Function to add a calculation to the history with a timestamp
function addToHistory(calculation) {
    const historyList = document.getElementById('history-list');
    const historyItem = document.createElement('div');
    const timestamp = new Date().toLocaleString();
    historyItem.innerHTML = `<span>${calculation}</span><span>${timestamp}</span>`;
    historyItem.classList.add('history-item');
    historyList.appendChild(historyItem);
    saveHistory();
}

// Function to clear the history
function clearHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    saveHistory();
}

// Function to save history to cookies
function saveHistory() {
    const historyList = document.getElementById('history-list');
    document.cookie = "history=" + encodeURIComponent(historyList.innerHTML) + "; path=/";
}

// Function to load history from cookies
function loadHistory() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'history') {
            const historyList = document.getElementById('history-list');
            historyList.innerHTML = decodeURIComponent(value);
        }
    }
}

// Function to handle keyboard input
function handleKeyboardInput(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculateResult();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay(key);
    }
}

// Add event listener for keyboard input
document.addEventListener('keydown', handleKeyboardInput);

// Function to check for user permission to save history
function checkPermission() {
    if (!localStorage.getItem('historyPermission')) {
        if (confirm("Do you want to save the calculation history?")) {
            localStorage.setItem('historyPermission', 'granted');
        } else {
            localStorage.setItem('historyPermission', 'denied');
        }
    }
}

// Disable inspect feature
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});
