// Get required DOM elements
const sendButton = document.querySelector('.send-btn');
const textarea = document.querySelector('textarea');
const chartSection = document.querySelector('.chart-section');
const micButton = document.getElementById('mic-button'); // Microphone button
const chatBox = document.getElementById('chat-box'); // Chat container for speech messages

// Function to create and display user message
function sendMessage() {
    const userMessage = textarea.value.trim();

    // Check if the message is not empty
    if (userMessage !== "") {
        addMessageToChat(userMessage, 'right-part');
        textarea.value = ""; // Clear the textarea
        sendToBackend(userMessage); // Send the message to backend
    }
}

// Function to add a message to the chat (either user or bot)
function addMessageToChat(message, className) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add(className);

    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageContainer.appendChild(messageText);

    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
}

// Function to send user message to the backend
function sendToBackend(message) {
    const apiUrl = 'https://your-backend-endpoint.com/api'; // Replace with your backend URL
    const data = {
        user_message: message,
        timestamp: new Date().toISOString(),
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            // Display the bot's response
            const botResponse = result.bot_reply || "Bot is thinking...";
            addMessageToChat(botResponse, 'left-part');
        })
        .catch((error) => {
            console.error('Error:', error);
            addMessageToChat("Sorry, I couldn't connect to the server.", 'left-part');
        });
}

// Function to simulate receiving a bot message (for testing without a backend)
// Uncomment this function if you're testing locally without an API
// function receiveBotMessage() {
//     setTimeout(() => {
//         const botResponse = "Hello, this is a response from the bot!";
//         addMessageToChat(botResponse, 'left-part');
//     }, 1000); // Simulate a 1-second delay for bot response
// }

// Event listener for the Send button
sendButton.addEventListener('click', sendMessage);

// Event listener for Enter key
textarea.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent default newline behavior
        sendMessage();
    }
});

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false; // Only process the final result

    // Start speech recognition when the mic button is clicked
    micButton.addEventListener('click', () => {
        recognition.start();
        micButton.classList.add('active'); // Optional: Add a visual cue (e.g., pulse animation)
    });

    // Handle the result of speech recognition
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the speech-to-text result
        addMessageToChat(transcript, 'right-part');
        sendToBackend(transcript); // Send mic input to backend
    };

    // Stop listening and reset mic button state
    recognition.onspeechend = () => {
        recognition.stop();
        micButton.classList.remove('active'); // Remove the active state
    };

    // Handle errors (optional)
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        addMessageToChat("Speech recognition error. Please try again.", 'left-part');
    };
} else {
    console.warn('SpeechRecognition is not supported in this browser.');
    micButton.disabled = true; // Disable the mic button if speech recognition is unavailable
}

