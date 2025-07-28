class EDITPROFILE{
    constructor(){
        this.code = localStorage.getItem("employeeCode");
        this.init();
    }

    init(){
        this.calldata(this.code);
    }

async calldata(code){
    try {
        const url = `/calldataForEdit`;
        const response = await axios.get(url,{
            params: {code}
        });
    } catch (error) {
        
    }
    }
}