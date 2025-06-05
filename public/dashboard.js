import { options } from './offices.js';
class TOPBAR{
    constructor(){
        this.dropMenu = document.querySelector(".js_dropMenu");
        this.bar = document.querySelector(".js_bars");
        this.name = document.querySelector(".adminName");
        this.logoutBtn = document.querySelector(".logout");
        this.profile = document.querySelector(".Profile");
        this.backicon = document.querySelector(".js_backicon");
        this.editSection = document.querySelector(".admin_profile");
        this.designation = this.editSection.querySelector(".Admin_designation");
        this.adminName = this.editSection.querySelector(".Admin_FullName");
        this.mobile = this.editSection.querySelector(".Admin_Mobileno");
        this.email = this.editSection.querySelector(".Admin_EmailAddress");
        this.CompanyLogo = document.querySelector(".CompanyLogo");
        this.editBtn = this.editSection.querySelector(".admineditbtn");
        this.isedit = false;
        this.init();
        this.showname();
    }
    init(){
        this.bar.addEventListener("click",(event)=>this.showdropmenu(event));
        this.logoutBtn.addEventListener("click",(event)=>this.backtologin(event));
        this.profile.addEventListener("click",()=>this.showadmineditpage());
        this.backicon.addEventListener("click",()=>this.hideAdminEdit());
        this.CompanyLogo.addEventListener("click",()=>{
            location.reload();
        });
        this.adminProfile();
        this.editBtn.addEventListener("click",()=>this.editProfile());
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

    showadmineditpage(){
        this.editSection.style.right = "0rem";
        this.showdropmenu();
    }
    hideAdminEdit(){
        this.editSection.style.right = "-20rem";
        this.showdropmenu();
    }

    async adminProfile(){
        const empdesignation = localStorage.getItem("admindesignation");
        const username = localStorage.getItem('username');
        this.adminName.textContent = username;
        this.designation.textContent = empdesignation;
        try {
            const id = localStorage.getItem("userid");
            const url = 'http://localhost:8080/Admindata';
            const response = await axios.get(url,{ params: { adminid: id }});

            const admindata = response.data.result;
            const list = admindata.map(admin=>({
                mnum : admin.adminMobileNo,
                ademail :admin.adminEmail
            }));

            for(let i of list){
            this.mobile.textContent = i.mnum;
            this.email.textContent = i.ademail;
            }

        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
                
            }
        }
    }

    editProfile(){
        if(!this.isedit){
                this.inputName = document.createElement("input");
                this.inputEmail = document.createElement("input");
                this.inputNum = document.createElement("input");

                this.inputName.classList = "editableinputFieldName";
                this.inputEmail.classList = "editableinputFieldEmail";
                this.inputNum.classList = "editableinputFieldNumber";

                this.inputName.value = this.adminName.textContent;
                this.inputEmail.value = this.email.textContent;
                this.inputNum.value = this.mobile.textContent;

                this.inputName.type = "text";
                this.inputEmail.type = "email";
                this.inputNum.type = "tel";

                this.origibalname = this.adminName.textContent;
                this.originalnum = this.mobile.textContent;
                this.originalmail = this.email.textContent;
                
                this.adminName.replaceWith(this.inputName);
                this.mobile.replaceWith(this.inputNum);
                this.email.replaceWith(this.inputEmail);
                this.editBtn.textContent = "Done";
                this.isedit = true;
        }else{
            try {
                const adminname = document.createElement("p");
                const adminmail = document.createElement("p");
                const adminmnum = document.createElement("p");

                adminmnum.classList = "Admin_Mobileno";
                adminmail.classList = "Admin_EmailAddress";
                adminname.classList = "Admin_FullName";

                adminname.textContent = this.inputName.value;
                adminmail.textContent = this.inputEmail.value;
                adminmnum.textContent = this.inputNum.value;

                this.inputName.replaceWith(adminname);
                this.inputEmail.replaceWith(adminmail);
                this.inputNum.replaceWith(adminmnum);

                this.adminName = adminname;
                this.email = adminmail;
                this.mobile = adminmnum;

                this.editBtn.textContent = "Edit";
                this.isedit = false;


            } catch (error){
                if (error.response) {
                    console.log("Error:", error.response.data.message); // server responded with error
                } else {
                    console.log("Error:", error.message); // other errors (network etc.)
                }
            } 
        }
    }

}


