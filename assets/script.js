const SHEET_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycby9p__RWY2iQ0-UhNuLlYyGoBN6cDlJkN0wIchcPz1Z10poWXXwaJdHPGQX8NDtMmn_5w/exec"; 

        const questions = [
            { question: "1. Quais são os nossos Pilares ?", options: ["a) Superação, Empower, Criação,  Excelência, Confiança e Lealdade.", "b) Resiliência, Empower,  Inovação, Excelência, Confiança e Lealdade.", "c) Superação, Empower, Inovação, Excelência, Confiança e Lealdade.", "d) Persistência,  Empower, Criação,  Excelência, Confiança e Lealdade."], answer: "c) Superação, Empower, Inovação, Excelência, Confiança e Lealdade." },
            { question: "2. Sobre o que fala o valor “Superação” ?", options: ["a) ”Superar as barreiras das oportunidades”.", "b) “Transformar desafios em oportunidades”.", "c) “Visualizar problemas em soluções”.", "d)  “Transformar desafios e possibilidades”."], answer: "b) “Transformar desafios em oportunidades”." },
            { question: "3. Empower significa “Cuidar das pessoas e as colocar no centro” ?", options: ["Verdadeiro", "Falso"], answer: "Verdadeiro" },
            { question: "4. Um bom pitch é longo, aborda todos os benefícios do produto para que o cliente ", options: ["Verdadeiro", "Falso"], answer: "Falso" },
            { question: "5. O que é o Pitch de vendas ?", options: ["a) O pitch de vendas é uma introdução subjetiva que busca convencer o cliente a fechar a compra.", "b) O pitch de vendas é uma apresentação subjetiva que busca convencer o cliente a fechar a compra.", "c) O pitch de vendas é o desenvolvimento preciso para convencer o cliente de não fechar.", "d) O pitch de vendas é uma apresentação objetiva que busca convencer o cliente a fechar a compra."], answer: "d) O pitch de vendas é uma apresentação objetiva que busca convencer o cliente a fechar a compra." },
            { question: "6. O que usamos de base para construir um pitch vencedor ?", options: ["a) Abertura impactante, Problema, Solução, Diferenciais, Call to Action.", "b) Abertura impactante, Variáveis, Solução, Diferenciais, Call to Action.", "c) Empower, Problema, Solução, Diferenciais, Call to Action.", "d) Abertura impactante, Problema, Valores, Diferenciais, Call to Action."], answer: "a) Abertura impactante, Problema, Solução, Diferenciais, Call to Action." },
            { question: "7. “Os atributos do produto são suficientes para encantar o cliente”", options: ["Verdadeiro", "Falso"], answer: "Falso" },
            { question: "8.Sobre objeções do cliente:", options: ["a) Melhor evitar", "b) Não vale a pena negociar com o cliente", "c) Antecipar-se e demonstrar segurança ao cliente ", "d) Insistir na venda e trabalhar as objeções depois"], answer: "c) Antecipar-se e demonstrar segurança ao cliente" },
            { question: "9. “O melhor cliente é aquele que usa muito PIX, Débito e Link de Pagamento”", options: ["Verdadeiro", "Falso"], answer: "Falso" },
            { question: "10. “Cliente que fatura 15.000,00 no Parcelado é o ideal para garantir uma boa parceria”", options: ["Verdadeiro", "Falso"], answer: "Verdadeiro" },
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