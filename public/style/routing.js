const contentContainer = document.getElementById('dynamic');

function loadSection(sectionName){
    fetch(`./sections/${sectionName}.html`)
        .then(response => response.text())
        .then(html => {
            // Load Corresponding HTML
            contentContainer.innerHTML = html;

            // Load Corresponding JS Dynamically
            const sectionScript = {
                home: homePage,
                news: newsPage,
                create: createPage,
                activities: activitiesPage,
                planner: plannerPage,
                profile: profilePage,
                account: accountPage,
                sudo: sudoPage,
            };

            if(sectionScript[sectionName]){
                sectionScript[sectionName](); // Call the corresponding function if it exists
            }

            // Apply Some Styles
            if(window.innerWidth < 787){
                document.querySelector("#static").style.left = "-100%";
            }
            document.querySelectorAll('.link').forEach(link => {
                link.classList.remove("active");
            });
            document.querySelector(`#${sectionName}`).classList.add("active");

            localStorage.setItem('page', sectionName);
        })
        .catch(error => {
            console.error('Error loading template:', error);
        });
}

window.route = function(route){
    loadSection(route || 'home'); // Default to 'home' if no route is passed
}