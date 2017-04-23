// mainPin.js
// премещение основного pin'a и синхронизация с координатами

window.mainPin = (function (windows, document) {
  var pinMain = document.querySelector('.pin__main');
  var addrInput = document.querySelector('#address');

  function setAddress(x, y) {
    addrInput.value = 'x: ' + (x + 74 / 2) + ', y: ' + (y + 94);
  }

  /**
   * Функция перемещения pin__main в случае изменения адреса
   */
  function movePin() {
    var lastTimeout;

    var xy = addrInput.value.match(/^\d+|\d+\b|\d+(?=\w)/g)
      .map(function (v) { return +v; });
    var x = xy[0];
    var y = xy[1];
    function movePinMain() {
      pinMain.style.left = (x - 74 / 2) + 'px';
      pinMain.style.top = (y - 94) + 'px';
    }
    window.debounce(movePinMain);
  }

  // Палим изменение адреса
  addrInput.addEventListener('input', movePin);

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startXY = {
      x: evt.clientX,
      y: evt.clientY
    }

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startXY.x - moveEvt.clientX,
        y: startXY.y - moveEvt.clientY
      };

      startXY = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      }
      pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
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