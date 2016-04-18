/*
 * GET users listing.
 */
import express = require('express');
import db = require("../db")

export function listAnimals(req: express.Request, res: express.Response) {
    db.listAnimals((animals) => {
        //console.info(animals);
        res.send(animals);
    });
};

export function getAnimal(req: express.Request, res: express.Response) {
    var animalId = req.params.animalID;
    db.getAnimal(animalId,(animal) => {
        //console.info(animals);
        res.send(animal);
    });
};


export function listAnimalsForUser(req: express.Request, res: express.Response) {
    var userId = req.params.userID;
    db.listAnimalsForUser(userId, (animals) => {
        //console.info(animals);
        res.send(animals);
    });
};

export function addAnimal(req: express.Request, res: express.Response) {
    db.addAnimal(req.body.userID
        , req.body.name
        , req.body.longDescr
        , req.body.shortDescr
        , req.body.type
        , req.body.sex
        , req.body.imageURL
        , req.body.city);
};

export function updateAnimal(req: express.Request, res: express.Response) {
    db.updateAnimal(req.body._id
        , req.body.name
        , req.body.longDescr
        , req.body.shortDescr
        , req.body.type
        , req.body.sex
        , req.body.imageURL);
};

export function deleteAnimal(req: express.Request, res: express.Response) {
    db.deleteAnimal(req.body.animalID, () => {
        console.info('Deleted animal: ' + req.body.animalID);
    });
};