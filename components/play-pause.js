const Tone = require('tone');

AFRAME.registerComponent('play-pause', {
	
  init: function () {
  	const playCol = "#7087CC";
  	const pauseCol = "#EF2D5E";
  	['click', 'grabend', 'updateNSteps'].forEach(e => this.el.addEventListener(e, function (evt) {
  		const color = evt.target.getAttribute('material').color;
  		Tone.Transport.toggle("+0.1")

			if (color === pauseCol) {
				evt.target.setAttribute('material', 'color', playCol)
			} else {
				evt.target.setAttribute('material', 'color', pauseCol)
			}
    }));
  }
});