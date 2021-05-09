webpackJsonp([1,4],{

/***/ 11:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_environments_environment_prod__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_amazon_cognito_identity_js__ = __webpack_require__(225);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var POOL_DATA = {
    UserPoolId: __WEBPACK_IMPORTED_MODULE_5_environments_environment_prod__["a" /* environment */].UserPoolId,
    ClientId: __WEBPACK_IMPORTED_MODULE_5_environments_environment_prod__["a" /* environment */].ClientId
};
var userPool = new __WEBPACK_IMPORTED_MODULE_6_amazon_cognito_identity_js__["a" /* CognitoUserPool */](POOL_DATA);
var AuthService = (function () {
    function AuthService(router) {
        this.router = router;
        this.authIsLoading = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"](false);
        this.authDidFail = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"](false);
        this.authStatusChanged = new __WEBPACK_IMPORTED_MODULE_2_rxjs_Subject__["Subject"]();
    }
    AuthService.prototype.signUp = function (username, email, password) {
        var _this = this;
        this.authIsLoading.next(true);
        var user = {
            username: username,
            email: email,
            password: password
        };
        var attrList = [];
        var emailAttribute = {
            Name: 'email',
            Value: user.email
        };
        attrList.push(new __WEBPACK_IMPORTED_MODULE_6_amazon_cognito_identity_js__["b" /* CognitoUserAttribute */](emailAttribute));
        userPool.signUp(user.username, user.password, attrList, null, function (err, result) {
            if (err) {
                _this.authDidFail.next(true);
                _this.authIsLoading.next(false);
                return;
            }
            _this.authDidFail.next(false);
            _this.authIsLoading.next(false);
            _this.registeredUser = result.user;
        });
        //Registrar usuario en la API
        return;
    };
    AuthService.prototype.confirmUser = function (username, code) {
        var _this = this;
        this.authIsLoading.next(true);
        var userData = {
            Username: username,
            Pool: userPool
        };
        var CognitUser = new __WEBPACK_IMPORTED_MODULE_6_amazon_cognito_identity_js__["c" /* CognitoUser */](userData);
        CognitUser.confirmRegistration(code, true, function (err, result) {
            if (err) {
                _this.authDidFail.next(true);
                _this.authIsLoading.next(false);
                return;
            }
            _this.authDidFail.next(false);
            _this.authIsLoading.next(false);
            _this.router.navigate(['/']);
        });
    };
    AuthService.prototype.signIn = function (username, password) {
        this.authIsLoading.next(true);
        var authData = {
            Username: username,
            Password: password
        };
        var authDetails = new __WEBPACK_IMPORTED_MODULE_6_amazon_cognito_identity_js__["d" /* AuthenticationDetails */](authData);
        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new __WEBPACK_IMPORTED_MODULE_6_amazon_cognito_identity_js__["c" /* CognitoUser */](userData);
        var that = this;
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: function (result) {
                that.authStatusChanged.next(true);
                that.authDidFail.next(false);
                that.authIsLoading.next(false);
                console.log(result);
            },
            onFailure: function (err) {
                that.authDidFail.next(true);
                that.authIsLoading.next(false);
                console.log(err);
            }
        });
        this.authStatusChanged.next(true);
        return;
    };
    AuthService.prototype.getAuthenticatedUser = function () {
        return userPool.getCurrentUser();
    };
    AuthService.prototype.logout = function () {
        this.getAuthenticatedUser().signOut();
        this.authStatusChanged.next(false);
        //this.authStatusChanged.next(false);
    };
    AuthService.prototype.isAuthenticated = function () {
        var user = this.getAuthenticatedUser();
        var obs = __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].create(function (observer) {
            if (!user) {
                observer.next(false);
            }
            else {
                user.getSession(function (err, session) {
                    if (err) {
                        observer.next(false);
                    }
                    else {
                        if (session.isValid()) {
                            observer.next(true);
                        }
                        else {
                            observer.next(false);
                        }
                    }
                });
                observer.next(false);
            }
            observer.complete();
        });
        return obs;
    };
    AuthService.prototype.initAuth = function () {
        var _this = this;
        this.isAuthenticated().subscribe(function (auth) { return _this.authStatusChanged.next(auth); });
    };
    return AuthService;
}());
AuthService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _a || Object])
], AuthService);

var _a;
//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ 112:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CartComponent = (function () {
    function CartComponent(productsService, router) {
        this.productsService = productsService;
        this.router = router;
        this.cartProducts = [];
        this.total = 0;
        this.showProducts();
    }
    CartComponent.prototype.ngOnInit = function () {
    };
    CartComponent.prototype.showProducts = function () {
        var _this = this;
        this.productsService.getProducts().subscribe(function (data) {
            _this.cartProductsTemp = data;
            _this.cartProductsTemp.forEach(function (element) {
                var obj = JSON.parse(localStorage.getItem(element.idProducto));
                if (obj) {
                    _this.cartProducts.push(obj);
                    _this.total = 0;
                    _this.total += Number(obj.precio) * Number(obj.cantidad);
                }
            });
        });
    };
    CartComponent.prototype.deleteFromCart = function (idProducto) {
        var _this = this;
        localStorage.removeItem(idProducto);
        var currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(function () {
            _this.router.navigate([currentUrl]);
        });
    };
    CartComponent.prototype.goCheckOut = function () {
        console.log('Go checkout');
        localStorage.setItem('totales', JSON.stringify(this.cartProducts));
        localStorage.setItem('totales_cuenta', JSON.stringify(this.total));
        this.router.navigate(['/checkout']);
    };
    return CartComponent;
}());
CartComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-cart',
        template: __webpack_require__(451),
        styles: [__webpack_require__(322)],
        providers: [__WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _b || Object])
], CartComponent);

var _a, _b;
//# sourceMappingURL=cart.component.js.map

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_stripe_service__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_user_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_services_order_service__ = __webpack_require__(120);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CheckoutComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var CheckoutComponent = (function () {
    function CheckoutComponent(ngZone, stripeService, router, authService, orderService) {
        this.ngZone = ngZone;
        this.stripeService = stripeService;
        this.router = router;
        this.authService = authService;
        this.orderService = orderService;
        var obj = JSON.parse(localStorage.getItem('totales'));
        if (obj) {
            this.totalesArr = obj;
        }
        var objTotal = JSON.parse(localStorage.getItem('totales_cuenta'));
        if (objTotal) {
            this.totalCuenta = objTotal;
        }
        this.username = this.authService.getAuthenticatedUser().getUsername();
    }
    CheckoutComponent.prototype.ngAfterViewInit = function () {
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.onChange.bind(this));
    };
    // Del objeto event se destruye y solo nos quedamos con el error
    CheckoutComponent.prototype.onChange = function (_a) {
        var _this = this;
        var error = _a.error;
        if (error) {
            this.ngZone.run(function () {
                _this.cardError = error.message;
            });
        }
        else {
            this.ngZone.run(function () {
                _this.cardError = null;
            });
        }
    };
    //tarjeta de prueba 42424242424242424
    CheckoutComponent.prototype.onClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, token, error, response, objTest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, stripe.createToken(this.card)];
                    case 1:
                        _a = _b.sent(), token = _a.token, error = _a.error;
                        if (!token) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.stripeService.charge(this.totalCuenta, token.id)];
                    case 2:
                        response = _b.sent();
                        console.log(response);
                        return [3 /*break*/, 4];
                    case 3:
                        this.ngZone.run(function () {
                            _this.cardError = error.message;
                        });
                        _b.label = 4;
                    case 4:
                        objTest = {
                            username: this.username,
                            total: this.totalCuenta,
                            productos: this.totalesArr
                        };
                        this.orderService.createOrder(objTest).then(function (data) {
                            console.log(data);
                        });
                        //Vaciar local Storage
                        this.totalesArr.forEach(function (element) {
                            localStorage.removeItem(element.idProducto);
                        });
                        localStorage.removeItem('totales');
                        localStorage.removeItem('totales_cuenta');
                        //Redirigir
                        this.router.navigate(['/']);
                        return [2 /*return*/];
                }
            });
        });
    };
    CheckoutComponent.prototype.ngOnDestroy = function () {
        this.card.removeEventListener('change', this.onChange.bind(this));
        this.card.destroy();
    };
    CheckoutComponent.prototype.ngOnInit = function () {
    };
    return CheckoutComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* ViewChild */])('cardInfo'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* ElementRef */]) === "function" && _a || Object)
], CheckoutComponent.prototype, "cardInfo", void 0);
CheckoutComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-checkout',
        template: __webpack_require__(452),
        styles: [__webpack_require__(323)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_stripe_service__["a" /* StripeService */], __WEBPACK_IMPORTED_MODULE_4_app_services_order_service__["a" /* OrderService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* NgZone */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* NgZone */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__services_stripe_service__["a" /* StripeService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_stripe_service__["a" /* StripeService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["a" /* Router */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3_app_user_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_app_user_auth_service__["a" /* AuthService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_4_app_services_order_service__["a" /* OrderService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4_app_services_order_service__["a" /* OrderService */]) === "function" && _f || Object])
], CheckoutComponent);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=checkout.component.js.map

/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_services_order_service__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_services_products_service__ = __webpack_require__(46);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PedidosComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var PedidosComponent = (function () {
    function PedidosComponent(productsService, orderService) {
        this.productsService = productsService;
        this.orderService = orderService;
        this.pedidos = [];
        // let obj = JSON.parse(localStorage.getItem('CognitoIdentityServiceProvider.1eg084qoupgmon8ff7q38iebnb.LastAuthUser'));
        var obj = localStorage.getItem('CognitoIdentityServiceProvider.1eg084qoupgmon8ff7q38iebnb.LastAuthUser');
        if (obj) {
            this.getOrdersId(obj);
        }
    }
    PedidosComponent.prototype.ngOnInit = function () {
    };
    PedidosComponent.prototype.getOrdersId = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.orderService.getOrders(username).then(function (orders) {
                    _this.pedidos = orders;
                });
                return [2 /*return*/];
            });
        });
    };
    PedidosComponent.prototype.deletePedido = function (idPedidoMongo) {
        console.log(idPedidoMongo);
        this.orderService.cancelOrder(idPedidoMongo).then(function (data) {
            console.log(data);
        });
        this.pedidos = this.pedidos.filter(function (item) {
            return item._id !== idPedidoMongo;
        });
    };
    return PedidosComponent;
}());
PedidosComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-pedidos',
        template: __webpack_require__(453),
        styles: [__webpack_require__(324)],
        providers: [__WEBPACK_IMPORTED_MODULE_2_app_services_products_service__["a" /* ProductsService */], __WEBPACK_IMPORTED_MODULE_1_app_services_order_service__["a" /* OrderService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_app_services_products_service__["a" /* ProductsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_app_services_products_service__["a" /* ProductsService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_app_services_order_service__["a" /* OrderService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_app_services_order_service__["a" /* OrderService */]) === "function" && _b || Object])
], PedidosComponent);

