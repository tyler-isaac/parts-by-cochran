$(function(){
    $("#alert").load("./Alert/alert.html"); 
  });

  function navHamburger() {
    var x = document.getElementById("myAlert");
    if (x.className === "alert") {
      x.className += " responsive";
    } else {
      x.className = "alert";
    }
  }