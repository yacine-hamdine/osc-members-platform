let date = new Date();

let r = document.querySelector(":root");

if(date.getHours() >= 7 && date.getHours() < 19){
    r.style.setProperty("--bg-color", "rgb(248, 230, 255)");
    r.style.setProperty("--title-color", "#470068");
    r.style.setProperty("--text-color", "#000000");
    r.style.setProperty("--el-bg-color", "#dc8fff");
}
else{
    r.style.setProperty("--bg-color", "rgb(48, 0, 48)");
    r.style.setProperty("--title-color", "#dc8fff");
    r.style.setProperty("--text-color", "#ffffff");
    r.style.setProperty("--el-bg-color", "#470068");
}