window.sr = ScrollReveal({
});
sr.reveal('.project-item');

let redirect = () => {
    let win = window.open('https://github.com/iSyn', '_blank');
    win.focus();
}

let count = 0
let randomExpression = () => {

    let expressions = [
        'shocked',
        'wiggle eyebrows',
        'angry',
        'curious'
    ]

    let eyebrows = document.querySelectorAll('.eyebrow')
    let eyelids = document.querySelectorAll('.eyelid')
    let mouth = document.querySelector('.mouth')
    let head = document.querySelector('.head')
    let ears = document.querySelectorAll('.ear')
    let neck = document.querySelector('.neck')

    let num = Math.floor(Math.random() * expressions.length);

    let selected = expressions[num]
    if (count < expressions.length) {
        selected = expressions[count]
        count++
    }


    if (selected === 'wiggle eyebrows') {
        eyebrows.forEach(eyebrow => eyebrow.classList.add('wiggle-eyebrows'))
    } else if (selected === 'shocked') {
        eyebrows.forEach(eyebrow => eyebrow.classList.add('shocked-eyebrows'))
        eyelids.forEach(eyelid => eyelid.classList.add('shocked-eyelids'))
        mouth.classList.add('shocked-mouth')
    } else if (selected === 'curious') {
        eyebrows[0].classList.add('curious-eyebrows-left')
        eyebrows[1].classList.add('curious-eyebrows-right')
        mouth.classList.add('curious-mouth')
    } else if (selected === 'angry') {
        eyebrows[0].classList.add('angry-eyebrows-left')
        eyebrows[1].classList.add('angry-eyebrows-right')
        mouth.classList.add('angry-mouth')
        head.classList.add('angry-head')
        ears.forEach(ear => ear.classList.add('angry-skin'))
        eyelids.forEach(eyelid => eyelid.classList.add('angry-eyelids'))
        neck.classList.add('angry-skin')
    }

    setTimeout(() => {
        eyebrows.forEach(eyebrow => {
            eyebrow.classList.remove('wiggle-eyebrows')
            eyebrow.classList.remove('curious-eyebrows-right')
            eyebrow.classList.remove('curious-eyebrows-left')
            eyebrow.classList.remove('angry-eyebrows-left')
            eyebrow.classList.remove('angry-eyebrows-right')
            eyebrow.classList.remove('shocked-eyebrows')
        })
        eyelids.forEach(eyelid => {
            eyelid.classList.remove('shocked-eyelids')
            eyelid.classList.remove('angry-eyelids')
        })
        mouth.classList.remove('shocked-mouth')
        mouth.classList.remove('curious-mouth')
        mouth.classList.remove('angry-mouth')
        head.classList.remove('angry-head')
        ears.forEach(ear => ear.classList.remove('angry-skin'))
        neck.classList.remove('angry-skin')

    }, 5500)

}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        randomExpression()
    }, 100)

    setInterval(() => {
        randomExpression()
    }, 6.5 * 1000)

    let frame = document.querySelector('.frame')
    let pos = frame.getBoundingClientRect()

    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }


    document.querySelector('#contact').style.paddingTop = `${pos.height + 10}px`
    if (!isMobile) {
        window.onscroll = () => {
            
            if (window.pageYOffset >= pos.top - 40) {
                frame.classList.add('sticky')
                document.querySelector('#about').style.paddingTop = `${pos.height}px`
            } else {
                frame.classList.remove('sticky')
                document.querySelector('#about').style.paddingTop = `0px`
            }
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                frame.classList.add('bottom')
                let hands = document.querySelectorAll('.pokey')
                hands.forEach(hand => {
                    hand.classList.add('show')
                })
            } else {
                frame.classList.remove('bottom')
                let hands = document.querySelectorAll('.pokey')
                hands.forEach(hand => {
                    hand.classList.remove('show')
                })
            }
        }
    }
})