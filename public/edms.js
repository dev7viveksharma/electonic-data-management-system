class ADMINLOGIN{
    constructor(){
        this.adminbtn = document.querySelector(".dmLoginbtn");
        this.backbtn = document.querySelector(".dmbackbtn");
        this.identifyinginput = document.querySelector(".js_dm_num_email");
        this.dmPassword = document.querySelector(".js_Dm_Password");
        this.dmloginbtn = document.querySelector(".js_dm_Login_Btn");
        this.init();
    }

    init(){
        this.adminbtn.addEventListener("click",()=>this.showadminLogin());
        this.backbtn.addEventListener("click",()=>this.showadminLogin());
        this.dmloginbtn.addEventListener("click",(event)=>this.dmLogin(event));
    }

    showadminLogin(){
        const imagecontainer = document.querySelector(".img");
        const innerimg = document.querySelector(".image");
        imagecontainer.classList.toggle("imgtransition");
        innerimg.classList.toggle("remborder");
    }

    async dmLogin(event){
            event.preventDefault();
            const error = document.querySelector("#dmerror");
            if(error){
                error.remove();
            }
            const inputs = [{id : this.identifyinginput.value , err:"please enter mobile number or email"} 
                        ,{id : this.dmPassword.value  , err :"password field is empty"}];
            const container = document.querySelector(".dmpassword");
            const message = document.createElement("span");
            message.id = "dmerror";
            message.style.color = "red";
            message.style.margin = "0";
            message.style.fontSize = "0.8rem";

            for(const data of inputs){
                if(data.id === ""){
                    message.textContent = data.err;
                }
            }

            if(this.identifyinginput.value === "" && this.dmPassword.value === ""){
                message.textContent = "All fields are Emplty , Please Enter your details"
            }else{
                try {
                    const url = `http://localhost:8080/Dmlogin`;

                    const response = await axios.post(url,{
                        identifier : this.identifyinginput.value,
                        password : this.dmPassword.value
                    });

                    const data = await response.data;
                    if(data.success){
                        localStorage.setItem("dmId", data.Id); 
                        localStorage.setItem("dmname", data.Name);
                        localStorage.setItem("District",data.District); 
                        window.location.href = "CollectorDashboard.html";
                    }else {
                        message.textContent = data.message || "Login failed";
                        container.insertAdjacentElement("afterend", message);
                    }
                } catch (error) {
                    if (error.response && error.response.data && error.response.data.message) {
                        message.textContent = error.response.data.message;
                    } else {
                        message.textContent = "An unexpected error occurred. Please try again.";
                    }
                    container.insertAdjacentElement("afterend", message);
                }
            }
            
            container.insertAdjacentElement("afterend",message);
        }

}


class LOGIN {
    constructor(){
        this.noAccount = document.querySelector(".toggle");
        this.login = document.querySelector(".login");
        this.signup = document.querySelector(".Admin_signup");
        this.image = document.querySelector(".img");
        this.headImage = document.querySelector(".js_head");
        this.electiveImage = document.querySelector(".image");
        this.gmailornumber = document.querySelector(".js_name_code");
        this.password = document.querySelector(".js_login_password");
        this.loginBtn = document.querySelector(".js_login_btn");
        this.email = document.querySelector(".js_signup_email");
        this.pop = document.querySelector(".Popups .popMessage");
        this.popupbody = document.querySelector(".Popups");
        this.forgetpassword = document.querySelector(".forgetpasswordlink");
        this.init();
    }

    init(){
        this.noAccount.addEventListener("click", (event) => this.signuppage(event));
        this.loginBtn.addEventListener("click", async (event) => this.signupcheck(event));
        this.forgetpassword.addEventListener("click",()=>this.openresetpasswordpage()); 
    }

    signuppage(){
        this.signup.classList.remove("hidden");
        this.login.classList.add("hidden");
        this.image.classList.add("img-container");
        this.electiveImage.classList.add("hidden");
        this.headImage.classList.remove("hidden");
        this.image.classList.remove("imgtransition");
    }

