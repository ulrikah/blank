const Tone = require('tone');

const synth = new Tone.Synth();
const pingPong = new Tone.PingPongDelay("16n", 0.1);

exports.synth = synth;
exports.pingPong = pingPong;