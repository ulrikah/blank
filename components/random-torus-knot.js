AFRAME.registerComponent('random-torus-knot', {
        init: function () {
          this.el.setAttribute('geometry', {
            primitive: 'torusKnot',
            radius: Math.random() * 10,
            radiusTubular: Math.random() * .75,
            p: Math.round(Math.random() * 10),
            q: Math.round(Math.random() * 10)
          });
        }
      });