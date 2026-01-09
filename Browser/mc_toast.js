(() => {
  "use strict";

  const toast = document.getElementById("toast");
  const iconWrap = document.getElementById("toastIcon");
  const titleEl = document.getElementById("toastTitle");
  const line1El = document.getElementById("toastLine1");
  const line2El = document.getElementById("toastLine2");
  const subEl = document.getElementById("toastSub");
  const outEl = document.getElementById("toastOut");
  const inEl = document.getElementById("toastIn");

  const EXIT_MS = 250;

  const decodePayload = (payload) => {
    if (!payload) return null;
    try {
      const binary = atob(payload);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const text = new TextDecoder("utf-8").decode(bytes);
      return JSON.parse(text);
    } catch (err) {
      console.warn("Toast payload inválido", err);
      return null;
    }
  };

  const applyIcon = (type) => {
    iconWrap.innerHTML = "";
    const icon = document.createElement("span");
    icon.className = "icon";
    if (type === "GOAL_COR" || type === "GOAL") {
      icon.classList.add("icon--ball");
    } else if (type === "GOAL_AGAINST") {
      icon.classList.add("icon--ball--against");
    } else if (type === "GOAL_ANNULLED") {
      icon.classList.add("icon--ball", "icon--annulled");
    } else if (type === "YC") {
      icon.classList.add("icon--card");
    } else if (type === "RC") {
      icon.classList.add("icon--card", "icon--red");
    }
    iconWrap.appendChild(icon);
  };

  const setDisplay = (el, show) => {
    if (!el) return;
    el.style.display = show ? "" : "none";
  };

  const applyPayload = (payload) => {
    if (!payload || !payload.type) return false;

    const type = payload.type;

    

    toast.className = "toast";
    
    

    setDisplay(iconWrap, true);
    setDisplay(line1El, false);
    setDisplay(line2El, false);
    setDisplay(subEl, false); 

    
    titleEl.textContent = "";
    line1El.textContent = "";
    line2El.textContent = "";
    
    if (type === "GOAL_COR" || type === "GOAL") {
      toast.classList.add("is-goal");
      titleEl.textContent = payload.textLine1 || "GOL DO CORINTHIANS";
      line1El.textContent = payload.textLine2 || payload.who || "";
      line2El.textContent = payload.textLine3 || "";
      setDisplay(line1El, Boolean(line1El.textContent));
      setDisplay(line2El, Boolean(line2El.textContent));
      applyIcon(type);
    } else if (type === "GOAL_AGAINST") {
      toast.classList.add("is-goal-against");
      titleEl.textContent = payload.textLine1 || "GOL DO CORINTHIANS";
      line1El.textContent = payload.textLine2 || "GOL CONTRA";
      line2El.textContent = payload.textLine3 || "";
      setDisplay(line1El, Boolean(line1El.textContent));
      setDisplay(line2El, Boolean(line2El.textContent));
      applyIcon(type);
    } else if (type === "GOAL_ANNULLED") {
      toast.classList.add("is-goal-annulled");
      titleEl.textContent = payload.textLine1 || "GOL ANULADO";
      applyIcon(type);
    } else if (type === "YC") {
      toast.classList.add("is-card");
      titleEl.textContent = payload.textLine1 || "CARTÃO AMARELO";
      line1El.textContent = payload.textLine2 || payload.who || "";
      setDisplay(line1El, true);
      applyIcon(type);
    } else if (type === "RC") {
      toast.classList.add("is-card");
      titleEl.textContent = payload.textLine1 || "EXPULSÃO";
      line1El.textContent = payload.textLine2 || payload.who || "";
      setDisplay(line1El, true);
      applyIcon(type);
    } else if (type === "SUB") {
      toast.classList.add("is-sub");
      

      outEl.textContent = payload.outName || "Sai";
      inEl.textContent = payload.inName || "Entra";
      
      

      setDisplay(iconWrap, false);
      setDisplay(subEl, true);
    } else {
      return false;
    }

    return true;
  };

  const showToast = (ttlMs) => {
    toast.classList.remove("is-exiting");
    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    const ttl = Number.isFinite(ttlMs) ? ttlMs : 2000;
    const outDelay = Math.max(0, ttl - EXIT_MS);

    setTimeout(() => {
      toast.classList.add("is-exiting");
      toast.classList.remove("is-visible");
    }, outDelay);
  };

  const params = new URLSearchParams(window.location.search);
  const payloadParam = params.get("payload");
  const payload = decodePayload(payloadParam);

  if (applyPayload(payload)) {
    const ttl = payload && payload.ttlMs ? Number(payload.ttlMs) : 2000;
    showToast(ttl);
  }
})();