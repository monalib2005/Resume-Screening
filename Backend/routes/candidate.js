const express = require('express');
const multer = require('multer');
const router = express.Router();
const Candidate = require('../models/candidate');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage});
const Job = require("../models/job.js");

// POST /api/candidates - Create a candidate

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { jobId, status } = req.body;

    if (!jobId  || !req.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const job=await Job.findOne({_id:jobId});
    console.log(jobId,job);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    const jobDescription=job.description;
    
    // 1. Save the uploaded resume to a temp file
    const tempFilePath = path.join(__dirname, `resume_${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // 2. Spawn the Python process
    const python = spawn('python', ['D:/Resume_Matching/Resume-Screening/Backend/routes/analyze_resume.py', tempFilePath, jobDescription]);

    let result = '';
    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());
    });

    python.on('close', async (code) => {
      fs.unlinkSync(tempFilePath); // delete temp file

      if (code !== 0) {
        return res.status(500).json({ error: 'Python script error' });
      }

      const { name, email, match_score } = JSON.parse(result);

      const candidate = new Candidate({
        jobId,
        name,
        email,
        score: match_score,
        status: status || 'Screened',
        resume: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      });

      await candidate.save();

      res.status(201).json({ message: 'Candidate saved', candidate });
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/', async (req, res) => {
  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: 'jobId is required in query params' });
    }

    const candidates = await Candidate.find({ jobId });
    res.status(200).json(candidates);
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/candidates/:id - Update score or status
router.patch('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.status(200).json({ message: 'Candidate updated', candidate });
  } catch (err) {
    console.error('Error updating candidate:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/candidates/:id/resume - Serve the resume PDF
router.get('/:id/resume', async (req, res) => {
    try {
      const candidate = await Candidate.findById(req.params.id);
      if (!candidate || !candidate.resume || !candidate.resume.data) {
        return res.status(404).json({ error: 'Resume not found' });
      }
  
      res.set('Content-Type', candidate.resume.contentType);
      res.send(candidate.resume.data);
    } catch (err) {
      console.error('Error fetching resume:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;
