let starsContainer = document.getElementById('stars');
        function createStars() {
            let width = window.innerWidth;
            let starCount = Math.floor(width / 10); // Scaling stars with screen width
            for (let a = 0; a < starCount; a++) {
                let star = document.createElement('div');
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

        let display = document.getElementById('display');
        let historyList = document.getElementById('history');
        let history = [];

        function appendToDisplay(value) {
            display.value += value;
        }

        function clearDisplay() {
            display.value = '';
        }

        function deleteLast() {
            display.value = display.value.slice(0, -1);
        }

        function calculate() { // calculator functionality---------
            try {
                let expression = display.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/');
                let result = eval(expression);
                if (isNaN(result)) {
                    display.value = 'Syntax Error';
                } else if (!isFinite(result)) {
                    display.value = 'Undefined';
                } else {
                    display.value = result;
                    history.push(`${expression} = ${result}`);
                    updateHistory();
                }
            } catch (error) {
                display.value = 'Syntax Error';
                setTimeout(clearDisplay, 2000);
            }
        }

        function differentiate() { //calculate differentiation------------
            let expr = display.value.trim();
            try {
                if (expr.includes('x^')) {
                    let [coeff, power] = expr.split('x^');
                    coeff = coeff ? parseFloat(coeff) : 1;
                    power = parseFloat(power);
                    let newCoeff = coeff * power;
                    let newPower = power - 1;
                    display.value = newPower === 0 ? newCoeff : `${newCoeff}*x^${newPower}`;
                    history.push(`d/dx(${expr}) = ${display.value}`);
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

        function integrate() {   //calculate differentiation------------
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
                    display.value = result.toFixed(4);
                    history.push(`∫(${expr})dx from 0 to ${b} = ${result.toFixed(4)}`);
                    updateHistory();
                }
            } catch (error) {
                display.value = 'Syntax Error';
                setTimeout(clearDisplay, 1000);
            }
        }

        function rms() {  //calculate RMS value------------
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
                display.value = result.toFixed(4);
                history.push(`RMS(${nums.join(',')}) = ${result.toFixed(4)}`);
                updateHistory();
            }
        }

        function updateHistory() {  //history panel----------------
            historyList.innerHTML = '';
            history.forEach(item => {
                let li = document.createElement('li');
                li.textContent = item;
                li.className = 'p-2 bg-gray-100 rounded-lg text-sm sm:text-base';
                historyList.appendChild(li);
            });
        }

        function clearHistory() {
            history = [];
            updateHistory();
        }