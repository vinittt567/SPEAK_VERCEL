import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ks';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.chatbot': 'Chatbot',
    'nav.booking': 'Booking',
    'nav.resources': 'Resources',
    'nav.forum': 'Forum',
    'nav.gamification': 'Gamification',
    'nav.talkNow': 'Talk now',
    
    // Home page
    'home.badge': 'Student Mental Wellness',
    'home.title': 'Support when you need it—private, fast, and caring.',
    'home.description': 'Chat with our AI first-aid bot, book a counselor, explore coping tools, or connect with peers. Anonymous by default. Your privacy is protected.',
    'home.startChat': 'Start Chat',
    'home.bookCounselor': 'Book Counselor',
    'home.privacy': 'Pseudonym only. No names required.',
    'home.quickHelp': 'Get help in 2 taps',
    'home.quickHelpDesc': 'Open chat, pick a quick reply, and breathe. We guide you step-by-step.',
    'home.quickBook': 'Book in under 30s',
    'home.quickBookDesc': 'Filter by language and specialty. Pick a time. Get reminders.',
    'home.language': 'Language',
    'home.privacyText': 'We respect your privacy. Conversations are anonymous and stored securely for quality and safety. By continuing, you agree to our privacy policy and consent to non-identifiable data use for improvement.',
    'home.consent': 'I understand and consent',
    
    // Languages
    'lang.english': 'English',
    'lang.hindi': 'हिन्दी',
    'lang.kashmiri': 'کٲشُر'
  },
  hi: {
    // Header
    'nav.home': 'होम',
    'nav.chatbot': 'चैटबॉट',
    'nav.booking': 'बुकिंग',
    'nav.resources': 'संसाधन',
    'nav.forum': 'फोरम',
    'nav.gamification': 'गेमिफिकेशन',
    'nav.talkNow': 'अभी बात करें',
    
    // Home page
    'home.badge': 'छात्र मानसिक कल्याण',
    'home.title': 'जब आपको जरूरत हो तो सहायता—निजी, तेज़, और देखभाल के साथ।',
    'home.description': 'हमारे AI प्राथमिक चिकित्सा बॉट से चैट करें, काउंसलर बुक करें, मुकाबला करने के उपकरण खोजें, या साथियों से जुड़ें। डिफ़ॉल्ट रूप से गुमनाम। आपकी गोपनीयता सुरक्षित है।',
    'home.startChat': 'चैट शुरू करें',
    'home.bookCounselor': 'काउंसलर बुक करें',
    'home.privacy': 'केवल छद्म नाम। नाम की आवश्यकता नहीं।',
    'home.quickHelp': '2 टैप में मदद पाएं',
    'home.quickHelpDesc': 'चैट खोलें, त्वरित उत्तर चुनें, और सांस लें। हम आपको चरण-दर-चरण मार्गदर्शन देते हैं।',
    'home.quickBook': '30 सेकंड से कम में बुक करें',
    'home.quickBookDesc': 'भाषा और विशेषता के अनुसार फ़िल्टर करें। समय चुनें। रिमाइंडर पाएं।',
    'home.language': 'भाषा',
    'home.privacyText': 'हम आपकी गोपनीयता का सम्मान करते हैं। बातचीत गुमनाम हैं और गुणवत्ता और सुरक्षा के लिए सुरक्षित रूप से संग्रहीत हैं। जारी रखकर, आप हमारी गोपनीयता नीति से सहमत हैं और सुधार के लिए गैर-पहचान योग्य डेटा उपयोग की सहमति देते हैं।',
    'home.consent': 'मैं समझता हूं और सहमति देता हूं',
    
    // Languages
    'lang.english': 'English',
    'lang.hindi': 'हिन्दी',
    'lang.kashmiri': 'کٲشُر'
  },
  ks: {
    // Header
    'nav.home': 'گھر',
    'nav.chatbot': 'چیٹ بوٹ',
    'nav.booking': 'بکنگ',
    'nav.resources': 'وسائل',
    'nav.forum': 'فورم',
    'nav.gamification': 'گیمیفیکیشن',
    'nav.talkNow': 'ہنز کتھ کرو',
    
    // Home page
    'home.badge': 'طالب علم ذہنی بہبود',
    'home.title': 'جدوں توہیں ضرورت چھ تدوں مدد—نجی، تیز، تہ خیال رکھنہ سان۔',
    'home.description': 'اسہ AI ابتدائی طبی امداد بوٹ سان چیٹ کرو، کاؤنسلر بک کرو، مقابلہ کرنہ کہ آلات تلاش کرو، یا ساتھیو سان رابطہ کرو۔ ڈیفالٹ طور پر گمنام۔ تہنز رازداری محفوظ چھ۔',
    'home.startChat': 'چیٹ شروع کرو',
    'home.bookCounselor': 'کاؤنسلر بک کرو',
    'home.privacy': 'صرف چھپ ناو۔ ناو کی ضرورت نہ۔',
    'home.quickHelp': '2 ٹیپ منز مدد حاصل کرو',
    'home.quickHelpDesc': 'چیٹ کھولو، جلدی جواب ژارو، تہ سانس نیو۔ اسہ توہیں قدم بہ قدم رہنمائی دیوان۔',
    'home.quickBook': '30 سیکنڈ کم منز بک کرو',
    'home.quickBookDesc': 'زبان تہ خصوصیت کہ مطابق فلٹر کرو۔ وقت ژارو۔ یاد دہانی حاصل کرو۔',
    'home.language': 'زبان',
    'home.privacyText': 'اسہ تہنز رازداری کا احترام کروان۔ گفتگو گمنام چھ تہ معیار تہ حفاظت کہ لئی محفوظ طریقہ سان محفوظ کرنہ یوان۔ جاری رکھ کہ، تمہ اسہ رازداری کی پالیسی سان اتفاق کروتھ تہ بہتری کہ لئی غیر شناختی ڈیٹا استعمال کی رضامندی دیوتھ۔',
    'home.consent': 'میں سمجھان تہ رضامندی دیان',
    
    // Languages
    'lang.english': 'English',
    'lang.hindi': 'हिन्दी',
    'lang.kashmiri': 'کٲشُر'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const saved = localStorage.getItem('speak-language') as Language;
    return saved && ['en', 'hi', 'ks'].includes(saved) ? saved : 'en';
  });

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem('speak-language', language);
    // Set document language attribute for accessibility
    document.documentElement.lang = language === 'ks' ? 'ks-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};