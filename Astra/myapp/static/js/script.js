// Get required DOM elements
const sendButton = document.querySelector('.send-btn');
const textarea = document.querySelector('textarea');
const chatBox = document.querySelector('.chat-section'); // Chat container for speech messages
const micButton = document.getElementById('mic-button'); // Microphone button

// Flag to ensure transcript is only sent once per speech
let isMessageSent = false; 

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
function addMessageToChat(message, side) {
    const chatContainer = document.getElementById('chatContainer');  // Get the container where messages are displayed
    const messageDiv = document.createElement('div');  // Create a new div element
    messageDiv.classList.add(side);  // Add class to style the message (e.g., 'left' or 'right')
    messageDiv.textContent = message;  // Set the message content
    chatContainer.appendChild(messageDiv);  // Append the new message div to the chat container
}

// Function to send user message to the backend
function sendToBackend(message) {
    const apiUrl = '{% url "chatbot_response" %}';  // Dynamically render the URL

    const data = {
        message: message,  // Send message to the backend
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
            const botResponse = result.reply || "Bot is thinking...";  // Use 'reply' instead of 'bot_reply'
            addMessageToChat(botResponse, 'left-part');
        })
        .catch((error) => {
            console.error('Error:', error);
            addMessageToChat("Sorry, I couldn't connect to the server.", 'left-part');
        });
}

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

        // Ensure transcript is not sent again if already processed
        if (!isMessageSent) {
            addMessageToChat(transcript, 'right-part'); // Add transcript to the chatBox (user's message)
            sendToBackend(transcript); // Send mic input to backend
            isMessageSent = true;  // Set flag to prevent duplicate message sending
        }
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
