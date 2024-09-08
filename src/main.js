
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