class LOGIN {
    constructor(){
        this.noAccount = document.querySelector(".toggle");
        this.login = document.querySelector(".login");
        this.signup = document.querySelector(".Admin_signup");
        this.backbtn = document.querySelector(".back");
        this.image= document.querySelector(".img");
        this.headImage = document.querySelector(".js_head");
        this.electiveImage = document.querySelector(".image");
        this.username = document.querySelector(".js_name_code");
        this.password = document.querySelector(".js_login_password");
        this.loginBtn = document.querySelector(".js_login_btn");

        this.init();
    }

    init(){
        this.noAccount.addEventListener("click", (event) => this.signuppage(event));
        this.backbtn.addEventListener("click", (event) => this.backtologin(event));
        this.login_btn.addEventListener("click", (event) => this.signupcheck(event));


    }

    signuppage(){
        this.signup.classList.remove("hidden");
        this.login.classList.add("hidden");
        this.image.classList.add("img-container");
        this.electiveImage.classList.add("hidden");
        this.headImage.classList.remove("hidden");

    }

    backtologin(){
        this.login.classList.remove("hidden");
        this.signup.classList.add("hidden");
        this.headImage.classList.add("hidden");
        this.image.classList.remove("img-container");
        this.electiveImage.classList.remove("hidden");
    }

}

new LOGIN();