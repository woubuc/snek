import { Direction, invertDirection } from './Direction';

function checkSnekPartCornerPair(from : Direction, to : Direction, partDir : Direction, previousPartDir : Direction) : boolean {
	if (previousPartDir === from && partDir === to) return true;
	if (previousPartDir === invertDirection(to) && partDir === invertDirection(from)) return true;
	return false;
}

export function getSnekPartSheetPosition(partDir : Direction, previousPartDir? : Direction) : string {
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

export function getDomElement(id : string) : HTMLElement {
	const element = document.getElementById(id);
	if (!element) throw new Error('Element #' + id + ' does not exist');
	return element;
}
