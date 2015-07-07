angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('PlaylistsCtrl', function ($scope, $ionicActionSheet, $timeout) {
    $scope.playlists = [
      {title: 'Reggae', id: 1},
      {title: 'Chill', id: 2},
      {title: 'Dubstep', id: 3},
      {title: 'Indie', id: 4},
      {title: 'Rap', id: 5},
      {title: 'Cowbell', id: 6}
    ];

    // Triggered on a button click, or some other target
    $scope.show = function() {

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<b>Share</b> This' },
          { text: 'Move' }
        ],
        destructiveText: 'Delete',
        titleText: 'Modify your album',
        cancelText: 'Cancel',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          return true;
        }
      });

      // For example's sake, hide the sheet after two seconds
      $timeout(function() {
        hideSheet();
      }, 2000);
    };
  })

  .controller('PlaylistCtrl', function ($scope, $stateParams) {
  })

  .controller('ListingsController', function ($scope, ListingsService) {
    var currentPage = 0;
    $scope.listings = [];
    $scope.canShowMore = true;

    function init() {
      ListingsService.getListings(currentPage).then(function (listings) {
        $scope.listings = listings;
      });
    }

    $scope.loadMore = function () {
      ListingsService.getListings(currentPage).then(function (listings) {
        if (listings.length === 0) {
          $scope.canShowMore = false;
        } else {
          $scope.listings = $scope.listings.concat(listings);
          currentPage++;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.refresh = function () {
      $scope.listings = [];
      currentPage = 0;
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');

      init();
    };

    init();
  });
