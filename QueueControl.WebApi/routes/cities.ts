/*
 * GET users listing.
 */
import express = require('express');
import db = require("../db")

export function listCities(req: express.Request, res: express.Response) {
    db.listCities((cities) => {
        //console.info(animals);
        res.send(cities);
    });
};
