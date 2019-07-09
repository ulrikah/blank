// singleton state component

AFRAME.registerState({
  initialState: {
  	// the line below doesn't work because the state is inititated before the transport entity is rendered
    // steps: Array(document.querySelector('#transport').getAttribute('transport').nSteps).fill(false)
    layers: [
    	{ note: 'C3', steps: Array(16).fill(false), velocity: [0.21350700140900883, 0.20661187064138192, 0.4057836785277457, 0.13380729108798042, 0.8937712604507666, 0.4076962361687833, 0.08822411873099015, 0.45320899311651935, 0.27810627407885585, 0.445648457465332, 0.203078251353692, 0.15765721304585414, 0.7953642661717795, 0.8323578073083424, 0.09063630444873744]},
    	{ note: 'D3', steps: Array(16).fill(false), velocity: Array(16).fill(0.5)},
    	{ note: 'E3', steps: Array(16).fill(false), velocity: Array(16).fill(0.5)},
    	{ note: 'C4', steps: Array(16).fill(false), velocity: Array(16).fill(0.5)},
    	{ note: 'F4', steps: Array(16).fill(false), velocity: Array(16).fill(0.5)},
    	{ note: 'E4', steps: Array(16).fill(false), velocity: Array(16).fill(0.5)},
    ],
    bpm: 130
  },
 
  handlers: {

  	changeStep: function (state, payload) {
  		const steps = Object.assign(state.layers[payload.layer].steps);
			steps[payload.id] = !steps[payload.id];
			state.layers[payload.layer].steps = steps;
  	},
  	updateVelocity: function (state, payload) {
  		const velocity = Object.assign(state.layers[payload.layer].velocity)
  		velocity[payload.id] = payload.value;
  		state.layers[payload.layer].velocity = velocity;
  	},
  	updateBpm: function (state, payload) {
  		if (payload.bpm && typeof(payload.bpm) === "number" && payload.bpm > 0)
  		{
  			state.bpm = payload.bpm
  		}
  	},
  	// changing the number of steps resets all to false
  	updateNSteps: function (state, payload) {
  		if (payload.nSteps && typeof(payload.nSteps) === "number" && payload.nSteps > 0){
  			state.steps = Array(payload.nSteps).fill(false)
  		}
  	}
  }
});