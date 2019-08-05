const TILE_SIZE = 16;
const MAP_HEIGHT = 16;
const MAP_WIDTH = 24;
const START_TIME_MS = 150;

const Dir = Object.freeze({
	Up: Symbol('up'),
	Down: Symbol('down'),
	Left: Symbol('left'),
	Right: Symbol('right'),
});

function invertDir(dir) {
	switch (dir) {
		case Dir.Up: return Dir.Down;
		case Dir.Down: return Dir.Up;
		case Dir.Left: return Dir.Right;
		case Dir.Right: return Dir.Left;
	}
}

const timer = createTimer();
const snek = createSnek();

function getPartTilePosition(partDir, previousPartDir) {
	let tileX = 0;
	let tileY = 0;

	// Tails have no previous part
	if (!previousPartDir) {
		switch (partDir) {
			case Dir.Up: return [2, 3];
			case Dir.Down: return [2, 2];
			case Dir.Left: return [4, 2];
			case Dir.Right: return [3, 2];
		}
	}

	if (partDir === previousPartDir) {
		if (partDir === Dir.Up || partDir === Dir.Down) return [2, 0];
		return [2, 1];
	}

	const pair = (from, to, part, previous) => {
		if (previous === from && part === to) return true;
		if (previous === invertDir(to) && part === invertDir(from)) return true;
		return false;
	};

	if (pair(Dir.Up, Dir.Right, partDir, previousPartDir)) return [3, 0];
	if (pair(Dir.Up, Dir.Left, partDir, previousPartDir)) return [4, 0];
	if (pair(Dir.Down, Dir.Right, partDir, previousPartDir)) return [3, 1];
	if (pair(Dir.Down, Dir.Left, partDir, previousPartDir)) return [4, 1];
}

function createSnek() {
	const x = Math.floor(MAP_WIDTH / 2);
	const y = Math.floor(MAP_HEIGHT / 2);

	function renderHead(ctx, snek) {
		const next = translatePointByDirection(snek.head, snek.direction);
		const mouthOpen = pointsEqual(next, snek.food) || snek.containsPart(next);

		const tileX = mouthOpen ? 1 : 0;

		let tileY = 0;
		const direction = snek.parts[0].direction;

		if (direction === Dir.Up) tileY = 0;
		else if (direction === Dir.Right) tileY = 1;
		else if (direction === Dir.Down) tileY = 2;
		else tileY = 3;

		let [x, y] = snek.head;

		x = Math.round(x * TILE_SIZE);
		y = Math.round(y * TILE_SIZE);

		ctx.layer.drawImage(ctx.images['snek'], tileX * TILE_SIZE, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
	}

	function renderPart(ctx, currentPart, previousPart) {
		const [tileX, tileY] = getPartTilePosition(currentPart.direction, previousPart ? previousPart.direction : undefined);
		let [x, y] = currentPart.position;

		x = Math.round(x * TILE_SIZE);
		y = Math.round(y * TILE_SIZE);

		ctx.layer.drawImage(ctx.images['snek'], tileX * TILE_SIZE, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE, x, y, TILE_SIZE, TILE_SIZE);
	}

	const snek = Object.seal({
		head: [x, y],
		direction: Dir.Right,

		food: [],
		foodStep: 0,

		score: 0,

		parts: [
			createPart([x - 1, y], Dir.Right),
			createPart([x - 2, y], Dir.Right),
		],

		setDirection(dir) {
			if (pointsEqual(translatePointByDirection(this.head, dir), this.parts[0].position)) return;
			this.direction = dir;
		},

		render(ctx, delta) {
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

			// Render food
			if (this.foodStep < 3) this.foodStep += delta * 6;

			const [foodX, foodY] = this.food;
			const foodTileX = Math.round(this.foodStep);
			ctx.layer.drawImage(ctx.images['food'], foodTileX * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE, foodX * TILE_SIZE, foodY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		},

		tick() {
			const next = translatePointByDirection(this.head, this.direction);

			if (this.containsPart(next)) return; // TODO game over

			if (pointsEqual(next, this.food)) {
				this.food = generateFoodPosition(this);
				this.foodStep = 0;
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

			timer += Math.round(timerResetValue);
			return true;
		},

		reset() {
			timer = Math.round(timerResetValue);
		},

		increaseGameSpeed() {
			timerResetValue *= 0.998;
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
		this.layer.clear("#ffffb5");
		snek.render(this, delta);
	},
});
