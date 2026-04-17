const express = require('express');
const router = express.Router();
const Thread = require('../model/Thread');
const authMiddleware = require('../middleware/authMiddleware');

// GET all threads    http://localhost:5000/api/threads
router.get('/', async (req, res) => {
  try {
    const threads = await Thread.find().populate('user', 'username');
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST a new thread  http://localhost:5000/api/threads
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newThread = new Thread({
      content: req.body.content,
      user: req.user.id
    });
    const saved = await newThread.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT (edit) a thread
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    if (thread.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    thread.content = req.body.content;
    const updated = await thread.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Invalid update' });
  }
});

// DELETE a thread
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    if (thread.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await thread.deleteOne();
    res.json({ message: 'Thread deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});


// Like a thread
router.post('/:id/like', authMiddleware, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Check if user already liked this thread
    if (thread.likedBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'Thread already liked' });
    }
    
    // Add user to likedBy array and increment likes count
    thread.likedBy.push(req.user.id);
    thread.likes = thread.likedBy.length;
    await thread.save();
    
    res.json({ liked: true, likeCount: thread.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unlike a thread
router.post('/:id/unlike', authMiddleware, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }
    
    // Check if user has liked this thread
    if (!thread.likedBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'Thread not liked yet' });
    }
    
    // Remove user from likedBy array and decrement likes count
    thread.likedBy = thread.likedBy.filter(userId => userId.toString() !== req.user.id);
    thread.likes = thread.likedBy.length;
    await thread.save();
    
    res.json({ liked: false, likeCount: thread.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
