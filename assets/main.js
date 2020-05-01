window.onload = function() {
    var colors = [
        'rgb(216, 88, 113)', // Pink
        'rgb(202, 66, 70)',  // Red
        'rgb(82, 170, 222)', // Blue
        'rgb(232, 113, 45)', // Orange
        'rgb(113, 174, 69)', // Green
        'rgb(145, 88, 152)', // Purple
        'rgb(0, 51, 100)'    // Navy
    ];
    var color = colors[Math.floor(Math.random() * colors.length)];
    document.documentElement.style.setProperty('--main-color', color);
}