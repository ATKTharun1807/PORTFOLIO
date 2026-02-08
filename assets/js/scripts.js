lucide.createIcons();

// Theme Selection Logic
document.querySelectorAll('[data-theme-set]').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme-set');
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);

        // Visual feedback
        const menuBtn = document.getElementById('themeMenuBtn');
        if (theme === 'hacker') {
            menuBtn.style.borderColor = '#00ff41';
        } else {
            menuBtn.style.borderColor = 'var(--card-border)';
        }

        lucide.createIcons();
        updateStatusBar();
    });
});

function updateStatusBar() {
    const statusBar = document.getElementById('status-bar');
    const footerIcon = document.getElementById('footer-icon');
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';

    if (theme === 'hacker') {
        if (footerIcon) footerIcon.setAttribute('data-lucide', 'shield-check');
        statusBar.innerHTML = `
      <span class="text-[var(--accent-primary)] animate-pulse">[ ACCESS: RED_ADMIN ]</span>
      <span class="mx-2 opacity-30">|</span>
      <span class="text-[var(--text-main)]">NET_TRAFFIC: <span id="uptime-val">842</span> KB/S</span>
    `;
    } else {
        if (footerIcon) footerIcon.setAttribute('data-lucide', 'heart');
        statusBar.innerHTML = `
      <span class="text-[var(--accent-primary)]">THANK YOU FOR VISITING!</span>
      <span class="ml-2 inline-block w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse"></span>
    `;
    }
    lucide.createIcons();
}
updateStatusBar();

// Mock live traffic update
setInterval(() => {
    const val = document.getElementById('uptime-val');
    if (val) val.textContent = Math.floor(Math.random() * (999 - 100) + 100);
}, 2000);

