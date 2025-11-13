// Global variables to track game state
var BoxOpened = ""; // ID of the first opened card
var ImgOpened = ""; // Image source of the first opened card
var Counter = 0;    // Number of player moves
var ImgFound = 0;   // Number of matching pairs found
var BoxesSolved = 0; // Number of boxes solved
var Max_boxes = 6 // Number of boxes to solve to complete the game 
let game_field_name ='id_' + js_vars.field_name; // Name of the hidden input field to store the number of images found

// create a locally stored variable Attempts and set it to 0
localStorage.setItem('Attempts', '0');
// Function to increment the counter
function incrementAttempts() {
  // Retrieve the current value of the counter from localStorage
  let Attempts = parseInt(localStorage.getItem('Attempts'), 0);
  Attempts++;
  localStorage.setItem('Attempts', Attempts.toString());
  document.getElementById(game_field_name+'_Attempts').value=Attempts;
  
}


var Source = "#boxcard"; // Selector for the card container element
var ImgSource1 = [
  "/static/mathmemory/Box1/3black_part_1.png",
  "/static/mathmemory/Box1/3red_part_1.png",
  "/static/mathmemory/Box1/3black_part_2.png",
  "/static/mathmemory/Box1/3red_part_2.png",

  "/static/mathmemory/Box1/4black_part_1.png",
  "/static/mathmemory/Box1/4red_part_1.png",
  "/static/mathmemory/Box1/4black_part_2.png",
  "/static/mathmemory/Box1/4red_part_2.png",

  "/static/mathmemory/Box1/5black_part_1.png",
  "/static/mathmemory/Box1/5red_part_1.png",
  "/static/mathmemory/Box1/5black_part_2.png",
  "/static/mathmemory/Box1/5red_part_2.png",

  "/static/mathmemory/Box1/7black_part_1.png",
  "/static/mathmemory/Box1/7red_part_1.png",
  "/static/mathmemory/Box1/7black_part_2.png",
  "/static/mathmemory/Box1/7red_part_2.png"
];


//var ImgSource1 = [
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/3black_part_1.png",
//  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/3red_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/3black_part_2.png",
//  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/3red_part_2.png",
 
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/4black_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/4red_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/4black_part_2.png",
//  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/4red_part_2.png",
 
//  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/5black_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/5red_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/5black_part_2.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/5red_part_2.png",
 
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/7black_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/7red_part_1.png",
 // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/7black_part_2.png",
//  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/7red_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/9black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/9red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/9black_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/9red_part_2.png",
//  
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/1black4_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/1red4_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/1black4_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%201/1red4_part_2.png",
//];
var ImgSource2 = [
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/3red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/3black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/3red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/3black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/4red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/4black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/4red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/4black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/11red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/11black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/11red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/11black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/7red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/7black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/7red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/7black_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/12red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/12black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/12red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/12black_part_2.png",
//  
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/15red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/15black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/15red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%202/15black_part_2.png",
];
var ImgSource3 = [
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/5red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/5black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/5red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/5black_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/6red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/6black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/6red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/6black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/10red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/10black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/10red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/10black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/11red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/11black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/11red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/11black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/14red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/14black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/14red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/14black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/16red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/16black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/16red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%203/16black_part_2.png",
];
var ImgSource4 = [
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/6red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/6black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/6red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/6black_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/7red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/7black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/7red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/7black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/8red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/8black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/8red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/8black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/9red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/9black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/9red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/9black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/13red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/13black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/13red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/13black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/14red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/14black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/14red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%204/14black_part_2.png",
];
var ImgSource5 = [
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/10red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/10black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/10red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/10black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/11red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/11black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/11red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/11black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/14red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/14black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/14red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/14black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/16red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/16black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/16red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/16black_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/5red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/5black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/5red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/5black_part_2.png",
//  
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/6red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/6black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/6red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%205/6black_part_2.png",
];
var ImgSource6 = [
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/11red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/11black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/11red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/11black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/12red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/12black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/12red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/12black_part_2.png",
 
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/15red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/15black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/15red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/15black_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/3red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/3black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/3red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/3black_part_2.png",
 
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/4red_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/4black_part_1.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/4red_part_2.png",
  // "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/4black_part_2.png",
//  
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/7red_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/7black_part_1.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/7red_part_2.png",
  "https://raw.githubusercontent.com/argunaman2022/stereotypes-replication2/master/_static/pics/Math_memory_boxes/Box%206/7black_part_2.png",
];
function preload(srcs) {
    const imgs = [];
    for (const s of srcs) {
        const i = new Image();
        i.src = s;
        imgs.push(i);
    }
    return imgs;
}

// Combine all sources into one array and preload them
preload(
    ImgSource1.concat(
        ImgSource2,
        ImgSource3,
        ImgSource4,
        ImgSource5,
        ImgSource6
    )
);


function isImageMatch(imgSrc1, imgSrc2) {
  const baseName1 = imgSrc1.split('/').slice(-1)[0].split('_part')[0]; 
  const baseName2 = imgSrc2.split('/').slice(-1)[0].split('_part')[0]; 
  return baseName1 === baseName2; 
}


// Helper function to generate random numbers
function RandomFunction(MaxValue, MinValue) {
		return Math.round(Math.random() * (MaxValue - MinValue) + MinValue);
	}
	
