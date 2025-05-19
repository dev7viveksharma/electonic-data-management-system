import { options } from './offices.js';
class TOPBAR{
    constructor(){
        this.dropMenu = document.querySelector(".js_dropMenu");
        this.bar = document.querySelector(".js_bars");
        this.name = document.querySelector(".adminName");
        this.logoutBtn = document.querySelector(".logout");
        this.init();
        this.showname();
    }
    init(){
        this.bar.addEventListener("click",(event)=>this.showdropmenu(event));
        this.logoutBtn.addEventListener("click",(event)=>this.backtologin(event));
    }

    showdropmenu(){
        this.dropMenu.classList.toggle("drop");
        this.bar.classList.toggle("active");
    }

    showname(){
        const username = localStorage.getItem("username");
        if(username){
            this.name.textContent = username;
        }else{
            alert("User not logged in! Redirecting to login...");
            window.location.href = "edms.html";
        }
    }

    backtologin(){
    // Clear token from localStorage
    localStorage.removeItem('username');

    // Redirect to login
    window.location.href = 'http://localhost:8080/logout';

    }
}

class SIGNUP{
    constructor(){
        this.Employeeform = document.querySelector(".createEmployee");
        this.firstName = document.querySelector(".js_signup_first_name");
        this.lastName = document.querySelector(".js_signup_last_name");
        this.signupPassword = document.querySelector(".js_password");
        this.signupCpassword = document.querySelector(".js_c_password");
        this.signupBtn = document.querySelector(".signup_btn");
        this.eye = document.querySelectorAll(".toggle-eye");
        this.mobileNum = document.querySelector(".mobile_number");
        this.dob = document.querySelector(".js_dob");
        this.percentage_of_disability = document.querySelector(".js_percentageDisability");
        this.pay_scale = document.querySelector(".js_pay_scale");
        this.dor = document.querySelector(".js_retirement_date");
        this.createEmployeetab = document.querySelector(".Create_EmployeeBtn");
        this.uploadImage = document.querySelector("#empUpload");
        this.previewImage = document.querySelector("#previewImage");
        this.officeinput = document.querySelector(".js_office");
        this.officeDropdDown = document.querySelector(".officeDropDown");
        this.home_district = document.querySelector(".js_home_district");
        this.gender = document.querySelector(".js_gender");
        this.Designation = document.querySelector(".js_designation");
        this.service = document.querySelector(".js_services");
        this.classes = document.querySelector(".js_class");
        this.empform = document.querySelectorAll(".js_emp_form");
        this.init();
    }

    init(){
        this.eye.forEach(eye =>{
            eye.addEventListener("click",()=>this.togglepassword(eye));
        });

        this.signupPassword.addEventListener("input",(event)=>{
            this.validateSignupPassword(event);

            if(this.signupCpassword.value !== ""){
                  this.comparepassword(this.signupCpassword);
            }

        });
        this.signupCpassword.addEventListener("input",(event)=>this.comparepassword(event.target));
        this.signupCpassword.addEventListener("blur", (event) =>this.comparepassword(event.target));
        this.mobileNum.addEventListener("blur",(event)=>this.correctMobileNumber(event.target));
        this.percentage_of_disability.addEventListener("input",(event)=>this.disabilitypercentagelimit(event.target));
        this.pay_scale.addEventListener("input",(event)=>this.paylimit(event.target));
        this.createEmployeetab.addEventListener("click",(event)=>this.showemployeeform(event));
        this.agelimit(dob);
        this.dorlimit(this.dor);
        document.querySelectorAll('input[name="disabled"]').forEach(radio => {
        radio.addEventListener("change", () => this.checkdisabled());
        });
        
        this.uploadImage.addEventListener("change",()=> this.showproFileImg());
        this.officelist()
        this.officeinput.addEventListener("input",()=>this.filterkeywords());
        this.signupBtn.addEventListener("click",(event)=>{
            event.preventDefault();
            this.CreateEmpAccount()});
        }

