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
    }
  };
})();
