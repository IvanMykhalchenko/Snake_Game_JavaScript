class Snake {
	// DOM элементы
	constructor(options) {
	this.wrapper = document.querySelector(options.wrapperSelector);
	this.field = document.querySelector(options.fieldSelector);
	this.blueTheme = document.querySelector(options.blueThemeSelector);
	this.redTheme = document.querySelector(options.redThemeSelector);
	this.greenTheme = document.querySelector(options.greenThemeSelector);
	this.intervalSpeedMc = options.intervalSpeedMc;
		this.SNAKE = options.ourSnake;
	
		this.headSNAKE = this.SNAKE[0];
		this.timerObject = {
			timerMoveUp: 0,
			timerMoveDown: 0,
			timerMoveLeft: 0,
			timerMoveRight: 0
	
		}

	// Вызов инициализации
	this.init();
	this.timerControl;
	/*Объект таймеров для включения/отключения движения */

	/*Объет для отслеживания поворотов при нажатии клавиш. Сюда будем записывать координаты, 
	на которых случился поворот, чтобы остальная часть змеи приползла до эти координат */

	}
	

	//Инициализация игры
	init () {
		this._createBackgroundField('blue');
		this.chooseThemes();
		this._renderSnake();
		this.startMoveSnake();
		this.timerControl = setInterval(() => {
			this.controlSides();
		}, 500)
		this.turnSnake();

	}
	// Выбираем тему игры/цвет. Создаем новый макет по клику на кнопки тем
chooseThemes () {
	var self = this;
	function checkClass() {
		if(this.classList.contains('snake__themes_blue')) {
			
			self._createBackgroundField('blue')
		} else if (this.classList.contains('snake__themes_red')) {
			
			self._createBackgroundField('red')	
		} else if (this.classList.contains('snake__themes_green')) {
		
			self._createBackgroundField('green')
		}
	}

	this.blueTheme.addEventListener('click', checkClass);
	this.redTheme.addEventListener('click', checkClass);
	this.greenTheme.addEventListener('click', checkClass);

}
// Удаляем предыдущий макет, чтобы поместить новый.
deleteFieldSquare () {
	this.field.children[0].remove();
}
/*Cоздаем макет. Заполняем поле. При этом очищаем поле при каждом вызове, чтобы не разросталось дерево DOM. Проверяем и удаляем
  нужные нам классы, чтобы применить стили
*/
_createBackgroundField (color) {
	var classField = this.wrapper.classList;
	this.deleteFieldSquare();
	var fieldWrapper = document.createElement('div');
	fieldWrapper.className = 'snake__wrapper_insideField';
	for(let i = 0; i < 540; i++) {
			var div = document.createElement('div');
			div.className = 'snake__field_square';
			if(color === 'green'){
				if(classField.contains('snake__wrapper_blue') || classField.contains('snake__wrapper_red') ){
					classField.remove('snake__wrapper_blue');
					classField.remove('snake__wrapper_red');

				}
				this.wrapper.classList.add('snake__wrapper_green');
				div.classList.add('green')
			} else if(color === 'blue') {
				if(classField.contains('snake__wrapper_red') || classField.contains('snake__wrapper_green') ){
					classField.remove('snake__wrapper_red');
					classField.remove('snake__wrapper_green');

				}
				this.wrapper.classList.add('snake__wrapper_blue');
				div.classList.add('blue')
			} else if(color === 'red') {
				if(classField.contains('snake__wrapper_green') || classField.contains('snake__wrapper_blue') ){
					classField.remove('snake__wrapper_green');
					classField.remove('snake__wrapper_red');

				}
				this.wrapper.classList.add('snake__wrapper_red');
				div.classList.add('red')
			}
			fieldWrapper.appendChild(div);
		}
		this.field.appendChild(fieldWrapper);
}

_renderSnake () {
	var self = this;
	var Snake = document.querySelectorAll(this.SNAKE);
	var snakeHead = Snake[0];
	
	
	// Рандомно получаем top или left для позиционирования кубиков змеи. Учитываем чтобы змея попадала точно в линии
	function randowPosition() {
		var random = Math.round(Math.random() * 100 ) * Math.round(self.wrapper.offsetHeight/100);
		var diferent = random % 20;
		if( diferent !== 0) {
			var plus = 20 - diferent;
			random += plus;
		}
		return {
			top: random + 'px',
			left: random + 'px'
		}
	}
	var positions = randowPosition();
	

	// Учитываем, чтобы змея не вылазила за контейнер
		if(parseInt(positions.left) > 540) {
			snakeHead.style.left = '540px';
		} else if(parseInt(positions.left) < 100) {
			snakeHead.style.left = '100px';
		}
		else {
			snakeHead.style.left = positions.left;
		}
		
		if(parseInt(positions.top) > 300) {
			snakeHead.style.top = '300px';
		} else if(parseInt(positions.top) < 100) {
			snakeHead.style.top = '100px';
		}
		else {
			snakeHead.style.top = positions.top;
		}
		//Позиционируем остальные кубики змеи
		//Все функции поместил в объект. В дальнейшем буду их вызывать в зависимости от позицыонирования головы змейки
	var objectFunctionsPosiotionsBodySnake = {
		changeTop: function() {
			for(let i = 1; i < Snake.length; i++) {
					Snake[i].style.left = snakeHead.style.left;
					Snake[i].style.top = parseInt(snakeHead.style.top) - Snake[i].dataset.number * 20 + 'px';
					
				}
			},
		changeBottom: function() {
			for(let i = 1; i < Snake.length; i++) {
				Snake[i].style.left = snakeHead.style.left;
				Snake[i].style.top = parseInt(snakeHead.style.top) + Snake[i].dataset.number * 20 + 'px';
					
				}
			},
		changeRight: function() {
			for(let i = 1; i < Snake.length; i++) {
				Snake[i].style.top = snakeHead.style.top;
				Snake[i].style.left = parseInt(snakeHead.style.left) - Snake[i].dataset.number * 20 + 'px';
					
				}
			}			
		}
		//Смотрим позицию головы и рендерим тело
		function showSnake() {
			var random = Math.round(Math.random() * 10);
			var head = snakeHead.style;
			if(parseInt(head.top) > 200) {
				objectFunctionsPosiotionsBodySnake.changeTop();
			}

			

				if(random <= 5) {
					objectFunctionsPosiotionsBodySnake.changeRight();
				} else if(random > 5) {
					objectFunctionsPosiotionsBodySnake.changeBottom();
				}
				
		}
		showSnake();
		//Меняем цвет змеи если изменили тему
	function changeColor() {
		for(let i = 0; i < Snake.length; i++) {
			Snake[i].style.backgroundColor = getComputedStyle(self.wrapper).borderColor;
		}
	}	
	
	setInterval(() => {
		changeColor()
	}, 100)


	
}

/* Функции движения. Смотрим на голову змеи и за ней передавигаем все тело. Сделаю метод, который будет возвращать функции для использования.
	В дальнейшем при смене движения через клавиатуру, буду их переключать.
*/
movingFunctions() {
	var Snake = document.querySelectorAll(this.SNAKE);
	var snakeHead = Snake[0];
	return {
		moveToRight: () => {
			for(let i = 0; i < Snake.length; i++) {
				Snake[i].style.left = parseInt(Snake[i].style.left) +  20 + 'px';
			}
		},
		moveToLeft: () => {
			for(let i = 0; i < Snake.length; i++) {
				Snake[i].style.left = parseInt(Snake[i].style.left) -  20 + 'px';
			}
		},
		moveToUp: () => {
			for(let i = 0; i < Snake.length; i++) {
				Snake[i].style.top = parseInt(Snake[i].style.top) - 20 + 'px';
			}
		},
		moveToDown: () => {
			for(let i = 0; i < Snake.length; i++) {
				Snake[i].style.top = parseInt(Snake[i].style.top) +  20 + 'px';
			}
		}
	}
}

/*Теперь нужно посмотреть как расположилась змейка на экране и вызвать в SetInterval функцию движения */

startMoveSnake() {
	var Snake = document.querySelectorAll(this.SNAKE);
	var snakeHead = Snake[0];
	var movingFunctions = this.movingFunctions();
	if(parseInt(snakeHead.style.left) > parseInt(Snake[1].style.left)) {
		this.timerObject.timerMoveRight = setInterval(() => {
			movingFunctions.moveToRight();
		}, this.intervalSpeedMc)	
	} else if(parseInt(snakeHead.style.top) < parseInt(Snake[1].style.top)) {
		this.timerObject.timerMoveUp = setInterval(() => {
			movingFunctions.moveToUp();
		}, this.intervalSpeedMc)
	} else if(parseInt(snakeHead.style.top) > parseInt(Snake[1].style.top)) {
		this.timerObject.timerMoveDown = setInterval(() => {
			movingFunctions.moveToDown();
		}, this.intervalSpeedMc)
	}
}
/*Метод который контролирует выползание змейки за граници поля. Когда змейка достигает края, копируем ее тело и вставялем с 
противоположной стороны. Удаление выползшей змейки будет контролировать другой метод */
controlSides() {
	var movingFunctions = this.movingFunctions();
	var Snake = document.querySelectorAll(this.SNAKE);
	var SnakeOutside = Array.prototype.slice.call(Snake, 0);
	// console.log(SnakeOutside);
	var objTopLeft = {
		topUp: -20,
		topDown: 380,
		leftLeft: -20,
		leftRight: 600
	}
	for(let i = 0; i < SnakeOutside.length; i++) {
		//Если выпозла за поле сверху
		if(Snake[i].style.top === '-40px' && this.timerObject.timerMoveUp) {
			if(i == 0) {
			let elem = this.wrapper.removeChild(Snake[i]);
			elem.style.top = objTopLeft.topDown + 'px';
			setTimeout(() => {
				this.wrapper.append(elem);
			}, 0);
		} else if(i != 0){
			let elem = this.wrapper.removeChild(Snake[i]);
			elem.style.top = objTopLeft.topDown + i * 20 + 'px';
			setTimeout(() => {
				this.wrapper.append(elem);
			}, 0);
		
			} 
	}
		// Если выползла за край снизу
		if(Snake[i].style.top === '380px' && this.timerObject.timerMoveDown) {
			if(i == 0) {
			let elem = this.wrapper.removeChild(Snake[i]);
			elem.style.top = objTopLeft.topUp + 'px';
			setTimeout(() => {
				this.wrapper.append(elem);
			}, 0);
		} else if(i != 0){
			let elem = this.wrapper.removeChild(Snake[i]);
			elem.style.top = objTopLeft.topUp - i * 20 + 'px';
			setTimeout(() => {
				this.wrapper.append(elem);
			}, 0);
		
			}
	}
		// //Если выползла скрая справа
		if(Snake[i].style.left === '640px' && this.timerObject.timerMoveRight) {
			if(i == 0) {
			let elem = this.wrapper.removeChild(Snake[i]);
			elem.style.left = objTopLeft.leftLeft + 'px';
			// setTimeout(() => {
				this.wrapper.append(elem);
			// }, 0);
		} else if(i != 0){
			let elem = this.wrapper.removeChild(Snake[i]);
			elem.style.left = objTopLeft.leftLeft - i * 20 + 'px';
			// setTimeout(() => {
				this.wrapper.append(elem);
			// }, 0);
		
			}
	}
	// Если выползла скрая слева
	if(Snake[i].style.left === '-40px' && this.timerObject.timerMoveLeft) {
		if(i == 0) {
		let elem = this.wrapper.removeChild(Snake[i]);
		elem.style.left = objTopLeft.leftRight + 'px';
		// setTimeout(() => {
			this.wrapper.append(elem);
		// }, 0);
	} else if(i != 0){
		let elem = this.wrapper.removeChild(Snake[i]);
		elem.style.left = objTopLeft.leftRight + i * 20 + 'px';
		// setTimeout(() => {
			this.wrapper.append(elem);
		// }, 0);
	
		}
}
	}
	
	

}

	/*Метод для поворотов при нажатии клавиш стрелок. Вешаю обработчик событий KEYDOWN, при нажатии приверяю клавишу и в какую сторону 
	дивается змея. Если клавиша совпадает с движением, ничего не делаем.  */
	turnSnake () {

	var Snake = document.querySelectorAll(this.SNAKE);
		
		var movingFunctions = this.movingFunctions();
		document.body.onkeydown = (e) => {
		

			


			if(e.keyCode === 38  && this.timerObject.timerMoveUp === 0) {	
				console.log('UP');
				Snake[0].style.top = parseInt(Snake[0].style.top) - 20 + 'px';
				clearInterval(this.timerObject.timerMoveRight);
				clearInterval(this.timerObject.timerMoveLeft);
				clearInterval(this.timerObject.timerMoveDown);	

				this.timerObject.timerMoveRight = 0;
				this.timerObject.timerMoveLeft = 0;
				this.timerObject.timerMoveDown = 0;

				

				this.timerObject.timerMoveUp = setInterval(()=> {
					movingFunctions.moveToUp();
				}, this.intervalSpeedMc)
			}
			
			else if (e.keyCode === 37 && this.timerObject.timerMoveLeft === 0) {
				
				console.log('LEFT');
				clearInterval(this.timerObject.timerMoveRight);
				clearInterval(this.timerObject.timerMoveUp);
				clearInterval(this.timerObject.timerMoveDown);

				this.timerObject.timerMoveRight = 0;
				this.timerObject.timerMoveUp = 0;
				this.timerObject.timerMoveDown = 0;

				this.timerObject.timerMoveLeft = setInterval(()=> {
					movingFunctions.moveToLeft();
				}, this.intervalSpeedMc)
			}
			
			else if (e.keyCode === 39 && this.timerObject.timerMoveRight === 0) {
				console.log('RIGHT');
				clearInterval(this.timerObject.timerMoveUp);
				clearInterval(this.timerObject.timerMoveLeft);
				clearInterval(this.timerObject.timerMoveDown);

				this.timerObject.timerMoveUp = 0;
				this.timerObject.timerMoveLeft = 0;
				this.timerObject.timerMoveDown = 0;

				
				this.timerObject.timerMoveRight = setInterval(()=> {
					movingFunctions.moveToRight();
				}, this.intervalSpeedMc)
			}
			
			else if (e.keyCode === 40 && this.timerObject.timerMoveDown === 0) {
				console.log('DOWN');
				clearInterval(this.timerObject.timerMoveRight);
				clearInterval(this.timerObject.timerMoveLeft);
				clearInterval(this.timerObject.timerMoveUp);

				this.timerObject.timerMoveRight = 0;
				this.timerObject.timerMoveLeft = 0;
				this.timerObject.timerMoveUp = 0;

				
				this.timerObject.timerMoveDown = setInterval(()=> {
					movingFunctions.moveToDown();
				}, this.intervalSpeedMc)
			}
			console.log(this.timerObject);
			
		}
	} 
}






var options = {
	wrapperSelector: '.snake__wrapper',
	fieldSelector: '.snake__field',
	blueThemeSelector: '.snake__themes_blue',
	redThemeSelector: '.snake__themes_red',
	greenThemeSelector: '.snake__themes_green',
	ourSnake: '.snake__square',
	intervalSpeedMc: 500

}
new Snake(options);