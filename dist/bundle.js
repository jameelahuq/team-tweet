/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
	
	var _authorize = __webpack_require__(/*! ./authorize */ 1);
	
	var _authorize2 = _interopRequireDefault(_authorize);
	
	__webpack_require__(/*! ./ngApp */ 2);
	
	__webpack_require__(/*! ./services/authService */ 3);
	
	__webpack_require__(/*! ./services/accountService */ 4);
	
	__webpack_require__(/*! ./services/apiService */ 5);
	
	__webpack_require__(/*! ./controllers/TweetCtrl */ 6);
	
	__webpack_require__(/*! ./controllers/AccountCtrl */ 7);
	
	__webpack_require__(/*! ./controllers/NavCtrl.js */ 8);
	
	(0, _authorize2["default"])();

/***/ },
/* 1 */
/*!**************************!*\
  !*** ./src/authorize.js ***!
  \**************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports["default"] = function () {
	  if (localStorage["firebase:session::teamtweet15"]) {
	    return;
	  }
	
	  var ref = new Firebase("https://teamtweet15.firebaseio.com");
	  ref.authWithOAuthPopup("twitter", function (error, authData) {
	    if (error) {
	      alert("Login Failed!", error);
	    } else {
	      alert("Authenticated successfully with payload:", authData);
	      ref.child("users").push(authData);
	    }
	  });
	};
	
	//curl -X POST -d '{"jameela": "AMAING!!!"}' 'https://twiffer.firebaseio.com/tests.json'
	module.exports = exports["default"];

/***/ },
/* 2 */
/*!**********************!*\
  !*** ./src/ngApp.js ***!
  \**********************/
/***/ function(module, exports) {

	"use strict";
	
	window.app = angular.module("team-tweet", ['ui.router']).constant("ttConfig", {
	  "fbDomain": "https://teamtweet15.firebaseio.com/"
	}).config(function ($stateProvider, $urlRouterProvider) {
	
	  $urlRouterProvider.otherwise('/');
	
	  $stateProvider.state('home', {
	    url: '/',
	    templateUrl: 'templates/home.html',
	    controller: "TweetCtrl"
	  }).state('accounts', {
	    url: '/accounts',
	    templateUrl: 'templates/accounts.html',
	    controller: "AccountsCtrl"
	  });
	});

/***/ },
/* 3 */
/*!*************************************!*\
  !*** ./src/services/authService.js ***!
  \*************************************/
/***/ function(module, exports) {

	/**
	 * Created by HUQ on 9/17/15.
	 */
	"use strict";
	
	app.service("authService", function () {
	  this.currentAccount = JSON.parse(localStorage["firebase:session::teamtweet15"]).twitter.username;
	});

/***/ },
/* 4 */
/*!****************************************!*\
  !*** ./src/services/accountService.js ***!
  \****************************************/
/***/ function(module, exports) {

	"use strict";
	
	app.service("accountService", function ($timeout, ttConfig, authService) {
	  var loggedInAccount = authService.currentAccount;
	  var iCanTweetAsRef,
	      authorizedRef = new Firebase(ttConfig.fbDomain + "authorizedTweeters/" + loggedInAccount);
	  var loggedInTweetAsRef = new Firebase(ttConfig.fbDomain + "ICanTweetAsAccounts/" + loggedInAccount);
	
	  var authorizedForLoggedInAccount = {},
	      accountsYouCanTweetAs = [];
	
	  this.getAll = function () {
	    return authorizedForLoggedInAccount;
	  };
	
	  this.getAllAccountsYouCanTweetAs = function () {
	    return accountsYouCanTweetAs;
	  };
	
	  authorizedRef.on("child_added", function (snapshot) {
	    var fbKey = snapshot.key();
	    var twitterHandle = snapshot.val();
	    $timeout(function () {
	      authorizedForLoggedInAccount[fbKey] = twitterHandle;
	    }, 0);
	    console.log(twitterHandle);
	  });
	
	  authorizedRef.on("child_removed", function (snapshot) {
	    var fbKey = snapshot.key();
	    $timeout(function () {
	      delete authorizedForLoggedInAccount[fbKey];
	    }, 0);
	  });
	
	  loggedInTweetAsRef.on("child_added", function (snapshot) {
	    var twitterHandle = snapshot.val();
	    $timeout(function () {
	      accountsYouCanTweetAs.push(twitterHandle);
	    }, 0);
	    console.log(twitterHandle);
	  });
	
	  this.addAccount = function (twitterHandle) {
	    twitterHandle = twitterHandle.toLowerCase();
	    // if(authorizedForLoggedInAccount.indexOf(twitterHandle) === -1){
	    authorizedRef.push(twitterHandle);
	    iCanTweetAsRef = new Firebase('https://teamtweet15.firebaseio.com/ICanTweetAsAccounts/' + twitterHandle);
	    iCanTweetAsRef.push(loggedInAccount);
	    //accountsForCurrentAdmin.push(twitterHandle);
	    // }
	  };
	
	  this.deleteAuthorizedAccount = function (fbKey) {
	    console.log(fbKey);
	    authorizedRef.child(fbKey).remove();
	  };
	});

/***/ },
/* 5 */
/*!************************************!*\
  !*** ./src/services/apiService.js ***!
  \************************************/
/***/ function(module, exports) {

	"use strict";
	
	app.service("apiService", function () {
	  this.tweetAs = function (options) {
	    // Do the thing here...
	    console.log(options);
	  };
	});

/***/ },
/* 6 */
/*!**************************************!*\
  !*** ./src/controllers/TweetCtrl.js ***!
  \**************************************/
/***/ function(module, exports) {

	"use strict";
	
	app.controller("TweetCtrl", function ($scope, accountService, apiService) {
	  $scope.accountList = accountService.getAllAccountsYouCanTweetAs();
	
	  $scope.tweetAs = function () {
	    apiService.tweetAs($scope.data);
	  };
	});

/***/ },
/* 7 */
/*!****************************************!*\
  !*** ./src/controllers/AccountCtrl.js ***!
  \****************************************/
/***/ function(module, exports) {

	"use strict";
	
	app.controller("AccountsCtrl", function ($scope, accountService, apiService) {
	  $scope.accounts = accountService.getAll();
	
	  $scope.addAccount = function () {
	    accountService.addAccount($scope.twitterHandle);
	    $scope.twitterHandle = "";
	  };
	
	  $scope.deleteAccount = function (twitterHandle) {
	    accountService.deleteAuthorizedAccount(twitterHandle);
	  };
	});

/***/ },
/* 8 */
/*!************************************!*\
  !*** ./src/controllers/NavCtrl.js ***!
  \************************************/
/***/ function(module, exports) {

	/**
	 * Created by HUQ on 9/17/15.
	 */
	"use strict";
	
	app.controller("NavCtrl", function ($scope, authService) {
	  $scope.loggedInUserHandle = authService.currentAccount;
	});

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map