class SIDENAV{
    constructor(){
        // this.Employeeform = document.querySelector(".createEmployee");
        // this.createEmployeetab = document.querySelector(".Create_EmployeeBtn");
        this.nav = document.querySelectorAll(".navs ul li");
        this.contentTab = document.querySelectorAll(".sidebar_nav_tabs > div")
        this.active = null;
        this.activeNav = null;
        this.init();
    }
    init(){
        // this.createEmployeetab.addEventListener("click",(event)=>this.showemployeeform(event));
        this.nav.forEach((option)=>{
            option.addEventListener("click",()=>{
                const tabs =option.getAttribute("data-tab");
                this.showemployeeform(tabs,option)});
        });
    }

    showemployeeform(tabs,navItem){
        
        if(this.active){
            this.active.classList.remove("ShowEmployeeSignupPage");
            // this.Employeeform.classList.toggle("ShowEmployeeSignupPage");
        }
        if (this.activeNav) {
            this.activeNav.classList.remove("activetab");
        }

        const newTab = document.querySelector(`.${tabs}`);

        if(newTab){
            newTab.classList.add("ShowEmployeeSignupPage");
            this.active = newTab;

        }
        navItem.classList.add("activetab");
        this.activeNav = navItem;

    }
}


class SIGNUP{
    constructor(){
        this.form = document.querySelector(".js_signup_form");
        this.pop = document.querySelector(".js_pop");
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
        this.uploadImage = document.querySelector("#empUpload");
        this.previewImage = document.querySelector("#previewImage");
        this.officeinput = document.querySelector(".js_office");
        this.officeDropdDown = document.querySelector(".officeDropDown");
        this.home_district = document.querySelector(".js_home_district");
        this.gender = "";
        this.Designation = document.querySelector(".js_designation");
        this.Department = document.querySelector(".js_department");
        this.service = document.querySelector(".js_services");
        this.classes = document.querySelector(".js_class");
        this.supervisory = document.querySelector(".js_supervisory");
        this.Goverment = document.querySelector(".js_goverment");
        this.Tec = document.querySelector(".js_treasury_code");
        this.empStatus = document.querySelector(".js_emp_status");
        this.votingExp = "";
        this.expCounting = "";
        this.expOther = "";
        this.NameVoterList = document.querySelector(".js_name_ch_voterList");
        this.voterListAssembly = document.querySelector(".js_vla");
        this.voterPartNumber = document.querySelector(".js_vpn");
        this.serialNumber = document.querySelector(".js_sn");
        this.epic = document.querySelector(".js_epic");
        this.Acr = document.querySelector(".js_Acr");
        this.Acw = document.querySelector(".js_Acw");
        this.currentBasicPay = document.querySelector(".js_cbp");
        this.dcbp = document.querySelector(".js_dcbp");
        this.bankName = document.querySelector(".js_bank_name");
        this.accountNo = document.querySelector(".js_accountNumber");
        this.branchCode = document.querySelector(".js_branchCode");
        this.ifsc = document.querySelector(".js_ifsc");
        this.empform = document.querySelectorAll(".js_emp_form");
        this.remarks = document.querySelector(".remark");
        this.diffrentlyabled = "";
        this.type_disability = document.querySelector(".js_typedisability");
        this.certificates_disability = document.querySelector(".disability_certificates");
        this.imagepath ="";
        this.documentpath = "";
        this.init();
        this.radio();
    }

