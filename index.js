const express = require("express");
var socket = require("socket.io");
const mongoose = require("mongoose");
const lamp = require("./models/lamp_model");

const app = express();
const port = process.env.PORT || 4000;

var server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

//static files
app.use(express.static("public"));

mongoose.connect(
  "mongodb://test:test321@ds155294.mlab.com:55294/lightdb",
  err => console.log(err ? err : "Mongo connected.")
);

//socket setup
var io = socket(server);

io.on("connection", function(socket) {
  //connection her açıldığında db'den çek.
  lamp.find().exec(function(err, results) {
    if (err) throw err;
    //client ilk açıldığında db'nin son haline göre yanık! gelsin.
    io.sockets.emit("initialInfo", results);
  });

  console.log("soket başladı", socket.id);

  // clienttan her geldiğinde
  socket.on("light", function(data) {
    //önce git db'de true mu false mu bak.
    lamp
      .find({ id: data.id })
      .exec()
      .then(function(result) {
        //sonra db'deki is_lightening değerinin negatifini yaz.
        lamp.findOneAndUpdate(
          { id: data.id },
          { is_lightening: !result[0].is_lightening }, //findOne olduğu için ve id unique olduğu için kesin [{}] şeklinde tek kayıt dönecek. [0] kullanmamızda sakınca yok.
          (err, doc, res) => {
            console.log("update etti.");
            console.log(doc);
            //tüm clientlara dağıt
            io.sockets.emit("light", data);
          }
        );
      });
  });

  //open all
  socket.on("openall", function(data) {
    lamp.updateMany({}, { is_lightening: true }, (err, doc, res) => {
      console.log("tümünü update(true) etti.");
      if (err) throw err;
      console.log(doc);
      io.sockets.emit("openall", data);
    });
  });

  //close all
  socket.on("closeall", function(data) {
    lamp.updateMany({}, { is_lightening: false }, (err, doc, res) => {
      console.log("tümünü update(false) etti.");
      if (err) throw err;
      console.log(doc);
      io.sockets.emit("closeall", data);
    });
  });
});
