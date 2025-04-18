class LOGIN{
    constructor(){
        this.noAccount = document.querySelector(".toggle");
        this.login = document.querySelector(".l_main");
        this.signup = document.querySelector(".signup_screen");
        this.backbtn = document.querySelector(".js_back");
        this.body = document.querySelector("body");
        this.init();
    }

    init(){
        this.noAccount.addEventListener("click",(event)=>this.signuppage(event));
        this.backbtn.addEventListener("click",(event)=>this.backtologin(event));
    }

    signuppage(event){
        this.login.classList.add("hidden");
        this.signup.classList.remove("hidden");
        this.body.classList.add("body_s");
    }

    backtologin(event){
        this.signup.classList.add("hidden");
        this.login.classList.remove("hidden");
        this.body.classList.remove("body_s");
    }
}

new LOGIN();