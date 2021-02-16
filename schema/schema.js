
const graphql = require('graphql')
const Cities  =  require("../mongoose_models/City")
const Stations  =  require("../mongoose_models/Station")

const {GraphQLID, GraphQLString, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLNonNull} = graphql

//тестовые данные 
// const stations = [
//     { id: "1", name: "station 1", cityId: "2" },
//     { id: "2", name: "station 2", cityId: "1" },
//     { id: "3", name: "station 4", cityId: "3" },
//     { id: "4", name: "station 5", cityId: "3" },
//     { id: "5", name: "station 6", cityId: "2" },
//     { id: "6", name: "station 7", cityId: "1" },
//     { id: "7", name: "station 8", cityId: "2" },
//     { id: "8", name: "station 9", cityId: "1" },
//     { id: "9", name: "station 10", cityId: "2" }
// ]
// const cities = [
//     { id: "1", name: "Moscow",phone: "8913111111"}, // 602bdac03799427ed09244df
//     { id: 2, name: "Norils", phone: "8913222222"}, // 602bdad33799427ed09244e0
//     { id: "3", name: "Sochi",phone: "8913333333"} // 602bdae33799427ed09244e1
// ]


const StationType = new GraphQLObjectType({
    name: "Station",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        city: {
            type: CityType,
             resolve(parent, args) {
                //return cities.find(city => city.id == parent.id)

                return Cities.findById(parent.cityId)
            }
        }
    })
})

const CityType = new GraphQLObjectType({
    name: "City",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        phone: {type: GraphQLString},
        stations: {
            type: new GraphQLList(StationType),
            resolve(parent, args) {
                //return stations.filter(s => s.cityId === parent.id)

                return Stations.find( {cityId: parent.id})
            }
        }
    })
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addCity: {
            type: CityType,
            args: {
                name: { type: GraphQLString },
                phone: { type:  GraphQLString}
            },
            resolve(parent, args) {
                const city = new Cities({
                    name: args.name,
                    phone: args.phone
                });
                return city.save()
            }
        },

        addStation: {
            type: StationType,
            args: {
                name: { type: GraphQLString },
                cityId: {type: GraphQLID}
            },
            resolve(parent, args) {
                const station = new Stations({
                    name: args.name,
                    cityId: args.cityId
                });
                return station.save()
            }
        },

        deleteCity: {
            type: CityType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args) {
                return Cities.findByIdAndRemove(args.id)
            }
        },

        deleteStation: {
            type: StationType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args) {
                return Stations.findByIdAndRemove(args.id)
            }
        },

        updateCity: {
            type: CityType,
            args: {
                id: {type: GraphQLID},
                name: { type: GraphQLString},
                phone: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Cities.findByIdAndUpdate(
                    args.id,
                    {$set: {name: args.name, phone: args.phone}},
                    {new: true}
                )
            }
        },

        updateStation: {
            type: StationType,
            args: {
                id: {type: GraphQLID},
                name: { type: GraphQLString},
                cityId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Stations.findByIdAndUpdate(
                    args.id,
                    {$set: {name: args.name, cityId: args.cityId}},
                    {new: true}
                )
            }
        }
    }
})



//корневой запрос
const Query = new GraphQLObjectType({
    name: "Query",
    fields:  {
        city: {
            type: CityType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                //return cities.find(city => city.id == args.id)

                return Cities.findById(args.id)
            }
        },
        
        station: {
            type: StationType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                //return stations.find(station => station.id == args.id)

                return Stations.findById(args.id)
            }
        },

        stations: {
            type: new GraphQLList(StationType),
            resolve(parent, args) {
                return  Stations.find({})
            }
        },

        cities: {
            type: new GraphQLList(CityType),
            resolve(parent, args) {
                return Cities.find({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})