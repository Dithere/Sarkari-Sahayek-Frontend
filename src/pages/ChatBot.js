import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Globe, MessageSquare, ChevronDown, X, Bell, Upload, CheckCircle, Trash2, Copy, Reply, Share, ThumbsUp, Laugh, Lightbulb, MoreHorizontal } from "lucide-react";

// --- Theme Configuration ---
const themeMap = {
  indigo: { name: 'Indigo', primary_color: 'indigo', primary_bg: 'bg-indigo-600', primary_text: 'text-indigo-400', primary_ring: 'ring-indigo-500/50', primary_hover: 'hover:bg-indigo-500', primary_shadow: 'shadow-indigo-800/50' },
  emerald: { name: 'Emerald', primary_color: 'emerald', primary_bg: 'bg-emerald-600', primary_text: 'text-emerald-400', primary_ring: 'ring-emerald-500/50', primary_hover: 'hover:bg-emerald-500', primary_shadow: 'shadow-emerald-800/50' },
  rose: { name: 'Rose', primary_color: 'rose', primary_bg: 'bg-rose-600', primary_text: 'text-rose-400', primary_ring: 'ring-rose-500/50', primary_hover: 'hover:bg-rose-500', primary_shadow: 'shadow-rose-800/50' },
};
const defaultTheme = 'indigo';

// ---------------------------
// FAQ Card Component
// ---------------------------
const FAQCard = ({ question, summary, onClick, themeColors }) => (
  <button
    onClick={onClick}
    className={`p-6 bg-gray-800/80 border border-gray-700/50 rounded-2xl shadow-xl hover:${themeColors.primary_shadow} transition-all duration-500 backdrop-blur-md cursor-pointer h-full text-left hover:bg-gray-700/60 transform hover:-translate-y-1`}
  >
    <h4 className={`text-lg font-bold mb-2 ${themeColors.primary_text}`}>{question}</h4>
    <p className="text-sm text-gray-400">{summary}</p>
  </button>
);

// ---------------------------
// Animated Typing Indicator
// ---------------------------
const TypingIndicator = ({ themeColors }) => (
  <div className="flex space-x-1 items-center p-3 bg-gray-700 text-gray-400 rounded-t-xl rounded-br-xl shadow-lg transition-all duration-300">
    <div className={`w-2 h-2 bg-${themeColors.primary_color}-400 rounded-full animate-bounce`} style={{ animationDuration: '1.2s', animationDelay: '0s' }} />
    <div className={`w-2 h-2 bg-${themeColors.primary_color}-400 rounded-full animate-bounce`} style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
    <div className={`w-2 h-2 bg-${themeColors.primary_color}-400 rounded-full animate-bounce`} style={{ animationDuration: '1.2s', animationDelay: '0.4s' }} />
  </div>
);

// ---------------------------
// Parse AI structured response
// ---------------------------
const parseAIContent = (data) => {
  if (!data) return null;
  const content = [];

  // Existing parsing logic remains the same for content structure

  if (data.answer)
    content.push(<p key="answer" className="text-sm break-words my-1">{data.answer}</p>);

  if (data.steps?.length)
    content.push(
      <ol key="steps" className="ml-4 list-decimal text-sm my-1 space-y-1">
        {data.steps.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
    );

  if (data.tables?.length)
    data.tables.forEach((table, idx) => {
      content.push(
        <div key={`table-${idx}`} className="my-3 overflow-x-auto rounded-lg border border-gray-600">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-600">
              <tr>{table.headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r} className="even:bg-gray-700/50 hover:bg-gray-600/70">
                  {row.map((cell, c) => <td key={c} className="border-t border-gray-600 px-3 py-2 align-top">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      );
    });

  if (data.links?.length)
    data.links.forEach((link, idx) => {
      const url = link.url;
      let thumbnail = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
      content.push(
        <div key={`link-${idx}`} className="my-2 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/70 transition duration-300">
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-indigo-400 hover:text-indigo-300">
            <img src={thumbnail} alt="thumbnail" className="w-10 h-10 rounded-lg object-cover border border-gray-600" onError={(e) => e.target.src = 'https://placehold.co/40x40/374151/FFFFFF?text=Link'} />
            <span className="truncate flex-1">{link.label}</span>
          </a>
        </div>
      );
    });

  if (data.schemes?.length) {
    content.push(
      <div key="schemes" className="my-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.schemes.map((s, i) => (
          <div key={i} className={`bg-indigo-900/40 p-4 rounded-xl shadow-lg border border-indigo-700/50 hover:bg-indigo-800/50 transition duration-300`}>
            <h3 className="font-extrabold text-lg text-indigo-200 mb-1">{s.name}</h3>
            <p className="text-gray-200 text-sm my-1">{s.description}</p>
            {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-100 hover:underline text-sm font-medium flex items-center mt-2">
                <Globe className="w-4 h-4 mr-1"/> Official Link
              </a>}
          </div>
        ))}
      </div>
    );
  }

  return content;
};

