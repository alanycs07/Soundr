export type TabName =
  | 'home'
  | 'hearing'
  | 'cleaning'
  | 'learn'
  | 'about'
  | 'account'
  | 'plans';

export type EarSide = 'left' | 'right';

export type HearingResponse = {
  left: boolean;
  right: boolean;
};

export type Arena = {
  id: number;
  name: string;
  days: number;
  reward: string;
};

export type Frequency = {
  hz: number;
  label: string;
  weight: number;
};

export type CleaningCard = {
  title: string;
  body: string;
  cta?: string;
};

export type UserMode = 'basic' | 'pro';

export type AppUser = {
  username: string;
  password?: string;
  mode: UserMode;
  redeemedCode?: string | null;
};

export type DailyTaskStatus = {
  hearingDone: boolean;
  cleaningDone: boolean;
  streakAwarded: boolean;
  learnQuizDone: boolean;   // did user pass today's quiz (≥80%)?
};

export type HearingEntry = {
  date: string;
  score: number;
  percentile: number;
  rank: string;
  frequencyResults: Record<number, number>;
};

export type AppProgress = {
  streak: number;
  totalCleanings: number;
  totalHearingTests: number;
  lastCompletedDate: string | null;
  dailyStatus: Record<string, DailyTaskStatus>;
  hearingHistory: HearingEntry[];
  learnPoints: number;   // cumulative quiz pass points
};

// ─── Article + Quiz content ───────────────────────────────────────────────────

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // shown after answering
};

export type DailyArticle = {
  id: number;
  tag: string;          // e.g. "STUDY", "FUN FACT", "RESEARCH"
  readTime: string;     // e.g. "3 min read"
  title: string;
  subtitle: string;
  body: string[];       // paragraphs
  source: string;       // citation line
  quiz: QuizQuestion[];
};

