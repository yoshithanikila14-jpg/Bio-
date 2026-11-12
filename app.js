
// Register Progressive Web App (PWA) Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Apex Biology PWA Service Worker Registered!'))
      .catch(err => console.warn('SW registration failed:', err));
  });
}

// ==========================================================================
// APEX BIOLOGY - INTERACTIVE APPLICATION CONTROLLER
// Theme: Emerald Green A/L Biology Portal
// Live Clock • Dynamic Greeting • Unique Student ID • Sidebar Navigation
// National A/L Biology Syllabus Tracker • 3-Step Clean Flow (Muthugala & Sasanka)
// Bio Bank • Anti-Extraction Secure YouTube Video Player
// ==========================================================================

let currentStudent = null;
let clockTimer = null;

// Global Toast Notification Helper
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  let icon = '<i class="fa-solid fa-circle-info"></i>';
  const str = String(message || '');
  if (str.includes('🎉') || str.includes('විශිෂ්ටයි') || str.includes('සාදරයෙන්') || str.includes('Success')) {
    icon = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i>';
  } else if (str.includes('⚠️') || str.includes('වැරදි') || str.includes('Error') || str.includes('අත්හිටුවා')) {
    icon = '<i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b;"></i>';
  } else if (str.includes('🔒') || str.includes('Locked')) {
    icon = '<i class="fa-solid fa-lock" style="color: #ef4444;"></i>';
  }

  toast.innerHTML = `${icon} <span>${str}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}
window.showToast = showToast;

// ==========================================================================
// 1. NATIONAL A/L BIOLOGY SYLLABUS DATA (All 10 Units & Sub-topics)
// Transcribed 100% accurately from National Syllabus & User Uploaded Images
// ==========================================================================
const SYLLABUS_DATA = [
  {
    id: 'u1',
    number: '01',
    icon: 'fa-seedling',
    title: 'Unit 01: ජීව විද්‍යාව හැඳින්වීම',
    englishTitle: 'Introduction to Biology',
    topics: [
      'ජීව විද්‍යාව හැඳින්වීම සහ ජීවයේ ලක්ෂණ',
      'ජීව විද්‍යාවේ විෂය පථය සහ වැදගත්කම',
      'විද්‍යාත්මක ක්‍රමය සහ පරීක්ෂණාත්මක විමර්ශන'
    ]
  },
  {
    id: 'u2',
    number: '02',
    icon: 'fa-atom',
    title: 'Unit 02: ජීවයේ රසායනික සහ සෛලීය පදනම',
    englishTitle: 'Chemical and Cellular Basis of Life',
    topics: [
      'සෛලීය පදනම හා ජලය',
      'කාබෝහයිඩ්‍රේට',
      'ලිපිඩ',
      'ප්‍රෝටීන',
      'DNA හා RNA',
      'අන්වීක්ෂ',
      'ප්ලාස්ම පටලය',
      'උපසෛලීය සංඝටක',
      'සෛල චක්‍රය-අනූනනය',
      'ඌනනය',
      'අර්බුද, ගෙඩි, පිළිකා',
      'පරිවෘත්තීය ක්‍රියාවල ශක්ති සම්බන්ධතා',
      'එන්සයිමවල කාර්යය හා ලක්ෂණ',
      'එන්සයිම ක්‍රියාවේ යාන්ත්‍රණය',
      'සහ සාධක',
      'එන්සයිමීය ප්‍රතික්‍රියාවට බලපාන සාධක',
      'නිෂේධක',
      'ඇලොස්ටරික යාමනය',
      'ප්‍රභාසංශ්ලේෂණය හැඳින්වීම',
      'ආලෝක ප්‍රතික්‍රියාව',
      'අඳුරු ප්‍රතික්‍රියාව (කැල්වින් චක්‍රය)',
      'ප්‍රභාශ්වසනය',
      'C3 ශාක හා C4 ශාක',
      'C4 පථය',
      'වර්ණාවලි හා ප්‍රභාසංශ්ලේෂණයට බලපාන සාධක',
      'ස්වායු ශ්වසනය',
      'නිර්වායු ශ්වසනය',
      'ශ්වසන ලබ්ධිය',
      'practicals'
    ]
  },
  {
    id: 'u3',
    number: '03',
    icon: 'fa-tree',
    title: 'Unit 03: පරිණාමය සහ ජෛව විවිධත්වය',
    englishTitle: 'Evolution and Biodiversity',
    topics: [
      'පෘථිවියේ බිහිවීම හා ජෛව විවිධත්වයේ පරිණාමය',
      'ජීවී වර්ගීකරණය',
      'ආකියා අධිරාජධානිය',
      'බැක්ටීරියා අධිරාජධානිය',
      'යුකැරියා අධිරාජධානිය-ප්‍රොටිස්ටා රාජධානිය',
      'ශාක ජීවන චක්‍ර-Pogonatum ජීවන චක්‍රය',
      'Neprolepis ජීවන චක්‍රය',
      'Sellaginella ජීවන චක්‍රය',
      'Cycus ජීවන චක්‍රය',
      'Anthopyta ජීවන චක්‍රය',
      'ශාක වර්ගීකරණය',
      'දිලීර රාජධානිය',
      'ඇනිමාලියා වංශ 8',
      'කෝඩේටා වංශය'
    ]
  },
  {
    id: 'u4',
    number: '04',
    icon: 'fa-leaf',
    title: 'Unit 04: ශාක ආකාරය සහ ක්‍රියාකාරීත්වය',
    englishTitle: 'Plant Form and Function',
    topics: [
      'විභාජක පටක',
      'ශාක කඳේ ප්‍රාථමික වර්ධනය',
      'ශාක මුලේ ප්‍රාථමික වර්ධනය',
      'ශාක පටක පද්ධති-චර්මීය පටක පද්ධතිය',
      'පූරක පටක පද්ධතිය',
      'සනාල පටක පද්ධතිය',
      'ශාක කඳේ ප්‍රාථමික ව්‍යුහය',
      'ශාක මුලේ ප්‍රාථමික ව්‍යුහය',
      'ශාක කඳේ ද්විතියික වර්ධනය',
      'ශාක මුලේ ද්විතියික වර්ධනය',
      'කාෂ්ඨය',
      'වර්ධක වල',
      'ආලෝක අධිග්‍රහණය',
      'ශාක පත්‍රවල ව්‍යුහය',
      'පූටිකා- K+ සාන්ද්‍රණ කල්පිතය',
      'පූටිකා ක්‍රියාකාරිත්වයට බලපාන සාධක',
      'ජලය හා ද්‍රව්‍ය පරිවහනය වන ක්‍රම',
      'ජල විභවය',
      'ද්‍රාව්‍ය විභවය',
      'ශාක සෛලයක සෛලයේ ජලය ගමන් කරන මාර්ග',
      'ශාක මුල් වලට ජලය අවශෝෂණය වන ක්‍රමවේදය',
      'රසෝද්ගමනය',
      'උත්ස්වේදනය',
      'උත්ස්වේදනයට බලපාන සාධක හා වැදගත්කම',
      'උත්ස්වේදන ක්‍රියාව මැනීම-practical',
      'මූල පීඩනය හා බිංදුදය',
      'ප්ලෝයම පරිවහනය',
      'ශාක පෝෂණය',
      'ශාක පෝෂක ඌනතා ලක්ෂණ',
      'ශාක වල අණුක පෝෂක අවශෝෂණය',
      'පසේ හා මුල් වල සබඳතා',
      'ශාක ආලෝක ප්‍රතිචාර-දීප්ති කාලීනතාව',
      'ශාක හෝමෝන',
      'ඔක්සින්',
      'ගිබරලින්',
      'සයිටොකයනින්',
      'ඇබ්සිසික් අම්ලය(ABA)',
      'එතිලීන්',
      'ශාක ප්‍රජනනය-අලිංගික ප්‍රජනනය',
      'ලිංගික ප්‍රජනනය',
      'Practicals'
    ]
  },
  {
    id: 'u5',
    number: '05',
    icon: 'fa-heart-pulse',
    title: 'Unit 05: සත්ව ආකාරය සහ ක්‍රියාකාරීත්වය',
    englishTitle: 'Animal Form and Function',
    topics: [
      "අපිච්ඡද පටකය",
      "සරල අපිච්ඡද",
      "සංයුක්ත අපිච්ඡද",
      "පේශි පටකය",
      "සම්බන්ධක පටකය",
      "අරියල පටකය",
      "තන්තුමය පටකය",
      "මේද පටකය",
      "රුධිරය",
      "කාටිලේජ",
      "අස්ථි",
      "ස්නායු පටකය",
      "සංසරණ පද්ධතිය හැඳින්වීම",
      "විවෘත සංසරණ පද්ධතිය",
      "සංවෘත සංසරණ පද්ධතිය",
      "ඒක සංසරණය සහ ද්විත්ව සංසරණය",
      "මානව සංසරණ පද්ධතියේ මූලික සැලැස්ම",
      "මානව හෘදයේ ව්‍යුහය හා කෘත්‍යය",
      "හෘද් බිත්තිය",
      "හෘදයේ සන්නායක පද්ධතිය",
      "හෘත් චක්‍රය",
      "විද්‍යුත් කන්තුක රේඛනය(ECG)",
      "රුධිර පීඩනය",
      "අධිරුධිර පීඩනය හා මන්දරක්තතාවය",
      "කිරීටක සංසරණය",
      "ශ්වසන වර්ණක",
      "මානව රුධිරයේ ශ්වසන වායු පරිවහනය",
      "මානව රුධිරයේ සංයුතිය හා කෘත්‍යය",
      "රුධිරය කැටි ගැසීම",
      "රුධිර ගිණීම හා කාණ්ඩ කිරීම",
      "රීසස් පද්ධතිය",
      "මානව වසා පද්ධතිය",
      "ශ්වසනය හැඳින්වීම හා සතුන්ගේ විවිධ ශ්වසන ව්‍යුහ",
      "මානව ශ්වසන පද්ධතියේ ව්‍යුහය හා කෘත්‍යය",
      "ශ්වසන චක්‍රය",
      "පෙණහළු පරිමා හා ධාරිතා",
      "ගර්තවල හා පටක වල සිදුවන වායු හුවමාරුව",
      "බාහිර ශ්වසනය",
      "අභ්‍යන්තර ශ්වසනය",
      "ආශ්වාස ප්‍රාශ්වාස ක්‍රියාවලියේ සමස්ථිතික යාමනය",
      "ශ්වසන පද්ධතියේ ආබාධ",
      "ප්‍රතිශක්තිය හැඳින්වීම",
      "සහජ ප්‍රතිශක්තිය - බාහිර ආරක්ෂණය",
      "සහජ ප්‍රතිශක්තිය - අභ්‍යන්තර ආරක්ෂණය",
      "ප්‍රතික්ෂුද්‍රජීවී ප්‍රෝටීන",
      "ප්‍රදාහක ප්‍රතිචාරය",
      "පරිචිත ප්‍රතිශක්තිය",
      "පරිචිත ප්‍රතිශක්තියේදී T වසා සෛල හා B වසා සෛලවල කාර්ය භාරය",
      "පරිචිත ප්‍රතිශක්ති ආකාර",
      "ප්‍රතිදේහ",
      "සක්‍රීය ප්‍රතිශක්තිය",
      "අක්‍රීය ප්‍රතිශක්තිය",
      "ආසාත්මිකතා",
      "ස්වයං ප්‍රතිශක්ති රෝග",
      "ප්‍රතිශක්ති ඌනතා රෝග",
      "ආස්‍රැති විධානය හා බහිස්ස්‍රාවය",
      "නයිට්‍රජනීය බහිස්ස්‍රාවීය ඵල",
      "සතුන්ගේ බහිස්ස්‍රාවීය ව්‍යුහ",
      "වෘක්ක",
      "වෘක්කාණුවක ව්‍යුහය",
      "වෘක්කාණුවේ රුධිර කේශනාලිකා දැල(ගුච්ඡිකාව)",
      "වෘක්කාණු වර්ග",
      "මුත්‍ර සෑදීමේ ක්‍රියාවලියට අයත් ප්‍රධාන පියවර",
      "මුත්‍රා සෑදීමේ ක්‍රියාවලිය",
      "වෘක්ක ක්‍රියාකාරීත්වය කෙරෙහි හෝමෝන වල දායකත්වය",
      "සමස්ථිතියේදී වෘක්ක වල කාර්යභාරය",
      "මානව මුත්‍ර පද්ධතිය ආශ්‍රිත ආබාධ",
      "සමායෝජනය හැඳින්වීම",
      "මධ්‍ය ස්නායු පද්ධතිය",
      "පූර්ව මොළය",
      "මධ්‍ය මොළය",
      "අපර මොළය",
      "සුෂුම්නාව",
      "පර්යන්ත ස්නායු පද්ධතිය",
      "ස්වයං සාධක ස්නායු පද්ධතිය",
      "ස්නායු ආවේග උත්පාදනය හා සම්ප්‍රේෂණය",
      "අක්‍රිය විභවය",
      "ක්‍රියා විභවය",
      "ස්නායු තන්තුවක් ඔස්සේ ආවේග සන්නයනය",
      "උපාගමය",
      "රසායනික උපාගම හරහා ස්නායු ආවේගයක් සම්ප්‍රේෂණය වීමේ යාන්ත්‍රණය",
      "ස්නායු සම්ප්‍රේෂක",
      "ප්‍රතීක ක්‍රියා",
      "ස්නායු පද්ධතිය හා සම්බන්ධ පොදු ආබාධ",
      "මානව සංවේදක ව්‍යුහ හා ක්‍රියාකාරීත්වය",
      "සංවේදී ප්‍රතිග්‍රාහක වර්ග",
      "මිනිස් ඇසේ මූලික ව්‍යුහය",
      "ආලෝක සංවේදී සෛල",
      "මිනිස් ඇසේ ක්‍රියාකාරීත්වය",
      "මිනිසාගේ දෘෂ්ටික දෝෂ හා දෘෂ්ටික ආබාධ",
      "ඇසේ දෘෂ්ටිය",
      "මිනිස් කන (බාහිර කන හා මැද කන)",
      "ඇතුළු කන",
      "මිනිස් කනේ ශ්‍රවණ ක්‍රියාව",
      "මිනිස් කනේ සමතුලිත ක්‍රියාව",
      "මිනිස් කනේ ආබාධ",
      "මානව අන්තරාසර්ග පද්ධතිය හැඳින්වීම",
      "පිටියුටරි ග්‍රන්ථිය",
      "තයිරොයිඩ් ග්‍රන්ථිය",
      "පැරාතයිරොයිඩ් ග්‍රන්ථිය",
      "අධිවෘක්ක බාහිකය,මජ්ජාව,අග්න්‍යාශයේ දීපිකා",
      "ඩිම්බකෝෂ ග්‍රන්ථිය",
      "අන්තරාසර්ග පද්ධතියේ ආබාධ",
      "ගෝනැඩ",
      "අන්තරාසර්ග පද්ධතිය හා සම්බන්ධ ප්‍රතිපෝෂි යාන්ත්‍රණ",
      "මිනිසාගේ අන්තරා සර්ග ආබාධ",
      "සමස්ථිතිය හැඳින්වීම",
      "දේහ උෂ්ණත්වය සමස්ථිතික යාමනය",
      "රුධිර ග්ලුකෝස් මට්ටම සමස්ථිතික යාමනය",
      "කැල්සියම් විධානය",
      "සමස්ථිතිය තුළ අක්මාවේ කාර්යභාරය",
      "ප්‍රජනනය හැඳින්වීම හා අලිංගික ප්‍රජනනය",
      "ලිංගික ප්‍රජනනය",
      "පුරුෂ ප්‍රජනක පද්ධතියේ ව්‍යුහය",
      "ශුක්‍රාණු ජනනය",
      "ශුක්‍රාණුවක ව්‍යුහය",
      "ශුක්‍ර තරලය/ශුක්‍රාණු තරලය හා පුරුෂ ප්‍රජනක පද්ධතියේ හෝමෝනමය පාලනය",
      "පුරුෂ ප්‍රජනක පද්ධතියේ හෝමෝනමය පාලනය",
      "ස්ත්‍රී ප්‍රජනක පද්ධතියේ ව්‍යුහය",
      "ඩිම්බකෝෂජනනය (ඩිම්බජනනය)",
      "ස්ත්‍රී ප්‍රජනක චක්‍රයේ හෝමෝනමය පාලනය",
      "ඩිම්බකෝෂ චක්‍රය",
      "ගර්භාෂයික චක්‍රය",
      "ආර්තවහරණය,මානව විකසනය,සංසේචනය හා යුක්තානුව ඇතිවීම",
      "අධිරෝපණය",
      "කලල පටල",
      "කලල ඛණ්ඩය",
      "ගර්භණී භාවය හා කාලාන්තර• මවගේ සිදුවන වෙනස්කම්",
      "ප්‍රසවයේ සිදුවන වෙනස්කම්",
      "දරු ප්‍රසූති ක්‍රියාවලිය",
      "කිරිවරණය",
      "උපත් පාලන ක්‍රම",
      "ගබ්සා කිරීම,ගර්භණී සමයේ ආබාධ",
      "නිසරුභාවය,ප්‍රජනක තාක්ෂණ ක්‍රම",
      "ලිංගිකව සම්ප්‍රේෂණය වන ආසාදන",
      "සතුන්ගේ පෝෂණය හා විෂම පෝෂී පෝෂණ ආකාර",
      "මානව ජීරණ පද්ධතිය හැඳින්වීම",
      "මුඛය",
      "ග්‍රසනිකාව",
      "අන්නස්‍රෝතය",
      "ආමාශය",
      "කුඩා අන්ත්‍රය",
      "කුඩා අන්ත්‍රය තුළ සිදුවන රසායනික ජීරණය",
      "කුඩා අන්ත්‍රය තුළ සිදුවන අවශෝෂණය",
      "ආශ්‍රිත ග්‍රන්ථි - අග්න්‍යාශය",
      "පිත්තාශය හා අක්මාව",
      "අක්මාවේ කෘත්‍ය",
      "මිනිසා තුළ ජීරණයේ යාමනය",
      "සමබල ආහාරය",
      "ආහාරයේ සංඝටක හා ඒවායේ කෘත්‍ය",
      "අත්‍යවශ්‍ය පෝෂක",
      "විටමින්",
      "ඛනිජ",
      "මූලික පරිවෘත්තීය වේගය",
      "ආහාර මාර්ගය ආශ්‍රිත සුලභ රෝගාබාධ",
      "අස්ථි හැඳින්වීම",
      "හිස් කබල - කපාල අස්ථි",
      "වක්ත්‍ර අස්ථි",
      "කශේරුව",
      "උරෝස්ථිය",
      "ගාත්‍රා සැකිල්ල - පූර්ව ගාත්‍රය",
      "අපර ගාත්‍රය",
      "මානව කංකාල පද්ධතිය හා සම්බන්ධ සංකූලතා",
      "කංකාල පේශි සහ සංකෝචන යාන්ත්‍රණය",
      "සර්පන සූත්‍රිකා වාදය"
]
  },
  {
    id: 'u6',
    number: '06',
    icon: 'fa-dna',
    title: 'Unit 06: ප්‍රවේණිය',
    englishTitle: 'Genetics & Heredity',
    topics: [
      "හැඳින්වීම",
      "ප්‍රවේණි විද්‍යාවේ වත් මාලාව",
      "මෙන්ඩල්ගේ පළමු වන නියමය",
      "මෙන්ඩල්ගේ දෙවන නියමය",
      "සම්භාවිතා නියම හා මෙන්ඩලීය ආවේණිය",
      "බහු විධ ලක්ෂණ මුසුබිම්වල ආවේණික රටා පෙරැයීම",
      "පරීක්ෂා මුහුම හා පිළි දෙමුහුම",
      "සුලභ මෙන්ඩලීය ලක්ෂණ",
      "මෙන්ඩලීය නොවන ආවේණිය-බහු ඇලීලතාවය",
      "සහ ප්‍රමුඛතාවය",
      "අසම්පූර්ණ ප්‍රමුඛතාවය",
      "ජාන ප්‍රතිබද්ධය",
      "අභිභවනය",
      "බහුජාන ආවේණිය",
      "මානව ලිංග නිර්ණය",
      "මානව ලිංග ප්‍රතිබද්ධ ලක්ෂණ",
      "X ප්‍රතිබද්ධ ජානවලින් ආවේණිය",
      "පෙළපත් සටහන්",
      "ගහන ප්‍රවේණිය",
      "ශාක හා සත්ව අභිජනනය",
      "අභිජනන ශිල්ප ක්‍රම",
      "අභිජනන ක්‍රමවේදයන්හි ප්‍රවේණි විද්‍යාත්මක මූලධර්ම"
]
  },
  {
    id: 'u7',
    number: '07',
    icon: 'fa-flask-vial',
    title: 'Unit 07: අණුක ජීව විද්‍යාව සහ rDNA තාක්ෂණය',
    englishTitle: 'Molecular Biology & Recombinant DNA',
    topics: [
      "DNA වල ද්විත්ව හෙලික්සීය ව්‍යුහය හා වර්ණදේහවල ව්‍යුහික නිර්මාණය",
      "වර්ණ දේහයක් සෑදෙන මට්ටම",
      "DNA ප්‍රතිවලිත වීම හා ප්‍රාග් න්‍යෂ්ටිකයන්ගේ DNA ප්‍රතිවලිත ක්‍රියාවලිය",
      "DNA ප්‍රතිවලිතයට බලපාන ප්‍රධාන එන්සයිම හා ප්‍රෝටීන",
      "ප්‍රාග්න්‍යාෂ්ටික හා සුන්‍යෂ්ටික DNA ප්‍රතිවලිතයේ සමානතා හා අසමානතා",
      "DNA අලුත්වැඩියාව හා එහි වැදගත්කම",
      "ජාන හා ඒවා ක්‍රියා කරන ආකාරය",
      "ජාන ප්‍රකාශනය",
      "පොලි පෙප්ටයිඩ සංශ්ලේෂණ යාන්ත්‍රණය",
      "ප්‍රෝටීනවල ඉරණම හා වරණීය හායනය",
      "විකෘති - ජාන විකෘති",
      "විකෘති - වර්ණ දේහ විකෘති(ව්‍යුහය වෙනස්වීමෙන්)",
      "වර්ණ දේහ විකෘති(සංඛ්‍යාව වෙනස් වීමෙන්)",
      "මානව ප්‍රවේණික ආබාධ - ජාන විකෘති නිසා ඇතිවන ආබාධ",
      "වර්ණ දේහ විකෘති නිසා ඇතිවන ආබාධ",
      "ප්‍රවේණි උපදේශනය",
      "ජාන තාක්ෂණය - DNA විසංගමනය",
      "ඇගරෝස් ජෙල විද්‍යුත් ගමනය",
      "DNA ඵ්ෂණ සහ දෙමුහුම්කරණය",
      "ප්‍රතිසංයෝජිත DNA තාක්ෂණය",
      "පරිණාමනය",
      "Agrobacterium යොදාගෙන ජාන හුවමාරු කිරීම",
      "විශ්ලේෂණය,සීමා සිතියම",
      "DNA අනුක්‍රම නිර්ණය",
      "DNA ඇඟිලි සලකුණු තාක්ෂණය",
      "පොලිමරේස් දාම ප්‍රතික්‍රියාව(PCR)",
      "ප්‍රවේණිකව විකරණය කරන ලද ජීවීන්ගේ භාවිතය(GMO)",
      "කාටජීනා ගිවිසුම හා ශ්‍රී ලංකාවේ ජෛව සුරක්ෂිතතා රාමුව"
    ]
  },
  {
    id: 'u8',
    number: '08',
    icon: 'fa-earth-americas',
    title: 'Unit 08: පාරිසරික ජීව විද්‍යාව',
    englishTitle: 'Environmental Biology',
    topics: [
      "හැඳින්වීම හා පරිසරයේ සංවිධාන මට්ටම්",
      "පරිසර පද්ධතියක ව්‍යුහය හා කෘත්‍යය",
      "පරිසර පද්ධතියක් තුළින් ශක්තිය ගලා යාම",
      "පාරිසරික පිරමිඩ",
      "ශ්‍රී ලංකාවේ පරිසර පද්ධති - වනාන්තර",
      "ශ්‍රී ලංකාවේ පරිසර පද්ධති - තෘණ භූමි",
      "තෙත්බිම්",
      "බයෝම - නිවර්තන වනාන්තර හා සැවානා",
      "කාන්තාර හා චපරාල්",
      "සෞම්‍ය කලාපික තෘණ භූමි හා සෞම්‍ය කලාපික පළල් පත්‍ර වනාන්තර",
      "උතුරු කේතුධර වනාන්තර හා තුන්ද්‍රා",
      "ජෛව විවිධත්වය - වටිනාකම හා වැදගත්කම",
      "ජෛව විවිධත්වයට හානි වීම",
      "විශේෂ නෂ්ට වීම - නෂ්ට වූ ජීවීන්ගේ විවිධ මට්ටම්",
      "තර්ජනයට ලක් වූ ජීවීන්ගේ විවිධ මට්ටම්",
      "ජීවීන්ගේ වෙනත් විවිධ මට්ටම්",
      "සංරක්ෂණය",
      "ගෝලීය උණුසුම හා දේශගුණ විපර්යාස",
      "ගෝලීය උණුසුම හා දේශගුණික විපර්යාසයේ බලපෑම්",
      "ඕසෝන් ස්ථරය ක්ෂය වීම",
      "කාන්තාර කරණය",
      "අම්ල වැසි",
      "පරිසර සංරක්ෂණයට අදාළ සම්මුති",
      "ශ්‍රී ලංකාවේ පාරිසරික නීති පද්ධතිය හා ප්‍රතිපත්ති"
    ]
  },
  {
    id: 'u9',
    number: '09',
    icon: 'fa-virus',
    title: 'Unit 09: ක්ෂුද්‍ර ජීව විද්‍යාව',
    englishTitle: 'Microbiology',
    topics: [
      "ක්ෂුද්‍ර ජීවීන්ගේ ස්වභාවය",
      "ක්ෂුද්‍ර ජීවීන්ගේ විවිධත්වය",
      "ක්ෂුද්‍ර ජීවී ආකාර - බැක්ටීරියා",
      "සයනොබැක්ටීරියා",
      "දිලීර",
      "ඒක සෛලික ප්‍රෝටිස්ටාවන්",
      "මොලිකියුටයන්",
      "වෛරස",
      "වෛරොයිඩ හා ප්‍රියෝන",
      "ජීවානු හරණ ක්‍රම",
      "රෝපණ මාධ්‍ය",
      "ජීවානුහරණය කරන ලද රෝපණ මාධ්‍ය වගා බඳුනට මාරු කිරීම",
      "ක්ෂුද්‍ර ජීවීහු හා රෝග",
      "ආසාදන රෝග වලට අදාල යෙදුම් හා ව්‍යාධිජනකයන් සදහා ප්‍රවේශ මාර්ග",
      "ව්‍යාධිජනක ක්ෂුද්‍ර ජීවින්ගේ ලාක්ෂණික",
      "ධූලක",
      "ක්ෂුද්‍ර ජීවීන් මගින් මිනිසාට ඇති කරන රෝග",
      "ක්ෂුද්‍ර ජීවී රෝග මඟහැරීම හා වැළැක්වීම - ඒ්පුනිපුනක හා ව්‍යාපාරික",
      "ප්‍රතිජීවක භාවිතය",
      "ප්‍රතිශක්තීකරණ එන්නත්",
      "ක්ෂුද්‍ර ජීවීන්ගේ භාවිතය",
      "ක්ෂුද්‍ර ජීවීන් කාර්මික ක්ෂේත්‍රයේ යොදා ගැනීම",
      "පරිසර කලමනාකරණයේදී ක්ෂුද්‍ර ජීවීන් යෙදීම",
      "කෘෂිකර්මාන්තයේදී ක්ෂුද්‍ර ජීවීන් යෙදීම",
      "පාංශු ක්ෂුද්‍ර ජීවීන් - ඛනිජ භවනය",
      "C චක්‍රය",
      "N චක්‍රය",
      "ශාක වර්ධනය හා අදාළව පාංශු ක්ෂුද්‍ර ජීවීන්ගේ අන්තර් ක්‍රියා",
      "පානීය ජලය දූෂණය වන මාර්ග",
      "ජලයේ ගුණාත්මක දර්ශකයක් ලෙස ක්ෂුද්‍ර ජීවීන් හා ජලයෙන් බෝවන රෝග",
      "පානීය ජලය පිරිසම කිරීමේ ක්‍රියාවලිය",
      "අප ජලය කළමනාකරණය",
      "ඝණ අපද්‍රව්‍ය පිරිසම කිරීම",
      "ක්ෂුද්‍ර ජීවීන් හා ආහාර",
      "ආහාර නරක් වීම කෙරෙහි බලපාන සාධක",
      "ආහාර නරක් වීම මානව සෞඛ්‍යයට ඇති කරන බලපෑම්"
    ]
  },
  {
    id: 'u10',
    number: '10',
    icon: 'fa-wheat-awn',
    title: 'Unit 10: ව්‍යවහාරික ජීව විද්‍යාව',
    englishTitle: 'Applied Biology',
    topics: [
      "ජල ජීවී වගාව",
      "විසිතුරු මත්ස්‍ය වගාව",
      "ගෘහස්ථ ජලාශයක් පවත්වා ගැනීම",
      "ජලාශයේ ඇතිවිය හැකි ගැටලු",
      "වගා කරන මිරිදිය විසිතුරු මසුන්ට සුලභව වැළඳෙන රෝග - බැක්ටීරියා රෝග",
      "දිලීර රෝග",
      "ඒක සෛලීය පරපෝෂිතයන් මගින් ඇතිවන රෝග",
      "බහුසෛලීය බාහිර පරපෝෂීන් මගින් ඇතිවන රෝග",
      "විසිතුරු මත්ස්‍ය වගාව නිසා ඇතිවිය හැකි පාරිසරික බලපෑම්",
      "තවන් කලමනාකරණය හා ප්‍රචාරණය",
      "ආරක්ෂිත ගෘහ",
      "පටක රෝපණය",
      "මල් වගාවේදී භාවිතා වන බද්ධ කිරීමේ හා වෙනත් ප්‍රචාරණ ක්‍රම",
      "ආහාර පරිරක්ෂණය",
      "පසු අස්වනු හානිය",
      "ඩෙංගු",
      "බරවා",
      "නැනෝ තාක්ෂණය",
      "මූලික සෛල චිකිත්සාව",
      "මානව ජෙනෝම ව්‍යාපෘතිය"
    ]
  }
];

// ==========================================================================
// 2. TEACHERS DATA (ONLY 2 TEACHERS: Muthugala Sir & Sasanka Danujaya Sir)
// Clean layout without clutter experience/students text
// ==========================================================================
const TUTORS_DATA = [
  {
    id: 'dinesh',
    name: 'දිනේෂ් මුතුගල (Dinesh Muthugala)',
    avatar: '/muthugala-sir.jpg',
    hasTheory: true,
    hasRevision: true,
    showInFreeLessons: true
  },
  {
    id: 'sasanka',
    name: 'ශශංක ධනුජය (Sasanka Danujaya)',
    avatar: '/sasanka-danujaya.jpg',
    hasTheory: false,
    hasRevision: true,
    showInFreeLessons: false
  },
  {
    id: 'dhananjaya',
    name: 'ධනංජය ආරියදාස (Dhananjaya Ariyadasa)',
    avatar: '/dhananjaya-ariyadasa.jpg',
    hasTheory: false,
    hasRevision: true,
    showInFreeLessons: false
  }
];

// REVISION SESSIONS DATA (Real lessons are fetched directly from Admin Database)
const REVISION_DAYS_DATA = [];

// THEORY 10 UNITS DATA (Real lessons and days are loaded dynamically from Admin Database)
const THEORY_LEAF_UNITS_DATA = [
  { id: 'u1', num: '01', name: 'ජීව විද්‍යාව හැඳින්වීම', icon: '🌿', daysCount: 0, lessons: [] },
  { id: 'u2', num: '02', name: 'ජීවයේ රසායනික සහ සෛලීය පදනම', icon: '🔬', daysCount: 0, lessons: [] },
  { id: 'u3', num: '03', name: 'පරිණාමය සහ ජෛව විවිධත්වය', icon: '🌳', daysCount: 0, lessons: [] },
  { id: 'u4', num: '04', name: 'ශාක ආකාරය සහ ක්‍රියාකාරීත්වය', icon: '🌱', daysCount: 0, lessons: [] },
  { id: 'u5', num: '05', name: 'සත්ව ආකාරය සහ ක්‍රියාකාරීත්වය', icon: '🫀', daysCount: 0, lessons: [] },
  { id: 'u6', num: '06', name: 'ප්‍රවේණිය', icon: '🧬', daysCount: 0, lessons: [] },
  { id: 'u7', num: '07', name: 'අණුක ජීව විද්‍යාව සහ rDNA තාක්ෂණය', icon: '🧪', daysCount: 0, lessons: [] },
  { id: 'u8', num: '08', name: 'පාරිසරික ජීව විද්‍යාව', icon: '🌍', daysCount: 0, lessons: [] },
  { id: 'u9', num: '09', name: 'ක්ෂුද්‍ර ජීව විද්‍යාව', icon: '🦠', daysCount: 0, lessons: [] },
  { id: 'u10', num: '10', name: 'ව්‍යවහාරික ජීව විද්‍යාව', icon: '🌾', daysCount: 0, lessons: [] }
];

const flowState = {
  studypacks: { step: 'tutors', tutorId: null, mode: null, unitKey: null, revFolder: null },
  freelessons: { step: 'tutors', tutorId: null, mode: null, unitKey: null, revFolder: null }
};

// ==========================================================================
// 3. INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initModals();
  initParallax();
  init3DTiltCards();
  checkExistingStudent();
  initSyllabusTracker();
  initTutorFlows();
  initPortalBioBank();
  initPaperTracker();
  setTimeout(updateHomeDashboardMetrics, 350);

  // Support URL hash routing (e.g. #liveclasses, #studypacks, #studypacks/dinesh/theory, #freelessons)
  const handleHashRouting = () => {
    if (!window.location.hash) return;
    const cleanHash = window.location.hash.replace('#', '');
    const parts = cleanHash.split('/');
    const tabName = parts[0].replace(/^tab-/, '');
    const tabId = `tab-${tabName}`;
    if (document.getElementById(tabId)) {
      switchDashboardTab(tabId);
      if (parts[1] && (tabName === 'studypacks' || tabName === 'freelessons')) {
        selectTutor(tabName, parts[1]);
        if (parts[2]) {
          selectMode(tabName, parts[2]);
        }
      }
    }
  };

  setTimeout(handleHashRouting, 200);
  window.addEventListener('hashchange', handleHashRouting);
});

// ==========================================================================
// 4. DIGITAL CLOCK & GREETING
// ==========================================================================
function initLiveClock() {
  updateClockDisplay();
  if (clockTimer) clearInterval(clockTimer);
  clockTimer = setInterval(updateClockDisplay, 1000);
}

function updateClockDisplay() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const dateString = now.toLocaleDateString('en-US', options);

  const clockTimeEl = document.getElementById('clock-time');
  const clockDateEl = document.getElementById('clock-date');
  const bannerLiveTimeEl = document.getElementById('banner-live-time');

  if (clockTimeEl) clockTimeEl.textContent = timeString;
  if (clockDateEl) clockDateEl.textContent = dateString;
  if (bannerLiveTimeEl) bannerLiveTimeEl.textContent = timeString;

  if (currentStudent && currentStudent.name) {
    updateGreetingDisplay(currentStudent.name);
  }
}

function getGreetingPhrase() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function updateGreetingDisplay(fullName) {
  const greetingEl = document.getElementById('greeting-text');
  if (!greetingEl) return;
  const phrase = getGreetingPhrase();
  const firstName = (fullName || 'Student').trim().split(' ')[0];
  greetingEl.innerHTML = `${phrase}, <span id="greeting-student-name">${escapeHTML(firstName)}</span>! 👋`;
}

function generateStudentId(year) {
  const prefix = (year === '2028' || year === 2028) ? '28' : '27';
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${randomSuffix}`;
}

// ==========================================================================
// 5. MODAL CONTROLLERS & FORM HANDLING
// ==========================================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) setTimeout(() => firstInput.focus(), 150);

    // Refresh Cloudflare Turnstile if available
    if (window.turnstile) {
      try {
        if (modalId === 'signup-modal') turnstile.reset('#cf-turnstile-signup');
        if (modalId === 'login-modal') turnstile.reset('#cf-turnstile-login');
      } catch (cfErr) {
        // ignore if not ready
      }
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    if (modalId === 'video-player-modal') {
      stopSecureVideo();
    }
  }
}

function handleTurnstileError(errCode) {
  console.warn('Cloudflare Turnstile notice for custom sitekey on localhost:', errCode);
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const signupBox = document.getElementById('cf-turnstile-signup');
    const loginBox = document.getElementById('cf-turnstile-login');
    if (signupBox && !signupBox.dataset.fallbackDone) {
      signupBox.dataset.fallbackDone = 'true';
      signupBox.innerHTML = '';
      if (window.turnstile) {
        try {
          turnstile.render('#cf-turnstile-signup', {
            sitekey: '1x00000000000000000000AA',
            theme: 'dark'
          });
        } catch (e) {}
      }
    }
    if (loginBox && !loginBox.dataset.fallbackDone) {
      loginBox.dataset.fallbackDone = 'true';
      loginBox.innerHTML = '';
      if (window.turnstile) {
        try {
          turnstile.render('#cf-turnstile-login', {
            sitekey: '1x00000000000000000000AA',
            theme: 'dark'
          });
        } catch (e) {}
      }
    }
  }
}
window.handleTurnstileError = handleTurnstileError;

function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.active').forEach(m => closeModal(m.id));
    }
  });
}

function togglePasswordVisibility() {
  const pwdInput = document.getElementById('reg-password');
  const eyeIcon = document.getElementById('eye-icon');
  if (!pwdInput || !eyeIcon) return;

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    pwdInput.type = 'password';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
}
window.togglePasswordVisibility = togglePasswordVisibility;

function toggleLoginPasswordVisibility() {
  const pwdInput = document.getElementById('login-password');
  const eyeIcon = document.getElementById('login-eye-icon');
  if (!pwdInput || !eyeIcon) return;

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    eyeIcon.classList.remove('fa-eye');
    eyeIcon.classList.add('fa-eye-slash');
  } else {
    pwdInput.type = 'password';
    eyeIcon.classList.remove('fa-eye-slash');
    eyeIcon.classList.add('fa-eye');
  }
}
window.toggleLoginPasswordVisibility = toggleLoginPasswordVisibility;

