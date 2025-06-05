class NAVBAR{
    constructor(){
    this.Tabs = document.querySelectorAll(".jsbtn");
    this.Init();
    this.home = document.querySelector(".homePage");
    this.active = null;
    this.activeNav = null;
    }

    Init(){
        this.Tabs.forEach((tabs)=>{
            tabs.addEventListener("click",()=>{
            const activetab = tabs.getAttribute("data-tab");
            this.showpages(tabs,activetab);
            });
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
}

class HOD {
    constructor(){
        this.dropdownArrow = document.querySelector(".dropdownArrowHod");
        this.innercontainer = document.querySelector(".listOfHODs");
        this.searchbox = document.querySelector(".HodSearch");
        this.searchbtn = document.querySelector(".hodsearchBtn");
        this.init();
    }
    init(){
        this.showHods();
        this.arrowfunction(this.dropdownArrow);
        this.searchbox.addEventListener("input",()=>this.searchEmployeesdata(this.innercontainer));
        this.searchbtn.addEventListener("click",()=>this.searchEmployeesdata(this.innercontainer));
    }
    showHods(){

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
            const url = `http://localhost:8080/Hods`
            const response = await axios.get(url);
            let data = response.data.result;
             let Heads = data.map(hods=>({
              hodname : hods.adminName,
              hodemail : hods.adminEmail,
              hodmnum : hods.adminMobileNo,
              hodDesignation : hods.adminDesignation
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
                        <p class="empDepartment">${data.hodemail}</p>
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
                    <button class="block_UnblockBtn" type="button">Block</button>
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
new HOD();
new VIEWEMPLOYEE();
new NAVBAR();