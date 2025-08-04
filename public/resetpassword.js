class Password{
    constructor(){
        this.sessionkey = sessionStorage.getItem("forgetpasswordToken");
        this.urlparams = new URLSearchParams(window.location.search);
        this.urltoken = this.urlparams.get("token");
        this.infotab = document.querySelector(".informationtab");
        this.resettab = document.querySelector(".ResetPage");
        this.firstemail = document.querySelector(".forgetpasswordemail");
        this.confirmemail = document.querySelector(".confirm");
        this.otpbtn = document.querySelector(".otpbtn");
        this.pop = document.querySelector(".Popups");
        this.timer = document.querySelector(".otptimertext");
        this.otpinput = document.querySelector(".otpinput");
        this.nextbtn = document.querySelector(".nextpagebtn1");
        this.password = document.querySelector(".newpassword");
        this.confirmpassword = document.querySelector(".Cnewpassword");
        this.confirmbtn = document.querySelector(".finishbtn");
        this.countdown = 300;
        this.init();
    }
    init(){
        if(this.sessionkey !== this.urltoken){
             alert("Access denied ❌");
            window.location.replace("edms.html");
        }

        this.firstemail.addEventListener("input",()=>{
            this.verifyemail();
        });
        this.otpbtn.addEventListener("click",()=>{
            this.sendotp();
        });

        this.otpinput.addEventListener("input",()=>{
            this.verifyotplength();
        });

        this.nextbtn.addEventListener("click",()=>{
            this.verifyotp();
        });

        this.password.addEventListener("input",()=>{
            this.password.type = "text";
            this.checkpassword()
        });
        this.password.addEventListener("blur",()=>{
            this.password.type = "password";
        });

        this.confirmpassword.addEventListener("input",()=>{
            this.confirmpassword.type = "text";
            this.checkpasswordifference();
        });

         this.confirmpassword.addEventListener("blur",()=>{
            this.confirmpassword.type = "password";
        });

        this.confirmbtn.addEventListener("click",()=>{
            this.insertNewpassword();
        })

    }

    verifyemail(){

        const error = document.querySelector("#errormessage");
        if(error) error.remove();
        const input = this.firstemail.value.trim();

        const isEmail = input.includes("@") && input.includes(".");
        const isPhone = /^\d{10}$/.test(input); // checks if it's exactly 10 digits

        if(isEmail || isPhone){
            this.otpbtn.disabled = false;
        }
    }

    verifyotplength(){
        const input = this.otpinput.value.trim();

        const isPhone = /^\d{6}$/.test(input); // checks if it's exactly 10 digits

        if(isPhone){
            this.nextbtn.disabled = false;
        }else{
            this.nextbtn.disabled = true;
        }
    }

    async sendotp(){
        try {
            const error = document.querySelector("#errormessage");
             if(error) error.remove();
            const url = `/sendEmail`;
            const response = await axios.get(url,{
                params : {identifier : this.firstemail.value}
            });

            if(response.data.success){
                this.nextbtn.disabled = false;
                this.timer.classList.remove("hidden");
                this.otpcountdown(this.countdown);
                this.sendedmail = response.data.email;
                this.pop.textContent = response.data.message;
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
            }
        } catch (error) {
            if(error.response){
                const data = error.response.data;
                const message = document.createElement("span");
                message.id = "errormessage"
                message.textContent = data.message;
                this.firstemail.insertAdjacentElement("afterend",message);
                this.nextbtn.disabled = true;
            }
        }
    }

    otpcountdown(duration){
        let time = duration;
        const countdown = setInterval(() => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        this.timer.textContent = `OTP expires in ${minutes}:${seconds}`;

        if (--time < 0) {
          clearInterval(countdown);
          this.timer.textContent = "⛔ OTP has expired!";
          // You can also disable input or resend button here
        }
      }, 1000);
    }

    async verifyotp(){
        try {       
            if(this.otpinput.value === ""){
                this.nextbtn.disabled = true;   
            }

            const url = `/verifyotp`;
            const response = await axios.get(url,{
                params : {
                    email : this.sendedmail,
                    otp : this.otpinput.value
                }
            });

            if(response.data.success){
                this.infotab.classList.add("switchpage");
                this.resettab.classList.remove("switchpage");
                this.confirmemail.value = response.data.email;
                this.backendmail = response.data.email;
                this.pop.textContent = response.data.message;
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
                this.checkemailinsertion();
            }
            
        } catch (error) {
             if(error.response){
                const data = error.response.data;
                const message = document.createElement("span");
                message.id = "errormessage"
                message.textContent = data.message;
                this.timer.insertAdjacentElement("beforeBegin",message);
            }
        }    
    }

    checkemailinsertion(){
        if(this.confirmemail.value !== this.backendmail){
            this.confirmbtn.disabled = true;
            this.password.disabled = true;
            this.confirmpassword.disabled = true;
        }
    }

        checkpassword(){
        const password = this.password.value;
        const conditions = [
            { test: /[A-Z]/.test(password), message: "atleast 1 Uppercase letter [A-Z]" },
            { test: /[a-z]/.test(password), message: "atleast 1 Lowercase letter [a-z]" },
            { test: /[0-9]/.test(password), message: "atleast 1 NUMBER [0-9]" },
            { test: /[!@#$%^&*?]/.test(password), message: "atleast 1 Special Character [!@#$%^&*?]" },
            { test: password.length >= 8, message: "atleast 8 character long" }
        ];
        const exist = document.querySelector("#passwordError");
        if (exist) {
            exist.remove();
        }
        const failed = conditions.find(condition =>!condition.test);
        const error = document.createElement("span");
        error.id = "passwordError";
        if(password === ""){
            error.remove();
        }else if (failed){
            error.textContent = failed.message;
            error.style.color = "red";
            error.style.margin = "0";
            error.style.fontSize = "0.8rem";
            this.password.insertAdjacentElement("afterend", error);
            this.confirmbtn.disabled = true;
            return; 
        }
        this.confirmbtn.disabled = false;
    }

    checkpasswordifference(){
        const real_password = this.password.value;
        const confirmpass = this.confirmpassword.value;
        const excist = document.querySelector("#Cpasserror");
        if(excist){
            excist.remove();
        }
        const message = document.createElement("span");
        message.id = "Cpasserror";

        if(this.confirmpassword.value === ""){
            message.remove();
        }else if(confirmpass !== real_password){
            message.textContent = "Entered Password Is Not Same";
            message.style.color = "red";
            message.style.fontSize = "0.8rem";
            message.style.margin = "0rem";
            this.confirmpassword.insertAdjacentElement("afterend",message);
            this.confirmbtn.disabled = true;
            return;
        }

        this.confirmbtn.disabled = false;
    }

    async insertNewpassword(){
        try {
            const url = `/insertnewpassword`;
            const response = await axios.post(url,{
                password : this.password.value,
                email : this.confirmemail.value,
            });

            if(response.data.success){
                this.timer.classList.add("hidden");
                this.otpinput.value = "";
                this.infotab.classList.remove("switchpage");
                this.resettab.classList.add("switchpage");
                this.pop.textContent = response.data.message;
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
                
            }
        } catch (error) {
             if(error.response){
                const data = error.response.data;
                const message = document.createElement("span");
                message.id = "errormessage"
                message.textContent = data.message;
                this.confirmbtn.insertAdjacentElement("beforeBegin",message);
            }
        }
    }

}

new Password();