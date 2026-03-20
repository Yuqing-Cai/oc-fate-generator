// i18n.js - Internationalization: English translations + language switching
// Loaded after axes-data.js. Provides setLang() to swap globals and re-render.

let currentLang = localStorage.getItem("oc_lang") || "zh";

// ─── UI strings ───

const UI = {
  zh: {
    pageTitle: "🎭 OC 命运生成器",
    subtitle: "选择轴要素，一键生成男主设定与命运骨架",
    selectModel: "选择模型",
    extraPromptLabel: "补充偏好（可选）",
    extraPromptPlaceholder: "例如：\n- 世界观偏冷感赛博，但关系推进要克制\n- 男主不说教，不PUA，不浪子回头式洗白\n- 开场用雨夜、便利店、低照度灯箱\n- 强化时间代价与终局回收",
    extraPromptNote: "支持多行输入。可写雷点、世界观偏好、情感边界、语气要求或你不想看到的内容。",
    selectedCount: (total, core) => `已选 ${total} 项 · 结构轴 ${core} 项`,
    generateBtn: "✨ 生成设定",
    generatingBtn: "生成中...",
    resultToolbarTitle: "生成结果",
    copyBtn: "复制结果",
    copiedBtn: "已复制",
    copyFail: "复制失败，请手动选择文本",
    footerLicense: "Code: MIT | Art/Content: 非商用学习用途",
    helpBtnTitle: "查看说明",
    chip: (n) => `${n}项`,
    minSelectionError: "至少选择 3 项非调色板轴要素",
    submitting: "正在提交请求",
    streamFallback: "流式不可用，切回整段返回",
    generateDone: (s) => `✅ 生成完成（${s}s）`,
    generateFail: "生成失败，请稍后重试",
    apiError: "API 调用失败，请稍后重试",
    networkError: "网络错误，请检查网络连接",
    streamEmpty: "流式生成没有返回正文",
    streamFail: "流式生成失败",
    streamUnavail: "流式响应不可用",
    luckyBtn: "🎲 帮我选轴",
    luckyToast: (n) => `已随机选中 ${n} 个轴，可直接生成或继续调整`,
    modalAllOptions: "所有选项详解：",
    modalLinksTitle: "相关轴联动：",
    modalClose: "关闭",
  },
  en: {
    pageTitle: "🎭 OC Fate Generator",
    subtitle: "Pick axis traits, generate a male lead's profile and fate arc in one click",
    selectModel: "Select Model",
    extraPromptLabel: "Extra Preferences (optional)",
    extraPromptPlaceholder: "Examples:\n- Cyberpunk worldview, but restrained relationship pacing\n- No lecturing, no gaslighting, no 'bad boy redeemed' clichés\n- Open with rainy night, convenience store, dim neon\n- Emphasize time cost and finale payoff",
    extraPromptNote: "Multi-line input. Add deal-breakers, worldview preferences, emotional boundaries, tone requests, or things you don't want to see.",
    selectedCount: (total, core) => `${total} selected · ${core} structural axes`,
    generateBtn: "✨ Generate",
    generatingBtn: "Generating...",
    resultToolbarTitle: "Result",
    copyBtn: "Copy Result",
    copiedBtn: "Copied",
    copyFail: "Copy failed — please select text manually",
    footerLicense: "Code: MIT | Art/Content: Non-commercial, learning only",
    helpBtnTitle: "Details",
    chip: (n) => `${n}`,
    minSelectionError: "Select at least 3 non-Palette axes",
    submitting: "Submitting request",
    streamFallback: "Streaming unavailable, falling back to batch",
    generateDone: (s) => `✅ Done (${s}s)`,
    generateFail: "Generation failed — please retry",
    apiError: "API call failed — please retry",
    networkError: "Network error — check your connection",
    streamEmpty: "Streaming returned no content",
    streamFail: "Streaming generation failed",
    streamUnavail: "Streaming response unavailable",
    luckyBtn: "🎲 Pick for Me",
    luckyToast: (n) => `Randomly picked ${n} axes — generate now or tweak further`,
    modalAllOptions: "All Options:",
    modalLinksTitle: "Linked Axes:",
    modalClose: "Close",
  }
};

function t(key) {
  const val = UI[currentLang]?.[key] ?? UI.zh[key];
  return val;
}

// ─── English axis data ───

const AXIS_LABELS_EN = {
  W: "W = World", B: "B = Body", P: "P = Power", R: "R = Role",
  M: "M = Motive", C: "C = Choice", E: "E = Expression", J: "J = Judgment (Empathy)",
  S: "S = Sanity", D: "D = Dynamic (Power Balance)", L: "L = Love (Perception Arc)",
  A: "A = Achilles (Weakness)", H: "H = Heroine (Her Role)",
  T: "T = Time", X: "X = eXchange (Cost)",
  F: "F = Finale", Palette: "Palette (Text Tone)",
};

