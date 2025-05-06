class TOPBAR{
    constructor(){
        this.dropMenu = document.querySelector(".js_dropMenu");
        this.bar = document.querySelector(".js_bars");
        this.name = document.querySelector(".adminName");
        this.init();
        this.showname();
    }
    init(){
        this.bar.addEventListener("click",(event)=>this.showdropmenu(event));
    }

    showdropmenu(){
        this.dropMenu.classList.toggle("drop");
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
}

new TOPBAR();