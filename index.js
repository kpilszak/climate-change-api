const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    }
];
const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            });
            res.json(articles);
        }).catch((err) => console.log(err));
});

app.get('/', (req, res) => {
    res.json('Welcome to Climate Change News API');
});

app.get('/news', (req, res) => {
    res.json(articles);
});

app.get('/news/:newspaperId', async(req, res) => {
    const newspaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];
            $('a:contains("climate")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
            })
        })
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));