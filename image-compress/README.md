### client image compression

####Usage
```html
<input type="file" accept="image/bmp,image/jpg,image/png,image/gif"
      onchange="angular.element(this).scope().fileChanged(this)" />
```

```js
require('./FileReader-service.js');
require('./Compression-service.js');

var Max_Size = 2 *1024 *1024; //2M
 $scope.fileChanged = function (changeEvent) {  // bind on file changed
    if (oFile.size > Max_Size) {
      FileReader.readAsDataURL(oFile, $scope).then(function (result) {
        var image, ca, compressBase64, blob;
        image = new Image();
        image.src = result;
        ca = Compression.imageToCanvas(image.width, image.height)(image);
        compressBase64 = Compression.loopCompression(ca, 1, Max_Size);
        blob = Compression.dataURItoBlob(compressBase64);

      }, function () {
       throw Error('read file error');
      });
    }
   }
```