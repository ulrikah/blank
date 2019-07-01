AFRAME.registerComponent('refresh-page', {
  init: function () {
    this.onHit = this.onHit.bind(this);
  },

  play: function () {
  	const el = this.el;
    el.addEventListener('hit', this.onHit);
  },

  onHit: function (evt) {
    location.reload();
  }
});
