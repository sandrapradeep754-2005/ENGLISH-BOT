import React, { useState, useEffect, useRef } from 'react';

const FlowApp = () => {
  // ============= LOGIN STATE =============
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [userName, setUserName] = useState('');

  // ============= APP STATE =============
  const [mode, setMode] = useState('home');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const syntheRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ============= SPEECH RECOGNITION =============
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const isFinal = event.results[i].isFinal;
          transcript += event.results[i][0].transcript;
          
          if (isFinal) {
            setUserInput(prev => prev + transcript + ' ');
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    syntheRef.current = window.speechSynthesis;
    return () => {
      if (syntheRef.current) syntheRef.current.cancel();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============= LOGIN HANDLER =============
  const handleLogin = () => {
    if (email.trim() && accessKey.trim()) {
      const name = email.split('@')[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setAccessKey('');
    setUserName('');
    setMode('home');
    setMessages([]);
    setCurrentTopic(null);
  };

  // ============= LOGIN PAGE UI =============
  if (!isLoggedIn) {
    return (
      <div style={loginStyles.container}>
        <style>{`
          input::placeholder {
            color: #666;
          }
          input:focus {
            outline: none !important;
            border-color: #007bff !important;
            background: rgba(0, 0, 0, 0.6) !important;
          }
        `}</style>

        <div style={loginStyles.headerLogo}>
          <h1 style={loginStyles.logoText}>Flow</h1>
          <div style={loginStyles.subLogo}>English Mastery</div>
        </div>

        <main style={loginStyles.loginCard}>
          <h2 style={loginStyles.cardTitle}>Sign In</h2>
          
          <div style={loginStyles.inputGroup}>
            <label style={loginStyles.label}>Email Address</label>
            <input 
              type="email" 
              style={loginStyles.inputField} 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && email && accessKey && handleLogin()}
            />
          </div>

          <div style={loginStyles.inputGroup}>
            <label style={loginStyles.label}>Access Key</label>
            <input 
              type="password" 
              style={loginStyles.inputField} 
              placeholder="••••••••"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && email && accessKey && handleLogin()}
            />
          </div>

          <button 
            style={{
              ...loginStyles.startBtn,
              opacity: (email && accessKey) ? 1 : 0.5,
              cursor: (email && accessKey) ? 'pointer' : 'not-allowed'
            }}
            disabled={!(email && accessKey)}
            onClick={handleLogin}
          >
            Start Learning
          </button>
        </main>
      </div>
    );
  }

  // ============= MAIN APP UI =============
  const suggestedTopics = [
    { id: 1, title: 'Daily Routines', emoji: '🌅' },
    { id: 2, title: 'Travel & Culture', emoji: '✈️' },
    { id: 3, title: 'Food & Cooking', emoji: '🍽️' },
    { id: 4, title: 'Hobbies & Interests', emoji: '🎮' },
    { id: 5, title: 'Career & Education', emoji: '📚' },
    { id: 6, title: 'Movies & Entertainment', emoji: '🎬' },
  ];

  const generateSmartResponse = (userMessage, topic) => {
    const lowerText = userMessage.toLowerCase();
    
    // Food/Biryani responses
    if (lowerText.includes('biryani') || lowerText.includes('food') || lowerText.includes('eat') || lowerText.includes('cook') || lowerText.includes('tasty') || lowerText.includes('delicious')) {
      const responses = [
        "That sounds absolutely delicious! What spices do you use in your biryani?",
        "Biryani is such a flavorful dish! Do you prefer Hyderabadi or Lucknowi style?",
        "I'm curious - did you cook it yourself or have it at a restaurant?",
        "That's wonderful! How long does it usually take you to prepare biryani?",
        "I love that you enjoyed it! What makes biryani your favorite food?",
        "Biryani with all those aromatic spices! What's your secret ingredient?",
        "That sounds amazing! Do you cook biryani often, or was this a special occasion?",
        "I'm intrigued! What was the best part about the biryani you had yesterday?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Pet/Animal responses
    if (lowerText.includes('pet') || lowerText.includes('dog') || lowerText.includes('cat') || lowerText.includes('paachu') || lowerText.includes('animal')) {
      const responses = [
        "Paachu sounds like a wonderful name! Is it a dog or a cat?",
        "That's so sweet! What's Paachu's favorite thing to do?",
        "Pets bring so much joy to our lives! How long have you had Paachu?",
        "I'd love to know more! What breed is your pet?",
        "That's adorable! Does your pet have any funny habits?",
        "Pets are amazing companions! What does Paachu like to eat?",
        "How wonderful! Can you tell me a funny story about your pet?",
        "I'm curious - how did you choose the name Paachu for your pet?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Feelings and emotions
    if (lowerText.includes('happy') || lowerText.includes('sad') || lowerText.includes('excited') || lowerText.includes('enjoyed') || lowerText.includes('love') || lowerText.includes('like')) {
      const responses = [
        "That's wonderful to hear! What made you feel that way?",
        "I'm so glad you had a positive experience! What was the highlight?",
        "That's fantastic! Can you tell me more about what happened?",
        "I can feel your enthusiasm! What specifically did you enjoy most?",
        "That's great! How long have you been enjoying this?",
        "I love your positive energy! What else makes you happy?",
        "That's amazing! Do you experience this feeling often?",
        "Wonderful! What inspired you to try this in the first place?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Travel/Location responses
    if (lowerText.includes('travel') || lowerText.includes('visit') || lowerText.includes('place') || lowerText.includes('city') || lowerText.includes('country') || lowerText.includes('went')) {
      const responses = [
        "That sounds like an incredible adventure! What was the most memorable moment?",
        "Travel experiences are so enriching! What did you enjoy most about that place?",
        "How fascinating! What were the top attractions you visited?",
        "That's wonderful! Would you recommend it to others? Why?",
        "I'm intrigued! What was the food like in that place?",
        "That sounds exciting! Did you go with family or friends?",
        "How amazing! What surprised you most about that destination?",
        "Travel really opens our minds! What did you learn from this experience?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Work/Career/Study responses
    if (lowerText.includes('work') || lowerText.includes('job') || lowerText.includes('study') || lowerText.includes('learn') || lowerText.includes('project') || lowerText.includes('class')) {
      const responses = [
        "That sounds like a meaningful pursuit! What do you enjoy most about it?",
        "That's impressive! How long have you been working on this?",
        "I'm curious - what challenges do you face in your work?",
        "That's wonderful! What are your goals in this field?",
        "Tell me more! What's the most interesting part of your job?",
        "That's great! How did you get interested in this area?",
        "I'm intrigued! What skills have you developed so far?",
        "That's admirable! What does a typical day look like for you?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Hobby/Interest responses
    if (lowerText.includes('hobby') || lowerText.includes('gaming') || lowerText.includes('play') || lowerText.includes('interest') || lowerText.includes('passion')) {
      const responses = [
        "That's a cool hobby! How did you get started with it?",
        "I'm curious! What do you enjoy most about this hobby?",
        "That sounds fun! How much time do you spend on it?",
        "That's awesome! Have you achieved any notable milestones?",
        "Tell me more! What makes this hobby special to you?",
        "That's interesting! Do you do this alone or with others?",
        "I'd love to hear more! What's your favorite aspect of it?",
        "That's fantastic! How long have you been pursuing this?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Family/Friends responses
    if (lowerText.includes('friend') || lowerText.includes('family') || lowerText.includes('people') || lowerText.includes('relative') || lowerText.includes('brother') || lowerText.includes('sister') || lowerText.includes('mother') || lowerText.includes('father')) {
      const responses = [
        "That's wonderful! What do you value most about your relationships?",
        "Family and friends are so important! What do you like to do together?",
        "That's beautiful! How do they support you?",
        "I'm curious - what's your favorite memory with them?",
        "That's heartwarming! How often do you spend time together?",
        "That's lovely! What makes them special to you?",
        "Tell me more! What qualities do you appreciate in them?",
        "That's great! How do they influence your life?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Learning/Success responses
    if (lowerText.includes('learn') || lowerText.includes('understand') || lowerText.includes('success') || lowerText.includes('achieve') || lowerText.includes('improve')) {
      const responses = [
        "That's fantastic! Keep pushing forward! What's your next goal?",
        "You're making great progress! How does it feel?",
        "That's impressive! What helped you achieve this?",
        "Wonderful! What did you learn from this experience?",
        "That's excellent! What's your strategy moving forward?",
        "I'm proud of you! What inspired you to work harder?",
        "That's amazing! How did you overcome the challenges?",
        "You're doing great! What's your next step?",
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Default engaging responses
    const defaultResponses = [
      "That's really interesting! Can you tell me more about that?",
      "Wow! How did that make you feel?",
      "That's great! Why is that important to you?",
      "Fascinating! What inspired you to do that?",
      "Tell me more! I'd love to know the details.",
      "That's wonderful! What was the best part about it?",
      "I'm curious! How did you experience that?",
      "That's amazing! What happened after that?",
      "I see! What's your perspective on that?",
      "That's cool! Do you do that often?",
      "Interesting! How long have you been doing this?",
      "I love learning about you! Tell me more!",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || loading) return;
    
    const userMessage = { type: 'user', text: userInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);
    
    const response = generateSmartResponse(userInput, currentTopic?.title);
    
    const aiMessage = { type: 'ai', text: response, timestamp: new Date() };
    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
    
    if (syntheRef.current && !response.includes('Error')) {
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.rate = 0.9;
      syntheRef.current.speak(utterance);
    }
    
    const words = userInput.toLowerCase().split(/\s+/).filter(w => w.length > 5);
    if (words.length > 0) {
      const newWord = words[Math.floor(Math.random() * words.length)];
      setVocabulary(prev => {
        if (!prev.find(v => v.word === newWord)) {
          return [...prev, { 
            word: newWord, 
            definition: 'A meaningful word from your conversation',
            example: `"${userInput.substring(0, 50)}..."`,
            date: new Date().toLocaleDateString()
          }];
        }
        return prev;
      });
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if (syntheRef.current) {
      syntheRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      syntheRef.current.speak(utterance);
    }
  };

  const startCustomTopic = () => {
    if (!customTopic.trim()) {
      alert('Please enter a topic!');
      return;
    }
    const topic = {
      title: customTopic,
      emoji: '💬'
    };
    setCurrentTopic(topic);
    setMessages([{
      type: 'ai',
      text: `Great! Let's talk about "${customTopic}". What would you like to share?`,
      timestamp: new Date()
    }]);
    setMode('chat');
    setCustomTopic('');
  };

  const selectPresetTopic = (topic) => {
    setCurrentTopic(topic);
    setMessages([{
      type: 'ai',
      text: `Great! Let's talk about "${topic.title}". What's something interesting you'd like to share?`,
      timestamp: new Date()
    }]);
    setMode('chat');
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentTopic(null);
    setMode('home');
    setCustomTopic('');
  };

  const copyToClipboard = (word) => {
    navigator.clipboard.writeText(word);
  };

  // ============= COLORS =============
  const colors = {
    bgNavy: '#000b1a',
    cardBlue: '#001a3d',
    accentBlue: '#007bff',
    borderBlue: '#1e4f8a',
    textWhite: '#ffffff',
    lightGray: '#b0c4de',
    disabled: '#444444',
  };

  const appStyles = {
    container: {
      minHeight: '100vh',
      background: `radial-gradient(circle at center, ${colors.cardBlue} 0%, ${colors.bgNavy} 100%)`,
      color: colors.textWhite,
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      borderBottom: `2px solid ${colors.accentBlue}`,
      padding: '20px',
      backgroundColor: `${colors.bgNavy}CC`,
      position: 'sticky',
      top: 0,
      zIndex: 50,
    },
    headerContent: {
      maxWidth: '1000px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: colors.textWhite,
      margin: 0,
      letterSpacing: '2px',
    },
    userGreeting: {
      fontSize: '14px',
      color: colors.lightGray,
    },
    logoutBtn: {
      padding: '10px 20px',
      borderRadius: '6px',
      backgroundColor: '#dc3545',
      color: colors.textWhite,
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    main: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
      width: '100%',
      flex: 1,
    },
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    messagesBox: {
      backgroundColor: `${colors.bgNavy}40`,
      borderRadius: '10px',
      padding: '20px',
      maxHeight: '400px',
      overflowY: 'auto',
      border: `2px solid ${colors.borderBlue}`,
      minHeight: '300px',
    },
    message: {
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'flex-start',
    },
    userMessage: {
      justifyContent: 'flex-end',
    },
    messageBubble: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    userBubble: {
      backgroundColor: colors.accentBlue,
      color: colors.textWhite,
    },
    aiBubble: {
      backgroundColor: colors.cardBlue,
      color: colors.textWhite,
      border: `1px solid ${colors.borderBlue}`,
    },
    inputContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '6px',
      backgroundColor: `${colors.bgNavy}80`,
      border: `1px solid ${colors.borderBlue}`,
      color: colors.textWhite,
      fontSize: '14px',
      outline: 'none',
    },
    button: {
      padding: '12px 16px',
      borderRadius: '6px',
      backgroundColor: colors.accentBlue,
      color: colors.textWhite,
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    listeningBtn: {
      backgroundColor: '#FF4444',
    },
    tip: {
      fontSize: '12px',
      color: colors.lightGray,
      marginTop: '5px',
    },
    sidebar: {
      backgroundColor: `${colors.cardBlue}80`,
      borderRadius: '10px',
      padding: '20px',
      border: `2px solid ${colors.borderBlue}`,
      marginTop: '20px',
    },
    sidebarTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: colors.accentBlue,
      marginBottom: '15px',
    },
    topicsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
    },
    topicCard: {
      padding: '15px',
      borderRadius: '8px',
      backgroundColor: `${colors.cardBlue}CC`,
      border: `1px solid ${colors.borderBlue}`,
      cursor: 'pointer',
      textAlign: 'center',
      color: colors.textWhite,
    },
  };

  // ============= RENDER APP =============
  return (
    <div style={appStyles.container}>
      <style>{`
        input::placeholder {
          color: #666;
        }
        input:focus {
          outline: none !important;
          border-color: #007bff !important;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${colors.bgNavy};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${colors.accentBlue};
          border-radius: 10px;
        }
      `}</style>

      <header style={appStyles.header}>
        <div style={appStyles.headerContent}>
          <div style={appStyles.headerLeft}>
            <h1 style={appStyles.title}>Flow</h1>
            <div style={appStyles.userGreeting}>Welcome, {userName}!</div>
          </div>
          <button style={appStyles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main style={appStyles.main}>
        {mode === 'home' && (
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '40px auto' }}>
            <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>Welcome to Flow</h1>
            <p style={{ fontSize: '16px', color: colors.lightGray, marginBottom: '40px' }}>
              Practice English with Smart Conversations
            </p>
            
            <div style={{ 
              backgroundColor: `${colors.cardBlue}CC`, 
              border: `2px solid ${colors.accentBlue}`, 
              borderRadius: '10px', 
              padding: '30px', 
              marginBottom: '40px' 
            }}>
              <h2 style={{ color: colors.textWhite, marginBottom: '20px' }}>🎯 Your Topic</h2>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Enter any topic..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && startCustomTopic()}
                  style={appStyles.input}
                  autoFocus
                />
                <button onClick={startCustomTopic} style={appStyles.button}>
                  Start 🚀
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '30px 0', color: colors.lightGray }}>
              ─── OR ───
            </div>

            <h3 style={{ color: colors.accentBlue, marginBottom: '20px' }}>📚 Popular Topics</h3>
            <div style={appStyles.topicsGrid}>
              {suggestedTopics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => selectPresetTopic(topic)}
                  style={appStyles.topicCard}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{topic.emoji}</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{topic.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'chat' && currentTopic && (
          <div style={appStyles.chatContainer}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: `${colors.cardBlue}CC`, 
              borderRadius: '8px', 
              border: `2px solid ${colors.accentBlue}` 
            }}>
              <p style={{ margin: 0 }}>
                <strong>{currentTopic.emoji} Discussing:</strong> {currentTopic.title}
              </p>
            </div>

            <div style={appStyles.messagesBox}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...appStyles.message,
                    ...(msg.type === 'user' ? appStyles.userMessage : {}),
                  }}
                >
                  <div
                    style={{
                      ...appStyles.messageBubble,
                      ...(msg.type === 'user' ? appStyles.userBubble : appStyles.aiBubble),
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {msg.text}
                    </p>
                    {msg.type === 'ai' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        style={{
                          backgroundColor: 'transparent',
                          color: colors.accentBlue,
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '5px 0',
                          marginTop: '8px',
                        }}
                      >
                        🔊 Hear it
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && <p style={{ textAlign: 'center', color: colors.lightGray }}>⏳ Thinking...</p>}
              <div ref={messagesEndRef} />
            </div>

            <div>
              <div style={appStyles.inputContainer}>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                  placeholder="Type your response..."
                  style={appStyles.input}
                  disabled={loading}
                />
                <button
                  onClick={startListening}
                  style={{
                    ...appStyles.button,
                    ...(isListening ? appStyles.listeningBtn : {}),
                  }}
                  disabled={loading}
                >
                  🎤
                </button>
                <button 
                  onClick={handleSendMessage} 
                  style={appStyles.button}
                  disabled={loading}
                >
                  ➡️
                </button>
              </div>
              <p style={appStyles.tip}>💡 Click the microphone to speak, or type and press Enter</p>
            </div>

            <div style={appStyles.sidebar}>
              <div style={appStyles.sidebarTitle}>📚 Vocabulary</div>
              {vocabulary.length === 0 ? (
                <p style={{ color: colors.lightGray, fontSize: '13px' }}>Words from your conversation will appear here</p>
              ) : (
                vocabulary.map((vocab, idx) => (
                  <div key={idx} style={{ backgroundColor: colors.cardBlue, padding: '10px', borderRadius: '6px', marginBottom: '10px', fontSize: '13px', border: `1px solid ${colors.borderBlue}` }}>
                    <div style={{ fontWeight: 'bold', color: colors.accentBlue }}>{vocab.word}</div>
                    <div style={{ color: colors.lightGray, fontSize: '12px' }}>{vocab.definition}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {mode === 'chat' && (
        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 40 }}>
          <button
            onClick={() => resetConversation()}
            style={{ ...appStyles.button, backgroundColor: colors.accentBlue }}
          >
            🏠 Home
          </button>
        </div>
      )}

      {isListening && (
        <div style={{ position: 'fixed', top: '100px', right: '30px', backgroundColor: '#FF4444', color: colors.textWhite, padding: '12px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 40 }}>
          🎤 Listening...
        </div>
      )}
    </div>
  );
};

// ============= LOGIN STYLES =============
const loginStyles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: 'radial-gradient(circle at center, #001a3d 0%, #000814 100%)',
    margin: 0,
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  headerLogo: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  logoText: {
    fontSize: '3.5rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-1px',
  },
  subLogo: {
    fontSize: '1rem',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  loginCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid #1e4f8a',
    borderRadius: '16px',
    padding: '50px 40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '30px',
    fontWeight: 600,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    marginBottom: '8px',
    color: '#b0c4de',
  },
  inputField: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #1e4f8a',
    background: 'rgba(0, 0, 0, 0.4)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  },
  startBtn: {
    width: '100%',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '16px',
    fontSize: '1.1rem',
    fontWeight: '700',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default FlowApp;