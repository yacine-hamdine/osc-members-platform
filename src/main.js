
window.homePage = function(){
    null;
}
window.newsPage = function(){
    null;
}
window.createPage = function(){
    null;
}
window.activitiesPage = function(){
    null;
}
window.plannerPage = function(){
    null;
}
window.sudoPage = function(){
    null;
}

if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
        console.log('Service Worker registration failed:', error);
    });
}


window.main = function(args){
    document.querySelectorAll('.link').forEach( link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            route(link.id);
        });
    });
    route(args.page);

    getProfile(args.user);
}