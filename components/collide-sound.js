const Tone = require('tone');

AFRAME.registerComponent('collide-sound', {
	
  init: function () {
  	const noiseSynth = new Tone.MembraneSynth().toMaster();
  	noiseSynth.volume.value = -10;

		this.el.addEventListener('collide', function (e) {
			if (e.detail.target.el.classList.contains('wall'))
			{
				noiseSynth.triggerAttackRelease("C2", "8n");
			}
		});
  }
});