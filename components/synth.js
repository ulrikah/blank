AFRAME.registerComponent('synth', {
	schema: {
		source: { 
			type: 'string',
			default: 'oscillator'
		}
	},

  init: function () {
    this.system.registerMe(this.el);
    this.audioNode = null;
    
    /*
    this.height = this.el.getAttribute('geometry').height;
    this.el.addEventListener('componentchanged', (evt) => { 
    	if (evt.detail.name === 'geometry') {
		    const height = evt.target.getAttribute('geometry').height
		    this.height = height;
		  }
    });
    */
  },

  update: function () {
  	this.audioNode = this.system.createAudioNode(this.data.source)
  	console.log(this.audioNode);
  },

  remove: function () {
    this.system.unregisterMe(this.el);
  }
});