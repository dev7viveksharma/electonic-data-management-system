import { options } from './offices.js';
class EDITPROFILE{
    constructor(){
        this.code = localStorage.getItem("employeeCode");
        this.sessionkey = sessionStorage.getItem("secretkey");
        this.urlparams = new URLSearchParams(window.location.search);
        this.urltoken = this.urlparams.get("token");
        console.log(this.sessionkey);
        this.codecontainer = document.querySelector(".EmpCode .signupinput");
        this.form = document.querySelector(".js_signup_form");
        this.pop = document.querySelector(".Popups");
        this.fullName = document.querySelector(".js_signup_name");
        this.signupPassword = document.querySelector(".js_password");
        this.signupBtn = document.querySelector(".signup_btn");
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
        this.savebtn = document.querySelector(".submit_btn");
        this.deletebtn = document.querySelector(".delete_btn");
        this.alertbg = document.querySelector(".alertbg");
        this.closebtn = document.querySelector(".close_btn");
        this.confirmbtn = document.querySelector(".confirm_btn");
        this.alertmessage = document.querySelector(".alert_message");
        this.alertheading = document.querySelector(".alert_heading");
        this.alertpassword = document.querySelector(".alert_password");
        this.essentialfield = document.querySelectorAll(".js_editempty");
        this.home = document.querySelector(".homepage i");
        this.actiontype = null;
        this.imagepath ="";
        this.documentpath = "";
        this.actionhandlers = {
            deleteuser : () => {
                this.deleteProfile();
            },
            editsave : () => {
                this.SaveProfile();
            },
            close : () =>{
                this.alertbg.classList.add("hidden");
                this.alertpassword.value = "";
            }

        }
        this.init();
        this.radio();
    }