var _a, _b;
//# sourceMappingURL=pedidos.component.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductsAuthComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProductsAuthComponent = (function () {
    function ProductsAuthComponent(productsService, authService) {
        this.productsService = productsService;
        this.authService = authService;
        this.cantidadProductos = 1;
    }
    ProductsAuthComponent.prototype.ngOnInit = function () {
        this.showProducts();
        //Obtener usuario
        this.username = this.authService.getAuthenticatedUser().getUsername();
        //Crear carrito
    };
    ProductsAuthComponent.prototype.showProducts = function () {
        var _this = this;
        this.productsService.getProducts().subscribe(function (data) {
            console.log(data);
            _this.data = data;
        });
    };
    // addCart(idProducto){
    //   console.log('Insertando');
    //   console.log(this.authService.getAuthenticatedUser().getUsername());
    //   console.log(idProducto);
    //   this.productsService.cart.push(1);
    //   // Añadir al carrito
    // }
    ProductsAuthComponent.prototype.addCart = function (idProductoParam, nombreParam, precioParam, imgUrlParam) {
        var obj = JSON.parse(localStorage.getItem(idProductoParam));
        if (obj) {
            localStorage.removeItem(idProductoParam);
        }
        var producto = {
            idProducto: idProductoParam,
            nombre: nombreParam,
            precio: precioParam,
            cantidad: this.cantidadProductos,
            imgUrl: imgUrlParam
        };
        this.cantidadProductos = 1;
        localStorage.setItem(idProductoParam, JSON.stringify(producto));
    };
    return ProductsAuthComponent;
}());
ProductsAuthComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-products-auth',
        template: __webpack_require__(454),
        styles: [__webpack_require__(325)],
        providers: [__WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */]) === "function" && _b || Object])
], ProductsAuthComponent);

var _a, _b;
//# sourceMappingURL=products-auth.component.js.map

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_router__ = __webpack_require__(23);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ProductsComponent = (function () {
    function ProductsComponent(productsService, authService, router) {
        this.productsService = productsService;
        this.authService = authService;
        this.router = router;
        this.isAuthenticated = false;
        this.cantidadProductos = 1;
    }
    ProductsComponent.prototype.ngOnInit = function () {
        console.log(this.authService);
        // this.authService.authStatusChanged.subscribe(
        //   (authenticated) => {
        //     console.log('Authe');
        //     this.isAuthenticated = authenticated;
        //     console.log(this.isAuthenticated);
        //     // if (authenticated) {
        //     //   this.router.navigate(['/compare']);
        //     // } else {
        //     //   this.router.navigate(['/']);
        //     // }
        //   }
        // );
        // this.authService.initAuth();
        this.showProducts();
    };
    ProductsComponent.prototype.showProducts = function () {
        var _this = this;
        this.productsService.getProducts().subscribe(function (data) {
            console.log(data);
            _this.data = data;
        });
    };
    // localS(){
    //   console.log('LcoalS');
    //   let mi_objeto = {
    //     hola: 'casfasf'
    //   }
    //   localStorage.setItem("usuario", JSON.stringify(mi_objeto));
    //   console.log('Obtener de lo insertado');
    //   let obj = JSON.parse(localStorage.getItem("usuario"));
    //   console.log(obj);
    //   // localStorage.removeItem("titulo");
    //   let producto = {
    //     idProducto: 2,
    //     nombre:"Computadora Gamer Xtreme PC",
    //     precio: 8999,
    //     cantidad: 3,
    //     imgUrl: "https://www.cyberpuerta.mx/img/product/M/CP-XTREMEPCGAMING-XTBRR38GBVEGA3-1.png"
    //   };
    // }
    ProductsComponent.prototype.addCart = function (idProductoParam, nombreParam, precioParam, imgUrlParam) {
        var obj = JSON.parse(localStorage.getItem(idProductoParam));
        if (obj) {
            localStorage.removeItem(idProductoParam);
        }
        var producto = {
            idProducto: idProductoParam,
            nombre: nombreParam,
            precio: precioParam,
            cantidad: this.cantidadProductos,
            imgUrl: imgUrlParam
        };
        localStorage.setItem(idProductoParam, JSON.stringify(producto));
    };
    return ProductsComponent;
}());
ProductsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-products',
        template: __webpack_require__(455),
        styles: [__webpack_require__(326)],
        providers: [__WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_app_services_products_service__["a" /* ProductsService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_router__["a" /* Router */]) === "function" && _c || Object])
], ProductsComponent);

var _a, _b, _c;
//# sourceMappingURL=products.component.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_user_service__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfileComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProfileComponent = (function () {
    function ProfileComponent(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        var obj = this.authService.getAuthenticatedUser();
        this.userName = obj.username;
        console.log(this.userName);
        this.userService.read_user(this.userName)
            .then(function (data) {
            _this.userData = data;
            _this.userData = _this.userData.body.res;
            console.log(_this.userData);
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    return ProfileComponent;
}());
ProfileComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-profile',
        template: __webpack_require__(456),
        styles: [__webpack_require__(327)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_user_service__["a" /* UserService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__services_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_user_service__["a" /* UserService */]) === "function" && _b || Object])
], ProfileComponent);

var _a, _b;
//# sourceMappingURL=profile.component.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__ = __webpack_require__(33);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var OrderService = (function () {
    function OrderService(http) {
        this.http = http;
    }
    OrderService.prototype.createOrder = function (objParam) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_ORDERS + "create", objParam).toPromise();
    };
    OrderService.prototype.getOrders = function (username) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_ORDERS + ("username/" + username)).toPromise();
    };
    OrderService.prototype.getOrder = function () {
    };
    OrderService.prototype.cancelOrder = function (idPedidoMongo) {
        return this.http.delete(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_ORDERS + ("delete/" + idPedidoMongo)).toPromise();
    };
    return OrderService;
}());
OrderService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], OrderService);

var _a;
//# sourceMappingURL=order.service.js.map

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__ = __webpack_require__(33);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.create_user = function (emailParam, usernameParam) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_USER + '/createUser', {
            email: emailParam,
            usrName: usernameParam
        }).toPromise();
    };
    UserService.prototype.read_user = function (usernameParam) {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_USER + '/readUser?usrName=' + usernameParam).toPromise();
    };
    UserService.prototype.update_user = function (userParam) {
        return this.http.patch(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_USER + '/updateUser', userParam).toPromise();
    };
    return UserService;
}());
UserService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], UserService);

var _a;
//# sourceMappingURL=user.service.js.map

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(44);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SigninComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SigninComponent = (function () {
    function SigninComponent(authService) {
        this.authService = authService;
        this.didFail = false;
        this.isLoading = false;
    }
    SigninComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.authIsLoading.subscribe(function (isLoading) { return _this.isLoading = isLoading; });
        this.authService.authDidFail.subscribe(function (didFail) { return _this.didFail = didFail; });
    };
    SigninComponent.prototype.onSubmit = function () {
        var usrName = this.form.value.username;
        var password = this.form.value.password;
        this.authService.signIn(usrName, password);
    };
    return SigninComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* ViewChild */])('usrForm'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* NgForm */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* NgForm */]) === "function" && _a || Object)
], SigninComponent.prototype, "form", void 0);
SigninComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-signin',
        template: __webpack_require__(457),
        styles: [__webpack_require__(328)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _b || Object])
], SigninComponent);

var _a, _b;
//# sourceMappingURL=signin.component.js.map

/***/ }),

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_user_service__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(44);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SignupComponent = (function () {
    function SignupComponent(authService, userService) {
        this.authService = authService;
        this.userService = userService;
        this.confirmUser = false;
        this.didFail = false;
        this.isLoading = false;
    }
    SignupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.authIsLoading.subscribe(function (isLoading) { return _this.isLoading = isLoading; });
        this.authService.authDidFail.subscribe(function (didFail) { return _this.didFail = didFail; });
    };
    SignupComponent.prototype.onSubmit = function () {
        var usrName = this.form.value.username;
        this.usernameUser = usrName;
        var email = this.form.value.email;
        this.emailUser = email;
        var password = this.form.value.password;
        this.authService.signUp(usrName, email, password);
    };
    SignupComponent.prototype.onDoConfirm = function () {
        this.confirmUser = true;
    };
    SignupComponent.prototype.onConfirm = function (formValue) {
        this.authService.confirmUser(formValue.usrName, formValue.validationCode);
        this.userService.create_user(this.emailUser, this.usernameUser);
    };
    return SignupComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* ViewChild */])('usrForm'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* NgForm */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["b" /* NgForm */]) === "function" && _a || Object)
], SignupComponent.prototype, "form", void 0);
SignupComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-signup',
        template: __webpack_require__(458),
        styles: [__webpack_require__(329)],
        providers: [__WEBPACK_IMPORTED_MODULE_2__services_user_service__["a" /* UserService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__auth_service__["a" /* AuthService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__services_user_service__["a" /* UserService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_user_service__["a" /* UserService */]) === "function" && _c || Object])
], SignupComponent);

var _a, _b, _c;
//# sourceMappingURL=signup.component.js.map

/***/ }),

/***/ 204:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 204;