    init(){
        window.addEventListener("error", (e) => {
          console.error("Global Error:", e.message);
        });
        window.addEventListener("beforeunload", () => {
        console.warn("Page is reloading!");
        });

        this.eye.forEach(eye =>{
            eye.addEventListener("click",()=>this.togglepassword(eye));
        });

        this.signupPassword.addEventListener("input",(event)=>{
            this.validateSignupPassword(event);

            if(this.signupCpassword.value !== ""){
                  this.comparepassword(this.signupCpassword);
            }
        });
        this.signupPassword.addEventListener("blur",() => {
            const existingError = document.querySelector("#signupError");
            if (existingError) existingError.remove();  // Remove error message when input loses focus
        });
        this.signupCpassword.addEventListener("input",(event)=>this.comparepassword(event.target));
        this.signupCpassword.addEventListener("blur", (event) =>this.comparepassword(event.target));
        this.mobileNum.addEventListener("blur",(event)=>this.correctMobileNumber(event.target));
        this.percentage_of_disability.addEventListener("input",(event)=>this.disabilitypercentagelimit(event.target));
        this.pay_scale.addEventListener("input",(event)=>this.paylimit(event.target));
        this.ifsc.addEventListener("input",()=>this.ifsclimit());
        this.agelimit(dob);
        this.dorlimit(this.dor);
        this.empDepartment();
    

        this.certificates_disability.addEventListener("change",()=>this.disabilitycertificates());
        
        this.uploadImage.addEventListener("change",()=>this.showproFileImg());
        this.officelist()
        this.officeinput.addEventListener("input",()=>this.filterkeywords());
        this.signupBtn.addEventListener("click",(event)=>{
            event.preventDefault();
            this.CreateEmpAccount()});

    }


