"use strict";
var db = require("../db");
function listCities(req, res) {
    db.listCities(function (cities) {
        //console.info(animals);
        res.send(cities);
    });
}
exports.listCities = listCities;
;
//# sourceMappingURL=cities.js.map