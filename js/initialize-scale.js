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
      var maxScale = 100;
      var minScale = 25;
      var step = 25;

      if (scaleElementValue === 'inc' && scale < maxScale) {
        scale = scale + step;
      } else if (scaleElementValue === 'dec' && scale > minScale) {
        scale = scale - step;
      }
      if (typeof adjustScale === 'function') {
        adjustScale(scale);
      }
    }
  };
})();