const AXIS_WISDOM_EN = {
  W: "The W axis (World) sets external resistance — the harsher the world, the higher the cost of being together.",
  B: "The B axis (Body) determines his physical form — can he be embraced? Will he age? Can you share the same space?",
  P: "The P axis (Power) determines what he can do for you, and what it costs him each time he uses that power.",
  R: "The R axis (Role) defines his relationship with the established order — is he part of the system, or against it?",
  M: "The M axis (Motive) defines why he's alive — when love shakes that pillar, the core conflict begins.",
  C: "The C axis (Choice) defines what he does when forced to choose between his mission and you.",
  E: "The E axis (Expression) determines the texture of the romance — how he lets you know he cares.",
  J: "The J axis (Judgment) determines whether he can read your emotions, and what happens when he gets it wrong.",
  S: "The S axis (Sanity) sets his mental stability — his state at the start, and how meeting you changes it.",
  D: "The D axis (Dynamic) defines who controls the relationship's direction, and when that balance flips.",
  L: "The L axis (Love) traces how his perception of you evolves — from what he first sees you as, to truly seeing you.",
  A: "The A axis (Achilles) is his fatal weakness — press it and he loses control or breaks down. The key plot trigger.",
  H: "The H axis (Heroine) determines how much agency the female lead has — she's not just the one being loved.",
  T: "The T axis (Time) determines how time torments this relationship — lifespan gaps, loops, displacement, or forgetting.",
  X: "The X axis (eXchange) determines what he ultimately loses for this love — the heavier the cost, the greater the emotional impact.",
  F: "The F axis (Finale) determines what your relationship becomes when everything settles — union, ordinary life, separation, or rebirth.",
  Palette: "The Palette only affects writing style (world slice, opening scene, opening line) — it doesn't change worldview, character, or ending."
};

const AXIS_LINKS_EN = {
  W: "W → C: Crueler world = more painful choices. Under W1 Iron Cage, the choice costs defiance; under W2 Ruined Wastes, it costs survival.",
  B: "B → T: Mortal body + non-human partner = built-in lifespan gap. Pairing B1 with a non-human character makes T1 almost automatic.",
  P: "P → X: Greater power = heavier cost. P1 mortal costs are personal (injury, freedom); P3 godlike costs are existential (reality warps).",
  R: "R → D: Stance naturally shapes power dynamics. Order guardians (R1) tend toward D1 dominance; outcasts (R3) tend toward D2 submission — but this is just the starting point.",
  M: "M → C: Motive drives choice. Mission-driven (M1) tends toward C1 hold-until-shattered; calculating (M4) tends toward C2 logic-failure. X axis cost must also echo motive.",
  C: "C is driven by both W and M: World (W) sets the difficulty ceiling; Motive (M) sets his default reaction to the dilemma.",
  E: "E + J = Communication style. E is emotional output, J is emotional input. E1 stoic + J1 clueless = near-total communication breakdown. S axis limits expression stability.",
  J: "J + E = Communication style. S axis affects empathy reliability: at S2 cracked, his empathy works when lucid but fails during breakdown.",
  S: "S limits E and J: An S3 shattered character can't sustain E2 smooth-talker precision or J3 superhuman empathy reliability. Check compatibility.",
  D: "D is shaped by R (Role) + H (Heroine). R1 guardian + H1 rival = both have power, maximum tension. D describes starting state — it will flip during the story.",
  L: "L + A = Relationship depth. L1 prey→devotion + A2 bound to one person = he doesn't see you as human, yet you're his weakness. Maximum contradiction. H axis affects arc speed.",
  A: "A + L = Relationship depth. Whether his weakness is in your hands depends on L axis perception. A2 bound to one + L5 constant = he always knew you were his weakness and accepted it.",
  H: "H → D: Her agency directly reshapes power dynamics. H1 rival makes D3 equals the natural fit; H4 gentle blade creates contrast tension with D1 dominance. H → L: More agency = faster perception evolution.",
  T: "T + F = Narrative arc. T1 lifespan gap + F3 eternal separation = tragedy known from the start; T2 time loop + F4 rebirth = hope in endless repetition. B axis hints at the source of time pressure.",
  X: "X must echo M (Motive). M1 mission + X1 downgrade = he abandons his mission for you; M4 ambition + X3 annihilation = he trades existence itself for your safety. P axis caps cost magnitude.",
  F: "F is the consequence of X. X1 downgrade → F2 ordinary life; X3 annihilation → F3 separation or F4 rebirth. Time pressure (T) sets the pacing toward the finale."
};

