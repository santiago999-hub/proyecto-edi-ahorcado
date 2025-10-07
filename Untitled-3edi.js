script.js.
let currentWord = "";
let guessedWord = [];
let wrongGuesses = 0;
let maxWrongGuesses = 6;
let usedLetters = [];
let gameOver = false;

// Lista de palabras para el juego
const words = [
    'JAVASCRIPT', 'PROGRAMACION', 'COMPUTADORA', 'DESARROLLO', 'TECNOLOGIA',
    'INTERNET', 'NAVEGADOR', 'CODIGO', 'ALGORITMO', 'VARIABLE',
    'FUNCION', 'OBJETO', 'ARRAY', 'BUCLE', 'CONDICION',
    'CLASE', 'METODO', 'PROPIEDAD', 'EVENTO', 'ELEMENTO',
    'DOCUMENTO', 'VENTANA', 'BOTON', 'FORMULARIO', 'ENTRADA',
    'SALIDA', 'DATOS', 'ARCHIVO', 'CARPETA', 'SISTEMA',
    'MEMORIA', 'PROCESADOR', 'PANTALLA', 'TECLADO', 'RATON',
    'SERVIDOR', 'CLIENTE', 'BASE', 'TABLA', 'CONSULTA'
];

// Elementos del DOM
const wordContainer = document.getElementById('word-container');
const attemptsSpan = document.getElementById('attempts');
const usedLettersSpan = document.getElementById('used-letters');
const gameMessage = document.getElementById('game-message');
const alphabetContainer = document.getElementById('alphabet');
const messageArea = document.querySelector('.message-area');

// Función para inicializar el juego
function initGame() {
    // Seleccionar una palabra aleatoria
    currentWord = words[Math.floor(Math.random() * words.length)];
    
    // Inicializar variables
    guessedWord = Array(currentWord.length).fill('_');
    wrongGuesses = 0;
    usedLetters = [];
    gameOver = false;
    
    // Actualizar la interfaz
    updateWordDisplay();
    updateGameInfo();
    createAlphabet();
    updateMessage('¡Adivina la palabra!', 'normal');
    
    console.log('Palabra secreta:', currentWord); // Para debugging (quitar en producción)
}

// Función para crear los botones del alfabeto
function createAlphabet() {
    alphabetContainer.innerHTML = '';
    const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
    
    for (let letter of alphabet) {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'letter-btn';
        button.onclick = () => guessLetter(letter);
        alphabetContainer.appendChild(button);
    }
}

// Función para manejar la selección de una letra
function guessLetter(letter) {
    // Verificar si el juego ha terminado o la letra ya fue usada
    if (gameOver || usedLetters.includes(letter)) {
        return;
    }
    
    // Agregar la letra a las usadas
    usedLetters.push(letter);
    
    // Deshabilitar el botón de la letra
    const buttons = document.querySelectorAll('.letter-btn');
    buttons.forEach(btn => {
        if (btn.textContent === letter) {
            btn.disabled = true;
        }
    });
    
    // Verificar si la letra está en la palabra
    if (currentWord.includes(letter)) {
        // Letra correcta: revelar todas las ocurrencias
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) {
                guessedWord[i] = letter;
            }
        }
        updateMessage('¡Bien! La letra "' + letter + '" está en la palabra.', 'normal');
    } else {
        // Letra incorrecta: aumentar intentos fallidos
        wrongGuesses++;
        updateMessage('La letra "' + letter + '" no está en la palabra.', 'normal');
    }
    
    // Actualizar la interfaz
    updateWordDisplay();
    updateGameInfo();
    
    // Verificar si el juego ha terminado
    checkGameEnd();
}

// Función para actualizar la visualización de la palabra
function updateWordDisplay() {
    wordContainer.textContent = guessedWord.join(' ');
}

// Función para actualizar la información del juego
function updateGameInfo() {
    attemptsSpan.textContent = maxWrongGuesses - wrongGuesses;
    usedLettersSpan.textContent = usedLetters.join(', ');
}

// Función para actualizar el mensaje del juego
function updateMessage(message, type) {
    gameMessage.textContent = message;
    
    // Remover clases anteriores
    messageArea.classList.remove('win-message', 'lose-message');
    
    // Agregar clase según el tipo
    if (type === 'win') {
        messageArea.classList.add('win-message');
    } else if (type === 'lose') {
        messageArea.classList.add('lose-message');
    }
}

// Función para verificar si el juego ha terminado
function checkGameEnd() {
    // Verificar victoria (todas las letras adivinadas)
    if (!guessedWord.includes('_')) {
        gameOver = true;
        updateMessage('🎉 ¡Felicitaciones! Has ganado. La palabra era: ' + currentWord, 'win');
        disableAllButtons();
        return;
    }
    
    // Verificar derrota (sin intentos restantes)
    if (wrongGuesses >= maxWrongGuesses) {
        gameOver = true;
        updateMessage('😞 Has perdido. La palabra era: ' + currentWord, 'lose');
        disableAllButtons();
        return;
    }
}

// Función para deshabilitar todos los botones del alfabeto
function disableAllButtons() {
    const buttons = document.querySelectorAll('.letter-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
    });
}

// Función para reiniciar el juego
function restartGame() {
    initGame();
}

// Función para manejar teclas del teclado
document.addEventListener('keydown', function(event) {
    const letter = event.key.toUpperCase();
    
    // Verificar si es una letra válida
    if (letter.match(/[A-ZÑ]/) && letter.length === 1) {
        guessLetter(letter);
    }
    
    // Reiniciar con Enter
    if (event.key === 'Enter') {
        restartGame();
    }
});

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

// Función adicional para agregar más palabras (para futuras mejoras)
function addWord(word) {
    if (word && typeof word === 'string') {
        words.push(word.toUpperCase());
        console.log('Palabra agregada:', word.toUpperCase());
    }
}

// Función para obtener estadísticas del juego (para futuras mejoras)
function getGameStats() {
    return {
        currentWord: currentWord,
        guessedLetters: guessedWord.filter(letter => letter !== '_').length,
        totalLetters: currentWord.length,
        wrongGuesses: wrongGuesses,
        attemptsLeft: maxWrongGuesses - wrongGuesses,
        usedLetters: usedLetters,
        gameOver: gameOver
    };
}