/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(210);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(213);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(221);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 211:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_signin_signin_component__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_signup_signup_component__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_auth_guard_service__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_products_products_component__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_cart_cart_component__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_checkout_checkout_component__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_products_auth_products_auth_component__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_pedidos_pedidos_component__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_profile_profile_component__ = __webpack_require__(119);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_5__pages_products_products_component__["a" /* ProductsComponent */] },
    { path: 'signup', component: __WEBPACK_IMPORTED_MODULE_3__user_signup_signup_component__["a" /* SignupComponent */] },
    { path: 'signin', component: __WEBPACK_IMPORTED_MODULE_2__user_signin_signin_component__["a" /* SigninComponent */] },
    { path: 'products', component: __WEBPACK_IMPORTED_MODULE_8__pages_products_auth_products_auth_component__["a" /* ProductsAuthComponent */] },
    { path: 'pedidos', component: __WEBPACK_IMPORTED_MODULE_9__pages_pedidos_pedidos_component__["a" /* PedidosComponent */] },
    { path: 'cart', component: __WEBPACK_IMPORTED_MODULE_6__pages_cart_cart_component__["a" /* CartComponent */] },
    { path: 'checkout', component: __WEBPACK_IMPORTED_MODULE_7__pages_checkout_checkout_component__["a" /* CheckoutComponent */] },
    { path: 'profile', component: __WEBPACK_IMPORTED_MODULE_10__pages_profile_profile_component__["a" /* ProfileComponent */] }
    // { path: 'compare', canActivate: [AuthGuard], component: CompareComponent },
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */].forRoot(routes)],
        exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* RouterModule */]],
        providers: [__WEBPACK_IMPORTED_MODULE_4__user_auth_guard_service__["a" /* AuthGuard */]]
    })
], AppRoutingModule);

//# sourceMappingURL=app-routing.module.js.map

/***/ }),

/***/ 212:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.isAuthenticated = false;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.authService.authStatusChanged.subscribe(function (authenticated) {
            _this.isAuthenticated = authenticated;
            if (authenticated) {
                _this.router.navigate(['/products']);
            }
            else {
                _this.router.navigate(['/']);
            }
        });
        this.authService.initAuth();
    };
    AppComponent.prototype.onLogout = function () {
        this.authService.logout();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(445),
        styles: [__webpack_require__(316)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__user_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* Router */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 213:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(212);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__user_signup_signup_component__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__user_signin_signin_component__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__compare_compare_component__ = __webpack_require__(216);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__app_routing_module__ = __webpack_require__(211);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__user_auth_service__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__compare_compare_service__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__compare_compare_input_compare_input_component__ = __webpack_require__(214);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__compare_compare_results_compare_results_component__ = __webpack_require__(215);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_products_products_component__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_navbar_navbar_component__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_footer_footer_component__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_cart_cart_component__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_checkout_checkout_component__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_pedidos_pedidos_component__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_products_auth_products_auth_component__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_profile_profile_component__ = __webpack_require__(119);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






















// Import the library
// import { NgxStripeModule } from 'ngx-stripe';
// import { ReactiveFormsModule } from '@angular/forms';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_6__user_signup_signup_component__["a" /* SignupComponent */],
            __WEBPACK_IMPORTED_MODULE_7__user_signin_signin_component__["a" /* SigninComponent */],
            __WEBPACK_IMPORTED_MODULE_8__compare_compare_component__["a" /* CompareComponent */],
            __WEBPACK_IMPORTED_MODULE_12__compare_compare_input_compare_input_component__["a" /* CompareInputComponent */],
            __WEBPACK_IMPORTED_MODULE_13__compare_compare_results_compare_results_component__["a" /* CompareResultsComponent */],
            __WEBPACK_IMPORTED_MODULE_14__pages_products_products_component__["a" /* ProductsComponent */],
            __WEBPACK_IMPORTED_MODULE_15__components_navbar_navbar_component__["a" /* NavbarComponent */],
            __WEBPACK_IMPORTED_MODULE_16__components_footer_footer_component__["a" /* FooterComponent */],
            __WEBPACK_IMPORTED_MODULE_17__pages_cart_cart_component__["a" /* CartComponent */],
            __WEBPACK_IMPORTED_MODULE_18__pages_checkout_checkout_component__["a" /* CheckoutComponent */],
            __WEBPACK_IMPORTED_MODULE_19__pages_pedidos_pedidos_component__["a" /* PedidosComponent */],
            __WEBPACK_IMPORTED_MODULE_20__pages_products_auth_products_auth_component__["a" /* ProductsAuthComponent */],
            __WEBPACK_IMPORTED_MODULE_21__pages_profile_profile_component__["a" /* ProfileComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_9__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HttpClientModule */]
            // ReactiveFormsModule,
            // NgxStripeModule.forRoot('pk_test_51I3VzvLLZMA2tr0ydd90pSE3F9SDehYJjyJO6s0ZuUWxtkFyCFDWAB46fTCsOhLKPJVVNuN6jHQ6yRyQql9ijRlX009TFvnbQm')
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_10__user_auth_service__["a" /* AuthService */], __WEBPACK_IMPORTED_MODULE_11__compare_compare_service__["a" /* CompareService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 214:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__compare_service__ = __webpack_require__(45);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompareInputComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CompareInputComponent = (function () {
    function CompareInputComponent(compareService) {
        this.compareService = compareService;
        this.isLoading = false;
        this.couldNotLoadData = false;
    }
    CompareInputComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.compareService.dataIsLoading.subscribe(function (isLoading) { return _this.isLoading = isLoading; });
        this.compareService.dataLoadFailed.subscribe(function (didFail) {
            _this.couldNotLoadData = didFail;
            _this.isLoading = false;
        });
    };
    CompareInputComponent.prototype.onSubmit = function () {
        var data = {
            age: this.form.value.age,
            height: this.form.value.height,
            income: this.form.value.income
        };
        this.compareService.onStoreData(data);
    };
    CompareInputComponent.prototype.onFetchStoredData = function () {
        this.compareService.onRetrieveData(false);
    };
    return CompareInputComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_15" /* ViewChild */])('compareForm'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* NgForm */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* NgForm */]) === "function" && _a || Object)
], CompareInputComponent.prototype, "form", void 0);
CompareInputComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-compare-input',
        template: __webpack_require__(446),
        styles: [__webpack_require__(317)]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__compare_service__["a" /* CompareService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__compare_service__["a" /* CompareService */]) === "function" && _b || Object])
], CompareInputComponent);

var _a, _b;
//# sourceMappingURL=compare-input.component.js.map

/***/ }),

/***/ 215:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compare_service__ = __webpack_require__(45);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompareResultsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CompareResultsComponent = (function () {
    function CompareResultsComponent(compareService) {
        this.compareService = compareService;
        this.compareData = [];
        this.didFail = false;
        this.lowerIsBetter = false;
        this.filter = 'age';
    }
    CompareResultsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.user = this.compareService.userData;
        this.compareService.dataEdited.subscribe(function () { return _this.user = _this.compareService.userData; });
        this.compareService.dataLoaded.subscribe(function (data) {
            _this.compareData = data;
        });
        this.compareService.dataLoadFailed.subscribe(function (didFail) { return _this.didFail = didFail; });
    };
    CompareResultsComponent.prototype.onFilter = function (filter) {
        this.filter = filter;
    };
    CompareResultsComponent.prototype.onSelectLower = function (isBetter) {
        this.lowerIsBetter = isBetter;
    };
    CompareResultsComponent.prototype.getListGroupItemClass = function (item) {
        if (+item[this.filter] === +this.user[this.filter]) {
            return 'list-group-item-warning';
        }
        if (this.lowerIsBetter) {
            return this.user[this.filter] < item[this.filter] ? 'list-group-item-success' : 'list-group-item-danger';
        }
        else {
            return this.user[this.filter] > item[this.filter] ? 'list-group-item-success' : 'list-group-item-danger';
        }
    };
    CompareResultsComponent.prototype.onStartSetData = function () {
        this.compareService.dataEdited.next(false);
    };
    CompareResultsComponent.prototype.onGetResults = function () {
        this.compareService.onRetrieveData();
    };
    CompareResultsComponent.prototype.onClearData = function () {
        this.compareService.onDeleteData();
    };
    return CompareResultsComponent;
}());
CompareResultsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-compare-results',
        template: __webpack_require__(447),
        styles: [__webpack_require__(318)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__compare_service__["a" /* CompareService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__compare_service__["a" /* CompareService */]) === "function" && _a || Object])
], CompareResultsComponent);

var _a;
//# sourceMappingURL=compare-results.component.js.map

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__compare_service__ = __webpack_require__(45);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompareComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CompareComponent = (function () {
    function CompareComponent(compareService) {
        this.compareService = compareService;
        this.doInput = true;
    }
    CompareComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.compareService.dataEdited.subscribe(function (edited) { return _this.doInput = !edited; });
    };
    return CompareComponent;
}());
CompareComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-compare',
        template: __webpack_require__(448),
        styles: [__webpack_require__(319)]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__compare_service__["a" /* CompareService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__compare_service__["a" /* CompareService */]) === "function" && _a || Object])
], CompareComponent);

var _a;
//# sourceMappingURL=compare.component.js.map

/***/ }),

/***/ 217:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    return FooterComponent;
}());
FooterComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-footer',
        template: __webpack_require__(449),
        styles: [__webpack_require__(320)]
    }),
    __metadata("design:paramtypes", [])
], FooterComponent);

//# sourceMappingURL=footer.component.js.map

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NavbarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NavbarComponent = (function () {
    function NavbarComponent() {
    }
    NavbarComponent.prototype.ngOnInit = function () {
    };
    return NavbarComponent;
}());
NavbarComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* Component */])({
        selector: 'app-navbar',
        template: __webpack_require__(450),
        styles: [__webpack_require__(321)]
    }),
    __metadata("design:paramtypes", [])
], NavbarComponent);

//# sourceMappingURL=navbar.component.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__ = __webpack_require__(33);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StripeService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StripeService = (function () {
    function StripeService(http) {
        this.http = http;
    }
    StripeService.prototype.charge = function (cantidad, tokenId) {
        return this.http.post(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].STRIPE_URL, {
            stripeToken: tokenId,
            cantidad: cantidad
        }).toPromise();
    };
    return StripeService;
}());
StripeService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], StripeService);

var _a;
//# sourceMappingURL=stripe.service.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var isAuthenticated = this.authService.isAuthenticated();
        return isAuthenticated;
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* Router */]) === "function" && _b || Object])
], AuthGuard);

