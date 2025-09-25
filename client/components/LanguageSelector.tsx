import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'compact';
}

export function LanguageSelector({ 
  className = "", 
  showLabel = true, 
  variant = 'default' 
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { value: 'en', label: t('lang.english'), nativeLabel: 'English' },
    { value: 'hi', label: t('lang.hindi'), nativeLabel: 'हिन्दी' },
    { value: 'ks', label: t('lang.kashmiri'), nativeLabel: 'کٲشُر' }
  ];

  if (variant === 'compact') {
    return (
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'ks')}>
        <SelectTrigger className={`w-[120px] ${className}`}>
          <Globe className="h-4 w-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.nativeLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 justify-between ${className}`}>
      {showLabel && (
        <div className="flex items-center gap-2 text-sm">
          <Globe className="h-4 w-4"/>
          <span>{t('home.language')}</span>
        </div>
      )}
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi' | 'ks')}>
        <SelectTrigger className="w-[180px] rounded-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.nativeLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}