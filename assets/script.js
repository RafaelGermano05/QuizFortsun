const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby9p__RWY2iQ0-UhNuLlYyGoBN6cDlJkN0wIchcPz1Z10poWXXwaJdHPGQX8NDtMmn_5w/exec"; 

        const questions = [
            { question: "No sistema de remuneração 2025 da Fortsun, oque é conquista?", options: ["Vendas", "Faturamento +15K", "New Mas(Ativação)", "Meta Batida"], answer: "New Mas(Ativação)" },
            { question: "Quanto de TPV Ponderado Médio o Seller tem que ter para migrar?", options: ["R$10.000,00", "R$20.000,00", "R$30.000,00", "R$15.000,00"], answer: "R$15.000,00" },
            { question: "No TPV Médio Real o Seller faturou apenas 9K, dos 9K, foram 7K no Parcelado e 2k no Crédito, devido isso ele vai migrar!", options: ["Verdadeiro", "Falso"], answer: "Verdadeiro" },
            { question: "Para ser um cliente VEMOS ele:", options: ["Fatura +15K", "CNPJ +70% Parcelado", "Fatura tudo no débito", "Trabalha com alimentação"], answer: "CNPJ +70% Parcelado" },
            { question: "O que o consultor tem que fazer para ser Ouro?", options: ["Fazer 20 vendas", "Conseguir 20 ativações", "Ter 10 migrações", "+60% Parcelado de Faturamento"], answer: "+60% Parcelado de Faturamento" },
            { question: "Um novato está no seu segundo mês, e uma das suas vendas já migrou por faturar muito, dito isso, mesmo sendo novato ele vai ganhar a safra desse cliente", options: ["Verdadeiro", "Falso"], answer: "Falso" },
            { question: "Qual é o valor de referência do Acelerador de Volume e Qualidade?", options: ["Valor conquistado na Safra(Migração)", "Salário", "Valor conquistado na Conquista", "Valor do melhor Seller"], answer: "Valor conquistado na Safra(Migração)" },
            { question: "Qual é o valor de referência para calcular a Remuneração da Conquista?", options: ["Valor conquistado na Safra(Migração)", "Salário", "Valor conquistado na Conquista", "Valor do melhor Seller"], answer: "Salário" },
        ];

        const startScreen = document.querySelector('.start-screen');
        const questionScreen = document.querySelector('.question-screen');
        const resultScreen = document.querySelector('.result-screen');
        const questionElement = document.querySelector('.question');
        const optionsElement = document.querySelector('.options');
        const resultElement = document.querySelector('.result');
        const timerElement = document.getElementById('time-left');
        const timeTakenElement = document.querySelector('.time-taken');
        const startButton = document.getElementById('start-button');

        let participantName = "";
        let currentQuestionIndex = 0;
        let score = 0;
        let totalTime = 10 * 60;
        let timerInterval;
        let startTime;

        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${minutes}:${secs.toString().padStart(2, '0')}`;

        };

        const updateTimer = () => {
            totalTime--;
            timerElement.textContent = formatTime(totalTime);
            if (totalTime <= 0) {
                clearInterval(timerInterval);
                alert('O tempo acabou!');
                showResult();
            }
        };

        const loadQuestion = () => {
            if (currentQuestionIndex >= questions.length) {
                showResult();
                return;
            }
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            optionsElement.innerHTML = "";
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option');
                button.textContent = option;
                button.onclick = () => selectAnswer(option);
                optionsElement.appendChild(button);
            });
        };

        const selectAnswer = (selectedOption) => {
            if (selectedOption === questions[currentQuestionIndex].answer) {
                score++;
            }
            currentQuestionIndex++;
            loadQuestion();
        };

        const startQuiz = () => {
            participantName = document.getElementById('participant-name').value.trim();
            if (!participantName) {
                alert('Por favor, digite seu nome antes de começar.');
                return;
            }
            startScreen.classList.remove('active');
            questionScreen.classList.add('active');
            startTime = new Date();
            timerInterval = setInterval(updateTimer, 1000);
            loadQuestion();
        };

        const showResult = () => {
            const endTime = new Date();
            const timeTaken = Math.round((endTime - startTime) / 1000);
            questionScreen.classList.remove('active');
            resultScreen.classList.add('active');
            resultElement.textContent = `Você acertou ${score} de ${questions.length} perguntas.🎯`;
            timeTakenElement.textContent = `Você levou ${formatTime(timeTaken)} para completar o quiz.⏳`;


            fetch(SHEET_WEBHOOK_URL, {
            method: "POST",
            mode: "no-cors", // por favor código lindo n bloqueie o CORS, isso é um apelo
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: participantName,
                score: score,
                time: formatTime(timeTaken)
            })
        })
        .then(response => console.log("Dados enviados com sucesso!"))
        .catch(error => console.error("Erro ao enviar dados:", error));

        };

        startButton.addEventListener('click', startQuiz);