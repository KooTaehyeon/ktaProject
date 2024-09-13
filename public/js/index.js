const KOBIS_API_KEY = '32155165a8351792b6543acbd4d644ac';
const KOBIS_API_URL = 'http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json';
const TMDB_API_KEY = '12b259293ebc604ee27d0c9a2ccbbef8';
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w200';

const searchForm = document.getElementById('searchFrm');
const keywordInput = document.getElementById('keyword');
const searchButton = document.getElementById('btnSearch');
const resultDiv = document.getElementById('result');
const pageNavDiv = document.getElementById('pageNavi');
const topRatedButton = document.getElementById('btnTopRated');
const topRatedResultDiv = document.getElementById('topRatedResult');
const thisYearButton = document.getElementById('btnThisYear');

thisYearButton.addEventListener('click', openThisYearMoviesWindow);

function openThisYearMoviesWindow() {
    const thisYearWindow = window.open('', 'ThisYearMovies', 'width=800,height=600');
    thisYearWindow.document.write('<html><head><title>올해의 영화</title>');
    thisYearWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">');
    thisYearWindow.document.write('</head><body><div class="container mt-4"><h2>올해의 영화 로딩 중...</h2></div></body></html>');
    
    getThisYearMovies(thisYearWindow);
}

async function getThisYearMovies(targetWindow) {
    const currentYear = new Date().getFullYear();
    try {
        const response = await axios.get(`${TMDB_API_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'ko-KR',
                sort_by: 'popularity.desc',
                include_adult: false,
                include_video: false,
                page: 1,
                primary_release_year: currentYear
            }
        });

        const movies = response.data.results.slice(0, 10); // 상위 10개만 표시
        displayThisYearMovies(movies, targetWindow);
    } catch (error) {
        console.error('올해의 영화 가져오기 오류:', error);
        targetWindow.document.body.innerHTML = '<div class="container mt-4"><p class="text-danger">올해의 영화를 가져오는 중 오류가 발생했습니다.</p></div>';
    }
}

function displayThisYearMovies(movies, targetWindow) {
    const movieList = movies.map((movie, index) => `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${TMDB_IMG_URL}${movie.poster_path}" class="img-fluid rounded-start" alt="${movie.title} 포스터">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${index + 1}. ${movie.title}</h5>
                        <p class="card-text">개봉일: ${movie.release_date}</p>
                        <p class="card-text">평점: ${movie.vote_average.toFixed(1)}</p>
                        <p class="card-text">${movie.overview.slice(0, 100)}...</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    targetWindow.document.body.innerHTML = `
        <div class="container mt-4">
            <h2 class="mb-4">올해의 인기 영화 Top 10</h2>
            ${movieList}
        </div>
    `;
}

topRatedButton.addEventListener('click', getTopRatedMovies);

topRatedButton.addEventListener('click', openTopRatedWindow);

function openTopRatedWindow() {
    const topRatedWindow = window.open('', 'TopRatedMovies', 'width=800,height=600');
    topRatedWindow.document.write('<html><head><title>평점 Top 10 영화</title>');
    topRatedWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">');
    topRatedWindow.document.write('</head><body><div class="container mt-4"><h2>평점 Top 10 영화 로딩 중...</h2></div></body></html>');
    
    getTopRatedMovies(topRatedWindow);
}

async function getTopRatedMovies(targetWindow) {
    try {
        const response = await axios.get(`${TMDB_API_URL}/movie/top_rated`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'ko-KR',
                page: 1
            }
        });

        const topMovies = response.data.results.slice(0, 10);
        displayTopRatedMovies(topMovies, targetWindow);
    } catch (error) {
        console.error('Top 10 영화 가져오기 오류:', error);
        targetWindow.document.body.innerHTML = '<div class="container mt-4"><p class="text-danger">Top 10 영화를 가져오는 중 오류가 발생했습니다.</p></div>';
    }
}

