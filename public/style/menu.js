let menu = document.getElementById('static');

function whenClickOutside(){
    document.getElementById('dynamic').addEventListener("click", () => {
        // Close Menu
        menu.style.left = '-100%';
    });
}

menu.style.left != '-100%' ? whenClickOutside() : null;

function menuPanel(){

    let btn = document.getElementById('humburger');
    
    btn.onclick = (ev) => {
        if(menu.style.left != '0px'){
            // Open Menu
            menu.style.left = '0px';
            // When Click Outside
        }else{
            // Close Menu
            menu.style.left = '-100%';
        }
    }
    
}

window.innerWidth < 767 ? menuPanel() : null;
