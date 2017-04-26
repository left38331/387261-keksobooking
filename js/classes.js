// classes.js
'use strict';
(function () {
  window.addClass = function (el, className) {
    if (el.classList) {
      el.classList.add(className);
    }
    else if (!hasClass(el, className)) {
      el.className += " " + className;
    }
  };

  window.removeClass = function (el, className) {
    if (el.classList) {
      el.classList.remove(className);
    }
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      el.className = el.className.replace(reg, ' ');
    }
  };

  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    }
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }
})();