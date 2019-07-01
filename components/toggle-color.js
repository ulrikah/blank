AFRAME.registerComponent('toggle-color', {
  init: function () {
    this.el.addEventListener('click', function (evt) {
    	const color = evt.target.getAttribute('material').color;
      this.setAttribute('material', 'color', invertColor(color));
      // console.log('Clicked at: ', evt.detail.intersection.point);
    });
  }
});


// expects strings in hex format, i.e. #AABBCC or #ABC
invertColor = (col) => {
	return "#" + col.split("").slice(1).reverse().join("")
}