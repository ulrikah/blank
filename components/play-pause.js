const Tone = require('tone');

AFRAME.registerComponent('play-pause', {
	
  init: function () {
  	const playCol = "#7087CC";
  	const pauseCol = "#F6F7A7";
  	const el = this.el;
  	Tone.Master.volume.value = 0;
  	['click', 'grabend'].forEach(e => this.el.addEventListener(e, function (evt) {
  		const color = el.getAttribute('material').color;
  		if (Tone.Transport.state === "stopped" || Tone.Transport.state === "paused")
  		{
  			Tone.Transport.start("+0.1")
  			Tone.Master.volume.exponentialRampToValueAtTime('1', 5)
				el.setAttribute('material', 'color', playCol)
				el.setAttribute('rotate', '')
  		}

  		else if (Tone.Transport.state === "started")
  		{
  			Tone.Master.volume.linearRampToValueAtTime('-100', 10)
  			Tone.Transport.stop("+0.1")
				el.setAttribute('material', 'color', pauseCol)
				el.removeAttribute('rotate')
  		}
    }));
  }
});