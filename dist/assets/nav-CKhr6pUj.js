function p(){const n=document.createElement("style");n.textContent=`
    /* Mobile menu toggle button styling */
    .menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 21px;
      cursor: pointer;
      background: rgba(13, 13, 14, 0.6);
      backdrop-filter: blur(16px);
      padding: 12px;
      border-radius: 8px;
      gap: 3px;
      position: fixed;
      top: 40px;
      right: 40px;
      z-index: 101;
    }

    .menu-toggle span {
      display: block;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    /* Mobile responsive styles */
    @media (max-width: 768px) {
      /* Adjust header for mobile */
      #header {
        padding: 16px !important;
        background: rgba(30, 30, 33, 0.95);
        backdrop-filter: blur(10px);
      }

      #header img {
        height: 32px !important;
        padding: 6px !important;
      }

      /* Show menu toggle on mobile */
      .menu-toggle {
        display: flex !important;
        top: 16px;
        right: 20px;
      }

      /* Hide nav by default on mobile */
      nav {
        display: none !important;
        position: fixed !important;
        top: 70px !important;
        left: 16px !important;
        right: 16px !important;
        width: auto !important;
        max-height: calc(100vh - 100px) !important;
        background: rgba(13, 13, 14, 0.95) !important;
        padding: 24px !important;
        flex-direction: column !important;
        overflow-y: auto !important;
        z-index: 99 !important;
      }

      /* Show nav when open */
      nav.open {
        display: flex !important;
      }

      nav ul {
        width: 100% !important;
        gap: 16px !important;
      }

      nav ul li .dropdown-menu {
        position: static !important;
        width: 100% !important;
        margin-top: 8px !important;
        margin-left: 16px !important;
      }

      nav ul li:hover .dropdown-menu,
      nav ul li.active .dropdown-menu {
        display: block !important;
      }

      nav a {
        font-size: 18px !important;
        padding: 8px 0 !important;
      }

      /* Ensure content doesn't hide under nav */
      #hero, .hero {
        margin-top: 60px !important;
        padding-top: 40px !important;
      }

      /* Fix h1 visibility */
      h1 {
        margin-top: 20px !important;
      }

      /* Fix stats positioning in about section */
      #about .horizontal {
        flex-direction: column !important;
      }

      #about .stats {
        width: 100% !important;
        max-width: none !important;
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 12px !important;
        margin-top: 24px !important;
      }

      #about .stats div {
        width: 100% !important;
        min-width: auto !important;
        padding: 10px 16px !important;
        box-sizing: border-box !important;
      }

      #about .stats div p {
        font-size: 0.875rem !important;
      }

      #profile_image {
        width: 100% !important;
        max-width: none !important;
      }

      /* Fix text within cards */
      .service-item, .dropped-service, .service-card, .project-card, .stat-card {
        padding: 1rem !important;
        box-sizing: border-box !important;
      }

      .service-item *, .dropped-service *, .service-card *, .project-card *, .stat-card * {
        max-width: 100% !important;
        word-wrap: break-word !important;
      }
    }

    /* Ensure h1 is not hidden on desktop */
    @media (min-width: 769px) {
      #hero, .hero {
        margin-top: 40px !important;
        padding-top: 80px !important;
      }
    }

    /* Ensure text stays within all cards */
    .service-card, .project-card, .stat-card, .service-item, .dropped-service {
      overflow: hidden !important;
      word-wrap: break-word !important;
      box-sizing: border-box !important;
    }

    .service-card *, .project-card *, .stat-card *, .service-item *, .dropped-service * {
      max-width: 100% !important;
      overflow-wrap: break-word !important;
    }
  `,document.head.appendChild(n);const i=document.getElementById("header"),e=i?i.querySelector("nav"):null;if(!i||!e)return;let t=document.getElementById("menu-toggle");t||(t=document.createElement("div"),t.id="menu-toggle",t.className="menu-toggle",t.innerHTML="<span></span><span></span><span></span>",i.appendChild(t)),t.addEventListener("click",()=>{e.classList.toggle("open"),t.classList.toggle("active")}),e.querySelectorAll("a").forEach(o=>{o.addEventListener("click",()=>{e.classList.remove("open"),t.classList.remove("active")})}),document.addEventListener("click",o=>{e.classList.contains("open")&&!e.contains(o.target)&&!t.contains(o.target)&&(e.classList.remove("open"),t.classList.remove("active"))}),window.innerWidth<=768&&e.querySelectorAll("li.dropdown").forEach(a=>{const r=a.querySelector("a");r&&r.addEventListener("click",s=>{s.preventDefault(),a.classList.toggle("active")})})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",p):p();let d;window.addEventListener("resize",()=>{clearTimeout(d),d=setTimeout(()=>{const n=document.querySelector("nav"),i=document.getElementById("menu-toggle");window.innerWidth>768&&(n&&n.classList.remove("open"),i&&i.classList.remove("active"))},250)});
