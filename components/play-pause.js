const Tone = require('tone');

AFRAME.registerComponent('play-pause', {
	
  init: function () {
  	this.el.addEventListener('click', function (evt) {
  		const color = evt.target.getAttribute('material').color;
      this.setAttribute('material', 'color', invertColor(color));
  		Tone.Transport.toggle()
    });
  }
});


// expects strings in hex format, i.e. #AABBCC or #ABC
function invertColor(col) {
	return "#" + col.split("").slice(1).reverse().join("")
}