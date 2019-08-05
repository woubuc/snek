declare namespace PLAYGROUND {

	let LoadingScreen : Partial<StateEvents> | false;
	let Transitions : Partial<StateEvents> | false;

	interface KeyEvent {
		key: string;
	}

	interface KeyboardState {
		keys: { [id: string]: boolean }
	}

	type Image = object;
	type Images = { [filename : string] : Image };

	interface RenderLayer {
		clear(colour : string) : void;

		font(fontString : string) : void;
		fillText(text : string, x : number, y : number) : void;

		fillStyle(colour : string) : void;
		strokeStyle(colour : string) : void;
		lineWidth(width : number) : void;

		strokeRect(x : number, y : number, width : number, height : number) : void;
		fillRect(x : number, y : number, width : number, height : number) : void;
		fillCircle(x : number, y : number, radius : number) : void;

		drawImage(image : Image, x : number, y : number) : void;
		drawImage(image : Image, x : number, y : number, width : number, height : number) : void;
		drawImage(image : Image, tileX : number, tileY : number, tileWidth : number, tileHeight : number, x : number, y : number) : void;
		drawImage(image : Image, tileX : number, tileY : number, tileWidth : number, tileHeight : number, x : number, y : number, width : number, height : number) : void;
	}

	interface Events<T> {
		step ?: (this : T, delta: number) => void;
		render ?: (this : T, delta: number) => void;

		keydown ?: (this : T, event: KeyEvent) => void;
		keyup ?: (this : T, event: KeyEvent) => void;

		// TODO add remaining input events
	}

	interface StateEvents extends Events<State> {
		create ?: (this : State) => void;
		enter ?: (this : State) => void;
		leave ?: (this : State) => void;
	}

	interface State {
		readonly app : Application;
	}

	interface ApplicationConfig extends Events<Application> {
		width: number;
		height: number;
		scale: number;
		smoothing: boolean;

		container: string | HTMLElement;

		create ?: (this : Application) => void;
		preload ?: (this : Application) => void;
		ready ?: (this : Application) => void;
		resize ?: (this : Application) => void;

		createstate ?: (this : Application) => void;
		enterstate ?: (this : Application) => void;
		leavestate ?: (this : Application) => void;

		keydown ?: (this : Application, event: KeyEvent) => void;
		keyup ?: (this : Application, event: KeyEvent) => void;
	}

	class Application {
		readonly keyboard: KeyboardState;
		readonly images : Images;
		readonly layer : RenderLayer;

		constructor(config : Partial<ApplicationConfig>);

		loadImage(filename : string) : void;
		setState(state: Partial<StateEvents>): void;
	}
}
