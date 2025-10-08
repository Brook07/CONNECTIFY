const express = require("express");
const bodyParser = require("body-parser");
const db = require('./database');

const app = express();
app.use(express.json());

const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log("Server running on port 8000");
});

app.post('/get-user-id', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const query = 'SELECT id FROM users WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });

    if (results.length > 0) {
      res.status(200).json({ id: results[0].id });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});


app.post('/api/add-user', (req, res) => {
  console.log("📥 Incoming request to /api/add-user with body:", req.body);
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    console.log("Started checking for exisitng user.")
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ error: 'DB error' })}
 
    if (results.length === 0) {
      db.query('INSERT INTO users (email) VALUES (?)', [email], (err2, result) => {
        if (err2) return res.status(500).json({ error: 'DB insert error' });
        res.status(200).json({ success: true, userId: result.insertId });
      });
      console.log("Inserted.")
    } else {
      console.log("Already existing user.")
      res.status(200).json({ message: 'User already exists.' });
    }
  });
});



app.get("/users", (req, res) => {
  db.query("SELECT id, name, profile_image, email FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/requests/send", (req, res) => {
  const { from_user_id, to_user_id } = req.body;
  const message = "Hey! I'd like to chat with you.";

  const checkQuery = `
    SELECT * FROM message_requests 
    WHERE from_user_id = ? AND to_user_id = ? AND status IN ('sent', 'accepted')
  `;

  db.query(checkQuery, [from_user_id, to_user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(409).json({ error: "Request already sent or accepted." });
    }

    const insertQuery = `
      INSERT INTO message_requests (from_user_id, to_user_id, message)
      VALUES (?, ?, ?)
    `;

    db.query(insertQuery, [from_user_id, to_user_id, message], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});


// GET message requests
app.get('/requests/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT * FROM message_requests WHERE to_user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// POST accept request
app.post('/requests/accept', (req, res) => {
  const { requestId } = req.body;

  db.query('SELECT * FROM message_requests WHERE id = ?', [requestId], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: 'Request not found' });

    const { from_user_id, to_user_id } = result[0];

    db.query(
      'INSERT INTO ongoing_chats (user1_id, user2_id, started_at) VALUES (?, ?, NOW())',
      [from_user_id, to_user_id],
      (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        db.query('DELETE FROM message_requests WHERE id = ?', [requestId]);
        res.json({ success: true });
      }
    );
  });
});

// POST reject request
app.post('/requests/reject', (req, res) => {
  const { requestId } = req.body;

  db.query('DELETE FROM message_requests WHERE id = ?', [requestId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// GET messages for a chat
app.get('/chat/:chatId/messages', (req, res) => {
  const chatId = req.params.chatId;

  db.query(
    'SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC',
    [chatId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// POST a new message
app.post('/chat/:chatId/message', (req, res) => {
  const { sender_id, message, message_type, image_url } = req.body;
  const chatId = req.params.chatId;

  db.query(
    'INSERT INTO messages (chat_id, sender_id, message, message_type, image_url, timestamp) VALUES (?, ?, ?, ?, ?, NOW())',
    [chatId, sender_id, message, message_type, image_url || null],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});