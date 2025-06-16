
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
        this.psList = [];
        this.init();
        this.documents();
        this.resetAlertResponse = 0;
        this.actiontype = null; 
        this.currentpage = 0;
        this.actionhandlers ={
            resetPolls : ()=>{
                this.reset1();
            },

            resetNone : ()=>{
                this.alertbg.classList.add("hidden");
            },

            InsertElectionData : ()=>{
                this.datainsertion();
            },

            pagechange : ()=>{
                this.page1();
                this.changepage();
            }  
        }
    }

    documents(){
        document.addEventListener("click",(event)=>{
            if (this.listofps && !this.listofps.contains(event.target)) {
               this.listofps.classList.add("hidden");
            }
        });
    }
    init(){
        this.TypeElection.addEventListener("change",()=>this.showblockList());
        this.electionblocksinput.addEventListener("click",()=>{
            this.showlistdropmenu();
        });
        this.pollingstation.addEventListener("click",(event)=>{
            event.stopPropagation(); 
            this.showps();

            setTimeout(()=>{
            const psChecks = document.querySelectorAll(".js_ps_checkpoint");
            if(this.psList.length > 0){
                psChecks.forEach((poll)=>{
                  this.psList.forEach((data)=>{
                        if(poll.value === data.ps){
                            poll.checked = true;
                        }
                    });
                });
            this.addps();
            return;
            }
                psChecks.forEach((chk) => {
                chk.addEventListener("change", () => this.addps());
                });
            },0);  
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
        this.backbtn.addEventListener("click",()=>this.backpage());
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
                    console.log(data);
                    this.electionBlocklist.innerHTML +=`
                    <div class="BlockNames">${data.ElectionBlocks}</div>
                    ` 
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

    showlistdropmenu(){
        this.electionBlocklist.classList.toggle("hidden");
        this.blocklist = document.querySelectorAll(".BlockNames");
        this.selectOptions(this.blocklist);
        
    }

 selectOptions(list){
        list.forEach((options)=>{
            options.addEventListener("click",async()=>{
                
                this.electionblocksinput.value =  options.textContent;
                this.electionBlocklist.classList.add("hidden");
                try {
                    const url = `/showPSdata`;
                    const id = localStorage.getItem("dmId");
                    const response = await axios.get(url,{

                        params:{
                                ET : this.TypeElection.value,
                                block : this.electionblocksinput.value,
                                id : id
                        }
                    });
                    const data = response.data;
                    if(data.success && data.result.length > 0){
                        this.psList = data.result.map(item => item.PS);
                        this.pollingstation.value = this.psList.join(); 
                        this.electionblocksinput.disabled = true;
                        this.pollingstation.disabled = true;
                        console.log("pass");
                        let i = this.psList.length;
                        this.calculatepolls(i);
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

    showps(){
        if(this.TotalBooth.value != ""){
            this.listofps.classList.remove("hidden");
            const length = parseInt(this.TotalBooth.value);
            this.listofps.innerHTML = "";
            for(let i =1 ; i<= length ; i++){
                this.listofps.innerHTML +=`
                <div  class ="PsOptionsContainer">
                 <label class ="PsRadiolist"> PS-${i}</label>
                 <input type="checkbox" name="PoolingStation" value="PS${i}" class="js_ps_checkpoint">
                 </div>    
                `;
            }
        
        }
    }

    addps(){
        if(this.TotalBooth.value !== ""){
            this.pollingstation.value = ""; // Clear old value
            this.psList = []; // Clear previous list
            let i = 0;
            const list = document.querySelectorAll(".js_ps_checkpoint");
            list.forEach((ps)=>{
                if(ps.checked === true){
                    this.psList.push({ps:ps.value,idx:i+1});
                    i++;
                }
            });

            if(this.psList.length > 0){
                this.psList.forEach((array)=>{
                    this.pollingstation.value += array.ps;
                });

            }

           this.calculatepolls(i);
        }  
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
        } 
        this.alertbg.classList.remove("hidden");
        
    }

    alertconfirm(action){
        if(this.actionhandlers[action] && action !== null){
            this.actionhandlers[action]();
        }
        
    }
    next(){
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
            this.alertboxmsg.innerHTML=`<p><strong>⚠️ Are you sure you want to Proceed further ?</strong></p>
                                        <p>This action will:</p>
                                        <p>Permanently insert the associated data on the server</p>
                                        <p><strong>This cannot be undone.</strong></p>
                                        <p>Do you want to continue?</p>
                                        `;
            this.actiontype = "pagechange"
            return;
        }
    }

async reset1(){
        try {
            const url = `http://localhost:8080/DeletePSdata`;
            const id = localStorage.getItem("dmId");
            const response = await axios.delete(url,{
                data:{
                    id :id,
                    ET : this.TypeElection.value,
                    Block : this.electionblocksinput.value
                }
            });
            const data = response.data;

            if(data.success){
            const reset = document.querySelectorAll(".R1");
            reset.forEach((field)=>{
                field.value = "";
            });
            this.electionblocksinput.disabled = false;
            this.pollingstation.disabled = false;
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

    page1(){
        // try {
        //     const url = `http://localhost:8080/insertdata`;

        // } catch (error) {
            
        // }
        console.log("page1");
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
        }
    }
}
new HOD();
new VIEWEMPLOYEE();
new NAVBAR();
new ELECTIONPLACEMENT();