function updateNavAuthButtons(isLoggedIn) {
  const joinBtn = document.getElementById('btn-nav-join');
  const loginBtn = document.getElementById('btn-nav-login');
  const portalBtn = document.getElementById('btn-nav-portal');
  const logoutBtn = document.getElementById('btn-nav-logout');
  
  // Hero section buttons
  const heroStartBtn = document.querySelector('.btn-primary-start');
  const heroLoginBtn = document.querySelector('.btn-secondary-explore');

  if (isLoggedIn) {
    if (joinBtn) joinBtn.style.display = 'none';
    if (loginBtn) {
      loginBtn.style.display = 'inline-flex';
      loginBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Switch Account / Log In';
      loginBtn.setAttribute('onclick', 'logoutAndOpenLogin()');
    }
    if (portalBtn) portalBtn.style.display = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';

    if (heroLoginBtn) heroLoginBtn.style.display = 'inline-flex';
    if (heroStartBtn) {
      heroStartBtn.setAttribute('onclick', 'showDashboardView()');
      const lbl = heroStartBtn.querySelector('.start-btn-label');
      if (lbl) lbl.textContent = 'Go to Dashboard';
    }
  } else {
    if (joinBtn) joinBtn.style.display = 'inline-flex';
    if (loginBtn) {
      loginBtn.style.display = 'inline-flex';
      loginBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Log In';
      loginBtn.setAttribute('onclick', "openModal('login-modal')");
    }
    if (portalBtn) portalBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';

    if (heroLoginBtn) heroLoginBtn.style.display = 'inline-flex';
    if (heroStartBtn) {
      heroStartBtn.setAttribute('onclick', "openModal('signup-modal')");
      const lbl = heroStartBtn.querySelector('.start-btn-label');
      if (lbl) lbl.textContent = 'Start Learning';
    }
  }
}

function logoutAndOpenLogin() {
  logoutStudent();
  setTimeout(() => {
    openModal('login-modal');
  }, 100);
}
window.logoutAndOpenLogin = logoutAndOpenLogin;

let cfTurnstileVerified = true;
function toggleTurnstileCheck() {
  const box = document.getElementById('cf-check-box');
  const icon = document.getElementById('cf-check-icon');
  cfTurnstileVerified = !cfTurnstileVerified;
  if (cfTurnstileVerified) {
    if (box) {
      box.style.borderColor = '#10b981';
      box.style.background = 'rgba(16, 185, 129, 0.1)';
    }
    if (icon) icon.style.display = 'block';
  } else {
    if (box) {
      box.style.borderColor = '#64748b';
      box.style.background = 'transparent';
    }
    if (icon) icon.style.display = 'none';
  }
}

async function handleStudentLogin(e) {
  if (e && e.preventDefault) e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const pwdInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('btn-login-submit');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = pwdInput ? pwdInput.value.trim() : '';

  if (!email || !password) {
    showToast('⚠️ කරුණාකර ඔබගේ Gmail සහ Password ලබා දෙන්න.');
    return;
  }

  // Retrieve Real Cloudflare Turnstile Token
  let turnstileToken = '';
  if (window.turnstile) {
    try {
      turnstileToken = turnstile.getResponse('#cf-turnstile-login') || '';
    } catch (e) {}
  }
  if (!turnstileToken) {
    const cfInput = document.querySelector('#login-modal [name="cf-turnstile-response"]');
    if (cfInput) turnstileToken = cfInput.value;
  }

  const turnstileBox = document.getElementById('cf-turnstile-login');
  if (window.turnstile && turnstileBox && turnstileBox.innerHTML.trim() !== '' && !turnstileToken) {
    showToast('⚠️ කරුණාකර Cloudflare ආරක්ෂණ පරීක්ෂාව සම්පූර්ණ කරන්න (Verify Cloudflare Turnstile).');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking Credentials...';
  }

  try {
    const res = await fetch('/api/students/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, turnstileToken })
    });
    const data = await res.json();

    if (data.success && data.student) {
      currentStudent = data.student;
      localStorage.setItem('apex_bio_student', JSON.stringify(data.student));
      localStorage.setItem('apex_student_login_time', Date.now().toString());

      closeModal('login-modal');
      showToast('🎉 ආයුබෝවන් ' + (data.student.name || 'Student') + '! සාදරයෙන් පිළිගනිමු.');
      populateDashboard(data.student);
      loadStudentTracker(data.student.studentId);
      showDashboardView();
      updateNavAuthButtons(true);
      fetchPublicPortalData(data.student.year || '2027');
    } else {
      showToast('⚠️ ' + (data.message || 'Login failed. Check your email and password.'));
      if (window.turnstile) {
        try { turnstile.reset('#cf-turnstile-login'); } catch (e) {}
      }
    }
  } catch (err) {
    console.error('Login error:', err);
    showToast('⚠️ Connection error. Please try again.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Log In to Student Dashboard';
    }
  }
}
window.handleStudentLogin = handleStudentLogin;

function togglePrivateCandidate(checkbox) {
  const schoolInput = document.getElementById('reg-school');
  if (!schoolInput) return;

  if (checkbox.checked) {
    schoolInput.dataset.previousVal = schoolInput.value;
    schoolInput.value = 'Private Candidate (Private A/L)';
    schoolInput.readOnly = true;
    schoolInput.style.background = '#f0fdf4';
    schoolInput.style.borderColor = '#10b981';
    schoolInput.style.color = '#064e3b';
    schoolInput.style.fontWeight = '700';
  } else {
    schoolInput.value = schoolInput.dataset.previousVal || '';
    schoolInput.readOnly = false;
    schoolInput.style.background = '#ffffff';
    schoolInput.style.borderColor = '#cbd5e1';
    schoolInput.style.color = 'inherit';
    schoolInput.style.fontWeight = 'normal';
    schoolInput.placeholder = 'e.g. Ananda College, Colombo';
    schoolInput.focus();
  }
}
window.togglePrivateCandidate = togglePrivateCandidate;

async function handleSignup(e) {
  if (e && e.preventDefault) e.preventDefault();

  const name = document.getElementById('reg-name')?.value.trim() || '';
  const isPrivate = document.getElementById('reg-is-private')?.checked || false;
  const school = isPrivate ? 'Private Candidate (Private A/L)' : (document.getElementById('reg-school')?.value.trim() || 'Private Candidate');
  const year = document.getElementById('reg-year')?.value || '2027';
  const district = document.getElementById('reg-district')?.value || 'Colombo';
  const phone = document.getElementById('reg-phone')?.value.trim() || '';
  const email = document.getElementById('reg-email')?.value.trim() || '';
  const password = document.getElementById('reg-password')?.value.trim() || '';
  
  let gender = 'male';
  const genderRadio = document.querySelector('input[name="reg-gender"]:checked');
  if (genderRadio) gender = genderRadio.value;

  if (!name || !email || !password || !phone) {
    showToast('⚠️ කරුණාකර සියලුම අවශ්‍ය තොරතුරු ඇතුළත් කරන්න.');
    return;
  }

  if (password.length < 6) {
    showToast('⚠️ Password එක අවම වශයෙන් අකුරු 6කින් සමන්විත විය යුතුය.');
    return;
  }

  // Retrieve Real Cloudflare Turnstile Token
  let turnstileToken = '';
  if (window.turnstile) {
    try {
      turnstileToken = turnstile.getResponse('#cf-turnstile-signup') || '';
    } catch (e) {}
  }
  if (!turnstileToken) {
    const cfInput = document.querySelector('#signup-modal [name="cf-turnstile-response"]');
    if (cfInput) turnstileToken = cfInput.value;
  }

  const turnstileBox = document.getElementById('cf-turnstile-signup');
  if (window.turnstile && turnstileBox && turnstileBox.innerHTML.trim() !== '' && !turnstileToken) {
    showToast('⚠️ කරුණාකර Cloudflare ආරක්ෂණ පරීක්ෂාව සම්පූර්ණ කරන්න (Verify Cloudflare Turnstile).');
    return;
  }

  const submitBtn = document.querySelector('#signup-form button[type="submit"]') || document.getElementById('btn-signup-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account & Authenticating...';
  }

  try {
    const res = await fetch('/api/students/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        school,
        isPrivate,
        year,
        district,
        gender,
        phone,
        email,
        password,
        turnstileToken
      })
    });
    const data = await res.json();

    if (data.success && data.student) {
      currentStudent = data.student;
      localStorage.setItem('apex_bio_student', JSON.stringify(data.student));
      localStorage.setItem('apex_student_login_time', Date.now().toString());

      closeModal('signup-modal');
      showToast('🎉 සාදරයෙන් පිළිගනිමු ' + name + '! Student ID: ' + data.student.studentId);

      populateDashboard(data.student);
      loadStudentTracker(data.student.studentId);
      showDashboardView();
      updateNavAuthButtons(true);
      fetchPublicPortalData(data.student.year || '2027');
    } else {
      showToast('⚠️ ' + (data.message || 'Signup failed'));
      if (window.turnstile) {
        try { turnstile.reset('#cf-turnstile-signup'); } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Backend signup error:', err);
    showToast('⚠️ Error connecting to server. Please try again.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sign Up & Open Dashboard';
    }
  }
}
window.handleSignup = handleSignup;


function populateDashboard(student) {
  if (!student) return;
  currentStudent = student;

  // Check if student is suspended
  if (student.status === 'suspended') {
    alert('⚠️ Your student account has been suspended by Admin. Please contact support via WhatsApp.');
    showLandingView();
    return;
  }

  const sbName = document.getElementById('sb-user-name');
  const sbId = document.getElementById('sb-user-id');
  const sbSchool = document.getElementById('sb-user-school');

  if (sbName) sbName.textContent = student.name;
  if (sbId) sbId.textContent = 'ID: ' + (student.studentId || '27804192');
  if (sbSchool) sbSchool.textContent = student.school || 'Biology Student';

  const topBatchText = document.getElementById('top-batch-text');
  const topIdNumber = document.getElementById('top-id-number');
  const portalBtn = document.getElementById('btn-nav-portal');

  if (topBatchText) topBatchText.textContent = student.year + ' A/L Biological Science';
  if (topIdNumber) topIdNumber.textContent = student.studentId || '27804192';
  
  const topStudentId = document.getElementById('top-student-id');
  const topStudentName = document.getElementById('top-student-name');
  if (topStudentId) topStudentId.textContent = 'ID: ' + (student.studentId || '27804192');
  if (topStudentName) topStudentName.textContent = student.name ? student.name.split(' ')[0] : 'Student';
  
  if (portalBtn) portalBtn.style.display = 'inline-flex';

  const bannerId = document.getElementById('banner-student-id');
  const bannerSchool = document.getElementById('banner-student-school');
  const bannerBatchName = document.getElementById('banner-batch-name');

  if (bannerId) bannerId.textContent = 'ID: ' + (student.studentId || '27804192');
  if (bannerSchool) bannerSchool.textContent = student.school || 'A/L Biology';
  if (bannerBatchName) bannerBatchName.textContent = student.year + ' A/L Biological Science';

  updateGreetingDisplay(student.name);
  if (student.photoUrl) {
    updateAvatarDisplayEverywhere(student.photoUrl);
  } else {
    updateAvatarDisplayEverywhere(null);
  }
  if (student.year) {
    const yrStr = String(student.year);
    countdownBatchTarget = yrStr.includes('2028') ? '2028' : '2027';
    switchCountdownBatch(countdownBatchTarget, false);
  }
  renderStudyTasks();

  // Verified Student Badge Handling
  const verifiedBadgeEl = document.getElementById('student-verified-badge');
  if (verifiedBadgeEl) {
    if (student.isVerified) {
      verifiedBadgeEl.style.display = 'inline-flex';
    } else {
      verifiedBadgeEl.style.display = 'none';
    }
  }

  const emptyBatchText = document.getElementById('dash-empty-batch-text');
  const roadmapBatchPill = document.getElementById('roadmap-batch-pill');
  const storeBatchLabel = document.getElementById('store-batch-label');

  if (emptyBatchText) emptyBatchText.textContent = student.year + ' A/L';
  if (roadmapBatchPill) roadmapBatchPill.textContent = student.year + ' A/L Syllabus';
  if (storeBatchLabel) storeBatchLabel.textContent = student.year + ' A/L';

  // Fetch real-time live classes, cards, and updated syllabus from backend
  fetchPublicPortalData(student.year || '2027');
}

function checkExistingStudent() {
  try {
    const saved = localStorage.getItem('apex_bio_student');
    const loginTime = localStorage.getItem('apex_student_login_time');
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    // Check 7-Day Session Expiration
    if (loginTime) {
      const elapsed = Date.now() - parseInt(loginTime, 10);
      if (elapsed > SEVEN_DAYS_MS) {
        console.log('Session expired after 7 days.');
        localStorage.removeItem('apex_bio_student');
        localStorage.removeItem('apex_student_login_time');
        showToast('⚠️ ඔබගේ Login Session එක දින 7 සම්පූර්ණ වී අවසන් විය. කරුණාකර නැවත Login වන්න.');
        showLandingView();
        updateNavAuthButtons(false);
        return;
      }
    }

    if (saved) {
      const student = JSON.parse(saved);
      if (!student.studentId) {
        student.studentId = generateStudentId(student.year || '2027');
        localStorage.setItem('apex_bio_student', JSON.stringify(student));
      }
      populateDashboard(student);
      showDashboardView();
      updateNavAuthButtons(true);
    } else {
      // Not logged in -> Show Landing page with Login / Join buttons
      showLandingView();
      updateNavAuthButtons(false);
    }
  } catch (err) {
    console.error('Error reading student profile:', err);
    showLandingView();
    updateNavAuthButtons(false);
  }
}

// ==========================================================================
// 6. SIDEBAR NAVIGATION & TAB SWITCHING
// ==========================================================================
function switchDashboardTab(tabId) {
  const allNavBtns = document.querySelectorAll('.dash-sidebar .sidebar-link-btn');
  allNavBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const allPanes = document.querySelectorAll('.dash-tab-pane');
  allPanes.forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });

  if (tabId === 'tab-liveclasses') {
    renderPortalLiveClassesPage();
  }
  if (tabId === 'tab-mycards') {
    renderMyCardsTab();
  }
  if (tabId === 'tab-studytricks') {
    renderStudyTricksTab();
  }
  if (tabId === 'tab-account') {
    renderAccountTab();
  }
  if (tabId === 'tab-papertracker') {
    renderPaperTracker();
  }
  if (tabId === 'tab-revisionwheel') {
    initRevisionWheelTab();
  }
  if (tabId === 'tab-home') {
    updateHomeDashboardMetrics();
  }

  if (tabId === 'tab-focusstudio') {
    renderFocusStudio();
  }
  sendOnlineHeartbeat();

  toggleDashboardSidebar(false);

  const scrollArea = document.querySelector('.dash-tabs-scroll-area');
  if (scrollArea) {
    scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setTimeout(init3DTiltCards, 60);
}

