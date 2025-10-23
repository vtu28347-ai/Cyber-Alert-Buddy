// Global variable to hold all data after fetching
window.allAlerts = [];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Start the core function to fetch data and run detection
    fetchAndAnalyzeAlerts();

    // 2. Keep existing quick actions handlers for the footer section
    const quickActions = document.querySelectorAll('.actions-grid .action-item');
    quickActions.forEach(action => {
        action.addEventListener('click', (e) => {
            const link = action.getAttribute('href');
            if (link === '#') {
                e.preventDefault();
                const actionName = action.querySelector('span').textContent;
                console.log(`${actionName} action triggered.`);
            }
        });
    });
});

// --------------------------------------------------------------
// CORE DETECTION AND DISPLAY LOGIC
// --------------------------------------------------------------

async function fetchAndAnalyzeAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '<p style="text-align:center;">Analyzing data with detection engine...</p>';

    try {
        const response = await fetch('/.netlify/functions/analyze-fraud');
        if (!response.ok) {
            throw new Error(`Detection Engine Error! Status: ${response.status}`);
        }

        const analyzedData = await response.json();
        window.allAlerts = analyzedData;

        renderAlerts(analyzedData); // ✅ fixed typo (was "analyData")

        // Show the overall system accuracy (using the static value from the function)
        if (analyzedData.length > 0) {
            displayAccuracyMeter(analyzedData[0].system_accuracy);
        }
    } catch (error) {
        console.error("Error fetching/analyzing alerts:", error);
        alertsContainer.innerHTML =
            '<p style="text-align:center; color: red;">Error: Could not connect to Detection Engine. Check Netlify deployment.</p>';
    }
}

function renderAlerts(alerts) {
    const alertsContainer = document.getElementById('alerts-container');
    alertsContainer.innerHTML = '';

    if (alerts.length === 0) {
        alertsContainer.innerHTML = '<p style="text-align:center;">No current alerts found matching the filter.</p>';
        return;
    }

    alerts.forEach(alert => {
        const statusText = alert.is_fraud ? "FRAUD DETECTED" : "SAFE / UNCERTAIN";
        const statusClass = alert.is_fraud ? "critical" : "low";

        const card = document.createElement('div');
        card.className = `alert-card-item ${alert.type.toLowerCase().replace(/\s/g, '-')}`;

        card.innerHTML = `
            <div class="card-header-dynamic">
                <span class="scam-type-tag">${alert.type}</span>
                <span class="timestamp">${alert.location || 'N/A'}</span>
            </div>
            <div class="card-body-dynamic">
                <h3>Incident: ${alert.type}</h3>
                <p><strong>Keywords:</strong> ${alert.keywords}</p>
                <p>URL: ${alert.url || 'N/A'}</p>
            </div>
            <div class="card-footer-dynamic">
                <span class="status ${statusClass}">${statusText}</span>
                <span class="confidence-score">Confidence: ${alert.confidence_score.toFixed(1)}%</span>
            </div>
        `;
        alertsContainer.appendChild(card);
    });
}

function filterAlerts() {
    const filterValue = document.getElementById('scam-type-filter').value;
    if (filterValue === 'all') {
        renderAlerts(window.allAlerts);
    } else {
        const filtered = window.allAlerts.filter(alert => alert.type === filterValue);
        renderAlerts(filtered);
    }
}

function displayAccuracyMeter(accuracy) {
    const meterHTML = `
        <div class="accuracy-meter-box">
            <h3 class="meter-title">System Performance</h3>
            <p class="meter-score">Overall Accuracy: <strong>${accuracy.toFixed(1)}%</strong></p>
            <p class="meter-note">(Based on Rule-Engine evaluation against synthetic data)</p>
        </div>
    `;
    document.getElementById('accuracy-display').innerHTML = meterHTML;
}

// --------------------------------------------------------------
// CYBER SECURITY QUIZ SECTION
// --------------------------------------------------------------

const quizData = [
    {
        question: "What is the primary goal of a phishing attack?",
        options: [
            "To crash your computer's operating system.",
            "To manipulate a user into revealing sensitive information.",
            "To monitor your network traffic without authorization.",
            "To permanently delete all files on your hard drive."
        ],
        answer: 1
    },
    {
        question: "Which characteristic is most important for creating a strong and secure password?",
        options: [
            "Using a combination of your name and birthday.",
            "Ensuring it is at least 15 characters long and includes a random mix of characters.",
            "Changing it frequently, such as every two weeks.",
            "Using the same password across all your accounts for ease of recall."
        ],
        answer: 1
    },
    {
        question: "What type of malicious software encrypts a user's files and demands payment to restore access?",
        options: ["Spyware", "Adware", "Ransomware", "Trojan Horse"],
        answer: 2
    },
    {
        question: "What security measure requires a user to provide two or more different verification factors to gain access?",
        options: ["Single Sign-On (SSO)", "Biometric Authentication", "Multi-Factor Authentication (MFA)", "CAPTCHA"],
        answer: 2
    },
    {
        question: "What does the 's' in https:// stand for in a web address, and why is it important?",
        options: [
            "Search, meaning the site is optimized for search engines.",
            "Secure, meaning the connection is encrypted with SSL/TLS.",
            "Server, meaning the site is hosted on a high-end web server.",
            "Source, meaning the original source code is available."
        ],
        answer: 1
    },
    {
        question: "An attacker calls an employee pretending to be an IT technician to gain their password. This is an example of what kind of threat?",
        options: ["Denial of Service (DoS)", "Social Engineering", "SQL Injection", "Zero-Day Exploit"],
        answer: 1
    },
    {
        question: "What is the primary reason for regularly updating your operating system and applications?",
        options: [
            "To improve aesthetic appeal with new themes and icons.",
            "To install patches for newly discovered security vulnerabilities.",
            "To reduce the amount of memory (RAM) used by the system.",
            "To increase compatibility with older, outdated hardware."
        ],
        answer: 1
    },
    {
        question: "When connecting to public Wi-Fi, what tool should you always use to protect your data?",
        options: ["A standard anti-virus program.", "An extra-long password.", "A Virtual Private Network (VPN).", "A firewall device."],
        answer: 2
    },
    {
        question: "Why is maintaining offline or cloud backups of your important files vital?",
        options: [
            "It helps prevent malware infection.",
            "It allows you to restore data after incidents like ransomware or hardware failure.",
            "It detects phishing emails automatically.",
            "It is required for all operating systems."
        ],
        answer: 1
    },
    {
        question: "Before clicking a link in an email, which part of the URL should you verify?",
        options: [
            "The protocol prefix (http:// or https://).",
            "The file name or path after the domain.",
            "The domain name (e.g., google.com in mail.google.com).",
            "The first two characters of the link."
        ],
        answer: 2
    },
    {
        question: "If you receive an unexpected email from your bank asking to verify your account, what should you do?",
        options: [
            "Click the link and log in immediately.",
            "Reply asking for confirmation.",
            "Open a new browser and visit the bank’s official site directly.",
            "Forward it to a friend."
        ],
        answer: 2
    },
    {
        question: "When setting up a new IoT device, what is the most important initial step?",
        options: [
            "Changing the factory default username and password.",
            "Connecting it to a guest Wi-Fi network.",
            "Downloading a mobile anti-virus app.",
            "Enabling Bluetooth."
        ],
        answer: 0
    }
];

