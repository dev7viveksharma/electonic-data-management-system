
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
                    console.log(data);
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
    this.electionblocksinput.value = ""
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
                let flag = false;
                const url = `/searchSelectedPosts`;
                const election = document.querySelector(".ETInput").value;
                const response = await axios.post(url,{
                        ET: election,
                        P0:this.p0array,
                        P1:this.p1array,
                        P2:this.p2array,
                        P3:this.p3array,
                        EXP1 : this.extravalueP1Array,
                        EXP2 : this.extravalueP2Array,
                        EXP3 : this.extravalueP3Array
                });

                const data = response.data;
                if(data.success){
                    
                    this.checkCountPost ={
                                    P0 : data.count.P0,
                                    P1 : data.count.P1,
                                    P2 : data.count.P2, 
                                    P3 : data.count.P3
                                }

                    this.checkExtraCountPosts = {
                                    P1 : data.EXCount.EXP1,
                                    P2 : data.EXCount.EXP2,
                                    P3 : data.EXCount.EXP3
                                }
                    let backendTotal = 0;
                    let frontendTotal = 0;
                    for(let i = 0 ; i<4 ; i++){
                        backendTotal += this.checkCountPost[`P${i}`];
                        frontendTotal += this[`p${i}array`].length;
                    }
                    if(backendTotal !== 0 && frontendTotal === backendTotal){
                        console.log(frontendTotal , backendTotal , "hit ?");
                        flag = true;
                    }
                    return flag;
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
            
        }
    }
}
new HOD();
new VIEWEMPLOYEE();
new NAVBAR();
new ELECTIONPLACEMENT();