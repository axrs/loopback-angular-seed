angular.module('ngLAS.about', [
  'ui.router'
])

  .config(function config($stateProvider) {
    $stateProvider.state('about', {
      url: '/about',
      views: {
        main: {
          controller: 'AboutCtrl',
          templateUrl: 'about/about.tpl.html'
        }
      },
      data: {pageTitle: 'About'}
    });
  })

  .controller('AboutCtrl', function AboutCtrl($scope) {
  });
