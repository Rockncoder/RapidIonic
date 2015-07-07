// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: "/search",
        views: {
          'menuContent': {
            templateUrl: "templates/search.html"
          }
        }
      })

      .state('app.browse', {
        url: "/browse",
        views: {
          'menuContent': {
            templateUrl: "templates/browse.html"
          }
        }
      })

      .state('app.playlists', {
        url: "/playlists",
        views: {
          'menuContent': {
            templateUrl: "templates/playlists.html",
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: "/playlists/:playlistId",
        views: {
          'menuContent': {
            templateUrl: "templates/playlist.html",
            controller: 'PlaylistCtrl'
          }
        }
      })

      .state('app.listings', {
        url: "/listings",
        views: {
          'menuContent': {
            templateUrl: "templates/listings.html",
            controller: "ListingsController"
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/playlists');
  })
  .value("Settings", {
    'searchRadius': '5',
    'listingsPerPage': 20,
    'zipCode': '90012',
    'location': '',
    'useZipCode': true
  })
  .service('ListingsService', function ($http, $q, YP_API_KEY, Settings) {
    var listingsPerPage = 20,
      location = '90012',
      radius = 5,
      YP_BASE_ADDRESS = 'http://pubapi.yp.com/search-api/search/devapi/search?format=json&sort=distance&searchloc=';

    return {
      getListings: getListings
    };

    function filterOutMetaData(data) {
      var meta, listings = [];
      try {
        meta = data.searchResult.metaProperties;
        listings = data.searchResult.searchListings.searchListing;
        if (listings && meta) {
          listings.totalAvailable = meta.totalAvailable;
          listings.totalPages = Math.ceil(listings.totalAvailable / listingsPerPage);
        } else {
          listings.totalAvailable = 0;
          listings.totalPages = 0;
        }
      }
      catch (ex) {
      }

      return listings;
    }

    function getListings(currentPage) {
      var url,
        deferred = $q.defer();

      currentPage = currentPage || 0;
      url = YP_BASE_ADDRESS + Settings.zipCode + '&pagenum=' + currentPage +
        '&term=coffee' + '&radius=' + Settings.searchRadius +
        '&listingcount=' + Settings.listingsPerPage + '&key=' + YP_API_KEY;

      $http.get(url)
        .success(function (data) {
          var listings = filterOutMetaData(data);

          if (listings && listings.length) {
            deferred.resolve(listings);
          } else {
            console.log('Error no search listings returned');
            deferred.reject();
          }
        })
        .error(function (data, status) {
          console.log('Error while making call');
          deferred.reject();
        });
      return deferred.promise;
    }
  });