function toggleDashboardSidebar(open) {
  const sidebar = document.getElementById('dash-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (open) {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function showLandingView() {
  document.getElementById('view-landing')?.classList.add('active');
  document.getElementById('view-dashboard')?.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDashboardView() {
  document.getElementById('view-landing')?.classList.remove('active');
  document.getElementById('view-dashboard')?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logoutStudent() {
  localStorage.removeItem('apex_bio_student');
  localStorage.removeItem('apex_student_login_time');
  currentStudent = null;
  updateNavAuthButtons(false);
  showToast('👋 සාර්ථකව Log out විය.');
  showLandingView();
  // Close any open modals
  const activeModals = document.querySelectorAll('.modal-backdrop.active');
  activeModals.forEach(m => m.classList.remove('active'));
  window.location.hash = '';
}
window.logoutStudent = logoutStudent;

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function initParallax() {
  const frame = document.getElementById('hero-section');
  const scene = document.getElementById('scene-character');
  const wordApex = document.querySelector('.title-word-apex');
  const wordBio = document.querySelector('.title-word-biology');

  if (!frame || !scene || window.innerWidth < 768) return;

  frame.addEventListener('mousemove', (e) => {
    const rect = frame.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / (rect.height / 2)) * -3.5;
    const tiltY = (x / (rect.width / 2)) * 3.5;

    scene.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;

    if (wordApex && wordBio) {
      wordApex.style.transform = `perspective(600px) rotateX(${3 + tiltX * 0.2}deg) rotateY(${tiltY * 0.2}deg)`;
      wordBio.style.transform = `perspective(600px) rotateX(${3 + tiltX * 0.2}deg) rotateY(${tiltY * 0.2}deg)`;
    }
  });

  frame.addEventListener('mouseleave', () => {
    scene.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    if (wordApex && wordBio) {
      wordApex.style.transform = 'perspective(600px) rotateX(3deg)';
      wordBio.style.transform = 'perspective(600px) rotateX(3deg)';
    }
  });
}

function init3DTiltCards() {
  if (window.innerWidth < 768) return;

  const cards = document.querySelectorAll(
    '.tutor-card-clean, .mode-card-item, .leaf-folder-card, .yt-lesson-card, .biobank-folder-card, .resource-document-card'
  );

  cards.forEach(card => {
    if (card.dataset.tiltReady === 'true') return;
    card.dataset.tiltReady = 'true';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -4;
      const tiltY = (x / (rect.width / 2)) * 4;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ==========================================================================
// 7. NATIONAL A/L BIOLOGY SYLLABUS TRACKER
// ==========================================================================
let trackerState = {};

function getTrackerStorageKey() {
  const sid = currentStudent ? (currentStudent.studentId || '27804192') : '27804192';
  return `apex_tracker_${sid}`;
}

function loadStudentTracker(studentId) {
  try {
    const key = `apex_tracker_${studentId || '27804192'}`;
    const saved = localStorage.getItem(key);
    trackerState = saved ? JSON.parse(saved) : {};
  } catch (err) {
    trackerState = {};
  }
  renderSyllabusTracker();
  updateTrackerStats();
}

function saveTrackerState() {
  try {
    const key = getTrackerStorageKey();
    localStorage.setItem(key, JSON.stringify(trackerState));
  } catch (err) {
    console.error('Error saving tracker state:', err);
  }
}

function initSyllabusTracker() {
  const sid = currentStudent ? currentStudent.studentId : '27804192';
  loadStudentTracker(sid);
}

function renderSyllabusTracker() {
  const container = document.getElementById('syllabus-accordions-list');
  if (!container) return;

  container.innerHTML = '';

  SYLLABUS_DATA.forEach((unit, unitIdx) => {
    const unitState = trackerState[unit.id] || {};
    const totalTopics = unit.topics.length;
    let completedTopics = 0;

    unit.topics.forEach((_, tIdx) => {
      const boxes = unitState[tIdx];
      if (boxes && (boxes[0] || boxes[1] || boxes[2])) {
        completedTopics++;
      }
    });

    const percent = Math.round((completedTopics / totalTopics) * 100) || 0;
    const isFirstUnit = unitIdx === 0;

    const accordion = document.createElement('div');
    accordion.className = `unit-accordion-card${isFirstUnit ? ' expanded' : ''}`;
    accordion.id = `accordion-${unit.id}`;
    accordion.dataset.unitId = unit.id;

    let subtopicsHtml = '';
    unit.topics.forEach((topicName, tIdx) => {
      const boxes = unitState[tIdx] || [false, false, false];
      const isCompleted = boxes[0] || boxes[1] || boxes[2];

      subtopicsHtml += `
        <div class="subtopic-row${isCompleted ? ' completed-topic' : ''}" id="row-${unit.id}-${tIdx}">
          <div class="subtopic-left">
            <span class="subtopic-bullet-num">${tIdx + 1}</span>
            <span class="subtopic-name">${escapeHTML(topicName)}</span>
          </div>
          <div class="study-boxes-group">
            <button class="study-box-btn btn-box-1${boxes[0] ? ' checked' : ''}" 
                    title="1st Study (1 වරක් හැදෑරීම)"
                    onclick="toggleStudyBox('${unit.id}', ${tIdx}, 0, this)">
              <i class="${boxes[0] ? 'fa-solid fa-check' : 'fa-regular fa-circle'}"></i> 1st Study
            </button>
            <button class="study-box-btn btn-box-2${boxes[1] ? ' checked' : ''}" 
                    title="2nd Revision (2 වන වර පුනරීක්ෂණය)"
                    onclick="toggleStudyBox('${unit.id}', ${tIdx}, 1, this)">
              <i class="${boxes[1] ? 'fa-solid fa-rotate' : 'fa-regular fa-circle'}"></i> 2nd Rev
            </button>
            <button class="study-box-btn btn-box-3${boxes[2] ? ' checked' : ''}" 
                    title="Mastery (හොඳටම මතකයි ⭐)"
                    onclick="toggleStudyBox('${unit.id}', ${tIdx}, 2, this)">
              <i class="${boxes[2] ? 'fa-solid fa-star' : 'fa-regular fa-star'}"></i> Mastery ⭐
            </button>
          </div>
        </div>
      `;
    });

    accordion.innerHTML = `
      <div class="accordion-header" onclick="toggleAccordion('${unit.id}')">
        <div class="accordion-left">
          <div class="accordion-chevron-icon">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
          <div class="accordion-unit-info">
            <h4 class="accordion-unit-title">${escapeHTML(unit.title)}</h4>
            <span class="accordion-unit-count" id="count-label-${unit.id}">
              ${completedTopics} of ${totalTopics} completed (${percent}%)
            </span>
          </div>
        </div>
        <div class="accordion-right">
          <div class="accordion-progress-bar-wrap">
            <div class="accordion-progress-fill" id="fill-${unit.id}" style="width: ${percent}%;"></div>
          </div>
          <span class="accordion-percent-label" id="percent-label-${unit.id}">${percent}%</span>
        </div>
      </div>
      <div class="accordion-body">
        <div class="subtopics-table">
          ${subtopicsHtml}
        </div>
      </div>
    `;

    container.appendChild(accordion);
  });

  updateTrackerStats();
}

function toggleAccordion(unitId) {
  const card = document.getElementById(`accordion-${unitId}`);
  if (!card) return;
  card.classList.toggle('expanded');
}

function expandAllAccordions(shouldExpand) {
  document.querySelectorAll('.unit-accordion-card').forEach(card => {
    if (shouldExpand) {
      card.classList.add('expanded');
    } else {
      card.classList.remove('expanded');
    }
  });
}

function toggleStudyBox(unitId, topicIndex, boxIndex, btnElement) {
  if (!trackerState[unitId]) {
    trackerState[unitId] = {};
  }
  if (!trackerState[unitId][topicIndex]) {
    trackerState[unitId][topicIndex] = [false, false, false];
  }

  const currentVal = trackerState[unitId][topicIndex][boxIndex];
  trackerState[unitId][topicIndex][boxIndex] = !currentVal;
  const isNowChecked = trackerState[unitId][topicIndex][boxIndex];

  if (btnElement) {
    if (isNowChecked) {
      btnElement.classList.add('checked');
      const icon = btnElement.querySelector('i');
      if (icon) {
        if (boxIndex === 0) icon.className = 'fa-solid fa-check';
        if (boxIndex === 1) icon.className = 'fa-solid fa-rotate';
        if (boxIndex === 2) icon.className = 'fa-solid fa-star';
      }
    } else {
      btnElement.classList.remove('checked');
      const icon = btnElement.querySelector('i');
      if (icon) {
        if (boxIndex === 2) icon.className = 'fa-regular fa-star';
        else icon.className = 'fa-regular fa-circle';
      }
    }
  }

  const boxes = trackerState[unitId][topicIndex];
  const isCompleted = boxes[0] || boxes[1] || boxes[2];
  const row = document.getElementById(`row-${unitId}-${topicIndex}`);
  if (row) {
    if (isCompleted) {
      row.classList.add('completed-topic');
    } else {
      row.classList.remove('completed-topic');
    }
  }

  saveTrackerState();
  updateUnitProgress(unitId);
  updateTrackerStats();

  if (boxIndex === 2 && isNowChecked) {
    showToast('⭐ විශිෂ්ටයි! උප මාතෘකාව හොඳටම මතකයි ලෙස සලකුණු විය.');
  }
}

function updateUnitProgress(unitId) {
  const unit = SYLLABUS_DATA.find(u => u.id === unitId);
  if (!unit) return;

  const unitState = trackerState[unitId] || {};
  const totalTopics = unit.topics.length;
  let completedTopics = 0;

  unit.topics.forEach((_, tIdx) => {
    const boxes = unitState[tIdx];
    if (boxes && (boxes[0] || boxes[1] || boxes[2])) {
      completedTopics++;
    }
  });

  const percent = Math.round((completedTopics / totalTopics) * 100) || 0;

  const countLabel = document.getElementById(`count-label-${unitId}`);
  const fillBar = document.getElementById(`fill-${unitId}`);
  const percentLabel = document.getElementById(`percent-label-${unitId}`);

  if (countLabel) countLabel.textContent = `${completedTopics} of ${totalTopics} completed (${percent}%)`;
  if (fillBar) fillBar.style.width = `${percent}%`;
  if (percentLabel) percentLabel.textContent = `${percent}%`;
}

function updateTrackerStats() {
  let overallTotal = 0;
  let overallCompleted = 0;

  SYLLABUS_DATA.forEach(unit => {
    const unitState = trackerState[unit.id] || {};
    overallTotal += unit.topics.length;

    unit.topics.forEach((_, tIdx) => {
      const boxes = unitState[tIdx];
      if (boxes && (boxes[0] || boxes[1] || boxes[2])) {
        overallCompleted++;
      }
    });
  });

  const overallPercent = Math.round((overallCompleted / overallTotal) * 100) || 0;

  const percentEl = document.getElementById('tracker-overall-percent');
  if (percentEl) percentEl.textContent = `${overallPercent}%`;

  const completedEl = document.getElementById('tracker-completed-count');
  const totalEl = document.getElementById('tracker-total-count');
  if (completedEl) completedEl.textContent = overallCompleted;
  if (totalEl) totalEl.textContent = overallTotal;

  const circleFill = document.getElementById('tracker-circle-fill');
  if (circleFill) {
    const circumference = 2 * Math.PI * 50;
    circleFill.style.strokeDasharray = circumference;
    const offset = circumference - (overallPercent / 100) * circumference;
    circleFill.style.strokeDashoffset = offset;
  }

  const sbBadge = document.getElementById('sidebar-tracker-badge');
  if (sbBadge) {
    sbBadge.textContent = `${overallPercent}%`;
    if (overallPercent > 0) {
      sbBadge.style.background = '#10b981';
      sbBadge.style.color = '#ffffff';
    }
  }

  updateHomeDashboardMetrics();
  const statusBadge = document.getElementById('tracker-status-badge');
  if (statusBadge) {
    if (overallPercent >= 100) {
      statusBadge.innerHTML = '<i class="fa-solid fa-trophy"></i> <span>Syllabus Master 🏆</span>';
      statusBadge.style.color = '#fef08a';
      statusBadge.style.background = 'rgba(234, 179, 8, 0.25)';
    } else if (overallPercent >= 75) {
      statusBadge.innerHTML = '<i class="fa-solid fa-rocket"></i> <span>A/L Distinction Zone 🚀</span>';
      statusBadge.style.color = '#6ee7b7';
    } else if (overallPercent >= 40) {
      statusBadge.innerHTML = '<i class="fa-solid fa-fire"></i> <span>Great Momentum 🔥</span>';
      statusBadge.style.color = '#fde68a';
    } else if (overallPercent > 0) {
      statusBadge.innerHTML = '<i class="fa-solid fa-seedling"></i> <span>In Progress 🌱</span>';
      statusBadge.style.color = '#a7f3d0';
    } else {
      statusBadge.innerHTML = '<i class="fa-solid fa-compass"></i> <span>Ready to Start 🎯</span>';
    }
  }
}

function filterSyllabusTopics(searchTerm) {
  const query = (searchTerm || '').trim().toLowerCase();
  const allRows = document.querySelectorAll('.subtopic-row');
  const allCards = document.querySelectorAll('.unit-accordion-card');

  if (!query) {
    allRows.forEach(row => (row.style.display = 'flex'));
    allCards.forEach(card => (card.style.display = 'block'));
    return;
  }

  allCards.forEach(card => {
    const unitId = card.dataset.unitId;
    const unit = SYLLABUS_DATA.find(u => u.id === unitId);
    let hasMatchingTopic = false;

    if (unit && (unit.title.toLowerCase().includes(query) || unit.englishTitle.toLowerCase().includes(query))) {
      hasMatchingTopic = true;
      card.querySelectorAll('.subtopic-row').forEach(r => (r.style.display = 'flex'));
    } else {
      card.querySelectorAll('.subtopic-row').forEach(row => {
        const text = row.querySelector('.subtopic-name')?.textContent?.toLowerCase() || '';
        if (text.includes(query)) {
          row.style.display = 'flex';
          hasMatchingTopic = true;
        } else {
          row.style.display = 'none';
        }
      });
    }

    if (hasMatchingTopic) {
      card.style.display = 'block';
      card.classList.add('expanded');
    } else {
      card.style.display = 'none';
    }
  });
}

function filterTrackerUnits(filterType, btnElement) {
  document.querySelectorAll('.tracker-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const allCards = document.querySelectorAll('.unit-accordion-card');
  allCards.forEach((card, index) => {
    if (filterType === 'all') {
      card.style.display = 'block';
    } else if (filterType === 'part1') {
      card.style.display = index < 5 ? 'block' : 'none';
    } else if (filterType === 'part2') {
      card.style.display = index >= 5 ? 'block' : 'none';
    }
  });
}

function resetTrackerConfirm() {
  if (confirm('ඔබට සම්පූර්ණ Syllabus Tracker progress එක reset කිරීමට අවශ්‍යද?')) {
    trackerState = {};
    saveTrackerState();
    renderSyllabusTracker();
    showToast('Tracker progress has been reset.');
  }
}

// ==========================================================================
// 8. 3-STEP SELECTION FLOW (ONLY 2 TEACHERS: Muthugala & Sasanka Danujaya)
// Clean card design without clutter descriptions
// ==========================================================================
let selectedVideoPackBatch = '2027';
let pendingUnlockTarget = null;

function selectVideoPackBatch(batch) {
  selectedVideoPackBatch = batch;
  ['2026', '2027', '2028'].forEach(b => {
    const pill = document.getElementById(`vp-pill-${b}`);
    if (pill) pill.classList.toggle('active', b === batch);
  });
  showToast(`Switched Video Packs to ${batch} A/L Batch`);
  renderTutorFlow('studypacks');
}

function isPackUnlockedForStudent(tutorId, unitKey) {
  if (!currentStudent) return false;
  const unlocked = currentStudent.unlockedPacks || [];
  if (unlocked.includes('all')) return true;
  // Strictly tutor-isolated check! Dinesh's unit unlocks ONLY for Dinesh, Sasanka's unit ONLY for Sasanka
  const tutorPrefixedKey = `${tutorId}-${unitKey}`;
  if (unlocked.includes(tutorPrefixedKey)) return true;
  return false;
}

function openUnlockPackModal(tutorId, unitKey, unitName) {
  const tutor = TUTORS_DATA.find(t => t.id === tutorId) || TUTORS_DATA[0];
  pendingUnlockTarget = {
    tutorId,
    unitKey,
    unitName: unitName || `Unit ${unitKey}`,
    tutorName: tutor.name
  };

  const titleEl = document.getElementById('unlock-modal-title');
  const tutorEl = document.getElementById('unlock-modal-tutor');
  const btnEl = document.getElementById('btn-submit-unlock-req');

  if (titleEl) titleEl.textContent = `${unitName || 'Video Pack'} (Locked)`;
  if (tutorEl) tutorEl.textContent = `${tutor.name} • ${selectedVideoPackBatch || '2027'} A/L Video Pack`;
  if (btnEl) {
    btnEl.disabled = false;
    btnEl.innerHTML = '<i class="fa-solid fa-unlock"></i> Request Unlock (Unlock It)';
  }

  openModal('unlock-pack-modal');
}

async function submitVideoPackUnlockRequest() {
  if (!pendingUnlockTarget) return;

  const sId = currentStudent ? currentStudent.studentId : '27804192';
  const sName = currentStudent ? currentStudent.name : 'Student';
  const sPhone = currentStudent ? (currentStudent.phone || '') : '';
  const sSchool = currentStudent ? (currentStudent.school || '') : '';
  const batch = selectedVideoPackBatch || (currentStudent ? currentStudent.year : '2027');

  const btnEl = document.getElementById('btn-submit-unlock-req');
  if (btnEl) {
    btnEl.disabled = true;
    btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
  }

  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: sId,
        studentName: sName,
        studentPhone: sPhone,
        studentSchool: sSchool,
        batch: batch,
        type: 'videopack',
        targetId: `${pendingUnlockTarget.tutorId}-${pendingUnlockTarget.unitKey}`,
        targetTitle: `${pendingUnlockTarget.unitName} (${pendingUnlockTarget.tutorName})`,
        tutorId: pendingUnlockTarget.tutorId
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast('🎉 Unlock request submitted! Access will be granted once approved by Admin via Telegram or Admin Panel.');
      closeModal('unlock-pack-modal');
      startStudentAccessPolling();
    } else {
      showToast(data.message || 'Error submitting unlock request');
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<i class="fa-solid fa-unlock"></i> Request Unlock (Unlock It)';
      }
    }
  } catch (err) {
    console.error(err);
    showToast('🎉 Unlock request recorded! Admin will review and activate.');
    closeModal('unlock-pack-modal');
    startStudentAccessPolling();
  }
}

let studentAccessPollTimer = null;
function startStudentAccessPolling() {
  if (studentAccessPollTimer) clearInterval(studentAccessPollTimer);
  if (!currentStudent || !currentStudent.studentId) return;

  const sId = currentStudent.studentId;
  const initialCount = (currentStudent.unlockedPacks || []).length;
  let attempts = 0;

  studentAccessPollTimer = setInterval(async () => {
    attempts++;
    if (attempts > 75) { // 5 minutes max
      clearInterval(studentAccessPollTimer);
      studentAccessPollTimer = null;
      return;
    }

    try {
      const res = await fetch(`/api/public-data?year=${currentStudent.year || '2027'}&studentId=${sId}`);
      const json = await res.json();
      if (json.success && json.student) {
        const newUnlocked = json.student.unlockedPacks || [];
        if (newUnlocked.length > initialCount || (!initialCount && newUnlocked.length > 0)) {
          currentStudent = Object.assign(currentStudent, json.student);
          localStorage.setItem('apex_bio_student', JSON.stringify(currentStudent));
          clearInterval(studentAccessPollTimer);
          studentAccessPollTimer = null;
          showToast('🎉 සුබ පැතුම්! ඔබ ඉල්ලුම් කළ Video Pack එක Admin විසින් Unlock කරන ලදී!');
          renderTutorFlow('studypacks');
        }
      }
    } catch (e) {}
  }, 4000);
}

function initTutorFlows() {
  renderTutorFlow('studypacks');
  renderTutorFlow('freelessons');
}

function renderTutorFlow(tabKey) {
  const container = document.getElementById(`flow-container-${tabKey}`);
  if (!container) return;

  const state = flowState[tabKey];

  if (state.step === 'tutors') {
    // Step 1: Select Teacher
    let availableTutors = TUTORS_DATA;
    if (tabKey === 'freelessons') {
      availableTutors = TUTORS_DATA.filter(t => t.showInFreeLessons === true);
      if (availableTutors.length === 0) {
        availableTutors = TUTORS_DATA.filter(t => t.id === 'dinesh');
      }
    }

    container.innerHTML = `
      <div class="flow-step-header">
        <h3 class="flow-step-title">
          <i class="fa-solid fa-chalkboard-user"></i> Select Biology Teacher
        </h3>
      </div>
      <div class="tutors-grid-two">
        ${availableTutors.map(tutor => `
          <div class="tutor-card-clean" onclick="selectTutor('${tabKey}', '${tutor.id}')">
            <div class="tutor-avatar-wrap-lg">
              <img src="${tutor.avatar}" alt="${tutor.name}" class="tutor-avatar-img-lg" onerror="this.src='/muthugala-sir.jpg'">
            </div>
            <h4 class="tutor-name-clean">${escapeHTML(tutor.name)}</h4>
            <span class="badge-tag-leaf" style="${!tutor.hasTheory ? 'background:#fef3c7; color:#b45309; border-color:#fde68a;' : ''}">
              ${tutor.hasTheory ? 'Theory + Revision' : 'Revision Only'}
            </span>
            <button class="btn-select-tutor-clean" onclick="event.stopPropagation(); selectTutor('${tabKey}', '${tutor.id}')">
              <span>Select Teacher</span> <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        `).join('')}
      </div>
    `;
  } else if (state.step === 'mode') {
    // Step 2: Choose Mode (Clean, no long clutter paragraphs)
    const tutor = TUTORS_DATA.find(t => t.id === state.tutorId) || TUTORS_DATA[0];

    // If teacher has NO Theory (Sasanka or Dhananjaya), redirect directly to Revision
    if (tutor && tutor.hasTheory === false) {
      state.mode = 'revision';
      state.step = 'revision-days';
      state.revFolder = null;
      renderTutorFlow(tabKey);
      return;
    }

    container.innerHTML = `
      <div class="flow-step-header">
        <h3 class="flow-step-title">
          <i class="fa-solid fa-sliders"></i> Choose Mode (${escapeHTML(tutor.name)})
        </h3>
        <button class="btn-flow-back" onclick="backToTutors('${tabKey}')">
          <i class="fa-solid fa-arrow-left"></i> Change Teacher
        </button>
      </div>
      <div class="mode-cards-grid">
        <div class="mode-card-item mode-theory" onclick="selectMode('${tabKey}', 'theory')">
          <span class="mode-badge-tag"><i class="fa-solid fa-leaf"></i> 10 Units</span>
          <div class="mode-icon-circle">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <h3>Theory Masterclasses</h3>
          <button class="btn-open-mode" onclick="event.stopPropagation(); selectMode('${tabKey}', 'theory')">
            <span>Open Theory Folders</span> <i class="fa-solid fa-folder-open"></i>
          </button>
        </div>

        <div class="mode-card-item mode-revision" onclick="selectMode('${tabKey}', 'revision')">
          <span class="mode-badge-tag"><i class="fa-solid fa-bolt"></i> High-Yield</span>
          <div class="mode-icon-circle">
            <i class="fa-solid fa-crosshairs"></i>
          </div>
          <h3>Revision Masterclasses</h3>
          <button class="btn-open-mode" onclick="event.stopPropagation(); selectMode('${tabKey}', 'revision')">
            <span>Explore Revision Days</span> <i class="fa-solid fa-circle-play"></i>
          </button>
        </div>
      </div>
    `;
  } else if (state.step === 'theory-units') {
    // Step 3A: Botanical 3D Leaf Folders (Titles only, no long paragraphs)
    const tutor = TUTORS_DATA.find(t => t.id === state.tutorId) || TUTORS_DATA[0];

    // Filter units: In Video Packs, show ONLY units enabled by Admin (Default: Units 1 to 6)
    let visibleUnits = THEORY_LEAF_UNITS_DATA;
    if (tabKey === 'studypacks') {
      visibleUnits = THEORY_LEAF_UNITS_DATA.filter(unit => {
        const backendPack = (PORTAL_VIDEO_PACKS || []).find(p => p.unitId === unit.id && p.tutorId === state.tutorId);
        if (backendPack && backendPack.isVisibleToStudents !== undefined) {
          return backendPack.isVisibleToStudents;
        }
        return parseInt(unit.num) <= 6;
      });
    }

    container.innerHTML = `
      <div class="flow-step-header">
        <h3 class="flow-step-title">
          <i class="fa-solid fa-leaf"></i> Theory - Unit Folders (${escapeHTML(tutor.name)})
        </h3>
        <button class="btn-flow-back" onclick="backToModes('${tabKey}')">
          <i class="fa-solid fa-arrow-left"></i> Change Mode
        </button>
      </div>
      <div class="botanical-leaf-grid">
        ${visibleUnits.map(unit => {
          const isUnlocked = (tabKey === 'freelessons') || isPackUnlockedForStudent(state.tutorId, unit.id);
          const backendPack = (PORTAL_VIDEO_PACKS || []).find(p => p.unitId === unit.id && p.tutorId === state.tutorId);
          const realLessonCount = (backendPack && Array.isArray(backendPack.lessons)) ? backendPack.lessons.length : (unit.daysCount || 0);

          return `
          <div class="leaf-folder-card ${!isUnlocked ? 'locked-pack-card' : ''}" onclick="${isUnlocked ? `openTheoryUnitLeaf('${tabKey}', '${unit.id}')` : `openUnlockPackModal('${state.tutorId}', '${unit.id}', '${escapeHTML(unit.name)}')`}">
            <div class="leaf-top-bar">
              <div class="leaf-unit-icon">${unit.icon}</div>
              <span class="leaf-unit-pill">Unit ${unit.num}</span>
              ${!isUnlocked ? '<span class="badge-pack-locked"><i class="fa-solid fa-lock"></i> Locked</span>' : ''}
            </div>
            <div class="leaf-card-body">
              <h4>${escapeHTML(unit.name)}</h4>
            </div>
            <div class="leaf-card-footer">
              <span class="leaf-days-count">
                ${isUnlocked 
                  ? `<i class="fa-solid fa-video"></i> ${realLessonCount} Day Lesson${realLessonCount === 1 ? '' : 's'}` 
                  : `<i class="fa-solid fa-lock"></i> ${realLessonCount > 0 ? realLessonCount + ' Lessons (Locked)' : 'Unlock Required'}`
                }
              </span>
              ${isUnlocked ? `
                <button class="btn-open-leaf-folder" onclick="event.stopPropagation(); openTheoryUnitLeaf('${tabKey}', '${unit.id}')">
                  <span>Open Unit</span> <i class="fa-solid fa-folder-open"></i>
                </button>
              ` : `
                <button class="btn-unlock-pack-action" onclick="event.stopPropagation(); openUnlockPackModal('${state.tutorId}', '${unit.id}', '${escapeHTML(unit.name)}')">
                  <i class="fa-solid fa-unlock"></i> <span>Unlock It</span>
                </button>
              `}
            </div>
          </div>
        `}).join('')}
      </div>
    `;
  } else if (state.step === 'theory-lessons') {
    // Step 3A Sub: Day Lessons for selected unit (Clean titles only)
    const tutor = TUTORS_DATA.find(t => t.id === state.tutorId) || TUTORS_DATA[0];
    const unit = THEORY_LEAF_UNITS_DATA.find(u => u.id === state.unitKey) || THEORY_LEAF_UNITS_DATA[0];
    const isUnitUnlocked = (tabKey === 'freelessons') || isPackUnlockedForStudent(state.tutorId, unit.id);

    // Get real lessons from backend if present
    const backendPack = (PORTAL_VIDEO_PACKS || []).find(p => p.unitId === state.unitKey && p.tutorId === state.tutorId);
    let lessonsList = [];
    if (backendPack && backendPack.lessons && backendPack.lessons.length > 0) {
      lessonsList = backendPack.lessons.map((l, idx) => ({
        day: l.day || `Day ${String(idx + 1).padStart(2, '0')}`,
        title: l.title,
        duration: l.duration || '1h 30m',
        ytId: l.ytId,
        tuteUrl: l.tuteUrl || '',
        isLocked: l.isLocked
      }));
    }

    container.innerHTML = `
      <div class="flow-step-header">
        <h3 class="flow-step-title">
          ${unit.icon} ${escapeHTML(unit.name)} - Day Lessons (${escapeHTML(tutor.name)})
          ${!isUnitUnlocked ? '<span class="badge-pack-locked" style="margin-left: 10px;"><i class="fa-solid fa-lock"></i> Locked</span>' : ''}
        </h3>
        <button class="btn-flow-back" onclick="backToTheoryUnits('${tabKey}')">
          <i class="fa-solid fa-arrow-left"></i> Back to Folders
        </button>
      </div>
      <div class="yt-lessons-grid">
        ${lessonsList.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; background: rgba(255, 255, 255, 0.85); border-radius: 20px; border: 1.5px dashed rgba(16, 185, 129, 0.35);">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #10b981; font-size: 1.8rem;">
              <i class="fa-solid fa-video-slash"></i>
            </div>
            <h4 style="font-size: 1.15rem; color: #064e3b; font-weight: 800; margin-bottom: 8px;">දැනට මෙම Unit එක සඳහා වීඩියෝ පාඩම් එක් කර නොමැත</h4>
            <p style="color: #64748b; font-size: 0.9rem; max-width: 440px; margin: 0 auto;">Admin Studio මඟින් මෙම Unit එකට අදාළ Masterclass පාඩම් එක් කළ විගස මෙහි දිස්වනු ඇත.</p>
          </div>
        ` : lessonsList.map(lesson => {
          const ytMatch = (lesson.ytId || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
          const validYtId = ytMatch ? ytMatch[1] : (/^[a-zA-Z0-9_-]{11}$/.test((lesson.ytId || '').trim()) ? lesson.ytId.trim() : null);
          const thumbSrc = validYtId ? `https://img.youtube.com/vi/${validYtId}/hqdefault.jpg` : '/hero.jpg';

          return `
          <div class="yt-lesson-card ${!isUnitUnlocked ? 'locked-lesson' : ''}" onclick="${isUnitUnlocked ? `openVideoPlayerModal('${escapeHTML(lesson.title)}', 'Unit ${unit.num} • ${lesson.day}', '${lesson.duration}', '${lesson.ytId}')` : `openUnlockPackModal('${state.tutorId}', '${unit.id}', '${escapeHTML(unit.name)}')`}">
            <div class="yt-thumbnail-wrap">
              <img src="${thumbSrc}" alt="${escapeHTML(lesson.title)}" class="yt-thumbnail-img" onerror="this.src='/hero.jpg'">
              <div class="yt-play-overlay-btn">
                <i class="fa-solid ${isUnitUnlocked ? 'fa-play' : 'fa-lock'}"></i>
              </div>
              <span class="yt-badge-day">${lesson.day}</span>
              <span class="yt-badge-duration">${lesson.duration}</span>
            </div>
            <div class="yt-lesson-content">
              <span class="yt-lesson-unit-tag">Unit ${unit.num} • ${escapeHTML(tutor.name.split(' ')[0])}</span>
              <h4 class="yt-lesson-title">${escapeHTML(lesson.title)}</h4>
              <div class="yt-lesson-footer">
                ${isUnitUnlocked ? `
                  <button class="btn-yt-watch" onclick="event.stopPropagation(); openVideoPlayerModal('${escapeHTML(lesson.title)}', 'Unit ${unit.num} • ${lesson.day}', '${lesson.duration}', '${lesson.ytId}')">
                    <i class="fa-solid fa-play"></i> Watch Lesson
                  </button>
                  <button class="btn-yt-notes" onclick="event.stopPropagation(); window.open('${lesson.tuteUrl || 'https://t.me/apexbiology_tutes'}', '_blank')">
                    <i class="fa-solid fa-file-pdf"></i> Tute PDF
                  </button>
                ` : `
                  <button class="btn-unlock-pack-action" style="width: 100%;" onclick="event.stopPropagation(); openUnlockPackModal('${state.tutorId}', '${unit.id}', '${escapeHTML(unit.name)}')">
                    <i class="fa-solid fa-unlock"></i> Unlock Video Pack
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
        }).join('')}
      </div>
    `;
  } else if (state.step === 'revision-days') {
    // Step 3B: Revision Hub (Custom Folders + Direct Videos)
    const tutor = TUTORS_DATA.find(t => t.id === state.tutorId) || TUTORS_DATA[0];
    const isRevUnlocked = (tabKey === 'freelessons') || isPackUnlockedForStudent(state.tutorId, 'revision');

    // 1. FREE LESSONS MODE
    if (tabKey === 'freelessons') {
      const flList = (PORTAL_FREE_LESSONS || []).filter(l => l.tutorId === state.tutorId);

      container.innerHTML = `
        <div class="flow-step-header">
          <h3 class="flow-step-title">
            <i class="fa-solid fa-gift" style="color:#10b981;"></i> Free Biology Lessons (${escapeHTML(tutor.name)})
          </h3>
          <button class="btn-flow-back" onclick="backToTutors('${tabKey}')">
            <i class="fa-solid fa-arrow-left"></i> Change Teacher
          </button>
        </div>
        <div class="yt-lessons-grid">
          ${flList.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; background: rgba(255, 255, 255, 0.85); border-radius: 20px; border: 1.5px dashed rgba(16, 185, 129, 0.35);">
              <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #10b981; font-size: 1.8rem;">
                <i class="fa-solid fa-gift"></i>
              </div>
              <h4 style="font-size: 1.15rem; color: #064e3b; font-weight: 800; margin-bottom: 8px;">දැනට නොමිලේ නැරඹිය හැකි වීඩියෝ පාඩම් එක් කර නොමැත</h4>
              <p style="color: #64748b; font-size: 0.9rem; max-width: 440px; margin: 0 auto;">Admin Studio වෙතින් Free Lessons එක් කළ විගස මෙහි දිස්වනු ඇත.</p>
            </div>
          ` : flList.map((rev, idx) => {
            const ytMatch = (rev.ytId || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
            const validYtId = ytMatch ? ytMatch[1] : (/^[a-zA-Z0-9_-]{11}$/.test((rev.ytId || '').trim()) ? rev.ytId.trim() : null);
            const thumbSrc = validYtId ? `https://img.youtube.com/vi/${validYtId}/hqdefault.jpg` : '/hero.jpg';

            return `
            <div class="yt-lesson-card" onclick="openVideoPlayerModal('${escapeHTML(rev.title)}', '${rev.day || 'Day ' + (idx+1)} • Free Lesson', '${rev.duration || '2h 00m'}', '${rev.ytId}')">
              <div class="yt-thumbnail-wrap">
                <img src="${thumbSrc}" alt="${escapeHTML(rev.title)}" class="yt-thumbnail-img" onerror="this.src='/hero.jpg'">
                <div class="yt-play-overlay-btn">
                  <i class="fa-solid fa-play"></i>
                </div>
                <span class="yt-badge-day">${rev.day || 'Day ' + (idx+1)}</span>
                <span class="yt-badge-duration">${rev.duration || '2h 00m'}</span>
              </div>
              <div class="yt-lesson-content">
                <span class="yt-lesson-unit-tag">${escapeHTML(tutor.name.split(' ')[0])} • 100% Free</span>
                <h4 class="yt-lesson-title">${escapeHTML(rev.title)}</h4>
                <div class="yt-lesson-footer">
                  <button class="btn-yt-watch" onclick="event.stopPropagation(); openVideoPlayerModal('${escapeHTML(rev.title)}', '${rev.day || 'Day ' + (idx+1)} • Free Lesson', '${rev.duration || '2h 00m'}', '${rev.ytId}')">
                    <i class="fa-solid fa-play"></i> Watch Free
                  </button>
                  <button class="btn-yt-notes" onclick="event.stopPropagation(); window.open('${rev.tuteUrl || 'https://t.me/apexbiology_tutes'}', '_blank')">
                    <i class="fa-solid fa-file-pdf"></i> Tute PDF
                  </button>
                </div>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      `;
    } else {
      // 2. STUDY PACKS (VIDEO PACKS) REVISION HUB
      const revVideos = (PORTAL_REVISION_VIDEOS || []).filter(v => v.tutorId === state.tutorId);
      const customFolders = Array.from(new Set(revVideos.filter(v => v.folderName && v.folderName.trim()).map(v => v.folderName.trim())));
      const directVideos = revVideos.filter(v => !v.folderName || !v.folderName.trim());

      // Sub-view: Inside a specific custom revision folder
      if (state.revFolder) {
        const folderVideos = revVideos.filter(v => v.folderName === state.revFolder);
        container.innerHTML = `
          <div class="flow-step-header">
            <h3 class="flow-step-title">
              <i class="fa-solid fa-folder-open" style="color:#10b981;"></i> ${escapeHTML(state.revFolder)} (${escapeHTML(tutor.name)})
              ${!isRevUnlocked ? '<span class="badge-pack-locked" style="margin-left: 10px;"><i class="fa-solid fa-lock"></i> Locked</span>' : ''}
            </h3>
            <button class="btn-flow-back" onclick="closeRevisionFolder('${tabKey}')">
              <i class="fa-solid fa-arrow-left"></i> Back to Revision Hub
            </button>
          </div>
          <div class="yt-lessons-grid">
            ${folderVideos.length === 0 ? `
              <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; background: rgba(255, 255, 255, 0.85); border-radius: 20px; border: 1.5px dashed rgba(16, 185, 129, 0.35);">
                <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #10b981; font-size: 1.8rem;">
                  <i class="fa-solid fa-folder-open"></i>
                </div>
                <h4 style="font-size: 1.15rem; color: #064e3b; font-weight: 800; margin-bottom: 8px;">මෙම Folder එක තුළ දැනට වීඩියෝ ඇතුළත් කර නොමැත</h4>
                <p style="color: #64748b; font-size: 0.9rem; max-width: 440px; margin: 0 auto;">Admin Studio මඟින් මෙම Folder එකට වීඩියෝ එක් කළ විගස මෙහි දිස්වනු ඇත.</p>
              </div>
            ` : folderVideos.map(rev => {
              const ytMatch = (rev.ytId || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
              const validYtId = ytMatch ? ytMatch[1] : (/^[a-zA-Z0-9_-]{11}$/.test((rev.ytId || '').trim()) ? rev.ytId.trim() : null);
              const thumbSrc = validYtId ? `https://img.youtube.com/vi/${validYtId}/hqdefault.jpg` : '/hero.jpg';

              return `
              <div class="yt-lesson-card ${!isRevUnlocked ? 'locked-lesson' : ''}" onclick="${isRevUnlocked ? `openVideoPlayerModal('${escapeHTML(rev.title)}', '${escapeHTML(state.revFolder)}', '${rev.duration}', '${rev.ytId}')` : `openUnlockPackModal('${state.tutorId}', 'revision', 'A/L Biology Revision Pack')`}">
                <div class="yt-thumbnail-wrap">
                  <img src="${thumbSrc}" alt="${escapeHTML(rev.title)}" class="yt-thumbnail-img" onerror="this.src='/hero.jpg'">
                  <div class="yt-play-overlay-btn">
                    <i class="fa-solid ${isRevUnlocked ? 'fa-play' : 'fa-lock'}"></i>
                  </div>
                  <span class="yt-badge-day">${escapeHTML(state.revFolder.split(' ')[0])}</span>
                  <span class="yt-badge-duration">${rev.duration || '2h 00m'}</span>
                </div>
                <div class="yt-lesson-content">
                  <span class="yt-lesson-unit-tag">${escapeHTML(tutor.name.split(' ')[0])} • Revision</span>
                  <h4 class="yt-lesson-title">${escapeHTML(rev.title)}</h4>
                  <div class="yt-lesson-footer">
                    ${isRevUnlocked ? `
                      <button class="btn-yt-watch" onclick="event.stopPropagation(); openVideoPlayerModal('${escapeHTML(rev.title)}', '${escapeHTML(state.revFolder)}', '${rev.duration}', '${rev.ytId}')">
                        <i class="fa-solid fa-play"></i> Watch Revision
                      </button>
                      <button class="btn-yt-notes" onclick="event.stopPropagation(); window.open('${rev.tuteUrl || 'https://t.me/apexbiology_tutes'}', '_blank')">
                        <i class="fa-solid fa-file-pdf"></i> Tute PDF
                      </button>
                    ` : `
                      <button class="btn-unlock-pack-action" style="width: 100%;" onclick="event.stopPropagation(); openUnlockPackModal('${state.tutorId}', 'revision', 'A/L Biology Revision Pack')">
                        <i class="fa-solid fa-unlock"></i> Unlock Revision Pack
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
            }).join('')}
          </div>
        `;
      } else {
        // Main Revision Hub: Shows Custom Folders + Direct Videos
        container.innerHTML = `
          <div class="flow-step-header">
            <h3 class="flow-step-title">
              <i class="fa-solid fa-crosshairs"></i> Revision Masterclasses (${escapeHTML(tutor.name)})
              ${!isRevUnlocked ? '<span class="badge-pack-locked" style="margin-left: 10px;"><i class="fa-solid fa-lock"></i> Locked</span>' : ''}
            </h3>
            <button class="btn-flow-back" onclick="backToModes('${tabKey}')">
              <i class="fa-solid fa-arrow-left"></i> ${tutor.hasTheory ? 'Change Mode' : 'Change Teacher'}
            </button>
          </div>

          ${customFolders.length > 0 ? `
            <div style="margin-bottom:28px;">
              <h4 style="font-size:1.05rem; font-weight:800; color:#064e3b; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-folder-tree" style="color:#10b981;"></i> Custom Revision Folders (අභිරුචි ෆෝල්ඩර):
              </h4>
              <div class="botanical-leaf-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
                ${customFolders.map(fName => {
                  const count = revVideos.filter(v => v.folderName === fName).length;
                  return `
                    <div class="leaf-folder-card" onclick="openRevisionFolder('${tabKey}', '${escapeHTML(fName)}')">
                      <div class="leaf-top-bar">
                        <div class="leaf-unit-icon"><i class="fa-solid fa-folder-open" style="color:#10b981;"></i></div>
                        <span class="leaf-unit-pill">${count} Videos</span>
                      </div>
                      <div class="leaf-card-body">
                        <h4 style="font-size:1.05rem; font-weight:800;">${escapeHTML(fName)}</h4>
                      </div>
                      <div class="leaf-card-footer">
                        <span class="leaf-days-count"><i class="fa-solid fa-play"></i> Discussion Sessions</span>
                        <button class="btn-open-leaf-folder" onclick="event.stopPropagation(); openRevisionFolder('${tabKey}', '${escapeHTML(fName)}')">
                          <span>Open Folder</span> <i class="fa-solid fa-folder-open"></i>
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Direct Videos Section -->
          <div>
            ${customFolders.length > 0 ? `
              <h4 style="font-size:1.05rem; font-weight:800; color:#064e3b; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i> Direct Revision Sessions (Day-by-Day Masterclasses):
              </h4>
            ` : ''}
            <div class="yt-lessons-grid">
              ${(directVideos.length === 0 && customFolders.length === 0) ? `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 24px; background: rgba(255, 255, 255, 0.85); border-radius: 20px; border: 1.5px dashed rgba(16, 185, 129, 0.35); margin-top: 14px;">
                  <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #10b981; font-size: 1.8rem;">
                    <i class="fa-solid fa-video-slash"></i>
                  </div>
                  <h4 style="font-size: 1.15rem; color: #064e3b; font-weight: 800; margin-bottom: 8px;">දැනට Revision Masterclasses එක් කර නොමැත</h4>
                  <p style="color: #64748b; font-size: 0.9rem; max-width: 440px; margin: 0 auto;">Admin Studio වෙතින් මෙම ගුරුවරයා සඳහා Revision වීඩියෝ එක් කළ විගස මෙහි දිස්වනු ඇත.</p>
                </div>
              ` : directVideos.map((rev, idx) => {
                const ytMatch = (rev.ytId || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
                const validYtId = ytMatch ? ytMatch[1] : (/^[a-zA-Z0-9_-]{11}$/.test((rev.ytId || '').trim()) ? rev.ytId.trim() : null);
                const thumbSrc = validYtId ? `https://img.youtube.com/vi/${validYtId}/hqdefault.jpg` : '/hero.jpg';

                return `
                <div class="yt-lesson-card ${!isRevUnlocked ? 'locked-lesson' : ''}" onclick="${isRevUnlocked ? `openVideoPlayerModal('${escapeHTML(rev.title)}', '${rev.day || 'Day ' + (idx+1)} • Revision', '${rev.duration || '2h 00m'}', '${rev.ytId}')` : `openUnlockPackModal('${state.tutorId}', 'revision', 'A/L Biology Revision Pack')`}">
                  <div class="yt-thumbnail-wrap">
                    <img src="${thumbSrc}" alt="${escapeHTML(rev.title)}" class="yt-thumbnail-img" onerror="this.src='/hero.jpg'">
                    <div class="yt-play-overlay-btn">
                      <i class="fa-solid ${isRevUnlocked ? 'fa-play' : 'fa-lock'}"></i>
                    </div>
                    <span class="yt-badge-day">${rev.day || 'Day ' + (idx+1)}</span>
                    <span class="yt-badge-duration">${rev.duration || '2h 00m'}</span>
                  </div>
                  <div class="yt-lesson-content">
                    <span class="yt-lesson-unit-tag">${rev.day || 'Day ' + (idx+1)} • ${escapeHTML(tutor.name.split(' ')[0])}</span>
                    <h4 class="yt-lesson-title">${escapeHTML(rev.title)}</h4>
                    <div class="yt-lesson-footer">
                      ${isRevUnlocked ? `
                        <button class="btn-yt-watch" onclick="event.stopPropagation(); openVideoPlayerModal('${escapeHTML(rev.title)}', '${rev.day || 'Day ' + (idx+1)} • Revision', '${rev.duration || '2h 00m'}', '${rev.ytId}')">
                          <i class="fa-solid fa-play"></i> Watch Revision
                        </button>
                        <button class="btn-yt-notes" onclick="event.stopPropagation(); window.open('${rev.tuteUrl || 'https://t.me/apexbiology_tutes'}', '_blank')">
                          <i class="fa-solid fa-file-pdf"></i> Tute PDF
                        </button>
                      ` : `
                        <button class="btn-unlock-pack-action" style="width: 100%;" onclick="event.stopPropagation(); openUnlockPackModal('${state.tutorId}', 'revision', 'A/L Biology Revision Pack')">
                          <i class="fa-solid fa-unlock"></i> Unlock Revision Pack
                        </button>
                      `}
                    </div>
                  </div>
                </div>
              `;
              }).join('')}
            </div>
          </div>
        `;
      }
    }
  }

  setTimeout(init3DTiltCards, 60);
}

function selectTutor(tabKey, tutorId) {
  flowState[tabKey].tutorId = tutorId;
  const tutor = TUTORS_DATA.find(t => t.id === tutorId);
  if (tutor && tutor.hasTheory === false) {
    // Sasanka or Dhananjaya: STRICTLY NO THEORY! Directly open Revision Hub!
    flowState[tabKey].mode = 'revision';
    flowState[tabKey].step = 'revision-days';
    flowState[tabKey].revFolder = null;
  } else {
    flowState[tabKey].step = 'mode';
  }
  renderTutorFlow(tabKey);
}

function selectMode(tabKey, mode) {
  flowState[tabKey].mode = mode;
  flowState[tabKey].step = (mode === 'theory') ? 'theory-units' : 'revision-days';
  renderTutorFlow(tabKey);
}

function openTheoryUnitLeaf(tabKey, unitKey) {
  flowState[tabKey].unitKey = unitKey;
  flowState[tabKey].step = 'theory-lessons';
  renderTutorFlow(tabKey);
}

function openRevisionFolder(tabKey, folderName) {
  flowState[tabKey].revFolder = folderName;
  renderTutorFlow(tabKey);
}

function closeRevisionFolder(tabKey) {
  flowState[tabKey].revFolder = null;
  renderTutorFlow(tabKey);
}

function backToTutors(tabKey) {
  flowState[tabKey].step = 'tutors';
  flowState[tabKey].tutorId = null;
  flowState[tabKey].revFolder = null;
  renderTutorFlow(tabKey);
}

function backToModes(tabKey) {
  const tutor = TUTORS_DATA.find(t => t.id === flowState[tabKey].tutorId);
  if (tutor && tutor.hasTheory === false) {
    backToTutors(tabKey);
    return;
  }
  flowState[tabKey].step = 'mode';
  flowState[tabKey].unitKey = null;
  flowState[tabKey].revFolder = null;
  renderTutorFlow(tabKey);
}

function backToTheoryUnits(tabKey) {
  flowState[tabKey].step = 'theory-units';
  flowState[tabKey].unitKey = null;
  renderTutorFlow(tabKey);
}

// ==========================================================================
// 9. IN-PORTAL BIO BANK EXPLORER (Shared across Standalone & Dashboard)
// ==========================================================================
let activePortalBioBankUnit = null;
let activePortalBioBankFolder = null;
let activePortalBioBankFilter = 'all';

function initPortalBioBank() {
  renderPortalBioBank();
}

function renderPortalBioBank() {
  const container = document.getElementById('portal-biobank-container');
  if (!container) return;

  const isGloballyBlurred = (PORTAL_BIOBANK && PORTAL_BIOBANK.isBlurred !== false);
  let studentEmail = '';
  if (currentStudent && currentStudent.email) {
    studentEmail = currentStudent.email.trim().toLowerCase();
  } else {
    try {
      const saved = localStorage.getItem('apex_bio_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        studentEmail = (parsed.email || '').trim().toLowerCase();
      }
    } catch (e) {}
  }
  const isSuperUser = (studentEmail === 'dg.edits65@gmail.com');

  const units = (PORTAL_BIOBANK && Array.isArray(PORTAL_BIOBANK.units) && PORTAL_BIOBANK.units.length > 0)
    ? PORTAL_BIOBANK.units
    : (typeof BIO_BANK_DATA !== 'undefined' ? BIO_BANK_DATA : []);

  // If globally blurred and user is NOT dg.edits65@gmail.com, show locked blurred view
  if (isGloballyBlurred && !isSuperUser) {
    container.innerHTML = `
      <div style="position: relative; min-height: 520px; padding: 10px 0;">
        <!-- Locked Message Overlay -->
        <div class="biobank-portal-locked-overlay" style="position: absolute; top: 40px; left: 50%; transform: translateX(-50%); z-index: 25; width: 92%; max-width: 580px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 2px solid #10b981; border-radius: 24px; padding: 36px 30px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <div style="width: 72px; height: 72px; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 1.9rem; color: #10b981;">
            <i class="fa-solid fa-lock"></i>
          </div>
          <span style="display: inline-block; background: #f59e0b; color: #000; font-size: 0.78rem; font-weight: 800; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
            🔒 තවමත් විවෘත කර නොමැත (Coming Soon)
          </span>
          <h3 style="font-size: 1.45rem; font-weight: 800; color: #ffffff; margin-bottom: 10px;">Apex Bio Bank Vault Under Preparation</h3>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.6; margin-bottom: 22px;">
            ජීව විද්‍යාව සියලු ඒකක සඳහා සකස් කරන ලද විශේෂ කෙටි සටහන්, Mind Maps, රූප සටහන් සහ Structured Essays නොබෝ දිනකින් සියලු සිසුන් සඳහා විවෘත කරනු ලැබේ.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary-action small" onclick="switchDashboardTab('tab-overview')" style="background: #10b981; color: #ffffff; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer;">
              <i class="fa-solid fa-house"></i> Return to Dashboard
            </button>
            <a href="https://t.me/apexbiology_tutes" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #0284c7; color: #ffffff; padding: 10px 20px; border-radius: 10px; font-weight: 700; text-decoration: none;">
              <i class="fa-brands fa-telegram"></i> Telegram Tutes
            </a>
          </div>
        </div>

        <!-- Blurred Background Grid -->
        <div style="filter: blur(10px) grayscale(40%); opacity: 0.45; pointer-events: none; user-select: none;">
          <div class="biobank-units-grid">
            ${units.map(unit => {
              const totalDocs = (unit.folders || []).length + (unit.items || []).length + 
                Object.values(unit.categories || {}).reduce((s, a) => s + (a || []).length, 0);
              return `
                <div class="biobank-folder-card">
                  <div class="biobank-folder-tab">Unit ${unit.num || unit.id}</div>
                  <div class="biobank-folder-header">
                    <span class="biobank-folder-icon">${unit.icon || '🌿'}</span>
                    <span class="biobank-docs-badge">${totalDocs} Items</span>
                  </div>
                  <h3 class="biobank-folder-title">${escapeHtml(unit.name)}</h3>
                  <span class="biobank-folder-eng">${escapeHtml(unit.eng || '')}</span>
                  <div class="biobank-folder-badges">
                    <span><i class="fa-solid fa-folder"></i> Folders</span>
                    <span><i class="fa-solid fa-images"></i> Diagrams</span>
                    <span><i class="fa-solid fa-file-pdf"></i> Short Notes</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    return;
  }

  // VIP Full Access Notice Banner for dg.edits65@gmail.com when Bio Bank is still blurred for others
  let vipBanner = '';
  if (isSuperUser && isGloballyBlurred) {
    vipBanner = `
      <div style="background: rgba(16, 185, 129, 0.12); border: 1.5px solid #10b981; border-radius: 14px; padding: 12px 18px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; color: #10b981; font-weight: 700; font-size: 0.92rem;">
          <i class="fa-solid fa-crown" style="color: #f59e0b; font-size: 1.15rem;"></i>
          <span>VIP Full Access Active: Bio Bank is unlocked for <strong>${studentEmail}</strong></span>
        </div>
        <span style="font-size: 0.75rem; background: #10b981; color: #064e3b; padding: 4px 12px; border-radius: 20px; font-weight: 800; letter-spacing: 0.5px;">UNLOCKED FOR YOU</span>
      </div>
    `;
  }

  // 1. ALL UNITS VIEW
  if (!activePortalBioBankUnit) {
    container.innerHTML = `
      ${vipBanner}
      <div class="biobank-units-grid">
        ${units.map(unit => {
          const folderCount = (unit.folders || []).length;
          let totalDocs = (unit.items || []).length;
          (unit.folders || []).forEach(f => { totalDocs += (f.items || []).length; });
          if (unit.categories) {
            Object.values(unit.categories).forEach(arr => { totalDocs += (arr || []).length; });
          }
          return `
            <div class="biobank-folder-card" onclick="openPortalBioBankUnitFolder('${unit.id}')">
              <div class="biobank-folder-tab">Unit ${unit.num || unit.id}</div>
              <div class="biobank-folder-header">
                <span class="biobank-folder-icon">${unit.icon || '🌿'}</span>
                <span class="biobank-docs-badge">${totalDocs} Items</span>
              </div>
              <h3 class="biobank-folder-title">${escapeHtml(unit.name)}</h3>
              <span class="biobank-folder-eng">${escapeHtml(unit.eng || '')}</span>
              <div class="biobank-folder-badges">
                <span><i class="fa-solid fa-folder"></i> ${folderCount} Folders</span>
                <span><i class="fa-solid fa-images"></i> Diagrams</span>
                <span><i class="fa-solid fa-file-pdf"></i> Short Notes</span>
              </div>
              <button class="btn-open-biobank-folder" onclick="event.stopPropagation(); openPortalBioBankUnitFolder('${unit.id}')">
                <span>Open Unit Bank</span> <i class="fa-solid fa-folder-open"></i>
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // 2. UNIT DRILLDOWN VIEW (SUBFOLDERS & MATERIALS)
    const unit = units.find(u => u.id === activePortalBioBankUnit) || units[0];
    const allFolders = unit.folders || [];
    const currentFolder = activePortalBioBankFolder ? allFolders.find(f => f.id === activePortalBioBankFolder) : null;

    // Subfolders at current level
    const subfolders = allFolders.filter(f => {
      if (activePortalBioBankFolder) {
        return f.parentFolderId === activePortalBioBankFolder;
      }
      return !f.parentFolderId;
    });

    // Materials / Items at current level
    let items = [];
    if (activePortalBioBankFolder && currentFolder) {
      items = currentFolder.items || [];
    } else {
      items = (unit.items || []).filter(it => !it.folderId);
      // Legacy categories items if present at unit root
      if (unit.categories) {
        Object.entries(unit.categories).forEach(([catKey, list]) => {
          (list || []).forEach(it => {
            if (!items.find(x => x.id === it.id)) {
              items.push({
                ...it,
                isLegacy: true,
                legacyCategory: catKey
              });
            }
          });
        });
      }
    }

    container.innerHTML = `
      ${vipBanner}
      <div class="biobank-unit-details-view">
        <div class="biobank-details-header" style="flex-wrap: wrap; gap: 14px;">
          <div class="biobank-breadcrumb" style="display: flex; align-items: center; gap: 8px;">
            <button class="btn-biobank-back" onclick="activePortalBioBankFolder ? closePortalBioBankSubfolder() : closePortalBioBankUnitFolder()">
              <i class="fa-solid fa-arrow-left"></i> ${activePortalBioBankFolder ? 'Back to Unit Root' : 'All Units'}
            </button>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-current" style="cursor: pointer;" onclick="closePortalBioBankSubfolder()">
              ${unit.icon || '🌿'} Unit ${unit.num || unit.id}: ${escapeHtml(unit.name)}
            </span>
            ${currentFolder ? `
              <span class="breadcrumb-sep">/</span>
              <span style="font-weight: 800; color: #10b981;"><i class="fa-solid fa-folder-open"></i> ${escapeHtml(currentFolder.name)}</span>
            ` : ''}
          </div>
        </div>

        <!-- Subfolders Grid -->
        ${subfolders.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 0.95rem; font-weight: 800; color: #047857; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-folder-tree"></i> Unit Folders (${subfolders.length})
            </h4>
            <div class="biobank-subfolders-grid">
              ${subfolders.map(f => `
                <div class="biobank-subfolder-card" onclick="openPortalBioBankSubfolder('${f.id}')">
                  <div class="subfolder-left">
                    <i class="fa-solid fa-folder" style="color: #f59e0b; font-size: 1.4rem;"></i>
                    <div>
                      <div class="subfolder-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</div>
                      <div class="subfolder-items-count">${(f.items || []).length} materials</div>
                    </div>
                  </div>
                  <i class="fa-solid fa-chevron-right" style="color: #94a3b8; font-size: 0.85rem;"></i>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Materials & Resources Grid -->
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-layer-group"></i> Materials, Diagrams & Notes (${items.length})
          </h4>
          ${items.length === 0 ? `
            <div style="background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 16px; padding: 36px 20px; text-align: center; color: #64748b;">
              <i class="fa-solid fa-box-open" style="font-size: 2rem; color: #94a3b8; margin-bottom: 10px; display: block;"></i>
              මෙම ෆෝල්ඩරයේ තවමත් ද්‍රව්‍ය එක්කර නොමැත. කරුණාකර නැවත පසුව පරීක්ෂා කරන්න.
            </div>
          ` : `
            <div class="biobank-items-grid">
              ${items.map(it => {
                const isImg = it.type === 'image' || (it.images && it.images.length > 0);
                const isPdf = it.type === 'pdf' || (it.fileUrl && it.fileUrl.endsWith('.pdf')) || it.pdfUrl || it.downloadUrl;
                const isTxt = it.type === 'text' || Boolean(it.textContent);
                const primaryImg = (it.images && it.images.length > 0) ? it.images[0] : (it.url || '');
                const fileLink = it.url || it.fileUrl || it.pdfUrl || it.downloadUrl || '';

                return `
                  <div class="biobank-item-card">
                    <div>
                      <div class="biobank-item-top">
                        <div class="biobank-item-icon-box ${isImg ? 'image' : (isPdf ? 'pdf' : 'text')}">
                          <i class="fa-solid ${isImg ? 'fa-images' : (isPdf ? 'fa-file-pdf' : 'fa-file-lines')}"></i>
                        </div>
                        <div class="biobank-item-info">
                          <h5 class="biobank-item-title">${escapeHtml(it.title)}</h5>
                          <div class="biobank-item-meta">
                            ${isImg ? `${(it.images || []).length || 1} Diagrams • WebP` : (isPdf ? `${it.pages || 'PDF Document'}` : 'Short Note')}
                            ${it.date ? ` • ${it.date}` : ''}
                          </div>
                        </div>
                      </div>

                      ${isImg && primaryImg ? `
                        <img src="${primaryImg}" class="biobank-item-image-preview" alt="${escapeHtml(it.title)}" onclick="openPortalBioBankImageGallery('${escapeHtml(it.title).replace(/'/g, "\\'")}', ${JSON.stringify(it.images || [primaryImg]).replace(/"/g, '&quot;')})">
                      ` : ''}

                      ${isTxt && it.textContent ? `
                        <div class="biobank-item-text-preview" onclick="openPortalBioBankTextNote('${escapeHtml(it.title).replace(/'/g, "\\'")}', '${escapeHtml(it.textContent).replace(/'/g, "\\'")}')">
                          ${escapeHtml(it.textContent)}
                        </div>
                      ` : ''}
                    </div>

                    <div class="biobank-item-actions">
                      ${isImg ? `
                        <button type="button" class="btn-item-view" onclick="openPortalBioBankImageGallery('${escapeHtml(it.title).replace(/'/g, "\\'")}', ${JSON.stringify(it.images || [primaryImg]).replace(/"/g, '&quot;')})">
                          <i class="fa-solid fa-expand"></i> View Diagrams (${(it.images || []).length || 1})
                        </button>
                      ` : (isPdf && fileLink ? `
                        <a href="${fileLink}" target="_blank" class="btn-item-view">
                          <i class="fa-solid fa-arrow-down-to-bracket"></i> Download / View PDF
                        </a>
                      ` : (isTxt ? `
                        <button type="button" class="btn-item-view" onclick="openPortalBioBankTextNote('${escapeHtml(it.title).replace(/'/g, "\\'")}', '${escapeHtml(it.textContent).replace(/'/g, "\\'")}')">
                          <i class="fa-solid fa-book-open"></i> Read Full Note
                        </button>
                      ` : `<span></span>`))}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }
}

function openPortalBioBankUnitFolder(unitId) {
  const isGloballyBlurred = (PORTAL_BIOBANK && PORTAL_BIOBANK.isBlurred !== false);
  let studentEmail = '';
  if (currentStudent && currentStudent.email) {
    studentEmail = currentStudent.email.trim().toLowerCase();
  } else {
    try {
      const saved = localStorage.getItem('apex_bio_student');
      if (saved) studentEmail = (JSON.parse(saved).email || '').trim().toLowerCase();
    } catch (e) {}
  }
  if (isGloballyBlurred && studentEmail !== 'dg.edits65@gmail.com') {
    showToast('🔒 Bio Bank තවමත් විවෘත කර නොමැත. නොබෝ දිනකින් විවෘත වේ.');
    return;
  }
  activePortalBioBankUnit = unitId;
  activePortalBioBankFolder = null;
  renderPortalBioBank();
}

function openPortalBioBankSubfolder(folderId) {
  activePortalBioBankFolder = folderId;
  renderPortalBioBank();
}

function closePortalBioBankSubfolder() {
  activePortalBioBankFolder = null;
  renderPortalBioBank();
}

function closePortalBioBankUnitFolder() {
  activePortalBioBankUnit = null;
  activePortalBioBankFolder = null;
  renderPortalBioBank();
}

function openPortalBioBankImageGallery(title, images) {
  if (!images || images.length === 0) return;
  let modal = document.getElementById('modal-portal-image-gallery');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-portal-image-gallery';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-card" style="max-width: 840px; max-height: 90vh; overflow-y: auto;">
      <button class="modal-close-btn" onclick="document.getElementById('modal-portal-image-gallery').classList.remove('active')"><i class="fa-solid fa-xmark"></i></button>
      <h3 style="margin-bottom: 14px;"><i class="fa-solid fa-images"></i> ${escapeHtml(title)}</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-top: 14px;">
        ${images.map(img => `
          <div style="border-radius: 12px; overflow: hidden; border: 1.5px solid #e2e8f0; background: #0f172a; text-align: center;">
            <a href="${img}" target="_blank" title="Click to view original high-resolution">
              <img src="${img}" style="width: 100%; height: 220px; object-fit: contain;" alt="Diagram">
            </a>
            <div style="padding: 8px; background: rgba(0,0,0,0.5);">
              <a href="${img}" target="_blank" style="font-size: 0.78rem; color: #38bdf8; text-decoration: none; font-weight: 700;">
                <i class="fa-solid fa-expand"></i> View High-Res
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function openPortalBioBankTextNote(title, textContent) {
  let modal = document.getElementById('modal-portal-text-note');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-portal-text-note';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-card" style="max-width: 650px;">
      <button class="modal-close-btn" onclick="document.getElementById('modal-portal-text-note').classList.remove('active')"><i class="fa-solid fa-xmark"></i></button>
      <h3 style="margin-bottom: 12px;"><i class="fa-solid fa-file-lines"></i> ${escapeHtml(title)}</h3>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; line-height: 1.7; font-size: 0.95rem; color: #1e293b; white-space: pre-wrap; max-height: 60vh; overflow-y: auto;">
        ${escapeHtml(textContent)}
      </div>
    </div>
  `;
  modal.classList.add('active');
}

// ==========================================================================
// 10. SECURE ANTI-EXTRACTION VIDEO PLAYER CONTROLLER
// Shields YouTube embed against inspect element, title clicks & redirects
// ==========================================================================
let securePlayerState = {
  isPlaying: false,
  isMuted: false,
  duration: 0,
  currentTime: 0,
  timer: null,
  durationStr: '00:00'
};

let ytPlayer = null;
let ytApiReady = false;

window.onYouTubeIframeAPIReady = function() {
  ytApiReady = true;
};

// Global YouTube postMessage listener for real-time video duration and current time tracking
if (!window._ytSecureMessageBound) {
  window._ytSecureMessageBound = true;
  window.addEventListener('message', function(e) {
    try {
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      if (!data) return;

      if (data.event === 'infoDelivery' && data.info) {
        if (typeof data.info.duration === 'number' && data.info.duration > 0) {
          securePlayerState.duration = data.info.duration;
        }
        if (typeof data.info.currentTime === 'number') {
          securePlayerState.currentTime = data.info.currentTime;
        }
        if (typeof data.info.playerState === 'number') {
          const isPlaying = (data.info.playerState === 1);
          securePlayerState.isPlaying = isPlaying;
          const playIcon = document.getElementById('secure-play-btn-icon');
          const centerPlayBadge = document.getElementById('secure-center-play-badge');
          if (playIcon) playIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
          if (centerPlayBadge) centerPlayBadge.classList.toggle('show-play', !isPlaying);
        }
        updateSecurePlayerUI();
      }
    } catch (err) {}
  });
}

function formatPlayerTime(sec) {
  if (!sec || isNaN(sec) || sec <= 0) return '00:00';
  const total = Math.floor(sec);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function updateSecurePlayerUI() {
  const cur = securePlayerState.currentTime || 0;
  const dur = securePlayerState.duration || 0;

  const timeCounterEl = document.getElementById('secure-time-counter');
  if (timeCounterEl) {
    if (dur > 0) {
      timeCounterEl.textContent = `${formatPlayerTime(cur)} / ${formatPlayerTime(dur)}`;
    } else {
      timeCounterEl.textContent = `${formatPlayerTime(cur)} / Loading...`;
    }
  }

  const scrubberFill = document.getElementById('secure-scrubber-fill');
  if (scrubberFill) {
    const percent = dur > 0 ? Math.min(100, Math.max(0, (cur / dur) * 100)) : 0;
    scrubberFill.style.width = `${percent}%`;
  }
}

function openVideoPlayerModal(title, unitTag, duration, ytId) {
  // Support single object parameter: openVideoPlayerModal({ title, unitTag, duration, ytId })
  if (typeof title === 'object' && title !== null) {
    const obj = title;
    title = obj.title || 'Biology Masterclass';
    unitTag = obj.unitTag || obj.desc || 'A/L Biology';
    duration = obj.duration || '';
    ytId = obj.ytId || obj.ytUrl || '';
  }
  const titleEl = document.getElementById('player-video-title');
  const unitTagEl = document.getElementById('player-unit-tag');
  const timeCounterEl = document.getElementById('secure-time-counter');
  const iframe = document.getElementById('secure-yt-iframe');
  const scrubberFill = document.getElementById('secure-scrubber-fill');
  const playIcon = document.getElementById('secure-play-btn-icon');
  const centerPlayBadge = document.getElementById('secure-center-play-badge');

  if (titleEl) titleEl.textContent = title;
  if (unitTagEl) unitTagEl.textContent = unitTag;
  if (timeCounterEl) timeCounterEl.textContent = '00:00 / Loading...';
  if (scrubberFill) scrubberFill.style.width = '0%';
  if (playIcon) playIcon.className = 'fa-solid fa-pause';
  if (centerPlayBadge) centerPlayBadge.classList.remove('show-play');

  // Reset player state to real dynamic values (no more hardcoded 2h 00m)
  securePlayerState = {
    isPlaying: true,
    isMuted: false,
    duration: 0,
    currentTime: 0,
    timer: null,
    durationStr: '00:00'
  };

  // Secure YouTube URL: handles full links, shorts, live, or raw 11-char IDs
  let cleanYtId = '';
  if (ytId) {
    const raw = ytId.trim();
    if (raw.includes('t.me/')) {
      window.open(raw, '_blank');
      showToast('Opening video lesson on Telegram...');
      return;
    }
    const m = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
    if (m && m[1]) {
      cleanYtId = m[1];
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
      cleanYtId = raw;
    }
  }

  if (!cleanYtId) {
    showToast('⚠️ මෙම පාඩම සඳහා Video Link එකක් තවමත් ඇතුළත් කර නොමැත.');
    return;
  }
  const originParam = encodeURIComponent(window.location.origin);
  const embedUrl = `https://www.youtube.com/embed/${cleanYtId}?autoplay=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1&origin=${originParam}`;

  if (iframe) {
    iframe.src = embedUrl;
  }

  // Also bind/initialize YT.Player if available
  if (window.YT && window.YT.Player) {
    try {
      if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
        ytPlayer.loadVideoById(cleanYtId);
      } else {
        ytPlayer = new YT.Player('secure-yt-iframe', {
          events: {
            'onStateChange': function(ev) {
              if (ev.data === 1) { // Playing
                securePlayerState.isPlaying = true;
                if (playIcon) playIcon.className = 'fa-solid fa-pause';
                if (centerPlayBadge) centerPlayBadge.classList.remove('show-play');
              } else if (ev.data === 2 || ev.data === 0) { // Paused / Ended
                securePlayerState.isPlaying = false;
                if (playIcon) playIcon.className = 'fa-solid fa-play';
                if (centerPlayBadge) centerPlayBadge.classList.add('show-play');
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn('YT.Player init notice:', e);
    }
  }

  // Real-time polling ticker: queries both YT.Player and iframe postMessage
  if (securePlayerState.timer) clearInterval(securePlayerState.timer);
  securePlayerState.timer = setInterval(updateSecurePlayerTime, 500);

  openModal('video-player-modal');
  showToast(`Streaming: ${title} (Encrypted 1080p)`);
}

function updateSecurePlayerTime() {
  const iframe = document.getElementById('secure-yt-iframe');

  // 1. Try reading from official YT.Player instance if initialized
  if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function' && typeof ytPlayer.getDuration === 'function') {
    try {
      const dur = ytPlayer.getDuration();
      const cur = ytPlayer.getCurrentTime();
      if (typeof dur === 'number' && dur > 0) {
        securePlayerState.duration = dur;
      }
      if (typeof cur === 'number' && cur >= 0) {
        securePlayerState.currentTime = cur;
      }
      updateSecurePlayerUI();
      return;
    } catch (e) {}
  }

  // 2. Request real time and duration from iframe via postMessage
  if (iframe && iframe.contentWindow) {
    try {
      iframe.contentWindow.postMessage('{"event":"command","func":"getCurrentTime","args":""}', '*');
      iframe.contentWindow.postMessage('{"event":"command","func":"getDuration","args":""}', '*');
    } catch (e) {}
  }
}

function toggleSecurePlayback() {
  const iframe = document.getElementById('secure-yt-iframe');
  const playIcon = document.getElementById('secure-play-btn-icon');
  const centerPlayBadge = document.getElementById('secure-center-play-badge');

  securePlayerState.isPlaying = !securePlayerState.isPlaying;

  if (securePlayerState.isPlaying) {
    if (playIcon) playIcon.className = 'fa-solid fa-pause';
    if (centerPlayBadge) centerPlayBadge.classList.remove('show-play');

    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
      try { ytPlayer.playVideo(); } catch (e) {}
    }
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
  } else {
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (centerPlayBadge) centerPlayBadge.classList.add('show-play');

    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  }
}

function toggleSecureMute() {
  const iframe = document.getElementById('secure-yt-iframe');
  const volIcon = document.getElementById('secure-vol-btn-icon');
  securePlayerState.isMuted = !securePlayerState.isMuted;

  if (securePlayerState.isMuted) {
    if (volIcon) volIcon.className = 'fa-solid fa-volume-xmark';
    if (ytPlayer && typeof ytPlayer.mute === 'function') {
      try { ytPlayer.mute(); } catch (e) {}
    }
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
    }
    showToast('Audio Muted');
  } else {
    if (volIcon) volIcon.className = 'fa-solid fa-volume-high';
    if (ytPlayer && typeof ytPlayer.unMute === 'function') {
      try { ytPlayer.unMute(); } catch (e) {}
    }
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
    }
    showToast('Audio Unmuted (100%)');
  }
}

function seekSecureVideo(event) {
  const scrubber = event.currentTarget;
  const rect = scrubber.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const fraction = Math.max(0, Math.min(1, clickX / rect.width));

  const dur = securePlayerState.duration || 0;
  if (dur > 0) {
    const targetSec = Math.floor(fraction * dur);
    securePlayerState.currentTime = targetSec;
    updateSecurePlayerUI();

    if (ytPlayer && typeof ytPlayer.seekTo === 'function') {
      try { ytPlayer.seekTo(targetSec, true); } catch (e) {}
    }

    const iframe = document.getElementById('secure-yt-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [targetSec, true]
      }), '*');
    }
  }
}

function changeSecureVideoQuality(quality) {
  const iframe = document.getElementById('secure-yt-iframe');
  if (ytPlayer && typeof ytPlayer.setPlaybackQuality === 'function') {
    try { ytPlayer.setPlaybackQuality(quality); } catch (e) {}
  }
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: 'setPlaybackQuality',
      args: [quality]
    }), '*');
  }
  showToast(`Video Quality: ${quality.toUpperCase()}`);
}

function changeSecureVideoSpeed(speed) {
  const iframe = document.getElementById('secure-yt-iframe');
  const num = parseFloat(speed) || 1.0;
  if (ytPlayer && typeof ytPlayer.setPlaybackRate === 'function') {
    try { ytPlayer.setPlaybackRate(num); } catch (e) {}
  }
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: 'setPlaybackRate',
      args: [num]
    }), '*');
  }
  showToast(`Playback Speed: ${num}x`);
}

function toggleSecureFullscreen() {
  const container = document.getElementById('secure-player-container');
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      showToast('Entering Fullscreen...');
    });
  } else {
    document.exitFullscreen();
  }
}

function stopSecureVideo() {
  if (securePlayerState.timer) {
    clearInterval(securePlayerState.timer);
    securePlayerState.timer = null;
  }
  if (ytPlayer) {
    try {
      if (typeof ytPlayer.stopVideo === 'function') ytPlayer.stopVideo();
    } catch (e) {}
  }
  const iframe = document.getElementById('secure-yt-iframe');
  if (iframe) {
    iframe.src = 'about:blank';
  }
  securePlayerState.isPlaying = false;
  securePlayerState.currentTime = 0;
  securePlayerState.duration = 0;
}


// ==========================================================================
// 11. PORTAL REAL-TIME DATA SYNC (Live Classes, Class Cards & Locked Videos)
// ==========================================================================
let PORTAL_LIVE_CLASSES = [];
let PORTAL_CLASS_CARDS = [];
let PORTAL_VIDEO_PACKS = [];
let PORTAL_REVISION_VIDEOS = [];
let PORTAL_FREE_LESSONS = [];
  let PORTAL_PRODUCTS = [];
  let PORTAL_BIOBANK = { isBlurred: true, units: [] };
  let currentViewingProduct = null;
let PORTAL_MONTHLY_CLASSES = [];
let PORTAL_MONTHLY_FOLDERS = [];
  let PORTAL_MONTHLY_TUTES = [];
let activeSelectedCard = null;
let activeCardExplorerMonth = null;
let activeCardExplorerTutorId = null;
let activeCardExplorerClassType = 'both';
let activeCardExplorerFilter = 'all';

async function fetchPublicPortalData(year) {
  try {
    const sId = currentStudent ? currentStudent.studentId : '';
    const res = await fetch('/api/public-data?year=' + year + (sId ? '&studentId=' + sId : ''));
    const json = await res.json();
    if (json.success) {
      PORTAL_LIVE_CLASSES = json.liveClasses || [];
      PORTAL_CLASS_CARDS = json.classCards || [];
      PORTAL_VIDEO_PACKS = json.videoPacks || [];
      THEORY_LEAF_UNITS_DATA.forEach(u => {
        const pack = PORTAL_VIDEO_PACKS.find(p => p.unitId === u.id);
        if (pack && Array.isArray(pack.lessons)) {
          u.daysCount = pack.lessons.length;
        }
      });
      PORTAL_REVISION_VIDEOS = json.revisionVideos || [];
      PORTAL_FREE_LESSONS = json.freeLessons || [];
      PORTAL_MONTHLY_CLASSES = json.monthlyClasses || [];
      PORTAL_MONTHLY_FOLDERS = json.monthlyFolders || [];
        PORTAL_MONTHLY_TUTES = json.monthlyTutes || [];
        PORTAL_PRODUCTS = json.products || [];
        PORTAL_BIOBANK = json.bioBank || { isBlurred: true, units: [] };

      // Update student if server returned updated data (e.g., active cards or unlocked packs)
      if (json.student) {
        currentStudent = Object.assign(currentStudent || {}, json.student);
        localStorage.setItem('apex_bio_student', JSON.stringify(currentStudent));
      }

      // Update Tutors data if available
      if (json.tutors && json.tutors.length) {
        TUTORS_DATA.length = 0;
        json.tutors.forEach(t => TUTORS_DATA.push(t));
      }

      // Update Syllabus Units data if admin added subtopics
      if (json.syllabusUnits && json.syllabusUnits.length) {
        SYLLABUS_DATA.length = 0;
        json.syllabusUnits.forEach(u => SYLLABUS_DATA.push(u));
        renderSyllabusTracker();
      }

      renderHomeLiveClass();
      renderPortalLiveClassesPage();
      renderPortalStoreCards();
        renderPortalProducts();
        checkPortalBioBankStatus();
      renderTutorFlow('studypacks');
      renderTutorFlow('freelessons');
      renderMyCardsTab();
    }
  } catch (err) {
    console.warn('Offline mode or failed to fetch live portal data:', err);
  }
}

function checkStudentHasLiveAccess(live) {
  // If card is not required, access is open
  if (live.cardRequired === false) return { hasAccess: true };

  // Developer / Superuser bypass
  if (currentStudent && currentStudent.email && currentStudent.email.toLowerCase() === 'dg.edits65@gmail.com') {
    return { hasAccess: true, isVip: true };
  }

  // Must have student session and active cards
  if (!currentStudent || !Array.isArray(currentStudent.activeCards) || currentStudent.activeCards.length === 0) {
    return { hasAccess: false, reason: 'no_card' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const allCards = PORTAL_CLASS_CARDS || [];

  // Find cards student owns
  const ownedCards = allCards.filter(c => currentStudent.activeCards.includes(c.id));

  // Check for expired card matching month/tutor
  const expiredMatch = ownedCards.find(c => {
    const tutorMatch = !c.tutorId || c.tutorId === 'both' || !live.tutorId || live.tutorId === 'both' || c.tutorId === live.tutorId;
    const monthMatch = !c.month || !live.month || c.month.trim().toLowerCase() === live.month.trim().toLowerCase();
    const typeMatch = !c.classType || c.classType === 'both' || !live.classType || live.classType === 'both' || c.classType === live.classType;
    return tutorMatch && monthMatch && typeMatch && c.validTo && c.validTo < todayStr;
  });

  // Check for active non-expired card matching month/tutor
  const activeMatch = ownedCards.find(c => {
    const tutorMatch = !c.tutorId || c.tutorId === 'both' || !live.tutorId || live.tutorId === 'both' || c.tutorId === live.tutorId;
    const monthMatch = !c.month || !live.month || c.month.trim().toLowerCase() === live.month.trim().toLowerCase();
    const typeMatch = !c.classType || c.classType === 'both' || !live.classType || live.classType === 'both' || c.classType === live.classType;
    const isNotExpired = !c.validTo || c.validTo >= todayStr;
    return tutorMatch && monthMatch && typeMatch && isNotExpired;
  });

  if (activeMatch) {
    return { hasAccess: true, card: activeMatch };
  }

  if (expiredMatch) {
    return { hasAccess: false, reason: 'expired', card: expiredMatch };
  }

  return { hasAccess: false, reason: 'no_card' };
}

function renderHomeLiveClass() {
  const container = document.getElementById('home-live-section') || document.getElementById('home-live-chip-container') || document.getElementById('home-live-class-container');
  const sidebarLivePill = document.getElementById('sidebar-live-pill');

  if (!PORTAL_LIVE_CLASSES || PORTAL_LIVE_CLASSES.length === 0) {
    if (container) {
      container.innerHTML = '';
      container.style.display = 'none';
    }
    if (sidebarLivePill) sidebarLivePill.style.display = 'none';
    return;
  }

  // Active live class matching student's batch
  const live = PORTAL_LIVE_CLASSES.find(l => l.isActive);

  // Toggle Red LIVE pulse badge in sidebar
  if (sidebarLivePill) {
    sidebarLivePill.style.display = (live && live.isActive) ? 'inline-flex' : 'none';
  }

  if (!container) return;

  if (!live || !live.isActive) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  // Check student access (active non-expired monthly card or VIP)
  const access = checkStudentHasLiveAccess(live);
  const isZoom = live.streamType === 'zoom';

  container.style.display = 'block';
  container.innerHTML = `
    <div class="home-live-banner-card">
      <div class="home-live-banner-header">
        <div class="home-live-pulse-badge">
          <span class="pulse-dot-green" style="background:#ef4444; box-shadow:0 0 0 0 rgba(239,68,68,0.7);"></span>
          <span>🔴 සජීවී විකාශය දැන් පැවැත්වේ (LIVE BROADCAST)</span>
        </div>
        <span class="home-live-batch-pill"><i class="fa-solid fa-graduation-cap"></i> ${escapeHTML(live.batch || '2027')} A/L</span>
      </div>
      <div class="home-live-content-row">
        <div class="home-live-thumb-wrap" onclick="handleJoinLiveClass('${live.id}')">
          <img src="${live.thumbnail || '/hero.jpg'}" alt="${escapeHTML(live.title)}" onerror="this.src='/hero.jpg';">
          <div class="home-live-play-btn"><i class="fa-solid ${isZoom ? 'fa-video' : 'fa-play'}"></i></div>
        </div>
        <div class="home-live-details">
          <div class="home-live-meta-top">
            <span class="live-tutor-name"><i class="fa-solid fa-chalkboard-user"></i> ${escapeHTML(live.tutorName || 'Apex Biology Panel')}</span>
            <span class="live-time-tag"><i class="fa-regular fa-clock"></i> ${escapeHTML(live.scheduledAt || 'Streaming Now')}</span>
            <span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-satellite-dish"></i> ${live.streamType.toUpperCase()} HD</span>
          </div>
          <h3 class="home-live-title">${escapeHTML(live.title)}</h3>
          ${live.desc ? `<p class="home-live-desc">${escapeHTML(live.desc)}</p>` : ''}
          <div class="home-live-actions">
            ${access.hasAccess ? `
              <button class="btn-home-watch-live ${isZoom ? 'zoom' : ''}" onclick="handleJoinLiveClass('${live.id}')">
                <i class="fa-solid ${isZoom ? 'fa-arrow-up-right-from-square' : 'fa-play'}"></i>
                <span>${isZoom ? 'Join Zoom Lecture' : 'Watch Live Stream Now'}</span>
              </button>
            ` : `
              <div class="home-live-locked-row">
                <span class="home-live-lock-badge"><i class="fa-solid fa-lock"></i> Class Card Required</span>
                <button class="btn-home-get-card" onclick="switchDashboardTab('tab-store')">
                  <i class="fa-solid fa-cart-shopping"></i> Get Monthly Card
                </button>
              </div>
            `}
            <button class="btn-home-view-live-tab" onclick="switchDashboardTab('tab-liveclasses')">
              <span>View All Live Classes</span> <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPortalLiveClassesPage() {
  const container = document.getElementById('portal-live-classes-container');
  if (!container) return;

  if (!PORTAL_LIVE_CLASSES || PORTAL_LIVE_CLASSES.length === 0) {
    const batchYear = currentStudent ? currentStudent.year : '2027';
    container.innerHTML = `
      <div style="background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.12); border-radius: 16px; padding: 48px 24px; text-align: center; max-width: 680px; margin: 30px auto;">
        <div style="font-size: 3rem; margin-bottom: 12px;">📡</div>
        <h3 style="color: #f8fafc; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">No Live Masterclass Streaming Right Now</h3>
        <p style="color: #94a3b8; font-size: 0.92rem; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          Scheduled live masterclasses and revision sessions for your <strong>${batchYear} A/L</strong> batch will broadcast right here in real time.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = PORTAL_LIVE_CLASSES.map(live => {
    const isZoom = live.streamType === 'zoom';
    const access = checkStudentHasLiveAccess(live);

    if (access.hasAccess) {
      return `
        <div class="live-broadcast-card">
          <div class="live-thumb-box">
            <img src="${live.thumbnail || '/hero.jpg'}" alt="${escapeHTML(live.title)}" onerror="this.src='/hero.jpg';">
            <div class="live-pulsing-badge">
              <span class="bio-pulse-dot"></span>
              <span>LIVE BROADCAST</span>
            </div>
          </div>
          <div class="live-broadcast-info">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; flex-wrap:wrap; gap:8px;">
              <div class="live-batch-tag">● ${live.batch} A/L LIVE MASTERCLASS</div>
              <span style="background:rgba(16,185,129,0.15); color:#10b981; padding:3px 10px; border-radius:6px; font-weight:700; font-size:0.75rem;">
                <i class="fa-solid fa-circle-check"></i> ${access.isVip ? 'VIP Admin Access' : 'Class Card Active • Access Granted'}
              </span>
            </div>
            <h3 class="live-broadcast-title">${escapeHTML(live.title)}</h3>
            <div class="live-broadcast-meta">
              <span><i class="fa-solid fa-chalkboard-user"></i> ${escapeHTML(live.tutorName || 'Apex Biology Panel')}</span>
              <span><i class="fa-regular fa-clock"></i> ${escapeHTML(live.scheduledAt || 'Streaming Now')}</span>
              <span><i class="fa-solid ${isZoom ? 'fa-video' : 'fa-play'}"></i> ${live.streamType.toUpperCase()} HD</span>
            </div>
            ${live.desc ? `<p class="live-broadcast-desc">${escapeHTML(live.desc)}</p>` : ''}
            <button class="btn-join-live-stream ${isZoom ? 'zoom' : ''}" onclick="handleJoinLiveClass('${live.id}')">
              <i class="fa-solid ${isZoom ? 'fa-arrow-up-right-from-square' : 'fa-play'}"></i>
              <span>Join Live Class Now</span>
            </button>
          </div>
        </div>
      `;
    }

    // Locked LMS Broadcast Card
    return `
      <div class="live-broadcast-card locked" style="border: 1px solid rgba(245,158,11,0.3); background: rgba(15,23,42,0.85);">
        <div class="live-thumb-box" style="position:relative; overflow:hidden;">
          <img src="${live.thumbnail || '/hero.jpg'}" alt="${escapeHTML(live.title)}" style="filter: blur(8px) brightness(0.6);" onerror="this.src='/hero.jpg';">
          <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); color:#fff; text-align:center; padding:16px;">
            <i class="fa-solid fa-lock" style="font-size:2rem; color:#f59e0b; margin-bottom:8px;"></i>
            <span style="font-size:0.85rem; font-weight:800; letter-spacing:0.5px;">CLASS CARD REQUIRED</span>
          </div>
        </div>
        <div class="live-broadcast-info">
          <div class="live-batch-tag" style="background:rgba(245,158,11,0.15); color:#f59e0b;">
            🔒 ${live.batch} A/L • ${escapeHTML(live.month || 'Monthly Pass')}
          </div>
          <h3 class="live-broadcast-title">${escapeHTML(live.title)}</h3>
          <div class="live-broadcast-meta">
            <span><i class="fa-solid fa-chalkboard-user"></i> ${escapeHTML(live.tutorName || 'Apex Biology Panel')}</span>
            <span><i class="fa-regular fa-clock"></i> ${escapeHTML(live.scheduledAt || 'Streaming Now')}</span>
          </div>
          <div style="background: rgba(245,158,11,0.08); border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 6px; margin: 10px 0 16px;">
            ${access.reason === 'expired'
              ? `<div style="color: #fbbf24; font-size: 0.84rem; font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> ඔබගේ <strong>${escapeHTML(live.month || '')}</strong> පන්ති කාඩ්පත කල් ඉකුත් වී ඇත (Card Expired). සජීවී විකාශය නැරඹීමට නව කාඩ්පතක් සක්‍රීය කරගන්න.</div>`
              : `<div style="color: #cbd5e1; font-size: 0.84rem;"><i class="fa-solid fa-shield-halved" style="color:#f59e0b;"></i> මෙම සජීවී පන්තිය නැරඹීමට <strong>${escapeHTML(live.month || '')} (${escapeHTML(live.tutorName || '')})</strong> පන්ති කාඩ්පතක් (Class Card) අවශ්‍ය වේ.</div>`
            }
          </div>
          <button class="btn-join-live-stream" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 14px rgba(245,158,11,0.35);" onclick="switchDashboardTab('tab-store')">
            <i class="fa-solid fa-cart-shopping"></i>
            <span>💳 Get Monthly Class Card</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function handleJoinLiveClass(liveId) {
  const live = (PORTAL_LIVE_CLASSES || []).find(l => l.id === liveId);
  if (!live) return;

  const access = checkStudentHasLiveAccess(live);
  if (!access.hasAccess) {
    if (access.reason === 'expired') {
      showToast('⚠️ ඔබගේ මෙම මාසයේ පන්ති කාඩ්පත කල් ඉකුත් වී ඇත. නව කාඩ්පතක් ලබාගන්න.');
    } else {
      showToast('🔒 මෙම සජීවී පන්තිය නැරඹීමට අදාළ මාසයේ Class Card එක සක්‍රීයව තිබිය යුතුය.');
    }
    switchDashboardTab('tab-store');
    return;
  }

  if (live.streamType === 'zoom') {
    let link = live.streamLink;
    if (!link.startsWith('http')) link = 'https://' + link;
    window.open(link, '_blank');
    showToast('Connecting to Zoom Live Lecture...');
  } else {
    // Open in protected anti-extraction video player
    openVideoPlayerModal(live.title, '🔴 LIVE STREAM • ' + live.batch + ' A/L', 'Live HD', live.streamLink);
  }
}

function renderPortalStoreCards() {
  const container = document.getElementById('portal-cards-grid');
  if (!container) return;

  if (!PORTAL_CLASS_CARDS || PORTAL_CLASS_CARDS.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; color:#64748b; padding:20px; text-align:center;">No monthly class cards active for your batch at this moment.</p>';
    return;
  }

  const activeCards = currentStudent ? (currentStudent.activeCards || []) : [];

  container.innerHTML = PORTAL_CLASS_CARDS.map(card => {
    const isEnrolled = activeCards.includes(card.id);
    const typeLabel = card.classType === 'theory' ? 'Theory Only' : (card.classType === 'revision' ? 'Revision Only' : 'Theory + Revision');
    const typeTagClass = card.classType === 'theory' ? 'tag-theory' : (card.classType === 'revision' ? 'tag-rev' : 'tag-both');

    return (
      '<div class="portal-monthly-card" onclick="openClassCardModal(\'' + card.id + '\')">' +
        '<div class="portal-card-banner">' +
          '<img src="' + (card.image || '/hero.jpg') + '" alt="' + escapeHTML(card.title) + '" onerror="this.src=\'/hero.jpg\';">' +
          '<span class="portal-card-month-tag">' + escapeHTML(card.month || 'Monthly Pass') + '</span>' +
          '<span class="portal-card-class-type ' + typeTagClass + '">' + typeLabel + '</span>' +
          (isEnrolled ? '<span class="portal-card-status-badge">✓ Enrolled</span>' : '') +
        '</div>' +
        '<div class="portal-card-body">' +
          '<h4 class="portal-card-title">' + escapeHTML(card.title) + '</h4>' +
          (card.desc ? '<p class="portal-card-desc">' + escapeHTML(card.desc) + '</p>' : '') +
          '<div style="font-size:0.75rem; color:#64748b; margin-top:4px;">' +
            '<i class="fa-regular fa-calendar"></i> Valid: ' + (card.validFrom || 'Now') + ' to ' + (card.validTo || 'Valid') +
          '</div>' +
        '</div>' +
        '<div class="portal-card-footer">' +
          '<div class="portal-card-price">Rs. ' + Number(card.price).toLocaleString() + '</div>' +
          (isEnrolled ? 
            '<span class="btn-card-active"><i class="fa-solid fa-circle-check"></i> Card Active</span>' :
            '<button class="btn-get-class-card" onclick="event.stopPropagation(); openClassCardModal(\'' + card.id + '\')">' +
              '<i class="fa-solid fa-cart-shopping"></i> Get Card' +
            '</button>'
          ) +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function openClassCardModal(cardId) {
  const card = (PORTAL_CLASS_CARDS || []).find(c => c.id === cardId);
  if (!card) return;
  activeSelectedCard = card;

  const typeLabel = card.classType === 'theory' ? 'Theory Only' : (card.classType === 'revision' ? 'Revision Only' : 'Theory + Revision');

  document.getElementById('card-modal-title').textContent = card.title;
  document.getElementById('card-modal-month').innerHTML = `${escapeHTML(card.month || 'Monthly Pass')} • ${card.batch} A/L <span style="display:inline-block; margin-left:8px; padding:2px 8px; border-radius:12px; font-size:0.75rem; background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); font-weight:700;">${typeLabel}</span>`;
  document.getElementById('card-modal-desc').textContent = card.desc || 'Complete Theory, Revision Masterclasses, and Printed Tute Pack access.';
  document.getElementById('card-modal-validity').textContent = (card.validFrom || 'Current') + ' to ' + (card.validTo || 'Permanent');
  document.getElementById('card-modal-price').textContent = 'Rs. ' + Number(card.price).toLocaleString();

  const statusBadge = document.getElementById('card-modal-status-badge');
  const reqBtn = document.getElementById('btn-card-modal-request');
  const isEnrolled = currentStudent && (currentStudent.activeCards || []).includes(card.id);

  if (isEnrolled) {
    if (statusBadge) statusBadge.innerHTML = '<span class="btn-card-active"><i class="fa-solid fa-circle-check"></i> Access Active</span>';
    if (reqBtn) {
      reqBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> You Already Have Full Access to this Card!';
      reqBtn.disabled = true;
      reqBtn.style.opacity = '0.7';
    }
  } else {
    if (statusBadge) statusBadge.innerHTML = '<span style="font-size:0.78rem; font-weight:700; color:#10b981;">Enrollment Open</span>';
    if (reqBtn) {
      reqBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Request Card Activation (කාඩ්පත ඉල්ලුම් කරන්න)';
      reqBtn.disabled = false;
      reqBtn.style.opacity = '1';
    }
  }

  openModal('class-card-modal');
}

async function handleCardRequestSubmit() {
  if (!activeSelectedCard) return;

  const btn = document.getElementById('btn-card-modal-request');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Request...';
  }

  const isEnrolled = currentStudent && (currentStudent.activeCards || []).includes(activeSelectedCard.id);
  if (isEnrolled) {
    showToast('You already have active access for this card!');
    closeModal('class-card-modal');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Request Card Activation (කාඩ්පත ඉල්ලුම් කරන්න)';
    }
    return;
  }

  const savedStu = localStorage.getItem('apex_bio_student') ? JSON.parse(localStorage.getItem('apex_bio_student')) : {};
  const sName = (currentStudent && currentStudent.name) || savedStu.name || 'Student';
  const sId = (currentStudent && currentStudent.studentId) || savedStu.studentId || '27804192';
  const sYear = (currentStudent && currentStudent.year) || savedStu.year || '2027';
  const sPhone = (currentStudent && currentStudent.phone) || savedStu.phone || '';
  const sSchool = (currentStudent && currentStudent.school) || savedStu.school || '';

  try {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: sId,
        studentName: sName,
        studentPhone: sPhone,
        studentSchool: sSchool,
        batch: sYear,
        type: 'card',
        targetId: activeSelectedCard.id,
        targetTitle: activeSelectedCard.title + ' (' + (activeSelectedCard.month || 'Pass') + ')'
      })
    });
    const json = await res.json();
    if (json.success) {
      showToast('🎉 Card request submitted! Telegram alert dispatched.');
      closeModal('class-card-modal');
      fetchPublicPortalData(sYear);
    } else {
      showToast(json.message || 'Error submitting card request');
    }
  } catch (err) {
    console.error('Request error:', err);
    showToast('🎉 Request recorded! Admin will review and activate.');
    closeModal('class-card-modal');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Request Card Activation (කාඩ්පත ඉල්ලුම් කරන්න)';
    }
  }
}

function handleCardOrderWhatsApp() {
  if (!activeSelectedCard) return;
  const isEnrolled = currentStudent && (currentStudent.activeCards || []).includes(activeSelectedCard.id);
  if (isEnrolled) {
    showToast('You already have active access for this card!');
    closeModal('class-card-modal');
    return;
  }

  const sName = currentStudent ? currentStudent.name : 'Student';
  const sId = currentStudent ? currentStudent.studentId : 'N/A';
  const sYear = currentStudent ? currentStudent.year : '2027';

  // Automatically record student's card request in database queue
  fetch('/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: sId,
      studentName: sName,
      studentPhone: currentStudent ? (currentStudent.phone || '') : '',
      studentSchool: currentStudent ? (currentStudent.school || '') : '',
      batch: sYear,
      type: 'card',
      targetId: activeSelectedCard.id,
      targetTitle: `${activeSelectedCard.title} (${activeSelectedCard.month || 'Pass'})`
    })
  }).catch(e => console.warn('Request sync error:', e));

  const msg = encodeURIComponent('Hello Apex Biology! I want to enroll and activate my Monthly Class Card:\n' +
    'Card: ' + activeSelectedCard.title + '\n' +
    'Month: ' + activeSelectedCard.month + '\n' +
    'Batch: ' + sYear + ' A/L\n' +
    'Student ID: ' + sId + '\n' +
    'Name: ' + sName + '\n' +
    'Fee: Rs. ' + activeSelectedCard.price);

  window.open('https://wa.me/94771234567?text=' + msg, '_blank');
  showToast('Connecting to WhatsApp Enrollment Desk... (Request logged in Admin Queue)');
  closeModal('class-card-modal');
}

function showLockedVideoNotice(title) {
  showToast('🔒 "' + title + '" is locked! Active Monthly Class Card required.');
  setTimeout(() => {
    switchDashboardTab('tab-store');
  }, 1000);
}

// ============================================================================
// STUDENT PORTAL: MY CLASS CARDS & MONTHLY RECORDED LESSONS HUB
// ============================================================================
function escapeHtml(str) {
  return escapeHTML(str);
}

function renderMyCardsTab() {
  const container = document.getElementById('mycards-display-wrap');
  const countBadge = document.getElementById('sidebar-mycards-count');
  if (!container) return;

  const student = currentStudent || JSON.parse(localStorage.getItem('apex_bio_student') || '{}');
  const activeCardIds = student.activeCards || [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Filter cards: strictly active and non-expired (validTo >= todayStr)
  const allCards = PORTAL_CLASS_CARDS || [];
  const validActiveCards = allCards.filter(c => activeCardIds.includes(c.id) && (!c.validTo || c.validTo >= todayStr));
  const expiredCards = allCards.filter(c => activeCardIds.includes(c.id) && (c.validTo && c.validTo < todayStr));

  // Prune expired card IDs from local student session
  if (expiredCards.length > 0 && currentStudent) {
    currentStudent.activeCards = validActiveCards.map(c => c.id);
    localStorage.setItem('apex_bio_student', JSON.stringify(currentStudent));
  }

  if (countBadge) {
    countBadge.textContent = validActiveCards.length;
    countBadge.style.display = validActiveCards.length > 0 ? 'inline-block' : 'none';
  }

  const myCards = validActiveCards;

  if (myCards.length === 0) {
    container.innerHTML = `
      <div class="mycards-empty-card" style="grid-column: 1 / -1;">
        <div class="mycards-empty-icon"><i class="fa-solid fa-id-card"></i></div>
        <h3>ඔබට තවමත් සක්‍රීය මාසික කාඩ්පතක් නොමැත</h3>
        <p>Bio Store වෙත පිවිස ඔබගේ මාසික Class Card එක ලබාගෙන අදාළ මාසයේ Theory සහ Revision වීඩියෝ දේශන සහ Tute Materials අධ්‍යයනය ආරම්භ කරන්න.</p>
        <button class="btn-primary-start" style="padding: 12px 28px; width: fit-content;" onclick="switchDashboardTab('tab-store')">
          <i class="fa-solid fa-cart-shopping"></i> Go to Bio Store to Get Card
        </button>
      </div>
      ${expiredCards.length > 0 ? `
        <div style="grid-column: 1 / -1; margin-top: 24px; padding: 18px 20px; background: rgba(239,68,68,0.06); border: 1px dashed rgba(239,68,68,0.3); border-radius: 14px;">
          <h4 style="color:#ef4444; font-size: 0.95rem; font-weight:800; display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <i class="fa-solid fa-clock-rotate-left"></i> Expired Class Cards (${expiredCards.length})
          </h4>
          <p style="color:#94a3b8; font-size:0.82rem; margin:0 0 12px;">පහත කාඩ්පත් වල වලංගු කාලය (Validity Period) අවසන් වී ඇති බැවින් පන්ති ප්‍රවේශය අක්‍රිය කර ඇත.</p>
          <div style="display:flex; flex-wrap:wrap; gap:10px;">
            ${expiredCards.map(c => `
              <span style="background:rgba(239,68,68,0.12); color:#fca5a5; padding:4px 10px; border-radius:6px; font-size:0.78rem; font-weight:700;">
                <i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(c.month)} (${escapeHtml(c.title)}) - Expired on ${escapeHtml(c.validTo)}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
    const explorer = document.getElementById('mycard-classes-explorer');
    if (explorer) explorer.style.display = 'none';
    return;
  }

  const html = myCards.map(c => {
    const tutorObj = TUTORS_DATA.find(t => t.id === c.tutorId) || { name: c.tutorId === 'both' ? 'All Tutors (ගුරුවරුන් දෙදෙනාම)' : (c.tutorId || 'A/L Biology') };
    const typeLabel = c.classType === 'both' ? 'Theory + Revision' : (c.classType === 'revision' ? 'Revision Only' : 'Theory Only');

    return `
      <div class="mycard-pass-card">
        <div class="mycard-banner">
          <div>
            <span class="mycard-batch-pill"><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(c.batch || '2027')} A/L</span>
            <div style="font-size: 1.1rem; font-weight: 800; margin-top: 8px;">${escapeHtml(c.month || 'Monthly Pass')}</div>
          </div>
          <span class="mycard-status-badge"><i class="fa-solid fa-circle-check"></i> ACTIVE PASS</span>
        </div>
        <div class="mycard-body">
          <h4 class="mycard-title">${escapeHtml(c.title)}</h4>
          <div class="mycard-meta-tags">
            <span class="mycard-tag"><i class="fa-solid fa-chalkboard-user"></i> ${escapeHtml(tutorObj.name)}</span>
            <span class="mycard-tag"><i class="fa-solid fa-book-bookmark"></i> ${escapeHtml(typeLabel)}</span>
          </div>
          <div class="mycard-validity-row">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Valid Period: <strong>${escapeHtml(c.validFrom || '')}</strong> to <strong>${escapeHtml(c.validTo || 'Active')}</strong></span>
          </div>
          ${c.desc ? `<p class="mycard-desc-text">${escapeHtml(c.desc)}</p>` : ''}
          <div class="mycard-footer-actions">
            <button class="btn-view-card-classes" onclick="exploreCardMonthClasses('${escapeHtml(c.month)}', '${escapeHtml(c.tutorId || 'both')}', '${escapeHtml(c.classType || 'both')}', '${escapeHtml(c.title)}')">
              <i class="fa-solid fa-play"></i> <span>View Month Classes (පන්ති බලන්න)</span>
            </button>
            <a href="https://t.me/apexbiology_tutes" target="_blank" class="btn-card-tutes" title="Download telegram tutes">
              <i class="fa-solid fa-file-arrow-down"></i> Tutes
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;

  // Auto-expand the first active card's classes
  const firstCard = myCards[0];
  if (firstCard && !activeCardExplorerMonth) {
    exploreCardMonthClasses(firstCard.month, firstCard.tutorId || 'both', firstCard.classType || 'both', firstCard.title, false);
  }
}

function exploreCardMonthClasses(month, tutorId, classType, cardTitle, shouldScroll = true) {
  activeCardExplorerMonth = month;
  activeCardExplorerTutorId = tutorId;
  activeCardExplorerClassType = classType;
  activeCardExplorerFilter = 'all';

  const explorer = document.getElementById('mycard-classes-explorer');
  if (!explorer) return;

  explorer.style.display = 'block';

  // Filter videos from PORTAL_MONTHLY_CLASSES
  renderCardExplorerContent(cardTitle);

  if (shouldScroll) {
    explorer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderCardExplorerContent(cardTitle) {
  const explorer = document.getElementById('mycard-classes-explorer');
  if (!explorer) return;

  // Filter by month and tutor
  let videos = (PORTAL_MONTHLY_CLASSES || []).filter(v => v.month === activeCardExplorerMonth);
  if (activeCardExplorerTutorId && activeCardExplorerTutorId !== 'both') {
    videos = videos.filter(v => v.tutorId === activeCardExplorerTutorId);
  }

  // Filter by active pill
  if (activeCardExplorerFilter === 'theory') {
    videos = videos.filter(v => v.classType === 'theory');
  } else if (activeCardExplorerFilter === 'revision') {
    videos = videos.filter(v => v.classType === 'revision');
  }

  const tutorObj = TUTORS_DATA.find(t => t.id === activeCardExplorerTutorId) || { name: 'Monthly Biology Classes' };
  const isRevOnly = tutorObj && tutorObj.hasTheory === false;

  let pillsHtml = `
    <div class="explorer-mode-pills">
      <button class="btn-explorer-pill ${activeCardExplorerFilter === 'all' ? 'active' : ''}" onclick="filterCardExplorerVideos('all')">
        All Classes (${(PORTAL_MONTHLY_CLASSES || []).filter(v => v.month === activeCardExplorerMonth && (activeCardExplorerTutorId === 'both' || v.tutorId === activeCardExplorerTutorId)).length})
      </button>
      ${!isRevOnly ? `
        <button class="btn-explorer-pill ${activeCardExplorerFilter === 'theory' ? 'active' : ''}" onclick="filterCardExplorerVideos('theory')">
          <i class="fa-solid fa-book-open"></i> Theory
        </button>
      ` : ''}
      <button class="btn-explorer-pill ${activeCardExplorerFilter === 'revision' ? 'active' : ''}" onclick="filterCardExplorerVideos('revision')">
        <i class="fa-solid fa-rotate-left"></i> Revision
      </button>
    </div>
  `;

  let videoCardsHtml = '';
  if (videos.length === 0) {
    videoCardsHtml = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: #64748b;">
        <i class="fa-solid fa-film" style="font-size: 32px; color: #10b981; margin-bottom: 10px;"></i>
        <p>මෙම මස සඳහා පන්ති වීඩියෝ ඉක්මනින්ම එකතු කරනු ලැබේ.</p>
      </div>
    `;
  } else {
    videoCardsHtml = videos.map(v => {
      const thumbUrl = v.customThumbnail || `https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`;
      const lessonDataStr = JSON.stringify({
        title: v.title,
        ytId: v.ytId,
        duration: v.duration || '2h 00m',
        desc: v.desc || '',
        tuteUrl: v.tuteUrl || 'https://t.me/apexbiology_tutes'
      }).replace(/"/g, '&quot;');

      return `
        <div class="mycard-video-card">
          <div class="mycard-video-thumb" onclick="openVideoPlayerModal(${lessonDataStr})">
            <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(v.title)}" onerror="this.src='/hero.jpg'">
            <div class="play-badge-overlay"><i class="fa-solid fa-circle-play"></i></div>
            <span class="duration-tag">${escapeHtml(v.duration || '2h 00m')}</span>
          </div>
          <div class="mycard-video-info">
            <span class="mycard-tag" style="width: fit-content; font-size: 0.7rem;">
              ${v.classType === 'theory' ? '📘 Theory Masterclass' : '🔄 Revision Discussion'}
            </span>
            <h5 class="mycard-video-title">${escapeHtml(v.title)}</h5>
            <div class="mycard-video-meta">
              <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(v.date || 'Day Class')}</span>
              <span><i class="fa-brands fa-youtube" style="color: #ef4444;"></i> HD Video</span>
            </div>
            ${v.desc ? `<p style="font-size: 0.78rem; color: #64748b; line-height: 1.4;">${escapeHtml(v.desc)}</p>` : ''}
            <div style="display: flex; gap: 8px; margin-top: auto; padding-top: 8px;">
              <button class="btn-watch-class" style="flex: 1;" onclick="openVideoPlayerModal(${lessonDataStr})">
                <i class="fa-solid fa-play"></i> Watch Class
              </button>
              ${v.tuteUrl ? `
                <a href="${escapeHtml(v.tuteUrl)}" target="_blank" class="btn-card-tutes" style="padding: 9px 12px;" title="Download Tute PDF">
                  <i class="fa-solid fa-file-arrow-down"></i>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  explorer.innerHTML = `
    <div class="explorer-header-bar">
      <div class="explorer-title-box">
        <h3><i class="fa-solid fa-folder-open"></i> ${escapeHtml(activeCardExplorerMonth)} Class Recordings</h3>
        <p>${escapeHtml(tutorObj.name)} • ${escapeHtml(cardTitle || '')}</p>
      </div>
      ${pillsHtml}
    </div>
    <div class="mycard-video-cards-grid">
      ${videoCardsHtml}
    </div>
  `;
}

function filterCardExplorerVideos(filter) {
  activeCardExplorerFilter = filter;
  renderCardExplorerContent();
}


// ==========================================================================
// STORE PRODUCTS & DELIVERY ORDERING (STUDENT PORTAL)
// ==========================================================================

function renderPortalProducts() {
  const container = document.getElementById('portal-products-grid');
  if (!container) return;

  if (!PORTAL_PRODUCTS || PORTAL_PRODUCTS.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; color:#64748b; padding:20px; text-align:center;">No delivery tutorial kits available right now.</p>';
    return;
  }

  container.innerHTML = PORTAL_PRODUCTS.map(product => {
    const mainImg = (product.images && product.images.length > 0) ? product.images[0] : (product.image || '/hero.jpg');
    return `
      <div class="portal-monthly-card" onclick="openProductDetailModal('${product.id}')" style="cursor: pointer;">
        <div class="portal-card-banner" style="height: 180px;">
          <img src="${mainImg}" alt="${escapeHTML(product.title)}" onerror="this.src='/hero.jpg';" style="object-fit: cover;">
          <span class="portal-card-month-tag"><i class="fa-solid fa-box"></i> ${escapeHTML(product.category || 'Tute Pack')}</span>
          <span class="portal-card-class-type tag-both">Home Delivery</span>
        </div>
        <div class="portal-card-body">
          <h4 class="portal-card-title">${escapeHTML(product.title)}</h4>
          <p class="portal-card-desc" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${escapeHTML(product.desc || 'High quality color printed tutorial kit delivered straight to your doorstep.')}
          </p>
          <div style="font-size: 0.78rem; color: #10b981; font-weight: 600; margin-top: 6px;">
            <i class="fa-solid fa-truck-fast"></i> Islandwide Speed Delivery (2-3 Days)
          </div>
        </div>
        <div class="portal-card-footer">
          <div class="portal-card-price">Rs. ${Number(product.price || 0).toLocaleString()}</div>
          <button class="btn-get-class-card" onclick="event.stopPropagation(); openProductDetailModal('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Buy Now
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openProductDetailModal(productId) {
  const product = (PORTAL_PRODUCTS || []).find(p => p.id === productId);
  if (!product) {
    showToast('Product not found');
    return;
  }

  currentViewingProduct = product;
  const contentEl = document.getElementById('product-modal-content');
  if (!contentEl) return;

  const images = (product.images && product.images.length > 0) ? product.images : [product.image || '/hero.jpg'];
  const studentName = currentStudent ? currentStudent.name : '';
  const studentPhone = currentStudent ? (currentStudent.whatsapp || currentStudent.phone || '') : '';
  const studentDistrict = currentStudent ? (currentStudent.district || '') : '';

  contentEl.innerHTML = `
    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 14px;">
      <span class="portal-card-class-type tag-both"><i class="fa-solid fa-box-open"></i> ${escapeHTML(product.category || 'Delivery Kit')}</span>
      <span style="font-size: 0.8rem; color: #10b981; font-weight: 600;"><i class="fa-solid fa-truck-fast"></i> Islandwide Courier Delivery</span>
    </div>

    <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${escapeHTML(product.title)}</h3>
    <div style="font-size: 1.35rem; font-weight: 900; color: #059669; margin-bottom: 14px;">Rs. ${Number(product.price || 0).toLocaleString()}</div>

    <!-- Product Images Preview / Slider -->
    <div class="product-images-gallery-wrap" style="margin-bottom: 16px;">
      <div style="width: 100%; height: 240px; border-radius: 12px; overflow: hidden; background: #0f172a; margin-bottom: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center;">
        <img id="product-modal-hero-img" src="${images[0]}" alt="${escapeHTML(product.title)}" style="width: 100%; height: 100%; object-fit: contain; background: #f8fafc;">
      </div>
      ${images.length > 1 ? `
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
          ${images.map((imgUrl, i) => `
            <img src="${imgUrl}" class="product-thumb-pill" style="width: 58px; height: 58px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid ${i === 0 ? '#10b981' : '#cbd5e1'};" onclick="selectProductHeroImg('${imgUrl}', this)">
          `).join('')}
        </div>
      ` : ''}
    </div>

    <div style="background: #f8fafc; border-radius: 10px; padding: 12px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
      <h5 style="font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Product Details:</h5>
      <p style="font-size: 0.84rem; color: #64748b; line-height: 1.5; white-space: pre-line;">${escapeHTML(product.desc || 'No additional details.')}</p>
    </div>

    <!-- Delivery Order Form -->
    <form id="product-order-form" onsubmit="handleProductOrderSubmit(event)" style="display: flex; flex-direction: column; gap: 12px;">
      <input type="hidden" id="order-product-id" value="${product.id}">
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Student Name *</label>
          <input type="text" id="order-student-name" required class="custom-input-box" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem;" value="${escapeHTML(studentName)}" placeholder="Full Name">
        </div>
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">WhatsApp Number *</label>
          <input type="tel" id="order-whatsapp" required class="custom-input-box" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem;" value="${escapeHTML(studentPhone)}" placeholder="07xxxxxxxx">
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">District *</label>
          <input type="text" id="order-district" required class="custom-input-box" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem;" value="${escapeHTML(studentDistrict)}" placeholder="e.g. Kandy, Colombo, Galle">
        </div>
        <div>
          <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Quantity</label>
          <input type="number" id="order-quantity" min="1" max="10" value="1" class="custom-input-box" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem;" onchange="updateOrderTotalPrice()">
        </div>
      </div>

      <div>
        <label style="display: block; font-size: 0.78rem; font-weight: 700; color: #475569; margin-bottom: 4px;">Delivery Address (Home / Courier Address) *</label>
        <textarea id="order-address" required rows="2" class="custom-input-box" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.88rem; resize: vertical;" placeholder="House No, Street, City / Postal Code"></textarea>
      </div>

      <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.75rem; color: #047857; text-transform: uppercase; font-weight: 700;">Total Payable:</span>
          <div id="order-total-price-display" style="font-size: 1.15rem; font-weight: 900; color: #065f46;">Rs. ${Number(product.price || 0).toLocaleString()}</div>
        </div>
        <span style="font-size: 0.75rem; color: #059669;"><i class="fa-solid fa-money-bill-wave"></i> Cash On Delivery / Bank Transfer</span>
      </div>

      <button type="submit" id="btn-submit-order" class="btn-submit-primary" style="width: 100%; padding: 12px; font-weight: 700; font-size: 0.95rem; background: #059669; color: #fff; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <i class="fa-solid fa-paper-plane"></i> Confirm Delivery Order
      </button>
    </form>
  `;

  openModal('product-detail-modal');
}

function selectProductHeroImg(imgUrl, el) {
  const hero = document.getElementById('product-modal-hero-img');
  if (hero) hero.src = imgUrl;
  const thumbs = document.querySelectorAll('.product-thumb-pill');
  thumbs.forEach(t => t.style.borderColor = '#cbd5e1');
  if (el) el.style.borderColor = '#10b981';
}

function updateOrderTotalPrice() {
  if (!currentViewingProduct) return;
  const qty = parseInt(document.getElementById('order-quantity')?.value) || 1;
  const total = (Number(currentViewingProduct.price) || 0) * qty;
  const disp = document.getElementById('order-total-price-display');
  if (disp) disp.textContent = 'Rs. ' + total.toLocaleString();
}

async function handleProductOrderSubmit(e) {
  e.preventDefault();
  if (!currentViewingProduct) return;

  const btn = document.getElementById('btn-submit-order');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Order...';
  }

  const studentName = document.getElementById('order-student-name')?.value.trim();
  const whatsapp = document.getElementById('order-whatsapp')?.value.trim();
  const district = document.getElementById('order-district')?.value.trim();
  const address = document.getElementById('order-address')?.value.trim();
  const quantity = parseInt(document.getElementById('order-quantity')?.value) || 1;
  const studentId = currentStudent ? currentStudent.studentId : ('STU-' + Math.floor(100000 + Math.random() * 900000));

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: currentViewingProduct.id,
        productTitle: currentViewingProduct.title,
        price: Number(currentViewingProduct.price) || 0,
        studentId,
        studentName,
        whatsapp,
        district,
        address,
        quantity,
        batch: currentStudent ? currentStudent.year : '2027 A/L'
      })
    });

    const json = await res.json();
    if (json.success) {
      showToast('🎉 Delivery Order Placed! We will contact you via WhatsApp.');
      closeModal('product-detail-modal');
    } else {
      showToast(json.message || 'Error placing order');
    }
  } catch (err) {
    console.error('Order error:', err);
    showToast('Network error while placing order');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Confirm Delivery Order';
    }
  }
}