var _a, _b;
//# sourceMappingURL=auth-guard.service.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 316:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 317:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 318:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 319:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 320:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 321:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 322:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 323:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, ".credit-card {\r\n    width:400px;\r\n    height: 50px;\r\n    border: 1px solid black;\r\n    padding: 20px;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -ms-flex-direction: column;\r\n        flex-direction: column;\r\n    -ms-flex-pack: space-evenly;\r\n        justify-content: space-evenly;\r\n\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 324:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 325:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, ".danger{\r\n  background-color: #f44336; /* Green */\r\n  border: none;\r\n  color: white;\r\n  padding: 15px 32px;\r\n  text-align: center;\r\n  text-decoration: none;\r\n  display: inline-block;\r\n  font-size: 16px;\r\n  margin: 4px 2px;\r\n  cursor: pointer;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "body {\r\n    background-color: #f9f9fa\r\n}\r\n\r\n.padding {\r\n    padding: 3rem !important\r\n}\r\n\r\n.user-card-full {\r\n    overflow: hidden\r\n}\r\n\r\n.card {\r\n    border-radius: 5px;\r\n    box-shadow: 0 1px 20px 0 rgba(69, 90, 100, 0.08);\r\n    border: none;\r\n    margin-bottom: 30px\r\n}\r\n\r\n.m-r-0 {\r\n    margin-right: 0px\r\n}\r\n\r\n.m-l-0 {\r\n    margin-left: 0px\r\n}\r\n\r\n.user-card-full .user-profile {\r\n    border-radius: 5px 0 0 5px\r\n}\r\n\r\n.bg-c-lite-green {\r\n    background: linear-gradient(to right, #ee5a6f, #f29263)\r\n}\r\n\r\n.user-profile {\r\n    padding: 20px 0\r\n}\r\n\r\n.card-block {\r\n    padding: 1.25rem\r\n}\r\n\r\n.m-b-25 {\r\n    margin-bottom: 25px\r\n}\r\n\r\n.img-radius {\r\n    border-radius: 5px\r\n}\r\n\r\nh6 {\r\n    font-size: 14px\r\n}\r\n\r\n.card .card-block p {\r\n    line-height: 25px\r\n}\r\n\r\n@media only screen and (min-width: 1400px) {\r\n    p {\r\n        font-size: 14px\r\n    }\r\n}\r\n\r\n.card-block {\r\n    padding: 1.25rem\r\n}\r\n\r\n.b-b-default {\r\n    border-bottom: 1px solid #e0e0e0\r\n}\r\n\r\n.m-b-20 {\r\n    margin-bottom: 20px\r\n}\r\n\r\n.p-b-5 {\r\n    padding-bottom: 5px !important\r\n}\r\n\r\n.card .card-block p {\r\n    line-height: 25px\r\n}\r\n\r\n.m-b-10 {\r\n    margin-bottom: 10px\r\n}\r\n\r\n.text-muted {\r\n    color: #919aa3 !important\r\n}\r\n\r\n.b-b-default {\r\n    border-bottom: 1px solid #e0e0e0\r\n}\r\n\r\n.f-w-600 {\r\n    font-weight: 600\r\n}\r\n\r\n.m-b-20 {\r\n    margin-bottom: 20px\r\n}\r\n\r\n.m-t-40 {\r\n    margin-top: 20px\r\n}\r\n\r\n.p-b-5 {\r\n    padding-bottom: 5px !important\r\n}\r\n\r\n.m-b-10 {\r\n    margin-bottom: 10px\r\n}\r\n\r\n.m-t-40 {\r\n    margin-top: 20px\r\n}\r\n\r\n.user-card-full .social-link li {\r\n    display: inline-block\r\n}\r\n\r\n.user-card-full .social-link li a {\r\n    font-size: 20px;\r\n    margin: 0 10px 0 0;\r\n    transition: all 0.3s ease-in-out\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 329:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: true,
    UserPoolId: 'us-east-1_sFjBDT2Mu',
    ClientId: '1eg084qoupgmon8ff7q38iebnb',
    STRIPE_URL: 'http://cnpagosenv-env.eba-mb6adzgw.us-east-1.elasticbeanstalk.com/stripe_checkout',
    API_USER: 'https://684e093a.us-south.apigw.appdomain.cloud/zimmcaapiuser',
    API_PRODUCTS: 'https://44rymj8bmg.execute-api.us-east-1.amazonaws.com/dev/zimmcaapiproducts/',
    API_ORDERS: 'http://ec2-54-197-35-124.compute-1.amazonaws.com:8888/api/order/',
};
//# sourceMappingURL=environment.prod.js.map

/***/ }),

/***/ 445:
/***/ (function(module, exports) {

module.exports = "<!-- <nav class=\"navbar navbar-default\">\r\n  <div class=\"container-fluid\">\r\n    <div class=\"navbar-header\">\r\n      <a class=\"navbar-brand\" href=\"/\">Compare Yourself!</a>\r\n    </div>\r\n    <div class=\"navbar-default\">\r\n      <ul class=\"nav navbar-nav\">\r\n        <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/compare\">Compare</a></li>\r\n        <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a (click)=\"onLogout()\" style=\"cursor: pointer;\">Logout</a></li>\r\n        <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\"><a routerLink=\"/\">Sign In</a></li>\r\n        <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/signup\">Sign Up</a></li>\r\n        <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/products\">productos</a></li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</nav> -->\r\n<div class=\"container\">\r\n\r\n  <div class=\"row\">\r\n    \r\n    <div class=\"col-xs-12\">\r\n        <div class=\"header-area header-area-2\">\r\n            <div class=\"container-fluid p-0\">\r\n                <div class=\"row no-gutters\">\r\n                    <div class=\"col-lg-3 col-md-6 col-6\">\r\n                        <div class=\"logo\">\r\n                            <img src=\"assets/img/logo/logo.png\" alt=\"\" />\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"col-lg-6 menu-none-block menu-center\">\r\n                        <div class=\"main-menu\">\r\n                            <nav>\r\n                               <ul>\r\n                                    <!-- <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/compare\">Compare</a></li> -->\r\n                                    <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a (click)=\"onLogout()\" style=\"cursor: pointer;\">Logout</a></li>\r\n                                    <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/\">Home</a></li>\r\n                                    <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\"><a routerLink=\"/signin\">Sign In</a></li>\r\n                                    <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/signup\">Sign Up</a></li>\r\n                                    <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/products\">productos</a></li>\r\n                                    <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/profile\">perfil</a></li>\r\n                                    <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/cart\">carrito</a></li>\r\n                                    <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/pedidos\">pedidos</a></li>\r\n                                    <!-- <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/products\">productos</a></li> -->\r\n                                    <!-- <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/cart\">carrito</a></li> -->\r\n\r\n                                    <!-- <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/checkout\">checkout</a></li> -->\r\n                                    <!-- <li><a href=\"#\">blog</a></li> -->\r\n                                    <!-- <li><a href=\"contact.html\">contact</a></li> -->\r\n                                </ul>\r\n                            </nav>\r\n                        </div>\r\n                    </div>\r\n                    <!-- <div class=\"col-lg-3 col-md-6 col-6\">\r\n                      <div class=\"header-search-cart\">\r\n                          <div class=\"header-search common-style\">\r\n                              <button class=\"sidebar-trigger-search\">\r\n                                  <span class=\"ion-ios-search-strong\"></span>\r\n                              </button>\r\n                          </div>\r\n                          <div class=\"header-cart common-style\">\r\n                              <button class=\"sidebar-trigger\">\r\n                                  <span class=\"ion-bag\"></span>\r\n                              </button>\r\n                          </div>\r\n                          <div class=\"header-sidebar common-style\">\r\n                              <button class=\"header-navbar-active\">\r\n                                  <span class=\"ion-navicon\"></span>\r\n                              </button>\r\n                          </div>\r\n                      </div>\r\n                  </div> -->\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    \r\n  </div>\r\n\r\n\r\n  \r\n  \r\n  <!-- <div class=\"row\">\r\n    <div class=\"col-xs-12\">\r\n      <router-outlet></router-outlet>\r\n    </div>\r\n  </div> -->\r\n\r\n\r\n</div>\r\n\r\n<router-outlet></router-outlet>\r\n\r\n<footer class=\"footer-area gray-bg pt-100 pb-95\">\r\n  <div class=\"container\">\r\n      <div class=\"row\">\r\n          <div class=\"col-lg-3 col-md-5 col-12\">\r\n              <div class=\"footer-widget\">\r\n                  <div class=\"footer-widget-l-content\">\r\n                      <!-- <h4>20 Years Experience</h4> -->\r\n                      <ul>\r\n                          <li><a href=\"#\"><i class=\"ion-social-twitter\"></i></a></li> \r\n                          <li><a href=\"#\"><i class=\"ion-social-tumblr\"></i></a></li>\r\n                          <li><a href=\"#\"><i class=\"ion-social-facebook\"></i></a></li> \r\n                          <li><a href=\"#\"><i class=\"ion-social-instagram-outline\"></i></a></li> \r\n                      </ul>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div class=\"col-lg-6 col-md-7 col-12\">\r\n              <div class=\"footer-widget\">\r\n                  <div class=\"footer-widget-m-content text-center\">\r\n                      <div class=\"footer-logo\">\r\n                          <a href=\"#\"><img src=\"assets/img/logo/logo.png\" alt=\"\"></a>\r\n                      </div>\r\n                      <div class=\"footer-nav\">\r\n                          <nav>\r\n                              <ul>\r\n                                <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a (click)=\"onLogout()\" style=\"cursor: pointer;\">Logout</a></li>\r\n                                <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/\">Home</a></li>\r\n                                <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\" [routerLinkActiveOptions]=\"{exact: true}\"><a routerLink=\"/signin\">Sign In</a></li>\r\n                                <li *ngIf=\"!isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/signup\">Sign Up</a></li>\r\n                                <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/products\">productos</a></li>\r\n                                <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/cart\">carrito</a></li>\r\n                                <li *ngIf=\"isAuthenticated\" routerLinkActive=\"active\"><a routerLink=\"/pedidos\">pedidos</a></li>\r\n                              </ul>\r\n                          </nav>\r\n                      </div>\r\n                      <p>Copyright <i class=\"fa fa-copyright\"></i> 2021 Todos los derechos reservados. </p>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n          <div class=\"col-lg-3 col-md-12 col-12\">\r\n              <div class=\"footer-widget f-right\">\r\n                  <div class=\"footer-widget-r-content\">\r\n                      <ul>\r\n                          <!-- <li><span>Phone :</span> +00 123 54 0056</li> -->\r\n                          <li><span>Email : </span> <a href=\"#\">is714046@iteso.mx</a></li>\r\n                          <li><span>Email : </span> <a href=\"#\">is709571@iteso.mx</a></li>\r\n                          <!-- <li><span>Address :</span> Dhaka Bangladesh</li> -->\r\n                      </ul>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</footer>\r\n"

/***/ }),

