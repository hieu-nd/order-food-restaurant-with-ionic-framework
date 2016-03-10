angular.module('starter.controllers', [])


.controller('HomeController', function($scope, $rootScope, $ionicHistory, $ionicSideMenuDelegate, $ionicLoading, $location, $state, cartService, categoryService, restaurantService, productService, $firebaseObject) {
        //categoryService.createsampledata();
        //restaurantService.createsampledata();
        //productService.createsampledata();
        $ionicLoading.show({ template: "Loading..." });
        $scope.lstRestaurant = restaurantService.AllRestaurant;
        $ionicLoading.hide();

        $rootScope.model = {};

        $scope.search = function() {
            $location.path("/search");
        }

    })
    .controller('RegisterController', function($scope, $rootScope, $state, $ionicPopup, $ionicLoading, $location, $firebaseObject, $firebaseArray, userService) {
        $scope.loginData = {};

        var User = new Firebase("https://chowapp.firebaseio.com/user");
        $scope.lstUser = $firebaseArray(User);
        $scope.signup = function() {
            if (!$scope.loginData.email) {
                $ionicPopup.alert({
                    title: 'Information!',
                    template: 'Please put email'
                });
                return;
            }

            if (!$scope.loginData.lastname) {
                $ionicPopup.alert({
                    title: 'Information!',
                    template: 'Please put lastname'
                });
                return;
            }
            if (!$scope.loginData.phone) {
                $ionicPopup.alert({
                    title: 'Information!',
                    template: 'Please put your phone'
                });
                return;
            }
            if (!$scope.loginData.password) {
                $ionicPopup.alert({
                    title: 'Information!',
                    template: 'Please put your password'
                });
                return;
            }
            $ionicLoading.show({ template: "Loading..." });
            $scope.user = {};
            $scope.user.name = $scope.loginData.name.trim();
            $scope.user.email = $scope.loginData.email.trim();
            $scope.user.lastname = $scope.loginData.lastname.trim();
            $scope.user.phone = $scope.loginData.phone.trim();
            $scope.user.password = $scope.loginData.password.trim();

            userService.createuser($scope.user, function(response) {
                $ionicLoading.hide();
                if (response == true) {
                    $ionicPopup.alert({
                        title: '',
                        template: 'Sign Up success'
                    });
                    $location.path("/home");
                } else {
                    $ionicPopup.alert({
                        title: '',
                        template: response.message
                    });
                }
            });


            //$scope.lstUser.$add($scope.user);



        }

    })
    .controller('LoginController', function($scope, $rootScope, $state, $ionicPopup, $ionicLoading, userService, cartService) {
        $scope.user = {};
        $scope.error = {};
        $scope.state = { success: false };
        $scope.reset = function() {
            $rootScope.show();
            Parse.User.requestPasswordReset($scope.user.email, {
                success: function() {
                    $rootScope.hide();
                    $scope.state.success = true;
                },
                error: function(error) {
                    $rootScope.hide();
                    $scope.error.message = error.message;
                }
            });
        };

        $scope.loginData = {};
        $scope.doLogin = function() {

            if (!$scope.loginData.email) {
                $ionicPopup.alert({
                    title: 'Info',
                    template: 'Please put your email'
                });
                return;
            }

            if (!$scope.loginData.password) {
                $ionicPopup.alert({
                    title: 'Information!',
                    template: 'Please put your password'
                });
                return;
            }
            $ionicLoading.show({ template: "Loading..." });
            userService.login($scope.loginData.email, $scope.loginData.password.trim(),
                function(response) {
                    $ionicLoading.hide();
                    if (response == true) {
                        cartService.AllCart.forEach(function(obj) {
                            if (obj && obj.uid == $rootScope.currentUser.uid && !obj.ispayment) {
                                $rootScope.currentUser.Cart = obj;
                            }
                        });
                        $state.go('home');
                    } else {
                        $ionicPopup.alert({
                            title: 'Information!',
                            template: response.message
                        });
                    }
                });



        }
    })

