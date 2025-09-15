const socket = io();

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatMessages = document.getElementById("chatMessages");

const videoContainer = document.getElementById("videoContainer");
const twitchContainer = document.getElementById("twitchContainer");
const privateBtn = document.getElementById("privateBtn");
const publicBtn = document.getElementById("publicBtn");
const endBtn = document.getElementById("endBtn");

// --- WebRTC Init ---
async function initPrivateCall() {
  localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    localVideo.srcObject = localStream;

      peerConnection = new RTCPeerConnection(config);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

          peerConnection.ontrack = e => remoteVideo.srcObject = e.streams[0];
            peerConnection.onicecandidate = e => {
                if (e.candidate) socket.emit("candidate", e.candidate);
                  };

                    const offer = await peerConnection.createOffer();
                      await peerConnection.setLocalDescription(offer);
                        socket.emit("offer", offer);
                        }

                        socket.on("offer", async offer => {
                          if (!peerConnection) await initPrivateCall();
                            await peerConnection.setRemoteDescription(offer);
                              const answer = await peerConnection.createAnswer();
                                await peerConnection.setLocalDescription(answer);
                                  socket.emit("answer", answer);
                                  });

                                  socket.on("answer", async answer => {
                                    await peerConnection.setRemoteDescription(answer);
                                    });

                                    socket.on("candidate", async candidate => {
                                      try { await peerConnection.addIceCandidate(candidate); } catch (e) { console.error(e); }
                                      });

                                      // --- Chat ---
                                      sendBtn.addEventListener("click", () => {
                                        const message = chatInput.value.trim();
                                          if (!message) return;
                                            addMessage("Вы", message);
                                              socket.emit("chat-message", message);
                                                chatInput.value = "";
                                                });
                                                socket.on("chat-message", msg => addMessage("Собеседник", msg));

                                                function addMessage(name, text) {
                                                  const div = document.createElement("div");
                                                    div.textContent = `${name}: ${text}`;
                                                      chatMessages.appendChild(div);
                                                        chatMessages.scrollTop = chatMessages.scrollHeight;
                                                        }

                                                        // --- Lesson Modes ---
                                                        privateBtn.addEventListener("click", () => {
                                                          videoContainer.style.display = "flex";
                                                            twitchContainer.style.display = "none";
                                                              initPrivateCall();
                                                                socket.emit("lesson-mode", "private");
                                                                });

                                                                publicBtn.addEventListener("click", () => {
                                                                  videoContainer.style.display = "none";
                                                                    twitchContainer.style.display = "block";
                                                                      socket.emit("lesson-mode", "public");
                                                                      });

                                                                      endBtn.addEventListener("click", () => {
                                                                        videoContainer.style.display = "none";
                                                                          twitchContainer.style.display = "none";
                                                                            socket.emit("lesson-mode", "ended");
                                                                            });

                                                                            socket.on("lesson-mode", (mode) => {
                                                                              if (mode === "private") {
                                                                                  videoContainer.style.display = "flex";
                                                                                      twitchContainer.style.display = "none";
                                                                                        } else if (mode === "public") {
                                                                                            videoContainer.style.display = "none";
                                                                                                twitchContainer.style.display = "block";
                                                                                                  } else {
                                                                                                      videoContainer.style.display = "none";
                                                                                                          twitchContainer.style.display = "none";
                                                                                                            }
                                                                                                            });