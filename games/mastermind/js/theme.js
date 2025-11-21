import { textToSpeechEng } from './speak.js';

//toggle theme
const themeToggle = document.getElementById('toggle-theme');
function setTheme(t) {
  if (t === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('rg_theme', t);
    themeToggle.textContent = '☀️ Light'
  }
  if (t === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('rg_theme', t);
    themeToggle.textContent = '🌙 Dark'
  }
}
if (themeToggle) themeToggle.addEventListener('click', () => setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'light' : 'dark'));
setTheme(localStorage.getItem('rg_theme') === 'dark' ? 'dark' : 'light');