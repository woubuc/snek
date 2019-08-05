import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from './const';
import { getDomElement } from './game/util';
import LoadingState from './loading/LoadingState';
import GameState from './game/GameState';

PLAYGROUND.LoadingScreen = LoadingState;

new PLAYGROUND.Application({
	width: MAP_WIDTH * TILE_SIZE,
	height: MAP_HEIGHT * TILE_SIZE,
	scale: 1,
	smoothing: false,

	container: getDomElement('canvas-container'),

	create() {
		this.loadImage('snek');
		this.loadImage('food');
	},

	ready() {
		this.setState(GameState);
		getDomElement('loading').remove();
		getDomElement('frame').style.display = 'block';
	},
});
