async function loadUI() {
    const userId = "440837500848570376";
    const url = `https://api.lanyard.rest/v1/users/${userId}`;

    const res = await fetch(url);
    const { data } = await res.json();

    // ===== Avatar =====
    const avatarURL = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=2048`;
    const avatar = document.getElementById("avatar");
    avatar.src = avatarURL;

    // Avatar viền theo trạng thái
    avatar.classList.add("status-" + data.discord_status);

    // ===== Tên =====
    document.getElementById("name").textContent =
        data.discord_user.display_name || data.discord_user.username;

    // ===== Trạng thái =====
    const statusMap = {
        online: "🟢 Online",
        idle: "🌙 Idle",
        dnd: "⛔ Do Not Disturb",
        offline: "⚫ Offline"
    };
    document.getElementById("status").textContent = statusMap[data.discord_status];

    // ===== Custom Status =====
    const custom = data.activities.find(a => a.type === 4);
    if (custom) {
        document.getElementById("custom").innerHTML =
            `<p>${custom.emoji?.name || ""} ${custom.state || ""}</p>`;
    }

    // ===== Activities =====
    const actDiv = document.getElementById("activities");
    actDiv.innerHTML = "";

    data.activities
        .filter(a => a.type === 0) // chỉ activity thật (game/app)
        .forEach(a => {
            const startTime = a.timestamps?.start
                ? new Date(a.timestamps.start).toLocaleString()
                : "Không rõ";

            const largeImg = a.assets?.large_image
                ? `https://cdn.discordapp.com/app-assets/${a.application_id}/${a.assets.large_image}.png`
                : null;

            const smallImg = a.assets?.small_image
                ? `https://cdn.discordapp.com/app-assets/${a.application_id}/${a.assets.small_image}.png`
                : null;

            actDiv.innerHTML += `
            <div class="activity-card">
                <div class="activity-left">
                    ${largeImg ? `<img src="${largeImg}" class="large-icon">` : `<div class="large-icon empty"></div>`}
                </div>

                <div class="activity-right">
                    <div class="d-flex align-items-center gap-1">
                        <div><b>${a.name}</b></div>
                        <div>${smallImg ? `<img src="${smallImg}" class="small-icon">` : ""}</div>
                    </div>
                    ${a.details ? `<div>${a.details}</div>` : ""}
                    ${a.state ? `<div>${a.state}</div>` : ""}
                    <div class="time">${startTime}</div>
                </div>
            </div>
        `;
        });
}

async function loadStatus() {
    const userId = "440837500848570376";
    const url = `https://api.lanyard.rest/v1/users/${userId}`;

    const res = await fetch(url);
    const { data } = await res.json();

    const status = data.discord_status;

    const dot = document.querySelector(".dot-active");

    // Xóa class cũ
    // dot.classList.remove("status-online", "status-idle", "status-dnd", "status-offline");

    // Thêm class theo trạng thái
    dot.classList.add(`dot-${status}`);

    // Custom Status
    const custom = data.activities.find(a => a.type === 4);
    if (custom) {
        document.getElementById("custom").innerText =
            `${custom.emoji?.name || ""} ${custom.state || ""}`;
    }
}
loadUI();
loadStatus();