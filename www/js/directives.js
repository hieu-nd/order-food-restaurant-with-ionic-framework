angular.module('starter.directives', [])


.directive('ionCatalog', function($location, $state, $ionicHistory, cartService) {
    var link = function(scope, element, attr) {
        scope.addToCart = function(product) {
            cartService.addToCart(product);
        };
        scope.goToCategory = function(categoryId) {
            $ionicHistory.nextViewOptions({ disableBack: true });
            $location.path("/app/category/" + categoryId);
        };
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/catalog-item.html',
        link: link,
        scope: {
            products: '=',
            currentcatid: '='
        }
    };
})


.directive('fancySelect', function($ionicModal) {
    var link = function(scope, element, attrs) {
        scope.$watch('product.myOptions', function() {
            if (typeof scope.product.myOptions !== 'undefined' && scope.product.myOptions[(scope.optionnumber - 1)] !== 'undefined') {
                scope.myoption = scope.product.myOptions[(scope.optionnumber - 1)];
            }
        });
        $ionicModal.fromTemplateUrl(
            'templates/partials/fancy-select-items.html', {
                'scope': scope
            }).then(function(modal) {
            scope.modal = modal;
        });
        scope.showItems = function(event) {
            event.preventDefault();
            scope.modal.show();
        }
        scope.hideItems = function() {
            scope.modal.hide();
        }
        scope.$on('$destroy', function() {
            scope.modal.remove();
        });
        scope.validateOption = function(option) {
            scope.myoption = option;
            scope.product.myOptions[(scope.optionnumber - 1)] = option;
            scope.product.myPrice = scope.product.Price;
            scope.product.myOptions.forEach(function(option) {
                scope.product.myPrice = scope.product.myPrice + option.get("deltaPrice");
            });
            scope.hideItems();
        }
    };
    return {
        restrict: 'E',
        templateUrl: 'templates/partials/fancy-select.html',
        scope: {
            'product': '=',
            'optionnumber': '='
        },
        link: link
    };
})


.directive('ionCart', function(cartService) {
    var link = function(scope, element, attr) {
        scope.$watch('cartproducts', function() {
            cartService.updateTotal();
            scope.total = cartService.total;
            scope.emptyProducts = scope.cartproducts.length ? false : true;
        }, true);
        scope.addProduct = function(product) {
            cartService.addOneProduct(product);
        };
        scope.removeProduct = function(product) {
            product.Quantity <= 1 ? cartService.removeProduct(product) : cartService.removeOneProduct(product);
        };
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/cart-item.html',
        link: link,
        scope: {
            cartproducts: '='
        }
    };
})


.directive('ionCartFooter', function($state, $rootScope) {
    var link = function(scope, element, attr) {
        $rootScope.$watch('isLoggedIn', function() {
            if ($rootScope.isLoggedIn) {
                element.html("<div class='title cart-footer'>Checkout</div>");
            } else {
                element.html("<div class='title cart-footer'>Register / Checkout</div>");
            }
        }, true);
        element.addClass('bar bar-footer bar-positive');
        element.on('click', function(e) {
            $state.go('app.checkout');
        });
        element.on('touchstart', function() {
            element.css({ opacity: 0.8 });
        });
        element.on('touchend', function() {
            element.css({ opacity: 1 });
        });
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/cart-footer.html',
        link: link
    };
})


