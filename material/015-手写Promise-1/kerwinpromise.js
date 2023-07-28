
function KerwinPromise(executor){
    this.status = "pending";
    this.result = undefined;
    this.cb = []
    var _this =this;
    
    function resolve(res){
        if(_this.status!=="pending") return;
        // console.log(_this)
        _this.status = "fulfilled"
        _this.result = res;

        _this.cb.forEach(item => {
            item.successCB && item.successCB(_this.result)
        });
    }

    function reject(res){
        if(_this.status!=="pending") return;
        // console.log("reject")
        _this.status = "rejected"
        _this.result = res;
        _this.cb.forEach(item => {
            item.failCB && item.failCB(_this.result)
        });
    }
    executor(resolve,reject)
}

KerwinPromise.prototype.then = function(successCB,failCB){
    // successCB()
    if(this.status==="fulfilled"){
        successCB && successCB(this.result)
    }
    if(this.status==="rejected"){
        failCB &&  failCB(this.result)
    }

    if(this.status==="pending"){
        //收集回调
        this.cb.push({
            successCB,
            failCB
        })
    }
}