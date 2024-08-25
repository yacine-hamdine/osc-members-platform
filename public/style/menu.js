function menuPanel(){
    let menu = document.getElementById('static');
    let btn = document.getElementById('humburger');
    
    btn.onclick = (ev) => {
        if(menu.style.left != '0px'){
            // Open Menu
            menu.style.left = '0px';
            ev.stopPropagation();

            // When Click Outside
            document.addEventListener("click", () => {
                // Close Menu
                menu.style.left = '-100%';
            });
        }else{
            // Close Menu
            menu.style.left = '-100%';
        }
    }
    
}

window.innerWidth < 767 ? menuPanel() : null;
