const axios = require('axios');

const huggingFaceInference = async (videoFeatures) => {
    const API_URL = 'https://huggingface.co/keras-io/video-classification-cnn-rnn';
    const headers = {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
    };
    
    try {
        const response = await axios.post(
            API_URL,
            { inputs: videoFeatures },
            { headers }
        );
        return response.data; // Process the response data as needed
    } catch (error) {
        console.error('Error from Hugging Face API:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = huggingFaceInference;
