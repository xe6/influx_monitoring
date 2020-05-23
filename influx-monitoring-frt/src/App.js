import React from "react";
import openSocket from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3030";

function App() {
    const socket = openSocket(ENDPOINT, { transports: ["websocket"] });
    socket.connect();

    console.log("This is actually happening.");

    setInterval(
        () =>
            socket.emit("onsite", {
                website: "ezic.io",
                url: window.location.href,
            }),
        5000
    );

    return <h1>WS</h1>;
}

export default App;
