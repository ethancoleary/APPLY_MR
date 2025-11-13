// ===== static/js/memory_game.js =====

// ---------- js_vars ----------
const treatmentNum = parseInt(js_vars.treatment_num, 10);
const taskType = treatmentNum > 8 ? 'emotion' : 'math';
const roundIndex = parseInt(js_vars.round_index, 10);
const mixType = js_vars.mix; // 'mix1' | 'mix2' | null
const game_field_name = 'id_' + js_vars.field_name;
const phase = js_vars.phase || null; // 'easy' | 'hard' | null


// ---------- Game state ----------
let BoxOpened = "";
let ImgOpened = "";
let Counter = 0;
let ImgFound = 0;
let BoxesSolved = 0;
let DeckPairsFound = 0; // pairs found in the current deck only (0..8)


const Max_decks_by_round = {1: 3, 2: 7, 3: 7};
let Max_boxes = Max_decks_by_round[roundIndex];
const Source = "#boxcard";

// Attempts
localStorage.setItem('Attempts', '0');
function incrementAttempts() {
  let Attempts = parseInt(localStorage.getItem('Attempts') || '0', 10);
  Attempts++;
  localStorage.setItem('Attempts', String(Attempts));
  const attemptsInput = document.getElementById(game_field_name + '_Attempts');
  if (attemptsInput) attemptsInput.value = Attempts;
}

// ---------- PATHS ----------
const BASES = {
  math:    "/static/mathmemory_V2",   
  emotion: "/static/emotionrecognition"     
};

// Build deck folder based on task/round/mix/phase and deck number (1-based)
function deckFolderPath(task, roundIdx, deckNumber) {
  if (roundIdx === 1) {
    const ph = phase || ((BoxesSolved < Math.ceil(Max_boxes/2)) ? 'easy' : 'hard');
    return `${BASES[task]}/Round1/${ph}/deck${deckNumber}`;
  }
  if (roundIdx === 2) {
    const mx = (mixType === 'mix2') ? 'Mix2' : 'Mix1';
    return `${BASES[task]}/Round2/${mx}/deck${deckNumber}`;
  }
  // round 3
  return `${BASES[task]}/Round3/deck${deckNumber}`;
}


// ===== MANIFESTS (placeholders to fill) =====
// Put JUST filenames here (e.g., "3_v1_math_I_hard.png"), not full paths.
// The code will prepend the deck folder path at runtime.

