AFRAME.registerComponent('splash', {
	
  init: function () {
  	const el = this.el
  	this.scene = AFRAME.scenes[0];
  	this.rings = []
  	this.ringContainer = document.createElement('a-entity');
  	this.ringContainer.setAttribute('class', '.ringContainer')
  	this.scene.appendChild(this.ringContainer)
  	this.drawRing = this.drawRing.bind(this)
  	el.addEventListener('collide', this.drawRing);
  },

  tick: function () {
  	if (!this.rings.length > 0) { return }
  	this.rings.forEach( (ring) => {
	  	const geo = ring.getAttribute('geometry');
	  	const radiusInner = geo.radiusInner;
	  	const radiusOuter = geo.radiusOuter;
	  	const inc = 0.005;
	  	if (radiusInner + inc < radiusOuter){
	  		ring.setAttribute('geometry', 'radiusInner', radiusInner + inc)
	  	}
	  	else {
	  		ring.setAttribute('class', 'invisibleRing')
	  		ring.setAttribute('visible', 'false')
	  		Array.from(document.querySelectorAll('.invisibleRing')).forEach( (ring) => {
	  			ring.parentNode.removeChild(ring)
	  		})
	  		this.rings = Array.from(document.querySelectorAll('.ring'))
	  	}
  	});
  },
  drawRing: function (e) {
		const rot = e.detail.target.el.object3D.rotation
		const degs = rot.toArray().map( r => THREE.Math.radToDeg(r)).splice(0, 3)
		const sphere = document.createElement('a-entity');
		sphere.setAttribute('geometry', 
			{ 'primitive': 'ring', 'radiusInner': 0.1, 'radiusOuter': 0.2 })
		sphere.setAttribute('position', e.detail.body.position);
		sphere.setAttribute('rotation', degs.join(' '))
		sphere.setAttribute('class', 'ring')
		sphere.setAttribute('material', { color: '#EF2D5E' })
		this.rings.push(sphere)
		this.ringContainer.appendChild(sphere);
  },

  remove: function () {
  	this.el.removeEventListener('collide', drawRing);
  }
});