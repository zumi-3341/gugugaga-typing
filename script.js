const modeOrder = ["beginner", "intermediate", "advanced", "secret_guga", "secret_phrase"];
const wordLists = window.typingWordLists ?? {};
const encyclopediaEntries = window.typingEncyclopedia ?? {};

const difficultySettings = {
  beginner: {
    targetScore: 15,
    description: "短めのお菓子やフルーツ中心",
  },
  intermediate: {
    targetScore: 12,
    description: "ほどよい長さの定番メニュー中心",
  },
  advanced: {
    targetScore: 9,
    description: "長めで打ちごたえのある名前中心",
  },
};

const modeDefinitions = {
  beginner: {
    ...difficultySettings.beginner,
    unlock: { type: "available" },
    showInTitle: true,
    showInEncyclopedia: true,
    showInRankingFilter: true,
    includeInBonusGiftPool: true,
    implemented: true,
    countLabel: "単語数",
  },
  intermediate: {
    ...difficultySettings.intermediate,
    unlock: { type: "clear", mode: "beginner" },
    showInTitle: true,
    showInEncyclopedia: true,
    showInRankingFilter: true,
    includeInBonusGiftPool: true,
    implemented: true,
    countLabel: "単語数",
  },
  advanced: {
    ...difficultySettings.advanced,
    label: "上級",
    subLabel: "ぐぐがが愛がHeavyなモード",
    unlock: { type: "clear", mode: "intermediate" },
    showInTitle: true,
    showInEncyclopedia: true,
    showInRankingFilter: true,
    includeInBonusGiftPool: true,
    implemented: true,
    countLabel: "単語数",
  },
  secret_phrase: {
    targetScore: 6,
    description: "長文フレーズを一気に打ち切る特別モード",
    label: "ぐぐがが沼モード",
    subLabel: "「淀みなく」ぐぐががちゃんへの愛を語りましょ",
    unlock: { type: "perfect", mode: "advanced" },
    showInTitle: true,
    showInEncyclopedia: false,
    showInRankingFilter: true,
    includeInBonusGiftPool: false,
    implemented: true,
    hiddenUntilUnlocked: true,
    countLabel: "フレーズ数",
  },
  secret_guga: {
    targetScore: 30,
    description: "ぐ / が だけで語りかける超短文モード",
    label: "ぐぐががモード",
    subLabel: "ぐぐががちゃんとおはなししましょ",
    unlock: { type: "score-zero-fail", mode: "beginner" },
    showInTitle: true,
    showInEncyclopedia: false,
    showInRankingFilter: true,
    includeInBonusGiftPool: false,
    implemented: true,
    hiddenUntilUnlocked: true,
    countLabel: "単語数",
  },
};

const difficultyOrder = modeOrder.filter(
  (key) =>
    modeDefinitions[key]?.showInTitle &&
    modeDefinitions[key]?.implemented &&
    !modeDefinitions[key]?.hiddenUntilUnlocked,
);

const difficultyUnlockStorageKey = "gugugaga-typing-unlocked-difficulty-index";
const unlockedModeStorageKey = "gugugaga-typing-unlocked-mode-keys";
const secretModeResetStorageKey = "gugugaga-typing-secret-mode-reset-20260808";
const playerNameStorageKey = "gugugaga-typing-player-name";
const rankingStorageKey = "gugugaga-typing-ranking";
const bonusIntroMs = 5000;
const bonusDurationMs = 15000;
const bonusPromptWord = { display: "が", romaji: "ga" };
const bonusBackgroundInitial = "./assets/images/bonus/0.png";
const bonusBackgroundFrames = [
  "./assets/images/bonus/1.png",
  "./assets/images/bonus/2.png",
  "./assets/images/bonus/3.png",
  "./assets/images/bonus/4.png",
  "./assets/images/bonus/5.png",
  "./assets/images/bonus/6.png",
];
const bonusFinishThresholds = [
  { threshold: 100, src: "./assets/images/bonus/finish100.png" },
  { threshold: 80, src: "./assets/images/bonus/finish80.png" },
  { threshold: 60, src: "./assets/images/bonus/finish60.png" },
  { threshold: 40, src: "./assets/images/bonus/finish40.png" },
  { threshold: 20, src: "./assets/images/bonus/finish20.png" },
];
const playBackgrounds = {
  beginner: "./assets/images/background/easy.png",
  intermediate: "./assets/images/background/nomal.png",
  advanced: "./assets/images/background/hard.png",
  secret_guga: "./assets/images/background/easy.png",
  secret_phrase: "./assets/images/background/hard.png",
};
const creatureStagePlacements = [
  { left: 6, bottom: -70, scale: 1.16, rotate: 0 },
  { left: 18, bottom: -64, scale: 1.13, rotate: 0 },
  { left: 12, bottom: -30, scale: 1.02, rotate: 0 },
  { left: 30, bottom: -68, scale: 1.18, rotate: 0 },
  { left: 20, bottom: 4, scale: 0.9, rotate: 0 },
  { left: 42, bottom: -62, scale: 1.15, rotate: 0 },
  { left: 36, bottom: 8, scale: 0.88, rotate: 0 },
  { left: 54, bottom: -67, scale: 1.18, rotate: 0 },
  { left: 26, bottom: -24, scale: 1, rotate: 0 },
  { left: 52, bottom: 4, scale: 0.91, rotate: 0 },
  { left: 66, bottom: -63, scale: 1.14, rotate: 0 },
  { left: 48, bottom: 36, scale: 0.77, rotate: 0 },
  { left: 68, bottom: 8, scale: 0.88, rotate: 0 },
  { left: 78, bottom: -69, scale: 1.17, rotate: 0 },
  { left: 40, bottom: -28, scale: 1.03, rotate: 0 },
  { left: 66, bottom: 34, scale: 0.78, rotate: 0 },
  { left: 84, bottom: 5, scale: 0.89, rotate: 0 },
  { left: 88, bottom: -64, scale: 1.12, rotate: 0 },
  { left: 54, bottom: -22, scale: 1.01, rotate: 0 },
  { left: 42, bottom: 58, scale: 0.68, rotate: 0 },
  { left: 68, bottom: -27, scale: 1.02, rotate: 0 },
  { left: 60, bottom: 58, scale: 0.68, rotate: 0 },
  { left: 82, bottom: -23, scale: 0.99, rotate: 0 },
  { left: 30, bottom: 34, scale: 0.78, rotate: 0 },
];
const titleImages = {
  default: "./assets/images/title/default.png",
  beginner: "./assets/images/title/easy.png",
  intermediate: "./assets/images/title/nomal.png",
  advanced: "./assets/images/title/hard.png",
  secret_guga: "./assets/images/title/gugugaga.png",
  secret_phrase: "./assets/images/title/numa.png",
};
const resultCutins = [
  { label: "front", src: "./assets/images/cutins/result-cutin-front.png" },
  { label: "angle", src: "./assets/images/cutins/result-cutin-angle.png" },
];
const resultSceneMap = {
  "very-bad": {
    title: "全然足りない",
    caption: "ぐぐががが逃げてしまいました。",
    image: "./assets/images/results/result-very-bad.png",
    showCongratulations: false,
  },
  bad: {
    title: "少し足りない",
    caption: "あと少しで届きそうでした。",
    image: "./assets/images/results/result-bad.png",
    showCongratulations: false,
  },
  clear: {
    title: "なんとかクリア",
    caption: "おっかなびっくり抱っこ成功。",
    image: "./assets/images/results/result-clear.png",
    showCongratulations: false,
  },
  good: {
    title: "満足な結果",
    caption: "ハートいっぱいの大勝利です。",
    image: "./assets/images/results/result-good.png",
    showCongratulations: false,
  },
  perfect: {
    title: "ノーミスクリア",
    caption: "結婚式の特別演出です。",
    image: "./assets/images/results/result-perfect.png",
    showCongratulations: true,
  },
};
const sequenceTiming = {
  cutinMs: 1400,
  resultMs: 850,
  announcementMs: 750,
  finishMs: 450,
};

const romajiPairs = [
  ["shi", "si"],
  ["chi", "ti"],
  ["tsu", "tu"],
  ["fu", "hu"],
  ["ji", "zi"],
  ["ja", "jya"],
  ["ju", "jyu"],
  ["jo", "jyo"],
  ["ja", "zya"],
  ["ju", "zyu"],
  ["jo", "zyo"],
  ["sha", "sya"],
  ["shu", "syu"],
  ["sho", "syo"],
  ["cha", "tya"],
  ["chu", "tyu"],
  ["cho", "tyo"],
  ["cha", "cya"],
  ["chu", "cyu"],
  ["cho", "cyo"],
  ["cchi", "tti"],
  ["ccha", "tcha"],
  ["cchu", "tchu"],
  ["ccho", "tcho"],
  ["ra", "la"],
  ["ri", "li"],
  ["ru", "lu"],
  ["re", "le"],
  ["ro", "lo"],
  ["rya", "lya"],
  ["ryu", "lyu"],
  ["ryo", "lyo"],
];

const kanaMap = {
  ぁ: "a", あ: "a", ぃ: "i", い: "i", ぅ: "u", う: "u", ぇ: "e", え: "e", ぉ: "o", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", ゐ: "wi", ゑ: "we", を: "wo",
  ゔ: "vu", ん: "n",
};

