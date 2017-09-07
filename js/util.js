/**
 * util.js
 * Вспомогательный модуль, содержащий набор кодов клавиатуры и функции получения случайного целого числа,
 * определения нажатия ESC и ENTER
 */
'use strict';

(function () {
  var keyCodes = {
    ENTER: 13,
    ESC: 27
  };
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  /**
   * Интерфейс модуля. Запись вспомогательных функций в глобальный объект Window.
   * @type {{getRandomInt: Window.util.getRandomInt, isEscEvent: Window.util.isEscEvent, isEnterEvent: Window.util.isEnterEvent}}
   */
  window.util = {
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === keyCodes.ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === keyCodes.ENTER) {
        action();
      }
    },
    renderError: function (error) {
      var errorMessage = document.createElement('DIV');
      errorMessage.textContent = error;
      errorMessage.style.padding = '35px';
      errorMessage.style.zIndex = '50';
      errorMessage.style.fontSize = '20px';
      errorMessage.style.textAlign = 'center';
      errorMessage.style.vertAlign = 'middle';
      errorMessage.style.position = 'fixed';
      errorMessage.style.top = '30%';
      errorMessage.style.left = '30%';
      errorMessage.style.right = '30%';
      errorMessage.style.alignItems = 'center';
      errorMessage.style.backgroundColor = 'rgb(240, 90, 90)';
      errorMessage.style.borderRadius = '5px';
      document.body.appendChild(errorMessage);
    },
    debounce: function (fun) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
    }
  };
})();
