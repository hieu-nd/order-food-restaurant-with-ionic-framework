angular.module('starter.services', [])

.factory('Settings', function() {
    return {
        parse_app_id: '',
        parse_js_key: '',
        parse_client_key: '',
        paypal_sandbox_client_id: '',
        paypal_live_client_id: '',
        //paypal_current_env: 'PayPalEnvironmentSandbox', // when you are in the Sandbox
        paypal_current_env: 'PayPalEnvironmentProduction', // when you decide to go live.
        paypal_merchant_name: ''
    };
})


.factory('Search', function() {
    return { query: "" }
})


.service('productService', function($rootScope, $q) {
    this.Products = [];
    var getProductsByCategory = function(categoryId) {
        var q = $q.defer();
        var Products = {}; //Parse.Object.extend("Products"),
        query = new Parse.Query(Products);
        query.include("categoryId");
        query.equalTo("categoryId", {
            __type: "Pointer",
            className: "Categories",
            objectId: categoryId
        });
        query.equalTo("Available", true);
        query.find().then(function(result) {
            q.resolve(result);
        });
        return q.promise;
    }
    var getSubCategories = function(categoryId) {
        var q = $q.defer();
        var subCategory = {} //Parse.Object.extend("Categories"),
        query = new Parse.Query(subCategory);
        query.equalTo("parentId", {
            __type: "Pointer",
            className: "Categories",
            objectId: categoryId
        });
        query.find().then(function(result) {
            q.resolve(result);
        });
        return q.promise;
    }
    this.getAllSubProducts = function(categoryId) {
        var q = $q.defer();
        var promises = [];
        getProductsByCategory(categoryId).then(function(results) {
            if (results.length > 0) {
                results.forEach(function(Item) {
                    var Product = {};
                    Product.id = Item.id;
                    Product.Title = Item.get("Title");
                    Product.Description = Item.get("Description");
                    Product.Price = Item.get("Price");
                    Product.myPrice = Item.get("Price");
                    Product.categoryId = Item.get("categoryId").id;
                    Product.categoryName = Item.get("categoryId").get("Name");
                    Product.Image1 = Item.get("Image1")._url;
                    getProdOptions(Item).then(function(options) {
                        Product.Options = options;
                        Product.myOptions = [];
                        Product.myAllOptions = "";
                        options.forEach(function(option) {
                            if (option.length > 0) {
                                Product.myOptions.push(option[0]);
                            }
                        });
                    });
                    promises.push(Product);
                });
            }
        });
        var subCategory = {} //Parse.Object.extend("Categories"),
        query = new Parse.Query(subCategory);
        query.equalTo("parentId", {
            __type: "Pointer",
            className: "Categories",
            objectId: categoryId
        });
        query.find().then(function(Subcategories) {
            if (Subcategories.length == 0) {
                q.resolve(promises);
            }
            Subcategories.forEach(function(subcategory) {
                getProductsByCategory(subcategory.id).then(function(results) {
                    if (results.length > 0) {
                        results.forEach(function(Item) {
                            var Product = {};
                            Product.id = Item.id;
                            Product.Title = Item.get("Title");
                            Product.Description = Item.get("Description");
                            Product.Price = Item.get("Price");
                            Product.myPrice = Item.get("Price");
                            Product.categoryId = Item.get("categoryId").id;
                            Product.categoryName = Item.get("categoryId").get("Name");
                            Product.Image1 = Item.get("Image1")._url;
                            getProdOptions(Item).then(function(options) {
                                Product.Options = options;
                                Product.myOptions = [];
                                Product.myAllOptions = "";
                                options.forEach(function(option) {
                                    if (option.length > 0) {
                                        Product.myOptions.push(option[0]);
                                    }
                                });
                            });
                            promises.push(Product);
                        });
                    }
                });
                getSubCategories(subcategory.id).then(function(Subcategories) {
                    if (Subcategories.length == 0) {
                        q.resolve(promises);
                    }
                    Subcategories.forEach(function(subcategory) {
                        getProductsByCategory(subcategory.id).then(function(results) {
                            if (results.length > 0) {
                                results.forEach(function(Item) {
                                    var Product = {};
                                    Product.id = Item.id;
                                    Product.Title = Item.get("Title");
                                    Product.Description = Item.get("Description");
                                    Product.Price = Item.get("Price");
                                    Product.myPrice = Item.get("Price");
                                    Product.categoryId = Item.get("categoryId").id;
                                    Product.categoryName = Item.get("categoryId").get("Name");
                                    Product.Image1 = Item.get("Image1")._url;
                                    getProdOptions(Item).then(function(options) {
                                        Product.Options = options;
                                        Product.myOptions = [];
                                        Product.myAllOptions = "";
                                        options.forEach(function(option) {
                                            if (option.length > 0) {
                                                Product.myOptions.push(option[0]);
                                            }
                                        });
                                    });
                                    promises.push(Product);
                                });
                            }
                        });
                        getSubCategories(subcategory.id).then(function(Subcategories) {
                            if (Subcategories.length == 0) {
                                q.resolve(promises);
                            }
                            Subcategories.forEach(function(subcategory) {
                                getProductsByCategory(subcategory.id).then(function(results) {
                                    if (results.length > 0) {
                                        results.forEach(function(Item) {
                                            var Product = {};
                                            Product.id = Item.id;
                                            Product.Title = Item.get("Title");
                                            Product.Description = Item.get("Description");
                                            Product.Price = Item.get("Price");
                                            Product.myPrice = Item.get("Price");
                                            Product.categoryId = Item.get("categoryId").id;
                                            Product.categoryName = Item.get("categoryId").get("Name");
                                            Product.Image1 = Item.get("Image1")._url;
                                            getProdOptions(Item).then(function(options) {
                                                Product.Options = options;
                                                Product.myOptions = [];
                                                Product.myAllOptions = "";
                                                options.forEach(function(option) {
                                                    if (option.length > 0) {
                                                        Product.myOptions.push(option[0]);
                                                    }
                                                });
                                            });
                                            promises.push(Product);
                                        });
                                    }
                                });
                                getSubCategories(subcategory.id).then(function(Subcategories) {
                                    if (Subcategories.length == 0) {
                                        q.resolve(promises);
                                    }
                                    Subcategories.forEach(function(subcategory) {
                                        getProductsByCategory(subcategory.id).then(function(results) {
                                            if (results.length > 0) {
                                                results.forEach(function(Item) {
                                                    var Product = {};
                                                    Product.id = Item.id;
                                                    Product.Title = Item.get("Title");
                                                    Product.Description = Item.get("Description");
                                                    Product.Price = Item.get("Price");
                                                    Product.myPrice = Item.get("Price");
                                                    Product.categoryId = Item.get("categoryId").id;
                                                    Product.categoryName = Item.get("categoryId").get("Name");
                                                    Product.Image1 = Item.get("Image1")._url;
                                                    getProdOptions(Item).then(function(options) {
                                                        Product.Options = options;
                                                        Product.myOptions = [];
                                                        Product.myAllOptions = "";
                                                        options.forEach(function(option) {
                                                            if (option.length > 0) {
                                                                Product.myOptions.push(option[0]);
                                                            }
                                                        });
                                                    });
                                                    promises.push(Product);
                                                });
                                            }
                                        });
                                        getSubCategories(subcategory.id).then(function(Subcategories) {
                                            if (Subcategories.length == 0) {
                                                q.resolve(promises);
                                            }
                                            Subcategories.forEach(function(subcategory) {
                                                getProductsByCategory(subcategory.id).then(function(results) {
                                                    if (results.length > 0) {
                                                        results.forEach(function(Item) {
                                                            var Product = {};
                                                            Product.id = Item.id;
                                                            Product.Title = Item.get("Title");
                                                            Product.Description = Item.get("Description");
                                                            Product.Price = Item.get("Price");
                                                            Product.myPrice = Item.get("Price");
                                                            Product.categoryId = Item.get("categoryId").id;
                                                            Product.categoryName = Item.get("categoryId").get("Name");
                                                            Product.Image1 = Item.get("Image1")._url;
                                                            getProdOptions(Item).then(function(options) {
                                                                Product.Options = options;
                                                                Product.myOptions = [];
                                                                Product.myAllOptions = "";
                                                                options.forEach(function(option) {
                                                                    if (option.length > 0) {
                                                                        Product.myOptions.push(option[0]);
                                                                    }
                                                                });
                                                            });
                                                            promises.push(Product);
                                                        });
                                                    }
                                                });
                                                getSubCategories(subcategory.id).then(function(Subcategories) {
                                                    if (Subcategories.length == 0) {
                                                        q.resolve(promises);
                                                    }
                                                    Subcategories.forEach(function(subcategory) {
                                                        getProductsByCategory(subcategory.id).then(function(results) {
                                                            if (results.length > 0) {
                                                                results.forEach(function(Item) {
                                                                    var Product = {};
                                                                    Product.id = Item.id;
                                                                    Product.Title = Item.get("Title");
                                                                    Product.Description = Item.get("Description");
                                                                    Product.Price = Item.get("Price");
                                                                    Product.myPrice = Item.get("Price");
                                                                    Product.categoryId = Item.get("categoryId").id;
                                                                    Product.categoryName = Item.get("categoryId").get("Name");
                                                                    Product.Image1 = Item.get("Image1")._url;
                                                                    getProdOptions(Item).then(function(options) {
                                                                        Product.Options = options;
                                                                        Product.myOptions = [];
                                                                        Product.myAllOptions = "";
                                                                        options.forEach(function(option) {
                                                                            if (option.length > 0) {
                                                                                Product.myOptions.push(option[0]);
                                                                            }
                                                                        });
                                                                    });
                                                                    promises.push(Product);
                                                                });
                                                            }
                                                        });
                                                        getSubCategories(subcategory.id).then(function(Subcategories) {
                                                            if (Subcategories.length == 0) {
                                                                q.resolve(promises);
                                                            }
                                                            Subcategories.forEach(function(subcategory) {
                                                                getProductsByCategory(subcategory.id).then(function(results) {
                                                                    if (results.length > 0) {
                                                                        results.forEach(function(Item) {
                                                                            var Product = {};
                                                                            Product.id = Item.id;
                                                                            Product.Title = Item.get("Title");
                                                                            Product.Description = Item.get("Description");
                                                                            Product.Price = Item.get("Price");
                                                                            Product.myPrice = Item.get("Price");
                                                                            Product.categoryId = Item.get("categoryId").id;
                                                                            Product.categoryName = Item.get("categoryId").get("Name");
                                                                            Product.Image1 = Item.get("Image1")._url;
                                                                            getProdOptions(Item).then(function(options) {
                                                                                Product.Options = options;
                                                                                Product.myOptions = [];
                                                                                Product.myAllOptions = "";
                                                                                options.forEach(function(option) {
                                                                                    if (option.length > 0) {
                                                                                        Product.myOptions.push(option[0]);
                                                                                    }
                                                                                });
                                                                            });
                                                                            promises.push(Product);
                                                                        });
                                                                    }
                                                                });
                                                                getSubCategories(subcategory.id).then(function(Subcategories) {
                                                                    Subcategories.forEach(function(subcategory) {
                                                                        getProductsByCategory(subcategory.id).then(function(results) {
                                                                            if (results.length > 0) {
                                                                                results.forEach(function(Item) {
                                                                                    var Product = {};
                                                                                    Product.id = Item.id;
                                                                                    Product.Title = Item.get("Title");
                                                                                    Product.Description = Item.get("Description");
                                                                                    Product.Price = Item.get("Price");
                                                                                    Product.myPrice = Item.get("Price");
                                                                                    Product.categoryId = Item.get("categoryId").id;
                                                                                    Product.categoryName = Item.get("categoryId").get("Name");
                                                                                    Product.Image1 = Item.get("Image1")._url;
                                                                                    getProdOptions(Item).then(function(options) {
                                                                                        Product.Options = options;
                                                                                        Product.myOptions = [];
                                                                                        Product.myAllOptions = "";
                                                                                        options.forEach(function(option) {
                                                                                            if (option.length > 0) {
                                                                                                Product.myOptions.push(option[0]);
                                                                                            }
                                                                                        });
                                                                                    });
                                                                                    promises.push(Product);
                                                                                });
                                                                            }
                                                                        });
                                                                    });
                                                                    q.resolve(promises);
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
        return q.promise;
    }
    this.loadProducts = function(categoryId) {
        $rootScope.show();
        var catProducts = [];
        var deferred = $q.defer();
        this.getAllSubProducts(categoryId).then(function(promises) {
            deferred.resolve(promises);
            $rootScope.hide();
        });
        return deferred.promise;
    }.bind(this);
    this.searchProducts = function(searchquery) {
        $rootScope.show();
        var deferred = $q.defer();
        var allProducts = {}; //Parse.Object.extend("Products"),
        queryA = {}; //new Parse.Query(allProducts);
        queryA.equalTo("Available", true);
        queryA.include("categoryId");
        queryA.matches("Title", searchquery, 'i');
        queryB = {}; //new Parse.Query(allProducts);
        queryB.equalTo("Available", true);
        queryB.include("categoryId");
        queryB.matches("Description", searchquery, 'i');
        var query = {}; //Parse.Query.or(queryA, queryB);
        query.find({
            success: function(Items) {
                console.log("Total Products: ", Items.length);
                var Products = [];
                Items.forEach(function(Item) {
                    var Product = {};
                    Product.id = Item.id;
                    Product.Title = Item.get("Title");
                    Product.Description = Item.get("Description");
                    Product.Price = Item.get("Price");
                    Product.myPrice = Item.get("Price");
                    Product.categoryId = Item.get("categoryId").id;
                    Product.categoryName = Item.get("categoryId").get("Name");
                    Product.Image1 = Item.get("Image1")._url;
                    getProdOptions(Item).then(function(options) {
                        Product.Options = options;
                        Product.myOptions = [];
                        Product.myAllOptions = "";
                        options.forEach(function(option) {
                            if (option.length > 0) {
                                Product.myOptions.push(option[0]);
                            }
                        });
                    });
                    Products.push(Product);
                });
                deferred.resolve(Products);
                $rootScope.hide();
                $rootScope.$apply();
            },
            error: function(error) {
                console.log(error);
                deferred.reject(error);
                $rootScope.longnotify("Problem loading the products!!!");
            }
        })
        return deferred.promise;
    }.bind(this);

    var getProdOptions = function(item) {
        var q = $q.defer();
        var Options = [];
        item.relation('Option1').query().find().then(function(options) {
            Options.push(options);
            item.relation('Option2').query().find().then(function(options) {
                Options.push(options);
                item.relation('Option3').query().find().then(function(options) {
                    Options.push(options);
                    item.relation('Option4').query().find().then(function(options) {
                        Options.push(options);
                        q.resolve(Options);
                    });
                });
            });
        });
        return q.promise;
    }

    this.loadAllProducts = function() {
        $rootScope.show();
        var deferred = $q.defer();
        var allProducts = {}; //Parse.Object.extend("Products"),
        query = {}; //new Parse.Query(allProducts);
        query.equalTo("Available", true);
        query.include("categoryId");
        query.find({
            success: function(Items) {
                console.log("Total Products: ", Items.length);
                var Products = [];
                Items.forEach(function(Item) {
                    var Product = {};
                    Product.id = Item.id;
                    Product.Title = Item.get("Title");
                    Product.Description = Item.get("Description");
                    Product.Price = Item.get("Price");
                    Product.myPrice = Item.get("Price");
                    if (typeof Item.get("categoryId") !== "undefined") {
                        Product.categoryId = Item.get("categoryId").id;
                        Product.categoryName = Item.get("categoryId").get("Name");
                    }
                    if (typeof Item.get("Image1") !== "undefined") {
                        Product.Image1 = Item.get("Image1")._url;
                    }
                    getProdOptions(Item).then(function(options) {
                        Product.Options = options;
                        Product.myOptions = [];
                        Product.myAllOptions = "";
                        options.forEach(function(option) {
                            if (option.length > 0) {
                                Product.myOptions.push(option[0]);
                            }
                        });
                    });
                    Products.push(Product);
                });
                deferred.resolve(Products);
                $rootScope.hide();
                $rootScope.$apply();
            },
            error: function(error) {
                console.log(error);
                deferred.reject(error);
                $rootScope.longnotify("Problem loading the products!!!");
            }
        })
        return deferred.promise;
    }.bind(this);

    this.initProducts = function() {
        //$rootScope.show();
        //var deferred = $q.defer();
        var Configuration = {}; // Parse.Object.extend("Configuration");
        query = {}; // new Parse.Query(Configuration);
        query.find().then(function(result) {
            //q.resolve(result);
            if (result.length == 0) {
                console.log("CREATE PARSE CORE INITIAL CLASSES");
                var configuration = new Configuration();
                configuration.set("appVersion", "0.0.1");
                configuration.save().then(function() {
                    var Categories = {}; // Parse.Object.extend("Categories");
                    var categories = new Categories();
                    var Products = {}; //Parse.Object.extend("Products");
                    var products = new Products();
                    var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
                    var file = {}; //new Parse.File("mypic.png", { base64: base64 });
                    var ProductOptions = {}; // Parse.Object.extend("ProductOptions");
                    var options = new ProductOptions();
                    categories.set("Name", "Name");
                    categories.save().then(function(category) {
                        category.set("parentId", {
                            __type: "Pointer",
                            className: "Categories",
                            objectId: category.id
                        });
                        categories.save().then(function(category) {
                            categories.destroy();
                            products.set("Title", "Title");
                            products.set("Description", "Description");
                            products.set("Price", 0);
                            products.set("stockQuantity", 0);
                            products.set("Available", true);
                            products.set("Image1", file);
                            products.set("categoryId", {
                                __type: "Pointer",
                                className: "Categories",
                                objectId: category.id
                            });
                            products.save().then(function(product) {
                                options.set("Name", "Name");
                                options.set("Value", "Value");
                                options.set("deltaPrice", 0);
                                options.set("productId", {
                                    __type: "Pointer",
                                    className: "Products",
                                    objectId: product.id
                                });
                                options.save().then(function(option) {
                                    var relation1 = product.relation("Option1");
                                    var relation2 = product.relation("Option2");
                                    var relation3 = product.relation("Option3");
                                    var relation4 = product.relation("Option4");
                                    relation1.add(option);
                                    relation2.add(option);
                                    relation3.add(option);
                                    relation4.add(option);
                                    products.save().then(function(product) {
                                        products.destroy();
                                        options.destroy();
                                        categories.destroy();
                                        console.log("CLASS INITIATION END...");
                                    });
                                });
                            });
                        });
                    });
                });
            }
        });
        //return deferred.promise;
    }.bind(this);
})


.service('categoryService', function($q) {
    var arrayObjectIndexOf = function(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) {
                return i;
            }
        }
        return -1;
    }
    var getSubCategories = function(categoryId) {
        var q = $q.defer();
        var subCategory = {}; // Parse.Object.extend("Categories"),
        query = {}; //new Parse.Query(subCategory);
        query.equalTo("parentId", {
            __type: "Pointer",
            className: "Categories",
            objectId: categoryId
        });
        query.find().then(function(result) {
            q.resolve(result);
        });
        return q.promise;
    };
    var getProdCountbyCategory = function(categoryId) {
        var deferred = $q.defer();
        query = {}; // new Parse.Query("Products");
        query.equalTo("categoryId", categoryId);
        query.count({
            success: function(count) {
                deferred.resolve(count);
            },
            error: function(error) {
                console.log(JSON.stringify(error));
                deferred.reject(error);
            }
        });
        return deferred.promise;
    };
    this.getAllSubCategories = function(categoryId) {
        try {


            var q = $q.defer();
            var Categories = [];
            var subCategory = {}; // Parse.Object.extend("Categories"),
            query = {}; //new Parse.Query(subCategory);
            if (categoryId == 0) {
                query.equalTo("parentId", null);
            } else {
                query.equalTo("parentId", {
                    __type: "Pointer",
                    className: "Categories",
                    objectId: categoryId
                });
            }
            query.find().then(function(Subcategories) {
                if (Subcategories.length == 0) {
                    q.resolve(Categories);
                }
                Subcategories.forEach(function(subcategory) {
                    getProdCountbyCategory(subcategory).then(function(prodcount) {
                        Categories.push({ id: subcategory.id, Prefix: "", Name: subcategory.get("Name"), Prods: prodcount });
                        getSubCategories(subcategory.id).then(function(Subcategories) {
                            if (Subcategories.length == 0) {
                                q.resolve(Categories);
                            }
                            Subcategories.forEach(function(subcategory) {
                                parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                parentPrefix = Categories[parentIndex].Prefix;
                                getProdCountbyCategory(subcategory).then(function(prodcount) {
                                    Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                    getSubCategories(subcategory.id).then(function(Subcategories) {
                                        if (Subcategories.length == 0) {
                                            q.resolve(Categories);
                                        }
                                        Subcategories.forEach(function(subcategory) {
                                            parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                            parentPrefix = Categories[parentIndex].Prefix;
                                            getProdCountbyCategory(subcategory).then(function(prodcount) {
                                                Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                                getSubCategories(subcategory.id).then(function(Subcategories) {
                                                    if (Subcategories.length == 0) {
                                                        q.resolve(Categories);
                                                    }
                                                    Subcategories.forEach(function(subcategory) {
                                                        parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                                        parentPrefix = Categories[parentIndex].Prefix;
                                                        getProdCountbyCategory(subcategory).then(function(prodcount) {
                                                            Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                                            getSubCategories(subcategory.id).then(function(Subcategories) {
                                                                if (Subcategories.length == 0) {
                                                                    q.resolve(Categories);
                                                                }
                                                                Subcategories.forEach(function(subcategory) {
                                                                    parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                                                    parentPrefix = Categories[parentIndex].Prefix;
                                                                    getProdCountbyCategory(subcategory).then(function(prodcount) {
                                                                        Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                                                        getSubCategories(subcategory.id).then(function(Subcategories) {
                                                                            if (Subcategories.length == 0) {
                                                                                q.resolve(Categories);
                                                                            }
                                                                            Subcategories.forEach(function(subcategory) {
                                                                                parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                                                                parentPrefix = Categories[parentIndex].Prefix;
                                                                                getProdCountbyCategory(subcategory).then(function(prodcount) {
                                                                                    Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                                                                    getSubCategories(subcategory.id).then(function(Subcategories) {
                                                                                        if (Subcategories.length == 0) {
                                                                                            q.resolve(Categories);
                                                                                        }
                                                                                        Subcategories.forEach(function(subcategory) {
                                                                                            parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                                                                            parentPrefix = Categories[parentIndex].Prefix;
                                                                                            getProdCountbyCategory(subcategory).then(function(prodcount) {
                                                                                                Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                                                                                getSubCategories(subcategory.id).then(function(Subcategories) {
                                                                                                    Subcategories.forEach(function(subcategory) {
                                                                                                        parentIndex = arrayObjectIndexOf(Categories, subcategory.get("parentId").id, "id");
                                                                                                        parentPrefix = Categories[parentIndex].Prefix;
                                                                                                        getProdCountbyCategory(subcategory).then(function(prodcount) {
                                                                                                            Categories.splice((parentIndex + 1), 0, { id: subcategory.id, Prefix: parentPrefix + "+ ", Name: subcategory.get("Name"), Count: getProdCountbyCategory(subcategory), Prods: prodcount });
                                                                                                        });
                                                                                                    });
                                                                                                    q.resolve(Categories);
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            return q.promise;

        } catch (e) {
          
        }
        return {};
    }.bind(this);
    this.loadMenuCategories = function() {
        var menuCategories = [];
        var q = $q.defer();
        this.getAllSubCategories(0).then(function(Subcategories) {
            q.resolve(Subcategories);
        });
        return q.promise;
    }.bind(this);
    this.getCatName = function(categoryId) {
        var deferred = $q.defer();
        query = {}; //new Parse.Query("Categories");
        query.equalTo("objectId", categoryId);
        query.find({
            success: function(Category) {
                deferred.resolve(Category[0].get("Name"));
            },
            error: function(error) {
                deferred.reject(error);
            }
        });
        return deferred.promise;
    }.bind(this);
})


.service('cartService', function($rootScope, $q) {
    this.cartProducts = [];
    this.total = 0;
    this.getPaypalItems = function() {
        var orderItems = [];
        var deferred = $q.defer();
        this.cartProducts.forEach(function(item) {
            orderItems.push(new PayPalItem(item.Title, item.Quantity, item.Price, 'USD', 'yo'));
        });
        deferred.resolve(orderItems);
        return deferred.promise;
    }
    this.addToCart = function(product) {
        if (typeof product.myOptions !== 'undefined') {
            var productInCart = false;
            $rootScope.quicknotify("Added to my Shopping Bag.");
            product.myPrice = product.Price;
            product.myAllOptions = "";
            product.myOptions.forEach(function(option) {
                product.myPrice = product.myPrice + option.get("deltaPrice");
                product.myAllOptions = product.myAllOptions + "|" + option.get("Name") + ":" + option.get("Value");
            });
            this.cartProducts.forEach(function(prod, index, prods) {
                if (prod.id === product.id && product.myAllOptions === prod.myAllOptions) {
                    productInCart = prod;
                    return;
                }
            });
            if (productInCart) {
                this.addOneProduct(productInCart);
            } else {
                var newcartprod = {};
                newcartprod.id = product.id;
                newcartprod.Title = product.Title;
                newcartprod.Price = product.myPrice;
                newcartprod.Image1 = product.Image1;
                newcartprod.myOptions = JSON.parse(JSON.stringify(product.myOptions));
                newcartprod.myAllOptions = product.myAllOptions;
                newcartprod.Quantity = 1;
                this.cartProducts.push(newcartprod);
            }
        }
    };
    this.removeProduct = function(product) {
        this.cartProducts.forEach(function(prod, i, prods) {
            if (prod.id === product.id && product.myAllOptions === prod.myAllOptions) {
                this.cartProducts.splice(i, 1);
            }
        }.bind(this));
    };
    this.emptyCart = function() {
        this.cartProducts.splice(0, this.cartProducts.length);
        this.total = 0;
    }.bind(this);
    this.addOneProduct = function(product) {
        ++product.Quantity;
    };
    this.removeOneProduct = function(product) {
        --product.Quantity;
    };
    this.cartTotal = function() {
        var total = 0;
        this.cartProducts.forEach(function(prod, index, prods) {
            total += prod.Price * prod.Quantity;
        });
        //return formatTotal(total);
        return total;
    };
    var formatTotal = function(total) {
        return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
    this.updateTotal = function() {
        this.total = this.cartTotal();
    }.bind(this);
})


.service('CheckoutValidation', function() {
    this.validateName = function(name) {
        if (typeof name == 'undefined' || name == '') {
            return false;
        } else {
            return true;
        }
    };
    this.validateEmail = function(email) {
        if (typeof email == 'undefined' || email == '') {
            return false;
        }
        var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailReg.test(email);
    };
    this.validateZipcode = function(zipcode) {
        if (typeof zipcode == 'undefined' || zipcode == '') {
            return false;
        }
        var zipReg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
        return zipReg.test(zipcode);
    };
    this.checkLoggedInputs = function(checkoutDetails) {
        if (Object.keys(checkoutDetails).length === 0) {
            return false;
        }
        for (var input in checkoutDetails) {
            if (!this.validateName(checkoutDetails['firstName'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['lastName'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['addressLineOne'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['city'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['state'])) {
                return false;
            }
            if (!this.validateZipcode(checkoutDetails['zipcode'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['country'])) {
                return false;
            }
        }
        return true;
    }.bind(this);
    this.checkAll = function(checkoutDetails) {
        if (Object.keys(checkoutDetails).length === 0) {
            return false;
        }
        for (var input in checkoutDetails) {
            if (!this.validateName(checkoutDetails['firstName'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['lastName'])) {
                return false;
            }
            if (!this.validateEmail(checkoutDetails['email'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['password'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['addressLineOne'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['city'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['state'])) {
                return false;
            }
            if (!this.validateZipcode(checkoutDetails['zipcode'])) {
                return false;
            }
            if (!this.validateName(checkoutDetails['country'])) {
                return false;
            }
        }
        return true;
    }.bind(this);
})


.service('userService', function($rootScope, $q) {
    this.userInfo = {};
    this.register = function(userInfo) {
        $rootScope.show('Registering...');
        var deferred = $q.defer();
        var user = {}; // new Parse.User();
        user.set("username", userInfo.email.toLowerCase());
        user.set("password", userInfo.password);
        user.set("email", userInfo.email.toLowerCase());
        user.set("firstName", userInfo.firstName);
        user.set("lastName", userInfo.lastName);
        user.set("addressLineOne", userInfo.addressLineOne);
        user.set("addressLineTwo", userInfo.addressLineTwo);
        user.set("city", userInfo.city);
        user.set("state", userInfo.state);
        user.set("zipcode", userInfo.zipcode);
        user.set("country", userInfo.country);
        user.signUp(null, {
            success: function(user) {
                deferred.resolve(user);
                $rootScope.hide();
            },
            error: function(user, error) {
                console.log(JSON.stringify(error));
                deferred.reject(error.message);
                $rootScope.hide();
            }
        })
        return deferred.promise;
    }.bind(this);
    this.save = function(userInfo) {
        $rootScope.show('Saving...');
        var deferred = $q.defer();
        var user = {}; // Parse.User.current();
        user.set("firstName", userInfo.firstName);
        user.set("lastName", userInfo.lastName);
        user.set("addressLineOne", userInfo.addressLineOne);
        user.set("addressLineTwo", userInfo.addressLineTwo);
        user.set("city", userInfo.city);
        user.set("state", userInfo.state);
        user.set("zipcode", userInfo.zipcode);
        user.set("country", userInfo.country);
        user.save(null, {
            success: function(user) {
                deferred.resolve(user);
                $rootScope.hide();
            },
            error: function(user, error) {
                deferred.reject(error.message);
                $rootScope.hide();
            }
        });
        return deferred.promise;
    }.bind(this);
    this.login = function(loginData) {
        var deferred = $q.defer();
        $rootScope.show('Logging in');
        // Parse.User.logIn(('' + loginData.username).toLowerCase(), loginData.password, {
        //     success: function(user) {
        //         deferred.resolve(user);
        //         $rootScope.hide();
        //     },
        //     error: function(user, error) {
        //         deferred.reject(error.message);
        //         $rootScope.hide();
        //     }
        // });
        return deferred.promise;
    }.bind(this);
})


.service('orderService', function($rootScope, $q) {
    this.currentOrder = {};
    this.newOrder = function(cartproducts, cartTotal) {
        var deferred = $q.defer();
        $rootScope.show('Sending');
        var user = {}; //Parse.User.current();
        var Order = {}; // Parse.Object.extend("Order"),
        OrderDetails = {}; //Parse.Object.extend("OrderDetails"),
        currentOrder = {}; //new Order(),
        orderedProducts = currentOrder.relation("OrderedProducts");
        currentOrder
            .set("Status", "processing")
            .set("OrderTotalPrice", Number(cartTotal))
            .set("userId", user);
        currentOrder.save(null, {
            success: function(ordersaved) {
                cartproducts.forEach(function(cartproduct) {
                    var orderDetails = new OrderDetails();
                    orderDetails
                        .set("orderId", ordersaved)
                        .set("OrderProductName", cartproduct.Title)
                        .set("OrderProductPrice", cartproduct.Price)
                        .set("productOptions", cartproduct.myAllOptions)
                        .set("OrderProductQty", cartproduct.Quantity);
                    //.set("productId",cartproduct.id);
                    orderDetails.save(null, {
                        success: function(orderedproductsaved) {
                            orderedProducts.add(orderedproductsaved);
                            currentOrder.save(null, {
                                success: function(ordersaved) {
                                    this.currentOrder = ordersaved;
                                },
                                error: function(object, error) {
                                    console.log(JSON.stringify(object));
                                    console.log(JSON.stringify(error));
                                }
                            });
                        },
                        error: function(object, error) {
                            console.log(JSON.stringify(object));
                            console.log(JSON.stringify(error));
                        }
                    });
                });
                deferred.resolve(ordersaved);
            },
            error: function(object, error) {
                console.log(JSON.stringify(object));
                console.log(JSON.stringify(error));
                deferred.reject(error);
            }
        });
        $rootScope.hide();
        return deferred.promise;
    }.bind(this);
    this.deleteOrder = function(cartproducts, cartTotal) {
        var deferred = $q.defer();
        query = {}; //new Parse.Query("OrderDetails");
        query.equalTo("orderId", this.currentOrder);
        query.find({
            success: function(items) {
                Parse.Object.destroyAll(items, {
                    success: function() {},
                    error: function(error) {
                        console.error("Error deleting related comments " + error.code + ": " + error.message);
                    }
                });
            },
            error: function(error) {
                console.error("Error finding related comments " + error.code + ": " + error.message);
            }
        });
        this.currentOrder.destroy();
    }.bind(this);
    this.updateOrderStatus = function(status) {
        //var deferred = $q.defer();
        this.currentOrder
            .set("Status", status)
        this.currentOrder.save(null, {
            success: function(ordersaved) {
                this.currentOrder = ordersaved;
            },
            error: function(object, error) {
                console.log(JSON.stringify(object));
                console.log(JSON.stringify(error));
            }
        });
        //return deferred.promise;
    }.bind(this);
});