/***/ 446:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <h3>Set your Data</h3>\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3\">\r\n    <form class=\"text-center\" (ngSubmit)=\"onSubmit()\" #compareForm=\"ngForm\">\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"age\"\r\n          class=\"control-label\">Age</label>\r\n        <input\r\n          type=\"number\"\r\n          id=\"age\"\r\n          name=\"age\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"height\"\r\n          class=\"control-label\">Height (inch)</label>\r\n        <input\r\n          type=\"number\"\r\n          id=\"height\"\r\n          name=\"height\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"income\"\r\n          class=\"control-label\">Monthly Income (USD)</label>\r\n        <input\r\n          type=\"number\"\r\n          id=\"income\"\r\n          name=\"income\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <button class=\"btn btn-primary\" type=\"submit\" [disabled]=\"compareForm.invalid\">Submit</button>\r\n    </form>\r\n  </div>\r\n</div>\r\n<hr>\r\n<div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <div class=\"alert alert-danger\" *ngIf=\"couldNotLoadData\">An error occurred, please try again or submit new data!</div>\r\n    <button class=\"btn btn-primary\" (click)=\"onFetchStoredData()\">I already stored data on the server!</button>\r\n    <div class=\"loader\" *ngIf=\"isLoading\">Loading...</div>\r\n  </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n"

/***/ }),

/***/ 447:
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <h2>Your Results</h2>\r\n    <button class=\"btn btn-success\" (click)=\"onStartSetData()\">Set Data</button>\r\n    <button class=\"btn btn-danger\" (click)=\"onClearData()\">Clear Data on Server</button>\r\n    <button class=\"btn btn-primary\" (click)=\"onGetResults()\">Get Results</button>\r\n    <hr>\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <h3>Select Filter</h3>\r\n    <div class=\"list-group\">\r\n      <a style=\"cursor: pointer;\" class=\"list-group-item\" (click)=\"onFilter('age')\" [ngClass]=\"{active: filter == 'age'}\">Your Age: {{ user.age }}</a>\r\n      <a style=\"cursor: pointer;\" class=\"list-group-item\" (click)=\"onFilter('height')\" [ngClass]=\"{active: filter == 'height'}\">Your Height: {{ user.height }}</a>\r\n      <a style=\"cursor: pointer;\" class=\"list-group-item\" (click)=\"onFilter('income')\" [ngClass]=\"{active: filter == 'income'}\">Your Income: {{ user.income }}</a>\r\n    </div>\r\n    <div>\r\n      <button class=\"btn\" [ngClass]=\"{'btn-default': !lowerIsBetter, 'btn-primary': lowerIsBetter}\" (click)=\"onSelectLower(true)\">Lower is better</button>\r\n      <button class=\"btn\" [ngClass]=\"{'btn-default': lowerIsBetter, 'btn-primary': !lowerIsBetter}\" (click)=\"onSelectLower(false)\">Higher is better</button>\r\n    </div>\r\n    <hr>\r\n    <div class=\"loader\" *ngIf=\"!compareData && !didFail\">Loading...</div>\r\n    <div class=\"row\">\r\n      <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n        <div class=\"alert alert-danger\" *ngIf=\"didFail\">\r\n          An error occurred, please try again!\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <ul class=\"list-group\">\r\n      <li class=\"list-group-item\" *ngFor=\"let data of compareData\" [ngClass]=\"getListGroupItemClass(data)\">\r\n        Age: {{ data.age }} | Height: {{ data.height }} | Income: {{ data.income }}\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</div>\r\n\r\n"

/***/ }),

/***/ 448:
/***/ (function(module, exports) {

module.exports = "<app-compare-input *ngIf=\"doInput\"></app-compare-input>\r\n<app-compare-results *ngIf=\"!doInput\"></app-compare-results>\r\n"

/***/ }),

/***/ 449:
/***/ (function(module, exports) {

module.exports = "<p>\r\n  footer works!\r\n</p>\r\n"

/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(462);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__user_auth_service__ = __webpack_require__(11);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CompareService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CompareService = (function () {
    function CompareService(http, authService) {
        this.http = http;
        this.authService = authService;
        this.dataEdited = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](false);
        this.dataIsLoading = new __WEBPACK_IMPORTED_MODULE_2_rxjs_BehaviorSubject__["BehaviorSubject"](false);
        this.dataLoaded = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.dataLoadFailed = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
    }
    CompareService.prototype.onStoreData = function (data) {
        var _this = this;
        this.dataLoadFailed.next(false);
        this.dataIsLoading.next(true);
        this.dataEdited.next(false);
        this.userData = data;
        this.http.post('https://API_ID.execute-api.REGION.amazonaws.com/dev/', data, {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Authorization': 'XX' })
        })
            .subscribe(function (result) {
            _this.dataLoadFailed.next(false);
            _this.dataIsLoading.next(false);
            _this.dataEdited.next(true);
        }, function (error) {
            _this.dataIsLoading.next(false);
            _this.dataLoadFailed.next(true);
            _this.dataEdited.next(false);
        });
    };
    CompareService.prototype.onRetrieveData = function (all) {
        var _this = this;
        if (all === void 0) { all = true; }
        this.dataLoaded.next(null);
        this.dataLoadFailed.next(false);
        var queryParam = '';
        var urlParam = 'all';
        if (!all) {
            urlParam = 'single';
        }
        this.http.get('https://API_ID.execute-api.REGION.amazonaws.com/dev/' + urlParam + queryParam, {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Authorization': 'XXX' })
        })
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            if (all) {
                _this.dataLoaded.next(data);
            }
            else {
                console.log(data);
                if (!data) {
                    _this.dataLoadFailed.next(true);
                    return;
                }
                _this.userData = data[0];
                _this.dataEdited.next(true);
            }
        }, function (error) {
            _this.dataLoadFailed.next(true);
            _this.dataLoaded.next(null);
        });
    };
    CompareService.prototype.onDeleteData = function () {
        var _this = this;
        this.dataLoadFailed.next(false);
        this.http.delete('https://API_ID.execute-api.REGION.amazonaws.com/dev/', {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Authorization': 'XXX' })
        })
            .subscribe(function (data) {
            console.log(data);
        }, function (error) { return _this.dataLoadFailed.next(true); });
    };
    return CompareService;
}());
CompareService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__user_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__user_auth_service__["a" /* AuthService */]) === "function" && _b || Object])
], CompareService);

var _a, _b;
//# sourceMappingURL=compare.service.js.map

/***/ }),

/***/ 450:
/***/ (function(module, exports) {

module.exports = "<header class=\"pl-155 pr-155 intelligent-header\">\r\n  <div class=\"header-area header-area-2\">\r\n      <div class=\"container-fluid p-0\">\r\n          <div class=\"row no-gutters\">\r\n              <div class=\"col-lg-3 col-md-6 col-6\">\r\n                  <div class=\"logo\">\r\n                      <a href=\"index.html\"><img src=\"assets/img/logo/logo.png\" alt=\"\" /></a>\r\n                  </div>\r\n              </div>\r\n              <div class=\"col-lg-6 menu-none-block menu-center\">\r\n                  <div class=\"main-menu\">\r\n                      <nav>\r\n                         <ul>\r\n                              <li><a href=\"#\">home</a></li>\r\n                              <li><a href=\"about-us.html\">about us</a></li>\r\n                              <li><a href=\"shop-grid-view-5-col.html\">shop</a></li>\r\n                              <li><a href=\"#\">pages</a></li>\r\n                              <li><a href=\"#\">blog</a></li>\r\n                              <li><a href=\"contact.html\">contact</a></li>\r\n                          </ul>\r\n                      </nav>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</header>"

/***/ }),

/***/ 451:
/***/ (function(module, exports) {

module.exports = "<div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n    <div class=\"container\">\r\n        <div class=\"breadcrumb-content\">\r\n            <h2>cart page</h2>\r\n            <ul>\r\n                <li><a href=\"#\">home</a></li>\r\n                <li> cart </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n  </div>\r\n  <!-- shopping-cart-area start -->\r\n  <div class=\"cart-main-area pt-95 pb-100\">\r\n    <div class=\"container\">\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n                <h1 class=\"cart-heading\">Carrito</h1>\r\n                <form action=\"#\">\r\n                    <div class=\"table-content table-responsive\">\r\n                        <table *ngIf=\"cartProducts.length > 0\">\r\n                            <thead>\r\n                                <tr>\r\n                                    <th class=\"product-name\">eliminar</th>\r\n                                    <th class=\"product-price\">imagen</th>\r\n                                    <th class=\"product-name\">Producto</th>\r\n                                    <th class=\"product-price\">Precio</th>\r\n                                    <th class=\"product-quantity\">Cantidad</th>\r\n                                    <th class=\"product-subtotal\">Total</th>\r\n                                </tr>\r\n                            </thead>\r\n                            <tbody>\r\n\r\n                                <tr *ngFor=\"let item of cartProducts\">\r\n                                    <td class=\"product-remove\" (click)=\"deleteFromCart(item.idProducto)\">\r\n                                        <i class=\"ion-android-close\"></i>\r\n                                    </td>\r\n                                    <td class=\"product-thumbnail\">\r\n                                        <a href=\"#\"><img src=\"{{ item.imgUrl }}\" width=\"80\" height=\"80\" alt=\"\"></a>\r\n                                    </td>\r\n                                    <td class=\"product-name\"><a href=\"#\">{{ item.nombre }}</a></td>\r\n                                    <td class=\"product-price\"><span class=\"amount\">$ {{item.precio}}</span></td>\r\n                                    <td class=\"product-quantity\">\r\n                                        <input value=\"{{item.cantidad}}\" type=\"number\" disabled>\r\n                                    </td>\r\n                                    <td class=\"product-subtotal\">$ {{ item.precio * item.cantidad }}</td>\r\n                                    \r\n                                </tr>\r\n                            \r\n                            </tbody>\r\n                        </table>\r\n                        <table *ngIf=\"cartProducts.length == 0\">\r\n                            <div>\r\n                                <h4>Carrito vacio.</h4>\r\n                            </div>\r\n                        </table>\r\n                    </div>\r\n\r\n                    <div class=\"row\" *ngIf=\"cartProducts.length != 0\">\r\n                        <div class=\"col-md-5 ml-auto\">\r\n                            <div class=\"cart-page-total\">\r\n                                <h2>Totales</h2>\r\n                                <ul>\r\n                                    <li>Subtotal<span>$ {{ total }}</span></li>\r\n                                    <li>Total<span>$ {{ total }}</span></li>\r\n                                </ul>\r\n                                <a (click)=\"goCheckOut()\" style=\"color: white;\">Proceder a pagar</a>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n  </div>"

/***/ }),