const AXIS_DETAILS_EN = {
  W: {
    intro: "What kind of world does the story take place in, and what is the external resistance? World type determines the specific pressure the characters face — institutional oppression, survival threats, or spiritual emptiness.",
    options: {
      "W1 Iron Cage": "Settings: royal court, military, conglomerate, rigid hierarchy. Core conflict: individual will vs. collective discipline. He was taught to obey from birth — falling for you is his first act of defiance. Best moment: A man who bowed to the system his whole life stands up for the first time, for you.",
      "W2 Ruined Wastes": "Settings: apocalypse, warzone, wasteland, scarce resources. Core conflict: survival vs. emotion. Death is daily; love is a luxury. Best moment: Under extreme survival pressure, he still saves the last food for you, or chooses you over safety.",
      "W3 Void Sea": "Settings: modern city, affluent class, post-industrial society. Core conflict: material abundance but spiritual emptiness — what's the point of being alive? He has everything but cares about nothing. You're the first thing that matters. Best moment: A man numb to everything finally cares about something.",
      "W4 Shadow City": "Settings: urban fantasy, ghost stories, double lives. Core conflict: he has a secret identity you can't know about. Normal by day, hunter/demon/test subject by night. Letting you into his other side means total trust. Best moment: You discover his secret. He waits for your reaction.",
      "W5 Unknown Frontier": "Settings: interstellar, isekai, dungeons, unknown civilizations. Core conflict: the future is completely unpredictable, you face it together. No prior experience to draw on; every step is a gamble. Best moment: In a completely unknown environment, you become each other's only certainty.",
      "W6 Arena": "Settings: talent shows, exams, business wars, sports, any zero-sum game. Core conflict: you're competitors — loving each other means potentially giving up winning. Best moment: In the finals he could beat you, but he didn't — or he won, then realized the victory was meaningless."
    }
  },
  B: {
    intro: "Does he have a body? What kind? This determines the most basic interaction — can you hug, share a meal, grow old together? Body form also affects the time axis (B1 mortal + non-human partner = built-in lifespan gap).",
    options: {
      "B1 Mortal Body": "An ordinary human body — bleeds, gets sick, ages, dies. Every sacrifice is irreversible; wounds don't self-heal; death is permanent. Every time he shields you, he's betting his life. Best moment: A man who could die any day still stands in front of you.",
      "B2 Non-Human Body": "Mechanical, spirit, modified, alien species. The core issue is sensory barriers: he might not feel your warmth, doesn't know how hard to hug you, or his body itself is dangerous to you. Best moment: He clumsily learns to express tenderness with a body that wasn't made for humans.",
      "B3 Beyond Physical": "No fixed body — could be code, wind, a concept, a system. He's everywhere but can't be touched. To be together, either he finds a vessel (at what cost?) or you give up your body (would you?). Best moment: A formless being finds a way to make you feel his touch."
    }
  },
  P: {
    intro: "How powerful is he. This determines three things: the aura he radiates, what he can do for you, and what it costs when he uses that power. The specific type (cunning, martial, faith) emerges from character design — this axis only defines magnitude.",
    options: {
      "P1 Mortal Strength": "Strong, but within the world's rules. Can stop a bullet, hack surveillance, pull you from danger — but can't change the system or fate that put you there. He doesn't lack the will; he lacks the ability. The limitation creates tension: solutions require wit and sacrifice, not overwhelming force.",
      "P2 Above the Rules": "One of the world's power-holders — can rewrite laws, manipulate markets, bend local causality. He can do things no ordinary person could, but every use of power triggers chain reactions affecting countless others. Greater power = greater moral weight: how many innocents is it acceptable to sacrifice for you?",
      "P3 Creator's Authority": "He is a god, or equivalent. Can rewrite the world's fundamental laws, including death itself. To keep you alive, he can alter causality. But the cost: reality cracks when its base logic is tampered with — physics destabilize, timelines scramble, innocent lives suffer. Omnipotence means total responsibility. Saving you might destroy the world."
    }
  },
  R: {
    intro: "What is his relationship with the established order? Is he its guardian, its challenger, or someone it discarded? This determines his social position, behavioral logic, and the external pressure of being with you.",
    options: {
      "R1 Order Guardian": "Roles: paladin, senior disciple, prosecutor, military officer, clan heir. He is the enforcer and embodiment of rules — a lifetime of discipline and principle. The appeal: watching him break the rules for you. A man who never bends, bending for the first time because of you.",
      "R2 Order Breaker": "Roles: cult leader, villain boss, revolutionary, crime lord. He's at war with the entire world, but he carved out a safe zone for you. The appeal: he can be merciless to everyone else, but you're the exception. The danger: can you be sure you'll always be the exception?",
      "R3 Discarded by Order": "Roles: deposed prince, retired soldier, abandoned test subject, deprecated AI. He once belonged to a system that threw him away. He carries scars, distrust, and a buried craving for acceptance. The appeal: he trusts no one, but he's starting to trust you. You have to prove you won't discard him like everyone else."
    }
  },
  M: {
    intro: "Why is he alive — mission, obsession, awakening, or ambition? Figure out what this pillar is, and you know where the core conflict lies: when loving you clashes with this pillar, what does he choose?",
    options: {
      "M1 External Mission": "He lives to fulfill an assigned task: protect the world, carry out judgment, guard someone. He treats himself as a tool, never considering what he wants. You gave him his first personal desire. Core conflict: the mission demands self-sacrifice, but you made him want to live.",
      "M2 Trauma Fixation": "He lives because the past won't let go: childhood nightmares, unavenged wrongs, irreparable mistakes. Everything he does points backward; there's no future. You showed him the present and future matter too. Core conflict: he can't release the past, but you only exist in the now.",
      "M3 Spontaneous Awakening": "He had no reason to live — a blank slate, an empty shell, a machine with no objective. Then he suddenly wanted to live, or to love you. No external cause; purely spontaneous. Core conflict: this desire is precious but fragile — deny it once and it might vanish forever.",
      "M4 Climb to the Top": "He lives to be the strongest, highest, best. Loving you means admitting he has needs — and needs mean imperfection. You're the only crack in his pursuit of perfection. Core conflict: choosing you means surrendering part of his ambition; not choosing you means surrendering the only thing that makes him feel human."
    }
  },
  C: {
    intro: "When his core motive (M axis) is shaken by love, what is his response pattern? This axis has the strongest dramatic-conflict potential — different choice modes produce entirely different story climaxes.",
    options: {
      "C1 Hold Until Shattered": "He has an absolute line he will not cross (moral code, oath, faith). Faced with contradiction, he white-knuckles it, refusing compromise, until reality grinds the line to dust. Climax: he's finally forced to violate the principle he held his entire life — a perfect persona cracking under love, irreparably.",
      "C2 Logic Failure": "He has no moral fixation; every decision runs through cost-benefit analysis. He's used to framing everything rationally, but loving you doesn't compute — ROI doesn't add up, risk assessment breaks. Climax: the perpetually rational man does something completely irrational, and he knows it makes no sense.",
      "C3 Choose You, No Hesitation": "No wavering, no internal struggle — you are his top priority. He'll do anything for you, including things you wish he wouldn't. The tension isn't in his inner conflict but in the consequences of unconditional loyalty: killing someone he shouldn't have to protect you, caging you to keep you."
    }
  },
  E: {
    intro: "How does he express affection? This directly determines the day-to-day texture of the romance — what interacting with him feels like, the rhythm, the temperature.",
    options: {
      "E1 Stoic Devotion": "Never says he likes you, but every action is taking care of you. Quietly solves your problems; shows up at your door when you're sick but claims he was just passing by; gifts are always 'I happened to see it.' The payoff: the moment you realize he's been silently protecting you all along — looking back, his traces are everywhere.",
      "E2 Smooth Charmer": "Talks a lot, says it well, every word lands precisely on your heartbeat. Expert at ambiguity, double meanings, building tension. But because he's too good with words, you can't tell which lines are real. The payoff: he stops saying pretty things and does something clumsy but genuine — that's when you know he means it.",
      "E3 Blunt Innocent": "Doesn't understand subtlety. Likes you? Says it directly, does it directly. Might say things that make bystanders cringe without realizing. Every emotion is unfiltered, sincere to the point of disarming. The payoff: in a world where everyone is calculating, his honesty is the most lethal weapon.",
      "E4 Possessive Claim": "Will explicitly declare you're his — holds your hand in public, leaves marks on you, hostile toward anyone who approaches you. You get absolute security, but your freedom may approach zero. The payoff: when you try to create distance, his reaction — does he learn to let go, or grip tighter?",
      "E5 Caretaker": "Remembers all your dietary restrictions, reminds you to bring an umbrella, stays at your bedside when you're sick. Love shows up in trivial daily details, quiet and steady. The payoff: one day he's gone (business trip/injured/vanished) and you realize his traces are woven into every corner of your life."
    }
  },
  J: {
    intro: "Can he understand your emotions and read your feelings? Especially important for non-human characters, but equally relevant for humans who are naturally bad at processing feelings. Empathy + Expression = your communication efficiency.",
    options: {
      "J1 Completely Clueless": "He processes all emotional problems with logic. You're crying; his response is to analyze the cause, not comfort you. Typical line: 'You are crying — this means your body is expelling excess fluid. Should I get you water?' He's not cold; he genuinely doesn't understand. Core issue: his good intentions frequently cause collateral damage, and he doesn't know what he did wrong.",
      "J2 Trying to Learn": "He knows he's emotionally illiterate, so he's studying. Secretly reads guides, observes other couples, awkwardly quotes TV drama lines. Every attempt is slightly off, but the effort itself is endearing. The payoff: the moment he finally gets one thing right — that single step of progress is more moving than any sweet talk.",
      "J3 Understands Better Than Humans": "His understanding of human emotion surpasses normal people. He can see through your masks, read what you didn't say, predict your mood shifts. But this superhuman insight also brings its own crisis — he starts questioning humanity's definitions of feelings. Typical challenge: 'You call a dopamine spike love — so why doesn't what I feel for you count?'"
    }
  },
  S: {
    intro: "What is his mental state? This axis is dynamic — his condition at the story's start and after meeting you may be completely different. Note: mental state limits the stability of Expression (E) and Empathy (J).",
    options: {
      "S1 Rock-Solid": "He's everyone's anchor — always calm, always reliable, always making the right call. But because he's so stable, the interesting question is: what can make him unstable? Core moment: when the perpetually composed man suddenly loses control (because you're hurt, because he's about to lose you), the impact is devastating.",
      "S2 Cracked": "He knows he has problems — PTSD, identity crisis, a memory he can't let go. Functions normally by day, collapses at night. Your presence is both painkiller and pain source: because you made him lower his guard, the cracks show more easily. Core challenge: helping him without destroying yourself in the process.",
      "S3 Shattered": "His mental state is already abnormal — jumbled logic, possible hallucinations, a perception of reality that doesn't match anyone else's. Loving him is a gamble: one second he's looking at you tenderly, the next he might see you as a threat. Core risk: you're never sure whether the 'you' in his eyes is actually you — he might be in love with a version of you that doesn't exist."
    }
  },
  D: {
    intro: "The power relationship between you — who leads, who follows, or is it a standoff? This dynamic almost never stays constant; the most compelling moments are often when the power flips. D axis describes the starting state.",
    options: {
      "D1 He Dominates": "Relationship types: master and disciple, emperor and subject, creator and creation. He outranks you in every way, accustomed to total control. The appeal: watching him bow — a man who commands the world, becoming clumsy and helpless before you, even voluntarily surrendering control.",
      "D2 He Submits": "Relationship types: guard and master, subordinate and boss, bodyguard and client. His status is below yours; on the surface he's obedient, loyal, quiet. The appeal: the moment of insubordination — the usually docile man pushed to his limit bares his fangs, and the power dynamic flips instantly.",
      "D3 Equals": "Relationship types: nemeses, same-rank colleagues, competitors. You're matched in ability and status; neither can overpower the other. The appeal: the winner isn't the stronger one — it's whoever falls in love first, because love creates a weakness."
    }
  },
  L: {
    intro: "How his perception of you evolves from start to finish. Each option describes a complete arc — what he first sees you as, what triggers the shift, and what he ultimately recognizes. You're choosing an arc, not a fixed label.",
    options: {
      "L1 Prey → Devotion": "Start: he doesn't see you as a person — you're a test subject, a chess piece, prey, a tool. Turning point: a specific event makes him start seeing you as human (your defiance, your vulnerability, your kindness to him). End: he falls for the real you. The longer the arc and colder the start, the more devastating the turn.",
      "L2 Drug → Independence": "Start: you're his painkiller, anchor, the only thing that calms him. He can't function without you, but this is dependency, not love. Turning point: he learns to survive without relying on you. End: free to leave, he chooses to stay. The difference: 'can't leave you' becomes 'don't need you but choose you.'",
      "L3 Shadow → Release": "Start: he doesn't love you — he loves an idealized image or a dead person's ghost. As long as you match his fantasy, everything's perfect. Turning point: you show your real, imperfect self (anger, mistakes, being nothing like his imagined version), and he's confused or devastated. End: he kills the perfect phantom in his mind and accepts the real you. The cruelest arc — he must first lose someone who never existed.",
      "L4 Curse → Acceptance": "Start: you're the only uncontrolled variable in his perfectly managed life. He hates himself for going soft, getting distracted, making irrational choices because of you. Turning point: relentless internal struggle — he repeatedly tries to sever his feelings and fails. End: he accepts that love making him vulnerable doesn't make him weaker. All the drama is in the internal war.",
      "L5 Constant": "No evolution arc — he sees the real you from the start, accepting your mediocrity, flaws, and all imperfections. The healthiest perception, but the hardest to write dramatically: with no internal perception conflict, all tension must come from external forces (world, time, cost). Recommended pairing: strong external-pressure axes (W, T, X)."
    }
  },
  A: {
    intro: "His fatal weakness — hit this switch and he loses control, breaks down, or goes berserk. The weakness is a key plot tool: villains exploit it to threaten him, you protect it to show love, and it can drive his most extreme decisions.",
    options: {
      "A1 Bound to an Object": "His weakness is tied to a specific item — a ring, a piece of code, an old diary, a key. Destroy the object, and he loses his sense of self or his power. Plot uses: the villain steals it to threaten him; you help guard it to show love; or he destroys it himself to pay a price.",
      "A2 Bound to a Person": "His weakness is you. You're hurt, he goes berserk. You smile, he stops destroying the world. The most romantic setup, but with a clear dark side: if you die or leave, nothing and no one can stop him. Plot uses: the villain threatens you to control him; you leverage your own safety as a bargaining chip.",
      "A3 Bound to a Belief": "His weakness is an abstract concept — justice, truth, a promise, revenge. This concept is the foundation of his entire existence. Once it's disproven (justice doesn't exist, the promise was betrayed, the enemy was innocent), his entire worldview collapses instantly. Plot uses: after the truth is revealed, he either rebuilds himself or falls into darkness."
    }
  },
  H: {
    intro: "The female lead's role and position in this relationship and story. This determines how much agency she has, how she affects the plot, and how she interacts with the male lead. H directly influences power dynamics (D) and perception arc speed (L).",
    options: {
      "H1 Independent Rival": "She has her own goals, her own strength, her own stance — evenly matched with him, or even stronger in some ways. Their relationship is a collision of equals — mutual admiration mixed with competition. Whoever falls first exposes a weakness. Pairs naturally with D3 Equals. The appeal: two people who refuse to bow, and who finally admits they care.",
      "H2 Symbiotic Partner": "They each have strengths the other lacks; together they're greater than the sum. He's good at fighting but bad at reading situations; she's great at analysis but can't execute. The core is cooperation, not protection. The appeal: when one is temporarily absent, the other discovers just how much they depended on that missing piece.",
      "H3 Hidden Key": "On the surface she looks like the weaker party — no combat power, no authority, no special abilities. But she holds the key to the core conflict: critical information, a perspective he can't grasp, or a skill he doesn't have. The lock his strength can't open, only she can. The appeal: everyone assumes she's insignificant, but she's the one who turns the tide.",
      "H4 Gentle Blade": "She's not powerful, has no special abilities, but her very existence changes him. Maybe her warmth made him lower his guard, her stubbornness made him rethink his choices, or she sees the world in a way he never considered. She changes him not by becoming strong, but by staying herself. The appeal: a man powerful enough to change the world, changed by an ordinary person."
    }
  },
  T: {
    intro: "How time pressures this relationship. Four different time mechanisms, each with its own unique cruelty and narrative rhythm. Selecting any time axis triggers Timeline mode, generating a full fate arc instead of just an opening.",
    options: {
      "T1 Lifespan Gap": "He's a god/AI/vampire/elf; you're a mortal human. You'll age and die; he won't. The cruelty isn't your death itself — it's that he knew the outcome the moment he fell for you. Love is mixed with a countdown from the start. Every day is simultaneously a reunion and a farewell. Core question: knowing he'll lose you, should he even begin?",
      "T2 Time Loop": "He's trapped in a time loop. For you it's a first meeting; for him it's the ten-thousandth. He's tried to save you across countless timelines, failing every time, and every time you forget him. He carries the weight of ten thousand memories as he says 'Nice to meet you.' Core question: if he stops trying, you die today — permanently.",
      "T3 Temporal Displacement": "He woke from a seal/hibernation/the past/the future, and the world has completely changed. You're his only connection to this strange new world. He doesn't understand current rules, culture, or common sense; the current world doesn't understand him. Core question: he must learn to live in an era he doesn't belong to — and you're his only teacher.",
      "T4 Memory Erosion": "He's forgetting you, or you're forgetting him. Not suddenly — gradually: today he remembers your name, tomorrow only your silhouette, the day after he asks 'Who are you?' Core question: before the memories are completely gone, what can you still do? Every conversation might be the last one where he still recognizes you."
    }
  },
  X: {
    intro: "What does he ultimately lose for this love? The nature of the cost directly determines the finale's shape — what he sacrifices (X) leads to what kind of ending (F). The cost must echo his motive (M) — why is he willing to pay this price?",
    options: {
      "X1 Downgrade": "He voluntarily surrenders what makes him superior — god becomes mortal, emperor becomes commoner, AI deletes advanced functions, superhuman gives up powers. He descends to your level, becoming ordinary like you. The key: it must be a voluntary choice — not stripped away, but willingly surrendered. Naturally leads to F2 Ordinary Life.",
      "X2 Upgrade": "To protect you, he must become stronger — but the cost is becoming colder, less human, further from you. From guardian to tyrant, from gentle person to efficiency machine. The more he loves you, the less he resembles the person you fell for. Core conflict: his method of protecting you is destroying your relationship.",
      "X3 Annihilation": "The ultimate sacrifice — he trades his existence for your safety. His life is the inverse of yours; his erasure is the prerequisite for your survival. He's gone, but he lives in your memories and in the life trajectory he changed. Naturally leads to F3 Eternal Separation or F4 Rebirth."
    }
  },
  F: {
    intro: "After everything settles, what does your relationship become? F is the consequence of X — what he sacrificed directly determines the final shape of your relationship.",
    options: {
      "F1 Fusion": "You're no longer two separate people — consciousness merged, cyber-ascension, blood-bond immortality, souls unified. 'Together' becomes an existential state, not just a relationship. Fits: B3 beyond-physical characters, P3 creator settings. The most extreme happy ending; the cost is usually surrendering your independent selfhood.",
      "F2 Ordinary Life": "He stays in your world, learning to live as a regular person — grocery shopping, cooking, commuting, worrying about utility bills. The warmest finale, and the most extravagant — it means all external obstacles have been overcome and he's willing and able to give up his former identity. Usually requires X1 Downgrade.",
      "F3 Eternal Separation": "He returns where he belongs — the heavens, the abyss, the code ocean, the past. You love each other but are destined to exist in different spaces or times. This isn't regret but choice — they both know it's the best outcome for both sides. Usually led to by X3 Annihilation or T1 Lifespan Gap.",
      "F4 Rebirth": "This life can't end well, but it leaves a faint, certain hope — the next meeting, the next timeline, the next life. Neither full happy ending nor full tragedy; an open-ended tenderness. The emotional impact depends on how specific the hope is: vague hope is comfort; specific hope is a promise."
    }
  },
  Palette: {
    intro: "The palette only affects how three sections are written: world slice, opening scene, and opening line. It doesn't change worldview, character, or ending — only the temperature, rhythm, and sensory density of the text.",
    options: {
      "Cold Restraint": "Traits: restrained, cool, quiet. Feelings are never stated directly — they work through white space, pauses, and the occasional hint of body warmth. Fits: classical cool aesthetics, near-future minimalism, anything that needs to be written below the surface.",
      "Blazing Edge": "Traits: high-saturation, high-heat, high-contrast. Beauty and danger coexist. Colors are vivid, proximity is close, breathing is heavy — every frame pushes visual pressure. Fits: anything that should feel gorgeous and threatening simultaneously.",
      "Solemn Grandeur": "Traits: grave, elevated, weighty. Personal feelings are set against a larger fate backdrop. Fits: epic narrative, religious/faith contexts, major sacrifice scenes.",
      "Raw Realism": "Traits: minimal rhetoric, heavy on texture and detail. Tenderness must land in specific actions, not abstract language. Fits: war, wasteland, underclass life — any high-pressure survival setting.",
      "Shadow Ambiguity": "Traits: suspicious, entangled, half-true half-false. Intimacy and calculation run in parallel. Fits: spy games, palace intrigue, morally grey characters.",
      "Warm Everyday": "Traits: close, slow-burn, specific. Warmth comes from repeated small things, not grand declarations. Fits: modern life, healing stories, slow-paced narrative.",
      "Strange Fable": "Traits: slightly bent rules, uncanny imagery, but internally consistent logic. Fits: ghost stories, fables, surrealism, non-linear narrative.",
      "Silent Minimal": "Traits: ultra-minimal, quiet, relies on subtraction. All emotion is compressed into pauses and short sentences. Fits: reserved characters, farewell scenes, silence after extreme emotion."
    }
  }
};

