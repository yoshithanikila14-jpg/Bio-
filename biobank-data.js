// ==========================================================================
// APEX BIO BANK - SHARED RESOURCE DATA
// Shared across Standalone Public Page (/biobank) and Student Portal (tab-biobank)
// Admin updates in the future will automatically populate both!
// ==========================================================================

const BIO_BANK_DATA = [
  {
    id: 'u1',
    num: '01',
    name: 'ජීව විද්‍යාව හැඳින්වීම',
    eng: 'Introduction to Biology',
    icon: '🌿',
    categories: {
      essays: [
        { title: 'ජීවයේ ලක්ෂණ සහ විද්‍යාත්මක ක්‍රමයේ පියවර රචනා ලකුණු රාමුව', pages: '4 Pages', format: 'PDF', date: '2026 Edition' }
      ],
      mindmaps: [
        { title: 'විද්‍යාත්මක විමර්ශන ක්‍රමවේදය Concept Flowchart', pages: 'High-Res A4', format: 'Vector Map', date: 'Color Atlas' }
      ],
      shortnotes: [
        { title: 'ජීවයේ ප්‍රධාන ගුණාංග කෙටි සටහන (High-Yield Summary)', pages: '2 Pages', format: 'PDF', date: 'Verified' }
      ],
      mcqs: [
        { title: 'Unit 01 විභාග ඉලක්කගත MCQs 50 සහ සම්පූර්ණ විවරණය', pages: '8 Pages', format: 'PDF', date: 'Model Bank' }
      ]
    }
  },
  {
    id: 'u2',
    num: '02',
    name: 'ජීවයේ රසායනික සහ සෛලීය පදනම',
    eng: 'Chemical & Cellular Basis of Life',
    icon: '🔬',
    categories: {
      essays: [
        { title: 'ප්‍රෝටීන ව්‍යුහ මට්ටම් සහ එන්සයිම නිෂේධන ආකෘති Essay Points', pages: '6 Pages', format: 'PDF', date: '2026 Edition' },
        { title: 'ප්ලාස්ම පටලයේ තරල විචිත්‍ර ආකෘතිය හා පටල පරිවහන රචනා සටහන', pages: '5 Pages', format: 'PDF', date: 'Marking Scheme' },
        { title: 'ප්‍රභාසංශ්ලේෂණ ආලෝක හා කැල්වින් චක්‍ර සම්පූර්ණ Essay Answer', pages: '8 Pages', format: 'PDF', date: 'Model Essay' }
      ],
      mindmaps: [
        { title: 'ජෛව අණු (කාබෝහයිඩ්‍රේට, ලිපිඩ, ප්‍රෝටීන, න්‍යෂ්ටික අම්ල) Master Mind Map', pages: 'Ultra HD 4K', format: 'Mind Map', date: 'Color Print' },
        { title: 'සෛලීය ශ්වසන පථ (Glycolysis, Krebs, ETC) Flowchart Atlas', pages: 'Ultra HD', format: 'Flowchart', date: 'Visual Map' }
      ],
      shortnotes: [
        { title: 'ජලයේ සුවිශේෂී ගුණාංග සහ ජීවයට ඇති වැදගත්කම Short Sheet', pages: '3 Pages', format: 'PDF', date: 'High Yield' },
        { title: 'අනූනන හා ඌනන විභාජන සංසන්දනාත්මක වගුව', pages: '4 Pages', format: 'PDF', date: 'Summary' }
      ],
      mcqs: [
        { title: 'Unit 02 පසුගිය විභාග MCQs 250 සහ ප්‍රශ්න වර්ගීකරණය', pages: '24 Pages', format: 'PDF', date: 'Target Bank' }
      ]
    }
  },
  {
    id: 'u3',
    num: '03',
    name: 'පරිණාමය සහ ජෛව විවිධත්වය',
    eng: 'Evolution and Biodiversity',
    icon: '🌳',
    categories: {
      essays: [
        { title: 'ශාක රාජධානියේ ප්‍රධාන වංශවල ජීවන චක්‍ර සංසන්දනාත්මක Essay', pages: '7 Pages', format: 'PDF', date: 'Exam Target' },
        { title: 'අපෘෂ්ඨවංශී වංශ 8 ලක්ෂණ සහ නිදර්ශක යතුරු Essay Guide', pages: '6 Pages', format: 'PDF', date: 'NIE Reference' }
      ],
      mindmaps: [
        { title: 'භූ විද්‍යාත්මක කාල පරිමාණය සහ ජීවයේ සම්භවය Mind Map', pages: 'Poster A3', format: 'Mind Map', date: 'Visual Tree' },
        { title: 'අධිරාජධානි 3 වර්ගීකරණ පද්ධතිය Complete Taxonomy Chart', pages: 'Poster A3', format: 'Classification', date: 'Color Atlas' }
      ],
      shortnotes: [
        { title: 'Pogonatum, Neprolepis, Cycus ජීවන චක්‍ර කෙටි සටහන්', pages: '5 Pages', format: 'PDF', date: 'Quick Review' },
        { title: 'දිලීර රාජධානියේ වංශ සංසන්දනාත්මක සටහන', pages: '3 Pages', format: 'PDF', date: 'Short Note' }
      ],
      mcqs: [
        { title: 'ජෛව විවිධත්වය ඉලක්කගත MCQs 180 විවරණ සහිතව', pages: '16 Pages', format: 'PDF', date: 'Target Bank' }
      ]
    }
  },
  {
    id: 'u4',
    num: '04',
    name: 'ශාක ආකාරය සහ ක්‍රියාකාරීත්වය',
    eng: 'Plant Form & Physiology',
    icon: '🌱',
    categories: {
      essays: [
        { title: 'ශාක ජල සබඳතා, සංසක්ති-ආතති වාදය හා රසෝද්ගමන Essay Points', pages: '6 Pages', format: 'PDF', date: '2026 Model' },
        { title: 'පූටිකා විවෘත වීම හා වැසීමේ K+ අයන ප්‍රවාහ කල්පිතය Essay Guide', pages: '5 Pages', format: 'PDF', date: 'Marking Scheme' },
        { title: 'ශාක කඳේ හා මුලේ ද්විතියික වර්ධනය විභාග රචනා සටහන', pages: '7 Pages', format: 'PDF', date: 'Essay Standard' }
      ],
      mindmaps: [
        { title: 'ශාක හෝමෝන 5 (Auxin, Gibberellin, Cytokinin, ABA, Ethylene) Function Map', pages: 'High-Res A4', format: 'Mind Map', date: 'Master Map' },
        { title: 'ප්ලෝයමීය පීඩන ප්‍රවාහ කල්පිතය Diagrammatic Flowchart', pages: 'A4 Vector', format: 'Flowchart', date: 'Diagram Chart' }
      ],
      shortnotes: [
        { title: 'ශාක පටක වර්ගීකරණය සහ සෛල ව්‍යුහ කෙටි සටහන්', pages: '4 Pages', format: 'PDF', date: 'Summary Note' },
        { title: 'දීප්ති කාලීනතාව සහ ශාක ප්‍රතිචාර High-Yield Review', pages: '3 Pages', format: 'PDF', date: 'Pocket Note' }
      ],
      mcqs: [
        { title: 'Unit 04 ශාක කායික විද්‍යාව MCQs 200 ප්‍රශ්න බැංකුව', pages: '18 Pages', format: 'PDF', date: 'Exam Bank' }
      ]
    }
  },
  {
    id: 'u5',
    num: '05',
    name: 'සත්ව ආකාරය සහ ක්‍රියාකාරීත්වය',
    eng: 'Animal Physiology & Human Systems',
    icon: '🫀',
    categories: {
      essays: [
        { title: 'මානව හෘදයේ ක්‍රියාකාරීත්වය, හෘද චක්‍රය හා ECG තරංග Essay Model', pages: '8 Pages', format: 'PDF', date: 'High Yield' },
        { title: 'වෘක්කාණුව සහ මුත්‍රා සෑදීමේ ප්‍රතිධාරා ගුණක යාන්ත්‍රණය Essay', pages: '7 Pages', format: 'PDF', date: 'Marking Standard' },
        { title: 'ස්නායු ආවේග සම්ප්‍රේෂණය හා රසායනික උපාගමික පරිවහන Essay', pages: '6 Pages', format: 'PDF', date: 'Model Answer' },
        { title: 'මානව අන්තරාසර්ග හෝමෝන සහ ප්‍රතිශක්තිකරණ පද්ධතිය Essay Points', pages: '8 Pages', format: 'PDF', date: 'Full Marks' }
      ],
      mindmaps: [
        { title: 'මානව දේහ පද්ධති 8 (හෘදය, වෘක්ක, ස්නායු, ආමාශය) Master Mind Maps', pages: 'Ultra HD Set', format: 'Atlas Set', date: 'Full Color' },
        { title: 'ක්‍රියා විභවය සහ ස්නායු සම්ප්‍රේෂණ Action Potential Flowchart', pages: 'High-Res A4', format: 'Flowchart', date: 'Concept Map' }
      ],
      shortnotes: [
        { title: 'ආශ්වාස ප්‍රාශ්වාස සමස්ථිතික යාමනය කෙටි සටහන', pages: '3 Pages', format: 'PDF', date: 'Cheat Sheet' },
        { title: 'හෝමෝන හා ඉලක්ක ඉන්ද්‍රිය සම්පූර්ණ සංක්ෂිප්ත වගුව', pages: '5 Pages', format: 'PDF', date: 'Exam Ready' }
      ],
      mcqs: [
        { title: 'Unit 05 මානව කායික විද්‍යාව MCQs 300 විශේෂ ප්‍රශ්න සංග්‍රහය', pages: '28 Pages', format: 'PDF', date: 'Target Bank' }
      ]
    }
  },
  {
    id: 'u6',
    num: '06',
    name: 'ප්‍රවේණිය',
    eng: 'Genetics & Heredity',
    icon: '🧬',
    categories: {
      essays: [
        { title: 'මෙන්ඩලීය ආවේණිය, ද්විසංකරණ හා පෙළපත් සටහන් Essay Strategy', pages: '6 Pages', format: 'PDF', date: '2026 Edition' },
        { title: 'ලිංග ප්‍රතිබද්ධ උරුමය හා වර්ණදේහ විකෘතිතා රචනා විවරණය', pages: '5 Pages', format: 'PDF', date: 'Marking Scheme' }
      ],
      mindmaps: [
        { title: 'පෙළපත් සටහන් (Pedigrees) විනාඩි 2න් විසඳන Algorithm Mind Map', pages: 'A4 Vector', format: 'Strategy Map', date: 'Shortcuts' },
        { title: 'ප්‍රවේණික රටා සහ බහු ඇලීලතා (ABO Blood Group) Concept Map', pages: 'High-Res A4', format: 'Concept Map', date: 'Color Atlas' }
      ],
      shortnotes: [
        { title: 'ප්‍රවේණි විද්‍යා අර්ථ දැක්වීම් සහ සූත්‍ර කෙටි සටහන', pages: '3 Pages', format: 'PDF', date: 'Formula Sheet' }
      ],
      mcqs: [
        { title: 'ප්‍රවේණිය හා පෙළපත් ගැටළු MCQs 150 විවරණ සහිතව', pages: '14 Pages', format: 'PDF', date: 'MCQ Bank' }
      ]
    }
  },
  {
    id: 'u7',
    num: '07',
    name: 'අණුක ජීව විද්‍යාව සහ rDNA තාක්ෂණය',
    eng: 'Molecular Biology & Biotechnology',
    icon: '🧪',
    categories: {
      essays: [
        { title: 'DNA අනුබලනය (Replication), Transcription හා Translation Essay', pages: '7 Pages', format: 'PDF', date: 'Exam Target' },
        { title: 'ප්‍රතිසංයෝජිත DNA (rDNA) හා PCR තාක්ෂණය සම්පූර්ණ Essay Points', pages: '6 Pages', format: 'PDF', date: 'Modern Tech' }
      ],
      mindmaps: [
        { title: 'මධ්‍ය ප්‍රවාහය (Central Dogma) & Protein Synthesis Mind Map', pages: 'High-Res A4', format: 'Mind Map', date: 'Full Map' }
      ],
      shortnotes: [
        { title: 'ජෙල් ඉලෙක්ට්‍රොෆොරෙසිස් සහ DNA Fingerprinting පියවර සටහන', pages: '3 Pages', format: 'PDF', date: 'Short Guide' }
      ],
      mcqs: [
        { title: 'Unit 07 අණුක ජීව විද්‍යාව MCQs 120 ප්‍රශ්න බැංකුව', pages: '12 Pages', format: 'PDF', date: 'Target Bank' }
      ]
    }
  },
  {
    id: 'u8',
    num: '08',
    name: 'පාරිසරික ජීව විද්‍යාව',
    eng: 'Environmental Biology',
    icon: '🌍',
    categories: {
      essays: [
        { title: 'පරිසර පද්ධති ශක්ති ප්‍රවාහය හා පාරිසරික පිරමිඩ Essay Points', pages: '5 Pages', format: 'PDF', date: 'NIE Standard' },
        { title: 'ශ්‍රී ලංකාවේ ජෛව විවිධත්වය සහ සංරක්ෂණ උපාය මාර්ග Essay Answer', pages: '6 Pages', format: 'PDF', date: 'Model Essay' }
      ],
      mindmaps: [
        { title: 'ජෛව රසායනික චක්‍ර (කාබන්, නයිට්‍රජන්, ජලය) Master Flowchart', pages: 'A4 Vector', format: 'Cycle Map', date: 'High Res' }
      ],
      shortnotes: [
        { title: 'ශ්‍රී ලංකාවේ ප්‍රධාන වෘක්ෂලතා කලාප සහ ආවේණික ජීවී විශේෂ', pages: '4 Pages', format: 'PDF', date: 'Quick Notes' }
      ],
      mcqs: [
        { title: 'පාරිසරික විද්‍යාව MCQs 100 විවරණ සහිතව', pages: '10 Pages', format: 'PDF', date: 'Question Bank' }
      ]
    }
  },
  {
    id: 'u9',
    num: '09',
    name: 'ක්ෂුද්‍ර ජීව විද්‍යාව',
    eng: 'Microbiology',
    icon: '🦠',
    categories: {
      essays: [
        { title: 'ක්ෂුද්‍රජීවී වර්ධන වක්‍රය සහ වන්ධ්‍යාකරණ ක්‍රමවේද Essay Model', pages: '5 Pages', format: 'PDF', date: 'High Yield' }
      ],
      mindmaps: [
        { title: 'බැක්ටීරියා, වයිරස සහ දිලීර රෝගකාරක Mind Map', pages: 'High-Res A4', format: 'Pathogen Map', date: 'Visual Chart' }
      ],
      shortnotes: [
        { title: 'ආහාර ක්ෂුද්‍රජීව විද්‍යාව සහ කාර්මික යෙදවුම් කෙටි සටහන', pages: '3 Pages', format: 'PDF', date: 'Summary' }
      ],
      mcqs: [
        { title: 'Unit 09 ක්ෂුද්‍රජීව විද්‍යාව Target MCQs 80', pages: '8 Pages', format: 'PDF', date: 'MCQ Bank' }
      ]
    }
  },
  {
    id: 'u10',
    num: '10',
    name: 'ව්‍යවහාරික ජීව විද්‍යාව',
    eng: 'Applied Biology',
    icon: '🌾',
    categories: {
      essays: [
        { title: 'පටක රෝපණ තාක්ෂණය සහ ජලජීවී වගාව විභාග රචනා සටහන', pages: '5 Pages', format: 'PDF', date: '2026 Model' }
      ],
      mindmaps: [
        { title: 'කෘෂිකාර්මික පළිබෝධ පාලනය (IPM) සහ ජෛව පොහොර Mind Map', pages: 'A4 Vector', format: 'Agri Map', date: 'Full Color' }
      ],
      shortnotes: [
        { title: 'නැනෝ තාක්ෂණය සහ කාර්මික ක්ෂුද්‍රජීවී නිෂ්පාදන සාරාංශය', pages: '3 Pages', format: 'PDF', date: 'Quick Guide' }
      ],
      mcqs: [
        { title: 'Unit 10 ව්‍යවහාරික ජීව විද්‍යාව Target MCQs 80', pages: '8 Pages', format: 'PDF', date: 'Target Bank' }
      ]
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BIO_BANK_DATA };
}

