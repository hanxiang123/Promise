- [Promise](#promise)
  - [一. Promise是什么？](#一-promise是什么)
    - [1. 回调地狱](#1-回调地狱)
  - [二. Promise使用](#二-promise使用)
  - [三. Promise 对象的状态](#三-promise-对象的状态)
  - [四.Promise对象方法](#四promise对象方法)
    - [1.Promise.resolve](#1promiseresolve)
    - [2.Promise.reject](#2promisereject)
    - [3.Promise.all](#3promiseall)
    - [4.Promise.race](#4promiserace)
    - [5.Promise.allSettled](#5promiseallsettled)
    - [6.Promise.any](#6promiseany)
  - [五.手写Promise](#五手写promise)
  - [六.Async与Await](#六async与await)
    - [1.Async](#1async)
    - [2.Await](#2await)
    - [3.错误处理](#3错误处理)


### Promise

#### 一. Promise是什么？

> Promise 是异步编程的一种解决方案，比传统的解决方案回调函数,  更合理和更强大。ES6 将其写进了语言标准，统一了用法，原生提供了Promise对象 。

- 指定回调函数方式更灵活易懂。

- 解决异步 **回调地狱** 的问题。



##### 1. 回调地狱

- 当一个回调函数嵌套一个回调函数的时候

- 就会出现一个嵌套结构

- 当嵌套的多了就会出现回调地狱的情况

- 比如我们发送三个 ajax 请求

  - 第一个正常发送
  - 第二个请求需要第一个请求的结果中的某一个值作为参数
  - 第三个请求需要第二个请求的结果中的某一个值作为参数

  ```javascript
  ajax({
    url: '我是第一个请求',
    success (res) {
      // 现在发送第二个请求
      ajax({
        url: '我是第二个请求'，
        data: { a: res.a, b: res.b },
        success (res2) {
          // 进行第三个请求
          ajax({
            url: '我是第三个请求',
            data: { a: res2.a, b: res2.b },
    				success (res3) { 
              console.log(res3) 
            }
          })
        }
      })
    }
  })
  ```

- **回调地狱，其实就是回调函数嵌套过多导致的**

![](assets/huidiaodiyu.jpeg)

- 当代码成为这个结构以后，已经没有维护的可能了

  

#### 二. Promise使用

- 语法：

  ```javascript
  new Promise(function (resolve, reject) {
    // resolve 表示成功的回调
    // reject 表示失败的回调
  }).then(function (res) {
    // 成功的函数
  }).catch(function (err) {
    // 失败的函数
  })
  ```





#### 三. Promise 对象的状态

Promise 对象通过自身的状态，来控制异步操作。Promise 实例具有三种状态。

 ```
异步操作未完成（pending）
异步操作成功（fulfilled）
异步操作失败（rejected）
 ```

这三种的状态的变化途径只有两种。

 ```
从“未完成”到“成功”
从“未完成”到“失败”
 ```

一旦状态发生变化，就凝固了，不会再有新的状态变化。这也是 Promise 这个名字的由来，它的英语意思是“承诺”，一旦承诺成效，就不得再改变了。这也意味着，Promise 实例的状态变化只可能发生一次。

因此，Promise 的最终结果只有两种。

 ```
异步操作成功，Promise 实例传回一个值（value），状态变为fulfilled。
异步操作失败，Promise 实例抛出一个错误（error），状态变为rejected。
 ```

![image-20220902141409899](assets/image-20220902141409899.png)

#### 四.Promise对象方法

> Promise 是一个对象，也是一个构造函数。

##### 1.Promise.resolve

将现有对象转为 Promise 对象

```javascript
Promise.resolve('kerwin')
// 等价于
new Promise(resolve => resolve('kerwin'))
```

##### 2.Promise.reject

`Promise.reject(reason)`方法也会返回一个新的 Promise 实例，该实例的状态为`rejected`。

```javascript
const p = Promise.reject('error');
// 等同于
const p = new Promise((resolve, reject) => reject('error'))
```

##### 3.Promise.all

`Promise.all()`方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```javascript
const p = Promise.all([p1, p2, p3]);
```

p的状态由p1,p2,p3 决定，分成两种情况。

（1）只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

（2）只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

##### 4.Promise.race

`Promise.race()`方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```javascript
const p = Promise.race([p1, p2, p3]);
```

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

##### 5.Promise.allSettled

`Promise.allSettled()`方法，用来确定一组异步操作是否都结束了（不管成功或失败）。所以，它的名字叫做”Settled“，包含了”fulfilled“和”rejected“两种情况。

```js
const promises = [ ajax('/200接口'), ajax('/401接口') ];

Promise.allSettled(promises).then(results=>{
    // 过滤出成功的请求
    results.filter(item =>item.status === 'fulfilled');
    过滤出失败的请求
    results.filter(item=> item.status === 'rejected');
})

```

##### 6.Promise.any

只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。

> `Promise.any()`跟`Promise.race()`方法很像，只有一点不同，就是`Promise.any()`不会因为某个 Promise 变成`rejected`状态而结束，必须等到所有参数 Promise 变成`rejected`状态才会结束。

#### 五.手写Promise

```js

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
```

#### 六.Async与Await

##### 1.Async

async 函数，使得异步操作变得更加方便。

- 更好的语义。
- 返回值是 Promise。

```js
async function test(){
	
}
test()
```



##### 2.Await

`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

```js
async function test(){
    var res1 =  await ajax("http://localhost:3000/news1")
    var res2 =  await ajax("http://localhost:3000/news2")
    return res2
}

test().then(res=>{
	console.log("返回结果",res)
}).catch(err=>{
	console.log("err",err)
})
```



##### 3.错误处理

```js
try{
    var res1 =  await ajax("http://localhost:3000/news1")
    var res2 =  await ajax("http://localhost:3000/news2")
}catch(err){
	console.log("err",err)
}
```