// 7 articles — rotate by day-of-week (index = dayOfWeek % 7)
export const DAILY_ARTICLES: DailyArticle[] = [
  {
    id: 0,
    tag: 'RESEARCH',
    readTime: '3 min read',
    title: 'Noise-Induced Hearing Loss Is Now Affecting Teenagers',
    subtitle: 'A growing body of research links recreational earbud use to early hearing damage that was once seen only in adults.',
    body: [
      'For decades, noise-induced hearing loss (NIHL) was considered an occupational hazard — something that happened to factory workers, construction crews, or concert musicians after years of sustained exposure. That picture has changed dramatically in the past decade.',
      'A 2019 report from the World Health Organization estimated that 1.1 billion young people worldwide are at risk of hearing loss due to unsafe listening practices — most of it driven by personal audio devices. Earbuds, which sit directly in the ear canal and deliver sound with far greater efficiency than over-ear headphones, are a central part of the problem.',
      'The mechanism is well understood. The inner ear contains roughly 16,000 hair cells, each tuned to a specific frequency. Sustained loud sound physically bends and eventually destroys these cells. Unlike most tissues in the body, they do not regenerate. Once gone, they are gone permanently.',
      'What makes this particularly insidious for younger users is that early-stage damage is functionally invisible. Standard hearing tests — the kind administered in school — test only a narrow range of speech frequencies. High-frequency loss, which is where damage typically begins, can go undetected for years while quietly worsening.',
      'Researchers at Brigham and Women\'s Hospital found that adolescents who reported three or more hours of daily personal audio device use showed measurably poorer hearing thresholds at high frequencies compared to peers with lower usage. The pattern mirrors what audiologists see in noise-exposed adults — but shifted a generation earlier.',
      'The good news is that the damage is entirely preventable. Volume limiting, regular listening breaks using the 60/60 rule (no more than 60% volume for no more than 60 minutes at a stretch), and keeping ears clean and free of buildup that can cause users to compensate by turning up volume, all meaningfully reduce risk.',
    ],
    source: 'WHO Global Standard for Safe Listening, 2019 · Brigham and Women\'s Hospital, Audiology Research Division',
    quiz: [
      {
        question: 'Approximately how many hair cells does the human inner ear contain?',
        options: ['1,600', '16,000', '160,000', '1.6 million'],
        correctIndex: 1,
        explanation: 'The inner ear contains around 16,000 hair cells. They are tuned to specific frequencies and do not regenerate once damaged.',
      },
      {
        question: 'Why does early noise-induced hearing loss often go undetected in school hearing tests?',
        options: [
          'Schools use outdated equipment',
          'Students fake good results',
          'Standard tests only check speech frequencies, missing high-frequency damage',
          'The tests are too infrequent',
        ],
        correctIndex: 2,
        explanation: 'School hearing tests typically cover speech-range frequencies. High-frequency damage — where NIHL begins — falls outside this range and is missed until it progresses.',
      },
      {
        question: 'What is the "60/60 rule" for safe listening?',
        options: [
          '60 decibels maximum, 60 songs per day',
          '60% volume maximum, 60 minutes maximum per session',
          '60 second breaks every 60 minutes',
          '60 Hz minimum frequency, 60 kHz maximum',
        ],
        correctIndex: 1,
        explanation: 'The 60/60 rule recommends keeping volume at or below 60% and limiting listening sessions to 60 minutes before taking a break.',
      },
      {
        question: 'How does earwax buildup relate to volume and hearing risk?',
        options: [
          'It has no relationship',
          'It protects the ear from loud sounds',
          'It can cause users to turn up volume to compensate, increasing exposure',
          'It amplifies sound naturally',
        ],
        correctIndex: 2,
        explanation: 'Earwax or debris on earbud mesh can muffle sound output, leading users to raise volume to compensate — increasing their actual noise exposure.',
      },
    ],
  },
  {
    id: 1,
    tag: 'FUN FACT',
    readTime: '2 min read',
    title: 'Your Ears Never Actually Turn Off',
    subtitle: 'While every other sense shuts down during sleep, your auditory system stays on guard all night long.',
    body: [
      'Close your eyes and your visual system goes dark. Hold your nose and smell fades. But your ears? They keep working around the clock — even during the deepest stages of sleep.',
      'This is by evolutionary design. Hearing is the only sense that cannot be voluntarily switched off. You can close your eyes, hold your breath, or stop tasting — but you cannot choose not to hear. The auditory cortex remains active throughout sleep, constantly scanning the environment for threatening or significant sounds.',
      'Research using electroencephalography (EEG) has shown that the sleeping brain still processes and categorises sounds, even when the sleeper has no conscious memory of hearing anything. Familiar sounds, like your own name, trigger measurably stronger brain responses than unfamiliar ones — even during deep sleep.',
      'This has real implications for sleep quality and hearing health. Chronic exposure to ambient noise during sleep — traffic, urban sound, even a television left on — has been linked to elevated cortisol levels, cardiovascular strain, and fragmented sleep architecture, even when the sleeper does not consciously wake.',
      'Audiologists also note that sleeping with earbuds in — a growing habit among younger users — poses physical risks beyond noise exposure. The sustained pressure of an earbud against the ear canal wall during hours of sleep can cause micro-abrasions and create a warm, occluded environment that promotes bacterial growth.',
      'The takeaway is straightforward: giving your ears genuine silence at night is not a luxury. It is a meaningful contribution to both your hearing health and your overall recovery.',
    ],
    source: 'Journal of Sleep Research · American Academy of Audiology, Sleep and Hearing Position Statement',
    quiz: [
      {
        question: 'Which sense cannot be voluntarily switched off?',
        options: ['Sight', 'Smell', 'Hearing', 'Taste'],
        correctIndex: 2,
        explanation: 'Unlike other senses, hearing cannot be voluntarily disabled. The auditory system remains active even during sleep.',
      },
      {
        question: 'What does EEG research show about sound processing during sleep?',
        options: [
          'The brain ignores all sounds during sleep',
          'Only very loud sounds are processed',
          'The brain still categorises sounds, responding more strongly to familiar ones',
          'Sound processing only occurs during REM sleep',
        ],
        correctIndex: 2,
        explanation: 'EEG studies show the sleeping brain actively categorises sounds — familiar sounds like your own name trigger stronger neural responses than unfamiliar ones.',
      },
      {
        question: 'What physical risk does sleeping with earbuds pose beyond noise exposure?',
        options: [
          'Earwax hardening',
          'Micro-abrasions and bacterial growth from sustained pressure and occlusion',
          'Eardrum perforation',
          'Tinnitus from pressure changes',
        ],
        correctIndex: 1,
        explanation: 'Sustained earbud pressure during sleep can cause micro-abrasions on the ear canal wall and create a warm, occluded environment that promotes bacterial growth.',
      },
    ],
  },
  {
    id: 2,
    tag: 'STUDY',
    readTime: '4 min read',
    title: 'The Bacteria Living on Your Earbuds',
    subtitle: 'Clinical research has found that shared or infrequently cleaned earbuds can carry significant microbial loads — including strains associated with ear infections.',
    body: [
      'It is easy to think of personal audio devices as clean because they are personal. But earbuds occupy one of the most microbe-friendly environments imaginable: warm, dark, slightly moist, and in direct contact with skin that sheds cells and secretes oils continuously.',
      'A 2008 study published in the journal Otolaryngology — Head and Neck Surgery examined the bacterial flora of airline headsets and found bacterial colonies on every single sampled device. More recent research has extended this finding to consumer earbuds, identifying common skin-resident bacteria as well as opportunistic pathogens in samples taken from earbud surfaces.',
      'A study published in Nature Scientific Reports in 2025 examined the relationship between earbud hygiene habits and auditory health outcomes. Among its findings: users who cleaned their earbuds less than once a month showed significantly higher rates of external ear canal irritation than those who cleaned weekly.',
      'The most clinically significant organism found on earbud surfaces in several studies is Staphylococcus aureus — a bacterium that is a common, harmless skin resident in most circumstances but a significant pathogen when introduced into the ear canal in sufficient quantities, particularly in users with any pre-existing skin disruption or eczema.',
      'Sharing earbuds dramatically amplifies risk. Unlike skin-to-skin contact, earbud sharing creates a direct transfer route from one person\'s ear canal microbiome to another\'s. Dermatologists and audiologists increasingly counsel patients that earbud sharing carries similar hygiene considerations to sharing toothbrushes.',
      'The practical implication is that cleaning frequency matters — not for aesthetic reasons, but for genuine health ones. A soft brush and a safe cleaning solution applied weekly is sufficient to meaningfully reduce microbial load without risking damage to sensitive components.',
    ],
    source: 'Otolaryngology — Head and Neck Surgery, 2008 · Nature Scientific Reports, 2025',
    quiz: [
      {
        question: 'What makes earbuds a particularly good environment for bacterial growth?',
        options: [
          'They are made of porous plastic',
          'They are warm, dark, slightly moist, and in contact with skin',
          'They generate electromagnetic fields that attract bacteria',
          'Users rarely touch them',
        ],
        correctIndex: 1,
        explanation: 'Earbuds sit in a warm, dark, occluded environment in direct contact with skin that continuously sheds cells and secretes oils — ideal conditions for microbial growth.',
      },
      {
        question: 'Which bacterium was most clinically significant in earbud surface studies?',
        options: ['E. coli', 'Streptococcus', 'Staphylococcus aureus', 'Pseudomonas'],
        correctIndex: 2,
        explanation: 'Staphylococcus aureus is a common skin resident that becomes a significant pathogen when introduced into the ear canal, particularly where skin disruption exists.',
      },
      {
        question: 'How does earbud sharing compare hygienically, according to clinicians?',
        options: [
          'It is completely safe if wiped first',
          'It is similar to sharing toothbrushes',
          'It is less risky than sharing utensils',
          'It poses no risk for healthy individuals',
        ],
        correctIndex: 1,
        explanation: 'Audiologists and dermatologists increasingly treat earbud sharing as carrying similar hygiene considerations to toothbrush sharing — creating a direct microbiome transfer route.',
      },
      {
        question: 'How often should earbuds be cleaned to meaningfully reduce microbial load?',
        options: ['Daily', 'Weekly', 'Monthly', 'Only when visibly dirty'],
        correctIndex: 1,
        explanation: 'Weekly cleaning with a soft brush and safe solution is sufficient to significantly reduce bacterial load without risking component damage.',
      },
    ],
  },
  {
    id: 3,
    tag: 'FUN FACT',
    readTime: '2 min read',
    title: 'Why Some People Produce Far More Earwax Than Others',
    subtitle: 'The amount, consistency, and composition of earwax varies dramatically between individuals — and it\'s almost entirely genetic.',
    body: [
      'Earwax — formally known as cerumen — is one of the body\'s more underappreciated protective systems. It is produced by specialised glands in the outer third of the ear canal and serves multiple functions simultaneously: it lubricates the canal, traps dust and debris, carries antimicrobial enzymes, and — through a slow process of epithelial migration — carries material outward to the canal opening, where it flakes away.',
      'What most people do not know is that there are two genetically distinct types of earwax, determined by a single gene variant. Wet earwax — honey-coloured, sticky, and more common — is associated with populations of African and European ancestry. Dry earwax — grey, flaky, and crumbly — predominates among East Asian and Indigenous American populations.',
      'The same gene variant that controls earwax type also influences body odour, breast cancer risk, and several other seemingly unrelated traits — a striking example of how a single genetic switch can have far-reaching biological effects.',
      'Production volume varies widely. Some individuals naturally produce large amounts of cerumen; others produce very little. Production also increases in response to stress, anxiety, and — notably — the presence of foreign objects in the ear canal. This means earbud use itself can trigger increased earwax production in some users, which in turn can lead to buildup on earbud components if hygiene is not maintained.',
      'The ear canal is also self-cleaning under normal circumstances. The skin of the canal migrates outward at roughly the same rate as fingernail growth, carrying debris with it. Aggressive cleaning with cotton swabs disrupts this process and compacts wax deeper into the canal — the opposite of the intended effect.',
    ],
    source: 'Nature Genetics — ABCC11 Gene Studies · American Academy of Otolaryngology — Head and Neck Surgery',
    quiz: [
      {
        question: 'What is the medical term for earwax?',
        options: ['Sebum', 'Cerumen', 'Mucin', 'Melanin'],
        correctIndex: 1,
        explanation: 'Earwax is formally called cerumen. It is produced by specialised glands in the outer ear canal.',
      },
      {
        question: 'How many gene variants determine earwax type?',
        options: ['A single gene variant', 'Three genes', 'A cluster of five genes', 'It is environmentally determined'],
        correctIndex: 0,
        explanation: 'A single gene variant (ABCC11) determines whether someone produces wet or dry earwax — and also influences body odour and several other traits.',
      },
      {
        question: 'What does earbud use do to earwax production in some users?',
        options: [
          'It has no effect',
          'It decreases production',
          'It increases production due to the foreign object response',
          'It changes wax from wet to dry type',
        ],
        correctIndex: 2,
        explanation: 'The presence of a foreign object in the ear canal can trigger increased cerumen production — meaning earbud use itself may accelerate wax buildup on earbud components.',
      },
      {
        question: 'Why do cotton swabs often make earwax buildup worse?',
        options: [
          'They introduce bacteria',
          'They compact wax deeper into the canal, disrupting the self-cleaning process',
          'They remove the protective wax entirely',
          'They scratch the canal lining',
        ],
        correctIndex: 1,
        explanation: 'The ear canal naturally migrates debris outward. Cotton swabs push wax deeper and compact it, working against this self-cleaning mechanism.',
      },
    ],
  },
  {
    id: 4,
    tag: 'RESEARCH',
    readTime: '3 min read',
    title: 'Tinnitus Affects More Than 700 Million People. Here\'s What We Know.',
    subtitle: 'Tinnitus — the perception of sound with no external source — is one of the most prevalent and least understood auditory conditions in the world.',
    body: [
      'Tinnitus is typically described as a ringing, buzzing, hissing, or clicking sound perceived in the ears or head with no external acoustic source. It affects an estimated 15 to 20 percent of the global population at some point in their lives — making it one of the most common health complaints worldwide.',
      'For most people, tinnitus is temporary: a brief ringing after a loud concert or a short-lived buzz after an ear infection. For roughly 1 in 5 of those affected, however, it becomes chronic and sufficiently severe to interfere with concentration, sleep, and mental health.',
      'The underlying mechanism remains an active area of research. The most widely supported model holds that tinnitus arises not from the ear itself but from maladaptive changes in the brain\'s auditory processing centres. When hair cells in the inner ear are damaged or destroyed, the auditory cortex — deprived of its normal input — effectively begins to amplify its own background noise in an attempt to compensate. The result is a phantom signal perceived as sound.',
      'This neural origin explains why tinnitus often persists even after the original source of ear damage is removed, and why treatments that target the ear directly — such as hearing aids or masking devices — provide relief but do not cure the condition.',
      'Noise exposure is by far the leading cause of tinnitus. Extended exposure to sounds above 85 decibels, even intermittently, is sufficient to initiate the hair cell damage that can eventually trigger the condition. Personal audio devices played at high volumes are a significant and growing contributor to this risk in younger populations.',
      'There is no established cure for chronic tinnitus. Current management approaches include sound therapy, cognitive behavioural therapy, and hearing aids. Prevention remains the most effective strategy — which is why hearing hygiene, volume discipline, and ear care habits formed early in life carry outsized long-term importance.',
    ],
    source: 'American Tinnitus Association · Journal of the American Medical Association, Tinnitus Review 2021',
    quiz: [
      {
        question: 'What percentage of the global population experiences tinnitus at some point?',
        options: ['1–2%', '5–8%', '15–20%', 'Over 50%'],
        correctIndex: 2,
        explanation: 'Tinnitus affects an estimated 15 to 20 percent of the global population at some point, making it one of the most common health complaints worldwide.',
      },
      {
        question: 'According to the most widely supported model, where does tinnitus originate?',
        options: [
          'In the eardrum',
          'In the outer ear canal',
          'In the brain\'s auditory processing centres',
          'In the auditory nerve',
        ],
        correctIndex: 2,
        explanation: 'The leading model holds that tinnitus arises from maladaptive changes in the brain\'s auditory cortex — which amplifies its own background noise when deprived of normal hair cell input.',
      },
      {
        question: 'At what decibel level does sustained noise exposure begin to risk hair cell damage?',
        options: ['65 dB', '75 dB', '85 dB', '95 dB'],
        correctIndex: 2,
        explanation: 'Sounds above 85 decibels — even intermittently — are sufficient to initiate the hair cell damage associated with tinnitus and noise-induced hearing loss.',
      },
      {
        question: 'Why does tinnitus often persist after the original ear damage source is removed?',
        options: [
          'The ear continues to be damaged',
          'Tinnitus is psychosomatic',
          'The brain has already reorganised its auditory processing',
          'The auditory nerve remains inflamed',
        ],
        correctIndex: 2,
        explanation: 'Because tinnitus originates in neural changes in the brain rather than the ear itself, it can persist even after the original source of damage is gone — the brain\'s reorganisation has already occurred.',
      },
    ],
  },
  {
    id: 5,
    tag: 'FUN FACT',
    readTime: '2 min read',
    title: 'How Your Ears Help You Keep Your Balance',
    subtitle: 'The vestibular system — tucked inside your inner ear — is one of the most sophisticated balance mechanisms in the animal kingdom.',
    body: [
      'Most people think of the ear as a hearing organ. In fact, it is equally — and evolutionarily prior to hearing — a balance organ. The inner ear contains two distinct systems that have nothing to do with sound: the otolith organs, which detect linear acceleration and gravity, and the semicircular canals, which detect rotational movement.',
      'The three semicircular canals are oriented at roughly right angles to each other, allowing the brain to detect rotation in any three-dimensional plane. They are filled with fluid (endolymph) and lined with hair cells — the same basic architecture as the hearing system. When you turn your head, the fluid lags behind due to inertia, bending the hair cells and sending a directional signal to the brain.',
      'This is why spinning rapidly and then stopping causes the sensation of continued spinning: the fluid is still moving after your body has stopped. The brain receives conflicting signals from the vestibular system and visual system, producing dizziness and — in some cases — nausea.',
      'Inner ear infections can disrupt vestibular function dramatically. Labyrinthitis, an inflammation of the inner ear, can cause such severe vertigo that sufferers are temporarily unable to stand. The connection between ear infections and balance problems is direct and physiological, not coincidental.',
      'Earwax buildup can also affect balance — though more subtly. The vestibular system is sensitive to pressure changes in the ear canal, and significant impaction can create a sensation of fullness or mild unsteadiness that resolves once the blockage is cleared.',
      'Astronauts in microgravity experience significant vestibular disruption because the otolith organs — calibrated for Earth\'s gravitational field — suddenly receive no meaningful gravity signal, leaving the brain to rely almost entirely on visual cues for spatial orientation. Most adapt within days, but the adjustment illustrates just how central the inner ear is to our sense of where we are in space.',
    ],
    source: 'Vestibular Disorders Association · NASA Human Research Program, Sensorimotor Adaptation Studies',
    quiz: [
      {
        question: 'How many semicircular canals does the inner ear contain, and how are they oriented?',
        options: [
          'Two, parallel to each other',
          'Three, at roughly right angles to each other',
          'Four, in a spiral arrangement',
          'One, with three lobes',
        ],
        correctIndex: 1,
        explanation: 'Three semicircular canals are oriented at roughly right angles to each other, allowing three-dimensional detection of rotational movement.',
      },
      {
        question: 'Why does spinning and then stopping cause dizziness?',
        options: [
          'Blood rushes to the brain',
          'The eyes cannot adjust quickly enough',
          'Inner ear fluid keeps moving after the body stops, sending conflicting signals',
          'The brain temporarily loses its orientation map',
        ],
        correctIndex: 2,
        explanation: 'When spinning stops, the endolymph fluid continues moving due to inertia. The brain receives conflicting vestibular and visual signals, producing the sensation of continued spinning.',
      },
      {
        question: 'How can significant earwax buildup affect balance?',
        options: [
          'It cannot — earwax and balance are unrelated',
          'It presses on the eardrum, disrupting hearing',
          'It can create pressure changes the vestibular system detects as mild unsteadiness',
          'It blocks the semicircular canals',
        ],
        correctIndex: 2,
        explanation: 'The vestibular system is sensitive to pressure in the ear canal. Significant wax impaction can create a fullness sensation and mild unsteadiness that resolves after clearing.',
      },
    ],
  },
  {
    id: 6,
    tag: 'STUDY',
    readTime: '3 min read',
    title: 'Clean Earbuds Actually Sound Better. Here\'s the Physics.',
    subtitle: 'The acoustic degradation from mesh buildup is measurable — and far greater than most users realise.',
    body: [
      'When audiophiles debate the merits of different earbuds, they focus on driver design, frequency response curves, and impedance. What rarely enters the conversation is one of the most significant and easily controllable variables affecting perceived sound quality: the cleanliness of the speaker mesh.',
      'The earbud speaker mesh — the fine metal grille covering the driver — serves an acoustic function beyond physical protection. Its precise geometry is engineered to maintain a specific acoustic impedance at the driver output. When earwax, debris, or skin oils accumulate on the mesh, they effectively alter this impedance, attenuating high-frequency output preferentially.',
      'High frequencies are more affected than low because shorter wavelengths are more easily disrupted by physical obstructions of the mesh scale. This is why the first perceptible symptom of mesh buildup is typically a loss of treble clarity and detail — the sound becomes progressively duller and more muffled even as bass output remains relatively intact.',
      'Acoustic measurement studies have found that heavily fouled earbuds can show high-frequency attenuation of 6 to 12 decibels compared to their clean baseline — a difference that, on a logarithmic scale, represents the sound appearing roughly half as loud in those frequency ranges. This is substantial and perceptible to any listener paying attention.',
      'The compensatory behaviour this induces is particularly problematic: users experiencing dulled output typically respond by increasing volume, which raises their overall exposure level and — in devices without volume limiting — can push listening levels into ranges associated with cumulative hearing damage.',
      'The solution is not complex. A soft brush cleared of any residue, applied to the mesh in a gentle circular motion while holding the earbud mesh-down (so dislodged debris falls away rather than deeper into the port), followed by a dry microfiber wipe, is sufficient to restore acoustic performance to near-baseline. The entire process takes under two minutes.',
    ],
    source: 'Journal of the Acoustical Society of America · Consumer Reports Audio Lab Testing',
    quiz: [
      {
        question: 'Why does mesh buildup preferentially affect high frequencies?',
        options: [
          'High frequencies are louder and more exposed',
          'Shorter wavelengths are more easily disrupted by obstructions at the mesh scale',
          'Low frequencies bypass the mesh entirely',
          'The mesh is designed to filter high frequencies',
        ],
        correctIndex: 1,
        explanation: 'Shorter wavelengths (high frequencies) are more easily disrupted by physical obstructions at the scale of mesh openings. Low frequencies pass through relatively unaffected.',
      },
      {
        question: 'What is the typical first perceptible symptom of earbud mesh buildup?',
        options: [
          'Increased bass response',
          'Complete audio dropout',
          'Loss of treble clarity — sound becomes duller and more muffled',
          'Distortion at high volumes',
        ],
        correctIndex: 2,
        explanation: 'Mesh buildup attenuates high frequencies first. Users typically notice a progressive loss of treble detail and general dullness while bass remains relatively intact.',
      },
      {
        question: 'How much high-frequency attenuation can heavily fouled earbuds show vs clean baseline?',
        options: ['1–2 dB', '3–5 dB', '6–12 dB', 'Over 20 dB'],
        correctIndex: 2,
        explanation: 'Acoustic measurements of heavily fouled earbuds have found high-frequency attenuation of 6 to 12 decibels — roughly half the perceived loudness in those frequency ranges.',
      },
      {
        question: 'What is the correct technique for brushing earbud mesh?',
        options: [
          'Hold mesh facing up and brush firmly',
          'Hold mesh facing down and use gentle circular motion so debris falls away',
          'Use a wet brush directly on the mesh',
          'Blow compressed air into the mesh port',
        ],
        correctIndex: 1,
        explanation: 'Hold the earbud mesh-down when brushing so dislodged debris falls away from the driver rather than deeper into the port. Use gentle circular strokes.',
      },
    ],
  },
];

