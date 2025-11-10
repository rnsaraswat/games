export function textToSpeechEng(text) {
    let speechSynthesis = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
    utterance.text = text;
    speechSynthesis.speak(utterance);
}
    