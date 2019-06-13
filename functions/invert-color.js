// expects strings in hex format, i.e. #AABBCC or #ABC
function invertColor(col) {
	return "#" + col.split("").slice(1).reverse().join("")
 }
