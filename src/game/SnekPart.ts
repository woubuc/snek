import Point from './Point';
import { Direction } from './Direction';
import { getSnekPartSheetPosition } from './util';
import SpriteSheet from './SpriteSheet';

export default class SnekPart {

	public readonly position : Point;
	public readonly direction : Direction;

	private sheetTile! : string;

	public constructor(position : Point, direction : Direction, previousPart? : SnekPart) {
		this.position = position;
		this.direction = direction;

		this.updateSprite(previousPart);
	}

	public updateSprite(previousPart? : SnekPart) {
		if (previousPart) {
			this.sheetTile = getSnekPartSheetPosition(this.direction, previousPart.direction);
		} else {
			this.sheetTile = getSnekPartSheetPosition(this.direction);
		}
	}

	public render(ctx : PLAYGROUND.Application, sheet : SpriteSheet) : void {
		sheet.drawTile(ctx, this.sheetTile, this.position);
	}
}
