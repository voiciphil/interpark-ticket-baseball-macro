const preset = () => {
    const groundList = document.getElementById('ifrmSeat')
        .contentWindow
        .document
        .getElementsByClassName('groundList')[0]
        .getElementsByClassName('list')[0]
        .getElementsByTagName('a');

    Array.from(groundList).forEach((ground) => {
        if (parseInt(ground.getAttribute('rc')) === 0) {
            ground.setAttribute('rc', '1');
        }
    });
};
