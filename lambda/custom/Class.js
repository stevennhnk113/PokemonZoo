"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pokemon = /** @class */ (function () {
    function Pokemon(data) {
        if (data == null) {
            this.Name = "";
            this.Date = new Date(0, 1, 1);
        }
        else {
            this.Name = data.Name;
            this.Date = new Date(data.Date);
        }
    }
    Pokemon.prototype.GetJson = function () {
        var temp = {
            Name: this.Name,
            Date: this.Date.toDateString()
        };
        return temp;
    };
    return Pokemon;
}());
exports.Pokemon = Pokemon;
