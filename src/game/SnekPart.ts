import Point from './Point';
import { Direction, invertDirection } from './Direction';
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

function checkSnekPartCornerPair(from : Direction, to : Direction, partDir : Direction, previousPartDir : Direction) : boolean {
	if (previousPartDir === from && partDir === to) return true;
	if (previousPartDir === invertDirection(to) && partDir === invertDirection(from)) return true;
	return false;
}

function getSnekPartSheetPosition(partDir : Direction, previousPartDir? : Direction) : string {

	// Tails have no previous part
	if (!previousPartDir) {
		return `tail_${ partDir.toString() }`;
	}

	// Straight pieces
	if (partDir === previousPartDir) {
		if (partDir === Direction.Up || partDir === Direction.Down) return 'body_vertical';
		return 'body_horizontal';
	}

	// Corners
	if (checkSnekPartCornerPair(Direction.Up, Direction.Right, partDir, previousPartDir)) return 'body_corner_up_right';
	if (checkSnekPartCornerPair(Direction.Up, Direction.Left, partDir, previousPartDir)) return 'body_corner_up_left';
	if (checkSnekPartCornerPair(Direction.Down, Direction.Right, partDir, previousPartDir)) return 'body_corner_down_right';
	if (checkSnekPartCornerPair(Direction.Down, Direction.Left, partDir, previousPartDir)) return 'body_corner_down_left';

	throw new Error('Invalid directions: ' + partDir + ', ' + previousPartDir);
}
