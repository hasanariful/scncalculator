const starsContainer = document.getElementById('stars');
function createStars() {
    const width = window.innerWidth;
    const starCount = Math.floor(width / 10);
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${Math.random() * 5 + 5}s`;
        starsContainer.appendChild(star);
    }
}
createStars();
window.addEventListener('resize', () => {
    starsContainer.innerHTML = '';
    createStars();
});

const display = document.getElementById('display');
const historyList = document.getElementById('history');
let history = [];

// Helper function for degrees to radians
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

// Custom functions for square and cube
function sqr(x) {
    return x * x;
}

function cube(x) {
    return x * x * x;
}

function appendToDisplay(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let originalExpression = display.value; // Store the original input
        let expression = originalExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/sin\(([^)]+)\)/g, 'Math.sin(degToRad($1))')
            .replace(/cos\(([^)]+)\)/g, 'Math.cos(degToRad($1))')
            .replace(/tan\(([^)]+)\)/g, 'Math.tan(degToRad($1))')
            .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
            .replace(/cbrt\(([^)]+)\)/g, 'Math.cbrt($1)')
            .replace(/pow\(([^,]+),([^)]+)\)/g, 'Math.pow($1,$2)')
            .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
            .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
            .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
            .replace(/sqr\(([^)]+)\)/g, 'sqr($1)')
            .replace(/cube\(([^)]+)\)/g, 'cube($1)');

        let result = eval(expression);
        if (isNaN(result)) {
            display.value = 'Syntax Error';
        } else if (!isFinite(result)) {
            display.value = 'Undefined';
        } else {
            let formattedResult = Number.isInteger(result) ? result : result.toFixed(4);
            display.value = formattedResult; // Show only result in display
            history.push(`${originalExpression} = ${formattedResult}`); // Full expression in history
            updateHistory();
        }
    } catch (error) {
        display.value = 'Syntax Error';
        setTimeout(clearDisplay, 1000);
    }
}

function differentiate() {
    let expr = display.value.trim();
    try {
        if (expr.includes('x^')) {
            let [coeff, power] = expr.split('x^');
            coeff = coeff ? parseFloat(coeff) : 1;
            power = parseFloat(power);
            let newCoeff = coeff * power;
            let newPower = power - 1;
            let result = newPower === 0 ? newCoeff : `${newCoeff}*x^${newPower}`;
            display.value = result; // Show only result in display
            history.push(`d/dx(${expr}) = ${result}`); // Full expression in history
            updateHistory();
        } else if (expr.includes('x')) {
            let coeff = expr.replace('*x', '') || 1;
            display.value = coeff;
            history.push(`d/dx(${expr}) = ${coeff}`);
            updateHistory();
        } else {
            display.value = '0';
            history.push(`d/dx(${expr}) = 0`);
            updateHistory();
        }
    } catch (error) {
        display.value = 'Syntax Error';
        setTimeout(clearDisplay, 1000);
    }
}

function integrate() {
    let expr = display.value.trim();
    try {
        let fn = x => eval(expr.replace(/x/g, x));
        let a = 0, b = parseFloat(expr.match(/\d+$/) || 1), n = 100;
        let h = (b - a) / n;
        let sum = 0.5 * (fn(a) + fn(b));
        for (let i = 1; i < n; i++) {
            sum += fn(a + i * h);
        }
        let result = h * sum;
        if (isNaN(result)) {
            display.value = 'Syntax Error';
        } else {
            let formattedResult = Number.isInteger(result) ? result : result.toFixed(4);
            display.value = formattedResult; // Show only result in display
            history.push(`∫(${expr})dx from 0 to ${b} = ${formattedResult}`); // Full expression in history
            updateHistory();
        }
    } catch (error) {
        display.value = 'Syntax Error';
        setTimeout(clearDisplay, 1000);
    }
}

function rms() {
    let nums = display.value.split(',').map(Number);
    if (nums.length === 0 || nums.some(isNaN)) {
        display.value = 'Syntax Error';
        setTimeout(clearDisplay, 1000);
        return;
    }
    let meanSquare = nums.reduce((sum, x) => sum + x * x, 0) / nums.length;
    let result = Math.sqrt(meanSquare);
    if (isNaN(result)) {
        display.value = 'Syntax Error';
    } else {
        let formattedResult = Number.isInteger(result) ? result : result.toFixed(4);
        display.value = formattedResult; // Show only result in display
        history.push(`RMS(${nums.join(',')}) = ${formattedResult}`); // Full expression in history
        updateHistory();
    }
}

function updateHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.className = 'history-item p-2 bg-gray-100 rounded-lg text-sm sm:text-base';
        li.addEventListener('click', () => {
            // Extract the expression before the '=' sign
            const expression = item.split(' = ')[0];
            display.value = expression; // Load only the expression into the display
        });
        historyList.appendChild(li);
    });
    historyList.scrollTop = historyList.scrollHeight;
}

function clearHistory() {
    history = [];
    updateHistory();
}