/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.7.0-rc1-master-ff79c91
 */
(function() {
'use strict';

/*
 * @ngdoc module
 * @name material.components.backdrop
 * @description Backdrop
 */

/**
 * @ngdoc directive
 * @name mdBackdrop
 * @module material.components.backdrop
 *
 * @restrict E
 *
 * @description
 * `<md-backdrop>` is a backdrop element used by other coponents, such as dialog and bottom sheet.
 * Apply class `opaque` to make the backdrop use the theme backdrop color.
 *
 */

angular.module('material.components.backdrop', [
  'material.core'
])
  .directive('mdBackdrop', BackdropDirective);

function BackdropDirective($mdTheming) {
  return $mdTheming;
}
BackdropDirective.$inject = ["$mdTheming"];
})();