    radio(){
        document.querySelectorAll('input[name="disabled"]').forEach(radio => {
        radio.addEventListener("change", () => this.checkdisabled());
        });
        document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener("change", () => this.checkgenders());
        });

        document.querySelectorAll('input[name="exp_voting"]').forEach(radio => {
        radio.addEventListener("change", () => this.checkexpvoting());
        });

         document.querySelectorAll('input[name="exp_counting"]').forEach(radio => {
        radio.addEventListener("change", () => this.checkexpcounting());
        });

         document.querySelectorAll('input[name="other_works"]').forEach(radio => {
        radio.addEventListener("change", () => this.checkexpother());
        });
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
        if (failedCondition && container) {
            // If there's a failed condition, display the error message
            const error = document.createElement("p");
            error.id = "signupError";
            error.textContent = failedCondition.message;
            error.style.color = "red";
            error.style.margin = "0";
            error.style.fontSize = "0.8rem";
            container.insertAdjacentElement("afterend", error);
        }else{
        // password valid, so remove any old error message
        const existingError = document.querySelector("#signupError");
        if (existingError) existingError.remove();
    }

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
    checkgenders(){
        const selected = document.querySelector('input[name="gender"]:checked');
        this.gender = selected.value;
        console.log(this.gender);
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
        this.diffrentlyabled = selected.value;
        console.log(this.diffrentlyabled);
    }

    checkexpvoting(){
        const selected = document.querySelector('input[name="exp_voting"]:checked');
        this.votingExp = selected.value;
        console.log(this.votingExp);
    }
    
    checkexpcounting(){
        const selected = document.querySelector('input[name="exp_counting"]:checked');
        this.expCounting = selected.value;
        console.log(this.expCounting);
    }

     checkexpother(){
        const selected = document.querySelector('input[name="other_works"]:checked');
        this.expOther = selected.value;
        console.log(this.expOther);
    }

    async showproFileImg(){
            const file = this.uploadImage.files[0];
            if(file){
                const reader = new FileReader();
                reader.onload = () =>{
                    this.previewImage.src = reader.result;
                    this.previewImage.style.display = 'block';
                    const bg = document.querySelector(".jsimg");
                    bg.style.backgroundColor = "#4CAF50"
                };
                reader.readAsDataURL(file);
                try{
                    const formData = new FormData();
                    formData.append('pimage', file);
                    const url = 'http://localhost:8080/uploadImg';
                    const response = await axios.post(url,formData,{
                    headers: { "Content-Type": "multipart/form-data" }
                    });
                    this.imagepath = await response.data.path;
                    const data = response.data;
                    if(data.success){
                        console.log(this.imagepath);
                    }
                    }catch{
                        console.log("error");
                    }
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

ifsclimit(){
    const ifscLength = this.ifsc.value;
    const excist = document.querySelector("#ifscerror");
    if(excist){
        excist.remove();
    }
    const message = document.createElement("span");
    message.id = "ifscerror";
    message.style.margin = "0";
    message.style.fontSize = "0.8rem";
    if(this.ifsc.value === ""){
        this.signupBtn.disabled = true;
        return;
    }
    if(ifscLength.length !== 11){
        this.signupBtn.disabled = true;
        message.innerText = "invalid IFSC Code";
        message.style.color = "red";
    }else{
        this.signupBtn.disabled = false;
        message.innerText = "valid IFSC Code ✓";
        message.style.color = "green"
    }
  
    this.ifsc.insertAdjacentElement("afterend",message);

    
}

empDepartment(){
    const empdesignation = localStorage.getItem("admindesignation");
    if(empdesignation){
        this.Department.value = empdesignation;
        this.Department.disabled = true;
      }else{
            alert("User Designation not Found! Redirecting to login...");
            window.location.href = "edms.html";
        }
    }
    
async disabilitycertificates(){
    const file = this.certificates_disability.files[0];
    if(file){
        try{
            const formData = new FormData();
            formData.append("certificate",file);
            const url = 'http://localhost:8080/disabilityCertificate';
            const response = await axios.post(url,formData,{
                headers: { "Content-Type": "multipart/form-data" }
            });
            this.documentpath = await response.data.path;
            const data =  response.data;
            if(data.success){
                const container = document.querySelector(".certificate");
                const error = document.createElement("span");
                error.id = "officeError";
                error.textContent = data.message;
                error.style.color = "green";
                error.style.margin = "0";
                error.style.fontSize = "0.8rem";
                container.insertAdjacentElement("beforeend", error);
                console.log(this.documentpath);
            }
        }catch(error){
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
        }
    }
    }else{
        console.log("file not found ");
    }
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
                const userid = localStorage.getItem("userid");
                const url ="http://localhost:8080/CreateEmployeeAccount";
                const response = await axios.post(url , {
                    adminid : userid,
                    Fname : this.firstName.value,
                    Lname : this.lastName.value,
                    profileImg : this.imagepath,
                    Mnumber : this.mobileNum.value,
                    password : this.signupPassword.value,
                    dob : this.dob.value,
                    home_district : this.home_district.value,
                    gender : this.gender,
                    diffrentlyabled : this.diffrentlyabled,
                    typeofdisability : this.type_disability.value,
                    disablepercent : this.percentage_of_disability.value,
                    certificateofDiability : this.documentpath,
                    Designation : this.Designation.value,
                    typeservice : this.service.value,
                    classes : this.classes.value,
                    payScale : this.pay_scale.value,
                    supervisory :this.supervisory.value,
                    Department : this.Department.value,
                    office : this.officeinput.value,
                    Goverment : this.Goverment.value,
                    tec : this.Tec.value,
                    empStatus : this.empStatus.value,
                    dor : this.dor.value,
                    votingexp : this.votingExp,
                    expcounting : this.expCounting,
                    expother : this.expOther,
                    NameVoterList : this.NameVoterList.value,
                    voterListAssembly : this.voterListAssembly.value,
                    vpn : this.voterPartNumber.value,
                    serialNumber :this.serialNumber.value,
                    epic : this.epic.value,
                    Acr : this.Acr.value,
                    Acw : this.Acw.value,
                    currentBasicPay : this.currentBasicPay.value,
                    dcbp : this.dcbp.value,
                    bankName : this.bankName.value,
                    accountNo : this.accountNo.value,
                    branchCode : this.branchCode.value,
                    ifsc : this.ifsc.value,
                    remarks : this.remarks.value
                });

                const data = await response.data;

                if(data.success){
                    this.form.reset();
                    this.empDepartment();
                    this.form.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }catch(err){
                if (err.response) {
                    console.log("Error:", err.response.data.message); // server responded with error
                } else {
                    console.log("Error:", err.message); // other errors (network etc.)
                    
                }
            }
        }
    }
}

