document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initVoting();
  initReplyToggle();
  initCommentCollapse();
  initNextComment();
  initCollapseAllExpand();
});


function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  updateThemeIcon();

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("hn-theme", next);
    updateThemeIcon();
  });
}

function updateThemeIcon() {
  const icon = document.querySelector(".theme-icon");
  if (!icon) return;
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  icon.textContent = isDark ? "☀" : "☾";
}


function initVoting() {
  document.querySelectorAll(".vote-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector(".vote-btn");
      if (!btn || btn.classList.contains("voted")) return;

      const data = new URLSearchParams(new FormData(form));
      try {
        const res = await fetch("/vote", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: data,
        });
        if (res.ok) {
          btn.classList.add("voted");
        }
      } catch {
        form.submit();
      }
    });
  });
}


function initReplyToggle() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".reply-toggle");
    if (toggle) {
      e.preventDefault();
      const id = toggle.dataset.commentId;
      const form = document.getElementById(`reply-${id}`);
      if (form) {
        form.classList.toggle("hidden");
        if (!form.classList.contains("hidden")) {
          form.querySelector("textarea")?.focus();
        }
      }
      return;
    }

    const cancel = e.target.closest(".reply-cancel");
    if (cancel) {
      e.preventDefault();
      const id = cancel.dataset.commentId;
      const form = document.getElementById(`reply-${id}`);
      if (form) form.classList.add("hidden");
    }
  });
}


function initCommentCollapse() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".collapse-toggle");
    if (!toggle) return;
    e.preventDefault();

    const comment = toggle.closest(".comment");
    if (!comment) return;

    const collapsible = comment.querySelector(":scope > .comment-collapsible");
    if (!collapsible) return;

    const isCollapsed = comment.classList.toggle("collapsed");
    toggle.textContent = isCollapsed ? "[+]" : "[-]";

    if (isCollapsed) {
      collapsible.style.display = "none";
    } else {
      collapsible.style.display = "";
    }
  });
}

function collapseAll() {
  document.querySelectorAll(".comment").forEach((comment) => {
    const toggle = comment.querySelector(
      ":scope > .comment-head > .collapse-toggle",
    );
    const collapsible = comment.querySelector(":scope > .comment-collapsible");
    if (toggle && collapsible) {
      comment.classList.add("collapsed");
      toggle.textContent = "[+]";
      collapsible.style.display = "none";
    }
  });
}

function expandAll() {
  document.querySelectorAll(".comment.collapsed").forEach((comment) => {
    const toggle = comment.querySelector(
      ":scope > .comment-head > .collapse-toggle",
    );
    const collapsible = comment.querySelector(":scope > .comment-collapsible");
    if (toggle && collapsible) {
      comment.classList.remove("collapsed");
      toggle.textContent = "[-]";
      collapsible.style.display = "";
    }
  });
}

function initCollapseAllExpand() {
  const collapseBtn = document.getElementById("collapse-all");
  const expandBtn = document.getElementById("expand-all");
  if (collapseBtn) collapseBtn.addEventListener("click", collapseAll);
  if (expandBtn) expandBtn.addEventListener("click", expandAll);
}


function initNextComment() {
  document.querySelectorAll(".next-root").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const currentComment = link.closest(".comment-depth-0");
      if (!currentComment) return;

      let next = currentComment.nextElementSibling;
      while (next && !next.classList.contains("comment-depth-0")) {
        next = next.nextElementSibling;
      }
      if (next) {
        next.scrollIntoView({ behavior: "smooth", block: "start" });
        next.classList.add("comment-highlight");
        setTimeout(() => next.classList.remove("comment-highlight"), 1500);
      }
    });
  });
}