const digraphMap = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  う゛ぁ: "va", ゔぁ: "va", う゛ぃ: "vi", ゔぃ: "vi",
  う゛ぇ: "ve", ゔぇ: "ve", う゛ぉ: "vo", ゔぉ: "vo",
  てぃ: "ti", でぃ: "di", とぅ: "tu", どぅ: "du",
  ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo",
  しぇ: "she", じぇ: "je", ちぇ: "che",
};

const digraphVariantMap = {
  きゃ: ["kya"], きゅ: ["kyu"], きょ: ["kyo"],
  ぎゃ: ["gya"], ぎゅ: ["gyu"], ぎょ: ["gyo"],
  しゃ: ["sha", "sya"], しゅ: ["shu", "syu"], しょ: ["sho", "syo"],
  じゃ: ["ja", "jya", "zya"], じゅ: ["ju", "jyu", "zyu"], じょ: ["jo", "jyo", "zyo"],
  ちゃ: ["cha", "cya", "tya"], ちゅ: ["chu", "cyu", "tyu"], ちょ: ["cho", "cyo", "tyo"],
  にゃ: ["nya"], にゅ: ["nyu"], にょ: ["nyo"],
  ひゃ: ["hya"], ひゅ: ["hyu"], ひょ: ["hyo"],
  びゃ: ["bya"], びゅ: ["byu"], びょ: ["byo"],
  ぴゃ: ["pya"], ぴゅ: ["pyu"], ぴょ: ["pyo"],
  みゃ: ["mya"], みゅ: ["myu"], みょ: ["myo"],
  りゃ: ["rya"], りゅ: ["ryu"], りょ: ["ryo"],
  う゛ぁ: ["va"], ゔぁ: ["va"], う゛ぃ: ["vi"], ゔぃ: ["vi"],
  う゛ぇ: ["ve"], ゔぇ: ["ve"], う゛ぉ: ["vo"], ゔぉ: ["vo"],
  てぃ: ["ti", "thi"], でぃ: ["di", "dhi"],
  とぅ: ["tu", "twu"], どぅ: ["du", "dwu"],
  ふぁ: ["fa", "fwa"], ふぃ: ["fi", "fwi"], ふぇ: ["fe", "fwe"], ふぉ: ["fo", "fwo"],
  しぇ: ["she", "sye"], じぇ: ["je", "jye", "zye"], ちぇ: ["che", "cye", "tye"],
};

const smallKanaRomanMap = {
  ぁ: ["la", "xa"],
  ぃ: ["li", "xi"],
  ぅ: ["lu", "xu"],
  ぇ: ["le", "xe"],
  ぉ: ["lo", "xo"],
  ゃ: ["lya", "xya"],
  ゅ: ["lyu", "xyu"],
  ょ: ["lyo", "xyo"],
  ゎ: ["lwa", "xwa"],
};

const kanaVariantMap = {
  ぢ: ["ji", "di"],
  づ: ["zu", "du"],
};

const smallKana = new Set(["ゃ", "ゅ", "ょ", "ぁ", "ぃ", "ぅ", "ぇ", "ぉ", "ゎ"]);
const bonusGiftPool = modeOrder.flatMap((key) =>
  modeDefinitions[key]?.includeInBonusGiftPool ? (wordLists[key]?.words ?? []).map((word) => word.display) : [],
);

const screens = {
  title: document.querySelector("#titleScreen"),
  encyclopedia: document.querySelector("#encyclopediaScreen"),
  play: document.querySelector("#playScreen"),
  bonus: document.querySelector("#bonusScreen"),
  result: document.querySelector("#resultScreen"),
};

const titleElements = {
  titleImage: document.querySelector(".hero-title img"),
  difficultyCards: document.querySelector("#difficultyCards"),
  zumiImage: document.querySelector("#titleZumiImage"),
  imagePanel: document.querySelector("#titleImagePanel"),
  rankingPanel: document.querySelector("#titleRankingPanel"),
  rankingList: document.querySelector("#rankingList"),
  rankingFilterButton: document.querySelector("#cycleRankingFilterButton"),
  rankingFilterStatus: document.querySelector("#rankingFilterStatus"),
  startButton: document.querySelector("#startGameButton"),
  encyclopediaButton: document.querySelector("#openEncyclopediaButton"),
  toggleRankingButton: document.querySelector("#toggleRankingButton"),
  nameInput: document.querySelector("#playerNameInput"),
  saveNameButton: document.querySelector("#savePlayerNameButton"),
  nameStatus: document.querySelector("#playerNameStatus"),
};

const encyclopediaElements = {
  backButton: document.querySelector("#encyclopediaBackButton"),
  filters: document.querySelector("#encyclopediaFilters"),
  wordList: document.querySelector("#encyclopediaWordList"),
  wordTitle: document.querySelector("#encyclopediaWordTitle"),
  wordMode: document.querySelector("#encyclopediaWordMode"),
  wordDescription: document.querySelector("#encyclopediaWordDescription"),
};

const playElements = {
  screen: document.querySelector("#playScreen"),
  layout: document.querySelector("#playScreen .play-layout"),
  backButton: document.querySelector("#backToTitleButton"),
  modeName: document.querySelector("#playModeName"),
  modeCopy: document.querySelector("#playModeCopy"),
  playerStageName: document.querySelector("#playerStageName"),
  timeValue: document.querySelector("#timeValue"),
  scoreValue: document.querySelector("#scoreValue"),
  missValue: document.querySelector("#missValue"),
  comboValue: document.querySelector("#comboValue"),
  zumiMoodBadge: document.querySelector("#zumiMoodBadge"),
  zumiPlayImage: document.querySelector("#zumiPlayImage"),
  zumiPoseTitle: document.querySelector("#zumiPoseTitle"),
  zumiPoseCopy: document.querySelector("#zumiPoseCopy"),
  currentWordDisplay: document.querySelector("#currentWordDisplay"),
  currentWordGuide: document.querySelector("#currentWordGuide"),
  typingInput: document.querySelector("#typingInput"),
  typingHint: document.querySelector("#typingHint"),
  reactionBadge: document.querySelector("#reactionBadge"),
  reactionText: document.querySelector("#reactionText"),
  affectionFill: document.querySelector("#affectionFill"),
  gugugagaMoodBadge: document.querySelector("#gugugagaMoodBadge"),
  gugugagaPlayImage: document.querySelector("#gugugagaPlayImage"),
  gugugagaPoseTitle: document.querySelector("#gugugagaPoseTitle"),
  gugugagaPoseCopy: document.querySelector("#gugugagaPoseCopy"),
  creatureStageStatus: document.querySelector("#creatureStageStatus"),
  creatureStageLane: document.querySelector("#creatureStageLane"),
};

const bonusElements = {
  hud: document.querySelector("#bonusHud"),
  playUi: document.querySelector("#bonusPlayUi"),
  timeValue: document.querySelector("#bonusTimeValue"),
  hitValue: document.querySelector("#bonusHitValue"),
  promptLabel: document.querySelector("#bonusPromptLabel"),
  prompt: document.querySelector("#bonusPrompt"),
  guide: document.querySelector("#bonusGuide"),
  input: document.querySelector("#bonusInput"),
  finishImage: document.querySelector("#bonusFinishImage"),
  backgroundImage: document.querySelector("#bonusBackgroundImage"),
  rainLayer: document.querySelector("#bonusRainLayer"),
};

const resultElements = {
  infoPanel: document.querySelector("#resultInfoPanel"),
  summaryTitle: document.querySelector("#resultSummaryTitle"),
  summaryCopy: document.querySelector("#resultSummaryCopy"),
  retryButton: document.querySelector("#retryButton"),
  titleButton: document.querySelector("#resultToTitleButton"),
  stage: document.querySelector("#resultStage"),
  idleResultName: document.querySelector("#idleResultName"),
  idleResultSummary: document.querySelector("#idleResultSummary"),
  cutinImage: document.querySelector("#cutinImage"),
  resultImage: document.querySelector("#resultImage"),
  cutinVariant: document.querySelector("#cutinVariant"),
  congratulationsText: document.querySelector("#congratulationsText"),
  announcement: document.querySelector("#resultAnnouncement"),
  title: document.querySelector("#resultTitle"),
  caption: document.querySelector("#resultCaption"),
  scoreCard: document.querySelector("#scoreCard"),
  scoreValue: document.querySelector("#resultScoreValue"),
  targetValue: document.querySelector("#resultTargetValue"),
  missValue: document.querySelector("#resultMissValue"),
};

const audioPathMap = {
  select: "./assets/audio/se/select.mp3",
  gameStart: "./assets/audio/se/Game%20start.mp3",
  countdown: "./assets/audio/se/count%20down.mp3",
  tenCount: "./assets/audio/se/10%20count.mp3",
  pinpon: "./assets/audio/se/pinpon.mp3",
  boo: "./assets/audio/se/bu-.mp3",
  ga: "./assets/audio/se/ga.mp3",
  lastGa: "./assets/audio/se/last%20ga.mp3",
  finish: "./assets/audio/se/finish.mp3",
  cutin: "./assets/audio/se/cut%20in.mp3",
  wait: "./assets/audio/se/wait.mp3",
  scene: {
    "very-bad": "./assets/audio/se/zenzen%20dame.mp3",
    bad: "./assets/audio/se/zannen.mp3",
    clear: "./assets/audio/se/clear%20giri.mp3",
    good: "./assets/audio/se/clear%20jyubun.mp3",
    perfect: "./assets/audio/se/marriage.mp3",
  },
  sceneVoice: {
    perfect: "./assets/audio/se/marriage%20voice.mp3",
  },
  bgm: {
    beginner: "./assets/audio/bgm/easy%20mode.mp3",
    intermediate: "./assets/audio/bgm/nomal%20mode.mp3",
    advanced: "./assets/audio/bgm/hard%20mode.mp3",
    secret_guga: "./assets/audio/bgm/easy%20mode.mp3",
    secret_phrase: "./assets/audio/bgm/hard%20mode.mp3",
    bonus: "./assets/audio/bgm/bonus%20time.mp3",
  },
};

