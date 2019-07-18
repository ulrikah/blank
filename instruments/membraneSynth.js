const Tone = require('tone');

const membraneSynth = new Tone.MembraneSynth();
const pingPong = new Tone.PingPongDelay("16n", 0.1);

exports.synth = membraneSynth;
exports.pingPong = pingPong;