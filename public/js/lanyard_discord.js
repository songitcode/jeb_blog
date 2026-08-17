(() => {
  const USER_ID = "440837500848570376";
  // const API_URL = `https://api.lanyard.rest/v1/users/${USER_ID}`;
  const API_URL = `https://lanyard.rest/v1/users/${USER_ID}`;
  const fallbackAvatar = "./images/avatar_1.png";
  let activityTimers = [];

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[char]));

  const formatDuration = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h > 0 ? String(h).padStart(2, "0") : null, String(m).padStart(2, "0"), String(s).padStart(2, "0")]
      .filter(Boolean).join(":");
  };

  const statusText = {
    online: "🟢 Online",
    idle: "🌙 Idle",
    dnd: "⛔ Do Not Disturb",
    offline: "⚫ Offline"
  };

  const statusShort = { online: "Online", idle: "Idle", dnd: "DND", offline: "Offline" };

  function avatarUrl(user) {
    if (user?.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
    const index = Number((BigInt(user?.id || USER_ID) >> 22n) % 6n);
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }

  function assetUrl(activity, key) {
    const asset = activity?.assets?.[key];
    if (!asset || !activity?.application_id) return null;
    if (asset.startsWith("mp:") || asset.startsWith("spotify:")) return null;
    if (asset.startsWith("https://") || asset.startsWith("http://")) return asset;
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${asset}.png?size=128`;
  }

  function activityLabel(activity) {
    if (activity.type === 2) return "Listening";
    if (activity.type === 3) return "Watching";
    if (activity.type === 5) return "Competing";
    if (activity.type === 4) return "Custom Status";
    return "Playing";
  }

  function clearTimers() {
    activityTimers.forEach(clearInterval);
    activityTimers = [];
  }

  function renderActivities(data) {
    const container = $("activities");
    if (!container) return;
    clearTimers();

    const activities = Array.isArray(data?.activities)
      ? data.activities.filter((a) => a.type !== 4)
      : [];

    if ($("activityCount")) $("activityCount").textContent = `${activities.length} hoạt động`;

    if (!activities.length) {
      container.innerHTML = `<div class="activity-empty"><i class="fa-regular fa-moon"></i> Hiện không có hoạt động công khai.</div>`;
      return;
    }

    container.innerHTML = activities.map((a, index) => {
      const large = assetUrl(a, "large_image");
      const small = assetUrl(a, "small_image");
      const start = a.timestamps?.start || null;
      const timeId = `activity-time-${index}`;
      const detail = a.details || a.state || "";
      const state = a.details && a.state ? a.state : "";
      return `
        <div class="activity-card">
          <div class="activity-left">
            ${large ? `<img src="${escapeHtml(large)}" class="large-icon" alt="" loading="lazy" onerror="this.style.display='none'">` : `<div class="large-icon empty"></div>`}
          </div>
          <div class="activity-right">
            <div><b>${escapeHtml(a.name || activityLabel(a))}</b>${small ? `<img src="${escapeHtml(small)}" class="small-icon" alt="" loading="lazy">` : ""}</div>
            <div>${escapeHtml(detail)}</div>
            ${state ? `<div>${escapeHtml(state)}</div>` : ""}
            <div class="time" id="${timeId}">${start ? formatDuration(Date.now() - start) : activityLabel(a)}</div>
          </div>
        </div>`;
    }).join("");

    activities.forEach((a, index) => {
      const el = $(`activity-time-${index}`);
      if (!el || !a.timestamps?.start) return;
      const update = () => { el.textContent = formatDuration(Date.now() - a.timestamps.start); };
      update();
      activityTimers.push(setInterval(update, 1000));
    });
  }

  function render(data) {
    const user = data?.discord_user;
    const status = data?.discord_status || "offline";
    const avatar = $("avatar");
    const name = $("name");
    const statusEl = $("status");
    const shortEl = $("discordStatusShort");
    const dot = $("discordStatusDot");
    const customEl = $("custom");

    if (avatar && user) {
      avatar.src = avatarUrl(user);
      avatar.onerror = () => { avatar.onerror = null; avatar.src = fallbackAvatar; };
    }
    if (name && user) name.firstChild.nodeValue = `${user.global_name || user.display_name || user.username || "Discord User"} `;
    if (statusEl) statusEl.textContent = statusText[status] || statusText.offline;
    if (shortEl) shortEl.textContent = statusShort[status] || "Offline";
    if (dot) {
      dot.classList.remove("dot-online", "dot-idle", "dot-dnd", "dot-offline");
      dot.classList.add(`dot-${status}`);
      dot.title = statusText[status] || "Offline";
    }

    const custom = Array.isArray(data?.activities) ? data.activities.find((a) => a.type === 4) : null;
    if (customEl) {
      if (custom) {
        const emoji = custom.emoji?.name || "";
        customEl.innerHTML = `<span>${escapeHtml(`${emoji} ${custom.state || ""}`.trim())}</span>`;
      } else {
        customEl.innerHTML = `<span>Không có custom status</span>`;
      }
    }

    renderActivities(data);
  }

  async function loadDiscord() {
    try {
      const response = await fetch(API_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      if (!payload?.success || !payload?.data) throw new Error("Invalid Lanyard response");
      render(payload.data);
    } catch (error) {
      console.warn("Không thể tải Discord Lanyard:", error);
      if ($("status")) $("status").textContent = "⚫ Không thể tải trạng thái Discord";
      if ($("discordStatusShort")) $("discordStatusShort").textContent = "Unavailable";
      if ($("custom")) $("custom").innerHTML = `<span>Discord status tạm thời không khả dụng</span>`;
      if ($("activities")) $("activities").innerHTML = `<div class="activity-empty"><i class="fa-solid fa-plug-circle-xmark"></i> Không kết nối được Lanyard API.</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadDiscord();
    // Refresh periodically so status/activity stays current even if the page remains open.
    setInterval(loadDiscord, 30000);
  });
})();
