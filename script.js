const ACHIEVEMENT_KEY = 'chessQuizAchievements';

function loadAchievements() {
    const saved = localStorage.getItem(ACHIEVEMENT_KEY);
    return saved ? JSON.parse(saved) : { easy: false, medium: false, hard: false };
}

function saveAchievement(difficulty) {
    const achievements = loadAchievements();
    achievements[difficulty] = true;
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify(achievements));
    return achievements;
}

function hasAllAchievements(achievements) {
    return achievements.easy && achievements.medium && achievements.hard;
}

// Dados do Quiz
const questions = [
    {
        question: "Qual peça pode se mover em forma de 'L'?",
        options: ["Bispo", "Cavalo", "Torre", "Rainha"],
        correctAnswer: 1
    },
    {
        question: "Quantas casas pode avançar um peão no seu primeiro movimento?",
        options: ["1 casa", "2 casas", "1 ou 2 casas", "3 casas"],
        correctAnswer: 2
    },
    {
        question: "O que é o 'roque' no xadrez?",
        options: [
            "Um movimento especial com o rei e a torre",
            "Um tipo de peão",
            "Uma jogada de ataque",
            "Uma peça do jogo"
        ],
        correctAnswer: 0
    },
    {
        question: "Qual é a única peça que pode 'saltar' outras peças?",
        options: ["Rainha", "Bispo", "Cavalo", "Torre"],
        correctAnswer: 2
    },
    {
        question: "Como se chama a jogada especial onde o peão pode capturar outro peão?",
        options: ["En passant", "Promoção", "Xeque", "Roque"],
        correctAnswer: 0
    },
    {
        question: "Em quantas direções o bispo pode se mover?",
        options: ["2 direções", "4 direções", "8 direções", "6 direções"],
        correctAnswer: 1
    },
    {
        question: "Quando um peão chega à última linha do tabuleiro, o que acontece?",
        options: [
            "Ele é removido do jogo",
            "Ele pode ser promovido a qualquer peça (exceto rei)",
            "Ele volta ao início",
            "Nada acontece"
        ],
        correctAnswer: 1
    },
    {
        question: "Quantas casas tem um tabuleiro de xadrez?",
        options: ["32 casas", "64 casas", "48 casas", "100 casas"],
        correctAnswer: 1
    },
    {
        question: "O que significa 'xeque-mate'?",
        options: [
            "O rei está em perigo mas pode escapar",
            "O rei foi capturado",
            "O rei está em xeque e não há como escapar",
            "O jogo terminou em empate"
        ],
        correctAnswer: 2
    },
    {
        question: "Qual peça tem valor teórico de 9 pontos no xadrez?",
        options: ["Torre", "Bispo", "Rainha", "Cavalo"],
        correctAnswer: 2
    },
    {
        question: "Qual é a abertura mais popular no xadrez?",
        options: ["Defesa Siciliana", "Ruy López", "Gambito da Rainha", "Defesa Francesa"],
        correctAnswer: 0
    },
    {
        question: "O que é uma 'forquilha' no xadrez?",
        options: [
            "Um movimento defensivo",
            "Um ataque duplo a duas ou mais peças",
            "Uma regra especial",
            "Um tipo de empate"
        ],
        correctAnswer: 1
    },
    {
        question: "Quantos cavalos cada jogador tem no início da partida?",
        options: ["1", "2", "3", "4"],
        correctAnswer: 1
    },
    {
        question: "O que é um 'zugzwang'?",
        options: [
            "Uma abertura alemã",
            "Uma situação onde qualquer movimento piora a posição",
            "Um tipo de xeque-mate",
            "Uma peça especial"
        ],
        correctAnswer: 1
    },
    {
        question: "Qual é o movimento mais longo que uma torre pode fazer em um tabuleiro vazio?",
        options: ["5 casas", "7 casas", "8 casas", "6 casas"],
        correctAnswer: 1
    }
];

const difficultyConfig = {
    easy: { name: "Fácil", questions: 5 },
    medium: { name: "Médio", questions: 10 },
    hard: { name: "Difícil", questions: 15 }
};

// Estado do jogo
let currentDifficulty = null;
let activeQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

// Iniciar Quiz
function startQuiz(difficulty) {
    currentDifficulty = difficulty;
    activeQuestions = questions.slice(0, difficultyConfig[difficulty].questions);
    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    document.getElementById('difficultyScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    document.getElementById('resultScreen').classList.add('hidden');

    showQuestion();
}

// Mostrar pergunta
function showQuestion() {
    const question = activeQuestions[currentQuestionIndex];
    const totalQuestions = activeQuestions.length;

    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = totalQuestions;
    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('questionText').textContent = question.question;

    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = progress + '%';

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.onclick = () => handleAnswer(index);

        const letter = String.fromCharCode(65 + index);

        button.innerHTML = `
                    <div class="option-letter">${letter}</div>
                    <span class="option-text">${option}</span>
                `;

        optionsContainer.appendChild(button);
    });

    answered = false;
}

// Lidar com resposta
function handleAnswer(answerIndex) {
    if (answered) return;

    answered = true;
    const question = activeQuestions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-button');

    buttons.forEach((button, index) => {
        button.classList.add('disabled');

        if (index === question.correctAnswer) {
            button.classList.add('correct');
            button.innerHTML += '<span class="option-icon correct-icon">✓</span>';
        }

        if (index === answerIndex && index !== question.correctAnswer) {
            button.classList.add('incorrect');
            button.innerHTML += '<span class="option-icon incorrect-icon">✗</span>';
        }
    });

    if (answerIndex === question.correctAnswer) {
        score++;
    }

    setTimeout(() => {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < activeQuestions.length) {
            currentQuestionIndex = nextQuestion;
            showQuestion();
        } else {
            showResult();
        }
    }, 1500);
}

// Mostrar resultado
function showResult() {
    const totalQuestions = activeQuestions.length;
    const percentage = (score / totalQuestions) * 100;

    // Verifica se foi 100% e salva a conquista
    if (percentage === 100) {
        const achievements = saveAchievement(currentDifficulty);

        // Se completou todos os níveis com 100%, mostra a recompensa especial
        if (hasAllAchievements(achievements)) {
            document.getElementById('quizScreen').classList.add('hidden');
            document.getElementById('rewardScreen').classList.remove('hidden');
            return;
        }
    }

    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');

    document.getElementById('difficultyBadge').textContent = `Nível: ${difficultyConfig[currentDifficulty].name}`;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTotal').textContent = totalQuestions;
    document.getElementById('percentageText').textContent = `${percentage.toFixed(0)}% de acertos`;

    let message = '';
    if (percentage === 100) message = "Perfeito! Você é um mestre do xadrez! 👑";
    else if (percentage >= 80) message = "Excelente! Você domina muito bem o xadrez! 🏆";
    else if (percentage >= 60) message = "Muito bom! Continue praticando! ⭐";
    else if (percentage >= 40) message = "Bom trabalho! Ainda há espaço para melhorar! 📚";
    else message = "Continue estudando! O xadrez é uma arte que se aprende com o tempo! 💪";

    document.getElementById('resultMessage').textContent = message;
}

// Resetar quiz
function resetQuiz() {
    currentDifficulty = null;
    activeQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    answered = false;

    document.getElementById('difficultyScreen').classList.remove('hidden');
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    document.getElementById('rewardScreen').classList.add('hidden');
}