.directive('ionCartSubFooter', function($state, $rootScope, $location, $ionicHistory, $ionicModal, userService) {
    var link = function(scope, element, attr) {
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: scope
        }).then(function(modal) {
            scope.modal = modal;
        });
        scope.logout = function() {
            Parse.User.logOut();
            userService.userInfo = {};
            $rootScope.isLoggedIn = false;
            $ionicHistory.nextViewOptions({ disableBack: true });
            $state.go('app.catalog', { clear: true });
        };
        scope.forgot = function() {
            scope.closeLogin();
            $state.go('app.forgot');
        };
        scope.closeLogin = function() {
            scope.modal.hide();
        };
        scope.doLogin = function() {
            userService.login(scope.loginData)
                .then(function(result) {
                    // Subscribe to receive a notification for this specific user (testing purpose):
                    parsePlugin.subscribe(result.get("firstName"), function() {
                        console.log("RegisterCtrl ::: parsePlugin.subscribe : " + result.get("firstName"));
                    }, function(error) {
                        console.error('RegisterCtrl ::: parsePlugin.subscribe ::: error: ' + JSON.stringify(error));
                    });
                    userService.userInfo = result.toJSON();
                    $rootScope.isLoggedIn = true;
                    scope.closeLogin();
                    $state.go('app.checkout', {}, { reload: true });
                }, function(error) {
                    scope.error = error;
                });
        };
        $rootScope.$watch('isLoggedIn', function() {
            if ($rootScope.isLoggedIn) {
                element.html("<div class='title cart-sub-footer'>Logout</div>");
            } else {
                element.html("<div class='title cart-sub-footer'>Login</div>");
            }
        }, true);
        element.addClass('bar bar-subfooter bar-dark');
        element.on('click', function(e) {
            if ($rootScope.isLoggedIn) {
                scope.logout();
            } else {
                scope.modal.show();
            }
        });
        element.on('touchstart', function() {
            element.css({ opacity: 0.8 });
        });
        element.on('touchend', function() {
            element.css({ opacity: 1 });
        });
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/cart-subfooter.html',
        link: link
    };
})


.directive('ionCheckout', function($rootScope, cartService, userService) {
    var link = function(scope, element, attr) {
        scope.$watch(function() {
            scope.userinfo = userService.userInfo;
            scope.isLoggedIn = $rootScope.isLoggedIn;
            scope.total = cartService.total;
        });
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/checkout-form.html',
        scope: {
            userinfo: '='
        },
        link: link
    };
})


