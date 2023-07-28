/**
 * author: hanxiang
 */

function TestPromise(executor) {
    this.status = 'pending'
    this.result = undefined
    this.cb = []
    const _this = this

    function resolve(res) {
        if (_this.status !== 'pending') return
        _this.result = res
        _this.status = 'fulfilled'

        _this.cb.forEach(item => {
            item.successCB && item.successCB(_this.result)
        });
    }

    function reject(err) {
        if (_this.status !== 'pending') return
        _this.result = err
        _this.status = 'rejected'

        _this.cb.forEach(item => {
            item.failCB && item.failCB(_this.result)
        });
    }

    executor(resolve, reject)
}
TestPromise.prototype.then = function(successCB, failCB) {
    return new TestPromise((resolve, reject) => {

        function loop(result) {
            if (result instanceof TestPromise) {
                result.then(res => {
                    resolve(res)
                }, err => {
                    reject(err)
                })
            } else {
                resolve(result)
            }
        }

        if (this.status === 'fulfilled') {
            if (successCB) {
                loop(successCB(this.result))
            } else {
                resolve(this.result)
            }
            
        }

        if (this.status === 'rejected') {
            if (failCB) {
                loop(failCB(this.result))
            } else {
                reject(this.result)
            }
        }

        // 异步改变状态
        if (this.status === 'pending') {
            this.cb.push({
                successCB: (res) => {
                    loop(successCB && successCB(res))
                },
                failCB: (err) => {
                    loop(failCB && failCB(err))
                }
            })
        }
    })
}

TestPromise.prototype.catch = function(failCB) {
    this.then(undefined, failCB)
}


//  测试
const T1 = new TestPromise((resolve, reject) => {
    // 同步
    resolve('success111')
    // reject('reject1111')

    // 异步
    // setTimeout(() => {
    //     resolve('success222')
    //     // reject('reject222')
    // }, 1000)
})
T1.then().then(res => {
    console.log('res1', res)
    // return 'res1111'
    return new TestPromise((resolve, reject) => {
        // resolve('res11111')
        reject('err`1111')
    })
})
.then(res => {
    console.log('res2', res)
})
// .then(res => {
//     console.log('res3', res)
// })
.catch(err => {
    console.log('catch--err-----', err)
})