export const ARENA_DAYS = 30;

export const ARENAS: Arena[] = [
  { id: 1,  name: 'Mossgate Hollow',  days: ARENA_DAYS, reward: '🌿' },
  { id: 2,  name: 'Echo Ridge',       days: ARENA_DAYS, reward: '🔊' },
  { id: 3,  name: 'Quartz Basin',     days: ARENA_DAYS, reward: '💎' },
  { id: 4,  name: 'Volt Run',         days: ARENA_DAYS, reward: '⚡' },
  { id: 5,  name: 'Cinder Vault',     days: ARENA_DAYS, reward: '🔥' },
  { id: 6,  name: 'Glacier Veil',     days: ARENA_DAYS, reward: '❄️' },
  { id: 7,  name: 'Aurora Crossing',  days: ARENA_DAYS, reward: '🌌' },
  { id: 8,  name: 'Obsidian Reach',   days: ARENA_DAYS, reward: '🖤' },
  { id: 9,  name: 'Suncoil Dunes',    days: ARENA_DAYS, reward: '☀️' },
  { id: 10, name: 'Lumen Harbor',     days: ARENA_DAYS, reward: '💡' },
  { id: 11, name: 'Titan Grove',      days: ARENA_DAYS, reward: '🏛️' },
  { id: 12, name: 'Celestine Crown',  days: ARENA_DAYS, reward: '👑' },
];

