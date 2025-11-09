// these line are added in javascript file in which speak sound reauired
// import { textToSpeechEng } from './speak.js';

// to call for speak use this javascript file where speak is requied
// textToSpeechEng('text to be speak');

// para to speeach in english
export function textToSpeechEng(text) {
    let speechSynthesis = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
    utterance.text = text;
    speechSynthesis.speak(utterance);
}
    