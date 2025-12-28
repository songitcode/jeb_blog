function randomViews(min = 10, max = 500) {
    // random số thực có 3 chữ số thập phân
    let value = (Math.random() * (max - min) + min).toFixed(3);
    return value.replace('.', ',') + 'k';
}

document.getElementById('view-count').textContent = randomViews(50, 300);