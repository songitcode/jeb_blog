document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];

  // Mobile navigation
  const nav = $("#nav"), navToggle = $("#navToggle");
  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  $$(".nav a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }));

  // Active section in navigation
  const sections = $$("main section[id]");
  const navLinks = $$(".nav a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, {rootMargin:"-30% 0px -60% 0px", threshold:0});
  sections.forEach(section => observer.observe(section));

  // Reveal animations
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.08});
  $$(".reveal").forEach(el => revealObserver.observe(el));

  // Gallery modal
  const modal = $("#imageModal"), modalImage = $("#modalImage"), modalTitle = $("#modalTitle");
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    modalImage.src = "";
  };
  $$(".gallery-item").forEach(item => item.addEventListener("click", () => {
    modalImage.src = item.dataset.img;
    modalImage.alt = item.dataset.title || "Preview";
    modalTitle.textContent = item.dataset.title || "";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
  }));
  $("#modalClose")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", e => { if(e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

  // Copy account numbers
  const toast = $("#toast");
  let toastTimer;
  const showToast = () => {
    clearTimeout(toastTimer);
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  };
  $$(".copy-btn").forEach(btn => btn.addEventListener("click", async () => {
    const value = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    showToast();
  }));

  // Music player — starts only after an explicit user action (browser autoplay safe)
  const audio = $("#audioPlayer"), playButton = $("#playButton"), playIcon = $("#playIcon");
  const nextButton = $("#nextButton"), progress = $("#progressBar"), title = $("#songTitle"), time = $("#songTime");
  const playlist = [
    {src:"./audio/music5_deepsea_binz.mp3", title:"Deep Sea — Binz x Thanh Nguyễn x Triple D"},
    {src:"./audio/music6_daonay_obito.mp3", title:"obito — dạo này"},
    {src:"./audio/music3_naobietdau_lilwuyn.mp3", title:"Lil Wuyn — Nào biết đâu"}
  ];
  let track = 0;

  const format = sec => {
    if(!Number.isFinite(sec)) return "00:00";
    const m = Math.floor(sec/60), s = Math.floor(sec%60);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  };
  const loadTrack = async (index, autoplay=false) => {
    track = (index + playlist.length) % playlist.length;
    audio.src = playlist[track].src;
    title.textContent = playlist[track].title;
    progress.value = 0;
    time.textContent = "00:00 / 00:00";
    if(autoplay){
      try { await audio.play(); } catch {}
    }
  };
  const sync = () => {
    progress.value = audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
    time.textContent = `${format(audio.currentTime)} / ${format(audio.duration)}`;
  };
  playButton?.addEventListener("click", async () => {
    if(!audio.src) await loadTrack(track);
    if(audio.paused){
      try { await audio.play(); } catch {}
    } else audio.pause();
  });
  nextButton?.addEventListener("click", () => loadTrack(track + 1, true));
  audio.addEventListener("play", () => playIcon.className = "fa-solid fa-pause");
  audio.addEventListener("pause", () => playIcon.className = "fa-solid fa-play");
  audio.addEventListener("timeupdate", sync);
  audio.addEventListener("loadedmetadata", sync);
  audio.addEventListener("ended", () => loadTrack(track + 1, true));
  progress?.addEventListener("input", () => {
    if(audio.duration) audio.currentTime = (Number(progress.value)/100)*audio.duration;
  });
  loadTrack(0, false);

  $("#year").textContent = new Date().getFullYear();
});