// ==========================================================================
// BIO BANK CHECK & COMING SOON BLUR CONTROLLER
// ==========================================================================

function checkPortalBioBankStatus() {
  const biobankCard = document.querySelector('.feature-card-biobank') || document.querySelector('[onclick*="biobank.html"]');
  const isBlurred = PORTAL_BIOBANK ? PORTAL_BIOBANK.isBlurred : true;
  
  if (biobankCard && isBlurred) {
    let badge = biobankCard.querySelector('.biobank-coming-soon-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'biobank-coming-soon-badge';
      badge.style.cssText = 'background: #f59e0b; color: #000; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; margin-left: 8px; text-transform: uppercase;';
      badge.innerHTML = '<i class="fa-solid fa-lock"></i> Coming Soon';
      const h3 = biobankCard.querySelector('h3') || biobankCard;
      h3.appendChild(badge);
    }
  }
}

// ==========================================================================
// BIO STUDY TRICKS & NEURO-PSYCHOLOGY CONTROLLER
// 20 High-Yield Neuroscience & Cognitive Learning Techniques for A/L Biology
// ==========================================================================

let currentStudyTrickFilter = 'all';
let currentStudyTrickSearch = '';
let activeStudyTrickIndex = 0; // 0 to 19
let currentTrickLangMode = 'both'; // 'both', 'si', 'en'

