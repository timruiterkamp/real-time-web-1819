var socket = io();

socket.on("searchTweets", msg => {
  console.log(msg);
  const messages = document.querySelector("#tweets");
  messages.innerHTML += `<li>${msg.text} from ${
    msg.user ? msg.user.location : ""
  }</li>`;
});
