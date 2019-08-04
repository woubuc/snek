const TILE_SIZE = 16;
const MAP_HEIGHT = 16;
const MAP_WIDTH = 24;
const START_TIME_MS = 350;

const Dir = Object.freeze({
	Up: Symbol('up'),
	Down: Symbol('down'),
	Left: Symbol('left'),
	Right: Symbol('right'),
});

const timer = createTimer();
const snek = createSnek();

function getPartTilePosition(direction, previousPartDirection, head = false) {
	let tileX = 0;
	let tileY = 0;

	if (direction === Dir.Up) tileX = 0;
	else if (direction === Dir.Left) tileX = 1;
	else if (direction === Dir.Right) tileX = 2;
	else tileX = 3;

	if (!previousPartDirection) return [8 * TILE_SIZE, tileX * TILE_SIZE];

	if (previousPartDirection === Dir.Up) tileY = 0;
	else if (previousPartDirection === Dir.Right) tileY = 1;
	else if (previousPartDirection === Dir.Down) tileY = 2;
	else tileY = 3;

	if (head) return [tileX * TILE_SIZE, tileY * TILE_SIZE];
	return [(tileX + 4) * TILE_SIZE, tileY * TILE_SIZE];
}

function createSnek() {
	const x = Math.floor(MAP_WIDTH / 2);
	const y = Math.floor(MAP_HEIGHT / 2);

	function renderHead(ctx, snek) {
		const [tileX, tileY] = getPartTilePosition(snek.direction, snek.parts[0].direction, true);
		let [x, y] = snek.head;

		x = Math.round(x * TILE_SIZE);
		y = Math.round(y * TILE_SIZE);

		ctx.layer.drawImage(ctx.images.snek, tileX, tileY, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
	}

	function renderPart(ctx, currentPart, previousPart) {
		const [tileX, tileY] = getPartTilePosition(currentPart.direction, previousPart ? previousPart.direction : undefined);
		let [x, y] = currentPart.position;

		x = Math.round(x * TILE_SIZE);
		y = Math.round(y * TILE_SIZE);

		ctx.layer.drawImage(ctx.images.snek, tileX, tileY, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
	}

	const snek = Object.seal({
		head: [x, y],
		direction: Dir.Right,
		food: [],
		score: 0,

		parts: [
			createPart([x - 1, y], Dir.Right),
			createPart([x - 2, y], Dir.Right),
		],

		setDirection(dir) {
			if (pointsEqual(translatePointByDirection(this.head, dir), this.parts[0].position)) return;
			this.direction = dir;

			timer.reset();
			this.tick();
		},

		render(ctx) {
			renderHead(ctx, this);

			let previousPart;
			let currentPart;

			for (let part of this.parts) {
				currentPart = previousPart;
				previousPart = part;

				if (!currentPart) continue;

				renderPart(ctx, currentPart, previousPart);
			}

			// Render tail
			renderPart(ctx, previousPart, undefined);

			const [foodX, foodY] = this.food;
			ctx.layer.drawImage(ctx.images.food, Math.round(foodX * TILE_SIZE), Math.round(foodY * TILE_SIZE));
		},

		tick() {
			let next = translatePointByDirection(this.head, this.direction);

			if (this.containsPart(next)) return; // TODO game over

			if (pointsEqual(next, this.food)) {
				this.food = generateFoodPosition(this);
				this.score++;
				document.getElementById('score').innerText = this.score.toFixed(0);
				timer.increaseGameSpeed();
			} else {
				this.parts.pop();
			}

			this.parts.unshift(createPart(this.head, this.direction));
			this.head = next;
		},

		containsPart(point) {
			return pointsEqual(this.head, point) || this.parts.some(p => pointsEqual(p.position, point));
		},
	});

	snek.food = generateFoodPosition(snek);

	return snek;
}

function createPart(position, direction) {
	return Object.seal({ position, direction });
}

function translatePointByDirection(point, direction) {
	let [x, y] = point;

	if (direction === Dir.Up) y--;
	else if (direction === Dir.Down) y++;
	else if (direction === Dir.Left) x--;
	else if (direction === Dir.Right) x++;
	else console.error('Invalid direction', direction);

	if (x >= MAP_WIDTH) x -= MAP_WIDTH;
	if (y >= MAP_HEIGHT) y -= MAP_HEIGHT;

	if (x < 0) x += MAP_WIDTH;
	if (y < 0) y += MAP_HEIGHT;

	return [x, y];
}

function pointsEqual(a, b) {
	return a[0] === b[0] && a[1] === b[1];
}

function createTimer() {
	let timer = START_TIME_MS;
	let timerResetValue = START_TIME_MS;

	return Object.freeze({
		isTick(delta) {
			timer -= delta;

			if (timer > 0) return false;

			timer += timerResetValue;
			return true;
		},

		reset() {
			timer = timerResetValue;
		},

		increaseGameSpeed() {
			timerResetValue = Math.round(timerResetValue * 0.98);
		}
	});
}

function generateFoodPosition(snek) {
	while (true) {
		const point = [
			Math.floor(Math.random() * MAP_WIDTH),
			Math.floor(Math.random() * MAP_HEIGHT),
		];

		if (!snek.containsPart(point)) {
			return point;
		}
	}
}

PLAYGROUND.LoadingScreen = false;
PLAYGROUND.Transitions = false;

new PLAYGROUND.Application({
	width: MAP_WIDTH * TILE_SIZE,
	height: MAP_HEIGHT * TILE_SIZE,
	scale: 1,
	smoothing: false,

	container: document.getElementById('canvas-container'),

	create() {
		this.loadImage('snek');
		this.loadImage('food');
	},

	ready() {
		document.getElementById('loading').remove();
		document.getElementById('frame').style.display = 'block';
	},

	keydown({ key }) {

		if (['up', 'z', 'w'].includes(key)) snek.setDirection(Dir.Up);
		if (['down', 's'].includes(key)) snek.setDirection(Dir.Down);
		if (['left', 'a', 'q'].includes(key)) snek.setDirection(Dir.Left);
		if (['right', 'd'].includes(key)) snek.setDirection(Dir.Right);

	},

	step(delta) {
		delta = delta * 1000; // Milliseconds pls

		if (timer.isTick(delta)) {
			snek.tick();
		}
	},

	render(delta) {
		this.layer.clear("#141822");
		snek.render(this);
	},
});