const audioCache = makeAudioCache();
const acceptedVariantCache = new Map();
const imagePreloadCache = new Map();

const state = {
  currentScreen: "title",
  selectedDifficulty: "beginner",
  unlockedModeKeys: new Set(["beginner"]),
  playerName: "",
  titleVisualMode: "image",
  rankingFilter: "all",
  onlineRankingEntries: null,
  titleSecretTapCount: 0,
  selectedEncyclopediaDifficulty: "beginner",
  selectedEncyclopediaWord: "プリン",
  isTypingActive: false,
  isResolvingWord: false,
  isStartingGame: false,
  startSequenceId: 0,
  currentCutin: pickRandomCutin(),
  timerId: null,
  bonusTimerId: null,
  bonusFinishTimeoutId: null,
  sceneVoiceTimeoutId: null,
  activeBgmAudio: null,
  activeResultAudio: null,
  play: {
    timeLeft: 60,
    score: 0,
    bonusScore: 0,
    misses: 0,
    successStreak: 0,
    bestSuccessStreak: 0,
    creatureStageCount: 0,
    wordQueue: [],
    currentWord: null,
  },
  bonus: {
    isActive: false,
    endAt: 0,
    hits: 0,
    sequenceId: 0,
  },
};

function trackAnalyticsEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, parameters);
}

function trackGameComplete(resultKey) {
  trackAnalyticsEvent("game_complete", {
    difficulty: state.selectedDifficulty,
    result: resultKey,
    score: state.play.score,
    bonus_score: state.play.bonusScore,
    misses: state.play.misses,
    best_combo: state.play.bestSuccessStreak,
  });
}

function makeAudioCache() {
  const cache = {};

  for (const [key, value] of Object.entries(audioPathMap)) {
    if (typeof value === "string") {
      cache[key] = makeAudio(value);
      continue;
    }

    cache[key] = {};
    for (const [innerKey, innerValue] of Object.entries(value)) {
      cache[key][innerKey] = makeAudio(innerValue);
    }
  }

  return cache;
}

function makeAudio(src) {
  const audio = new Audio(src);
  audio.preload = "auto";
  return audio;
}

function stopAudio(audio) {
  if (!audio) {
    return;
  }
  audio.pause();
  audio.currentTime = 0;
}

async function playAudio(audio) {
  if (!audio) {
    return;
  }

  try {
    audio.currentTime = 0;
    await audio.play();
  } catch (_) {
    // ignore autoplay and decode failures
  }
}

function playAudioAndWait(audio) {
  if (!audio) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const end = () => {
      audio.removeEventListener("ended", end);
      audio.removeEventListener("error", end);
      resolve();
    };

    audio.currentTime = 0;
    audio.addEventListener("ended", end, { once: true });
    audio.addEventListener("error", end, { once: true });
    audio.play().catch(() => end());
  });
}

async function loopAudio(audio) {
  if (!audio) {
    return;
  }
  audio.loop = true;
  await playAudio(audio);
}

function stopActiveBgm() {
  if (!state.activeBgmAudio) {
    return;
  }
  state.activeBgmAudio.loop = false;
  stopAudio(state.activeBgmAudio);
  state.activeBgmAudio = null;
}

function stopActiveResult() {
  if (!state.activeResultAudio) {
    return;
  }
  stopAudio(state.activeResultAudio);
  state.activeResultAudio = null;
}

function stopSceneVoice() {
  if (state.sceneVoiceTimeoutId) {
    clearTimeout(state.sceneVoiceTimeoutId);
    state.sceneVoiceTimeoutId = null;
  }
  stopAudio(audioCache.sceneVoice.perfect);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function preloadImage(src) {
  if (imagePreloadCache.has(src)) {
    return imagePreloadCache.get(src);
  }

  const promise = new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve(src);
    image.addEventListener("load", done, { once: true });
    image.addEventListener("error", done, { once: true });
    image.src = src;
  });

  imagePreloadCache.set(src, promise);
  return promise;
}

function pickRandomCutin() {
  return resultCutins[Math.floor(Math.random() * resultCutins.length)];
}

function getDifficultyData(key) {
  const difficulty = wordLists[key] ?? wordLists.beginner ?? { label: "", subLabel: "", words: [] };
  const mode = getModeDefinition(key);
  return {
    ...difficulty,
    label: mode.label ?? difficulty.label,
    subLabel: mode.subLabel ?? difficulty.subLabel,
    words: difficulty.words ?? [],
  };
}

function getWordReading(word) {
  return word?.kana ?? word?.display ?? "";
}

function getWordRomajiGuide(word) {
  if (typeof word?.romaji === "string" && word.romaji.length > 0) {
    return normalizeTypingValue(word.romaji);
  }

  return normalizeTypingValue(getWordReading(word));
}

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function getModeDefinition(key) {
  return modeDefinitions[key] ?? modeDefinitions.beginner;
}

function isVisibleMode(key, section) {
  const mode = getModeDefinition(key);
  if (!mode?.implemented || !mode?.[section]) {
    return false;
  }

  if (mode.hiddenUntilUnlocked && !isUnlocked(key)) {
    return false;
  }

  return true;
}

function getTitleModeKeys() {
  return modeOrder.filter((key) => isVisibleMode(key, "showInTitle"));
}

function getEncyclopediaModeKeys() {
  return modeOrder.filter((key) => isVisibleMode(key, "showInEncyclopedia"));
}

function getRankingFilterModeKeys() {
  return modeOrder.filter((key) => isVisibleMode(key, "showInRankingFilter"));
}

function getFirstUnlockedTitleMode() {
  return getTitleModeKeys().find((key) => isUnlocked(key)) ?? "beginner";
}

function loadUnlock() {
  const unlockedKeys = new Set(["beginner"]);

  try {
    const stored = Number.parseInt(localStorage.getItem(difficultyUnlockStorageKey) ?? "0", 10);
    const unlockedIndex = Number.isFinite(stored)
      ? Math.max(0, Math.min(stored, difficultyOrder.length - 1))
      : 0;
    for (let index = 0; index <= unlockedIndex; index += 1) {
      const key = difficultyOrder[index];
      if (key) {
        unlockedKeys.add(key);
      }
    }
  } catch (_) {
    // ignore legacy storage failures
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(unlockedModeStorageKey) ?? "[]");
    if (Array.isArray(parsed)) {
      for (const key of parsed) {
        if (typeof key === "string" && modeDefinitions[key]) {
          unlockedKeys.add(key);
        }
      }
    }
  } catch (_) {
    // ignore storage failures
  }

  return unlockedKeys;
}

function resetPreviouslyUnlockedSecretModesOnce() {
  try {
    if (localStorage.getItem(secretModeResetStorageKey) === "done") {
      return;
    }

    const parsed = JSON.parse(localStorage.getItem(unlockedModeStorageKey) ?? "[]");
    if (Array.isArray(parsed)) {
      const secretModeKeys = new Set(["secret_guga", "secret_phrase"]);
      const remainingKeys = parsed.filter((key) => !secretModeKeys.has(key));
      localStorage.setItem(unlockedModeStorageKey, JSON.stringify(remainingKeys));
    }

    localStorage.setItem(secretModeResetStorageKey, "done");
  } catch (_) {
    // ignore storage failures
  }
}

function saveUnlock() {
  try {
    localStorage.setItem(unlockedModeStorageKey, JSON.stringify([...state.unlockedModeKeys]));
    const unlockedIndex = getTitleModeKeys().reduce(
      (highest, key, index) => (state.unlockedModeKeys.has(key) ? index : highest),
      0,
    );
    localStorage.setItem(difficultyUnlockStorageKey, String(unlockedIndex));
  } catch (_) {
    // ignore storage failures
  }
}

function normalizePlayerName(value) {
  return value.normalize("NFKC").trim().slice(0, 20);
}

function loadPlayerName() {
  try {
    return normalizePlayerName(localStorage.getItem(playerNameStorageKey) ?? "");
  } catch (_) {
    return "";
  }
}

function savePlayerName(name) {
  try {
    if (name) {
      localStorage.setItem(playerNameStorageKey, name);
    } else {
      localStorage.removeItem(playerNameStorageKey);
    }
  } catch (_) {
    // ignore storage failures
  }
}

function getDisplayPlayerName() {
  return state.playerName || "プレイヤー";
}

function getRankingPlayerName() {
  return state.playerName || "No name";
}

function updatePlayerNameStatus() {
  if (!titleElements.nameStatus) {
    return;
  }

  titleElements.nameStatus.textContent = state.playerName
    ? `現在のユーザー名: ${state.playerName}`
    : "未記入ならゲーム中は「プレイヤー」、スコアでは「No name」になります。";
}

