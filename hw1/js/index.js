const g = document.querySelector('g');
const circle = document.querySelector('circle');
function f() {
    var chbox = document.getElementById('checkbox');
    var smile = document.getElementById('curve')
    var lable = document.getElementById('lbl')
    if (chbox.checked) {
        lable.innerHTML = 'Happy'
        smile.setAttribute('d', "M 150 230 Q 225 300 300 230")
    }
    else {
        lable.innerHTML = 'Sad'
        smile.setAttribute('d', "M 150 230 Q 230 150 300 230");
    }
}