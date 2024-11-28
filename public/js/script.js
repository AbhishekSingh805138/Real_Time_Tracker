const socket =io ();// socket io initialize iske karan connection request backend pr jata hai

if (navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
        const{latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});//frontend se ek emit triggger
    },
    (error)=>{
        console.error(error);// agr koi error aaya watch location me toh print hoga
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0//banada cahe nhin krega koi saved data nhi turant turant data aayega
    }

    );

    
}

const map=L.map("map").setView([0,0],16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">IndiaMap</a> contributors'
}).addTo(map);

const markers={};
socket.on("receive-location",(data)=>{
    const {id ,latitude,longitude}=data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) { // Check if a marker exists for the user ID
        map.removeLayer(markers[id]); // Remove the marker from the map
        delete markers[id]; // Delete the marker reference from the `markers` object
    }
});
