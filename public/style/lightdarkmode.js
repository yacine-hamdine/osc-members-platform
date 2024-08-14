let date = new Date();

let r = document.querySelector(":root");

if(date.getHours() >= 7 && date.getHours() < 19){
    // Light Mode
    r.style.setProperty("--bg-color", "rgb(248, 230, 255)");
    r.style.setProperty("--title-color", "#470068");
    r.style.setProperty("--text-color", "#000000");
    r.style.setProperty("--el-bg-color", "#dc8fff");
    r.style.setProperty("--box-bg-color", "#ffffff");
    r.style.setProperty("--el-shadow", "inset 3px 3px 30px 0px rgba(0,0,0,0.2)");
    r.style.setProperty("--box-shadow", "3px 3px 30px 0px rgba(0,0,0,0.5)");
}
else{
    // Dark Mode
    r.style.setProperty("--bg-color", "rgb(48, 0, 48)");
    r.style.setProperty("--title-color", "#dc8fff");
    r.style.setProperty("--text-color", "#ffffff");
    r.style.setProperty("--el-bg-color", "#470068");
    r.style.setProperty("--box-bg-color", "#000000");
    r.style.setProperty("--el-shadow", "inset 3px 3px 30px 0px rgba(255,255,255,0.2)");
    r.style.setProperty("--box-shadow", "3px 3px 30px 0px rgba(255,255,255,0.5)");
}