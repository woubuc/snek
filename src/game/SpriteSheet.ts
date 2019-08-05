import { TILE_SIZE } from '../const';
import Point, { Coords } from './Point';

type IdentifyFn = (identify : (name : string, x : number, y : number) => void) => void;

export default class SpriteSheet {

	private readonly sheet : PLAYGROUND.Image;
	private readonly tiles : Map<string, Coords> = new Map();

	public constructor(sheet : PLAYGROUND.Image, identify ?: IdentifyFn) {
		this.sheet = sheet;

		if (identify) {
			identify(this.identify.bind(this));
		}
	}

	public identify(name : string, x : number, y : number) : void {
		this.tiles.set(name, { x, y });
	}

	public drawTile(ctx : PLAYGROUND.Application, name : number | string, position : Point) : void {
		let tile = { x: 0, y: 0 };
		if (typeof name === 'string') {
			const t = this.tiles.get(name);
			if (!t) throw new Error('Could not find sprite ' + name + ' on sheet');
			tile = t;
		} else {
			tile.x = name;
		}

		ctx.layer.drawImage(
			this.sheet,
			tile.x * TILE_SIZE,
			tile.y * TILE_SIZE,
			TILE_SIZE,
			TILE_SIZE,
			position.x * TILE_SIZE,
			position.y * TILE_SIZE,
			TILE_SIZE,
			TILE_SIZE
		);
	}

	public static snek(ctx : PLAYGROUND.Application) : SpriteSheet {
		return new SpriteSheet(ctx.images['snek'], identify => {
			identify('head_up', 0, 0);
			identify('head_right', 0, 1);
			identify('head_down', 0, 2);
			identify('head_left', 0, 3);

			identify('head_open_up', 1, 0);
			identify('head_open_right', 1, 1);
			identify('head_open_down', 1, 2);
			identify('head_open_left', 1, 3);

			identify('body_vertical', 2, 0);
			identify('body_horizontal', 2, 1);

			identify('body_corner_up_right', 3, 0);
			identify('body_corner_up_left', 4, 0);
			identify('body_corner_down_right', 3, 1);
			identify('body_corner_down_left', 4, 1);

			identify('tail_down', 2, 2);
			identify('tail_up', 2, 3);
			identify('tail_right', 3, 2);
			identify('tail_left', 4, 2);
		});
	}
}
