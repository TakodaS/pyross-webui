var math = require('mathjs');
//Utilities for the webpage
export function eqSet(as, bs) {
	if (as.size !== bs.size) return false;
	for (var a of as) if (!bs.has(a)) return false;
	return true;
}

export function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;

	// If you don't care about the order of the elements inside
	// the array, you should sort both arrays here.
	// Please note that calling sort on an array will modify that array.
	// you might want to clone your array first.

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

export function powerSet( list ){
	var perms = [],
		listSize = list.length,
		combinationsCount = (1 << listSize),
		combination;

	for (var i = 1; i < combinationsCount ; i++ ){
		var combination = [];
		for (var j=0;j<listSize;j++){
			if ((i & (1 << j))){
				combination.push(list[j]);
			}
		}
		perms.push(combination);
	}
	return perms.reverse();
}

export function  permutator(inputArr) {
	let result = [];

	const permute = (arr, m = []) => {
		if (arr.length === 0) {
			result.push(m)
		} else {
			for (let i = 0; i < arr.length; i++) {
				let curr = arr.slice();
				let next = curr.splice(i, 1);
				permute(curr.slice(), m.concat(next))
			}
		}
	}

	permute(inputArr)

	return result;
}

export function permPowerSet(inputArr){
	let result = [];
	let s1 = this.powerSet(inputArr);
	let s2;
	for (let s of s1) {
		s2 = this.permutator(s);
		for (let p of s2){
			result.push(p);
		}
	}
	return result;
}

export function intersect(a, b) {
	var t;
	if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
	return a.filter(function (e) {
		return b.indexOf(e) > -1;
	});
}

export function addDictionaries(a, b, fixed = ["t"]){
	a = a[0];
	b = b[0];
	let k1 = Object.keys(a);
	let k2 = Object.keys(b);
	let intersect = this.intersect(k1,k2);
	let outdict = {};
	for (let ob of intersect){
		if (!fixed.includes(ob)){
			outdict[ob] = math.add(a[ob], b[ob]);
		}
		else {
			outdict[ob] = a[ob];
		}
	}
	return outdict;
}

