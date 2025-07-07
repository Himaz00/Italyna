// Made by Ayham Zedan
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'AR' },
  { code: 'ru', label: 'RU' },
  { code: 'hi', label: 'HI' },
  { code: 'pt', label: 'PT' },
  { code: 'ja', label: 'JA' },
];

// LanguageSwitcher: Dropdown to select the current language
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <select
      className="ml-2 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring focus:border-primary text-sm"
      value={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value)}
      aria-label="Select language"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>{lang.label}</option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
