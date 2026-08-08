import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjlCNHm33sQZtra5Bd0495ryams4W8c2c",
  authDomain: "gugugaga-typing.firebaseapp.com",
  projectId: "gugugaga-typing",
  storageBucket: "gugugaga-typing.firebasestorage.app",
  messagingSenderId: "255499239971",
  appId: "1:255499239971:web:ad24e50d555d228b876796",
  measurementId: "G-G5CNS8K2VY",
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const counterReference = doc(database, "publicCounters", "totalPlays");
const rankingCollection = collection(database, "rankings");
const counterElement = document.querySelector("#totalPlayCount");
const startGameButton = document.querySelector("#startGameButton");

function renderCount(count) {
  if (!counterElement) {
    return;
  }

  counterElement.textContent = `みんなの総プレイ回数：${count.toLocaleString("ja-JP")} 回`;
}

function renderUnavailable() {
  if (counterElement) {
    counterElement.textContent = "みんなの総プレイ回数：-- 回";
  }
}

async function loadCount() {
  try {
    const snapshot = await getDoc(counterReference);
    const count = snapshot.exists() ? snapshot.data().count : 0;
    renderCount(Number.isSafeInteger(count) && count >= 0 ? count : 0);
  } catch (error) {
    console.warn("総プレイ回数を取得できませんでした。", error);
    renderUnavailable();
  }
}

async function increment() {
  try {
    const nextCount = await runTransaction(database, async (transaction) => {
      const snapshot = await transaction.get(counterReference);
      const currentCount = snapshot.exists() ? snapshot.data().count : 0;
      const safeCurrentCount = Number.isSafeInteger(currentCount) && currentCount >= 0 ? currentCount : 0;
      const updatedCount = safeCurrentCount + 1;

      transaction.set(counterReference, { count: updatedCount });
      return updatedCount;
    });

    renderCount(nextCount);
  } catch (error) {
    console.warn("総プレイ回数を更新できませんでした。", error);
    await loadCount();
  }
}

async function loadRanking() {
  try {
    const rankingQuery = query(rankingCollection, orderBy("score", "desc"), limit(100));
    const snapshot = await getDocs(rankingQuery);
    const entries = snapshot.docs.map((rankingDocument) => {
      const data = rankingDocument.data();
      return {
        name: data.name,
        score: data.score,
        bonusScore: data.bonusScore,
        difficultyKey: data.difficultyKey,
        difficulty: data.difficulty,
        misses: data.misses,
        playedAt: data.playedAt?.toMillis?.() ?? 0,
      };
    });

    window.dispatchEvent(new CustomEvent("gugugaga-ranking-loaded", { detail: entries }));
  } catch (error) {
    console.warn("オンラインランキングを取得できませんでした。", error);
  }
}

async function submitRanking(entry) {
  try {
    await addDoc(rankingCollection, {
      name: String(entry.name).slice(0, 20),
      score: Math.max(0, Math.trunc(entry.score)),
      bonusScore: Math.max(0, Math.trunc(entry.bonusScore)),
      difficultyKey: entry.difficultyKey,
      difficulty: entry.difficulty,
      misses: Math.max(0, Math.trunc(entry.misses)),
      playedAt: serverTimestamp(),
    });
    await loadRanking();
  } catch (error) {
    console.warn("オンラインランキングへ記録できませんでした。", error);
  }
}

window.gugugagaCounter = { increment, loadCount };
window.gugugagaOnlineRanking = { load: loadRanking, submit: submitRanking };
startGameButton?.addEventListener("click", () => {
  void increment();
});
void loadCount();
void loadRanking();