// Function to shuffle card images
function ShuffleImages() {
	var ImgAll = $(Source).children();
	var ImgThis = $(Source + " div:first-child");
	var ImgArr = new Array();
  // Store image sources in the temporary array
	for (var i = 0; i < ImgAll.length; i++) {
		ImgArr[i] = $("#" + ImgThis.attr("id") + " img").attr("src");
		ImgThis = ImgThis.next(); // Move to the next card
	}
	
		ImgThis = $(Source + " div:first-child"); // Reset to the first card
  // Shuffle the image sources and reassign them to cards
	for (var z = 0; z < ImgAll.length; z++) {
	var RandomNumber = RandomFunction(0, ImgArr.length - 1);

		$("#" + ImgThis.attr("id") + " img").attr("src", ImgArr[RandomNumber]);
		ImgArr.splice(RandomNumber, 1); // Remove the used image source
		ImgThis = ImgThis.next(); // Move to the next card
	}
}


function image_source() {
  if (BoxesSolved == 0) {
    return ImgSource1;
  }
  if (BoxesSolved == 1) {
    return ImgSource2;
  }
  else if (BoxesSolved == 2) {
    return ImgSource3;
  }
  else if (BoxesSolved == 3) {
    return ImgSource4;
  }
  
  else if (BoxesSolved == 4) {
    return ImgSource5;
  }
  else if (BoxesSolved == 5) {
    return ImgSource6;
  }
  // else if (BoxesSolved == 6) {
  //   return ImgSource1}
  // else if (BoxesSolved == 7) {
  //   return ImgSource2}
  // else if (BoxesSolved == 8) {
  //   return ImgSource3}
  // else if (BoxesSolved == 9) {
  //   return ImgSource4}
  // else if (BoxesSolved == 10) {
  //   return ImgSource5}

  else {
    // break out of loop and display final message
    $("#transitionMessage").text("You completed all the boxes and finished this round before the timer ran out. You receive maximum points from this round! Congratulations!");
    $("#transitionMessage").show();
    return;
  }
}



function resetGame(){
  $(Source).empty();        // Remove existing cards
  ImgSource = image_source(); // Get the image source for the current box

  // Display transition message
  $("#transitionMessage").text("You completed this box. Displaying the next box...");
  $("#transitionMessage").show();

  setTimeout(function() {
    $("#transitionMessage").hide();
      // Regenerate grid using ImgSource2 

      for (var y = 1; y < 2 ; y++) {
        $.each(ImgSource, function(i, val) {
          $(Source).append("<div id=card" + y + i + "><img src=" + val + " />");
        });
      }
      $(Source + " div").click(OpenCard); 
      ShuffleImages(); // Shuffle the new images
    }
  , 1000); // 2-second delay before next box (i.e. before the new grid is displayed)
  }
  
  // Function to handle card clicks
function OpenCard() {
	var id = $(this).attr("id"); // Get the ID of the clicked card
  ImgSource = image_source(); // Get the image source for the current box

	if ($("#" + id + " img").is(":hidden")) {
		$(Source + " div").unbind("click", OpenCard); // Temporarily disable clicks
	
		$("#" + id + " img").slideDown('fast'); // Reveal the card

		if (ImgOpened == "") { // First card of a turn
      BoxOpened = id;
      ImgOpened = $("#" + id + " img").attr("src");
      setTimeout(function() {
        $(Source + " div").bind("click", OpenCard) // Re-enable clicks after delay
      }, 300);
    } else { 
      // Second card of a turn
      // Increment false attempts
      incrementAttempts();
      // Second card opened
      CurrentOpened = $("#" + id + " img").attr("src");

      if (isImageMatch(ImgOpened, CurrentOpened)) { // Cards match
        // Add shake effect before hiding
        // $("#" + id + " img").addClass("shake");
        // $("#" + BoxOpened + " img").addClass("shake");
      
        // Show both cards for 2 seconds, then hide them
        setTimeout(function() {
            // Remove shake effect and hide the cards
            $("#" + id + " img").removeClass("shake").parent().css("visibility", "hidden");
            $("#" + BoxOpened + " img").removeClass("shake").parent().css("visibility", "hidden");
      
            // Reset after hiding
            BoxOpened = "";
            ImgOpened = "";
        }, 400); // Delay hiding both cards by 2 seconds
      
        ImgFound++;
      }
      else{ // Cards don't match
        setTimeout(function() {
          $("#" + id + " img").slideUp('slow');
          $("#" + BoxOpened + " img").slideUp('slow');
          BoxOpened = "";
          ImgOpened = "";
        }, 400);
      } 

      setTimeout(function() {
        $(Source + " div").bind("click", OpenCard) // Re-enable clicks after delay
      }, 400);
    } 

    Counter++;
    $("#counter").html("" + Counter); 
    
    // get the num_images from the html and change its value to ImgFound
    document.getElementById(game_field_name).value = ImgFound;


    if (ImgFound == ImgSource.length*(BoxesSolved+1)/2) {
      if (BoxesSolved == Max_boxes-1) {
        $("#transitionMessage").text("You completed all the boxes and finished this round before the timer ran out! Congratulations!");
        $("#transitionMessage").show();
      }
      else {
        BoxesSolved++;
        resetGame(); 
      }
    }
    else {
    }
  }
}



$(function() {
  // Generate the card grid, y<2 no duplication
for (var y = 1; y < 2 ; y++) { 
  $.each(ImgSource1, function(i, val) {
    $(Source).append("<div id=card" + y + i + "><img src=" + val + " />");
  });
}
  $(Source + " div").click(OpenCard);
  ShuffleImages();
});