// detail.js
document.addEventListener("DOMContentLoaded", () => {
  const movieCd = new URLSearchParams(window.location.search).get("movieCd");

  if (movieCd) {
    getMovieInfo(movieCd);
  } else {
    displayError("영화 코드가 제공되지 않았습니다.");
  }
});

async function getMovieInfo(movieCd) {
  const url = `http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json`;
  const apiKey = "32155165a8351792b6543acbd4d644ac";

  try {
    const response = await axios.get(url, {
      params: { key: apiKey, movieCd },
    });
    const movieInfo = response.data.movieInfoResult.movieInfo;
    displayMovieInfo(movieInfo);
  } catch (err) {
    console.error("Error fetching movie info:", err.message);
    alert("영화 정보를 가져오는 데 실패했습니다.");
  }
}

function displayMovieInfo(movieInfo) {
  const posterContainer = document.querySelector("#posterContainer");
  const detailContainer = document.querySelector("#detailContainer");

  // 수정: 이미지에 클래스 추가
  posterContainer.innerHTML = `<img src="./images/samplePoster.png" alt="영화 포스터" class="poster-image">`;

  const infoHtml = `
    <h1 class="mb-3">${movieInfo.movieNm}</h1>
    <h2 class="text-secondary">${movieInfo.movieNmEn}</h2>
    
    <div class="section-title ">영화 정보</div>
    <ul class="list-group list-group-flush mb-4">
        <li class="list-group-item">
            <span class="info-label">개봉년도:</span> ${movieInfo.prdtYear}
        </li>
        <li class="list-group-item">
            <span class="info-label">상영시간:</span> ${movieInfo.showTm}분
        </li>
        <li class="list-group-item">
            <span class="info-label">장르:</span> 
            ${movieInfo.genres
              .map((g) => `<span class="badge me-1">${g.genreNm}</span>`)
              .join(" ")}
        </li>
        <li class="list-group-item">
            <span class="info-label">제작국가:</span> ${movieInfo.nations
              .map((n) => n.nationNm)
              .join(", ")}
        </li>
    </ul>
    
    <div class="section-title ">감독</div>
    <p class="mb-4">${movieInfo.directors.map((d) => d.peopleNm).join(", ")}</p>
    
    <div class="section-title ">출연진</div>
    <p>${movieInfo.actors.map((a) => a.peopleNm).join(", ")}</p>
  `;
  detailContainer.innerHTML = infoHtml;
}

function displayError(message) {
  const detailContainer = document.querySelector("#detailContainer");
  detailContainer.innerHTML = `<p class="error">${message}</p>`;
}
