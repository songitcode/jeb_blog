// Khởi tạo particles.js
document.addEventListener('DOMContentLoaded', function () {
    particlesJS('particles-js', {
        particles: {
            number: { value: 150, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: false },
            move: {
                enable: true,
                speed: 1,
                direction: "bottom",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        }
    });

    // Tạo hiệu ứng quà rơi
    createFallingGifts();

    // Tạo hiệu ứng chuyển động cho các phần tử
    animateDecorations();
});

// Tạo quà rơi
function createFallingGifts() {
    const giftsContainer = document.getElementById('gifts-container');
    const giftCount = 15;

    for (let i = 0; i < giftCount; i++) {
        const gift = document.createElement('div');
        gift.classList.add('gift');

        // Màu sắc ngẫu nhiên
        const colors = ['#ff3366', '#33ccff', '#ffcc00', '#9933ff', '#33ff66'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        gift.style.background = color;

        // Vị trí ngẫu nhiên
        const leftPosition = Math.random() * 100;
        gift.style.left = `${leftPosition}%`;

        // Thời gian rơi ngẫu nhiên
        const fallDuration = Math.random() * 10 + 5;
        const fallDelay = Math.random() * 5;

        // Sử dụng GSAP để tạo hiệu ứng rơi
        gsap.to(gift, {
            y: '120vh',
            rotation: 360,
            duration: fallDuration,
            delay: fallDelay,
            repeat: -1,
            ease: 'power1.in'
        });

        // Thêm xoay ngang ngẫu nhiên
        gsap.to(gift, {
            x: '+=100',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        giftsContainer.appendChild(gift);
    }
}

// Tạo hiệu ứng chuyển động cho các phần tử trang trí
function animateDecorations() {
    // Ông già Noel bay lên xuống
    gsap.to('.santa-container', {
        y: '+=20',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Tuần lộc lắc lư
    gsap.to('.reindeer-container', {
        rotation: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Cây thông lắc lư nhẹ
    gsap.to('.tree-container', {
        rotation: 3,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    // Người tuyết nhún nhảy
    gsap.to('.snowman-container', {
        y: '+=10',
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}