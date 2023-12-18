// //dl, npm init for package.json. dl npm require, npm express, and npm nodemon 
// documentation: https://developer.themoviedb.org/reference/intro/getting-started

const request = require('request')
const config = require('./config/config');

const express = require('express');
const hbs = require('hbs');
const app = express();
const path = require('path');

const viewsPath = path.join(__dirname, '../templates/views');
const publicDirectoryPath = path.join(__dirname, '../public');

// Set the view engine to use hbs
app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates'); 


// retreive API key from config. file ao that it's
const apiKey = config.apiKey; 


//retreive movie ID from movie title 
const retreiveMovie = (movieTitle, callback) => {

    //need `` for personal api  
// const url = 'https://api.themoviedb.org/3/search/movie?query=' + movieTitle + '&api_key=7757357427f139ee5114c4d5e2571a17';
const url = 'https://api.themoviedb.org/3/search/movie?query=' + movieTitle + '&api_key=' + apiKey;



// request access to movie json/api//
// grab first result of movie search 
request({ url: url, json: true }, (error, response) => {
    // console.log('API Response:', response.body); // Log the entire API response for inspection
    if (error) {
        callback('unable to connect to movie server..', undefined);
    } else if (!response.body.results || !response.body.results.length === 0) {
        callback('Unable to find movie title. Try another search..', undefined);
    } else {
        // Only log the desired information in the callback
            callback(undefined, {
                // ths is grabbing movie id from first result 
             movieId: response.body.results[0].id       
            })
    }
});
};



// give back information of similar movie from movie ID retrieval 
const similarMovie = (movieId, callback) => {

    const url = 'https://api.themoviedb.org/3/movie/' + movieId + '/similar?api_key=' + apiKey;

request({ url: url, json: true }, (error, response) => {
    if (error) {
        callback('unable to connect to find similar movie in search', undefined)
    }
    else {
        //give all results 
        callback(response.body.results)
    }
})

}


//test movie here to appear on terminal,  call retreiveMovie function 
// run node app.js to test 
retreiveMovie('silent hill', (error, result)=> {
    similarMovie(result.movieId, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            console.log(result)
        }
    }) 
})


// Serve static files from the 'public' directory
app.use(express.static(publicDirectoryPath));


app.use('/css', express.static(__dirname + '/css'));

// Set up a route to render your index.hbs file
app.get('/', (req, res) => {
    res.render('index'); // 'index' is the name of your .hbs file (without extension)
  });

  // script.js file 

  app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});


app.get('/similar', (req, res) => {
    const { movie } = req.query;

    if (!movie) {
        return res.status(400).json({ error: 'You must provide a movie title.' });
    }

    movieID(movie, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error.' });
        } else {
            return res.json(data);
        }
    });
});



  // ... Start your server
const port = process.env.PORT || 5500;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// listener for port to run 
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })


//NOTES
//  response.body: --> accesses the body of the response, assuming it contains structured data from json format 
//  response.body.results: -->  within the body, there is an array property named results that we are going into 
//  response.body.results[0]: -->  accesses the first element (index 0) of the results array.
//  response.body.results[0].id: Finally going to extract the id property from the first result.

