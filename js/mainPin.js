// mainPin.js
// премещение основного pin'a и синхронизация с координатами
'use strict';

window.mainPin = (function (windows, document) {
  var pinMain = document.querySelector('.pin__main');
  var addrInput = document.querySelector('#address');

  function setAddress(x, y) {
    addrInput.value = 'x: ' + (x + 74 / 2) + ', y: ' + (y + 94);
  }

  /**
   * Функция перемещения pin__main в случае изменения адреса
   */
  function movePinMain() {
    var xy = addrInput.value.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {
      return +v;
    });
    var x = xy[0];
    var y = xy[1];

    if (x <= 1200) {
      pinMain.style.left = (x - 74 / 2) + 'px';
    }
    if (y <= 700) {
      pinMain.style.top = (y - 94) + 'px';
    }
  }

  // Палим изменение адреса
  addrInput.addEventListener('input', function () {
    window.debounce(movePinMain);
  });

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startXY = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startXY.x - moveEvt.clientX,
        y: startXY.y - moveEvt.clientY
      };

      startXY = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (((pinMain.offsetLeft - shift.x) >= -37) && ((pinMain.offsetLeft - shift.x) <= 1163)) {
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      }
      if (((pinMain.offsetTop - shift.y) >= 0) && ((pinMain.offsetTop - shift.y) <= 606)) {
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';

      }

      setAddress(pinMain.offsetLeft, pinMain.offsetTop);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  // задаём начальные координаты в поле адреса
  setAddress(pinMain.offsetLeft, pinMain.offsetTop);

})(window, document);
