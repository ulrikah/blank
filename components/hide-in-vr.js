AFRAME.registerComponent('hide-in-vr', {
  init: function () {
  	const el = this.el;
  	document.querySelector('a-scene').addEventListener('enter-vr', function() {
  		el.setAttribute('visible', 'false')
  	})

  	document.querySelector('a-scene').addEventListener('exit-vr', function() {
  		el.setAttribute('visible', 'true')
  	})
  }
});