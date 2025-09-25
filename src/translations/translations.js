export const translations = {
  'pt-BR': {
    header: {
      quote: '"tudo que vejo são formas e cores"',
    },
  },
  'en': {
    header: {
      quote: '"shapes and colors are all I see"',
    },
  }
};

// Helper function to get translation
export function getTranslation(language, key) {
  const keys = key.split('.');
  let translation = translations[language];
  
  for (const k of keys) {
    translation = translation?.[k];
  }
  
  return translation || key;
}