.controller('ForgotPasswordController', function($scope, $rootScope, $state, $ionicPopup) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = { success: false };
    var ref = new Firebase("https://chowapp.firebaseio.com/user");


    $scope.reset = function() {
        ref.resetPassword({
            email: $scope.user.email
        }, function(error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_USER":
                        $ionicPopup.alert({
                            title: 'Information!',
                            template: "The specified user account does not exist"
                        });
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        $ionicPopup.alert({
                            title: 'Information!',
                            template: error.message
                        });
                        console.log("Error resetting password:", error);
                }
            } else {
                $ionicPopup.alert({
                    title: 'Information!',
                    template: "Password reset email sent successfully"
                });
                console.log("Password reset email sent successfully!");
            }
        });
    };
    $scope.login = function() {
        $state.go('app.login');
    };
})


.controller('SearchController', function($scope, $rootScope, productService, restaurantService) {
    var search = function() {
        $scope.lstRestaurant = [];


        restaurantService.AllRestaurant.forEach(function(obj) {
            if (obj.restaurantname.toUpperCase().indexOf($rootScope.model.keyword.toUpperCase()) > -1) {
                $scope.lstRestaurant.push(obj);
            }
        });
    }

    $scope.search = function() {
        search();
    }



})

.controller('RestaurantController', function($scope, $rootScope, productService, restaurantService, cartService, $stateParams) {
        try {
            $scope.restaurantid = $stateParams.restaurantid;
            $scope.lstRestaurant = restaurantService.AllRestaurant;
            var objrestaaurant = $scope.lstRestaurant.$getRecord($stateParams.restaurantid);
            $scope.restaurant = objrestaaurant
            $scope.listproduct = [];

            productService.AllProduct.forEach(function(product) {
                if (product.restaurantid && product.restaurantid == $stateParams.restaurantid) {
                    product.quantity = 0;
                    $scope.listproduct.push(product);
                }

            });


            $scope.addToCart = function(product) {

                try {
                    if (!product.quantity) {
                        product.quantity = 0;
                    }
                    product.quantity += 1;
                    if ($scope.restaurant)
                        product.restaurantid = $scope.restaurant.$id;
                    cartService.addToCart(product);
                } catch (e) {
                    cartService.AllErrorLog.$add(e);
                }
            }
            $scope.removeToCart = function(product) {
                try {
                    product.quantity = product.quantity - 1;
                    if (!product.quantity || product.quantity < 0) {
                        product.quantity = 0;
                    }
                    if ($scope.restaurant)
                        product.restaurantid = $scope.restaurant.$id;
                    cartService.removeToCart(product);
                } catch (e) {
                    cartService.AllErrorLog.$add(e);
                }

            }
        } catch (e) {
            cartService.AllErrorLog.$add(e);
        }

    })
    .controller('CategoryController', function($scope, productService, categoryService, restaurantService, $stateParams) {
        $scope.lstRestaurant = restaurantService.AllRestaurant;
    })

