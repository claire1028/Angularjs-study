
var m = angular.module('myModule', []);

m.factory('Compression', function () {

  var dataURItoBlob = function(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };

  var loopCompression = function(canvas, quality, targetSize) {
    var base64str = canvasToBase64(canvas, quality);
    var newSize = getBase64Size(base64str);
    if (newSize > targetSize) {
      return loopCompression(canvas, quality - 0.1, targetSize);
    }
    return base64str;
  };

  var getBase64Size = function(base64) {
    var len = base64.replace(/^data:image\/\w+;base64,/, '').length;
    return len / 1.37;

  };

  var canvasToBase64 = function(canvas, quality) {
    quality = quality || 0.7;
    var base64 = canvas.toDataURL('image/jpeg', quality);
    return base64;
  };

  var imageToCanvas = function(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return function(image) {
      var context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas;
    };
  };

  return {
    imageToCanvas: imageToCanvas,
    loopCompression: loopCompression,
    dataURItoBlob: dataURItoBlob
  };
});
