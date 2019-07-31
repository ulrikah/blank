AFRAME.registerComponent('synth', {
	schema: {
		source: { 
			type: 'string',
			default: 'oscillator'
		}
	},

  init: function () {
  	const el = this.el
    this.system.registerMe(el);
    
    this.height = el.getAttribute('geometry').height;
    el.addEventListener('componentchanged', (evt) => { 
    	if (evt.detail.name === 'geometry') {
		    const height = evt.target.getAttribute('geometry').height
		    this.height = height;
		  }
    });
  },

  remove: function () {
    this.system.unregisterMe(this.el);
  }
});