// Global Background Animation System
function initBackgroundAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    // Matrix State
    const fontSize = 14;
    let columns, drops;

    // Particles and State
    let particles = [];
    let shootingStars = [];
    const particleCount = 150; // More for stars

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = width / fontSize;
        drops = Array(Math.ceil(columns)).fill(1);
        initParticles();
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                blinkSpeed: 0.01 + Math.random() * 0.03,
                alpha: Math.random(),
                color: '#ffffff',
                // For Light Mode (Large Mesh Blobs)
                meshX: Math.random() * width,
                meshY: Math.random() * height,
                meshSize: Math.random() * 300 + 200,
                mvX: (Math.random() - 0.5) * 1.5,
                mvY: (Math.random() - 0.5) * 1.5
            });
        }
    }

    function createShootingStar() {
        if (Math.random() > 0.98 && shootingStars.length < 3) {
            shootingStars.push({
                x: Math.random() * width,
                y: Math.random() * height / 2,
                vx: Math.random() * 10 + 10,
                vy: Math.random() * 5 + 5,
                len: Math.random() * 80 + 50,
                alpha: 1
            });
        }
    }

    function drawHacker() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(Math.floor(Math.random() * 128));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    function drawDark() {
        ctx.clearRect(0, 0, width, height);

        // Stars
        particles.forEach(p => {
            p.alpha += p.blinkSpeed;
            if (p.alpha > 1 || p.alpha < 0) p.blinkSpeed *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
            ctx.fill();
        });

        // Shooting Stars
        createShootingStar();
        shootingStars = shootingStars.filter(s => s.alpha > 0);
        shootingStars.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= 0.02;

            ctx.beginPath();
            const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len);
            grad.addColorStop(0, `rgba(255, 255, 255, ${s.alpha})`);
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s.x - s.len, s.y - s.len);
            ctx.stroke();
        });
    }

    let mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function drawLight() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            // Movement
            p.x += p.mvX * 0.5;
            p.y += p.mvY * 0.5;

            // Boundary
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Mouse Repulsion
            if (mouse.x) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += Math.cos(angle) * force * 2;
                    p.y += Math.sin(angle) * force * 2;
                }
            }

            // Draw Node
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(14, 165, 233, 0.4)';
            ctx.fill();

            // Draw Lines
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 * (1 - dist / 150)})`;
                    ctx.stroke();
                }
            }
        });
    }

    let lastTheme = null;

    function animate() {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';

        if (theme !== lastTheme) {
            ctx.clearRect(0, 0, width, height);
            lastTheme = theme;
        }

        if (theme === 'hacker') {
            drawHacker();
        } else if (theme === 'light') {
            drawLight();
        } else {
            drawDark();
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}
initBackgroundAnimation();


// Initialize theme UI
const savedThemeInput = localStorage.getItem('portfolio-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedThemeInput);
if (savedThemeInput === 'hacker') {
    const themeMenuBtn = document.getElementById('themeMenuBtn');
    if (themeMenuBtn) themeMenuBtn.style.borderColor = '#00ff41';
}

const menuBtn = document.getElementById('menuBtn');
menuBtn && menuBtn.addEventListener('click', () => {
    alert('Navigation on mobile: use sections. (This demo keeps header minimal.)');
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once revealed for better performance
            // observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const el = document.querySelector(href);
            el && el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

async function fetchLeetCodeStats() {
    const calendarGrid = document.getElementById('calendar-grid');
    try {
        const response = await fetch('https://leetcode-stats-api.herokuapp.com/lgsNroNVgg/');
        const data = await response.json();

        if (data.status === 'success') {
            // Update Text Stats
            document.getElementById('leetcode-easy').textContent = `Easy: ${data.easySolved}`;
            document.getElementById('leetcode-med').textContent = `Med: ${data.mediumSolved}`;
            document.getElementById('leetcode-hard').textContent = `Hard: ${data.hardSolved}`;

            const progress = (data.totalSolved / 100) * 100; // Let's use 100 as a goal for the bar
            document.getElementById('leetcode-progress').style.width = `${Math.min(progress, 100)}%`;

            const activeDays = Object.keys(data.submissionCalendar).length;
            document.getElementById('leetcode-active-days').textContent = `Total Active Days: ${activeDays}`;

            // Calculate Max Streak
            const streak = calculateMaxStreak(data.submissionCalendar);
            const streakEl = document.getElementById('leetcode-streak');
            if (streakEl) streakEl.textContent = `Max Streak: ${streak}`;

            // Render Heatmap
            renderHeatmap(data.submissionCalendar);
        }
    } catch (error) {
        console.error('Error fetching LeetCode stats:', error);
        if (calendarGrid) {
            calendarGrid.innerHTML = `<div class="text-xs text-red-500 opacity-50 p-4">Failed to load submission data.</div>`;
        }
    }
}

function calculateMaxStreak(submissionCalendar) {
    const timestamps = Object.keys(submissionCalendar).map(Number).sort((a, b) => a - b);
    if (timestamps.length === 0) return 0;

    let maxStreak = 0;
    let currentStreak = 0;
    let prevDate = null;

    timestamps.forEach(ts => {
        const currentDate = new Date(ts * 1000);
        currentDate.setHours(0, 0, 0, 0);

        if (prevDate) {
            const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                currentStreak++;
            } else if (diffDays > 1) {
                currentStreak = 1;
            }
        } else {
            currentStreak = 1;
        }

        maxStreak = Math.max(maxStreak, currentStreak);
        prevDate = currentDate;
    });

    return maxStreak;
}

function renderHeatmap(submissionCalendar) {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    calendarGrid.innerHTML = ''; // Clear loading state

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Adjust to the start of the week (Sunday)
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const calendarData = {};
    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
        const date = new Date(timestamp * 1000).toDateString();
        calendarData[date] = count;
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;

    // Create a container for the columns to handle month labels
    const gridContainer = document.createElement('div');
    gridContainer.className = 'flex gap-1';

    // Create 53 weeks
    for (let w = 0; w < 53; w++) {
        const weekColumn = document.createElement('div');
        weekColumn.className = 'flex flex-col gap-1 relative';

        // Month label logic
        const weekStartDate = new Date(startDate);
        weekStartDate.setDate(startDate.getDate() + (w * 7));
        const currentMonth = weekStartDate.getMonth();

        if (currentMonth !== lastMonth) {
            const monthLabel = document.createElement('div');
            monthLabel.className = 'absolute -top-5 left-0 text-[9px] text-[var(--text-muted)] opacity-60 font-medium font-sans';
            monthLabel.textContent = months[currentMonth];
            weekColumn.appendChild(monthLabel);
            lastMonth = currentMonth;
        }

        for (let d = 0; d < 7; d++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + (w * 7) + d);

            if (currentDate > today) break;

            const daySquare = document.createElement('div');
            const count = calendarData[currentDate.toDateString()] || 0;

            // Brighter "Light" Green Palette
            let colorClass = 'bg-white/10'; // Empty
            if (count > 0 && count <= 2) colorClass = 'bg-emerald-400/20';
            else if (count > 2 && count <= 4) colorClass = 'bg-emerald-400/40';
            else if (count > 4 && count <= 6) colorClass = 'bg-emerald-400/70';
            else if (count > 6) colorClass = 'bg-emerald-400';

            daySquare.className = `calendar-day ${colorClass}`;
            daySquare.title = `${currentDate.toDateString()}: ${count} submissions`;

            weekColumn.appendChild(daySquare);
        }
        gridContainer.appendChild(weekColumn);
    }

    calendarGrid.appendChild(gridContainer);

    // Scroll to the end (most recent)
    const container = document.getElementById('leetcode-calendar');
    if (container) {
        container.scrollLeft = container.scrollWidth;
    }
}

fetchLeetCodeStats();