export const FREQUENCIES: Frequency[] = [
  { hz: 125,   label: 'Sub Bass',     weight: 1.0 },
  { hz: 250,   label: 'Bass',         weight: 1.0 },
  { hz: 500,   label: 'Low Mid',      weight: 1.0 },
  { hz: 1000,  label: 'Mid',          weight: 1.0 },
  { hz: 2000,  label: 'Upper Mid',    weight: 1.1 },
  { hz: 4000,  label: 'Presence',     weight: 1.2 },
  { hz: 8000,  label: 'Treble',       weight: 1.4 },
  { hz: 12000, label: 'Air',          weight: 1.8 },
  { hz: 14000, label: 'High Air',     weight: 2.0 },
  { hz: 16000, label: 'Extreme',      weight: 2.4 },
  { hz: 17000, label: 'Very Extreme', weight: 2.7 },
  { hz: 18000, label: 'Elite High',   weight: 3.0 },
];

export const FREQUENCY_INSIGHTS: Record<number, string> = {
  125:   'Sub-bass tones are felt more than heard. Loss here is rare.',
  250:   'Bass frequencies carry warmth in music and speech fundamentals.',
  500:   'Low-mid range is key for vowel sounds in speech clarity.',
  1000:  'Mid-range is where human speech is most concentrated.',
  2000:  'Upper-mid loss often makes speech sound muffled or distant.',
  4000:  'Presence range is critical for consonants like s, f, and t.',
  8000:  'Treble frequencies add crispness and air to music.',
  12000: 'This range is often the first affected by noise exposure.',
  14000: 'High-air frequencies are difficult for many adults over 30.',
  16000: 'Most adults lose sensitivity here by their mid-30s.',
  17000: 'Fewer than 30% of adults over 25 can detect this range.',
  18000: 'Elite high — very few adults can hear this without pristine hearing.',
};

