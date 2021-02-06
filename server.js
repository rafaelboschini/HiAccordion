const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');

app.use(express.static('src'));

router.get('/data', function (req, res, next) {
    let rawdata = fs.readFileSync('data/data.json');
    let data = JSON.parse(rawdata);

    res.send(data);
});

app.use('/', router);

app.listen(3000, function () {
    console.log(`app listening on port 3000`)
})