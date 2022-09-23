// Application data

const siteLanguages = ['en', 'de', 'fr', 'tr'];

var lang = null;
if(window.navigator.language){
const browserLang = window.navigator.language.split('-')[0];
for (let j = 1; j < siteLanguages.length; j++) {
  const siteLang = siteLanguages[j];
  if(siteLang === browserLang){
    lang = siteLang;
    break;
  }
}
}else if(window.navigator.languages){
for (let i = 0; i < window.navigator.languages.length; i++) {
  const browserLang = window.navigator.languages[i].split('-')[0];
  for (let j = 1; j < siteLanguages.length; j++) {
    const siteLang = siteLanguages[j];
    if(siteLang === browserLang){
      lang = siteLang;
      break;
    }
  }
  if(lang)break;
}
}else if(window.navigator.userLanguage){
const browserLang = window.navigator.userLanguage.split('-')[0];
for (let j = 1; j < siteLanguages.length; j++) {
  const siteLang = siteLanguages[j];
  if(siteLang === browserLang){
    lang = siteLang;
    break;
  }
}
}else if(window.navigator.browserLanguage){
const browserLang = window.navigator.browserLanguage.split('-')[0];
for (let j = 1; j < siteLanguages.length; j++) {
  const siteLang = siteLanguages[j];
  if(siteLang === browserLang){
    lang = siteLang;
    break;
  }
}
}else if(window.navigator.systemLanguage){
const browserLang = window.navigator.systemLanguage.split('-')[0];
for (let j = 1; j < siteLanguages.length; j++) {
  const siteLang = siteLanguages[j];
  if(siteLang === browserLang){
    lang = siteLang;
    break;
  }
}
}
if(!lang)lang=siteLanguages[0];

console.log(`lang: ${lang}`);

window.location.assign(`/build/shop.demo.qworum.net/check-qworum-availability-${lang}.html`);