    showemployeeform(event){
        this.Employeeform.classList.toggle("ShowEmployeeSignupPage")
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
        if (input === ""){
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
    
    comparepassword(confirmpass) {
        let cpass = confirmpass.value;
        let value = this.signupPassword.value;
    
        const existingMessage = document.querySelector("#compareError");
        if (existingMessage) {
            existingMessage.remove();
        }
    
        const compare = document.querySelector(".compare");
        const message = document.createElement("span");
        message.id = "compareError";
        message.style.margin = "0";
        message.style.fontSize = "0.8rem";
        if(cpass === ""){
            return;
        }
        if (value !== cpass) {
            message.innerText = "Passwords do not match";
            message.style.color = "red";
        } else {
            message.innerText = "Passwords match ✓";
            message.style.color = "green";
        }
    
        compare.insertAdjacentElement("afterend", message);
    }

    correctMobileNumber(num){
        const number = num.value;
        const exist = document.querySelector("#numberLength");
        if(exist){
            exist.remove();
        }
        const message = document.createElement("p");
        message.id = "numberLength";
        message.style.margin = "0";
        message.style.fontSize = "0.8rem";
        if(number.length !== 10){
            message.innerText = "mobile Number is not valid";
            message.style.color = "red";
        }else{
            message.innerText = "valid number ✓";
            message.style.color = "green"
        }
        this.mobileNum.insertAdjacentElement("afterend",message);
    }
    
    agelimit(age){
        const today = new Date();
        const CurrentDate = today.getFullYear();
    
        const minYear = CurrentDate - 62; // oldest allowed
        const maxYear = CurrentDate - 18; // youngest allowed
    
        age.min = `${minYear}-01-01`; // Minimum DOB: Jan 1, 60 years ago
        age.max = `${maxYear}-12-31`; // Maximum DOB: Dec 31, 18 years ago

        this.dob.addEventListener("change",()=>{
            const selectedage = this.dob.value;
            const selectedyear = new Date(selectedage).getFullYear();
            const selectedmonth = new Date(selectedage).getMonth();
            const selectedday = new Date(selectedage).getDate()

            const oldError = document.querySelector("#error");
            if(oldError) oldError.remove();

            const m = document.createElement("p");
            m.id = "error";
            m.style.margin = "0";
            m.style.fontSize = "0.8rem";            
            const container = document.querySelector(".js_dob");
            if(selectedyear > maxYear || selectedday >31 || selectedmonth > 11 || selectedyear < minYear || selectedday < 1 || selectedmonth < 0){
                m.innerText = "sorry , your age is not valid";
                m.style.color = "red";
            }else{
                m.innerText ="age is valid ✓";
                m.style.color ="green";
            }
            container.insertAdjacentElement("afterend",m);
        });
    }

    disabilitypercentagelimit(percentage){
        const value = percentage.value;
        const existing = document.querySelector("#errorpercentage");
        if(existing)existing.remove(); 
        const message = document.createElement("span");
        message.id = "errorpercentage";
        message.style.margin = 0;
        message.style.fontSize = "0.8rem";

        if(value == ""){
            message.remove();
        }else if(value <1 || value > 100){
            message.innerText = "percentage(%) is not valid ";
            message.style.color = "red";   
        }else{
             message.remove();
        }
        percentage.insertAdjacentElement("afterend",message);
    }


    paylimit(pay){
        const salary = pay.value;
        const existing = document.querySelector("#errorAmount");
        if(existing)existing.remove(); 
        const message = document.createElement("span");
        message.id = "errorAmount";
        message.style.display = "flex";
        message.style.margin = 0;
        message.style.fontSize = "0.8rem";

        if(salary === ""){
            message.remove();
        }else if(salary < 10000 || salary > 100000){
            message.innerText = "not a valid salary";
            message.style.color = "red";
        }else{
            message.remove();
        }
        pay.insertAdjacentElement("afterend", message);
    }

    dorlimit(period){
        const today = new Date();
        const CurrentDate = today.getFullYear();
    
        const minYear = CurrentDate; // oldest allowed
        const maxYear = CurrentDate + 62; // youngest allowed
    
        period.min = `${minYear}-01-01`;
        period.max = `${maxYear}-12-31`; 

        this.dor.addEventListener("change",()=>{
            const selectedage = period.value;
            const selectedyear = new Date(selectedage).getFullYear();
            const selectedmonth = new Date(selectedage).getMonth();
            const selectedday = new Date(selectedage).getDate()

            const oldError = document.querySelector("#error");
            if(oldError) oldError.remove();

            const m = document.createElement("p");
            m.id = "error";
            m.style.margin = "0";
            m.style.fontSize = "0.8rem";

            if(period.value === ""){
                m.remove();
            }else if(selectedyear > maxYear || selectedday >31 || selectedmonth > 11 || selectedyear < minYear || selectedday < 1 || selectedmonth < 0){
                m.innerText = "Retirement date is not Valid";
                m.style.color = "red";
            }else{
                m.innerText ="date is valid ✓";
                m.style.color ="green";
            }
            period.insertAdjacentElement("afterend",m);
        });
    }

    checkdisabled() {
    const selected = document.querySelector('input[name="disabled"]:checked');

    if (selected && selected.value === "yes") {
        document.querySelector(".disability").classList.remove("hidden");
        document.querySelector(".percentage_of_diability").classList.remove("hidden");
        document.querySelector(".certificate").classList.remove("hidden");
        } else {
        document.querySelector(".disability").classList.add("hidden");
        document.querySelector(".percentage_of_diability").classList.add("hidden");
        document.querySelector(".certificate").classList.add("hidden");
        }
    }

    showproFileImg(){
        const file = this.uploadImage.files[0]
        if(file){
            const reader = new FileReader();
            reader.onload = () =>{
                this.previewImage.src = reader.result;
                this.previewImage.style.display = 'block';
                const bg = document.querySelector(".jsimg");
                bg.style.backgroundColor = "#4CAF50"
            };
             reader.readAsDataURL(file);
        }else{
            this.previewImage.style.display = 'none';
        }
    }

    showofficedropdownmenu(filteredOptions) {
    this.officeDropdDown.innerHTML = "";
    filteredOptions.forEach(option => {
        const menu = document.createElement("div");
        menu.textContent = option;
        menu.onclick = () => {
            this.officeinput.value = option;
            this.officeDropdDown.style.display = "none";
        };
        this.officeDropdDown.appendChild(menu);
    });

    this.officeDropdDown.style.display = filteredOptions.length ? "block" : "none";
}

  filterkeywords() {
    const current = this.officeinput.value.toLowerCase();
    
    if (current.trim() === "") {
        this.officeDropdDown.style.display = "none";
        return;
    }

    const filtered = options.filter(opt => opt.toLowerCase().includes(current));
    this.showofficedropdownmenu(filtered);
}

    officelist(){
    document.addEventListener("click", (event) => {
    const isClickInside = event.target.closest(".js_office_container");

    if (!isClickInside) {
        this.officeDropdDown.style.display = "none";
        const userInput = this.officeinput.value.trim();
        const validOptions = options.map(opt => opt.toLowerCase());

        const isValid = validOptions.includes(userInput.toLowerCase());

        // Remove old error if exists
        const oldError = document.querySelector("#officeError");
        if (oldError) oldError.remove();

        if (!isValid && userInput !== "") {
            const error = document.createElement("span");
            error.id = "officeError";
            error.textContent = "Invalid Office, Please Select From Dropdown Below";
            error.style.color = "red";
            error.style.margin = "0";
            error.style.fontSize = "0.8rem";
            this.officeinput.insertAdjacentElement("afterend", error);
            }
        } 
    });
}

async CreateEmpAccount(){
      const oldErrors = document.querySelectorAll("#Error");
      oldErrors.forEach(e => e.remove());
      let isError = false;
      this.empform.forEach(field =>{
      if(field.value.trim() === ""){
          isError = true;
          return;
        }
      });
      if(isError){
         const error = document.createElement("span");
            error.id = "Error";
            error.textContent = `Please Fill All Of The Credentials`;
            error.style.color = "red";
            error.style.margin = "0";
            error.style.fontSize = "1rem";
            error.style.textAlign = "center";
            this.signupBtn.insertAdjacentElement("beforebegin", error);
        }else{
            try{
                const file =this.uploadImage.files[0];
                const formdata = new FileReader();
                formdata.append('image',file);
                const url ="/CreateEmployeeAccount"
                const response = await axios.post(url , {
                    Fname : this.firstName.value,
                    Lname : this.lastName.value,
                });
            }catch{

            }
        }
    }
}
new TOPBAR();
new SIGNUP();