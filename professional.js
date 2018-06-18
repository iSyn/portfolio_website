window.sr = ScrollReveal({
});
sr.reveal('.project-item');

let redirect = () => {
    let win = window.open('https://github.com/iSyn', '_blank');
    win.focus();
}

window.addEventListener('DOMContentLoaded', () => {
    console.log('loaded')

    let expressions = [
        'wiggle eyebrows',
        'shocked',
        'curious',
        'angry'
    ]

    let eyebrows = document.querySelectorAll('.eyebrow')
    let eyelids = document.querySelectorAll('.eyelid')
    let mouth = document.querySelector('.mouth')
    let head = document.querySelector('.head')
    let ears = document.querySelectorAll('.ear')
    let neck = document.querySelector('.neck')

    setInterval(() => {
        let num = Math.floor(Math.random() * expressions.length);
        let selected = expressions[num]

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


    }, 6.5 * 1000)
})
