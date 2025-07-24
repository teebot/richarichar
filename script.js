// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Update active navigation link based on scroll position
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 60) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active");
    }
  });
});

// Toggle bio sections
document.querySelectorAll(".bio-toggle").forEach((toggle) => {
  const content = toggle.nextElementSibling;
  const icon = toggle.querySelector(".toggle-icon");

  if (content && icon) {
    toggle.addEventListener("click", () => {
      const isHidden = content.style.display === "none";
      content.style.display = isHidden ? "block" : "none";
      icon.textContent = isHidden ? "▾" : "▸";
    });
  }
});

// Load and render tour dates
async function loadTourDates() {
  try {
    const response = await fetch("tour-dates.json");
    const tourDates = await response.json();

    const tourDatesContainer = document.querySelector(".tour-dates");
    if (!tourDatesContainer) return;

    // Clear existing content
    tourDatesContainer.innerHTML = "";

    // Format date from ISO to display format (e.g., "JUNE 19 2025")
    function formatDate(isoDate) {
      const date = new Date(isoDate);
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day} ${year}`;
    }

    // Check if date is in the past
    function isPastDate(isoDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      const tourDate = new Date(isoDate);
      return tourDate < today;
    }

    // Separate upcoming and past dates
    const upcomingDates = tourDates.filter(
      (tourDate) => !isPastDate(tourDate.date)
    );
    const pastDates = tourDates.filter((tourDate) => isPastDate(tourDate.date));

    // Sort upcoming dates by ascending order
    upcomingDates.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Sort past dates by descending order (most recent first)
    pastDates.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render upcoming dates
    upcomingDates.forEach((tourDate) => {
      const tourDateElement = document.createElement("div");
      tourDateElement.className = "tour-date";
      tourDateElement.innerHTML = `
        <span class="date">${formatDate(tourDate.date)}</span>
        <span class="venue">${tourDate.venue}</span>
        <span class="location">${tourDate.location}</span>
      `;
      tourDatesContainer.appendChild(tourDateElement);
    });

    // Render past dates
    pastDates.forEach((tourDate) => {
      const tourDateElement = document.createElement("div");
      tourDateElement.className = "tour-date past";
      tourDateElement.innerHTML = `
        <span class="date">${formatDate(tourDate.date)}</span>
        <span class="venue">${tourDate.venue}</span>
        <span class="location">${tourDate.location}</span>
      `;
      tourDatesContainer.appendChild(tourDateElement);
    });
  } catch (error) {
    console.error("Error loading tour dates:", error);
  }
}

// Load tour dates when the page loads
document.addEventListener("DOMContentLoaded", loadTourDates);
