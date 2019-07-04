// singleton state component

AFRAME.registerState({
  initialState: {
  	// the line below doesn't work because the state is inititated before the transport entity is rendered
    // steps: Array(document.querySelector('#transport').getAttribute('transport').nSteps).fill(false)
    steps: Array(8).fill(false),
    layer: { note: 'C2', steps: Array(8).fill(false)},
    bpm: 30
  },
 
  handlers: {

  	changeStep: function (state, payload) {
  		const s = Object.assign(state.layer.steps);
  		s[payload.id] = !s[payload.id];
  		state.layer.steps = s;
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