"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var data_access_1 = require("./data-access");
var MongoAccess = /** @class */ (function (_super) {
    __extends(MongoAccess, _super);
    function MongoAccess() {
        var _this = _super.call(this) || this;
        _this.url = 'mongodb://localhost:27017/graphics';
        return _this;
    }
    MongoAccess.prototype.getClient = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            mongodb_1.MongoClient.connect(_this.url, function (err, client) {
                if (err)
                    throw err;
                console.log('Database connected.');
                resolve(client);
            });
        });
    };
    MongoAccess.prototype.GetBlocks = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var blocks = client.db('graphics').collection('block').find({});
                blocks.toArray().then(function (v) {
                    resolve(v);
                });
            });
        });
    };
    MongoAccess.prototype.GetConnections = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getClient().then(function (client) {
                var connections = client.db('graphics').collection('connection').find({});
                connections.toArray().then(function (v) {
                    resolve(v);
                });
            });
        });
    };
    return MongoAccess;
}(data_access_1.DataAccess));
exports.MongoAccess = MongoAccess;
