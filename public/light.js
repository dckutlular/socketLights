// var socket = io.connect("http://localhost:4000");
var socket = io.connect("https://lightmeupeae.herokuapp.com/");
const btn_openAll = document.getElementById("openAll");
const btn_closeAll = document.getElementById("closeAll");
const lampcount = document.getElementsByClassName("lamp");

document.querySelectorAll(".lamp").forEach(function(el) {
  el.addEventListener("click", function() {
    socket.emit("light", { id: this.id });
  });
});

btn_openAll.addEventListener("click", function() {
  socket.emit("openall", { command: "openall" });
});
btn_closeAll.addEventListener("click", function() {
  socket.emit("closeall", { command: "closeall" });
});

//listen for events
socket.on("light", function(data) {
  if (document.getElementById(data.id).style.backgroundColor == "yellow") {
    document.getElementById(data.id).style.backgroundColor = "black";
  } else {
    document.getElementById(data.id).style.backgroundColor = "yellow";
  }
});

socket.on("initialInfo", function(data) {
  data.forEach(function(element) {
    if (element.is_lightening == true)
      document.getElementById(element.id).style.backgroundColor = "yellow";
    else {
      document.getElementById(element.id).style.backgroundColor = "black";
    }
  });
});

socket.on("openall", function(data) {
  for (var i = 1; i <= lampcount.length; i++) {
    document.getElementById(i).style.backgroundColor = "yellow";
  }
});

socket.on("closeall", function(data) {
  for (var i = 1; i <= lampcount.length; i++) {
    document.getElementById(i).style.backgroundColor = "black";
  }
});