// ---------------------------
// Notification Dropdown
// ---------------------------
const Notifications = ({ onSelectNotification, themeColors }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      // NOTE: This endpoint is mock, as the server API is external to this environment
      const res = await fetch("https://sarkari-sahayek-1.onrender.com/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
      else if (data?.notifications && Array.isArray(data.notifications)) setNotifications(data.notifications);
      else setNotifications([]);
    } catch (err) {
      // Mock data on failure
      setNotifications([
         { id: 1, title: "New Scheme Alert: Digital India", time: "2h ago", question: "What is the new Digital India scheme?" },
         { id: 2, title: "Tax Deadline Approaching", time: "1d ago", question: "When is the next tax deadline?" },
         { id: 3, title: "Your passport renewal status is pending", time: "3d ago", question: "Check passport renewal status." },
      ]);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`relative p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 transition duration-300 shadow-xl ring-2 ${themeColors.primary_ring}`} title="Notifications">
        <Bell className={`w-6 h-6 ${themeColors.primary_text}`} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 min-w-[20px] h-5 flex items-center justify-center font-bold border-2 border-gray-800 animate-ping-once">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 max-h-96 overflow-y-auto transform origin-top-right transition-all duration-300 scale-100 animate-fade-in">
          <div className="p-3 flex justify-between items-center border-b border-gray-700">
            <span className="font-semibold text-gray-100 text-lg">Notifications</span>
            <X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition" onClick={() => setIsOpen(false)} />
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-400 text-sm">No new notifications.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="p-3 border-b border-gray-700 hover:bg-gray-700/50 transition duration-150 flex justify-between items-center">
                <div>
                  <p className="text-gray-100 font-medium leading-tight">{notif.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{notif.time}</p>
                </div>
                <button
                  onClick={() => { onSelectNotification(notif.question); setIsOpen(false); }}
                  className={`${themeColors.primary_bg} text-white px-3 py-1 rounded-lg ${themeColors.primary_hover} text-sm font-medium shadow-md transition duration-300`}
                >
                  View
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------
// Eligibility Form Modal
// ---------------------------
const EligibilityFormModal = ({ isOpen, onClose, onSubmit, themeColors }) => {
  const [state, setState] = useState("");
  const [caste, setCaste] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!state || !caste || !gender || !occupation) {
        setError("Please fill all fields to check your eligibility.");
        return; 
    }
    setError(null);
    onSubmit({ state, caste, gender, occupation });
    setState(""); setCaste(""); setGender(""); setOccupation("");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className={`bg-gray-800 p-8 rounded-xl w-full max-w-sm shadow-2xl transform scale-100 transition-all duration-300 animate-slide-up border border-${themeColors.primary_color}-500/50`}>
        <h2 className={`text-2xl font-extrabold ${themeColors.primary_text} mb-6 border-b border-gray-700 pb-2`}>Check Scheme Eligibility</h2>
        
        {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 text-sm font-medium flex items-center"><X className="w-4 h-4 mr-2"/> {error}</div>}

        <input type="text" placeholder="State/Union Territory" value={state} onChange={(e) => setState(e.target.value)} className={`w-full p-3 mb-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-${themeColors.primary_color}-500 transition duration-200`}/>
        <input type="text" placeholder="Caste/Category (e.g., OBC, SC, General)" value={caste} onChange={(e) => setCaste(e.target.value)} className={`w-full p-3 mb-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-${themeColors.primary_color}-500 transition duration-200`}/>
        <input type="text" placeholder="Gender" value={gender} onChange={(e) => setGender(e.target.value)} className={`w-full p-3 mb-3 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-${themeColors.primary_color}-500 transition duration-200`}/>
        <input type="text" placeholder="Occupation/Income Bracket" value={occupation} onChange={(e) => setOccupation(e.target.value)} className={`w-full p-3 mb-6 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-${themeColors.primary_color}-500 transition duration-200`}/>
        
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-medium transition duration-300 shadow-md">Cancel</button>
          <button onClick={handleSubmit} className={`px-5 py-2 rounded-lg ${themeColors.primary_bg} ${themeColors.primary_hover} text-white font-medium transition duration-300 shadow-lg flex items-center space-x-1 hover:${themeColors.primary_shadow}`}>
            <CheckCircle className="w-5 h-5"/> <span>Check Eligibility</span>
          </button>
        </div>
      </div>
    </div>
  );
};


// ---------------------------
// Message Bubble Component (Enhanced)
// ---------------------------
const MessageBubble = ({ message, themeColors, handleReact, handleMessageAction }) => {
    const isUser = message.sender === "user";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const menuRef = useRef(null);

    // Dynamic bubble styles
    const bubbleClasses = isUser
        ? `${themeColors.primary_bg} text-white rounded-t-xl rounded-bl-xl ml-auto shadow-xl ${themeColors.primary_shadow}`
        : "bg-gray-700 text-gray-100 rounded-t-xl rounded-br-xl mr-auto shadow-xl shadow-gray-900/50";

    // Auto-close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
                setIsEmojiPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle copy
    const handleCopy = () => {
        const textToCopy = typeof message.text === "string" ? message.text : "AI response content";
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(textToCopy).catch(() => document.execCommand("copy"));
        } else {
            document.execCommand("copy");
        }
        setIsMenuOpen(false);
    };

    // Handle open direction
    useEffect(() => {
        if (isMenuOpen && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpwards(spaceBelow < 180); // if not enough room, open upwards
        }
    }, [isMenuOpen]);

    const emojis = ["👍", "😂", "💡", "🤔", "❤️"];

    const ReactionPill = ({ emoji, count }) => (
        <span
            onClick={() => handleReact(message.id, emoji)}
            className={`cursor-pointer text-xs flex items-center bg-gray-800 border border-${themeColors.primary_color}-700/50 rounded-full px-2 py-0.5 hover:bg-gray-600 transition duration-150 shadow-md`}
        >
            {emoji} {count}
        </span>
    );

    const EmojiPicker = () => (
        <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl flex space-x-2">
            {emojis.map((emoji) => (
                <button
                    key={emoji}
                    className="p-1 text-lg rounded-full hover:bg-gray-700 transition"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleReact(message.id, emoji);
                        setIsEmojiPickerOpen(false);
                        setIsMenuOpen(false);
                    }}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );

    return (
        <div
            className={`group flex ${isUser ? "justify-end" : "justify-start"} mb-6 transition-opacity duration-500 ease-out animate-fade-in`}
        >
            <div
                className="relative max-w-[80%] sm:max-w-[60%] overflow-visible"
                ref={menuRef}
            >
                {/* Bubble */}
                <div
                    className={`relative p-4 ${bubbleClasses} break-words transform transition-transform duration-300 overflow-visible`}
                >
                    {/* Message Text */}
                    {typeof message.text === "string" ? (
                        <p className="break-words">{message.text}</p>
                    ) : (
                        message.text
                    )}

                    {/* Action Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen((p) => !p);
                        }}
                        className={`absolute top-2 ${isUser ? "right-2" : "left-2"} 
                            opacity-0 group-hover:opacity-100 p-1 rounded-full 
                            bg-gray-700/70 hover:bg-gray-600 text-gray-300 hover:text-white 
                            transition duration-200 z-20`}
                        title="Message Actions"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div
                            className={`flex ${isUser ? "justify-end" : "justify-start"} mt-2 pt-2 border-t border-gray-600 space-x-2`}
                        >
                            {message.reactions.map((r) => (
                                <ReactionPill key={r.emoji} emoji={r.emoji} count={r.count} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
  <div
    className={`absolute z-50 w-44 rounded-xl shadow-2xl bg-gray-800 border border-gray-700 transition-all duration-200`}
    style={{
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)", // center on the message bubble
    }}
  >
    <button
      onClick={() => handleMessageAction(message.id, "reply")}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded-t-xl hover:bg-gray-700/50 transition duration-150"
    >
      <Reply className="w-4 h-4 mr-2" /> Reply
    </button>
    <button
      onClick={handleCopy}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition duration-150"
    >
      <Copy className="w-4 h-4 mr-2" /> Copy
    </button>
    <button
      onClick={() => handleMessageAction(message.id, "share")}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition duration-150"
    >
      <Share className="w-4 h-4 mr-2" /> Share
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        setIsEmojiPickerOpen((p) => !p);
      }}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition duration-150"
    >
      <ThumbsUp className="w-4 h-4 mr-2" /> React...
    </button>
    <button
      onClick={() => handleMessageAction(message.id, "delete")}
      className="flex items-center w-full px-4 py-2 text-sm text-red-400 rounded-b-xl hover:bg-red-900/50 transition duration-150 border-t border-gray-700"
    >
      <Trash2 className="w-4 h-4 mr-2" /> Delete
    </button>
  </div>
)}

            </div>
        </div>
    );
};


// ---------------------------
// Main ChatBot (as the App)
// ---------------------------
export default function App() {
  const initialFAQs = [
    { id: 1, question: "What is Pradhan Mantri Awas Yojana?", summary: "Learn about the affordable housing scheme by the Government of India." },
    { id: 2, question: "How can I apply for a voter ID?", summary: "Step-by-step process for voter ID registration in India." },
    { id: 3, question: "Tell me about income tax filing.", summary: "A simplified explanation of how to file your income tax return." },
  ];

  const languages = ["English", "Hindi", "Marathi", "Tamil", "Bengali", "Gujarati"];
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInitialState, setIsInitialState] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isVoiceReply, setIsVoiceReply] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const themeColors = themeMap[currentTheme];

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null); 

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Video background setup
  useEffect(() => {
    const videoSrc = "https://videos.pexels.com/video-files/3141210/3141210-uhd_3840_2160_25fps.mp4";
    if (videoRef.current) {
        videoRef.current.src = videoSrc;
        videoRef.current.load();
        videoRef.current.play().catch(error => {
          // console.warn("Video autoplay was prevented:", error);
        });
    }
  }, []); 

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        // console.warn("Speech Recognition not supported by this browser.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = {
      English: "en-US", Hindi: "hi-IN", Marathi: "mr-IN", Tamil: "ta-IN", Bengali: "bn-IN", Gujarati: "gu-IN"
    }[selectedLanguage] || "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => handleSendMessage(event.results[0][0].transcript);
    recognition.onerror = (event) => {
        // console.error("Speech recognition error:", event.error);
        setIsRecording(false);
    }
    recognitionRef.current = recognition;
  }, [selectedLanguage]);

  // Text-to-speech helpers
  const extractTextFromJSX = (jsx) => {
    if (typeof jsx === "string") return jsx;
    if (React.isValidElement(jsx)) {
        const children = React.Children.toArray(jsx.props.children);
        return children.map(extractTextFromJSX).join(" ");
    }
    if (Array.isArray(jsx)) return jsx.map(extractTextFromJSX).join(" ");
    return "";
  };
  const speakText = (text) => {
    if (!window.speechSynthesis || !text) return;
    const langMap = {
      English: "en-IN", Hindi: "hi-IN", Marathi: "mr-IN", Tamil: "ta-IN", Bengali: "bn-IN", Gujarati: "gu-IN"
    };
    const lang = langMap[selectedLanguage] || "en-IN";
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(typeof text === "string" ? text : extractTextFromJSX(text));
    utterance.lang = lang;
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === lang || v.lang.startsWith(lang.split('-')[0]));
    if (matchedVoice) utterance.voice = matchedVoice;
    window.speechSynthesis.speak(utterance);
  };

  // ---------------------------
  // Send message handler
  const handleSendMessage = async (text = inputMessage) => {
    if (!text.trim() || isLoading) return;
    const userMessage = { id: Date.now(), text, sender: "user", reactions: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage(""); setIsInitialState(false); setIsLoading(true);

    try {
      // NOTE: This endpoint is mock, as the server API is external to this environment
      const response = await fetch("https://sarkari-sahayek-1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: selectedLanguage, session_id: sessionId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const aiMessageContent = parseAIContent(data);
      const aiMessage = { id: Date.now() + 1, text: aiMessageContent, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, aiMessage]);
      if (isVoiceReply) speakText(aiMessageContent);
    } catch (error) {
      // console.error(error);
      const errorMessage = { id: Date.now() + 2, text: <p className="text-red-400">⚠️ Server error. Check connection. The mock API is unavailable.</p>, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, errorMessage]);
    } finally { setIsLoading(false); }
  };

  // ---------------------------
  // Handle message reactions
  const handleReact = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
            const currentReactions = msg.reactions || [];
            const existingReactionIndex = currentReactions.findIndex(r => r.emoji === emoji);

            if (existingReactionIndex > -1) {
                // If the reaction exists, remove it (simple toggle for single user)
                return { ...msg, reactions: currentReactions.filter((_, i) => i !== existingReactionIndex) };
            } else {
                // Add the reaction
                return { ...msg, reactions: [...currentReactions, { emoji, count: 1 }] };
            }
        }
        return msg;
    }));
  }

  // ---------------------------
  // Handle message actions (Reply, Copy, Delete)
  const handleMessageAction = (messageId, action) => {
    const messageToActOn = messages.find(m => m.id === messageId);
    if (!messageToActOn) return;

    switch (action) {
        case 'reply':
            // Pre-populate input with a reply indicator
            const sender = messageToActOn.sender === 'user' ? 'You' : 'Sahayak';
            const textPreview = typeof messageToActOn.text === 'string' ? messageToActOn.text.substring(0, 30) + '...' : '[AI Response]';
            setInputMessage(`> Replying to ${sender}: "${textPreview}"\n`);
            break;
        case 'delete':
            setMessages(prev => prev.filter(m => m.id !== messageId));
            if (messages.length - 1 === 0) setIsInitialState(true);
            break;
        case 'share':
            // Mock share functionality (e.g., alert the content to be shared)
            const shareText = typeof messageToActOn.text === 'string' ? messageToActOn.text : "AI response content";
            console.log("SHARE action triggered for message:", shareText);
            // In a real app, this would use the Web Share API or copy to clipboard
            break;
        default:
            break;
    }
  }

  // ---------------------------
  // Handle eligibility submission
  const handleEligibilitySubmit = async (data) => {
    const userMessage = { id: Date.now(), text: `Checking eligibility for: ${data.occupation} in ${data.state}, Caste: ${data.caste}, Gender: ${data.gender}...`, sender: "user", reactions: [] };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsInitialState(false);

    try {
      // NOTE: This endpoint is mock, as the server API is external to this environment
      const response = await fetch("https://sarkari-sahayek-1.onrender.com/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const resData = await response.json();
      const aiMessageContent = parseAIContent(resData);
      const aiMessage = { id: Date.now() + 1, text: aiMessageContent, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, aiMessage]);
      if (isVoiceReply) speakText(aiMessageContent);
    } catch (err) {
      // console.error(err);
      const errorMessage = { id: Date.now() + 2, text: <p className="text-red-400">⚠️ Eligibility check failed. The mock API is unavailable.</p>, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, errorMessage]);
    } finally { setIsLoading(false); }
  };

  // ---------------------------
  // Handle document upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    const userMessage = { id: Date.now(), text: <img src={objectURL} alt="Uploaded Document" className="max-h-60 rounded-lg border border-gray-600 shadow-xl transition-all duration-500 hover:shadow-indigo-500/50" />, sender: "user", reactions: [] };
    setMessages((prev) => [...prev, userMessage]);
    setIsInitialState(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", selectedLanguage);

    setIsLoading(true);
    try {
      // NOTE: This endpoint is mock, as the server API is external to this environment
      const res = await fetch("https://sarkari-sahayek-1.onrender.com/api/upload_document", { method: "POST", body: formData });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const aiMessageContent = parseAIContent(data);
      const aiMessage = { id: Date.now() + 10, text: aiMessageContent, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      // console.error(err);
      const errorMessage = { id: Date.now() + 11, text: <p className="text-red-400">⚠️ Upload failed. The mock API is unavailable.</p>, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, errorMessage]);
    } finally { setIsLoading(false); }
  };

  const handleFAQClick = (faq) => handleSendMessage(faq.question);
  const handleVoiceMessage = () => {
    if (recognitionRef.current) {
        if (isRecording) {
          recognitionRef.current.stop();
        } else {
          recognitionRef.current.start();
        }
    }
  }
  const handleLanguageSelect = (lang) => { setSelectedLanguage(lang); setIsMenuOpen(false); };
  
  const handleClearChat = () => {
    setMessages([]);
    setIsInitialState(true);
  }

  const renderInitialState = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <MessageSquare className={`w-16 h-16 ${themeColors.primary_text} mb-6 drop-shadow-lg`} />
      <h1 className="text-4xl font-extrabold text-gray-100 mb-3 drop-shadow-xl">Namaste! How can I assist you today?</h1>
      <p className="text-lg text-gray-400 mb-10">I am Sarkari Sahayak, your AI guide to government schemes and civic duties.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {initialFAQs.map((faq) => (
          <FAQCard key={faq.id} question={faq.question} summary={faq.summary} onClick={() => handleFAQClick(faq)} themeColors={themeColors} />
        ))}
      </div>
    </div>
  );

  const renderChatHistory = () => (
    <div className="h-full overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => <MessageBubble key={msg.id} message={msg} themeColors={themeColors} handleReact={handleReact} handleMessageAction={handleMessageAction} />)}
      {isLoading && <div className="flex justify-start mb-4"><TypingIndicator themeColors={themeColors} /></div>}
      <div ref={messagesEndRef} />
    </div>
  );

  const ThemeSelector = () => (
    <div className="relative">
      <button onClick={() => setIsMenuOpen(p => p === 'theme' ? false : 'theme')} className={`flex items-center space-x-2 p-2 rounded-xl bg-gray-700/70 text-gray-100 ${themeColors.primary_hover} transition duration-300 shadow-lg`} title="Change Theme">
        <span className={`text-sm font-semibold hidden sm:inline ${themeColors.primary_text}`}>{themeColors.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen === 'theme' ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isMenuOpen === 'theme' && (
        <div className={`absolute right-0 mt-3 w-40 rounded-xl shadow-2xl bg-gray-800 border border-${themeColors.primary_color}-500/50 z-20 transform origin-top-right transition-all duration-300 animate-fade-in`}>
          {Object.keys(themeMap).map((key) => {
            const theme = themeMap[key];
            return (
              <button 
                key={key} 
                onClick={() => { setCurrentTheme(key); setIsMenuOpen(false); }} 
                className={`w-full text-left px-4 py-2 text-sm transition duration-150 flex items-center ${currentTheme === key ? `${theme.primary_text} font-extrabold bg-gray-700` : "text-gray-300 hover:bg-gray-700/50"}`}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${theme.primary_bg} border border-gray-400`}></div>
                {theme.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
  
  const LanguageSelector = () => (
    <div className="relative">
      <button onClick={() => setIsMenuOpen(p => p === 'lang' ? false : 'lang')} className={`flex items-center space-x-2 p-2 rounded-xl ${themeColors.primary_bg} text-gray-100 ${themeColors.primary_hover} transition duration-300 shadow-lg`}>
        <Globe className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:inline">{selectedLanguage}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen === 'lang' ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      {isMenuOpen === 'lang' && (
        <div className={`absolute right-0 mt-3 w-48 rounded-xl shadow-2xl bg-gray-800 border border-${themeColors.primary_color}-500/50 z-20 max-h-60 overflow-y-auto transform origin-top-right transition-all duration-300 animate-fade-in`}>
          {languages.map((lang) => (
            <button key={lang} onClick={() => handleLanguageSelect(lang)} className={`w-full text-left px-4 py-2 text-sm transition duration-150 ${selectedLanguage === lang ? `${themeColors.primary_text} font-extrabold bg-gray-700` : "text-gray-300 hover:bg-gray-700/50"}`}>
                {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    // Custom styles for animations and mic pulse since Tailwind configuration isn't available
    <style>
      {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes pulse-mic-custom {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); } /* Tailwind red-600 */
          70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
        }
        .animate-mic-pulse {
          animation: pulse-mic-custom 1.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        .animate-bounce {
          animation-name: bounce;
          animation-duration: 1s;
          animation-iteration-count: infinite;
        }
      `}
    </style>,
    <div className="relative min-h-screen overflow-hidden text-gray-100 font-sans">
        {/* 🌌 Video Background */}
        <video
          ref={videoRef}
          src="https://videos.pexels.com/video-files/3141210/3141210-uhd_3840_2160_25fps.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60 z-[-2]"
        >
          <source src="https://videos.pexels.com/video-files/3141210/3141210-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay for "blury dim way" */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/90 z-[-1] backdrop-blur-sm"></div>

        {/* Chatbot content */}
        <div className="relative z-10 flex flex-col h-screen bg-transparent">
            {/* RESPONSIVE HEADER: Flex-col on mobile, row on md+ */}
            <header className={`flex flex-col md:flex-row justify-between items-center p-3 md:p-4 bg-gray-900/80 backdrop-blur-lg shadow-2xl sticky top-0 z-10 border-b border-${themeColors.primary_color}-500/30 gap-3 md:gap-0`}>
                <h1 className={`text-2xl md:text-3xl font-extrabold ${themeColors.primary_text} flex items-center drop-shadow-md`}>
                <MessageSquare className="w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3" /> Sarkari Sahayak
                </h1>

                {/* Header Actions: Scaled spacing for mobile */}
                <div className="flex flex-wrap justify-center items-center gap-2 md:space-x-3">
                
                <Notifications onSelectNotification={(question) => handleSendMessage(question)} themeColors={themeColors} />

                <button 
                    onClick={handleClearChat} 
                    className="relative p-2 rounded-full bg-gray-700/50 hover:bg-red-700 transition duration-300 shadow-xl ring-2 ring-gray-500/50" 
                    title="Clear Chat"
                >
                    <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                </button>

                <button onClick={() => setShowEligibilityModal(true)} className={`relative p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 transition duration-300 shadow-xl ring-2 ${themeColors.primary_ring}`} title="Check Eligibility">
                    <CheckCircle className={`w-5 h-5 md:w-6 md:h-6 ${themeColors.primary_text}`} />
                </button>

                <ThemeSelector />
                <LanguageSelector />
                
                </div>
            </header>

            <EligibilityFormModal
                isOpen={showEligibilityModal}
                onClose={() => setShowEligibilityModal(false)}
                onSubmit={handleEligibilitySubmit}
                themeColors={themeColors}
            />

            <main className="flex-1 overflow-y-auto bg-transparent">
                {isInitialState && messages.length === 0 ? renderInitialState() : renderChatHistory()}
            </main>

            {/* RESPONSIVE FOOTER: Adjusted padding and flex behavior */}
            <footer className={`sticky bottom-0 w-full p-2 md:p-4 bg-gray-900/80 backdrop-blur-lg shadow-inner shadow-gray-900/50 border-t border-${themeColors.primary_color}-500/30`}>
                <div className="flex items-end max-w-4xl mx-auto space-x-2 md:space-x-3">
                <button 
                    onClick={handleVoiceMessage} 
                    className={`p-2 md:p-3 rounded-full ${isRecording ? "bg-red-600 text-white animate-mic-pulse" : `bg-gray-700 ${themeColors.primary_text}`} ${themeColors.primary_hover} hover:text-white transition-colors duration-300 shadow-xl flex-shrink-0 border-2 border-transparent hover:border-${themeColors.primary_color}-500`} 
                    title={isRecording ? "Stop Recording" : "Record Voice"}
                >
                    <Mic className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <button
                    onClick={() => setIsVoiceReply(!isVoiceReply)}
                    className={`p-2 md:p-3 rounded-full ${isVoiceReply ? `${themeColors.primary_bg} text-white ${themeColors.primary_shadow}` : "bg-gray-700 text-gray-400"} ${themeColors.primary_hover} transition-colors duration-300 shadow-xl flex-shrink-0 border-2 border-transparent hover:border-${themeColors.primary_color}-500`}
                    title="Toggle Voice Reply"
                >
                    <span className="text-lg md:text-xl leading-none">🎙️</span>
                </button>

                <label className={`p-2 md:p-3 bg-gray-700 rounded-full ${themeColors.primary_hover} transition-colors duration-300 shadow-xl cursor-pointer flex-shrink-0 border-2 border-transparent hover:border-${themeColors.primary_color}-500`} title="Upload Document">
                    <Upload className={`w-5 h-5 md:w-6 md:h-6 ${themeColors.primary_text}`} />
                    <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleImageUpload} />
                </label>

                <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    rows={1}
                    placeholder={`Ask in ${selectedLanguage}...`}
                    className={`flex-1 p-3 md:p-4 border border-gray-600 rounded-2xl resize-none focus:ring-4 focus:ring-${themeColors.primary_color}-500/50 focus:border-${themeColors.primary_color}-500 bg-gray-700/70 text-gray-100 placeholder-gray-400 transition-all overflow-hidden max-h-40 text-sm md:text-base`}
                />
                
                <button 
                    onClick={() => handleSendMessage()} 
                    disabled={inputMessage.trim() === "" || isLoading} 
                    className={`p-2 md:p-3 rounded-full ${themeColors.primary_bg} text-white ${themeColors.primary_hover} disabled:bg-gray-800 disabled:opacity-50 transition-colors duration-300 shadow-xl flex-shrink-0`}
                    title="Send Message"
                >
                    <Send className="w-5 h-5 md:w-6 md:h-6" />
                </button>
                </div>
                <p className="hidden md:block text-xs text-center text-gray-500 mt-2">Press Enter to send • Shift + Enter for new line</p>
            </footer>
        </div>
    </div>
  );
};
