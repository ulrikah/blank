// npm imports
require('aframe');
require('aframe-state-component');
require('aframe-event-set-component');
require('aframe-haptics-component');
require('aframe-log-component');
require('aframe-physics-system');
require('aframe-environment-component');

// AFRAME components
require('./components/cursor-listener.js')
require('./components/transport.js')
require('./components/play-pause.js')
require('./components/grab-fork.js')
require('./components/grab-vertical.js')
require('./components/aabb-collider.js')
require('./components/refresh-page.js')
require('./components/rotate.js')
require('./components/panner.js')
require('./components/panner-object.js')
require('./components/tone-transport-toggle.js')
require('./components/random-material.js')
require('./components/random-torus-knot.js')
require('./components/shooter.js')
require('./components/collide-sound.js')
require('./components/hide-in-vr.js')
require('./components/splash.js')
require('./components/collide-marble.js')
require('./components/synth.js');
require('./components/boom.js');

// AFRAME state
require('./state/state.js')

// AFRAME systems
require('./systems/synth.js')

// shaders
require('./shaders/grid-glitch.js')
require('./shaders/noise.js')
