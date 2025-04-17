class LOGIN{
    constructor(){
        this.noAccount = document.querySelector(".toggle");
        this.login = document.querySelector(".l_main");
        this.signup = document.querySelector(".signup_screen");
        this.backbtn = document.querySelector(".js_back");
        this.init();
    }

    init(){
        this.noAccount.addEventListener("click",(event)=>this.signuppage(event));
        this.backbtn.addEventListener("click",(event)=>this.backtologin(event));
    }

    signuppage(event){
        this.login.classList.add("hidden");
        this.signup.classList.remove("hidden");
    }

    backtologin(event){
        this.signup.classList.add("hidden");
        this.login.classList.remove("hidden");
    }
}

new LOGIN();