    init(){
        if(this.urltoken !== this.sessionkey){
            alert("Access denied ❌");
            window.location.replace = " dashboard.html";
        }
        window.addEventListener("error", (e) => {
          console.error("Global Error:", e.message);
        });
        window.addEventListener("beforeunload", () => {
        console.warn("Page is reloading!");
        });
        this.calldata(this.code);
        this.signupPassword.addEventListener("click",()=>{
            this.signupPassword.value = "";
            this.signupPassword.type = "text";
        });

        this.signupPassword.addEventListener("input",(event)=>{
            this.validateSignupPassword(event);
        });
        this.signupPassword.addEventListener("blur",() => {
             if(this.signupPassword.value === ""){
                this.signupPassword.value = this.temppassword;
            }
            this.signupPassword.type = "Password";
            const existingError = document.querySelector("#signupError");
            if (existingError) existingError.remove();  // Remove error message when input loses focus
           
        });
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
        this.empform.forEach((emp)=>{
            emp.addEventListener("change",()=>{
            this.savebtn.disabled = false;
        });
        })
       
        this.savebtn.addEventListener("click",(e)=>{
            this.savechanges(e);
        });
        this.deletebtn.addEventListener("click",(e)=>{
            this.deleteemp(e);
        });
        this.closebtn.addEventListener("click",()=>{
            this.alertbg.classList.add("hidden");
            const err = document.querySelector("#alertError");
            if(err){
                err.remove();
            }
        });
        this.confirmbtn.addEventListener("click",()=>{
            if(this.alertpassword.value === ""){
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

        this.home.addEventListener("click",()=>{
            sessionStorage.removeItem("secretkey");
            window.location.replace(`dashboard.html`);
        })
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

    async calldata(code){
        try {
            const url = `/calldataForEdit`;
            const response = await axios.get(url,{
                params: {code}
            });
            const data = response.data;

        if(data.success){
            console.log(data.data);
            this.insertbackenddata(data.data);
        }
        } catch (error) {
            
        }
    }

    insertbackenddata(data){
        this.codecontainer.textContent = data[0].Employee_code;
        this.fullName.value = data[0].Employee_FName +" "+ data[0].Employee_LName;
        this.mobileNum.value = data[0].Mobile_Number;
        this.signupPassword.value = data[0].Employee_Password;
        this.temppassword = data[0].Employee_Password;
        this.dob.value = data[0].Date_of_Birth.split("T")[0];
        this.home_district.value = data[0].Home_District;
        this.Designation.value = data[0].Designation;
        const radioToSelect = document.querySelector(`input[name="gender"][value="${data[0].Gender}"]`);
        if (radioToSelect) {
            radioToSelect.checked = true;
            this.checkgenders();
        }
        const radioTodisabled = document.querySelector(`input[name="disabled"][value="${data[0].Differently_abled}"]`);
        if (radioTodisabled) {
            radioTodisabled.checked = true;
            this.checkdisabled();
            if(radioTodisabled.value === "Yes"){
                this.type_disability.value = data[0].Type_of_Disability;
                this.percentage_of_disability.value = data[0].Percentage_of_Disability;
            }
        }
        const radioTovd = document.querySelector(`input[name="exp_voting"][value="${data[0].Experience_in_Voting_Duties}"]`);
        if (radioTovd) {
            radioTovd.checked = true;
        }
        const radioTocd = document.querySelector(`input[name="exp_counting"][value="${data[0].Experience_in_Counting_Duties}"]`);
        if (radioTocd) {
            radioTocd.checked = true;
        }
        const radioTood = document.querySelector(`input[name="other_works"][value="${data[0].Experience_in_Other_Election_Related_Work}"]`);
        if (radioTood) {
            radioTood.checked = true;
        }

        this.service.value = data[0].Type_of_Service;
        this.classes.value = data[0].Class;
        this.pay_scale.value = data[0].Pay_Scale;
        this.supervisory.value = data[0].Supervisory;
        this.officeinput.value = data[0].Office;
        this.Goverment.value = data[0].Government;
        this.Tec.value = data[0].Treasury_Employee_Code;
        this.empStatus.value = data[0].Employee_Status;
        this.dor.value = data[0].Date_of_Retirement.split("T")[0];
        this.NameVoterList.value = data[0].Name_Present_in_Chhattisgarh_Voter_List;
        this.voterListAssembly.value = data[0].Voter_List_Assembly;
        this.voterPartNumber.value = data[0].Voter_Part_Number;
        this.serialNumber.value = data[0].Voter_Serial_Number;
        this.epic.value = data[0].EPIC_Number;
        this.Acr.value = data[0].Assembly_Constituency_of_Residence;
        this.Acw.value = data[0].Assembly_Constituency_of_Workplace;
        this.currentBasicPay.value = data[0].Current_Basic_Pay;
        this.dcbp.value = data[0].Date_of_Current_Basic_Pay.split("T")[0];
        this.bankName.value = data[0].Bank_Name;
        this.branchCode.value = data[0].Branch_Code;
        this.accountNo.value = data[0].Account_Number;
        this.ifsc.value = data[0].IFSC_Code;
        this.remarks.value = data[0].Remark;
        this.previewImage.src = data[0].Employee_Image;
        this.checkexpcounting();
        this.checkexpother();
        this.checkexpvoting();
    }

    callactionhandler(action){
        if(this.actionhandlers[action] && action !== null){
            this.actionhandlers[action]();
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
    }
    checkdisabled() {
    const selected = document.querySelector('input[name="disabled"]:checked');
    if (selected && selected.value === "Yes") {
        document.querySelector(".disability").classList.remove("hidden");
        document.querySelector(".percentage_of_diability").classList.remove("hidden");
        document.querySelector(".certificate").classList.remove("hidden");
        } else {
        document.querySelector(".disability").classList.add("hidden");
        document.querySelector(".percentage_of_diability").classList.add("hidden");
        document.querySelector(".certificate").classList.add("hidden");
        this.type_disability.value = "";
        this.percentage_of_disability.value = "";
        }
        this.diffrentlyabled = selected.value;
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
    

    deleteemp(e){
        e.preventDefault();
        this.alertheading.innerText = ` Delete Employee Profile`;
        this.alertmessage.innerText = `Are you sure you want to permanently delete ${this.fullName.value} employee profile ? This action cannot be undone`;
        this.actiontype = "deleteuser";
        this.alertbg.classList.remove("hidden");
    }

    savechanges(e){
        e.preventDefault();
        this.alertheading.innerText = ` Save Employee Profile Changes ?`;
        this.alertmessage.innerText = `Are you sure you want to permanently Save ${this.fullName.value} employee profile Chaneges ? This action cannot be undone`;
        this.actiontype = "editsave";
        this.alertbg.classList.remove("hidden");
    }

async deleteProfile(){
    try {
        const id = localStorage.getItem("userid");
        const url = `/deleteProfile`;
        const response = await axios.delete(url,{
            params : {code : this.code ,
                userid : id,
                password : this.alertpassword.value,
            }
        });

        const data = response.data;

            if(data.success){
                alert(`${data.message}`);
                window.location.href = `dashboard.html`;
                sessionStorage.removeItem("secretkey");

            }
        } catch (error) {
            const data = error.response?.data || { message: "Unknown error occurred." };
            console.log(data);
            this.alertheading.innerText = "Error Occurred";
            this.alertmessage.innerText = `${data.message}`;
            this.actiontype = "close";
        }
    }

    async SaveProfile(){
        console.log("hit")
            this.essentialfield.forEach((data)=>{
                if(data.value === ""){
                    this.alertheading.innerText = "Error Occurred";
                    this.alertmessage.innerText = `Fields Are Empty Please Check Before Saving`;
                    this.actiontype = "close"
                    return ;
                }
            });
                try{
                console.log(this)
                console.log("hit try block");
                const [firstName, ...rest] = this.fullName.value.split(" ");
                const lastName = rest.join(" ");
                const userid = localStorage.getItem("userid");
                console.log("Debug Fields:");
                console.log("alertpassword :", this.alertpassword?.value);
                console.log("Designation :", this.Designation?.value);
                console.log("type_disability :", this.type_disability?.value);
                console.log("percentage_of_disability :", this.percentage_of_disability?.value);
                console.log("service :", this.service?.value);
                console.log("classes :", this.classes?.value);
                console.log("pay_scale :", this.pay_scale?.value);
                console.log("supervisory :", this.supervisory?.value);
                console.log("Department :", this.Department?.value);
                console.log("officeinput :", this.officeinput?.value);
                console.log("Goverment :", this.Goverment?.value);
                console.log("Tec :", this.Tec?.value);
                console.log("empStatus :", this.empStatus?.value);
                // Add more as needed

                const url ="/editProfilesave";
                const response = await axios.post(url , {
                    adminid : userid,
                    adminpass : this.alertpassword.value,
                    code : this.code,
                    Fname : firstName,
                    Lname : lastName,
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
                        this.empDepartment();
                        this.alertbg.classList.add("hidden");
                        this.alertpassword.value = "";
                        this.pop.textContent = `${data.message} `;
                        this.pop.style.opacity = "1";
                        setTimeout(() => {
                            this.pop.style.opacity = "0";
                        }, 3000);

                    }
                }catch(error){
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

new EDITPROFILE();