const contentContainer = document.getElementById('dynamic');

function loadSection(sectionName){
    fetch(`./sections/${sectionName}.html`)
        .then(response => response.text())
        .then(html => {
            contentContainer.innerHTML = html;
            if(window.innerWidth < 787){
                document.querySelector("#static").style.left = "-100%";
            }else{
                document.querySelectorAll('.link').forEach( link => {
                    link.classList.remove("active");
                })
                document.querySelector(`#${sectionName}`).classList.add("active");
            }
        })
        .catch(error => {
            console.error('Error loading template:', error);
            alert(`Error loading section. Please try again, if the problem perisides please contact support.
                   Error Details: ${error}`);
        });
}

document.querySelectorAll('.link').forEach( link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        loadSection(link.id);
    });
});

loadSection('home');
