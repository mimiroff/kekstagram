/**
 * initialize-filters.js
 * Модуль обрабатывающий вид и изменение интесивности графических фильтров, применяемым к загружаемому изображению
 */
'use strict';

(function () {
  /**
   * Служебные переменные, используемые в данном модуле
   */

  var MIN_COORDS = 0;
  var DEFAULT_RATIO = 0.2;
  var maxCoords;
  var dftCoords;
  var startCoords;
  var pinCoords;
  var activeElement;

  window.initializeFilters = {
    /**
     * Функция получения и сохранения служебных координат пина интенсивности фильтра
     * @param {Number} number
     * @param {String} type
     */
    setCoords: function (number, type) {
      if (type === 'max') {
        maxCoords = number;
        dftCoords = (maxCoords * DEFAULT_RATIO);
      } else if (type === 'start') {
        startCoords = number;
      }
    },
    /**
     * Функция определения и фиксирования значения интесивности применяемого графического фильтра
     * @param {Node} filterElement
     * @param {Function} applyFilter
     * @param {Number} coords
     */
    initializeFilters: function (filterElement, applyFilter, coords) {
      activeElement = filterElement;

      if (typeof coords !== 'number') {
        pinCoords = dftCoords;
      } else {
        pinCoords = coords;
      }
      var filter = null;

      switch (activeElement.value) {
        case 'chrome':
          filter = 'grayscale(' + (pinCoords / maxCoords) + ')';
          break;
        case 'sepia':
          filter = 'sepia(' + (pinCoords / maxCoords) + ')';
          break;
        case 'marvin':
          filter = 'invert(' + (pinCoords / (maxCoords / 100)) + '%)';
          break;
        case 'phobos':
          filter = 'blur(' + (pinCoords / (maxCoords / 3)) + 'px)';
          break;
        case 'heat':
          filter = 'brightness(' + (pinCoords / (maxCoords / 3)) + ')';
          break;
        default:
          filter = 'none';
          break;
      }
      applyFilter(filter, pinCoords);
    },
    /**
     * Функция вычисления положения пина интенсивности фильтра загружаемого изображения
     * @param {Event} moveEvt
     * @param {Node} pinElement
     * @param {Function} callback
     */
    filtersPinMove: function (moveEvt, pinElement, callback) {
      moveEvt.preventDefault();
      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;

      if (pinElement.offsetLeft > maxCoords) {
        pinCoords = maxCoords;
      } else if (pinElement.offsetLeft < MIN_COORDS) {
        pinCoords = MIN_COORDS;
      } else {
        pinCoords = (pinElement.offsetLeft - shift);
      }

      this.initializeFilters(activeElement, callback, pinCoords);
    }
  };
})();