const MANIFEST = {
  math: {
    Round1: {
      easy: {
        deck1: [
            ["5_v_1_math_none_easy.png", "5_v_2_math_none_easy.png"], 
            ["7_v_1_math_none_easy.png", "7_v_3_math_none_easy.png"],
            ["8_v_1_math_none_easy.png", "8_v_2_math_none_easy.png"],
            ["10_v_1_math_none_easy.png", "10_v_4_math_none_easy.png"],
            ["11_v_1_math_none_easy.png", "11_v_4_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_3_math_none_easy.png"],
            ["14_v_1_math_none_easy.png", "14_v_2_math_none_easy.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ],
        deck2: [ 
            ["3_v_1_math_none_easy.png", "3_v_2_math_none_easy.png"],
            ["6_v_1_math_none_easy.png", "6_v_2_math_none_easy.png"],
            ["8_v_1_math_none_easy.png", "8_v_2_math_none_easy.png"],
            ["9_v_1_math_none_easy.png", "9_v_3_math_none_easy.png"],
            ["10_v_1_math_none_easy.png", "10_v_2_math_none_easy.png"],
            ["11_v_3_math_none_easy.png", "11_v_4_math_none_easy.png"],
            ["14_v_1_math_none_easy.png", "14_v_2_math_none_easy.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ],
        deck3: [ 
            ["4_v_1_math_none_easy.png", "4_v_2_math_none_easy.png"],
            ["6_v_1_math_none_easy.png", "6_v_2_math_none_easy.png"],
            ["7_v_2_math_none_easy.png", "7_v_3_math_none_easy.png"],
            ["9_v_1_math_none_easy.png", "9_v_4_math_none_easy.png"],
            ["11_v_1_math_none_easy.png", "11_v_2_math_none_easy.png"],
            ["12_v_2_math_none_easy.png", "12_v_3_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_3_math_none_easy.png"],
            ["14_v_1_math_none_easy.png", "14_v_2_math_none_easy.png"],
        ],
      },
      hard: {
        deck1: [  
            ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
            ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
            ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
            ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
            ["8_v_1_math_I_hard.png", "8_v_2_math_I_hard.png"],
            ["8_v_1_math_II_hard.png", "8_v_3_math_II_hard.png"],
            ["11_v_1_math_I_hard.png", "11_v_3_math_I_hard.png"],
            ["11_v_1_math_II_hard.png", "11_v_3_math_II_hard.png"],
        ],
        deck2: [
            ["7_v_2_math_I_hard.png", "7_v_3_math_I_hard.png"],
            ["7_v_1_math_II_hard.png", "7_v_2_math_II_hard.png"],
            ["11_v_1_math_I_hard.png", "11_v_2_math_I_hard.png"],
            ["11_v_1_math_II_hard.png", "11_v_3_math_II_hard.png"],
            ["14_v_1_math_I_hard.png", "14_v_2_math_I_hard.png"],
            ["14_v_1_math_II_hard.png", "14_v_2_math_II_hard.png"],
            ["15_v_1_math_I_hard.png", "15_v_2_math_I_hard.png"],
            ["15_v_1_math_II_hard.png", "15_v_2_math_II_hard.png"],
        ],
        deck3: [ 
            ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
            ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
            ["10_v_2_math_I_hard.png", "10_v_3_math_I_hard.png"],
            ["10_v_2_math_II_hard.png", "10_v_3_math_II_hard.png"],
            ["11_v_1_math_I_hard.png", "11_v_4_math_I_hard.png"],
            ["11_v_1_math_II_hard.png", "11_v_2_math_II_hard.png"],
            ["13_v_2_math_I_hard.png", "13_v_3_math_I_hard.png"],
            ["13_v_1_math_II_hard.png", "13_v_3_math_II_hard.png"],
        ],
      },
    },
    Round2: {
      Mix1: {
        deck1: [ 
            ["3_v_1_math_none_easy.png", "3_v_2_math_none_easy.png"],
            ["4_v_1_math_I_hard.png", "4_v_2_math_I_hard.png"],
            ["4_v_1_math_II_hard.png", "4_v_2_math_II_hard.png"],
            ["5_v_1_math_none_easy.png", "5_v_2_math_none_easy.png"],
            ["6_v_1_math_none_easy.png", "6_v_2_math_none_easy.png"],
            ["7_v_1_math_none_easy.png", "7_v_2_math_none_easy.png"],
            ["12_v_1_math_none_easy.png", "12_v_3_math_none_easy.png"],
            ["13_v_2_math_none_easy.png", "13_v_3_math_none_easy.png"],
        ],
        deck2: [ 
            ["4_v_1_math_none_easy.png", "4_v_2_math_none_easy.png"],
            ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
            ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
            ["6_v_1_math_none_easy.png", "6_v_2_math_none_easy.png"],
            ["8_v_1_math_none_easy.png", "8_v_2_math_none_easy.png"],
            ["10_v_1_math_none_easy.png", "10_v_4_math_none_easy.png"],
            ["11_v_1_math_none_easy.png", "11_v_4_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_3_math_none_easy.png"],
        ],
        deck3: [
            ["4_v_1_math_none_easy.png", "4_v_2_math_none_easy.png"],
            ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
            ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
            ["6_v_1_math_none_easy.png", "6_v_2_math_none_easy.png"],
            ["7_v_2_math_none_easy.png", "7_v_3_math_none_easy.png"],
            ["9_v_2_math_none_easy.png", "9_v_4_math_none_easy.png"],
            ["10_v_1_math_none_easy.png", "10_v_4_math_none_easy.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ], 
        deck4: [
            ["4_v_1_math_none_easy.png", "4_v_2_math_none_easy.png"],
            ["7_v_1_math_I_hard.png", "7_v_2_math_I_hard.png"],
            ["7_v_2_math_II_hard.png", "7_v_3_math_II_hard.png"],
            ["9_v_2_math_none_easy.png", "9_v_3_math_none_easy.png"],
            ["10_v_1_math_none_easy.png", "10_v_4_math_none_easy.png"],
            ["11_v_2_math_none_easy.png", "11_v_4_math_none_easy.png"],
            ["14_v_1_math_none_easy.png", "14_v_2_math_none_easy.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ], 
        deck5: [
            ["3_v_1_math_none_easy.png", "3_v_2_math_none_easy.png"],
            ["5_v_1_math_none_easy.png", "5_v_2_math_none_easy.png"],
            ["9_v_1_math_none_easy.png", "9_v_4_math_none_easy.png"],
            ["12_v_2_math_none_easy.png", "12_v_3_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_3_math_none_easy.png"],
            ["14_v_1_math_I_hard.png", "14_v_2_math_I_hard.png"],
            ["14_v_1_math_II_hard.png", "14_v_2_math_II_hard.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ], 
        deck6: [
            ["6_v_1_math_none_easy.png", "6_v_2_math_none_easy.png"],
            ["9_v_1_math_I_hard.png", "9_v_2_math_I_hard.png"],
            ["9_v_2_math_II_hard.png", "9_v_3_math_II_hard.png"],
            ["10_v_3_math_none_easy.png", "10_v_4_math_none_easy.png"],
            ["11_v_2_math_none_easy.png", "11_v_3_math_none_easy.png"],
            ["12_v_2_math_none_easy.png", "12_v_3_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_3_math_none_easy.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ], 
        deck7: [
            ["3_v_1_math_none_easy.png", "3_v_2_math_none_easy.png"],
            ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
            ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
            ["9_v_3_math_none_easy.png", "9_v_4_math_none_easy.png"],
            ["10_v_3_math_none_easy.png", "10_v_4_math_none_easy.png"],
            ["12_v_1_math_none_easy.png", "12_v_2_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_2_math_none_easy.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ],
      },
      Mix2: {
        deck1: [ 
            ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
            ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
            ["7_v_2_math_I_hard.png", "7_v_3_math_I_hard.png"],
            ["7_v_1_math_II_hard.png", "7_v_3_math_II_hard.png"],
            ["8_v_2_math_none_easy.png", "8_v_3_math_none_easy.png"],
            ["12_v_1_math_I_hard.png", "12_v_2_math_I_hard.png"],
            ["12_v_1_math_II_hard.png", "12_v_3_math_II_hard.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ],
        deck2: [
            ["3_v_1_math_I_hard.png", "3_v_2_math_I_hard.png"],
            ["3_v_1_math_II_hard.png", "3_v_2_math_II_hard.png"],
            ["7_v_1_math_I_hard.png", "7_v_3_math_I_hard.png"],
            ["7_v_2_math_II_hard.png", "7_v_3_math_II_hard.png"],
            ["11_v_1_math_I_hard.png", "11_v_3_math_I_hard.png"],
            ["11_v_3_math_II_hard.png", "11_v_4_math_II_hard.png"],
            ["12_v_1_math_none_easy.png", "12_v_3_math_none_easy.png"],
            ["13_v_1_math_none_easy.png", "13_v_3_math_none_easy.png"],
        ], 
        deck3: [
            ["4_v_1_math_I_hard.png", "4_v_2_math_I_hard.png"],
            ["4_v_1_math_II_hard.png", "4_v_2_math_II_hard.png"],
            ["8_v_1_math_none_easy.png", "8_v_3_math_none_easy.png"],
            ["10_v_1_math_I_hard.png", "10_v_4_math_I_hard.png"],
            ["10_v_1_math_II_hard.png", "10_v_4_math_II_hard.png"],
            ["12_v_1_math_I_hard.png", "12_v_2_math_I_hard.png"],
            ["12_v_2_math_II_hard.png", "12_v_3_math_II_hard.png"],
            ["14_v_1_math_none_easy.png", "14_v_2_math_none_easy.png"],
        ], 
        deck4: [
            ["3_v_1_math_none_easy.png", "3_v_2_math_none_easy.png"],
            ["4_v_1_math_none_easy.png", "4_v_2_math_none_easy.png"],
            ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
            ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
            ["10_v_1_math_I_hard.png", "10_v_3_math_I_hard.png"],
            ["10_v_1_math_II_hard.png", "10_v_3_math_II_hard.png"],
            ["14_v_1_math_I_hard.png", "14_v_2_math_I_hard.png"],
            ["14_v_1_math_II_hard.png", "14_v_2_math_II_hard.png"],
        ], 
        deck5: [
            ["5_v_1_math_none_easy.png", "5_v_2_math_none_easy.png"],
            ["7_v_1_math_none_easy.png", "7_v_2_math_none_easy.png"],
            ["9_v_1_math_I_hard.png", "9_v_2_math_I_hard.png"],
            ["9_v_2_math_II_hard.png", "9_v_3_math_II_hard.png"],
            ["10_v_1_math_I_hard.png", "10_v_3_math_I_hard.png"],
            ["10_v_2_math_II_hard.png", "10_v_4_math_II_hard.png"],
            ["11_v_1_math_I_hard.png", "11_v_4_math_I_hard.png"],
            ["11_v_2_math_II_hard.png", "11_v_4_math_II_hard.png"],
        ], 
        deck6: [
            ["4_v_1_math_none_easy.png", "4_v_2_math_none_easy.png"],
            ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
            ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
            ["11_v_1_math_I_hard.png", "11_v_2_math_I_hard.png"],
            ["11_v_2_math_II_hard.png", "11_v_3_math_II_hard.png"],
            ["12_v_2_math_I_hard.png", "12_v_3_math_I_hard.png"],
            ["12_v_1_math_II_hard.png", "12_v_2_math_II_hard.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ], 
        deck7: [
            ["3_v_1_math_none_easy.png", "3_v_2_math_none_easy.png"],
            ["4_v_1_math_I_hard.png", "4_v_2_math_I_hard.png"],
            ["4_v_1_math_II_hard.png", "4_v_2_math_II_hard.png"],
            ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
            ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
            ["13_v_1_math_I_hard.png", "13_v_3_math_I_hard.png"],
            ["13_v_1_math_II_hard.png", "13_v_3_math_II_hard.png"],
            ["15_v_1_math_none_easy.png", "15_v_2_math_none_easy.png"],
        ],
      },
    },
    Round3: {
      deck1: [ 
        ["4_v_1_math_I_hard.png", "4_v_2_math_I_hard.png"],
        ["4_v_1_math_II_hard.png", "4_v_2_math_II_hard.png"],
        ["7_v_2_math_I_hard.png", "7_v_3_math_I_hard.png"],
        ["7_v_1_math_II_hard.png", "7_v_2_math_II_hard.png"],
        ["12_v_2_math_I_hard.png", "12_v_3_math_I_hard.png"],
        ["12_v_1_math_II_hard.png", "12_v_3_math_II_hard.png"],
        ["14_v_1_math_I_hard.png", "14_v_2_math_I_hard.png"],
        ["14_v_1_math_II_hard.png", "14_v_2_math_II_hard.png"],
      ],
      deck2: [
        ["4_v_1_math_I_hard.png", "4_v_2_math_I_hard.png"],
        ["4_v_1_math_II_hard.png", "4_v_2_math_II_hard.png"],
        ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
        ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
        ["7_v_1_math_I_hard.png", "7_v_2_math_I_hard.png"],
        ["7_v_2_math_II_hard.png", "7_v_3_math_II_hard.png"],
        ["10_v_2_math_I_hard.png", "10_v_3_math_I_hard.png"],
        ["10_v_3_math_II_hard.png", "10_v_4_math_II_hard.png"],
      ], 
      deck3: [
        ["10_v_3_math_I_hard.png", "10_v_4_math_I_hard.png"],
        ["10_v_2_math_II_hard.png", "10_v_3_math_II_hard.png"],
        ["13_v_1_math_I_hard.png", "13_v_3_math_I_hard.png"],
        ["13_v_1_math_II_hard.png", "13_v_2_math_II_hard.png"],
        ["14_v_1_math_I_hard.png", "14_v_2_math_I_hard.png"],
        ["14_v_1_math_II_hard.png", "14_v_2_math_II_hard.png"],
        ["15_v_1_math_I_hard.png", "15_v_2_math_I_hard.png"],
        ["15_v_1_math_II_hard.png", "15_v_2_math_II_hard.png"],
      ], 
      deck4: [
        ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
        ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
        ["7_v_1_math_I_hard.png", "7_v_3_math_I_hard.png"],
        ["7_v_2_math_II_hard.png", "7_v_3_math_II_hard.png"],
        ["10_v_1_math_I_hard.png", "10_v_3_math_I_hard.png"],
        ["10_v_2_math_II_hard.png", "10_v_4_math_II_hard.png"],
        ["15_v_1_math_I_hard.png", "15_v_2_math_I_hard.png"],
        ["15_v_1_math_II_hard.png", "15_v_2_math_II_hard.png"],
      ], 
      deck5: [
        ["3_v_1_math_I_hard.png", "3_v_2_math_I_hard.png"],
        ["3_v_1_math_II_hard.png", "3_v_2_math_II_hard.png"],
        ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
        ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
        ["7_v_1_math_I_hard.png", "7_v_2_math_I_hard.png"],
        ["7_v_1_math_II_hard.png", "7_v_3_math_II_hard.png"],
        ["8_v_1_math_I_hard.png", "8_v_2_math_I_hard.png"],
        ["8_v_1_math_II_hard.png", "8_v_2_math_II_hard.png"],
      ], 
      deck6: [
        ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
        ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
        ["13_v_2_math_I_hard.png", "13_v_3_math_I_hard.png"],
        ["13_v_2_math_II_hard.png", "13_v_3_math_II_hard.png"],
        ["14_v_1_math_I_hard.png", "14_v_2_math_I_hard.png"],
        ["14_v_1_math_II_hard.png", "14_v_2_math_II_hard.png"],
        ["15_v_1_math_I_hard.png", "15_v_2_math_I_hard.png"],
        ["15_v_1_math_II_hard.png", "15_v_2_math_II_hard.png"],
      ], 
      deck7: [
        ["5_v_1_math_I_hard.png", "5_v_2_math_I_hard.png"],
        ["5_v_1_math_II_hard.png", "5_v_2_math_II_hard.png"],
        ["6_v_1_math_I_hard.png", "6_v_2_math_I_hard.png"],
        ["6_v_1_math_II_hard.png", "6_v_2_math_II_hard.png"],
        ["11_v_1_math_I_hard.png", "11_v_3_math_I_hard.png"],
        ["11_v_1_math_II_hard.png", "11_v_4_math_II_hard.png"],
        ["13_v_1_math_I_hard.png", "13_v_2_math_I_hard.png"],
        ["13_v_2_math_II_hard.png", "13_v_3_math_II_hard.png"],
      ],
    },
  },

  emotion: {
    Round1: {
      easy: {
        deck1: [
          ["Anger_1_word_none_easy.png", "Anger_4_emotion_none_easy.png"],
          ["Disgust_1_word_none_easy.png", "Disgust_7_emotion_none_easy.png"],
          ["Fear_1_word_none_easy.png", "Fear_5_emotion_none_easy.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_10_emotion_none_easy.png"],
          ["Interest_1_word_none_easy.png", "Interest_1_emotion_none_easy.png"],
          ["Sadness_1_word_none_easy.png", "Sadness_1_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_6_emotion_none_easy.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_2_emotion_none_easy.png"],
        ],
        deck2: [ 
          ["Anger_1_word_none_easy.png", "Anger_14_emotion_none_easy.png"],
          ["Disgust_1_word_none_easy.png", "Disgust_14_emotion_none_easy.png"],
          ["Embarrassment_1_word_none_easy.png", "Embarrassment_10_emotion_none_easy.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_8_emotion_none_easy.png"],
          ["Interest_1_word_none_easy.png", "Interest_10_emotion_none_easy.png"],
          ["Pain_1_word_none_easy.png", "Pain_10_emotion_none_easy.png"],
          ["Pride_1_word_none_easy.png", "Pride_2_emotion_none_easy.png"],
          ["Sadness_1_word_none_easy.png", "Sadness_12_emotion_none_easy.png"],
        ],
        deck3: [
          ["Anger_1_word_none_easy.png", "Anger_9_emotion_none_easy.png"],
          ["Disgust_1_word_none_easy.png", "Disgust_12_emotion_none_easy.png"],
          ["Fear_1_word_none_easy.png", "Fear_9_emotion_none_easy.png"],
          ["Happiness_1_word_none_easy.png", "Happiness_10_emotion_none_easy.png"],
          ["Pain_1_word_none_easy.png", "Pain_2_emotion_none_easy.png"],
          ["Sadness_1_word_none_easy.png", "Sadness_13_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_8_emotion_none_easy.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_10_emotion_none_easy.png"],
        ],
      },
      hard: {
        deck1: [ 
          ["Disgust_1_word_happy_hard.png", "Disgust_8_emotion_happy_hard.png"],
          ["Disgust_1_word_sad_hard.png", "Disgust_7_emotion_sad_hard.png"],
          ["Embarrassment_1_word_happy_hard.png", "Embarrassment_5_emotion_happy_hard.png"],
          ["Embarrassment_1_word_sad_hard.png", "Embarrassment_12_emotion_sad_hard.png"],
          ["Shame_1_word_happy_hard.png", "Shame_4_emotion_happy_hard.png"],
          ["Shame_1_word_sad_hard.png", "Shame_3_emotion_sad_hard.png"],
          ["Surprise_1_word_happy_hard.png", "Surprise_9_emotion_happy_hard.png"],
          ["Surprise_1_word_sad_hard.png", "Surprise_13_emotion_sad_hard.png"],
        ],
        deck2: [
          ["Disgust_1_word_happy_hard.png", "Disgust_4_emotion_happy_hard.png"],
          ["Disgust_1_word_sad_hard.png", "Disgust_12_emotion_sad_hard.png"],
          ["Fear_1_word_happy_hard.png", "Fear_8_emotion_happy_hard.png"],
          ["Fear_1_word_sad_hard.png", "Fear_7_emotion_sad_hard.png"],
          ["Happiness_1_word_happy_hard.png", "Happiness_3_emotion_happy_hard.png"],
          ["Happiness_1_word_sad_hard.png", "Happiness_6_emotion_sad_hard.png"],
          ["Sadness_1_word_happy_hard.png", "Sadness_11_emotion_happy_hard.png"],
          ["Sadness_1_word_sad_hard.png", "Sadness_8_emotion_sad_hard.png"],
        ],
        deck3: [
          ["Anger_1_word_happy_hard.png", "Anger_11_emotion_happy_hard.png"],
          ["Anger_1_word_sad_hard.png", "Anger_7_emotion_sad_hard.png"],
          ["Disgust_1_word_happy_hard.png", "Disgust_3_emotion_happy_hard.png"],
          ["Disgust_1_word_sad_hard.png", "Disgust_14_emotion_sad_hard.png"],
          ["Pain_1_word_happy_hard.png", "Pain_3_emotion_happy_hard.png"],
          ["Pain_1_word_sad_hard.png", "Pain_12_emotion_sad_hard.png"],
          ["Pride_1_word_happy_hard.png", "Pride_14_emotion_happy_hard.png"],
          ["Pride_1_word_sad_hard.png", "Pride_2_emotion_sad_hard.png"],
        ],
      },
    },
    Round2: {
      Mix1: {
        deck1: [
          ["Disgust_1_word_none_easy.png", "Disgust_7_emotion_none_easy.png"],
          ["Embarrassment_1_word_happy_hard.png", "Embarrassment_9_emotion_happy_hard.png"],
          ["Embarrassment_1_word_sad_hard.png", "Embarrassment_2_emotion_sad_hard.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_7_emotion_none_easy.png"],
          ["Happiness_1_word_none_easy.png", "Happiness_1_emotion_none_easy.png"],
          ["Interest_1_word_none_easy.png", "Interest_13_emotion_none_easy.png"],
          ["Sadness_1_word_none_easy.png", "Sadness_4_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_3_emotion_none_easy.png"],
        ],
        deck2: [
          ["Anger_1_word_none_easy.png", "Anger_12_emotion_none_easy.png"],
          ["Disgust_1_word_none_easy.png", "Disgust_5_emotion_none_easy.png"],
          ["Disgust_1_word_happy_hard.png", "Disgust_13_emotion_happy_hard.png"],
          ["Disgust_1_word_sad_hard.png", "Disgust_9_emotion_sad_hard.png"],
          ["Fear_1_word_none_easy.png", "Fear_7_emotion_none_easy.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_10_emotion_none_easy.png"],
          ["Happiness_1_word_none_easy.png", "Happiness_10_emotion_none_easy.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_3_emotion_none_easy.png"],
        ], 
        deck3: [
          ["Anger_1_word_happy_hard.png", "Anger_9_emotion_happy_hard.png"],
          ["Anger_1_word_sad_hard.png", "Anger_10_emotion_sad_hard.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_10_emotion_none_easy.png"],
          ["Happiness_1_word_none_easy.png", "Happiness_12_emotion_none_easy.png"],
          ["Interest_1_word_none_easy.png", "Interest_12_emotion_none_easy.png"],
          ["Pain_1_word_none_easy.png", "Pain_10_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_14_emotion_none_easy.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_3_emotion_none_easy.png"],
        ], 
        deck4: [
          ["Disgust_1_word_none_easy.png", "Disgust_12_emotion_none_easy.png"],
          ["Fear_1_word_none_easy.png", "Fear_11_emotion_none_easy.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_7_emotion_none_easy.png"],
          ["Happiness_1_word_none_easy.png", "Happiness_3_emotion_none_easy.png"],
          ["Pride_1_word_none_easy.png", "Pride_4_emotion_none_easy.png"],
          ["Sadness_1_word_happy_hard.png", "Sadness_8_emotion_happy_hard.png"],
          ["Sadness_1_word_sad_hard.png", "Sadness_4_emotion_sad_hard.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_5_emotion_none_easy.png"],
        ], 
        deck5: [
          ["Anger_1_word_none_easy.png", "Anger_8_emotion_none_easy.png"],
          ["Disgust_1_word_none_easy.png", "Disgust_9_emotion_none_easy.png"],
          ["Fear_1_word_happy_hard.png", "Fear_4_emotion_happy_hard.png"],
          ["Fear_1_word_sad_hard.png", "Fear_10_emotion_sad_hard.png"],
          ["Fear_1_word_none_easy.png", "Fear_12_emotion_none_easy.png"],
          ["Interest_1_word_none_easy.png", "Interest_7_emotion_none_easy.png"],
          ["Pain_1_word_none_easy.png", "Pain_14_emotion_none_easy.png"],
          ["Sadness_1_word_none_easy.png", "Sadness_10_emotion_none_easy.png"],
        ], 
        deck6: [
          ["Anger_1_word_none_easy.png", "Anger_11_emotion_none_easy.png"],
          ["Disgust_1_word_none_easy.png", "Disgust_12_emotion_none_easy.png"],
          ["Pain_1_word_none_easy.png", "Pain_8_emotion_none_easy.png"],
          ["Pain_1_word_happy_hard.png", "Pain_4_emotion_happy_hard.png"],
          ["Pain_1_word_sad_hard.png", "Pain_8_emotion_sad_hard.png"],
          ["Pride_1_word_none_easy.png", "Pride_9_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_2_emotion_none_easy.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_3_emotion_none_easy.png"],
        ], 
        deck7: [
          ["Embarrassment_1_word_none_easy.png", "Embarrassment_7_emotion_none_easy.png"],
          ["Fear_1_word_none_easy.png", "Fear_4_emotion_none_easy.png"],
          ["Interest_1_word_none_easy.png", "Interest_12_emotion_none_easy.png"],
          ["Pain_1_word_none_easy.png", "Pain_5_emotion_none_easy.png"],
          ["Pride_1_word_none_easy.png", "Pride_1_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_1_emotion_none_easy.png"],
          ["Surprise_1_word_happy_hard.png", "Surprise_6_emotion_happy_hard.png"],
          ["Surprise_1_word_sad_hard.png", "Surprise_1_emotion_sad_hard.png"],
        ],
      },
      Mix2: {
        deck1: [ 
          ["Fear_1_word_none_easy.png", "Fear_10_emotion_none_easy.png"],
          ["Fear_1_word_happy_hard.png", "Fear_10_emotion_happy_hard.png"],
          ["Fear_1_word_sad_hard.png", "Fear_2_emotion_sad_hard.png"],
          ["Sadness_1_word_happy_hard.png", "Sadness_10_emotion_happy_hard.png"],
          ["Sadness_1_word_sad_hard.png", "Sadness_1_emotion_sad_hard.png"],
          ["Shame_1_word_none_easy.png", "Shame_2_emotion_none_easy.png"],
          ["Surprise_1_word_happy_hard.png", "Surprise_7_emotion_happy_hard.png"],
          ["Surprise_1_word_sad_hard.png", "Surprise_12_emotion_sad_hard.png"],
        ],
        deck2: [
          ["Anger_1_word_happy_hard.png", "Anger_2_emotion_happy_hard.png"],
          ["Anger_1_word_sad_hard.png", "Anger_10_emotion_sad_hard.png"],
          ["Disgust_1_word_happy_hard.png", "Disgust_10_emotion_happy_hard.png"],
          ["Disgust_1_word_sad_hard.png", "Disgust_2_emotion_sad_hard.png"],
          ["Happiness_1_word_happy_hard.png", "Happiness_8_emotion_happy_hard.png"],
          ["Happiness_1_word_sad_hard.png", "Happiness_11_emotion_sad_hard.png"],
          ["Shame_1_word_none_easy.png", "Shame_13_emotion_none_easy.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_3_emotion_none_easy.png"],
        ], 
        deck3: [
          ["Embarrassment_1_word_none_easy.png", "Embarrassment_9_emotion_none_easy.png"],
          ["Flirtatiousness_1_word_happy_hard.png", "Flirtatiousness_9_emotion_happy_hard.png"],
          ["Flirtatiousness_1_word_sad_hard.png", "Flirtatiousness_1_emotion_sad_hard.png"],
          ["Pain_1_word_none_easy.png", "Pain_4_emotion_none_easy.png"],
          ["Sadness_1_word_happy_hard.png", "Sadness_11_emotion_happy_hard.png"],
          ["Sadness_1_word_sad_hard.png", "Sadness_9_emotion_sad_hard.png"],
          ["Surprise_1_word_happy_hard.png", "Surprise_13_emotion_happy_hard.png"],
          ["Surprise_1_word_sad_hard.png", "Surprise_11_emotion_sad_hard.png"],
        ], 
        deck4: [
          ["Fear_1_word_happy_hard.png", "Fear_5_emotion_happy_hard.png"],
          ["Fear_1_word_sad_hard.png", "Fear_1_emotion_sad_hard.png"],
          ["Flirtatiousness_1_word_happy_hard.png", "Flirtatiousness_2_emotion_happy_hard.png"],
          ["Flirtatiousness_1_word_sad_hard.png", "Flirtatiousness_12_emotion_sad_hard.png"],
          ["Flirtatiousness_1_word_none_easy.png", "Flirtatiousness_12_emotion_none_easy.png"],
          ["Happiness_1_word_happy_hard.png", "Happiness_9_emotion_happy_hard.png"],
          ["Happiness_1_word_sad_hard.png", "Happiness_8_emotion_sad_hard.png"],
          ["Sadness_1_word_none_easy.png", "Sadness_7_emotion_none_easy.png"],
        ], 
        deck5: [
          ["Anger_1_word_happy_hard.png", "Anger_9_emotion_happy_hard.png"],
          ["Anger_1_word_sad_hard.png", "Anger_1_emotion_sad_hard.png"],
          ["Interest_1_word_happy_hard.png", "Interest_2_emotion_happy_hard.png"],
          ["Interest_1_word_sad_hard.png", "Interest_3_emotion_sad_hard.png"],
          ["Pain_1_word_none_easy.png", "Pain_7_emotion_none_easy.png"],
          ["Pride_1_word_happy_hard.png", "Pride_12_emotion_happy_hard.png"],
          ["Pride_1_word_sad_hard.png", "Pride_3_emotion_sad_hard.png"],
          ["Surprise_1_word_none_easy.png", "Surprise_4_emotion_none_easy.png"],
        ], 
        deck6: [
          ["Disgust_1_word_happy_hard.png", "Disgust_14_emotion_happy_hard.png"],
          ["Disgust_1_word_sad_hard.png", "Disgust_7_emotion_sad_hard.png"],
          ["Fear_1_word_none_easy.png", "Fear_12_emotion_none_easy.png"],
          ["Happiness_1_word_happy_hard.png", "Happiness_10_emotion_happy_hard.png"],
          ["Happiness_1_word_sad_hard.png", "Happiness_13_emotion_sad_hard.png"],
          ["Happiness_1_word_none_easy.png", "Happiness_6_emotion_none_easy.png"],
          ["Shame_1_word_happy_hard.png", "Shame_13_emotion_happy_hard.png"],
          ["Shame_1_word_sad_hard.png", "Shame_9_emotion_sad_hard.png"],
        ], 
        deck7: [
          ["Embarrassment_1_word_happy_hard.png", "Embarrassment_14_emotion_happy_hard.png"],
          ["Embarrassment_1_word_sad_hard.png", "Embarrassment_1_emotion_sad_hard.png"],
          ["Fear_1_word_happy_hard.png", "Fear_13_emotion_happy_hard.png"],
          ["Fear_1_word_sad_hard.png", "Fear_12_emotion_sad_hard.png"],
          ["Flirtatiousness_1_word_happy_hard.png", "Flirtatiousness_2_emotion_happy_hard.png"],
          ["Flirtatiousness_1_word_sad_hard.png", "Flirtatiousness_8_emotion_sad_hard.png"],
          ["Interest_1_word_none_easy.png", "Interest_9_emotion_none_easy.png"],
          ["Shame_1_word_none_easy.png", "Shame_7_emotion_none_easy.png"],
        ],
      },
    },
    Round3: {
      deck1: [
        ["Anger_1_word_happy_hard.png", "Anger_6_emotion_happy_hard.png"],
        ["Anger_1_word_sad_hard.png", "Anger_5_emotion_sad_hard.png"],
        ["Fear_1_word_happy_hard.png", "Fear_13_emotion_happy_hard.png"],
        ["Fear_1_word_sad_hard.png", "Fear_5_emotion_sad_hard.png"],
        ["Interest_1_word_happy_hard.png", "Interest_6_emotion_happy_hard.png"],
        ["Interest_1_word_sad_hard.png", "Interest_12_emotion_sad_hard.png"],
        ["Shame_1_word_happy_hard.png", "Shame_14_emotion_happy_hard.png"],
        ["Shame_1_word_sad_hard.png", "Shame_2_emotion_sad_hard.png"],
      ],
      deck2: [
        ["Disgust_1_word_happy_hard.png", "Disgust_12_emotion_happy_hard.png"],
        ["Disgust_1_word_sad_hard.png", "Disgust_14_emotion_sad_hard.png"],
        ["Happiness_1_word_happy_hard.png", "Happiness_2_emotion_happy_hard.png"],
        ["Happiness_1_word_sad_hard.png", "Happiness_8_emotion_sad_hard.png"],
        ["Interest_1_word_happy_hard.png", "Interest_10_emotion_happy_hard.png"],
        ["Interest_1_word_sad_hard.png", "Interest_9_emotion_sad_hard.png"],
        ["Sadness_1_word_happy_hard.png", "Sadness_6_emotion_happy_hard.png"],
        ["Sadness_1_word_sad_hard.png", "Sadness_8_emotion_sad_hard.png"],
      ], 
      deck3: [
        ["Disgust_1_word_happy_hard.png", "Disgust_11_emotion_happy_hard.png"],
        ["Disgust_1_word_sad_hard.png", "Disgust_2_emotion_sad_hard.png"],
        ["Happiness_1_word_happy_hard.png", "Happiness_9_emotion_happy_hard.png"],
        ["Happiness_1_word_sad_hard.png", "Happiness_5_emotion_sad_hard.png"],
        ["Sadness_1_word_happy_hard.png", "Sadness_11_emotion_happy_hard.png"],
        ["Sadness_1_word_sad_hard.png", "Sadness_7_emotion_sad_hard.png"],
        ["Shame_1_word_happy_hard.png", "Shame_12_emotion_happy_hard.png"],
        ["Shame_1_word_sad_hard.png", "Shame_5_emotion_sad_hard.png"],
      ], 
      deck4: [
        ["Flirtatiousness_1_word_happy_hard.png", "Flirtatiousness_4_emotion_happy_hard.png"],
        ["Flirtatiousness_1_word_sad_hard.png", "Flirtatiousness_8_emotion_sad_hard.png"],
        ["Interest_1_word_happy_hard.png", "Interest_13_emotion_happy_hard.png"],
        ["Interest_1_word_sad_hard.png", "Interest_10_emotion_sad_hard.png"],
        ["Sadness_1_word_happy_hard.png", "Sadness_9_emotion_happy_hard.png"],
        ["Sadness_1_word_sad_hard.png", "Sadness_1_emotion_sad_hard.png"],
        ["Surprise_1_word_happy_hard.png", "Surprise_5_emotion_happy_hard.png"],
        ["Surprise_1_word_sad_hard.png", "Surprise_6_emotion_sad_hard.png"],
      ], 
      deck5: [
        ["Flirtatiousness_1_word_happy_hard.png", "Flirtatiousness_2_emotion_happy_hard.png"],
        ["Flirtatiousness_1_word_sad_hard.png", "Flirtatiousness_14_emotion_sad_hard.png"],
        ["Happiness_1_word_happy_hard.png", "Happiness_13_emotion_happy_hard.png"],
        ["Happiness_1_word_sad_hard.png", "Happiness_4_emotion_sad_hard.png"],
        ["Pride_1_word_happy_hard.png", "Pride_4_emotion_happy_hard.png"],
        ["Pride_1_word_sad_hard.png", "Pride_12_emotion_sad_hard.png"],
        ["Sadness_1_word_happy_hard.png", "Sadness_5_emotion_happy_hard.png"],
        ["Sadness_1_word_sad_hard.png", "Sadness_4_emotion_sad_hard.png"],
      ], 
      deck6: [
        ["Fear_1_word_happy_hard.png", "Fear_11_emotion_happy_hard.png"],
        ["Fear_1_word_sad_hard.png", "Fear_13_emotion_sad_hard.png"],
        ["Interest_1_word_happy_hard.png", "Interest_1_emotion_happy_hard.png"],
        ["Interest_1_word_sad_hard.png", "Interest_14_emotion_sad_hard.png"],
        ["Sadness_1_word_happy_hard.png", "Sadness_4_emotion_happy_hard.png"],
        ["Sadness_1_word_sad_hard.png", "Sadness_3_emotion_sad_hard.png"],
        ["Shame_1_word_happy_hard.png", "Shame_8_emotion_happy_hard.png"],
        ["Shame_1_word_sad_hard.png", "Shame_7_emotion_sad_hard.png"],
      ], 
      deck7: [
        ["Embarrassment_1_word_happy_hard.png", "Embarrassment_6_emotion_happy_hard.png"],
        ["Embarrassment_1_word_sad_hard.png", "Embarrassment_14_emotion_sad_hard.png"],
        ["Pain_1_word_happy_hard.png", "Pain_9_emotion_happy_hard.png"],
        ["Pain_1_word_sad_hard.png", "Pain_11_emotion_sad_hard.png"],
        ["Pride_1_word_happy_hard.png", "Pride_14_emotion_happy_hard.png"],
        ["Pride_1_word_sad_hard.png", "Pride_12_emotion_sad_hard.png"],
        ["Surprise_1_word_happy_hard.png", "Surprise_8_emotion_happy_hard.png"],
        ["Surprise_1_word_sad_hard.png", "Surprise_11_emotion_sad_hard.png"],
      ],
    },
  },
};


// ---------- Utils ----------
function preload(srcs) { const imgs=[]; for (const s of srcs){const i=new Image(); i.src=s; imgs.push(i);} return imgs; }
function rndInt(maxExclusive){ return Math.floor(Math.random()*maxExclusive); }


// Pull correct pair list

function currentDeckPairs() {
  const deckNumber = BoxesSolved + 1;
  const taskKey = (taskType === 'math') ? 'math' : 'emotion';

  if (roundIndex === 1) {
    const ph = js_vars.phase || ((BoxesSolved < Math.ceil(Max_boxes/2)) ? 'easy' : 'hard');
    return MANIFEST[taskKey].Round1[ph][`deck${deckNumber}`] || [];
  }
  if (roundIndex === 2) {
    const mx = (mixType === 'mix2') ? 'Mix2' : 'Mix1';
    return MANIFEST[taskKey].Round2[mx][`deck${deckNumber}`] || [];
  }
  return MANIFEST[taskKey].Round3[`deck${deckNumber}`] || [];
}

// Build deck from manifest
let pairIdByFilename = new Map(); // filename (no path) -> pair index (0..7)

function buildDeckFromManifest() {
  const pairs = currentDeckPairs(); // [ [f1, f2], ... ] (8 pairs expected)
  const deckNumber = BoxesSolved + 1;
  const folder = deckFolderPath(taskType, roundIndex, deckNumber);

  if (!Array.isArray(pairs) || pairs.length !== 8) {
    console.warn('Deck manifest should have 8 pairs; got', pairs?.length, pairs, 'at', {taskType, roundIndex, deckNumber});
  }

  pairIdByFilename = new Map();
  const urls = [];

  (pairs || []).forEach((pair, idx) => {
    if (!Array.isArray(pair) || pair.length !== 2) {
      console.warn('Pair must be [f1, f2], got', pair, 'in deck', deckNumber);
      return;
    }
    const [f1, f2] = pair;
    pairIdByFilename.set(f1, idx);
    pairIdByFilename.set(f2, idx);
    urls.push(`${folder}/${f1}`, `${folder}/${f2}`);
  });

  // Optional hard check: expect exactly 16 images
  if (urls.length !== 16) {
    console.warn('Deck does not have 16 images; got', urls.length, '— check manifest for deck', deckNumber);
  }

  preload(urls);
  return urls;
}

function nextDeckImages() {
  return buildDeckFromManifest();
}

// Match using manifest map
function isImageMatch(srcA, srcB) {
  const baseA = srcA.split('/').pop();
  const baseB = srcB.split('/').pop();
  const idA = pairIdByFilename.get(baseA);
  const idB = pairIdByFilename.get(baseB);
  return (idA !== undefined && idA === idB);
}


// ---------- Rendering / interactions ----------
function ShuffleImages(){
  const ImgAll = $(Source).children();
  let node = $(Source + " div:first-child");
  const srcs = [];
  for (let i=0;i<ImgAll.length;i++){ srcs.push($("#"+node.attr("id")+" img").attr("src")); node = node.next(); }
  for (let i=srcs.length-1;i>0;i--){ const j=rndInt(i+1); [srcs[i],srcs[j]]=[srcs[j],srcs[i]]; }
  node = $(Source + " div:first-child");
  for (let k=0;k<srcs.length;k++){ $("#"+node.attr("id")+" img").attr("src",srcs[k]); node=node.next(); }
}

function drawDeck(imgList){
  $(Source).empty();
  imgList.forEach((val,i)=> $(Source).append(`<div id=card${BoxesSolved}_${i}><img src="${val}" /></div>`));
  DeckPairsFound = 0;
  $(Source + " div").click(OpenCard);
  ShuffleImages();
}

function announce(msg){ $("#transitionMessage").text(msg).show(); }

function goNext(){
  if (BoxesSolved >= Max_boxes) { announce("You completed all the decks for this round! 🎉"); return; }
  $("#transitionMessage").hide();
  drawDeck(nextDeckImages());
}

function OpenCard(){
  const id = $(this).attr("id");
  if ($("#"+id+" img").is(":hidden")){
    $(Source + " div").unbind("click", OpenCard);
    $("#"+id+" img").slideDown('fast');

    if (ImgOpened === ""){
      BoxOpened = id;
      ImgOpened = $("#"+id+" img").attr("src");
      setTimeout(()=>$(Source + " div").bind("click", OpenCard), 250);
    } else {
      incrementAttempts();
      const cur = $("#"+id+" img").attr("src");
      if (isImageMatch(ImgOpened, cur)){
        setTimeout(()=>{
          $("#"+id).css("visibility","hidden");
          $("#"+BoxOpened).css("visibility","hidden");
          BoxOpened=""; ImgOpened="";
        }, 400); //220 original
        ImgFound++;
        DeckPairsFound++;
      } else {
        setTimeout(()=>{
          $("#"+id+" img").slideUp('fast');
          $("#"+BoxOpened+" img").slideUp('fast');
          BoxOpened=""; ImgOpened="";
        }, 400); //original 220
      }
      setTimeout(()=>$(Source + " div").bind("click", OpenCard), 230);
    }

    Counter++; $("#counter").html(""+Counter);

    const foundInput = document.getElementById(game_field_name);
    if (foundInput) foundInput.value = ImgFound;

    // every 8 matches = one full deck
    if (DeckPairsFound === 8){
        BoxesSolved++;
        if (BoxesSolved === Max_boxes){
            announce("You completed all the decks for this round! 🎉");
        } else {
            announce("Deck completed. Loading the next deck…");
            // briefly lock clicks during transition
            $(Source + " div").off("click");
            setTimeout(goNext, 800);
        }
    }
  }
}

// ---------- Boot ----------
$(function(){
  drawDeck(nextDeckImages());
});
