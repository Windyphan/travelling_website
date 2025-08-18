const express = require('express');
const router = express.Router();
const { auth, editorAuth } = require('../middleware/auth');
const Content = require('../models/Content');

// Get content
const getContent = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;

    const filter = { status: 'published' };
    if (type) filter.type = type;

    const content = await Content.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Content.countDocuments(filter);

    res.json({
      data: content,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalContent: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error fetching content' });
  }
};

// Get content by slug
const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const content = await Content.findOne({ slug, status: 'published' })
      .populate('author', 'name');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Increment view count
    content.views += 1;
    await content.save();

    res.json({ content });
  } catch (error) {
    console.error('Get content by slug error:', error);
    res.status(500).json({ message: 'Server error fetching content' });
  }
};

// Create content
const createContent = async (req, res) => {
  try {
    const contentData = {
      ...req.body,
      author: req.user.id
    };

    const content = new Content(contentData);
    await content.save();

    res.status(201).json({
      message: 'Content created successfully',
      content
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error creating content' });
  }
};

// Update content
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({
      message: 'Content updated successfully',
      content
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error updating content' });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error deleting content' });
  }
};

// Routes
router.get('/', getContent);
router.get('/:slug', getContentBySlug);
router.post('/', editorAuth, createContent);
router.put('/:id', editorAuth, updateContent);
router.delete('/:id', editorAuth, deleteContent);

module.exports = router;