.directive('ionCheckoutFooter', function($rootScope, $location, $ionicHistory, $ionicPlatform, Settings, cartService, userService, orderService, CheckoutValidation) {
    var paypalApp = {
        initialize: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            $ionicPlatform.ready(function() {
                paypalApp.onDeviceReady();
            });
        },
        onDeviceReady: function() {
            paypalApp.receivedEvent('deviceready');
        },
        receivedEvent: function(id) {
            paypalApp.initPaymentUI();
        },
        initPaymentUI: function() {
            var clientIDs = {
                "PayPalEnvironmentProduction": Settings.paypal_live_client_id,
                "PayPalEnvironmentSandbox": Settings.paypal_sandbox_client_id
            };
            PayPalMobile.init(clientIDs, paypalApp.onPayPalMobileInit);
        },
        onAuthorizationCallback: function(authorization) {
            $rootScope.longnotify("Payment authorized");
            console.log("authorization: " + JSON.stringify(authorization, null, 4));
        },
        onUserCanceled: function(result) {
            $rootScope.longnotify("Payment cancelled");
            orderService.updateOrderStatus("Cancelled");
            orderService.currentOrder = {};
        },
        onSuccessfulPayment: function(payment, $timeout) {
            $rootScope.longnotify("Payment successful.<br>Thank you for shopping with us.");
            var response = payment.response;
            if (response.state == "approved") {
                cartService.emptyCart();
                orderService.updateOrderStatus("Paid");
                orderService.currentOrder = {};
            }
        },
        createPayment: function(amount, description) {
            var paymentDetails = new PayPalPaymentDetails(amount, "0.00", "0.00");
            var payment = new PayPalPayment(amount, "USD", description, "Sale", paymentDetails);
            return payment;
        },
        configuration: function() {
            // for more options see `paypal-mobile-js-helper.js`
            var config = new PayPalConfiguration({
                merchantName: Settings.paypal_merchant_name,
                merchantPrivacyPolicyURL: "",
                merchantUserAgreementURL: ""
            });
            return config;
        },
        onPrepareRender: function() {},
        onPayPalMobileInit: function() {
            PayPalMobile.prepareToRender(Settings.paypal_current_env,
                paypalApp.configuration(),
                paypalApp.onPrepareRender()
            );
        }
    };
    paypalApp.initialize();

    var link = function(scope, element, attr) {
        scope.$watch(function() {
            scope.userinfo = userService.userInfo;
            scope.total = cartService.total;
        });
        element.addClass('bar bar-footer bar-positive');
        element.on('click', function() {
            var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
            angular.element(ionErrorDiv).html('').css({ color: '#ED303C', opacity: 1 });
            if ($rootScope.isLoggedIn) {
                if (CheckoutValidation.checkLoggedInputs(scope.userinfo)) {
                    userService.save(scope.userinfo);
                    orderService.newOrder(cartService.cartProducts, cartService.total)
                        .then(function(ordersaved) {
                            orderService.currentOrder = ordersaved;
                            cartService.getPaypalItems().then(function(results) {
                                var payment = paypalApp.createPayment(scope.total, "Order ID: " + ordersaved.id);
                                payment.invoiceNumber = ordersaved.id;
                                payment.items = results;
                                PayPalMobile.renderSinglePaymentUI(payment, paypalApp.onSuccessfulPayment, paypalApp.onUserCanceled);
                            });
                        });
                } else {
                    var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
                    angular.element(ionErrorDiv).html('<br>You have invalid or missing fields.<br><br>').css({ color: '#ED303C', opacity: 1 });
                }
            } else {
                if (CheckoutValidation.checkAll(scope.userinfo)) {
                    userService.register(scope.userinfo)
                        .then(function(result) {
                            $rootScope.isLoggedIn = true;
                            // Subscribe to receive a notification for this specific user (testing purpose):
                            parsePlugin.subscribe(result.get("firstName"), function() {
                                console.log("RegisterCtrl ::: parsePlugin.subscribe : " + result.get("firstName"));
                            }, function(error) {
                                console.error('RegisterCtrl ::: parsePlugin.subscribe ::: error: ' + JSON.stringify(error));
                            });
                            orderService.newOrder(cartService.cartProducts, cartService.total)
                                .then(function(ordersaved) {
                                    orderService.currentOrder = ordersaved;
                                    cartService.getPaypalItems().then(function(results) {
                                        var payment = paypalApp.createPayment(scope.total, "Order ID: " + ordersaved.id);
                                        payment.invoiceNumber = ordersaved.id;
                                        payment.items = results;
                                        PayPalMobile.renderSinglePaymentUI(payment, paypalApp.onSuccessfulPayment, paypalApp.onUserCanceled);
                                    });
                                });
                        }, function(error) {
                            console.error("REGISTER ERROR: " + error);
                            var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
                            angular.element(ionErrorDiv).html('<br>' + error + '<br><br>').css({ color: '#ED303C', opacity: 1 });
                        });
                } else {
                    var ionErrorDiv = document.getElementsByClassName('checkout-form-error');
                    angular.element(ionErrorDiv).html('<br>You have invalid or missing fields.<br><br>').css({ color: '#ED303C', opacity: 1 });
                }
            }
        });
        element.on('touchstart', function() {
            element.css({ opacity: 0.8 });
        });
        element.on('touchend', function() {
            element.css({ opacity: 1 });
        });
    };
    return {
        restrict: 'AEC',
        templateUrl: 'templates/partials/checkout-footer.html',
        link: link
    };
})


