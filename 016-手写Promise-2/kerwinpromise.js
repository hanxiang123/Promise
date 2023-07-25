
function KerwinPromise(executor) {
    this.status = "pending";
    this.result = undefined;
    this.cb = []
    var _this = this;

    function resolve(res) {
        if (_this.status !== "pending") return;
        // console.log(_this)
        _this.status = "fulfilled"
        _this.result = res;

        _this.cb.forEach(item => {
            item.successCB && item.successCB(_this.result)
        });
    }

    function reject(res) {
        if (_this.status !== "pending") return;
        // console.log("reject")
        _this.status = "rejected"
        _this.result = res;
        _this.cb.forEach(item => {
            item.failCB && item.failCB(_this.result)
        });
    }
    executor(resolve, reject)
}

KerwinPromise.prototype.then = function (successCB, failCB) {

    if(!successCB){
        successCB = value=>value
    }
    if(!failCB){
        failCB = error=>error
    }

    // successCB()
    return new KerwinPromise((resolve, reject) => {
        if (this.status === "fulfilled") {
            var result = successCB && successCB(this.result)
            // console.log(result);

            if (result instanceof KerwinPromise) {
                result.then(res => {
                    // console.log(res)
                    resolve(res);
                }, err => {
                    // console.log(err)
                    reject(err)
                })
            } else {
                resolve(result);
            }
        }
        if (this.status === "rejected") {
            var result = failCB && failCB(this.result)

            if (result instanceof KerwinPromise) {
                result.then(res => {
                    // console.log(res)
                    resolve(res);
                }, err => {
                    // console.log(err)
                    reject(err)
                })
            } else {
                reject(result);
            }
        }

        if (this.status === "pending") {
            //收集回调
            this.cb.push({
                successCB: () => {
                    var result = successCB && successCB(this.result)

                    if (result instanceof KerwinPromise) {
                        result.then(res => {
                            // console.log(res)
                            resolve(res);
                        }, err => {
                            // console.log(err)
                            reject(err)
                        })
                    } else {
                        resolve(result);
                    }
                },
                failCB: () => {
                    var result = failCB && failCB(this.result)
                    if (result instanceof KerwinPromise) {
                        result.then(res => {
                            // console.log(res)
                            resolve(res);
                        }, err => {
                            // console.log(err)
                            reject(err)
                        })
                    } else {
                        reject(result);
                    }
                }
            })
        }
    })
}

KerwinPromise.prototype.catch= function(failCB){
    this.then(undefined,failCB)
}