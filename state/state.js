// singleton state component

AFRAME.registerState({
  initialState: {
    steps: Array(8).fill(false) // TODO: fill by props
  },
 
  handlers: {

  	changeStep: function (state, payload) {
		
  		const s = Object.assign(state.steps);
  		s[payload.id] = !s[payload.id];
  		state.steps = s;

  	}
  }
});