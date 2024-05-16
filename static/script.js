function sendMessage() {
    const message = document.getElementById('user-input').value.trim();
    if (message !== '') {
        appendMessage('user', message);
        document.getElementById('user-input').value = '';
        processMessage(message);
    }
}

function clearChat() {
    document.getElementById('chat-container').innerHTML = '';
}

function appendMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'p-2', 'my-2', 'rounded');
    if (sender === 'user') {
        messageElement.classList.add('bg-primary', 'text-white', 'text-right');
    } else {
        messageElement.classList.add('bg-success', 'text-white', 'text-left');
    }
    messageElement.innerHTML = message; // Use innerHTML to render HTML content
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function processMessage(message) {
    // Introduction message from the bot
    if (!localStorage.getItem('name')) {
        appendMessage('bot', 'Hello! I am your symptom checker bot. What is your name?');
        localStorage.setItem('name', message);
    } else if (!localStorage.getItem('age')) {
        appendMessage('bot', 'Nice to meet you, ' + localStorage.getItem('name') + '! How old are you?');
        localStorage.setItem('age', message);
    } else if (!localStorage.getItem('gender')) {
        appendMessage('bot', 'Thanks for providing your age, ' + localStorage.getItem('name') + '! Please select your gender:');
        appendMessage('bot', '<button class="btn btn-success" onclick="selectGender(\'male\')">Male</button> <button class="btn btn-success" onclick="selectGender(\'female\')">Female</button>');
    } else if (!localStorage.getItem('symptoms')) {
        appendMessage('bot', 'Great! Now, please enter your symptoms (comma separated):');
        appendMessage('bot', '<div class="form-group"><input type="text" class="form-control" id="symptomInput" placeholder="Enter symptoms..."></div>');
        appendMessage('bot', '<button class="btn btn-primary" onclick="saveSymptoms()">Submit Symptoms</button>');
    } else {
        // After symptoms are submitted, send a POST request to Flask backend
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'symptoms': localStorage.getItem('symptoms') })
        })
        .then(response => response.json())
        .then(data => {
            // Display the predicted disease
            appendMessage('bot', 'Predicted Disease: ' + data.predictions[0]);
        })
        .catch(error => console.error('Error:', error));
    }
}

function selectGender(gender) {
    localStorage.setItem('gender', gender);
    appendMessage('user', 'Gender: ' + gender);
}

function saveSymptoms() {
    const symptoms = document.getElementById('symptomInput').value.trim();
    if (symptoms !== '') {
        localStorage.setItem('symptoms', symptoms);
        appendMessage('user', 'Symptoms: ' + symptoms);
        // Trigger symptom analysis
        processMessage();
    }
}
