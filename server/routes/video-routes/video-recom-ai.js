const express = require('express');
const router = express.Router();
const huggingFaceInference = require('../../helpers/hugging_face');

router.post('/recommendations', async (req, res) => {
    const { videoFeatures } = req.body;

    try {
        const recommendations = await huggingFaceInference(videoFeatures);
        res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