/***/ 452:
/***/ (function(module, exports) {

module.exports = "<div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n    <div class=\"container\">\r\n        <div class=\"breadcrumb-content\">\r\n            <h2>checkout</h2>\r\n            <ul>\r\n                <li><a href=\"#\">home</a></li>\r\n                <li> checkout </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n<!-- checkout-area start -->\r\n<div class=\"checkout-area ptb-100\">\r\n    <div class=\"container\">\r\n      \r\n        <div class=\"row\">\r\n            <div class=\"col-lg-6 col-md-12 col-12\">\r\n                <form action=\"#\">\r\n                    <div class=\"checkbox-form\">\t\t\t\t\t\t\r\n                        <h3>Detalles Pedido</h3>\r\n                        <div class=\"row\">\r\n                            <div class=\"col-md-12\">\r\n                                <div class=\"country-select\">\r\n                                    <label>País <span class=\"required\">*</span></label>\r\n                                    <select>\r\n                                      <option value=\"volvo\">México</option>\r\n                                      <option value=\"saab\">Estados Unidos</option>\r\n                                    </select> \t\t\t\t\t\t\t\t\t\t\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-6\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Nombre <span class=\"required\">*</span></label>\t\t\t\t\t\t\t\t\t\t\r\n                                    <input type=\"text\" placeholder=\"\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-6\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Apellidos <span class=\"required\">*</span></label>\t\t\t\t\t\t\t\t\t\t\r\n                                    <input type=\"text\" placeholder=\"\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-12\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Dirección <span class=\"required\">*</span></label>\r\n                                    <input type=\"text\" placeholder=\"\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-12\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Ciudad <span class=\"required\">*</span></label>\r\n                                    <input type=\"text\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-6\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Estado <span class=\"required\">*</span></label>\t\t\t\t\t\t\t\t\t\t\r\n                                    <input type=\"text\" placeholder=\"\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-6\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>C.P. <span class=\"required\">*</span></label>\t\t\t\t\t\t\t\t\t\t\r\n                                    <input type=\"text\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-6\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Correo <span class=\"required\">*</span></label>\t\t\t\t\t\t\t\t\t\t\r\n                                    <input type=\"email\" />\r\n                                </div>\r\n                            </div>\r\n                            <div class=\"col-md-6\">\r\n                                <div class=\"checkout-form-list\">\r\n                                    <label>Telefono <span class=\"required\">*</span></label>\t\t\t\t\t\t\t\t\t\t\r\n                                    <input type=\"text\" />\r\n                                </div>\r\n                            </div>\t\t\t\t\t\t\t\t\r\n                        </div>\t\t\t\t\t\t\t\t\t\t\r\n                    </div>\r\n                </form>\r\n            </div>\t\r\n            <div class=\"col-lg-6 col-md-12 col-12\">\r\n                <div class=\"your-order\">\r\n                    <h3>Mi Orden</h3>\r\n                    <div class=\"your-order-table table-responsive\">\r\n                        <table>\r\n                            <thead>\r\n                                <tr>\r\n                                    <th class=\"product-name\">Producto</th>\r\n                                    <th class=\"product-total\">Total</th>\r\n                                </tr>\t\t\t\t\t\t\t\r\n                            </thead>\r\n                            <tbody>\r\n                                <tr class=\"cart_item\" *ngFor=\"let item of totalesArr\">\r\n                                    <td class=\"product-name\">\r\n                                        {{ item.nombre}} <strong class=\"product-quantity\"> ×  {{ item.cantidad }}</strong>\r\n                                    </td>\r\n                                    <td class=\"product-total\">\r\n                                        <span class=\"amount\">$ {{ item.cantidad * item.precio }}</span>\r\n                                    </td>\r\n                                </tr>\r\n                                \r\n                            </tbody>\r\n                            <tfoot>\r\n                                <tr class=\"cart-subtotal\">\r\n                                    <th>Subtotal</th>\r\n                                    <td><span class=\"amount\">$ {{ totalCuenta }}</span></td>\r\n                                </tr>\r\n                                <tr class=\"order-total\">\r\n                                    <th>Total</th>\r\n                                    <td><strong><span class=\"amount\">$ {{ totalCuenta }}</span></strong>\r\n                                    </td>\r\n                                </tr>\t\t\t\t\t\t\t\t\r\n                            </tfoot>\r\n                        </table>\r\n                    </div>\r\n                    <div class=\"payment-method\">\r\n                        <div class=\"payment-accordion\">\r\n\r\n                          <div class=\"panel-group\" id=\"faq\">\r\n                            <div class=\"panel panel-default\">\r\n                                <div class=\"panel-heading\">\r\n                                    <h5 class=\"panel-title\"><a data-toggle=\"collapse\" aria-expanded=\"true\" data-parent=\"#faq\" href=\"#payment-1\">Pago con Tarjeta.</a></h5>\r\n                                </div>\r\n                                <div id=\"payment-1\" class=\"panel-collapse collapse show\">\r\n                                    <div class=\"panel-body\">\r\n                                      <div #cardInfo></div>\r\n                                      <div class=\"error\" *ngIf=\"cardError\">\r\n                                        {{ cardError }}\r\n                                      </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n\r\n\r\n                          <!-- <div class=\"credit-card\">\r\n                            <div>\r\n                              <div #cardInfo></div>\r\n                              <div class=\"error\" *ngIf=\"cardError\">\r\n                                {{ cardError }}\r\n                              </div>\r\n                            </div>\r\n                            <button (click)=\"onClick()\">Pagar</button>\r\n                          </div> -->\r\n\r\n\r\n                            <!-- <div class=\"panel-group\" id=\"faq\">\r\n                                <div class=\"panel panel-default\">\r\n                                    <div class=\"panel-heading\">\r\n                                        <h5 class=\"panel-title\"><a data-toggle=\"collapse\" aria-expanded=\"true\" data-parent=\"#faq\" href=\"#payment-1\">Direct Bank Transfer.</a></h5>\r\n                                    </div>\r\n                                    <div id=\"payment-1\" class=\"panel-collapse collapse show\">\r\n                                        <div class=\"panel-body\">\r\n                                            <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won’t be shipped until the funds have cleared in our account.</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"panel panel-default\">\r\n                                    <div class=\"panel-heading\">\r\n                                        <h5 class=\"panel-title\"><a class=\"collapsed\" data-toggle=\"collapse\" aria-expanded=\"false\" data-parent=\"#faq\" href=\"#payment-2\">Cheque Payment</a></h5>\r\n                                    </div>\r\n                                    <div id=\"payment-2\" class=\"panel-collapse collapse\">\r\n                                        <div class=\"panel-body\">\r\n                                            <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won’t be shipped until the funds have cleared in our account.</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"panel panel-default\">\r\n                                    <div class=\"panel-heading\">\r\n                                        <h5 class=\"panel-title\"><a class=\"collapsed\" data-toggle=\"collapse\" aria-expanded=\"false\" data-parent=\"#faq\" href=\"#payment-3\">PayPal</a></h5>\r\n                                    </div>\r\n                                    <div id=\"payment-3\" class=\"panel-collapse collapse\">\r\n                                        <div class=\"panel-body\">\r\n                                            <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order won’t be shipped until the funds have cleared in our account.</p>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div> -->\r\n                            <div class=\"order-button-payment\">\r\n                              <!-- <button type=\"submit\" (click)=\"onClick()\">Pagar</button> -->\r\n                                <input (click)=\"onClick()\" type=\"submit\" value=\"Realizar pago\" />\r\n                            </div>\t\t\t\t\t\t\t\t\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n"

/***/ }),

