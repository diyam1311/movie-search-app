const API_KEY = "c925797a";
const API_URL = "https://www.omdbapi.com/";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const genreSelect = document.getElementById("genre");
const yearSelect = document.getElementById("year");
const movieGrid = document.getElementById("movie-grid");
const resultsTitle = document.getElementById("results-title");
const message = document.getElementById("message");
const tabResults = document.getElementById("tab-results");
const tabFavourites = document.getElementById("tab-favourites");

let currentMovies = [];
let showingFavourites = false;
let favourites = loadFavourites();
let lastQuery = "";      
let latestSearchId = 0; 

function loadFavourites() {
  try {
    return JSON.parse(localStorage.getItem("favourites")) || [];
  } catch (err) {
    return [];
  }
}

function saveFavourites() {
  try {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  } catch (err) {
    console.error(err);
  }
  tabFavourites.textContent = "My favourites (" + favourites.length + ")";
}

function isFavourite(id) {
  return favourites.some(function (m) {
    return m.imdbID === id;
  });
}

function toggleFavourite(movie) {
  if (isFavourite(movie.imdbID)) {
    favourites = favourites.filter(function (m) {
      return m.imdbID !== movie.imdbID;
    });
  } else {
    favourites.push(movie);
  }
  saveFavourites();
  render();
}

async function getMovieDetails(id) {
  const params = new URLSearchParams({ apikey: API_KEY, i: id });
  const res = await fetch(API_URL + "?" + params);
  if (!res.ok) throw new Error("Server error"); 
  return res.json();
}

async function searchMovies(query) {
  latestSearchId++;
  const thisSearchId = latestSearchId;

  lastQuery = query;      
  showingFavourites = false;
  updateTabs();
  showMessage("Loading...");
  movieGrid.innerHTML = "";

  const params = new URLSearchParams({
    apikey: API_KEY,
    s: query,
    type: "movie"
  });
  if (yearSelect.value !== "Any year") {
    params.set("y", yearSelect.value);
  }

  try {
    const res = await fetch(API_URL + "?" + params);
    if (!res.ok) throw new Error("Server error"); 
    const data = await res.json();

    if (thisSearchId !== latestSearchId) return; 

    if (data.Response === "False") {
      currentMovies = [];
      showMessage(data.Error || "No movies found.", true);
      return;
    }

    const results = await Promise.allSettled(
      data.Search.map(function (item) {
        return getMovieDetails(item.imdbID);
      })
    );

    if (thisSearchId !== latestSearchId) return;

    currentMovies = results
      .filter(function (r) {
        return r.status === "fulfilled" && r.value.Response !== "False";
      })
      .map(function (r) {
        return r.value;
      });

    if (currentMovies.length === 0) {
      showMessage("Could not load movie details. Please try again.", true);
      return;
    }

    render();
  } catch (err) {
    console.error(err); 
    if (thisSearchId === latestSearchId) {
      showMessage("Something went wrong. Check your internet and try again.", true);
    }
  } 
}

function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "message error" : "message";
}

function createCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  if (movie.Poster && movie.Poster !== "N/A") {
    const img = document.createElement("img");
    img.className = "poster-img";
    img.src = movie.Poster;
    img.alt = movie.Title + " poster";
    card.appendChild(img);
  } else {
    const box = document.createElement("div");
    box.className = "poster no-poster";
    box.textContent = movie.Title;
    card.appendChild(box);
  }

  const info = document.createElement("div");
  info.className = "movie-info";

  const title = document.createElement("h4");
  title.textContent = movie.Title;

  const sub = document.createElement("p");
  const genre = movie.Genre && movie.Genre !== "N/A" ? movie.Genre.split(",")[0] : "";
  sub.textContent = movie.Year + (genre ? " \u2022 " + genre : "");

  const rating = document.createElement("p");
  rating.className = "rating";
  rating.textContent = "Rating: " + (movie.imdbRating && movie.imdbRating !== "N/A" ? movie.imdbRating : "not rated");

  const btn = document.createElement("button");
  const saved = isFavourite(movie.imdbID);
  btn.className = saved ? "fav-btn saved" : "fav-btn";
  btn.textContent = saved ? "Saved" : "Save to favourites";
  btn.addEventListener("click", function () {
    toggleFavourite(movie);
  });

  info.appendChild(title);
  info.appendChild(sub);
  info.appendChild(rating);
  info.appendChild(btn);
  card.appendChild(info);

  return card;
}

function render() {
  let list = showingFavourites ? favourites : currentMovies;

  const genre = genreSelect.value;
  if (genre !== "All genres") {
    list = list.filter(function (m) {
      return m.Genre && m.Genre.includes(genre);
    });
  }

  movieGrid.innerHTML = "";

  if (list.length === 0) {
    if (showingFavourites && favourites.length === 0) {
      showMessage("You haven't saved any movies yet.");
    } else if (showingFavourites) {
      showMessage("No saved movies match this genre.");
    } else {
      showMessage("No movies match these filters.");
    }
    return;
  }

  showMessage("");
  list.forEach(function (movie) {
    movieGrid.appendChild(createCard(movie));
  });
}

function updateTabs() {
  tabResults.className = showingFavourites ? "tab" : "tab active";
  tabFavourites.className = showingFavourites ? "tab active" : "tab";

  
  if (showingFavourites) {
    resultsTitle.textContent = "My favourites";
  } else if (lastQuery) {
    resultsTitle.textContent = 'Results for "' + lastQuery + '"';
  } else {
    resultsTitle.textContent = "Search results";
  }
}

function handleSearch() {
  const query = searchInput.value.trim();
  if (query === "") {
    showMessage("Type a movie name to search.", true);
    return;
  }
  searchMovies(query);
}

searchBtn.addEventListener("click", handleSearch);

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

genreSelect.addEventListener("change", render);

yearSelect.addEventListener("change", function () {
  if (searchInput.value.trim() !== "") {
    handleSearch();
  }
});

tabResults.addEventListener("click", function () {
  showingFavourites = false;
  updateTabs();
  render();
});

tabFavourites.addEventListener("click", function () {
  showingFavourites = true;
  updateTabs();
  render();
});

// ---------- on page load ----------
saveFavourites();
searchInput.value = "batman";
searchMovies("batman");