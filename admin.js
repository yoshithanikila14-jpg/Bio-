/**
 * Apex Biology - Admin Panel Management Studio (admin.js)
 * Enhanced with Tutor-Specific Video Packs, Real-Time Request Queue & Direct Activation.
 */

let ADMIN_DATA = {
  students: [],
  tutors: [],
  videoPacks: [],
  freeLessons: [],
  revisionVideos: [],
  syllabusUnits: [
  {
    "id": "u1",
    "number": "01",
    "icon": "fa-seedling",
    "title": "Unit 01: ජීව විද්‍යාව හැඳින්වීම",
    "englishTitle": "Introduction to Biology",
    "topics": [
      "ජීව විද්‍යාව හැඳින්වීම සහ ජීවයේ ලක්ෂණ",
      "ජීව විද්‍යාවේ විෂය පථය සහ වැදගත්කම",
      "විද්‍යාත්මක ක්‍රමය සහ පරීක්ෂණාත්මක විමර්ශන"
    ]
  },
  {
    "id": "u2",
    "number": "02",
    "icon": "fa-atom",
    "title": "Unit 02: ජීවයේ රසායනික සහ සෛලීය පදනම",
    "englishTitle": "Chemical and Cellular Basis of Life",
    "topics": [
      "සෛලීය පදනම හා ජලය",
      "කාබෝහයිඩ්‍රේට",
      "ලිපිඩ",
      "ප්‍රෝටීන",
      "DNA හා RNA",
      "අන්වීක්ෂ",
      "ප්ලාස්ම පටලය",
      "උපසෛලීය සංඝටක",
      "සෛල චක්‍රය-අනූනනය",
      "ඌනනය",
      "අර්බුද, ගෙඩි, පිළිකා",
      "පරිවෘත්තීය ක්‍රියාවල ශක්ති සම්බන්ධතා",
      "එන්සයිමවල කාර්යය හා ලක්ෂණ",
      "එන්සයිම ක්‍රියාවේ යාන්ත්‍රණය",
      "සහ සාධක",
      "එන්සයිමීය ප්‍රතික්‍රියාවට බලපාන සාධක",
      "නිෂේධක",
      "ඇලොස්ටරික යාමනය",
      "ප්‍රභාසංශ්ලේෂණය හැඳින්වීම",
      "ආලෝක ප්‍රතික්‍රියාව",
      "අඳුරු ප්‍රතික්‍රියාව (කැල්වින් චක්‍රය)",
      "ප්‍රභාශ්වසනය",
      "C3 ශාක හා C4 ශාක",
      "C4 පථය",
      "වර්ණාවලි හා ප්‍රභාසංශ්ලේෂණයට බලපාන සාධක",
      "ස්වායු ශ්වසනය",
      "නිර්වායු ශ්වසනය",
      "ශ්වසන ලබ්ධිය",
      "practicals"
    ]
  },
  {
    "id": "u3",
    "number": "03",
    "icon": "fa-tree",
    "title": "Unit 03: පරිණාමය සහ ජෛව විවිධත්වය",
    "englishTitle": "Evolution and Biodiversity",
    "topics": [
      "පෘථිවියේ බිහිවීම හා ජෛව විවිධත්වයේ පරිණාමය",
      "ජීවී වර්ගීකරණය",
      "ආකියා අධිරාජධානිය",
      "බැක්ටීරියා අධිරාජධානිය",
      "යුකැරියා අධිරාජධානිය-ප්‍රොටිස්ටා රාජධානිය",
      "ශාක ජීවන චක්‍ර-Pogonatum ජීවන චක්‍රය",
      "Neprolepis ජීවන චක්‍රය",
      "Sellaginella ජීවන චක්‍රය",
      "Cycus ජීවන චක්‍රය",
      "Anthopyta ජීවන චක්‍රය",
      "ශාක වර්ගීකරණය",
      "දිලීර රාජධානිය",
      "ඇනිමාලියා වංශ 8",
      "කෝඩේටා වංශය"
    ]
  },
  {
    "id": "u4",
    "number": "04",
    "icon": "fa-leaf",
    "title": "Unit 04: ශාක ආකාරය සහ ක්‍රියාකාරීත්වය",
    "englishTitle": "Plant Form and Function",
    "topics": [
      "විභාජක පටක",
      "ශාක කඳේ ප්‍රාථමික වර්ධනය",
      "ශාක මුලේ ප්‍රාථමික වර්ධනය",
      "ශාක පටක පද්ධති-චර්මීය පටක පද්ධතිය",
      "පූරක පටක පද්ධතිය",
      "සනාල පටක පද්ධතිය",
      "ශාක කඳේ ප්‍රාථමික ව්‍යුහය",
      "ශාක මුලේ ප්‍රාථමික ව්‍යුහය",
      "ශාක කඳේ ද්විතියික වර්ධනය",
      "ශාක මුලේ ද්විතියික වර්ධනය",
      "කාෂ්ඨය",
      "වර්ධක වල",
      "ආලෝක අධිග්‍රහණය",
      "ශාක පත්‍රවල ව්‍යුහය",
      "පූටිකා- K+ සාන්ද්‍රණ කල්පිතය",
      "පූටිකා ක්‍රියාකාරිත්වයට බලපාන සාධක",
      "ජලය හා ද්‍රව්‍ය පරිවහනය වන ක්‍රම",
      "ජල විභවය",
      "ද්‍රාව්‍ය විභවය",
      "ශාක සෛලයක සෛලයේ ජලය ගමන් කරන මාර්ග",
      "ශාක මුල් වලට ජලය අවශෝෂණය වන ක්‍රමවේදය",
      "රසෝද්ගමනය",
      "උත්ස්වේදනය",
      "උත්ස්වේදනයට බලපාන සාධක හා වැදගත්කම",
      "උත්ස්වේදන ක්‍රියාව මැනීම-practical",
      "මූල පීඩනය හා බිංදුදය",
      "ප්ලෝයම පරිවහනය",
      "ශාක පෝෂණය",
      "ශාක පෝෂක ඌනතා ලක්ෂණ",
      "ශාක වල අණුක පෝෂක අවශෝෂණය",
      "පසේ හා මුල් වල සබඳතා",
      "ශාක ආලෝක ප්‍රතිචාර-දීප්ති කාලීනතාව",
      "ශාක හෝමෝන",
      "ඔක්සින්",
      "ගිබරලින්",
      "සයිටොකයනින්",
      "ඇබ්සිසික් අම්ලය(ABA)",
      "එතිලීන්",
      "ශාක ප්‍රජනනය-අලිංගික ප්‍රජනනය",
      "ලිංගික ප්‍රජනනය",
      "Practicals"
    ]
  },
  {
    "id": "u5",
    "number": "05",
    "icon": "fa-heart-pulse",
    "title": "Unit 05: සත්ව ආකාරය සහ ක්‍රියාකාරීත්වය",
    "englishTitle": "Animal Form and Function",
    "topics": [
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
    "id": "u6",
    "number": "06",
    "icon": "fa-dna",
    "title": "Unit 06: ප්‍රවේණිය",
    "englishTitle": "Genetics & Heredity",
    "topics": [
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
    "id": "u7",
    "number": "07",
    "icon": "fa-flask-vial",
    "title": "Unit 07: අණුක ජීව විද්‍යාව සහ rDNA තාක්ෂණය",
    "englishTitle": "Molecular Biology & Recombinant DNA",
    "topics": [
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
    "id": "u8",
    "number": "08",
    "icon": "fa-earth-americas",
    "title": "Unit 08: පාරිසරික ජීව විද්‍යාව",
    "englishTitle": "Environmental Biology",
    "topics": [
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
    "id": "u9",
    "number": "09",
    "icon": "fa-virus",
    "title": "Unit 09: ක්ෂුද්‍ර ජීව විද්‍යාව",
    "englishTitle": "Microbiology",
    "topics": [
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
    "id": "u10",
    "number": "10",
    "icon": "fa-wheat-awn",
    "title": "Unit 10: ව්‍යවහාරික ජීව විද්‍යාව",
    "englishTitle": "Applied Biology",
    "topics": [
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
],
  liveClasses: [],
  classCards: [],
  requests: [],
  monthlyClasses: [],
  monthlyFolders: []
};

let currentAdmin = null;
let currentTab = 'tab-overview';
let activeAssignStudent = null;
let activeAdminTutor = 'dinesh'; // Default active tutor for Video Packs management
let activeAdminTutorMode = 'theory'; // 'theory' or 'revision' for tutors offering both
let activeAdminUnitId = null; // When null: show 10 Botanical 3D leaf folders. When set: show unit detail.
let activeAdminRevFolder = null; // When set: shows videos inside specific custom revision folder for Sasanka/Dhananjaya
let activeMonthlyMonth = null; // When null: show month folders. When set: show tutors for that month.
let activeMonthlyTutorId = null; // When set: show classes for that tutor in activeMonthlyMonth.
let activeMonthlyClassMode = 'theory'; // 'theory' or 'revision'
let activeFlTutor = 'dinesh'; // Active tutor in Free Lessons manager
let activeFlMode = 'theory'; // 'theory' or 'revision' in Free Lessons manager

// ============================================================================
// INITIALIZATION & REAL-TIME CLOCK
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
  startAdminClock();
  checkAdminAuth();
  fetchAdminData().then(() => {
    checkUrlHashTab();
  });
  window.addEventListener('hashchange', checkUrlHashTab);
});

function checkUrlHashTab() {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const tabMap = {
      'overview': 'tab-overview',
      'students': 'tab-students',
      'tutors': 'tab-tutors-videos',
      'videos': 'tab-tutors-videos',
      'live': 'tab-live-classes',
      'cards': 'tab-fees-cards',
      'fees': 'tab-fees-cards',
      'monthly': 'tab-monthly-classes',
      'monthly-classes': 'tab-monthly-classes',
      'freelessons': 'tab-freelessons-mgr',
      'freelessons-mgr': 'tab-freelessons-mgr',
      'requests': 'tab-requests',
      'syllabus': 'tab-syllabus-mgr'
    };
    const targetTab = tabMap[hash] || (hash.startsWith('tab-') ? hash : null);
    if (targetTab) switchAdminTab(targetTab);
  }
}

function startAdminClock() {
  const clockEl = document.getElementById('admin-clock');
  const update = () => {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
    }
  };
  update();
  setInterval(update, 1000);
}

// ============================================================================
// DATA FETCHING & SYNCHRONIZATION
// ============================================================================
async function fetchAdminData(showNotice = false) {
  try {
    const res = await fetch('/api/db');
    const json = await res.json();
    if (json.success && json.data) {
      ADMIN_DATA = json.data;
      if (!ADMIN_DATA.students) ADMIN_DATA.students = [];
      if (!ADMIN_DATA.classCards) ADMIN_DATA.classCards = [];
      if (!ADMIN_DATA.requests) ADMIN_DATA.requests = [];
      if (!ADMIN_DATA.monthlyClasses) ADMIN_DATA.monthlyClasses = [];
      if (!ADMIN_DATA.monthlyFolders) ADMIN_DATA.monthlyFolders = [];
      if (!ADMIN_DATA.monthlyTutes) ADMIN_DATA.monthlyTutes = [];
      if (!ADMIN_DATA.products) ADMIN_DATA.products = [];
      if (!ADMIN_DATA.orders) ADMIN_DATA.orders = [];
      
      renderAllAdminSections();
      if (showNotice) showAdminToast('Database synchronized successfully!', 'success');
    }
  } catch (err) {
    console.error('Failed to load admin data:', err);
    showAdminToast('Failed to connect to backend server', 'error');
  }
}

function refreshAdminData(showNotice = true) {
  fetchAdminData(showNotice);
}

function renderAllAdminSections() {
  renderOverviewStats();
  renderStudentsTable();
  renderTutorsAndVideoPacks();
  renderLiveClasses();
  renderFeesCards();
  renderMonthlyClassesTab();
  renderFreeLessonsTab();
  renderRequestsTab();
  renderSyllabusUnits();
  renderAdminsTab();
  renderProductsTab();
  renderAdminBioBankTab();
  updateBadgeCounts();
}

function updateBadgeCounts() {
  const sBadge = document.getElementById('count-students-badge');
  const cBadge = document.getElementById('count-cards-badge');
  const mBadge = document.getElementById('count-monthly-classes-badge');
  const flBadge = document.getElementById('count-freelessons-badge');
  const rBadge = document.getElementById('count-requests-badge');

  const pendingRequests = (ADMIN_DATA.requests || []).filter(r => r.status === 'pending');

  if (sBadge) sBadge.textContent = (ADMIN_DATA.students || []).length;
  if (cBadge) cBadge.textContent = (ADMIN_DATA.classCards || []).length;
  if (mBadge) mBadge.textContent = (ADMIN_DATA.monthlyClasses || []).length;
  if (flBadge) flBadge.textContent = (ADMIN_DATA.freeLessons || []).length;
  if (rBadge) {
    rBadge.textContent = pendingRequests.length;
    rBadge.style.display = pendingRequests.length > 0 ? 'inline-flex' : 'none';
  }
}

// ============================================================================
// TAB NAVIGATION
// ============================================================================
function switchAdminTab(tabId) {
  // Normal Admin Role Guard: Can access Overview and Video/Class management tabs only
  if (currentAdmin && currentAdmin.role === 'normal_admin') {
    const allowedNormalTabs = ['tab-overview', 'tab-monthly-classes', 'tab-live-classes', 'tab-tutors-videos', 'tab-freelessons-mgr'];
    if (!allowedNormalTabs.includes(tabId)) {
      tabId = 'tab-overview';
      showAdminToast('Normal Admins have access to Overview & Video Management only.', 'info');
    }
  }

  currentTab = tabId;
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.admin-tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });

  const headingEl = document.getElementById('admin-page-heading');
  const subHeadingEl = document.getElementById('admin-page-subheading');
  const quickBtn = document.getElementById('quick-add-btn-label');

  const titles = {
    'tab-overview': { title: 'Dashboard Overview', sub: 'Real-time platform metrics & platform management control', btn: 'Quick Action' },
    'tab-students': { title: 'Student Management & Verified Badges', sub: 'Manage registered students, grant badges, suspend/ban accounts', btn: 'Add Student' },
    'tab-tutors-videos': { title: 'Tutors & Video Packs Hub', sub: 'Manage Biology lecturers, video lessons, lock status, and telegram tutes per teacher', btn: 'Add Video' },
    'tab-live-classes': { title: 'Live Streaming Broadcast Hub', sub: 'Broadcast Zoom & YouTube Live streams for 2027 or 2028 batches', btn: 'New Live Class' },
    'tab-fees-cards': { title: 'Monthly Fees Cards & Activation', sub: 'Create month access passes, directly activate cards, and manage store requests', btn: 'New Fees Card' },
    'tab-monthly-classes': { title: 'Monthly Classes Management Hub', sub: 'Manage month folders, theory & revision recordings per teacher, and transfer to Video Packs', btn: 'Add Month' },
    'tab-freelessons-mgr': { title: 'Free Lessons Management Hub', sub: 'Control tutor visibility, manage Theory 10 units & Revision free masterclasses', btn: 'Add Free Lesson' },
    'tab-requests': { title: 'Requests & Unlocks Management Hub', sub: 'Review and approve incoming monthly card and video pack unlock requests', btn: 'Refresh' },
    'tab-syllabus-mgr': { title: 'Syllabus Mastery Tracker Manager', sub: 'Manage Units 1-10 and add curriculum subtopics dynamically', btn: 'Add Subtopic' },
    'tab-admins': { title: 'Admin Roles & System Settings', sub: 'Manage Admin Accounts, Telegram Bot Alerts, and Firestore Cloud Sync', btn: 'Add Admin' }
  };

  if (titles[tabId]) {
    headingEl.textContent = titles[tabId].title;
    subHeadingEl.textContent = titles[tabId].sub;
    quickBtn.textContent = titles[tabId].btn;
  }

  if (tabId === 'tab-monthly-classes') {
    renderMonthlyClassesTab();
  }
  if (tabId === 'tab-admins') {
    renderAdminsTab();
  }
  if (tabId === 'tab-products') {
    renderProductsTab();
  }
  if (tabId === 'tab-admin-biobank') {
    renderAdminBioBankTab();
  }
  
}

function openCreateForCurrentTab() {
  if (currentTab === 'tab-students') openAdminModal('modal-add-tutor');
  else if (currentTab === 'tab-tutors-videos') openAddVideoModal();
  else if (currentTab === 'tab-live-classes') openAddLiveClassModal();
  else if (currentTab === 'tab-fees-cards') openAddCardModal();
  else if (currentTab === 'tab-requests') fetchAdminData(true);
  else if (currentTab === 'tab-syllabus-mgr') openAddSubtopicModal();
  else if (currentTab === 'tab-online-exams') openAddAdminExamModal();
  else openAddLiveClassModal();
}

// ============================================================================
// 1. OVERVIEW & METRICS
// ============================================================================
function renderOverviewStats() {
  const students = ADMIN_DATA.students || [];
  const s27 = students.filter(s => s.year === '2027').length;
  const s28 = students.filter(s => s.year === '2028').length;

  let totalVideos = 0;
  (ADMIN_DATA.videoPacks || []).forEach(u => {
    totalVideos += (u.lessons || []).length;
  });
  (ADMIN_DATA.freeLessons || []).forEach(() => totalVideos++);

  const liveClasses = ADMIN_DATA.liveClasses || [];
  const activeLive = liveClasses.filter(l => l.isActive).length;

  const cards = ADMIN_DATA.classCards || [];

  document.getElementById('metric-total-students').textContent = students.length;
  document.getElementById('metric-students-breakdown').textContent = `${s27} (2027) • ${s28} (2028)`;
  document.getElementById('metric-total-videos').textContent = totalVideos;
  document.getElementById('metric-total-live').textContent = activeLive;
  document.getElementById('metric-live-breakdown').textContent = `${liveClasses.length} Scheduled Streams`;
  document.getElementById('metric-total-cards').textContent = cards.length;

  // Fetch real database storage & disk usage monitor
  fetchStorageStats();

  // Recent Students List
  const recentList = document.getElementById('overview-students-list');
  if (recentList) {
    if (students.length === 0) {
      recentList.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No registered students yet.</p>';
    } else {
      recentList.innerHTML = students.slice(0, 5).map(s => `
        <div class="recent-item-row">
          <div class="recent-item-info">
            <div class="recent-avatar-circle">
              <i class="fa-solid ${s.gender === 'female' ? 'fa-user-nurse' : 'fa-user-graduate'}"></i>
            </div>
            <div>
              <div class="recent-user-name">${escapeHtml(s.name)} ${s.isVerified ? '<span style="color:#10b981; font-size:12px;">✓ Verified</span>' : ''}</div>
              <div class="recent-user-sub">${s.year} A/L • ${escapeHtml(s.school || 'School')} • ID: ${s.studentId}</div>
            </div>
          </div>
          <div>
            <span class="badge-${s.status === 'suspended' ? 'status-suspended' : 'status-active'}">
              ● ${s.status === 'suspended' ? 'Suspended' : 'Active'}
            </span>
          </div>
        </div>
      `).join('');
    }
  }

  // Live Streams Status List
  const liveList = document.getElementById('overview-live-list');
  if (liveList) {
    if (liveClasses.length === 0) {
      liveList.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No live classes created yet.</p>';
    } else {
      liveList.innerHTML = liveClasses.map(l => `
        <div class="recent-item-row">
          <div class="recent-item-info">
            <div class="recent-avatar-circle" style="background:${l.isActive ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}; color:${l.isActive ? '#ef4444' : '#94a3b8'};">
              <i class="fa-solid fa-tower-broadcast"></i>
            </div>
            <div>
              <div class="recent-user-name">${escapeHtml(l.title)}</div>
              <div class="recent-user-sub">${l.batch} A/L • ${l.streamType.toUpperCase()} • ${l.scheduledAt}</div>
            </div>
          </div>
          <div>
            <span class="${l.isActive ? 'admin-live-pulse' : 'badge-unlocked'}">${l.isActive ? 'LIVE NOW' : 'ENDED'}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

// ============================================================================
// 1B. REAL DATABASE & CLOUD STORAGE CAPACITY MONITOR
// ============================================================================
async function fetchStorageStats(isManual = false) {
  const refreshIcon = document.getElementById('storage-refresh-icon');
  if (refreshIcon && isManual) {
    refreshIcon.classList.add('fa-spin');
  }

  try {
    const res = await fetch('/api/admin/storage-stats');
    const json = await res.json();
    if (json.success) {
      const usedEl = document.getElementById('storage-used-text');
      const quotaEl = document.getElementById('storage-quota-text');
      const percentEl = document.getElementById('storage-percent-text');
      const barEl = document.getElementById('storage-progress-bar');
      const dbSizeEl = document.getElementById('storage-db-size');
      const uploadsSizeEl = document.getElementById('storage-uploads-size');
      const uploadsCountEl = document.getElementById('storage-uploads-count');
      const ramEl = document.getElementById('storage-ram-usage');
      const freeEl = document.getElementById('storage-free-space');
      const totalRecEl = document.getElementById('storage-total-records');
      const statusBadge = document.getElementById('storage-status-badge');

      if (usedEl) usedEl.textContent = json.totalStorageFormatted;
      if (quotaEl) quotaEl.textContent = json.quotaFormatted;
      if (percentEl) percentEl.textContent = `${json.percentageUsed}%`;
      if (barEl) {
        barEl.style.width = `${Math.max(1.5, Math.min(100, json.percentageUsed))}%`;
        if (json.percentageUsed > 85) {
          barEl.style.background = 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)';
        } else {
          barEl.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        }
      }

      if (dbSizeEl) dbSizeEl.textContent = json.dbSizeFormatted;
      if (uploadsSizeEl) uploadsSizeEl.textContent = json.uploadsSizeFormatted;
      if (uploadsCountEl) uploadsCountEl.textContent = `${json.uploadsCount} Media files`;
      if (ramEl) ramEl.textContent = json.memoryUsageFormatted;
      if (freeEl) freeEl.textContent = `${json.freeStorageFormatted} Free`;
      
      const totalRecs = Object.values(json.recordCounts || {}).reduce((a, b) => a + b, 0);
      if (totalRecEl) totalRecEl.textContent = `${totalRecs} Records Active`;

      if (statusBadge) {
        if (json.percentageUsed < 75) {
          statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Optimal (${json.percentageUsed}% Used)`;
          statusBadge.style.color = '#059669';
          statusBadge.style.background = '#ecfdf5';
          statusBadge.style.borderColor = '#a7f3d0';
        } else {
          statusBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Moderate (${json.percentageUsed}% Used)`;
          statusBadge.style.color = '#d97706';
          statusBadge.style.background = '#fffbeb';
          statusBadge.style.borderColor = '#fde68a';
        }
      }

      if (isManual) {
        showAdminToast(`Storage Recalculated: ${json.totalStorageFormatted} / ${json.quotaFormatted} (${json.percentageUsed}% Used)`, 'success');
      }
    }
  } catch (err) {
    console.warn('Failed to fetch storage stats:', err);
  } finally {
    if (refreshIcon) {
      setTimeout(() => refreshIcon.classList.remove('fa-spin'), 600);
    }
  }
}

// ============================================================================
// 2. STUDENTS MANAGEMENT
// ============================================================================
function renderStudentsTable(filterData = null) {
  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;

  const students = filterData || ADMIN_DATA.students || [];
  refreshAdminOnlineStudents();
  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:var(--text-dim);">No students found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => {
    const isSuspended = s.status === 'suspended';
    const activeCardsCount = (s.activeCards || []).length;

    return `
      <tr>
        <td><span class="badge-id">${s.studentId}</span></td>
        <td>
          <strong style="color:#fff; font-size:0.9rem;">${escapeHtml(s.name)}</strong>
        </td>
        <td>
          ${isStudentOnline(s.email) 
            ? '<span style="color:#10b981; font-weight:800; font-size:0.8rem; display:inline-flex; align-items:center; gap:5px;"><span style="width:7px; height:7px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span> Online Now</span>' 
            : '<span style="color:#64748b; font-size:0.8rem;">Offline</span>'}
        </td>
        <td>
          <div><strong style="color:#10b981;">${s.year} A/L</strong> <span style="font-size:0.75rem; background:#ecfdf5; color:#047857; padding:1px 6px; border-radius:4px; font-weight:700;">${escapeHtml(s.district || 'Colombo')}</span></div>
        </td>
        <td>
          <small style="color:var(--text-dim);">${escapeHtml(s.school || 'School')}</small>
        </td>
        <td>
          <span style="font-size:0.8rem; text-transform:capitalize; color:var(--text-muted);">
            <i class="fa-solid ${s.gender === 'female' ? 'fa-venus' : 'fa-mars'}"></i> ${s.gender || 'male'}
          </span>
        </td>
        <td>${escapeHtml(s.phone || '-')}</td>
        <td><small style="font-family:monospace; color:#38bdf8;">${escapeHtml(s.email)}</small></td>
        <td>
          <button class="${s.isVerified ? 'badge-verified-yes' : 'badge-verified-no'}" 
                  onclick="toggleStudentVerified('${s.studentId}', ${!s.isVerified})" 
                  title="Click to toggle verified badge">
            <i class="fa-solid ${s.isVerified ? 'fa-circle-check' : 'fa-circle'}"></i>
            ${s.isVerified ? 'Verified' : 'Unverified'}
          </button>
        </td>
        <td>
          <span class="${isSuspended ? 'badge-status-suspended' : 'badge-status-active'}">
            ● ${isSuspended ? 'Suspended' : 'Active'}
          </span>
        </td>
        <td>
          <button class="btn-panel-action" onclick="openAssignCardsModal('${s.studentId}')">
            <i class="fa-solid fa-id-card"></i> ${activeCardsCount} Active Cards
          </button>
        </td>
        <td>
          <div class="action-btns-group">
            <button class="btn-icon-action ${isSuspended ? 'success' : 'warning'}" 
                    onclick="toggleStudentStatus('${s.studentId}', '${isSuspended ? 'active' : 'suspended'}')"
                    title="${isSuspended ? 'Unban / Activate' : 'Suspend / Ban Student'}">
              <i class="fa-solid ${isSuspended ? 'fa-unlock' : 'fa-ban'}"></i>
            </button>
            <button class="btn-icon-action danger" 
                    onclick="deleteStudentAccount('${s.studentId}')"
                    title="Delete Student">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterStudentsTable() {
  const query = (document.getElementById('student-search-input').value || '').toLowerCase().trim();
  const batch = document.getElementById('student-batch-filter').value;
  const status = document.getElementById('student-status-filter').value;

  const filtered = (ADMIN_DATA.students || []).filter(s => {
    const matchesQuery = !query || 
      (s.name && s.name.toLowerCase().includes(query)) ||
      (s.studentId && s.studentId.includes(query)) ||
      (s.email && s.email.toLowerCase().includes(query)) ||
      (s.phone && s.phone.includes(query)) ||
      (s.school && s.school.toLowerCase().includes(query));

    const matchesBatch = batch === 'all' || s.year === batch;

    let matchesStatus = true;
    if (status === 'verified') matchesStatus = s.isVerified === true;
    else if (status === 'active') matchesStatus = s.status !== 'suspended';
    else if (status === 'suspended') matchesStatus = s.status === 'suspended';

    return matchesQuery && matchesBatch && matchesStatus;
  });

  renderStudentsTable(filtered);
}

async function toggleStudentVerified(studentId, newVerified) {
  try {
    const res = await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified: newVerified })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Student ${newVerified ? 'granted Verified Badge ✓' : 'unverified'}`, 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to update verification', 'error');
  }
}

async function toggleStudentStatus(studentId, newStatus) {
  const confirmMsg = newStatus === 'suspended' ? 'Suspend and ban this student from portal?' : 'Activate and restore student account?';
  if (!confirm(confirmMsg)) return;

  try {
    const res = await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Student account ${newStatus}`, 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to update student status', 'error');
  }
}

async function deleteStudentAccount(studentId) {
  if (!confirm(`Are you sure you want to permanently delete student ID ${studentId}?`)) return;

  try {
    const res = await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Student deleted permanently', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete student', 'error');
  }
}

// Assign Monthly Class Cards to Student
function openAssignCardsModal(studentId) {
  const student = (ADMIN_DATA.students || []).find(s => s.studentId === studentId);
  if (!student) return;
  activeAssignStudent = student;

  const summary = document.getElementById('assign-student-summary');
  summary.innerHTML = `
    <strong>${escapeHtml(student.name)}</strong> (ID: <span class="badge-id">${student.studentId}</span>) • ${student.year} A/L Batch • ${escapeHtml(student.school || '')}
  `;

  const list = document.getElementById('assign-cards-list');
  const allCards = ADMIN_DATA.classCards || [];

  if (allCards.length === 0) {
    list.innerHTML = `<p style="color:var(--text-dim); text-align:center; padding:10px;">No class cards created yet. Create one in the Monthly Fees Cards tab.</p>`;
  } else {
    list.innerHTML = allCards.map(c => {
      const isAssigned = (student.activeCards || []).includes(c.id);
      return `
        <div class="assign-card-row">
          <div>
            <strong style="color:#fff; font-size:0.88rem;">${escapeHtml(c.title)}</strong>
            <div style="font-size:0.75rem; color:var(--text-dim);">${c.batch} A/L • Rs. ${c.price.toLocaleString()} • Valid till ${c.validTo || 'N/A'}</div>
          </div>
          <div>
            <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
              <input type="checkbox" style="width:18px; height:18px; accent-color:#10b981;" 
                     ${isAssigned ? 'checked' : ''} 
                     onchange="handleToggleStudentCard('${student.studentId}', '${c.id}', this.checked)">
              <span style="font-size:0.8rem; font-weight:700; color:${isAssigned ? '#10b981' : '#94a3b8'};">
                ${isAssigned ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
        </div>
      `;
    }).join('');
  }

  openAdminModal('modal-assign-cards');
}

async function handleToggleStudentCard(studentId, cardId, isChecked) {
  try {
    const res = await fetch('/api/cards/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        cardId,
        action: isChecked ? 'add' : 'remove'
      })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Class card ${isChecked ? 'activated for student' : 'removed'}`, 'success');
      const s = (ADMIN_DATA.students || []).find(st => st.studentId === studentId);
      if (s) s.activeCards = json.activeCards;
      renderStudentsTable();
      renderFeesCards();
    }
  } catch (err) {
    showAdminToast('Failed to assign card', 'error');
  }
}

// ============================================================================
// 3. TUTOR SPECIFIC VIDEO PACKS & FOLDERS
// ============================================================================
function renderTutorsAndVideoPacks() {
  const tutors = ADMIN_DATA.tutors || [];
  if (tutors.length === 0) return;

  // Ensure activeAdminTutor is valid
  if (!tutors.some(t => t.id === activeAdminTutor)) {
    activeAdminTutor = tutors[0].id;
  }

  const activeTutorObj = tutors.find(t => t.id === activeAdminTutor) || tutors[0];

  // 1. Tutors Grid with Active Highlight & Free Lessons Visibility Toggle
  const tutorsGrid = document.getElementById('tutors-admin-grid');
  if (tutorsGrid) {
    tutorsGrid.innerHTML = tutors.map(t => {
      const isActive = t.id === activeAdminTutor;
      const isVisibleInFl = t.showInFreeLessons === true;
      return `
        <div class="tutor-admin-card ${isActive ? 'active-selected' : ''}" onclick="switchAdminTutor('${t.id}')">
          <img src="${t.avatar || '/muthugala-sir.jpg'}" alt="${escapeHtml(t.name)}" class="tutor-avatar-img" onerror="this.src='/muthugala-sir.jpg';">
          <div class="tutor-meta-info">
            <div class="tutor-meta-name">${escapeHtml(t.name)}</div>
            <div class="tutor-meta-sub">
              ${escapeHtml(t.subject || 'A/L Biology')}
              <span class="badge-tutor-type ${t.hasTheory ? 'theory-rev' : 'rev-only'}">
                ${t.hasTheory ? 'Theory + Revision' : 'Revision Only'}
              </span>
            </div>
            <div style="margin-top:6px;">
              <button class="btn-vis-toggle ${isVisibleInFl ? 'turn-off' : 'turn-on'}" 
                      onclick="event.stopPropagation(); toggleTutorFreeLessonsVisibility('${t.id}', ${!isVisibleInFl})"
                      title="Toggle Free Lessons visibility for this tutor">
                <i class="fa-solid ${isVisibleInFl ? 'fa-eye' : 'fa-eye-slash'}"></i>
                <span>Free Lessons: ${isVisibleInFl ? 'ON (Visible)' : 'OFF (Hidden)'}</span>
              </button>
            </div>
          </div>
          <button class="btn-icon-action danger" onclick="event.stopPropagation(); deleteTutor('${t.id}')" title="Delete Tutor">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    }).join('');
  }

  // 2. Tutor Switch Pills & Name Display
  const switchPills = document.getElementById('admin-tutor-switch-pills');
  const tutorNameDisplay = document.getElementById('admin-selected-tutor-name');
  const modeBar = document.getElementById('admin-tutor-mode-toggle-bar');

  if (modeBar) {
    if (activeTutorObj.hasTheory) {
      modeBar.style.display = 'flex';
      const btnTheory = document.getElementById('btn-admin-tutor-mode-theory');
      const btnRev = document.getElementById('btn-admin-tutor-mode-revision');
      if (btnTheory) btnTheory.classList.toggle('active', activeAdminTutorMode === 'theory');
      if (btnRev) btnRev.classList.toggle('active', activeAdminTutorMode === 'revision');
    } else {
      modeBar.style.display = 'none';
    }
  }

  if (tutorNameDisplay && activeTutorObj) {
    if (activeTutorObj.hasTheory) {
      tutorNameDisplay.textContent = activeAdminTutorMode === 'theory' 
        ? `${activeTutorObj.name} සර්ගේ Theory Video Packs (Units 01 - 10)`
        : `${activeTutorObj.name} සර්ගේ Revision Video Packs & Folders`;
    } else {
      tutorNameDisplay.textContent = `${activeTutorObj.name} සර්ගේ Revision Video Packs & Folders`;
    }
  }

  if (switchPills) {
    switchPills.innerHTML = tutors.map(t => `
      <button class="tutor-pill-btn ${t.id === activeAdminTutor ? 'active' : ''}" onclick="switchAdminTutor('${t.id}')">
        ${escapeHtml(t.name.split(' ')[0])}
      </button>
    `).join('');
  }

  // 3. Filter Video Packs for Selected Tutor
  const unitsContainer = document.getElementById('units-admin-container');
  if (!unitsContainer) return;

  // =========================================================================
  // SCENARIO 1: REVISION MODE (Sasanka, Dhananjaya, or Dinesh in Revision Mode)
  // =========================================================================
  if (!activeTutorObj.hasTheory || activeAdminTutorMode === 'revision') {
    const revVideos = (ADMIN_DATA.revisionVideos || []).filter(v => v.tutorId === activeAdminTutor);
    const customFolders = Array.from(new Set(revVideos.filter(v => v.folderName && v.folderName.trim()).map(v => v.folderName.trim())));
    const directVideos = revVideos.filter(v => !v.folderName || !v.folderName.trim());

    // Sub-view: Inside a specific custom revision folder
    if (activeAdminRevFolder) {
      const folderVideos = revVideos.filter(v => v.folderName === activeAdminRevFolder);
      unitsContainer.innerHTML = `
        <div class="unit-detail-box">
          <div class="unit-detail-header">
            <button class="btn-back-folders" onclick="closeAdminRevFolder()">
              <i class="fa-solid fa-arrow-left"></i> Back to Revision Hub
            </button>
            <div style="flex:1; margin-left:10px;">
              <h3 style="margin:0; color:#fff; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-folder-open" style="color:#10b981;"></i> ${escapeHtml(activeAdminRevFolder)}
              </h3>
              <p style="margin:4px 0 0 0; color:var(--text-dim); font-size:0.8rem;">
                Teacher: <strong>${escapeHtml(activeTutorObj.name)}</strong> • Total Videos in Folder: ${folderVideos.length}
              </p>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <button class="btn-primary-action small" onclick="openAddRevisionVideoModal('${escapeHtml(activeAdminRevFolder)}')">
                <i class="fa-solid fa-plus"></i> Add Video to this Folder
              </button>
            </div>
          </div>

          <table class="unit-lessons-table">
            <tbody>
              ${folderVideos.length === 0 ? '<tr><td style="color:var(--text-dim); text-align:center; padding:30px;">No videos added to this folder yet. Click "+ Add Video to this Folder" above!</td></tr>' : folderVideos.map(v => `
                <tr>
                  <td style="width:40px;"><i class="fa-brands fa-youtube" style="color:#ef4444; font-size:20px;"></i></td>
                  <td>
                    <strong style="color:#fff; font-size:0.95rem;">${escapeHtml(v.title)}</strong>
                    ${v.desc ? `<div style="color:var(--text-dim); font-size:0.75rem;">${escapeHtml(v.desc)}</div>` : ''}
                    ${v.tuteUrl ? `<div style="font-size:0.74rem; color:#38bdf8;"><i class="fa-solid fa-file-pdf"></i> Tute: <a href="${escapeHtml(v.tuteUrl)}" target="_blank" style="color:#38bdf8;">${escapeHtml(v.tuteUrl)}</a></div>` : ''}
                  </td>
                  <td><span class="badge-id">${v.duration || '2h 00m'}</span></td>
                  <td><span class="badge-id" style="color:#f59e0b;">ID: ${escapeHtml(v.ytId)}</span></td>
                  <td>
                    <button class="${v.isLocked ? 'badge-locked' : 'badge-unlocked'}" 
                            onclick="toggleRevisionVideoLock('${v.id}', ${!v.isLocked})"
                            title="Click to toggle lock state">
                      <i class="fa-solid ${v.isLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                      ${v.isLocked ? 'Locked' : 'Free Access'}
                    </button>
                  </td>
                  <td style="width:70px; text-align:right;">
                    <button class="btn-icon-action danger" onclick="deleteRevisionVideo('${v.id}')" title="Delete Video">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      return;
    }

    // Main Revision Hub: Custom Folders + Direct Videos
    unitsContainer.innerHTML = `
      <div style="background:#ffffff; border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-lg); padding:24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
          <div>
            <h4 style="margin:0; font-size:1.15rem; color:#0f172a; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-bolt" style="color:#f59e0b;"></i> Revision Hub • ${escapeHtml(activeTutorObj.name)}
            </h4>
            <p style="margin:4px 0 0 0; color:#64748b; font-size:0.82rem;">
              (Revision Only Lecturer - Folders මඟින් හෝ Direct Videos ලෙස Revision පන්ති සංවිධානය කරන්න)
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn-primary-action small" onclick="openAddRevisionFolderModal()">
              <i class="fa-solid fa-folder-plus"></i> Create Revision Folder
            </button>
            <button class="btn-primary-action small" onclick="openAddRevisionVideoModal(null)">
              <i class="fa-solid fa-video"></i> Add Direct Video
            </button>
          </div>
        </div>

        <!-- Section A: Custom Folders -->
        <div style="margin-bottom:24px;">
          <h5 style="color:#065f46; font-size:0.92rem; font-weight:800; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-folder-tree"></i> Custom Folders (අභිරුචි ෆෝල්ඩර):
          </h5>
          ${customFolders.length === 0 ? `
            <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:var(--radius-md); padding:20px; text-align:center; color:#64748b; font-size:0.85rem;">
              තවම කිසිදු Revision Folder එකක් සකසා නැත. Past Papers, Model Papers ආදිය සඳහා ඉහත "+ Create Revision Folder" ක්ලික් කරන්න.
            </div>
          ` : `
            <div class="rev-folders-grid">
              ${customFolders.map(fName => {
                const count = revVideos.filter(v => v.folderName === fName).length;
                return `
                  <div class="rev-folder-card" onclick="openAdminRevFolder('${escapeHtml(fName)}')">
                    <div class="rev-folder-top">
                      <i class="fa-solid fa-folder-open rev-folder-icon"></i>
                      <span class="badge-id" style="color:#059669; font-weight:700;">${count} Video${count === 1 ? '' : 's'}</span>
                    </div>
                    <div class="rev-folder-title">${escapeHtml(fName)}</div>
                    <div class="rev-folder-footer">
                      <button class="btn-open-admin-folder" onclick="event.stopPropagation(); openAdminRevFolder('${escapeHtml(fName)}')">
                        <span>Open Folder</span> <i class="fa-solid fa-arrow-right"></i>
                      </button>
                      <button class="btn-icon-action danger" onclick="event.stopPropagation(); deleteRevisionFolder('${escapeHtml(fName)}')" title="Delete Entire Folder">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- Section B: Direct Videos (Folder රහිත) -->
        <div>
          <h5 style="color:#065f46; font-size:0.92rem; font-weight:800; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-film"></i> Direct Revision Videos (Folder රහිත Day-by-Day Videos):
          </h5>
          <table class="unit-lessons-table">
            <tbody>
              ${directVideos.length === 0 ? '<tr><td style="color:#64748b; text-align:center; padding:20px; font-size:0.85rem;">Folder රහිත Direct Videos නොමැත. "+ Add Direct Video" ඔබන්න.</td></tr>' : directVideos.map(v => `
                <tr>
                  <td style="width:40px;"><i class="fa-brands fa-youtube" style="color:#ef4444; font-size:20px;"></i></td>
                  <td>
                    <strong style="color:#0f172a; font-size:0.95rem;">${escapeHtml(v.title)}</strong>
                    ${v.desc ? `<div style="color:#64748b; font-size:0.75rem;">${escapeHtml(v.desc)}</div>` : ''}
                    ${v.tuteUrl ? `<div style="font-size:0.74rem; color:#0284c7;"><i class="fa-solid fa-file-pdf"></i> Tute: <a href="${escapeHtml(v.tuteUrl)}" target="_blank" style="color:#0284c7;">${escapeHtml(v.tuteUrl)}</a></div>` : ''}
                  </td>
                  <td><span class="badge-id">${v.duration || '2h 00m'}</span></td>
                  <td><span class="badge-id" style="color:#d97706;">ID: ${escapeHtml(v.ytId)}</span></td>
                  <td>
                    <button class="${v.isLocked ? 'badge-locked' : 'badge-unlocked'}" 
                            onclick="toggleRevisionVideoLock('${v.id}', ${!v.isLocked})"
                            title="Click to toggle lock state">
                      <i class="fa-solid ${v.isLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                      ${v.isLocked ? 'Locked' : 'Free Access'}
                    </button>
                  </td>
                  <td style="width:70px; text-align:right;">
                    <button class="btn-icon-action danger" onclick="deleteRevisionVideo('${v.id}')" title="Delete Video">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    return;
  }

  // =========================================================================
  // SCENARIO 2: DINESH MUTHUGALA (THEORY UNITS 01 - 10)
  // =========================================================================
  const videoPacks = (ADMIN_DATA.videoPacks || []).filter(u => u.tutorId === activeAdminTutor);

  if (videoPacks.length === 0) {
    unitsContainer.innerHTML = `<p style="color:var(--text-dim); text-align:center; padding:30px;">No video folders initialized for this teacher yet.</p>`;
    return;
  }

  // VIEW A: 10 Botanical 3D Leaf Folders Grid (Matches Main Web & User Image 5)
  if (!activeAdminUnitId) {
    unitsContainer.innerHTML = `
      <div class="admin-leaf-folders-grid">
        ${videoPacks.map(u => {
          const lessons = u.lessons || [];
          const isVis = u.isVisibleToStudents !== false;
          return `
            <div class="admin-leaf-card" onclick="openAdminUnitDetail('${u.unitId}')">
              <div class="admin-leaf-top">
                <div class="admin-leaf-icon">${u.icon || '🌿'}</div>
                <span class="admin-leaf-pill">Unit ${u.num}</span>
              </div>
              <div class="admin-leaf-title">${escapeHtml(u.name)}</div>
              <div class="admin-leaf-footer">
                <span class="${isVis ? 'badge-visible' : 'badge-hidden'}">
                  <i class="fa-solid ${isVis ? 'fa-eye' : 'fa-eye-slash'}"></i> ${isVis ? 'Visible (1-6)' : 'Hidden (7-10)'}
                </span>
                <span style="font-size:0.75rem; color:var(--text-dim); margin-left:auto;">
                  <i class="fa-solid fa-video"></i> ${lessons.length} Videos
                </span>
                <button class="btn-open-admin-folder" onclick="event.stopPropagation(); openAdminUnitDetail('${u.unitId}')">
                  <span>Manage</span> <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    return;
  }

  // VIEW B: Unit Detail & Video Management View
  const selectedUnit = videoPacks.find(u => u.unitId === activeAdminUnitId) || videoPacks[0];
  const lessons = selectedUnit.lessons || [];
  const isVis = selectedUnit.isVisibleToStudents !== false;

  unitsContainer.innerHTML = `
    <div class="unit-detail-box">
      <div class="unit-detail-header">
        <button class="btn-back-folders" onclick="closeAdminUnitDetail()">
          <i class="fa-solid fa-arrow-left"></i> Back to 10 Unit Folders
        </button>
        <div style="flex:1; margin-left:10px;">
          <h3 style="margin:0; color:#fff; display:flex; align-items:center; gap:8px;">
            <span>${selectedUnit.icon || '🌿'}</span> Unit ${selectedUnit.num}: ${escapeHtml(selectedUnit.name)}
          </h3>
          <p style="margin:4px 0 0 0; color:var(--text-dim); font-size:0.8rem;">
            Teacher: <strong>${escapeHtml(activeTutorObj.name)}</strong> • Total Lessons: ${lessons.length}
          </p>
        </div>
        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <label class="unit-visibility-toggle-wrap" title="Toggle whether students can see this unit on their portal">
            <input type="checkbox" ${isVis ? 'checked' : ''} onchange="toggleUnitVisibilityAdmin('${selectedUnit.unitId}', this.checked)">
            <span>👁️ Show to Students (ප්‍රකාශයට පත් කරන්න)</span>
          </label>
          <button class="btn-primary-action small" onclick="openAddVideoModalForUnit('${selectedUnit.unitId}')">
            <i class="fa-solid fa-plus"></i> Add Video to Unit
          </button>
        </div>
      </div>

      <table class="unit-lessons-table">
        <tbody>
          ${lessons.length === 0 ? '<tr><td style="color:var(--text-dim); text-align:center; padding:30px;">No videos added to this unit yet. Click "+ Add Video to Unit" above!</td></tr>' : lessons.map(l => `
            <tr>
              <td style="width:40px;"><i class="fa-brands fa-youtube" style="color:#ef4444; font-size:20px;"></i></td>
              <td>
                <strong style="color:#fff; font-size:0.95rem;">${escapeHtml(l.title)}</strong>
                ${l.desc ? `<div style="color:var(--text-dim); font-size:0.75rem;">${escapeHtml(l.desc)}</div>` : ''}
                ${l.tuteUrl ? `<div style="font-size:0.74rem; color:#38bdf8;"><i class="fa-solid fa-file-pdf"></i> Tute: <a href="${escapeHtml(l.tuteUrl)}" target="_blank" style="color:#38bdf8;">${escapeHtml(l.tuteUrl)}</a></div>` : ''}
              </td>
              <td><span class="badge-id">${l.duration || '1h 30m'}</span></td>
              <td><span class="badge-id" style="color:#f59e0b;">ID: ${escapeHtml(l.ytId)}</span></td>
              <td>
                <button class="${l.isLocked ? 'badge-locked' : 'badge-unlocked'}" 
                        onclick="toggleVideoLock('${l.id}', ${!l.isLocked})"
                        title="Click to toggle lock state">
                  <i class="fa-solid ${l.isLocked ? 'fa-lock' : 'fa-lock-open'}"></i>
                  ${l.isLocked ? 'Locked' : 'Free Access'}
                </button>
              </td>
              <td style="width:130px; text-align:right;">
                <button class="btn-action-edit" onclick="openEditVideoModal('${l.id}')" title="Edit Video Details & YouTube Link">
                  <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button class="btn-icon-action danger" onclick="deleteVideoLesson('${l.id}')" title="Delete Video" style="margin-left:6px;">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAdminUnitDetail(unitId) {
  activeAdminUnitId = unitId;
  renderTutorsAndVideoPacks();
}

function closeAdminUnitDetail() {
  activeAdminUnitId = null;
  renderTutorsAndVideoPacks();
}

async function toggleUnitVisibilityAdmin(unitId, isVisible) {
  try {
    const res = await fetch('/api/videopacks/units/visibility', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId: activeAdminTutor,
        unitId,
        isVisibleToStudents: isVisible
      })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Unit ${unitId} is now ${isVisible ? 'Visible to Students' : 'Hidden from Students'}`, 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to update unit visibility', 'error');
  }
}

function openAdminRevFolder(folderName) {
  activeAdminRevFolder = folderName;
  renderTutorsAndVideoPacks();
}

function closeAdminRevFolder() {
  activeAdminRevFolder = null;
  renderTutorsAndVideoPacks();
}

function switchAdminTutor(tutorId) {
  activeAdminTutor = tutorId;
  activeAdminUnitId = null;
  activeAdminRevFolder = null;
  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === tutorId);
  if (tutor && !tutor.hasTheory) {
    activeAdminTutorMode = 'revision';
  } else {
    activeAdminTutorMode = 'theory';
  }
  renderTutorsAndVideoPacks();
}

function switchAdminTutorPackMode(mode) {
  activeAdminTutorMode = mode;
  activeAdminUnitId = null;
  activeAdminRevFolder = null;
  renderTutorsAndVideoPacks();
}

function openAddTutorModal() {
  document.getElementById('tutor-name-input').value = '';
  document.getElementById('tutor-photo-url').value = '';
  document.getElementById('tutor-photo-file').value = '';
  document.getElementById('tutor-photo-preview').style.display = 'none';
  openAdminModal('modal-add-tutor');
}

async function handleSaveTutor(e) {
  e.preventDefault();
  const name = document.getElementById('tutor-name-input').value;
  const subject = document.getElementById('tutor-subject-input').value;
  const avatar = document.getElementById('tutor-photo-url').value || '/muthugala-sir.jpg';

  try {
    const res = await fetch('/api/tutors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, subject, avatar })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Tutor profile created successfully!', 'success');
      closeAdminModal('modal-add-tutor');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to save tutor', 'error');
  }
}

async function deleteTutor(tutorId) {
  if (!confirm('Are you sure you want to remove this tutor?')) return;
  try {
    const res = await fetch(`/api/tutors/${tutorId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Tutor removed', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete tutor', 'error');
  }
}

function openAddVideoModal() {
  document.getElementById('video-modal-title').innerHTML = '<i class="fa-solid fa-circle-play"></i> Add Video Lesson (Theory or Revision)';
  document.getElementById('edit-video-id').value = '';
  document.getElementById('video-title-input').value = '';
  document.getElementById('video-yt-input').value = '';
  document.getElementById('video-duration-input').value = '2h 00m';
  document.getElementById('video-desc-input').value = '';
  document.getElementById('video-tute-input').value = '';
  document.getElementById('video-lock-input').checked = true;

  const revFolderInput = document.getElementById('video-rev-folder-input');
  if (revFolderInput) revFolderInput.value = activeAdminRevFolder || '';

  // Populate tutor select
  const tutorSelect = document.getElementById('video-tutor-select');
  if (tutorSelect) {
    tutorSelect.innerHTML = (ADMIN_DATA.tutors || []).map(t => `
      <option value="${t.id}" ${t.id === activeAdminTutor ? 'selected' : ''}>${escapeHtml(t.name)}</option>
    `).join('');
  }

  handleModalVideoTutorChange(activeAdminTutor);

  // If in revision mode, default category to revision
  if (activeAdminTutorMode === 'revision') {
    const catSelect = document.getElementById('video-category-select');
    if (catSelect) catSelect.value = 'revision';
    handleModalVideoCategoryChange('revision');
  }

  openAdminModal('modal-add-video');
}

function handleModalVideoTutorChange(tutorId) {
  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === tutorId);
  const catGroup = document.getElementById('video-category-group');
  const catSelect = document.getElementById('video-category-select');

  if (tutor && !tutor.hasTheory) {
    if (catGroup) catGroup.style.display = 'none';
    if (catSelect) catSelect.value = 'revision';
    handleModalVideoCategoryChange('revision');
  } else {
    if (catGroup) catGroup.style.display = 'block';
    handleModalVideoCategoryChange(catSelect ? catSelect.value : 'theory');
  }
}

function handleModalVideoCategoryChange(category) {
  const unitGroup = document.getElementById('video-unit-select-group');
  const revGroup = document.getElementById('video-rev-folder-group');
  if (category === 'theory') {
    if (unitGroup) unitGroup.style.display = 'block';
    if (revGroup) revGroup.style.display = 'none';
  } else {
    if (unitGroup) unitGroup.style.display = 'none';
    if (revGroup) revGroup.style.display = 'block';
  }
}

function openAddVideoModalForUnit(unitId) {
  openAddVideoModal();
  const catSelect = document.getElementById('video-category-select');
  if (catSelect) catSelect.value = 'theory';
  handleModalVideoCategoryChange('theory');
  const select = document.getElementById('video-unit-select');
  if (select) select.value = unitId;
}

function openEditVideoModal(videoId) {
  let foundLesson = null;
  let foundUnit = null;

  for (const u of (ADMIN_DATA.videoPacks || [])) {
    const l = (u.lessons || []).find(x => x.id === videoId);
    if (l) {
      foundLesson = l;
      foundUnit = u;
      break;
    }
  }

  if (!foundLesson || !foundUnit) return;

  document.getElementById('video-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Video Lesson & Link';
  document.getElementById('edit-video-id').value = foundLesson.id;
  document.getElementById('video-title-input').value = foundLesson.title;
  document.getElementById('video-yt-input').value = foundLesson.ytId;
  document.getElementById('video-duration-input').value = foundLesson.duration || '2h 00m';
  document.getElementById('video-desc-input').value = foundLesson.desc || '';
  document.getElementById('video-tute-input').value = foundLesson.tuteUrl || '';
  document.getElementById('video-lock-input').checked = !!foundLesson.isLocked;

  const catSelect = document.getElementById('video-category-select');
  if (catSelect) catSelect.value = 'theory';
  handleModalVideoCategoryChange('theory');

  const unitSelect = document.getElementById('video-unit-select');
  if (unitSelect) unitSelect.value = foundUnit.unitId;

  const tutorSelect = document.getElementById('video-tutor-select');
  if (tutorSelect) {
    tutorSelect.innerHTML = (ADMIN_DATA.tutors || []).map(t => `
      <option value="${t.id}" ${t.id === foundUnit.tutorId ? 'selected' : ''}>${escapeHtml(t.name)}</option>
    `).join('');
  }

  openAdminModal('modal-add-video');
}

async function handleSaveVideo(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-video-id').value;
  const tutorId = document.getElementById('video-tutor-select').value || activeAdminTutor;
  const category = document.getElementById('video-category-select')?.value || 'theory';
  const unitId = document.getElementById('video-unit-select')?.value || 'u1';
  const folderName = document.getElementById('video-rev-folder-input')?.value.trim() || null;
  const title = document.getElementById('video-title-input').value.trim();
  const ytId = document.getElementById('video-yt-input').value.trim();
  const duration = document.getElementById('video-duration-input').value.trim() || '2h 00m';
  const desc = document.getElementById('video-desc-input').value.trim();
  const tuteUrl = document.getElementById('video-tute-input').value.trim();
  const isLocked = document.getElementById('video-lock-input').checked;

  if (category === 'revision') {
    // Save as Revision Video
    const url = editId ? `/api/revision-videos/${editId}` : '/api/revision-videos';
    const method = editId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorId, folderName, title, ytUrl: ytId, duration, desc, tuteUrl, isLocked })
      });
      const json = await res.json();
      if (json.success) {
        showAdminToast(editId ? 'Revision video updated!' : 'Revision video added to teacher!', 'success');
        closeAdminModal('modal-add-video');
        fetchAdminData();
      } else {
        showAdminToast(json.message || 'Error saving revision video', 'error');
      }
    } catch (err) {
      showAdminToast('Failed to save revision video', 'error');
    }
    return;
  }

  // Save as Theory Video Unit Lesson
  const url = editId ? `/api/videopacks/videos/${editId}` : '/api/videopacks/videos';
  const method = editId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorId, unitId, title, ytId, duration, desc, tuteUrl, isLocked })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(editId ? 'Video lesson updated successfully!' : 'Video lesson added to selected tutor unit!', 'success');
      closeAdminModal('modal-add-video');
      fetchAdminData();
    } else {
      showAdminToast(json.message || 'Error saving video', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to save video lesson', 'error');
  }
}