/***/ 453:
/***/ (function(module, exports) {

module.exports = "<div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n  <div class=\"container\">\r\n      <div class=\"breadcrumb-content\">\r\n          <h2>Pedidos</h2>\r\n          <ul>\r\n              <li><a href=\"#\">home</a></li>\r\n              <li> Pedidos </li>\r\n          </ul>\r\n      </div>\r\n  </div>\r\n</div>\r\n<!-- shopping-cart-area start -->\r\n<div class=\"cart-main-area pt-95 pb-100\">\r\n  <div class=\"container\">\r\n      <div class=\"row\">\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n              <h1 class=\"cart-heading\">Pedidos</h1>\r\n              <form action=\"#\">\r\n                  <div class=\"table-content table-responsive\">\r\n                      <table *ngIf=\"pedidos.length > 0\">\r\n                          <thead>\r\n                              <tr>\r\n                                  <th class=\"product-name\">eliminar</th>\r\n                                  <th class=\"product-price\">Pedido #</th>\r\n                                  <th class=\"product-name\">fecha</th>\r\n                                  <th class=\"product-subtotal\">Total</th>\r\n                              </tr>\r\n                          </thead>\r\n                          <tbody>\r\n\r\n                              <tr *ngFor=\"let item of pedidos\">\r\n                                  <td class=\"product-remove\" (click)=\"deletePedido(item._id)\">\r\n                                      <i class=\"ion-android-close\"></i>\r\n                                  </td>\r\n                                  <td class=\"product-subtotal\"># {{ item.idPedido }}</td>\r\n                                  <td class=\"product-thumbnail\">\r\n                                      {{ item.fecha }}\r\n                                  </td>\r\n                                  <td class=\"product-subtotal\">$ {{ item.total }}</td>\r\n                                  \r\n                              </tr>\r\n                          \r\n                          </tbody>\r\n                      </table>\r\n                      <table *ngIf=\"pedidos.length == 0\">\r\n                          <div>\r\n                              <h4>No hay pedidos.</h4>\r\n                          </div>\r\n                      </table>\r\n                  </div>\r\n\r\n                  <!-- <div class=\"row\" *ngIf=\"cartProducts.length != 0\">\r\n                      <div class=\"col-md-5 ml-auto\">\r\n                          <div class=\"cart-page-total\">\r\n                              <h2>Totales</h2>\r\n                              <ul>\r\n                                  <li>Subtotal<span>$ {{ total }}</span></li>\r\n                                  <li>Total<span>$ {{ total }}</span></li>\r\n                              </ul>\r\n                              <a (click)=\"goCheckOut()\" style=\"color: white;\">Proceder a pagar</a>\r\n                          </div>\r\n                      </div>\r\n                  </div> -->\r\n              </form>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ 454:
/***/ (function(module, exports) {

module.exports = "\r\n            <div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n              <div class=\"container\">\r\n                  <div class=\"breadcrumb-content\">\r\n                      <h2>shop</h2>\r\n                      <ul>\r\n                          <li><a href=\"#\">home</a></li>\r\n                          <li> shop </li>\r\n                      </ul>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n\r\n          \r\n          <div class=\"shop-page-wrapper hidden-items padding-filter\">\r\n              <div class=\"container-fluid\">\r\n                  <div class=\"shop-filters-right\">\r\n\r\n                      <div class=\"shop-product-content tab-content\">\r\n\r\n\r\n                          <div id=\"grid-5-col1\" class=\"tab-pane fade active show\" >\r\n                              <div class=\"row custom-row\" >\r\n                                  <div class=\"custom-col-5 custom-col-style\" *ngFor=\"let item of data\">\r\n                                      <div class=\"single-product mb-35\">\r\n                                          <div class=\"product-img\">\r\n                                              \r\n                                              <a href=\"#\"><img src=\"{{item.imgUrl.S}}\" width=\"302\" height=\"365\" alt=\"\"></a>\r\n                                              <div class=\"product-action\">\r\n                                                <!-- <button class=\"danger\" (click)=\"addCart(item.idProducto)\" ><i class=\"ion-bag\"></i></button> -->\r\n                                                  <!-- <a title=\"Wishlist\" class=\"animate-left\" href=\"#\"><i class=\"ion-bag\" ></i></a> -->\r\n                                              </div>\r\n                                          </div>\r\n                                          <div class=\"product-content\">\r\n                                              <div class=\"product-title-price\">\r\n                                                  <div class=\"product-title\">\r\n                                                      <h4>{{item.nombre.S}}</h4>\r\n                                                  </div>\r\n                                                  <div class=\"product-price\">\r\n                                                      <span>$ {{item.precio}}</span>\r\n                                                  </div>\r\n                                              </div>\r\n                                              <div class=\"product-cart-categori\">\r\n                                                  <div class=\"product-cart\">\r\n                                                      <span>{{item.descripcion.S}}</span>\r\n                                                  </div>\r\n                                                  <br>\r\n                                                  <div class=\"product-categori\">\r\n                                                      <!-- <button class=\"danger\" (click)=\"addCart()\" ><i class=\"ion-bag\"></i> Añadir al carrito</button> -->\r\n                                                      <!-- <a class=\"animate-left\" href=\"#\" (click)=\"addCart()\"><i class=\"ion-bag\"></i> Añadir al carrito</a> -->\r\n                                                      <div class=\"input-group\">\r\n                                                        <input type=\"number\" class=\"form-control\" min=\"1\" max=\"100\" [(ngModel)]=\"cantidadProductos\">\r\n                                                        <span class=\"input-group-btn\">\r\n                                                             <button class=\"btn btn-default\" style=\"background-color: red;\"\r\n                                                                    (click)=\"addCart(item.idProducto,item.nombre.S,item.precio,item.imgUrl.S)\" >\r\n                                                                    <i class=\"ion-bag\" style=\"color: white;\"></i></button>\r\n                                                        </span>\r\n                                                     </div>\r\n                                                  </div>\r\n                                              </div>\r\n                                          </div>\r\n                                      </div>\r\n                                 </div>\r\n\r\n\r\n                                 \r\n                              </div>\r\n                          </div>\r\n  \r\n                      </div>\r\n                  </div>\r\n              </div>\r\n          </div>"

/***/ }),

/***/ 455:
/***/ (function(module, exports) {

module.exports = "\r\n            <div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n                <div class=\"container\">\r\n                    <div class=\"breadcrumb-content\">\r\n                        <h2>shop</h2>\r\n                        <ul>\r\n                            <li><a href=\"#\">home</a></li>\r\n                            <li> shop </li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            \r\n            <div class=\"shop-page-wrapper hidden-items padding-filter\">\r\n                <div class=\"container-fluid\">\r\n\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-12\">\r\n                            <div class=\"coupon-accordion\">\r\n                                <!-- ACCORDION START -->\r\n                                <h3>Para poder agregar al carrito debes iniciar sesión. <span id=\"showlogin\" routerLink=\"/signin\" >Click aqui para iniciar sesión</span></h3>\t\t\t\t\t\t\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"shop-filters-right\">\r\n\r\n                        <div class=\"shop-product-content tab-content\">\r\n\r\n\r\n                            <div id=\"grid-5-col1\" class=\"tab-pane fade active show\" >\r\n                                <div class=\"row custom-row\" >\r\n                                    <div class=\"custom-col-5 custom-col-style\" *ngFor=\"let item of data\">\r\n                                        <div class=\"single-product mb-35\">\r\n                                            <div class=\"product-img\">\r\n                                                \r\n                                                <a href=\"#\"><img src=\"{{item.imgUrl.S}}\" width=\"302\" height=\"365\" alt=\"\"></a>\r\n                                                <div class=\"product-action\">\r\n                                                    <!-- <a *ngIf=\"isAuthenticated\" title=\"Wishlist\" class=\"animate-left\" href=\"#\"><i class=\"ion-bag\" ></i></a> -->\r\n                                                </div>\r\n                                            </div>\r\n                                            <div class=\"product-content\">\r\n                                                <div class=\"product-title-price\">\r\n                                                    <div class=\"product-title\">\r\n                                                        <h4>{{item.nombre.S}}</h4>\r\n                                                    </div>\r\n                                                    <div class=\"product-price\">\r\n                                                        <span>$ {{item.precio}}</span>\r\n                                                    </div>\r\n                                                </div>\r\n                                                <div class=\"product-cart-categori\">\r\n                                                    <div class=\"product-cart\">\r\n                                                        <span>{{item.descripcion.S}}</span>\r\n                                                    </div>\r\n                                                    <div class=\"product-categori\">\r\n                                                        <a routerLink=\"/signin\" >Click aqui para iniciar sesión</a>                                                        \r\n                                                    </div>\r\n                                                </div>\r\n                                            </div>\r\n                                        </div>\r\n                                   </div>\r\n\r\n\r\n                                   \r\n                                </div>\r\n                            </div>\r\n    \r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n"

/***/ }),

/***/ 456:
/***/ (function(module, exports) {

module.exports = "<div class=\"page-content page-container\" id=\"page-content\">\n  <div class=\"padding\">\n      <div class=\"row container d-flex justify-content-center\">\n          <div class=\"col-xl-6 col-md-12\">\n              <div class=\"card user-card-full\">\n                  <div class=\"row m-l-0 m-r-0\">\n                      <div class=\"col-sm-4 bg-c-lite-green user-profile\">\n                          <div class=\"card-block text-center text-white\">\n                              <div class=\"m-b-25\"> <img src=\"https://img.icons8.com/bubbles/100/000000/user.png\" class=\"img-radius\" alt=\"User-Profile-Image\"> </div>\n                              <h6 class=\"f-w-600\">{{this.userData.usrName}}</h6>\n                          </div>\n                      </div>\n                      <div class=\"col-sm-8\">\n                          <div class=\"card-block\">\n                              <h6 class=\"m-b-20 p-b-5 b-b-default f-w-600\">Information</h6>\n                              <div class=\"row\">\n                                  <div class=\"col-sm-6\">\n                                      <p class=\"m-b-10 f-w-600\">Nombre</p>\n                                      <h6 class=\"text-muted f-w-400\">{{this.userData.nombre}}</h6>\n                                  </div>\n                                  <div class=\"col-sm-6\">\n                                      <p class=\"m-b-10 f-w-600\">Correo</p>\n                                      <h6 class=\"text-muted f-w-400\">{{this.userData.email}}</h6>\n                                  </div>\n                                  <div class=\"col-sm-6\">\n                                    <p class=\"m-b-10 f-w-600\">Telefono</p>\n                                    <h6 class=\"text-muted f-w-400\">{{this.userData.telefono}}</h6>\n                                </div>\n                              </div>\n                              <h6 class=\"m-b-20 m-t-40 p-b-5 b-b-default f-w-600\">Direcciones</h6>\n                              <div class=\"row\">\n                                  <div class=\"col-sm-6\">\n                                      <p class=\"m-b-10 f-w-600\">Dirección 1</p>\n                                      <h6 class=\"text-muted f-w-400\">Ejemplo</h6>\n                                  </div>\n                                  <div class=\"col-sm-6\">\n                                      <p class=\"m-b-10 f-w-600\">Dirección 2</p>\n                                      <h6 class=\"text-muted f-w-400\">Ejemplo</h6>\n                                  </div>\n                              </div>\n                              <ul class=\"social-link list-unstyled m-t-40 m-b-10\">\n                                  <li><a href=\"#!\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"facebook\" data-abc=\"true\"><i class=\"mdi mdi-facebook feather icon-facebook facebook\" aria-hidden=\"true\"></i></a></li>\n                                  <li><a href=\"#!\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"twitter\" data-abc=\"true\"><i class=\"mdi mdi-twitter feather icon-twitter twitter\" aria-hidden=\"true\"></i></a></li>\n                                  <li><a href=\"#!\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"instagram\" data-abc=\"true\"><i class=\"mdi mdi-instagram feather icon-instagram instagram\" aria-hidden=\"true\"></i></a></li>\n                              </ul>\n                          </div>\n                      </div>\n                  </div>\n              </div>\n          </div>\n      </div>\n  </div>\n</div>"

/***/ }),

/***/ 457:
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"row\" *ngIf=\"didFail\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <div class=\"alert alert-danger\">Something went wrong, please try again!</div>\r\n  </div>\r\n</div>\r\n<div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3\">\r\n    <form class=\"text-center jumbotron\" (ngSubmit)=\"onSubmit()\" #usrForm=\"ngForm\">\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"username\"\r\n          class=\"control-label\">Username</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"username\"\r\n          name=\"username\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"password\"\r\n          class=\"control-label\">Password</label>\r\n        <input\r\n          type=\"password\"\r\n          id=\"password\"\r\n          name=\"password\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <button class=\"btn btn-primary\" type=\"submit\" [disabled]=\"usrForm.invalid\">Submit</button>\r\n    </form>\r\n    <div class=\"loader\" *ngIf=\"isLoading\"></div>\r\n  </div>\r\n</div> -->\r\n\r\n\r\n\r\n<div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n  <div class=\"container\">\r\n      <div class=\"breadcrumb-content\">\r\n          <h2>login</h2>\r\n          <ul>\r\n              <li><a href=\"#\">home</a></li>\r\n              <li> login </li>\r\n          </ul>\r\n      </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"register-area ptb-100\">\r\n  <div class=\"container\">\r\n    \r\n    <div class=\"row\" *ngIf=\"didFail\">\r\n      <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n        <div class=\"alert alert-danger\">Something went wrong, please try again!</div>\r\n      </div>\r\n    </div>\r\n\r\n      <div class=\"row\">\r\n          <div class=\"col-md-12 col-12 col-lg-6 col-xl-6 ml-auto mr-auto\">\r\n              <div class=\"login\">\r\n                  <div class=\"login-form-container\">\r\n                      <div class=\"login-form\">\r\n                          <form (ngSubmit)=\"onSubmit()\" #usrForm=\"ngForm\">\r\n                            <input\r\n                            type=\"text\"\r\n                            id=\"username\"\r\n                            name=\"username\"\r\n                            ngModel\r\n                            class=\"form-control text-center\"\r\n                            placeholder=\"Username\"\r\n                            required>\r\n                            <input\r\n                              type=\"password\"\r\n                              id=\"password\"\r\n                              name=\"password\"\r\n                              ngModel\r\n                              class=\"form-control text-center\"\r\n                              placeholder=\"Password\"\r\n                              required>\r\n  \r\n                              <div class=\"button-box\">\r\n                                  <button class=\"default-btn floatright\" type=\"submit\" [disabled]=\"usrForm.invalid\">Login</button>\r\n                              </div>\r\n                          </form>\r\n                          <div class=\"loader\" *ngIf=\"isLoading\"></div>\r\n                      </div>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</div>\r\n<!-- login-area end -->"

/***/ }),

