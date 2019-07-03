let rot = 0
let interval;

AFRAME.registerComponent('rotate', {
	
  init: function () {
  	const el = this.el
  	interval = setInterval(rotate, 3, el)
  },

  remove: function () {
  	clearInterval(interval)
  }
});

function rotate(el) {
		el.object3D.rotation.set( 
	    THREE.Math.degToRad(rot*0.02),
	    THREE.Math.degToRad(rot*0.08),
	    THREE.Math.degToRad(rot*0.3),
	  );
	  el.object3D.rotation.x += Math.PI;
	  rot += 2;
}