/**
 * Entry point for the Angular app.
 */
var bookSwapp = angular.module('bookSwapp', [ 'ui.bootstrap', 'ngAnimate' ]);

bookSwapp.controller('homeCtrl', ['$scope', '$http',
	function($scope, $http) {

		// @TODO this will be fetched from the server via an API call
		// currently is just hardcoded test data

		/*
		$scope.listings = [
			{
				id: 1,
				name: 'Business 101',
				price: 5.00,
				location: 'UNSW',
				type: 'Wanted' // @TODO determine codes instead of string for wanted / selling / swap
			},
			{
				id: 2,
				name: 'Python Programming',
				price: 15.00,
				location: 'UTS',
				type: 'Selling'
			},
			{
				id: 3,
				name: 'Business 101',
				price: 5.00,
				location: 'Bankstown',
				type: 'Swap'
			}
		];
		*/

		// Login
		$scope.loginForm = {};
		$scope.processLogin = function() {
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/user/login',
				data: $.param($scope.loginForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				var res = response.data;
				console.log(response);
				if (res.hasOwnProperty('error')) {
					console.log("login failed");
				} else {
					console.log("login successful");
				}
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Registration
		$scope.registerForm = {};
		$scope.processRegistration = function() {
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/user/register',
				data: $.param($scope.registerForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				var res = response.data;
				console.log(response);
				if (res.hasOwnProperty('error')) {
					console.log("register failed");
				} else {
					console.log("register successful");
				}
				$('#registerModal').modal('hide');
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Add book
		$scope.addBookForm = {};
		$scope.addBook = function() {
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/books/create',
				data: $.param($scope.addBookForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				var res = response.data;
				console.log(response);
				if (res.hasOwnProperty('error')) {
					console.log("Not logged in");
				} else {
					console.log("Book creation successful");
				}
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Getting list of books
		$http({
			method: 'GET',
			url: 'http://bookswapp.apps.mlux.me/api/books/list/all'
		}).then(function successCallback(response) {
			$scope.books = response.data;
		}, function errorCallback(response) {
			console.log('Errored out: ' + JSON.stringify(response));
		});

		// Getting list of users
		$http({
			method: 'GET',
			url: 'http://bookswapp.apps.mlux.me/api/user/list'
		}).then(function successCallback(response) {
			$scope.userList = response.data;
		}, function errorCallback(response) {
			console.log('Errored out: ' + JSON.stringify(response));
		});

		// Getting book listings
		$http({
			method: 'GET',
			url: 'http://bookswapp.apps.mlux.me/api/listings'
		}).then(function successCallback(response) {
			$scope.listings = response.data;
		}, function errorCallback(response) {
			console.log('Errored out: ' + JSON.stringify(response));
		});

		// $scope.getBook = function(book_id) {
		// 	$http({
		// 		method: 'GET',
		// 		url: 'http://bookswapp.apps.mlux.me/api/books/'+book_id
		// 	}).then(function successCallback(response) {
		// 		$scope.book = response.data;
		// 	}, function errorCallback(response) {
		// 		console.log('Errored out: ' + JSON.stringify(response));
		// 	});
		// };

		$scope.selectedType = 'selling';

		$scope.selectType = function(type) {
			$scope.selectedType = type;
		};

		$scope.showUserTable = function(func) {
			$('#bookListTable').hide();
			$('#bookTable').hide();
			$('#userTable').show();
		};

		$scope.showBookTable = function(func) {
			$('#bookListTable').hide();
			$('#userTable').hide();
			$('#bookTable').show();
		};

		$scope.showBookListTable = function(func) {
			$('#bookListTable').show();
			$('#userTable').hide();
			$('#bookTable').hide();
		};

		$scope.showAddBookModal = function(func) {
			$('#addBookModal').modal();
		}
	}
]);

$(document).ready(function() {
    $("#userTable").hide();
    $("#bookListTable").hide();
});
