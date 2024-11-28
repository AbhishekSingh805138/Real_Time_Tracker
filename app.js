const express = require('express');
const app = express();
require('dotenv').config();
const http=require("http");// written for socket.io
const path = require('path');

const socketio=require("socket.io");
const server = http.createServer(app);
const io =socketio(server);// io varaible socket io server hai

//Varaible PORT DEFINED
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static(path.join(__dirname, 'public')));


io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data});
    });
   
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id);
    }); 
});

app.get("/",function(req,res){
    res.render("index");
});

server.listen(PORT,()=>{
    console.log("listening on port ");//isse pta chalega server jinda hai
})