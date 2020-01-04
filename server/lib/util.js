const cryptoJS = require("crypto-js");
const { createCanvas } = require('canvas');

/**
 * Hashing a string using salt, Default output hex
 * @param {string} str The string to be encrypted
 * @param {string} salt Salt value
 * @param {string} enc Output format
 * @returns {string} hash
*/
exports.encryptWithSalt = function (str, salt, enc = 'Hex') {
  const hash = cryptoJS.SHA256(cryptoJS.SHA256(str) + salt);
  if (enc) {
    enc = enc.toLowerCase();
  }
  return hash.toString(cryptoJS.enc[enc]);
}


// Character library
const randomStr = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Create a random number
 * @param {number} min Minimum number
 * @param {number} max Maximum number
 * @returns {number} random number
 */
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Create a random rgb color
 * @param {number} min Minimum number
 * @param {number} max Maximum number
 * @returns {string} RGB string
 */
function randomColor(min, max) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

/**
 * create a random rgb color
 * @param {number} length Text length
 * @param {number} width Picture width
 * @param {number} height Picture height
 * @returns {any} Picture text & Picture of Base64Url
 */
exports.drawPic = function (length, width, height) {
  let picTxt = '';
  let canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d'); // Get context object
  ctx.textBaseline = 'bottom'; // Bottom alignment
  ctx.fillStyle = randomColor(180, 240); // Fill canvas color
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < length; i++) {
    const x = (width - 10) / length * i + 10;
    const y = randomNum(height / 2, height);
    const deg = randomNum(-45, 45);
    const txt = randomStr[randomNum(0, randomStr.length)];
    picTxt += txt; // Get a random number
    ctx.fillStyle = randomColor(10, 100); // Fill random color
    ctx.font = randomNum(18, 25) + 'px SimHei'; // Set the random number size, the font is SimHei
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180); // Rotation random angle
    ctx.fillText(txt, 0, 0); // Draw text
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
  }
  for (let i = 0; i < length; i++) {
    // Define stroke color
    ctx.strokeStyle = randomColor(90, 180);
    ctx.beginPath();
    // Draw random line
    ctx.moveTo(randomNum(0, width), randomNum(0, height));
    ctx.lineTo(randomNum(0, width), randomNum(0, height));
    ctx.stroke();
  }
  for (let i = 0; i < length * 10; i++) {
    ctx.fillStyle = randomColor(0, 255);
    ctx.beginPath();
    // Draw random circle and fill color
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
    ctx.fill();
  }
  return {
    text: picTxt.toLowerCase(),
    body: canvas.toDataURL()
  }
}

/** 
 * Decide object type
 * @param {any} obj
 * @returns {string} The type of object 
*/
exports.isType = function (obj) {
  const type = Object.prototype.toString.call(obj);
  if (type == '[object Array]') {
    return 'Array';
  } else if (type == '[object Object]') {
    return "Object"
  } else if (type == '[object String]') {
    return "String"
  } else if (type == '[object Number]') {
    return "Number"
  } else {
    return 'param is no object type';
  }
}