function applyPlayerName() {
  if (playElements.playerStageName) {
    playElements.playerStageName.textContent = getDisplayPlayerName();
  }
  if (titleElements.nameInput && titleElements.nameInput !== document.activeElement) {
    titleElements.nameInput.value = state.playerName;
  }
  updatePlayerNameStatus();
}

function commitPlayerName() {
  const nextName = normalizePlayerName(titleElements.nameInput?.value ?? "");
  state.playerName = nextName;
  savePlayerName(nextName);
  applyPlayerName();
  renderRankingList();
}

function loadRankingEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(rankingStorageKey) ?? "[]");
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((entry) =>
        entry &&
        typeof entry.name === "string" &&
        Number.isFinite(entry.score) &&
        typeof entry.difficulty === "string" &&
        Number.isFinite(entry.misses),
      )
      .map((entry) => ({
        ...entry,
        difficultyKey: normalizeRankingDifficultyKey(entry),
        bonusScore: Number.isFinite(entry.bonusScore) ? entry.bonusScore : 0,
      }))
      .slice(0, 30);
  } catch (_) {
    return [];
  }
}

function saveRankingEntries(entries) {
  try {
    localStorage.setItem(rankingStorageKey, JSON.stringify(entries.slice(0, 30)));
  } catch (_) {
    // ignore storage failures
  }
}

function compareRankingEntries(a, b) {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  if (a.misses !== b.misses) {
    return a.misses - b.misses;
  }
  return (a.playedAt ?? 0) - (b.playedAt ?? 0);
}

function normalizeRankingDifficultyKey(entry) {
  if (modeOrder.includes(entry?.difficultyKey)) {
    return entry.difficultyKey;
  }

  const matchedKey = modeOrder.find((key) => getDifficultyData(key).label === entry?.difficulty);
  return matchedKey ?? "beginner";
}

function getRankingFilterLabel(filterKey) {
  if (filterKey === "all") {
    return "全モード表示";
  }

  return `${getDifficultyData(filterKey).label}のみ表示`;
}

function cycleRankingFilter() {
  const filterOrder = ["all", ...getRankingFilterModeKeys()];
  const currentIndex = filterOrder.indexOf(state.rankingFilter);
  const nextIndex = (currentIndex + 1) % filterOrder.length;
  state.rankingFilter = filterOrder[nextIndex];
  renderRankingList();
}

function renderRankingList() {
  const container = titleElements.rankingList;
  if (!container) {
    return;
  }

  const entries = state.onlineRankingEntries ?? loadRankingEntries();
  const filteredEntries = (
    state.rankingFilter === "all"
      ? entries
      : entries.filter((entry) => entry.difficultyKey === state.rankingFilter)
  ).slice(0, 30);
  container.innerHTML = "";
  if (titleElements.rankingFilterStatus) {
    titleElements.rankingFilterStatus.textContent = getRankingFilterLabel(state.rankingFilter);
  }

  if (filteredEntries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "ranking-empty";
    empty.textContent =
      state.rankingFilter === "all" ? "まだ記録がありません。" : "このモードの記録はまだありません。";
    container.append(empty);
    return;
  }

  filteredEntries.forEach((entry, index) => {
    const item = document.createElement("article");
    item.className = "ranking-item";

    const rank = document.createElement("p");
    rank.className = "ranking-rank";
    rank.textContent = `${index + 1}位`;

    const textWrap = document.createElement("div");

    const name = document.createElement("p");
    name.className = "ranking-name";
    name.textContent = entry.name;

    const meta = document.createElement("p");
    meta.className = "ranking-meta";
    meta.textContent = `${entry.difficulty} / ミス ${entry.misses}`;

    const score = document.createElement("p");
    score.className = "ranking-score";
    const scoreValue = document.createElement("span");
    scoreValue.className = "ranking-score-number";
    scoreValue.textContent = String(entry.score);
    score.append(scoreValue, document.createTextNode(" 個"));

    if (entry.bonusScore > 0) {
      score.append(document.createTextNode(" (+ボーナス "));

      const bonusValue = document.createElement("span");
      bonusValue.className = "ranking-score-number";
      if (entry.bonusScore > 100) {
        bonusValue.classList.add("is-highlighted");
      }
      bonusValue.textContent = String(entry.bonusScore);

      score.append(bonusValue, document.createTextNode(" 個)"));
    }

    textWrap.append(name, meta);
    item.append(rank, textWrap, score);
    container.append(item);
  });
}

function recordRankingEntry() {
  const difficulty = getDifficultyData(state.selectedDifficulty);
  const entries = loadRankingEntries();
  const entry = {
    name: getRankingPlayerName(),
    score: state.play.score,
    bonusScore: state.play.bonusScore,
    difficultyKey: state.selectedDifficulty,
    difficulty: difficulty.label,
    misses: state.play.misses,
    playedAt: Date.now(),
  };
  entries.push(entry);
  entries.sort(compareRankingEntries);
  saveRankingEntries(entries);
  renderRankingList();
  void window.gugugagaOnlineRanking?.submit(entry);
}

function isUnlocked(key) {
  return state.unlockedModeKeys.has(key);
}

function unlockMode(key) {
  if (!modeDefinitions[key] || state.unlockedModeKeys.has(key)) {
    return false;
  }

  state.unlockedModeKeys.add(key);
  saveUnlock();
  return true;
}

function unlockText(key) {
  const unlock = getModeDefinition(key).unlock;
  if (!unlock || unlock.type === "available") {
    return "最初から遊べます";
  }

  if (unlock.type === "clear" && unlock.mode) {
    return `${getDifficultyData(unlock.mode).label}をクリアすると解放`;
  }

  if (unlock.type === "perfect" && unlock.mode) {
    return `${getDifficultyData(unlock.mode).label}をノーミスクリアで解放`;
  }

  if (unlock.type === "score-zero-fail" && unlock.mode) {
    return `${getDifficultyData(unlock.mode).label}で0個のまま失敗すると解放`;
  }

  return "特別な条件で解放";
}

function unlockNext(resultKey) {
  let unlockedAny = false;

  for (const key of modeOrder) {
    if (isUnlocked(key)) {
      continue;
    }

    const unlock = getModeDefinition(key).unlock;
    if (!unlock) {
      continue;
    }

    const clearedCurrentMode = ["clear", "good", "perfect"].includes(resultKey);
    const isUnlockTargetMode = unlock.mode === state.selectedDifficulty;

    if (unlock.type === "clear" && isUnlockTargetMode && clearedCurrentMode) {
      unlockedAny = unlockMode(key) || unlockedAny;
      continue;
    }

    if (unlock.type === "perfect" && isUnlockTargetMode && resultKey === "perfect") {
      unlockedAny = unlockMode(key) || unlockedAny;
      continue;
    }

    if (
      unlock.type === "score-zero-fail" &&
      isUnlockTargetMode &&
      state.play.score === 0 &&
      ["very-bad", "bad"].includes(resultKey)
    ) {
      unlockedAny = unlockMode(key) || unlockedAny;
    }
  }

  if (unlockedAny) {
    renderDifficultyCards();
    renderEncyclopediaFilters();
    renderRankingList();
  }
}

async function unlockSecretModesByTitleTap() {
  const targetKeys = ["secret_guga", "secret_phrase"];
  let unlockedAny = false;

  for (const key of targetKeys) {
    unlockedAny = unlockMode(key) || unlockedAny;
  }

  state.titleSecretTapCount = 0;

  if (!unlockedAny) {
    return;
  }

  renderDifficultyCards();
  renderEncyclopediaFilters();
  renderRankingList();
  await playAudio(audioCache.scene.good);
}

function setScreen(name) {
  state.currentScreen = name;
  document.querySelector(".app")?.setAttribute("data-screen", name);

  for (const [key, element] of Object.entries(screens)) {
    if (!element) {
      continue;
    }
    const isActive = key === name;
    element.classList.toggle("is-active", isActive);
    element.setAttribute("aria-hidden", String(!isActive));
  }

  if (name === "play") {
    scheduleCurrentWordFit();
  }
}

function setTitleVisualMode(mode) {
  state.titleVisualMode = mode;
  const showRanking = mode === "ranking";

  if (titleElements.imagePanel) {
    titleElements.imagePanel.hidden = showRanking;
  }
  if (titleElements.rankingPanel) {
    titleElements.rankingPanel.hidden = !showRanking;
  }
  if (titleElements.toggleRankingButton) {
    titleElements.toggleRankingButton.textContent = showRanking ? "イラストを表示" : "スコアを表示";
  }

  if (showRanking) {
    renderRankingList();
  }
}

function renderDifficultyCards() {
  titleElements.difficultyCards.innerHTML = "";

  for (const key of getTitleModeKeys()) {
    const difficulty = getDifficultyData(key);
    const mode = getModeDefinition(key);
    const unlocked = isUnlocked(key);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "difficulty-card";
    card.disabled = !unlocked;
    card.innerHTML = `
      <strong>${difficulty.label}：${difficulty.subLabel}</strong>
      <span>クリア目安 ${mode.targetScore} 個 / ${mode.description}</span>
    `;

    if (key === state.selectedDifficulty) {
      card.classList.add("is-selected");
    }
    if (!unlocked) {
      card.classList.add("is-locked");
    }

    card.addEventListener("click", async () => {
      if (!unlocked) {
        return;
      }
      state.selectedDifficulty = key;
      renderDifficultyCards();
      renderSelectedDifficulty();
      await playAudio(audioCache.select);
    });

    titleElements.difficultyCards.append(card);
  }
}