const AXES_EN = {
  W: { desc: "External resistance", options: { "W1 Iron Cage": "Courts/military/corps — system crushes the individual", "W2 Ruined Wastes": "Apocalypse/war/wasteland — survive first", "W3 Void Sea": "Material wealth, spiritual emptiness", "W4 Shadow City": "Normal surface, secret identities beneath", "W5 Unknown Frontier": "Space/other worlds — future unpredictable", "W6 Arena": "Competition/business/sports — zero-sum game" } },
  B: { desc: "Physical form", options: { "B1 Mortal Body": "Bleeds, ages, dies — all sacrifice is irreversible", "B2 Non-Human Body": "Mechanical/spirit/alien — sensory barriers", "B3 Beyond Physical": "No fixed body — everywhere but untouchable" } },
  P: { desc: "Power scale", options: { "P1 Mortal Strength": "Strong but within the rules — limited saves", "P2 Above the Rules": "Rewrites systems, but triggers chain reactions", "P3 Creator's Authority": "Near-omnipotent, but warps reality" } },
  R: { desc: "Relationship with order", options: { "R1 Order Guardian": "Enforcer of rules — watch him break them for you", "R2 Order Breaker": "At war with the world — you're the exception", "R3 Discarded by Order": "Thrown away by the system — craves acceptance" } },
  M: { desc: "Why he's alive", options: { "M1 External Mission": "Lives for an assigned task — never lived for himself", "M2 Trauma Fixation": "Chained to the past — no future", "M3 Spontaneous Awakening": "From nothing, a desire to live suddenly appears", "M4 Climb to the Top": "Chasing perfection — you're the only crack" } },
  C: { desc: "When love shakes his core", options: { "C1 Hold Until Shattered": "White-knuckles his line until it breaks", "C2 Logic Failure": "Rational framework — can't compute love", "C3 Choose You, No Hesitation": "You first, consequences later" } },
  E: { desc: "How he shows affection", options: { "E1 Stoic Devotion": "Never says it — actions say everything", "E2 Smooth Charmer": "Every word lands, but which ones are real?", "E3 Blunt Innocent": "Says it straight — sincerity unfiltered", "E4 Possessive Claim": "Declares you're his — publicly", "E5 Caretaker": "Remembers every detail of your daily life" } },
  J: { desc: "Can he read emotions", options: { "J1 Completely Clueless": "Processes feelings with logic — often hurts by accident", "J2 Trying to Learn": "Knows he's clueless — awkwardly studying", "J3 Understands Better Than Humans": "Reads what you didn't say" } },
  S: { desc: "Mental stability", options: { "S1 Rock-Solid": "Always calm — the question is what breaks him", "S2 Cracked": "Holds it together by day, collapses at night", "S3 Shattered": "Already broken — you're never sure what he sees" } },
  D: { desc: "Who leads the relationship", options: { "D1 He Dominates": "Outranks you in every way — watch him bow", "D2 He Submits": "Status below yours — watch him defy", "D3 Equals": "Neither yields — whoever falls first loses" } },
  L: { desc: "How his perception of you evolves", options: { "L1 Prey → Devotion": "From not seeing you as human to loving the real you", "L2 Drug → Independence": "From depending on you to freely choosing you", "L3 Shadow → Release": "From loving a phantom to accepting the real person", "L4 Curse → Acceptance": "From resenting his feelings to embracing vulnerability", "L5 Constant": "Sees and loves the real you from the start" } },
  A: { desc: "Where his fatal weakness lies", options: { "A1 Bound to an Object": "Weakness tied to a specific item", "A2 Bound to a Person": "You're his weakness — you're hurt, he snaps", "A3 Bound to a Belief": "Weakness is a concept — disprove it, he collapses" } },
  H: { desc: "Her agency in the story", options: { "H1 Independent Rival": "Her own goals and power — evenly matched", "H2 Symbiotic Partner": "Each has strengths — better together", "H3 Hidden Key": "Looks weak but holds the critical piece", "H4 Gentle Blade": "Not powerful, but her existence changes him" } },
  T: { desc: "How time torments you both", options: { "T1 Lifespan Gap": "He won't age, you will — love starts with a countdown", "T2 Time Loop": "He remembers ten thousand times, you forget each one", "T3 Temporal Displacement": "He wakes in the wrong era — you're his only anchor", "T4 Memory Erosion": "Forgetting each other — gradual, irreversible" } },
  X: { desc: "What he ultimately loses", options: { "X1 Downgrade": "Surrenders power/status — becomes ordinary", "X2 Upgrade": "Becomes stronger but colder — further from you", "X3 Annihilation": "Trades his existence for your survival" } },
  F: { desc: "Final relationship form", options: { "F1 Fusion": "Consciousness merged — no longer two people", "F2 Ordinary Life": "Stays in your world, lives a normal life", "F3 Eternal Separation": "Love each other but can't coexist", "F4 Rebirth": "This life fails — faint hope for the next" } },
  Palette: { desc: "Writing style", options: { "Cold Restraint": "Restrained, white space, warmth through pauses", "Blazing Edge": "High-saturation — beauty and threat coexist", "Solemn Grandeur": "Grave, weighty — feelings against a fate backdrop", "Raw Realism": "Minimal rhetoric, tenderness in specific actions", "Shadow Ambiguity": "Half-true, half-false — intimacy and calculation", "Warm Everyday": "Slow-burn specifics — warmth in repeated small things", "Strange Fable": "Uncanny imagery, bent rules, internally consistent", "Silent Minimal": "Ultra-short sentences — emotion in the pauses" } }
};

