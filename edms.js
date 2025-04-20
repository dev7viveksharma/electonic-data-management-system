class LOGIN {
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
        this.noAccount.addEventListener("click", (event) => this.signuppage(event));
        this.backbtn.addEventListener("click", (event) => this.backtologin(event));
        this.login_btn.addEventListener("click", (event) => this.signupcheck(event));

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
        if (this.login_username.value.trim() === "" && this.login_password.value === "" && this.login_emp.value === "") {
            this.errorlogin("Please Enter Valid Details");
        } else if (this.login_username.value.trim() === "" && this.login_password.value !== "" && this.login_emp.value !== "") {
            this.errorusername("please enter your name");
        } else if (this.login_username.value !== "" && this.login_password.value === "" && this.login_emp.value !== "") {
            this.errorpassword("please enter your correct password");
        } else if (this.login_username.value !== "" && this.login_password.value !== "" && this.login_emp.value === "") {
            this.erroremp("please enter your valid employee code");        
        } else {
            if (this.login_password !== "") {
                this.validpassword(this.login_password);
            }
            if(this.login_emp !== ""){
                this.validcode(this.login_emp);
            }
        }
    }

    errorlogin(message){
        const exist = document.querySelector("#loginError");
        if (exist) {
            exist.remove();
        }
        const error = document.createElement("p");
        error.id = "loginError";
        error.textContent = message;
        error.style.color = "red";
        error.style.margin = "0";
        error.style.marginTop = "5px";
        error.style.fontSize = "0.8rem";

        this.login_password.insertAdjacentElement("afterend", error);
    }

    errorusername(message){
        const exist = document.querySelector("#loginError");
        if (exist) {
            exist.remove();
        }
        const error = document.createElement("p");
        error.id = "loginError";
        error.textContent = message;
        error.style.color = "red";
        error.style.margin = "0";
        error.style.marginTop = "5px";
        error.style.fontSize = "0.8rem";

        this.login_password.insertAdjacentElement("afterend", error);
    }

    errorpassword(message){
        const exist = document.querySelector("#loginError");
        if (exist) {
            exist.remove();
        }
        const error = document.createElement("p");
        error.id = "loginError";
        error.textContent = message;
        error.style.color = "red";
        error.style.margin = "0";
        error.style.marginTop = "5px";
        error.style.fontSize = "0.8rem";

        this.login_password.insertAdjacentElement("afterend", error);
    }

    erroremp(message){
        const exist = document.querySelector("#loginError");
        if (exist) {
            exist.remove();
        }
        const error = document.createElement("p");
        error.id = "loginError";
        error.textContent = message;
        error.style.color = "red";
        error.style.margin = "0";
        error.style.marginTop = "5px";
        error.style.fontSize = "0.8rem";

        this.login_emp.insertAdjacentElement("afterend", error);
    }

    validpassword(login_password){
        const password = login_password.value;
        const conditions = [
            { test: password.length >= 8, message: "atleast 8 character long" },
            { test: /[A-Z]/.test(password), message: "atleast 1 Uppercase letter [A-Z]" },
            { test: /[a-z]/.test(password), message: "atleast 1 Lowercase letter [a-z]" },
            { test: /[0-9]/.test(password), message: "atleast 1 NUMBER [0-9]" },
            { test: /[!@#$%^&*?]/.test(password), message: "atleast 1 Special Character [!@#$%^&*?]" }
        ];

        conditions.forEach(conditions => {
            if (!conditions.test) {
                const exist = document.querySelector("#loginError");
                if (exist) {
                    exist.remove();
                }
                const error = document.createElement("p");
                error.id = "loginError";
                error.textContent = conditions.message;
                error.style.color = "red";
                error.style.margin = "0";
                error.style.marginTop = "5px";
                error.style.fontSize = "0.8rem";

                this.login_password.insertAdjacentElement("afterend", error);
            }
        });
    }

    validcode(code){
        const empcode = code.value;
        if(empcode.length !== 6){
            const exist = document.querySelector("#loginError");
            if (exist) {
                exist.remove();
            }
            const error = document.createElement("p");
            error.id = "loginError";
            error.textContent = "employee code is not 6 digit long";
            error.style.color = "red";
            error.style.margin = "0";
            error.style.marginTop = "5px";
            error.style.fontSize = "0.8rem";

            this.login_emp.insertAdjacentElement("afterend", error);
        } 
    }
}

class SIGNUP{
    constructor(){
        this.firstName = document.querySelector(".js_signup_first_name");
        this.lastName = document.querySelector(".js_signup_last_name");
        this.signupPassword = document.querySelector(".js_password");
        this.signupCpassword = document.querySelector(".js_c_password");
        this.signupBtn = document.querySelector(".signup_btn");
        this.eye = document.querySelectorAll(".toggle-eye");


        this.init();
    }

    init(){
        this.eye.forEach(eye =>{
            eye.addEventListener("click",()=>this.togglepassword(eye));
        });

        this.signupPassword.addEventListener("input",(event)=>this.validateSignupPassword(event));
        
    }

    togglepassword(icon){
        const input = icon.closest("span").previousElementSibling;
        if(input.type === "password"){
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }

    validateSignupPassword() {
        let input = this.signupPassword.value;
        const conditions = [
            { test: input.length >= 8, message: "at least 8 characters long" },
            { test: /[A-Z]/.test(input), message: "at least 1 uppercase letter [A-Z]" },
            { test: /[a-z]/.test(input), message: "at least 1 lowercase letter [a-z]" },
            { test: /[0-9]/.test(input), message: "at least 1 number [0-9]" },
            { test: /[!@#$%^&*?]/.test(input), message: "at least 1 special character [!@#$%^&*?]" }
        ];
    
        const existingError = document.querySelector("#signupError");
        if (existingError) existingError.remove(); // Remove old error before adding a new one
    
        // No need to show any error if the input is empty when the user leaves the field
        if (input === "") {
            return;
        }

        const container = document.querySelector(".errorp")
        const failedCondition = conditions.find(cond => !cond.test);
        if (failedCondition,container) {
            // If there's a failed condition, display the error message
            const error = document.createElement("p");
            error.id = "signupError";
            error.textContent = failedCondition.message;
            error.style.color = "red";
            error.style.margin = "0";
            error.style.fontSize = "0.8rem";
            container.insertAdjacentElement("afterend", error);
        }
        
        this.signupPassword.addEventListener("blur",() => {
        const existingError = document.querySelector("#signupError");
        if (existingError) existingError.remove();  // Remove error message when input loses focus
       });
    }    
}

new LOGIN();
new SIGNUP();
