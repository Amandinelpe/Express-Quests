const express = require("express");

require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5001;
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyTokenId,
} = require("./auth.js");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

// Public API Routes
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, userHandlers.postUsers);

// Private API Routes
app.use(verifyToken);

app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.put("/api/users/:id", verifyTokenId, userHandlers.updateUsers);
app.delete("/api/users/:id", verifyTokenId, userHandlers.deleteUsers);
