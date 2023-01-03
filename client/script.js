
import bot from "./assets/bot.svg"
import user from "./assets/user.svg"

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element){
    element.textContent = "";
    loadInterval = setInterval(()=>{
        element.textContent += ".";
        if(element.textContent === "...."){
            element.textContent = ""
        }
    },300)
}

function typeText(element,text) {
    let index = 0 ;
    let interval =  setInterval(()=>{
        if(index < text.length){
            element.innerHTML += text.charAt(index);
            index++;
        }else{
            clearInterval(interval);
        }
    },200)                                                                                                                           
}

function generateUniqueId(){
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi,value,uniqueId){
    //template string to have possibility to insert variable
    return(`
        <div class="wrapper ${isAi && "ai"}" >
            <div class="chat">
                <div class="profile">
                        <img src="${isAi ? bot : user}"
                        alt=${isAi ? "bot" : "user"}
                        />
                </div>
                <div class="message" id=${uniqueId} >
                        ${value}
                </div>
            </div>
        </div>
    `);
}

 const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        //user's ChatStripe
        chatContainer.innerHTML += chatStripe(false,data.get("prompt"));
        /* Clear -> form data -> */form.reset();

        //bot's ChatStripe
        const uniqueId = generateUniqueId();
        chatContainer.innerHTML += chatStripe(true,"",uniqueId);
        
        chatContainer.scrollTo = chatContainer.scrollHeight;

        //apply ...
        const messageDiv = document.getElementById(`${uniqueId}`);
        //console.log(uniqueId)
        //console.log(messageDiv)
        loader(messageDiv);

        //fecth data from server -> bot's response
        const response = await fetch("http://localhost:4023",
        {
            method : "post",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                prompt : data.get("prompt")
            })
        });

        clearInterval(loadInterval);
        messageDiv.innerHTML = "";

        if(response.ok){
            const data = await response.json();
            const parsedData = data.bot.trim();

            typeText(messageDiv,parsedData);
        }else{
            const err = await response.text();
            messageDiv.innerHTML = "Something went wrong";

            alert(err);
        }
 }

 //call callback on submit
 form.addEventListener("submit",handleSubmit); 
 form.addEventListener("keyup",(e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }
 })