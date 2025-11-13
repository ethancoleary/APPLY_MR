
function sliderChange(dimension){  
    val = dimension.value;
    const labels = dimension.parentElement.querySelector(".slider-range-labels").querySelectorAll(".label");
    // get the formfield and set its value to the slider value
    field1_name = 'id_' + 'Attribution'
    var field1 = document.getElementById(field1_name);
    field1.value = val;

    field2_name = field1_name + '_list'
    var field2 = document.getElementById(field2_name);
    field2.value = field2.value + val + ',';

    // Determine the position of the slider value
    const sliderValue = parseFloat(val);
    const thresholds = [1.3, 2.8, 4.3, 5.5, 7]; // Adjust these thresholds as needed
  
      // Remove the "bold-label" class from all labels
    //   labels.forEach((label) => label.classList.remove("bold-label"));
  
    // //   Check which label's threshold the slider value falls under and add the "bold-label" class accordingly
    //   for (let i = 0; i < thresholds.length; i++) {
    //       if (sliderValue <= thresholds[i]) {
    //           labels[i].classList.add("bold-label");
    //           break;
    //       }
    //   }
  }


  function sliderChange2(dimension, field1_name){  
    val = dimension.value;
    const labels = dimension.parentElement.querySelector(".slider-range-labels").querySelectorAll(".label");
    // get the formfield and set its value to the slider value
    field1_name = 'id_' + field1_name
    var field1 = document.getElementById(field1_name);
    field1.value = val;

    // Determine the position of the slider value
    const sliderValue = parseFloat(val);
    const thresholds = [0, 1, 2, 3,4,5,6,]; // Adjust these thresholds as needed
      // Remove the "bold-label" class from all labels
      labels.forEach((label) => label.classList.remove("bold-label"));
  
      // Check which label's threshold the slider value falls under and add the "bold-label" class accordingly
      for (let i = 0; i < thresholds.length; i++) {
          if (sliderValue <= thresholds[i]) {
              labels[i].classList.add("bold-label");
            //   console.log(thresholds[i])
              break;
          }
      }
  }

function move_to_alert(targetDiv){
    targetDiv.style.display = "flex";
    // calculate its position and scroll to this alert
    var windowHeight = window.innerHeight;
    var divHeight = targetDiv.clientHeight;
    var divTopOffset = targetDiv.getBoundingClientRect().top;
    var scrollPosition = divTopOffset - (windowHeight - divHeight) / 2;

    window.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
    });
    // Apply a shake animation class
    targetDiv.classList.add("shake");

    // Wait for a moment, then remove the shake class
    setTimeout(function () {
        targetDiv.classList.remove("shake");
    }, 500); // Adjust the time (in milliseconds) for the duration of the shake effect
}

function next_button(check_slider=false, id='Attribution'){
    
    field1_name = 'id_' + id
    var field1 = document.getElementById(field1_name).value;
    if (check_slider){
    if (field1==''){
    var targetDiv = document.getElementById("alert-move-sliders");
    move_to_alert(targetDiv)
    }
    else{
    document.getElementById("submit_button").click();
    }
}
}

function next_button_comprehension(){
    field1_name = 'id_Comprehension_password'
    var field1 = document.getElementById(field1_name).value;
    if (field1!='MARGUN'){
    var targetDiv = document.getElementById("alert-move-sliders");
    move_to_alert(targetDiv)
    }
    else{
    document.getElementById("submit_button").click();
    }
}

