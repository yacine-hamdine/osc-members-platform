function menuPanel() {
    let menu = document.getElementById('static');
    let btn = document.getElementById('humburger');
    
    let closeMenuOnClickOutside = (e) => {
        if (e.target.id !== "static" && e.target.id !== "humburger") {
            menu.style.left = '-100%';
            document.removeEventListener("click", closeMenuOnClickOutside);
        }
    };

    btn.onclick = (ev) => {
        if (menu.style.left !== '0px') {
            // Open Menu
            menu.style.left = '0px';
            ev.stopPropagation();
            
            // Add event listener to close menu when clicking outside
            document.addEventListener("click", closeMenuOnClickOutside);
        } else {
            // Close Menu
            menu.style.left = '-100%';
            document.removeEventListener("click", closeMenuOnClickOutside);
        }
    };
}

window.innerWidth < 767 ? menuPanel() : null;