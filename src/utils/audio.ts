export const playAudio = (word: string) => {
  const cleanWord = word.replace(/[^a-zA-Z\s-]/g, '').trim();
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  
  // Use Youdao TTS for WeChat Mini-Program Webview or if speechSynthesis is unsupported
  if (isWeChat || !('speechSynthesis' in window)) {
    const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(cleanWord)}&type=1`);
    audio.play().catch(e => console.error('Audio play failed:', e));
    return;
  }
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanWord);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en-') && !v.localService) || 
                       voices.find(v => v.lang.startsWith('en-'));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  
  (window as any)._currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};
