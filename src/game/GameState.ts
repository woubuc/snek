import Point from './Point';
import SnekPart from './SnekPart';
import Timer from './Timer';
import { MAP_HEIGHT, MAP_WIDTH } from '../const';
import { Direction } from './Direction';
import { getDomElement } from '../util/dom';
import SpriteSheet from './SpriteSheet';

let food! : Point;
let foodAnimation : number = 0;
let foodAnimationTimer : number = 0;

let head! : Point;
let headDirection! : Direction;
let headSprite : string = '';

/** Contains the snek parts in reverse order (index 0 is the tail end) */
let parts : SnekPart[] = [];

const timer = new Timer();

let snekSheet! : SpriteSheet;
let foodSheet! : SpriteSheet;

let nextHeadPosition! : Point;
let snekWillEatNextTick : boolean = false;

let score : number = 0;

function isSnekAt(position : Point) : boolean {
	if (head.equals(position)) return true;
	return parts.some(p => p.position.equals(position));
}

function updateHead() : void {
	nextHeadPosition = head.translate(headDirection);
	snekWillEatNextTick = nextHeadPosition.equals(food) || isSnekAt(nextHeadPosition);

	const firstPartDirection = parts[parts.length - 1].direction;
	headSprite = `head${ snekWillEatNextTick ? '_open' : '' }_${ firstPartDirection.toString() }`;
}

function generateNewFood() : void {
	while (true) {
		const point = Point.random();
		if (isSnekAt(point)) continue;

		food = point;
		foodAnimation = 0;
		break;
	}
}

function setDirection(direction : Direction) {
	headDirection = direction;
	updateHead();
}

function increaseScore(amount : number = 1) : void {
	score += amount;
	getDomElement('score').innerText = score.toFixed(0);
}

function tick() : void {
	if (isSnekAt(nextHeadPosition)) return; // TODO game over

	if (nextHeadPosition.equals(food)) {
		increaseScore();
		generateNewFood();
		timer.increaseGameSpeed();
	} else {
		parts.shift();
	}

	parts.push(new SnekPart(head, headDirection));

	head = nextHeadPosition;
	setDirection(headDirection);

	let lastPart : SnekPart | undefined = undefined;
	for (const part of parts) {
		part.updateSprite(lastPart);
		lastPart = part;
	}

	updateHead();
}

const GameState : PLAYGROUND.StateEvents = {
	enter() : void {
		timer.reset();

		snekSheet = SpriteSheet.snek(this.app);
		foodSheet = new SpriteSheet(this.app.images['food']);

		const startX = Math.floor(MAP_WIDTH / 3);
		const startY = Math.floor(MAP_HEIGHT / 2);

		head = new Point(startX, startY);
		headDirection = Direction.Right;
		parts.unshift(new SnekPart(new Point(startX - 1, startY), Direction.Right));
		parts.unshift(new SnekPart(new Point(startX - 2, startY), Direction.Right));

		nextHeadPosition = new Point(startX + 1, startY);

		generateNewFood();
		updateHead();
	},

	step(delta : number) : void {
		delta = delta * 1000; // Milliseconds pls

		if (foodAnimation < 3) {
			foodAnimationTimer -= delta;
			if (foodAnimationTimer < 0) {
				foodAnimation++;
				foodAnimationTimer += 150;
			}
		}

		if (timer.isTick(delta)) {
			tick();
		}
	},

	render(delta : number) : void {
		this.app.layer.clear("#ffffb5");

		// Render parts
		for (const part of parts) {
			part.render(this.app, snekSheet);
		}

		// Render head
		snekSheet.drawTile(this.app, headSprite, head);

		// Render food
		foodSheet.drawTile(this.app, foodAnimation, food);
	},

	keydown({ key } : PLAYGROUND.KeyEvent) : void {
		switch (key) {
			case 'up':
			case 'z':
			case 'w':
				setDirection(Direction.Up);
				break;

			case 'down':
			case 's':
				setDirection(Direction.Down);
				break;

			case 'left':
			case 'a':
			case 'q':
				setDirection(Direction.Left);
				break;

			case 'right':
			case 'd':
				setDirection(Direction.Right);
				break;
		}
	},
};

export default GameState;
