// these line are added in javascript file
import { textToSpeechEng } from './speak.js';

//toggle theme
themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
    themeBtn.innerText = (cur === 'dark' ? '🌙dark' : '☀️light');
});