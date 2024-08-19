const contentContainer = document.getElementById('dynamic');

function loadSection(sectionName){
    fetch(`./sections/${sectionName}.html`)
        .then(response => response.text())
        .then(html => {
            contentContainer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading template:', error);
            alert(`Error loading section. Please try again, if the problem perisides please contact support.
                   Error Details: ${error}`);
        });
}

function handleRouteChange(route){
    switch (route){
        case '/':
            loadSection('home');
            break;
        case '/news':
            loadSection('news');
            break;
        case '/activities':
            loadSection('activities');
            break;
        case '/planner':
            loadSection('planner');
            break;
        case '/profile':
            loadSection('profile');
        case '/account':
            loadSection('account');
            break;
        case '/admin':
            loadSection('admin');
            break;    
        default:
            loadSection('home');
    }
}

document.querySelectorAll('.link').forEach( link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        handleRouteChange(link.dataset.url);
    });
});

handleRouteChange('/');
