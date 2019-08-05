import { Direction } from './Direction';
import { MAP_HEIGHT, MAP_WIDTH, TILE_SIZE } from '../const';

export interface Coords {
	x : number;
	y : number;
}

export default class Point implements Coords {

	public readonly x : number;
	public readonly y : number;

	public constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}

	public static random() : Point {
		const x = Math.floor(Math.random() * MAP_WIDTH);
		const y = Math.floor(Math.random() * MAP_HEIGHT);

		return new Point(x, y);
	}

	public equals(other : Point) : boolean {
		return this.x === other.x && this.y === other.y;
	}

	public translate(dir : Direction) : Point {
		let x = this.x;
		let y = this.y;

		if      (dir === Direction.Up)    y--;
		else if (dir === Direction.Down)  y++;
		else if (dir === Direction.Left)  x--;
		else if (dir === Direction.Right) x++;

		if (x < 0) x = MAP_WIDTH - 1;
		if (x >= MAP_WIDTH) x = 0;

		if (y < 0) y = MAP_HEIGHT - 1;
		if (y >= MAP_HEIGHT) y = 0;

		return new Point(x, y);
	}

	public add(other : Coords) : Coords {
		return new Point(this.x + other.x, this.y + other.y);
	}

	public toScreen() : Coords {
		return {
			x: this.x * TILE_SIZE,
			y: this.y * TILE_SIZE,
		};
	}
}
