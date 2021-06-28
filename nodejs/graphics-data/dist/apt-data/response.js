"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Response = /** @class */ (function () {
    function Response(data, error) {
        this.data = data;
        if (error) {
            this.error = error;
            this.success = false;
        }
        else {
            this.success = true;
        }
    }
    return Response;
}());
exports.Response = Response;
