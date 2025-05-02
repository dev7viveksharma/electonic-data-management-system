class LOGIN {
    constructor(){
        this.noAccount = document.querySelector(".toggle");
        this.login = document.querySelector(".login");
        this.signup = document.querySelector(".Admin_signup");
        this.image = document.querySelector(".img");
        this.headImage = document.querySelector(".js_head");
        this.electiveImage = document.querySelector(".image");
        this.username = document.querySelector(".js_name_code");
        this.password = document.querySelector(".js_login_password");
        this.loginBtn = document.querySelector(".js_login_btn");
        this.email = document.querySelector(".js_signup_email");
        this.init();
    }

    init(){
        this.noAccount.addEventListener("click", (event) => this.signuppage(event));
        this.loginBtn.addEventListener("click", (event) => this.signupcheck(event));
        
    }

    signuppage(){
        this.signup.classList.remove("hidden");
        this.login.classList.add("hidden");
        this.image.classList.add("img-container");
        this.electiveImage.classList.add("hidden");
        this.headImage.classList.remove("hidden");
    }

}

class SIGNUP{
    constructor(){
    this.login = document.querySelector(".login");
    this.signup = document.querySelector(".Admin_signup");
    this.backbtn = document.querySelector(".back");
    this.email = document.querySelector(".js_signup_email"); 
    this.image = document.querySelector(".img");
    this.headImage = document.querySelector(".js_head");
    this.electiveImage = document.querySelector(".image");
    this.mobileNum = document.querySelector(".js_signup_mobile")
    this.init()
    }
    init(){
        this.backbtn.addEventListener("click", (event) => this.backtologin(event));
        this.email.addEventListener("blur",(event) => this.checkemail(event));
    }

    backtologin(){
        this.login.classList.remove("hidden");
        this.signup.classList.add("hidden");
        this.headImage.classList.add("hidden");
        this.image.classList.remove("img-container");
        this.electiveImage.classList.remove("hidden");
    }


    checkemail(){
        const gmail = document.querySelector(".Email_Address");
        const existing = document.querySelector("#error");
        const signupbtn = document.querySelector(".js_signupbtn");
        if(existing){
            existing.remove();
        }
        const message = document.createElement("span");
        message.id = "error";
        message.style.color = "red";
        let condition = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.value);
            if(this.email.value === ""){
                message.remove();
            }else if(!(condition)){
                message.textContent = "Invalid Email Address";
                message.style.margin = "0";
                message.style.fontSize = "0.8rem";
                signupbtn.addEventListener("click",(event)=>{
                    event.preventDefault()
                    this.email.scrollIntoView({ behavior: "smooth", block: "center" });
                })

            }
        gmail.insertAdjacentElement("afterend", message);
    }
}

new LOGIN();
new SIGNUP();