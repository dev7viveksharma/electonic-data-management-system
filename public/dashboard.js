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
        this.personalposts = document.querySelector(".PersonalChat i");
        this.privatechatcontainer = document.querySelector(".privatePosts");
        this.personalchathead = document.querySelector(".personalchatting_heading");
        this.aboutusbtn = document.querySelector(".About_us");
        this.aboutusbody = document.querySelector(".AboutUsTab");
        this.aboutusback = document.querySelector(".Aboutbar i");
        this.isedit = false;
        this.showname();
        this.init();
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
        this.personalposts.addEventListener("click",()=>{
            this.personalpostfunct();
        });
        this.aboutusbtn.addEventListener("click",()=>{
            this.aboutusdatashow()
        });
        this.aboutusback.addEventListener("click",()=>{
            this.backaboutus();
        });
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

    personalpostfunct(){
        this.privatechatcontainer.classList.toggle("slideback");
    }

    aboutusdatashow(){
        this.aboutusbody.classList.add("slideback");
        this.showdropmenu();
    }

    backaboutus(){
        this.aboutusbody.classList.remove("slideback");
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

class WELCOMEPAGE {
    constructor() {
        this.name = document.querySelector(".welocomeMassageContainer h3 span");
        this.imagesContainer = document.querySelector(".slidingimages");
        this.images = document.querySelectorAll(".slidingimages img");
        this.totalImages = this.images.length;
        this.currentindex = 0;
        this.interval = null;

        this.nextBtn = document.querySelector(".NextImg");
        this.prevBtn = document.querySelector(".prevImg");

        this.init();
    }

    init() {
        this.addname();
        this.updateSlide();
        this.startAutoSlide();

        this.nextBtn.addEventListener("click", () => {
            this.gotoNext();
        });

        this.prevBtn.addEventListener("click", () => {
            this.gotoPrev();
        });
    }

    addname(){

        this.name.innerText = localStorage.getItem("username"); 
    }

    updateSlide() {
        this.imagesContainer.style.transform = `translateX(-${this.currentindex * 100}%)`;
    }

    startAutoSlide() {
        this.stopAutoSlide(); // Clear any existing interval
        this.interval = setInterval(() => {
            this.gotoNext();
        }, 3000);
    }

    stopAutoSlide() {
        if (this.interval) clearInterval(this.interval);
    }

    gotoNext() {
        this.currentindex = (this.currentindex + 1) % this.totalImages;
        this.updateSlide();
        this.startAutoSlide();
    }

    gotoPrev() {
        this.currentindex = (this.currentindex - 1 + this.totalImages) % this.totalImages;
        this.updateSlide();
        this.startAutoSlide();
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


class CREATEEMPACCOUNT{
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

    ErrorMessage(errorid , adjacent , errormessage , color , position){
            const error = document.createElement("p");
            error.style.color = color;
            error.style.margin = "0";
            error.style.fontSize = "0.8rem";
            error.id = errorid;
            error.textContent = errormessage;
            adjacent.insertAdjacentElement( position , error);
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
            this.ErrorMessage("signupError" , container ,failedCondition.message , "red" , "afterend");
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
        let message = "";
        let color = "";
        
        if(cpass === ""){
            return;
        }
        if (value !== cpass) {
            message = "Passwords do not match";
            color = "red";
        } else {
            message = "Passwords match ✓";
            color = "green";
        }
        this.ErrorMessage("compareError" , compare , message , color , "afterend" );
    }

    correctMobileNumber(num){
        const number = num.value;
        const exist = document.querySelector("#numberLength");
        if(exist){
            exist.remove();
        }
        let message = "";
        let color = "";
        if(number.length !== 10){
            message = "mobile Number is not valid";
            color = "red";
        }else{
            message = "valid number ✓";
            color = "green"
        }
        this.ErrorMessage("numberLength" , this.mobileNum , message , color ,"afterend");
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
            let m = "";
            let color = "";        
            const container = document.querySelector(".js_dob");
            if(selectedyear > maxYear || selectedday >31 || selectedmonth > 11 || selectedyear < minYear || selectedday < 1 || selectedmonth < 0){
                m = "sorry , your age is not valid";
                color = "red";
            }else{
                m ="age is valid ✓";
                color ="green";
            }
            this.ErrorMessage("error" , container , m , color ,"afterend");
        });
    }

    disabilitypercentagelimit(percentage){
        const value = percentage.value;
        const existing = document.querySelector("#errorpercentage");
        if(existing)existing.remove(); 
        let message = "";
        let color = "";

        if(value == ""){
        }else if(value <1 || value > 100){
            message = "percentage(%) is not valid ";
            color = "red";   
        }
        this.ErrorMessage("errorpercentage" , percentage , message , color ,"afterend");
    }


    paylimit(pay){
        const salary = pay.value;
        const existing = document.querySelector("#errorAmount");
        if(existing)existing.remove(); 
        let message = "";
        let color = "";

        if(salary === ""){
        }else if(salary < 10000 || salary > 100000){
            message = "not a valid salary";
            color = "red";
        }
        this.ErrorMessage("errorAmount" , pay , message , color ,"afterend");
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

            const oldError = document.querySelector("#dorerror");
            if(oldError) oldError.remove();

            let m = "";
            let color = "";

            if(period.value === ""){

            }else if(selectedyear > maxYear || selectedday >31 || selectedmonth > 11 || selectedyear < minYear || selectedday < 1 || selectedmonth < 0){
                m = "Retirement date is not Valid";
                color = "red";
            }else{
                m ="date is valid ✓";
                color ="green";
            }
             this.ErrorMessage("dorerror" , period , m , color ,"afterend");
        });
    }
    checkgenders(){
        const selected = document.querySelector('input[name="gender"]:checked');
        this.gender = selected.value;
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
    }

    checkexpvoting(){
        const selected = document.querySelector('input[name="exp_voting"]:checked');
        this.votingExp = selected.value;

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
            this.ErrorMessage("officeError" , this.officeinput , "Invalid Office, Please Select From Dropdown Below" , "red" ,"afterend");
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
    let message = "";
    let color = "";
    if(this.ifsc.value === ""){
        this.signupBtn.disabled = true;
        return;
    }
    if(ifscLength.length !== 11){
        this.signupBtn.disabled = true;
        message = "invalid IFSC Code";
        color = "red";
    }else{
        this.signupBtn.disabled = false;
        message= "valid IFSC Code ✓";
        color = "green"
    }
    this.ErrorMessage("ifscerror" , this.ifsc , message , color ,"afterend");

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
                this.ErrorMessage("officeError" , container , data.message , "green" ,"beforeend");
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
      const oldErrors = document.querySelectorAll("#allError");
      oldErrors.forEach(e => e.remove());
      let isError = false;
      this.empform.forEach(field =>{
      if(field.value.trim() === ""){
          isError = true;
          return;
        }
      });
      if(isError){
            this.ErrorMessage("allError" , this.signupBtn , `Please Fill All Of The Credentials` , "red" ,"beforebegin");
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
                    viewempRelaod.varifiedData()
                    viewempRelaod.NonVarifiedData();
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
        this.editListenerAttached = false;
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
        if(!this.editListenerAttached){
             this.NonVarifiedDataContainer.addEventListener("click",(event)=>{
                const btn = event.target.closest(".editBtn button");
                console.log("event listener triggered");
                if(btn){
                    this.editEmpProfile(btn);
                }
            });
            this.editListenerAttached = true;
        }
       
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

    editEmpProfile(editbtn){
        const code = editbtn.closest(".EmployeeList").querySelector(".empcode").textContent;
        localStorage.setItem("employeeCode" ,code);
        const secretKey = crypto.randomUUID();
        sessionStorage.setItem("secretkey",secretKey);
        window.location.replace(`EmployeesEditForm.html?token=${secretKey}`);
    }
}

class PublicPosts{
    constructor(){
        this.parent = document.querySelector(".pubpost");
        this.actioncolor = null;
        this.actionhandler = {
            Informational :() =>{
                return "2196F330";
            },
            LowPriority :() =>{
                 return "4CAF5030"
            },
            HighPriority :() =>{
                 return "FF980030"
            },
            Critical :() =>{
                 return "F4433630"
            }
        }
        this.init();
    }
    async init(){
        await this.loadPublicPosts();
    }

async loadPublicPosts() {
    const CACHE_DURATION = 5 * 10 * 1000; // 5 minutes
    const cached = localStorage.getItem("cachedPublicPosts");
    const cachedTime = localStorage.getItem("cachedPublicPostsTime");

    if (cached && cachedTime && (Date.now() - cachedTime < CACHE_DURATION)) {
        console.log("✅ Loaded from cache");
        const posts = JSON.parse(cached);
        this.renderPosts(posts);
        return;
    }

    try {
        const url = `/FetchPosts`;
        const response = await axios.get(url,{
            params : {
                value : 'All',
                hodname : 'none'
            }
        });
        const data = response.data;

        if (data.success) {
        const posts = data.finalPosts;
        if(posts === 0 ){
            throw new Error("no data found");
        }
        // Store in cache
        localStorage.setItem("cachedPublicPosts", JSON.stringify(posts));
        localStorage.setItem("cachedPublicPostsTime", Date.now());

        console.log("🌐 Fetched from backend");
        this.renderPosts(posts);
        } else {
        console.error("❌ Backend response failed");
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        }
    }

    renderPosts(posts) {
        posts.forEach(post => {

            this.parent.innerHTML += `
                    <div class="chat-message-box">
                            <div class="profiletabs">
                                <img src="./images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="User" class="profile-pic" />
                            </div>
                        
                       
                        <div class="message-content">
                             <p class = "post_dmname">${post.Name}</p>
                            <div class="message-text">
                                ${post.message !== "None" ? post.message : ""}
                            </div>

                            <!-- This is the file/image container -->
                            <div class="message-file">
                            <!-- Image -->
                            ${post.File !== "None" ? this.renderFile(post.File):""}
                            </div>

                            <div class="message-meta">
                            <span class="message-date">${new Date(post.sent_at).toLocaleDateString()}</span>
                            <span class="message-time">${new Date(post.sent_at).toLocaleTimeString()}</span>
                            </div>

                        </div>
                    </div>`;
                    this.actioncolor = post.Priority.replace(/\s/g, "");;
                    let color = this.actionhandler[this.actioncolor](); // returns hex like 'FF9800'
                    let lastBox = this.parent.querySelectorAll(".chat-message-box");
                    lastBox[lastBox.length - 1].style.backgroundColor = `#${color}`;       
        });
    }

renderFile(file) { 
    if (file.endsWith(".pdf")) {
        return `<a href="${file}" target="_blank" class="attached-file">📄 View PDF</a>`;
    } else if (file.endsWith(".jpeg") || file.endsWith(".jpg") || file.endsWith(".png")) {
        return `<img src="${file}" class="attached-image">`;
    } else {
        const frame = document.querySelector(".message-file");
        frame.classList.add("hidden");
    }
}



}

class CHANGEDUTY{
    constructor(){
        this.ET = document.querySelector(".electionnameinput");
        this.block = document.querySelector(".blockinput");
        this.empcode = document.querySelector(".employeecodeinput");
        this.searchbtn = document.querySelector(".EmpSearchbtn");
        this.tableparent = document.querySelector(".showElectionDutiesPanel");
        this.alertbg = document.querySelector(".alertbg");
        this.closebtn = document.querySelector(".close_btn");
        this.confirmbtn = document.querySelector(".confirm_btn");
        this.alertmessage = document.querySelector(".alert_message");
        this.alertheading = document.querySelector(".alert_heading");
        this.alertpassword = document.querySelector(".alert_password");
        this.pop = document.querySelector(".Popups");
        this.actiontype = null;
        this.actionhandlers = {
            save : async () => {
              await this.SaveNewCodeValue(this.newcode);
            },
            close : () =>{
                this.alertbg.classList.add("hidden");
                this.alertpassword.value = "";
            }

        }
        this.init();
    }

    init(){
        this.ET.addEventListener("change",()=>{
            this.SelectElection(this.ET.value);
            this.tableparent.innerHTML = "";
            if(!this.searchbtn.disabled){
                this.searchbtn.disabled = true;
            }
        });
        this.block.addEventListener("change",()=>{
                this.empcode.disabled = false;
                this.empcode.value = "";
        });
        this.empcode.addEventListener("change",()=>{
            this.searchbtn.disabled = false;
            this.tableparent.innerHTML = "";
        })
        this.searchbtn.addEventListener('click',()=>this.showdynamicElectionList());
        this.tableparent.addEventListener('click',async (event)=>{
            if(event.target.classList.contains("innereditbtn")){
                this.codeparent = this.tableparent.querySelector(".codecontentcontainer");
                await this.showleftoverlist(this.codeparent);
            }

            if(event.target.classList.contains("crossmarking")){
                const codecontainer = document.querySelector(".codecontentcontainer");
                const dynamiccodelist = this.codeparent.querySelector(".dynamicuniqecodeparent");
                const cross = codecontainer.querySelector(".crossmarking");
                cross.remove();
                dynamiccodelist.remove();
                this.codeparent.innerHTML = `${this.empcode.value}<button class="editcodebtn"><i class="fa-solid fa-pen-to-square innereditbtn"></i></button>`
            }

            if (event.target.classList.contains("codescontainerchild")) {
                this.newcode = event.target.textContent;
                const codecontainer = document.querySelector(".codecontentcontainer");
                const dynamiccodelist = this.codeparent.querySelector(".dynamicuniqecodeparent");
                const cross = codecontainer.querySelector(".crossmarking");
                const savebtn = this.tableparent.querySelector(".savechangebtn");
                savebtn.disabled = false;
                cross.remove();
                dynamiccodelist.remove();
                this.codeparent.innerHTML = `${this.newcode}<button class="editcodebtn"><i class="fa-solid fa-pen-to-square innereditbtn"></i></button>`
            }

            if(event.target.classList.contains("clearlistbtn")){
                this.tableparent.innerHTML = "";
                this.empcode.value = "";
                this.ET.value = "";
                this.block.value = "";
                this.empcode.disabled = true;
                this.block.disabled = true;
                this.searchbtn.disabled = true;
            }

            if(event.target.classList.contains("savechangebtn")){
                this.alertheading.innerText = ` Save Employee Profile Changes ?`;
                this.alertmessage.innerText = `Are you sure you want to permanently Change Employee Code ? This action cannot be undone`;
                this.actiontype = "save";
                this.alertbg.classList.remove("hidden");
                
            }

        });

        this.closebtn.addEventListener("click",()=>{
            this.alertpassword.value = "";
            const err = document.querySelector("#alertError");
            if(err){
                err.remove();
            }
            this.alertbg.classList.add("hidden");
        })
        this.confirmbtn.addEventListener("click",()=>{
            if(this.alertpassword.value === ""){
                const err = document.querySelector("#alertError");
                if(err){
                    err.remove();
                }
                const error = document.createElement("p");
                error.id = "alertError";
                error.textContent = "First Please enter you Password";
                error.style.color = "red";
                error.style.margin = "0";
                error.style.fontSize = "0.8rem";
                error.style.width = "100%";
                error.style.textAlign = "centre";
                this.alertpassword.insertAdjacentElement("afterend",error);
            }else{
                const err = document.querySelector("#alertError");
                if(err){
                    err.remove();
                }
                this.callactionhandler(this.actiontype);
            }
        });
    }

    callactionhandler(action){
        if(this.actionhandlers[action] && action !== null){
            this.actionhandlers[action]();
        }
    }

async SelectElection(election){
        try {
            this.block.innerHTML = `<option value="" disabled selected>Select Area Block</option>`;
            const response = await axios.get("/blockList",{
                params : {Election : election}
            });
            const data = response.data;
            if(data.success){
                this.empcode.disabled = true;
                this.searchbtn.disabled = true;
                const blockresult = data.result.map(val => val.ElectionBlocks);
                blockresult.forEach((block)=>{
                    this.block.innerHTML += `
                    <option value="${block}">${block}</option>
                    `
                });
                this.block.disabled = false; 
            }
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }
    }

    async showdynamicElectionList(){
        try {
            const response = await axios.get("/getRandomizeEmpDetails",{
                params : {
                    ET : this.ET.value,
                    block : this.block.value,
                    code : this.empcode.value,
                }
            });

            const data = response.data;
            if(data.success){
                this.post = data.result[0].MatchedColumn;  // this is your P0/P1/P2/P3
                if(this.empcode.value !== ""){
                    this.tableparent.innerHTML = "";

                      if(data.result.length === 0){
                        this.tableparent.innerHTML =`
                        <h1 class = "nodatafoundmsg">No Data Found</h1>`;
                        return;
                        }
                    data.result.forEach((data)=>{
                        this.tableparent.innerHTML = `
                            <div class="tablecontainer">
                            <div class="electiontablecontainer">
                                <div class="electionheading">
                                    Election Name
                                </div>
                                <div class="electioncontentcontainer">
                                ${data.ElectionName}
                                </div>
                            </div>
                            <div class="blocktablecontainer">
                                <div class="blockheading">
                                    Block Name
                                </div>
                                <div class="blockcontentcontainer">
                                ${data.ElectionBlock}
                                </div>
                            </div>
                            <div class="pstablecontainer">
                                <div class="psheading">
                                    Polling Station Name
                                </div>
                                <div class="pscontentcontainer">
                                ${data.PS}</div>
                            </div>
                            <div class="Designationtablecontainer">
                                <div class="Designationheading">
                                    Designation Name
                                </div>
                                <div class="Designationcontentcontainer">
                                ${data.MatchedColumn}
                                </div>
                            </div>
                            <div class="codetablecontainer">
                                <div class="codeheading">
                                    Employee Code
                                </div>
                                <div class="codecontentcontainer">
                                    ${this.empcode.value}
                                    <button class="editcodebtn"><i class="fa-solid fa-pen-to-square innereditbtn"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="buttoncontainer">
                            <button class="clearlistbtn">Clear</button>
                            <button class="savechangebtn" disabled>Save</button>
                        </div>
                        `;
                    });
                }else{
                    this.tableparent.innerHTML = "";
                }
              
            }
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
                this.tableparent.innerHTML =`<h1 class = "nodatafoundmsg">No Data Found</h1>`;
            }
        }
    }

    async showleftoverlist(parent){
        try {
            const response = await axios.get("/getNonSelectedEmp",{
                params : {
                    ET : this.ET.value,
                    block : this.block.value,
                    p : this.post
                }
            });

            const data = response.data;
            if(data.success){
                parent.innerHTML = "";
                parent.innerHTML = `<div class = "dynamicuniqecodeparent"></div>`
                const child = parent.querySelector(".dynamicuniqecodeparent");
                data.codes.forEach((code)=>{
                    child.innerHTML += `<span class = "codescontainerchild">${code}</span>`
                });
                const codecontainer = document.querySelector(".codecontentcontainer");
                codecontainer.innerHTML += `${this.empcode.value}<button class="editcodebtn"><i class="fa-solid fa-xmark crossmarking"></i></button>`
                parent.classList.remove("hidden");

            }
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }
    }
    
    async SaveNewCodeValue(code){
        try {
            const id = localStorage.getItem("userid");
            const response = await axios.post("/InsertManualEmpCode",{
                ET : this.ET.value,
                Block : this.block.value,
                designation : this.post,
                password : this.alertpassword.value,
                id : id,
                prevcode : this.empcode.value,
                code
            });

            const data = response.data;
            if(data.success){
                this.empcode.value = data.code;
                this.pop.textContent = data.message;
                this.alertpassword.value = "";
                this.alertbg.classList.add("hidden");
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
            }
        } catch (error) {
            if (error.response) {
                        console.log("Error:", error.response.data.message); // server responded with error
                        const data = error.response?.data || { message: "Unknown error occurred." };
                        console.log(data);
                        this.alertheading.innerText = "Error Occurred";
                        this.alertmessage.innerText = `${data.message}`;
                        this.actiontype = "close";
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
                
            }
        }
    }
}


class PRIVATEPOSTS{
    constructor(){
        this.parent = document.querySelector(".privatePosts .privatechats");
        this.actioncolor = null;
        this.actionhandler = {
            Informational :() =>{
                return "2196F330"
            },
            LowPriority :() =>{
                 return "4CAF5030"
            },
            HighPriority :() =>{
                 return "FF980030"
            },
            Critical :() =>{
                 return "F4433630"
            }
        }
        this.init();
    }
    async init(){
        await this.loadPublicPosts();
    }

async loadPublicPosts() {
    const CACHE_DURATION = 5 * 10 * 1000; // 5 minutes
    const cached = localStorage.getItem("cachedPrivatePosts");
    const cachedTime = localStorage.getItem("cachedPrivatePostsTime");

    if (cached && cachedTime && (Date.now() - cachedTime < CACHE_DURATION)) {
        console.log("✅ Loaded from cache");
        const posts = JSON.parse(cached);
        this.renderPosts(posts);
        return;
    }

    try {
        const url = `/FetchPosts`;
        const hodname = localStorage.getItem("username");
        
        const response = await axios.get(url,{
            params : {
                value : 'Specific',
                hodname : hodname
            }
        });
        const data = response.data;

        if (data.success) {
        const posts = data.finalPosts;
        if(posts === 0 ){
            throw new Error("no data found");
        }
        // Store in cache
        localStorage.setItem("cachedPrivatePosts", JSON.stringify(posts));
        localStorage.setItem("cachedPrivatePostsTime", Date.now());

        console.log("🌐 Fetched from backend");
        this.renderPosts(posts);
        } else {
        console.error("❌ Backend response failed");
        }
    } catch (error) {
        console.error("❌ Fetch error:", error);
        }
    }

    renderPosts(posts) {
        posts.forEach(post => {

            this.parent.innerHTML += `
                    <div class="chat-message-box">
                            <div class="profiletabs">
                                <img src="./images/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="User" class="profile-pic" />
                            </div>
                        
                       
                        <div class="message-content">
                             <p class = "post_dmname">${post.Name}</p>
                            <div class="message-text">
                                ${post.message !== "None" ? post.message : ""}
                            </div>

                            <!-- This is the file/image container -->
                            <div class="message-file">
                            <!-- Image -->
                            ${post.File !== "None" ? this.renderFile(post.File):""}
                            </div>

                            <div class="message-meta">
                            <span class="message-date">${new Date(post.sent_at).toLocaleDateString()}</span>
                            <span class="message-time">${new Date(post.sent_at).toLocaleTimeString()}</span>
                            </div>

                        </div>
                    </div>`;
                    this.actioncolor = post.Priority.replace(/\s/g, "");;
                    let color = this.actionhandler[this.actioncolor](); // returns hex like 'FF9800'
                    let lastBox = this.parent.querySelectorAll(".chat-message-box");
                    lastBox[lastBox.length - 1].style.backgroundColor = `#${color}`;       
        });
    }

renderFile(file) { 
    if (file.endsWith(".pdf")) {
        return `<a href="${file}" target="_blank" class="attached-file">📄 View PDF</a>`;
    } else if (file.endsWith(".jpeg") || file.endsWith(".jpg") || file.endsWith(".png")) {
        return `<img src="${file}" class="attached-image">`;
    } else {
        const frame = document.querySelector(".message-file");
        frame.classList.add("hidden");
    }
}

}

new TOPBAR();
new WELCOMEPAGE();
new SIDENAV()
new CREATEEMPACCOUNT();
const viewempRelaod = new VIEWEMPLOYEE();
new PublicPosts();
new CHANGEDUTY();
new PRIVATEPOSTS();