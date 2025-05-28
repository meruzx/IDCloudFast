// Sound Effects using Web Audio API
class SoundManager {
  constructor() {
    this.audioContext = null
    this.init()
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.log("Web Audio API not supported")
    }
  }

  playClickSound() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1)

    gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  playSuccessSound() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime)
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2)

    gainNode.gain.setValueAtTime(1.0, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.1, this.audioContext.currentTime + 0.3)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  playHoverSound() {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.05, this.audioContext.currentTime + 0.05)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.05)
  }
}

const soundManager = new SoundManager()

// Coupon System
const coupons = {
  PROMO15: { discount: 10, description: "Diskon 10%" },
  FLASH2: { discount: 20, description: "Diskon 20%" },
  PROMO2025: { discount: 30, description: "Diskon 30%" },
  NEWBIE: { discount: 15, description: "Diskon 15% untuk member baru" },
  FLASH10: { discount: 50, description: "Flash Sale 50%" },
}

let activeCoupon = null

// Products Data
const products = [
  {
    id: 1,
    name: "RAM Unlimited",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 13000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
    isBestseller: true,
  },
  {
    id: 2,
    name: "RAM 4GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 6000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
  {
    id: 3,
    name: "RAM 5GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 7000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
  {
    id: 4,
    name: "RAM 6GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 8000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
  {
    id: 5,
    name: "RAM 7GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 9000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
  {
    id: 6,
    name: "RAM 8GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 10000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
  {
    id: 7,
    name: "RAM 9GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 11000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
  {
    id: 8,
    name: "RAM 10GB",
    description: "Spekifikasi VPS Digital Ocean Bill PayPal RAM 16GB 8vCPU",
    price: 12000,
    image: "https://files.catbox.moe/k3pwzz.jpg",
  },
]

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

function calculateDiscountedPrice(originalPrice, discountPercent) {
  return originalPrice - (originalPrice * discountPercent) / 100
}

function applyCoupon() {
  const couponCode = document.getElementById("couponInput").value.toUpperCase().trim()
  const messageDiv = document.getElementById("couponMessage")

  if (!couponCode) {
    showCouponMessage("Masukkan kode kupon terlebih dahulu!", "error")
    return
  }

  if (coupons[couponCode]) {
    activeCoupon = coupons[couponCode]
    showCouponMessage(`✅ Kupon "${couponCode}" berhasil diterapkan! ${activeCoupon.description}`, "success")
    soundManager.playSuccessSound()
    loadProducts()
    document.getElementById("couponInput").value = ""
  } else {
    showCouponMessage("❌ Kode kupon tidak valid!", "error")
    soundManager.playClickSound()
  }
}

function showCouponMessage(message, type) {
  const messageDiv = document.getElementById("couponMessage")
  messageDiv.textContent = message
  messageDiv.className = `coupon-message coupon-${type}`
  messageDiv.style.display = "block"

  setTimeout(() => {
    messageDiv.style.display = "none"
  }, 5000)
}

function buyNowWhatsApp(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const now = new Date()
  const orderDate = now.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const orderTime = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  let finalPrice = product.price
  let discountInfo = ""

  if (activeCoupon) {
    finalPrice = calculateDiscountedPrice(product.price, activeCoupon.discount)
    discountInfo = `\n💰 *Harga Asli:* ${formatPrice(product.price)}\n🎫 *Diskon:* ${activeCoupon.discount}% (${activeCoupon.description})\n💸 *Harga Setelah Diskon:* ${formatPrice(finalPrice)}\n`
  }

  let message = `🛒 *PEMESANAN PRODUK - IDCloudFast*\n\n`
  message += `📦 *Detail Produk:*\n`
  message += `🖥️ ${product.name}`

  if (product.isBestseller) {
    message += ` 🔥 *PALING LARIS*`
  }

  message += `\n📝 Deskripsi: ${product.description}\n`

  if (activeCoupon) {
    message += discountInfo
  } else {
    message += `💰 Harga: ${formatPrice(product.price)}\n`
  }

  message += `\n📅 *Tanggal Order:*\n`
  message += `${orderDate} - ${orderTime}\n\n`

  message += `Halo admin, saya tertarik untuk membeli produk di atas. `
  if (activeCoupon) {
    message += `Saya sudah menggunakan kupon diskon "${Object.keys(coupons).find((key) => coupons[key] === activeCoupon)}". `
  }
  message += `Mohon informasi lebih lanjut mengenai:\n`
  message += `• Ketersediaan stok\n`
  message += `• Metode pembayaran\n`
  message += `• Estimasi pengiriman\n\n`
  message += `Terima kasih! 🙏`

  const adminWhatsApp = "6288980698613"
  const whatsappURL = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`

  soundManager.playSuccessSound()
  window.open(whatsappURL, "_blank")

  showNotification("Anda akan diarahkan ke WhatsApp admin")
}

function showNotification(message) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInFromRight 0.3s ease;
        max-width: 300px;
        font-size: 0.9rem;
    `
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutToRight 0.3s ease"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

function loadProducts() {
  const productsGrid = document.getElementById("productsGrid")
  productsGrid.innerHTML = ""

  products.forEach((product, index) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.style.animationDelay = `${index * 0.1}s`

    let priceHTML = ""
    if (activeCoupon) {
      const discountedPrice = calculateDiscountedPrice(product.price, activeCoupon.discount)
      priceHTML = `
                <div class="product-price">
                    <span class="price-discounted">${formatPrice(discountedPrice)}</span>
                    <span class="price-crossed">${formatPrice(product.price)}</span>
                    <span class="discount-badge">-${activeCoupon.discount}%</span>
                </div>
            `
    } else {
      priceHTML = `
                <div class="product-price">
                    <span class="price-original">${formatPrice(product.price)}</span>
                </div>
            `
    }

    let bestsellerBadge = ""
    if (product.isBestseller) {
      bestsellerBadge = '<div class="bestseller-badge">🔥 PALING LARIS</div>'
    }

    productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/667eea/ffffff?text=NO+IMAGE'">
                ${bestsellerBadge}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                ${priceHTML}
                <button class="btn-whatsapp" onclick="buyNowWhatsApp(${product.id})">
                    💬 Beli Sekarang
                </button>
            </div>
        `

    productCard.addEventListener("mouseenter", () => {
      soundManager.playHoverSound()
    })

    productsGrid.appendChild(productCard)
  })
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadProducts()

  // Coupon functionality
  const applyCouponBtn = document.getElementById("applyCouponBtn")
  const couponInput = document.getElementById("couponInput")

  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", applyCoupon)
  }

  if (couponInput) {
    couponInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        applyCoupon()
      }
    })
  }

  // Hamburger menu
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      soundManager.playClickSound()
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }

  // Modal functionality
  const modal = document.getElementById("welcomeModal")
  const closeModal = document.getElementById("closeModal")
  const startShopping = document.getElementById("startShopping")

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      soundManager.playClickSound()
      modal.style.display = "none"
    })
  }

  if (startShopping) {
    startShopping.addEventListener("click", () => {
      soundManager.playSuccessSound()
      modal.style.display = "none"
      document.getElementById("products").scrollIntoView({ behavior: "smooth" })
    })
  }

  if (modal) {
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        soundManager.playClickSound()
        modal.style.display = "none"
      }
    })

    // Show modal after page load
    setTimeout(() => {
      modal.style.display = "flex"
    }, 500)
  }

  // Sound effects for buttons
  document.addEventListener("click", (e) => {
    if (e.target.matches("button, a, .hamburger")) {
      soundManager.playClickSound()
    }
  })

  // Smooth scrolling for anchor links
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

  // Header scroll effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    if (header) {
      if (window.scrollY > 100) {
        header.style.background = "rgba(255, 255, 255, 0.98)"
        header.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)"
      } else {
        header.style.background = "rgba(255, 255, 255, 0.95)"
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
      }
    }
  })

  // Counter animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains("stats-section")) {
          animateCounters()
        }
      }
    })
  }, observerOptions)

  const statsSection = document.querySelector(".stats-section")
  if (statsSection) {
    observer.observe(statsSection)
  }
})

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const increment = target / 100
    let current = 0

    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.ceil(current)
        setTimeout(updateCounter, 20)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  })
} 
