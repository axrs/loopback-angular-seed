angular.module('ngLAS.home', [
  'ui.router'
])

  .config(function config($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      views: {
        main: {
          controller: 'HomeCtrl',
          templateUrl: 'home/home.tpl.html'
        }
      },
      data: {pageTitle: 'Home'}
    });
  })

  .controller('HomeCtrl', function HomeController($scope) {

    $scope.frameworks = {
      frontend: [
        {
          name: 'AngularJS',
          desc: 'HTML is great for declaring static documents, but it falters when we try to use it for declaring ' +
          'dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application. ' +
          'The resulting environment is extraordinarily expressive, readable, and quick to develop.',
          logo: 'assets/logos/angularjs-logo.png',
          uri: 'https://angularjs.org/'
        }, {
          name: 'Semantic UI',
          desc: 'Semantic empowers designers and developers by creating a language for sharing UI.',
          logo: 'assets/logos/semantic-ui-logo.png',
          uri: 'http://semantic-ui.com/'
        }, {
          name: 'Bower',
          desc: 'Web sites are made of lots of things — frameworks, libraries, assets, utilities, and rainbows. ' +
          'Bower manages all these things for you.',
          logo: 'assets/logos/bower-logo.png',
          uri: 'https://bower.io'
        }
      ],
      backend: [{
        name: 'Node.js',
        desc: 'Node.js is a platform built on Chrome\'s JavaScript runtime for easily building fast, scalable ' +
        'network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight ' +
        'and efficient, perfect for data-intensive real-time applications that run across distributed devices.',
        logo: 'assets/logos/nodejs-logo.png',
        uri: 'https://nodejs.org/'
      }, {
        name: 'LoopBack',
        desc: 'Powerful Node.js framework for creating APIs and easily connecting to backend data sources.',
        logo: 'assets/logos/loopback-logo.png',
        uri: 'https://loopback.io/'
      }, {
        name: 'Gulp.js',
        desc: 'The streaming build system (and task runner)',
        logo: 'assets/logos/gulp-logo.png',
        uri: 'http://gulpjs.com'
      }
      ]
    };
  });
