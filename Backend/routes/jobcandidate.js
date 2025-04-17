const express = require('express');
const router = express.Router();
const Job = require("../models/job");

router.post('/', async(req,res) => {
    try {
        const {title, description, skills } = req.body;

        if(!title || !description) {
            return res.status(400).json({ eroor: 'Title and description are required.'});
        }

        const job = new Job({title, description, skills});
        await job.save();
        res.status(201).json({message: 'Job created successfully', job});
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Internal server error ehile creating job"});
    }
});

router.get('/', async(req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1});
        res.status(200).json(jobs);
    } catch (err) {
        console.error('Error in fetching jobs', err);
        res.status(500).json({error: 'Internal server errors while facing jobs.'});
    }
});

router.get('/:id', async (req,res) => {
    try {
        const job = Job.findById(req.params.id);

        if(!job) {
            return res.status(404).json({ error: 'Job not found'});

        }

        res.status(200).json(job);
    } catch (err) {
        console.error('Error ferching job :',err);
        res.status(500).json({error: 'Internal server error while fetching job'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const deletedJob = await Job.findByIdAndDelete(req.params.id);
  
      if (!deletedJob) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      res.status(200).json({ message: 'Job deleted successfully' });
  
    } catch (err) {
      console.error('Error deleting job:', err);
      res.status(500).json({ error: 'Invalid job ID or internal server error' });
    }
  });

  module.exports = router