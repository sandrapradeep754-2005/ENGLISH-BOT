const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { userMessage, topic } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'User message is required' });
    }

    if (!HF_API_KEY) {
      return res.status(500).json({ error: 'Hugging Face API key not configured' });
    }

    // Simple response generation without external API calls
    // This works offline and is completely reliable
    const responses = generateSmartResponse(userMessage, topic);
    
    res.json({ 
      success: true,
      message: responses
    });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Smart response generator based on user input
function generateSmartResponse(userMessage, topic) {
  const lowerText = userMessage.toLowerCase();
  
  // Check for keywords and generate contextual responses
  if (lowerText.includes('like') || lowerText.includes('love') || lowerText.includes('enjoy')) {
    const responses = [
      "That's wonderful! What do you like most about it?",
      "I can tell you're passionate about that! Tell me more.",
      "That sounds amazing! How did you get interested in it?",
      "That's great! Do you do it often?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  } 
  else if (lowerText.includes('don\'t') || lowerText.includes('not') || lowerText.includes('hate')) {
    const responses = [
      "I understand. What would you prefer instead?",
      "Got it. Have you tried something different?",
      "That's fair! What do you enjoy more?",
      "No problem. What interests you then?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else if (lowerText.includes('yesterday') || lowerText.includes('today') || lowerText.includes('yesterday')) {
    const responses = [
      "That sounds interesting! How was it?",
      "Nice! Did you enjoy it?",
      "Sounds good! What was special about it?",
      "Cool! Tell me more about that experience.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else if (lowerText.includes('pet') || lowerText.includes('dog') || lowerText.includes('cat')) {
    const responses = [
      "Pets are wonderful! What's your pet's name?",
      "That's lovely! What kind of pet do you have?",
      "I love pets! How long have you had it?",
      "That's cute! What does your pet like to do?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else if (lowerText.includes('food') || lowerText.includes('eat') || lowerText.includes('cook')) {
    const responses = [
      "Food is great! What's your favorite cuisine?",
      "Nice! Do you cook often?",
      "That sounds delicious! How do you prepare it?",
      "I love talking about food! What's your specialty?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('study')) {
    const responses = [
      "That's interesting! How long have you been doing that?",
      "Tell me more! What do you enjoy about it?",
      "That sounds rewarding! What's the best part?",
      "Cool! What are your responsibilities?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else if (lowerText.includes('travel') || lowerText.includes('visit') || lowerText.includes('place')) {
    const responses = [
      "That sounds like an adventure! What was the best part?",
      "Travel is amazing! Where did you go?",
      "That's cool! What did you experience there?",
      "I love hearing about travels! Tell me more!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else if (lowerText.includes('friend') || lowerText.includes('family') || lowerText.includes('people')) {
    const responses = [
      "That's wonderful! What makes them special?",
      "People are important! How do you spend time together?",
      "That's nice! What do you like to do with them?",
      "Relationships matter! How long have you known them?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  else {
    // Default responses
    const responses = [
      "That's interesting! Tell me more about that.",
      "I see! Why is that important to you?",
      "That's great! How does that make you feel?",
      "Fascinating! What inspired you to do that?",
      "Cool! Can you give me more details?",
      "I love learning about that! Continue.",
      "That's awesome! What happened next?",
      "Really? Tell me your experience with that!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔑 Hugging Face API Key is ${HF_API_KEY ? 'loaded' : 'NOT loaded'}`);
  console.log(`📡 Using smart response generator (works offline!)`);
});

