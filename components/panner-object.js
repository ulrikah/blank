const Tone = require('tone')

AFRAME.registerComponent('panner-object', {
  init: function () {
		this.camera = document.querySelector('a-camera')
  	this.pos = new THREE.Vector3();
  	this.panner = this.data.panner;
		this.fft = new Tone.FFT(32);
  	this.panner.connect(this.fft)
  },

  tick: function () {
  	this.updateDelta()
  	diff = { 
  		x: this.camera.object3D.position.x - this.pos.x,
  		y: this.camera.object3D.position.y - this.pos.y,
  		z: this.camera.object3D.position.z - this.pos.z,
  	}
  	this.panner.setPosition(diff.x, diff.y, diff.z)

  	const avg = this.getAverageFFTValue(this.fft.getValue());
		const radius = this.mapFFTAvg2Radius(avg)
		this.el.setAttribute('geometry', 'radius', radius)
  },

  updateDelta: function () {
    this.el.object3D.updateMatrixWorld();
    this.pos.setFromMatrixPosition(this.el.object3D.matrixWorld);
  },

  getAverageFFTValue(fft, range = 0) {
  	fft = fft.slice(range, fft.length - range);
  	return fft.reduce((a,b) => a + b, 0) / fft.length
  },

  mapFFTAvg2Radius(fftAvg, min = -200, max = -50) {
  	fftAvg = THREE.Math.clamp(fftAvg, min, max); // in case of Inf or -Inf
  	return THREE.Math.mapLinear(fftAvg, min, max, 0.5, 3);
  }

});