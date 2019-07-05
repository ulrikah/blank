// singleton state component

AFRAME.registerState({
  initialState: {
  	// the line below doesn't work because the state is inititated before the transport entity is rendered
    // steps: Array(document.querySelector('#transport').getAttribute('transport').nSteps).fill(false)
    layers: [ 
    	{ note: 'C3', steps: Array(16).fill(false)},
    	{ note: 'D3', steps: Array(16).fill(false)},
    	{ note: 'E3', steps: Array(16).fill(false)},
    	{ note: 'C4', steps: Array(16).fill(false)},
    	{ note: 'D4', steps: Array(16).fill(false)},
    	{ note: 'E4', steps: Array(16).fill(false)},
    ],
    bpm: 130
  },
 
  handlers: {

  	changeStep: function (state, payload) {
  		const steps = Object.assign(state.layers[payload.layer].steps);
			steps[payload.id] = !steps[payload.id];
			state.layers[payload.layer].steps = steps;
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