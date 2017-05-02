// img-loader.js
// модуль для подгрузки аватарки и картинок
'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpeg', 'jpg', 'png'];

  var noticePhoto = document.querySelector('.notice__photo');
  var avatarSelector = noticePhoto.querySelector('.upload input[type=file]');
  var avaterPreview = noticePhoto.querySelector('.notice__preview img');

  var formElement = document.querySelector('.form__photo-container');
  var photoSelector = formElement.querySelector('.upload input[type=file]');
  var photoPreview = formElement.querySelectorAll('.form__photo');

  avatarSelector.addEventListener('change', function () {
    var file = avatarSelector.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (ext) {
      return fileName.endsWith(ext);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avaterPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

  });

  photoSelector.addEventListener('change', function () {
    var files = photoSelector.files;
    var picNum = 0;

    for (var i = 0; i < files.length; i++) {
      var fileName = files[i].name.toLowerCase();
      var matches = FILE_TYPES.some(function (ext) {
        return fileName.endsWith(ext);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function (personalReader) {
          photoPreview[picNum].firstChild.src = personalReader.result;
          picNum = picNum + 1;
        }.bind(null, reader));

        reader.readAsDataURL(files[i]);
      }

      if (picNum === 15) {
        break;
      }
    }
  });

})();
