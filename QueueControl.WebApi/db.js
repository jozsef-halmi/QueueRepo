"use strict";
// Mongo
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017);
var db = new mongodb.Db('animal', server, { w: 1 });
db.open(function () { });
function listAnimals(callback) {
    db.collection('animals', function (error, animals_collection) {
        if (error) {
            console.error(error);
            return;
        }
        animals_collection.find({}).sort({ Date: -1 }).toArray(function (error, animalObjs) {
            if (error) {
                console.error(error);
                return;
            }
            fillCitiesForAnimals(animalObjs, callback);
        });
    });
}
exports.listAnimals = listAnimals;
function getAnimal(id, callback) {
    db.collection('animals', function (error, animals_collection) {
        if (error) {
            console.error(error);
            return;
        }
        animals_collection.find({ _id: new mongodb.ObjectID(id) }).sort({ Date: -1 }).toArray(function (error, animalObjs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(animalObjs[0]);
        });
    });
}
exports.getAnimal = getAnimal;
function listAnimalsForUser(user, callback) {
    db.collection('animals', function (error, animals_collection) {
        if (error) {
            console.error(error);
            return;
        }
        console.info('userid: ' + user);
        animals_collection.find({ Contact: user }).sort({ Date: -1 }).toArray(function (error, animalObjs) {
            if (error) {
                console.error(error);
                return;
            }
            fillCitiesForAnimals(animalObjs, callback);
        });
    });
}
exports.listAnimalsForUser = listAnimalsForUser;
function listCities(callback) {
    db.collection('cities', function (error, cities_collection) {
        if (error) {
            console.error(error);
            return;
        }
        cities_collection.find({}).sort({ Name: -1 }).toArray(function (error, citiesObjs) {
            if (error) {
                console.error(error);
                return;
            }
            callback(citiesObjs);
        });
    });
}
exports.listCities = listCities;
function fillCitiesForAnimals(animals, callback) {
    // Fill city
    var requests = animals.reduce(function (promiseChain, item) {
        return promiseChain.then(function () { return new Promise(function (resolve) {
            fillCityForAnimal(item, resolve);
        }); });
    }, Promise.resolve());
    requests.then(function () { return callback(animals); });
}
function fillCityForAnimal(animal, callback) {
    db.collection('cities', function (error, cities_collection) {
        if (error) {
            console.error(error);
            return;
        }
        cities_collection.find({ _id: animal.City_id }).toArray(function (err, cities) {
            animal.City = cities.length > 0 ? cities[0].Name : null;
            console.info(animal);
            callback(animal);
        });
        //animalObjs[index].City = 
    });
}
function getOrAddCity(name, callback) {
    db.collection('cities', function (error, cities_collection) {
        if (error) {
            console.error(error);
            return;
        }
        cities_collection.find({ Name: name }).toArray(function (err, cities) {
            if (cities.length == 0) {
                console.info('Inserting city: ' + name);
                cities_collection.insertOne({
                    Name: name,
                    Latitude: 0,
                    Longitude: 0
                }).then(function () {
                    cities_collection.find({ Name: name }).toArray(function (err, cities) {
                        callback(cities[0]);
                    });
                });
            }
            else {
                callback(cities[0]);
            }
        });
    });
}
function addAnimal(user, name, longDescr, shortDescr, type, sex, imageUrl, city) {
    getOrAddCity(city, function (city) {
        db.collection('animals', function (error, animals_collection) {
            if (error) {
                console.error(error);
                return;
            }
            animals_collection.find({}).toArray(function (error, animalObjs) {
                if (error) {
                    console.error(error);
                    return;
                }
                var firstAnimal = animalObjs[0];
                animals_collection.insertOne({
                    Contact: user,
                    LongDescription: longDescr,
                    ShortDescription: shortDescr,
                    ImageURL: imageUrl,
                    City_id: city._id,
                    AnimalType_id: firstAnimal.AnimalType_id,
                    Sex: sex,
                    Name: name,
                    Date: new Date(),
                }).then(function () { return console.info('Inserted.'); });
            });
        });
    });
}
exports.addAnimal = addAnimal;
function updateAnimal(_id, name, longDescr, shortDescr, type, sex, imageUrl) {
    db.collection('animals', function (error, animals_collection) {
        if (error) {
            console.error(error);
            return;
        }
        console.info('updating animal with id: ' + _id);
        animals_collection.updateOne({ _id: new mongodb.ObjectID(_id) }, {
            $set: {
                LongDescription: longDescr,
                ShortDescription: shortDescr,
                ImageURL: imageUrl,
                Sex: sex,
                Name: name,
                Date: new Date()
            }
        });
    });
}
exports.updateAnimal = updateAnimal;
function deleteAnimal(animalId, callback) {
    db.collection('animals', function (error, animals_collection) {
        if (error) {
            console.error(error);
            return;
        }
        console.info('deleting animal with id: ' + animalId);
        animals_collection.deleteOne({ _id: new mongodb.ObjectID(animalId) }).then(function (error) {
            if (error) {
                console.error(error);
            }
            callback();
        });
    });
}
exports.deleteAnimal = deleteAnimal;
//# sourceMappingURL=db.js.map