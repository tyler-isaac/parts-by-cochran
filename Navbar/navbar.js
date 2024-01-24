  $(function(){
    $("#navbar").load("./Navbar/navbar.html"); 
  });

  function navHamburger() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }