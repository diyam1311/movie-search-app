# 🎬 MovieFinder – Movie Search Application

MovieFinder is a responsive movie search application built using HTML, CSS and Vanilla JavaScript. It allows users to search for movies, explore their details, check IMDb ratings, filter results and save their favourite movies.

The application uses the [OMDb API](https://www.omdbapi.com/) to fetch movie information.

## 🌐 Live Demo

**[Visit MovieFinder](https://movie-search-app-9vqt.onrender.com/)**

## ✨ Features

- **Movie Search:** Search for movies by title.
- **Movie Details:** View movie posters, release years, genres and IMDb ratings.
- **Genre Filter:** Filter movies by genre.
- **Year Filter:** Find movies from a specific year.
- **Favourites:** Save and remove favourite movies.
- **Local Storage:** Favourites remain saved even after refreshing the page.
- **Error Handling:** Displays appropriate messages for invalid searches and API errors.
- **Responsive Design:** Works across desktop, tablet and mobile screens.
- **Asynchronous API Calls:** Fetches movie information using JavaScript Fetch API and async/await.

## 🛠️ Technologies Used

- HTML5 – Application structure
- CSS3 – Styling and responsive layout
- JavaScript (ES6+) – Application logic and DOM manipulation
- OMDb API – Movie data
- Browser Local Storage – Saving favourite movies
- Git & GitHub – Version control
- Render – Deployment

## 📂 Project Structure

```text
movie-search-app/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Run Locally

1. Clone the repository:

```bash
git clone https://github.com/diyam1311/movie-search-app.git
```

2. Open the project folder:

```bash
cd movie-search-app
```

3. Get an API key from [OMDb API](https://www.omdbapi.com/apikey.aspx).

4. Open `script.js` and add your API key:

```javascript
const API_KEY = "YOUR_OMDB_API_KEY";
```

5. Open `index.html` in your browser or use the VS Code Live Server extension.

## 🔑 API Integration

MovieFinder uses the OMDb API to retrieve movie information.

The application uses:
- Search API to find movies by title.
- IMDb ID to retrieve detailed movie information.
- Genre and year information to filter results.

## 💾 Data Storage

The application uses browser Local Storage to maintain a list of favourite movies.

Favourite movies are stored locally in the user's browser and remain available after refreshing the page.

## 🌍 Deployment

The application is deployed as a static website using Render.

**Live URL:** https://movie-search-app-9vqt.onrender.com/

## 👩‍💻 Author

**Diya Mendiratta**

BCA – Artificial Intelligence and Machine Learning  
Galgotias University

**GitHub:** [@diyam1311](https://github.com/diyam1311)

---

⭐ If you like this project, consider giving the repository a star!