/**
 * Entry point for the Angular app.
 */
var bookSwapp = angular.module('bookSwapp', [ 'ui.bootstrap', 'ngAnimate' ]);

bookSwapp.controller('homeCtrl', ['$scope', '$http',
	function($scope, $http) {

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
				console.log(res);
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
				$scope.updateUserList();
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
				$scope.updateBookList();
				$('#addBookModal').modal('hide');
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Delete book
		$scope.deleteBook = function(book_id) {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/books/delete/'+book_id
			}).then(function successCallback(response) {
				var res = response.data;
				$scope.updateBookList();
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		// Getting list of books
		$http({
			method: 'GET',
			url: 'http://bookswapp.apps.mlux.me/api/books/list/all'
		}).then(function successCallback(response) {
			$scope.allBooks = response.data;
			$scope.selectedBookList = $scope.allBooks;
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

		$scope.updateUserList = function() {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/user/list'
			}).then(function successCallback(response) {
				$scope.userList = response.data;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		}

		$scope.updateBookList = function() {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/books/list/all'
			}).then(function successCallback(response) {
				$scope.allBooks = response.data;
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		}

		// Getting book listings
		$http({
			method: 'GET',
			url: 'http://bookswapp.apps.mlux.me/api/listings'
		}).then(function successCallback(response) {
			$scope.listings = response.data;
		}, function errorCallback(response) {
			console.log('Errored out: ' + JSON.stringify(response));
		});

		$scope.getBook = function(book_id) {
			$http({
				method: 'GET',
				url: 'http://bookswapp.apps.mlux.me/api/books/'+book_id
			}).then(function successCallback(response) {
				$scope.bookData = response.data;
				console.log("Book data");
			}, function errorCallback(response) {
				console.log('Errored out: ' + JSON.stringify(response));
			});
		};

		$scope.selectedType = 'all';

		// Book list filtering
		$scope.updateSelectedBookList = function(type) {
			if (type === 'all') {
				$scope.selectedBookList = $scope.allBooks;
			} else {
				$scope.selectedBookList = [];
				for (var i = 0; i < ($scope.allBooks).length; i++) {
					var book = $scope.allBooks[i];
					if (book['trans_type'] === type) {
						($scope.selectedBookList).push(book);
					}
				}
			}
		}

		$scope.selectType = function(type) {
			$scope.selectedType = type;
			$scope.updateSelectedBookList(type);
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

		$scope.showBookDetailsModal = function(func) {
			$('#bookDetailsModal').modal('show');
		}
	}
]);

$(document).ready(function() {
    $("#userTable").hide();
    $("#bookListTable").hide();
});
