"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DbResponse = /** @class */ (function () {
    function DbResponse(data, error) {
        this.data = data;
        if (error) {
            this.error = error;
            this.success = false;
        }
        else {
            this.success = true;
        }
    }
    return DbResponse;
}());
exports.DbResponse = DbResponse;
