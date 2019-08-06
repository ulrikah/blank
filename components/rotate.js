AFRAME.registerComponent('rotate', {

  init: function () {
  	this.rot = 0;
  },

  tick: function () {
  	const el = this.el;
  	el.object3D.rotation.set( 
	    THREE.Math.degToRad(this.rot*0.02),
	    THREE.Math.degToRad(this.rot*0.08),
	    THREE.Math.degToRad(this.rot*0.3),
	  );
	  this.rot += 2;
  }
});