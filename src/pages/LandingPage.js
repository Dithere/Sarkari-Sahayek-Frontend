import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Sparkles, Loader2, FileText, Bell, Scan, Bot, Globe, MessageSquare, X } from "lucide-react"; 

// Tailwind CSS classes for consistent input styling
const inputStyles = "w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

// --- Translation Data Structure ---
// All static strings and feature content are defined here, using the full language name 
// as the key to match the <select> options.

const TRANSLATIONS = {
    // ENGLISH
    "English": {
        app_title: "Sarkari Sahayak – AI Governance Assistant",
        app_description: "Your all-in-one AI companion for government services: instantly check eligibility, digitize documents via OCR, and get real-time guidance through our intelligent chatbot.",
        language_label: "Language:",
        start_chat_button: "Start Intelligent Chat",
        open_eligibility_button: "Eligibility Check", // Updated button text
        section_features_title: "Key Features",
        section_eligibility_title: "Scheme Eligibility Tool",
        profile_details_title: "Your Profile Details",
        input_placeholder_state: "State / UT",
        input_placeholder_caste: "Caste / Category (e.g., OBC, SC, General)",
        select_gender_placeholder: "Select Gender",
        select_gender_male: "Male",
        select_gender_female: "Female",
        select_gender_other: "Other",
        input_placeholder_occupation: "Occupation / Profession (e.g., Farmer, Student, Small Business)",
        check_eligibility_button: "Check Eligibility",
        checking_label: "Checking...",
        results_summary_title: "Eligibility Summary",
        results_answer_default: "Based on your inputs, you are eligible for the following key schemes:",
        results_answer_error: "Server connection failed. Please try again later or check your network.",
        results_placeholder: "Enter details and check eligibility to see instant recommendations here.",
        results_recommended_schemes: "Recommended Schemes:",
        
        features: [
            { icon: Bot, title: "Intelligent Chat Engine", description: "Utilize the core AI engine for complex query resolution, procedural guidance, and personalized scheme information.", color: "text-indigo-400" },
            { icon: Globe, title: "Multilingual Support", description: "Access all platform features, documents, and interactions in multiple major regional and national languages.", color: "text-cyan-400" },
            { icon: MessageSquare, title: "Voice Interaction", description: "Speak naturally to the assistant and receive instant, audible voice output for a hands-free, accessible experience.", color: "text-purple-400" },
            { icon: ClipboardCheck, title: "Eligibility Checker", description: "Input your profile to instantly determine which central and state government schemes you qualify for.", color: "text-yellow-400" },
            { icon: Scan, title: "OCR Document Digitizer", description: "Quickly scan, upload, and digitize necessary paper documents for simplified and error-free online applications.", color: "text-green-400" },
            { icon: Bell, title: "Real-time Notifications", description: "Receive proactive alerts and personalized updates on newly launched government programs and critical submission deadlines.", color: "text-rose-400" },
        ],
    },

    // HINDI
    "Hindi": {
        app_title: "सरकारी सहायक - एआई गवर्नेंस असिस्टेंट",
        app_description: "सरकारी सेवाओं के लिए आपका ऑल-इन-वन एआई साथी: तुरंत पात्रता जांचें, ओसीआर के माध्यम से दस्तावेजों को डिजिटाइज़ करें, और हमारे बुद्धिमान चैटबॉट के माध्यम से वास्तविक समय मार्गदर्शन प्राप्त करें।",
        language_label: "भाषा:",
        start_chat_button: "इंटेलिजेंट चैट शुरू करें",
        open_eligibility_button: "पात्रता जांच", // Updated button text
        section_features_title: "मुख्य विशेषताएं",
        section_eligibility_title: "योजना पात्रता उपकरण",
        profile_details_title: "आपकी प्रोफाइल विवरण",
        input_placeholder_state: "राज्य / केंद्र शासित प्रदेश",
        input_placeholder_caste: "जाति / श्रेणी (उदा. ओबीसी, एससी, सामान्य)",
        select_gender_placeholder: "लिंग चुनें",
        select_gender_male: "पुरुष",
        select_gender_female: "महिला",
        select_gender_other: "अन्य",
        input_placeholder_occupation: "व्यवसाय / पेशा (उदा. किसान, छात्र, छोटा व्यवसाय)",
        check_eligibility_button: "पात्रता जांचें",
        checking_label: "जाँच हो रही है...",
        results_summary_title: "पात्रता सारांश",
        results_answer_default: "आपके इनपुट के आधार पर, आप निम्न प्रमुख योजनाओं के लिए पात्र हैं:",
        results_answer_error: "सर्वर कनेक्शन विफल। कृपया बाद में पुनः प्रयास करें या अपना नेटवर्क जांचें।",
        results_placeholder: "विवरण दर्ज करें और तत्काल सिफारिशें देखने के लिए पात्रता की जाँच करें।",
        results_recommended_schemes: "अनुशंसित योजनाएँ:",

        features: [
            { icon: Bot, title: "बुद्धिमान चैट इंजन", description: "जटिल प्रश्न समाधान, प्रक्रियात्मक मार्गदर्शन और व्यक्तिगत योजना जानकारी के लिए मुख्य एआई इंजन का उपयोग करें।", color: "text-indigo-400" },
            { icon: Globe, title: "बहुभाषी समर्थन", description: "कई प्रमुख क्षेत्रीय और राष्ट्रीय भाषाओं में सभी प्लेटफॉर्म सुविधाओं, दस्तावेजों और इंटरैक्शन तक पहुंचें।", color: "text-cyan-400" },
            { icon: MessageSquare, title: "आवाज इंटरैक्शन", description: "सहायक से स्वाभाविक रूप से बात करें और हाथों से मुक्त, सुलभ अनुभव के लिए तुरंत, श्रव्य आवाज आउटपुट प्राप्त करें।", color: "text-purple-400" },
            { icon: ClipboardCheck, title: "पात्रता चेकर", description: "आप किस केंद्रीय और राज्य सरकारी योजनाओं के लिए योग्य हैं, यह तुरंत निर्धारित करने के लिए अपनी प्रोफाइल दर्ज करें।", color: "text-yellow-400" },
            { icon: Scan, title: "ओसीआर दस्तावेज़ डिजिटाइज़र", description: "सरलीकृत और त्रुटि-मुक्त ऑनलाइन आवेदनों के लिए आवश्यक कागजी दस्तावेजों को जल्दी से स्कैन, अपलोड और डिजिटाइज़ करें।", color: "text-green-400" },
            { icon: Bell, title: "रीयल-टाइम सूचनाएं", description: "नए लॉन्च किए गए सरकारी कार्यक्रमों और महत्वपूर्ण जमा करने की समय-सीमा पर सक्रिय अलर्ट और व्यक्तिगत अपडेट प्राप्त करें।", color: "text-rose-400" },
        ],
    },

    // TAMIL
    "Tamil": {
        app_title: "சர்க்காரி சஹாயக் - AI ஆளுமை உதவியாளர்",
        app_description: "அரசு சேவைகளுக்கான உங்களின் ஆல்-இன்-ஒன் AI துணை: தகுதியை உடனடியாகச் சரிபார்க்கவும், OCR மூலம் ஆவணங்களை டிஜிட்டல் மயமாக்கவும், மற்றும் எங்கள் புத்திசாலித்தனமான சாட்பாட் மூலம் நிகழ்நேர வழிகாட்டுதலைப் பெறவும்.",
        language_label: "மொழி:",
        start_chat_button: "புத்திசாலித்தனமான உரையாடலைத் தொடங்கு",
        open_eligibility_button: "தகுதிச் சரிபார்ப்பு", // Updated button text
        section_features_title: "முக்கிய அம்சங்கள்",
        section_eligibility_title: "திட்டம் தகுதி கருவி",
        profile_details_title: "உங்கள் சுயவிவர விவரங்கள்",
        input_placeholder_state: "மாநிலம் / யூ.டி",
        input_placeholder_caste: "சாதி / வகை (உம்: OBC, SC, பொது)",
        select_gender_placeholder: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
        select_gender_male: "ஆண்",
        select_gender_female: "பெண்",
        select_gender_other: "மற்றவை",
        input_placeholder_occupation: "தொழில் / பணி (உம்: விவசாயி, மாணவர், சிறு வணிகம்)",
        check_eligibility_button: "தகுதியைச் சரிபார்க்கவும்",
        checking_label: "சரிபார்க்கிறது...",
        results_summary_title: "தகுதி சுருக்கம்",
        results_answer_default: "உங்கள் உள்ளீடுகளின் அடிப்படையில், நீங்கள் பின்வரும் முக்கிய திட்டங்களுக்குத் தகுதியுடையவர்:",
        results_answer_error: "சேவையக இணைப்பு தோல்வியடைந்தது. பிறகு மீண்டும் முயற்சிக்கவும் அல்லது உங்கள் பிணையத்தைச் சரிபார்க்கவும்.",
        results_placeholder: "விவரங்களை உள்ளிட்டு உடனடி பரிந்துரைகளைப் பார்க்க தகுதியைச் சரிபார்க்கவும்.",
        results_recommended_schemes: "பரிந்துரைக்கப்பட்ட திட்டங்கள்:",

        features: [
            { icon: Bot, title: "புத்திசாலித்தனமான சாட் இன்ஜின்", description: "சிக்கலான கேள்வித் தீர்வு, செயல்முறை வழிகாட்டுதல் மற்றும் தனிப்பயனாக்கப்பட்ட திட்டம் பற்றிய தகவல்களுக்கு முக்கிய AI இன்ஜினைப் பயன்படுத்தவும்。", color: "text-indigo-400" },
            { icon: Globe, title: "பன்மொழி ஆதரவு", description: "பல முக்கிய பிராந்திய மற்றும் தேசிய மொழிகளில் அனைத்து இயங்குதள அம்சங்கள், ஆவணங்கள் மற்றும் தொடர்புகளை அணுகவும்.", color: "text-cyan-400" },
            { icon: MessageSquare, title: "குரல் தொடர்பு", description: "உதவியாளரிடம் இயல்பாகப் பேசுங்கள் மற்றும் ஹேண்ட்ஸ்-ஃப்ரீ, அணுகக்கூடிய அனுபவத்திற்காக உடனடி, கேட்கக்கூடிய குரல் வெளியீட்டைப் பெறுங்கள்.", color: "text-purple-400" },
            { icon: ClipboardCheck, title: "தகுதிச் சரிபார்ப்பு", description: "நீங்கள் எந்த மத்திய மற்றும் மாநில அரசுத் திட்டங்களுக்குத் தகுதியுடையவர் என்பதை உடனடியாகத் தீர்மானிக்க உங்கள் சுயவிவரத்தை உள்ளிடவும்。", color: "text-yellow-400" },
            { icon: Scan, title: "OCR ஆவண டிஜிட்டலைசர்", description: "எளிமைப்படுத்தப்பட்ட மற்றும் பிழையற்ற ஆன்லைன் விண்ணப்பங்களுக்காக தேவையான காகித ஆவணங்களை விரைவாக ஸ்கேன் செய்து, பதிவேற்றவும் மற்றும் டிஜிட்டல் மயமாக்கவும்。", color: "text-green-400" },
            { icon: Bell, title: "நிகழ்நேர அறிவிப்புகள்", description: "புதிதாக தொடங்கப்பட்ட அரசு திட்டங்கள் மற்றும் முக்கியமான சமர்ப்பிப்பு காலக்கெடு பற்றிய செயல்திறன் மிக்க விழிப்பூட்டல்கள் மற்றும் தனிப்பயனாக்கப்பட்ட புதுப்பிப்புகளைப் பெறுங்கள்。", color: "text-rose-400" },
        ],
    },

    // BENGALI
    "Bengali": {
        app_title: "সরকার সহায়ক - এআই গভর্নেন্স অ্যাসিস্ট্যান্ট",
        app_description: "সরকারি পরিষেবার জন্য আপনার অল-ইন-ওয়ান এআই সঙ্গী: অবিলম্বে যোগ্যতা পরীক্ষা করুন, ওসিআর এর মাধ্যমে নথি ডিজিটাইজ করুন এবং আমাদের বুদ্ধিমান চ্যাটবটের মাধ্যমে রিয়েল-টাইম নির্দেশনা পান।",
        language_label: "ভাষা:",
        start_chat_button: "বুদ্ধিমান চ্যাট শুরু করুন",
        open_eligibility_button: "যোগ্যতা পরীক্ষা", // Updated button text
        section_features_title: "মূল বৈশিষ্ট্য",
        section_eligibility_title: "স্কিম যোগ্যতা টুল",
        profile_details_title: "আপনার প্রোফাইল বিবরণ",
        input_placeholder_state: "রাজ্য / কেন্দ্রশাসিত অঞ্চল",
        input_placeholder_caste: "জাতি / বিভাগ (যেমন: OBC, SC, সাধারণ)",
        select_gender_placeholder: "লিঙ্গ নির্বাচন করুন",
        select_gender_male: "পুরুষ",
        select_gender_female: "মহিলা",
        select_gender_other: "অন্যান্য",
        input_placeholder_occupation: "পেশা / চাকরি (যেমন: কৃষক, ছাত্র, ছোট ব্যবসা)",
        check_eligibility_button: "যোগ্যতা পরীক্ষা করুন",
        checking_label: "পরীক্ষা করছে...",
        results_summary_title: "যোগ্যতা সারসংক্ষেপ",
        results_answer_default: "আপনার ইনপুটের ভিত্তিতে, আপনি নিম্নলিখিত মূল স্কিমগুলির জন্য যোগ্য:",
        results_answer_error: "সার্ভার সংযোগ ব্যর্থ হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন বা আপনার নেটওয়ার্ক পরীক্ষা করুন।",
        results_placeholder: "বিবরণ লিখুন এবং তাত্ক্ষণিক সুপারিশগুলি দেখতে যোগ্যতা পরীক্ষা করুন।",
        results_recommended_schemes: "প্রস্তাবিত স্কিমসমূহ:",

        features: [
            { icon: Bot, title: "বুদ্ধিমান চ্যাট ইঞ্জিন", description: "জটিল প্রশ্নের সমাধান, পদ্ধতিগত নির্দেশিকা এবং ব্যক্তিগতকৃত স্কিম তথ্যের জন্য মূল এআই ইঞ্জিন ব্যবহার করুন।", color: "text-indigo-400" },
            { icon: Globe, title: "বহুভাষিক সমর্থন", description: "একাধিক প্রধান আঞ্চলিক এবং জাতীয় ভাষায় সমস্ত প্ল্যাটফর্ম বৈশিষ্ট্য, নথি এবং মিথস্ক্রিয়া অ্যাক্সেস করুন।", color: "text-cyan-400" },
            { icon: MessageSquare, title: "ভয়েস ইন্টারঅ্যাকশন", description: "সহকারীর সাথে স্বাভাবিকভাবে কথা বলুন এবং হাত-মুক্ত, অ্যাক্সেসযোগ্য অভিজ্ঞতার জন্য তাত্ক্ষণিক, শ্রাব্য ভয়েস আউটপুট পান।", color: "text-purple-400" },
            { icon: ClipboardCheck, title: "যোগ্যতা পরীক্ষক", description: "আপনি কোন কেন্দ্রীয় এবং রাজ্য সরকারি স্কিমগুলির জন্য যোগ্য তা তাৎক্ষণিকভাবে নির্ধারণ করতে আপনার প্রোফাইল ইনপুট করুন।", color: "text-yellow-400" },
            { icon: Scan, title: "ওসিআর ডকুমেন্ট ডিজিটাইজার", description: "সরলীকৃত এবং ত্রুটি-মুক্ত অনলাইন আবেদনের জন্য প্রয়োজনীয় কাগজের নথিগুলি দ্রুত স্ক্যান, আপলোড এবং ডিজিটাইজ করুন।", color: "text-green-400" },
            { icon: Bell, title: "রিয়েল-টাইম বিজ্ঞপ্তি", description: "নতুন চালু হওয়া সরকারি প্রোগ্রাম এবং গুরুত্বপূর্ণ জমা দেওয়ার সময়সীমা সম্পর্কে সক্রিয় সতর্কতা এবং ব্যক্তিগতকৃত আপডেট পান।", color: "text-rose-400" },
        ],
    },
};

