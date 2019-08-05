import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from './const';
import { getDomElement } from './util/dom';
import GameState from './game/GameState';

PLAYGROUND.LoadingScreen = false;
PLAYGROUND.Transitions = false;

new PLAYGROUND.Application({
	width: MAP_WIDTH * TILE_SIZE,
	height: MAP_HEIGHT * TILE_SIZE,
	scale: 1,
	smoothing: false,

	container: getDomElement('canvas-container'),

	preload() {
		this.loadImage('logo');
	},

	create() {
		this.loadImage('snek');
		this.loadImage('food');
	},

	ready() {
		getDomElement('loading').remove();
		getDomElement('frame').style.display = 'block';
		this.setState(GameState);
	},
});