const AXIS_CONNECTIONS_EN = `
Axis Linkage Rules (Important!):
• W (World) → C (Choice): Crueler world = more painful choices
• B (Body) → T (Time): Mortal body + non-human partner = built-in lifespan gap
• P (Power) → X (Cost): Power scale determines cost magnitude
• R (Role) → D (Dynamic): Social position shapes starting power balance
• M (Motive) → C (Choice): Motive drives choice direction, unless love intervenes
• E (Expression) + J (Judgment) → Communication style: E is output, J is input — mismatch creates misunderstanding
• S (Sanity) → E + J: Mental state limits expression and empathy stability
• D (Dynamic) ← R (Role) + H (Heroine): Three-way determination of power dynamics
• L (Love) + A (Achilles) → Relationship depth: Whether his weakness is in your hands
• H (Heroine) → D (Dynamic) + L (Love): Her agency reshapes power dynamics and perception evolution
• T (Time) + F (Finale) → Narrative arc: Time pressure shapes the ending
• X (Cost) ↔ M (Motive): Cost must echo motive
`;

// ─── Bilingual progress stages ───

const PROGRESS_STAGES_EN = {
  opening: [
    { label: "Stage 1/3: Planning structure", message: "Planning structure" },
    { label: "Stage 2/3: Generating character & world", message: "Generating character & world" },
    { label: "Stage 3/3: Generating opening & wrap-up", message: "Generating opening & wrap-up" },
  ],
  timeline: [
    { label: "Stage 1/4: Planning world & structure", message: "Planning world & structure" },
    { label: "Stage 2/4: Generating character & world", message: "Generating character & world" },
    { label: "Stage 3/4: Generating opening & tension", message: "Generating opening & tension" },
    { label: "Stage 4/4: Generating timeline & finale", message: "Generating timeline & finale" },
  ],
};

