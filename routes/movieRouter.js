// npm i axios --s
const express = require("express");
const router = express.Router();
const axios = require("axios");
const { showDefault } = require("../public/js/movieAPI");



router.get('/', async (req, res) => {
    console.log("페이지 로드")
})

router.get('/:movieSeq', async (req, res) => {
    const { movieSeq } = req.params;
    // console.log("movieCd: ", movieCd);

    res.status(200).json(movieSeq);
})

module.exports = router;