class VIEWEMPLOYEE{
    constructor(){
        this.VarifiedDataContainer = document.querySelector(".listOfVarifiedEmployees");
        this.NonVarifiedDataContainer = document.querySelector(".listOfNonVarifiedEmployees");
        this.dropdownArrow = document.querySelectorAll(".dropdownArrow");
        this.searchbox = document.querySelector(".empSearch");
        this.searchbtn = document.querySelector(".searchBtn");
        this.init();
    }
    init(){
        this.varifiedData()
        this.NonVarifiedData();
        this.dropdownArrow.forEach((arrow)=>{
            arrow.addEventListener("click",(event)=>{
                arrow.querySelector(".js_icon").classList.toggle("invert");
                this.arrowfunction(event.currentTarget)});
        });

        this.searchbox.addEventListener("input",()=>this.searchEmployeesdata(this.VarifiedDataContainer,this.NonVarifiedDataContainer));
        this.searchbtn.addEventListener("click",()=>this.searchEmployeesdata(this.VarifiedDataContainer,this.NonVarifiedDataContainer));
        
    }

    async varifiedData(){
        try {
            const dept = localStorage.getItem("admindesignation"); 
            const response = await axios.get("http://localhost:8080/VarifiedEmployee",{
                params: { department: dept }
            });
            let data = response.data.result;
            let emp = data.map(employees=>({
              empcode: employees.Employee_code,
              empimg : employees.Employee_Image,
              empname : employees.Employee_FName + " " + employees.Employee_LName,
              empmnum : employees.Mobile_Number,
              empdepartment : employees.Department,
              empVarified : employees.varified
            }));
            const list = this.createEmployeelist(emp,'Varified');
             if(data.length === 0){
                 this.VarifiedDataContainer.innerHTML +=`
                    <div class="EmployeeList">
                        <div class="details">
                        <h5>
                            No Employee Data Found 
                        </h5>
                        </div>
                    </div>
                    `;
            }
        } catch (error) {
             if (error.response) {
                    console.log("Error:", error.response.data.message); // server responded with error
                } else {
                    console.log("Error:", error.message); // other errors (network etc.)
                    
                }
        }
    }

    arrowfunction(arrow){
        const varifiedList = arrow.closest('.Varified_Employee')?.querySelector('.listOfVarifiedEmployees');
        const nonVarifiedList = arrow.closest('.NonVarified_Employee')?.querySelector('.listOfNonVarifiedEmployees');
        if(varifiedList){
           const container =  varifiedList.querySelectorAll(".EmployeeList");
           container.forEach((box)=>{
           box.classList.toggle("hidden");
           });
        }else if(nonVarifiedList){
           const container =  nonVarifiedList.querySelectorAll(".EmployeeList");
           container.forEach((box)=>{
           box.classList.toggle("hidden");
           });
        }
    }