function renderSelectedDifficulty() {
  const difficulty = getDifficultyData(state.selectedDifficulty);
  if (titleElements.zumiImage) {
    titleElements.zumiImage.src = titleImages[state.selectedDifficulty] ?? titleImages.default;
  }
}

function renderEncyclopediaFilters() {
  encyclopediaElements.filters.innerHTML = "";

  for (const key of getEncyclopediaModeKeys()) {
    const difficulty = getDifficultyData(key);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "encyclopedia-filter-button";
    button.textContent = `${difficulty.label} / ${difficulty.subLabel}`;

    if (key === state.selectedEncyclopediaDifficulty) {
      button.classList.add("is-selected");
    }

    button.addEventListener("click", async () => {
      state.selectedEncyclopediaDifficulty = key;
      state.selectedEncyclopediaWord = getDifficultyData(key).words[0]?.display ?? "";
      renderEncyclopediaFilters();
      renderEncyclopediaWords();
      renderEncyclopediaDetail();
      await playAudio(audioCache.select);
    });

    encyclopediaElements.filters.append(button);
  }
}

function renderEncyclopediaWords() {
  encyclopediaElements.wordList.innerHTML = "";
  const difficulty = getDifficultyData(state.selectedEncyclopediaDifficulty);

  for (const word of difficulty.words) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "encyclopedia-word-button";
    button.innerHTML = `<strong>${word.display}</strong><small>${word.romaji}</small>`;

    if (word.display === state.selectedEncyclopediaWord) {
      button.classList.add("is-selected");
    }

    button.addEventListener("click", async () => {
      state.selectedEncyclopediaWord = word.display;
      renderEncyclopediaWords();
      renderEncyclopediaDetail();
      await playAudio(audioCache.select);
    });

    encyclopediaElements.wordList.append(button);
  }
}

function renderEncyclopediaDetail() {
  const difficulty = getDifficultyData(state.selectedEncyclopediaDifficulty);
  const word = difficulty.words.find((entry) => entry.display === state.selectedEncyclopediaWord) ?? difficulty.words[0];

  if (!word) {
    return;
  }

  encyclopediaElements.wordTitle.textContent = word.display;
  encyclopediaElements.wordMode.textContent = `${difficulty.label} / ${word.romaji}`;
  encyclopediaElements.wordDescription.textContent =
    encyclopediaEntries[word.display] ?? `${word.display} の説明は今後追加できます。`;
}

