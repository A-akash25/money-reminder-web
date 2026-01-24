import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LangContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<string, Record<Language, string>> = {
  "app.title": {
    en: "Money Reminders",
    hi: "पैसे के रिमाइंडर"
  },
  "stats.total_pending": {
    en: "Total Pending",
    hi: "कुल बकाया"
  },
  "btn.add_reminder": {
    en: "Add Reminder",
    hi: "रिमाइंडर जोड़ें"
  },
  "btn.edit": {
    en: "Edit",
    hi: "संपादित करें"
  },
  "btn.delete": {
    en: "Delete",
    hi: "हटाएं"
  },
  "btn.save": {
    en: "Save Reminder",
    hi: "रिमाइंडर सहेजें"
  },
  "btn.cancel": {
    en: "Cancel",
    hi: "रद्द करें"
  },
  "label.name": {
    en: "Person Name",
    hi: "व्यक्ति का नाम"
  },
  "label.phone": {
    en: "Phone Number",
    hi: "फ़ोन नंबर"
  },
  "label.amount": {
    en: "Amount",
    hi: "रकम"
  },
  "label.due_date": {
    en: "Due Date",
    hi: "नियत तारीख"
  },
  "status.paid": {
    en: "Paid",
    hi: "भुगतान किया"
  },
  "status.unpaid": {
    en: "Unpaid",
    hi: "बकाया"
  },
  "msg.whatsapp_template": {
    en: "Hi {name}, friendly reminder for payment of {amount} due on {date}.",
    hi: "नमस्ते {name}, {amount} का भुगतान {date} तक बाकी है।"
  },
  "empty.title": {
    en: "No reminders yet",
    hi: "अभी कोई रिमाइंडर नहीं"
  },
  "empty.subtitle": {
    en: "Add your first payment reminder to get started",
    hi: "शुरू करने के लिए अपना पहला भुगतान रिमाइंडर जोड़ें"
  }
};

const LangContext = createContext<LangContextType | undefined>(undefined);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("app_lang") as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[key]?.[language] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LangContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within a LangProvider");
  return context;
}
