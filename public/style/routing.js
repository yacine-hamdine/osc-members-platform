const contentContainer = document.getElementById('dynamic');

function loadSection(sectionName){
    fetch(`./sections/${sectionName}.html`)
        .then(response => response.text())
        .then(html => {
            
            // Loading Correspondant HTML
            contentContainer.innerHTML = html;

            // Loading Correspondant JS
            if(sectionName == "home"){
                //homePage();
            }
            else if(sectionName == "news"){
                //newsPage();
            }
            else if(sectionName == "create"){
                //createPage();
            }
            else if(sectionName == "activities"){
                //activitiesPage();
            }
            else if(sectionName == "planner"){
                //plannerPage();
            }
            else if(sectionName == "profile"){
                profilePage();
            }
            else if(sectionName == "account"){
                //accountPage();
            }
            else if(sectionName == "sudo"){
                //sudoPage();
            }

            // Applying Some Styles
            if(window.innerWidth < 787){
                document.querySelector("#static").style.left = "-100%";
            }
            document.querySelectorAll('.link').forEach( link => {
                link.classList.remove("active");
            });
            document.querySelector(`#${sectionName}`).classList.add("active");

            localStorage.setItem('currentPage', sectionName);
        })
        .catch(error => {
            console.error('Error loading template:', error);
            //alert(`Error loading section. Please try again, if the problem perisides please contact support.
             //      Error Details: ${error}`);
        });
}

function route(route){
    switch(route){
        case "home":
            loadSection('home');
            break;
        case "news":
            loadSection('news');
            break;
        case "create":
            loadSection('create');
            break;
        case "activities":
            loadSection('activities');
            break;
        case "planner":
            loadSection('planner');
            break;
        case "profile":
            loadSection('profile');
            break;
        case "account":
            loadSection('account');
            break;
        case "sudo":
            loadSection('sudo');
            break;
        default :
            loadSection('home');
    }
}

document.querySelectorAll('.link').forEach( link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        route(link.id);
    });
});

route('home');
