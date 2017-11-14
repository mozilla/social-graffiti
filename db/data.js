"use strict";

// Returns an array of floats from a string created by convertFromArray
function convertToArray(str){
	if(str === null || str === '') return null
	return str.split(',').map(val => { return parseFloat(val) })
}

// Returns a string representation of an array of floats to store in the DB
function convertFromArray(arr){
	if(arr === null || arr.length === 0) return ''
	return arr.join(',')
}

module.exports = {convertToArray, convertFromArray}
