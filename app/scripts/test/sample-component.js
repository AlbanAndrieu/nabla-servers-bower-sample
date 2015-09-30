/**
 * @ngdoc directive
 * @name truncate
 * @element data
 * @function
 *
 * @description
 * Truncate data.
 *
 * **Note:** TODO add a note
 *
 * @example
   TODO add a sample
 */
(function() {
  'use strict';

  angular.module('sample-test', []).filter('truncate', function() {
    return function(input, chars, breakOnWord) {
       if (isNaN(chars)) {
        return input;
      }
      if (chars <= 0) {
        return '';
      }
      if (input && input.length > chars) {
        input = input.substring(0, chars);
        if (!breakOnWord) {
          var lastspace = input.lastIndexOf(' ');
          if (lastspace !== -1) {
            input = input.substr(0, lastspace);
          }
        } else {
          while (input.charAt(input.length - 1) === ' ') {
            input = input.substr(0, input.length - 1);
          }
        }
        return input + '…';
      }
      return input;
    };
  });

})();
