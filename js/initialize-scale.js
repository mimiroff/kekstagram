/**
 * initialize-scale.js
 * Модуль вычисления масштаба, применяемого к загружаемому изображению
 */
'use strict';

(function () {

  window.initializeScale = {
    /**
     * Функция вычисления масштаба загружаемого изображения
     * @param {String} scaleElementValue
     * @param {Number} value
     * @param {Function} adjustScale
     */
    initializeScale: function (scaleElementValue, value, adjustScale) {
      var scale = value;
      var MAX_SCALE = 100;
      var MIN_SCALE = 25;
      var STEP = 25;

      if (scaleElementValue === 'inc' && scale < MAX_SCALE) {
        scale = scale + STEP;
      } else if (scaleElementValue === 'dec' && scale > MIN_SCALE) {
        scale = scale - STEP;
      }
      adjustScale(scale);
    }
  };
})();