function shuffleWords(words) {
  const copy = [...words];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function resetPlayState() {
  const difficulty = getDifficultyData(state.selectedDifficulty);
  state.play = {
    timeLeft: 60,
    score: 0,
    bonusScore: 0,
    misses: 0,
    successStreak: 0,
    bestSuccessStreak: 0,
    creatureStageCount: 0,
    wordQueue: shuffleWords(difficulty.words),
    currentWord: null,
  };
}

function pullNextWord() {
  const difficulty = getDifficultyData(state.selectedDifficulty);
  if (state.play.wordQueue.length === 0) {
    state.play.wordQueue = shuffleWords(difficulty.words);
  }
  state.play.currentWord = state.play.wordQueue.shift() ?? difficulty.words[0] ?? null;
}

function toHiragana(text) {
  return text.replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
}

function kanaToRomaji(text) {
  const normalized = toHiragana(text.normalize("NFKC").toLowerCase());
  let result = "";

  for (let index = 0; index < normalized.length; index += 1) {
    const current = normalized[index];
    const next = normalized[index + 1] ?? "";
    const pair = normalized.slice(index, index + 2);
    const triple = normalized.slice(index, index + 3);

    if (digraphMap[triple]) {
      result += digraphMap[triple];
      index += 2;
      continue;
    }

    if (digraphMap[pair]) {
      result += digraphMap[pair];
      index += 1;
      continue;
    }

    if (current === "っ") {
      const nextPair = normalized.slice(index + 1, index + 3);
      const nextTriple = normalized.slice(index + 1, index + 4);
      const roman = digraphMap[nextTriple] ?? digraphMap[nextPair] ?? kanaMap[next] ?? "";
      result += roman[0] ?? "";
      continue;
    }

    if (current === "ー") {
      result += "-";
      continue;
    }

    if (smallKanaRomanMap[current]) {
      result += smallKanaRomanMap[current][0];
      continue;
    }

    result += kanaMap[current] ?? current;
  }

  return result;
}

function normalizeTypingValue(value) {
  const normalized = value.normalize("NFKC").toLowerCase().replace(/\s+/g, "");
  return /[ぁ-んァ-ヶー]/.test(normalized) ? kanaToRomaji(normalized) : normalized;
}

function buildVariantSet(base) {
  const variants = new Set([base]);
  let changed = true;

  while (changed) {
    changed = false;

    for (const variant of [...variants]) {
      for (const [left, right] of romajiPairs) {
        if (variant.includes(left)) {
          const next = variant.replaceAll(left, right);
          if (!variants.has(next)) {
            variants.add(next);
            changed = true;
          }
        }

        if (variant.includes(right)) {
          const next = variant.replaceAll(right, left);
          if (!variants.has(next)) {
            variants.add(next);
            changed = true;
          }
        }
      }

    }
  }

  return variants;
}

function mergeVariantSets(target, variants, limit = 768) {
  for (const variant of variants) {
    if (target.size >= limit) {
      break;
    }
    target.add(variant);
  }
  return target;
}

function getKanaSequenceVariants(text) {
  const normalized = toHiragana(text.normalize("NFKC").toLowerCase());
  const memo = new Map();

  const walk = (index) => {
    if (memo.has(index)) {
      return memo.get(index);
    }

    const result = new Set();
    if (index >= normalized.length) {
      result.add("");
      memo.set(index, result);
      return result;
    }

    const current = normalized[index];
    const pair = normalized.slice(index, index + 2);
    const triple = normalized.slice(index, index + 3);

    const append = (segmentLength, heads) => {
      const tails = walk(index + segmentLength);
      for (const head of heads) {
        for (const tail of tails) {
          if (result.size >= 192) {
            break;
          }
          result.add(`${head}${tail}`);
        }
        if (result.size >= 192) {
          break;
        }
      }
    };

    if (current === "っ") {
      const tails = walk(index + 1);
      for (const tail of tails) {
        if (!tail) {
          continue;
        }
        result.add(`${tail[0] ?? ""}${tail}`);
        if (result.size >= 192) {
          break;
        }
      }
      memo.set(index, result);
      return result;
    }

    if (current === "ー") {
      append(1, ["-"]);
      memo.set(index, result);
      return result;
    }

    if (triple && digraphVariantMap[triple]) {
      append(3, digraphVariantMap[triple]);
    }
    if (pair && digraphVariantMap[pair]) {
      append(2, digraphVariantMap[pair]);
    }
    if (smallKanaRomanMap[current]) {
      append(1, smallKanaRomanMap[current]);
    }
    if (kanaVariantMap[current]) {
      append(1, kanaVariantMap[current]);
    }
    if (kanaMap[current]) {
      append(1, [kanaMap[current]]);
    } else {
      append(1, [current]);
    }

    memo.set(index, result);
    return result;
  };

  return [...walk(0)];
}

function getAcceptedRomajiVariants(word) {
  const reading = getWordReading(word);
  const guideSeed = getWordRomajiGuide(word);
  const key = `${word.display}:${reading}:${guideSeed}`;
  const cached = acceptedVariantCache.get(key);
  if (cached) {
    return cached;
  }

  const base = guideSeed;
  const fromDisplay = kanaToRomaji(reading);
  const displayVariants = getKanaSequenceVariants(reading);
  const usesLongMark = reading.includes("ー") && displayVariants.some((value) => value.includes("-"));
  const exactVariants = new Set();
  const guideVariants = new Set();

  mergeVariantSets(exactVariants, buildVariantSet(usesLongMark && fromDisplay.includes("-") ? fromDisplay : base));
  mergeVariantSets(guideVariants, exactVariants);

  for (const displayVariant of displayVariants) {
    mergeVariantSets(guideVariants, buildVariantSet(displayVariant));
    if (!usesLongMark || displayVariant.includes("-")) {
      mergeVariantSets(exactVariants, buildVariantSet(displayVariant));
    }
  }

  const guide = base || displayVariants.find((value) => value.includes("-")) || fromDisplay;
  const result = {
    guide,
    exactVariants: [...exactVariants],
    guideVariants: [...guideVariants],
  };
  acceptedVariantCache.set(key, result);
  return result;
}

function getGuideDisplayParts(word, typed) {
  const { guide, guideVariants } = getAcceptedRomajiVariants(word);
  const typedAlt = typed.replaceAll("nn", "n");

  const directVariant = guideVariants.find((variant) => variant.startsWith(typed));
  if (directVariant) {
    return {
      typedPart: typed,
      remainingPart: directVariant.slice(typed.length),
    };
  }

  const altVariant = guideVariants.find((variant) => variant.startsWith(typedAlt));
  if (altVariant) {
    return {
      typedPart: typed,
      remainingPart: altVariant.slice(typedAlt.length),
    };
  }

  return {
    typedPart: typed,
    remainingPart: typed.length === 0 ? guide : "",
  };
}

function renderRomajiGuide() {
  const word = state.play.currentWord;
  if (!word) {
    playElements.currentWordGuide.textContent = "";
    return;
  }

  const typed = normalizeTypingValue(playElements.typingInput.value);
  const { typedPart, remainingPart } = getGuideDisplayParts(word, typed);

  playElements.currentWordGuide.innerHTML = `
    <span class="typed-part">${typedPart}</span>
    <span class="remaining-part">${remainingPart}</span>
  `;
}

function fitCurrentWordDisplay() {
  const element = playElements.currentWordDisplay;
  if (!element) {
    return;
  }

  if (state.selectedDifficulty === "secret_phrase") {
    element.style.fontSize = "";
    return;
  }

  const maxSize = 52;
  const minSize = 8;
  const availableWidth = element.clientWidth || element.parentElement?.clientWidth || 0;
  if (availableWidth <= 0) {
    return;
  }

  element.style.fontSize = `${maxSize}px`;

  if (element.scrollWidth <= availableWidth) {
    return;
  }

  let nextSize = Math.max(minSize, Math.floor((availableWidth / element.scrollWidth) * maxSize));
  element.style.fontSize = `${nextSize}px`;

  while (element.scrollWidth > availableWidth && nextSize > minSize) {
    nextSize -= 1;
    element.style.fontSize = `${nextSize}px`;
  }
}

function scheduleCurrentWordFit() {
  fitCurrentWordDisplay();
  requestAnimationFrame(() => {
    fitCurrentWordDisplay();
    requestAnimationFrame(() => fitCurrentWordDisplay());
  });
}

function getScoreThresholds(difficultyKey = state.selectedDifficulty) {
  const clear = getModeDefinition(difficultyKey).targetScore;
  const good = clear + 5;
  const bad = Math.max(5, clear - 4);
  return { bad, clear, good, perfect: good };
}

function formatScoreThresholdSummary(difficultyKey) {
  const thresholds = getScoreThresholds(difficultyKey);
  return `全然足りない / ちょっと足りない / なんとかクリア / 満足な結果: 0 / ${thresholds.bad} / ${thresholds.clear} / ${thresholds.good}`;
}

function updateReaction(mode) {
  const map = {
    idle: {
      badge: "？",
      text: "まだ待っています。",
      zumiImage: "./assets/images/variations/zumi_thinking.png",
      zumiBadge: "考え中",
      zumiTitle: "次のプレゼントを考え中",
      zumiCopy: "ぐぐががの様子を見ています。",
      gugugagaImage: "./assets/images/variations/gugugaga_curious.png",
      gugugagaBadge: "きょとん",
      gugugagaTitle: "様子見中",
      gugugagaCopy: "何が届くか気になっています。",
    },
    typing: {
      badge: "…",
      text: "入力中です。",
      zumiImage: "./assets/images/variations/zumi_thinking.png",
      zumiBadge: "考え中",
      zumiTitle: "入力を見守っている",
      zumiCopy: "タイミングをはかっています。",
      gugugagaImage: "./assets/images/variations/gugugaga_curious.png",
      gugugagaBadge: "きょとん",
      gugugagaTitle: "入力を見ている",
      gugugagaCopy: "じっと待っています。",
    },
    success: {
      badge: "♡",
      text: "プレゼント成功。",
      zumiImage: "./assets/images/variations/zumi_offering_both_hands.png",
      zumiBadge: "はいっ",
      zumiTitle: "両手で手渡し",
      zumiCopy: "うれしそうに渡しています。",
      gugugagaImage: "./assets/images/variations/gugugaga_waai_jump.png",
      gugugagaBadge: "わぁっ",
      gugugagaTitle: "ばんざいしている",
      gugugagaCopy: "表情が明るくなりました。",
    },
    miss: {
      badge: "！",
      text: "入力ミス。",
      zumiImage: "./assets/images/variations/zumi_shocked.png",
      zumiBadge: "あれっ",
      zumiTitle: "ちょっとびっくり",
      zumiCopy: "落ち着いて打ち直しです。",
      gugugagaImage: "./assets/images/variations/gugugaga_pui.png",
      gugugagaBadge: "ぷいっ",
      gugugagaTitle: "ちょっとそっぽ",
      gugugagaCopy: "次の入力を待っています。",
    },
  };

  const next = map[mode] ?? map.idle;
  playElements.reactionBadge.textContent = next.badge;
  playElements.reactionText.textContent = next.text;
  playElements.zumiPlayImage.src = next.zumiImage;
  playElements.zumiMoodBadge.textContent = next.zumiBadge;
  playElements.zumiPoseTitle.textContent = next.zumiTitle;
  playElements.zumiPoseCopy.textContent = next.zumiCopy;
  playElements.gugugagaPlayImage.src = next.gugugagaImage;
  playElements.gugugagaMoodBadge.textContent = next.gugugagaBadge;
  playElements.gugugagaPoseTitle.textContent = next.gugugagaTitle;
  playElements.gugugagaPoseCopy.textContent = next.gugugagaCopy;
}

function renderPlayScreen() {
  const difficulty = getDifficultyData(state.selectedDifficulty);
  const target = getModeDefinition(state.selectedDifficulty).targetScore;
  playElements.modeName.textContent = difficulty.label;
  playElements.modeCopy.textContent = difficulty.subLabel;
  applyPlayerName();
  playElements.timeValue.textContent = formatTime(state.play.timeLeft);
  playElements.scoreValue.textContent = String(state.play.score);
  playElements.missValue.textContent = String(state.play.misses);
  playElements.comboValue.textContent = String(state.play.successStreak);
  playElements.affectionFill.style.width = `${Math.min((state.play.score / target) * 100, 100)}%`;
  playElements.currentWordDisplay.textContent = state.play.currentWord?.display ?? "準備中";
  playElements.layout?.style.setProperty("--mode-stage-background", `url("${playBackgrounds[state.selectedDifficulty]}")`);
  playElements.screen?.setAttribute("data-difficulty", state.selectedDifficulty);
  renderRomajiGuide();
  renderCreatureStage();
  scheduleCurrentWordFit();
}

function renderCreatureStage() {
  if (!playElements.creatureStageLane || !playElements.creatureStageStatus) {
    return;
  }

  const count = Math.max(0, state.play.creatureStageCount ?? 0);
  const lane = playElements.creatureStageLane;
  const currentCount = lane.children.length;

  if (count === 0) {
    lane.innerHTML = "";
    lane.dataset.count = "0";
    playElements.creatureStageStatus.textContent = "プレゼントを集めてぐぐががを増やそう";
    return;
  }

  playElements.creatureStageStatus.textContent = `${count}匹のぐぐががが集まっています`;
  if (currentCount === count) {
    lane.dataset.count = String(count);
    return;
  }

  if (currentCount > count) {
    while (lane.children.length > count) {
      lane.lastElementChild?.remove();
    }
    lane.dataset.count = String(count);
    return;
  }

  for (let index = currentCount; index < count; index += 1) {
    const creature = document.createElement("div");
    creature.className = "creature-stage-item";
    creature.style.animationDelay = `${(index % 6) * 0.18}s`;
    const placement = creatureStagePlacements[index % creatureStagePlacements.length];
    const cycle = Math.floor(index / creatureStagePlacements.length);
    const left = Math.min(94, placement.left + cycle * 0.4);
    const bottom = placement.bottom + cycle * 12;
    creature.style.left = `${left}%`;
    creature.style.bottom = `${bottom}px`;
    creature.style.setProperty("--creature-scale", String(placement.scale));
    creature.style.setProperty("--creature-rotate", `${placement.rotate}deg`);
    creature.style.zIndex = String(220 - Math.round(bottom));

    const image = document.createElement("img");
    image.src = "./assets/images/variations/gugugaga_waai_jump.png";
    image.alt = "";
    creature.append(image);
    lane.append(creature);
  }

  lane.dataset.count = String(count);
}

function preparePlayScreen() {
  resetPlayState();
  pullNextWord();
  state.isResolvingWord = false;
  playElements.typingInput.value = "";
  playElements.typingInput.disabled = true;
  playElements.typingHint.textContent = "カウントダウン後にスタートです。";
  updateReaction("idle");
  renderPlayScreen();
}

function stopTimer() {
  if (!state.timerId) {
    return;
  }
  clearInterval(state.timerId);
  state.timerId = null;
}

function startTimer() {
  stopTimer();
  state.isTypingActive = true;
  state.timerId = setInterval(() => {
    state.play.timeLeft -= 1;
    playElements.timeValue.textContent = formatTime(Math.max(state.play.timeLeft, 0));
    if (state.play.timeLeft <= 10 && state.play.timeLeft > 0) {
      void playAudio(audioCache.tenCount);
    }
    if (state.play.timeLeft <= 0) {
      void endGame();
    }
  }, 1000);
}

async function startGameplayNow(sequenceId) {
  if (sequenceId !== state.startSequenceId || state.currentScreen !== "play") {
    return;
  }

  playElements.typingInput.disabled = false;
  state.isResolvingWord = false;
  playElements.typingHint.textContent = "ローマ字で入力してください。かな入力も判定します。";
  updateReaction("idle");
  renderPlayScreen();
  startTimer();
  trackAnalyticsEvent("game_start", {
    difficulty: state.selectedDifficulty,
  });
  void window.gugugagaCounter?.increment();
  stopActiveBgm();
  state.activeBgmAudio = audioCache.bgm[state.selectedDifficulty] ?? null;
  await loopAudio(state.activeBgmAudio);

  setTimeout(() => {
    if (sequenceId === state.startSequenceId && state.currentScreen === "play") {
      playElements.typingInput.focus();
    }
  }, 50);
}

async function beginGameStartSequence() {
  if (state.isStartingGame || !isUnlocked(state.selectedDifficulty)) {
    return;
  }

  state.isStartingGame = true;
  state.startSequenceId += 1;
  const sequenceId = state.startSequenceId;

  resetResultStage();
  resetBonusScreen();
  stopActiveResult();
  stopActiveBgm();
  stopSceneVoice();
  preparePlayScreen();
  setScreen("play");

  await playAudioAndWait(audioCache.gameStart);
  await playAudioAndWait(audioCache.countdown);
  await startGameplayNow(sequenceId);
}

function matchesCurrentWord(inputValue) {
  const word = state.play.currentWord;
  if (!word) {
    return false;
  }

  const typed = normalizeTypingValue(inputValue);
  const typedAlt = typed.replaceAll("nn", "n");
  return getAcceptedRomajiVariants(word).exactVariants.some(
    (variant) => variant === typed || variant === typedAlt,
  );
}

function canContinueCurrentWord(inputValue) {
  const word = state.play.currentWord;
  if (!word) {
    return false;
  }

  const typed = normalizeTypingValue(inputValue);
  const typedAlt = typed.replaceAll("nn", "n");

  return getAcceptedRomajiVariants(word).guideVariants.some(
    (variant) => variant.startsWith(typed) || variant.startsWith(typedAlt),
  );
}

async function handleSuccessfulWord() {
  const word = state.play.currentWord;
  if (!word) {
    return;
  }

  state.isResolvingWord = true;
  playElements.typingInput.disabled = true;

  try {
    state.play.score += 1;
    state.play.successStreak += 1;
    state.play.bestSuccessStreak = Math.max(state.play.bestSuccessStreak, state.play.successStreak);
    state.play.creatureStageCount = Math.min(state.play.creatureStageCount + 1, 24);
    updateReaction("success");
    renderPlayScreen();
    await playAudio(audioCache.pinpon);
    await sleep(500);
    pullNextWord();
    playElements.typingInput.value = "";
    playElements.typingHint.textContent = "このまま次へ。";
    updateReaction("typing");
    renderPlayScreen();
  } finally {
    state.isResolvingWord = false;
    if (state.currentScreen === "play" && state.isTypingActive) {
      playElements.typingInput.disabled = false;
      playElements.typingInput.focus();
    }
  }
}

async function handleMissInput() {
  state.play.misses += 1;
  state.play.successStreak = 0;
  state.play.creatureStageCount = Math.max(state.play.creatureStageCount - 1, 0);
  playElements.typingHint.textContent = "今はペナルティ0です。";
  updateReaction("miss");
  renderPlayScreen();
  await playAudio(audioCache.boo);
}

async function handleTypingInput() {
  if (!state.isTypingActive || !state.play.currentWord || state.isResolvingWord) {
    return;
  }

  const raw = playElements.typingInput.value;
  renderRomajiGuide();

  if (raw.length === 0) {
    updateReaction("typing");
    renderPlayScreen();
    return;
  }

  if (matchesCurrentWord(raw)) {
    await handleSuccessfulWord();
    return;
  }

  if (canContinueCurrentWord(raw)) {
    updateReaction("typing");
    renderPlayScreen();
    return;
  }

  playElements.typingInput.value = "";
  await handleMissInput();
}

function determineResultKey() {
  const thresholds = getScoreThresholds();
  if (state.play.misses === 0 && state.play.score >= thresholds.perfect) {
    return "perfect";
  }
  if (state.play.score >= thresholds.good) {
    return "good";
  }
  if (state.play.score >= thresholds.clear) {
    return "clear";
  }
  if (state.play.score >= thresholds.bad) {
    return "bad";
  }
  return "very-bad";
}

function fillResultSummary(key) {
  const difficulty = getDifficultyData(state.selectedDifficulty);
  const scene = resultSceneMap[key];
  const bonusText =
    state.play.bonusScore > 0 ? ` + (ボーナス) ${state.play.bonusScore} 個` : "";
  resultElements.summaryTitle.textContent = `${scene.title} (${difficulty.label})`;
  resultElements.summaryCopy.textContent = scene.caption;
  resultElements.idleResultName.textContent = scene.title;
  resultElements.idleResultSummary.textContent = "カットインから始まるリザルト演出を表示します。";
  resultElements.resultImage.src = scene.image;
  resultElements.resultImage.alt = `${scene.title}のリザルトイラスト`;
  resultElements.scoreValue.textContent = `${state.play.score} 個${bonusText}`;
  resultElements.targetValue.textContent = `${getModeDefinition(state.selectedDifficulty).targetScore} 個`;
  resultElements.missValue.textContent = `${state.play.misses} 回`;
}

function resetResultStage() {
  resultElements.infoPanel.classList.remove("is-visible");
  resultElements.stage.classList.remove("is-playing");
  resultElements.cutinImage.classList.remove("is-visible");
  resultElements.resultImage.classList.remove("is-visible");
  resultElements.cutinVariant.classList.remove("is-visible");
  resultElements.announcement.classList.remove("is-visible");
  resultElements.scoreCard.classList.remove("is-visible");
  resultElements.congratulationsText.classList.remove("is-visible");
  resultElements.stage.dataset.scene = "idle";
}

async function playResultSequence(key) {
  const scene = resultSceneMap[key];
  stopActiveResult();
  stopSceneVoice();
  state.currentCutin = pickRandomCutin();
  resultElements.cutinImage.src = state.currentCutin.src;
  resultElements.cutinVariant.textContent = state.currentCutin.label;
  resultElements.title.textContent = scene.title;
  resultElements.caption.textContent = scene.caption;
  resetResultStage();
  resultElements.stage.classList.add("is-playing");
  resultElements.stage.dataset.scene = key;

  await playAudio(audioCache.cutin);
  resultElements.cutinImage.classList.add("is-visible");
  resultElements.cutinVariant.classList.add("is-visible");
  await sleep(sequenceTiming.cutinMs);
  resultElements.cutinVariant.classList.remove("is-visible");
  await playAudioAndWait(audioCache.wait);
  resultElements.cutinImage.classList.remove("is-visible");
  resultElements.resultImage.classList.add("is-visible");

  if (scene.showCongratulations) {
    await sleep(220);
    resultElements.congratulationsText.classList.add("is-visible");
  }

  await sleep(sequenceTiming.resultMs);
  state.activeResultAudio = audioCache.scene[key] ?? null;
  await playAudio(state.activeResultAudio);
  resultElements.announcement.classList.add("is-visible");

  if (key === "perfect") {
    state.sceneVoiceTimeoutId = setTimeout(() => {
      void playAudio(audioCache.sceneVoice.perfect);
      state.sceneVoiceTimeoutId = null;
    }, 250);
  }

  await sleep(sequenceTiming.announcementMs);
  resultElements.scoreCard.classList.add("is-visible");
  resultElements.infoPanel.classList.add("is-visible");
}

function canTriggerBonusTime() {
  return state.play.bestSuccessStreak >= 10;
}

function updateBonusHud() {
  const milliseconds = Math.max(state.bonus.endAt - Date.now(), 0);
  bonusElements.timeValue.textContent = (milliseconds / 1000).toFixed(1);
  bonusElements.hitValue.textContent = String(state.bonus.hits);
}

function stopBonusTimers() {
  if (state.bonusTimerId) {
    clearInterval(state.bonusTimerId);
    state.bonusTimerId = null;
  }
  if (state.bonusFinishTimeoutId) {
    clearTimeout(state.bonusFinishTimeoutId);
    state.bonusFinishTimeoutId = null;
  }
}

function resetBonusScreen() {
  stopBonusTimers();
  state.bonus.sequenceId += 1;
  bonusElements.playUi.dataset.phase = "intro";
  if (bonusElements.promptLabel) {
    bonusElements.promptLabel.textContent = "Bonus Time";
  }
  bonusElements.prompt.textContent = "が";
  if (bonusElements.guide) {
    bonusElements.guide.textContent = "`ga` または `が` で反応します";
  }
  bonusElements.input.value = "";
  bonusElements.input.disabled = true;
  bonusElements.finishImage.classList.remove("is-visible");
  bonusElements.finishImage.src = "";
  bonusElements.hud.classList.remove("is-hidden");
  bonusElements.playUi.classList.remove("is-hidden");
  bonusElements.rainLayer.classList.remove("is-hidden");
  bonusElements.backgroundImage.src = bonusBackgroundInitial;
  bonusElements.rainLayer.innerHTML = "";
  state.bonus.hits = 0;
  state.bonus.isActive = false;
  state.bonus.endAt = 0;
  bonusElements.timeValue.textContent = "15.0";
  bonusElements.hitValue.textContent = "0";
}

function spawnBonusGift(label) {
  const rain = document.createElement("span");
  rain.className = "bonus-fall-item";
  rain.textContent = label;
  rain.style.left = `${8 + Math.random() * 84}%`;
  rain.style.background = "#fff8ea";
  rain.style.setProperty("--fall-duration", `${900 + Math.random() * 550}ms`);
  rain.style.setProperty("--fall-rotate", `${-18 + Math.random() * 36}deg`);
  bonusElements.rainLayer.append(rain);
  setTimeout(() => rain.remove(), 1600);
}

function getBonusFinishImageSrc(hitCount) {
  for (const entry of bonusFinishThresholds) {
    if (hitCount >= entry.threshold) {
      return entry.src;
    }
  }
  return bonusFinishThresholds[bonusFinishThresholds.length - 1].src;
}

async function finishBonusTime() {
  if (!state.bonus.isActive) {
    return;
  }

  state.bonus.isActive = false;
  stopBonusTimers();
  bonusElements.input.disabled = true;
  stopActiveBgm();
  await playAudioAndWait(audioCache.lastGa);
  bonusElements.hud.classList.add("is-hidden");
  bonusElements.playUi.classList.add("is-hidden");
  bonusElements.rainLayer.classList.add("is-hidden");
  const finishSrc = getBonusFinishImageSrc(state.bonus.hits);
  await preloadImage(finishSrc);
  bonusElements.finishImage.src = finishSrc;
  bonusElements.finishImage.classList.add("is-visible");
  await playAudioAndWait(audioCache.finish);
  await sleep(sequenceTiming.finishMs);

  const resultKey = determineResultKey();
  trackGameComplete(resultKey);
  unlockNext(resultKey);
  recordRankingEntry();
  fillResultSummary(resultKey);
  setScreen("result");
  await playResultSequence(resultKey);
}

function startBonusClock() {
  stopBonusTimers();
  state.bonus.isActive = true;
  state.bonus.endAt = Date.now() + bonusDurationMs;
  updateBonusHud();
  state.bonusTimerId = setInterval(() => {
    updateBonusHud();
    if (Date.now() >= state.bonus.endAt) {
      void finishBonusTime();
    }
  }, 100);
}

async function beginBonusTime() {
  resetBonusScreen();
  setScreen("bonus");
  trackAnalyticsEvent("bonus_start", {
    difficulty: state.selectedDifficulty,
    score: state.play.score,
    misses: state.play.misses,
  });
  stopActiveBgm();
  state.activeBgmAudio = audioCache.bgm.bonus ?? null;
  await loopAudio(state.activeBgmAudio);
  const sequenceId = state.bonus.sequenceId;
  bonusElements.playUi.dataset.phase = "intro";
  bonusElements.timeValue.textContent = "5.0";
  if (bonusElements.promptLabel) {
    bonusElements.promptLabel.textContent = "Bonus Time";
  }
  bonusElements.prompt.textContent = "BONUS";
  if (bonusElements.guide) {
    bonusElements.guide.textContent = "ボーナスタイム突入！";
  }
  await sleep(1700);
  if (state.currentScreen !== "bonus" || sequenceId !== state.bonus.sequenceId) return;
  bonusElements.timeValue.textContent = "3.3";
  if (bonusElements.promptLabel) {
    bonusElements.promptLabel.textContent = "Hit!";
  }
  bonusElements.prompt.textContent = "g + a";
  if (bonusElements.guide) {
    bonusElements.guide.textContent = "g と a を交互に連打して！";
  }
  await sleep(1700);
  if (state.currentScreen !== "bonus" || sequenceId !== state.bonus.sequenceId) return;
  bonusElements.timeValue.textContent = "1.6";
  if (bonusElements.promptLabel) {
    bonusElements.promptLabel.textContent = "Ready?";
  }
  bonusElements.prompt.textContent = "Ready?";
  if (bonusElements.guide) {
    bonusElements.guide.textContent = "15秒間の入力タイムが始まります";
  }
  await sleep(Math.max(0, bonusIntroMs - 3400));
  if (state.currentScreen !== "bonus" || sequenceId !== state.bonus.sequenceId) return;
  bonusElements.playUi.dataset.phase = "active";
  if (bonusElements.promptLabel) {
    bonusElements.promptLabel.textContent = "ひたすら入力";
  }
  bonusElements.prompt.textContent = bonusPromptWord.display;
  if (bonusElements.guide) {
    bonusElements.guide.textContent = "g と a を交互に連打して！";
  }
  bonusElements.timeValue.textContent = "15.0";
  bonusElements.input.disabled = false;
  bonusElements.input.focus();
  startBonusClock();
}

async function handleBonusInput() {
  if (!state.bonus.isActive) {
    return;
  }

  const normalized = normalizeTypingValue(bonusElements.input.value);
  let remaining = normalized.replace(/[^ga]/g, "");
  let hits = 0;

  while (true) {
    const index = remaining.indexOf("ga");
    if (index === -1) {
      break;
    }
    hits += 1;
    remaining = remaining.slice(index + 2);
  }

  bonusElements.input.value = remaining;

  if (hits === 0) {
    return;
  }

  state.bonus.hits += hits;
  state.play.bonusScore += hits;
  updateBonusHud();

  for (let index = 0; index < hits; index += 1) {
    void playAudio(audioCache.ga);
    bonusElements.backgroundImage.src =
      bonusBackgroundFrames[(state.bonus.hits - hits + index) % bonusBackgroundFrames.length];
    spawnBonusGift(bonusGiftPool[Math.floor(Math.random() * bonusGiftPool.length)] ?? "おかし");
  }
}

async function endGame() {
  if (!state.isTypingActive) {
    return;
  }

  state.isTypingActive = false;
  state.isStartingGame = false;
  stopTimer();
  stopActiveBgm();
  stopSceneVoice();
  playElements.typingInput.blur();
  playElements.typingInput.disabled = true;

  if (canTriggerBonusTime()) {
    await beginBonusTime();
    return;
  }

  const resultKey = determineResultKey();
  trackGameComplete(resultKey);
  unlockNext(resultKey);
  recordRankingEntry();
  fillResultSummary(resultKey);
  setScreen("result");
  await playResultSequence(resultKey);
}

function backToTitle() {
  state.isTypingActive = false;
  state.isStartingGame = false;
  state.startSequenceId += 1;
  stopTimer();
  stopBonusTimers();
  stopActiveResult();
  stopActiveBgm();
  stopSceneVoice();
  stopAudio(audioCache.countdown);
  stopAudio(audioCache.gameStart);
  stopAudio(audioCache.tenCount);
  stopAudio(audioCache.ga);
  stopAudio(audioCache.lastGa);
  stopAudio(audioCache.finish);
  resetBonusScreen();
  setScreen("title");
}

titleElements.startButton.addEventListener("click", async () => {
  await beginGameStartSequence();
});

titleElements.encyclopediaButton.addEventListener("click", async () => {
  renderEncyclopediaFilters();
  renderEncyclopediaWords();
  renderEncyclopediaDetail();
  setScreen("encyclopedia");
  await playAudio(audioCache.select);
});

titleElements.toggleRankingButton.addEventListener("click", async () => {
  setTitleVisualMode(state.titleVisualMode === "ranking" ? "image" : "ranking");
  await playAudio(audioCache.select);
});

titleElements.titleImage?.addEventListener("click", async () => {
  if (state.currentScreen !== "title") {
    return;
  }

  state.titleSecretTapCount += 1;
  if (state.titleSecretTapCount >= 10) {
    await unlockSecretModesByTitleTap();
  }
});

titleElements.rankingFilterButton?.addEventListener("click", async () => {
  cycleRankingFilter();
  await playAudio(audioCache.select);
});

titleElements.saveNameButton.addEventListener("click", async () => {
  commitPlayerName();
  await playAudio(audioCache.select);
});

titleElements.nameInput.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  commitPlayerName();
  await playAudio(audioCache.select);
});

