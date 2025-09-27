// Mobile Navigation Toggle
const navToggle = document.querySelector(".nav-toggle")
const navMenu = document.querySelector(".nav-menu")

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(10, 10, 10, 0.98)"
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)"
  } else {
    navbar.style.background = "rgba(10, 10, 10, 0.95)"
    navbar.style.boxShadow = "none"
  }
})

// Enhanced typing effect for hero subtitle
function typeWriter(element, texts, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false

  function type() {
    const currentText = texts[textIndex]

    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1)
      charIndex--

      if (charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
        element.innerHTML = "&nbsp;"
        setTimeout(type, 800)
        return
      }
    } else {
      element.textContent = currentText.substring(0, charIndex + 1)
      charIndex++

      if (charIndex === currentText.length) {
        isDeleting = true
        setTimeout(type, pauseTime)
        return
      }
    }

    const typeSpeed = isDeleting ? deleteSpeed : speed
    setTimeout(type, typeSpeed)
  }

  type()
}

// Initialize typing effect
const typingElement = document.querySelector(".typing-text")
const typingTexts = [
  "Software Developer",
  "IT Professional",
  "Problem Solver",
  "Tech Enthusiast",
  "Cybersecurity Specialist",
]

if (typingElement) {
  typingElement.textContent = ""
  typeWriter(typingElement, typingTexts, 120, 80, 2500)
}

// Contact method switching
document.querySelectorAll(".method-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".method-btn").forEach((b) => b.classList.remove("active"))
    this.classList.add("active")

    document.querySelectorAll(".contact-method").forEach((method) => method.classList.add("hidden"))
    const methodType = this.dataset.method
    document.getElementById(`${methodType}-method`).classList.remove("hidden")
  })
})

// Contact form handling (Copy to Clipboard + Open Mail Client)
const contactForm = document.querySelector("#contact-form")
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault()

    const submitBtn = this.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'
    submitBtn.disabled = true

    const formData = new FormData(this)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields", "error")
      resetBtn()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showNotification("Please enter a valid email address", "error")
      resetBtn()
      return
    }

    const emailContent = `Hi Kazi,

I found your portfolio and would like to get in touch.

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Best regards,
${name}`

    try {
      await navigator.clipboard.writeText(emailContent)
      window.location.href = `mailto:jihanhasan50@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`
      showNotification("Message copied and email client opened!", "success")
      this.reset()
    } catch {
      window.location.href = `mailto:jihanhasan50@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`
      showNotification("Email client opened with your message!", "success")
      this.reset()
    } finally {
      resetBtn()
    }

    function resetBtn() {
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  })
}

// Enhanced notification system
function showNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "success" ? "rgba(34, 197, 94, 0.9)" : type === "error" ? "rgba(239, 68, 68, 0.9)" : "rgba(59, 130, 246, 0.9)"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid ${type === "success" ? "rgba(34, 197, 94, 0.3)" : type === "error" ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"};
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 300px;
    animation: slideIn 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  `

  document.body.appendChild(notification)

  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOut 0.3s ease forwards"
    setTimeout(() => notification.remove(), 300)
  })

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease forwards"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

document.querySelectorAll(".project-card, .skill-item, .timeline-item, .achievement-item").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.8s ease, transform 0.8s ease"
  observer.observe(el)
})

// Active navigation link highlighting
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""
  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    if (window.scrollY >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Parallax effect for floating icons
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".floating-icon")

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px)`
  })
})

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll("section")
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed")
      }
    })
  },
  { threshold: 0.15 },
)

revealSections.forEach((section) => {
  revealObserver.observe(section)
})

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
  section {
    opacity: 0;
    transform: translateY(50px);
    transition: opacity 1s ease, transform 1s ease;
  }
  
  section.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero {
    opacity: 1;
    transform: translateY(0);
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  
  .notification-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .nav-link.active {
    color: #60a5fa;
  }
  
  .nav-link.active::after {
    width: 100%;
  }
  
  .contact-method.hidden {
    display: none;
  }
  
  .method-btn.active {
    background-color: #60a5fa;
    color: white;
  }
`
document.head.appendChild(style)

// Initialize animations on page load
document.addEventListener("DOMContentLoaded", () => {
  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    heroSection.classList.add("revealed")
  }

  const skillItems = document.querySelectorAll(".skill-item")
  skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
  })

  const projectCards = document.querySelectorAll(".project-card")
  projectCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`
  })
})

// Enhanced hover effects
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)"
  })

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)"
  })
})

// Button ripple effect
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span")
    const rect = this.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `

    this.style.position = "relative"
    this.style.overflow = "hidden"
    this.appendChild(ripple)

    setTimeout(() => ripple.remove(), 600)
  })
})

// Scroll indicator functionality
document.querySelector(".scroll-indicator")?.addEventListener("click", () => {
  document.querySelector("#about").scrollIntoView({
    behavior: "smooth",
  })
})

// Add ripple animation
const rippleStyle = document.createElement("style")
rippleStyle.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`
document.head.appendChild(rippleStyle)
