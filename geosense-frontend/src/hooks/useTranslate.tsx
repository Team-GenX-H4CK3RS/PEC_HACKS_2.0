"use client";

const baseURL = "http://192.168.248.44:5500";

export type LanguageItem = [string, string];

export type TranslationResult = {
  audio: string;
  result: string;
  lang: string;
};

export default function useTranslate() {
  const fetchData = async (url, options = {}) => {
    const response = await fetch(baseURL + url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  const getLanguages = async () => {
    return await fetchData(`/languages`);
  };

  const translate = async (langCode: string, text: string) => {
    const response = await fetch(`${baseURL}/translate`, {
      body: JSON.stringify({ text, lang_code: langCode }),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return (await response.json()) as TranslationResult;
  };

  return {
    getLanguages,
    translate,
  };
}
