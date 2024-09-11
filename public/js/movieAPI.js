// API URL & Key
const baseUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json"
const key = "32155165a8351792b6543acbd4d644ac";
const date = "20240909"

const showDefault = async () => {
    const api_url = baseUrl + "?" + `key=${key}` + "&" + `targetDt=${date}`

    try {
        await fetch(api_url)
            .then(response => response.json())
            .then(data => {
                const topTen = [...data.boxOfficeResult.dailyBoxOfficeList]
                // topTen.forEach((element, i) => {
                //     console.log(i, ": ", element);
                // })
                return topTen;
            })
        // res.status(200).json(topTen.length);
    } catch (error) {
        console.log(error)
        // res.status(500).send(error.message) }
    }
}

// export { showDefault };