function getStudyTricksData() {
  if (typeof BIO_STUDY_TRICKS_DATA !== 'undefined' && Array.isArray(BIO_STUDY_TRICKS_DATA)) {
    return BIO_STUDY_TRICKS_DATA;
  }
  return [];
}

function renderStudyTricksTab() {
  const container = document.getElementById('bio-tricks-grid');
  if (!container) return;

  const allTricks = getStudyTricksData();
  if (!allTricks || allTricks.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #475569; background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 20px;">
        <i class="fa-solid fa-brain" style="font-size: 40px; color: #10b981; margin-bottom: 14px;"></i>
        <h4 style="font-size: 1.15rem; color: #064e3b; margin: 0 0 6px 0; font-weight: 800;">No study tricks loaded</h4>
        <p style="font-size: 0.9rem; color: #64748b; margin: 0;">Please refresh the page to load study tricks.</p>
      </div>`;
    return;
  }

  const query = (currentStudyTrickSearch || '').toLowerCase().trim();
  const filterCat = currentStudyTrickFilter;

  const filtered = allTricks.filter(item => {
    if (filterCat !== 'all' && item.category !== filterCat) {
      return false;
    }
    if (query) {
      const matchSi = (item.title_si || '').toLowerCase().includes(query) || (item.desc_si || '').toLowerCase().includes(query);
      const matchEn = (item.title_en || '').toLowerCase().includes(query) || (item.desc_en || '').toLowerCase().includes(query);
      const matchBio = (item.bioExample || '').toLowerCase().includes(query);
      const matchNeuro = (item.neuroKey || '').toLowerCase().includes(query);
      return matchSi || matchEn || matchBio || matchNeuro;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #ffffff; border: 1.5px dashed #cbd5e1; border-radius: 20px; box-shadow: 0 4px 16px rgba(6,78,59,0.04);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 38px; color: #059669; margin-bottom: 14px;"></i>
        <h4 style="color: #064e3b; font-size: 1.2rem; font-weight: 800; margin-bottom: 6px;">No tricks found matching "${escapeHtml(currentStudyTrickSearch)}"</h4>
        <p style="color: #475569; font-size: 0.92rem; margin-bottom: 18px; font-weight: 500;">Try searching for another keyword or reset the filter category.</p>
        <button class="btn-trick-filter active" onclick="resetStudyTricksFilter()">
          <i class="fa-solid fa-rotate-left"></i> Reset Search &amp; Filters
        </button>
      </div>`;
    return;
  }

  let html = '';
  filtered.forEach(trick => {
    const formattedNum = String(trick.id).padStart(2, '0');
    const teaser = (trick.desc_si || trick.desc_en || '').slice(0, 160) + '...';

    html += `
      <div class="bio-trick-card" onclick="openStudyTrickModal(${trick.id})">
        <div>
          <div class="trick-card-top">
            <span class="trick-num-badge">#${formattedNum}</span>
            <span class="trick-category-pill">${escapeHtml(trick.category_si || trick.category)}</span>
          </div>

          <div class="trick-card-header">
            <div class="trick-icon-circle">
              <i class="fa-solid ${trick.icon || 'fa-brain'}"></i>
            </div>
            <div class="trick-card-titles">
              <h3 class="trick-title-si">${escapeHtml(trick.title_si)}</h3>
              <p class="trick-title-en">${escapeHtml(trick.title_en)}</p>
            </div>
          </div>

          <div class="trick-bio-tag-box">
            <i class="fa-solid fa-dna"></i>
            <span><strong>A/L Bio:</strong> ${escapeHtml(trick.bioExample || 'Comprehensive Syllabus Integration')}</span>
          </div>

          <p class="trick-card-snippet">${escapeHtml(teaser)}</p>
        </div>

        <div class="trick-card-bottom">
          <span class="trick-neuro-pill">
            <i class="fa-solid fa-microchip"></i> ${escapeHtml(trick.badge || 'Neuro-Hacks')}
          </span>
          <button class="btn-open-trick" type="button" aria-label="Open trick details">
            <span>Unlock Breakdown</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function filterStudyTricks(cat, btnEl) {
  currentStudyTrickFilter = cat;
  const buttons = document.querySelectorAll('.btn-trick-filter');
  buttons.forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderStudyTricksTab();
}

function handleStudyTricksSearch(val) {
  currentStudyTrickSearch = val || '';
  renderStudyTricksTab();
}

function resetStudyTricksFilter() {
  currentStudyTrickFilter = 'all';
  currentStudyTrickSearch = '';
  const searchInput = document.getElementById('tricks-search-input');
  if (searchInput) searchInput.value = '';
  const buttons = document.querySelectorAll('.btn-trick-filter');
  buttons.forEach(b => {
    if (b.getAttribute('data-cat') === 'all') b.classList.add('active');
    else b.classList.remove('active');
  });
  renderStudyTricksTab();
}

function openStudyTrickModal(trickIdOrIndex) {
  const allTricks = getStudyTricksData();
  if (!allTricks || allTricks.length === 0) return;

  let idx = 0;
  if (typeof trickIdOrIndex === 'number' && trickIdOrIndex >= 1 && trickIdOrIndex <= 20) {
    idx = allTricks.findIndex(t => t.id === trickIdOrIndex);
    if (idx === -1) idx = 0;
  } else if (typeof trickIdOrIndex === 'number') {
    idx = Math.max(0, Math.min(trickIdOrIndex, allTricks.length - 1));
  }

  activeStudyTrickIndex = idx;
  const trick = allTricks[idx];
  if (!trick) return;

  const modal = document.getElementById('study-trick-modal');
  if (!modal) return;

  // Populate data
  const formattedNum = '#' + String(trick.id).padStart(2, '0');
  const numEl = document.getElementById('modal-trick-num');
  if (numEl) numEl.textContent = formattedNum;

  const counterEl = document.getElementById('modal-trick-counter');
  if (counterEl) counterEl.textContent = `${String(trick.id).padStart(2, '0')} / ${String(allTricks.length).padStart(2, '0')}`;

  const iconEl = document.getElementById('modal-trick-icon-badge');
  if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${trick.icon || 'fa-brain'}"></i>`;

  const catEl = document.getElementById('modal-trick-category');
  if (catEl) catEl.textContent = trick.category_si ? `${trick.category_si} • ${trick.category}` : trick.category;

  const badgeEl = document.getElementById('modal-trick-badge');
  if (badgeEl) badgeEl.textContent = trick.badge || 'Cognitive Hack';

  const titleSiEl = document.getElementById('modal-trick-title-si');
  if (titleSiEl) titleSiEl.textContent = trick.title_si;

  const titleEnEl = document.getElementById('modal-trick-title-en');
  if (titleEnEl) titleEnEl.textContent = trick.title_en;

  const descSiEl = document.getElementById('modal-trick-desc-si');
  if (descSiEl) descSiEl.textContent = trick.desc_si;

  const descEnEl = document.getElementById('modal-trick-desc-en');
  if (descEnEl) descEnEl.textContent = trick.desc_en;

  const quoteEl = document.getElementById('modal-trick-quote');
  if (quoteEl) quoteEl.textContent = `"${trick.quote || trick.title_si}"`;

  const bioAppEl = document.getElementById('modal-trick-bio-app');
  if (bioAppEl) bioAppEl.textContent = trick.bioExample || 'Applicable to full Sri Lanka A/L Biology national syllabus.';

  const neuroMechEl = document.getElementById('modal-trick-neuro-mech');
  if (neuroMechEl) neuroMechEl.textContent = trick.neuroKey || 'Enhances cognitive retrieval and long-term potentiation.';

  // Update navigation button states
  const prevBtn = document.getElementById('btn-prev-trick');
  const nextBtn = document.getElementById('btn-next-trick');
  if (prevBtn) prevBtn.disabled = (idx === 0);
  if (nextBtn) nextBtn.disabled = (idx === allTricks.length - 1);

  // Apply language visibility
  applyTrickLangVisibility();

  // Show modal
  openModal('study-trick-modal');
}

function closeStudyTrickModal() {
  closeModal('study-trick-modal');
}

function setTrickLangView(mode) {
  currentTrickLangMode = mode || 'both';
  const buttons = document.querySelectorAll('.btn-trick-lang');
  buttons.forEach(b => {
    if (b.getAttribute('data-lang') === currentTrickLangMode) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  applyTrickLangVisibility();
}

function applyTrickLangVisibility() {
  const boxSi = document.getElementById('modal-trick-box-si');
  const boxEn = document.getElementById('modal-trick-box-en');
  if (!boxSi || !boxEn) return;

  if (currentTrickLangMode === 'si') {
    boxSi.style.display = 'block';
    boxEn.style.display = 'none';
  } else if (currentTrickLangMode === 'en') {
    boxSi.style.display = 'none';
    boxEn.style.display = 'block';
  } else {
    boxSi.style.display = 'block';
    boxEn.style.display = 'block';
  }
}

function navigateStudyTrick(delta) {
  const allTricks = getStudyTricksData();
  if (!allTricks || allTricks.length === 0) return;

  const newIdx = activeStudyTrickIndex + delta;
  if (newIdx >= 0 && newIdx < allTricks.length) {
    openStudyTrickModal(newIdx);
    const modalContent = document.querySelector('#study-trick-modal .modal-card');
    if (modalContent) modalContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function copyCurrentTrickSummary() {
  const allTricks = getStudyTricksData();
  const trick = allTricks[activeStudyTrickIndex];
  if (!trick) return;

  const textToCopy = `Apex Biology Study Trick #${String(trick.id).padStart(2, '0')}: ${trick.title_si} (${trick.title_en})\n\n[සිංහල විස්තරය]:\n${trick.desc_si}\n\n[English Description]:\n${trick.desc_en}\n\n🎯 A/L Bio Application: ${trick.bioExample}\n🧠 Neuro Mechanism: ${trick.neuroKey}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('📋 Study trick copied to clipboard!');
    }).catch(() => {
      showToast('Summary copied!');
    });
  } else {
    showToast('Summary ready to view!');
  }
}


// ==========================================================================
// A/L EXAM REAL-TIME COUNTDOWN TIMER (2027 & 2028 Batches)
// ==========================================================================

let countdownBatchTarget = '2027'; // '2027' or '2028'
let examCountdownTimer = null;

function initExamCountdown() {
  if (examCountdownTimer) clearInterval(examCountdownTimer);
  updateCountdownDisplay();
  examCountdownTimer = setInterval(updateCountdownDisplay, 1000);
}

function switchCountdownBatch(year, reinit = true) {
  countdownBatchTarget = String(year).includes('2028') ? '2028' : '2027';
  
  const btn2027 = document.getElementById('btn-toggle-cd-2027');
  const btn2028 = document.getElementById('btn-toggle-cd-2028');
  if (btn2027 && btn2028) {
    if (countdownBatchTarget === '2028') {
      btn2027.classList.remove('active');
      btn2028.classList.add('active');
    } else {
      btn2027.classList.add('active');
      btn2028.classList.remove('active');
    }
  }

  const batchLabel = document.getElementById('cd-target-batch-label');
  if (batchLabel) {
    batchLabel.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${countdownBatchTarget} A/L BIOLOGY`;
  }

  const headlineBatch = document.getElementById('cd-headline-batch');
  if (headlineBatch) headlineBatch.textContent = `${countdownBatchTarget} A/L`;

  const dateStr = document.getElementById('cd-target-date-str');
  if (dateStr) {
    dateStr.textContent = `${countdownBatchTarget} අගෝස්තු 01 වනදා`;
  }

  updateCountdownDisplay();
}

function updateCountdownDisplay() {
  // Target date: August 1 of the chosen year, 08:30:00 AM
  const targetYear = parseInt(countdownBatchTarget, 10) || 2027;
  const targetDate = new Date(targetYear, 7, 1, 8, 30, 0); // Month 7 is August in JS (0-indexed)
  const now = new Date();

  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    setCountdownValue('cd-val-months', '00');
    setCountdownValue('cd-val-days', '00');
    setCountdownValue('cd-val-hours', '00');
    setCountdownValue('cd-val-minutes', '00');
    setCountdownValue('cd-val-seconds', '00');
    return;
  }

  // Calculate detailed calendar Breakdown
  let tempDate = new Date(now.getTime());
  let months = 0;

  // Add full months until exceeding target
  while (true) {
    const nextMonth = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, tempDate.getDate(), tempDate.getHours(), tempDate.getMinutes(), tempDate.getSeconds());
    if (nextMonth.getTime() <= targetDate.getTime()) {
      months++;
      tempDate = nextMonth;
    } else {
      break;
    }
  }

  const remainingMs = targetDate.getTime() - tempDate.getTime();
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  setCountdownValue('cd-val-months', String(months).padStart(2, '0'));
  setCountdownValue('cd-val-days', String(days).padStart(2, '0'));
  setCountdownValue('cd-val-hours', String(hours).padStart(2, '0'));
  setCountdownValue('cd-val-minutes', String(minutes).padStart(2, '0'));
  setCountdownValue('cd-val-seconds', String(seconds).padStart(2, '0'));
}

function setCountdownValue(elementId, val) {
  const el = document.getElementById(elementId);
  if (el && el.textContent !== val) {
    el.textContent = val;
  }
}

// ==========================================================================
// ==========================================================================
// DAILY STUDY PLANNER & TARGET TRACKER (DATABASE PERSISTED & 24H AUTO-EXPIRY)
// ==========================================================================

let studentDailyTasksCache = null;

function getStudentPlannerId() {
  return currentStudent && (currentStudent.studentId || currentStudent.id) 
    ? (currentStudent.studentId || currentStudent.id) 
    : 'guest';
}

async function fetchStudentStudyTasks() {
  const sId = getStudentPlannerId();
  try {
    const res = await fetch(`/api/students/${sId}/tasks`);
    const json = await res.json();
    if (json.success && Array.isArray(json.tasks)) {
      studentDailyTasksCache = json.tasks;
      return studentDailyTasksCache;
    }
  } catch (err) {
    console.warn('Could not fetch study tasks from server:', err);
  }

  // Fallback to memory / default tasks if server unreachable
  if (!studentDailyTasksCache) {
    studentDailyTasksCache = [
      { id: 'task_1', title: 'Unit 02 සෛල විද්‍යාව Resource Book කියවීම', completed: false, createdAt: Date.now() },
      { id: 'task_2', title: 'පසුගිය විභාග MCQ 25 ක් කර විවරණය බැලීම', completed: false, createdAt: Date.now() },
      { id: 'task_3', title: 'Bio Study Tricks #01 Feynman ක්‍රමයෙන් සංකල්පයක් පැහැදිලි කිරීම', completed: false, createdAt: Date.now() }
    ];
  }
  return studentDailyTasksCache;
}

async function renderStudyTasks() {
  const container = document.getElementById('planner-tasks-container');
  if (!container) return;

  const tasks = await fetchStudentStudyTasks();
  if (!tasks || tasks.length === 0) {
    container.innerHTML = `
      <div class="planner-empty-state">
        <i class="fa-regular fa-clipboard" style="font-size: 26px; margin-bottom: 8px; color: #cbd5e1; display: block;"></i>
        අද දිනට පාඩම් ඉලක්ක කිසිවක් සටහන් කර නැත. ඉහතින් ඔබේ පළමු ඉලක්කය ඇතුළත් කරන්න! (පැය 24 කින් පසු ඉබේම අලුත් වේ)
      </div>`;
    updatePlannerProgress(0, 0);
    return;
  }

  let completedCount = 0;
  let html = '';

  tasks.forEach(task => {
    if (task.completed) completedCount++;
    const taskTitle = task.title || task.text || '';
    html += `
      <div class="planner-task-item ${task.completed ? 'completed' : ''}" id="task-item-${task.id}">
        <div class="planner-task-left">
          <input type="checkbox" class="planner-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleStudyTask('${task.id}')" aria-label="Mark task completed">
          <span class="planner-task-text">${escapeHtml(taskTitle)}</span>
        </div>
        <button type="button" class="btn-planner-del-task" onclick="deleteStudyTask('${task.id}')" title="Delete Target">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`;
  });

  container.innerHTML = html;
  updatePlannerProgress(completedCount, tasks.length);
}

function updatePlannerProgress(completed, total) {
  const compEl = document.getElementById('planner-completed-text');
  const pctEl = document.getElementById('planner-percent-text');
  const fillEl = document.getElementById('planner-progress-fill');

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  if (compEl) compEl.textContent = `${completed} of ${total} Completed`;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (fillEl) fillEl.style.width = `${pct}%`;
}

async function addStudyTask() {
  const input = document.getElementById('planner-new-task-input');
  if (!input) return;
  const text = (input.value || '').trim();
  if (!text) return;

  const sId = getStudentPlannerId();
  try {
    const res = await fetch(`/api/students/${sId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text })
    });
    const json = await res.json();
    if (json.success && json.task) {
      if (!studentDailyTasksCache) studentDailyTasksCache = [];
      studentDailyTasksCache.unshift(json.task);
    }
  } catch (err) {
    console.warn('Failed to save study task to server:', err);
  }

  input.value = '';
  await renderStudyTasks();
  showToast('🎯 නව පාඩම් ඉලක්කය ඩේටාබේස් එකේ සේව් වුණා! (පැය 24කට පසු ස්වයංක්‍රීයව අලුත් වේ)');
}

async function quickAddStudyTask(presetText) {
  const sId = getStudentPlannerId();
  try {
    const res = await fetch(`/api/students/${sId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: presetText })
    });
    const json = await res.json();
    if (json.success && json.task) {
      if (!studentDailyTasksCache) studentDailyTasksCache = [];
      studentDailyTasksCache.unshift(json.task);
    }
  } catch (err) {
    console.warn('Failed to quick add task to server:', err);
  }

  await renderStudyTasks();
  showToast('🎯 ඉලක්කය එකතු විය: ' + presetText);
}

async function toggleStudyTask(taskId) {
  const sId = getStudentPlannerId();
  let isDone = false;
  if (studentDailyTasksCache) {
    const task = studentDailyTasksCache.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      isDone = task.completed;
      try {
        await fetch(`/api/students/${sId}/tasks/${taskId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: task.completed })
        });
      } catch (err) {
        console.warn('Failed to update task completion on server:', err);
      }
    }
  }

  await renderStudyTasks();
  if (isDone) {
    showToast('🎉 සුබ පැතුම්! ඉලක්කය සම්පූර්ණයි!');
  }
}

async function deleteStudyTask(taskId) {
  const sId = getStudentPlannerId();
  try {
    await fetch(`/api/students/${sId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Failed to delete task from server:', err);
  }

  if (studentDailyTasksCache) {
    studentDailyTasksCache = studentDailyTasksCache.filter(t => t.id !== taskId);
  }
  await renderStudyTasks();
  showToast('🗑️ ඉලක්කය ඉවත් කළා');
}

// ==========================================================================
// MY STUDENT ACCOUNT & PROFILE SETTINGS CONTROLLER (tab-account)
// ==========================================================================

function renderAccountTab() {
  if (!currentStudent) {
    showToast('කරුණාකර පළමුව Log In වන්න.');
    return;
  }

  // Populate Left Card
  const cardName = document.getElementById('acc-card-name');
  const cardSchool = document.getElementById('acc-card-school');
  const cardBatch = document.getElementById('acc-card-batch');
  const cardVerified = document.getElementById('acc-card-verified');
  const pillId = document.getElementById('acc-pill-student-id');

  if (cardName) cardName.textContent = currentStudent.name || 'Student';
  if (cardSchool) cardSchool.textContent = currentStudent.school || 'A/L Biology Student';
  if (cardBatch) cardBatch.textContent = (currentStudent.year || '2027') + ' A/L';
  if (pillId) pillId.textContent = 'ID: ' + (currentStudent.studentId || '27804192');

  if (cardVerified) {
    if (currentStudent.isVerified) {
      cardVerified.style.display = 'inline-flex';
    } else {
      cardVerified.style.display = 'none';
    }
  }

  // Populate Right Form
  const inputName = document.getElementById('acc-input-name');
  const inputSchool = document.getElementById('acc-input-school');
  const inputPhone = document.getElementById('acc-input-phone');
  const inputEmail = document.getElementById('acc-input-email');
  const inputBatch = document.getElementById('acc-input-batch');
  const inputId = document.getElementById('acc-input-id');
  const inputStatus = document.getElementById('acc-input-status');

  if (inputName) inputName.value = currentStudent.name || '';
  if (inputSchool) inputSchool.value = currentStudent.school || '';
  if (inputPhone) inputPhone.value = currentStudent.phone || '';
  if (inputEmail) inputEmail.value = currentStudent.email || '';
  if (inputId) inputId.value = currentStudent.studentId || '27804192';
  if (inputStatus) inputStatus.value = currentStudent.status === 'suspended' ? 'Suspended' : 'Active Registered Student';

  if (inputBatch) {
    const yr = String(currentStudent.year || '2027');
    inputBatch.value = yr.includes('2028') ? '2028' : '2027';
  }

  // Avatar Display
  updateAvatarDisplayEverywhere(currentStudent.photoUrl || null);
}

function updateAvatarDisplayEverywhere(photoUrl) {
  // 1. Account Tab Big Avatar
  const imgEl = document.getElementById('account-avatar-img');
  const fallbackEl = document.getElementById('account-avatar-fallback');
  const delBtn = document.getElementById('btn-delete-avatar');

  if (imgEl && fallbackEl) {
    if (photoUrl) {
      imgEl.src = photoUrl;
      imgEl.style.display = 'block';
      fallbackEl.style.display = 'none';
      if (delBtn) delBtn.style.display = 'inline-flex';
    } else {
      imgEl.src = '';
      imgEl.style.display = 'none';
      fallbackEl.style.display = 'block';
      if (delBtn) delBtn.style.display = 'none';
    }
  }

  // 2. Sidebar Mini Avatar Box
  const sbAvatarContainer = document.getElementById('sb-user-avatar-container');
  if (sbAvatarContainer) {
    if (photoUrl) {
      sbAvatarContainer.innerHTML = `
        <img src="${photoUrl}" class="user-avatar-img" alt="Student">
        <span class="user-status-dot" title="Active Student"></span>`;
    } else {
      sbAvatarContainer.innerHTML = `
        <span id="sb-user-avatar-placeholder">🌱</span>
        <span class="user-status-dot" title="Active Student"></span>`;
    }
  }
}

// Convert user uploaded photo to WebP in browser using HTML5 Canvas
async function handleProfilePhotoSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('⚠️ කරුණාකර වලංගු Image එකක් (JPG/PNG/WEBP) තෝරන්න.');
    return;
  }

  showToast('⏳ Optimizing image to WebP format...');

  try {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = async function() {
        // Create canvas for 500x500 square avatar
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 500;
        let width = img.width;
        let height = img.height;

        // Crop square from center
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE);

        // Convert directly to modern WebP Data URL
        const webpDataUrl = canvas.toDataURL('image/webp', 0.85);

        // Upload to server
        await uploadStudentWebpPhoto(webpDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } catch (err) {
    console.error('Error converting image to WebP:', err);
    showToast('Image processing error');
  }
}

async function uploadStudentWebpPhoto(webpDataUrl) {
  if (!currentStudent || !currentStudent.studentId) return;

  try {
    const res = await fetch(`/api/students/${currentStudent.studentId}/photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photoData: webpDataUrl })
    });

    const json = await res.json();
    if (json.success && json.photoUrl) {
      currentStudent.photoUrl = json.photoUrl;
      localStorage.setItem('apex_bio_student', JSON.stringify(currentStudent));
      updateAvatarDisplayEverywhere(json.photoUrl);
      showToast('🎉 Profile Photo එක සාර්ථකව WebP ආකෘතියෙන් save විය!');
    } else {
      showToast(json.message || 'Photo upload failed');
    }
  } catch (err) {
    console.error('Photo upload error:', err);
    showToast('Network error uploading profile photo');
  }
}

async function removeProfilePhoto() {
  if (!currentStudent || !currentStudent.studentId) return;
  if (!confirm('ඔබේ Profile Photo එක ඉවත් කිරීමට අවශ්‍ය බව තහවුරු කරන්නද?')) return;

  try {
    const res = await fetch(`/api/students/${currentStudent.studentId}/photo`, {
      method: 'DELETE'
    });

    const json = await res.json();
    if (json.success) {
      currentStudent.photoUrl = null;
      localStorage.setItem('apex_bio_student', JSON.stringify(currentStudent));
      updateAvatarDisplayEverywhere(null);
      showToast('🗑️ Profile Photo එක ඉවත් කරන ලදී.');
    } else {
      showToast(json.message || 'Error removing photo');
    }
  } catch (err) {
    console.error('Photo remove error:', err);
    showToast('Network error removing photo');
  }
}

async function saveStudentProfile(event) {
  if (event) event.preventDefault();
  if (!currentStudent || !currentStudent.studentId) return;

  const btn = document.getElementById('btn-save-account');
  const name = document.getElementById('acc-input-name').value.trim();
  const school = document.getElementById('acc-input-school').value.trim();
  const phone = document.getElementById('acc-input-phone').value.trim();
  const year = document.getElementById('acc-input-batch').value.trim();

  if (!name || !school || !phone) {
    showToast('⚠️ කරුණාකර සියලු තොරතුරු සම්පූර්ණ කරන්න.');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving Profile...';
  }

  try {
    const res = await fetch(`/api/students/${currentStudent.studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        school,
        phone,
        year
      })
    });

    const json = await res.json();
    if (json.success && json.student) {
      currentStudent = Object.assign(currentStudent, json.student);
      localStorage.setItem('apex_bio_student', JSON.stringify(currentStudent));

      // Update UI components
      const sbName = document.getElementById('sb-user-name');
      const sbSchool = document.getElementById('sb-user-school');
      if (sbName) sbName.textContent = name;
      if (sbSchool) sbSchool.textContent = school;

      const cardName = document.getElementById('acc-card-name');
      const cardSchool = document.getElementById('acc-card-school');
      const cardBatch = document.getElementById('acc-card-batch');
      if (cardName) cardName.textContent = name;
      if (cardSchool) cardSchool.textContent = school;
      if (cardBatch) cardBatch.textContent = year + ' A/L';

      // Update countdown target batch if year changed
      countdownBatchTarget = year;
      switchCountdownBatch(year, true);

      showToast('🎉 ඔබගේ ශිෂ්‍ය තොරතුරු සාර්ථකව යාවත්කාලීන විය!');
    } else {
      showToast(json.message || 'Failed to update profile');
    }
  } catch (err) {
    console.error('Save profile error:', err);
    showToast('Network error while saving profile');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Profile Changes (වෙනස්කම් සුරකින්න)';
    }
  }
}




