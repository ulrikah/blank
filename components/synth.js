// named after the system to automatically register to the 'synth' system
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
  },

  remove: function () {
    this.system.unregisterMe(this.el);
  }
});