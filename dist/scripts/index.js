var socket = io();

const signUpForm = document.querySelector("#login");
const signUpSection = document.querySelector(".login-screen");
const signUpName = document.querySelector("#player");
const signUpColor = document.querySelector("#color");

signUpForm.addEventListener("submit", e => {
  e.preventDefault();
  const value = signUpName.value;
  socket.emit("new player", {
    name: value,
    id: generateUUID(),
    color: signUpColor.value
  });
  socket.on("new player", () => (signUpSection.style.display = "none"));
});

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
};
document.addEventListener("keydown", function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener("keyup", function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

document.addEventListener("mouseDown", () => {
  socket.on("ballFired", (ball, players) => {
    console.log(players, ball);
  });
});

setInterval(function() {
  socket.emit("movement", movement, getBounding().width, getBounding().height);
}, 1000 / 60);

var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext("2d");

function getBounding() {
  const size = canvas.getBoundingClientRect();
  return size;
}

socket.on("collision", players => {
  let users = [];
  for (let id in players) {
    const player = players[id];
    users.push(player);
  }
  var previous_value = null;
  for (var i = 0; i < users.length; i++) {
    var current_value = users[i];
    if (i > 0) {
      if (
        current_value.x === previous_value.x &&
        current_value.y === previous_value.y
      ) {
        console.log(current_value, previous_value);
        console.log("you won!");
      }
    }
    previous_value = current_value;
  }
});

socket.on("state", players => {
  context.clearRect(0, 0, 800, 600);

  for (let id in players) {
    const player = players[id];
    context.fillStyle = player.playerColor;
    context.beginPath();
    context.arc(player.x, player.y, 20, 0, 2 * Math.PI);
    context.fill();
  }
});

console.log("test");

// socket.on("message", msg => {
//   const messages = document.querySelector("#messages");
//   messages.innerHTML += `<li>${msg}</li>`;
// });

// (() => {
//   const form = document.querySelector("#form");
//   const message = document.querySelector("#message");
//   if (form) {
//     form.addEventListener("submit", e => {
//       e.preventDefault();
//       console.log("komt er in");
//       socket.emit("message", message.value);
//       message.value = "";
//       return false;
//     });
//   }
// })();
