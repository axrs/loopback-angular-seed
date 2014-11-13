(function (module) {
  try {
    module = angular.module('templates-common');
  } catch (e) {
    module = angular.module('templates-common', []);
  }
  module.run(['$templateCache', function ($templateCache) {

  }]);
})();
