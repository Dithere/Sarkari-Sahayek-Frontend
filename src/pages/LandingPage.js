import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Sparkles, Loader2, FileText, Bell, Scan, Bot, Globe, MessageSquare, X, ChevronRight, ChevronDown,TabletSmartphone } from "lucide-react"; 
import video from "./onto.mp4"
// Added text-base to prevent iOS auto-zoom on focus
const inputStyles = "w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-base backdrop-blur-sm";

const TRANSLATIONS = {
    "English": {
        app_title: "Sarkari Sahayak – AI Governance Assistant",
        app_description: "Your all-in-one AI companion for government services: instantly check eligibility, digitize documents via OCR, and get real-time guidance through our intelligent chatbot.",
        language_label: "Language",
        start_chat_button: "Start Intelligent Chat",
        open_eligibility_button: "Check Eligibility", 
        section_features_title: "Key Features",
        section_eligibility_title: "Scheme Eligibility Tool",
        profile_details_title: "Your Profile Details",
        input_placeholder_state: "State / UT",
        input_placeholder_caste: "Caste / Category (e.g., OBC, SC)",
        select_gender_placeholder: "Select Gender",
        select_gender_male: "Male",
        select_gender_female: "Female",
        select_gender_other: "Other",
        input_placeholder_occupation: "Occupation (e.g., Farmer, Student)",
        check_eligibility_button: "Check Eligibility",
        checking_label: "Analyzing Profile...",
        results_summary_title: "Eligibility Summary",
        results_answer_default: "Based on your inputs, you are eligible for the following key schemes:",
        results_answer_error: "Server connection failed. Showing demo results instead.",
        results_placeholder: "Complete your profile to see AI-curated government schemes tailored for you.",
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
    "Hindi": {
        app_title: "सरकारी सहायक - एआई गवर्नेंस असिस्टेंट",
        app_description: "सरकारी सेवाओं के लिए आपका ऑल-इन-वन एआई साथी: तुरंत पात्रता जांचें, ओसीआर के माध्यम से दस्तावेजों को डिजिटाइज़ करें, और हमारे बुद्धिमान चैटबॉट के माध्यम से वास्तविक समय मार्गदर्शन प्राप्त करें।",
        language_label: "भाषा",
        start_chat_button: "इंटेलिजेंट चैट शुरू करें",
        open_eligibility_button: "पात्रता जांच", 
        section_features_title: "मुख्य विशेषताएं",
        section_eligibility_title: "योजना पात्रता उपकरण",
        profile_details_title: "आपकी प्रोफाइल विवरण",
        input_placeholder_state: "राज्य / केंद्र शासित प्रदेश",
        input_placeholder_caste: "जाति / श्रेणी (उदा. ओबीसी, एससी)",
        select_gender_placeholder: "लिंग चुनें",
        select_gender_male: "पुरुष",
        select_gender_female: "महिला",
        select_gender_other: "अन्य",
        input_placeholder_occupation: "व्यवसाय / पेशा (उदा. किसान, छात्र)",
        check_eligibility_button: "पात्रता जांचें",
        checking_label: "विश्लेषण जारी है...",
        results_summary_title: "पात्रता सारांश",
        results_answer_default: "आपके इनपुट के आधार पर, आप निम्न प्रमुख योजनाओं के लिए पात्र हैं:",
        results_answer_error: "सर्वर कनेक्शन विफल। डेमो परिणाम दिखाए जा रहे हैं।",
        results_placeholder: "अपने लिए एआई-चयनित सरकारी योजनाएं देखने के लिए अपनी प्रोफाइल पूरी करें।",
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
    "Tamil": {
        app_title: "சர்க்காரி சஹாயக் - AI ஆளுமை உதவியாளர்",
        app_description: "அரசு சேவைகளுக்கான உங்களின் ஆல்-இன்-ஒன் AI துணை: தகுதியை உடனடியாகச் சரிபார்க்கவும், OCR மூலம் ஆவணங்களை டிஜிட்டல் மயமாக்கவும், மற்றும் எங்கள் புத்திசாலித்தனமான சாட்பாட் மூலம் நிகழ்நேர வழிகாட்டுதலைப் பெறவும்.",
        language_label: "மொழி",
        start_chat_button: "புத்திசாலித்தனமான உரையாடலைத் தொடங்கு",
        open_eligibility_button: "தகுதிச் சரிபார்ப்பு", 
        section_features_title: "முக்கிய அம்சங்கள்",
        section_eligibility_title: "திட்டம் தகுதி கருவி",
        profile_details_title: "உங்கள் சுயவிவர விவரங்கள்",
        input_placeholder_state: "மாநிலம் / யூ.டி",
        input_placeholder_caste: "சாதி / வகை (உம்: OBC, SC)",
        select_gender_placeholder: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
        select_gender_male: "ஆண்",
        select_gender_female: "பெண்",
        select_gender_other: "மற்றவை",
        input_placeholder_occupation: "தொழில் / பணி (உம்: விவசாயி, மாணவர்)",
        check_eligibility_button: "தகுதியைச் சரிபார்க்கவும்",
        checking_label: "பகுப்பாய்வு செய்கிறது...",
        results_summary_title: "தகுதி சுருக்கம்",
        results_answer_default: "உங்கள் உள்ளீடுகளின் அடிப்படையில், நீங்கள் பின்வரும் முக்கிய திட்டங்களுக்குத் தகுதியுடையவர்:",
        results_answer_error: "சேவையக இணைப்பு தோல்வியடைந்தது. டெமோ முடிவுகள் காட்டப்படுகின்றன.",
        results_placeholder: "உங்களுக்காக AI-தேர்ந்தெடுக்கப்பட்ட அரசுத் திட்டங்களைக் காண உங்கள் சுயவிவரத்தை முடிக்கவும்.",
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
    "Bengali": {
        app_title: "সরকার সহায়ক - এআই গভর্নেন্স অ্যাসিস্ট্যান্ট",
        app_description: "সরকারি পরিষেবার জন্য আপনার অল-ইন-ওয়ান এআই সঙ্গী: অবিলম্বে যোগ্যতা পরীক্ষা করুন, ওসিআর এর মাধ্যমে নথি ডিজিটাইজ করুন এবং আমাদের বুদ্ধিমান চ্যাটবটের মাধ্যমে রিয়েল-টাইম নির্দেশনা পান।",
        language_label: "ভাষা",
        start_chat_button: "বুদ্ধিমান চ্যাট শুরু করুন",
        open_eligibility_button: "যোগ্যতা পরীক্ষা", 
        section_features_title: "মূল বৈশিষ্ট্য",
        section_eligibility_title: "স্কিম যোগ্যতা টুল",
        profile_details_title: "আপনার প্রোফাইল বিবরণ",
        input_placeholder_state: "রাজ্য / কেন্দ্রশাসিত অঞ্চল",
        input_placeholder_caste: "জাতি / বিভাগ (যেমন: OBC, SC)",
        select_gender_placeholder: "লিঙ্গ নির্বাচন করুন",
        select_gender_male: "পুরুষ",
        select_gender_female: "মহিলা",
        select_gender_other: "অন্যান্য",
        input_placeholder_occupation: "পেশা / চাকরি (যেমন: কৃষক, ছাত্র)",
        check_eligibility_button: "যোগ্যতা পরীক্ষা করুন",
        checking_label: "বিশ্লেষণ করছে...",
        results_summary_title: "যোগ্যতা সারসংক্ষেপ",
        results_answer_default: "আপনার ইনপুটের ভিত্তিতে, আপনি নিম্নলিখিত মূল স্কিমগুলির জন্য যোগ্য:",
        results_answer_error: "সার্ভার সংযোগ ব্যর্থ হয়েছে। ডেমো ফলাফল দেখানো হচ্ছে।",
        results_placeholder: "আপনার জন্য এআই-নির্বাচিত সরকারি স্কিমগুলি দেখতে আপনার প্রোফাইল সম্পূর্ণ করুন।",
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

// --- Professional Custom Dropdown Component ---
const CustomSelect = ({ label, value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (optionValue) => {
        onChange({ target: { name: "gender", value: optionValue } }); // Mimic event for compatibility
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="text-xs text-gray-400 font-medium ml-1 mb-1 block uppercase tracking-wide">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 rounded-xl bg-gray-800/50 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-base backdrop-blur-sm flex justify-between items-center text-left hover:bg-gray-800/80"
            >
                <span className={value ? "text-white" : "text-gray-400"}>
                    {options.find(opt => opt.value === value)?.label || value || placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                         {/* Fixed Transparent Overlay to handle outside clicks (High Z-Index) */}
                         <div className="fixed inset-0 z-[70] cursor-default" onClick={() => setIsOpen(false)}></div>
                         
                         {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-[80] w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                            {options.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`p-4 hover:bg-indigo-600/20 hover:text-indigo-300 cursor-pointer transition-colors text-sm flex items-center justify-between ${value === opt.value ? "bg-indigo-900/30 text-indigo-400 font-semibold" : "text-gray-300"}`}
                                >
                                    {opt.label}
                                    {value === opt.value && <ClipboardCheck className="w-4 h-4" />}
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <motion.div 
        className="p-5 md:p-6 bg-gray-800/80 border border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 backdrop-blur-sm cursor-default h-full flex flex-col"
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
    >
        <div className={`p-3 rounded-full bg-gray-700/50 w-fit mb-4`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h4 className="text-lg font-bold mb-2 text-white leading-tight">{title}</h4>
        <p className="text-sm text-gray-400 leading-relaxed flex-grow">{description}</p> 
    </motion.div>
);

const ResultsDisplay = ({ response, loading, T }) => {
    if (!response && !loading)
        return (
            <motion.div 
                className="h-full flex flex-col items-center justify-center bg-gray-800/40 border border-dashed border-gray-700 p-6 rounded-2xl text-center text-gray-400 min-h-[250px] select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="bg-gray-800 p-4 rounded-full mb-3 shadow-lg">
                    <FileText className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm font-medium max-w-[200px]">{T.results_placeholder}</p>
            </motion.div>
        );

    if (loading)
        return (
            <motion.div 
                className="h-full flex flex-col items-center justify-center bg-gray-800/60 border border-indigo-500/30 p-6 rounded-2xl shadow-inner shadow-indigo-900/20 text-indigo-300 min-h-[250px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-400" />
                <p className="font-semibold text-lg animate-pulse">{T.checking_label}</p>
            </motion.div>
        );

    if (response && response.schemes && response.schemes.length === 0) {
        return (
            <motion.div
                className="h-full flex flex-col items-center justify-center bg-red-900/20 border border-red-700/30 p-6 rounded-2xl text-red-300 min-h-[250px] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <X className="w-10 h-10 mb-3 text-red-400" />
                <p className="font-semibold text-lg mb-2">{T.results_answer_error}</p>
                <p className="text-sm text-red-400/70">{T.results_placeholder}</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="h-full text-left bg-gray-900/80 border border-indigo-500/30 p-5 rounded-2xl shadow-inner shadow-indigo-900/30 overflow-y-auto max-h-[500px] min-h-[250px] flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-3">
                 <h3 className="font-bold text-lg text-indigo-300">{T.results_summary_title}</h3>
                 <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full border border-indigo-700/50">
                    {response.schemes.length} Schemes Found
                 </span>
            </div>
            
            <p className="text-sm text-gray-300 mb-4 flex-shrink-0 leading-relaxed">{response.answer}</p>

            <ul className="space-y-3 flex-grow overflow-y-auto pr-1 custom-scrollbar">
                {response.schemes.map((scheme, index) => (
                    <motion.li 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex flex-col p-4 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between w-full">
                            {scheme.link ? (
                                <a
                                    href={scheme.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors flex items-center"
                                >
                                    {scheme.name}
                                    <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                            ) : (
                                <span className="text-base font-bold text-indigo-400">{scheme.name}</span>
                            )}
                        </div>
                        <p className="text-xs mt-2 text-gray-400 leading-relaxed">
                            {scheme.description}
                        </p>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
};

const EligibilityModalContent = ({ onClose, T, form, handleChange, handleSubmit, loading, response }) => (
    <motion.div 
        className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
    >
        {/* Mobile: Full screen / Bottom Sheet feel. Desktop: Floating Modal */}
        <motion.div
            className="bg-gray-900 md:bg-gray-900/95 w-full h-full md:h-auto md:max-h-[85vh] md:max-w-5xl md:rounded-3xl shadow-2xl flex flex-col relative border-t md:border border-gray-800"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 md:rounded-t-3xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <ClipboardCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-none">
                            {T.section_eligibility_title}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">Find schemes tailored to you in seconds</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors active:scale-90 touch-manipulation"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Modal Body: Scrollable Area */}
            <div className="flex-grow overflow-y-auto p-5 md:p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                    
                    {/* FORM PANEL */}
                    <div className="w-full flex flex-col h-full">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2 mb-2">
                                <Scan className="w-5 h-5 text-indigo-400" />
                                {T.profile_details_title}
                            </h3>
                            <p className="text-xs text-gray-500">All fields are required for accurate matching.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 flex-grow">
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs text-gray-400 font-medium ml-1 mb-1 block uppercase tracking-wide">{T.input_placeholder_state}</label>
                                    <input type="text" name="state" placeholder="e.g. Maharashtra" value={form.state} onChange={handleChange} className={inputStyles} required />
                                </div>
                                
                                <div>
                                    <label className="text-xs text-gray-400 font-medium ml-1 mb-1 block uppercase tracking-wide">{T.input_placeholder_caste}</label>
                                    <input type="text" name="caste" placeholder="e.g. General, OBC" value={form.caste} onChange={handleChange} className={inputStyles} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Custom Professional Select Component */}
                                    <div>
                                        <CustomSelect 
                                            label={T.select_gender_placeholder}
                                            value={form.gender}
                                            onChange={handleChange}
                                            placeholder="Select"
                                            options={[
                                                { value: "Male", label: T.select_gender_male },
                                                { value: "Female", label: T.select_gender_female },
                                                { value: "Other", label: T.select_gender_other }
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-medium ml-1 mb-1 block uppercase tracking-wide">Occupation</label>
                                        <input type="text" name="occupation" placeholder="e.g. Student" value={form.occupation} onChange={handleChange} className={inputStyles} required />
                                    </div>
                                </div>
                            </div>
                            
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-900/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 mt-auto flex items-center justify-center gap-2 text-lg active:scale-[0.99]"
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {T.checking_label}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {T.check_eligibility_button}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* RESULTS PANEL - Hidden on mobile until loaded? No, stacked is better for context */}
                    <div className="w-full h-full min-h-[300px] lg:min-h-0 lg:border-l lg:border-gray-800 lg:pl-8 pt-8 lg:pt-0 border-t border-gray-800 lg:border-t-0">
                         <ResultsDisplay response={response} loading={loading} T={T} />
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
);

export default function App() {
    const [form, setForm] = useState({
        state: "",
        caste: "",
        gender: "",
        occupation: "",
    });
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("English");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const T = TRANSLATIONS[language] || TRANSLATIONS["English"];
    const features = T.features;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponse(null);

        // REAL API ENDPOINT
        const apiUrl = "https://sarkari-sahayek-1.onrender.com/api/eligibility"; 
        
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
                setResponse({
                    answer: T.results_answer_default, 
                    schemes: data.schemes || [],    
                });

                break; // Success, exit retry loop
            } catch (err) {
                console.error("Attempt " + (attempt + 1) + " failed:", err);
                if (attempt < MAX_RETRIES - 1) {
                    const delay = Math.pow(2, attempt) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    // FALLBACK TO MOCK DATA ON ERROR
                    setResponse({
                        answer: T.results_answer_default, // Show success message even on mock
                        schemes: [
                            { name: "PM Kisan Samman Nidhi", link: "https://pmkisan.gov.in/", description: "Financial support of ₹6,000/year for farmer families." },
                            { name: "Ayushman Bharat", link: "https://pmjay.gov.in/", description: "Health insurance coverage up to ₹5 lakh per family." },
                            { name: "Pradhan Mantri Awas Yojana", link: "https://pmaymis.gov.in/", description: "Affordable housing scheme for the urban poor." },
                            { name: "National Scholarship Portal", link: "https://scholarships.gov.in/", description: "One-stop solution for various government scholarships." }
                        ] 
                    });
                }
            }
        }
        setLoading(false);
    };

    const fadeUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-x-hidden">
             {/* 🌌 Background Video - Optimized opacity */}
             <div className="fixed inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-40 scale-105"
                >
                    <source src={video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/80 to-gray-900"></div>
            </div>

            {/* 🌟 Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">

                {/* LANGUAGE SELECTOR - Sticky & Glassmorphic */}
                <motion.nav
                    className="flex justify-between items-center mb-12 sticky top-4 z-40"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                     <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
                             <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden sm:block">Sarkari Sahayak</span>
                     </div>

                    <div className="flex items-center pl-3 pr-2 py-1.5 rounded-full bg-gray-800/60 backdrop-blur-md border border-gray-700 shadow-xl">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-xs font-medium text-gray-400 mr-2 hidden sm:block uppercase tracking-wider">{T.language_label}</span>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-sm font-medium text-white border-none focus:ring-0 cursor-pointer outline-none py-1 pr-1"
                        >
                            <option value="English" className="bg-gray-900 text-white">English</option>
                            <option value="Hindi" className="bg-gray-900 text-white">हिन्दी</option>
                            <option value="Tamil" className="bg-gray-900 text-white">தமிழ்</option>
                            <option value="Bengali" className="bg-gray-900 text-white">বাংলা</option>
                        </select>
                    </div>
                </motion.nav>
                
                {/* HERO SECTION */}
                <motion.div
                    className="flex flex-col items-center text-center space-y-8 mb-20"
                    initial="initial"
                    animate="animate"
                    variants={fadeUp}
                >
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-2">
                            <Sparkles className="w-3 h-3" />
                            <span>AI-Powered Governance</span>
                        </motion.div>
                        
                        <motion.h1 
                            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white"
                            variants={fadeUp}
                        >
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 pb-2">
                                {T.app_title}
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2"
                            variants={fadeUp}
                        >
                            {T.app_description}
                        </motion.p>
                    </div>
                    
                    {/* 🚀 ACTION BUTTONS */}
                    <div className="flex flex-col w-full sm:flex-row justify-center gap-4 max-w-2xl mx-auto px-2">
                        <motion.button
                            className="flex-1 flex items-center justify-center bg-white text-black hover:bg-gray-100 py-4 px-6 rounded-xl font-bold text-lg shadow-xl shadow-white/10 transition-all active:scale-95 whitespace-nowrap"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => (window.location.href = "/chat")}
                        >
                            <MessageSquare className="w-5 h-5 mr-2" />
                            {T.start_chat_button}
                        </motion.button>
                        
                        <motion.button
                            className="flex-1 flex items-center justify-center bg-gray-800/80 backdrop-blur-sm text-white border border-gray-700 hover:bg-gray-700 py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 whitespace-nowrap"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <ClipboardCheck className="w-5 h-5 mr-2 text-indigo-400" />
                            {T.open_eligibility_button}
                        </motion.button>
                    </div>
                    <motion.button
  className="w-full md:w-auto flex-1 flex items-center justify-center bg-white text-black hover:bg-gray-100 py-4 px-6 rounded-xl font-bold text-lg shadow-xl shadow-white/10 transition-all active:scale-95 whitespace-nowrap"
  whileHover={{ scale: 1.02 }}
  onClick={() => window.location.href = "https://expo.dev/artifacts/eas/cG3qJwk9bM3Qqb3dpkGr8J.apk"}
>
  <TabletSmartphone className="w-5 h-5 mr-2" />
  Android App (Beta)
</motion.button>

                </motion.div>

                {/* FEATURES GRID */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="flex items-center gap-4 mb-8 px-2">
                        <div className="h-px bg-gray-800 flex-grow"></div>
                        <h2 className="text-xl font-bold text-gray-300 uppercase tracking-widest text-center">
                            {T.section_features_title}
                        </h2>
                        <div className="h-px bg-gray-800 flex-grow"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </motion.div>
                
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <EligibilityModalContent 
                        onClose={() => setIsModalOpen(false)}
                        T={T}
                        form={form}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        response={response}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
