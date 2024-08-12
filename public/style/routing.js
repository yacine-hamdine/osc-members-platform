const contentContainer = document.getElementById('dynamic');

function loadSection(sectionName) {
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

function handleRouteChange(route) {
    switch (route) {
        case '/':
            loadSection('home');
            break;
        case '/announcements':
            loadSection('announcements');
            break;
            case '/activities':
                loadSection('activities');
                break;
        case '/resources':
            loadSection('resources');
            break;
        default:
            loadSection('home');
    }
}
