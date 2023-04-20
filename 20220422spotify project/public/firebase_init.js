let config = {
    apiKey: "AIzaSyC5dWagFppzihR8CYLLByOAq1vGFRSkPGI",
    authDomain: "b2b-project-88737.firebaseapp.com",
    databaseURL: "https://b2b-project-88737-default-rtdb.firebaseio.com",
    projectId: "b2b-project-88737",
    storageBucket: "b2b-project-88737.appspot.com",
    messagingSenderId: "1088811962674",
    appId: "1:1088811962674:web:88f052da828fb99f94c72b",
    measurementId: "G-HSB1Y5FS47"
}

let model = firebase.initializeApp(config, config.appId);   //配置初始化
// let messaging = firebase.messaging();   //推播訊息使用

//寫入資料庫
//set        覆蓋資料庫資料(整個覆蓋)，如果只需改變特定的key，可用update
//push       不會取代任何資料、也不會更新任何資料，而且會自帶一個隨機產生(依據時間排序)的 key。
//update     更新有改變的key

function write(path, value) {
    return new Promise(function (resolve, reject) {
        model.database().ref(path).set(value, function (error) {
            error ? reject(error) : resolve();
        })
    })
}

function read(path) {
    return new Promise(function (resolve, reject) {
        model.database().ref(path).get().then(function (snapshot) {
            resolve(snapshot.val())
        })
    })
}

//讀取資料
//on        即時更新，也就是只要資料庫一變動，就會抓取到最新資料。
//once      只會取得一次，也就是執行時會從資料庫取得最新資料
function listen(path, changeEvent) {
    model.database().ref(path).on('value', function (snapshot) {
        if (typeof changeEvent === 'function') {
            changeEvent(snapshot.val())
        }
    })
}

function makeUUID(path, data) {    //隨機新增一組key(uid)來暫存資料 
    return new Promise(function (resolve, reject) {
        model.database().ref(path).push(data, function (error) {
            error ? reject(error) : resolve();
        })
    })
}


function anonymousAuth() {     //匿名登入
    return new Promise(function (resolve, reject) {
        model.auth().signInAnonymously().then(function (auth) {
            console.log('Anonymously Register Success.');
            return resolve(auth.user);
        })
    })
}

function isLogin() {     //判斷是否登入中  回傳登入者資料
    return new Promise(function (resolve, reject) {
        model.auth().onAuthStateChanged(function (user) {
            if (user) {
                return resolve(user)
            }
            return reject()
        })
    })
}

function firebaseLogout() {   //登出
    return new Promise(function (resolve, reject) {
        model.auth().signOut().then(function () {
            resolve();
        }).catch(function (error) {
            reject(error);
        })
    })
}

function emailRegister(email, pwd) { //email註冊
    return new Promise(function (resolve, reject) {
        model.auth().createUserWithEmailAndPassword(email, pwd).then(function (auth) {
            resolve(auth);
        }).catch(function (error) {
            reject(error);
        })
    })
}



function emailAuth(email, pwd) {   //email登入
    return new Promise(function (resolve, reject) {
        model.auth().signInWithEmailAndPassword(email, pwd).then(function (auth) {
            resolve(auth);
        }).catch(function (error) {
            reject(error);
        })
    })
}

function emailDelete() {   //刪除email帳戶 
    return new Promise(function (resolve, reject) {
        model.auth().currentUser.delete().then(function () {
            resolve();
        }).catch(function (error) {
            reject(error);
        })
    })
}



function passwordForgot(email) {   //忘記密碼
    return new Promise(function (resolve, reject) {
        model.auth().sendPasswordResetEmail(email).then(function () {
            resolve();
        }).catch(function (error) {
            reject(error);
        })
    })
}

function passwordUpdate(newPassword) {   //變更密碼  (有帳號者登入後自行修改的)
    return new Promise(function (resolve, reject) {
        model.auth().updatePassword(newPassword).then(function () {
            resolve();
        }).catch(function (error) {
            reject(error);
        })
    })
}


function createUser(data) {  //建立使用者  
    // write('auditUsers/' + user.uid, data)
    makeUUID('unaduitUsers/', data);
}

function aduitUser(user, data) {     //管理者'審核'使用者並'寫入'資料庫
    write('users/' + user.uid, data).then(function () {
        Swal.fire({
            icon: 'success',
            title: '審核成功',
        }).then(()=>{
            deleteUnaduit(data.old_uid);
        })
    })
}

function undiAduitUser(user, data) {     //使用者修改資料，
    write('unaduitUsers/' + user.uid, data).then(function () {
        Swal.fire({
            icon: 'success',
            title: '審核成功',
        }).then(()=>{
            deleteUser(data.old_uid);
        })
    })
}


//刪除資料
//set        因為是 整個覆蓋，所以可以給個{}來取代，這樣資料也會等同於刪掉
//remove     指定路徑做刪除
function deleteUnaduit(uid) {
    model.database().ref('unaduitUsers/' + uid).remove();
}

//刪除使用者的同時，也要刪掉帳戶
//要刪掉帳戶 必須先登入該帳戶，再刪除
function deleteUser(uid) {
    model.database().ref('users/' + uid).remove();
}


// -------------------------------------------------------------------

// 接收到通知時
// messaging.onMessage(payload => {
//     console.log('onMessage: ', payload);
//     var notifyMsg = payload.notification;
//     var notification = new Notification(notifyMsg.title, {
//         body: notifyMsg.body,
//         icon: notifyMsg.icon
//     });
//     notification.onclick = function (e) { // 綁定點擊事件
//         e.preventDefault(); // prevent the browser from focusing the Notification's tab
//         window.open(notifyMsg.click_action);
//     }
// })