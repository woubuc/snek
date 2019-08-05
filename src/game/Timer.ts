import { START_TIME_MS } from '../const';

export default class Timer {

	private time : number = START_TIME_MS;
	private resetValue : number = START_TIME_MS;

	public isTick(delta : number) : boolean {
		this.time -= delta;

		if (this.time < 0) {
			this.time += Math.round(this.resetValue);
			return true;
		}

		return false;
	}

	public reset() {
		this.time = Math.round(this.resetValue);
	}

	public increaseGameSpeed() {
		this.resetValue *= 0.9;
	}
}