export const EDUCATIONAL_FACTS = [
  'Earwax is protective and helps defend the ear canal.',
  'Human hearing is often strongest in the mid-range, not at the extremes.',
  'Long exposure to loud audio can reduce hearing sensitivity over time.',
  'Earbuds at high volume for long periods can make high-frequency loss worse.',
  'Clean ears gently and avoid forcing objects deep into the ear canal.',
];

export const CLEANING_CARDS: CleaningCard[] = [
  {
    title: 'Ready to clean?',
    body: 'Use your sanitation kit and follow each step in order. Tap begin to start the cleaning flow.',
    cta: 'Start Cleaning',
  },
  {
    title: 'Open your sanitation kit',
    body: 'You should have a cleaning tool, microfiber cloth, bamboo brush, and isopropyl alcohol cleaning fluid.',
  },
  {
    title: 'Brush the mesh',
    body: 'Spray the bamboo brush with the alcohol and hold the AirPod with the mesh facing up and brush in circles for about 15 seconds.',
  },
  {
    title: 'Blot the mesh',
    body: 'Flip the AirPod and blot the mesh on our cloth, ensuring contact. Repeat this process three times total for each mesh.',
  },
  {
    title: 'Clean the charging port',
    body: 'Use our tool to scrape out any grime from the charging port.',
  },
  {
    title: 'Remove residue',
    body: 'Rinse the brush with distilled water, then repeat the brushing and blotting steps with distilled water to remove residue.',
  },
  {
    title: 'Clean the charging case',
    body: 'Clean the insides of the charging case with the bamboo brush.',
  },
  {
    title: 'Final wipe',
    body: 'Wipe everything with the cleaning cloth.',
  },
  {
    title: 'Congratulations, you are done!',
    body: 'Let the AirPods dry completely before use. Once everything is fully dry, place them back in the case.',
    cta: 'Finish Cleaning',
  },
];

export const TABS: { name: TabName; label: string; icon: string }[] = [
  { name: 'home',     label: 'HOME',    icon: 'home' },
  { name: 'hearing',  label: 'TEST',    icon: 'headset' },
  { name: 'cleaning', label: 'CLEAN',   icon: 'spray' },
  { name: 'learn',    label: 'LEARN',   icon: 'book' },
  { name: 'about',    label: 'ABOUT',   icon: 'info' },
  { name: 'account',  label: 'PROFILE', icon: 'person' },
  { name: 'plans',    label: 'PLANS',   icon: 'diamond' },
];

export const DEFAULT_PROGRESS: AppProgress = {
  streak: 0,
  totalCleanings: 0,
  totalHearingTests: 0,
  lastCompletedDate: null,
  dailyStatus: {},
  hearingHistory: [],
  learnPoints: 0,
};