const MODEL_LABELS_EN = {
  "Pro/MiniMaxAI/MiniMax-M2.5": "MiniMax M2.5 (Recommended, fast)",
  "Pro/zai-org/GLM-5": "GLM-5 (Balanced)",
  "Pro/moonshotai/Kimi-K2.5": "Kimi K2.5",
  "Pro/moonshotai/Kimi-K2-Instruct-0905": "Kimi K2 Instruct",
  "Pro/deepseek-ai/DeepSeek-V3.2": "DeepSeek V3.2 (Latest)",
  "Pro/deepseek-ai/DeepSeek-V3.1-Terminus": "DeepSeek V3.1 Terminus",
  "Pro/deepseek-ai/DeepSeek-V3": "DeepSeek V3",
  "Pro/zai-org/GLM-4.7": "GLM-4.7",
};

// ─── Store original Chinese data (captured at load time) ───

const AXIS_LABELS_ZH   = { ...AXIS_LABELS };
const AXIS_WISDOM_ZH   = { ...AXIS_WISDOM };
const AXIS_LINKS_ZH    = { ...AXIS_LINKS };
const AXIS_DETAILS_ZH  = JSON.parse(JSON.stringify(AXIS_DETAILS));
const AXES_ZH          = JSON.parse(JSON.stringify(AXES));
const AXIS_CONNECTIONS_ZH = AXIS_CONNECTIONS;
const PROGRESS_STAGES_ZH  = JSON.parse(JSON.stringify(PROGRESS_STAGES));

