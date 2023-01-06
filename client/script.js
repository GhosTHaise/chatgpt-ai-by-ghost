
import bot from "./assets/bot.svg"
import user from "./assets/user.svg"
import copy from "./assets/copy.svg"

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;
const copy_to_clipboard = (text) => {
    navigator.clipboard.writeText(text).then(()=>{
        alert("copy")
    }).catch((err)=> {
        alert(err)
    })
}
function loader(element){
    element.textContent = "";
    loadInterval = setInterval(()=>{
        element.textContent += ".";
        if(element.textContent === "...."){
            element.textContent = ""
        }
    },300);
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
    },20);                                                                                                                           
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
                <div ${!isAi && 'style="white-space: normal"'} class="message" id=${uniqueId} >
                        ${value}
                </div>
            </div>
        </div>
    `);
}
/** 
 * @param {string} id Id of the new Element 
 * @param {string} text this represent to text add to the clipboard
*/
 const add_new_copy = (id,text,before_div) => {
    const new_div = document.createElement("div")
    //copy_container
    new_div.id= id;
    new_div.className = "copy_container";
    //copy_img
    const new_img = document.createElement("img");
    new_img.src = copy;
    new_img.title="copy"
    new_img.className="copy_img"
    //append those element
    new_div.appendChild(new_img);
    //eventListener
    new_div.addEventListener("click",()=>{
            navigator.clipboard.writeText(text).then(() => {
                alert("copied")
            }).catch((err) => {
                console.log(err)
            });
        });
    before_div.parentNode.insertBefore(new_div,before_div);    
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
        
        chatContainer.scrollTop = chatContainer.scrollHeight;

        //apply ...
        const messageDiv = document.getElementById(`${uniqueId}`);
        //console.log(uniqueId)
        //console.log(messageDiv)
        loader(messageDiv);

        //fecth data from server -> bot's response
        const response = await fetch("https://ghost-chatgpt.onrender.com",
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
            const copy_id = generateUniqueId();

            typeText(messageDiv,parsedData);
            add_new_copy(copy_id,parsedData,messageDiv);
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