    async signupcheck(event){
        event.preventDefault(); 
        const message = document.createElement("span");
        const error = document.querySelector("#loginerror");
        if(error){
            error.remove();
        }
        if(this.gmailornumber.value.trim() === "" || this.password.value === ""){
            message.id= "loginerror";
            message.textContent = "Please Enter Your Credentials";
            message.style.color = "red";
            message.style.margin = "0";
            message.style.fontSize = "0.8rem";
            this.password.insertAdjacentElement("afterend",message);
        }else{
            const url = "http://localhost:8080/login";
            try{
                
                const response = await axios.post(url,{
                    identified : this.gmailornumber.value,
                    password : this.password.value
                });
                console.log("Identified:", this.gmailornumber.value);
                console.log("Password:", this.password.value);
                const data = await response.data;
                if(data.success && data.status !== "Block"){
                    localStorage.setItem("userid", data.userid); 
                    localStorage.setItem("username", data.username);
                    localStorage.setItem("admindesignation",data.AdminDesignation); 
                    window.location.href = "dashboard.html"; // Redirect after saving user info
                }
                if(data.success && data.status === "Block"){
                        this.pop.style.backgroundColor = "#FF2C2C";
                        this.pop.textContent = `${data.message}`;
                        
                        // FIX: Ensure it starts with opacity 1 every time
                        this.pop.style.opacity = "1";
                        this.popupbody.style.opacity = "1";

                        setTimeout(() => {
                            this.pop.style.opacity = "0";
                        }, 7000);
                }


            }catch (err) {
                if (err.response) {
                    console.error("Server Error:", err.response.data.message);
                        const message = document.createElement("span");
                        const error = document.querySelector("#loginerror");
                        message.id= "loginerror";
                        message.textContent = `${err.response.data.message}`;
                        message.style.color = "red";
                        message.style.margin = "0";
                        message.style.fontSize = "0.8rem";
                        this.password.insertAdjacentElement("afterend",message);
                    
                } else if (err.request) {
                    console.error("Network Error:", err.request);
                } else {
                    console.error("Error:", err.message);
                }
            }
            
        }
    }

    openresetpasswordpage(){
        const key = crypto.randomUUID();
        sessionStorage.setItem("forgetpasswordToken",key);
        window.open(`/Resetpassword?token=${key}`,"_blank");
    }

}