// ==========================================================================
// 17. PAST PAPERS TRACKER - FULL BREAKDOWN (MCQ/STRUCT/ESSAY), MULTI-REASONS & PDF REPORT ENGINE
// ==========================================================================

const CLEAN_PAPER_REASONS = {
  keywords_missed: { name: '📖 සම්පත් පොතේ / Marking Scheme වචන නොලියවීම', short: 'Keywords Missed', icon: 'fa-book' },
  concept_forgotten: { name: '🧠 විෂය කරුණු අමතක වීම', short: 'Concept Forgotten', icon: 'fa-brain' },
  time_limit: { name: '⏱️ වෙලාව මදි වීම / වේගය ප්‍රමාණවත් නොවීම', short: 'Ran Out of Time', icon: 'fa-clock' },
  careless_error: { name: '⚠️ නොසැලකිලිමත්කම / සුළු ගණන් වැරදීම', short: 'Careless Error', icon: 'fa-triangle-exclamation' },
  question_misread: { name: '❓ ප්‍රශ්නය වරදවා තේරුම් ගැනීම / අවධානය මදි වීම', short: 'Question Misread', icon: 'fa-circle-question' },
  sub_questions_skipped: { name: '📑 ප්‍රශ්න පත්‍රයේ කොටස් මගහැරීම', short: 'Sub-questions Skipped', icon: 'fa-file-lines' },
  diagram_label_error: { name: '📉 රූප සටහන් / ප්‍රස්තාර ලේබල් වැරදීම', short: 'Diagram & Label Error', icon: 'fa-chart-area' },
  units_missing: { name: '📐 ඒකක (Units) නොලිවීම හෝ වැරදි ඒකක යෙදීම', short: 'Units Missing', icon: 'fa-ruler-combined' },
  exam_panic: { name: '🛑 විභාග බිය / කලබල වීම සහ පීඩනය', short: 'Exam Anxiety & Panic', icon: 'fa-heart-pulse' },
  irrelevant_details: { name: '🎯 අදාළ නොවන අමතර කරුණු ලිවීමෙන් කාලය හා ලකුණු අහිමි වීම', short: 'Irrelevant Content', icon: 'fa-bullseye' },
  practical_gap: { name: '🔬 ප්‍රායෝගික පරීක්ෂණ (Practicals) දැනුම ප්‍රමාණවත් නොවීම', short: 'Practical Theory Gap', icon: 'fa-flask' },
  handwriting_presentation: { name: '✍️ අත්අකුරු හෝ පිළිතුරු පිළිවෙළ අපැහැදිලි වීම', short: 'Illegible Handwriting', icon: 'fa-pen-nib' },
  other: { name: '📝 වෙනත් හේතු / අපැහැදිලි දුර්වලතා', short: 'Other Weak Points', icon: 'fa-note-sticky' }
};

let cleanCurrentSubjectFilter = 'all';
let cleanSelectedCustomReasons = [];

