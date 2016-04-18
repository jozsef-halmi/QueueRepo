"use strict";
var db = require("../db");
function listAnimals(req, res) {
    db.listAnimals(function (animals) {
        //console.info(animals);
        res.send(animals);
    });
}
exports.listAnimals = listAnimals;
;
function getAnimal(req, res) {
    var animalId = req.params.animalID;
    db.getAnimal(animalId, function (animal) {
        //console.info(animals);
        res.send(animal);
    });
}
exports.getAnimal = getAnimal;
;
function listAnimalsForUser(req, res) {
    var userId = req.params.userID;
    db.listAnimalsForUser(userId, function (animals) {
        //console.info(animals);
        res.send(animals);
    });
}
exports.listAnimalsForUser = listAnimalsForUser;
;
function addAnimal(req, res) {
    db.addAnimal(req.body.userID, req.body.name, req.body.longDescr, req.body.shortDescr, req.body.type, req.body.sex, req.body.imageURL, req.body.city);
}
exports.addAnimal = addAnimal;
;
function updateAnimal(req, res) {
    db.updateAnimal(req.body._id, req.body.name, req.body.longDescr, req.body.shortDescr, req.body.type, req.body.sex, req.body.imageURL);
}
exports.updateAnimal = updateAnimal;
;
function deleteAnimal(req, res) {
    db.deleteAnimal(req.body.animalID, function () {
        console.info('Deleted animal: ' + req.body.animalID);
    });
}
exports.deleteAnimal = deleteAnimal;
;
//# sourceMappingURL=animals.js.map