function open_modal(index, keepTrack = false) {
  // console.log("open_modal", index);
  var modal = document.getElementById("myModal" + index);
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function span_click(index, stopHiding=false) {
  document.getElementById("myModal" + index).style.display = "none";
  if (stopHiding) {
     var hiddenDiv = document.getElementById('NextButton');
    hiddenDiv.style.display = 'inline';  
  }
}

// For redirecting to the completion page
function Completion_button(href) {
  window.open(href, "_blank");
}

function Information_viewed() {
  document.getElementById('id_Choice_stage_2_read_info').value = 1;
}
