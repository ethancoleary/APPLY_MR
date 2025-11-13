// Save users browser data
const browser = navigator.userAgent;
function saveBrowserData() {
    document.getElementById('id_browser').value = browser;
}


//  Blur data
function pageKey(n = 3) {
  const segments = window.location.pathname.split('/').filter(s => s);
  // e.g. ["p","4rwl1qr0","Introduction","Demographics","2"]
  return segments.slice(-n).join('/');
}



let blurDict = {};
document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('dictionary');
  blurDict = stored ? JSON.parse(stored) : {};
  // ensure at least an empty object
  localStorage.setItem('dictionary', JSON.stringify(blurDict));
});

document.addEventListener('DOMContentLoaded', function() {
    const key = pageKey(3);  // e.g. "Introduction/Demographics/2"

    let blur_data = localStorage.getItem('dictionary'); //retrieve 
    let myDictionary = JSON.parse(blur_data); // parse

    if (!myDictionary) { 
        // If it doesn't exist, create and save it
        // console.log('creating')
        myDictionary = {
            page: 0,
          };
          localStorage.setItem('dictionary', JSON.stringify(myDictionary));
        }
        
});


// Event listener for blur event
let warned = false;  
const threshold = 3 // Number of blurs before the user is warned
count=0
window.addEventListener('blur', function() {
    warned = document.getElementById('id_blur_warned').value === '1';
    // Code to save that the user clicked out of the window
    // console.log('blur event detected in page:')
    count ++
    // console.log(count)

    let blur_data = localStorage.getItem('dictionary'); //retrieve 
    let myDictionary = JSON.parse(blur_data); // parse

    // Check if the 'page' key exists in the dictionary
    const key = pageKey(3);  // "Introduction/Demographics/2"
    if (key in myDictionary) {
        myDictionary[key]++;
    } else {
        myDictionary[key] = 1;
    }

    // Save the updated dictionary back to localStorage
    localStorage.setItem('dictionary', JSON.stringify(myDictionary));

    // Use the updated dictionary as needed
    // console.log(myDictionary);

    document.getElementById('id_blur_log').value = JSON.stringify(myDictionary);
    document.getElementById('id_blur_count').value = JSON.stringify(count);
       

      if (!warned && count >= threshold) {
        warned = true; 
        // set the hidden field so server sees it
        document.getElementById('id_blur_warned').value = '1';

        // show a simple popup (you could swap in your Bootstrap modal)
        alert(
          "We noticed you switched tabs or windows. Please stay on our experiment page " +
          "to ensure your data is recorded correctly. Otherwise, we may not be able to pay you any potential bonus payments you may earn."
        );
      }

});