// Quiz variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = -1;

// DOM elements
const quizModal = document.getElementById('quiz-modal');
const startQuizBtn = document.getElementById('start-quiz-btn');
const closeQuizBtn = document.getElementById('close-quiz-btn');
const questionArea = document.getElementById('question-area');
const optionsArea = document.getElementById('options-area');
const nextBtn = document.getElementById('next-btn');
const resultSection = document.getElementById('result-section');
const quizSection = document.getElementById('quiz-section');
const scoreDisplay = document.getElementById('score-display');
const ratingDisplay = document.getElementById('rating-display');
const retakeBtn = document.getElementById('retake-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

// Modal Controls
startQuizBtn.addEventListener('click', (e) => {
    e.preventDefault();
    quizModal.style.display = 'block';
    startQuiz();
});

closeQuizBtn.addEventListener('click', () => {
    quizModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === quizModal) {
        quizModal.style.display = 'none';
    }
});

nextBtn.addEventListener('click', handleNextButton);
retakeBtn.addEventListener('click', startQuiz);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    quizSection.style.display = 'block';
    resultSection.style.display = 'none';
    nextBtn.disabled = true;
    nextBtn.textContent = 'Next Question';
    showQuestion();
}

function showQuestion() {
    const q = quizData[currentQuestionIndex];
    selectedOptionIndex = -1;
    questionArea.innerHTML = `${currentQuestionIndex + 1}. ${q.question}`;
    optionsArea.innerHTML = '';

    q.options.forEach((text, i) => {
        const btn = document.createElement('button');
        btn.classList.add('option-btn');
        btn.textContent = text;
        btn.dataset.index = i;
        btn.addEventListener('click', selectAnswer);
        optionsArea.appendChild(btn);
    });

    updateProgressBar();
}

function updateProgressBar() {
    const total = quizData.length;
    const progress = currentQuestionIndex;
    const percentage = (progress / total) * 100;
    progressBar.style.width = percentage + '%';
    progressText.textContent = `${progress + 1} of ${total}`;
    nextBtn.textContent = (progress === total - 1) ? 'Finish Quiz' : 'Next Question';
}

function selectAnswer(e) {
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    const selectedBtn = e.target;
    selectedBtn.classList.add('selected');
    selectedOptionIndex = parseInt(selectedBtn.dataset.index);
    nextBtn.disabled = false;
}

function checkAnswer() {
    const q = quizData[currentQuestionIndex];
    const correctIndex = q.answer;
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions[correctIndex].classList.add('correct');

    if (selectedOptionIndex === correctIndex) {
        score++;
    } else if (selectedOptionIndex !== -1) {
        allOptions[selectedOptionIndex].classList.remove('selected');
        allOptions[selectedOptionIndex].classList.add('incorrect');
    }
}

function handleNextButton() {
    checkAnswer();
    setTimeout(() => {
        currentQuestionIndex++;
        nextBtn.disabled = true;
        if (currentQuestionIndex < quizData.length) {
            showQuestion();
        } else {
            showResults();
        }
    }, 800);
}

function showResults() {
    quizSection.style.display = 'none';
    resultSection.style.display = 'block';
    const totalQuestions = quizData.length;
    const percentage = (score / totalQuestions) * 100;

    scoreDisplay.innerHTML = `You answered <strong>${score} out of ${totalQuestions}</strong> correctly! (${percentage.toFixed(0)}%)`;

    let rating = '', ratingClass = '';
    if (score >= 11) {
        rating = "Excellent! You are a Cyber Security Buddy!";
        ratingClass = 'rating-excellent';
    } else if (score >= 8) {
        rating = "Good! You have a solid understanding of online safety.";
        ratingClass = 'rating-good';
    } else if (score >= 5) {
        rating = "Fair. Keep learning, and review the safety tips!";
        ratingClass = 'rating-fair';
    } else {
        rating = "Needs Improvement. Time to hit the 'Learn Safety' section!";
        ratingClass = 'rating-poor';
    }

    ratingDisplay.textContent = rating;
    ratingDisplay.className = `rating-box ${ratingClass}`;
}
