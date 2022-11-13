"use strict";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
const CONTAINER = document.querySelector(".container");

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};

// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const credits = await fetchActors(movie.id);
  const related = await fetchRelatedMovies(movie.id);
  const trailer = await fetchTrailer(movie.id);
  renderMovie(movieRes, credits, related.results, trailer.results[0].key);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};
// fetch related movies
const fetchRelatedMovies = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/similar`);
  const res = await fetch(url);
  return res.json();
};
//fetch the actors :
const fetchActors = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/credits`);
  const res = await fetch(url);
  return res.json();
};
//fetch trailer:
const fetchTrailer = async (movieId) => {
  const url = constructUrl(`movie/${movieId}/videos`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster">
        <h3>${movie.title}</h3>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};
// render related movies:

const renderRelatedMovies = (movies) => {
  movies.map((movie) => {
    const relatedDiv = document.getElementById("relatedmovies");
    const movieDiv = document.createElement("div");
    movieDiv.setAttribute('class','col');
    movieDiv.innerHTML = `
        <img src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${
      movie.title
    } poster" width='150'>
        <h6>${movie.title}</h6>`;
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    relatedDiv.appendChild(movieDiv);
  });
};
// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credits, related, trailerKey) => {
  // actors:
  const fiveAcrtors = [];
  for (let i = 0; i <= 4; i++) {
    fiveAcrtors.push(` ${credits.cast[i].name}`);
  }
  //directors:
  const director = credits.crew.filter((person) => {
    return person.job === "Director";
  });
  //companies:
  const companies = movie.production_companies.map((company) => [
    company.name,
    company.logo_path,
  ]);

  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
             <p> <b>Rating:</b> ${movie.vote_average}/10</p>
             <p> <b>votes:</b> ${movie.vote_count}</p>

           
        </div>
        <div class="col-md-4">
             <h1>${movie.id}</h1>
            <h2 id="movie-title">${movie.title}</h2>

            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <p id="movie-language"><b>Language:</b>${movie.spoken_languages.map(
              (singleLanguge) => ` ${singleLanguge.english_name}`
            )}</p>
            <p> <b>Production companies:</b><ul id="movie-production-company"></ul></p>


            
        </div>
        <div class="col-md-4">
        <h3>Overview:</h3>
        <p id="movie-overview">${movie.overview}</p>
        <h5>Actors:</h5>
        <ul id="actors" class="list-unstyled">
          <p> ${fiveAcrtors}</p>
        </ul>
        <h5>Director:</h5>
          <p> ${director[0].name}</p>
        </div>
        <div id='trailer'>
            <iframe id="ytplayer" type="text/html" width="640" height="360"
            src="https://www.youtube.com/embed/${trailerKey}?autoplay=1"
            frameborder="0"></iframe>
        </div>
        <div >
            <h3>related movies:</h3>
            <div  class="row" id="relatedmovies"></div>
        </div>

      </div>`;
  companies.forEach((com) => {
    const company = document.getElementById("movie-production-company");
    let li = document.createElement("li");
    li.innerHTML = `${com[0]} <img src="${PROFILE_BASE_URL}${com[1]}" alt="" height="18">`;
    company.append(li);
  });

  renderRelatedMovies(related);
};

document.addEventListener("DOMContentLoaded", autorun);
