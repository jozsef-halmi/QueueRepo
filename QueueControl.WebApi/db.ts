// Mongo
import mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017);
var db = new mongodb.Db('animal', server, { w: 1 });
db.open(function () { });


export interface Animal {
    _id: string;
    Contact: string;
    LongDescription: string;
    ShortDescription: string;
    ImageURL: string;
    City: string;
    City_id: string;
    AnimalType_id: string;
    Sex: string;
    IsLost: boolean;
    Name: string;
    Date: Date;
}

export interface City {
    _id: string;
    Latitude: number;
    Longitude: number;
    Name: string;
}

export function listAnimals(callback: (animals: Animal[]) => void) {
    db.collection('animals', function (error, animals_collection) {
        if (error) { console.error(error); return; }
        animals_collection.find({}).sort({ Date: -1 }).toArray(function (error, animalObjs) {
            if (error) { console.error(error); return; }
            fillCitiesForAnimals(animalObjs, callback)
        });
    });
}

export function getAnimal(id: string, callback: (animal: Animal) => void) {
    db.collection('animals', function (error, animals_collection) {
        if (error) { console.error(error); return; }
        animals_collection.find({ _id: new mongodb.ObjectID(id) }).sort({ Date: -1 }).toArray(function (error, animalObjs) {
            if (error) { console.error(error); return; }
            callback(animalObjs[0]);
        });
    });
}



export function listAnimalsForUser(user: string, callback: (animals: Animal[]) => void) {
    db.collection('animals', function (error, animals_collection) {
        if (error) { console.error(error); return; }
        console.info('userid: ' + user)
        animals_collection.find({ Contact: user }).sort({ Date: -1 }).toArray(function (error, animalObjs) {
            if (error) { console.error(error); return; }
            fillCitiesForAnimals(animalObjs, callback)
        });
    });
}

export function listCities(callback: (cities: City[]) => void) {
    db.collection('cities', function (error, cities_collection) {
        if (error) { console.error(error); return; }
        cities_collection.find({}).sort({ Name: -1 }).toArray(function (error, citiesObjs) {
            if (error) { console.error(error); return; }
            callback(citiesObjs)
        });
    });
}


function fillCitiesForAnimals(animals: Animal[], callback: (animals: Animal[]) => void) {
    // Fill city
    let requests = animals.reduce((promiseChain, item) => {
        return promiseChain.then(() => new Promise((resolve) => {
            fillCityForAnimal(item, resolve);
        }));
    }, Promise.resolve());

    requests.then(() => callback(animals))

}
function fillCityForAnimal(animal: Animal, callback: (a: Animal) => void) {

    db.collection('cities', function (error, cities_collection) {
        if (error) { console.error(error); return; }
        cities_collection.find({ _id: animal.City_id }).toArray(function (err, cities) {

            animal.City = cities.length > 0 ? cities[0].Name : null;
            console.info(animal)
            callback(animal);
        });
        //animalObjs[index].City = 
    })

}

function getOrAddCity(name: string, callback: (city: City) => void) {
    db.collection('cities', function (error, cities_collection) {
        if (error) { console.error(error); return; }
        cities_collection.find({ Name: name }).toArray(function (err, cities) {
            if (cities.length == 0) {
                console.info('Inserting city: ' + name);
                cities_collection.insertOne(
                    {
                        Name: name,
                        Latitude: 0,
                        Longitude: 0

                    }).then(() => {
                        cities_collection.find({ Name: name }).toArray(function (err, cities) {
                            callback(cities[0]);
                        })
                    });
            }
            else {
                callback(cities[0]);
            }

        });
    });
}


export function addAnimal(user: string, name: string, longDescr: string, shortDescr: string,
    type: string, sex: string, imageUrl: string, city: string) {

    getOrAddCity(city, function (city: City) {
        db.collection('animals', function (error, animals_collection) {
            if (error) { console.error(error); return; }

            animals_collection.find({}).toArray(function (error, animalObjs) {
                if (error) { console.error(error); return; }

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
                }).then(() => console.info('Inserted.'));
            });
        });

    });
}

export function updateAnimal(_id: string, name: string, longDescr: string, shortDescr: string,
    type: string, sex: string, imageUrl: string) {

    db.collection('animals', function (error, animals_collection) {
        if (error) { console.error(error); return; }
        console.info('updating animal with id: ' + _id)
        animals_collection.updateOne({ _id: new mongodb.ObjectID(_id) },
            {
                $set:
                {
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


export function deleteAnimal(animalId: string, callback: () => void) {
    db.collection('animals', function (error, animals_collection) {
        if (error) { console.error(error); return; }
        console.info('deleting animal with id: ' + animalId)
        animals_collection.deleteOne({ _id: new mongodb.ObjectID(animalId) }).then(
            (error) => {
                if (error) { console.error(error); }
                callback();
            });
    });
}

