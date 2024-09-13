// const { showDefault } = require("../js/movieAPI")
// import showDefault from './movieAPI';
// window.showDefault = showDefault;

// API URL & Key
const baseUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";
const searchUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json";
const key = "32155165a8351792b6543acbd4d644ac";

const kmdbUrl = "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp"
const kmdbKey = "085Y743J0S0KGG48LZS5";

const date = "20240909";

const result = document.getElementById("result");
const showBtn = document.getElementById("showBtn");
const searchBtn = document.getElementById("searchBtn");
const input = document.querySelector("#keywordInput");

// Top Ten 영화 데이터를 가져오는 비동기 함수
const getTopTen = async () => {
    const api_url = baseUrl + "?" + `key=${key}` + "&" + `targetDt=${date}`;

    console.log(api_url);
    try {
        const response = await axios.get(api_url);
        const data = response.data;
        const topTen = data.boxOfficeResult.dailyBoxOfficeList; // 데이터 배열로 복사

        return topTen;
    } catch (error) {
        console.log(error);
    }
};

// 키워드로 검색(KmDB)
const searchForKeyword = async () => {
    const keyword = input.value;
    let api_url = kmdbUrl + "?" + `ServiceKey=${kmdbKey}` + "&" + "collection=kmdb_new2&" + `query=${keyword}`;
    api_url += ""
    console.log(api_url);

    try {
        const response = await axios.get(api_url);
        const data = response.data.Data[0];
        const dCount = data.Count;
        const result = data.Result; // 데이터 배열로 복사

        console.log(dCount, result);
        return result;
    } catch (error) {
        console.log(error);
    }
}

/*
구)KOBIS 이용 정보검색 코드
// const searchForKeyword = async (keyword) => {
//     const infinity = "&itemPerPage=50"
//     const api_url = searchUrl + "?" + `key=${key}` + "&" + `movieNm=${keyword}` + infinity;

//     console.log(api_url);
//     try {
//         const response = await axios.get(api_url);
//         const data = response.data;
//         const result = data.movieListResult.movieList; // 데이터 배열로 복사

//         console.log(data.movieListResult);
//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// }
*/




// 결과 화면에 출력
const showResult = (data, opt) => {
    let str = "";
    if (opt === 1) {
        str = "<table class='table table-striped'><thead><tr><th scope='col'>순위</th><th scope='col'>제목</th><th scope='col'>개봉일</th></tr></thead><tbody>";  // 출력할 문자열 초기화
        data.sort((x, y) => y.openDt - x.openDt)
            .forEach((element, i) => {
                str += `<tr"><th scope='row'>${i + 1}</th><td><a href="/movie/${element.movieCd}">${element.movieNm}</a></td><td>${element.openDt}</td></tr>`;
            });
    } else if (opt === 2) {
        str = "<table class='table table-striped'><thead><tr><th scope='col'>순번</th><th scope='col'>제목</th><th scope='col'>개봉일</th><th scope='col'>포스터</th></tr></thead><tbody>";  // 출력할 문자열 초기화
        let title = "";
        let imgArray;
        data.sort((x, y) => y.repRatDate - x.repRatDate)
            .forEach((element, i) => {
                title = element.title.replace(/ ?!HS ?| ?!HE ?/g, '').trim();
                imgArray = element.posters.split('|'); // 포스터 경로 배열로 분리
                str += `<tr><th scope='row'>${i + 1}</th><td><a href="${element.kmdbUrl}" target="_blank">${title}</a></td><td>${element.repRatDate}</td><td><img src="${imgArray[0]}" alt="포스터 이미지"></td></tr>`;
            });
    };
    str += "</tbody></table>";
    result.innerHTML = str;  // 결과 영역에 출력
    document.querySelector("#keywordInput").value = "";
    if (data.length > 10) result.innerHTML += `항목 수: ${data.length} - 10개 초과되어 페이징 처리 필요`;
};


// 박스오피스 출력
showBtn.addEventListener("click", async () => {
    const res = await getTopTen();  // 영화 데이터를 비동기로 가져옴
    if (res) {
        showResult(res, 1);  // 데이터를 화면에 출력
    } else {
        result.innerHTML = "데이터를 불러오지 못했습니다.";  // 오류 처리
    }
});

// 키워드로 검색
searchBtn.addEventListener("click", async () => {
    const keyword = input.value;
    if (!keyword || keyword.trim() === "") {
        alert("키워드를 입력하세요!")
        input.focus();
        return;
    }

    searchForKeyword();

    const res = await searchForKeyword(keyword);

    if (res) {
        showResult(res, 2);  // 데이터를 화면에 출력

    } else {
        result.innerHTML = "데이터를 불러오지 못했습니다.";  // 오류 처리
    }
})

input.addEventListener("change", async () => {
    const keyword = document.querySelector("#keywordInput").value;
    if (!keyword || keyword.trim() === "") {
        alert("키워드를 입력하세요!")
        input.focus();
        return;
    }
    showResult(await searchForKeyword(input.value), 2);
});

document.addEventListener("DOMContentLoaded", async () => { showResult(await getTopTen(), 1) })