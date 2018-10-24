"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToBringItemLists = "ToBringItemLists";
exports.Always = "always";
exports.ItemType = "ItemType";
var CRUDResult;
(function (CRUDResult) {
    CRUDResult["Success"] = "Success";
    CRUDResult["Failed"] = "Failed";
    CRUDResult["Exist"] = "Exist";
    CRUDResult["NotExist"] = "Not Exist";
})(CRUDResult = exports.CRUDResult || (exports.CRUDResult = {}));
var Handler;
(function (Handler) {
    Handler["LaunchRequestHandler"] = "LaunchRequestHandler";
    Handler["GetPokemonIntentHandler"] = "GetPokemonIntentHandler";
    Handler["GoodByeIntentHandler"] = "GoodByeIntentHandler";
})(Handler = exports.Handler || (exports.Handler = {}));
