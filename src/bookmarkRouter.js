const express = require('express');
const { v4: uuid } = require('uuid');
const { bookmarks } = require('./dataStore');
const logger = require('./logger');
const jsonParser = express.json();
const bookmarkRouter = express.Router();

bookmarkRouter.get('/', (req, res) => {
  res.send('Hello, world!');
});

bookmarkRouter.get('/bookmarks', (req, res) => {
  res.json(bookmarks);
});

bookmarkRouter.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const bookmark = bookmarks.find((b) => b.id == id);

  if (!bookmark) {
    logger.error(`Bookmark with id: ${id} not found.`);
    return res.status(404).send('Bookmark Not Found');
  }
  res.json(bookmark);
});

bookmarkRouter.post('/bookmarks', jsonParser, (req, res) => {
  const { title, url, rating, description } = req.body;
  const { bookmark_id } = req.params;

  if (!title) {
    logger.error('Title is required');
    return res.status(400).send('Invalid data');
  }
  if (!url) {
    logger.error('URL is required');
    return res.status(400).send('Invalid data');
  }
  if (!rating) {
    logger.error('Rating is required');
    return res.status(400).send('Invalid data');
  }
  const bookmark = { id: uuid(), title, url, description, rating };

  bookmarks.push(bookmark);

  logger.info(`Bookmark with id: ${bookmark_id} created.`);

  res
    .status(201)
    .location(`http://localhost:8000/bookmark/${bookmark_id}`)
    .json({ bookmark_id });
});

bookmarkRouter.delete('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const bookmarkIndex = bookmarks.findIndex((b) => b.id == id);

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res.status(404).send('Bookmark Not Found');
  }

  bookmarks.splice(bookmarkIndex, 1);

  logger.info(`Bookmark with id: ${id} deleted.`);
  res.status(204).end();
});

module.exports = bookmarkRouter;
