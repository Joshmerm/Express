const router = require('express').Router();

const api = require('api');

const searchFormatData = ({imdbID, Title, Year, Type, Poster}) => {
    return {
        id: imdbID,
        displayText: `Title: ${Title}. Year: ${Year}.  Type: ${Type}. Poster: ${Poster}.`,
    }
}

const idFormatData = ({imdbID, Title, Year, Rated, Genre, imdbRating}) => {
    return {
        selectedId: imdbID,
        timestamp:  new Date(),
        selectedText: `Title: ${Title}. Year: ${Year}.  Rated: ${Rated}. Genre: ${Genre}. Rating: ${imdbRating}`,
    }
}

router.get('/movie', async (req, res) => {
    try {
        const { q } = req.query;

        const ret = await api.getSearch(q);

        const { Search } = ret?.data;

        const resultCount = Search?.length;

        const results = Search?.map((movie) => searchFormatData(movie));

        res.json({ resultCount, results });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/movie/details', async (req, res) => {
    try {
        const { id, counts, keyword } = req.body;

        const ret = await api.getId(id);

        const { Error, imdbID, Title, Year, Rated, Genre, imdbRating } = ret.data;
        
        if (Error) {
            throw Error;
        }

        const dataToSave = {
            keyword,
            counts,
            ...idFormatData(ret.data)
        }

        const db = req.app.locals.db;
        const collection = db.collection('History');

        await collection.insertOne(dataToSave);

        const results = { id: imdbID, Title, Year, Rated, Genre, imdbRating}

        // created new resource
        res.status(201).json(results);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});



module.exports = router;
