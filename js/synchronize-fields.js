// synchronize-fields.js
'use strict'

window.synchronizeFields = function (elem1, elem2, callback) {
  //debugger;
  elem1.addEventListener('change', function () {callback(elem1, elem2)});
}