import {GraphQLServer} from 'graphql-yoga';
import {fetchPeople} from './utils.js';

const baseURL = 'https://swapi.co/api';
const peopleURL = `${baseURL}/people`;

const typeDefs = `
    type Query{
        people(page: Int!, number: Int!, name: String, gender: String): [Character!]
        character(id: Int!): Character!
    }

    type Character{
        name: String!
        gender: String!
        url: String!
    }
    `;

const runApp = (people, films) => {

    const resolvers = {
        Query: {
            people: (parent, args, ctx, info) => {
                const page = args.page || 1;
                const size = args.number || 10;
                let start = size*(page-1);
                let finish = start + size;
                if(args.name){ //Si name
                    const listNames = people.filter(element => element.name.includes(args.name));
                    const array = listGender.slice(start, finish);
                    return array.map(character => {
                        return {
                            name: character.name,
                            gender: character.gender,
                            url: character.url,
                        }   
                    });
                }else if(args.gender){ //Si gender
                    const listGender = people.filter(element => element.gender == args.gender);
                    const array = listGender.slice(start, finish);
                    return array.map(character => {
                        return {
                            name: character.name,
                            gender: character.gender,
                            url: character.url,
                        }   
                    });
                
                }else{
                    const array = people.slice(start, finish);
                    return array.map(character => {
                        return {
                            name: character.name,
                            gender: character.gender,
                            url: character.url,
                        }   
                    });
                }
            },
            character: (parent, args, ctx, info) => {
                const result = people.find(obj => obj.id == args.id);
                if(result){
                    return{
                        name: result.name,
                        gender: result.gender,
                        url: result.url,
                    }
                }
            },
        },
    }
    const server = new GraphQLServer({typeDefs, resolvers});
    server.start( () => console.log('Listening…'));
}

fetchPeople(runApp, peopleURL);