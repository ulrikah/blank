exports.randomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// maps value from [a, b] to [c, d] where a < b and c < d
exports.map = (value, a, b, c, d, clamp = false) => {
	if (clamp) {
		if (value < a){
			return c
		}
		if (value > b) {
			return d
		}
	}
	return c + (d - c) * (value - a) / (b - a);
}

exports.avg = (array) => {
	if (array.length)
	{
		sum = array.reduce(function(a, b) { return a + b; });
		return sum / array.length
	}
	return 0
}