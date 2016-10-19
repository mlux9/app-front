/**
 * Entry point for the Angular app.
 */
var bookSwapp = angular.module('bookSwapp', [ 'ui.bootstrap', 'ngAnimate' ]);

bookSwapp.controller('homeCtrl', ['$scope', '$http', '$interval',
	function($scope, $http, $interval) {
		/*** Empty variables - filled later ***/
		$scope.blistings = {};

		/*** User Account ***/
		$scope.currentUser = {
			user_id: "",
			email: "",
			logged_in: false,
			token: ""
		};

		$scope.isLoggedIn = function() {
			return $scope.currentUser.logged_in;
		};

		$scope.loginForm = {};
		$scope.processLogin = function() {
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/user/login',
				data: $.param($scope.loginForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				var res = response.data;
				if (res.hasOwnProperty('message')) { // Login successful
					$scope.currentUser.user_id = res.user_id;
					$scope.currentUser.email = res.email;
					$scope.currentUser.logged_in = true;
					$scope.currentUser.token = res.token;

					$scope.getListingsByUser($scope.currentUser.user_id);
				}
				$('#loginModal').modal('hide');		
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.processLogout = function() {
			$scope.currentUser.user_id = "";
			$scope.currentUser.email = "";
			$scope.currentUser.logged_in = false;
			$scope.currentUser.token = "";
		};

		$scope.registerForm = {};
		$scope.processRegistration = function() {
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/user/register',
				data: $.param($scope.registerForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				$scope.updateUserList();
				$('#registerModal').modal('hide');				
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.updateUserForm = {};
		$scope.updateUser = function() {
			var user_id = $scope.currentUser.user_id;
			$scope.updateUserForm.token = $scope.currentUser.token;

			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/user/update/'+user_id,
				data: $.param($scope.updateUserForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				$scope.updateUserList();
				$scope.clearForm($scope.updateUserForm);
				$('#updateUserModal').modal('hide');
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.updateUserList = function() {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/user/list'
			}).then(function successCallback(response) {
				$scope.userList = response.data;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		/** Fetches notifications */
		var checkNotifications = function() {
			var url = 'http://bookswapp.apps.mlux.me/api/request/notifications/' + $scope.currentUser.user_id;
			$http({
				method: 'GET',
				url: url
			}).then(function success(response) {
				console.log('response: ' + JSON.stringify(response));
				var data = response.data;
				if (data.length > 0) {
					$('#notifs').show();
				}
			}, function error(err) {
				console.log('Errored out: ' + JSON.stringify(err));
			});
		};

		// setup checking notifications every 10 seconds
		$interval(function() {
			if ($scope.isLoggedIn()) {
				//console.log('checking notifications. your user id = ' + $scope.currentUser.user_id);
				checkNotifications();
			}
		}, 10000);

		/** Modifying Books */
		$scope.bookData = {};
		$scope.addBookForm = {};
		$scope.addBook = function() {
			$scope.addBookForm.token = $scope.currentUser.token;
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/books/create',
				data: $.param($scope.addBookForm),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				var res = response.data;
				$scope.clearForm($scope.addBookForm);
				$scope.getListings();
				$scope.getSelectedListings($scope.selectedType);
				$('#addBookModal').modal('hide');
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.deleteBook = function(book_id) {
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/books/delete/'+book_id,
				data: $.param({ token: $scope.currentUser.token }),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				$scope.getListings();
				$scope.getSelectedListings($scope.selectedType);
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.getListing = function(book_id) {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/booklistings/'+book_id
			}).then(function successCallback(response) {
				$scope.blisting = response.data;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.getListings = function() {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/booklistings'
			}).then(function successCallback(response) {
				$scope.blistings = response.data;
				$scope.selectedListings = $scope.blistings;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.isMyBook = function(book_id) {
			for (var i = 0; i < ($scope.blistings).length; i++) {
				var listing = $scope.blistings[i];
				if (listing['book_id'] === book_id) {
					return (listing['user_id'] === $scope.currentUser.user_id);
				}
			}
			return false;
		};

		$scope.deleteUser = function() {
			var user_id = $scope.currentUser.user_id;
			$http({
				method: 'POST',
				url: 'http://bookswapp.apps.mlux.me/api/user/delete/'+user_id,
				data: $.param({ token: $scope.currentUser.token }),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				var res = response.data;
				$scope.getListings();
				$scope.getSelectedListings($scope.selectedType);
				$scope.updateUserList();
				$scope.processLogout();
				$('#updateUserModal').modal('hide');
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.getBook = function(book_id) {
			$scope.bookData = {};
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/books/'+book_id
			}).then(function successCallback(response) {
				$scope.bookData = response.data;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.getUser = function(user_id) {
			$scope.userData = {};
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/user/'+user_id
			}).then(function successCallback(response) {
				$scope.userData = response.data;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Book list filtering
		$scope.getSelectedListings = function(type) {
			if (type === 'all') {
				$scope.selectedListings = $scope.blistings;
			} else {
				$scope.selectedListings = [];
				for (var i = 0; i < ($scope.blistings).length; i++) {
					var listing = $scope.blistings[i];
					if (listing['trans_type'] === type) {
						($scope.selectedListings).push(listing);
					}
				}
			}
		};

		$scope.getListingsByUser = function(user_id) {
			$scope.userListings = [];
			for (var i = 0; i < ($scope.blistings).length; i++) {
				var listing = $scope.blistings[i];
				if (listing['user_id'] === user_id) {
					($scope.userListings).push(listing);
				}
			}
		};

		/** Sends a request to respond to a listing */
		$scope.sendRequest = function(bookId) {
			var url = 'http://bookswapp.apps.mlux.me/api/request/' + bookId;
			$http({
				method: 'POST',
				url: url,
				data: $.param({ token: $scope.currentUser.token }),
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function successCallback(response) {
				console.log('response: ' + JSON.stringify(response));
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Clears all fields in a form 
		$scope.clearForm = function(formObject) {
			for (field in formObject) {
				if (formObject.hasOwnProperty(field)) {
					formObject[field] = "";
				}
			}
		};

		// Filtering books table
		$scope.selectedType = 'all';
		$scope.selectType = function(type) {
			$scope.selectedType = type;
			$scope.getSelectedListings(type);
		};

		// Show modals 
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
		};

		$scope.showBookDetailsModal = function() {
			$('#bookDetailsModal').modal('show');
		};

		$scope.showUpdateUserModal = function(func) {
			$scope.getUser($scope.currentUser.user_id);
			$('#updateUserModal').modal();
		};

		$scope.showMyListingsModal = function(func) {
			$scope.getListingsByUser($scope.currentUser.user_id);
			$('#myListingsModal').modal();
		};

		/*** Functions to call on page load ***/
		$scope.getListings();
		$scope.getSelectedListings();
		$scope.updateUserList();
	}
]);

$(document).ready(function() {
    $("#userTable").hide();
    $("#bookListTable").hide();
});
