"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pokemon = /** @class */ (function () {
    function Pokemon(data) {
        if (data == null) {
            this.Name = "";
        }
        else {
            this.Name = data.Name;
        }
    }
    Pokemon.prototype.GetJson = function () {
        var temp = {
            Name: this.Name
        };
        return temp;
    };
    return Pokemon;
}());
exports.Pokemon = Pokemon;