.controller('IntroduceController', function($rootScope, $scope, cartService) {


    })
    .controller('ProfileController', function($rootScope, $scope, userService, cartService, $ionicPopup) {
        // $scope.updateProfile = function() {
        //     userService.AllUser.$save($rootScope.currentUser);
        //     $ionicPopup.alert({
        //         title: 'Success!',
        //         template: 'Change account success'
        //     });
        // }

    })
    .controller('UpdateProfileController', function($rootScope, $scope, userService, cartService, $ionicPopup) {
        $scope.updateProfile = function() {
            userService.AllUser.$save($rootScope.currentUser);
            $ionicPopup.alert({
                title: 'Success!',
                template: 'Change account success'
            });
        }

    })
    .controller('CartController', function($rootScope, $scope, cartService, restaurantService) {
        $scope.lstCartDetail = [];
        $scope.lstRestaurant = [];
        $scope.totalmount = 0;
        var loadCart = function() {
            try {
                $scope.lstCartDetail = [];
                $scope.lstRestaurant = [];
                $scope.totalmount = 0;
                cartService.AllCartDetail.forEach(function(objcartdetail) {
                    var isexitrestaurant = false;
                    var restaurant = restaurantService.AllRestaurant.$getRecord(objcartdetail.restaurantid);
                    $scope.lstRestaurant.forEach(function(objrestaaurant) {
                        if (objcartdetail.restaurantid == objrestaaurant.$id) {
                            isexitrestaurant = true;
                        }
                    });

                    if (!isexitrestaurant && objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                        $scope.lstRestaurant.push(restaurant);
                    }

                    if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                        $scope.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);
                        $scope.lstCartDetail.push(objcartdetail);
                    }
                });
            } catch (e) {
                cartService.AllErrorLog.$add(e);
            }

        }

        $scope.getlistProductByRestaurant = function(restaurant) {
            try {
                restaurant.listproduct = [];
                $scope.lstCartDetail.forEach(function(productdetail) {
                    if (restaurant.$id == productdetail.restaurantid && productdetail.cartid == $rootScope.currentUser.Cart.$id) {
                        restaurant.listproduct.push(productdetail);
                    }
                });
                return restaurant.listproduct
            } catch (e) {
                cartService.AllErrorLog.$add(e);
                return [];
            }

        }

        $scope.addToCart = function(product) {
            try {
                cartService.addToCart(product);
                loadCart();
            } catch (e) {
                cartService.AllErrorLog.$add(e);

            }

        }
        $scope.removeToCart = function(product) {
            try {
                cartService.removeToCart(product);
                loadCart();
            } catch (e) {
                cartService.AllErrorLog.$add(e);

            }

        }
        if ($rootScope.currentUser && $rootScope.currentUser.Cart) {
            loadCart();
        } else {
            cartService.AllErrorLog.$add({ session: "session is null" });
            cartService.AllErrorLog.$add($rootScope.currentUser);
        }
    })
    .controller('MapController', function($scope, $rootScope, cartService, restaurantService, $stateParams) {
        try {
            $rootScope.nextpage = "#/paymentmethod";
            var infowindow = new google.maps.InfoWindow;
            var geocoder = new google.maps.Geocoder;

            var geocodeLatLng = function(geocoder, map, infowindow) {

                var latlng = { lat: $scope.positions.lat, lng: $scope.positions.lng };
                geocoder.geocode({ 'location': latlng }, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            map.setZoom(11);
                            var marker = new google.maps.Marker({
                                position: latlng,
                                map: map
                            });
                            infowindow.setContent(results[1].formatted_address);
                            $rootScope.currentUser.Cart.address = results[1].formatted_address;
                            cartService.AllCart.$save($rootScope.currentUser.Cart);
                            infowindow.open(map, marker);
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                })
            };
            var onSuccess = function(position) {
                $scope.positions = [{
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }];
                $scope.$on('mapInitialized', function(event, map) {
                    $scope.map = map;
                    geocodeLatLng(geocoder, map, infowindow);
                });


            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
            }
            if (navigator)
                navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } catch (error) {
            console.log(error);
            cartService.AllErrorLog.$add(error);
        }

    })
    .controller('CheckoutController', function($scope, $rootScope, cartService, restaurantService) {
        $rootScope.nextpage = null;
        $scope.totalmount = 0;
        cartService.AllCartDetail.forEach(function(objcartdetail) {
            if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                $scope.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);

            }
        });
    })
    .controller('PaymentMethodController', function($scope, $rootScope, $state, cartService, restaurantService) {
        $rootScope.nextpage = null;
        $scope.totalmount = 0;
        cartService.AllCartDetail.forEach(function(objcartdetail) {
            if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                $scope.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);

            }
        });

        var onSuccesfulPayment = function(payment) {
            var d = new Date,
                dformat = [d.getMonth() + 1,
                    d.getDate(),
                    d.getFullYear()
                ].join('/') + ' ' + [d.getHours(),
                    d.getMinutes(),
                    d.getSeconds()
                ].join(':');
            var order = {};
            order.email = $rootScope.currentUser.Cart.email;
            order.address = $rootScope.currentUser.Cart.address ? $rootScope.currentUser.Cart.address : '';
            order.lastname = $rootScope.currentUser.Cart.lastname;
            order.phone = $rootScope.currentUser.Cart.phone;
            order.uid = $rootScope.currentUser.Cart.uid;
            order.orderdetails = [];
            order.totalmount = 0;
            order.createdate = dformat;
            cartService.AllCartDetail.forEach(function(objcartdetail) {
                if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                    order.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);
                    order.orderdetails.push(objcartdetail);
                    cartService.AllCartDetail.$remove(objcartdetail);
                }
            });
            cartService.AllOrder.$add(order);
            cartService.AllCart.$remove($rootScope.currentUser.Cart);
            $rootScope.PaymentInfo = payment;
            $state.go("paymentsuccess")
            console.log("payment success: " + JSON.stringify(payment, null, 4));
        }
        var onAuthorizationCallback = function(authorization) {

            console.log("authorization: " + JSON.stringify(authorization, null, 4));
        }
        var onUserCanceled = function(result) {

            console.log(result);
        }
        var createPayment = function() {
            // for simplicity use predefined amount
            var paymentDetails = new PayPalPaymentDetails($scope.totalmount, "0.00", "0.00");
            var payment = new PayPalPayment($scope.totalmount, "USD", $rootScope.currentUser.Cart.lastname, "Sale",
                paymentDetails);

            return payment;
        }
        $scope.PaymentPaypal = function() {
            PayPalMobile.renderSinglePaymentUI(createPayment(), onSuccesfulPayment,
                onUserCanceled);

        }




    })
    .controller('PaypalController', function($scope, $rootScope, cartService, restaurantService) {
        $rootScope.nextpage = null;
        $scope.totalmount = 0;
        cartService.AllCartDetail.forEach(function(objcartdetail) {
            if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                $scope.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);

            }
        });
    })
    .controller('PaymentSuccessController', function($scope, $rootScope, cartService, restaurantService) {

    })
    .controller('CreditCardController', function($scope, $rootScope, $state, cartService, restaurantService) {
        $rootScope.nextpage = null;

        $scope.totalmount = 0;
        cartService.AllCartDetail.forEach(function(objcartdetail) {
            if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                $scope.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);
            }

        });

        $scope.Confirm = function() {
            var d = new Date,
                dformat = [d.getMonth() + 1,
                    d.getDate(),
                    d.getFullYear()
                ].join('/') + ' ' + [d.getHours(),
                    d.getMinutes(),
                    d.getSeconds()
                ].join(':');
            var order = {};
            order.email = $rootScope.currentUser.Cart.email;
            order.address = $rootScope.currentUser.Cart.address ? $rootScope.currentUser.Cart.address : '';
            order.lastname = $rootScope.currentUser.Cart.lastname;
            order.phone = $rootScope.currentUser.Cart.phone;
            order.uid = $rootScope.currentUser.Cart.uid;
            order.orderdetails = [];
            order.totalmount = 0;
            order.createdate = dformat;
            cartService.AllCartDetail.forEach(function(objcartdetail) {
                if (objcartdetail.cartid == $rootScope.currentUser.Cart.$id) {
                    order.totalmount += objcartdetail.quantity * parseFloat(objcartdetail.price);
                    order.orderdetails.push(objcartdetail);
                    cartService.AllCartDetail.$remove(objcartdetail);
                }
            });
            cartService.AllOrder.$add(order);
            cartService.AllCart.$remove($rootScope.currentUser.Cart);
            $rootScope.PaymentInfo = {};
            $state.go("paymentsuccess")
        }
    });
