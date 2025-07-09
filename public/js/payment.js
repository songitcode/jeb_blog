document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetSelector = button.getAttribute('data-copy');
        const text = document.querySelector(targetSelector)?.innerText || '';
        navigator.clipboard.writeText(text).then(() => {
            button.innerHTML = '<i class="fa fa-check text-success"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fa fa-copy"></i>';
            }, 1500);
        });
    });
});

function showToast(message) {
    const toast = document.getElementById('copy-toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetSelector = button.getAttribute('data-copy');
        const text = document.querySelector(targetSelector)?.innerText || '';
        navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép: ' + text);
            button.innerHTML = '<i class="fa fa-check text-success"></i>';
            setTimeout(() => {
                button.innerHTML = '<i class="fa fa-copy"></i>';
            }, 1500);
        });
    });
});