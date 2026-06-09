function switchPage(url, menuId) {
    document.getElementById('content-frame').src = url;
    
    const menuItems = document.querySelectorAll('#nav-menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    
    document.getElementById(menuId).classList.add('active');
}

window.navigateToView = function(viewName, menuId) {
    switchPage(viewName, menuId);
}
