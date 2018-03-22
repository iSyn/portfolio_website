let Portfolio = {}

Portfolio.launch = () => {

    Portfolio.changeTab = (tab) => {
        let allProjects = document.querySelectorAll(".content");
        allProjects.forEach((project) => { project.style.display = 'none'});
        let selectedTab = `.content__${tab}`
        document.querySelector(selectedTab).style.display = 'block'
    }

    Portfolio.showPreview = () => {
        let preview = document.createElement('div')
        let mouse = {
            x: event.clientX,
            y: event.clientY
        }
    }

    // function handleMouseMove(event) {
    //     var dot, eventDoc, doc, body, pageX, pageY;

    //     event = event || window.event; // IE-ism

    //     // If pageX/Y aren't available and clientX/Y are,
    //     // calculate pageX/Y - logic taken from jQuery.
    //     // (This is to support old IE)
    //     if (event.pageX == null && event.clientX != null) {
    //         eventDoc = (event.target && event.target.ownerDocument) || document;
    //         doc = eventDoc.documentElement;
    //         body = eventDoc.body;

    //         event.pageX = event.clientX +
    //           (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
    //           (doc && doc.clientLeft || body && body.clientLeft || 0);
    //         event.pageY = event.clientY +
    //           (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
    //           (doc && doc.clientTop  || body && body.clientTop  || 0 );
    //     }

    //     // Use event.pageX / event.pageY here
    // }

    Portfolio.hidePreview = () => {

    }
}


// window.addEventListener('DOMContentLoaded', () => {
    
//     let state = {
//         selectedTab: 'portfolio'
//     }

//     if (state.selectedTab == 'portfolio') {
//         document.querySelector('.content__portfolio').style.display = ''
//     }

//     let changeTab = (tab) => {
//         let allProjects = document.querySelectorAll('.content')
//         allProjects.forEach((project) => { project.style.display = 'none'})
//         let selectedTab = `content__${tab}`
//         console.log('changing tab to', selectedTab)
//     }

// })

window.onload = () => { Portfolio.launch() }
