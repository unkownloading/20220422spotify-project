# Firebase 設定教學

- firebase 官網開專案
- nodejs 版本需在10以上
---
- ### 建專案資料夾並在底下下指令
- ### `npm init -y` 產生package.json
- ### `npm install -g --save-dev firebase-tools` 安裝 firebase工具
- ### 確認版本可以下 `npm --version`(-v沒用)
- ### `firebase login` 登入firebase
  - 系統會詢問是否允許firebaseb搜尋Cli使用量及錯誤報告，依個人習慣選Y/N
  - 成功跳出'Firebase Cli Login Successful!'
- ###  `firebase init` 初始化firebase環境
  - Are you ready to proceed ? `Yes`
  - 以`空白鍵`選擇`Hosting(代管項項)`
  - Please select an option: `Use as existing project`選擇使用既有專案
  - 選擇建立專案的名稱
  - what do you want to use as your public directory? 預設public直接按`enter`即可
  - Configure as a single-page app(rewrite all urls to /index.html)設定為單頁App? `Yes`
  - Set up automatic builds and deploys with Github 設定自動建立以及Github佈署(deploy)? 這裡選擇`NO`(慣用github的人可以選Yes)
  - 成功顯示`Firebase initialization complete`
  - `firebase deploy` 佈署Public內的網頁
- ### 即可開啟網頁