// ─── Language switching ───

function setLang(lang) {
  if (lang !== "zh" && lang !== "en") return;
  currentLang = lang;
  localStorage.setItem("oc_lang", lang);

  const isEn = lang === "en";

  // Swap axis globals
  Object.assign(AXIS_LABELS, isEn ? AXIS_LABELS_EN : AXIS_LABELS_ZH);
  Object.assign(AXIS_WISDOM, isEn ? AXIS_WISDOM_EN : AXIS_WISDOM_ZH);
  Object.assign(AXIS_LINKS, isEn ? AXIS_LINKS_EN : AXIS_LINKS_ZH);

  // Deep-copy details and axes
  const srcDetails = isEn ? AXIS_DETAILS_EN : AXIS_DETAILS_ZH;
  for (const key of Object.keys(AXIS_DETAILS)) delete AXIS_DETAILS[key];
  Object.assign(AXIS_DETAILS, JSON.parse(JSON.stringify(srcDetails)));

  const srcAxes = isEn ? AXES_EN : AXES_ZH;
  for (const key of Object.keys(AXES)) delete AXES[key];
  Object.assign(AXES, JSON.parse(JSON.stringify(srcAxes)));

  AXIS_CONNECTIONS_CURRENT = isEn ? AXIS_CONNECTIONS_EN : AXIS_CONNECTIONS_ZH;

  // Swap progress stages
  const srcStages = isEn ? PROGRESS_STAGES_EN : PROGRESS_STAGES_ZH;
  for (const key of Object.keys(PROGRESS_STAGES)) delete PROGRESS_STAGES[key];
  Object.assign(PROGRESS_STAGES, JSON.parse(JSON.stringify(srcStages)));

  // Re-render UI if app.js is loaded
  if (typeof rerenderAll === "function") rerenderAll();
}

// Track which AXIS_CONNECTIONS is active (since string can't be mutated in place)
let AXIS_CONNECTIONS_CURRENT = AXIS_CONNECTIONS;

// Apply saved language on load (if English was previously selected)
if (currentLang === "en") {
  // Defer to after all scripts load
  document.addEventListener("DOMContentLoaded", () => setLang("en"));
}
