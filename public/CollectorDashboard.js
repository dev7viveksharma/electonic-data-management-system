class NAVBAR{
    constructor(){
    this.Tabs = document.querySelectorAll(".jsbtn");
    this.dropMenu = document.querySelector(".js_dropMenu");
    this.bar = document.querySelector(".js_bars");
    this.home = document.querySelector(".homePage");
    this.profile = document.querySelector(".Profile");
    this.logoutBtn = document.querySelector(".logout");
    this.backicon = document.querySelector(".js_backicon");
    this.editSection = document.querySelector(".DM_profile");
    this.Password = this.editSection.querySelector(".DM_Password");
    this.adminName = this.editSection.querySelector(".DM_FullName");
    this.mobile = this.editSection.querySelector(".DM_Mobileno");
    this.email = this.editSection.querySelector(".DM_EmailAddress");
    this.District = this.editSection.querySelector(".DM_District");
    this.editBtn = this.editSection.querySelector(".DMeditbtn");
    this.companylogo = document.querySelector(".companyLogoContainer .CompanyLogo");
    this.Init();
    this.active = null;
    this.activeNav = null;
    }

    Init(){
        this.DMProfile();
        this.Tabs.forEach((tabs)=>{
            tabs.addEventListener("click",()=>{
            const activetab = tabs.getAttribute("data-tab");
            this.showpages(tabs,activetab);
            });
        });
        this.bar.addEventListener("click",(event)=>this.showdropmenu(event));
        this.logoutBtn.addEventListener("click",(event)=>this.backtologin(event));
        this.profile.addEventListener("click",()=>this.showadmineditpage());
        this.backicon.addEventListener("click",()=>this.hideAdminEdit());
        this.editBtn.addEventListener("click",()=>this.editProfile());
        this.companylogo.addEventListener("click",()=>{
            window.location.href = "/Home";
        });


    }
    showpages(tabs,navItem){
        if(this.active){
            this.active.classList.remove("ShowEmployeeSignupPage");
            // this.Employeeform.classList.toggle("ShowEmployeeSignupPage");
        }
        if (this.activeNav) {
            this.activeNav.classList.remove("activetab");
        }

        const newTab = document.querySelector(`.${navItem}`);

        if(newTab){
            newTab.classList.add("ShowEmployeeSignupPage");
            this.active = newTab;

        }
        tabs.classList.add("activetab");
        this.activeNav = tabs;


    }

    showdropmenu(){
        this.dropMenu.classList.toggle("drop");
        this.bar.classList.toggle("active");
    }

    backtologin(){
    // Clear token from localStorage
    localStorage.removeItem('Name');

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

    async DMProfile(){
        const empdesignation = localStorage.getItem("District");
        const username = localStorage.getItem('dmname');
        this.adminName.textContent = username;
        this.District.textContent = empdesignation;
        try {
            const id = localStorage.getItem("dmId");
            const url = '/DMdata';
            const response = await axios.get(url,{ params: { id: id }});

            const data = response.data.result;
            const list = data.map(dm =>({
                mnum : dm.MobileNumber,
                email : dm.Email,
                Password : dm.Password,
            }));
            console.log(username , empdesignation , id);

            for(let i of list){
            this.mobile.textContent = i.mnum;
            this.email.textContent = i.email;
            this.Password.textContent = i.Password
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
                this.inputpassword = document.createElement("input");

                this.inputName.classList = "editableinputFieldName";
                this.inputEmail.classList = "editableinputFieldEmail";
                this.inputNum.classList = "editableinputFieldNumber";
                this.inputpassword.classList = "editableinputFieldPassword";

                this.inputName.value = this.adminName.textContent;
                this.inputEmail.value = this.email.textContent;
                this.inputNum.value = this.mobile.textContent;
                this.inputpassword.value = this.Password.textContent;

                this.inputName.type = "text";
                this.inputEmail.type = "email";
                this.inputNum.type = "tel";
                this.inputpassword.type = "text";

                this.originalname = this.adminName.textContent;
                this.originalnum = this.mobile.textContent;
                this.originalmail = this.email.textContent;
                this.originalpassword = this.Password.textContent;
                
                this.adminName.replaceWith(this.inputName);
                this.mobile.replaceWith(this.inputNum);
                this.email.replaceWith(this.inputEmail);
                this.Password.replaceWith(this.inputpassword);
                this.editBtn.textContent = "Done";
                this.isedit = true;
        }else{
            try {
                const adminname = document.createElement("p");
                const adminmail = document.createElement("p");
                const adminmnum = document.createElement("p");
                const adminPassword = document.createElement("p");

                adminmnum.classList = "DM_Mobileno";
                adminmail.classList = "DM_EmailAddress";
                adminname.classList = "DM_FullName";
                adminPassword.classList = "DM_Password";

                adminname.textContent = this.inputName.value;
                adminmail.textContent = this.inputEmail.value;
                adminmnum.textContent = this.inputNum.value;
                adminPassword.textContent = this.inputpassword.value;

                this.inputName.replaceWith(adminname);
                this.inputEmail.replaceWith(adminmail);
                this.inputNum.replaceWith(adminmnum);
                this.inputpassword.replaceWith(adminPassword);

                this.adminName = adminname;
                this.email = adminmail;
                this.mobile = adminmnum;
                this.Password = adminPassword;

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

class HOD {
    constructor(){
        this.dropdownArrow = document.querySelector(".dropdownArrowHod");
        this.innercontainer = document.querySelector(".listOfHODs");
        this.searchbox = document.querySelector(".HodSearch");
        this.searchbtn = document.querySelector(".hodsearchBtn");
        this.pop = document.querySelector(".PopUPMessageContainer");
        this.init();
    }
    init(){
        this.showHods()
        this.arrowfunction(this.dropdownArrow);
        this.searchbox.addEventListener("input",()=>this.searchEmployeesdata(this.innercontainer));
        this.searchbtn.addEventListener("click",()=>this.searchEmployeesdata(this.innercontainer));
        this.innercontainer.addEventListener("click", async (event) => {
        const target = event.target;

        // Check if the clicked element is a button inside .block_Unblock inside .HodList
            if (target.tagName === "BUTTON" && target.closest(".HodList") && target.closest(".block_Unblock")) {
                await this.HodblockUnblock(target); // or pass more info if needed
            }
        });


    }


    arrowfunction(arrow){
        const List = arrow.closest('.Hod_heading')?.querySelector('.listOfHODs');
        if(List){
           const container =  varifiedList.querySelectorAll(".HodList");
           box.classList.toggle("hidden");
        }
    }

async showHods(){
        try {
            const url = `/Hods`
            const response = await axios.get(url);
            let data = response.data.result;
            console.log(data);
             let Heads = data.map(hods=>({
              hodname : hods.adminName,
              hodemail : hods.adminEmail,
              hodmnum : hods.adminMobileNo,
              hodDesignation : hods.adminDesignation,
              status : hods.status
            }));
            this.createhHODlist(Heads);
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
                
            }
        }
    }
    createhHODlist(Heads){
        for(const data of Heads){
            this.innercontainer.innerHTML+=`
            <div class="HodList">
                <div class="hoddetails">
                    <div class="hod_name">
                        <p>Hod Name</p>
                        <p class="empName">${data.hodname}</p>   
                    </div>
                    <div class="hod_email">
                        <p>Hod Email Address</p>
                        <p class="empEmail">${data.hodemail}</p>
                    </div>
                    <div class="hod_mobileNumber">
                        <p>Hod Mobile Number</p>
                        <p class="empMNum">${data.hodmnum}</p>
                    </div>
                    <div class="hod_department">
                        <p>Hod Designation</p>
                        <p class="empDepartment">${data.hodDesignation}</p>
                    </div>
                </div>
                <div class="block_Unblock">
                    <button class="block_UnblockBtn" type="button">${data.status}</button>
                </div>
            </div>
            `;
        }
    }


    searchEmployeesdata(content){
        const hodlist = content.querySelectorAll(".HodList");
        hodlist.forEach((list)=>{
            const name = list.querySelector(".hod_name")?.textContent.toLowerCase() || "";
            if(!name.includes(this.searchbox.value.toLowerCase())){
                list.classList.add("hidden");
            }else{
                list.classList.remove("hidden");
            }
        });    
    }

async  HodblockUnblock(button){
        try {
            const hodCard = button.closest(".HodList");

            // Now get all the dynamic data from within this .HodList
            const empName = hodCard.querySelector(".hod_name .empName")?.textContent.trim();
            const empEmail = hodCard.querySelector(".hod_email .empEmail")?.textContent.trim();
            const empMobile = hodCard.querySelector(".hod_mobileNumber .empMNum")?.textContent.trim();
            const empDesignation = hodCard.querySelector(".hod_department .empDepartment")?.textContent.trim();
 

        const response = await axios.post(`/blockHods`,{
                        action : button.textContent,
                        empEmail,
                        empName,
                        empMobile,
                        empDesignation
                    });

        const data = response.data;
        if(data.success){
            button.textContent = data.action;
             this.pop.textContent = `${data.name} is now ${data.action}`;
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
        }
        } catch (error) {
            
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
            const response = await axios.get("http://localhost:8080/headVarifiedEmployee");
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
            const response = await axios.get("http://localhost:8080/headNonVarifiedEmployee");
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
                </div>
            </div>
            `;
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
                </div>
            </div>
            `;
        }
      }
    }

    async verifyEmp(btn){
        const parent_container = btn.closest('.EmployeeList');
        const Empcode = parent_container.querySelector(".empcode").textContent.trim();

        if(btn.classList.contains("varifyBtn")){
        try {
            const url = "http://localhost:8080/varify";


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
            const url = "http://localhost:8080/unvarify";


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

class ELECTIONPLACEMENT{
    constructor(){
        this.TypeElection = document.querySelector(".electiontype");
        this.electionblocksinput = document.querySelector(".ElectionBlocksinput");
        this.electionBlocklist = document.querySelector(".electionBlocklist");
        this.TotalBooth = document.querySelector(".pollingNumbers");
        this.pollingstation = document.querySelector(".psInput"); 
        this.listofps = document.querySelector(".listofps");
        this.totalEmpNeedForPs = document.querySelector(".Empforpolls");
        this.resetbtn = document.querySelector(".ResetElectionData");
        this.alertbg =  document.querySelector(".alertbg");
        this.alertbox = document.querySelector(".alertbox");
        this.alertboxheading = document.querySelector(".alertheading h3");
        this.alertboxmsg = document.querySelector(".alertmsg ");
        this.alertbtn = document.querySelector(".alertconfirm button");
        this.xmark = document.querySelector(".crossmark");
        this.pages = document.querySelectorAll(".inActive");
        this.nextbtn = document.querySelector(".nextBtn");
        this.savebtn = document.querySelector(".savebtn");
        this.backbtn = document.querySelector(".backbtn");
        this.P0container = document.querySelector(".P0BODY");
        this.P1container = document.querySelector(".P1BODY");
        this.P2container = document.querySelector(".P2BODY");
        this.P3container = document.querySelector(".P3BODY");
        this.P0Totalseats = document.querySelector(".ReqEmpNumbersP0");
        this.P1Totalseats = document.querySelector(".ReqEmpNumbersP1");
        this.P2Totalseats = document.querySelector(".ReqEmpNumbersP2");
        this.P3Totalseats = document.querySelector(".ReqEmpNumbersP3");
        this.clearAllPosts = document.querySelector(".clearAllPosts");
        this.postserr = document.querySelector(".postserror");
        this.postserr2 = document.querySelector(".postserror2");
        this.dmid = localStorage.getItem("dmId");
        this.psList = [];
        this.init();
        this.documents();
        this.resetAlertResponse = 0;
        this.actiontype = null; 
        this.currentpage = 0;
        this.AmountofPS = 0;
        this.checkDesignationEmpCountP0 = 0;
        this.checkDesignationEmpCountP1 = 0;
        this.checkDesignationEmpCountP2 = 0;
        this.checkDesignationEmpCountP3 = 0;
        this.p0array = [];
        this.p1array = [];
        this.p2array = [];
        this.p3array = [];
        this.currentCheckedP0 = 0;
        this.currentCheckedP1 = 0;
        this.currentCheckedP2 = 0;
        this.currentCheckedP3 = 0;
        this.TotalContainerBoxP0 = 0;
        this.TotalContainerBoxP1 = 0;
        this.TotalContainerBoxP2 = 0;
        this.TotalContainerBoxP3 = 0;
        this.extravalueP0 = 0;
        this.extravalueP1 = 0;
        this.extravalueP2 = 0;
        this.extravalueP3 = 0;
        this.extravalueP1Array = [];
        this.extravalueP2Array = [];
        this.extravalueP3Array = [];
        this.actionhandlers ={
            resetPolls : async ()=>{
               await this.reset1();
               await this.deleteAllPostsDetails();
            },

            resetNone : ()=>{
                this.alertbg.classList.add("hidden");
            },

            InsertElectionData : ()=>{
                this.datainsertion();
            },

            pagechange : ()=>{
                this.changepage();
            },
            
            resetAllPosts : async ()=>{
                this.clearPostSelection();
                await this.deleteAllPostsDetails();
            },

            page2completion : () =>{
                this.cleanpage2();
                this.backpage();

            }
        }

       
    }

    documents(){
        document.addEventListener("click",(event)=>{
            if (this.listofps && !this.listofps.contains(event.target)) {
               this.listofps.classList.add("hidden");
               this.postserr2.innerText = "";
            }
        });

        this.mutationbeservation();
    }
    init(){
        this.TypeElection.addEventListener("change",()=>{
            this.clearlist();
            this.showblockList();
        });
        this.electionblocksinput.addEventListener("click",()=>{
            this.showlistdropmenu();
        });


        this.pollingstation.addEventListener("click", async (event) => {
            event.stopPropagation();

            await this.showps(); 

            const psChecks = document.querySelectorAll(".js_ps_checkpoint");
            try {
                const response = await axios.get("/getallpoollsdata");
                const polls = response.data.result.map(item=>item.PS);
                console.log(polls)
                psChecks.forEach((poll) => {
                    polls.forEach((ps)=>{
                        if(ps === poll.value){
                            poll.checked = true;
                            poll.disabled = true;
                            
                        }
                    })
                if (this.psList.some((data) => data.ps === poll.value)) {
                    poll.checked = true;
                }
            });
            
            this.addps(this.TotalBooth.value);
            psChecks.forEach((chk) => {
                chk.addEventListener("change", () => this.addps(this.TotalBooth.value));
            });
            } catch (error) {
                if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
            }

        });


        this.resetbtn.addEventListener("click",()=>{
            this.resetAlertResponse = 1;
            this.showresetAlert();
        });
        this.xmark.addEventListener("click",()=>{
            this.alertbg.classList.add("hidden");
        });

        this.alertbtn.addEventListener("click",()=>{
            this.alertconfirm(this.actiontype);

        });

        this.nextbtn.addEventListener("click",()=>{
            this.next();
            this.alertbg.classList.remove("hidden");
        });
        this.savebtn.addEventListener("click",()=>{
            this.savedata();
            this.alertbg.classList.remove("hidden");
        });
        this.backbtn.addEventListener("click",()=>{
            this.backpage();
            this.cleanpage2();
            this.savebtn.disabled = false;
        });

        this.clearAllPosts.addEventListener("click",()=>{
            this.resetAlertResponse = 2;
            this.showresetAlert();
        });

    
    }

  mutationbeservation() {
    const observer = new MutationObserver((mutation, obs) => {
        const P0Checkbox = this.P0container.querySelectorAll(".officerinputcheckbox");
        const P1Checkbox = this.P1container.querySelectorAll(".officerinputcheckbox");
        const P2Checkbox = this.P2container.querySelectorAll(".officerinputcheckbox");
        const P3Checkbox = this.P3container.querySelectorAll(".officerinputcheckbox");

        if (
            P0Checkbox.length &&
            P1Checkbox.length &&
            P2Checkbox.length &&
            P3Checkbox.length
        ) {
            obs.disconnect(); // stop observing
          this.bindOfficerCheckboxEvents(P0Checkbox,P1Checkbox,P2Checkbox,P3Checkbox);
        }
    });

    // ✅ Start observing OUTSIDE the callback
    observer.observe(document.querySelector(".EmpDesignationBody"), {
        childList: true,
        subtree: true,
    });
}


bindOfficerCheckboxEvents(P0Checkbox,P1Checkbox,P2Checkbox,P3Checkbox){

      const arr = [P0Checkbox,P1Checkbox,P2Checkbox,P3Checkbox];
            const targetArrays = ["p0array", "p1array", "p2array", "p3array"];
            targetArrays.forEach(name => {
            if (!Array.isArray(this[name]) || this[name].length === 0) {
            this[name] = [];
            }
            });

            arr.forEach((group, index)=>{
                group.forEach(async(chk)=>{
                    chk.addEventListener("change",()=>{
                         const key = `P${index}`;
                         const posts = this.officerposts[key];  // Array of { post, selection, count }
                         const matchedPost = posts.find(p => p.post === chk.value);
                        if(chk.checked){
                            this[targetArrays[index]].push(chk.value);
                            if(Number(matchedPost.count === 0)){
                                this.postserr.innerText = `${chk.value} have no Employees either not available or not varified`;
                            }
                            this[`checkDesignationEmpCountP${index}`] += Number(matchedPost.count);
                            this[`currentCheckedP${index}`]++;
                            this.checkseatwithEmployees(this[`checkDesignationEmpCountP${index}`],this[`P${index}Totalseats`],this[`currentCheckedP${index}`],this[`TotalContainerBoxP${index}`],index,0,false);

                        }else{
                            this[targetArrays[index]] = this[targetArrays[index]].filter(val => val !== chk.value);
                            this[`checkDesignationEmpCountP${index}`]-= Number(matchedPost.count);
                            this[`currentCheckedP${index}`]--;
                            this.checkseatwithEmployees(this[`checkDesignationEmpCountP${index}`],this[`P${index}Totalseats`],this[`currentCheckedP${index}`],this[`TotalContainerBoxP${index}`],index,0,false);
                        }
                    });
                });
            });

        this.AddedlistP1 = document.querySelector(".P1ADDNEW .PLUSBORDER");
        this.AddedlistP2 = document.querySelector(".P2ADDNEW .PLUSBORDER");
        this.AddedlistP3 = document.querySelector(".P3ADDNEW .PLUSBORDER");
        this.AddedlistP1.addEventListener("click",()=>this.createExtraList("P1",1));
        this.AddedlistP2.addEventListener("click",()=>this.createExtraList("P2",2));
        this.AddedlistP3.addEventListener("click",()=>this.createExtraList("P3",3));

}


async showblockList(){
        try {
            const url = `http://localhost:8080/blockList`;
            const response = await axios.get(url,{
               params :{Election : this.TypeElection.value} 
            });
            const data = response.data;

            if(data.success){
                this.electionBlocklist.innerHTML = ""
                data.result.forEach((data)=>{
                    this.electionBlocklist.innerHTML +=`
                    <div class="BlockNames">${data.ElectionBlocks}</div>
                    ` ;
                    this.nextbtn.disabled = false;
                });
                
                this.insertBlock(this.TypeElection.value);
                this.insertElectionType(this.TypeElection.value);
            }
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }
    }

    clearlist(){
        const field = document.querySelectorAll(".R2");
        field.forEach((f)=>{
            f.value = "";
            f.disabled = false;
            this.psList = [];
        });
        const p = document.querySelector(".pollingNumbers");
        const emp = document.querySelector(".Empforpolls");
        p.disabled = true;
        emp.disabled = true;
    }

    showlistdropmenu(){
        this.electionBlocklist.classList.toggle("hidden");
        this.blocklist = document.querySelectorAll(".BlockNames");
        this.selectOptions(this.blocklist);
        
    }

 selectOptions(list){
    this.electionblocksinput.value = "";
        list.forEach((options)=>{
            options.addEventListener("click",async()=>{
                
                this.electionblocksinput.value =  options.textContent;
                this.electionBlocklist.classList.add("hidden");
                try {
                    const url = `/showPSdata`;
                    const response = await axios.get(url,{
                        params:{
                                ET : this.TypeElection.value,
                                block : this.electionblocksinput.value,
                                id : this.dmid
                        }
                    });
                    const data = response.data;
                    if(data.success && data.result.length > 0){
                        this.psList = data.result.map(item => item.PS);
                        this.pollingstation.value = this.psList.join(); 
                        this.pollingstation.disabled = true;
                        let i = this.psList.length;
                        this.calculatepolls(i);
                    }
                    if(data.result.length === 0){
                        this.pollingstation.disabled = false;
                        this.pollingstation.value = "";
                        this.calculatepolls(0);
                    }
                        this.showtotalBooth()
                } catch (error) {
                    if (error.response) {
                    console.log("Error:", error.response.data.message); // server responded with error
                    } else {
                        console.log("Error:", error.message); // other errors (network etc.)
                    }
                }
                
            });
        });
    }

async showtotalBooth(){
    try {
        const url = `http://localhost:8080/TotalBooths`;
        const response = await axios.get(url,{
            params : {block : this.electionblocksinput.value,
                      Election : this.TypeElection.value
            }
        });

    const data = response.data;

    if(data.success && data.result.length > 0){
        this.TotalBooth.value = data.result[0].NumberofBooths;
    }

    } catch (error) {
          if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
    }
    }

  async showps(){
        if(this.TotalBooth.value != ""){
            this.listofps.classList.remove("hidden");
            try {
            const response = await axios.get(`/maxpoll`,{
                params : {
                    ET : this.TypeElection.value
                }
            });
            const length = parseInt(response.data.result);
            console.log("here",length);
            this.listofps.innerHTML = "";
            for(let i = 1 ; i<= length ; i++){
                this.listofps.innerHTML +=`
                <div  class ="PsOptionsContainer">
                <label class ="PsRadiolist"> PS-${i}</label>
                <input type="checkbox" name="PoolingStation" value="PS${i}" class="js_ps_checkpoint">
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
    }

    addps(max) {
        const checkboxes = document.querySelectorAll(".js_ps_checkpoint");
        const updatedList = [];
        let totalLimit = max;
        let currentchecked = 0 ;
        checkboxes.forEach((ps) => {
            if (ps.checked && !ps.disabled) {
                updatedList.push({ ps: ps.value });
                currentchecked++ ;
            }
        });

        checkboxes.forEach((ps)=>{
            if(!ps.checked){
                ps.disabled = (currentchecked >= totalLimit);
            }
        });
        if(currentchecked < totalLimit && currentchecked !== 0){
                    this.postserr2.innerText = " Currently Selected Polling Stations are under the Given Limit";
        }else{
            this.postserr2.innerText = "";
        }

        this.psList = updatedList;
        // Update input and employee count
        this.pollingstation.value = this.psList.map(p => p.ps).join(",");
        this.electionblocksinput.disabled = updatedList.length > 0;
        this.calculatepolls(this.psList.length);
    }



    calculatepolls(i){
                const base = i * 4;
                const extra = Math.ceil(base * 0.05); // rounds up to the next whole number
                this.totalEmpNeedForPs.value = base + extra;
    }

    insertBlock(data){
        const block = document.querySelector(".blocklabel");
        const label =  data.replace("Elections","");
        block.innerText = "Select " + label;
    }

    insertElectionType(data){
        const label = document.querySelector(".ETLabel");
        const input = document.querySelector(".ETInput");
        input.value = data;
        label.innerText = "Employees Selection for " + data;
        input.classList.remove("hidden");
        this.callEmpPosts(input.value);
    }

    showresetAlert(){
        if(this.TypeElection.value === ""){
            this.alertboxheading.innerText = "NO DATA SELECTED FOR RESET";
            this.alertboxmsg.innerHTML =`<p><strong>⚠️ Warning Please Select Type of Election if you want to Reset </strong></p>
                                        `;
            this.actiontype = "resetNone";
        }else if(this.resetAlertResponse === 1){
            this.alertboxheading.innerText = "RESET ELECTION POLLING DATA";
            this.alertboxmsg.innerHTML =`<p><strong>⚠️ Are you sure you want to reset this data?</strong></p>
                                        <p>This action will:</p>
                                        <p>1: Clear the fields on this page</p>
                                        <p>2: Permanently delete the associated data from the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "resetPolls";
        }else if(this.resetAlertResponse === 2){
            console.log("hitting reset 2")
            let flag = true;
            for(let i = 0 ; i < 4 ; i++){
                if(this[`currentCheckedP${i}`] === 0){
                    flag = false;
                }
                console.log("loop");
            }
            if(!flag){
                this.alertboxheading.innerText = "NO DATA SELECTED FOR RESET";
                this.alertboxmsg.innerHTML =`<p><strong>⚠️ Warning Please Select Posts First </strong></p>
                                            `;
                this.actiontype = "resetNone";
                this.alertbg.classList.remove("hidden");
                return;
            }
            this.alertboxheading.innerText = "RESET ELECTION POSTS DATA";
            this.alertboxmsg.innerHTML =`<p><strong>⚠️ Are you sure you want to reset this data?</strong></p>
                                        <p>This action will:</p>
                                        <p>1: Clear the fields on this page</p>
                                        <p>2: If Backend Data Exist then it will Permanently delete the associated data from the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "resetAllPosts";
        }
        this.alertbg.classList.remove("hidden");
        
    }

    alertconfirm(action){
        if(this.actionhandlers[action] && action !== null){
            this.actionhandlers[action]();
        }
        
    }
  async next(){
        if(this.currentpage === 0){
            const pageresponse = await this.page1();
                if(!pageresponse){
                this.alertboxheading.innerText = `${this.TypeElection.value} data Not Found `;
                this.alertboxmsg.innerHTML =`<p><strong>⚠️ Warning Please Enter All Election Data if you want to Continue </strong></p>
                                            `;
                this.actiontype = "resetNone";
                return ;
                }
            
            this.alertboxheading.innerText = "Continue With Existing Data";
            this.alertboxmsg.innerHTML=`<p><strong>⚠️ Are you sure you want to Proceed further ?</strong></p>
                                        <p>This action will:</p>
                                        <p>Further Action Will Be Perform Over Existing Data</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "pagechange"
            this.loadNumberOfPS();
            this.loadofficersposts();
            return;
        }if(this.currentpage === 1){
            const et = document.querySelector(".ETInput").value;
            const page2response = await this.checkselectedPost();
            if(!page2response){
            this.alertboxheading.innerText = `${et} STORED DATA DON'T MATCH`;
            this.alertboxmsg.innerHTML =`<p><strong>⚠️ Warning Please Confirm Your Data is Saved Or not</strong></p>
                                        <p>Here Either Data Do Not Exist or Selection Is Not Matching With Stored Data </p>
                                        `;
            this.actiontype = "resetNone";
            return ;
            }
            
            this.alertboxheading.innerText = "Continue With Existing Post Data";
            this.alertboxmsg.innerHTML=`<p><strong>⚠️ Are you sure you want to Proceed further ?</strong></p>
                                        <p>This action will:</p>
                                        <p>Further Action Will Be Perform Over Existing Data</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "page2completion";
        }
    }

async reset1(){
        try {
            const url = `http://localhost:8080/DeletePSdata`;
            const response = await axios.delete(url,{
                data:{
                    id :this.dmid,
                    ET : this.TypeElection.value,
                }
            });
            const data = response.data;

            if(data.success){
            const reset = document.querySelectorAll(".R1");
            reset.forEach((field)=>{
                field.value = "";
            });
            this.electionblocksinput.disabled = true;
            this.pollingstation.disabled = true;
            this.nextbtn.disabled = true;
            this.resetAlertResponse = 0;
            }
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }
        this.alertbg.classList.add("hidden");
    }

async page1(){
        try {
            const response = await axios.get('/inspectdataentry',{
                params:{
                    ET : this.TypeElection.value
                }
            });
            const data = response.data;

            if(Array.isArray(data.missingIds) && data.missingIds.length > 0){
                return false;
            }
            return true;
        } catch (error) {
              if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            }
        }
    }

    changepage(){
        this.pages[this.currentpage].classList.remove("phase");
        this.currentpage++;
        this.pages[this.currentpage].classList.add("phase");
        this.backbtn.classList.remove("hidden")
        if(this.currentpage < this.pages.length){
            this.pages[this.currentpage].classList.add("phase");
        }
        this.alertbg.classList.add("hidden");
    }

    backpage(){
        this.pages[this.currentpage].classList.remove("phase");
        this.currentpage--;
        this.pages[this.currentpage].classList.add("phase");
        this.backbtn.classList.add("hidden")
        if(this.currentpage > this.pages.length){
            this.pages[this.currentpage].classList.add("phase");
        }
        this.alertbg.classList.add("hidden");
    }

    savedata(){
         if(this.currentpage === 0){
            const input = document.querySelectorAll(".R1");
            for(const page of input){
                if(page.value === ""){
                this.alertboxheading.innerText = "DATA FIELDS ARE EMPTY";
                this.alertboxmsg.innerHTML =`<p><strong>⚠️ Warning Please Select Election Data if you want to Continue </strong></p>
                                            `;
                this.actiontype = "resetNone";
                return ;
                }
            }
            this.alertboxheading.innerText = "INSERT ELECTION POLLING DATA";
            this.alertboxmsg.innerHTML=`<p><strong>⚠️ Are you sure you want to Insert this data into a Database?</strong></p>
                                        <p>This action will:</p>
                                        <p>this action will overwrite the excisting data of the ${this.blocklist.value} if data excist</P>
                                        <p>Permanently insert the associated data on the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "InsertElectionData";
            return;
        }else{
            if(this.p0array.length > 0 && this.p1array.length > 0  && this.p2array.length > 0  && this.p3array.length > 0 && (this.checkDesignationEmpCountP0 + this.extravalueP0) >= parseInt(this.P0Totalseats.textContent) && (this.checkDesignationEmpCountP1 + this.extravalueP1) >= parseInt(this.P1Totalseats.textContent) && (this.checkDesignationEmpCountP2 + this.extravalueP2) >= parseInt(this.P2Totalseats.textContent) && (this.checkDesignationEmpCountP3 + this.extravalueP3) >= (parseInt(this.P3Totalseats.textContent)) ){
            this.alertboxheading.innerText = "INSERT ELECTION POST DATA";
            this.alertboxmsg.innerHTML=`<p><strong>⚠️ Are you sure you want to Insert this data into a Database?</strong></p>
                                        <p>This action will:</p>
                                        <p>this action will overwrite the excisting data</P>
                                        <p>Permanently insert the associated data on the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "InsertElectionData";
            }else{
                this.alertboxheading.innerText = "ALL POSTS ARE NOT SELECTED";
                this.alertboxmsg.innerHTML =`<p><strong>⚠️ Warning Please Select Election Posts if you want to Continue </strong></p>
                                            `;
                this.actiontype = "resetNone";
                return ; 
            }
        }

    }

    
datainsertion(){
    if(this.currentpage === 0){
        this.page1insertion();
    }else{
        this.page2insertion();
    }
     
    }

async page1insertion(){
           try {
            const url = `/insertdata`;
            const response = await axios.post(url,{
                id : this.dmid,
                ET : this.TypeElection.value,
                Block : this.electionblocksinput.value,
                ps : this.psList.map(p => p.ps)
            });
            const data = response.data;
            if(data.success){
                this.clearlist();
                this.alertbg.classList.add("hidden");
                this.nextbtn.disabled = false;
            }
        } catch (error) {
               if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            } 
        }
    }
async page2insertion(){
        try {
            const url = `/insertPollingPosts`;
            const election = document.querySelector(".ETInput").value;
            const response = await axios.post(url,{
                ET : election,
                P0:this.p0array,
                P1:this.p1array,
                P2:this.p2array,
                P3:this.p3array,
                extraP1Array: this.extravalueP1Array,
                extraP2Array: this.extravalueP2Array,
                extraP3Array: this.extravalueP3Array,
                extraP1: this.extravalueP1,
                extraP2: this.extravalueP2,
                extraP3: this.extravalueP3
            });
            const data = response.data;
            if(data.success){
            const clearArray = [{p:"P0",flag:false,position:0},
                                {p:"P1",flag:true,position:1},
                                {p:"P2",flag:true,position:2},
                                {p:"P3",flag:true,position:3}];

            clearArray.forEach((clear)=>{
                    const Checkbox = this[`${clear.p}container`].querySelectorAll(".officerinputcheckbox");
                    Checkbox.forEach((box)=>{
                        if(box.checked || box.checked && box.disabled){
                            box.checked = false;
                            box.disabled = false;
                        }
                    });

                if(clear.flag){
                    console.log("hit flag");
                    const extracheckbox = document.querySelectorAll(`.officerinputcheckboxextraP${parseInt(clear.position)}`);
                    extracheckbox.forEach((box)=>{
                    box.checked = false;
                    const extravaluecontainer = document.querySelectorAll(`.EmpDesignationBody .P${clear.position}Container .EXTRAP${parseInt(clear.position)} .OFFICERDesignationEXTRA`);
                    extravaluecontainer.forEach(el => el.remove());
                    });
                    if (this.dynamicListSourceP) {
                        delete this.dynamicListSourceP[ clear.position];
                    }
                }

                const counterName = `extravalueP${parseInt(clear.position)}`;  
                this.checkseatwithEmployees(this[`checkDesignationEmpCountP${parseInt(clear.position)}`],this[`P${parseInt(clear.position)}Totalseats`],this[`currentCheckedP${parseInt(clear.position)}`],this[`TotalContainerBoxP${parseInt(clear.position)}`],clear.position,this[counterName],true);
            });
                const pop = document.querySelector(".PopUPMessageContainer");
                 pop.textContent = "Post Data Inserted Successfully";
                 pop.style.opacity = "1";
                this.alertbg.classList.add("hidden");
                 setTimeout(() => {
                    pop.style.opacity = "0";
                }, 3000);

                if(this.currentpage === 1){
                    this.savebtn.disabled = true;
                    this.postserr.innerText = "Total Requirement Is Showing Fullfilled Due to Recent Post Insertion Please Press Reset Button And Delete The Preset Data To Save New posts Data";
                }
            }
           
        } catch (error) {
            if (error.response) {
                console.log("Error:", error.response.data.message); // server responded with error
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            } 
        }
    }

cleanpage2() {
    for (let i = 0; i < 4; i++) {
        document.querySelectorAll(`.EmpDesignationBody .P${i}Container .OFFICERDesignation`).forEach(el => el.remove());
        this[`checkDesignationEmpCountP${i}`] = 0;
        this[`p${i}array`] = []; 
        this[`currentCheckedP${i}`] = 0;
        this[`TotalContainerBoxP${i}`] = 0;

        // FIXED selector here
        if (i > 0) {
            const extravalue = document.querySelectorAll(`.EmpDesignationBody .P${i}Container .EXTRAP${i} .OFFICERDesignationEXTRA`);
            if (extravalue.length > 0) {
                this[`extravalueP${i}`] = 0;
                this[`extravalueP${i}Array`] = [];
                extravalue.forEach(el => el.remove());
                console.log("hit 2 for P" + i);
            }
        }
    }

    this.mutationbeservation();
}


    async callEmpPosts(election){
        try {
            const url = `/callEmpPosts`;
            const response = await axios.get(url,{
                params : {ET : election}
            });
            const data = response.data;
            const posts = data.posts;
            const extraLender = data.Extraposts;
            if(data.success){
                    this.officerposts = {
                    P0: posts.P0.list,
                    P1: posts.P1.list,
                    P2: posts.P2.list,
                    P3: posts.P3.list
                    };

                    this.EXTRAPOSTS = {
                            P0: extraLender.P0,
                            P1: extraLender.P1,
                            P2: extraLender.P2,
                            P3: extraLender.P3
                    }

                    console.log(this.EXTRAPOSTS);
            }
            
        } catch (error) {
          this.catchError(error);
        }
    }

 loadofficersposts(){
        let i = 0;
        for(let i = 0;i<4;i++){
            const posts = this.officerposts[`P${i}`];
            posts.forEach((P)=>{
                if(P.selection === "Not Selected"){
                    this[`P${i}container`].innerHTML +=`
                                        <div class="OFFICERDesignation">
                                            <div class="checkboxContainer">
                                                    <input type="checkbox" class="officerinputcheckbox" value = "${P.post}">
                                            </div>
                                            <div class="officerDesignationName">
                                                <h5>${P.post}</h5>
                                            </div>
                                        </div>`;
                }else{
                    this[`P${i}container`].innerHTML +=`
                                        <div class="OFFICERDesignation">
                                            <div class="checkboxContainer">
                                                    <input type="checkbox" class="officerinputcheckbox" value = "${P.post}" checked disabled>
                                            </div>
                                            <div class="officerDesignationName">
                                                <h5>${P.post}</h5>
                                            </div>
                                        </div>`;
                    this[`p${i}array`].push(P.post);
                    this[`checkDesignationEmpCountP${i}`] += P.count;
                    this[`currentCheckedP${i}`]++;

                    this.checkseatwithEmployees(this[`checkDesignationEmpCountP${i}`],this[`P${i}Totalseats`],this[`currentCheckedP${i}`],this[`TotalContainerBoxP${i}`],i,this[`extravalueP${i}`],true);
                }
                this[`TotalContainerBoxP${i}`]++;
            });


            const EXvalues = this.EXTRAPOSTS[`P${i}`];
            if(EXvalues.length > 0){
                EXvalues.forEach((p)=>{
                    const container = document.querySelector(`.EXTRA${p.currentposts}`);
                    container.innerHTML +=`
                                            <div class="OFFICERDesignationEXTRA">
                                                <div class="checkboxContainerextra${p.currentposts}">
                                                    <input type="checkbox" class="officerinputcheckboxextra${p.currentposts}" value="${p.desigantionsRequired}" checked disabled>
                                                </div>
                                                <div class="officerDesignationNameextra">
                                                    <h5>${p.desigantionsRequired}</h5>
                                                </div>
                                            </div>`;
                        this[`extravalue${p.currentposts}Array`].push(p.desigantionsRequired);
                        this[`extravalue${p.currentposts}`]++;
                        container.classList.remove("hidden");
                });
            }
        }
    }

    async checkselectedPost(){
            try {
                const url = `/searchSelectedPosts`;
                const election = document.querySelector(".ETInput").value;
                const response = await axios.get(url,{
                    params : {ET : election}
                });

                const data = response.data;
                if(data.success){
                    
                    this.checkCountPost ={
                                P0: data.count.P0.map(obj => obj.P0),
                                P1: data.count.P1.map(obj => obj.P1),
                                P2: data.count.P2.map(obj => obj.P2),
                                P3: data.count.P3.map(obj => obj.P3),
                                }
                    this.checkExtraCountPost = {
                                P1 : data.EXCOUNT.P1.map(obj => obj.P1),
                                P2 : data.EXCOUNT.P2.map(obj => obj.P2),
                                P3 : data.EXCOUNT.P3.map(obj => obj.P3),
                    }
                    for(let i = 0 ; i < 4 ; i++){
                        const FrontArray1 = [...this[`p${i}array`]].sort();
                        const BackArray2 = [...this.checkCountPost[`P${i}`]].sort();
                        if(FrontArray1.length === BackArray2.length && FrontArray1.every((val , index)=>val === BackArray2[index])){
                            const postEmprequirement = BackArray2.length;
                            let backendTotal = 0;
                            if(i > 0){
                                const frontex = [...this[`extravalueP${i}Array`]].sort();
                                const backex = [...this.checkExtraCountPost[`P${i}`]].sort();
                                if(frontex.length === backex.length && frontex.every((val,index)=>val === backex[index])){
                                    backendTotal = backex.length;
                                }
                            }
                            const totalvalue = postEmprequirement + backendTotal;
                            if(Number(this[`P${i}Totalseats`].textContent) <= totalvalue){
                                return true;
                            }
                        }
                    }
                    return false;
                }

            } catch (error) {
                this.catchError(error);
            }
        }

async loadNumberOfPS(){
        const election = document.querySelector(".ETInput").value;
        try {
            const  url = `/selectpolls`;
            const response = await axios.get(url,{
                params : {
                    ET: election
                }
            });

            const data = response.data;
            if(data.success){
                this.AmountofPS = 0;
                this.psNumbers = data.result.map(ps => ps.PS);
                for(let p of this.psNumbers){
                    this.AmountofPS++;
                }
            const arr = [this.P0Totalseats,this.P1Totalseats,this.P2Totalseats,this.P3Totalseats];
            arr.forEach((p)=>{
                const extra = Math.ceil(this.AmountofPS * 0.05); 
                p.textContent = parseInt(extra+(this.AmountofPS));
            });
            }
        } catch (error) {
            this.catchError(error);
        }
    }

    catchError(error){
        if (error.response) {
            console.log("Error:", error.response.data.message); // server responded with error
        } else {
            console.log("Error:", error.message); // other errors (network etc.)
        } 
    }

checkseatwithEmployees(designation, container, current, total, num, extra,flag) {

    const added = document.querySelector(`.P${num}ADDNEW`);
    if (!added){
        return;
    }

    const text = container.textContent;
    const match = text.match(/\d+/); // match first number only
    const totalRequired = match ? parseInt(match[0]) : 0;
    const totalGiven = parseInt(extra) + parseInt(designation);
    if (totalGiven >= totalRequired) {
        container.style.color = "green";
        added.classList.add("hidden"); // Hide add-new if requirements are full
    } else {
        container.style.color = "red";
        
        // Optional: show "add new" only when all are checked
        if (current === total && !flag) {
            added.classList.remove("hidden");
        } else {
            added.classList.add("hidden");
        }
    }
}

createExtraList(current, p) {
    let list = null;
    let sourceP = p;
    const container = document.querySelector(`.EXTRAP${p}`);
    if (!container) return;

    // 1. Try current container's unchecked and enabled checkboxes
    const directList = this[`P${p}container`].querySelectorAll(
        `.OFFICERDesignation:not(.EXTRA) input.officerinputcheckbox:not(:checked):not([disabled])`
    );
    if (directList.length > 0) {
        list = directList;
        sourceP = p;
    } else {
        // 2. Go backward to find unchecked checkboxes
        for (let i = p - 1; i >= 0; i--) {
            const unchecked = this[`P${i}container`].querySelectorAll(
                `.OFFICERDesignation:not(.EXTRA) input.officerinputcheckbox:not(:checked):not([disabled])`
            );
            if (unchecked.length > 0) {
                list = unchecked;
                sourceP = i;
                break;
            }
        }

        // 3. If still nothing, try previous panels with checked > total seat
        if (!list || list.length === 0) {
            for (let i = p - 1; i >= 0; i--) {
                const checkedCount = this[`checkDesignationEmpCountP${i}`];
                const totalRequired = parseInt(this[`P${i}Totalseats`].textContent);
                if (checkedCount > totalRequired) {
                    const checked = this[`P${i}container`].querySelectorAll(
                        `.OFFICERDesignation:not(.EXTRA) input.officerinputcheckbox:checked`
                    );
                    if (checked.length > 0) {
                        list = checked;
                        sourceP = i;
                        break;
                    }
                }
            }
        }

        // 4. Final fallback — take all checked from P0
        if ((!list || list.length === 0) && this[`checkDesignationEmpCountP0`] > parseInt(this[`P0Totalseats`].textContent)) {
            list = this.P0container.querySelectorAll(
                `.OFFICERDesignation:not(.EXTRA) input.officerinputcheckbox:checked`
            );
            sourceP = 0;
        }
    }

    if (!list || list.length === 0) return;

    // Track the source
    this.dynamicListSourceP = this.dynamicListSourceP || {};
    this.dynamicListSourceP[p] = sourceP;

    const posts = this.officerposts[`P${sourceP}`];
    container.innerHTML = ""; // Optional: clear previous extras before appending

    list.forEach((input) => {
        const postname = input.value;
        const originalpost = posts.find((p1) => p1.post === postname);
        if (!originalpost) return;

        const name = originalpost.post;

        container.innerHTML += `
            <div class="OFFICERDesignationEXTRA">
                <div class="checkboxContainerextraP${p}">
                    <input type="checkbox" class="officerinputcheckboxextraP${p}" value="${name}">
                </div>
                <div class="officerDesignationNameextra">
                    <h5>${name}</h5>
                </div>
            </div>`;
    });

    const children = container.querySelectorAll(`.officerinputcheckboxextraP${p}`);
    if (children.length > 0) {
        this.checkextraboxes(p);
    }

    const removebox = document.querySelector(`.${current}ADDNEW`);
    if (removebox) removebox.classList.add("hidden");
}


    checkextraboxes(num){
        const checkbox = document.querySelectorAll(`.officerinputcheckboxextraP${num}`);
        const arrayname = `extravalueP${(parseInt(num))}Array`;
        const counterName = `extravalueP${parseInt(num)}`;
        checkbox.forEach((box,index)=>{
              box.addEventListener("click",()=>{
                    if(box.checked){
                        this[arrayname].push(box.value);
                        this[counterName]++;
                    }else{
                        this[arrayname] = this[arrayname].filter(val => val !== box.value); 
                        this[counterName]--;
                    }
                this.checkseatwithEmployees(this[`checkDesignationEmpCountP${parseInt(num)}`],this[`P${parseInt(num)}Totalseats`],this[`currentCheckedP${parseInt(num)}`],this[`TotalContainerBoxP${parseInt(num)}`],num,this[counterName],true);
                });
        });
    }

    clearPostSelection(){
        const clearArray = [{p:"P0",flag:false,position:0},
                            {p:"P1",flag:true,position:1},
                            {p:"P2",flag:true,position:2},
                            {p:"P3",flag:true,position:3}];

        clearArray.forEach((clear)=>{
                const Checkbox = this[`${clear.p}container`].querySelectorAll(".officerinputcheckbox");
                Checkbox.forEach((box)=>{
                    if(box.checked || box.checked && box.disabled){
                        box.checked = false;
                        box.disabled = false;
                        this[`checkDesignationEmpCount${clear.p}`] = 0;
                        this[`p${clear.position}array`] = [];
                        this[`currentChecked${clear.p}`] = 0;
                    }
                });

                if(clear.flag){
                    console.log("hit flag");
                    const extracheckbox = document.querySelectorAll(`.officerinputcheckboxextraP${parseInt(clear.position)}`);
                    extracheckbox.forEach((box)=>{
                    box.checked = false;
                    this[`extravalue${clear.p}`] = 0;
                    this[`extravalue${clear.p}Array`] = [];
                    const extravaluecontainer = document.querySelectorAll(`.EmpDesignationBody .P${clear.position}Container .EXTRAP${parseInt(clear.position)} .OFFICERDesignationEXTRA`);
                    extravaluecontainer.forEach(el => el.remove());
                    });
                    if (this.dynamicListSourceP) {
                        delete this.dynamicListSourceP[ clear.position];
                    }
                }
                const counterName = `extravalueP${parseInt(clear.position)}`;  
                this.checkseatwithEmployees(this[`checkDesignationEmpCountP${parseInt(clear.position)}`],this[`P${parseInt(clear.position)}Totalseats`],this[`currentCheckedP${parseInt(clear.position)}`],this[`TotalContainerBoxP${parseInt(clear.position)}`],clear.position,this[counterName],true);
        });
        this.alertbg.classList.add("hidden");
    }

    async deleteAllPostsDetails(){
        try {
            const election = document.querySelector(".ETInput").value;
            const url = `/deletepostsdetails`;
            const response = await axios.delete(url,{
                params : {ET : election}
            });

            const data =  response.data;
            const pop = document.querySelector(".PopUPMessageContainer");
            if(data.success && data.deleteResult.length !== 0){
                    pop.textContent = "Post Data Reset Successfully";
                    pop.style.opacity = "1";
                if(this.currentpage === 1){
                    this.savebtn.disabled = false;
                    this.postserr.innerText = "";
                }
            }
             setTimeout(() => {
                    pop.style.opacity = "0";
                }, 3000);
        } catch (error) {
         if (error.response) {
            console.log("Error:", error.response.data.message); // server responded with error
        } else {
            console.log("Error:", error.message); // other errors (network etc.)
        } 
        }
    }
}

class RANDOMISATION1{
    constructor(){
        this.RandomizationdataConatainer = document.querySelector(".placementContainer");
        this.randomizordropdown = document.querySelector(".randomizationlist");
        this.alertbg = document.querySelector(".alertbg");
        this.alertmsg = document.querySelector(".alertmsg");
        this.alertconfirm = document.querySelector(".alertconfirm button");
        this.alertboxheading = document.querySelector(".alertheading h3");
        this.alertbtn = document.querySelector(".alertconfirm button");
        this.ET = document.querySelector(".electiontype");
        this.randomBlock = document.querySelector(".randomBlockinput");
        this.randomElectioninput = document.querySelector(".randomElectioninput");
        this.dynamicblock = document.querySelector(".dynamicrandomBlocklistcontainer");
        this.RANDOMISATIONBtn = document.querySelector(".randombtncontainerR button");
        this.RANDOMISATIONSAVEBtn = document.querySelector(".savebtncontainerR button");
        this.RANDOMISATIONRESET  = document.querySelector(".resetbtncontainerR button")
        this.randomisationbody = document.querySelector(".randomizationBody .tablecontainerR1");
        this.savedcontainermainR1 = document.querySelector(".savedtablecontentcontainerR1");
        this.savedcontainerparentR1 = document.querySelector(".savedtablecontentcontainerR1 .savedcontenttableR1");
        this.downloadR1 = document.querySelector(".downloadR1");
        this.pop = document.querySelector(".PopUPMessageContainer");
        this.rnpages = document.querySelectorAll(".rnp");
        this.currentpageR = null;
        this.actiontype = null;
        this.EMP0 = [];
        this.EMP1 = [];
        this.EMP2 = [];
        this.EMP3 = [];
        this.PS = [];
        this.EXTRA_EMP = [];
        this.dynamicrandomiseData1 = [];
        this.alertactionhandlers ={
            Randomization1 : ()=>{
                this.randmizor1check();
            },

            placementContainer : () =>{
                this.randomizationpage1()
            },
            startRandomization1 : ()=>{
                this.randomizationpage1();
            },
            resetrandomisedataAll : () =>{
                this.resetrandomisedata();
            },
            ResetNone : ()=>{
                this.randomizordropdown.disabled = false;
                this.alertbg.classList.add("hidden");
            }
        }
        this.init();
    }

    init(){
        this.randomizordropdown.addEventListener("change",()=>this.openrandomization());
        this.alertbtn.addEventListener("click",()=>this.callalert(this.actiontype));
        this.ET.addEventListener("change",()=>{
            this.randomizordropdown.disabled = false;
            this.randomElectioninput.value = this.ET.value;
        });
        this.randomBlock.addEventListener("click",()=>this.showblockdata());
        this.dynamicblock.addEventListener("click",(event)=>{
            if(event.target.classList.contains("BlockNamesR")){
                this.randomBlock.value = event.target.textContent;
                this.randomBlock.disabled = false;
                this.RANDOMISATIONBtn.disabled = false;
                const index = document.querySelectorAll(".BlockNamesR");
                index.forEach((block)=>{
                    block.classList.remove("show");
                });
            }
        });

        this.RANDOMISATIONBtn.addEventListener("click",()=>{
            this.randomisationEmployees();
        });

        this.RANDOMISATIONSAVEBtn.addEventListener("click",()=>{
            this.saveRandomisationblockdata();
        });
        this.RANDOMISATIONRESET.addEventListener("click",()=>{
            this.resetRandomiseDataAlert();
        });

        this.downloadR1.addEventListener("click",()=>this.downloadRandomiseDataR1());
    }

    openrandomization(){
        this.actiontype = this.randomizordropdown.value;
        this.currentpageR = this.randomizordropdown.value;
        this.callalert(this.actiontype);
    }

    callalert(action){
          if(this.alertactionhandlers[action] && action !== null){
            this.alertactionhandlers[action]();
        }
    }

async randmizor1check(){
    try {
        const url = `/CheckPollingAndPostData`;
            const response = await axios.get(url,{
                params : {
                    ET : this.ET.value
                }
            });
            const data = response.data;
            if(data.success){
                await this.checkdynamicrandomisation1data();
                this.showRandomixorAlert(data.success,data.message,data.requiredPosts,data.availableEmployees);
            }
    } catch (error) {
        if (error.response) {
            const data = error.response.data;
            console.log("Error:", error.response.data.message); // server responded with error
            this.showRandomixorAlert(data.success,data.message,data.requiredPosts,data.availableEmployees);
        } else {
            console.log("Error:", error.message); // other errors (network etc.)
        } 
    }

    }

    showRandomixorAlert(success,message,requiredPosts,availableposts){
        if(success){
            this.alertboxheading.innerText = "Start Randomization 1";
            this.alertmsg.innerHTML =`<p><strong>⚠️${message}?⚠️</strong></p>
                                        <p>This action will:</p>
                                        <p>1: Start The Session</p>
                                        <p>2: Work on Pre-Existing Election Data If New Data is Not Set</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>required posts for this randomization : ${requiredPosts}</P>
                                        <p>Available Post for this Randomization : ${availableposts}</p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "startRandomization1";
        }else{
            this.alertboxheading.innerText = "Required Randomization Data";
            this.alertmsg.innerHTML=`<p><strong>⚠️${message}?</strong></p>
                                        <p>required posts for this randomization : ${requiredPosts}</P>
                                        <p>Available Post for this Randomization : ${availableposts}</p>
                                        <p><strong>please contanct HODS or Re-Enter the data</strong></p>
                                        <p>press continue to close?</p>
                                        `;
            this.randomizordropdown.disabled = true;
            this.actiontype = "ResetNone";
        }
        this.alertbg.classList.remove("hidden");
    }

async checkdynamicrandomisation1data(){
    try {
        const url = `/checkPreExistingData`;

        const response = await axios.get(url,{
            params : {ET : this.ET.value}
        });

        const data = response.data;
        if(data.success){
           this.insertdynamicrandomdata(data.data);
           this.dynamicrandomiseData1 = data.data;
        }
        } catch (error) {
        if (error.response) {
            console.log("Error:", error.response.data.message); // server responded with error
        } else {
            console.log("Error:", error.message); // other errors (network etc.)
        }  
        }
    }

    insertdynamicrandomdata(data){
        if (this.savedcontainerparentR1.querySelector(".randomizedatacontainer")) {
            this.savedcontainerparentR1.innerHTML = "";
        }


        data.forEach((data)=>{
            this.savedcontainerparentR1.innerHTML +=
                        `
                         <div class = "randomizedatacontainer">
                            <div class = "blockName">
                                <div class = "blockNameHeading">
                                    Block Name 
                                </div>
                                <div class = "blockNamecontent">
                                ${data.ElectionBlock}
                                </div>
                            </div>
                            <div class = "psName">
                                <div class = "psNameHeading">
                                    Polling Station
                                </div>
                                <div class = "psNamecontent">
                                ${data.PS}
                                </div>
                            </div>
                            <div class = "AllDataContainer">
                                <div class = "AllDataHeading">
                                    All Data
                                </div>
                                <div class = "AllDatacontent">
                                ${data.P0} , ${data.P1} , ${data.P2} , ${data.P3} , ${data.Extra5Percent}
                                </div>
                            </div>
                        </div>
                        `;
            this.RANDOMISATIONRESET.disabled = false;
            this.savedcontainermainR1.classList.remove("hidden");
        });
    }

    randomizationpage1(){
        this.rnpages.forEach((page)=>{
            if(page.classList.contains(this.currentpageR)){
                page.classList.remove("hidden");
            }else{
                page.classList.add("hidden");
            }
        })
        this.alertbg.classList.add("hidden");
    }

    async showblockdata() {
        this.randomBlock.disabled = true;
        this.randomBlock.value = "";
    try {
        const url = `/blockList`;
        const response = await axios.get(url, {
            params: { Election: this.randomElectioninput.value }
        });

        const data = response.data;

        if (data.success) {
            this.dynamicblock.innerHTML = "";

            data.result.forEach((data, index) => {
                const div = document.createElement("div");
                div.className = "BlockNamesR";
                div.textContent = data.ElectionBlocks;

                this.dynamicblock.appendChild(div);

                // Animate after it's in the DOM
                setTimeout(() => {
                    div.classList.add("show");
                    }, 10 + index * 50);
                });
            }
        } catch (err) {
            console.error("Error loading block list:", err);
        }
    }

async  randomisationEmployees(){
        try {
            const url = `/Randomisation1`;
            const response = await axios.get(url,{
                params : {
                    ET : this.randomElectioninput.value,
                    Block : this.randomBlock.value
                }
            });

            const data = response.data;

            if(data.success){
                this.EMP0 = data.EMPP0,
                this.EMP1 = data.EMPP1,
                this.EMP2 = data.EMPP2,
                this.EMP3 = data.EMPP3,
                this.PS = data.ps,
                this.EXTRA_EMP = data.EXTRA_EMP
                this.showrandomisationvalues(data.success ,data.message, this.PS, this.EMP0 , this.EMP1 , this.EMP2 , this.EMP3 , this.EXTRA_EMP , this.randomBlock.value);
            }
        } catch (error) {
            if(error.response){
                const data = error.response.data;
                this.showrandomisationvalues(data.success ,data.message ,this.PS, this.EMP0 , this.EMP1 , this.EMP2 , this.EMP3 , this.EXTRA_EMP , this.randomBlock.value);
            }else {
            console.log("Error:", error.message); // other errors (network etc.)
            } 
        }
    }

    showrandomisationvalues(success , message , ps , p0 , p1 , p2 , p3 , extra, block ){
        if(success){

            const parentcontainer = this.randomisationbody?.querySelectorAll(".randomizedatacontainer");

            parentcontainer.forEach((container)=>{
                if(container.querySelector(".blockNamecontent").textContent.trim() === block){
                    container.remove();
                }
            });
             this.randomisationbody.innerHTML +=
                        `
                         <div class = "randomizedatacontainer">
                            <div class = "blockName">
                                <div class = "blockNameHeading">
                                    Block Name 
                                </div>
                                <div class = "blockNamecontent">
                                ${block}
                                </div>
                            </div>
                            <div class = "psName">
                                <div class = "psNameHeading">
                                    Polling Station
                                </div>
                                <div class = "psNamecontent">
                                ${ps}
                                </div>
                            </div>
                            <div class = "AllDataContainer">
                                <div class = "AllDataHeading">
                                    All Data
                                </div>
                                <div class = "AllDatacontent">
                                ${p0} , ${p1} , ${p2} , ${p3} , ${extra}
                                </div>
                            </div>
                        </div>
                        `;
            this.RANDOMISATIONSAVEBtn.disabled = false;
            return;
        }else{
            this.alertboxheading.innerText = "Required Randomization Data";
            this.alertmsg.innerHTML=`<p><strong>⚠️${message}?</strong></p>
                                        <p><strong>please contanct HODS or Re-Enter the data</strong></p>
                                        <p>press continue to close?</p>
                                        `;
            this.actiontype = "ResetNone";
            this.randomBlock.value = "";
            this.randomizordropdown.disabled = true;
            this.alertbg.classList.remove("hidden");
        }
    }

async saveRandomisationblockdata(){
    try {
        if(this.randomBlock.value  === ""){
            this.alertboxheading.innerText = "failed  To Insert Data ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ data block is empty ⚠️</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "ResetNone";
            this.alertbg.classList.remove("hidden");
            throw new error("data block is empty");
        }
        const url = `/saveRandomisation1`;

        const response = await axios.post(url,{
                    ET : this.randomElectioninput.value,
                    Block : this.randomBlock.value,
                    EMP0 : this.EMP0,
                    EMP1 : this.EMP1,
                    EMP2 : this.EMP2,
                    EMP3 : this.EMP3,
                    EXTRA : this.EXTRA_EMP
        });

        const data = response.data;
        if(data.success){
            this.RANDOMISATIONRESET.disabled = false;
            const unsavedblock = this.randomisationbody.querySelectorAll(".tablecontainerR1 .randomizedatacontainer");
            const savedblock = this.savedcontainerparentR1.querySelectorAll(".randomizedatacontainer");
            unsavedblock.forEach((ublock)=>{
                if(ublock.querySelector(".blockNamecontent").textContent.trim() === data.Block){
                    savedblock.forEach((sblock)=>{
                        if(sblock.querySelector(".blockNamecontent").textContent.trim() === data.Block){
                            sblock.remove()
                        }
                    });
                    
                    this.savedcontainerparentR1.appendChild(ublock);
                    this.savedcontainermainR1.classList.remove("hidden");
                    this.dynamicrandomiseData1.push(data.Block);   
                }
            });
            this.pop.textContent = `${data.Block} Data Inserted Successfully`;
            this.pop.style.opacity = "1";
            setTimeout(() => {
                this.pop.style.opacity = "0";
            }, 3000);
        }
    } catch (error) {
        if(error.response){
            const data = error.response.data;
            this.alertboxheading.innerText = "failed  To Insert Data ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ ${data}⚠️</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "ResetNone";
            this.alertbg.classList.remove("hidden");
        }else {
            console.log("Error:", error.message); // other errors (network etc.)
            } 
        
        }
    }

resetRandomiseDataAlert(){

    if(this.dynamicrandomiseData1.length > 0){
        this.alertboxheading.innerText = "Reset All Randomisation Data ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ Are you sure you want to reset this data? ⚠️</strong></p>
                                        <p>This action will:</p>
                                        <p>1: Clear the preset data on this page</p>
                                        <p>2: If Backend Data Exist then it will Permanently delete the associated data from the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "resetrandomisedataAll";
    }else{
        console.log(this.dynamicrandomiseData1);
        this.alertboxheading.innerText = "Data Not Found ";
        this.alertmsg.innerHTML=`   <p><strong>⚠️ No Data Exist for Reset ⚠️</strong></p>
                                    <p>Please Insert Data First to Reset</p>
                                    <p>Do you want to continue?</p>
                                    `;
        this.actiontype = "ResetNone";
    }
    this.alertbg.classList.remove("hidden");
    }

async resetrandomisedata(){
    try {
        const url = `/resetrandomisedata`;
        const response = await axios.delete(url,{
            params :{ET : this.ET.value}
        });

        const data = response.data;

        if(data.success){
            this.dynamicrandomiseData1 = [];
            this.savedcontainerparentR1.innerHTML = "";
            this.randomisationbody.innerHTML = "";
            this.savedcontainermainR1.classList.add("hidden");
            this.pop.textContent = `${this.ET.value} Data Deleted Successfully`;
            this.pop.style.opacity = "1";
            setTimeout(() => {
                this.pop.style.opacity = "0";
            }, 3000);
            this.alertbg.classList.add("hidden");
        }
    } catch (error) {
        if(error.response){
                const data = error.response.data;
                this.alertboxheading.innerText = "Data Not Found ";
                this.alertmsg.innerHTML=`   <p><strong>⚠️ ${data} ⚠️</strong></p>
                                            <p>Do you want to continue?</p>
                                            `;
                this.actiontype = "ResetNone";
                this.alertbg.classList.remove("hidden");

            }else {
            console.log("Error:", error.message); // other errors (network etc.)
            } 
        }
    }

    downloadRandomiseDataR1(){
         const opt = {
            margin: [1.5, 0.5, 0.5, 0.5],  // Top, left, bottom, right
            filename: 'Randomisation1.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

            html2pdf()
            .set(opt)
            .from(this.savedcontainerparentR1)
            .toPdf()
            .get('pdf')
            .then(function (pdf) {
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // 🔹 Heading
                pdf.setFontSize(16);
                pdf.text("Randomisation 1 Report", pageWidth / 2, 0.75, { align: "center" });

                // 🔹 Date (Top-right)
                const today = new Date().toLocaleDateString();
                pdf.setFontSize(10);
                pdf.text(`Date: ${today}`, pageWidth - 1.5, 1.05);

                // 🔹 Description
                pdf.setFontSize(11);
                pdf.text("This document contains randomly allocated election duty data.", 0.75, 1.35);

                // 🔹 Bottom-right footer text
                pdf.setFontSize(10);
                const footerText = "Report generated by EDMS";
                const textWidth = pdf.getTextWidth(footerText);
                pdf.text(footerText, pageWidth - textWidth - 0.5, pageHeight - 0.5);  // 0.5 inch from bottom-right
            })
            .save();
    }
}

class RANDOMISATION2{
    constructor(){
    this.R2MainBody = document.querySelector(".Randomization2");
    this.randomizordropdown = document.querySelector(".randomizationlist");
    this.alertbg = document.querySelector(".alertbg");
    this.alertmsg = document.querySelector(".alertmsg");
    this.alertconfirm = document.querySelector(".alertconfirm button");
    this.alertboxheading = document.querySelector(".alertheading h3");
    this.alertbtn = document.querySelector(".alertconfirm button");
    this.ET = document.querySelector(".randomElectioninput");
    this.rnpages = document.querySelectorAll(".rnp");
    this.BlockinputR2 = document.querySelector(".R2BlockInput");
    this.dynamicblocklist = document.querySelector(".dynamicR2blockContainer");
    this.randomisation2Btn = document.querySelector(".randombtncontainerR2 button");
    this.randomisebodyR2 = document.querySelector(".tablecontainerR2");
    this.savedcontainerparent = document.querySelector(".savedtablecontainerR2");
    this.saveddatacontainer = document.querySelector(".savedtablecontainerR2 .contenttableR2");
    this.randomisation2Savebtn = document.querySelector(".savebtncontainerR2 button");
    this.randomisation2resetbtn = document.querySelector(".resetbtncontainerR2 button");
    this.pop = document.querySelector(".PopUPMessageContainer");
    this.downloadR2 = document.querySelector(".downloadR2");
    this.init();
    this.currentpageR2 = null;
    this.actiontype = null ;
    this.dataGroup = [];
    this.dynamicrandomiseData2 = [];
    this.alertactionhandlers = {
        Randomization2 : ()=>{
            this.checkRandomisation1data();

        },

        startRandomization2 : ()=>{
          this.randomizationpage2();
        },
        resetallRandomisation2 : ()=>{
            this.resetRandomisation2();
        },  
        ResetNone : ()=>{
                this.randomizordropdown.disabled = false;
                this.alertbg.classList.add("hidden");
        },
     }
    }
    init(){
        this.randomizordropdown.addEventListener("change",()=>this.openrandomization());
        this.alertbtn.addEventListener("click",()=>this.callalert(this.actiontype));
        this.BlockinputR2.addEventListener("click",()=>this.showdynamiclist());
        this.dynamicblocklist.addEventListener("click",(event)=>{
            if(event.target.classList.contains("BlockNamesR2")){
            this.BlockinputR2.value = event.target.textContent;
             this.BlockinputR2.disabled = false;
             this.randomisation2Btn.disabled = false ;
             const blocknames = document.querySelectorAll(".BlockNamesR2");
                blocknames.forEach((b)=>{
                    b.classList.remove("showR2");
                });
            }
        });
        this.randomisation2Btn.addEventListener("click",()=>{this.startRandomisation2()});
        this.randomisation2Savebtn.addEventListener("click",()=>this.saveRandomisation2blockdata());
        this.randomisation2resetbtn.addEventListener("click",()=>this.resetRandomisation2Alert());
        this.downloadR2.addEventListener("click",()=>this.downloadRandomiseDataR2());
    }
    openrandomization(){
        this.actiontype = this.randomizordropdown.value;
        this.currentpageR2 = this.randomizordropdown.value;
        this.callalert(this.actiontype);
    }
    callalert(action){
          if(this.alertactionhandlers[action] && action !== null){
            this.alertactionhandlers[action]();
        }
    }

    randomizationpage2(){
        this.rnpages.forEach((page)=>{
            if(page.classList.contains(this.currentpageR2)){
                page.classList.remove("hidden");
            }else{
                page.classList.add("hidden");
            }
        })
        this.alertbg.classList.add("hidden");
    }

async checkRandomisation1data(){
        try {
            const url = `/checkrandomisation1Data`;
            const response = await axios.get(url,{
                params : { ET : this.ET.value}
            });

            const data = response.data;

            if(data.success){
                this.alertboxheading.innerText = "Start Randomization 2";
                this.alertmsg.innerHTML =`<p><strong>⚠️${data.message}?⚠️</strong></p>
                                            <p>This action will:</p>
                                            <p>1: Start The Session</p>
                                            <p>2: Work on Pre-Existing Election Data If New Data is Not Set</p>
                                            <p><strong>This cannot be undone.</strong></p>
                                            <p>Do you want to continue?</p>
                                            `;
                this.actiontype = "startRandomization2";
                this.alertbg.classList.remove("hidden");
                await this.checkpreExistingDataR2();
            }
        } catch (error) {
            if (error.response) {
            const data = error.response.data;
            console.log("Error:", error.response.data.message); // server responded with error
                this.alertboxheading.innerText = "Required Randomization Data";
                this.alertmsg.innerHTML =`<p><strong>⚠️${data.message}?⚠️</strong></p>
                                            <p> Please first start Randomisation 1 for the data </p>
                                            <p>Do you want to continue?</p>
                                            `;
                this.actiontype = "ResetNone";
                this.alertbg.classList.remove("hidden");
            } else {
                console.log("Error:", error.message); // other errors (network etc.)
            } 
        }
    }

async checkpreExistingDataR2() {
  try {
    const url = `/checkdataR2`;
    const response = await axios.get(url, {
      params: { ET: this.ET.value }
    });
    const data = response.data;

    if (data.success) {
      const flatData = data.group;
      this.dynamicrandomiseData2 = data.group;

      if (this.saveddatacontainer.querySelector(".dynamicDataListR2")){ 
        return;
      }

      // Group by ElectionBlock
      const grouped = {};
      flatData.forEach(item => {
        if (!grouped[item.ElectionBlock]) {
          grouped[item.ElectionBlock] = {
            Extra5Percent: item.Extra5Percent,
            records: []
          };
        }
        grouped[item.ElectionBlock].records.push(item);
      });

      // Loop each block group
      Object.entries(grouped).forEach(([blockName, { Extra5Percent, records }]) => {
        const html = `
          <div class="dynamicDataListR2">
            <div class="R2ListHeadingContainer">
              <div class="blocknameHeadingR2">Block Name</div>
              <div class="PsNameHeadingR2">Polling Station Name</div>
              <div class="P0HeadingR2">P0</div>
              <div class="P1HeadingR2">P1</div>
              <div class="P2HeadingR2">P2</div>
              <div class="P3HeadingR2">P3</div>
              <div class="PercentExtraHeadingR2">5% Extra Employees</div>
            </div>
            <div class="R2ListBodyContainer">
              <div class="blocknameR2">${blockName}</div>
              <div class="PsNameR2"></div>
              <div class="P0R2"></div>
              <div class="P1R2"></div>
              <div class="P2R2"></div>
              <div class="P3R2"></div>
              <div class="PercentExtraR2">${Extra5Percent}</div>
            </div>
          </div>
        `;

        this.saveddatacontainer.innerHTML += html;

        const dynamicblocks = this.saveddatacontainer.querySelectorAll(".dynamicDataListR2");
        const newblock = dynamicblocks[dynamicblocks.length - 1];

        const psdiv = newblock.querySelector(".PsNameR2");
        const P0div = newblock.querySelector(".P0R2");
        const P1div = newblock.querySelector(".P1R2");
        const P2div = newblock.querySelector(".P2R2");
        const P3div = newblock.querySelector(".P3R2");

        records.forEach(val => {
          const divPS = document.createElement("div");
          const divP0 = document.createElement("div");
          const divP1 = document.createElement("div");
          const divP2 = document.createElement("div");
          const divP3 = document.createElement("div");

          divPS.className = `PSR2`;
          divP0.className = `P0R2inner`;
          divP1.className = `P1R2inner`;
          divP2.className = `P2R2inner`;
          divP3.className = `P3R2inner`;

          divPS.textContent = val.PS;
          divP0.textContent = val.P0;
          divP1.textContent = val.P1;
          divP2.textContent = val.P2;
          divP3.textContent = val.P3;

          psdiv.appendChild(divPS);
          P0div.appendChild(divP0);
          P1div.appendChild(divP1);
          P2div.appendChild(divP2);
          P3div.appendChild(divP3);
        });

        newblock.classList.remove("hidden");
      });

      this.savedcontainerparent.classList.remove("hidden");
      this.randomisation2resetbtn.disabled = false;
      
    }
  } catch (error) {
    console.error("Error loading pre-existing data:", error);
    this.saveddatacontainer.innerHTML="";
    this.savedcontainerparent.classList.add("hidden");
  }
}

async showdynamiclist(){
    this.BlockinputR2.disabled = true;
    this.BlockinputR2.value = "";
    try {
        const url = `/blockList`;
        const response = await axios.get(url, {
            params: { Election: this.ET.value }
        });

        const data = response.data;

        if (data.success) {
            this.dynamicblocklist.innerHTML = "";
            data.result.forEach((data, index) => {
                const div = document.createElement("div");
                div.className = "BlockNamesR2";
                div.textContent = data.ElectionBlocks;

                this.dynamicblocklist.appendChild(div);

                // Animate after it's in the DOM
                setTimeout(() => {
                    div.classList.toggle("showR2");
                    }, 10 + index * 50);
                });

            }
        } catch (err) {
            console.error("Error loading block list:", err);
        }
    }

    addblockdata(block){
        block.forEach((b)=>{
            this.BlockinputR2.value  =  b.textContent;
        });
    }

async startRandomisation2(){
    try {
        
        const url = `Radomisation2`;
        const response = await axios.get(url,{
            params :{
                ET : this.ET.value,
                block : this.BlockinputR2.value
            }
        });

        const data = response.data;

        if(data.success){
            this.dataGroup = data.groups
            this.showdatalist(data.groups ,  data.extra , this.BlockinputR2.value ,  data.PS);
            this.randomisation2Savebtn.disabled = false;
        }
    } catch (error) {
        
    }
    }

    showdatalist(group , extra , block , ps){
        const parentcontainer = this.randomisebodyR2?.querySelectorAll(".dynamicDataListR2 ");

            parentcontainer.forEach((container)=>{
                if(container.querySelector(".blocknameR2").textContent.trim() === block){
                    container.remove();
                }
            });
      
            const html  =` 
                                       <div class="dynamicDataListR2 hidden">
                                        <div class="R2ListHeadingContainer">
                                            <div class="blocknameHeadingR2">
                                                Block Name
                                            </div>
                                            <div class="PsNameHeadingR2">
                                                Polling Station Name
                                            </div>
                                            <div class="P0HeadingR2">
                                                P0
                                            </div>
                                            <div class="P1HeadingR2">
                                                P1
                                            </div>
                                            <div class="P2HeadingR2">
                                                P2
                                            </div>
                                            <div class="P3HeadingR2">
                                                P3
                                            </div>
                                            <div class="PercentExtraHeadingR2">
                                                5% Extra Employees
                                            </div>
                                        </div>  
                                        <div class="R2ListBodyContainer">
                                            <div class="blocknameR2">
                                             ${block}
                                            </div>
                                            <div class="PsNameR2">
                                                
                                            </div>
                                            <div class="P0R2">
                                            
                                            </div>
                                            <div class="P1R2">
                                            
                                            </div>
                                            <div class="P2R2">
                                            
                                            </div>
                                            <div class="P3R2">
                                            
                                            </div>
                                            <div class="PercentExtraR2">
                                                ${extra}
                                            </div>
                                        </div>
                                    </div>
                            `;


                this.randomisebodyR2.innerHTML += html;
                const dynamicblock = this.randomisebodyR2?.querySelectorAll(".dynamicDataListR2");
                const newblock = dynamicblock[dynamicblock.length - 1];
                const psdiv = newblock.querySelector(".PsNameR2");
                const P0div = newblock.querySelector(".P0R2");
                const P1div = newblock.querySelector(".P1R2");
                const P2div = newblock.querySelector(".P2R2");
                const P3div = newblock.querySelector(".P3R2");


            group.forEach((val ,  index)=>{
                const divPS = document.createElement("div");
                const divP0 = document.createElement("div");
                const divP1 = document.createElement("div");
                const divP2 = document.createElement("div");
                const divP3 = document.createElement("div");
                divPS.className = `PSR2`;
                divP0.className = `P0R2inner`;
                divP1.className = `P1R2inner`;
                divP2.className = `P2R2inner`;
                divP3.className = `P3R2inner`;

                divPS.textContent = ps[index];
                divP0.textContent = val.P0;
                divP1.textContent = val.P1;
                divP2.textContent = val.P2;
                divP3.textContent = val.P3;

                psdiv.appendChild(divPS);
                P0div.appendChild(divP0);
                P1div.appendChild(divP1);
                P2div.appendChild(divP2);
                P3div.appendChild(divP3);

            }); 

            newblock.classList.remove("hidden");
            
    }

async  saveRandomisation2blockdata(){
        try {
            if(this.BlockinputR2.value  === ""){
                this.alertboxheading.innerText = "failed To Insert Data ";
                this.alertmsg.innerHTML=`   <p><strong>⚠️ data block is empty ⚠️</strong></p>
                                            <p>Do you want to continue?</p>
                                            `;
                this.actiontype = "ResetNone";
                this.alertbg.classList.remove("hidden");
                throw new error("data block is empty");
            }
            const url = `/saveRandomisation2`;
            const response = await axios.post(url,{
                ET : this.ET.value,
                block : this.BlockinputR2.value,
                data : this.dataGroup,
            });

            const data = response.data;
            if(data.success){
            const unsavedblock = this.randomisebodyR2.querySelectorAll(".dynamicDataListR2");
            const savedblock = this.saveddatacontainer.querySelectorAll(".dynamicDataListR2");
            unsavedblock.forEach((ublock)=>{
                if(ublock.querySelector(".blocknameR2").textContent.trim() === data.block){
                    savedblock.forEach((sblock)=>{
                        if(sblock.querySelector(".blocknameR2").textContent.trim() === data.block){
                            sblock.remove()
                        }
                    });
                    
                    this.saveddatacontainer.appendChild(ublock);
                    this.savedcontainerparent.classList.remove("hidden");
                }
            });
            this.randomisation2resetbtn.disabled = false;
            this.pop.textContent = `${data.block} Data Inserted Successfully`;
            this.pop.style.opacity = "1";
            setTimeout(() => {
                this.pop.style.opacity = "0";
            }, 3000);
            this.dynamicrandomiseData2.push(this.dataGroup);
            }
        } catch (error) {
            
        }
    }
    resetRandomisation2Alert(){
        if(this.dynamicrandomiseData2.length > 0){  
           this.alertboxheading.innerText = "Reset All Randomisation Data ";
           this.alertmsg.innerHTML=`   <p><strong>⚠️ Are you sure you want to reset this data? ⚠️</strong></p>
                                        <p>This action will:</p>
                                        <p>1: Clear the preset data on this page</p>
                                        <p>2: If Backend Data Exist then it will Permanently delete the associated data from the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "resetallRandomisation2";
        }else{
            this.alertboxheading.innerText = "Data Not Found ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ No Data Exist for Reset ⚠️</strong></p>
                                        <p>Please Insert Data First to Reset</p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "ResetNone";
        }
         
            this.alertbg.classList.remove("hidden");
    }



async resetRandomisation2(){
        try {
            const url = `/resetallRandomisation2`;
            const response = await axios.delete(url,{
                params : {
                    ET : this.ET.value
                }
            });
            const data = response.data;
            if(data.success){
                this.dynamicrandomiseData2 = [];
                this.saveddatacontainer.innerHTML = "";
                this.randomisebodyR2.innerHTML = ""; 
                this.alertbg.classList.add("hidden");
                this.savedcontainerparent.classList.add("hidden");
                this.pop.textContent = `${data.message}`;
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
                this.randomisation2Savebtn.disabled = true;
            }
        } catch (error) {
            
        }
    }

    downloadRandomiseDataR2(){
         const opt = {
            margin: [1.5, 0.5, 0.5, 0.5],  // Top, left, bottom, right
            filename: 'Randomisation2.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

            html2pdf()
            .set(opt)
            .from(this.saveddatacontainer)
            .toPdf()
            .get('pdf')
            .then(function (pdf) {
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // 🔹 Heading
                pdf.setFontSize(16);
                pdf.text("Randomisation 2 Report", pageWidth / 2, 0.75, { align: "center" });

                // 🔹 Date (Top-right)
                const today = new Date().toLocaleDateString();
                pdf.setFontSize(10);
                pdf.text(`Date: ${today}`, pageWidth - 1.5, 1.05);

                // 🔹 Description
                pdf.setFontSize(11);
                pdf.text("This document contains randomly allocated election duty data.", 0.75, 1.35);

                // 🔹 Bottom-right footer text
                pdf.setFontSize(10);
                const footerText = "Report generated by EDMS";
                const textWidth = pdf.getTextWidth(footerText);
                pdf.text(footerText, pageWidth - textWidth - 0.5, pageHeight - 0.5);  // 0.5 inch from bottom-right
            })
            .save();
    }
}

class RANDOMISATION3{
    constructor(){
        this.randomizordropdown = document.querySelector(".randomizationlist");
        this.alertbg = document.querySelector(".alertbg");
        this.alertmsg = document.querySelector(".alertmsg");
        this.alertconfirm = document.querySelector(".alertconfirm button");
        this.alertboxheading = document.querySelector(".alertheading h3");
        this.alertbtn = document.querySelector(".alertconfirm button");
        this.ET = document.querySelector(".randomElectioninput");
        this.pop = document.querySelector(".PopUPMessageContainer");
        this.rnpages = document.querySelectorAll(".rnp");
        this.BlockinputR3 = document.querySelector(".R3BlockInput");
        this.dynamicblocklistR3 = document.querySelector(".dynamicR3blockContainer");
        this.mainparent = document.querySelector(".randomizationBodyR3");
        this.savedparentcontainerR3 = document.querySelector(".savedtablecontainerR3");
        this.randomisation3Btn = document.querySelector(".randombtncontainerR3 button");
        this.randomisation3saveBtn = document.querySelector(".savebtncontainerR3 button");
        this.randomisation3resetBtn = document.querySelector(".resetbtncontainerR3 button");
        this.saveddatacontainerR3 = document.querySelector(".savedtablecontainerR3 .contenttableR3");
        this.unsavedatacontainerR3 = document.querySelector(".tablecontainerR3"); 
        this.downloadR3 = document.querySelector(".downloadR3");
        this.init();
        this.dataBlocks = [];
        this.actiontype = null ;
        this.dynamicrandomiseData3 = [];
        this.saveddata =  [{block : [],ps : [],id : []}]
        this.alertactionhandlers = {
            Randomization3 : ()=>{
                this.checkRandomisation2data();

            },

            startRandomization3 : ()=>{
            this.randomizationpage3();
            },
            resetallRandomisation3 : ()=>{
                this.cleanR3Page();
                this.resetRandomisation3();
            }, 
            ResetNone : ()=>{
                    this.randomizordropdown.disabled = false;
                    this.alertbg.classList.add("hidden");
            },
        }
    }
    init(){
        this.randomizordropdown.addEventListener("change",()=>{
            this.openrandomizationForR3();
        });
        this.alertbtn.addEventListener("click",()=>this.callalert(this.actiontype));
        this.BlockinputR3.addEventListener("click",()=>this.dynamicR3blockContainer());
        this.dynamicblocklistR3.addEventListener("click",(event)=>{
            if(event.target.classList.contains("BlockNamesR3")){
             this.BlockinputR3.value = event.target.textContent;
             this.BlockinputR3.disabled = false;
             this.randomisation3Btn.disabled = false ;
             const blocknames = document.querySelectorAll(".BlockNamesR3");
                blocknames.forEach((b)=>{
                    b.classList.remove("showR3");
                });
            }
        });

        this.randomisation3Btn.addEventListener("click",()=>this.startRandomisation3());
        this.randomisation3saveBtn.addEventListener("click",()=>this.saveRandomisation3blockdata());
        this.randomisation3resetBtn.addEventListener("click",()=>this.checkRandomData3forReset());
        this.downloadR3.addEventListener("click",()=>this.downloadRandomiseDataR3());
    }

    openrandomizationForR3(){
        this.actiontype = this.randomizordropdown.value;
        this.currentpageR2 = this.randomizordropdown.value;
        this.callalert(this.actiontype);
    }

    callalert(action){
          if(this.alertactionhandlers[action] && action !== null){
            this.alertactionhandlers[action]();
        }
    }

    async checkRandomisation2data(){
        try {
            const url = `/checkrandomise2data`;
            console.log(this.ET.value);
            const response = await axios.get(url,{
                params : {
                    ET : this.ET.value
                }
            });
            const data = response.data;
            if(data.success){
                this.dataBlocks = data.block;
                this.alertboxheading.innerText = "Start Randomization 3";
                this.alertmsg.innerHTML =`<p><strong>⚠️${data.message}?⚠️</strong></p>
                                            <p>This action will:</p>
                                            <p>1: Start The Session</p>
                                            <p>2: Work on Pre-Existing Election Data If New Data is Not Set</p>
                                            <p><strong>This cannot be undone.</strong></p>
                                            <p>Do you want to continue?</p>
                                            `;
                this.actiontype = "startRandomization3";
                this.alertbg.classList.remove("hidden");
                await this.checkpreExistingDataR3();
            }
            } catch (error) {
                if (error.response) {
                const data = error.response.data;
                console.log("Error:", error.response.data.message); // server responded with error
                    this.alertboxheading.innerText = "Required Randomization 2 Data";
                    this.alertmsg.innerHTML =`<p><strong>⚠️${data.message}?⚠️</strong></p>
                                                <p> Please first start Randomisation 2 for the data </p>
                                                <p>Do you want to continue?</p>
                                                `;
                    this.actiontype = "ResetNone";
                    this.alertbg.classList.remove("hidden");
                } else {
                    console.log("Error:", error.message); // other errors (network etc.)
                } 
            }
        }


    async checkpreExistingDataR3(){
        try {
            const response = await axios.get(`/checkdataR3`,{
                params : {
                    ET : this.ET.value,
                }
            });
            const data = response.data;
            
            if(data.success){
            const flatData = data.group;
            const grouped = {};

            if(this.saveddatacontainerR3.querySelector(".dynamicDataListR3")){
              return;  
            } 
                
            flatData.forEach(item => {
            if (!grouped[item.ElectionBlock]){
                grouped[item.ElectionBlock] = {
                    records: []
                };
            }
                grouped[item.ElectionBlock].records.push(item);
            });

      // Loop each block group
      Object.entries(grouped).forEach(([blockName, {  records }]) => {
        const html = `
          <div class="dynamicDataListR3">
            <div class="R3ListHeadingContainer">
              <div class="blocknameHeadingR3">Block Name</div>
              <div class="PsNameHeadingR3">Polling Station Name</div>
              <div class="P0HeadingR3">P0</div>
              <div class="P1HeadingR3">P1</div>
              <div class="P2HeadingR3">P2</div>
              <div class="P3HeadingR3">P3</div>
              <div class="PercentExtraHeadingR3">5% Extra Employees</div>
            </div>
            <div class="R2ListBodyContainer">
              <div class="blocknameR3">${blockName}</div>
              <div class="PsNameR3"></div>
              <div class="P0R3"></div>
              <div class="P1R3"></div>
              <div class="P2R3"></div>
              <div class="P3R3"></div>
              <div class="PercentExtraR3"></div>
            </div>
          </div>
        `;

        this.saveddatacontainerR3.innerHTML += html;

        const dynamicblocks = this.saveddatacontainerR3.querySelectorAll(".dynamicDataListR3");
        const newblock = dynamicblocks[dynamicblocks.length - 1];

        const psdiv = newblock.querySelector(".PsNameR3");
        const P0div = newblock.querySelector(".P0R3");
        const P1div = newblock.querySelector(".P1R3");
        const P2div = newblock.querySelector(".P2R3");
        const P3div = newblock.querySelector(".P3R3");
        const extras = newblock.querySelector(".PercentExtraR3");
        records.forEach(val => {
          const divPS = document.createElement("div");
          const divP0 = document.createElement("div");
          const divP1 = document.createElement("div");
          const divP2 = document.createElement("div");
          const divP3 = document.createElement("div");

          divPS.className = `PSR3`;
          divP0.className = `P0R3inner`;
          divP1.className = `P1R3inner`;
          divP2.className = `P2R3inner`;
          divP3.className = `P3R3inner`;

          divPS.textContent = val.PS;
          divP0.textContent = val.P0;
          divP1.textContent = val.P1;
          divP2.textContent = val.P2;
          divP3.textContent = val.P3;

          psdiv.appendChild(divPS);
          P0div.appendChild(divP0);
          P1div.appendChild(divP1);
          P2div.appendChild(divP2);
          P3div.appendChild(divP3);
        });

        data.extradata.forEach((ex)=>{
        const extra = document.createElement("div");
        extra.className = `EXTRA5R3`;
        if(newblock.querySelector('.blocknameR3').textContent.trim() === ex.ElectionBlock){
            extra.textContent = ex.Extra5Percent;
            extras.appendChild(extra);
        }
        });

        newblock.classList.remove("hidden");
        this.dynamicrandomiseData3.push(data.group);
      });
      this.savedparentcontainerR3.classList.remove("hidden");
      this.randomisation3saveBtn.disabled = true;
      this.randomisation3resetBtn.disabled = false;
            
            }
        } catch (error) {
            console.error("Error loading pre-existing data:", error);
            this.saveddatacontainerR3.innerHTML = "";
            this.savedparentcontainerR3.classList.add("hidden");
        }
    }

        randomizationpage3(){
            this.rnpages.forEach((page)=>{
                if(page.classList.contains(this.currentpageR2)){
                    page.classList.remove("hidden");
                }else{
                    page.classList.add("hidden");
                }
            })
            this.alertbg.classList.add("hidden");
        }
        dynamicR3blockContainer(){
            this.BlockinputR3.disabled = true;
            this.BlockinputR3.value = "";
            this.dynamicblocklistR3.innerHTML = "";
            this.dataBlocks.forEach((block , index)=>{
                const div = document.createElement("div");
                div.className = "BlockNamesR3";
                div.textContent = block;

                this.dynamicblocklistR3.appendChild(div);

                // Animate after it's in the DOM
                setTimeout(() => {
                    div.classList.add("showR3");
                    }, 10 + index * 50);
            });

        }
async  startRandomisation3(){
    try {
            const url = `/Randomisation3`;
            console.log(this.BlockinputR3.value , this.ET.value);
            const response = await axios.get(url,{
                params :{
                    ET : this.ET.value,
                    block : this.BlockinputR3.value
                }
            });
            const data = response.data;
    
            if(data.success){
                const parentcontainer = this.unsavedatacontainerR3?.querySelectorAll(".dynamicDataListR3");
    
                parentcontainer.forEach((container)=>{
                    if(container.querySelector(".blocknameR3").textContent.trim() === data.block){
                        container.remove();
                    }
                });
                this.unsavedatacontainerR3.innerHTML += `
                     <div class="dynamicDataListR3 hidden">
                        <div class="R3ListHeadingContainer">
                            <div class="blocknameHeadingR3">
                                Block Name
                            </div>
                            <div class="PsNameHeadingR3">
                                Polling Station Name
                            </div>
                            <div class="P0HeadingR3">
                                P0
                            </div>
                            <div class="P1HeadingR3">
                                P1
                            </div>
                            <div class="P2HeadingR3">
                                P2
                            </div>
                            <div class="P3HeadingR3">
                                P3
                            </div>
                            <div class="PercentExtraHeadingR3">
                                5% Extra Employees
                            </div>
                        </div>  
                        <div class="R3ListBodyContainer">
                            <div class="blocknameR3">
                                ${data.block}
                            </div>
                            <div class="PsNameR3">
                                
                            </div>
                            <div class="P0R3">
                            
                            </div>
                            <div class="P1R3">
                            
                            </div>
                            <div class="P2R3">
                            
                            </div>
                            <div class="P3R3">
                            
                            </div>
                            <div class="PercentExtraR3">
                            </div>
                        </div>
                    </div>
                `;
    
                const parent = this.unsavedatacontainerR3.querySelectorAll(".dynamicDataListR3 ");
                const first = parent[parent.length - 1];
                const psdiv = first.querySelector(".PsNameR3");
                const P0div = first.querySelector(".P0R3");
                const P1div = first.querySelector(".P1R3");
                const P2div = first.querySelector(".P2R3");
                const P3div = first.querySelector(".P3R3");
                const extra5percent = first.querySelector(".PercentExtraR3");
    
                data.randomisedata.forEach((data)=>{
                    const divPS = document.createElement("div");
                    const divP0 = document.createElement("div");
                    const divP1 = document.createElement("div");
                    const divP2 = document.createElement("div");
                    const divP3 = document.createElement("div");
                    divPS.className = `PSR3`;
                    divP0.className = `P0R3inner`;
                    divP1.className = `P1R3inner`;
                    divP2.className = `P2R3inner`;
                    divP3.className = `P3R3inner`;
    
                    divPS.textContent = data.pollingStation;
                    divP0.textContent = data.P0;
                    divP1.textContent = data.P1;
                    divP2.textContent = data.P2;
                    divP3.textContent = data.P3;
    
                    psdiv.appendChild(divPS);
                    P0div.appendChild(divP0);
                    P1div.appendChild(divP1);
                    P2div.appendChild(divP2);
                    P3div.appendChild(divP3);
                }); 
                
                data.extra.forEach((ex)=>{
                    const extra = document.createElement("div");
                    extra.className = `EXTRA5R3`;
                    extra.textContent = ex;
                    extra5percent.appendChild(extra);
                });
                this.saveddata = [{
                    block: [data.block],
                    ps: data.randomisedata.map(d => d.pollingStation),
                    id: data.randomisedata.map(d => d.id)
                }];
    
                console.log(this.dynamicrandomiseData3);
                first.classList.remove("hidden");
                this.randomisation3saveBtn.disabled = false;
            }
        } catch (error) {
          if(error.response){
                const data = error.response.data;
                 this.alertboxheading.innerText = "Required Randomization Data";
                this.alertmsg.innerHTML=`<p><strong>⚠️${message}?</strong></p>
                                            <p><strong>please contanct HODS or Re-Enter the data</strong></p>
                                            <p>press continue to close?</p>
                                            `;
                this.actiontype = "ResetNone";
                this.BlockinputR3.value = "";
                this.randomizordropdown.disabled = true;
                this.alertbg.classList.remove("hidden");
            }else {
            console.log("Error:", error.message); // other errors (network etc.)
            } 
    }
    }

   async saveRandomisation3blockdata(){
        try {
            if(this.BlockinputR3.value  === ""){
                this.alertboxheading.innerText = "failed To Insert Data ";
                this.alertmsg.innerHTML=`   <p><strong>⚠️ data block is empty ⚠️</strong></p>
                                            <p>Do you want to continue?</p>
                                            `;
                this.actiontype = "ResetNone";
                this.alertbg.classList.remove("hidden");
                throw new error("data block is empty");
            }
            const url = `/saveRandomisation3`;
            const response = await axios.post(url,{
                ET : this.ET.value,
                data : this.saveddata,
            });

            const data = response.data;

            if(data.success){
                const unsavedblock = this.unsavedatacontainerR3.querySelectorAll(".dynamicDataListR3");
                const savedblock = this.savedparentcontainerR3.querySelectorAll(".dynamicDataListR3");
                unsavedblock.forEach((ublock)=>{
                    if(ublock.querySelector(".blocknameR3").textContent.trim() === data.block[0]){
                        savedblock.forEach((sblock)=>{
                            if(sblock.querySelector(".blocknameR3").textContent.trim() === data.block[0]){
                                sblock.remove();
                            }
                            console.log("y");
                        });

                        console.log("g");
                        this.saveddatacontainerR3.appendChild(ublock);
                        this.savedparentcontainerR3.classList.remove("hidden");
                        this.dynamicrandomiseData3.push(data.block[0]);   
                    }
                });
                console.log("x");
                this.randomisation3resetBtn.disabled = false;
                this.pop.textContent = `${data.block} Data Inserted Successfully`;
                this.pop.style.opacity = "1";
                setTimeout(() => {
                    this.pop.style.opacity = "0";
                }, 3000);
            }
        } catch (error) {
             if(error.response){
            const data = error.response.data;
            this.alertboxheading.innerText = "failed  To Insert Data ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ ${data}⚠️</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "ResetNone";
            this.alertbg.classList.remove("hidden");
        }else {
            console.log("Error:", error.message); // other errors (network etc.)
            } 
        }
    }

    checkRandomData3forReset(){
        if(this.dynamicrandomiseData3.length > 0 ){
            this.alertboxheading.innerText = "Reset All Randomisation Data ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ Are you sure you want to reset this data? ⚠️</strong></p>
                                        <p>This action will:</p>
                                        <p>1: Clear the preset data on this page</p>
                                        <p>2: If Backend Data Exist then it will Permanently delete the associated data from the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "resetallRandomisation3";
        }else{
            this.alertboxheading.innerText = "Data Not Found ";
            this.alertmsg.innerHTML=`   <p><strong>⚠️ No Data Exist for Reset ⚠️</strong></p>
                                        <p>Please Insert Data First to Reset</p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "ResetNone";
        }
         
            this.alertbg.classList.remove("hidden");
    }

    cleanR3Page(){
        this.saveddatacontainerR3.innerHTML = "";
        this.savedparentcontainerR3.classList.add("hidden");
    }

async resetRandomisation3(){
    try {
        const response = await axios.delete(`/resetallRandomisation3`,{
            params : {
                ET : this.ET.value,
            }
        });
        const data = response.data;
        if(data.success){
            this.dynamicrandomiseData3 = [];
            this.alertbg.classList.add("hidden");
            this.BlockinputR3.value = "";
            this.pop.textContent = `${data.message}`;
            this.pop.style.opacity = "1";
            this.randomisation3saveBtn.disabled = true;
            this.randomisation3Btn.disabled = true;
            this.randomisation3resetBtn.disabled = true;
            setTimeout(() => {
                this.pop.style.opacity = "0";
            }, 3000);
        }
    } catch (error) {
        
    }
    }

      downloadRandomiseDataR3(){
         const opt = {
            margin: [1.5, 0.5, 0.5, 0.5],  // Top, left, bottom, right
            filename: 'Randomisation3.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

            html2pdf()
            .set(opt)
            .from(this.saveddatacontainerR3)
            .toPdf()
            .get('pdf')
            .then(function (pdf) {
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // 🔹 Heading
                pdf.setFontSize(16);
                pdf.text("Randomisation 3 Report", pageWidth / 2, 0.75, { align: "center" });

                // 🔹 Date (Top-right)
                const today = new Date().toLocaleDateString();
                pdf.setFontSize(10);
                pdf.text(`Date: ${today}`, pageWidth - 1.5, 1.05);

                // 🔹 Description
                pdf.setFontSize(11);
                pdf.text("This document contains randomly allocated election duty data.", 0.75, 1.35);

                // 🔹 Bottom-right footer text
                pdf.setFontSize(10);
                const footerText = "Report generated by EDMS";
                const textWidth = pdf.getTextWidth(footerText);
                pdf.text(footerText, pageWidth - textWidth - 0.5, pageHeight - 0.5);  // 0.5 inch from bottom-right
            })
            .save();
    }

    
}
class Posting{
    constructor(){
        this.postingType = document.querySelector(".postingTypes");
        this.hodlist = document.querySelector(".hodlist");
        this.hodInput = document.querySelector(".hodInput");
        this.priorityList = document.querySelector(".priorityList");
        this.hodcontainer = document.querySelector(".selectHodcontainer");
        this.postingimgbtn = document.querySelector(".postsfiles");
        this.imginput = document.querySelector(".postimages");
        this.previewimage = document.querySelector(".postImgvisible");
        this.postBtn = document.querySelector(".inputSent i");
        this.postmessage  = document.querySelector(".postsinputfield");
        this.pop = document.querySelector(".PopUPMessageContainer");
        this.init();
    }

    init(){
        this.postingType.addEventListener("change",()=>this.postingpreference());
        this.hodInput.addEventListener("click", async ()=>{
            await this.opendynamichodlist();
            this.hodlist.classList.remove("hidden");
        });

        this.hodlist.addEventListener("click",(e)=>this.selectHod(e));
        this.postingimgbtn.addEventListener("click",()=>{
            this.imginput.click()
        });
        this.imginput.addEventListener("change",()=>this.postPreview());
        this.postBtn.addEventListener("click",()=>this.postAinfo());
        
    }
    postingpreference(){
        this.hodcontainer.classList.toggle("hidden");
    }
async  opendynamichodlist(){
    try {
        const url = `/showHodList`;
        const response = await axios.get(url);
        const data = response.data;
        const name = data.hoddata.map( name => name.adminName);
        if(data.success){
            this.hodInput.disabled = true;
            if(!this.hodlist.querySelector(".HodListOptionsContainer p")){
                 name.forEach((name)=>{
                   this.hodlist.innerHTML +=`
                    <div class ="HodListOptionsContainer">
                            <p>${name}</p>
                    </div>`;
                });
            }
        }
    } catch (error) {
        if (error.response) {
            console.log("Error:", error.response.data.message); // server responded with error
        } else {
            console.log("Error:", error.message); // other errors (network etc.)
        } 
    }
    }

    selectHod(e){
        if(e.target.matches(".HodListOptionsContainer p")){
            const name = e.target.textContent;
            this.hodInput.value = name;
            this.hodInput.disabled = false;
            this.hodlist.classList.add("hidden");
        }
    }

        postPreview() {
        const file = this.imginput.files[0];
        const previewContainer = this.previewimage;

        // Clear previous preview
        previewContainer.innerHTML = "";

        if (file) {
            const fileType = file.type;

            if (fileType.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = "100px";
                img.style.height = "auto";
                previewContainer.appendChild(img);
            } 
            else if (fileType === "application/pdf") {
                const fileReader = new FileReader();
                fileReader.onload = function() {
                    const typedarray = new Uint8Array(this.result);

                    pdfjsLib.getDocument({ data: typedarray }).promise.then(function(pdf) {
                        pdf.getPage(1).then(function(page) {
                            const scale = 0.5;
                            const viewport = page.getViewport({ scale: scale });

                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            canvas.height = viewport.height;
                            canvas.width = viewport.width;

                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };

                            page.render(renderContext).promise.then(function() {
                                previewContainer.appendChild(canvas);
                            });
                        });
                    });
                };
                fileReader.readAsArrayBuffer(file);
            } 
            else {
                const fileInfo = document.createElement("p");
                fileInfo.textContent = `Selected file: ${file.name}`;
                previewContainer.appendChild(fileInfo);
            }

            previewContainer.classList.remove("hidden");
        }
    }

async postAinfo(){
        if(this.postmessage.value === "" && this.imginput.files.length === 0){
            this.pop.textContent = `Please Provide Data to sentNothing to send! Please type something or attach a file.`;
            this.pop.style.opacity = "1";
            setTimeout(() => {
                this.pop.style.opacity = "0";
            }, 5000);
            return;
        }
        try {
            const url = `/Uploadpost`;
            const response = await axios.post(url,{
                message : this.postmessage.value,
                
            });
        } catch (error) {
            
        }
    }
}
new HOD();
new VIEWEMPLOYEE();
new NAVBAR();
new ELECTIONPLACEMENT();
new RANDOMISATION1();
new RANDOMISATION2();
new RANDOMISATION3();
new Posting();