encyclopediaElements.backButton.addEventListener("click", async () => {
  await playAudio(audioCache.select);
  backToTitle();
});

playElements.backButton.addEventListener("click", async () => {
  await playAudio(audioCache.select);
  backToTitle();
});

resultElements.retryButton.addEventListener("click", async () => {
  await beginGameStartSequence();
});

resultElements.titleButton.addEventListener("click", async () => {
  await playAudio(audioCache.select);
  backToTitle();
});

playElements.typingInput.addEventListener("input", () => {
  void handleTypingInput();
});

bonusElements.input.addEventListener("input", () => {
  void handleBonusInput();
});

screens.play.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button") || event.target.closest("input")) {
    return;
  }
  playElements.typingInput.focus();
});

screens.bonus.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button") || event.target.closest("input")) {
    return;
  }
  bonusElements.input.focus();
});

bonusFinishThresholds.forEach((entry) => {
  void preloadImage(entry.src);
});

resetPreviouslyUnlockedSecretModesOnce();
state.unlockedModeKeys = loadUnlock();
state.playerName = loadPlayerName();
if (!isUnlocked(state.selectedDifficulty)) {
  state.selectedDifficulty = getFirstUnlockedTitleMode();
}

renderDifficultyCards();
renderSelectedDifficulty();
applyPlayerName();
renderRankingList();
setTitleVisualMode("image");
renderEncyclopediaFilters();
renderEncyclopediaWords();
renderEncyclopediaDetail();
resetBonusScreen();
updateReaction("idle");
renderPlayScreen();
setScreen("title");

window.addEventListener("resize", () => {
  scheduleCurrentWordFit();
});

window.addEventListener("gugugaga-ranking-loaded", (event) => {
  if (!Array.isArray(event.detail)) {
    return;
  }

  state.onlineRankingEntries = event.detail
    .map((entry) => ({
      ...entry,
      difficultyKey: normalizeRankingDifficultyKey(entry),
      bonusScore: Number.isFinite(entry.bonusScore) ? entry.bonusScore : 0,
    }))
    .sort(compareRankingEntries)
    .slice(0, 100);
  renderRankingList();
});
