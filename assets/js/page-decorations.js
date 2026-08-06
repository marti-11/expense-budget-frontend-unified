(function () {
  "use strict";

  const sets = {
    "login.html": [
      ["🎟️", "82%", "9%", 62, -9], ["🪙", "89%", "68%", 54, 12], ["🎪", "5%", "55%", 48, -6]
    ],
    "register.html": [
      ["🎉", "7%", "12%", 48, -12], ["💳", "86%", "17%", 62, 8], ["🐷", "8%", "76%", 58, 9], ["🧾", "90%", "72%", 44, -7]
    ],
    "forgot-password.html": [
      ["🔑", "8%", "16%", 62, -12], ["🕵️", "84%", "70%", 54, 10]
    ],
    "reset-password.html": [
      ["🔐", "85%", "12%", 60, 8], ["🎊", "7%", "67%", 50, -10], ["🛡️", "89%", "78%", 44, -4]
    ],
    "home-base.html": [
      ["🎪", "4%", "14%", 56, -8], ["🪙", "91%", "12%", 44, 10], ["📈", "3%", "62%", 48, 6], ["💡", "92%", "53%", 52, -8], ["🎯", "86%", "84%", 42, 12]
    ],
    "spending-spree.html": [
      ["🛒", "3%", "29%", 58, -9], ["🧾", "91%", "58%", 50, 7], ["💸", "7%", "84%", 44, -5]
    ],
    "money-jails.html": [
      ["🔐", "4%", "18%", 52, -8], ["🐷", "90%", "25%", 60, 9], ["🏦", "5%", "78%", 46, 5], ["🪙", "92%", "73%", 42, -12]
    ],
    "my-face.html": [
      ["🪞", "5%", "25%", 58, -7], ["😎", "90%", "67%", 56, 10]
    ]
  };

  const page = location.pathname.split("/").pop() || "index.html";
  const decorations = sets[page];
  if (!decorations) return;

  if (["login.html", "register.html", "forgot-password.html", "reset-password.html"].includes(page)) {
    document.body.classList.add("ff-auth-page");
  }

  decorations.forEach(function (item, index) {
    const element = document.createElement("span");
    element.className = "ff-background-decor";
    element.setAttribute("aria-hidden", "true");
    element.textContent = item[0];
    element.style.left = item[1];
    element.style.top = item[2];
    element.style.setProperty("--decor-size", item[3] + "px");
    element.style.setProperty("--decor-rotation", item[4] + "deg");
    element.style.setProperty("--decor-delay", (index * -.55) + "s");
    element.style.setProperty("--decor-speed", (3.1 + index * .35) + "s");
    document.body.appendChild(element);
  });
})();
