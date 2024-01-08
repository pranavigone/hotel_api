const express = require('express');

const app = express();

app.use(express.json());

//in memory database
const movies = [
    {
        id: 1,
        title: 'The Shawshank Redemption',
        director: 'Frank Darabont',
        year: 2000,
        imdbRating: 9.3,
        actors : ['Mark','Harry']
    },
    {
        id: 2,
        title: "Fight Club",
        director: "David Fincher",
        year: 1999,
        imdbRating: 8.8,
        actor : ['Marlon','James']
    }
];

const logger = (req,res,next) => {
    console.log("another logger");
    next();
}
app.use(logger);

const another_logger = (req,res,next) => {
    console.log(`${req.method} received from URL: ${req.url} at ${new Date()}`);
    next();
}

app.get("/", (req, res) => {
    res.send("hello world")
});

// get all movies
app.get("/api/movies",(req,res) => {
    const searchString = req.query.search;
    console.log({searchString});
    const filteredMovies = movies.filter((m) => {
        return m.title.toLowerCase().includes(searchString.toLowerCase());
    })
    res.send(filteredMovies);
});

// get movie by its ID
app.get("/api/movies/:id",another_logger,(req,res) => {
    const id = req.params.id;
    const movie = movies.find((movie)=> movie.id === parseInt(id));
    if(!movie){
        return res.status(400).send("The movie with the given ID was not found");
    }
    res.send(movie);
});

app.post("/api/movies",(req,res) => {
    const movie = req.body;
    movie.id = movies.length+1;
    movies.push(movie);
    res.send(movie);
})

app.put("/api/movies/:id",(req,res) => {
    const id = req.params.id;
    const movie = movies.find((movie) => movie.id === parseInt(id))
    movie.title = req.body.title;
    movie.year = req.body.year;
    movie.imdbRating = req.body.imdbRating;
    movie.actors = req.body.actors;
    res.send(movie);
})

app.delete("/api/movies/:id",(req,res) => {
    const id = req.params.id;
    const movie = movies.find((movie) => movie.id == parseInt(id));
    const index = movies.indexOf(movie);
    movies.splice(index, 1);
    res.send(movie);
})

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
})