// The App component encapsulates the entire application, serving as the main entry point.
export default function App() {
    // State to hold form data for eligibility check
    const [form, setForm] = useState({
        state: "",
        caste: "",
        gender: "",
        occupation: "",
    });
    // State to hold the API response
    const [response, setResponse] = useState(null);
    // State for loading indicator
    const [loading, setLoading] = useState(false);
    // State for current language selection, defaults to English
    const [language, setLanguage] = useState("English");
    // New state for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper variable to select the current translation block
    const T = TRANSLATIONS[language] || TRANSLATIONS["English"];

    // The feature array now comes directly from the selected translation block
    const features = T.features;

    // --- Utility Functions ---

    // Handles input and select changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handles form submission and API call (Placeholder for actual backend)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        const apiUrl = "https://sarkari-sahayek-1.onrender.com/api/eligibility"; // Replace with your real API endpoint
        
        const MAX_RETRIES = 3;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const res = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();

                // Use the real API data directly
                setResponse({
                    answer: T.results_answer_default, // keeps translated text
                    schemes: data.schemes || [],     // assumes your API returns { schemes: [...] }
                });

                break; // Success, exit retry loop
            } catch (err) {
                if (attempt < MAX_RETRIES - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error("Failed to connect to eligibility API after multiple retries:", err);
                    setResponse({
                        answer: T.results_answer_error,
                        schemes: [], // empty if API fails
                    });
                }
            }
        }

        setLoading(false);
    };
    // Variants for Framer Motion animations
    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    const buttonHover = {
        scale: 1.05,
        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.5)",
    };

    // Component for displaying the eligibility results (now defined inside App for state access)
    const ResultsDisplay = () => {
        if (!response && !loading)
            return (
                <motion.div 
                    className="h-full flex items-center justify-center bg-gray-800/80 border border-gray-700/50 p-6 rounded-2xl shadow-2xl transition-all duration-300 text-center text-gray-400 italic min-h-[300px] select-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <FileText className="w-6 h-6 mr-2" />
                    {T.results_placeholder}
                </motion.div>
            );

        if (loading)
            return (
                <motion.div 
                    className="h-full flex flex-col items-center justify-center bg-gray-800/80 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl shadow-indigo-900/50 text-indigo-300 min-h-[300px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader2 className="w-8 h-8 mb-3 animate-spin" />
                    <p className="font-semibold text-lg">{T.checking_label}</p>
                </motion.div>
            );

        // If API returns an error and no schemes
        if (response && response.schemes && response.schemes.length === 0) {
            return (
                <motion.div
                    className="h-full flex flex-col items-center justify-center bg-red-800/50 border border-red-700/50 p-6 rounded-2xl shadow-2xl text-red-300 italic min-h-[300px] text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <X className="w-8 h-8 mb-3 text-red-400" />
                    <p className="font-semibold text-lg mb-2">{T.results_answer_error}</p>
                    <p className="text-sm">{T.results_placeholder}</p>
                </motion.div>
            );
        }

        return (
            <motion.div 
                className="h-full text-left bg-gray-900 border border-indigo-500/30 p-6 rounded-2xl shadow-inner shadow-indigo-900/50 overflow-y-auto max-h-[450px] min-h-[300px] flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="font-bold text-xl text-indigo-300 mb-3 border-b border-gray-700 pb-2">{T.results_summary_title}</h3>
                
                <p className="font-semibold text-white mb-4 flex-shrink-0">{response.answer}</p>

                <ul className="space-y-4 text-sm text-gray-300 flex-grow overflow-y-auto pr-2">
                    <p className="font-medium text-gray-400 mt-2 flex-shrink-0">{T.results_recommended_schemes}</p>
                    {response.schemes.map((scheme, index) => (
                        <li key={index} className="flex flex-col p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-600 transition-colors">
                            {scheme.link ? (
                                <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                                >
                                    {scheme.name}
                                </a>
                            ) : (
                                <span className="text-indigo-400 font-bold">{scheme.name}</span>
                            )}
                            <p className="text-xs mt-1 text-gray-400">
                                {scheme.description}
                            </p>
                        </li>
                    ))}
                </ul>
            </motion.div>
        );
    };

    // Feature Card Component
    const FeatureCard = ({ icon: Icon, title, description, color }) => (
        <motion.div 
            className="p-6 bg-gray-800/80 border border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 backdrop-blur-sm cursor-default h-full"
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            // Scroll Animation: Fade in when visible
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
        >
            <Icon className={`w-8 h-8 mb-3 ${color}`} />
            <h4 className="text-xl font-bold mb-2 text-white">{title}</h4>
            <p className="text-sm text-gray-400">{description}</p> 
        </motion.div>
    );

    // Modal Content for Eligibility Check (contains the form and results)
    const EligibilityModalContent = () => (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-gray-900 border border-indigo-700/50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-6 relative"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ duration: 0.3 }}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-indigo-700/50 pb-4 mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-indigo-400 flex items-center">
                        <ClipboardCheck className="w-6 h-6 mr-2" />
                        {T.section_eligibility_title}
                    </h2>
                    <motion.button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 rounded-full bg-gray-800 hover:bg-red-500 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Modal Body: Form and Results Grid */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-4">
                    
                    {/* FORM PANEL */}
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">{T.profile_details_title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" name="state" placeholder={T.input_placeholder_state} value={form.state} onChange={handleChange} className={inputStyles} required />
                            <input type="text" name="caste" placeholder={T.input_placeholder_caste} value={form.caste} onChange={handleChange} className={inputStyles} required />
                            <select name="gender" value={form.gender} onChange={handleChange} className={`${inputStyles} appearance-none cursor-pointer`} required>
                                <option value="" disabled className="text-gray-400">{T.select_gender_placeholder}</option>
                                <option value="Male">{T.select_gender_male}</option>
                                <option value="Female">{T.select_gender_female}</option>
                                <option value="Other">{T.select_gender_other}</option>
                            </select>
                            <input type="text" name="occupation" placeholder={T.input_placeholder_occupation} value={form.occupation} onChange={handleChange} className={inputStyles} required />
                            
                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-3 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-6"
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {T.checking_label}
                                    </>
                                ) : (
                                    T.check_eligibility_button
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* RESULTS PANEL */}
                    <div className="w-full">
                        <ResultsDisplay />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );


    // --- Component Structure (JSX) ---

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-gray-900 text-white font-inter">
            {/* 🌌 Professional Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
            >
                {/* Placeholder video URL for demonstration */}
                <source src="https://videos.pexels.com/video-files/3141210/3141210-uhd_3840_2160_25fps.mp4" type="video/mp4" />
            </video>

            {/* Overlay for professionalism and readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm"></div>

            {/* 🌟 Main Content Container: Centered, content is stacked vertically */}
            <div className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-16">

                {/* LANGUAGE SELECTOR - Top Right */}
                <motion.div
                    className="w-full max-w-6xl md:max-w-7xl flex justify-end mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center p-2 rounded-xl bg-gray-800/70 border border-gray-700/50 shadow-lg">
                        <Globe className="w-5 h-5 text-indigo-400 mr-2" />
                        <label htmlFor="language-select" className="text-sm font-medium text-gray-400 mr-3 hidden sm:block">{T.language_label}</label>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="p-1 rounded-md bg-gray-700 text-white border-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-sm"
                        >
                            <option value="English">English</option>
                            <option value="Hindi">हिन्दी (Hindi)</option>
                            <option value="Tamil">தமிழ் (Tamil)</option>
                            <option value="Bengali">বাংলা (Bengali)</option>
                        </select>
                    </div>
                </motion.div>
                
                {/* Main Vertical Stack (Hero on top, Tool below) */}
                <div className="flex flex-col space-y-16 w-full max-w-6xl md:max-w-7xl">
                    
                    {/* TOP SECTION: Hero, Title, Description, and Main CTA */}
                    <motion.div
                        className="w-full text-center pt-8"
                        initial="initial"
                        animate="animate"
                        variants={fadeUp}
                        transition={{ staggerChildren: 0.2 }}
                    >
                        <motion.h1 
                            className="text-4xl md:text-7xl font-extrabold pt-[60px] mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-white leading-tight"
                            variants={fadeUp}
                        >
                            <Sparkles className="inline-block w-8 h-8 md:w-12 md:h-12 mr-3 text-indigo-400" />
                            {T.app_title}
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl pt-[20px] mb-10 max-w-2xl mx-auto text-gray-300"
                            variants={fadeUp}
                        >
                            {T.app_description}
                        </motion.p>
                        
                        {/* 🚀 BUTTONS CONTAINER: Side-by-side and equal width */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
                            
                            {/* ✨ Start Chat Button */}
                            <motion.button
                                className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors duration-200 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl shadow-indigo-500/50"
                                whileHover={buttonHover}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => (window.location.href = "/chat")}
                                // Scroll Animation
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <Bot className="w-5 h-5 mr-2" />
                                {T.start_chat_button}
                            </motion.button>
                            
                            {/* 📋 Eligibility Check Button */}
                            <motion.button
                                className="flex items-center justify-center w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-colors duration-200 px-6 py-3 rounded-xl font-bold text-lg shadow-xl shadow-blue-500/40"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsModalOpen(true)}
                                // Scroll Animation
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <ClipboardCheck className="w-5 h-5 mr-2" />
                                {T.open_eligibility_button}
                            </motion.button>
                        </div>


                    </motion.div>

                    {/* FEATURE CARDS SECTION (Added Scroll Animation) */}
                    <motion.div
                        className="w-full pt-4"
                        // Scroll Animation
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-300 text-center border-b border-gray-700/50 pb-3">
                            {T.section_features_title}
                        </h2>
                        {/* Updated grid layout to 3 columns on large screens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </motion.div>
                    
                </div>
            </div>

            {/* 📋 ELIGIBILITY MODAL (Conditionally Rendered) */}
            {isModalOpen && <EligibilityModalContent />}
        </div>
    );
}
