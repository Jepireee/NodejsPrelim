const authenticateToken = require('../config/authenticateToken');
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const secretKey = require("../config/secretKey");

function getSecretKey() {
  return secretKey;
}

const db = require('../config/database');

const router = express.Router();


router.use(bodyParser.json());


router.post('/comments/register', authenticateToken, async (req, res) => {
  const { content, user_id, task_id } = req.body;

  try {
    const insertCommentsQuery = 'INSERT INTO comments (content, user_id, task_id) VALUES (?, ?, ?)';

    await db.promise().execute(insertCommentsQuery, [content, user_id, task_id]);
    res.status(201).json({ message: 'Comment registered successfully' });

  } catch (error) {
    console.error('Error registering comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/comments', authenticateToken, (req, res) => {

  try{
    db.query('SELECT content, user_id, task_id FROM comments', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading comments:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



router.get('/comments/:id', authenticateToken, (req, res) => {
  let comment_id = req.params.id;

  if (!comment_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide comment_id'});
  }

  try {
    db.query('SELECT content, user_id, task_id FROM comments WHERE id = ?', comment_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading comment:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});



router.put('/comments/:id', authenticateToken, async (req, res) => {

  let comment_id =req.params.id;

  const {content} = req.body;
  
  if (!content) {
    return res.status(400).send({ error: user, message: 'Please provide content' });
  }
  
  try {
    db.query('UPDATE comments SET content = ? WHERE id = ?', [content, comment_id], (err, result, fields) => {
      if (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading comment:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



router.delete('/comments/:id', authenticateToken, (req, res) => {

  let comment_id = req.params.id;

  if (!comment_id) {
    return res.status(400).send({ error: true, message: 'Please provide comment_id' });
  }
  try {
    db.query('DELETE FROM comments WHERE id = ?', comment_id, (err, result, fields) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;