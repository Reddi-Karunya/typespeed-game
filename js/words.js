// js/words.js
// Word lists for different game modes

const WORD_LISTS = {

  normal: [
    'the','be','to','of','and','a','in','that','have','it','for','not','on','with',
    'he','as','you','do','at','this','but','his','by','from','they','we','say','her',
    'she','or','an','will','my','one','all','would','there','their','what','so','up',
    'out','if','about','who','get','which','go','me','when','make','can','like','time',
    'no','just','him','know','take','people','into','year','your','good','some','could',
    'them','see','other','than','then','now','look','only','come','its','over','think',
    'also','back','after','use','two','how','our','work','first','well','way','even',
    'new','want','because','any','these','give','day','most','us','great','between',
    'need','large','often','hand','high','place','hold','turn','become','story','world',
    'every','near','add','food','below','country','plant','last','school','father','keep',
    'children','feet','land','side','without','boy','once','animal','life','enough',
    'took','sometimes','four','head','above','kind','began','almost','live','page','got',
    'earth','light','voice','power','town','find','long','down','day','did','man',
    'old','walk','same','three','small','set','put','end','does','another','well',
    'large','big','ask','play','read','write','help','mean','move','try','change',
    'point','play','spell','home','read','hand','port','large','spell','add','even',
    'land','here','must','big','high','such','follow','act','why','ask','men',
    'let','point','old','want','show','form','sentence','line','around'
  ],

  punctuation: [
    'function','return','const','let','var','if','else','for','while','class',
    'import','export','async','await','true','false','null','undefined','new',
    'this','typeof','instanceof','try','catch','throw','break','continue',
    'switch','case','default','delete','void','yield','static','super','extends',
    'interface','type','string','number','boolean','array','object','promise',
    'callback','event','handler','module','require','export','default','arrow',
    'spread','rest','destruct','template','literal','optional','chain','nullish',
    'coalesce','getter','setter','proxy','reflect','symbol','bigint','iterator',
    'generator','decorator','mixin','singleton','factory','observer','reduce',
    'filter','map','find','some','every','flat','slice','splice','push','pop',
    'shift','unshift','join','split','trim','replace','includes','indexOf',
    'forEach','then','catch','finally','resolve','reject','fetch','parse','JSON',
    'console','log','error','warn','debug','assert','setTimeout','setInterval',
    'clearTimeout','clearInterval','promise','async','await','throw','new','Error'
  ],

  numbers: [
    'zero','one','two','three','four','five','six','seven','eight','nine','ten',
    'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen',
    'eighteen','nineteen','twenty','thirty','forty','fifty','sixty','seventy',
    'eighty','ninety','hundred','thousand','million','billion','trillion',
    'first','second','third','fourth','fifth','sixth','seventh','eighth',
    'ninth','tenth','eleventh','twelfth','dozen','score','gross','prime',
    'even','odd','half','double','triple','quadruple','quarter','percent',
    'ratio','fraction','decimal','binary','hexadecimal','octal','integer',
    'float','positive','negative','infinite','finite','absolute','relative',
    'mean','median','mode','range','sum','product','quotient','remainder',
    'factor','multiple','divisor','prime','composite','square','cube','root',
    'power','exponent','logarithm','sine','cosine','tangent','pi','tau',
    'phi','epsilon','delta','sigma','omega','alpha','beta','gamma','theta'
  ]

};

/**
 * Get a random selection of words for a given difficulty.
 * @param {string} diff - 'normal' | 'punctuation' | 'numbers'
 * @param {number} count - how many words to return (default 100)
 * @returns {string[]}
 */
function getWordList(diff = 'normal', count = 100) {
  const list = WORD_LISTS[diff] || WORD_LISTS.normal;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(list[Math.floor(Math.random() * list.length)]);
  }
  return result;
}
