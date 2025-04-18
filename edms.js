class LOGIN{
    constructor(){
        this.noAccount = document.querySelector(".toggle");
        this.login = document.querySelector(".l_main");
        this.signup = document.querySelector(".signup_screen");
        this.backbtn = document.querySelector(".js_back");
        this.body = document.querySelector("body");
        this.login_btn = document.querySelector(".js_login_btn");
        this.login_username = document.querySelector(".js_login_name");
        this.login_password = document.querySelector(".js_login_password");
        this.login_emp = document.querySelector(".js_emp_code");

        this.init();
    }

    init(){
        this.noAccount.addEventListener("click",(event)=>this.signuppage(event));
        this.backbtn.addEventListener("click",(event)=>this.backtologin(event));
        this.login_btn.addEventListener("click",(event)=>this.signupcheck(event));
    }

    signuppage(){
        this.login.classList.add("hidden");
        this.signup.classList.remove("hidden");
        this.body.classList.add("body_s");
    }

    backtologin(){
        this.signup.classList.add("hidden");
        this.login.classList.remove("hidden");
        this.body.classList.remove("body_s");
    }

    signupcheck(event){
        event.preventDefault();
        if(this.login_username.value.trim() === "" && this.login_password.value === "" && this.login_emp.value === ""){
            this.errorlogin("Please Enter Valid Details");

        }
    }

    errorlogin(message){
        const exist = document.querySelector("#loginError");
        if(exist){
            return;
        }
        const error = document.createElement("p");
        error.id = "loginError";
        error.textContent = message;
        error.style.color = "red";
        error.style.margin = "0";
        error.style.marginTop = "10px";

        this.login_password.insertAdjacentElement("afterend", error);
      }
}

new LOGIN();