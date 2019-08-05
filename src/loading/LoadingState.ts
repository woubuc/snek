const LoadingState : PLAYGROUND.StateEvents = {

	create() {
		console.log('Loading state created!');
	},

	render(delta : number) {
		console.log('Loading...');
	},

};

export default LoadingState;
