const express = require('express');
const uuid = require('uuid/v4');
const { bookmarks } = require('./dataStore');
const logger = require('./logger');

const bookmarkRouter = express.Router();

bookmarkRouter.get('/', (req, res) => {
  res.send('Hello, world!');
});

bookmarkRouter.get('/bookmarks', (req, res) => {
  res.json(bookmarks);
});

const { bookmark_id } = req.params;

bookmarkRouter.get('/bookmarks/:id', (req, res) => {
  const bookmark = bookmarks.find((b) => b.id == bookmark_id);

  if (!bookmark) {
    logger.error(`Bookmark with id: ${bookmark_id} not found.`);
    return res.status(404).send('Bookmark Not Found');
  }
  res.json(bookmark);
});

bookmarkRouter.post('/bookmarks', (req, res) => {
  const { title, url, rating, description } = req.body;

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
  const bookmarkIndex = bookmarks.findIndex((b) => b.id == bookmark_id);

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${bookmark_id} not found.`);
    return res.status(404).send('Bookmark Not Found');
  }

  bookmarks.splice(bookmarkIndex, 1);

  logger.info(`Bookmark with id: ${bookmark_id} deleted.`);
  res.status(204).end();
});

module.exports = bookmarkRouter;