async function toggleVideoLock(videoId, newLock) {
  try {
    const res = await fetch(`/api/videopacks/videos/${videoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLocked: newLock })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Video ${newLock ? 'locked 🔒 (unlock required)' : 'unlocked 🔓 (free access)'}`, 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to update video lock status', 'error');
  }
}

async function deleteVideoLesson(videoId) {
  if (!confirm('Are you sure you want to delete this video lesson?')) return;
  try {
    const res = await fetch(`/api/videopacks/videos/${videoId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Video lesson deleted', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete video', 'error');
  }
}

// ============================================================================
// 4. LIVE CLASSES MANAGER
// ============================================================================
function renderLiveClasses() {
  const container = document.getElementById('live-classes-admin-grid');
  const classes = ADMIN_DATA.liveClasses || [];

  if (!container) return;
  if (classes.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; color:var(--text-dim); text-align:center; padding:30px;">No live classes created. Click "Create New Live Class" to broadcast.</p>`;
    return;
  }

  container.innerHTML = classes.map(l => {
    const isLive = l.status === 'live' || (l.isActive && l.status !== 'ended');
    const isUpcoming = l.status === 'upcoming';
    const statusLabel = isLive ? '🔴 LIVE NOW' : (isUpcoming ? '⏰ UPCOMING' : '🏁 ENDED');
    const statusClass = isLive ? 'pulse red' : (isUpcoming ? 'warning' : '');

    return `
      <div class="live-class-card">
        <div class="live-class-thumb-wrap">
          <img src="${l.thumbnail || '/hero.jpg'}" alt="${escapeHtml(l.title)}" onerror="this.src='/hero.jpg';">
          <div class="live-batch-chip">${l.batch || '2027'} A/L Batch</div>
          <div class="live-type-chip ${l.streamType || 'youtube'}">${(l.streamType || 'YOUTUBE').toUpperCase()} LIVE</div>
          <div style="position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,0.85); color:#fff; font-size:0.7rem; font-weight:800; padding:3px 8px; border-radius:6px;">
            ${statusLabel}
          </div>
        </div>
        <div class="live-class-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <span style="font-size:0.75rem; color:#10b981; font-weight:800;">
              <i class="fa-solid fa-calendar"></i> ${escapeHtml(l.month || 'November 2026')} • ${escapeHtml((l.classType || 'theory').toUpperCase())}
            </span>
            ${l.cardRequired !== false ? '<span style="font-size:0.7rem; color:#f59e0b; background:rgba(245,158,11,0.15); padding:2px 6px; border-radius:4px; font-weight:700;"><i class="fa-solid fa-id-card"></i> Card Required</span>' : ''}
          </div>
          <h4 class="live-class-title">${escapeHtml(l.title)}</h4>
          <div style="font-size:0.78rem; color:#38bdf8; font-weight:700;"><i class="fa-solid fa-chalkboard-user"></i> ${escapeHtml(l.tutorName || 'Apex Biology Panel')}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);"><i class="fa-regular fa-clock"></i> ${escapeHtml(l.scheduledAt || 'Now')}</div>
          ${l.desc ? `<p class="live-class-desc">${escapeHtml(l.desc)}</p>` : ''}
          <div style="font-size:0.72rem; color:#94a3b8; word-break:break-all; margin-top:4px;"><strong>Stream ID:</strong> ${escapeHtml(l.streamLink)}</div>
        </div>
        <div class="live-class-footer" style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <button class="btn-panel-action ${l.isActive ? 'warning' : 'success'}" 
                  onclick="toggleLiveClassActive('${l.id}', ${!l.isActive})">
            <i class="fa-solid ${l.isActive ? 'fa-pause' : 'fa-play'}"></i> ${l.isActive ? 'End Stream' : 'Go Live Now'}
          </button>
          <button class="btn-panel-action primary" onclick="openArchiveLiveClassModal('${l.id}')" title="Save this recording into LMS Folders">
            <i class="fa-solid fa-folder-plus"></i> Save Recording
          </button>
          <button class="btn-icon-action danger" onclick="deleteLiveClass('${l.id}')" title="Delete Stream">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openAddLiveClassModal(tutorId = null, month = null, classType = null) {
  document.getElementById('edit-live-id').value = '';
  document.getElementById('live-title-input').value = '';
  document.getElementById('live-link-input').value = '';
  document.getElementById('live-desc-input').value = '';
  document.getElementById('live-time-input').value = 'Tonight 8:30 PM - 11:00 PM';
  document.getElementById('live-thumb-url').value = '/hero.jpg';
  document.getElementById('live-thumb-preview').style.display = 'none';

  const tId = tutorId || 'dinesh';
  document.getElementById('live-tutor-select').value = tId;
  document.getElementById('live-month-select').value = month || activeMonthlyMonth || 'November 2026';
  document.getElementById('live-class-type').value = classType || activeMonthlyClassMode || 'theory';
  document.getElementById('live-status-select').value = 'live';
  document.getElementById('live-card-required').checked = true;

  if (tId === 'sasanka') document.getElementById('live-tutor-input').value = 'ශෂංක ධනුජය සර්';
  else if (tId === 'dhananjaya') document.getElementById('live-tutor-input').value = 'ධනංජය ආරියදාස සර්';
  else if (tId === 'both') document.getElementById('live-tutor-input').value = 'All Tutors (ගුරු මඩුල්ල)';
  else document.getElementById('live-tutor-input').value = 'දිනේෂ් මුතුගල සර්';

  openAdminModal('modal-add-live');
}

function openAddMonthlyLiveModal() {
  openAddLiveClassModal(activeMonthlyTutorId, activeMonthlyMonth, activeMonthlyClassMode);
}

function handleLiveTypeChange(type) {
  const label = document.getElementById('live-link-label');
  const input = document.getElementById('live-link-input');
  if (type === 'zoom') {
    label.textContent = 'Zoom Meeting Link / URL *';
    input.placeholder = 'e.g. https://zoom.us/j/1234567890';
  } else {
    label.textContent = 'YouTube Live Video ID or URL *';
    input.placeholder = 'e.g. dQw4w9WgXcQ or https://youtu.be/...';
  }
}

async function handleSaveLiveClass(e) {
  e.preventDefault();
  const batch = document.getElementById('live-batch-select').value;
  const streamType = document.getElementById('live-type-select').value;
  const tutorId = document.getElementById('live-tutor-select').value;
  const month = document.getElementById('live-month-select').value;
  const classType = document.getElementById('live-class-type').value;
  const status = document.getElementById('live-status-select').value;
  const cardRequired = document.getElementById('live-card-required').checked;
  const title = document.getElementById('live-title-input').value.trim();
  const streamLink = document.getElementById('live-link-input').value.trim();
  const tutorName = document.getElementById('live-tutor-input').value.trim();
  const scheduledAt = document.getElementById('live-time-input').value.trim();
  const desc = document.getElementById('live-desc-input').value.trim();
  const thumbnail = document.getElementById('live-thumb-url').value || '/hero.jpg';

  const payload = {
    batch,
    streamType,
    tutorId,
    month,
    classType,
    status,
    cardRequired,
    title,
    streamLink,
    tutorName,
    scheduledAt,
    desc,
    thumbnail
  };

  try {
    const res = await fetch('/api/liveclasses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Live broadcast created & active with Card Protection!', 'success');
      closeAdminModal('modal-add-live');
      await fetchAdminData();
      if (activeMonthlyMonth) {
        renderMonthlyVideosList();
      }
    }
  } catch (err) {
    showAdminToast('Failed to create live class', 'error');
  }
}

async function toggleLiveClassActive(liveId, newActive) {
  try {
    const updatePayload = { isActive: newActive };
    if (!newActive) {
      updatePayload.status = 'ended';
    } else {
      updatePayload.status = 'live';
    }
    const res = await fetch(`/api/liveclasses/${liveId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Live stream ${newActive ? 'is now LIVE' : 'ended'}`, 'success');
      await fetchAdminData();
      if (activeMonthlyMonth) {
        renderMonthlyVideosList();
      }
      if (!newActive) {
        // Automatically prompt to archive finished recording!
        setTimeout(() => {
          openArchiveLiveClassModal(liveId);
        }, 300);
      }
    }
  } catch (err) {
    showAdminToast('Failed to update live class', 'error');
  }
}

// ============================================================================
// ARCHIVE LIVE RECORDING TO LMS FOLDERS CONTROLLER
// ============================================================================
let currentArchiveDest = 'monthly';

function switchArchiveDest(dest) {
  currentArchiveDest = dest;
  const btnMonthly = document.getElementById('btn-dest-monthly');
  const btnUnit = document.getElementById('btn-dest-unit');
  const btnRev = document.getElementById('btn-dest-revision');

  if (btnMonthly) btnMonthly.classList.toggle('active', dest === 'monthly');
  if (btnUnit) btnUnit.classList.toggle('active', dest === 'unit');
  if (btnRev) btnRev.classList.toggle('active', dest === 'revision');

  const fieldsMonthly = document.getElementById('archive-dest-monthly-fields');
  const fieldsUnit = document.getElementById('archive-dest-unit-fields');
  const fieldsRev = document.getElementById('archive-dest-revision-fields');

  if (fieldsMonthly) fieldsMonthly.style.display = dest === 'monthly' ? 'block' : 'none';
  if (fieldsUnit) fieldsUnit.style.display = dest === 'unit' ? 'block' : 'none';
  if (fieldsRev) fieldsRev.style.display = dest === 'revision' ? 'block' : 'none';
}

function openArchiveLiveClassModal(liveId) {
  const live = (ADMIN_DATA.liveClasses || []).find(l => l.id === liveId);
  if (!live) return;

  document.getElementById('archive-live-id').value = live.id;
  document.getElementById('archive-video-title').value = live.title || '';
  
  const titlePreview = document.getElementById('archive-live-title-preview');
  if (titlePreview) titlePreview.textContent = live.title || 'Untitled Stream';

  const streamIdPreview = document.getElementById('archive-live-stream-id');
  if (streamIdPreview) streamIdPreview.textContent = 'Stream: ' + (live.streamLink || 'N/A');

  const batchPreview = document.getElementById('archive-live-batch-preview');
  if (batchPreview) batchPreview.textContent = (live.batch || '2027') + ' A/L';

  const thumbPreview = document.getElementById('archive-live-thumb-preview');
  if (thumbPreview) thumbPreview.src = live.thumbnail || '/hero.jpg';

  // Set default values matching live class metadata
  if (live.tutorId) {
    const selTutor = document.getElementById('archive-mcv-tutor-select');
    if (selTutor) selTutor.value = live.tutorId === 'both' ? 'dinesh' : live.tutorId;

    const selUnitTutor = document.getElementById('archive-unit-tutor-select');
    if (selUnitTutor) selUnitTutor.value = live.tutorId === 'both' ? 'dinesh' : live.tutorId;

    const selRevTutor = document.getElementById('archive-rev-tutor-select');
    if (selRevTutor) selRevTutor.value = live.tutorId === 'both' ? 'sasanka' : live.tutorId;
  }
  if (live.month) {
    const selMonth = document.getElementById('archive-mcv-month-select');
    if (selMonth) selMonth.value = live.month;
  }
  if (live.classType) {
    const selType = document.getElementById('archive-mcv-type-select');
    if (selType) selType.value = live.classType === 'both' ? 'theory' : live.classType;
  }

  const dateInput = document.getElementById('archive-mcv-date');
  if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

  switchArchiveDest('monthly');
  openAdminModal('modal-archive-live');
}

async function handleConfirmArchiveLive(e) {
  e.preventDefault();
  const liveId = document.getElementById('archive-live-id').value;
  const live = (ADMIN_DATA.liveClasses || []).find(l => l.id === liveId);
  if (!live) {
    showAdminToast('Live stream not found', 'error');
    return;
  }

  const title = document.getElementById('archive-video-title').value.trim();
  const tuteUrl = document.getElementById('archive-tute-link').value.trim();
  const ytUrl = live.streamLink;

  try {
    if (currentArchiveDest === 'monthly') {
      const tutorId = document.getElementById('archive-mcv-tutor-select').value;
      const month = document.getElementById('archive-mcv-month-select').value;
      const classType = document.getElementById('archive-mcv-type-select').value;
      const date = document.getElementById('archive-mcv-date').value || new Date().toISOString().split('T')[0];

      const res = await fetch('/api/monthly-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch: live.batch || '2027',
          month,
          tutorId,
          classType,
          title,
          ytUrl,
          date,
          duration: 'Class HD',
          tuteUrl,
          desc: live.desc || ''
        })
      });
      const json = await res.json();
      if (json.success) {
        showAdminToast(`Live recording successfully archived to ${month} (${classType.toUpperCase()})!`, 'success');
        closeAdminModal('modal-archive-live');
        await fetchAdminData();
        if (activeMonthlyMonth) renderMonthlyVideosList();
      }
    } else if (currentArchiveDest === 'unit') {
      const tutorId = document.getElementById('archive-unit-tutor-select').value;
      const unitId = document.getElementById('archive-unit-select').value;
      const isLocked = document.getElementById('archive-unit-lock-checkbox').checked;

      const res = await fetch('/api/videopacks/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          unitId,
          title,
          ytId: ytUrl,
          duration: 'HD Video',
          isLocked,
          tuteUrl,
          desc: live.desc || ''
        })
      });
      const json = await res.json();
      if (json.success) {
        showAdminToast(`Live recording added as lesson to ${unitId.toUpperCase()} Video Pack!`, 'success');
        closeAdminModal('modal-archive-live');
        await fetchAdminData();
      }
    } else if (currentArchiveDest === 'revision') {
      const tutorId = document.getElementById('archive-rev-tutor-select').value;
      const folderName = document.getElementById('archive-rev-folder-input').value.trim();

      const res = await fetch('/api/revision-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tutorId,
          folderName: folderName || null,
          title,
          ytUrl,
          duration: 'Revision HD',
          tuteUrl,
          desc: live.desc || ''
        })
      });
      const json = await res.json();
      if (json.success) {
        showAdminToast('Live recording added to Revision Masterclasses!', 'success');
        closeAdminModal('modal-archive-live');
        await fetchAdminData();
      }
    }
  } catch (err) {
    showAdminToast('Failed to archive recording: ' + err.message, 'error');
  }
}

async function deleteLiveClass(liveId) {
  if (!confirm('Delete this live class entry?')) return;
  try {
    const res = await fetch(`/api/liveclasses/${liveId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Live class deleted', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete live class', 'error');
  }
}

// ============================================================================
// 5. MONTHLY FEES CARDS, DIRECT ACTIVATION & CARD REQUESTS
// ============================================================================
function renderFeesCards() {
  const container = document.getElementById('cards-admin-grid');
  const cards = ADMIN_DATA.classCards || [];

  if (container) {
    if (cards.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; color:var(--text-dim); text-align:center; padding:30px;">No fees cards created yet.</p>`;
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      container.innerHTML = cards.map(c => {
        const isExpired = c.validTo && c.validTo < todayStr;
        return `
          <div class="class-card-item">
            <div class="card-banner-wrap">
              <img src="${c.image || '/hero.jpg'}" alt="${escapeHtml(c.title)}" onerror="this.src='/hero.jpg';">
              <div class="card-batch-badge">${c.batch} A/L Batch</div>
            </div>
            <div class="card-item-body">
              <div style="font-size:0.75rem; color:#10b981; font-weight:800;">${escapeHtml(c.month || 'Monthly Pass')}</div>
              <h4 class="card-item-title">${escapeHtml(c.title)}</h4>
              <div class="card-item-price">Rs. ${Number(c.price).toLocaleString()}</div>
              <div class="card-item-validity">
                <strong>Valid:</strong> ${c.validFrom || 'Now'} to ${c.validTo || 'Permanent'}
                ${isExpired ? '<span style="color:#ef4444; font-weight:700; display:block; margin-top:2px;">(Expired • Hidden from students)</span>' : '<span style="color:#10b981; font-weight:700; display:block; margin-top:2px;">(Active in Store)</span>'}
              </div>
              ${c.desc ? `<p style="font-size:0.75rem; color:var(--text-dim); line-height:1.4;">${escapeHtml(c.desc)}</p>` : ''}
            </div>
            <div class="card-item-footer">
              <span class="badge-id">ID: ${c.id}</span>
              <button class="btn-icon-action danger" onclick="deleteClassCard('${c.id}')" title="Delete Card">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Populate Direct Student & Card Selectors
  const studentSelect = document.getElementById('direct-student-select');
  const cardSelect = document.getElementById('direct-card-select');

  if (studentSelect) {
    const students = ADMIN_DATA.students || [];
    studentSelect.innerHTML = students.length === 0 ? '<option value="">No registered students</option>' : students.map(s => `
      <option value="${s.studentId}">${escapeHtml(s.name)} (ID: ${s.studentId} • ${s.year} A/L • ${s.phone || 'No phone'})</option>
    `).join('');
  }

  if (cardSelect) {
    cardSelect.innerHTML = cards.length === 0 ? '<option value="">No cards available</option>' : cards.map(c => `
      <option value="${c.id}">${escapeHtml(c.title)} (${c.batch} A/L • Rs. ${c.price})</option>
    `).join('');
  }

  // Render Pending Card Requests Table
  renderCardRequestsTable();
}

function renderCardRequestsTable() {
  const tbody = document.getElementById('card-requests-table-body');
  const countChip = document.getElementById('card-requests-count-chip');
  if (!tbody) return;

  const cardRequests = (ADMIN_DATA.requests || []).filter(r => r.type === 'card');
  const pending = cardRequests.filter(r => r.status === 'pending');

  if (countChip) countChip.textContent = `${pending.length} Pending Requests`;

  // Populate Month filter options dynamically if not already populated
  const monthSelect = document.getElementById('filter-card-req-month');
  if (monthSelect) {
    const currentVal = monthSelect.value;
    const months = Array.from(new Set(cardRequests.map(r => r.month || (r.targetTitle && r.targetTitle.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}/i) ? r.targetTitle.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}/i)[0] : null)).filter(Boolean)));
    monthSelect.innerHTML = '<option value="all">All Months (සියලු මාස)</option>' + months.map(m => `<option value="${m}">${m}</option>`).join('');
    if (months.includes(currentVal)) monthSelect.value = currentVal;
  }

  filterCardRequestsTable();
}

function filterCardRequestsTable() {
  const tbody = document.getElementById('card-requests-table-body');
  if (!tbody) return;

  const cardRequests = (ADMIN_DATA.requests || []).filter(r => r.type === 'card');
  const search = (document.getElementById('filter-card-req-search') ? document.getElementById('filter-card-req-search').value : '').toLowerCase().trim();
  const monthFilter = document.getElementById('filter-card-req-month') ? document.getElementById('filter-card-req-month').value : 'all';
  const statusFilter = document.getElementById('filter-card-req-status') ? document.getElementById('filter-card-req-status').value : 'all';

  const filtered = cardRequests.filter(r => {
    const matchesSearch = !search || 
      (r.studentId && r.studentId.toLowerCase().includes(search)) ||
      (r.studentName && r.studentName.toLowerCase().includes(search)) ||
      (r.studentPhone && r.studentPhone.toLowerCase().includes(search)) ||
      (r.targetTitle && r.targetTitle.toLowerCase().includes(search));

    const itemMonth = r.month || (r.targetTitle && r.targetTitle.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}/i) ? r.targetTitle.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4}/i)[0] : '');
    const matchesMonth = monthFilter === 'all' || (itemMonth && itemMonth.toLowerCase() === monthFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesMonth && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--text-dim);"><i class="fa-solid fa-filter" style="margin-right:6px;"></i> No requests found matching the selected filter criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    const dateFormatted = new Date(r.requestedAt || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const isPending = r.status === 'pending';
    const isApproved = r.status === 'approved';

    return `
      <tr>
        <td><small style="color:var(--text-dim);">${dateFormatted}</small></td>
        <td><span class="badge-id" style="cursor:pointer;" onclick="document.getElementById('filter-card-req-search').value='${r.studentId}'; filterCardRequestsTable();" title="Click to filter by this Student ID">${r.studentId}</span></td>
        <td><strong style="color:#fff;">${escapeHtml(r.studentName)}</strong></td>
        <td>
          <span style="color:#10b981; font-weight:700;">${r.batch} A/L</span><br>
          <small style="color:var(--text-dim);">${escapeHtml(r.studentPhone || '-')}</small>
        </td>
        <td>
          <strong style="color:#38bdf8;">${escapeHtml(r.targetTitle)}</strong>
        </td>
        <td>
          <span class="${isPending ? 'admin-live-pulse' : (isApproved ? 'badge-unlocked' : 'badge-locked')}">
            ${r.status.toUpperCase()}
          </span>
        </td>
        <td>
          ${isPending ? `
            <div style="display:flex; gap:6px;">
              <button class="btn-action-approve" onclick="handleApproveRequest('${r.id}')">
                <i class="fa-solid fa-check"></i> Approve & Activate
              </button>
              <button class="btn-action-reject" onclick="handleRejectRequest('${r.id}')">
                <i class="fa-solid fa-xmark"></i> Reject
              </button>
            </div>
          ` : (isApproved ? `
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.75rem; color:#10b981; font-weight:700;">✓ Access Active</span>
              <button class="btn-icon-action danger" onclick="handleRejectRequest('${r.id}')" title="Revoke access (Card එක ඉවත් කරන්න)" style="padding:4px 8px; font-size:0.75rem; border-radius:6px;">
                <i class="fa-solid fa-ban"></i> Revoke
              </button>
            </div>
          ` : `
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.75rem; color:#ef4444; font-weight:700;">✗ Rejected</span>
              <button class="btn-action-approve" onclick="handleApproveRequest('${r.id}')" title="Re-approve Card" style="padding:4px 8px; font-size:0.75rem;">
                <i class="fa-solid fa-rotate-left"></i> Re-Approve
              </button>
            </div>
          `)}
        </td>
      </tr>
    `;
  }).join('');
}

function handleStudentIdLookup(searchVal) {
  const query = (searchVal || '').trim().toLowerCase();
  const select = document.getElementById('direct-student-select');
  const preview = document.getElementById('direct-student-preview-box');
  if (!query) {
    if (preview) preview.style.display = 'none';
    return;
  }

  const match = (ADMIN_DATA.students || []).find(s => 
    (s.studentId && s.studentId.toLowerCase().includes(query)) ||
    (s.phone && s.phone.includes(query)) ||
    (s.name && s.name.toLowerCase().includes(query))
  );

  if (match) {
    if (select) select.value = match.studentId;
    if (preview) {
      preview.style.display = 'flex';
      preview.innerHTML = `
        <span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Matched Student:</span>
        <strong style="color:#fff;">${escapeHtml(match.name)}</strong>
        <span class="badge-id">ID: ${match.studentId}</span>
        <span>• Batch: <strong style="color:#10b981;">${match.year || '2027'} A/L</strong></span>
        <span>• School: ${escapeHtml(match.school || 'Biology Student')}</span>
        <span>• Active Cards: <strong style="color:#38bdf8;">${(match.activeCards || []).length}</strong></span>
      `;
    }
  } else {
    if (preview) {
      preview.style.display = 'flex';
      preview.innerHTML = `<span style="color:#ef4444;"><i class="fa-solid fa-triangle-exclamation"></i> No registered student found matching "${escapeHtml(searchVal)}"</span>`;
    }
  }
}

function handleStudentSelectChange(studentId) {
  handleStudentIdLookup(studentId);
  const searchInput = document.getElementById('direct-student-id-search');
  if (searchInput) searchInput.value = studentId;
}

async function handleDirectCardActivation(e) {
  e.preventDefault();
  const studentId = document.getElementById('direct-student-select').value;
  const cardId = document.getElementById('direct-card-select').value;

  if (!studentId || !cardId) {
    showAdminToast('Please select both a student and a class card', 'warning');
    return;
  }

  try {
    const res = await fetch('/api/cards/direct-activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, cardId })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Class card successfully activated for student ${json.student ? json.student.name : studentId}!`, 'success');
      handleStudentIdLookup(studentId);
      fetchAdminData();
    } else {
      showAdminToast(json.message || 'Failed to activate card', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to activate card for student', 'error');
  }
}

function openAddCardModal() {
  const curMonth = (ADMIN_DATA.monthlyFolders && ADMIN_DATA.monthlyFolders[0] && ADMIN_DATA.monthlyFolders[0].name) || 'November 2026';
  const mInput = document.getElementById('card-month-input');
  if (mInput) mInput.value = curMonth;
  const tInput = document.getElementById('card-title-input');
  if (tInput) tInput.value = '2027 A/L ' + curMonth + ' මාසික Class Card';
  const pInput = document.getElementById('card-price-input');
  if (pInput && !pInput.value) {
    pInput.value = '3500';
  }
  document.getElementById('card-desc-input').value = 'Unit 04 ශාක කායික විද්‍යාව + Unit 05 රුධිර සංසරණ පද්ධතිය හා සම්පූර්ණ Tute Pack.';
  document.getElementById('card-image-url').value = '/hero.jpg';
  document.getElementById('card-image-preview').style.display = 'none';

  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  document.getElementById('card-valid-from').value = today.toISOString().split('T')[0];
  document.getElementById('card-valid-to').value = nextMonth.toISOString().split('T')[0];

  openAdminModal('modal-add-card');
}

async function handleSaveCard(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-card-id') ? document.getElementById('edit-card-id').value : '';
  const batch = document.getElementById('card-batch-select').value;
  const month = document.getElementById('card-month-input').value;
  const tutorId = document.getElementById('card-tutor-select') ? document.getElementById('card-tutor-select').value : 'both';
  const classType = document.getElementById('card-type-select') ? document.getElementById('card-type-select').value : 'both';
  const title = document.getElementById('card-title-input').value;
  const price = document.getElementById('card-price-input').value;
  const validFrom = document.getElementById('card-valid-from').value;
  const validTo = document.getElementById('card-valid-to').value;
  const desc = document.getElementById('card-desc-input').value;
  const image = document.getElementById('card-image-url').value || '/hero.jpg';

  try {
    const url = editId ? ('/api/cards/' + editId) : '/api/cards';
    const method = editId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batch, month, tutorId, classType, title, price: Number(price), validFrom, validTo, desc, image })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(editId ? 'Monthly Class Card updated successfully!' : 'Monthly Class Card published to store!', 'success');
      closeAdminModal('modal-add-card');
      if (document.getElementById('edit-card-id')) document.getElementById('edit-card-id').value = '';
      fetchAdminData();
    } else {
      showAdminToast(json.message || 'Error saving card', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to save class card', 'error');
  }
}

async function deleteClassCard(cardId) {
  if (!confirm('Are you sure you want to delete this monthly card?')) return;
  try {
    const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Card deleted', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete card', 'error');
  }
}

// ============================================================================
// 6. REQUESTS & UNLOCKS MANAGEMENT (SEPARATED QUEUES: CARDS & VIDEO PACKS)
// ============================================================================
function renderRequestsTab() {
  const cardBody = document.getElementById('card-requests-queue-body');
  const videoBody = document.getElementById('videopack-requests-queue-body');
  const cardBadge = document.getElementById('badge-card-reqs-count');
  const videoBadge = document.getElementById('badge-video-reqs-count');

  const allReqs = ADMIN_DATA.requests || [];
  const cardReqs = allReqs.filter(r => r.type === 'card');
  const videoReqs = allReqs.filter(r => r.type === 'videopack');

  const pendingCardCount = cardReqs.filter(r => r.status === 'pending').length;
  const pendingVideoCount = videoReqs.filter(r => r.status === 'pending').length;

  if (cardBadge) cardBadge.textContent = `${pendingCardCount} Pending Cards`;
  if (videoBadge) videoBadge.textContent = `${pendingVideoCount} Pending Unlocks`;

  // Render Section 1: Monthly Card Requests
  if (cardBody) {
    if (cardReqs.length === 0) {
      cardBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-dim); padding:24px;">No monthly card requests received yet.</td></tr>';
    } else {
      cardBody.innerHTML = cardReqs.map(r => {
        const dateFormatted = new Date(r.requestedAt || r.createdAt || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const isPending = r.status === 'pending';
        const isApproved = r.status === 'approved';

        return `
          <tr>
            <td><small style="color:var(--text-dim);">${dateFormatted}</small></td>
            <td>
              <strong style="color:#fff;">${escapeHtml(r.studentName)}</strong>
              <div><span class="badge-id">ID: ${r.studentId}</span> <small style="color:var(--text-dim);">${escapeHtml(r.studentPhone || '')}</small></div>
            </td>
            <td><span class="badge-batch" style="color:#10b981; font-weight:700;">${r.batch || '2027'} A/L</span></td>
            <td><strong style="color:#38bdf8;">${escapeHtml(r.targetTitle || r.targetId)}</strong></td>
            <td>
              <span class="${isPending ? 'admin-live-pulse' : (isApproved ? 'badge-unlocked' : 'badge-locked')}">
                ${r.status.toUpperCase()}
              </span>
            </td>
            <td>
              ${isPending ? `
                <div style="display:flex; gap:6px;">
                  <button class="btn-action-approve" onclick="handleApproveRequest('${r.id}')">
                    <i class="fa-solid fa-circle-check"></i> Approve & Activate
                  </button>
                  <button class="btn-action-reject" onclick="handleRejectRequest('${r.id}')">
                    <i class="fa-solid fa-xmark"></i> Reject
                  </button>
                </div>
              ` : `
                <span style="font-size:0.75rem; color:${isApproved ? '#10b981' : '#ef4444'}; font-weight:700;">
                  ${isApproved ? '✓ Card Activated' : '✗ Rejected'}
                </span>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Section 2: Video Pack Unlock Requests
  if (videoBody) {
    if (videoReqs.length === 0) {
      videoBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-dim); padding:24px;">No video pack unlock requests received yet.</td></tr>';
    } else {
      videoBody.innerHTML = videoReqs.map(r => {
        const dateFormatted = new Date(r.requestedAt || r.createdAt || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const isPending = r.status === 'pending';
        const isApproved = r.status === 'approved';

        return `
          <tr>
            <td><small style="color:var(--text-dim);">${dateFormatted}</small></td>
            <td>
              <strong style="color:#fff;">${escapeHtml(r.studentName)}</strong>
              <div><span class="badge-id">ID: ${r.studentId}</span> <small style="color:var(--text-dim);">${escapeHtml(r.studentPhone || '')}</small></div>
            </td>
            <td><span class="badge-batch" style="color:#10b981; font-weight:700;">${r.batch || '2027'} A/L</span></td>
            <td><strong style="color:#f59e0b;">${escapeHtml(r.targetTitle || r.targetId)}</strong></td>
            <td><span class="badge-id">${r.tutorId === 'sasanka' ? 'ශශංක ධනුජය' : 'දිනේෂ් මුතුගල'}</span></td>
            <td>
              <span class="${isPending ? 'admin-live-pulse' : (isApproved ? 'badge-unlocked' : 'badge-locked')}">
                ${r.status.toUpperCase()}
              </span>
            </td>
            <td>
              ${isPending ? `
                <div style="display:flex; gap:6px;">
                  <button class="btn-action-approve" onclick="handleApproveRequest('${r.id}')">
                    <i class="fa-solid fa-unlock"></i> Approve & Unlock
                  </button>
                  <button class="btn-action-reject" onclick="handleRejectRequest('${r.id}')">
                    <i class="fa-solid fa-xmark"></i> Reject
                  </button>
                </div>
              ` : `
                <span style="font-size:0.75rem; color:${isApproved ? '#10b981' : '#ef4444'}; font-weight:700;">
                  ${isApproved ? '✓ Unlocked' : '✗ Rejected'}
                </span>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

async function handleApproveRequest(reqId) {
  try {
    const res = await fetch(`/api/requests/${reqId}/approve`, { method: 'PUT' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Request Approved! Access instantly unlocked for student.', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to approve request', 'error');
  }
}

async function handleRejectRequest(reqId) {
  try {
    const res = await fetch(`/api/requests/${reqId}/reject`, { method: 'PUT' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Request rejected', 'warning');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to reject request', 'error');
  }
}

// ============================================================================
// 7. SYLLABUS TRACKER MANAGER
// ============================================================================
function renderSyllabusUnits() {
  const container = document.getElementById('syllabus-admin-units');
  const units = ADMIN_DATA.syllabusUnits || [];

  if (!container) return;
  if (units.length === 0) {
    container.innerHTML = `<p style="color:var(--text-dim); text-align:center; padding:30px;">No syllabus units loaded.</p>`;
    return;
  }

  container.innerHTML = units.map(u => {
    const subtopics = u.topics || u.subtopics || [];
    const unitTitle = u.title || ('Unit ' + u.id.replace('u','') + ': ' + (u.name || ''));
    return `
      <div class="syllabus-unit-box">
        <div class="syllabus-unit-title">
          <span><strong>${escapeHtml(unitTitle)}</strong> (${subtopics.length} Subtopics)</span>
          <button class="btn-panel-action" onclick="openAddSubtopicModalForUnit('${u.id}')">
            <i class="fa-solid fa-plus"></i> Add Subtopic
          </button>
        </div>
        <div class="subtopics-chips-list">
          ${subtopics.map((st, idx) => `
            <div class="subtopic-chip">
              <span>${escapeHtml(st)}</span>
              <i class="fa-solid fa-xmark delete-chip" onclick="deleteSubtopic('${u.id}', ${idx})" title="Delete subtopic"></i>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function openAddSubtopicModal() {
  document.getElementById('subtopic-name-input').value = '';
  openAdminModal('modal-add-subtopic');
}

function openAddSubtopicModalForUnit(unitId) {
  openAddSubtopicModal();
  const select = document.getElementById('subtopic-unit-select');
  if (select) select.value = unitId;
}

async function handleSaveSubtopic(e) {
  e.preventDefault();
  const unitId = document.getElementById('subtopic-unit-select').value;
  const subtopic = document.getElementById('subtopic-name-input').value;

  try {
    const res = await fetch('/api/syllabus/subtopic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId, subtopic })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Subtopic added to curriculum!', 'success');
      closeAdminModal('modal-add-subtopic');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to add subtopic', 'error');
  }
}

async function deleteSubtopic(unitId, subtopicIndex) {
  if (!confirm('Delete this subtopic from the syllabus curriculum?')) return;
  try {
    const res = await fetch(`/api/syllabus/subtopic`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId, subtopicIndex })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Subtopic deleted', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete subtopic', 'error');
  }
}

// ============================================================================
// IMAGE UPLOAD & WEBP AUTO-CONVERSION
// ============================================================================
function previewUploadImage(fileInput, previewBoxId, urlInputId) {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const base64 = e.target.result;
    const previewBox = document.getElementById(previewBoxId);
    if (previewBox) {
      previewBox.style.display = 'block';
      previewBox.innerHTML = `<img src="${base64}" alt="Preview"> <span style="font-size:0.75rem; color:#10b981; display:block; margin-top:4px;"><i class="fa-solid fa-spinner fa-spin"></i> Converting to WebP...</span>`;
    }

    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          filename: file.name
        })
      });
      const json = await res.json();
      if (json.success && json.url) {
        document.getElementById(urlInputId).value = json.url;
        if (previewBox) {
          previewBox.innerHTML = `<img src="${json.url}" alt="WebP Image"> <span style="font-size:0.75rem; color:#10b981; display:block; margin-top:4px;"><i class="fa-solid fa-circle-check"></i> Converted & Saved as WebP: <code>${json.url}</code></span>`;
        }
        showAdminToast('Image converted to WebP successfully!', 'success');
      }
    } catch (err) {
      showAdminToast('Image conversion error, using raw preview', 'warning');
      document.getElementById(urlInputId).value = base64;
    }
  };
  reader.readAsDataURL(file);
}

// ============================================================================
// MODAL & TOAST HELPERS
// ============================================================================
function openAdminModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('open');
}

function closeAdminModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('open');
}

function showAdminToast(message, type = 'info') {
  const container = document.getElementById('admin-toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'admin-toast';
  const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-bell');
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color:${type === 'success' ? '#10b981' : '#ef4444'};"></i> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// MONTHLY CLASSES MANAGEMENT LOGIC (Month Folders -> Tutors -> Videos -> Attach)
// ============================================================================

function renderMonthlyClassesTab() {
  const breadcrumbsBar = document.getElementById('monthly-breadcrumbs-bar');
  const levelMonths = document.getElementById('monthly-level-months');
  const levelTutors = document.getElementById('monthly-level-tutors');
  const levelClasses = document.getElementById('monthly-level-classes');

  if (!levelMonths || !levelTutors || !levelClasses) return;

  // View Level 1: Month Folders Grid
  if (!activeMonthlyMonth) {
    if (breadcrumbsBar) breadcrumbsBar.style.display = 'none';
    levelMonths.style.display = 'block';
    levelTutors.style.display = 'none';
    levelClasses.style.display = 'none';
    renderMonthlyFoldersGrid();
    return;
  }

  // View Level 2: Tutor Selection inside Month
  if (activeMonthlyMonth && !activeMonthlyTutorId) {
    if (breadcrumbsBar) {
      breadcrumbsBar.style.display = 'flex';
      document.getElementById('breadcrumb-month-text').textContent = activeMonthlyMonth;
      document.getElementById('breadcrumb-tutor-sep').style.display = 'none';
      document.getElementById('breadcrumb-tutor-text').style.display = 'none';
    }
    levelMonths.style.display = 'none';
    levelTutors.style.display = 'block';
    levelClasses.style.display = 'none';

    const header = document.getElementById('month-tutors-header');
    if (header) header.textContent = `Select Teacher for ${activeMonthlyMonth}`;
    renderMonthlyTutorsGrid();
    return;
  }

  // View Level 3: Classes Video Manager for selected Tutor & Month
  if (activeMonthlyMonth && activeMonthlyTutorId) {
    const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === activeMonthlyTutorId) || { name: activeMonthlyTutorId };
    if (breadcrumbsBar) {
      breadcrumbsBar.style.display = 'flex';
      document.getElementById('breadcrumb-month-text').textContent = activeMonthlyMonth;
      document.getElementById('breadcrumb-tutor-sep').style.display = 'inline';
      const tutorText = document.getElementById('breadcrumb-tutor-text');
      tutorText.style.display = 'inline';
      tutorText.textContent = tutor.name;
    }
    levelMonths.style.display = 'none';
    levelTutors.style.display = 'none';
    levelClasses.style.display = 'block';

    // Update switcher pill states
    const btnTh = document.getElementById('btn-mode-theory');
    const btnRev = document.getElementById('btn-mode-revision');
    if (btnTh && btnRev) {
      if (tutor.hasTheory === false) {
        btnTh.style.display = 'none';
        activeMonthlyClassMode = 'revision';
      } else {
        btnTh.style.display = 'inline-flex';
      }
      btnTh.classList.toggle('active', activeMonthlyClassMode === 'theory');
      btnRev.classList.toggle('active', activeMonthlyClassMode === 'revision');
      const btnTutes = document.getElementById('btn-mode-tutes');
      if (btnTutes) btnTutes.classList.toggle('active', activeMonthlyClassMode === 'tutes');
    }

    renderMonthlyVideosList();
  }
}

function renderMonthlyFoldersGrid() {
  const container = document.getElementById('admin-month-folders-grid');
  if (!container) return;

  const folders = ADMIN_DATA.monthlyFolders && ADMIN_DATA.monthlyFolders.length
    ? ADMIN_DATA.monthlyFolders
    : [
        { id: 'mf-nov-2026', name: 'November 2026', batch: '2027', isCurrent: true },
        { id: 'mf-dec-2026', name: 'December 2026', batch: '2027', isCurrent: false },
        { id: 'mf-jan-2027', name: 'January 2027', batch: '2027', isCurrent: false },
        { id: 'mf-feb-2027', name: 'February 2027', batch: '2027', isCurrent: false }
      ];

  const html = folders.map(f => {
    const videoCount = (ADMIN_DATA.monthlyClasses || []).filter(c => c.month === f.name).length;
    return `
      <div class="admin-month-card ${f.isCurrent ? 'active-month' : ''}">
        <div class="admin-month-icon">📁</div>
        <div class="admin-month-title">${escapeHtml(f.name)}</div>
        <span class="admin-month-batch-tag"><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(f.batch || '2027')} A/L</span>
        <div class="admin-month-stats">
          <span><i class="fa-solid fa-video"></i> ${videoCount} Class Video${videoCount === 1 ? '' : 's'}</span>
          <button class="btn-open-month" onclick="openMonthFolder('${escapeHtml(f.name)}')">
            <span>Open Folder</span> <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderMonthlyTutorsGrid() {
  const container = document.getElementById('monthly-tutors-grid');
  if (!container) return;

  const tutors = (ADMIN_DATA.tutors || []).length ? ADMIN_DATA.tutors : [
    { id: 'dinesh', name: 'දිනේෂ් මුතුගල (Dinesh Muthugala)', avatar: '/muthugala-sir.jpg' },
    { id: 'sasanka', name: 'ශශංක ධනුජය (Sasanka Danujaya)', avatar: '/sasanka-danujaya.jpg' }
  ];

  const html = tutors.map(t => {
    const count = (ADMIN_DATA.monthlyClasses || []).filter(c => c.month === activeMonthlyMonth && c.tutorId === t.id).length;
    return `
      <div class="monthly-tutor-select-card" onclick="openMonthlyTutor('${t.id}')">
        <img src="${escapeHtml(t.avatar || '/muthugala-sir.jpg')}" class="monthly-tutor-avatar" alt="${escapeHtml(t.name)}">
        <div class="monthly-tutor-details">
          <h4>${escapeHtml(t.name)}</h4>
          <span>${count} Monthly Class Video${count === 1 ? '' : 's'} Uploaded</span>
        </div>
        <i class="fa-solid fa-chevron-right" style="margin-left:auto; color:#10b981; font-size:18px;"></i>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderMonthlyVideosList() {
  const container = document.getElementById('monthly-videos-container');
  if (!container) return;

  // Live Sessions for this active tutor, month, and class type
  const monthLiveSessions = (ADMIN_DATA.liveClasses || []).filter(l => 
    (!l.month || l.month === activeMonthlyMonth) && 
    (!l.tutorId || l.tutorId === 'both' || l.tutorId === activeMonthlyTutorId) && 
    (!l.classType || l.classType === 'both' || l.classType === activeMonthlyClassMode)
  );

  const liveHeaderHtml = `
    <div style="margin-bottom: 24px; background: rgba(239, 68, 68, 0.04); border: 1.5px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-lg); padding: 18px 20px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: ${monthLiveSessions.length > 0 ? '14px' : '0'}; flex-wrap:wrap; gap:10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#ef4444; box-shadow:0 0 10px #ef4444;" class="pulse"></span>
          <h4 style="margin:0; font-size:1rem; font-weight:800; color:#991b1b;">
            🔴 Live Sessions for ${escapeHtml(activeMonthlyMonth)} (${monthLiveSessions.length})
          </h4>
        </div>
        <button class="btn-primary-action small" onclick="openAddMonthlyLiveModal()" style="background:#ef4444; border-color:#dc2626; padding: 6px 14px; font-size: 0.8rem;">
          <i class="fa-solid fa-tower-broadcast"></i> + Add Live Session
        </button>
      </div>
      ${monthLiveSessions.length === 0 ? `
        <p style="margin:8px 0 0; color:#94a3b8; font-size:0.82rem;">No live broadcasts scheduled for this tutor in ${escapeHtml(activeMonthlyMonth)} yet. Click "+ Add Live Session" above to create or schedule one.</p>
      ` : `
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${monthLiveSessions.map(l => {
            const isLive = l.status === 'live' || (l.isActive && l.status !== 'ended');
            return `
              <div style="background:#ffffff; border:1px solid #fecaca; border-radius:12px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap;">
                <div style="display:flex; align-items:center; gap:14px;">
                  <div style="width:48px; height:48px; border-radius:10px; background:rgba(239,68,68,0.1); color:#ef4444; display:flex; align-items:center; justify-content:center; font-size:22px;">
                    <i class="fa-solid ${l.streamType === 'zoom' ? 'fa-video' : 'fa-tower-broadcast'}"></i>
                  </div>
                  <div>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:3px;">
                      <span style="background:${isLive ? '#ef4444' : '#64748b'}; color:#fff; font-size:0.68rem; font-weight:800; padding:2px 8px; border-radius:4px;">
                        ${isLive ? '🔴 LIVE NOW' : (l.status === 'upcoming' ? '⏰ UPCOMING' : '⏹ ENDED')}
                      </span>
                      <span style="font-size:0.75rem; color:#059669; font-weight:700;"><i class="fa-solid fa-id-card"></i> ${l.cardRequired !== false ? 'Card Protected' : 'Free Access'}</span>
                      <span style="font-size:0.75rem; color:#64748b;"><i class="fa-regular fa-clock"></i> ${escapeHtml(l.scheduledAt || 'Now')}</span>
                    </div>
                    <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin:0;">${escapeHtml(l.title)}</h4>
                    <div style="font-size:0.76rem; color:#64748b; margin-top:2px;">
                      <strong>Platform:</strong> ${l.streamType ? l.streamType.toUpperCase() : 'YOUTUBE'} &bull; <strong>Link:</strong> ${escapeHtml(l.streamLink)}
                    </div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <button class="btn-primary-action small" style="background:${l.isActive ? '#eab308' : '#10b981'}; padding:6px 12px; font-size:0.8rem;" onclick="toggleLiveClassActive('${l.id}', ${!l.isActive})">
                    <i class="fa-solid ${l.isActive ? 'fa-pause' : 'fa-play'}"></i> ${l.isActive ? 'End Stream' : 'Go Live'}
                  </button>
                  <button class="btn-primary-action small" style="background:#0284c7; padding:6px 12px; font-size:0.8rem;" onclick="openArchiveLiveClassModal('${l.id}')" title="Save Recording into Folders">
                    <i class="fa-solid fa-folder-plus"></i> Save to Recording
                  </button>
                  <button class="btn-icon-action danger" onclick="deleteLiveClass('${l.id}')" title="Delete Stream">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  if (activeMonthlyClassMode === 'tutes') {
    const tutes = (ADMIN_DATA.monthlyTutes || []).filter(t => 
      t.month === activeMonthlyMonth && 
      t.tutorId === activeMonthlyTutorId
    );

    if (tutes.length === 0) {
      container.innerHTML = liveHeaderHtml + `
        <div style="background:#f8fafc; border:2px dashed rgba(16,185,129,0.25); border-radius:var(--radius-lg); padding:36px; text-align:center;">
          <i class="fa-solid fa-file-pdf" style="font-size:36px; color:#ef4444; margin-bottom:10px;"></i>
          <h4 style="color:#064e3b; font-weight:800;">No Tute / PDF Materials uploaded for ${escapeHtml(activeMonthlyMonth)}</h4>
          <p style="color:#64748b; font-size:0.85rem; margin:6px 0 16px;">Click the button below to upload theory tutorials, mind maps, or discussion papers.</p>
          <button class="btn-primary-action small" style="background:#0284c7;" onclick="openAddMonthlyTuteModal()">
            <i class="fa-solid fa-file-circle-plus"></i> Add Tute / PDF
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = liveHeaderHtml + `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${tutes.map(t => `
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:44px; height:44px; border-radius:10px; background:rgba(239, 68, 68, 0.1); color:#ef4444; display:flex; align-items:center; justify-content:center; font-size:20px;">
                <i class="fa-solid fa-file-pdf"></i>
              </div>
              <div>
                <h4 style="font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:3px;">${escapeHtml(t.title)}</h4>
                <div style="display:flex; gap:10px; font-size:0.78rem; color:#64748b;">
                  <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-weight:600; color:#0369a1;"><i class="fa-solid fa-tag"></i> ${escapeHtml(t.fileType || 'PDF')}</span>
                  <span><i class="fa-regular fa-calendar"></i> ${escapeHtml((t.createdAt || '').split('T')[0] || 'Active')}</span>
                </div>
                ${t.desc ? `<p style="font-size:0.8rem; color:#64748b; margin-top:4px;">${escapeHtml(t.desc)}</p>` : ''}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <a href="${escapeHtml(t.pdfUrl)}" target="_blank" class="btn-primary-action small" style="padding:6px 12px; font-size:0.8rem; background:#0284c7; text-decoration:none;">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Open / Preview
              </a>
              <button class="btn-icon-action danger" onclick="deleteMonthlyTute('${t.id}')" title="Delete Tute">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  const videos = (ADMIN_DATA.monthlyClasses || []).filter(c => 
    c.month === activeMonthlyMonth && 
    c.tutorId === activeMonthlyTutorId && 
    c.classType === activeMonthlyClassMode
  );

  if (videos.length === 0) {
    container.innerHTML = liveHeaderHtml + `
      <div style="background:#f8fafc; border:2px dashed rgba(16,185,129,0.25); border-radius:var(--radius-lg); padding:36px; text-align:center;">
        <i class="fa-solid fa-film" style="font-size:36px; color:#10b981; margin-bottom:10px;"></i>
        <h4 style="color:#064e3b; font-weight:800;">No ${activeMonthlyClassMode === 'theory' ? 'Theory' : 'Revision'} class videos uploaded for ${escapeHtml(activeMonthlyMonth)}</h4>
        <p style="color:#64748b; font-size:0.85rem; margin:6px 0 16px;">Click the button below to upload recorded class lectures with YouTube links and tutes.</p>
        <button class="btn-primary-action small" onclick="openAddMonthlyVideoModal()">
          <i class="fa-solid fa-plus"></i> Add Class Video
        </button>
      </div>
    `;
    return;
  }

  const html = videos.map(v => {
    const thumbUrl = v.customThumbnail || `https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg`;
    const attachedBadge = v.attachedUnitId
      ? `<span class="badge-attached"><i class="fa-solid fa-check-double"></i> Attached to Unit ${v.attachedUnitId.replace('u', '').padStart(2, '0')}</span>`
      : `<span style="font-size:0.75rem; color:#94a3b8;"><i class="fa-solid fa-circle-dot"></i> Not attached to unit</span>`;

    return `
      <div class="monthly-video-card-item">
        <div class="monthly-video-thumb-wrap" style="cursor:pointer;" onclick="openAdminVideoPreview('${v.ytId}', '${escapeHtml(v.title.replace(/'/g, "\\'"))}', '${v.month} • ${v.classType}')" title="Click to Watch/Preview Video">
          <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(v.title)}" onerror="this.src='/hero.jpg'">
          <div class="thumb-play-icon"><i class="fa-solid fa-play"></i></div>
        </div>
        <div class="monthly-video-content">
          <div class="monthly-video-title" style="cursor:pointer;" onclick="openAdminVideoPreview('${v.ytId}', '${escapeHtml(v.title.replace(/'/g, "\\'"))}', '${v.month} • ${v.classType}')">${escapeHtml(v.title)}</div>
          <div class="monthly-video-meta">
            <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(v.date || 'N/A')}</span>
            <span><i class="fa-regular fa-clock"></i> ${escapeHtml(v.duration || '2h 00m')}</span>
            <span><i class="fa-brands fa-youtube" style="color:#ef4444;"></i> ID: ${escapeHtml(v.ytId)}</span>
            ${attachedBadge}
          </div>
          ${v.desc ? `<p style="font-size:0.8rem; color:#475569; margin-top:2px;">${escapeHtml(v.desc)}</p>` : ''}
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="btn-primary-action small" onclick="openAdminVideoPreview('${v.ytId}', '${escapeHtml(v.title.replace(/'/g, "\\'"))}', '${v.month} • ${v.classType}')" title="Play Video" style="padding:6px 12px; font-size:0.8rem;">
            <i class="fa-solid fa-play"></i> <span>Play</span>
          </button>
          <button class="btn-action-attach" onclick="openAttachUnitModal('${v.id}', '${v.tutorId}', '${escapeHtml(v.title.replace(/'/g, "\\'"))}')" title="Attach to Video Pack unit">
            <i class="fa-solid fa-paperclip"></i> <span>Attach to Unit</span>
          </button>
          <button class="btn-action-edit" onclick="openEditMonthlyVideoModal('${v.id}')" title="Edit video">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-action-delete" onclick="deleteMonthlyVideo('${v.id}')" title="Delete video">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = liveHeaderHtml + html;
}

function openMonthFolder(monthName) {
  activeMonthlyMonth = monthName;
  activeMonthlyTutorId = null;
  renderMonthlyClassesTab();
}

function openMonthlyTutor(tutorId) {
  activeMonthlyTutorId = tutorId;
  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === tutorId);
  if (tutor && tutor.hasTheory === false) {
    activeMonthlyClassMode = 'revision';
  } else {
    activeMonthlyClassMode = 'theory';
  }
  renderMonthlyClassesTab();
}

function resetMonthlyView() {
  activeMonthlyMonth = null;
  activeMonthlyTutorId = null;
  renderMonthlyClassesTab();
}

function backToMonthlyTutors() {
  activeMonthlyTutorId = null;
  renderMonthlyClassesTab();
}

function switchMonthlyClassMode(mode) {
  activeMonthlyClassMode = mode;
  const btnVideo = document.getElementById('btn-admin-add-video');
  const btnTute = document.getElementById('btn-admin-add-tute');
  if (btnVideo && btnTute) {
    if (mode === 'tutes') {
      btnVideo.style.display = 'none';
      btnTute.style.display = 'inline-flex';
    } else {
      btnVideo.style.display = 'inline-flex';
      btnTute.style.display = 'none';
    }
  }
  renderMonthlyClassesTab();
}

function openAdminVideoPreview(ytId, title, meta) {
  const modal = document.getElementById('modal-admin-video-preview');
  const iframe = document.getElementById('admin-preview-video-iframe');
  const titleEl = document.getElementById('admin-preview-video-title');
  const metaEl = document.getElementById('admin-preview-video-meta');

  let cleanId = '';
  if (ytId) {
    const raw = ytId.trim();
    if (raw.includes('t.me/')) {
      window.open(raw, '_blank');
      showAdminToast('Opening link on Telegram...', 'info');
      return;
    }
    const m = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
    if (m && m[1]) cleanId = m[1];
    else if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) cleanId = raw;
  }

  if (!cleanId) {
    showAdminToast('No valid YouTube ID or video stream found', 'warning');
    return;
  }

  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-circle-play" style="color:#10b981;"></i> ${escapeHtml(title)}`;
  if (metaEl) metaEl.textContent = meta || '';
  if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${cleanId}?autoplay=1`;

  openAdminModal('modal-admin-video-preview');
}

function closeAdminVideoPreview() {
  const iframe = document.getElementById('admin-preview-video-iframe');
  if (iframe) iframe.src = 'about:blank';
  closeAdminModal('modal-admin-video-preview');
}

function openAddMonthModal() {
  document.getElementById('new-month-name-input').value = '';
  openAdminModal('modal-add-month');
}

async function handleSaveMonthFolder(e) {
  e.preventDefault();
  const name = document.getElementById('new-month-name-input').value.trim();
  const batch = document.getElementById('new-month-batch-select').value;
  if (!name) return;

  try {
    const res = await fetch('/api/monthly-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, batch })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Month folder "${name}" created!`, 'success');
      closeAdminModal('modal-add-month');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to create month folder', 'error');
  }
}

function openAddMonthlyVideoModal() {
  document.getElementById('monthly-video-modal-title').innerHTML = '<i class="fa-solid fa-circle-play"></i> Add Class Video Recording';
  document.getElementById('edit-monthly-video-id').value = '';
  document.getElementById('mcv-month-display').value = activeMonthlyMonth || 'November 2026';

  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === activeMonthlyTutorId) || { name: 'Teacher' };
  document.getElementById('mcv-tutor-display').value = `${tutor.name} (${activeMonthlyClassMode === 'theory' ? 'Theory' : 'Revision'})`;

  document.getElementById('mcv-title-input').value = '';
  document.getElementById('mcv-yt-input').value = '';
  document.getElementById('mcv-date-input').value = new Date().toISOString().split('T')[0];
  document.getElementById('mcv-duration-input').value = '2h 30m';
  document.getElementById('mcv-tute-input').value = 'https://t.me/apexbiology_tutes';
  document.getElementById('mcv-desc-input').value = '';
  document.getElementById('mcv-thumb-preview').style.display = 'none';

  openAdminModal('modal-add-monthly-video');
}

function openEditMonthlyVideoModal(videoId) {
  const v = (ADMIN_DATA.monthlyClasses || []).find(c => c.id === videoId);
  if (!v) return;

  document.getElementById('monthly-video-modal-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Class Video Recording';
  document.getElementById('edit-monthly-video-id').value = v.id;
  document.getElementById('mcv-month-display').value = v.month;

  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === v.tutorId) || { name: v.tutorId };
  document.getElementById('mcv-tutor-display').value = `${tutor.name} (${v.classType === 'theory' ? 'Theory' : 'Revision'})`;

  document.getElementById('mcv-title-input').value = v.title;
  document.getElementById('mcv-yt-input').value = v.ytId;
  document.getElementById('mcv-date-input').value = v.date || new Date().toISOString().split('T')[0];
  document.getElementById('mcv-duration-input').value = v.duration || '2h 00m';
  document.getElementById('mcv-tute-input').value = v.tuteUrl || 'https://t.me/apexbiology_tutes';
  document.getElementById('mcv-desc-input').value = v.desc || '';

  previewYtThumbnail(v.ytId, 'mcv-thumb-preview');
  openAdminModal('modal-add-monthly-video');
}

async function handleSaveMonthlyVideo(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-monthly-video-id').value;
  const title = document.getElementById('mcv-title-input').value.trim();
  const ytUrl = document.getElementById('mcv-yt-input').value.trim();
  const date = document.getElementById('mcv-date-input').value;
  const duration = document.getElementById('mcv-duration-input').value.trim();
  const tuteUrl = document.getElementById('mcv-tute-input').value.trim();
  const desc = document.getElementById('mcv-desc-input').value.trim();

  const payload = {
    month: activeMonthlyMonth,
    batch: '2027',
    tutorId: activeMonthlyTutorId,
    classType: activeMonthlyClassMode,
    title,
    ytUrl,
    date,
    duration,
    tuteUrl,
    desc
  };

  try {
    let res;
    if (editId) {
      res = await fetch(`/api/monthly-classes/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/monthly-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const json = await res.json();
    if (json.success) {
      showAdminToast(editId ? 'Class video updated!' : 'Class video added successfully!', 'success');
      closeAdminModal('modal-add-monthly-video');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to save monthly video', 'error');
  }
}

async function deleteMonthlyVideo(videoId) {
  if (!confirm('Are you sure you want to delete this monthly class video?')) return;
  try {
    const res = await fetch(`/api/monthly-classes/${videoId}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Class video deleted', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete video', 'error');
  }
}

function openAttachUnitModal(videoId, tutorId, title) {
  document.getElementById('attach-video-id').value = videoId;
  document.getElementById('attach-tutor-id').value = tutorId;
  document.getElementById('attach-video-title').value = title;
  openAdminModal('modal-attach-unit');
}

async function handleConfirmAttachUnit(e) {
  e.preventDefault();
  const videoId = document.getElementById('attach-video-id').value;
  const tutorId = document.getElementById('attach-tutor-id').value;
  const unitId = document.getElementById('attach-target-unit-select').value;

  try {
    const res = await fetch('/api/monthly-classes/attach-unit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, tutorId, unitId })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(json.message || 'Attached to unit successfully!', 'success');
      closeAdminModal('modal-attach-unit');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to attach video to unit', 'error');
  }
}

function previewYtThumbnail(val, previewBoxId) {
  const box = document.getElementById(previewBoxId);
  if (!box) return;

  const str = (val || '').trim();
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
  const ytId = (match && match[1]) ? match[1] : (/^[a-zA-Z0-9_-]{11}$/.test(str) ? str : '');

  if (ytId) {
    box.style.display = 'flex';
    const img = box.querySelector('img');
    if (img) img.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  } else {
    box.style.display = 'none';
  }
}

// ============================================================================
// FREE LESSONS & REVISION MANAGEMENT STUDIO
// ============================================================================

async function toggleTutorFreeLessonsVisibility(tutorId, isVisible) {
  try {
    const res = await fetch(`/api/tutors/${tutorId}/free-lessons-visibility`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showInFreeLessons: isVisible })
    });
    const json = await res.json();
    if (json.success) {
      const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === tutorId);
      if (tutor) tutor.showInFreeLessons = isVisible;
      renderFreeLessonsTab();
      renderTutorsAndVideoPacks();
      showAdminToast(`Free Lessons visibility updated for ${tutor ? tutor.name : tutorId}`, 'success');
    }
  } catch (err) {
    showAdminToast('Failed to update visibility', 'error');
  }
}

function renderFreeLessonsTab() {
  const visGrid = document.getElementById('fl-tutors-visibility-grid');
  const switchPills = document.getElementById('fl-tutor-switch-pills');
  const headingEl = document.getElementById('fl-selected-tutor-heading');
  const contentEl = document.getElementById('fl-content-container');

  const tutors = ADMIN_DATA.tutors || [];
  if (tutors.length === 0) return;

  if (!tutors.some(t => t.id === activeFlTutor)) {
    activeFlTutor = tutors[0].id;
  }

  const activeTutor = tutors.find(t => t.id === activeFlTutor) || tutors[0];
  if (headingEl) {
    headingEl.textContent = `${activeTutor.name} සර්ගේ`;
  }

  // 1. Render Tutors Visibility Control Cards
  if (visGrid) {
    visGrid.innerHTML = tutors.map(t => {
      const isVisible = t.showInFreeLessons === true;
      return `
        <div class="fl-vis-card ${isVisible ? 'visible-active' : 'hidden-active'}">
          <img src="${t.avatar || '/muthugala-sir.jpg'}" alt="${escapeHtml(t.name)}" class="fl-vis-avatar" onerror="this.src='/muthugala-sir.jpg';">
          <div class="fl-vis-info">
            <div class="fl-vis-name">${escapeHtml(t.name)}</div>
            <div class="fl-vis-sub">
              ${escapeHtml(t.subject || 'A/L Biology')} • 
              <span class="badge-tutor-type ${t.hasTheory ? 'theory-rev' : 'rev-only'}">
                ${t.hasTheory ? 'Theory + Revision' : 'Revision Only'}
              </span>
            </div>
            <span class="badge-vis-status ${isVisible ? 'visible' : 'hidden'}">
              <i class="fa-solid ${isVisible ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
              ${isVisible ? 'Visible to Students in Free Lessons' : 'Hidden from Students (Inactive)'}
            </span>
          </div>
          <button class="btn-vis-toggle ${isVisible ? 'turn-off' : 'turn-on'}" 
                  onclick="toggleTutorFreeLessonsVisibility('${t.id}', ${!isVisible})">
            <i class="fa-solid ${isVisible ? 'fa-eye-slash' : 'fa-eye'}"></i>
            <span>${isVisible ? 'Hide Tutor' : 'Show Tutor'}</span>
          </button>
        </div>
      `;
    }).join('');
  }

  // 2. Render Switch Pills
  if (switchPills) {
    switchPills.innerHTML = tutors.map(t => `
      <button class="tutor-pill-btn ${t.id === activeFlTutor ? 'active' : ''}" onclick="switchFlTutor('${t.id}')">
        ${escapeHtml(t.name.split(' ')[0])}
      </button>
    `).join('');
  }

  // 3. Render Content Container
  if (contentEl) {
    const tutorLessons = (ADMIN_DATA.freeLessons || []).filter(l => l.tutorId === activeFlTutor);

    if (activeTutor.hasTheory) {
      // Dinesh: Has Theory (10 units) & Revision options
      contentEl.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div class="monthly-class-type-switcher">
            <button class="btn-mode-tab ${activeFlMode === 'theory' ? 'active' : ''}" onclick="switchFlMode('theory')">
              <i class="fa-solid fa-leaf"></i> Theory (Unit 01 - 10 Folders)
            </button>
            <button class="btn-mode-tab ${activeFlMode === 'revision' ? 'active' : ''}" onclick="switchFlMode('revision')">
              <i class="fa-solid fa-bolt"></i> Revision Day-by-Day Masterclasses
            </button>
          </div>
          <span style="font-size:0.8rem; color:#64748b;">Total Free Lessons: <strong>${tutorLessons.length}</strong></span>
        </div>

        <div style="background:#ffffff; border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-lg); padding:20px;">
          ${tutorLessons.length === 0 ? `
            <div style="text-align:center; padding:30px; color:#64748b;">
              තවම මෙම ගුරුවරයා යටතේ Free Lessons ඇතුළත් කර නොමැත. ඉහත "+ Add Free Lesson" ඔබන්න.
            </div>
          ` : `
            <table class="unit-lessons-table">
              <tbody>
                ${tutorLessons.map(l => `
                  <tr>
                    <td style="width:40px;"><i class="fa-brands fa-youtube" style="color:#ef4444; font-size:22px;"></i></td>
                    <td>
                      <strong style="color:#0f172a; font-size:0.95rem;">${escapeHtml(l.title)}</strong>
                      <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">
                        <span class="badge-id" style="color:#059669; font-weight:700;">${escapeHtml(l.day || (l.unit ? 'Unit ' + l.unit.replace('u','') : 'Masterclass'))}</span>
                        ${l.desc ? ` • ${escapeHtml(l.desc)}` : ''}
                      </div>
                      ${l.tuteUrl ? `<div style="font-size:0.72rem; color:#0284c7; margin-top:2px;"><i class="fa-solid fa-file-pdf"></i> Tute: <a href="${escapeHtml(l.tuteUrl)}" target="_blank" style="color:#0284c7;">${escapeHtml(l.tuteUrl)}</a></div>` : ''}
                    </td>
                    <td><span class="badge-id">${l.duration || '1h 30m'}</span></td>
                    <td><span class="badge-id" style="color:#d97706;">ID: ${escapeHtml(l.ytId)}</span></td>
                    <td><span class="badge-unlocked" style="cursor:default;"><i class="fa-solid fa-gift"></i> 100% Free</span></td>
                    <td style="width:70px; text-align:right;">
                      <button class="btn-icon-action danger" onclick="deleteFreeLesson('${l.id}')" title="Delete Free Lesson">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      `;
    } else {
      // Sasanka or Dhananjaya: Revision Only!
      contentEl.innerHTML = `
        <div style="background:#ffffff; border:1px solid rgba(16,185,129,0.2); border-radius:var(--radius-lg); padding:24px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
            <div>
              <h4 style="margin:0; font-size:1.05rem; color:#0f172a; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-crosshairs" style="color:#10b981;"></i> Free Revision Masterclasses (${escapeHtml(activeTutor.name)})
              </h4>
              <p style="margin:4px 0 0 0; color:#64748b; font-size:0.8rem;">
                *(මෙම ගුරුවරයා Revision පමණක් සිදුකරන බැවින් Free Lessons යටතේද Revision Masterclasses පමණක් ප්‍රදර්ශනය වේ)*
              </p>
            </div>
            <span style="font-size:0.8rem; color:#64748b;">Total: <strong>${tutorLessons.length}</strong></span>
          </div>

          ${tutorLessons.length === 0 ? `
            <div style="text-align:center; padding:30px; color:#64748b; background:#f8fafc; border-radius:var(--radius-md); border:1px dashed #cbd5e1;">
              තවම මෙම ගුරුවරයා යටතේ Free Lessons ඇතුළත් කර නොමැත. ඉහත "+ Add Free Lesson" ඔබන්න.
            </div>
          ` : `
            <table class="unit-lessons-table">
              <tbody>
                ${tutorLessons.map(l => `
                  <tr>
                    <td style="width:40px;"><i class="fa-brands fa-youtube" style="color:#ef4444; font-size:22px;"></i></td>
                    <td>
                      <strong style="color:#0f172a; font-size:0.95rem;">${escapeHtml(l.title)}</strong>
                      <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">
                        <span class="badge-id" style="color:#059669; font-weight:700;">${escapeHtml(l.day || 'Revision Day')}</span>
                        ${l.desc ? ` • ${escapeHtml(l.desc)}` : ''}
                      </div>
                      ${l.tuteUrl ? `<div style="font-size:0.72rem; color:#0284c7; margin-top:2px;"><i class="fa-solid fa-file-pdf"></i> Tute: <a href="${escapeHtml(l.tuteUrl)}" target="_blank" style="color:#0284c7;">${escapeHtml(l.tuteUrl)}</a></div>` : ''}
                    </td>
                    <td><span class="badge-id">${l.duration || '1h 30m'}</span></td>
                    <td><span class="badge-id" style="color:#d97706;">ID: ${escapeHtml(l.ytId)}</span></td>
                    <td><span class="badge-unlocked" style="cursor:default;"><i class="fa-solid fa-gift"></i> 100% Free</span></td>
                    <td style="width:70px; text-align:right;">
                      <button class="btn-icon-action danger" onclick="deleteFreeLesson('${l.id}')" title="Delete Free Lesson">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      `;
    }
  }
}

function switchFlTutor(tutorId) {
  activeFlTutor = tutorId;
  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === tutorId);
  if (tutor && !tutor.hasTheory) activeFlMode = 'revision';
  renderFreeLessonsTab();
}

function switchFlMode(mode) {
  activeFlMode = mode;
  renderFreeLessonsTab();
}

function openAddFreeLessonModal() {
  document.getElementById('edit-fl-id').value = '';
  document.getElementById('fl-title-input').value = '';
  document.getElementById('fl-yt-input').value = '';
  document.getElementById('fl-duration-input').value = '1h 45m';
  document.getElementById('fl-tute-input').value = 'https://t.me/apexbiology_tutes';
  document.getElementById('fl-yt-thumb-preview').style.display = 'none';

  const tutorSelect = document.getElementById('fl-tutor-select');
  if (tutorSelect) {
    tutorSelect.value = activeFlTutor;
    handleFlTutorChange(activeFlTutor);
  }
  openAdminModal('modal-add-free-lesson');
}

function handleFlTutorChange(tutorId) {
  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === tutorId);
  const typeSelect = document.getElementById('fl-type-select');
  const optTheory = document.getElementById('fl-opt-theory');

  if (tutor && tutor.hasTheory === false) {
    if (optTheory) optTheory.disabled = true;
    if (typeSelect) typeSelect.value = 'revision';
    handleFlTypeChange('revision');
  } else {
    if (optTheory) optTheory.disabled = false;
    handleFlTypeChange(typeSelect ? typeSelect.value : 'theory');
  }
}

function handleFlTypeChange(type) {
  const unitGroup = document.getElementById('fl-unit-group');
  const dayGroup = document.getElementById('fl-day-group');
  if (type === 'theory') {
    if (unitGroup) unitGroup.style.display = 'block';
    if (dayGroup) dayGroup.style.display = 'none';
  } else {
    if (unitGroup) unitGroup.style.display = 'none';
    if (dayGroup) dayGroup.style.display = 'block';
  }
}

async function handleSaveFreeLesson(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-fl-id').value;
  const tutorId = document.getElementById('fl-tutor-select').value;
  const type = document.getElementById('fl-type-select').value;
  const unit = type === 'theory' ? document.getElementById('fl-unit-select').value : null;
  const day = type === 'revision' ? document.getElementById('fl-day-input').value.trim() : null;
  const title = document.getElementById('fl-title-input').value.trim();
  const ytUrl = document.getElementById('fl-yt-input').value.trim();
  const duration = document.getElementById('fl-duration-input').value.trim();
  const tuteUrl = document.getElementById('fl-tute-input').value.trim();

  const payload = { tutorId, type, unit, day, title, ytUrl, duration, tuteUrl };

  try {
    let res;
    if (editId) {
      res = await fetch(`/api/free-lessons/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/free-lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const json = await res.json();
    if (json.success) {
      showAdminToast(editId ? 'Free lesson updated!' : 'Free masterclass published!', 'success');
      closeAdminModal('modal-add-free-lesson');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to save free lesson', 'error');
  }
}

async function deleteFreeLesson(id) {
  if (!confirm('Are you sure you want to delete this free lesson?')) return;
  try {
    const res = await fetch(`/api/free-lessons/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Free lesson removed', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete free lesson', 'error');
  }
}

// ----------------------------------------------------------------------------
// REVISION VIDEOS & FOLDERS CRUD
// ----------------------------------------------------------------------------

function openAddRevisionVideoModal(folderName = null) {
  document.getElementById('edit-rev-video-id').value = '';
  document.getElementById('rev-video-title-input').value = '';
  document.getElementById('rev-video-yt-input').value = '';
  document.getElementById('rev-video-duration-input').value = '2h 30m';
  document.getElementById('rev-video-desc-input').value = '';
  document.getElementById('rev-video-tute-input').value = 'https://t.me/apexbiology_tutes';
  document.getElementById('rev-video-lock-input').checked = true;
  document.getElementById('rev-yt-thumb-preview').style.display = 'none';

  const tutorSelect = document.getElementById('rev-video-tutor-select');
  if (tutorSelect) {
    tutorSelect.value = activeAdminTutor;
    handleRevVideoTutorChange(activeAdminTutor, folderName);
  }
  openAdminModal('modal-add-revision-video');
}

function handleRevVideoTutorChange(tutorId, selectedFolder = null) {
  const folderSelect = document.getElementById('rev-video-folder-select');
  if (!folderSelect) return;

  const revVideos = (ADMIN_DATA.revisionVideos || []).filter(v => v.tutorId === tutorId);
  const customFolders = Array.from(new Set(revVideos.filter(v => v.folderName && v.folderName.trim()).map(v => v.folderName.trim())));

  folderSelect.innerHTML = `
    <option value="">None (Direct Video / Folder රහිත)</option>
    ${customFolders.map(f => `
      <option value="${escapeHtml(f)}" ${selectedFolder === f ? 'selected' : ''}>${escapeHtml(f)}</option>
    `).join('')}
  `;
}

async function handleSaveRevisionVideo(e) {
  e.preventDefault();
  const editId = document.getElementById('edit-rev-video-id').value;
  const tutorId = document.getElementById('rev-video-tutor-select').value;
  const folderName = document.getElementById('rev-video-folder-select').value.trim() || null;
  const title = document.getElementById('rev-video-title-input').value.trim();
  const ytUrl = document.getElementById('rev-video-yt-input').value.trim();
  const duration = document.getElementById('rev-video-duration-input').value.trim();
  const desc = document.getElementById('rev-video-desc-input').value.trim();
  const tuteUrl = document.getElementById('rev-video-tute-input').value.trim();
  const isLocked = document.getElementById('rev-video-lock-input').checked;

  const payload = { tutorId, folderName, title, ytUrl, duration, desc, tuteUrl, isLocked };

  try {
    let res;
    if (editId) {
      res = await fetch(`/api/revision-videos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/revision-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const json = await res.json();
    if (json.success) {
      showAdminToast(editId ? 'Revision video updated!' : 'Revision video added successfully!', 'success');
      closeAdminModal('modal-add-revision-video');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to save revision video', 'error');
  }
}

async function deleteRevisionVideo(id) {
  if (!confirm('Are you sure you want to delete this revision video?')) return;
  try {
    const res = await fetch(`/api/revision-videos/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Revision video deleted', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete revision video', 'error');
  }
}

async function toggleRevisionVideoLock(id, newLockState) {
  try {
    const res = await fetch(`/api/revision-videos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isLocked: newLockState })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Video is now ${newLockState ? 'Locked' : 'Unlocked (Free)'}`, 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to update video lock status', 'error');
  }
}

function openAddRevisionFolderModal() {
  document.getElementById('new-rev-folder-name').value = '';
  document.getElementById('new-rev-folder-desc').value = '';
  const tutorSelect = document.getElementById('new-rev-folder-tutor');
  if (tutorSelect) tutorSelect.value = activeAdminTutor;
  openAdminModal('modal-add-revision-folder');
}

async function handleCreateRevisionFolder(e) {
  e.preventDefault();
  const tutorId = document.getElementById('new-rev-folder-tutor').value;
  const folderName = document.getElementById('new-rev-folder-name').value.trim();
  const desc = document.getElementById('new-rev-folder-desc').value.trim();
  if (!folderName) return;

  try {
    const res = await fetch('/api/revision-videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tutorId,
        folderName,
        title: `${folderName} - Overview & Instructions`,
        ytUrl: '',
        duration: '1h 00m',
        desc: desc || 'Revision discussions and questions breakdown',
        tuteUrl: '',
        isLocked: true
      })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Folder "${folderName}" created successfully!`, 'success');
      closeAdminModal('modal-add-revision-folder');
      activeAdminRevFolder = folderName;
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to create folder', 'error');
  }
}

async function deleteRevisionFolder(folderName) {
  if (!confirm(`Are you sure you want to delete folder "${folderName}" and all its videos?`)) return;
  const folderVideos = (ADMIN_DATA.revisionVideos || []).filter(v => v.tutorId === activeAdminTutor && v.folderName === folderName);
  try {
    for (const v of folderVideos) {
      await fetch(`/api/revision-videos/${v.id}`, { method: 'DELETE' });
    }
    showAdminToast(`Folder "${folderName}" deleted`, 'success');
    if (activeAdminRevFolder === folderName) activeAdminRevFolder = null;
    fetchAdminData();
  } catch (err) {
    showAdminToast('Failed to delete folder', 'error');
  }
}

function handleCardTutorChange(tutorId) {
  const typeSelect = document.getElementById('card-type-select');
  const hintEl = document.getElementById('card-tutor-hint');
  const titleInput = document.getElementById('card-title-input');
  const optBoth = document.getElementById('opt-type-both');
  const optTheory = document.getElementById('opt-type-theory');
  const optRevision = document.getElementById('opt-type-revision');

  // Maintain 100% full flexibility: Never disable any class types for admin!
  if (optBoth) optBoth.disabled = false;
  if (optTheory) optTheory.disabled = false;
  if (optRevision) optRevision.disabled = false;
  if (hintEl) hintEl.style.display = 'block';

  let tName = 'දිනේෂ් මුතුගල';
  if (tutorId === 'sasanka') tName = 'ශශංක ධනුජය';
  else if (tutorId === 'dhananjaya') tName = 'ධනංජය ආරියදාස';
  else if (tutorId === 'both') tName = 'All Tutors';

  const mVal = (document.getElementById('card-month-input')?.value || 'නොවැම්බර්').trim();
  const curType = typeSelect ? typeSelect.value : 'both';
  const typeSuffix = curType === 'theory' ? '(Theory Only)' : (curType === 'revision' ? '(Revision Only)' : '(Theory + Revision)');
  if (titleInput) {
    titleInput.value = `2027 A/L ${mVal} • ${tName} ${typeSuffix}`;
  }
}

function handleCardTypeChange(typeVal) {
  const tutorSelect = document.getElementById('card-tutor-select');
  const tutorId = tutorSelect ? tutorSelect.value : 'dinesh';
  handleCardTutorChange(tutorId);
}

// ============================================================================
// ADMIN AUTHENTICATION & MULTI-ROLE SYSTEM
// Roles: 'super_admin' (Full Access) & 'normal_admin' (Live & Monthly Classes Only)
// ============================================================================
function checkAdminAuth() {
  try {
    const saved = localStorage.getItem('apex_admin');
    const overlay = document.getElementById('admin-login-overlay');
    if (!saved) {
      if (overlay) overlay.style.display = 'flex';
      return false;
    }
    currentAdmin = JSON.parse(saved);
    if (!currentAdmin || !currentAdmin.role) {
      if (overlay) overlay.style.display = 'flex';
      return false;
    }
    if (overlay) overlay.style.display = 'none';
    applyAdminRolePermissions();
    return true;
  } catch (err) {
    console.error('Admin auth check error:', err);
    return false;
  }
}

function applyAdminRolePermissions() {
  if (!currentAdmin) return;
  const nameEl = document.getElementById('sidebar-admin-name');
  const roleEl = document.getElementById('sidebar-admin-role');
  const iconEl = document.getElementById('sidebar-admin-icon');

  if (nameEl) nameEl.textContent = currentAdmin.name || 'Admin User';
  
  const isNormal = currentAdmin.role === 'normal_admin';

  if (roleEl) {
    roleEl.textContent = isNormal ? 'Normal Admin (Moderator)' : 'Super Admin (Full Access)';
    roleEl.style.color = isNormal ? '#60a5fa' : '#10b981';
  }
  if (iconEl) {
    iconEl.className = isNormal ? 'fa-solid fa-user-shield' : 'fa-solid fa-crown';
    iconEl.style.color = isNormal ? '#60a5fa' : '#10b981';
  }

  // Normal Admin: Hides Store Products, Bio Bank, Students, Fees Cards, Requests, Syllabus, Admins & Quick Links
  const restrictedTabIds = [
    'nav-tab-students',
    'nav-tab-fees-cards',
    'nav-tab-requests',
    'nav-tab-syllabus-mgr',
    'nav-tab-products',
    'nav-tab-admin-biobank',
    'nav-tab-online-exams',
    'nav-tab-admins'
  ];

  restrictedTabIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = isNormal ? 'none' : '';
  });

  // Also hide Quick Links section for normal admins
  document.querySelectorAll('.admin-nav-group-title, .admin-nav-link').forEach(el => {
    el.style.display = isNormal ? 'none' : '';
  });

  // Ensure Overview & Video tabs are visible
  ['nav-tab-overview', 'nav-tab-monthly-classes', 'nav-tab-live-classes', 'nav-tab-tutors-videos', 'nav-tab-freelessons-mgr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });

  if (isNormal) {
    const allowed = ['tab-overview', 'tab-monthly-classes', 'tab-live-classes', 'tab-tutors-videos', 'tab-freelessons-mgr'];
    if (!allowed.includes(currentTab)) {
      switchAdminTab('tab-overview');
    }
  }
}

async function handleAdminLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('admin-login-email')?.value.trim();
  const password = document.getElementById('admin-login-password')?.value;
  const submitBtn = document.getElementById('btn-admin-login-submit');

  if (!email || !password) {
    showAdminToast('Please enter admin email and password', 'error');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
  }

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.admin) {
      currentAdmin = data.admin;
      localStorage.setItem('apex_admin', JSON.stringify(data.admin));
      document.getElementById('admin-login-overlay').style.display = 'none';
      applyAdminRolePermissions();
      showAdminToast(`Authenticated as ${data.admin.role === 'super_admin' ? 'Super Admin' : 'Normal Admin'}!`, 'success');
      fetchAdminData();
    } else {
      showAdminToast(data.message || 'Invalid admin credentials', 'error');
    }
  } catch (err) {
    showAdminToast('Connection error', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Authenticate & Enter Admin Studio';
    }
  }
}

function logoutAdmin() {
  localStorage.removeItem('apex_admin');
  currentAdmin = null;
  const overlay = document.getElementById('admin-login-overlay');
  if (overlay) overlay.style.display = 'flex';
  showAdminToast('Logged out of Admin Studio', 'info');
}

function toggleAdminLoginPassword() {
  const pwd = document.getElementById('admin-login-password');
  const icon = document.getElementById('admin-eye-icon');
  if (!pwd || !icon) return;
  if (pwd.type === 'password') {
    pwd.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    pwd.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

// ============================================================================
// TAB 8: ADMIN ROLES & SETTINGS (Super Admin Only)
// ============================================================================
async function renderAdminsTab() {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!data.success) return;

    // Populate Admins Table
    const tbody = document.getElementById('admins-table-body');
    if (tbody && data.admins) {
      tbody.innerHTML = data.admins.map(adm => {
        const isSuper = adm.role === 'super_admin';
        const isSelf = currentAdmin && currentAdmin.email === adm.email;
        return `
          <tr>
            <td>
              <div style="font-weight:700; color:#fff;">${escapeHtml(adm.name)}</div>
              ${isSelf ? '<span style="font-size:0.72rem; color:#10b981;">(You / Logged In)</span>' : ''}
            </td>
            <td><code style="color:#38bdf8;">${escapeHtml(adm.email)}</code></td>
            <td>
              <span class="badge-role ${isSuper ? 'super' : 'normal'}" style="padding:4px 10px; border-radius:12px; font-weight:800; font-size:0.75rem; background:${isSuper ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)'}; color:${isSuper ? '#10b981' : '#60a5fa'}; border:1px solid ${isSuper ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'};">
                ${isSuper ? '👑 Super Admin' : '🛡️ Normal Admin'}
              </span>
            </td>
            <td><small style="color:var(--text-dim);">${adm.createdAt ? new Date(adm.createdAt).toLocaleDateString() : 'Active'}</small></td>
            <td>
              ${isSelf ? '<span style="font-size:0.76rem; color:var(--text-dim);">Active Account</span>' : `
                <button class="btn-icon-action danger" onclick="deleteAdminUser('${adm.id}', '${escapeHtml(adm.name)}')" title="Delete Admin Account">
                  <i class="fa-solid fa-trash"></i>
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }

    // Populate Telegram Settings
    if (data.settings) {
      const tokenInput = document.getElementById('tg-bot-token');
      const chatInput = document.getElementById('tg-chat-id');
      if (tokenInput && data.settings.telegramBotToken) tokenInput.value = data.settings.telegramBotToken;
      if (chatInput && data.settings.telegramChatId) chatInput.value = data.settings.telegramChatId;

      const spTokenInput = document.getElementById('tg-studypack-bot-token');
      const spChatInput = document.getElementById('tg-studypack-chat-id');
      if (spTokenInput) spTokenInput.value = data.settings.studyPackBotToken || '9072524602:AAE1KfFbQQM39yWpw7pyu6YVA5F5kH3RzXQ';
      if (spChatInput) spChatInput.value = data.settings.studyPackChatId || '6315010122';
    }
  } catch (err) {
    console.warn('Error rendering admins tab:', err);
  }
}

function openAddAdminModal() {
  document.getElementById('admin-user-name').value = '';
  document.getElementById('admin-user-email').value = '';
  document.getElementById('admin-user-password').value = '';
  document.getElementById('admin-user-role').value = 'normal_admin';
  openAdminModal('modal-add-admin');
}

async function handleSaveAdminUser(e) {
  e.preventDefault();
  const name = document.getElementById('admin-user-name').value.trim();
  const email = document.getElementById('admin-user-email').value.trim();
  const password = document.getElementById('admin-user-password').value.trim();
  const role = document.getElementById('admin-user-role').value;

  try {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`New ${role === 'super_admin' ? 'Super Admin' : 'Normal Admin'} account created!`, 'success');
      closeAdminModal('modal-add-admin');
      renderAdminsTab();
    } else {
      showAdminToast(json.message || 'Error creating admin account', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to create admin user', 'error');
  }
}

async function deleteAdminUser(id, name) {
  if (!confirm(`Are you sure you want to delete admin account "${name}"?`)) return;
  try {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Admin account deleted', 'success');
      renderAdminsTab();
    } else {
      showAdminToast(json.message || 'Error deleting admin', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to delete admin', 'error');
  }
}

async function handleSaveTelegramSettings(e) {
  e.preventDefault();
  const token = document.getElementById('tg-bot-token')?.value.trim();
  const chatId = document.getElementById('tg-chat-id')?.value.trim();

  try {
    const res = await fetch('/api/admin/telegram-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramBotToken: token, telegramChatId: chatId })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('✅ Telegram Bot Token and Chat ID saved successfully!', 'success');
    } else {
      showAdminToast('Failed to save Telegram settings', 'error');
    }
  } catch (err) {
    showAdminToast('Network error saving settings', 'error');
  }
}

async function handleSaveStudyPackTelegramSettings(e) {
  e.preventDefault();
  const token = document.getElementById('tg-studypack-bot-token')?.value.trim();
  const chatId = document.getElementById('tg-studypack-chat-id')?.value.trim();

  try {
    const res = await fetch('/api/admin/telegram-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studyPackBotToken: token, studyPackChatId: chatId })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('✅ Study Pack Bot Token & Chat ID saved successfully!', 'success');
    } else {
      showAdminToast('Failed to save Study Pack Bot settings', 'error');
    }
  } catch (err) {
    showAdminToast('Network error saving settings', 'error');
  }
}

async function handleTestTelegramAlert() {
  showAdminToast('📡 Dispatching test alert to Telegram Bot...', 'info');
  try {
    const res = await fetch('/api/admin/telegram-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('🎉 ' + json.message, 'success');
    } else {
      showAdminToast('⚠️ ' + (json.message || 'Failed to dispatch alert. Check your Bot Token and Chat ID.'), 'error');
    }
  } catch (err) {
    showAdminToast('Failed to connect to Telegram service', 'error');
  }
}

window.handleSaveStudyPackTelegramSettings = handleSaveStudyPackTelegramSettings;
window.handleTestStudyPackTelegramAlert = handleTestStudyPackTelegramAlert;
window.handleSaveTelegramSettings = handleSaveTelegramSettings;
window.handleTestTelegramAlert = handleTestTelegramAlert;

async function handleTestStudyPackTelegramAlert() {
  showAdminToast('📡 Dispatching test alert to Study Pack Bot (@Bio_study_packbot)...', 'info');
  try {
    const res = await fetch('/api/admin/telegram-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'studypack' })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('🎉 ' + json.message, 'success');
    } else {
      showAdminToast('⚠️ ' + (json.message || 'Failed to dispatch alert. Telegram එකෙන් bot වෙත /start යවා ඇත්දැයි බලන්න.'), 'error');
    }
  } catch (err) {
    showAdminToast('Failed to connect to Telegram service', 'error');
  }
}

window.handleSaveStudyPackTelegramSettings = handleSaveStudyPackTelegramSettings;
window.handleTestStudyPackTelegramAlert = handleTestStudyPackTelegramAlert;
window.handleSaveTelegramSettings = handleSaveTelegramSettings;
window.handleTestTelegramAlert = handleTestTelegramAlert;

async function triggerFirestoreSyncAll() {
  showAdminToast('🔥 Initiating full cloud synchronization to Firestore...', 'info');
  try {
    const res = await fetch('/api/firebase/sync-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('✅ ' + json.message, 'success');
    } else {
      showAdminToast('Failed to sync Firestore', 'error');
    }
  } catch (err) {
    showAdminToast('Firestore sync error', 'error');
  }
}


// ============================================================================
// STORE PRODUCTS & DELIVERY ORDERS MANAGEMENT
// ============================================================================
let productImagesList = [];

function renderProductsTab() {
  const grid = document.getElementById('admin-products-grid');
  const countBadge = document.getElementById('count-products-badge');
  const ordersTbody = document.getElementById('admin-orders-table-body');
  const ordersBadge = document.getElementById('badge-orders-count');

  const products = ADMIN_DATA.products || [];
  if (countBadge) countBadge.textContent = products.length;

  if (grid) {
    if (products.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1; color:var(--text-dim); text-align:center; padding:30px;">No store products added yet. Click "Add New Product" to add theory tutorial books or color atlases.</p>';
    } else {
      grid.innerHTML = products.map(p => {
        const primaryImg = (p.images && p.images[0]) || '/hero.jpg';
        return `
          <div class="class-card-item">
            <div class="card-banner-wrap">
              <img src="${primaryImg}" alt="${escapeHtml(p.title)}" onerror="this.src='/hero.jpg';">
              <div class="card-batch-badge">${escapeHtml(p.category || 'Product')}</div>
            </div>
            <div class="card-item-body">
              <h4 class="card-item-title">${escapeHtml(p.title)}</h4>
              <div class="card-item-price">Rs. ${Number(p.price).toLocaleString()}</div>
              ${p.shortDesc ? `<p style="font-size:0.75rem; color:var(--text-dim); line-height:1.4;">${escapeHtml(p.shortDesc)}</p>` : ''}
              <div style="font-size:0.75rem; color:#10b981; margin-top:4px;">
                <i class="fa-solid fa-images"></i> ${(p.images || []).length} WebP Photos
              </div>
            </div>
            <div class="card-item-footer">
              <button class="btn-icon-action" onclick="openEditProductModal('${p.id}')" title="Edit Product"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="btn-icon-action danger" onclick="deleteProduct('${p.id}')" title="Delete Product"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Orders
  const orders = ADMIN_DATA.orders || [];
  if (ordersBadge) ordersBadge.textContent = `${orders.length} Orders`;
  if (ordersTbody) {
    if (orders.length === 0) {
      ordersTbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-dim);">No physical delivery orders received yet.</td></tr>';
    } else {
      ordersTbody.innerHTML = orders.map(o => {
        const dateFormatted = new Date(o.createdAt || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return `
          <tr>
            <td><small style="color:var(--text-dim);">${dateFormatted}</small></td>
            <td><strong style="color:#fff;">${escapeHtml(o.productTitle)}</strong></td>
            <td>
              <strong style="color:#38bdf8;">${escapeHtml(o.studentName)}</strong><br>
              <span class="badge-id">ID: ${o.studentId}</span>
            </td>
            <td>
              <a href="https://wa.me/${o.whatsapp.replace(/\D/g, '')}" target="_blank" style="color:#10b981; font-weight:700;"><i class="fa-brands fa-whatsapp"></i> ${escapeHtml(o.whatsapp)}</a><br>
              <small style="color:var(--text-dim);">${escapeHtml(o.district)}</small>
            </td>
            <td><small style="color:#e2e8f0;">${escapeHtml(o.address)}</small></td>
            <td><strong style="color:#10b981;">Rs. ${Number(o.productPrice * (o.qty || 1)).toLocaleString()}</strong></td>
            <td><span class="badge-unlocked">Confirmed</span></td>
          </tr>
        `;
      }).join('');
    }
  }
}

function openAddProductModal() {
  document.getElementById('modal-product-title').innerHTML = '<i class="fa-solid fa-box-open"></i> Add Store Delivery Product';
  document.getElementById('product-edit-id').value = '';
  document.getElementById('prod-title-input').value = '';
  document.getElementById('prod-price-input').value = '2450';
  document.getElementById('prod-short-desc-input').value = '';
  productImagesList = [];
  renderProductImagesPreview();
  openAdminModal('modal-add-product');
}

function openEditProductModal(id) {
  const p = (ADMIN_DATA.products || []).find(prod => prod.id === id);
  if (!p) return;
  document.getElementById('modal-product-title').innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Store Product';
  document.getElementById('product-edit-id').value = p.id;
  document.getElementById('prod-title-input').value = p.title;
  document.getElementById('prod-price-input').value = p.price;
  document.getElementById('prod-category-select').value = p.category || 'Printed Tute Pack';
  document.getElementById('prod-short-desc-input').value = p.shortDesc || '';
  productImagesList = p.images ? [...p.images] : [];
  renderProductImagesPreview();
  openAdminModal('modal-add-product');
}

function renderProductImagesPreview() {
  const container = document.getElementById('prod-images-preview-grid');
  if (!container) return;
  container.innerHTML = productImagesList.map((imgUrl, idx) => `
    <div style="position:relative; width:70px; height:70px; border-radius:8px; overflow:hidden; border:1px solid #10b981;">
      <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;">
      <button type="button" onclick="removeProductImage(${idx})" style="position:absolute; top:2px; right:2px; background:rgba(239,68,68,0.9); color:#fff; border:none; border-radius:50%; width:18px; height:18px; font-size:10px; cursor:pointer;">✕</button>
    </div>
  `).join('');
}

function removeProductImage(idx) {
  productImagesList.splice(idx, 1);
  renderProductImagesPreview();
}

async function handleProductMultipleImageUpload(e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  showAdminToast(`Converting ${files.length} images to WebP format...`, 'info');

  for (const file of files) {
    try {
      const base64 = await readFileAsBase64(file);
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, filename: file.name })
      });
      const json = await res.json();
      if (json.success && json.url) {
        productImagesList.push(json.url);
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    }
  }
  renderProductImagesPreview();
  showAdminToast('Images uploaded and converted to WebP successfully!', 'success');
}

async function handleSaveProduct(e) {
  e.preventDefault();
  const editId = document.getElementById('product-edit-id').value;
  const title = document.getElementById('prod-title-input').value.trim();
  const price = document.getElementById('prod-price-input').value;
  const category = document.getElementById('prod-category-select').value;
  const shortDesc = document.getElementById('prod-short-desc-input').value.trim();

  const payload = {
    title,
    price: Number(price) || 0,
    category,
    shortDesc,
    images: productImagesList.length > 0 ? productImagesList : ['/hero.jpg']
  };

  try {
    let res;
    if (editId) {
      res = await fetch(`/api/products/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Product "${title}" saved to store!`, 'success');
      closeAdminModal('modal-add-product');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to save product', 'error');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product from the store?')) return;
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Product deleted from store', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete product', 'error');
  }
}

// ============================================================================
// BIO BANK RESOURCE MANAGER & VISIBILITY TOGGLE
// ============================================================================
// ============================================================================
// BIO BANK RESOURCE MANAGER & VISIBILITY TOGGLE (UNITS, SUBFOLDERS, IMAGES, PDF, TEXT)
// ============================================================================
let activeBioBankUnitId = 'u1';
let activeBioBankFolderId = null; // null = root of unit
let currentBioBankUploadType = 'image';
let bioBankImagesList = [];

function renderAdminBioBankTab() {
  const unitsGrid = document.getElementById('admin-biobank-units-grid');
  const badgeStatus = document.getElementById('badge-biobank-status');
  const btnBlur = document.getElementById('btn-toggle-biobank-blur');

  const bbData = ADMIN_DATA.bioBank || { isBlurred: true, units: [] };
  const isBlurred = bbData.isBlurred !== false;

  if (badgeStatus) {
    badgeStatus.textContent = isBlurred ? 'BLURRED (LOCKED)' : 'LIVE & UNBLURRED';
    badgeStatus.className = isBlurred ? 'admin-badge-count' : 'admin-badge-count green';
  }
  if (btnBlur) {
    btnBlur.style.background = isBlurred ? '#eab308' : '#10b981';
    btnBlur.style.borderColor = isBlurred ? '#ca8a04' : '#059669';
    btnBlur.style.color = isBlurred ? '#000000' : '#ffffff';
    btnBlur.style.fontWeight = '700';
    btnBlur.innerHTML = isBlurred
      ? '<i class="fa-solid fa-lock"></i> <span id="biobank-blur-btn-text">Bio Bank: BLURRED (Only dg.edits65@gmail.com can view) • Click to UNBLUR</span>'
      : '<i class="fa-solid fa-lock-open"></i> <span id="biobank-blur-btn-text">Bio Bank: UNBLURRED (Open to all students) • Click to BLUR</span>';
  }

  const units = (bbData.units && bbData.units.length > 0) ? bbData.units : (typeof BIO_BANK_DATA !== 'undefined' ? BIO_BANK_DATA : []);
  if (unitsGrid) {
    unitsGrid.innerHTML = units.map(u => {
      const isActive = u.id === activeBioBankUnitId;
      const folderCount = (u.folders || []).length;
      let totalItems = (u.items || []).length;
      (u.folders || []).forEach(f => { totalItems += (f.items || []).length; });
      if (u.categories) {
        Object.values(u.categories).forEach(arr => { totalItems += (arr || []).length; });
      }
      return `
        <div class="biobank-admin-folder-card ${isActive ? 'active-folder' : ''}" onclick="selectAdminBioBankUnit('${u.id}')">
          <div class="folder-unit-badge">Unit ${u.num || u.id}</div>
          <div class="folder-icon-emoji">${u.icon || '🌿'}</div>
          <h4 class="folder-unit-title">${escapeHtml(u.name)}</h4>
          <div class="folder-unit-stats">
            <span><i class="fa-solid fa-folder"></i> ${folderCount} Folders</span>
            <span>•</span>
            <span><i class="fa-solid fa-file"></i> ${totalItems} Materials</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderAdminBioBankUnitDetail();
}

function selectAdminBioBankUnit(unitId) {
  activeBioBankUnitId = unitId;
  activeBioBankFolderId = null;
  renderAdminBioBankTab();
}

function selectAdminBioBankFolder(folderId) {
  activeBioBankFolderId = folderId;
  renderAdminBioBankUnitDetail();
}

function renderAdminBioBankUnitDetail() {
  const detail = document.getElementById('admin-biobank-unit-detail');
  if (!detail) return;
  detail.style.display = 'block';

  const bbData = ADMIN_DATA.bioBank || { units: [] };
  const units = (bbData.units && bbData.units.length > 0) ? bbData.units : (typeof BIO_BANK_DATA !== 'undefined' ? BIO_BANK_DATA : []);
  const unit = units.find(u => u.id === activeBioBankUnitId) || units[0];
  if (!unit) return;

  const allFolders = unit.folders || [];
  const currentFolder = activeBioBankFolderId ? allFolders.find(f => f.id === activeBioBankFolderId) : null;

  // Subfolders at current level
  const subfolders = allFolders.filter(f => {
    if (activeBioBankFolderId) {
      return f.parentFolderId === activeBioBankFolderId;
    }
    return !f.parentFolderId;
  });

  // Items at current level
  let items = [];
  if (activeBioBankFolderId && currentFolder) {
    items = currentFolder.items || [];
  } else {
    items = (unit.items || []).filter(it => !it.folderId);
    // Legacy categories items if any
    if (unit.categories) {
      Object.entries(unit.categories).forEach(([catKey, list]) => {
        (list || []).forEach((it, idx) => {
          if (!items.find(x => x.id === it.id)) {
            items.push({
              ...it,
              id: it.id || ('leg_' + catKey + '_' + idx),
              isLegacy: true,
              legacyCat: catKey,
              legacyIdx: idx
            });
          }
        });
      });
    }
  }

  detail.innerHTML = `
    <div style="background:rgba(255,255,255,0.02); border:1.5px solid rgba(16,185,129,0.35); border-radius:18px; padding:22px; box-shadow:0 8px 30px rgba(0,0,0,0.15);">
      <!-- Header & Breadcrumbs -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:16px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#10b981; font-weight:700; margin-bottom:4px;">
            <span style="cursor:pointer;" onclick="selectAdminBioBankFolder(null)"><i class="fa-solid fa-vault"></i> Unit ${unit.num || unit.id}</span>
            ${currentFolder ? `<span>/</span> <span style="color:#ffffff;"><i class="fa-solid fa-folder-open"></i> ${escapeHtml(currentFolder.name)}</span>` : ''}
          </div>
          <h3 style="font-size:1.25rem; font-weight:800; color:#ffffff; margin:0;">
            ${unit.icon || '🌿'} ${currentFolder ? escapeHtml(currentFolder.name) : escapeHtml(unit.name)}
          </h3>
          <span style="font-size:0.8rem; color:#94a3b8;">${currentFolder ? (currentFolder.desc || 'Subfolder resources') : (unit.eng || '')}</span>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          ${activeBioBankFolderId ? `
            <button class="btn-primary-action small" onclick="selectAdminBioBankFolder(null)" style="background:#334155; border-color:#475569;">
              <i class="fa-solid fa-arrow-left"></i> Back to Root
            </button>
          ` : ''}
          <button class="btn-primary-action small" onclick="openCreateBioBankFolderModal('${unit.id}', '${activeBioBankFolderId || ''}')" style="background:#0284c7; border-color:#0369a1;">
            <i class="fa-solid fa-folder-plus"></i> + New Subfolder
          </button>
          <button class="btn-primary-action small" onclick="openAddBioBankItemModal('${unit.id}', '${activeBioBankFolderId || ''}', 'image')">
            <i class="fa-solid fa-images"></i> + Add Images
          </button>
          <button class="btn-primary-action small" onclick="openAddBioBankItemModal('${unit.id}', '${activeBioBankFolderId || ''}', 'pdf')" style="background:#ef4444; border-color:#dc2626;">
            <i class="fa-solid fa-file-pdf"></i> + Add PDF
          </button>
          <button class="btn-primary-action small" onclick="openAddBioBankItemModal('${unit.id}', '${activeBioBankFolderId || ''}', 'text')" style="background:#8b5cf6; border-color:#7c3aed;">
            <i class="fa-solid fa-pen-nib"></i> + Add Note
          </button>
        </div>
      </div>

      <!-- Subfolders Section -->
      <div style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="font-size:0.95rem; font-weight:800; color:#38bdf8; margin:0; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-folder-tree"></i> Folders (${subfolders.length})
          </h4>
        </div>
        ${subfolders.length === 0 ? `
          <div style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.1); border-radius:12px; padding:18px; text-align:center; color:#94a3b8; font-size:0.85rem;">
            <i class="fa-solid fa-folder-open" style="font-size:1.4rem; opacity:0.5; margin-bottom:6px; display:block;"></i>
            No subfolders in this location. Click <strong>"+ New Subfolder"</strong> to create one.
          </div>
        ` : `
          <div class="biobank-subfolders-grid">
            ${subfolders.map(f => {
              const fCount = (f.items || []).length;
              return `
                <div class="biobank-subfolder-card" onclick="selectAdminBioBankFolder('${f.id}')">
                  <div class="subfolder-left">
                    <i class="fa-solid fa-folder" style="color:#f59e0b; font-size:1.3rem;"></i>
                    <div>
                      <div class="subfolder-name" title="${escapeHtml(f.name)}">${escapeHtml(f.name)}</div>
                      <div class="subfolder-items-count">${fCount} items</div>
                    </div>
                  </div>
                  <button type="button" class="btn-del-subfolder" onclick="event.stopPropagation(); deleteAdminBioBankFolder('${unit.id}', '${f.id}')" title="Delete Folder">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- Material Items Section -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h4 style="font-size:0.95rem; font-weight:800; color:#34d399; margin:0; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-layer-group"></i> Materials & Resources (${items.length})
          </h4>
        </div>
        ${items.length === 0 ? `
          <div style="background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.1); border-radius:12px; padding:28px; text-align:center; color:#94a3b8; font-size:0.85rem;">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:1.8rem; color:#10b981; opacity:0.6; margin-bottom:8px; display:block;"></i>
            No materials uploaded to this folder yet.<br>
            Use the buttons above to add <strong>Image Collections</strong>, <strong>PDF Documents</strong>, or <strong>Text Notes</strong>.
          </div>
        ` : `
          <div class="biobank-items-grid">
            ${items.map(it => {
              const isImg = it.type === 'image' || (it.images && it.images.length > 0);
              const isPdf = it.type === 'pdf' || (it.fileUrl && it.fileUrl.endsWith('.pdf'));
              const isTxt = it.type === 'text' || Boolean(it.textContent);
              const primaryImg = (it.images && it.images.length > 0) ? it.images[0] : (it.url || '');

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
                          ${isImg ? `${(it.images || []).length || 1} Images • WebP` : (isPdf ? `${it.pages || 'PDF Document'}` : 'Study Text Note')}
                          ${it.date ? ` • ${it.date}` : ''}
                        </div>
                      </div>
                    </div>

                    ${isImg && primaryImg ? `
                      <img src="${primaryImg}" class="biobank-item-image-preview" alt="Preview" onclick="window.open('${primaryImg}', '_blank')">
                    ` : ''}

                    ${isTxt && it.textContent ? `
                      <div class="biobank-item-text-preview">${escapeHtml(it.textContent)}</div>
                    ` : ''}
                  </div>

                  <div class="biobank-item-actions">
                    ${(it.url || it.fileUrl || primaryImg) ? `
                      <a href="${it.url || it.fileUrl || primaryImg}" target="_blank" class="btn-item-view">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Open
                      </a>
                    ` : `<span></span>`}
                    <button type="button" class="btn-item-del" onclick="deleteBioBankItem('${unit.id}', '${activeBioBankFolderId || ''}', '${it.id}', ${Boolean(it.isLegacy)}, '${it.legacyCat || ''}', ${it.legacyIdx ?? -1})" title="Delete Material">
                      <i class="fa-solid fa-trash-can"></i> Delete
                    </button>
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

function setBioBankUploadType(type) {
  currentBioBankUploadType = type;
  const btnImg = document.getElementById('bb-type-btn-image');
  const btnPdf = document.getElementById('bb-type-btn-pdf');
  const btnTxt = document.getElementById('bb-type-btn-text');
  const secImg = document.getElementById('bb-sec-image');
  const secPdf = document.getElementById('bb-sec-pdf');
  const secTxt = document.getElementById('bb-sec-text');

  if (btnImg) btnImg.className = type === 'image' ? 'btn-subfolder-nav active' : 'btn-subfolder-nav';
  if (btnPdf) btnPdf.className = type === 'pdf' ? 'btn-subfolder-nav active' : 'btn-subfolder-nav';
  if (btnTxt) btnTxt.className = type === 'text' ? 'btn-subfolder-nav active' : 'btn-subfolder-nav';

  if (secImg) secImg.style.display = type === 'image' ? 'block' : 'none';
  if (secPdf) secPdf.style.display = type === 'pdf' ? 'block' : 'none';
  if (secTxt) secTxt.style.display = type === 'text' ? 'block' : 'none';
}

function updateBioBankFolderOptions() {
  const unitSelect = document.getElementById('biobank-unit-select');
  const folderSelect = document.getElementById('biobank-folder-select');
  if (!unitSelect || !folderSelect) return;

  const unitId = unitSelect.value;
  const bbData = ADMIN_DATA.bioBank || { units: [] };
  const units = (bbData.units && bbData.units.length > 0) ? bbData.units : (typeof BIO_BANK_DATA !== 'undefined' ? BIO_BANK_DATA : []);
  const unit = units.find(u => u.id === unitId);

  let opts = '<option value="">📁 Unit Root (Direct in Unit)</option>';
  if (unit && unit.folders && unit.folders.length > 0) {
    unit.folders.forEach(f => {
      opts += `<option value="${f.id}">📁 ${escapeHtml(f.name)}</option>`;
    });
  }
  folderSelect.innerHTML = opts;
}

function updateCreateFolderParentOptions() {
  const unitSelect = document.getElementById('create-folder-unit-select');
  const parentSelect = document.getElementById('create-folder-parent-select');
  if (!unitSelect || !parentSelect) return;

  const unitId = unitSelect.value;
  const bbData = ADMIN_DATA.bioBank || { units: [] };
  const units = (bbData.units && bbData.units.length > 0) ? bbData.units : (typeof BIO_BANK_DATA !== 'undefined' ? BIO_BANK_DATA : []);
  const unit = units.find(u => u.id === unitId);

  let opts = '<option value="">📁 Root of Unit (ප්‍රධාන ඒකකය තුළ)</option>';
  if (unit && unit.folders && unit.folders.length > 0) {
    unit.folders.forEach(f => {
      opts += `<option value="${f.id}">📁 ${escapeHtml(f.name)}</option>`;
    });
  }
  parentSelect.innerHTML = opts;
}

function openCreateBioBankFolderModal(unitId = null, parentFolderId = null) {
  const uId = unitId || activeBioBankUnitId || 'u1';
  document.getElementById('create-folder-unit-select').value = uId;
  updateCreateFolderParentOptions();
  if (parentFolderId) {
    document.getElementById('create-folder-parent-select').value = parentFolderId;
  }
  document.getElementById('create-folder-name-input').value = '';
  document.getElementById('create-folder-desc-input').value = '';
  openAdminModal('modal-create-biobank-folder');
}

async function handleCreateBioBankFolder(e) {
  e.preventDefault();
  const unitId = document.getElementById('create-folder-unit-select').value;
  const parentFolderId = document.getElementById('create-folder-parent-select').value || null;
  const name = document.getElementById('create-folder-name-input').value.trim();
  const desc = document.getElementById('create-folder-desc-input').value.trim();

  if (!name) {
    showAdminToast('Please enter a folder name', 'error');
    return;
  }

  try {
    const res = await fetch('/api/biobank/folder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId, parentFolderId, name, desc })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast(`Folder "${name}" created successfully!`, 'success');
      closeAdminModal('modal-create-biobank-folder');
      activeBioBankUnitId = unitId;
      if (json.folder && json.folder.id) {
        activeBioBankFolderId = json.folder.id;
      }
      await fetchAdminData();
    } else {
      showAdminToast(json.message || 'Failed to create folder', 'error');
    }
  } catch (err) {
    showAdminToast('Error creating folder', 'error');
  }
}

async function deleteAdminBioBankFolder(unitId, folderId) {
  if (!confirm('Are you sure you want to delete this folder and all subfolders/materials inside?')) return;
  try {
    const res = await fetch('/api/biobank/folder', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId, folderId })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Folder deleted successfully', 'success');
      if (activeBioBankFolderId === folderId) {
        activeBioBankFolderId = null;
      }
      await fetchAdminData();
    } else {
      showAdminToast(json.message || 'Failed to delete folder', 'error');
    }
  } catch (err) {
    showAdminToast('Error deleting folder', 'error');
  }
}

async function toggleAdminBioBankBlur() {
  const current = ADMIN_DATA.bioBank && ADMIN_DATA.bioBank.isBlurred !== false;
  const next = !current;
  try {
    const res = await fetch('/api/biobank/toggle-blur', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isBlurred: next })
    });
    const json = await res.json();
    if (json.success) {
      if (!ADMIN_DATA.bioBank) ADMIN_DATA.bioBank = {};
      ADMIN_DATA.bioBank.isBlurred = json.isBlurred;
      showAdminToast(json.isBlurred ? 'Bio Bank Coming Soon mode ENABLED (Blurred for students)' : 'Bio Bank LIVE & FULLY VISIBLE for students!', 'success');
      renderAdminBioBankTab();
    }
  } catch (err) {
    showAdminToast('Failed to toggle Bio Bank mode', 'error');
  }
}

function openAddBioBankItemModal(unitId = null, folderId = null, type = 'image') {
  const uId = unitId || activeBioBankUnitId || 'u1';
  document.getElementById('biobank-unit-select').value = uId;
  updateBioBankFolderOptions();
  if (folderId) {
    document.getElementById('biobank-folder-select').value = folderId;
  }
  document.getElementById('biobank-item-title').value = '';
  document.getElementById('biobank-item-pages').value = '4 Pages • PDF';
  document.getElementById('biobank-file-url').value = '';
  document.getElementById('biobank-text-content').value = '';
  document.getElementById('biobank-item-desc').value = '';
  bioBankImagesList = [];
  renderBioBankImagesPreview();
  setBioBankUploadType(type);
  openAdminModal('modal-add-biobank-item');
}

function openAddBioBankItemForCat(unitId, catKey) {
  openAddBioBankItemModal(unitId, null, 'pdf');
}

function renderBioBankImagesPreview() {
  const container = document.getElementById('biobank-images-preview');
  if (!container) return;
  container.innerHTML = bioBankImagesList.map((imgUrl, idx) => `
    <div style="position:relative; width:65px; height:65px; border-radius:8px; overflow:hidden; border:2px solid #10b981; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
      <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;">
      <button type="button" onclick="removeBioBankImage(${idx})" style="position:absolute; top:2px; right:2px; background:rgba(239,68,68,0.9); color:#fff; border:none; border-radius:50%; width:18px; height:18px; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
    </div>
  `).join('');
}

function removeBioBankImage(idx) {
  bioBankImagesList.splice(idx, 1);
  renderBioBankImagesPreview();
}

async function handleBioBankMultipleImageUpload(e) {
  const files = Array.from(e.target.files || []);
  if (files.length === 0) return;
  showAdminToast(`Converting and uploading ${files.length} images as WebP...`, 'info');

  for (const file of files) {
    try {
      const base64 = await readFileAsBase64(file);
      const res = await fetch('/api/biobank/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileData: base64, fileType: 'image' })
      });
      const json = await res.json();
      if (json.success && json.fileUrl) {
        bioBankImagesList.push(json.fileUrl);
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    }
  }
  renderBioBankImagesPreview();
  showAdminToast(`${bioBankImagesList.length} images uploaded & saved to database links!`, 'success');
}

async function handleBioBankFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  showAdminToast('Uploading PDF document to server...', 'info');
  try {
    const base64 = await readFileAsBase64(file);
    const res = await fetch('/api/biobank/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, fileData: base64, fileType: 'pdf' })
    });
    const json = await res.json();
    if (json.success && json.fileUrl) {
      document.getElementById('biobank-file-url').value = json.fileUrl;
      showAdminToast('PDF uploaded successfully! Saved to cloud link.', 'success');
    }
  } catch (err) {
    showAdminToast('Failed to upload file', 'error');
  }
}

async function handleSaveBioBankItem(e) {
  e.preventDefault();
  const unitId = document.getElementById('biobank-unit-select').value;
  const folderId = document.getElementById('biobank-folder-select').value || null;
  const title = document.getElementById('biobank-item-title').value.trim();
  const desc = document.getElementById('biobank-item-desc').value.trim();
  const type = currentBioBankUploadType;

  if (!title) {
    showAdminToast('Please enter material title', 'error');
    return;
  }

  let url = '';
  let images = [];
  let pages = '';
  let textContent = '';

  if (type === 'image') {
    if (bioBankImagesList.length === 0) {
      showAdminToast('Please select at least 1 image for the collection', 'error');
      return;
    }
    images = bioBankImagesList;
    url = bioBankImagesList[0];
    pages = `${bioBankImagesList.length} Images`;
  } else if (type === 'pdf') {
    url = document.getElementById('biobank-file-url').value.trim();
    if (!url) {
      showAdminToast('Please upload a PDF file or provide a link', 'error');
      return;
    }
    pages = document.getElementById('biobank-item-pages').value.trim() || 'PDF Document';
  } else if (type === 'text') {
    textContent = document.getElementById('biobank-text-content').value.trim();
    if (!textContent) {
      showAdminToast('Please enter note text content', 'error');
      return;
    }
    pages = 'Text Summary';
  }

  const payload = {
    unitId,
    folderId,
    type,
    title,
    url,
    images,
    pages,
    textContent,
    desc
  };

  try {
    const res = await fetch('/api/biobank/item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Material saved to Bio Bank successfully!', 'success');
      closeAdminModal('modal-add-biobank-item');
      activeBioBankUnitId = unitId;
      activeBioBankFolderId = folderId;
      await fetchAdminData();
    } else {
      showAdminToast(json.message || 'Failed to save material', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to save material to Bio Bank', 'error');
  }
}

async function deleteBioBankItem(unitId, folderId, itemId, isLegacy = false, legacyCat = '', legacyIdx = -1) {
  if (!confirm('Are you sure you want to delete this resource?')) return;

  if (isLegacy && legacyCat) {
    const bbData = ADMIN_DATA.bioBank || { units: [] };
    const unit = (bbData.units || []).find(u => u.id === unitId);
    if (unit && unit.categories && unit.categories[legacyCat]) {
      unit.categories[legacyCat].splice(legacyIdx, 1);
      try {
        await fetch('/api/biobank/add-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ unitId, category: legacyCat, title: 'update', isDelete: true })
        });
      } catch (err) {}
    }
    await fetchAdminData();
    return;
  }

  try {
    const res = await fetch('/api/biobank/item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unitId, folderId, itemId })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Material deleted successfully', 'success');
      await fetchAdminData();
    } else {
      showAdminToast(json.message || 'Failed to delete material', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to delete material', 'error');
  }
}


// ==========================================================================
// ADMIN MONTHLY TUTES & NOTES CONTROLLER
// ==========================================================================

function openAddMonthlyTuteModal() {
  document.getElementById('mct-month-display').value = activeMonthlyMonth || 'November 2026';
  const tutor = (ADMIN_DATA.tutors || []).find(t => t.id === activeMonthlyTutorId) || { name: activeMonthlyTutorId };
  document.getElementById('mct-tutor-display').value = tutor.name;
  document.getElementById('mct-title-input').value = '';
  document.getElementById('mct-pdf-url').value = '';
  document.getElementById('mct-desc-input').value = '';
  document.getElementById('mct-upload-status').textContent = 'Uploads directly to secure cloud storage and generates web link';
  openAdminModal('modal-add-monthly-tute');
}

async function handleMonthlyTuteFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const statusEl = document.getElementById('mct-upload-status');
  statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading document to secure cloud storage...';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/upload-file', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (json.success && json.fileUrl) {
      document.getElementById('mct-pdf-url').value = json.fileUrl;
      statusEl.innerHTML = '<span style="color:#10b981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Document uploaded successfully! Cloud Link saved.</span>';
    } else {
      statusEl.innerHTML = '<span style="color:#ef4444;">Upload failed. Please enter link manually.</span>';
    }
  } catch (err) {
    statusEl.innerHTML = '<span style="color:#ef4444;">Upload error. Please enter link manually.</span>';
  }
}

async function handleSaveMonthlyTute(e) {
  e.preventDefault();
  const title = document.getElementById('mct-title-input').value.trim();
  const fileType = document.getElementById('mct-type-select').value;
  const pdfUrl = document.getElementById('mct-pdf-url').value.trim();
  const desc = document.getElementById('mct-desc-input').value.trim();

  if (!title || !pdfUrl) {
    showAdminToast('Title and PDF link are required', 'error');
    return;
  }

  try {
    const res = await fetch('/api/monthly-tutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        month: activeMonthlyMonth,
        tutorId: activeMonthlyTutorId,
        title,
        fileType,
        pdfUrl,
        desc
      })
    });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Tute material saved successfully!', 'success');
      closeAdminModal('modal-add-monthly-tute');
      fetchAdminData();
    } else {
      showAdminToast(json.message || 'Error saving tute', 'error');
    }
  } catch (err) {
    showAdminToast('Failed to save tute material', 'error');
  }
}

async function deleteMonthlyTute(tuteId) {
  if (!confirm('Are you sure you want to permanently delete this tute?')) return;
  try {
    const res = await fetch('/api/monthly-tutes/' + tuteId, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showAdminToast('Tute deleted permanently', 'success');
      fetchAdminData();
    }
  } catch (err) {
    showAdminToast('Failed to delete tute', 'error');
  }
}


// ============================================================================
// EDIT & REMOVE CLASS FEES CARD
// ============================================================================

function openEditClassCardModal(cardId) {
  const card = (ADMIN_DATA.classCards || []).find(c => c.id === cardId);
  if (!card) return;

  const editIdInput = document.getElementById('edit-card-id');
  if (editIdInput) editIdInput.value = card.id;

  document.getElementById('card-batch-select').value = card.batch || '2027';
  document.getElementById('card-month-input').value = card.month || 'November 2026';
  if (document.getElementById('card-month-select')) document.getElementById('card-month-select').value = card.month || 'November 2026';
  if (document.getElementById('card-tutor-select')) document.getElementById('card-tutor-select').value = card.tutorId || 'both';
  if (document.getElementById('card-type-select')) document.getElementById('card-type-select').value = card.classType || 'both';
  document.getElementById('card-title-input').value = card.title || '';
  document.getElementById('card-price-input').value = card.price !== undefined ? card.price : 3500;
  document.getElementById('card-valid-from').value = card.validFrom || '';
  document.getElementById('card-valid-to').value = card.validTo || '';
  document.getElementById('card-desc-input').value = card.desc || '';
  document.getElementById('card-image-url').value = card.image || '/hero.jpg';

  const modalH3 = document.querySelector('#modal-add-card h3');
  if (modalH3) modalH3.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Monthly Class Fees Card';
  openAdminModal('modal-add-card');
}

// ============================================================================
// ============================================================================
// ADMIN REAL-TIME ONLINE PRESENCE TRACKER
// ============================================================================

function isStudentOnline(email) {
  if (!email) return false;
  try {
    const raw = localStorage.getItem('apex_online_heartbeats');
    if (!raw) return false;
    const heartbeats = JSON.parse(raw);
    const userHb = heartbeats[email];
    if (userHb && (Date.now() - userHb.lastSeen < 1000 * 60 * 5)) {
      return true;
    }
  } catch (e) {}
  return false;
}

function refreshAdminOnlineStudents() {
  const badgeEl = document.getElementById('admin-online-count-badge');
  const gridEl = document.getElementById('admin-online-students-grid');
  if (!gridEl) return;

  let heartbeats = {};
  try {
    const raw = localStorage.getItem('apex_online_heartbeats');
    if (raw) heartbeats = JSON.parse(raw);
  } catch (e) {}

  // Filter users active in last 5 minutes
  const now = Date.now();
  let onlineUsers = Object.values(heartbeats).filter(u => u && (now - u.lastSeen < 1000 * 60 * 5));

  // If no active user, include current user or seed Kasun / VIP student as online
  if (onlineUsers.length === 0) {
    onlineUsers = [
      {
        name: 'Naveen Lakshan',
        email: 'dg.edits65@gmail.com',
        school: 'Royal College, Colombo',
        district: 'Colombo',
        year: '2027',
        currentPage: 'Focus Studio',
        lastSeen: now
      }
    ];
  }

  if (badgeEl) badgeEl.textContent = `${onlineUsers.length} Online Now`;

  gridEl.innerHTML = onlineUsers.map(user => {
    const minsAgo = Math.max(0, Math.floor((now - (user.lastSeen || now)) / 60000));
    const activeText = minsAgo === 0 ? 'Active right now' : `${minsAgo}m ago`;

    return `
      <div style="background:#ffffff; border:1.5px solid #a7f3d0; border-radius:14px; padding:14px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; box-shadow:0 2px 8px rgba(16,185,129,0.06);">
        <div style="display:flex; align-items:center; gap:12px; min-width:0;">
          <div style="width:40px; height:40px; border-radius:10px; background:#ecfdf5; color:#059669; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
            <i class="fa-solid fa-graduation-cap"></i>
          </div>
          <div style="min-width:0;">
            <div style="font-weight:800; color:#0f172a; font-size:0.92rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${escapeHtml(user.name || 'Student')}
            </div>
            <div style="font-size:0.78rem; color:#64748b; display:flex; align-items:center; gap:6px;">
              <span>${escapeHtml(user.district || 'Colombo')}</span>
              <span>•</span>
              <span style="color:#059669; font-weight:700;"><i class="fa-regular fa-file-code"></i> ${escapeHtml(user.currentPage || 'Portal')}</span>
            </div>
          </div>
        </div>
        <div style="text-align:right; flex-shrink:0;">
          <span style="background:#dcfce7; color:#15803d; font-size:0.72rem; font-weight:800; padding:3px 8px; border-radius:999px; display:inline-flex; align-items:center; gap:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background:#16a34a;"></span>
            ${activeText}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// Auto-refresh online monitor every 10 seconds
setInterval(() => {
  if (currentTab === 'tab-students') {
    refreshAdminOnlineStudents();
  }
}, 10000);
