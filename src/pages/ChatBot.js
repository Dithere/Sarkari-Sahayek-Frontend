import React, { useState, useRef, useEffect, useCallback } from "react";
// Added Volume2 and VolumeX for the TTS toggle
import { Send, Mic, Globe, MessageSquare, ChevronDown, X, Bell, Upload, CheckCircle, Trash2, Copy, Reply, Share, ThumbsUp, Laugh, Lightbulb, MoreHorizontal, FileText, Loader2, Bot, Volume2, VolumeX } from "lucide-react";

// --- API Configuration and Utilities ---
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const API_KEY = ""; // Placeholder, will be provided by Canvas runtime

/**
 * Utility function for exponential backoff retry logic.
 * @param {Function} fn - The async function to execute.
 * @param {number} maxRetries - Maximum number of retries.
 * @returns {Promise<any>} The result of the function.
 */
const withExponentialBackoff = async (fn, maxRetries = 5) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Converts a File object to a Base64 encoded string.
 * @param {File} file - The file to convert.
 * @returns {Promise<{base64: string, mimeType: string}>}
 */
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve({ base64: base64String, mimeType: file.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// --- Theme Configuration ---
// Defines available themes and their Tailwind CSS classes
const themeMap = {
  indigo: { name: 'Indigo', primary_color: 'indigo', primary_bg: 'bg-indigo-600', primary_text: 'text-indigo-400', primary_ring: 'ring-indigo-500/50', primary_hover: 'hover:bg-indigo-500', primary_shadow: 'shadow-indigo-800/50' },
  emerald: { name: 'Emerald', primary_color: 'emerald', primary_bg: 'bg-emerald-600', primary_text: 'text-emerald-400', primary_ring: 'ring-emerald-500/50', primary_hover: 'hover:bg-emerald-500', primary_shadow: 'shadow-emerald-800/50' },
  rose: { name: 'Rose', primary_color: 'rose', primary_bg: 'bg-rose-600', primary_text: 'text-rose-400', primary_ring: 'ring-rose-500/50', primary_hover: 'hover:bg-rose-500', primary_shadow: 'shadow-rose-800/50' },
};
const defaultTheme = 'indigo';

// ---------------------------
// FAQ Card Component: Used for quick starting questions
// ---------------------------
const FAQCard = ({ question, summary, onClick, themeColors }) => (
  <button
    onClick={onClick}
    className={`w-full p-5 md:p-6 bg-gray-800/60 border border-gray-700/50 rounded-2xl shadow-lg hover:${themeColors.primary_shadow} transition-all duration-300 backdrop-blur-md cursor-pointer text-left hover:bg-gray-700/80 transform hover:-translate-y-1 active:scale-[0.98]`}
  >
    <h4 className={`text-base md:text-lg font-bold mb-2 ${themeColors.primary_text}`}>{question}</h4>
    <p className="text-xs md:text-sm text-gray-300 leading-relaxed">{summary}</p>
  </button>
);

// ---------------------------
// Animated Typing Indicator
// ---------------------------
const TypingIndicator = ({ themeColors }) => (
  <div className="flex space-x-1.5 items-center p-4 bg-gray-800/80 text-gray-400 rounded-t-2xl rounded-br-2xl shadow-lg w-fit backdrop-blur-sm border border-gray-700/30">
    <div className={`w-2 h-2 md:w-2.5 md:h-2.5 bg-${themeColors.primary_color}-400 rounded-full animate-bounce`} style={{ animationDuration: '1s', animationDelay: '0s' }} />
    <div className={`w-2 h-2 md:w-2.5 md:h-2.5 bg-${themeColors.primary_color}-400 rounded-full animate-bounce`} style={{ animationDuration: '1s', animationDelay: '0.2s' }} />
    <div class={`w-2 h-2 md:w-2.5 md:h-2.5 bg-${themeColors.primary_color}-400 rounded-full animate-bounce`} style={{ animationDuration: '1s', animationDelay: '0.4s' }} />
  </div>
);

// ---------------------------
// Parse AI structured response into React elements
// Handles text, ordered lists, tables, links, and specific schemes objects
// ---------------------------
const parseAIContent = (data) => {
  if (!data) return null;
  const content = [];

  // If data is a string (e.g., error message or direct text response from image analysis)
  if (typeof data === 'string') {
      // Simple text response formatting for image analysis result
      return <p key="text-response" className="text-sm md:text-base break-words my-2 leading-relaxed whitespace-pre-wrap">{data}</p>;
  }

  // 1. Main Answer Text
  if (data.answer)
    content.push(<p key="answer" className="text-sm md:text-base break-words my-2 leading-relaxed">{data.answer}</p>);

  // 2. Steps/Ordered List
  if (data.steps?.length)
    content.push(
      <ol key="steps" className="ml-5 list-decimal text-sm md:text-base my-2 space-y-1.5 text-gray-200">
        {data.steps.map((step, i) => <li key={i} className="pl-1">{step}</li>)}
      </ol>
    );

  // 3. Tables
  if (data.tables?.length)
    data.tables.forEach((table, idx) => {
      content.push(
        <div key={`table-${idx}`} className="my-4 overflow-x-auto rounded-xl border border-gray-600 shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-700/80">
              <tr>{table.headers.map((h, i) => <th key={i} className="px-4 py-3 text-left font-semibold text-gray-100 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r} className="even:bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                  {row.map((cell, c) => <td key={c} className="border-t border-gray-600/50 px-4 py-3 align-top text-gray-300">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });

  // 4. External Links
  if (data.links?.length)
    data.links.forEach((link, idx) => {
      const url = link.url;
      // Generate a favicon/thumbnail for visual appeal
      let thumbnail = `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`;
      const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      if (ytMatch) thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`;
      content.push(
        <div key={`link-${idx}`} className="my-2 p-2.5 bg-gray-800/60 rounded-xl hover:bg-gray-700/80 transition duration-300 border border-gray-700/50">
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-indigo-400 hover:text-indigo-300">
            <img 
                src={thumbnail} 
                alt="thumbnail" 
                className="w-10 h-10 rounded-lg object-cover border border-gray-600" 
                onError={(e) => e.target.src = 'https://placehold.co/40x40/374151/FFFFFF?text=Link'} 
            />
            <span className="truncate flex-1 font-medium text-sm">{link.label}</span>
          </a>
        </div>
      );
    });

  // 5. Government Schemes
  if (data.schemes?.length) {
    content.push(
      <div key="schemes" className="my-4 grid grid-cols-1 gap-3">
        {data.schemes.map((s, i) => (
          <div key={i} className={`bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30 hover:bg-indigo-900/50 transition duration-300`}>
            <h3 className="font-bold text-base text-indigo-300 mb-1">{s.name}</h3>
            <p className="text-gray-300 text-sm my-1 leading-snug">{s.description}</p>
            {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-200 text-xs font-medium flex items-center mt-2 uppercase tracking-wide">
                <Globe className="w-3 h-3 mr-1"/> Check Details
              </a>}
          </div>
        ))}
      </div>
    );
  }

  return content;
};

// ---------------------------
// Notification Dropdown Component
// Fetches mock notifications from a remote source or uses a local fallback
// ---------------------------
const Notifications = ({ onSelectNotification, themeColors }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock API call for notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("https://sarkari-sahayek-1.onrender.com/api/notifications");
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data);
      else if (data?.notifications && Array.isArray(data.notifications)) setNotifications(data.notifications);
      else setNotifications([]);
    } catch (err) {
      // Fallback notifications if API fails
      setNotifications([
         { id: 1, title: "New Scheme Alert: Digital India", time: "2h ago", question: "What is the new Digital India scheme?" },
         { id: 2, title: "Tax Deadline Approaching", time: "1d ago", question: "When is the next tax deadline?" },
         { id: 3, title: "Passport renewal status update", time: "3d ago", question: "Check passport renewal status." },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className={`relative p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 transition duration-300 shadow-lg border border-gray-700`} title="Notifications">
        <Bell className={`w-5 h-5 md:w-6 md:h-6 ${themeColors.primary_text}`} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold border-2 border-gray-900 animate-pulse">{notifications.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 md:w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto transform origin-top-right transition-all duration-300 animate-fade-in ring-1 ring-white/10">
          <div className="p-4 flex justify-between items-center border-b border-gray-800 sticky top-0 bg-gray-900/95 backdrop-blur-xl z-10">
            <span className="font-bold text-gray-100 text-base">Notifications</span>
            <X className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white transition" onClick={() => setIsOpen(false)} />
          </div>
          {notifications.length === 0 ? (
            <p className="p-6 text-gray-400 text-sm text-center">No new notifications.</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition duration-150 flex justify-between items-start gap-3">
                <div>
                  <p className="text-gray-200 font-medium text-sm leading-snug">{notif.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{notif.time}</p>
                </div>
                <button
                  onClick={() => { onSelectNotification(notif.question); setIsOpen(false); }}
                  className={`${themeColors.primary_bg} text-white px-3 py-1.5 rounded-lg ${themeColors.primary_hover} text-xs font-medium shadow-md whitespace-nowrap`}
                >
                  Ask AI
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
// Collects user data to check for relevant schemes (mocked for this app)
// ---------------------------
const EligibilityFormModal = ({ isOpen, onClose, onSubmit, themeColors }) => {
  const [state, setState] = useState("");
  const [caste, setCaste] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = () => {
    if (!state || !caste || !gender || !occupation) {
        setError("All fields are required.");
        return; 
    }
    setError(null);
    onSubmit({ state, caste, gender, occupation });
    onClose();
    // Reset form slightly delayed
    setTimeout(() => { setState(""); setCaste(""); setGender(""); setOccupation(""); }, 500);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4">
      <div className={`bg-gray-900 md:bg-gray-800 w-full md:w-full md:max-w-md p-6 md:p-8 rounded-t-3xl md:rounded-2xl shadow-2xl transform transition-all duration-300 animate-slide-up border-t md:border border-gray-700 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl md:text-2xl font-extrabold ${themeColors.primary_text}`}>Check Eligibility</h2>
            <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        {/* Error message box */}
        {error && <div className="bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-xl mb-5 text-sm font-medium flex items-center"><X className="w-4 h-4 mr-2 flex-shrink-0"/> {error}</div>}

        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1 ml-1">State</label>
                <input type="text" placeholder="e.g. Maharashtra" value={state} onChange={(e) => setState(e.target.value)} className={`w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-${themeColors.primary_color}-500 focus:border-transparent transition outline-none text-base`}/>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1 ml-1">Category</label>
                <input type="text" placeholder="e.g. OBC, SC, General" value={caste} onChange={(e) => setCaste(e.target.value)} className={`w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-${themeColors.primary_color}-500 focus:border-transparent transition outline-none text-base`}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1 ml-1">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className={`w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:ring-2 focus:ring-${themeColors.primary_color}-500 focus:border-transparent transition outline-none text-base appearance-none`}>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase mb-1 ml-1">Occupation</label>
                    <input type="text" placeholder="e.g. Student" value={occupation} onChange={(e) => setOccupation(e.target.value)} className={`w-full p-4 rounded-xl border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-${themeColors.primary_color}-500 focus:border-transparent transition outline-none text-base`}/>
                </div>
            </div>
        </div>
        
        <button onClick={handleSubmit} className={`w-full mt-8 py-4 rounded-xl ${themeColors.primary_bg} ${themeColors.primary_hover} text-white font-bold text-lg transition duration-300 shadow-lg flex items-center justify-center space-x-2 hover:shadow-${themeColors.primary_color}-500/20 active:scale-[0.98]`}>
           <CheckCircle className="w-5 h-5"/> <span>Check Now</span>
        </button>
      </div>
    </div>
  );
};

// ---------------------------
// Message Bubble Component
// Handles user and AI messages, actions like copy, reply, delete, and reactions
// ---------------------------
const MessageBubble = ({ message, themeColors, handleReact, handleMessageAction }) => {
    const isUser = message.sender === "user";
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const menuRef = useRef(null);

    const bubbleClasses = isUser
        ? `${themeColors.primary_bg} text-white rounded-2xl rounded-tr-sm ml-auto shadow-md`
        : "bg-gray-800/90 text-gray-100 rounded-2xl rounded-tl-sm mr-auto shadow-md border border-gray-700/50";

    // Close menu when clicking outside
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

    const handleCopy = () => {
        // Handle copying text or a placeholder if the content is complex (like an image)
        const textToCopy = typeof message.text === "string" ? message.text : "AI response content";
        // Use document.execCommand('copy') for better iFrame compatibility
        try {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        setIsMenuOpen(false);
    };

    const emojis = ["👍", "😂", "💡", "🤔", "❤️"];

    return (
        <div className={`group flex ${isUser ? "justify-end" : "justify-start"} mb-4 md:mb-6 transition-all duration-500 animate-fade-in px-2 md:px-0`}>
            <div className="relative max-w-[85%] sm:max-w-[75%] md:max-w-[65%]" ref={menuRef}>
                <div className={`relative p-3.5 md:p-5 ${bubbleClasses} backdrop-blur-sm`}>
                    {/* Render message content. Handles both string text and complex React elements (like images/parsed content) */}
                    {/* If message.text is an object, it's already a React element (e.g., from parseAIContent) */}
                    {message.text && (typeof message.text === "string" ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{message.text}</p>
                    ) : (
                        message.text
                    ))}

                    {/* Actions Trigger (MoreHorizontal icon) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen((p) => !p);
                        }}
                        className={`absolute -top-3 ${isUser ? "-left-3" : "-right-3"} 
                            opacity-0 group-hover:opacity-100 md:focus:opacity-100 active:opacity-100 p-1.5 rounded-full 
                            bg-gray-700 text-gray-300 shadow-lg border border-gray-600
                            transition-all duration-200 z-10 transform scale-90 hover:scale-100`}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Reactions Display */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-2 pt-2 border-t ${isUser ? 'border-white/20' : 'border-gray-700'} ${isUser ? "justify-end" : "justify-start"}`}>
                            {message.reactions.map((r) => (
                                <span 
                                    key={r.emoji} 
                                    onClick={() => handleReact(message.id, r.emoji)} 
                                    className="cursor-pointer text-[10px] md:text-xs bg-black/20 rounded-full px-2 py-0.5 hover:bg-black/40 transition"
                                >
                                    {r.emoji} {r.count}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className={`absolute z-50 w-40 rounded-xl shadow-2xl bg-gray-800 border border-gray-700 overflow-hidden ${isUser ? 'right-0' : 'left-0'} mt-2 animate-fade-in`}>
                        <div className="flex flex-col py-1">
                             <button onClick={() => handleMessageAction(message.id, "reply")} className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/80"><Reply className="w-4 h-4 mr-3" /> Reply</button>
                             <button onClick={handleCopy} className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/80"><Copy className="w-4 h-4 mr-3" /> Copy</button>
                             <button onClick={(e) => { e.stopPropagation(); setIsEmojiPickerOpen(!isEmojiPickerOpen); }} className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700/80"><ThumbsUp className="w-4 h-4 mr-3" /> React</button>
                             <div className="h-px bg-gray-700 my-1"></div>
                             <button onClick={() => handleMessageAction(message.id, "delete")} className="flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20"><Trash2 className="w-4 h-4 mr-3" /> Delete</button>
                        </div>
                         {/* Emoji Picker */}
                         {isEmojiPickerOpen && (
                            <div className="bg-gray-900 p-2 flex justify-around border-t border-gray-700">
                                {emojis.map((emoji) => (
                                    <button 
                                        key={emoji} 
                                        className="text-lg hover:scale-125 transition" 
                                        onClick={() => { handleReact(message.id, emoji); setIsMenuOpen(false); }}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ---------------------------
// Main App Component
// ---------------------------
export default function App() {
  // Initial state for display when chat is empty
  const initialFAQs = [
    { id: 1, question: "What is Pradhan Mantri Awas Yojana?", summary: "Affordable housing scheme details." },
    { id: 2, question: "How to apply for Voter ID?", summary: "Registration process explained." },
    { id: 3, question: "Income Tax filing guide", summary: "Simple steps to file ITR." },
  ];

  const languages = ["English", "Hindi", "Marathi", "Tamil", "Bengali", "Gujarati"];
  
  // State management
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Hindi"); // Default to Hindi
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isInitialState, setIsInitialState] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isVoiceReply, setIsVoiceReply] = useState(false); // TTS Toggle State
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  const themeColors = themeMap[currentTheme];

  // Refs for scrolling and voice recognition
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null); 

  // Auto-scroll to the latest message
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Video autoplay fix (must be muted)
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.play().catch(() => {});
    }
  }, []); 

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return; // Feature not supported
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Map selected language to BCP 47 code for speech recognition
    const langMap = { English: "en-US", Hindi: "hi-IN", Marathi: "mr-IN", Tamil: "ta-IN", Bengali: "bn-IN", Gujarati: "gu-IN" };
    recognition.lang = langMap[selectedLanguage] || "en-US";

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event) => handleSendMessage(event.results[0][0].transcript);
    recognition.onerror = (event) => console.error("Speech Recognition Error:", event.error);
    
    recognitionRef.current = recognition;
    
    // Cleanup function
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
        }
    };
  }, [selectedLanguage]);

  // Text-to-Speech (TTS) function
  const speakText = (text) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const plainText = typeof text === 'string' ? text : "I found some information for you.";
    const utterance = new SpeechSynthesisUtterance(plainText);
    window.speechSynthesis.speak(utterance);
  };

  // Main function to send message to AI
  const handleSendMessage = async (text = inputMessage) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), text, sender: "user", reactions: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage(""); 
    setIsInitialState(false); 
    setIsLoading(true);

    try {
      // Mock API endpoint for the AI chat logic
      const response = await fetch("https://sarkari-sahayek-1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send user message, selected language, and session ID for context
        body: JSON.stringify({ message: text, language: selectedLanguage, session_id: sessionId }),
      });
      
      if (!response.ok) throw new Error("API request failed.");
      
      const data = await response.json();
      
      // Parse the structured AI response into displayable React elements
      const aiMessageContent = parseAIContent(data);
      const aiMessage = { id: Date.now() + 1, text: aiMessageContent, sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, aiMessage]);
      
      // If voice reply is enabled, speak the answer text
      if (isVoiceReply && data.answer) speakText(data.answer);
    
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage = { id: Date.now() + 2, text: "⚠️ Server unavailable. Using offline mode.", sender: "ai", reactions: [] };
      setMessages((prev) => [...prev, errorMessage]);
      
    } finally { 
      setIsLoading(false); 
    }
  };

  // Handles adding/removing reactions (emojis) to a message
  const handleReact = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
            const currentReactions = msg.reactions || [];
            const existingReactionIndex = currentReactions.findIndex(r => r.emoji === emoji);
            
            if (existingReactionIndex > -1) {
                // Remove reaction if already present
                return { ...msg, reactions: currentReactions.filter((_, i) => i !== existingReactionIndex) };
            } else {
                // Add new reaction (count is simplified to 1 for this example)
                return { ...msg, reactions: [...currentReactions, { emoji, count: 1 }] };
            }
        }
        return msg;
    }));
  }

  // Handles actions like deleting a message or starting a reply
  const handleMessageAction = (messageId, action) => {
    if (action === 'delete') {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        if (messages.length <= 1) setIsInitialState(true);
    } else if (action === 'reply') {
        const msg = messages.find(m => m.id === messageId);
        if(msg) {
            // Pre-fill input box for reply
            const replyText = typeof msg.text === 'string' ? msg.text.substring(0,20) : 'Media';
            setInputMessage(`Replying to: "${replyText}..." `);
        }
    }
  }

  // Mock handler for the Eligibility Form submission
  const handleEligibilitySubmit = async (data) => {
    const userMessage = { id: Date.now(), text: `Check eligibility: ${data.occupation} in ${data.state}`, sender: "user", reactions: [] };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true); 
    setIsInitialState(false);
    
    // Simulate API delay and response for eligibility check
    setTimeout(() => {
        const aiMessage = { 
            id: Date.now() + 1, 
            text: parseAIContent({ 
                answer: `Based on your profile (${data.occupation}, ${data.state}), here are likely schemes you may be eligible for:`,
                schemes: [
                    { name: "State Housing Scheme", description: "Subsidized housing for eligible residents of the specified state." }, 
                    { name: "Skill India", description: "Vocational training programs for specific occupational groups." }
                ] 
            }), 
            sender: "ai", 
            reactions: [] 
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    }, 1500);
  };

  // NEW: Image/Document Upload handler using Gemini Vision API
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return; // Only process image files

    const objectURL = URL.createObjectURL(file);
    const userMessage = { id: Date.now(), text: <img src={objectURL} alt="Uploaded Document" className="max-h-48 rounded-lg border border-gray-600 shadow-xl" />, sender: "user", reactions: [] };
    setMessages(prev => [...prev, userMessage]);
    
    setIsInitialState(false); 
    setIsLoading(true);
    
    let aiMessageText = "I could not process the document. Please try again or upload a clearer image.";

    try {
        const { base64, mimeType } = await fileToBase64(file);
        
        // UPDATED: System prompt to enforce structured and Hindi output
        const systemPrompt = `आप एक विशेषज्ञ सरकारी दस्तावेज़ विश्लेषक हैं। आपका कार्य अपलोड की गई छवि पर OCR और विश्लेषण करना है। आपको इन 3 बिंदुओं पर स्पष्ट, संरचित और केवल हिंदी में जवाब देना है:
1. दस्तावेज़ का प्रकार पहचानें (जैसे: आधार कार्ड, पासपोर्ट, आय प्रमाण पत्र, राशन कार्ड)।
2. मुख्य क्षेत्रों (नाम, जन्म तिथि, आईडी संख्या, जारी करने वाला प्राधिकरण, पता) को निकालें।
3. भारत में इस दस्तावेज़ का सामान्य उपयोग क्या है, इसका संक्षिप्त सारांश प्रदान करें।`;
        
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: "इस दस्तावेज़ छवि का विश्लेषण करें और आवश्यक निष्कर्षण और सारांश प्रदान करें।" },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64
                            }
                        }
                    ]
                }
            ],
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        const response = await withExponentialBackoff(() => 
            fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
        );
        
        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
            aiMessageText = result.candidates[0].content.parts[0].text;
        } else {
             console.error("Gemini API returned no text:", result);
             aiMessageText = "दस्तावेज़ का विश्लेषण करने में असमर्थ। (Unable to analyze the document.)";
        }
        
    } catch (error) {
        console.error("Error during image analysis via Gemini API:", error);
        aiMessageText = "एपीआई त्रुटि के कारण दस्तावेज़ का विश्लेषण नहीं हो सका। कृपया अपनी इंटरनेट कनेक्टिविटी जांचें। (Document analysis failed due to an API error. Please check your internet connection.)";
    } finally {
        const aiMessage = { id: Date.now() + 1, text: parseAIContent(aiMessageText), sender: "ai", reactions: [] };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    }
  };


  return (
    <div className="relative h-[100dvh] overflow-hidden text-gray-100 font-sans bg-black">
        {/* 🌌 Video Background - Simple visual enhancement */}
        <div className="absolute inset-0 z-0">
            <video
                ref={videoRef}
                src="https://videos.pexels.com/video-files/3141210/3141210-uhd_3840_2160_25fps.mp4"
                autoPlay loop muted playsInline
                className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/70 to-gray-900"></div>
        </div>

        {/* Main Container for content */}
        <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto">
            
            {/* HEADER - Top navigation and controls */}
            <header className="flex-shrink-0 px-4 py-3 md:py-4 flex items-center justify-between bg-gray-900/40 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${themeColors.primary_bg} shadow-lg shadow-${themeColors.primary_color}-500/20`}>
                        <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <h1 className="text-lg md:text-xl font-bold tracking-tight hidden sm:block">Sarkari Sahayak</h1>
                </div>

                {/* Right side controls */}
                <div className="flex items-center gap-2 md:gap-3">
                    <Notifications onSelectNotification={handleSendMessage} themeColors={themeColors} />
                    
                    {/* Eligibility Check Button */}
                    <button onClick={() => setShowEligibilityModal(true)} className="p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition shadow-lg" title="Check Eligibility">
                        <CheckCircle className={`w-5 h-5 md:w-6 md:h-6 ${themeColors.primary_text}`} />
                    </button>
                    
                    {/* Voice Output Toggle Button (NEWLY ADDED) */}
                    <button 
                        onClick={() => setIsVoiceReply(p => !p)} 
                        className={`p-2.5 rounded-full transition duration-300 shadow-lg border ${isVoiceReply ? `${themeColors.primary_bg} hover:bg-indigo-500 border-indigo-500/50` : "bg-gray-800/80 hover:bg-gray-700 border-gray-700"}`}
                        title={isVoiceReply ? "Disable Voice Reply (TTS is ON)" : "Enable Voice Reply (TTS is OFF)"}
                    >
                        {isVoiceReply ? <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />}
                    </button>

                    
                    {/* Language Selector */}
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(isMenuOpen === 'lang' ? null : 'lang')} className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-800/80 border border-gray-700 hover:bg-gray-700 transition shadow-lg">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <span className="text-xs font-bold uppercase tracking-wider hidden md:block">{selectedLanguage.substring(0,2)}</span>
                        </button>
                        {isMenuOpen === 'lang' && (
                            <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                                {languages.map(l => (
                                    <button key={l} onClick={() => {setSelectedLanguage(l); setIsMenuOpen(null)}} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-gray-300">{l}</button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Clear Chat Button */}
                    <button onClick={() => { setMessages([]); setIsInitialState(true); }} title="Clear Chat" className="p-2.5 rounded-full bg-gray-800/80 hover:bg-red-900/50 border border-gray-700 hover:border-red-500/50 transition shadow-lg group">
                        <Trash2 className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-red-400" />
                    </button>
                </div>
            </header>

            <EligibilityFormModal isOpen={showEligibilityModal} onClose={() => setShowEligibilityModal(false)} onSubmit={handleEligibilitySubmit} themeColors={themeColors} />

            {/* CHAT AREA - Displays messages */}
            <main className="flex-1 overflow-y-auto custom-scrollbar p-4 scroll-smooth">
                {isInitialState && messages.length === 0 ? (
                    // Initial Welcome Screen with FAQs
                    <div className="h-full flex flex-col items-center justify-center p-4 text-center animate-fade-in">
                         <div className={`mb-6 p-4 rounded-full bg-gray-800/50 border border-gray-700 shadow-2xl`}>
                             {/* The fixed Bot icon, which caused the error */}
                             <Bot className={`w-12 h-12 md:w-16 md:h-16 ${themeColors.primary_text}`} />
                         </div>
                         <h2 className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-3">Namaste!</h2>
                         <p className="text-gray-400 max-w-md mb-8 text-sm md:text-base">I am your AI Assistant for Government Services. How can I help you today?</p>
                         
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                            {initialFAQs.map(faq => (
                                <FAQCard key={faq.id} {...faq} onClick={() => handleSendMessage(faq.question)} themeColors={themeColors} />
                            ))}
                         </div>
                    </div>
                ) : (
                    // Message History
                    <div className="max-w-3xl mx-auto pb-4">
                        {messages.map(msg => (
                            <MessageBubble 
                                key={msg.id} 
                                message={msg} 
                                themeColors={themeColors} 
                                handleReact={handleReact} 
                                handleMessageAction={handleMessageAction} 
                            />
                        ))}
                        {isLoading && <TypingIndicator themeColors={themeColors} />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            {/* INPUT AREA - Message composer and controls */}
            <footer className="flex-shrink-0 p-3 md:p-5 bg-gray-900/60 backdrop-blur-xl border-t border-white/10">
                <div className="max-w-3xl mx-auto flex items-end gap-2 md:gap-3">
                    <div className="flex gap-2 md:gap-3 pb-1">
                        {/* Voice Input Button */}
                        <button 
                            onClick={() => { if(recognitionRef.current) isRecording ? recognitionRef.current.stop() : recognitionRef.current.start() }} 
                            title={isRecording ? "Stop Recording" : "Start Voice Input"}
                            className={`p-3 rounded-full transition-all duration-300 ${isRecording ? "bg-red-500/20 text-red-500 ring-2 ring-red-500 animate-pulse" : "bg-gray-800 hover:bg-gray-700 text-gray-400"}`}
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                        
                        {/* Document/Image Upload Button */}
                        <label className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 cursor-pointer transition-all" title="Upload Document">
                            <Upload className="w-5 h-5" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>

                    {/* Text Input Area */}
                    <div className="flex-1 relative bg-gray-800/80 rounded-2xl border border-gray-700 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                            placeholder={`Ask in ${selectedLanguage}...`}
                            className="w-full bg-transparent border-none text-white placeholder-gray-500 px-4 py-3.5 max-h-32 focus:ring-0 resize-none text-base leading-relaxed custom-scrollbar"
                            rows={1}
                            style={{ minHeight: '50px' }}
                        />
                    </div>

                    {/* Send Button */}
                    <button 
                        onClick={() => handleSendMessage()} 
                        disabled={!inputMessage.trim() || isLoading}
                        className={`p-3.5 rounded-full mb-0.5 ${inputMessage.trim() ? `${themeColors.primary_bg} hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20` : "bg-gray-800 text-gray-600 cursor-not-allowed"} transition-all duration-300`}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-center text-[10px] text-gray-600 mt-2 hidden md:block">AI can make mistakes. Verify important information.</p>
            </footer>
        </div>
        
        {/* Global Styles for scrollbar and animations */}
        <style>{`
/* Custom Scrollbar Styles for better dark theme appearance */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
/* Keyframe animations */
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }

/* Ensure textarea resizes properly */
textarea {
    overflow: hidden; /* Hide scrollbar until needed */
}
        `}</style>
    </div>
  );
}
