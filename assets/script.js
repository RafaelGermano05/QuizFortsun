const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby9p__RWY2iQ0-UhNuLlYyGoBN6cDlJkN0wIchcPz1Z10poWXXwaJdHPGQX8NDtMmn_5w/exec"; 

const questions = [
    { question: "1. No Plano de Cargos, Carreiras e Salários (PCCS), qual é a pontuação mínima exigida na avaliação de competências para progressão de carreira?", options: ["A) 6 pontos", "B) 8 pontos", "C) 10 pontos"], answer: "B) 8 pontos" },
    { question: "2. Qual é um dos critérios para o Nível I do PCCS?", options: ["A) Aderência mínima de 50% da base e R$ 120.000,00 em vendas", "B) Aderência mínima de 35% da base e R$ 100.000,00 em vendas", "C) Realizar mentorias para consultores novatos"], answer: "B) Aderência mínima de 35% da base e R$ 100.000,00 em vendas" },
    { question: "3. O Círculo de Ouro, criado por Simon Sinek, é formado por quais três perguntas?", options: ["A) Onde? Quando? Por quê?", "B) Quem? O quê? Como?", "C) Por quê? Como? O quê?"], answer: "C) Por quê? Como? O quê?" },
    { question: "4. Segundo o Círculo de Ouro, qual é o impacto de começar pelo “Por quê” na comunicação de vendas?", options: ["A) Aumenta a conexão, confiança e valor percebido", "B) Reduz o tempo da abordagem", "C) Facilita descontos agressivos"], answer: "A) Aumenta a conexão, confiança e valor percebido" },
    { question: "5. No planejamento de rota, qual ferramenta é citada para mapear setores aderentes à estratégia?", options: ["A) Google Maps", "B) Trello", "C) Excel"], answer: "A) Google Maps" },
    { question: "6. No pós-venda, qual é o prazo indicado para reforçar a experiência positiva e resolver dúvidas do cliente?”", options: ["A) 3 dias", "B) 10 dias", "C) 30 dias"], answer: "B) 10 dias" },
    { question: "7. Qual é um dos objetivos do planejamento e roteirização de rota?", options: ["A) Aumentar o número de reuniões internas", "B) Garantir máxima efetividade em campo", "C) Diminuir o contato com clientes antigos"], answer: "C) Garantir máxima efetividade em campo" },
    { question: "8. No Nível III do PCCS, qual valor mínimo deve ser atingido em vendas?", options: ["A) R$ 100.000,00", "B) R$ 120.000,00", "C) R$ 150.000,00"], answer: "B) R$ 120.000,00" },
    { question: "9. Qual é um benefício do modelo do Círculo de Ouro nas vendas?", options: ["A) Facilita vendas apenas para grandes empresas", "B) Torna o pitch mais natural e consultivo", "C) Garante fechamento imediato"], answer: "B) Torna o pitch mais natural e consultivo" },
    { question: "10. O que deve ser registrado durante agendamentos de retorno (follow-up)?", options: ["A) Apenas vendas efetivadas", "B) Apenas contatos com o decisor presente", "C) Todos os contatos realizados, mesmo sem o decisor presente"], answer: "C) Todos os contatos realizados, mesmo sem o decisor presente" },
];

// Elementos do DOM
const startScreen = document.querySelector('.start-screen');
const questionScreen = document.querySelector('.question-screen');
const resultScreen = document.querySelector('.result-screen');
const questionElement = document.querySelector('.question');
const optionsElement = document.querySelector('.options');
const timerElement = document.getElementById('time-left');
const timeTakenElement = document.getElementById('time-taken');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const playerNameDisplay = document.getElementById('player-name-display');
const playerResultName = document.getElementById('player-result-name');
const finalScoreElement = document.getElementById('final-score');
const performanceElement = document.getElementById('performance');
const scoreMessageElement = document.getElementById('score-message');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const progressFill = document.querySelector('.progress-fill');
const timerCircleFill = document.querySelector('.timer-circle-fill');

// Variáveis do quiz
let participantName = "";
let currentQuestionIndex = 0;
let score = 0;
let totalTime = 10 * 60; // 10 minutos em segundos
let timerInterval;
let startTime;
let selectedOptions = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    totalQuestionsElement.textContent = questions.length;
    
    startButton.addEventListener('click', startQuiz);
    restartButton.addEventListener('click', restartQuiz);
    
    // Animar o input quando focado
    const nameInput = document.getElementById('participant-name');
    nameInput.addEventListener('focus', () => {
        document.querySelector('.input-group').classList.add('focused');
    });
    
    nameInput.addEventListener('blur', () => {
        document.querySelector('.input-group').classList.remove('focused');
    });
});

