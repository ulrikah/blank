// Stolen from: https://aframe.io/docs/0.9.0/components/material.html

AFRAME.registerShader('grid-glitch', {
	schema: {
    time: {type: 'time', is: 'uniform', default: '1.0'},
  },
  raw: false,
  vertexShader:
  `varying vec2 vUv;

	void main() {
	  vUv = uv;
	  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
	`,
	fragmentShader: 
	`
	varying vec2 vUv;
	uniform vec3 color;
	uniform float timeMsec; // A-Frame time in milliseconds.

	void main() {
	  float time = timeMsec / 1000.0; // Convert from A-Frame milliseconds to typical time in seconds.
	  // Use sin(time), which curves between 0 and 1 over time,
	  // to determine the mix of two colors:
	  //    (a) Dynamic color where 'R' and 'B' channels come
	  //        from a modulus of the UV coordinates.
	  //    (b) Base color.
	  //
	  // The color itself is a vec4 containing RGBA values 0-1.
	  gl_FragColor = mix(
	    vec4(mod(vUv , 0.05) * 20.0, 1.0, 1.0),
	    vec4(color, 1.0),
	    sin(time)
	  );
	}
	`
});