.directive('checkoutName', function($timeout, CheckoutValidation) {
    var link = function(scope, element, attr) {
        var iconfn = element.children()[1].children[1];
        var iconln = element.children()[2].children[1];
        scope.onFirstNameBlur = function() {
            angular.element(iconfn).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.firstName)) {
                    angular.element(iconfn).removeClass('ion-loading-d');
                    angular.element(iconfn).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(iconfn).removeClass('ion-loading-d');
                    angular.element(iconfn).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onFirstNameFocus = function() {
            angular.element(iconfn).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
        scope.onLastNameBlur = function() {
            angular.element(iconln).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.lastName)) {
                    angular.element(iconln).removeClass('ion-loading-d');
                    angular.element(iconln).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(iconln).removeClass('ion-loading-d');
                    angular.element(iconln).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onLastNameFocus = function() {
            angular.element(iconln).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
    };
    return {
        restrict: 'AE',
        scope: {
            userinfo: '=',
        },
        link: link,
        templateUrl: 'templates/partials/checkout-name.html'
    };
})


.directive('checkoutAccount', function($timeout, CheckoutValidation) {
    var link = function(scope, element, attr) {
        var icone = element.children()[1].children[1];
        var iconp = element.children()[2].children[1];
        scope.onEmailBlur = function() {
            angular.element(icone).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateEmail(scope.userinfo.email)) {
                    angular.element(icone).removeClass('ion-loading-d');
                    angular.element(icone).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(icone).removeClass('ion-loading-d');
                    angular.element(icone).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onEmailFocus = function() {
            angular.element(icone).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
        scope.onPasswordBlur = function() {
            angular.element(iconp).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.password)) {
                    angular.element(iconp).removeClass('ion-loading-d');
                    angular.element(iconp).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(iconp).removeClass('ion-loading-d');
                    angular.element(iconp).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onPasswordFocus = function() {
            angular.element(iconp).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
    };
    return {
        restrict: 'AE',
        scope: {
            userinfo: '=',
        },
        link: link,
        templateUrl: 'templates/partials/checkout-account.html'
    };
})


.directive('checkoutAddress', function($timeout, CheckoutValidation) {
    var link = function(scope, element, attr) {
        var icona = element.children()[1].children[1];
        var iconc = element.children()[3].children[1];
        var icons = element.children()[4].children[1];
        var iconz = element.children()[5].children[1];
        scope.onAddressBlur = function() {
            angular.element(icona).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.addressLineOne)) {
                    angular.element(icona).removeClass('ion-loading-d');
                    angular.element(icona).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(icona).removeClass('ion-loading-d');
                    angular.element(icona).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onAddressFocus = function() {
            angular.element(icona).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
        scope.onCityBlur = function() {
            angular.element(iconc).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.city)) {
                    angular.element(iconc).removeClass('ion-loading-d');
                    angular.element(iconc).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(iconc).removeClass('ion-loading-d');
                    angular.element(iconc).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onCityFocus = function() {
            angular.element(iconc).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
        scope.onStateBlur = function() {
            angular.element(icons).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.state)) {
                    angular.element(icons).removeClass('ion-loading-d');
                    angular.element(icons).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(icons).removeClass('ion-loading-d');
                    angular.element(icons).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onStateFocus = function() {
            angular.element(icons).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
        scope.onZipBlur = function() {
            angular.element(iconz).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateZipcode(scope.userinfo.zipcode)) {
                    angular.element(iconz).removeClass('ion-loading-d');
                    angular.element(iconz).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(iconz).removeClass('ion-loading-d');
                    angular.element(iconz).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onZipFocus = function() {
            angular.element(iconz).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
        scope.onCountryBlur = function() {
            angular.element(icons).addClass('ion-loading-d');
            $timeout(function() {
                if (!CheckoutValidation.validateName(scope.userinfo.country)) {
                    angular.element(icons).removeClass('ion-loading-d');
                    angular.element(icons).addClass('ion-close-round').css({ color: '#ED303C' });
                    return;
                } else {
                    angular.element(icons).removeClass('ion-loading-d');
                    angular.element(icons).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                }
            }, 300);
        };
        scope.onCountryFocus = function() {
            angular.element(icons).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
        };
    };
    return {
        restrict: 'AE',
        scope: {
            userinfo: '=',
        },
        link: link,
        templateUrl: 'templates/partials/checkout-address.html'
    };
})


.directive('input', function($timeout) {
    return {
        restrict: 'E',
        scope: {
            'returnClose': '=',
            'onReturn': '&'
        },
        link: function(scope, element, attr) {
            element.bind('keydown', function(e) {
                if (e.which == 13) {
                    if (scope.returnClose) {
                        //console.log('return-close true: closing keyboard');
                        element[0].blur();
                    }
                    if (scope.onReturn) {
                        $timeout(function() {
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }
});

/*
.directive('ionProductImage', function($timeout, $ionicModal, $ionicSlideBoxDelegate) {
    var link = function(scope, element, attr) {
      scope.closeModal = function() {
        scope.modal.hide();
        scope.modal.remove();
      };
      element.on('click', function(){
        $ionicModal.fromTemplateUrl('templates/partials/cart-image-modal.html', {
          animation: 'slide-left-right',
          scope: scope
        })
        .then(function(modal){
          scope.modal = modal;
          scope.modal.show();
          $timeout( function() {
            $ionicSlideBoxDelegate.update();
          });
        });
      });
    };
    return {
      restrict: 'A',
      link: link,
      scope: '='
    };
})
*/
