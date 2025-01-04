class PomodoroTimer {
    constructor() {
        this.workTime = 25;
        this.breakTime = 5;
        this.totalPomodoros = 4;
        this.currentPomodoro = 1;
        this.isWorking = true;
        this.timeLeft = this.workTime * 60;
        this.isRunning = false;
        this.timer = null;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.timerDisplay = document.querySelector('.timer');
        this.statusDisplay = document.querySelector('.status');
        this.progressDisplay = document.querySelector('.progress');
        this.startButton = document.getElementById('startButton');
        this.pauseButton = document.getElementById('pauseButton');
        this.resetButton = document.getElementById('resetButton');
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.start());
        this.pauseButton.addEventListener('click', () => this.pause());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    start() {
        if (!this.isRunning) {
            // Pegar valores dos inputs
            this.workTime = parseInt(document.getElementById('workTime').value);
            this.breakTime = parseInt(document.getElementById('breakTime').value);
            this.totalPomodoros = parseInt(document.getElementById('numPomodoros').value);
            
            if (this.timeLeft === this.workTime * 60) {
                this.currentPomodoro = 1;
            }

            this.isRunning = true;
            this.startButton.disabled = true;
            this.pauseButton.disabled = false;
            this.resetButton.disabled = false;

            this.timer = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
    }

    reset() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.isWorking = true;
        this.currentPomodoro = 1;
        this.timeLeft = this.workTime * 60;
        this.updateDisplay();
        this.startButton.disabled = false;
        this.pauseButton.disabled = true;
        this.resetButton.disabled = true;
    }

    tick() {
        this.timeLeft--;
        
        if (this.timeLeft < 0) {
            this.switchMode();
        }
        
        this.updateDisplay();
    }

    switchMode() {
        if (this.isWorking) {
            if (this.currentPomodoro < this.totalPomodoros) {
                this.isWorking = false;
                this.timeLeft = this.breakTime * 60;
                this.playNotification("Hora do descanso!");
            } else {
                this.complete();
                return;
            }
        } else {
            this.isWorking = true;
            this.currentPomodoro++;
            this.timeLeft = this.workTime * 60;
            this.playNotification("Hora de trabalhar!");
        }
    }

    complete() {
        clearInterval(this.timer);
        this.playNotification("Parabéns! Você completou todos os pomodoros!");
        this.reset();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.statusDisplay.textContent = this.isWorking ? 'Trabalho' : 'Descanso';
        this.progressDisplay.textContent = `Pomodoro ${this.currentPomodoro} de ${this.totalPomodoros}`;
    }

    playNotification(message) {
        if (Notification.permission === "granted") {
            new Notification(message);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message);
                }
            });
        }
    }
}

// Inicializar o timer quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 