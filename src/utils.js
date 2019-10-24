import request from 'request';
import fs from 'fs';

function fetchPeople(callback, url, people){
    if(!people) people = [];
    const nextURL = 'https://swapi.co/api/films/';
    try{
        people = JSON.parse(fs.readFileSync('./people.json'));
        fetchFilms(callback, nextURL, people);
    }catch(e){
        console.log('Fetching Star Wars People data…');
        request({url, json: true}, (error, response) => {
            if(response.body){
                people = [...people, ...response.body.results];
            }
            if(response.body.next !== null){
                fetchPeople(callback, response.body.next, people);
            }else{
                fs.writeFileSync('./people.json', JSON.stringify(people));
                fetchFilms(callback, nextURL, people);
            }
        });
    }
}

function fetchFilms(callback, url, people, films){
    if(!films) films = [];
    try{
        films = JSON.parse(fs.readFileSync('./films.json'));
        callback(people, films);
    }catch(e){
        request({url, json: true}, (error, response) => {
            if(response.body){
                films = [...films, ...response.body.results];
            }
            if(response.body.next !== null){
                fetchFilms(callback, response.body.next, people, films);
            }else{
                fs.writeFileSync('./films.json', JSON.stringify(films));
                callback(people, films);
            }
        });
    }
}

export {fetchPeople, fetchFilms};