class SIGNUP{
    constructor(){
    this.login = document.querySelector(".login");
    this.username = document.querySelector(".js_signup_username");
    this.signup = document.querySelector(".Admin_signup");
    this.email = document.querySelector(".js_signup_email"); 
    this.image = document.querySelector(".img");
    this.headImage = document.querySelector(".js_head");
    this.electiveImage = document.querySelector(".image");
    this.mobileNum = document.querySelector(".js_signup_mobile");
    this.password = document.querySelector(".js_signup_password");
    this.designation = document.querySelector(".js_designation");
    this.confirmpassword = document.querySelector(".js_signup_ConfirmPassword");
    this.signupbtn = document.querySelector(".js_signupbtn");
    this.eye = document.querySelectorAll(".toggle_eye");
    this.signin = document.querySelector(".signin");
    this.popmessage = document.querySelector(".popMessage");
    this.adminform = document.querySelector(".js_admins_form");
    this.init()
    }
    init(){
        this.signin.addEventListener("click", (event) => this.backtologin(event));
        this.email.addEventListener("blur",(event) => this.checkemail(event));
        this.mobileNum.addEventListener("input",(event)=> this.checkmobilenumber(event));
        this.password.addEventListener("input",(event)=>{
            this.checkpassword(event);

            if(this.confirmpassword.value !== ""){
                this.checkpasswordifference();
            }

        });
        this.confirmpassword.addEventListener("blur",(event)=>this.checkpasswordifference(event));
        this.signupbtn.addEventListener("click",async (event)=>this.checksignupform(event));

        this.eye.forEach(eye =>{
            eye.addEventListener("click",()=>this.togglepassword(eye));  
        });
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
                this.signupbtn.addEventListener("click",(event)=>{
                    event.preventDefault()
                    this.email.scrollIntoView({ behavior: "smooth", block: "center" });
                });

            }
        gmail.insertAdjacentElement("afterend", message);
    }

    checkmobilenumber(){
        const existing = document.querySelector("#merror");
        if(existing){
            existing.remove();
        }
        const message = document.createElement("span");
        const container = document.querySelector(".Admin_mobileNo")
        let condition = this.mobileNum.value;
        message.id = "merror"
        if(this.mobileNum.value === ""){
            message.remove();
        }else if(!/^\d{10}$/.test(this.mobileNum.value)) {
            message.textContent = "Enter a valid 10-digit mobile number";
            message.style.color = "red";
            message.style.margin = "0";
            message.style.fontSize = "0.8rem";
            this.signupbtn.addEventListener("click",(event)=>{
                event.preventDefault()
                this.email.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        }
        container.insertAdjacentElement("afterend",message);
    }

    checkpassword(event){
        const password = this.password.value;
        const conditions = [
            { test: /[A-Z]/.test(password), message: "atleast 1 Uppercase letter [A-Z]" },
            { test: /[a-z]/.test(password), message: "atleast 1 Lowercase letter [a-z]" },
            { test: /[0-9]/.test(password), message: "atleast 1 NUMBER [0-9]" },
            { test: /[!@#$%^&*?]/.test(password), message: "atleast 1 Special Character [!@#$%^&*?]" },
            { test: password.length >= 8, message: "atleast 8 character long" }
        ];
        const container = document.querySelector(".AdminPassword");
        const exist = document.querySelector("#loginError");
        if (exist) {
            exist.remove();
        }
        const failed = conditions.find(condition =>!condition.test);
        const error = document.createElement("span");
        error.id = "loginError";
        if(password === ""){
            error.remove();
        }else if (failed){
                error.textContent = failed.message;
                error.style.color = "red";
                error.style.margin = "0";
                error.style.fontSize = "0.8rem";
                container.insertAdjacentElement("afterend", error);
                this.signupbtn.addEventListener("click",(event)=>{
                event.preventDefault()
                this.email.scrollIntoView({ behavior: "smooth", block: "end" });
            });
        }

       
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
          const container = document.querySelector(".C_Password");
          message.textContent = "Entered Password Is Not Same";
          message.style.color = "red";
          message.style.fontSize = "0.8rem";
          message.style.margin = "0rem";
          container.insertAdjacentElement("afterend",message);
        }
    }

    async checksignupform(event){
        event.preventDefault();
        const message = document.createElement("span");
        if(this.username.value.trim() === "" && this.email.value === "" && this.password.value === "" && this.mobileNum.value === "" && this.confirmpassword.value === ""){
            const excist = document.querySelector("#formerror");
            if(excist){
                excist.remove();
            }
            message.id = "formerror"
            message.textContent ="Please Fill Up Your Details";
            message.style.color = "red";
            message.style.fontSize = "0.8rem";
            message.style.margin = "0rem";
            this.signupbtn.insertAdjacentElement("beforebegin",message);
        }else{
            try{
                const url = `http://localhost:8080/signup`;
                const response = await axios.post(url,{
                    username : this.username.value,
                    gmail : this.email.value,
                    mobileno : this.mobileNum.value,
                    designation : this.designation.value,
                    password : this.password.value
                });
                const data = await response.data;
                console.log(response.data);  
                if(data.success){
                    this.login.classList.remove("hidden");
                    this.signup.classList.add("hidden");
                    this.headImage.classList.add("hidden");
                    this.image.classList.remove("img-container");
                    this.electiveImage.classList.remove("hidden");
                    this.popmessage.classList.add("poptransition");
                    this.adminform.reset();
                    setTimeout(() => {
                        this.popmessage.classList.remove("poptransition");//hides pop
                    }, 3000);
    
                }
            }catch (err) {
                if (err.response) {
                    console.log("Error:", err.response.data.message); // server responded with error
                } else {
                    console.log("Error:", err.message); // other errors (network etc.)
                }
            }
           
          
        }
    }

    togglepassword(icon){
        const input = icon.closest("span").previousElementSibling;
        if(input.type === "password"){
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }else{
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye")
        }
    }
}

new ADMINLOGIN();
new LOGIN();
new SIGNUP();