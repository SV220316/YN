var Usrname, EEK, STATE;

function onld(){
    var user = "Developers";
    var EEKey = 'Secret';
    var STS = "GOOD";
    if (window.location.hash.startsWith("#?")) {
        const hashParams = new URLSearchParams(window.location.hash.substring(2)); // Remove "#?"
        user = hashParams.get("user") || user;
        EEKey = hashParams.get("i") || EEKey;
        if(EEKey != "gY7KqA9mVzX2NpLwRj6fMZT8b1cQWdF3oU5sJ4DYxBHPnkGvlC0EhtSr9aO"){
            var STS = "INVALID PRODUCT!";

        }
    } 
    else if (window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        user = searchParams.get("user") || user;
        EEKey = searchParams.get("i") || EEKey;
        if(EEKey != "gY7KqA9mVzX2NpLwRj6fMZT8b1cQWdF3oU5sJ4DYxBHPnkGvlC0EhtSr9aO"){
            var STS = "INVALID PRODUCT!";
        }
    }
    Usrname = user;
    EEK = EEKey;
    STATE = STS
    console.log(user, EEK, STATE);
    document.getElementById("overlay").innerText = "Hello " + user + "! I'm Yuna. What's on your mind today Sweetie?";
}

var apiKey = 'AIzaSyBIS3JuuhTFQwwrqu98J4t59j9FQnTiTQ0';
var xhr = new XMLHttpRequest();

function Send(){
    xhr.open("POST", "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    var overlay = document.getElementById("overlay");
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.5s ease-out";

    var userMessage = document.getElementById("user_input").value;
    var chatBox = document.getElementById("conversation");
    if (!userMessage) return;

    chatBox.innerHTML += "<div class='message user'>" + userMessage + "</div>";
    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById("user_input").value = "";

    var requestData = {
        "contents": [{ "role": "user", "parts": [{ "text": userMessage }] }],
        "systemInstruction": { "role": "user", "parts": [{ "text": sys_instruct + "Your user is" + Usrname + "." + "STATE:" + STATE}] },
        "generationConfig": { "temperature": 1, "topK": 40, "topP": 0.95, "maxOutputTokens": 8192 }
    };
    
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            var data = JSON.parse(xhr.responseText);
                var assistantMessage = "Sorry, An error occurred";
                if (data.candidates && data.candidates.length > 0 &&
                    data.candidates[0].content && data.candidates[0].content.parts &&
                    data.candidates[0].content.parts.length > 0) {
                    assistantMessage = data.candidates[0].content.parts[0].text;
                }
                chatBox.innerHTML += "<div class='message bot'>" + assistantMessage + "</div>";
        }
    };
    chatBox.scrollTop = chatBox.scrollHeight;
    xhr.send(JSON.stringify(requestData));
}