function displayTopRatedMovies(movies, targetWindow) {
    const movieList = movies.map((movie, index) => `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${TMDB_IMG_URL}${movie.poster_path}" class="img-fluid rounded-start" alt="${movie.title} 포스터">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${index + 1}. ${movie.title}</h5>
                        <p class="card-text">평점: ${movie.vote_average.toFixed(1)}</p>
                        <p class="card-text">${movie.overview.slice(0, 100)}...</p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    targetWindow.document.body.innerHTML = `
        <div class="container mt-4">
            <h2 class="mb-4">평점 기준 Top 10 영화</h2>
            ${movieList}
        </div>
    `;
}

let currentPage = 1;
const itemsPerPage = 10;

searchButton.addEventListener('click', () => {
  currentPage = 1;
  searchMovies();
});

keywordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    currentPage = 1;
    searchMovies();
  }
});

async function searchMovies() {
  const keyword = keywordInput.value.trim();
  if (!keyword) return;

  try {
    const kobisResponse = await axios.get(KOBIS_API_URL, {
      params: {
        key: KOBIS_API_KEY,
        movieNm: keyword,
        itemPerPage: itemsPerPage,
        curPage: currentPage
      }
    });

    const movies = kobisResponse.data.movieListResult.movieList;
    const totalCount = kobisResponse.data.movieListResult.totCnt;

    const moviesWithPosters = await Promise.all(movies.map(async (movie) => {
      const tmdbData = await getMovieDataFromTMDB(movie.movieNm);
      return { ...movie, ...tmdbData };
    }));

    displayResults(moviesWithPosters);
    displayPagination(totalCount);
  } catch (error) {
    console.error('영화 검색 중 오류 발생:', error);
    resultDiv.innerHTML = '<p class="text-danger">영화 검색 중 오류가 발생했습니다. 다시 시도해주세요.</p>';
  }
}

async function getMovieDataFromTMDB(movieTitle) {
  try {
    const searchResponse = await axios.get(`${TMDB_API_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: movieTitle,
        language: 'ko-KR'
      }
    });

    const movie = searchResponse.data.results[0];
    if (!movie) return { poster: null, tmdbId: null };

    const detailsResponse = await axios.get(`${TMDB_API_URL}/movie/${movie.id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ko-KR',
        append_to_response: 'credits,reviews'
      }
    });

    return {
      poster: movie.poster_path ? `${TMDB_IMG_URL}${movie.poster_path}` : null,
      tmdbId: movie.id,
      overview: detailsResponse.data.overview,
      voteAverage: detailsResponse.data.vote_average,
      credits: detailsResponse.data.credits,
      reviews: detailsResponse.data.reviews.results.slice(0, 3)
    };
  } catch (error) {
    console.error('TMDB 데이터 검색 중 오류 발생:', error);
    return { poster: null, tmdbId: null };
  }
}

function displayResults(movies) {
  if (movies.length === 0) {
    resultDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  const movieList = movies.map(movie => `
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          ${movie.poster ? `<img src="${movie.poster}" class="img-fluid rounded-start movie-poster" alt="${movie.movieNm} 포스터" data-tmdb-id="${movie.tmdbId}">` : '<div class="placeholder-glow"><span class="placeholder col-12" style="height: 200px;"></span></div>'}
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${movie.movieNm}</h5>
            <p class="card-text">
              <strong>개봉일:</strong> ${movie.openDt}<br>
              <strong>제작국가:</strong> ${movie.nationAlt}<br>
              <strong>장르:</strong> ${movie.genreAlt}<br>
              <strong>감독:</strong> ${movie.directors.map(d => d.peopleNm).join(', ') || '정보 없음'}
            </p>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  resultDiv.innerHTML = movieList;

  document.querySelectorAll('.movie-poster').forEach(poster => {
    poster.addEventListener('click', () => showMovieDetails(poster.dataset.tmdbId));
  });
}

async function showMovieDetails(tmdbId) {
  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'ko-KR',
        append_to_response: 'credits,reviews'
      }
    });

    const movie = response.data;
    const modalContent = `
      <div class="modal-header">
        <h5 class="modal-title">${movie.title}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <img src="${TMDB_IMG_URL}${movie.poster_path}" class="img-fluid mb-3" alt="${movie.title} 포스터">
        <p><strong>줄거리:</strong> ${movie.overview || '정보 없음'}</p>
        <p><strong>평점:</strong> ${movie.vote_average.toFixed(1)}/10</p>
        <p><strong>출연진:</strong> ${movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
        <h6>리뷰:</h6>
        ${movie.reviews.results.length > 0 ? 
          movie.reviews.results.slice(0, 3).map(review => `
            <div class="review mb-2">
              <p><strong>${review.author}</strong>: ${review.content.slice(0, 100)}...</p>
            </div>
          `).join('') : 
          '<p>리뷰가 없습니다.</p>'
        }
      </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.className = 'modal fade';
    modalElement.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          ${modalContent}
        </div>
      </div>
    `;

    document.body.appendChild(modalElement);
    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    modalElement.addEventListener('hidden.bs.modal', () => {
      document.body.removeChild(modalElement);
    });

  } catch (error) {
    console.error('영화 상세 정보 로딩 중 오류 발생:', error);
  }
}
function displayPagination(totalCount) {
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  let paginationHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'} me-1" onclick="goToPage(${i})">${i}</button>`;
  }

  pageNavDiv.innerHTML = paginationHTML;
}

function goToPage(page) {
  currentPage = page;
  searchMovies();
}