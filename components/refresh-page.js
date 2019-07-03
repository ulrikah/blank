AFRAME.registerComponent('refresh-page', {
  init: function () {
    this.reloadPage = this.reloadPage.bind(this);
  },

  play: function () {
  	const el = this.el;
    el.addEventListener('hit', this.reloadPage);
    ['click', 'grabend'].forEach(e => this.el.addEventListener(e, this.reloadPage));
  },

  reloadPage: function (evt) {
    location.reload();
  }
});