    async NonVarifiedData(){
        try {
            const dept = localStorage.getItem("admindesignation"); 
            const response = await axios.get("http://localhost:8080/NonVarifiedEmployee",{
                params: { department: dept }
            });
            let data = response.data.result;
            let emp = data.map(employees=>({
              empcode: employees.Employee_code,
              empimg : employees.Employee_Image,
              empname : employees.Employee_FName + " " + employees.Employee_LName,
              empmnum : employees.Mobile_Number,
              empdepartment : employees.Department,
              empVarified : employees.varified
            }));
            this.list = this.createEmployeelist(emp,'Not Varified');
            if(data.length === 0){
                 this.NonVarifiedDataContainer.innerHTML +=`
                    <div class="EmployeeList">
                        <div class="details">
                        <h5>
                            No Employee Data Found 
                        </h5>
                        </div>
                    </div>
                    `;
            }
        } catch (error) {
             if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
                } else {
                    console.log("Error:", error.message); // other errors (network etc.)
                    
                }
        }
    }

   addVerificationListeners() {
    this.NonVarifiedDataContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("varifyBtn")) {
            console.log("Verify button clicked!");
            this.verifyEmp(target);
        }
    });

    this.VarifiedDataContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("notvarifyBtn")) {
            console.log("Unverify button clicked!");
            this.verifyEmp(target);
            // this.unverifyEmp(target); // if needed
        }
    });
}


    createEmployeelist(emp , v){
        if(v === "Not Varified"){
            this.NonVarifiedDataContainer.innerHTML = "";
            for(const data of emp){
            this.NonVarifiedDataContainer.innerHTML +=`
            <div class="EmployeeList">
                <div class="image_container">
                    <img  class="empImage" src="${data.empimg}">
                </div>
                <div class="details">
                    <div class="emp_code">
                        <p>Employee Code</p>
                        <p class="empcode">${data.empcode}</p>
                    </div>
                    <div class="emp_name">
                        <p>Employee Name</p>
                        <p class="empName">${data.empname}</p>   
                    </div>
                    <div class="emp_mobileNumber">
                        <p>Employee Mobile Number</p>
                        <p class="empMNum">${data.empmnum}</p>
                    </div>
                    <div class="emp_department">
                        <p>Employee Department</p>
                        <p class="empDepartment">${data.empdepartment}</p>
                    </div>
                    <div class="verify">
                        <button class="varifyBtn" type="button">Varify</button>
                    </div>
                    <div class="editBtn">
                        <button  type="button">Edit<i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>
            </div>
            `
        }
        }else{
            this.VarifiedDataContainer.innerHTML = "";
            for(const data of emp){
            this.VarifiedDataContainer.innerHTML += `
            <div class="EmployeeList">
                <div class="image_container">
                    <img  class="empImage" src="${data.empimg}">
                </div>
                <div class="details">
                    <div class="emp_code">
                        <p>Employee Code</p>
                        <p class="empcode">${data.empcode}</p>
                    </div>
                    <div class="emp_name">
                        <p>Employee Name</p>
                        <p class="empName">${data.empname}</p>   
                    </div>
                    <div class="emp_mobileNumber">
                        <p>Employee Mobile Number</p>
                        <p class="empMNum">${data.empmnum}</p>
                    </div>
                    <div class="emp_department">
                        <p>Employee Department</p>
                        <p class="empDepartment">${data.empdepartment}</p>
                    </div>
                    <div class="verify">
                        <button class="notvarifyBtn" type="button">UnVarify</button>
                    </div>
                </div>
            </div>
            `
        }
      }
      // Add this after rendering all employee lists
      this.addVerificationListeners();
    }

    async verifyEmp(btn){
        const parent_container = btn.closest('.EmployeeList');
        const Empcode = parent_container.querySelector(".empcode").textContent.trim();

        if(btn.classList.contains("varifyBtn")){
        try {
            const url = "http://localhost:8080/NonVarifiedEmployee/varify";


            const response = await axios.post(url,{
                empcode : Empcode
            });
            const data = await response.data;
            if(data.success){
                await this.NonVarifiedData();  // refresh unverified list
                await this.varifiedData();     // refresh verified list
            }
            
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }
        }else{
            try {
            const url = "http://localhost:8080/NonVarifiedEmployee/unvarify";


            const response = await axios.post(url,{
                empcode : Empcode
            });
            const data = await response.data;
            if(data.success){
                await this.NonVarifiedData();  // refresh unverified list
                await this.varifiedData();     // refresh verified list
            }
            
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }  
        }
    }


    searchEmployeesdata(varified,nonvarified){
        const varifiedemployeelist = varified.querySelectorAll(".EmployeeList");
        const nonvarifiedemployeelist = nonvarified.querySelectorAll(".EmployeeList");
        varifiedemployeelist.forEach((list)=>{
            const code = list.querySelector(".empcode")?.textContent.toLowerCase() || "";
            const name = list.querySelector(".empName")?.textContent.toLowerCase() || "";
            if(!code.includes(this.searchbox.value) && !name.includes(this.searchbox.value.toLowerCase())){
                list.classList.add("hidden");
            }else{
                list.classList.remove("hidden");
            }
        });

         nonvarifiedemployeelist.forEach((list)=>{
            const code = list.querySelector(".empcode")?.textContent.toLowerCase() || "";
            const name = list.querySelector(".empName")?.textContent.toLowerCase() || "";
            if(!code.includes(this.searchbox.value) && !name.includes(this.searchbox.value.toLowerCase())){
                list.classList.add("hidden");
            }else{
                list.classList.remove("hidden");
            }
        });
    }
}



new TOPBAR();
new SIDENAV()
new SIGNUP();
new VIEWEMPLOYEE();