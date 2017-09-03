'use strict';
(function () {
  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError(xhr.status);
        }
      });
      xhr.open('GET', 'https://1510.dump.academy/kekstagram/data');
      xhr.send();
      },
      save: function (data, onLoad, onError) {

    }
  };
})();