// Formatar tempo (mm:ss)
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Atualizar o timer
const updateTimer = () => {
    totalTime--;
    timerElement.textContent = formatTime(totalTime);
    
    // Atualizar o círculo do timer
    const percentage = (totalTime / (10 * 60)) * 100;
    timerCircleFill.setAttribute('stroke-dasharray', `${percentage}, 100`);
    
    // Mudar cor quando o tempo estiver acabando
    if (totalTime <= 60) { // 1 minuto restante
        timerCircleFill.setAttribute('stroke', 'var(--danger-color)');
    } else if (totalTime <= 180) { // 3 minutos restantes
        timerCircleFill.setAttribute('stroke', 'var(--warning-color)');
    }
    
    if (totalTime <= 0) {
        clearInterval(timerInterval);
        showResult();
    }
};

// Carregar questão
const loadQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }
    
    // Atualizar progresso
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";
    
    // Adicionar classes de animação
    questionElement.classList.remove('animate__fadeIn');
    void questionElement.offsetWidth; // Trigger reflow
    questionElement.classList.add('animate__fadeIn');
    
    // Criar opções
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.textContent = option;
        
        // Adicionar animação de atraso para cada opção
        button.style.animationDelay = `${index * 0.1}s`;
        button.classList.add('animate__animated', 'animate__fadeInUp');
        
        button.onclick = () => selectAnswer(option);
        optionsElement.appendChild(button);
    });
};

// Selecionar resposta
const selectAnswer = (selectedOption) => {
    // Desabilitar todas as opções após seleção
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Verificar resposta
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    // Armazenar a opção selecionada
    selectedOptions.push({
        question: currentQuestion.question,
        selected: selectedOption,
        correct: currentQuestion.answer,
        isCorrect: isCorrect
    });
    
    if (isCorrect) {
        score++;
    }
    
    // Marcar opções corretas/incorretas
    allOptions.forEach(option => {
        if (option.textContent === currentQuestion.answer) {
            option.classList.add('correct');
        } else if (option.textContent === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Avançar para próxima questão após um breve delay
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
};

// Iniciar quiz
const startQuiz = () => {
    participantName = document.getElementById('participant-name').value.trim();
    if (!participantName) {
        alert('Por favor, digite seu nome antes de começar.');
        return;
    }
    
    // Resetar variáveis
    currentQuestionIndex = 0;
    score = 0;
    totalTime = 10 * 60;
    selectedOptions = [];
    
    // Atualizar UI
    startScreen.classList.remove('active');
    questionScreen.classList.add('active');
    playerNameDisplay.textContent = participantName;
    timerElement.textContent = formatTime(totalTime);
    timerCircleFill.setAttribute('stroke', 'var(--accent-color)');
    timerCircleFill.setAttribute('stroke-dasharray', '100, 100');
    
    // Iniciar timer
    startTime = new Date();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Carregar primeira questão
    loadQuestion();
};

// Mostrar resultado
const showResult = () => {
    clearInterval(timerInterval);
    
    // Calcular tempo gasto
    const endTime = new Date();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    const formattedTime = formatTime(timeTaken);
    
    // Atualizar UI de resultados
    questionScreen.classList.remove('active');
    resultScreen.classList.add('active');
    playerResultName.textContent = participantName;
    finalScoreElement.textContent = score;
    timeTakenElement.textContent = formattedTime;
    
    // Calcular desempenho
    const performance = Math.round((score / questions.length) * 100);
    performanceElement.textContent = `${performance}%`;
    
    // Mensagem baseada no desempenho
    let message = "";
    if (performance >= 80) {
        message = "Excelente! Você dominou o conteúdo! 🎉";
    } else if (performance >= 60) {
        message = "Bom trabalho! Você está no caminho certo! 👍";
    } else if (performance >= 40) {
        message = "Você foi bem, mas pode melhorar! 💪";
    } else {
        message = "Continue estudando, você consegue! 📚";
    }
    scoreMessageElement.textContent = message;
    
    // Disparar confetes se bom desempenho
    if (performance >= 70) {
        createConfetti();
    }
    
    // Enviar dados para o Google Sheets
    sendResultsToSheet(participantName, score, formattedTime);
};

// Reiniciar quiz
const restartQuiz = () => {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    
    // Resetar input
    document.getElementById('participant-name').value = "";
    document.getElementById('participant-name').focus();
};

// Enviar resultados para o Google Sheets
const sendResultsToSheet = (name, score, time) => {
    fetch(SHEET_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            score: score,
            time: time
        })
    })
    .then(response => console.log("Dados enviados com sucesso!"))
    .catch(error => console.error("Erro ao enviar dados:", error));
};

// Efeito de confete
const createConfetti = () => {
    const celebration = document.querySelector('.celebration');
    celebration.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Posição aleatória
        confetti.style.left = `${Math.random() * 100}%`;
        
        // Cor aleatória
        const colors = ['#4e44ce', '#35a7ff', '#ff6b6b', '#4caf50', '#ff9800'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Tamanho e forma aleatórios
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Animação
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.opacity = '1';
        
        // Adicionar ao DOM
        celebration.appendChild(confetti);
    }
    
    // Adicionar CSS para animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
};