/***/ 458:
/***/ (function(module, exports) {

module.exports = "<!-- <div class=\"row\" *ngIf=\"didFail\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <div class=\"alert alert-danger\">Something went wrong, please try again!</div>\r\n  </div>\r\n</div> -->\r\n<!-- <div class=\"row\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3\">\r\n    <form class=\"text-center jumbotron\" (ngSubmit)=\"onSubmit()\" #usrForm=\"ngForm\">\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"username\"\r\n          class=\"control-label\">Username</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"username\"\r\n          name=\"username\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"email\"\r\n          class=\"control-label\">Mail</label>\r\n        <input\r\n          type=\"email\"\r\n          id=\"email\"\r\n          name=\"email\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required\r\n          email>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"password\"\r\n          class=\"control-label\">Password</label>\r\n        <input\r\n          type=\"password\"\r\n          id=\"password\"\r\n          name=\"password\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"confirmPassword\"\r\n          class=\"control-label\">Confirm Password</label>\r\n        <input\r\n          type=\"password\"\r\n          id=\"confirmPassword\"\r\n          name=\"confirmPassword\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div *ngIf=\"usrForm.value.password !== usrForm.value.confirmPassword\">Passwords do not match!</div>\r\n      <button class=\"btn btn-primary\" type=\"submit\"\r\n              [disabled]=\"(usrForm.value.password !== usrForm.value.confirmPassword) || usrForm.invalid\">Submit\r\n      </button>\r\n    </form>\r\n    <div class=\"loader\" *ngIf=\"isLoading\"></div>\r\n  </div>\r\n</div> -->\r\n<!-- \r\n<div class=\"row\" *ngIf=\"!confirmUser\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <button class=\"btn btn-default\" (click)=\"onDoConfirm()\">Confirm User</button>\r\n  </div>\r\n</div>\r\n<div class=\"row\" *ngIf=\"confirmUser\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3\">\r\n    <form #confirmForm=\"ngForm\" (ngSubmit)=\"onConfirm(confirmForm.value)\" class=\"jumbotron text-center\">\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"usrName\"\r\n          class=\"control-label\">Username</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"usrName\"\r\n          name=\"usrName\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"validationCode\"\r\n          class=\"control-label\">Validation Code</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"validationCode\"\r\n          name=\"validationCode\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <button class=\"btn btn-primary\" type=\"submit\" [disabled]=\"confirmForm.invalid\">Confirm your Account</button>\r\n    </form>\r\n    <div class=\"loader\" *ngIf=\"isLoading\"></div>\r\n  </div>\r\n</div> -->\r\n\r\n\r\n\r\n\r\n<div class=\"breadcrumb-area pt-205 pb-210 bg-img\" style=\"background-image: url(assets/img/bg/breadcrumb.jpg)\">\r\n  <div class=\"container\">\r\n      <div class=\"breadcrumb-content\">\r\n          <h2>register</h2>\r\n          <ul>\r\n              <li><a href=\"#\">home</a></li>\r\n              <li> register </li>\r\n          </ul>\r\n      </div>\r\n  </div>\r\n</div>\r\n<!-- register-area start -->\r\n<div class=\"register-area ptb-100\">\r\n  <div class=\"container-fluid\">\r\n\r\n    <div class=\"row\" *ngIf=\"didFail\">\r\n      <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n        <div class=\"alert alert-danger\">Something went wrong, please try again!</div>\r\n      </div>\r\n    </div>\r\n\r\n      <div class=\"row\">\r\n          <div class=\"col-md-12 col-12 col-lg-6 col-xl-6 ml-auto mr-auto\">\r\n              <div class=\"login\">\r\n                  <div class=\"login-form-container\">\r\n                      <div class=\"login-form\">\r\n                          <form (ngSubmit)=\"onSubmit()\" #usrForm=\"ngForm\">\r\n                            <input\r\n                                type=\"text\"\r\n                                id=\"username\"\r\n                                name=\"username\"\r\n                                ngModel\r\n                                class=\"form-control text-center\"\r\n                                placeholder=\"Username\"\r\n                                required>\r\n                                <input\r\n                                type=\"email\"\r\n                                id=\"email\"\r\n                                name=\"email\"\r\n                                ngModel\r\n                                class=\"form-control text-center\"\r\n                                placeholder=\"Email\"\r\n                                required\r\n                                email>\r\n                                <input\r\n                                type=\"password\"\r\n                                id=\"password\"\r\n                                name=\"password\"\r\n                                ngModel\r\n                                class=\"form-control text-center\"\r\n                                placeholder=\"Password\"\r\n                                required>\r\n                                <input\r\n                                  type=\"password\"\r\n                                  id=\"confirmPassword\"\r\n                                  name=\"confirmPassword\"\r\n                                  ngModel\r\n                                  class=\"form-control text-center\"\r\n                                  placeholder=\"Confirm Password\"\r\n                                  required>\r\n\r\n                                  <div *ngIf=\"usrForm.value.password !== usrForm.value.confirmPassword\">Passwords do not match!</div>\r\n                              <div class=\"button-box\">\r\n                                <button  class=\"default-btn floatright\" type=\"submit\"\r\n                                      [disabled]=\"(usrForm.value.password !== usrForm.value.confirmPassword) || usrForm.invalid\">Submit\r\n                                </button>\r\n                              </div>\r\n                          </form>\r\n                          <div class=\"loader\" *ngIf=\"isLoading\"></div>\r\n                      </div>\r\n                  </div>\r\n              </div>\r\n          </div>\r\n      </div>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div class=\"row\" *ngIf=\"!confirmUser\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3 text-center\">\r\n    <button class=\"btn btn-default\" (click)=\"onDoConfirm()\">Confirm User</button>\r\n  </div>\r\n</div>\r\n<div class=\"row\" *ngIf=\"confirmUser\">\r\n  <div class=\"col-xs-12 col-sm-10 col-md-6 cold-sm-offset-1 col-md-offset-3\">\r\n    <form #confirmForm=\"ngForm\" (ngSubmit)=\"onConfirm(confirmForm.value)\" class=\"jumbotron text-center\">\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"usrName\"\r\n          class=\"control-label\">Username</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"usrName\"\r\n          name=\"usrName\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <label\r\n          for=\"validationCode\"\r\n          class=\"control-label\">Validation Code</label>\r\n        <input\r\n          type=\"text\"\r\n          id=\"validationCode\"\r\n          name=\"validationCode\"\r\n          ngModel\r\n          class=\"form-control text-center\"\r\n          required>\r\n      </div>\r\n      <button class=\"btn btn-primary\" type=\"submit\" [disabled]=\"confirmForm.invalid\">Confirm your Account</button>\r\n    </form>\r\n    <div class=\"loader\" *ngIf=\"isLoading\"></div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__ = __webpack_require__(33);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProductsService = (function () {
    function ProductsService(http) {
        this.http = http;
        this.cart = [];
    }
    ProductsService.prototype.getProducts = function () {
        return this.http.get(__WEBPACK_IMPORTED_MODULE_2_environments_environment_prod__["a" /* environment */].API_PRODUCTS + "all");
        //  return this.http.get(environment.API_PRODUCTS + `get_products` );
    };
    ProductsService.prototype.createCart = function () {
    };
    return ProductsService;
}());
ProductsService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], ProductsService);

var _a;
//# sourceMappingURL=products.service.js.map

/***/ }),

/***/ 521:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(205);


/***/ })

},[521]);
//# sourceMappingURL=main.bundle.js.map