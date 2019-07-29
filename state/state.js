// singleton state component

const randomArray = (length, max, min = 0) => 
  Array(length).fill().map(() => parseFloat((Math.random() * (max - min) + min).toFixed(2)))

const randomBoolArray = (length) => 
	Array(length).fill().map(() => Math.random() >= 0.5)

AFRAME.registerState({
  initialState: {
    layers: [
    	{ note: 'C3', steps: Array(8).fill(false), velocity: randomArray(8, 1.5, 0.5)},
    	{ note: 'D3', steps: Array(8).fill(false), velocity: randomArray(8, 1.5, 0.5)},
    	{ note: 'E3', steps: Array(8).fill(false), velocity: randomArray(8, 1.5, 0.5)},
    	{ note: 'C4', steps: Array(8).fill(false), velocity: randomArray(8, 1.5, 0.5)},
    	{ note: 'F4', steps: Array(8).fill(false), velocity: randomArray(8, 1.5, 0.5)},
    	{ note: 'E4', steps: Array(8).fill(false), velocity: randomArray(8, 1.5, 0.5)},
    ],
    bpm: 110
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
  	}
  }
});