// --- Dynamic Subject Management ---
function getUserSubjects() {
  try {
    const raw = localStorage.getItem('apex_user_paper_subjects_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveUserSubjects(subjects) {
  try {
    localStorage.setItem('apex_user_paper_subjects_v1', JSON.stringify(subjects));
  } catch (e) {}
}

function openAddSubjectModal() {
  const nameIn = document.getElementById('new-subject-name');
  const iconIn = document.getElementById('new-subject-icon');
  if (nameIn) nameIn.value = '';
  if (iconIn) iconIn.value = '📚';
  openModal('modal-add-subject');
  setTimeout(() => { if (nameIn) nameIn.focus(); }, 150);
}

function quickFillSubject(name, icon) {
  const nameIn = document.getElementById('new-subject-name');
  const iconIn = document.getElementById('new-subject-icon');
  if (nameIn) nameIn.value = name;
  if (iconIn) iconIn.value = icon;
}

function handleSaveCustomSubject(e) {
  if (e) e.preventDefault();
  const nameIn = document.getElementById('new-subject-name');
  const iconIn = document.getElementById('new-subject-icon');
  const name = nameIn ? nameIn.value.trim() : '';
  const icon = iconIn ? iconIn.value.trim() : '📚';

  if (!name) {
    showToast('කරුණාකර විෂයේ නම ඇතුළත් කරන්න.', 'warning');
    return;
  }

  const subjects = getUserSubjects();
  const exists = subjects.some(s => s.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    showToast('මෙම විෂය දැනටමත් ඇතුළත් කර ඇත.', 'info');
    return;
  }

  const newSub = {
    id: 'subj_' + Date.now(),
    name: name,
    icon: icon || '📚'
  };

  subjects.push(newSub);
  saveUserSubjects(subjects);
  closeModal('modal-add-subject');
  showToast(`🎉 '${name}' විෂය සාර්ථකව ඇතුළත් කරන ලදී!`, 'success');

  cleanCurrentSubjectFilter = newSub.id;
  renderPaperTracker();
}

function deleteUserSubject(subId, subName) {
  if (!confirm(`'${subName}' විෂය ඉවත් කිරීමට අවශ්‍ය බව සහතිකද?\n(මෙම විෂයට අදාළ පේපර් සටහන් ආරක්ෂිතව පවතිනු ඇත)`)) return;
  let subjects = getUserSubjects();
  subjects = subjects.filter(s => s.id !== subId);
  saveUserSubjects(subjects);

  if (cleanCurrentSubjectFilter === subId) {
    cleanCurrentSubjectFilter = 'all';
  }
  showToast(`'${subName}' විෂය සාර්ථකව ඉවත් කරන ලදී.`, 'info');
  renderPaperTracker();
}

function renderCleanSubjectPills() {
  const container = document.getElementById('clean-pp-subjects-container');
  if (!container) return;

  const subjects = getUserSubjects();

  let html = `
    <button type="button" class="clean-pp-sub-pill ${cleanCurrentSubjectFilter === 'all' ? 'active' : ''}" 
            data-subject="all" onclick="filterCleanPapersBySubject('all')">
      All Subjects
    </button>
  `;

  subjects.forEach(sub => {
    const isActive = cleanCurrentSubjectFilter === sub.id;
    html += `
      <button type="button" class="clean-pp-sub-pill ${isActive ? 'active' : ''}" 
              data-subject="${escapeHTML(sub.id)}" onclick="filterCleanPapersBySubject('${escapeHTML(sub.id)}')">
        <span>${escapeHTML(sub.icon || '📚')} ${escapeHTML(sub.name)}</span>
        <span class="clean-pp-sub-del" title="Delete subject" onclick="event.stopPropagation(); deleteUserSubject('${escapeHTML(sub.id)}', '${escapeHTML(sub.name)}')">
          <i class="fa-solid fa-xmark"></i>
        </span>
      </button>
    `;
  });

  html += `
    <button type="button" class="clean-pp-sub-pill add-btn" onclick="openAddSubjectModal()">
      <i class="fa-solid fa-plus"></i> Add Subject
    </button>
  `;

  container.innerHTML = html;
}

// --- Paper Management Core ---
function getCleanPapers() {
  try {
    const raw = localStorage.getItem('apex_clean_past_papers_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveCleanPapers(papers) {
  try {
    localStorage.setItem('apex_clean_past_papers_v1', JSON.stringify(papers));
  } catch (e) {}
}

function initPaperTracker() {
  renderPaperTracker();
}

function renderPaperTracker() {
  renderCleanSubjectPills();

  const allPapers = getCleanPapers();

  const papers = cleanCurrentSubjectFilter === 'all' 
    ? allPapers 
    : allPapers.filter(p => p.subject === cleanCurrentSubjectFilter);

  // 1. Stat Cards
  const statDone = document.getElementById('pp-stat-done');
  const statAvg = document.getElementById('pp-stat-avg');
  const statBest = document.getElementById('pp-stat-best');

  if (statDone) statDone.textContent = papers.length;

  if (papers.length === 0) {
    if (statAvg) statAvg.textContent = '0';
    if (statBest) statBest.textContent = '0';
  } else {
    const sum = papers.reduce((acc, p) => acc + (parseFloat(p.score) || 0), 0);
    const avg = Math.round(sum / papers.length);
    const best = Math.max(...papers.map(p => parseFloat(p.score) || 0));

    if (statAvg) statAvg.textContent = avg;
    if (statBest) statBest.textContent = best;
  }

  // 2. Score Trend Chart
  renderCleanPaperChart(papers);

  // 3. Mistake Diagnostics (Multi-reasons)
  renderCleanPaperMistakes(papers);

  // 4. Recent Papers List
  renderCleanPaperList(papers);
}

function filterCleanPapersBySubject(sub) {
  cleanCurrentSubjectFilter = sub;
  renderPaperTracker();
}

function renderCleanPaperChart(papers) {
  const container = document.getElementById('clean-pp-chart-container');
  const countEl = document.getElementById('pp-trend-count');
  if (!container) return;

  if (!papers || papers.length === 0) {
    if (countEl) countEl.textContent = '0 papers recorded';
    container.innerHTML = `
      <div style="height: 180px; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 0.88rem; flex-direction: column; gap: 8px;">
        <i class="fa-solid fa-chart-line" style="font-size: 2rem; color: #cbd5e1;"></i>
        <span>තවම පේපර් සටහන් කර නොමැත. ලකුණු ප්‍රස්තාරය බැලීමට <strong>+ Add Paper</strong> ක්ලික් කරන්න.</span>
      </div>
    `;
    return;
  }

  const chartPapers = papers.slice(-10);
  if (countEl) countEl.textContent = `${chartPapers.length} paper${chartPapers.length > 1 ? 's' : ''} logged`;

  const width = 800;
  const height = 180;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 35;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const n = chartPapers.length;
  const stepX = n > 1 ? chartW / (n - 1) : chartW / 2;

  function getY(score) {
    const s = Math.max(0, Math.min(100, parseFloat(score) || 0));
    return padTop + chartH - (s / 100) * chartH;
  }

  function getX(idx) {
    if (n === 1) return padLeft + chartW / 2;
    return padLeft + idx * stepX;
  }

  const points = chartPapers.map((p, idx) => `${getX(idx)},${getY(p.score)}`).join(' ');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width: 100%; height: 180px;">
      <line x1="${padLeft}" y1="${getY(100)}" x2="${width - padRight}" y2="${getY(100)}" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="${padLeft}" y1="${getY(75)}" x2="${width - padRight}" y2="${getY(75)}" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="${padLeft}" y1="${getY(50)}" x2="${width - padRight}" y2="${getY(50)}" stroke="#f1f5f9" stroke-width="1"/>
      <line x1="${padLeft}" y1="${getY(25)}" x2="${width - padRight}" y2="${getY(25)}" stroke="#f1f5f9" stroke-width="1"/>

      <text x="${padLeft - 10}" y="${getY(100) + 4}" font-size="11" fill="#94a3b8" text-anchor="end" font-weight="600">100</text>
      <text x="${padLeft - 10}" y="${getY(75) + 4}" font-size="11" fill="#94a3b8" text-anchor="end" font-weight="600">75</text>
      <text x="${padLeft - 10}" y="${getY(50) + 4}" font-size="11" fill="#94a3b8" text-anchor="end" font-weight="600">50</text>
      <text x="${padLeft - 10}" y="${getY(25) + 4}" font-size="11" fill="#94a3b8" text-anchor="end" font-weight="600">25</text>

      ${n > 1 ? `
        <defs>
          <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <polygon points="${getX(0)},${padTop + chartH} ${points} ${getX(n - 1)},${padTop + chartH}" fill="url(#scoreAreaGrad)"/>
        <polyline points="${points}" fill="none" stroke="#0284c7" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ` : ''}

      ${chartPapers.map((p, idx) => {
        const x = getX(idx);
        const y = getY(p.score);
        return `
          <circle cx="${x}" cy="${y}" r="8" fill="#bae6fd" opacity="0.6"/>
          <circle cx="${x}" cy="${y}" r="5" fill="#0369a1" stroke="#ffffff" stroke-width="2" style="cursor: pointer;">
            <title>${escapeHTML(p.title)}: ${p.score}%</title>
          </circle>
          <text x="${x}" y="${y - 12}" font-size="11" fill="#0f172a" font-weight="800" text-anchor="middle">${p.score}%</text>
          <text x="${x}" y="${padTop + chartH + 18}" font-size="10" fill="#64748b" font-weight="600" text-anchor="middle">
            ${escapeHTML(p.title).substring(0, 16)}
          </text>
        `;
      }).join('')}
    </svg>
  `;
}

function renderCleanPaperMistakes(papers) {
  const container = document.getElementById('clean-pp-mistakes-container');
  if (!container) return;

  if (!papers || papers.length === 0) {
    container.innerHTML = `
      <p style="color: #64748b; font-size: 0.86rem; margin: 0; padding: 10px 0;">
        තවම පේපර් සටහන් කර නොමැත. පේපර් එකක් එකතු කිරීමේදී ලකුණු අඩුවීමට හේතු වූ කරුණු සටහන් කළ විට මෙහි විග්‍රහය දිස්වනු ඇත.
      </p>
    `;
    return;
  }

  const counts = {};
  Object.keys(CLEAN_PAPER_REASONS).forEach(k => counts[k] = 0);
  const customCounts = {};

  let totalReasonInstances = 0;

  papers.forEach(p => {
    // Standard reasons array or fallback
    const rList = Array.isArray(p.reasons) ? p.reasons : (p.reason ? [p.reason] : []);
    rList.forEach(r => {
      if (counts[r] !== undefined) {
        counts[r] = (counts[r] || 0) + 1;
        totalReasonInstances++;
      } else {
        customCounts[r] = (customCounts[r] || 0) + 1;
        totalReasonInstances++;
      }
    });

    // Custom reasons array
    if (Array.isArray(p.customReasons)) {
      p.customReasons.forEach(c => {
        if (c && c.trim()) {
          customCounts[c] = (customCounts[c] || 0) + 1;
          totalReasonInstances++;
        }
      });
    }
  });

  const activeStd = Object.entries(counts).filter(([_, count]) => count > 0);
  const activeCustom = Object.entries(customCounts).filter(([_, count]) => count > 0);

  if (activeStd.length === 0 && activeCustom.length === 0) {
    container.innerHTML = '<p style="color: #64748b; font-size: 0.86rem; margin: 0;">හේතු සටහන් කර නොමැත.</p>';
    return;
  }

  let html = activeStd.map(([reasonKey, count]) => {
    const info = CLEAN_PAPER_REASONS[reasonKey] || { name: reasonKey, short: reasonKey };
    const pct = Math.round((count / papers.length) * 100);

    return `
      <div class="clean-pp-mistake-pill">
        <div class="clean-pp-mistake-name">
          <span>${info.name}</span>
        </div>
        <span class="clean-pp-mistake-badge">${count} Papers (${pct}%)</span>
      </div>
    `;
  }).join('');

  if (activeCustom.length > 0) {
    html += activeCustom.map(([cReason, count]) => {
      const pct = Math.round((count / papers.length) * 100);
      return `
        <div class="clean-pp-mistake-pill" style="border-color: #cbd5e1; background: #f8fafc;">
          <div class="clean-pp-mistake-name" style="color: #334155;">
            <span>💡 ${escapeHTML(cReason)}</span>
          </div>
          <span class="clean-pp-mistake-badge" style="background: #64748b;">${count} Papers (${pct}%)</span>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = html;
}

function renderCleanPaperList(papers) {
  const container = document.getElementById('clean-pp-papers-container');
  if (!container) return;

  const userSubjects = getUserSubjects();

  if (!papers || papers.length === 0) {
    if (userSubjects.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 32px 20px; color: #64748b;">
          <div style="font-size: 2.2rem; margin-bottom: 10px;">📚</div>
          <h4 style="margin: 0 0 6px 0; color: #0f172a; font-weight: 800;">ඔබේ විෂයන් තවම ඇතුළත් කර නොමැත</h4>
          <p style="margin: 0 0 16px 0; font-size: 0.88rem; color: #64748b;">ප්‍රශ්න පත්‍ර ලකුණු සටහන් කිරීමට පළමුව ඔබ හදාරන විෂයයන් එක් කරගන්න.</p>
          <button type="button" class="btn-clean-add-pp" onclick="openAddSubjectModal()" style="font-size: 0.88rem; padding: 8px 20px;">
            <i class="fa-solid fa-plus"></i> Add Your First Subject
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="text-align: center; padding: 26px; color: #94a3b8; font-size: 0.88rem;">
          මෙම විෂයට අදාළව තවම පේපර් සටහන් කර නොමැත. ඉහළින් <strong>+ Add Paper</strong> ක්ලික් කර නව පේපරයක් ඇතුළත් කරන්න.
        </div>
      `;
    }
    return;
  }

  const typeLabels = {
    full: { label: 'Full Paper', cls: 'full' },
    mcq: { label: 'MCQ (Part I)', cls: 'mcq' },
    structured: { label: 'Structured', cls: 'structured' },
    essay: { label: 'Essay Only', cls: 'essay' }
  };

  container.innerHTML = papers.map(p => {
    const scoreNum = parseFloat(p.score) || 0;
    const badgeClass = scoreNum >= 75 ? 'high' : (scoreNum >= 50 ? 'mid' : 'low');

    const subObj = userSubjects.find(s => s.id === p.subject);
    const subLabel = subObj ? `${subObj.icon || '📚'} ${subObj.name}` : (p.subjectName || '📚 General');

    const pType = p.paperType || 'full';
    const typeInfo = typeLabels[pType] || { label: 'Paper', cls: 'full' };

    // Reasons list
    const rList = Array.isArray(p.reasons) ? p.reasons : (p.reason ? [p.reason] : []);
    const customList = Array.isArray(p.customReasons) ? p.customReasons : [];

    // Component details pill if entered
    let compText = '';
    if (p.mcqScore !== undefined && p.mcqScore !== null && p.mcqScore !== '') {
      compText += `MCQ: ${p.mcqScore}/50 `;
    }
    if (p.structScore !== undefined && p.structScore !== null && p.structScore !== '') {
      compText += `• Struct: ${p.structScore}% `;
    }
    if (p.essayScore !== undefined && p.essayScore !== null && p.essayScore !== '') {
      compText += `• Essay: ${p.essayScore}% `;
    }

    return `
      <div class="clean-pp-paper-item">
        <div class="clean-pp-paper-left">
          <div class="clean-pp-paper-score-badge ${badgeClass}">
            ${scoreNum}%
          </div>
          <div class="clean-pp-paper-info">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 3px;">
              <h4 class="clean-pp-paper-name" style="margin: 0;">${escapeHTML(p.title)}</h4>
              <span class="pp-component-badge ${typeInfo.cls}">${typeInfo.label}</span>
            </div>
            
            <div class="clean-pp-paper-meta">
              <span>${escapeHTML(subLabel)}</span>
              <span>•</span>
              <span><i class="fa-regular fa-calendar"></i> ${p.date || 'Recent'}</span>
              ${compText ? `<span style="color: #0369a1; font-weight: 700;">• (${escapeHTML(compText.trim())})</span>` : ''}
            </div>

            <!-- Multi Reasons List -->
            <div class="clean-pp-paper-reasons-wrap">
              ${rList.map(rKey => {
                const rInfo = CLEAN_PAPER_REASONS[rKey];
                const rName = rInfo ? rInfo.name : rKey;
                return `<span class="clean-pp-reason-tag-pill">${escapeHTML(rName)}</span>`;
              }).join('')}
              ${customList.map(cText => {
                return `<span class="clean-pp-reason-tag-pill" style="background: #f1f5f9; color: #334155; border-color: #cbd5e1;">💡 ${escapeHTML(cText)}</span>`;
              }).join('')}
            </div>

            ${p.note ? `
              <p style="margin: 6px 0 0; font-size: 0.78rem; color: #64748b; font-style: italic;">
                💬 "${escapeHTML(p.note)}"
              </p>
            ` : ''}
          </div>
        </div>
        <div class="clean-pp-paper-actions">
          <button type="button" class="btn-clean-pp-action" onclick="openCleanAddPaperModal('${p.id}')" title="Edit Paper">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button type="button" class="btn-clean-pp-action del" onclick="deleteCleanPaper('${p.id}')" title="Delete Paper">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// --- Paper Type & Breakdown Toggles ---
function setCleanPaperType(type) {
  const hiddenIn = document.getElementById('clean-paper-type');
  if (hiddenIn) hiddenIn.value = type;

  const buttons = document.querySelectorAll('.paper-type-pill-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-type') === type) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const colMcq = document.getElementById('col-mcq-score');
  const colStruct = document.getElementById('col-struct-score');
  const colEssay = document.getElementById('col-essay-score');

  if (type === 'full') {
    if (colMcq) colMcq.style.display = 'block';
    if (colStruct) colStruct.style.display = 'block';
    if (colEssay) colEssay.style.display = 'block';
  } else if (type === 'mcq') {
    if (colMcq) colMcq.style.display = 'block';
    if (colStruct) colStruct.style.display = 'none';
    if (colEssay) colEssay.style.display = 'none';
  } else if (type === 'structured') {
    if (colMcq) colMcq.style.display = 'none';
    if (colStruct) colStruct.style.display = 'block';
    if (colEssay) colEssay.style.display = 'none';
  } else if (type === 'essay') {
    if (colMcq) colMcq.style.display = 'none';
    if (colStruct) colStruct.style.display = 'none';
    if (colEssay) colEssay.style.display = 'block';
  }

  autoCalcCleanPaperScore();
}

function autoCalcCleanPaperScore() {
  const typeIn = document.getElementById('clean-paper-type');
  const type = typeIn ? typeIn.value : 'full';

  const mcqIn = document.getElementById('clean-paper-mcq');
  const structIn = document.getElementById('clean-paper-struct');
  const essayIn = document.getElementById('clean-paper-essay');
  const scoreIn = document.getElementById('clean-paper-score');

  const mcqVal = mcqIn && mcqIn.value !== '' ? parseFloat(mcqIn.value) : null;
  const structVal = structIn && structIn.value !== '' ? parseFloat(structIn.value) : null;
  const essayVal = essayIn && essayIn.value !== '' ? parseFloat(essayIn.value) : null;

  if (type === 'mcq' && mcqVal !== null) {
    if (scoreIn) scoreIn.value = Math.round(Math.min(100, Math.max(0, (mcqVal / 50) * 100)));
  } else if (type === 'structured' && structVal !== null) {
    if (scoreIn) scoreIn.value = Math.round(Math.min(100, Math.max(0, structVal)));
  } else if (type === 'essay' && essayVal !== null) {
    if (scoreIn) scoreIn.value = Math.round(Math.min(100, Math.max(0, essayVal)));
  } else if (type === 'full') {
    if (mcqVal !== null || structVal !== null || essayVal !== null) {
      const mcqPct = mcqVal !== null ? (mcqVal / 50) * 100 : 0;
      const sVal = structVal !== null ? structVal : 0;
      const eVal = essayVal !== null ? essayVal : 0;
      const part2 = (sVal + eVal) / 2;
      const total = Math.round((mcqPct * 0.5) + (part2 * 0.5));
      if (scoreIn) scoreIn.value = Math.min(100, Math.max(0, total));
    }
  }
}

// --- Multi-Reasons Checkboxes & Custom Reasons ---
function populateCleanReasonsCheckboxes(selectedKeys = [], customArray = []) {
  const container = document.getElementById('clean-reasons-multiselect');
  if (!container) return;

  cleanSelectedCustomReasons = Array.isArray(customArray) ? [...customArray] : [];

  let html = '';
  Object.entries(CLEAN_PAPER_REASONS).forEach(([key, info]) => {
    const isChecked = selectedKeys.includes(key);
    html += `
      <label class="reason-check-card ${isChecked ? 'checked' : ''}" onclick="toggleReasonCheckbox(this)">
        <input type="checkbox" name="clean-reason-cb" value="${key}" ${isChecked ? 'checked' : ''} onchange="this.parentElement.classList.toggle('checked', this.checked)">
        <span class="reason-check-card-text">${info.name}</span>
      </label>
    `;
  });

  container.innerHTML = html;
  renderCustomReasonChips();
}

function toggleReasonCheckbox(labelEl) {
  // handeled by native checkbox change
}

function renderCustomReasonChips() {
  const container = document.getElementById('custom-reasons-chips-container');
  if (!container) return;

  container.innerHTML = cleanSelectedCustomReasons.map((reason, idx) => `
    <span class="custom-reason-chip">
      <span>💡 ${escapeHTML(reason)}</span>
      <span onclick="removeCustomReason(${idx})" title="Remove">&times;</span>
    </span>
  `).join('');
}

function addCustomReasonToSelection() {
  const input = document.getElementById('custom-reason-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  if (!cleanSelectedCustomReasons.includes(val)) {
    cleanSelectedCustomReasons.push(val);
    renderCustomReasonChips();
    input.value = '';
    showToast('අලුත් හේතුව ඇතුළත් කරන ලදී.', 'info');
  }
}

function removeCustomReason(idx) {
  cleanSelectedCustomReasons.splice(idx, 1);
  renderCustomReasonChips();
}

function populateCleanSubjectSelect(selectedVal = null) {
  const select = document.getElementById('clean-paper-subject');
  if (!select) return;

  const subjects = getUserSubjects();

  if (subjects.length === 0) {
    select.innerHTML = '<option value="" disabled selected>⚠️ No subjects yet - click "+ Add New" to add</option>';
    return;
  }

  select.innerHTML = subjects.map(s => `
    <option value="${escapeHTML(s.id)}">${escapeHTML(s.icon || '📚')} ${escapeHTML(s.name)}</option>
  `).join('');

  if (selectedVal && subjects.some(s => s.id === selectedVal)) {
    select.value = selectedVal;
  } else if (cleanCurrentSubjectFilter !== 'all' && subjects.some(s => s.id === cleanCurrentSubjectFilter)) {
    select.value = cleanCurrentSubjectFilter;
  } else {
    select.value = subjects[0].id;
  }
}

function openCleanAddPaperModal(editId = null) {
  const modalHeading = document.getElementById('clean-paper-modal-heading');
  const idInput = document.getElementById('clean-paper-id');
  const titleInput = document.getElementById('clean-paper-title');
  const scoreInput = document.getElementById('clean-paper-score');
  const noteInput = document.getElementById('clean-paper-note');
  const mcqIn = document.getElementById('clean-paper-mcq');
  const structIn = document.getElementById('clean-paper-struct');
  const essayIn = document.getElementById('clean-paper-essay');

  const userSubjects = getUserSubjects();
  if (userSubjects.length === 0) {
    showToast('පළමුව ඔබ හදාරන විෂයක් (Subject) ඇතුළත් කරගන්න.', 'info');
    openAddSubjectModal();
    return;
  }

  if (editId) {
    const papers = getCleanPapers();
    const paper = papers.find(p => p.id === editId);
    if (paper) {
      if (modalHeading) modalHeading.textContent = 'Edit Past Paper';
      if (idInput) idInput.value = paper.id;
      if (titleInput) titleInput.value = paper.title || '';
      populateCleanSubjectSelect(paper.subject);
      setCleanPaperType(paper.paperType || 'full');
      if (mcqIn) mcqIn.value = paper.mcqScore !== undefined ? paper.mcqScore : '';
      if (structIn) structIn.value = paper.structScore !== undefined ? paper.structScore : '';
      if (essayIn) essayIn.value = paper.essayScore !== undefined ? paper.essayScore : '';
      if (scoreInput) scoreInput.value = paper.score || '';
      if (noteInput) noteInput.value = paper.note || '';

      const selectedReasons = Array.isArray(paper.reasons) ? paper.reasons : (paper.reason ? [paper.reason] : ['keywords_missed']);
      populateCleanReasonsCheckboxes(selectedReasons, paper.customReasons || []);

      openModal('modal-clean-paper');
      return;
    }
  }

  // New Paper
  if (modalHeading) modalHeading.textContent = 'Add Past Paper';
  if (idInput) idInput.value = '';
  if (titleInput) titleInput.value = '';
  populateCleanSubjectSelect(null);
  setCleanPaperType('full');
  if (mcqIn) mcqIn.value = '';
  if (structIn) structIn.value = '';
  if (essayIn) essayIn.value = '';
  if (scoreInput) scoreInput.value = '';
  if (noteInput) noteInput.value = '';

  populateCleanReasonsCheckboxes(['keywords_missed'], []);
  openModal('modal-clean-paper');
}

function handleSaveCleanPaper(e) {
  e.preventDefault();
  const editId = document.getElementById('clean-paper-id').value;
  const title = document.getElementById('clean-paper-title').value.trim();
  const subjectSelect = document.getElementById('clean-paper-subject');
  const subject = subjectSelect ? subjectSelect.value : '';
  const score = parseFloat(document.getElementById('clean-paper-score').value || 0);
  const note = document.getElementById('clean-paper-note').value.trim();
  const paperType = document.getElementById('clean-paper-type').value || 'full';

  const mcqIn = document.getElementById('clean-paper-mcq');
  const structIn = document.getElementById('clean-paper-struct');
  const essayIn = document.getElementById('clean-paper-essay');

  const mcqScore = mcqIn && mcqIn.value !== '' ? parseFloat(mcqIn.value) : null;
  const structScore = structIn && structIn.value !== '' ? parseFloat(structIn.value) : null;
  const essayScore = essayIn && essayIn.value !== '' ? parseFloat(essayIn.value) : null;

  if (!subject) {
    showToast('කරුණාකර විෂයක් තෝරන්න.', 'warning');
    return;
  }

  // Collect checked reasons
  const checkedBoxes = document.querySelectorAll('input[name="clean-reason-cb"]:checked');
  let selectedReasons = Array.from(checkedBoxes).map(cb => cb.value);

  if (selectedReasons.length === 0 && cleanSelectedCustomReasons.length === 0) {
    selectedReasons = ['keywords_missed'];
  }

  const userSubjects = getUserSubjects();
  const subObj = userSubjects.find(s => s.id === subject);
  const subjectName = subObj ? subObj.name : 'Subject';

  const allPapers = getCleanPapers();

  const newPaper = {
    id: editId || 'pp_' + Date.now(),
    title,
    subject,
    subjectName,
    paperType,
    mcqScore,
    structScore,
    essayScore,
    score,
    reasons: selectedReasons,
    customReasons: [...cleanSelectedCustomReasons],
    reason: selectedReasons[0] || 'keywords_missed', // Backward compatibility
    note,
    date: new Date().toISOString().split('T')[0]
  };

  if (editId) {
    const idx = allPapers.findIndex(p => p.id === editId);
    if (idx !== -1) {
      allPapers[idx] = newPaper;
    } else {
      allPapers.push(newPaper);
    }
  } else {
    allPapers.push(newPaper);
  }

  saveCleanPapers(allPapers);
  closeModal('modal-clean-paper');
  showToast(`🎉 "${title}" සාර්ථකව සුරැකිණි!`, 'success');
  renderPaperTracker();
}

function deleteCleanPaper(paperId) {
  if (!confirm('ඔබට මෙම ප්‍රශ්න පත්‍ර සටහන ඉවත් කිරීමට අවශ්‍ය බව සහතිකද?')) return;
  let allPapers = getCleanPapers();
  allPapers = allPapers.filter(p => p.id !== paperId);
  saveCleanPapers(allPapers);
  showToast('ප්‍රශ්න පත්‍රය සාර්ථකව ඉවත් කරන ලදී.', 'info');
  renderPaperTracker();
}

function resetCleanPaperDemoData() {
  if (!confirm('ඔබේ පේපර් දත්ත සහ විෂයන් Reset කිරීමට අවශ්‍යද?')) return;
  saveCleanPapers([]);
  saveUserSubjects([]);
  cleanCurrentSubjectFilter = 'all';
  showToast('දත්ත සාර්ථකව Reset විය.', 'info');
  renderPaperTracker();
}

// --- Download PDF Performance Report Engine ---
function downloadCleanPapersPDFReport() {
  const papers = getCleanPapers();
  const subjects = getUserSubjects();

  if (papers.length === 0) {
    showToast('PDF වාර්තාව ලබා ගැනීමට කරුණාකර පළමුව පේපර් එකක් හෝ කිහිපයක් ඇතුළත් කරන්න.', 'warning');
    return;
  }

  showToast('📄 Official PDF Performance Report එක සූදානම් කෙරෙමින් පවතී...', 'info');

  // Compute metrics
  const totalPapers = papers.length;
  const avgScore = Math.round(papers.reduce((sum, p) => sum + (parseFloat(p.score) || 0), 0) / totalPapers);
  const bestScore = Math.max(...papers.map(p => parseFloat(p.score) || 0));

  // MCQ, Structured, Essay averages
  const mcqPapers = papers.filter(p => p.mcqScore !== null && p.mcqScore !== undefined && p.mcqScore !== '');
  const avgMcq = mcqPapers.length > 0 
    ? Math.round(mcqPapers.reduce((sum, p) => sum + ((parseFloat(p.mcqScore) / 50) * 100), 0) / mcqPapers.length)
    : null;

  const structPapers = papers.filter(p => p.structScore !== null && p.structScore !== undefined && p.structScore !== '');
  const avgStruct = structPapers.length > 0 
    ? Math.round(structPapers.reduce((sum, p) => sum + parseFloat(p.structScore), 0) / structPapers.length)
    : null;

  const essayPapers = papers.filter(p => p.essayScore !== null && p.essayScore !== undefined && p.essayScore !== '');
  const avgEssay = essayPapers.length > 0 
    ? Math.round(essayPapers.reduce((sum, p) => sum + parseFloat(p.essayScore), 0) / essayPapers.length)
    : null;

  // Aggregate Reasons
  const reasonCounts = {};
  papers.forEach(p => {
    const rList = Array.isArray(p.reasons) ? p.reasons : (p.reason ? [p.reason] : []);
    rList.forEach(r => {
      reasonCounts[r] = (reasonCounts[r] || 0) + 1;
    });
    if (Array.isArray(p.customReasons)) {
      p.customReasons.forEach(c => {
        if (c) reasonCounts[c] = (reasonCounts[c] || 0) + 1;
      });
    }
  });

  const sortedReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);

  // Current logged in user info
  const studentName = (currentUser && currentUser.name) ? currentUser.name : 'A/L Aspirant';
  const targetYear = (currentUser && currentUser.targetYear) ? currentUser.targetYear : '2027 A/L';
  const dateStr = new Date().toLocaleDateString('si-LK', { year: 'numeric', month: 'long', day: 'numeric' });

  // Create report DOM element
  const reportContainer = document.createElement('div');
  reportContainer.id = 'clean-pdf-report-canvas';
  reportContainer.style.width = '800px';
  reportContainer.style.padding = '35px 40px';
  reportContainer.style.background = '#ffffff';
  reportContainer.style.color = '#0f172a';
  reportContainer.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  reportContainer.style.lineHeight = '1.45';

  reportContainer.innerHTML = `
    <!-- Report Header Banner -->
    <div style="border-bottom: 2.5px solid #0d9488; padding-bottom: 18px; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
          <div style="width: 38px; height: 38px; background: #0d9488; color: #ffffff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 900;">
            🔬
          </div>
          <span style="font-size: 1.35rem; font-weight: 900; color: #0d9488; letter-spacing: -0.5px;">APEX BIOLOGY &amp; SCIENCE LMS</span>
        </div>
        <h1 style="margin: 0; font-size: 1.6rem; font-weight: 900; color: #0f172a;">Past Paper Performance &amp; Mistake Diagnostic Report</h1>
        <p style="margin: 3px 0 0; font-size: 0.88rem; color: #64748b;">Official Exam Strategy, Score Analytics &amp; Root-Cause Revision Guide</p>
      </div>
      <div style="text-align: right; font-size: 0.82rem; color: #475569;">
        <div style="font-weight: 800; color: #0f172a; font-size: 0.95rem;">${escapeHTML(studentName)}</div>
        <div>Target: <strong>${escapeHTML(targetYear)}</strong></div>
        <div>Generated: ${escapeHTML(dateStr)}</div>
        <div style="margin-top: 4px; display: inline-block; padding: 2px 8px; border-radius: 9999px; background: #ecfdf5; color: #047857; font-weight: 800; font-size: 0.72rem; border: 1px solid #a7f3d0;">VERIFIED REPORT</div>
      </div>
    </div>

    <!-- 4 KPI Summary Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
      <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; text-align: center;">
        <div style="font-size: 0.74rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Papers Practiced</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 4px 0;">${totalPapers}</div>
        <div style="font-size: 0.72rem; color: #0d9488; font-weight: 700;">${subjects.length} Subjects</div>
      </div>

      <div style="background: #f0fdfa; border: 1.5px solid #a7f3d0; border-radius: 14px; padding: 14px 16px; text-align: center;">
        <div style="font-size: 0.74rem; font-weight: 800; color: #0d9488; text-transform: uppercase;">Average Score</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: #047857; margin: 4px 0;">${avgScore}%</div>
        <div style="font-size: 0.72rem; color: #059669; font-weight: 700;">Overall Practice Avg</div>
      </div>

      <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 14px 16px; text-align: center;">
        <div style="font-size: 0.74rem; font-weight: 800; color: #1d4ed8; text-transform: uppercase;">Best Paper Score</div>
        <div style="font-size: 1.8rem; font-weight: 900; color: #1d4ed8; margin: 4px 0;">${bestScore}%</div>
        <div style="font-size: 0.72rem; color: #2563eb; font-weight: 700;">Peak Performance</div>
      </div>

      <div style="background: #fefce8; border: 1.5px solid #fde047; border-radius: 14px; padding: 14px 16px; text-align: center;">
        <div style="font-size: 0.74rem; font-weight: 800; color: #a16207; text-transform: uppercase;">Exam Readiness</div>
        <div style="font-size: 1.45rem; font-weight: 900; color: #854d0e; margin: 6px 0;">
          ${avgScore >= 75 ? 'Grade A (Excellent)' : (avgScore >= 65 ? 'Grade B (Very Good)' : (avgScore >= 50 ? 'Grade C (Progressing)' : 'Needs Revision'))}
        </div>
        <div style="font-size: 0.72rem; color: #a16207; font-weight: 700;">Based on A/L Marks</div>
      </div>
    </div>

    <!-- Sectional Component Gap Analysis (MCQ vs Structured vs Essay) -->
    <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 16px 20px; margin-bottom: 22px;">
      <h3 style="margin: 0 0 10px 0; font-size: 0.95rem; font-weight: 900; color: #0f172a; display: flex; align-items: center; gap: 8px;">
        <span>📊 Part I (MCQ) vs Part II (Structured &amp; Essay) Sectional Gap Analysis</span>
      </h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;">
        <div style="background: #fafafa; padding: 10px 14px; border-radius: 10px; border: 1px solid #f1f5f9;">
          <div style="font-size: 0.76rem; color: #64748b; font-weight: 700;">MCQ Average (Part I)</div>
          <div style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 2px 0;">
            ${avgMcq !== null ? avgMcq + '%' : 'N/A'}
          </div>
          <div style="font-size: 0.72rem; color: #64748b;">Speed &amp; Rapid Recall</div>
        </div>
        <div style="background: #fafafa; padding: 10px 14px; border-radius: 10px; border: 1px solid #f1f5f9;">
          <div style="font-size: 0.76rem; color: #64748b; font-weight: 700;">Structured Average</div>
          <div style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 2px 0;">
            ${avgStruct !== null ? avgStruct + '%' : 'N/A'}
          </div>
          <div style="font-size: 0.72rem; color: #64748b;">Keyword Accuracy</div>
        </div>
        <div style="background: #fafafa; padding: 10px 14px; border-radius: 10px; border: 1px solid #f1f5f9;">
          <div style="font-size: 0.76rem; color: #64748b; font-weight: 700;">Essay Average</div>
          <div style="font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 2px 0;">
            ${avgEssay !== null ? avgEssay + '%' : 'N/A'}
          </div>
          <div style="font-size: 0.72rem; color: #64748b;">Comprehensive Logic</div>
        </div>
      </div>
    </div>

    <!-- Why Marks Were Lost (Mistake Diagnostics Heatmap) -->
    <div style="background: #fff5f5; border: 1.5px solid #fecaca; border-radius: 14px; padding: 16px 20px; margin-bottom: 22px;">
      <h3 style="margin: 0 0 10px 0; font-size: 0.95rem; font-weight: 900; color: #991b1b; display: flex; align-items: center; gap: 8px;">
        <span>⚠️ Root-Cause Diagnosis (ලකුණු අඩුවීමට ප්‍රධාන වූ හේතු විශ්ලේෂණය)</span>
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${sortedReasons.slice(0, 6).map(([rKey, count]) => {
          const rInfo = CLEAN_PAPER_REASONS[rKey];
          const rName = rInfo ? rInfo.name : `💡 ${rKey}`;
          const pct = Math.round((count / totalPapers) * 100);
          return `
            <div style="background: #ffffff; border: 1px solid #fca5a5; border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.78rem; font-weight: 700; color: #7f1d1d;">${escapeHTML(rName)}</span>
              <span style="font-size: 0.75rem; font-weight: 900; background: #dc2626; color: #ffffff; padding: 2px 6px; border-radius: 6px; white-space: nowrap;">${count} papers (${pct}%)</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Complete Paper Log Table -->
    <div style="margin-bottom: 22px;">
      <h3 style="margin: 0 0 10px 0; font-size: 0.95rem; font-weight: 900; color: #0f172a;">
        📝 Complete Past Paper Practice History Log
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 0.76rem; border: 1.5px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
        <thead>
          <tr style="background: #f1f5f9; color: #334155; text-align: left; font-weight: 800;">
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">#</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">Date</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">Paper Title</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">Subject</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">Type</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">Components</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1; text-align: right;">Total %</th>
            <th style="padding: 8px 10px; border-bottom: 1.5px solid #cbd5e1;">Primary Weakness</th>
          </tr>
        </thead>
        <tbody>
          ${papers.map((p, idx) => {
            const subObj = subjects.find(s => s.id === p.subject);
            const subName = subObj ? subObj.name : (p.subjectName || 'Bio');
            const rList = Array.isArray(p.reasons) ? p.reasons : (p.reason ? [p.reason] : []);
            const rFirst = rList[0] ? (CLEAN_PAPER_REASONS[rList[0]] ? CLEAN_PAPER_REASONS[rList[0]].short : rList[0]) : 'None';
            let comps = '';
            if (p.mcqScore) comps += `M:${p.mcqScore} `;
            if (p.structScore) comps += `S:${p.structScore} `;
            if (p.essayScore) comps += `E:${p.essayScore} `;
            if (!comps) comps = '-';

            return `
              <tr style="border-bottom: 1px solid #f1f5f9; background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                <td style="padding: 8px 10px; font-weight: 700; color: #64748b;">${idx + 1}</td>
                <td style="padding: 8px 10px; color: #64748b; white-space: nowrap;">${p.date || 'Recent'}</td>
                <td style="padding: 8px 10px; font-weight: 700; color: #0f172a;">${escapeHTML(p.title)}</td>
                <td style="padding: 8px 10px; color: #475569;">${escapeHTML(subName)}</td>
                <td style="padding: 8px 10px; text-transform: uppercase; font-size: 0.68rem; font-weight: 800; color: #0369a1;">${p.paperType || 'FULL'}</td>
                <td style="padding: 8px 10px; font-weight: 600; color: #334155;">${escapeHTML(comps.trim())}</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 900; color: ${p.score >= 75 ? '#059669' : (p.score >= 50 ? '#2563eb' : '#d97706')};">${p.score}%</td>
                <td style="padding: 8px 10px; color: #991b1b; font-size: 0.72rem; font-weight: 600;">${escapeHTML(rFirst)}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Official Study Advisor Sign-off Footer -->
    <div style="border-top: 1.5px dashed #cbd5e1; padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 0.74rem; color: #64748b;">
      <div>
        <strong>Study Strategy Tip:</strong> සම්පත් පොතේ වචන සහ ප්‍රශ්න පත්‍රයේ ඉල්ලා ඇති ප්‍රධාන කරුණු කෙරෙහි විශේෂ අවධානය යොමු කරන්න.
      </div>
      <div style="text-align: right;">
        Apex LMS Official Paper Tracker System • Confidential
      </div>
    </div>
  `;

  // Attach offscreen, run html2pdf, then remove
  reportContainer.style.position = 'fixed';
  reportContainer.style.left = '-9999px';
  reportContainer.style.top = '0';
  document.body.appendChild(reportContainer);

  const cleanFilename = `Apex_Biology_Paper_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`;

  if (window.html2pdf) {
    const opt = {
      margin: [8, 8, 8, 8],
      filename: cleanFilename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(reportContainer).save().then(() => {
      document.body.removeChild(reportContainer);
      showToast('🎉 Official PDF Performance Report එක සාර්ථකව Download විය!', 'success');
    }).catch(err => {
      console.error('html2pdf error:', err);
      document.body.removeChild(reportContainer);
      showToast('PDF සැකසීමේ දෝෂයක් ඇති විය. Print Window එක විවෘත වේ...', 'warning');
      window.print();
    });
  } else {
    // Graceful fallback
    setTimeout(() => {
      document.body.removeChild(reportContainer);
      window.print();
    }, 500);
  }
}


// ==========================================================================
// 18. REVISION HUB & REVISION WHEEL (SPACED REPETITION SRS ENGINE)
// ==========================================================================

let revCurrentMode = 'syllabus'; // 'syllabus' | 'pastpapers' | 'custom'
let revWheelAngle = 0;
let revIsSpinning = false;
let revCurrentWinner = null;
let revAudioCtx = null;

const WHEEL_COLORS = [
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', 
  '#ec4899', '#f43f5e', '#f97316', '#eab308', 
  '#14b8a6', '#6366f1', '#a855f7', '#84cc16'
];

function getSRSItems() {
  try {
    const raw = localStorage.getItem('apex_srs_revision_tracker_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveSRSItems(items) {
  try {
    localStorage.setItem('apex_srs_revision_tracker_v1', JSON.stringify(items));
  } catch (e) {}
}

function initRevisionWheelTab() {
  // Populate subject selects
  const subSelect = document.getElementById('rev-subject-select');
  const ppSubSelect = document.getElementById('rev-pp-subject-select');
  const userSubs = getUserSubjects();

  let subOpts = '<option value="bio">🧬 Biology</option>';
  if (userSubs && userSubs.length > 0) {
    userSubs.forEach(s => {
      if (s.name.toLowerCase() !== 'biology') {
        subOpts += `<option value="${escapeHTML(s.id)}">${escapeHTML(s.icon || '📚')} ${escapeHTML(s.name)}</option>`;
      }
    });
  }
  if (subSelect) subSelect.innerHTML = subOpts;
  if (ppSubSelect) ppSubSelect.innerHTML = subOpts;

  // Populate Unit Checkboxes
  populateRevisionUnitsChecklist();

  // Populate Past Paper Checkboxes
  populateRevisionPastPapersChecklist();

  // Render initial wheel
  renderRevisionWheelCanvas();

  // Render SRS Tracker
  renderSRSTracker();
}

function populateRevisionUnitsChecklist() {
  const container = document.getElementById('rev-units-checklist');
  if (!container) return;

  if (typeof SYLLABUS_DATA === 'undefined' || !Array.isArray(SYLLABUS_DATA)) return;

  container.innerHTML = SYLLABUS_DATA.map(u => `
    <label class="rev-unit-check-item">
      <input type="checkbox" name="rev-unit-cb" value="${u.id}" checked onchange="onRevisionUnitToggle()">
      <span>${escapeHTML(u.title)}</span>
    </label>
  `).join('');
}

function populateRevisionPastPapersChecklist() {
  const container = document.getElementById('rev-pp-checklist');
  if (!container) return;

  const years = [
    '2024 A/L Biology Past Paper',
    '2023 A/L Biology Past Paper',
    '2022 A/L Biology Past Paper',
    '2021 A/L Biology Past Paper',
    '2020 A/L Biology Past Paper',
    '2019 A/L Biology Past Paper',
    'National Prototype Model Paper 01',
    'National Prototype Model Paper 02'
  ];

  container.innerHTML = years.map((y, idx) => `
    <label class="rev-unit-check-item">
      <input type="checkbox" name="rev-pp-cb" value="${idx}" checked onchange="renderRevisionWheelCanvas()">
      <span>${escapeHTML(y)}</span>
    </label>
  `).join('');
}

function switchRevisionWheelMode(mode) {
  if (revIsSpinning) return;
  revCurrentMode = mode;

  const tabs = document.querySelectorAll('.rev-hub-mode-tab');
  tabs.forEach(t => {
    if (t.getAttribute('data-mode') === mode) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const sylCard = document.getElementById('rev-mode-syllabus-card');
  const ppCard = document.getElementById('rev-mode-pastpapers-card');
  const custCard = document.getElementById('rev-mode-custom-card');

  if (sylCard) sylCard.style.display = mode === 'syllabus' ? 'block' : 'none';
  if (ppCard) ppCard.style.display = mode === 'pastpapers' ? 'block' : 'none';
  if (custCard) custCard.style.display = mode === 'custom' ? 'block' : 'none';

  renderRevisionWheelCanvas();
}

function toggleAllRevisionUnits() {
  if (revIsSpinning) return;
  const cbs = document.querySelectorAll('input[name="rev-unit-cb"]');
  const allChecked = Array.from(cbs).every(cb => cb.checked);
  cbs.forEach(cb => cb.checked = !allChecked);
  renderRevisionWheelCanvas();
}

function toggleAllRevisionPastPapers() {
  if (revIsSpinning) return;
  const cbs = document.querySelectorAll('input[name="rev-pp-cb"]');
  const allChecked = Array.from(cbs).every(cb => cb.checked);
  cbs.forEach(cb => cb.checked = !allChecked);
  renderRevisionWheelCanvas();
}

function onRevisionUnitToggle() {
  if (revIsSpinning) return;
  renderRevisionWheelCanvas();
}

function onRevisionSubjectChange() {
  if (revIsSpinning) return;
  renderRevisionWheelCanvas();
}

function onRevisionPastPaperSubjectChange() {
  if (revIsSpinning) return;
  renderRevisionWheelCanvas();
}

function onRevisionCustomTextChange() {
  if (revIsSpinning) return;
  renderRevisionWheelCanvas();
}

function getRevisionWheelCurrentItems() {
  if (revCurrentMode === 'syllabus') {
    if (typeof SYLLABUS_DATA === 'undefined' || !Array.isArray(SYLLABUS_DATA)) return [];

    const checkedBoxes = document.querySelectorAll('input[name="rev-unit-cb"]:checked');
    const checkedUnitIds = Array.from(checkedBoxes).map(cb => cb.value);

    const activeUnits = checkedUnitIds.length > 0
      ? SYLLABUS_DATA.filter(u => checkedUnitIds.includes(u.id))
      : SYLLABUS_DATA;

    let items = [];
    activeUnits.forEach(u => {
      if (Array.isArray(u.topics)) {
        u.topics.forEach(t => {
          items.push({
            title: t,
            unitLabel: u.title.split(':')[0] || 'Unit',
            unitFull: u.title,
            subject: 'Biology'
          });
        });
      }
    });

    return items;
  } else if (revCurrentMode === 'pastpapers') {
    const checkedBoxes = document.querySelectorAll('input[name="rev-pp-cb"]:checked');
    if (checkedBoxes.length === 0) {
      return [{ title: '2024 Past Paper', unitLabel: 'Past Paper', subject: 'Biology' }];
    }
    return Array.from(checkedBoxes).map(cb => {
      const text = cb.parentElement.querySelector('span').textContent;
      return {
        title: text,
        unitLabel: 'Past Paper',
        subject: 'Biology'
      };
    });
  } else if (revCurrentMode === 'custom') {
    const ta = document.getElementById('rev-custom-textarea');
    const text = ta ? ta.value : '';
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) {
      return [
        { title: 'Read Physics Notes', unitLabel: 'Custom Task', subject: 'Custom' },
        { title: 'Do 20 MCQs', unitLabel: 'Custom Task', subject: 'Custom' },
        { title: 'Watch Tutorial', unitLabel: 'Custom Task', subject: 'Custom' }
      ];
    }

    return lines.map(line => ({
      title: line,
      unitLabel: 'Custom Task',
      subject: 'Custom'
    }));
  }

  return [];
}

// --- Cute Biology Wheel Canvas Drawing ---
function renderRevisionWheelCanvas() {
  const canvas = document.getElementById('rev-wheel-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const items = getRevisionWheelCurrentItems();

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2 - 14;

  ctx.clearRect(0, 0, width, height);

  // If no items
  if (!items || items.length === 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Please select a unit', centerX, centerY);
    ctx.restore();
    return;
  }

  // To prevent overcrowding when there are 100+ topics, sample or display cleanly
  const displayItems = items.length > 40 ? items.slice(0, 40) : items;
  const numSlices = displayItems.length;
  const arcSize = (2 * Math.PI) / numSlices;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(revWheelAngle);

  // 1. Draw Slices
  for (let i = 0; i < numSlices; i++) {
    const startAngle = i * arcSize;
    const endAngle = startAngle + arcSize;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.closePath();

    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 2. Draw Slice Text
    ctx.save();
    ctx.rotate(startAngle + arcSize / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = numSlices > 25 ? 'bold 9px Inter, sans-serif' : 'bold 11px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;

    const maxChars = numSlices > 25 ? 14 : 20;
    let label = displayItems[i].title;
    if (label.length > maxChars) {
      label = label.substring(0, maxChars - 2) + '..';
    }

    ctx.fillText(label, radius - 20, 4);
    ctx.restore();
  }

  // 3. Outer Metallic Ring with White LED Rivets (Matching user screenshot)
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 10;
  ctx.stroke();

  // White Rivet Dots
  const numRivets = 24;
  for (let r = 0; r < numRivets; r++) {
    const rAngle = (r * (2 * Math.PI)) / numRivets;
    const rx = centerX + Math.cos(rAngle) * radius;
    const ry = centerY + Math.sin(rAngle) * radius;

    ctx.beginPath();
    ctx.arc(rx, ry, 3.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 4. Center Cap (White circle with inner chrome shadow)
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.2)';
  ctx.shadowBlur = 8;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, 14, 0, 2 * Math.PI);
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();

  ctx.restore();
}

function playRevClickSound() {
  try {
    if (!revAudioCtx) {
      revAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (revAudioCtx.state === 'suspended') {
      revAudioCtx.resume();
    }
    const osc = revAudioCtx.createOscillator();
    const gain = revAudioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, revAudioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, revAudioCtx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.12, revAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, revAudioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(revAudioCtx.destination);
    osc.start();
    osc.stop(revAudioCtx.currentTime + 0.03);
  } catch (e) {}
}

function spinRevisionWheel() {
  if (revIsSpinning) return;

  const items = getRevisionWheelCurrentItems();
  if (!items || items.length === 0) {
    showToast('කරකැවීම සඳහා කරුණාකර අවම වශයෙන් එක් Unit එකක් තෝරන්න.', 'warning');
    return;
  }

  revIsSpinning = true;
  const spinBtn = document.getElementById('btn-rev-spin');
  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SPINNING...';
  }

  const displayItems = items.length > 40 ? items.slice(0, 40) : items;
  const numSlices = displayItems.length;
  const arcSize = (2 * Math.PI) / numSlices;

  // Random winner
  const winnerIndex = Math.floor(Math.random() * numSlices);
  revCurrentWinner = displayItems[winnerIndex];

  // Target angle: needle is at top (3 * PI / 2)
  const targetSliceCenter = winnerIndex * arcSize + arcSize / 2;
  const needleAngle = (3 * Math.PI) / 2;
  let targetAngle = needleAngle - targetSliceCenter;

  // Add 5 to 8 full rotations
  const extraRotations = (5 + Math.floor(Math.random() * 3)) * (2 * Math.PI);
  const totalRotation = extraRotations + (targetAngle - (revWheelAngle % (2 * Math.PI)));

  const startAngle = revWheelAngle;
  const finalAngle = startAngle + totalRotation;
  const duration = 4000;
  const startTime = performance.now();

  let lastClickSlice = -1;

  function animateSpin(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Easing out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    revWheelAngle = startAngle + easeProgress * (finalAngle - startAngle);

    renderRevisionWheelCanvas();

    // Tick audio
    const currentSlice = Math.floor((revWheelAngle % (2 * Math.PI)) / arcSize);
    if (currentSlice !== lastClickSlice) {
      playRevClickSound();
      lastClickSlice = currentSlice;
    }

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      revWheelAngle = finalAngle;
      renderRevisionWheelCanvas();
      revIsSpinning = false;
      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.innerHTML = '<i class="fa-solid fa-play"></i> SPIN!';
      }
      showRevisionWinnerModal(revCurrentWinner);
    }
  }

  requestAnimationFrame(animateSpin);
}

function showRevisionWinnerModal(winner) {
  if (!winner) return;

  const topicNameEl = document.getElementById('rev-winner-topic-name');
  const subjectBadgeEl = document.getElementById('rev-winner-subject-badge');

  if (topicNameEl) topicNameEl.textContent = winner.title;
  if (subjectBadgeEl) subjectBadgeEl.textContent = (winner.subject || 'BIOLOGY') + ' • ' + (winner.unitLabel || 'UNIT');

  openModal('modal-rev-winner');
}

function addWinnerToSRSCycle() {
  if (!revCurrentWinner) return;

  const items = getSRSItems();
  const exists = items.some(i => i.title === revCurrentWinner.title);

  if (exists) {
    showToast('මෙම පාඩම් කොටස දැනටමත් Spaced Repetition චක්‍රයේ ඇත.', 'info');
    closeModal('modal-rev-winner');
    return;
  }

  const newItem = {
    id: 'srs_' + Date.now(),
    title: revCurrentWinner.title,
    unitLabel: revCurrentWinner.unitLabel || 'Biology',
    unitFull: revCurrentWinner.unitFull || 'Biology',
    dateAdded: new Date().toISOString().split('T')[0],
    addedTimestamp: Date.now(),
    d0: true,  // Automatically marked for Day 0
    d3: false,
    d7: false,
    d14: false,
    d21: false,
    fullyRevised: false
  };

  items.unshift(newItem);
  saveSRSItems(items);

  // Automatically add to Daily Study Planner & Target Tracker on Home Tab!
  addSRSItemToDailyPlanner(newItem);

  closeModal('modal-rev-winner');
  showToast(`🎉 '${newItem.title}' Spaced Repetition චක්‍රයට සහ Daily Planner එකට එක් කරන ලදී!`, 'success');

  renderSRSTracker();
}

async function addSRSItemToDailyPlanner(srsItem) {
  const taskTitle = `🔄 [SRS Revision] ${srsItem.title} (${srsItem.unitLabel} • Day 0 Review)`;
  const sId = getStudentPlannerId();
  try {
    const res = await fetch(`/api/students/${sId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle })
    });
    const json = await res.json();
    if (json.success && json.task) {
      if (!studentDailyTasksCache) studentDailyTasksCache = [];
      studentDailyTasksCache.unshift(json.task);
    }
  } catch (e) {
    if (!studentDailyTasksCache) studentDailyTasksCache = [];
    studentDailyTasksCache.unshift({
      id: 'task_' + Date.now(),
      title: taskTitle,
      completed: false,
      createdAt: Date.now()
    });
  }

  if (typeof renderStudyTasks === 'function') {
    renderStudyTasks();
  }
}

function toggleSRSInterval(id, milestone, checked) {
  let items = getSRSItems();
  const item = items.find(i => i.id === id);
  if (!item) return;

  item[milestone] = checked;

  // Check if all 5 milestones are checked
  if (item.d0 && item.d3 && item.d7 && item.d14 && item.d21) {
    item.fullyRevised = true;
    showToast(`🏆 සුබ පැතුම්! '${item.title}' 100% Spaced Repetition ආවර්ජනය සාර්ථකව අවසන් කළා!`, 'success');
  } else {
    item.fullyRevised = false;
  }

  saveSRSItems(items);
  renderSRSTracker();
}

function deleteSRSTopic(id) {
  if (!confirm('ඔබට මෙම පාඩම් කොටස Spaced Repetition චක්‍රයෙන් ඉවත් කිරීමට අවශ්‍ය බව සහතිකද?')) return;
  let items = getSRSItems();
  items = items.filter(i => i.id !== id);
  saveSRSItems(items);
  showToast('පාඩම් කොටස සාර්ථකව ඉවත් කරන ලදී.', 'info');
  renderSRSTracker();
}

function clearCompletedSRSTasks() {
  let items = getSRSItems();
  const activeOnly = items.filter(i => !i.fullyRevised);
  if (activeOnly.length === items.length) {
    showToast('සම්පූර්ණ කරන ලද පාඩම් කිසිවක් නැත.', 'info');
    return;
  }
  saveSRSItems(activeOnly);
  showToast('සම්පූර්ණ කරන ලද පාඩම් කොටස් ඉවත් කරන ලදී.', 'info');
  renderSRSTracker();
}

function renderSRSTracker() {
  const container = document.getElementById('rev-tracker-container');
  const items = getSRSItems();

  // Update 3 stat cards
  const totalEl = document.getElementById('srs-total-topics');
  const fullyEl = document.getElementById('srs-fully-revised');
  const rateEl = document.getElementById('srs-completion-rate');

  const total = items.length;
  const fully = items.filter(i => i.fullyRevised).length;
  const rate = total > 0 ? Math.round((fully / total) * 100) : 0;

  if (totalEl) totalEl.textContent = total;
  if (fullyEl) fullyEl.textContent = fully;
  if (rateEl) rateEl.textContent = rate + '%';

  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; color: #94a3b8;">
        <i class="fa-regular fa-calendar-check" style="font-size: 2.4rem; color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
        <h4 style="margin: 0 0 4px 0; color: #64748b; font-weight: 700;">No Revision Tasks Yet</h4>
        <p style="margin: 0; font-size: 0.86rem; color: #94a3b8;">
          Spin the Syllabus Wheel to add topics here.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    let checkedCount = 0;
    if (item.d0) checkedCount++;
    if (item.d3) checkedCount++;
    if (item.d7) checkedCount++;
    if (item.d14) checkedCount++;
    if (item.d21) checkedCount++;

    const progressPct = Math.round((checkedCount / 5) * 100);

    let nextDueText = 'Next: Day 3 Review';
    if (!item.d0) nextDueText = 'Due Today (Initial Review)';
    else if (!item.d3) nextDueText = 'Target: +3 Days Review';
    else if (!item.d7) nextDueText = 'Target: +7 Days Review';
    else if (!item.d14) nextDueText = 'Target: +14 Days Review';
    else if (!item.d21) nextDueText = 'Target: +21 Days Final Review';
    else nextDueText = '✅ Fully Retained (100%)';

    return `
      <div class="srs-topic-card ${item.fullyRevised ? 'completed' : ''}" id="srs-card-${item.id}">
        <div class="srs-card-top">
          <div>
            <span class="srs-card-unit-badge">${escapeHTML(item.unitLabel)}</span>
            <h4 class="srs-card-title">${escapeHTML(item.title)}</h4>
            <div class="srs-card-meta">
              <span><i class="fa-regular fa-calendar"></i> Added: ${item.dateAdded || 'Today'}</span>
              <span>•</span>
              <span style="color: ${item.fullyRevised ? '#059669' : '#0284c7'}; font-weight: 700;">
                ${escapeHTML(nextDueText)}
              </span>
            </div>
          </div>
          <button type="button" class="btn-srs-del" onclick="deleteSRSTopic('${item.id}')" title="Delete from cycle">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <!-- 5 Intervals Checklist (Day 0, Day 3, Day 7, Day 14, Day 21) -->
        <div class="srs-intervals-grid">
          <label class="srs-interval-pill ${item.d0 ? 'checked' : ''}">
            <input type="checkbox" ${item.d0 ? 'checked' : ''} onchange="toggleSRSInterval('${item.id}', 'd0', this.checked)">
            <span>Day 0</span>
          </label>
          <label class="srs-interval-pill ${item.d3 ? 'checked' : ''}">
            <input type="checkbox" ${item.d3 ? 'checked' : ''} onchange="toggleSRSInterval('${item.id}', 'd3', this.checked)">
            <span>Day 3</span>
          </label>
          <label class="srs-interval-pill ${item.d7 ? 'checked' : ''}">
            <input type="checkbox" ${item.d7 ? 'checked' : ''} onchange="toggleSRSInterval('${item.id}', 'd7', this.checked)">
            <span>Day 7</span>
          </label>
          <label class="srs-interval-pill ${item.d14 ? 'checked' : ''}">
            <input type="checkbox" ${item.d14 ? 'checked' : ''} onchange="toggleSRSInterval('${item.id}', 'd14', this.checked)">
            <span>Day 14</span>
          </label>
          <label class="srs-interval-pill ${item.d21 ? 'checked' : ''}">
            <input type="checkbox" ${item.d21 ? 'checked' : ''} onchange="toggleSRSInterval('${item.id}', 'd21', this.checked)">
            <span>Day 21 ⭐</span>
          </label>
        </div>

        <!-- Retention Progress Bar -->
        <div class="srs-progress-bar-wrap">
          <div class="srs-progress-bar-fill" style="width: ${progressPct}%;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; font-weight: 700; margin-top: 4px;">
          <span>${checkedCount} of 5 Milestones Completed</span>
          <span style="color: ${progressPct === 100 ? '#059669' : '#0f172a'};">${progressPct}% Retained</span>
        </div>
      </div>
    `;
  }).join('');
}


// ============================================================================
// HOME DASHBOARD DYNAMIC METRICS CONTROLLER
// ============================================================================

function updateHomeDashboardMetrics() {
  // 1. Syllabus Covered
  let overallTotal = 0;
  let overallCompleted = 0;
  let ongoingUnitTitle = 'Unit 04 Ongoing';

  if (typeof SYLLABUS_DATA !== 'undefined' && Array.isArray(SYLLABUS_DATA)) {
    SYLLABUS_DATA.forEach((unit, idx) => {
      const unitState = (typeof trackerState !== 'undefined' && trackerState[unit.id]) || {};
      const tLen = unit.topics ? unit.topics.length : 0;
      overallTotal += tLen;
      let unitCompleted = 0;

      if (unit.topics) {
        unit.topics.forEach((_, tIdx) => {
          const boxes = unitState[tIdx];
          if (boxes && (boxes[0] || boxes[1] || boxes[2])) {
            overallCompleted++;
            unitCompleted++;
          }
        });
      }

      if (unitCompleted > 0 && unitCompleted < tLen) {
        const uPrefix = unit.title ? unit.title.split(':')[0].trim() : ('Unit ' + (idx + 1));
        ongoingUnitTitle = `${uPrefix} Ongoing`;
      }
    });
  }

  const syllabusPct = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;
  const syllabusPctEl = document.getElementById('home-syllabus-pct');
  const syllabusBarEl = document.getElementById('home-syllabus-progress-bar');
  const syllabusSubEl = document.getElementById('home-syllabus-subtext');
  const syllabusTagEl = document.getElementById('home-metric-unit-tag');

  if (syllabusPctEl) syllabusPctEl.textContent = `${syllabusPct}%`;
  if (syllabusBarEl) syllabusBarEl.style.width = `${Math.min(100, Math.max(syllabusPct > 0 ? 5 : 0, syllabusPct))}%`;
  if (syllabusSubEl) syllabusSubEl.textContent = `${overallCompleted} of ${overallTotal} Subtopics Completed (${syllabusPct}%)`;
  if (syllabusTagEl) syllabusTagEl.textContent = overallCompleted === 0 ? 'Start Tracking' : ongoingUnitTitle;

  // 2. Paper Average
  let papers = [];
  try {
    if (typeof getCleanPapers === 'function') {
      papers = getCleanPapers();
    } else {
      const stored = localStorage.getItem('apex_past_papers');
      if (stored) papers = JSON.parse(stored);
    }
  } catch(e) {}

  const paperCount = Array.isArray(papers) ? papers.length : 0;
  let paperAvg = 78;
  if (paperCount > 0) {
    const totalScore = papers.reduce((sum, p) => sum + (Number(p.score) || 0), 0);
    paperAvg = Math.round(totalScore / paperCount);
  }

  const paperAvgEl = document.getElementById('home-paper-avg-val');
  const paperBarEl = document.getElementById('home-paper-progress-bar');
  const paperCountTagEl = document.getElementById('home-paper-count-tag');
  const paperSummaryEl = document.getElementById('home-paper-summary-text');

  if (paperAvgEl) paperAvgEl.textContent = `${paperAvg}%`;
  if (paperBarEl) paperBarEl.style.width = `${Math.min(100, Math.max(5, paperAvg))}%`;
  if (paperCountTagEl) paperCountTagEl.textContent = `${paperCount} Papers Logged`;
  if (paperSummaryEl) paperSummaryEl.textContent = `${paperCount} Papers • Avg: ${paperAvg}%`;

  // 3. Spaced Repetition SRS Retention
  let srsTopics = [];
  try {
    const raw = localStorage.getItem('apex_srs_active_topics');
    if (raw) srsTopics = JSON.parse(raw);
  } catch(e) {}

  const srsCount = Array.isArray(srsTopics) ? srsTopics.length : 0;
  let masteredCount = 0;
  if (srsCount > 0) {
    srsTopics.forEach(t => {
      const checks = t.checkedBoxes || [];
      if (checks.filter(Boolean).length >= 4) masteredCount++;
    });
  }
  const srsPct = srsCount > 0 ? Math.round((masteredCount / srsCount) * 100) : 100;
  const srsValEl = document.getElementById('home-srs-rate-val');
  const srsBarEl = document.getElementById('home-srs-progress-bar');
  const srsSummaryEl = document.getElementById('home-srs-summary-text');

  if (srsValEl) srsValEl.textContent = `${srsPct}%`;
  if (srsBarEl) srsBarEl.style.width = `${Math.min(100, Math.max(5, srsPct))}%`;
  if (srsSummaryEl) srsSummaryEl.textContent = srsCount > 0 ? `${srsCount} Active Tasks • ${masteredCount} Mastered` : 'Active Retention';
}


// ============================================================================
// STUDENT ONLINE EXAMS & INTERACTIVE TIMED ASSESSMENT ENGINE
// ============================================================================

const VIP_STUDENT_EMAIL = 'dg.edits65@gmail.com';

const SAMPLE_BIOLOGY_MCQS = [
  {
    q: 'ජීවීන්ගේ රසායනික පදනම යටතේ ජලයේ ඉහළ විශිෂ්ට තාප ධාරිතාව නිසා සෛලීය ක්‍රියාවලීන්ට ලැබෙන ප්‍රධාන වාසිය කුමක්ද?',
    options: [
      'තාපය වේගයෙන් පරිසරයට පිටකිරීමට උපකාරී වීම',
      'සෛලීය පරිසරයේ උෂ්ණත්වය ක්ෂණිකව උච්චාවචනය වීම වැළැක්වීම',
      'කාබනික අණු ජලයේ ද්‍රාව්‍යතාව ශූන්‍ය කිරීම',
      'සෛල පටල හරහා නිෂ්ක්‍රීය ප්‍රවාහනය වේගවත් කිරීම',
      'සෛල විද්‍යුත් විච්ඡේද්‍ය සාන්ද්‍රණය අසීමිතව වැඩිකිරීම'
    ],
    correct: 1
  },
  {
    q: 'ප්‍රාග්න්‍යෂ්ටික සෛල හා සූන්‍යෂ්ටික සෛල සංසන්දනය කිරීමේදී ප්‍රාග්න්‍යෂ්ටික සෛල වල පමණක් දක්නට ලැබෙන්නේ කුමක්ද?',
    options: [
      '70S රයිබොසෝම සහ පෙප්ටිඩොග්ලයිකැන් සහිත සෛල බිත්තිය',
      'ද්විත්ව පටලමය මයිටොකොන්ඩ්‍රියා',
      'න්‍යෂ්ටික පටලය සහ හිස්ටෝන සහිත රේඛීය DNA',
      'ගොල්ගි උපකරණය සහ අන්තඃප්ලාස්මීය ජාලිකාව',
      'ක්ෂුද්‍ර නාලිකා සහිත 9+2 සැකැස්ම'
    ],
    correct: 0
  },
  {
    q: 'ප්‍රභාසංස්ලේෂණයේ ආලෝක ප්‍රතික්‍රියාවේදී ප්‍රකාශ පද්ධති II මඟින් මුදාහරින ඉලෙක්ට්‍රෝන ප්‍රතිස්ථාපනය වන්නේ කාගෙන්ද?',
    options: [
      'කාබන් ඩයොක්සයිඩ් ඔක්සිහරණයෙන්',
      'ජල අණු ප්‍රභා විච්ඡේදනය වීමෙන්',
      'NADPH ඔක්සිකරණය වීමෙන්',
      'ග්ලූකෝස් වියෝජනය වීමෙන්',
      'ප්‍රකාශ පද්ධති I මඟින් පිටවන ඉලෙක්ට්‍රෝන වලින්'
    ],
    correct: 1
  },
  {
    q: 'මිනිසාගේ ආහාර ජීර්ණ පද්ධතියේ ආමාශයික යුෂයේ අඩංගු පෙප්සිනෝජන් එන්සයිමය සක්‍රීය පෙප්සින් බවට පත් කරන්නේ කුමක් මඟින්ද?',
    options: [
      'ට්‍රිප්සින්',
      'පිත ලවණ',
      'හයිඩ්‍රොක්ලෝරික් අම්ලය (HCl)',
      'සෝඩියම් බයිකාබනේට්',
      'Enterokinase'
    ],
    correct: 2
  },
  {
    q: 'මානව හෘද චක්‍රයේ කර්ණික සංකෝචනය (Atrial Systole) සිදු වන කාලය සාමාන්‍යයෙන් කොපමණද?',
    options: [
      'තත්පර 0.1',
      'තත්පර 0.3',
      'තත්පර 0.4',
      'තත්පර 0.8',
      'තත්පර 1.2'
    ],
    correct: 0
  },
  {
    q: 'ප්‍රතිසංයෝජිත DNA තාක්ෂණයේදී (Recombinant DNA Technology) DNA ඛණ්ඩ එකිනෙක බන්ධනය කිරීම සඳහා යොදා ගන්නා එන්සයිමය කුමක්ද?',
    options: [
      'DNA Pol I',
      'DNA Helicase',
      'DNA Ligase',
      'Restriction Endonuclease',
      'RNA Polymerase'
    ],
    correct: 2
  },
  {
    q: 'ශ්වසන වායු ප්‍රවාහනයේදී මිනිස් රුධිරයේ වැඩිම CO2 ප්‍රතිශතයක් පරිවහනය වන්නේ කුමන ආකාරයෙන්ද?',
    options: [
      'කාබොක්සිහිමොග්ලොබින් ලෙස',
      'ප්ලාස්මාවේ දියවූ වායුව ලෙස',
      'බයිකාබනේට් (HCO3-) අයන ලෙස',
      'කාබමිනෝහිමොග්ලොබින් ලෙස',
      'කාබොනික් අම්ල ස්ඵටික ලෙස'
    ],
    correct: 2
  },
  {
    q: 'ශාක හෝමෝන අතුරින් පත්‍ර හා ඵල පතනය ප්‍රේරණය කරන සහ බීජ සුප්තතාව ඇති කරන හෝමෝනය කුමක්ද?',
    options: [
      'ඔක්සීන්',
      'ජිබරලීන්',
      'සයිටොකයිනීන්',
      'ඇබ්සිසික් අම්ලය (ABA)',
      'එතිලීන්'
    ],
    correct: 3
  },
  {
    q: 'මිනිසාගේ වෘක්කාණුවක (Nephron) ග්ලූකෝස් සහ ඇමයිනෝ අම්ල 100% ක්ම පාහේ යළි ප්‍රතිශෝෂණය වන්නේ කුමන කොටසේදීද?',
    options: [
      'සමීපස්ථ සංවලිත නාලිකාව (PCT)',
      'හෙන්ලේ පුඩුවේ අවරෝහණ බාහුව',
      'හෙන්ලේ පුඩුවේ ආරෝහණ බාහුව',
      'දුරස්ථ සංවලිත නාලිකාව (DCT)',
      'සංග්‍රාහක නාලය'
    ],
    correct: 0
  },
  {
    q: 'නයිට්‍රජන් චක්‍රයේදී ඇමෝනියම් අයන නයිට්‍රයිට් බවට ඔක්සිකරණය කරන බැක්ටීරියාව කුමක්ද?',
    options: [
      'Nitrobacter',
      'Nitrosomonas',
      'Rhizobium',
      'Azotobacter',
      'Pseudomonas denitrificans'
    ],
    correct: 1
  }
];

let examActivePlayer = {
  exam: null,
  questions: [],
  answers: [],
  currentIndex: 0,
  timerInterval: null,
  secondsRemaining: 45 * 60,
  totalSeconds: 45 * 60,
  startTime: null
};

function renderStudentOnlineExams() {
  const vipBannerEl = document.getElementById('student-exams-vip-banner');
  const gridEl = document.getElementById('student-exams-list-grid');

  let currentEmail = VIP_STUDENT_EMAIL;
  try {
    const studentUser = localStorage.getItem('apex_student_user') || localStorage.getItem('currentStudent');
    if (studentUser) {
      const parsed = JSON.parse(studentUser);
      if (parsed.email) currentEmail = parsed.email;
    }
  } catch(e) {}

  if (vipBannerEl) {
    vipBannerEl.innerHTML = `
      <div class="exam-vip-card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08)); border: 2px solid #10b981; border-radius: 18px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:52px; height:52px; border-radius:14px; background:linear-gradient(135deg, #10b981, #059669); color:#fff; display:flex; align-items:center; justify-content:center; font-size:24px; box-shadow:0 8px 18px rgba(16,185,129,0.3);">
            <i class="fa-solid fa-crown"></i>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="margin:0; font-size:1.15rem; color:#064e3b; font-weight:800;">VIP Student Access Activated (විශේෂ ප්‍රවේශය)</h3>
              <span style="background:#10b981; color:#fff; font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:999px;">${escapeHTML(currentEmail)}</span>
            </div>
            <p style="margin:4px 0 0; color:#047857; font-size:0.88rem;">
              ඔබට සියලුම National Online Mock Exams සහ Model Papers සඳහා සම්පූර්ණ ප්‍රවේශය (All Island Rank Prediction සමඟ) විවෘතව ඇත!
            </p>
          </div>
        </div>
        <span style="background:rgba(16,185,129,0.2); color:#047857; border:1px solid #10b981; padding:6px 14px; border-radius:999px; font-weight:700; font-size:0.85rem;">
          <i class="fa-solid fa-circle-check"></i> Unlimited VIP Attempts
        </span>
      </div>
    `;
  }

  if (!gridEl) return;

  let exams = [];
  try {
    const raw = localStorage.getItem('apex_online_exams_v1');
    if (raw) exams = JSON.parse(raw);
  } catch(e) {}

  if (!exams || exams.length === 0) {
    exams = [
      {
        id: 'exam-2027-mock-1',
        title: '2027/2028 A/L Monthly Assessment Test (MCQ 50)',
        batch: '2027',
        type: 'mcq',
        duration: 45,
        questionsCount: 50,
        units: 'Unit 01 (Chemical Basis) & Unit 02 (Cell Biology)',
        desc: 'Real-time 45 minute exam timer. Complete OMR format with instant marks breakdown and ranking prediction.',
        status: 'active'
      },
      {
        id: 'exam-island-structured-1',
        title: 'Islandwide Structured Essay Challenge',
        batch: 'All',
        type: 'structured',
        duration: 60,
        questionsCount: 4,
        units: 'Unit 03 (Evolution & Diversity) & Unit 04 (Plant Form & Function)',
        desc: 'Submit handwritten structured essay papers. Graded by experienced teachers with Live Zoom discussion.',
        status: 'scheduled'
      },
      {
        id: 'exam-unit-5-genetics-model',
        title: '2027 A/L Unit 05 (Animal Form & Function) Full Model Paper',
        batch: '2027',
        type: 'mcq',
        duration: 90,
        questionsCount: 50,
        units: 'Unit 05: Human Digestive, Respiratory & Circulatory Systems',
        desc: 'High-yield examination testing key past paper keywords, marking scheme precision, and time management.',
        status: 'active'
      }
    ];
  }

  gridEl.innerHTML = exams.filter(e => e.status !== 'draft').map(exam => {
    const isLive = exam.status === 'active';
    const isScheduled = exam.status === 'scheduled';
    const tagClass = isLive ? 'live' : 'upcoming';
    const tagLabel = isLive ? 'AVAILABLE NOW' : 'SCHEDULED';

    return `
      <div class="exam-item-card">
        <div class="exam-status-tag ${tagClass}">${tagLabel}</div>
        <h3>${escapeHTML(exam.title)}</h3>
        <p>${escapeHTML(exam.desc || '')}</p>
        <div class="exam-spec-grid">
          <div><strong>Questions:</strong> ${exam.questionsCount || 50} ${exam.type === 'structured' ? 'Structured' : 'MCQs'}</div>
          <div><strong>Duration:</strong> ${exam.duration || 45} Mins</div>
          <div><strong>Negative Mark:</strong> No</div>
          <div><strong>Format:</strong> ${exam.type === 'structured' ? 'Written Submission' : 'Online OMR'}</div>
        </div>
        <button class="btn-start-exam ${isLive ? '' : 'secondary'}" onclick="openStudentExamPlayer('${exam.id}')">
          <i class="fa-solid ${isLive ? 'fa-play' : 'fa-bell'}"></i> ${isLive ? 'Start Assessment Test Now' : 'Set WhatsApp Reminder'}
        </button>
      </div>
    `;
  }).join('');
}

function openStudentExamPlayer(examId) {
  let exams = [];
  try {
    const raw = localStorage.getItem('apex_online_exams_v1');
    if (raw) exams = JSON.parse(raw);
  } catch(e) {}

  let exam = exams.find(e => e.id === examId);
  if (!exam) {
    exam = {
      id: examId || 'exam-default',
      title: '2027/2028 A/L Monthly Assessment Test (MCQ 50)',
      batch: '2027',
      duration: 45,
      questionsCount: 50,
      units: 'Unit 01 & Unit 02'
    };
  }

  if (exam.status === 'scheduled') {
    showToast('Reminder set! We will notify you before the live discussion.');
    return;
  }

  // Build 50 questions from question bank
  const questions = [];
  const qCount = exam.questionsCount || 50;
  for (let i = 0; i < qCount; i++) {
    const base = SAMPLE_BIOLOGY_MCQS[i % SAMPLE_BIOLOGY_MCQS.length];
    questions.push({
      id: i + 1,
      q: `(${i + 1}) ${base.q}`,
      options: base.options,
      correct: base.correct
    });
  }

  examActivePlayer = {
    exam: exam,
    questions: questions,
    answers: new Array(questions.length).fill(null),
    currentIndex: 0,
    secondsRemaining: (exam.duration || 45) * 60,
    totalSeconds: (exam.duration || 45) * 60,
    startTime: Date.now()
  };

  const modal = document.getElementById('modal-student-exam-player');
  const titleEl = document.getElementById('player-exam-title');
  const batchEl = document.getElementById('player-exam-batch');
  const overlay = document.getElementById('player-result-overlay');

  if (titleEl) titleEl.textContent = exam.title;
  if (batchEl) batchEl.textContent = `${exam.batch || '2027'} A/L Biology`;
  if (overlay) overlay.style.display = 'none';

  renderPlayerCurrentQuestion();
  renderPlayerPalette();
  startPlayerTimer();

  if (modal) modal.style.display = 'flex';
}

function startPlayerTimer() {
  if (examActivePlayer.timerInterval) {
    clearInterval(examActivePlayer.timerInterval);
  }

  updateTimerDisplay();

  examActivePlayer.timerInterval = setInterval(() => {
    examActivePlayer.secondsRemaining--;

    if (examActivePlayer.secondsRemaining <= 0) {
      clearInterval(examActivePlayer.timerInterval);
      showToast('⏱️ කාලය අවසන් විය! ඔබගේ පත්‍රය ස්වයංක්‍රීයව ලකුණු කෙරේ.');
      gradeAndSubmitExam();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const displayEl = document.getElementById('player-timer-display');
  const boxEl = document.getElementById('player-timer-box');
  if (!displayEl) return;

  const mins = Math.floor(examActivePlayer.secondsRemaining / 60);
  const secs = examActivePlayer.secondsRemaining % 60;
  displayEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (examActivePlayer.secondsRemaining < 300) {
    if (boxEl) boxEl.classList.add('warning');
  } else {
    if (boxEl) boxEl.classList.remove('warning');
  }
}

function renderPlayerCurrentQuestion() {
  const container = document.getElementById('player-question-container');
  const prevBtn = document.getElementById('btn-player-prev');
  const nextBtn = document.getElementById('btn-player-next');
  if (!container) return;

  const q = examActivePlayer.questions[examActivePlayer.currentIndex];
  if (!q) return;

  const currentAnswer = examActivePlayer.answers[examActivePlayer.currentIndex];

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <span style="background:#ecfdf5; color:#047857; font-size:0.82rem; font-weight:800; padding:4px 12px; border-radius:999px;">
        QUESTION ${examActivePlayer.currentIndex + 1} OF ${examActivePlayer.questions.length}
      </span>
      <span style="font-size:0.8rem; color:#64748b;">G.C.E. A/L Bio Assessment Test</span>
    </div>

    <h4 style="font-size:1.1rem; color:#0f172a; line-height:1.55; margin:0 0 20px; font-weight:700;">
      ${escapeHTML(q.q)}
    </h4>

    <div class="player-choices-list">
      ${q.options.map((opt, optIdx) => {
        const isSelected = currentAnswer === optIdx;
        return `
          <label class="player-choice-label ${isSelected ? 'selected' : ''}" onclick="selectPlayerAnswer(${optIdx})">
            <input type="radio" name="opt-choice" class="player-choice-radio" ${isSelected ? 'checked' : ''}>
            <div>
              <strong style="margin-right:6px; color:#059669;">(${optIdx + 1})</strong>
              ${escapeHTML(opt)}
            </div>
          </label>
        `;
      }).join('')}
    </div>
  `;

  if (prevBtn) prevBtn.disabled = examActivePlayer.currentIndex === 0;
  if (nextBtn) nextBtn.disabled = examActivePlayer.currentIndex === examActivePlayer.questions.length - 1;

  updatePaletteHighlight();
}

function selectPlayerAnswer(optionIdx) {
  examActivePlayer.answers[examActivePlayer.currentIndex] = optionIdx;
  renderPlayerCurrentQuestion();
  renderPlayerPalette();
}

function clearCurrentQuestionAnswer() {
  examActivePlayer.answers[examActivePlayer.currentIndex] = null;
  renderPlayerCurrentQuestion();
  renderPlayerPalette();
}

function navPlayerQuestion(direction) {
  const newIndex = examActivePlayer.currentIndex + direction;
  if (newIndex >= 0 && newIndex < examActivePlayer.questions.length) {
    examActivePlayer.currentIndex = newIndex;
    renderPlayerCurrentQuestion();
  }
}

function jumpToPlayerQuestion(qIndex) {
  if (qIndex >= 0 && qIndex < examActivePlayer.questions.length) {
    examActivePlayer.currentIndex = qIndex;
    renderPlayerCurrentQuestion();
  }
}

function renderPlayerPalette() {
  const paletteEl = document.getElementById('player-palette-grid');
  const countEl = document.getElementById('player-progress-count');
  if (!paletteEl) return;

  const total = examActivePlayer.questions.length;
  const answeredCount = examActivePlayer.answers.filter(a => a !== null).length;

  if (countEl) countEl.textContent = `${answeredCount} / ${total} Answered`;

  paletteEl.innerHTML = examActivePlayer.questions.map((_, idx) => {
    const isAnswered = examActivePlayer.answers[idx] !== null;
    const isCurrent = examActivePlayer.currentIndex === idx;
    let cls = 'player-palette-btn';
    if (isAnswered) cls += ' answered';
    if (isCurrent) cls += ' current';

    return `
      <button type="button" class="${cls}" onclick="jumpToPlayerQuestion(${idx})">
        ${idx + 1}
      </button>
    `;
  }).join('');
}

function updatePaletteHighlight() {
  const buttons = document.querySelectorAll('.player-palette-btn');
  buttons.forEach((btn, idx) => {
    const isCurrent = examActivePlayer.currentIndex === idx;
    const isAnswered = examActivePlayer.answers[idx] !== null;
    btn.classList.toggle('current', isCurrent);
    btn.classList.toggle('answered', isAnswered);
  });
}

function confirmExitExamPlayer() {
  if (confirm('Are you sure you want to exit? Your progress in this test will be lost.')) {
    closeStudentExamPlayer();
  }
}

function closeStudentExamPlayer() {
  if (examActivePlayer.timerInterval) {
    clearInterval(examActivePlayer.timerInterval);
    examActivePlayer.timerInterval = null;
  }
  const modal = document.getElementById('modal-student-exam-player');
  if (modal) modal.style.display = 'none';
}

function confirmSubmitExam() {
  const total = examActivePlayer.questions.length;
  const answered = examActivePlayer.answers.filter(a => a !== null).length;
  const unanswered = total - answered;

  const msg = unanswered > 0
    ? `You have answered ${answered} of ${total} questions (${unanswered} unanswered). Do you want to submit your paper now?`
    : 'All 50 questions answered! Are you ready to submit your exam?';

  if (confirm(msg)) {
    gradeAndSubmitExam();
  }
}

function gradeAndSubmitExam() {
  if (examActivePlayer.timerInterval) {
    clearInterval(examActivePlayer.timerInterval);
    examActivePlayer.timerInterval = null;
  }

  let correctCount = 0;
  examActivePlayer.questions.forEach((q, idx) => {
    if (examActivePlayer.answers[idx] === q.correct) {
      correctCount++;
    }
  });

  const total = examActivePlayer.questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const wrongCount = total - correctCount;

  let grade = 'F';
  if (percentage >= 75) grade = 'A (Distinction)';
  else if (percentage >= 65) grade = 'B (Very Good)';
  else if (percentage >= 55) grade = 'C (Credit)';
  else if (percentage >= 35) grade = 'S (Pass)';

  const timeUsedSecs = examActivePlayer.totalSeconds - examActivePlayer.secondsRemaining;
  const minsUsed = Math.floor(timeUsedSecs / 60);
  const secsUsed = timeUsedSecs % 60;
  const timeSpentStr = `${minsUsed}m ${secsUsed}s`;

  // Update Result Overlay UI
  const scoreEl = document.getElementById('res-score-display');
  const gradeEl = document.getElementById('res-grade-display');
  const correctEl = document.getElementById('res-correct-count');
  const wrongEl = document.getElementById('res-wrong-count');
  const timeEl = document.getElementById('res-time-spent');
  const overlay = document.getElementById('player-result-overlay');

  if (scoreEl) scoreEl.textContent = `${correctCount} / ${total}`;
  if (gradeEl) gradeEl.textContent = `${percentage}% (${grade.charAt(0)})`;
  if (correctEl) correctEl.textContent = correctCount;
  if (wrongEl) wrongEl.textContent = wrongCount;
  if (timeEl) timeEl.textContent = timeSpentStr;

  if (overlay) overlay.style.display = 'flex';

  // Save submission to localStorage
  try {
    let submissions = [];
    const raw = localStorage.getItem('apex_exam_submissions_v1');
    if (raw) submissions = JSON.parse(raw);

    const newSub = {
      id: 'sub-' + Date.now(),
      submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      studentName: 'Naveen Lakshan',
      studentEmail: VIP_STUDENT_EMAIL,
      examTitle: examActivePlayer.exam.title,
      score: correctCount,
      totalQuestions: total,
      percentage: percentage,
      grade: grade,
      timeSpent: timeSpentStr,
      isVip: true
    };

    submissions.unshift(newSub);
    localStorage.setItem('apex_exam_submissions_v1', JSON.stringify(submissions));

    // Also auto-record into Past Paper Tracker papers so Home metrics & Paper Tracker update
    const paperRecord = {
      id: 'mock-exam-' + Date.now(),
      subject: 'Biology',
      year: '2027 Mock',
      paperType: 'Full Paper',
      score: percentage,
      target: 75,
      date: new Date().toISOString().split('T')[0],
      reasons: ['exam_practice']
    };

    if (typeof getCleanPapers === 'function' && typeof saveCleanPapers === 'function') {
      const papers = getCleanPapers();
      papers.unshift(paperRecord);
      saveCleanPapers(papers);
    } else {
      let stored = [];
      const s = localStorage.getItem('apex_past_papers');
      if (s) stored = JSON.parse(s);
      stored.unshift(paperRecord);
      localStorage.setItem('apex_past_papers', JSON.stringify(stored));
    }
  } catch(e) {
    console.error('Error saving exam submission:', e);
  }

  updateHomeDashboardMetrics();
  showToast(`🎉 Exam completed! Your score: ${correctCount}/${total} (${percentage}%)`);
}

function viewPaperTrackerFromExam() {
  closeStudentExamPlayer();
  switchDashboardTab('tab-papertracker');
}


// ============================================================================
// REAL-TIME STUDENT ONLINE HEARTBEAT MONITORING
// ============================================================================

function sendOnlineHeartbeat() {
  try {
    let heartbeats = {};
    const raw = localStorage.getItem('apex_online_heartbeats');
    if (raw) heartbeats = JSON.parse(raw);

    let studentUser = {
      name: 'Naveen Lakshan',
      email: 'dg.edits65@gmail.com',
      school: 'Royal College',
      district: 'Colombo',
      year: '2027'
    };

    const storedUser = localStorage.getItem('apex_student_user') || localStorage.getItem('currentStudent');
    if (storedUser) {
      try { Object.assign(studentUser, JSON.parse(storedUser)); } catch(e) {}
    }

    const activeTabEl = document.querySelector('.dash-sidebar .sidebar-link-btn.active');
    const currentTabName = activeTabEl ? (activeTabEl.querySelector('span')?.textContent || 'Home') : 'Home';

    heartbeats[studentUser.email] = {
      name: studentUser.name || 'Student',
      email: studentUser.email,
      school: studentUser.school || 'Royal College',
      district: studentUser.district || 'Colombo',
      year: studentUser.year || '2027',
      currentPage: currentTabName,
      lastSeen: Date.now()
    };

    localStorage.setItem('apex_online_heartbeats', JSON.stringify(heartbeats));
  } catch (e) {}
}

setInterval(sendOnlineHeartbeat, 12000);
window.addEventListener('click', () => { setTimeout(sendOnlineHeartbeat, 200); }, { passive: true });


// ============================================================================
// FOCUS STUDIO (POMODORO TIMER, DEEP WORK & AMBIENT SOUNDSCAPE)
// ============================================================================

const focusStudioState = {
  mode: 'pomodoro', // 'pomodoro' | 'shortBreak' | 'longBreak' | 'openFocus'
  focusDurationMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  secondsRemaining: 25 * 60,
  totalSeconds: 25 * 60,
  isRunning: false,
  intervalId: null,
  currentSession: 1,
  totalSessions: 4,
  todayFocusMinutes: 0,
  pomodorosDone: 0,
  dayStreak: 1,
  goals: [
    { id: 'g1', text: 'Unit 02 Cell Structure Revision', done: false },
    { id: 'g2', text: 'Complete 25 Biology MCQs', done: false }
  ],
  ambientSound: 'none',
  audioCtx: null,
  soundOsc: null,
  isFullFocus: false
};

function renderFocusStudio() {
  updateFocusTimerDisplay();
  renderFocusGoals();
  renderFocusSessionDots();
  renderFocusStats();
}

function setFocusMode(mode) {
  if (focusStudioState.isRunning) {
    if (!confirm('A focus session is currently running. Switch mode and reset timer?')) return;
    pauseFocusTimer();
  }

  focusStudioState.mode = mode;

  document.querySelectorAll('.btn-focus-mode').forEach(btn => {
    btn.classList.toggle('active', btn.id === `btn-mode-${mode.toLowerCase()}`);
  });

  const labelEl = document.getElementById('focus-session-type-label');
  let targetMins = 25;

  if (mode === 'pomodoro') {
    targetMins = focusStudioState.focusDurationMinutes;
    if (labelEl) labelEl.textContent = 'FOCUS SESSION';
  } else if (mode === 'shortBreak') {
    targetMins = focusStudioState.shortBreakMinutes;
    if (labelEl) labelEl.textContent = 'SHORT BREAK';
  } else if (mode === 'longBreak') {
    targetMins = focusStudioState.longBreakMinutes;
    if (labelEl) labelEl.textContent = 'LONG BREAK';
  } else if (mode === 'openFocus') {
    targetMins = 0;
    if (labelEl) labelEl.textContent = 'OPEN FOCUS (STOPWATCH)';
  }

  focusStudioState.totalSeconds = targetMins * 60;
  focusStudioState.secondsRemaining = mode === 'openFocus' ? 0 : targetMins * 60;

  updateFocusTimerDisplay();
}

function toggleFocusTimerPlay() {
  if (focusStudioState.isRunning) {
    pauseFocusTimer();
  } else {
    startFocusTimer();
  }
}

function startFocusTimer() {
  if (focusStudioState.isRunning) return;

  focusStudioState.isRunning = true;
  updatePlayButtonUI(true);

  if (focusStudioState.intervalId) clearInterval(focusStudioState.intervalId);

  focusStudioState.intervalId = setInterval(() => {
    if (focusStudioState.mode === 'openFocus') {
      focusStudioState.secondsRemaining++;
    } else {
      focusStudioState.secondsRemaining--;

      if (focusStudioState.secondsRemaining <= 0) {
        clearInterval(focusStudioState.intervalId);
        focusStudioState.isRunning = false;
        onFocusSessionComplete();
        return;
      }
    }

    updateFocusTimerDisplay();
  }, 1000);

  updateFocusPiP(true);
}

function pauseFocusTimer() {
  if (focusStudioState.intervalId) {
    clearInterval(focusStudioState.intervalId);
    focusStudioState.intervalId = null;
  }
  focusStudioState.isRunning = false;
  updatePlayButtonUI(false);
  updateFocusPiP(true);
}

function resetFocusTimer() {
  pauseFocusTimer();
  setFocusMode(focusStudioState.mode);
}

function stopFocusTimer() {
  pauseFocusTimer();
  setFocusMode('pomodoro');
  updateFocusPiP(false);
}

function skipFocusSession() {
  pauseFocusTimer();
  if (focusStudioState.mode === 'pomodoro') {
    focusStudioState.pomodorosDone++;
    focusStudioState.todayFocusMinutes += focusStudioState.focusDurationMinutes;
    if (focusStudioState.currentSession >= 4) {
      focusStudioState.currentSession = 1;
      setFocusMode('longBreak');
    } else {
      focusStudioState.currentSession++;
      setFocusMode('shortBreak');
    }
  } else {
    setFocusMode('pomodoro');
  }
  renderFocusSessionDots();
  renderFocusStats();
}

function onFocusSessionComplete() {
  playFocusChime();
  updatePlayButtonUI(false);

  if (focusStudioState.mode === 'pomodoro') {
    focusStudioState.pomodorosDone++;
    focusStudioState.todayFocusMinutes += focusStudioState.focusDurationMinutes;
    showToast('🎉 Focus Session Complete! Time for a well-deserved break.');

    if (focusStudioState.currentSession >= 4) {
      focusStudioState.currentSession = 1;
      setFocusMode('longBreak');
    } else {
      focusStudioState.currentSession++;
      setFocusMode('shortBreak');
    }
  } else {
    showToast('☕ Break finished! Ready to focus again.');
    setFocusMode('pomodoro');
  }

  renderFocusSessionDots();
  renderFocusStats();
  updateFocusPiP(false);
}

function updatePlayButtonUI(isPlaying) {
  const btn = document.getElementById('btn-focus-play-pause');
  const icon = document.getElementById('focus-play-icon');
  const text = document.getElementById('focus-play-text');
  const pipIcon = document.getElementById('pip-play-icon');

  if (icon) icon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  if (text) text.textContent = isPlaying ? 'Pause' : 'Start';
  if (pipIcon) pipIcon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
}

function updateFocusTimerDisplay() {
  const timerEl = document.getElementById('focus-digital-timer');
  const pipTimerEl = document.getElementById('pip-timer-display');
  const videoChipTextEl = document.getElementById('video-focus-timer-text');
  const pipLabelEl = document.getElementById('pip-mode-label');

  const totalSecs = Math.max(0, focusStudioState.secondsRemaining);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (timerEl) timerEl.textContent = timeStr;
  if (pipTimerEl) pipTimerEl.textContent = timeStr;
  if (videoChipTextEl) videoChipTextEl.textContent = timeStr;

  if (pipLabelEl) {
    pipLabelEl.textContent = focusStudioState.mode === 'pomodoro' ? 'Focusing' : 'Break Time';
  }

  updateFocusPiP(focusStudioState.isRunning);
}

function updateFocusPiP(show) {
  const pipEl = document.getElementById('floating-focus-pip');
  const videoChipEl = document.getElementById('video-focus-mini-chip');

  // Check if current tab is tab-focusstudio
  const activeTab = document.querySelector('.dash-tab-pane.active')?.id;
  const shouldShowFloating = show && activeTab !== 'tab-focusstudio';

  if (pipEl) {
    pipEl.style.display = shouldShowFloating ? 'flex' : 'none';
  }

  if (videoChipEl) {
    videoChipEl.style.display = show ? 'inline-flex' : 'none';
  }
}

function hideFocusPiP() {
  const pipEl = document.getElementById('floating-focus-pip');
  if (pipEl) pipEl.style.display = 'none';
}

function renderFocusSessionDots() {
  const container = document.getElementById('focus-session-dots');
  const textEl = document.getElementById('focus-session-counter')?.querySelector('span');

  if (textEl) textEl.textContent = `Session ${focusStudioState.currentSession} of ${focusStudioState.totalSessions}`;
  if (!container) return;

  container.innerHTML = '';
  for (let i = 1; i <= focusStudioState.totalSessions; i++) {
    const dot = document.createElement('span');
    dot.className = `session-dot${i <= focusStudioState.currentSession ? ' active' : ''}`;
    container.appendChild(dot);
  }
}

function renderFocusStats() {
  const timeEl = document.getElementById('focus-today-time-val');
  const pomsEl = document.getElementById('focus-pomodoros-done-val');
  const streakEl = document.getElementById('focus-day-streak-val');

  if (timeEl) timeEl.textContent = `${focusStudioState.todayFocusMinutes}m`;
  if (pomsEl) pomsEl.textContent = focusStudioState.pomodorosDone;
  if (streakEl) streakEl.textContent = focusStudioState.dayStreak;
}

function renderFocusGoals() {
  const listEl = document.getElementById('focus-goals-list');
  const countEl = document.getElementById('focus-goals-count');
  if (!listEl) return;

  const doneCount = focusStudioState.goals.filter(g => g.done).length;
  if (countEl) countEl.textContent = `${doneCount} / ${focusStudioState.goals.length}`;

  if (focusStudioState.goals.length === 0) {
    listEl.innerHTML = '<div style="color:#94a3b8; font-size:0.85rem; text-align:center; padding:10px;">No goals added yet. Add one below!</div>';
    return;
  }

  listEl.innerHTML = focusStudioState.goals.map(g => `
    <div class="focus-goal-item ${g.done ? 'done' : ''}">
      <label style="display:flex; align-items:center; gap:8px; cursor:pointer; flex:1;">
        <input type="checkbox" ${g.done ? 'checked' : ''} onchange="toggleFocusGoal('${g.id}')">
        <span>${escapeHTML(g.text)}</span>
      </label>
      <button type="button" onclick="deleteFocusGoal('${g.id}')" style="background:none; border:none; color:#94a3b8; cursor:pointer;">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `).join('');
}

function addFocusGoal() {
  const input = document.getElementById('focus-new-goal-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  focusStudioState.goals.push({
    id: 'g-' + Date.now(),
    text: text,
    done: false
  });

  input.value = '';
  renderFocusGoals();
}

function toggleFocusGoal(goalId) {
  const goal = focusStudioState.goals.find(g => g.id === goalId);
  if (goal) {
    goal.done = !goal.done;
    renderFocusGoals();
  }
}

function deleteFocusGoal(goalId) {
  focusStudioState.goals = focusStudioState.goals.filter(g => g.id !== goalId);
  renderFocusGoals();
}

function setAmbientSound(soundType) {
  focusStudioState.ambientSound = soundType;

  document.querySelectorAll('.btn-ambient-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-sound') === soundType);
  });

  if (focusStudioState.soundOsc) {
    try { focusStudioState.soundOsc.stop(); } catch(e) {}
    focusStudioState.soundOsc = null;
  }

  if (soundType === 'none') return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!focusStudioState.audioCtx) {
      focusStudioState.audioCtx = new AudioContext();
    }
    const ctx = focusStudioState.audioCtx;
    if (ctx.state === 'suspended') ctx.resume();

    // Generate soothing low white/pink noise or alpha wave frequency
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (soundType === 'alpha') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(10, ctx.currentTime); // 10 Hz Alpha state
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(soundType === 'rain' ? 80 : 55, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    focusStudioState.soundOsc = osc;
  } catch(e) {
    console.error('Ambient audio error:', e);
  }
}

function playFocusChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.3);
  } catch(e) {}
}

function toggleFullFocusMode() {
  const container = document.getElementById('tab-focusstudio');
  const btnText = document.getElementById('full-focus-btn-text');
  if (!container) return;

  focusStudioState.isFullFocus = !focusStudioState.isFullFocus;

  if (focusStudioState.isFullFocus) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    if (btnText) btnText.textContent = 'Exit Full Focus';
    showToast('🎯 Full Focus Mode activated. No distractions!');
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (btnText) btnText.textContent = 'Full Focus Mode';
  }
}

function toggleFocusSettingsModal() {
  const newFocus = prompt('Enter Focus Duration in minutes (e.g. 25, 45, 50):', focusStudioState.focusDurationMinutes);
  if (newFocus && !isNaN(newFocus) && Number(newFocus) > 0) {
    focusStudioState.focusDurationMinutes = parseInt(newFocus, 10);
    const newBreak = prompt('Enter Short Break Duration in minutes (e.g. 5, 10):', focusStudioState.shortBreakMinutes);
    if (newBreak && !isNaN(newBreak) && Number(newBreak) > 0) {
      focusStudioState.shortBreakMinutes = parseInt(newBreak, 10);
    }
    setFocusMode('pomodoro');
    showToast(`⏱️ Timers set: ${focusStudioState.focusDurationMinutes}m Focus / ${focusStudioState.shortBreakMinutes}m Break`);
  }
}


// ============================================================================
// APK & DESKTOP APP DOWNLOAD VIEW CONTROLLER
// ============================================================================

function downloadApkDirectly() {
  const link = document.createElement('a');
  link.href = '/ApexBiology_v2.4.apk';
  link.download = 'ApexBiology_v2.4.apk';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Downloading Apex Biology Android APK v2.4.0 (18.4 MB)...');
}

// ============================================================================

function showApkDownloadView() {
  document.getElementById('view-landing')?.classList.remove('active');
  document.getElementById('view-dashboard')?.classList.remove('active');
  const apkView = document.getElementById('view-apk-download');
  if (apkView) {
    apkView.style.display = 'block';
    apkView.classList.add('active');
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideApkDownloadView() {
  const apkView = document.getElementById('view-apk-download');
  if (apkView) {
    apkView.style.display = 'none';
    apkView.classList.remove('active');
  }
  showLandingView();
}

function trackApkDownload(platform) {
  downloadApkDirectly();
}

let deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
});

function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('🎉 Apex Biology App installed to your Desktop successfully!');
      }
      deferredPwaPrompt = null;
    });
  } else {
    // Open modern Desktop App Install Modal (YouTube style)
    openModal('modal-desktop-app-install');
  }
}
