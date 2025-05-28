// Authentication System
class AuthManager {
    constructor() {
        this.init()
    }

    init() {
        // Inisialisasi data admin default
        if (!localStorage.getItem("users")) {
            const defaultUsers = [{ username: "admin", password: "admin123", role: "admin" }]
            localStorage.setItem("users", JSON.stringify(defaultUsers))
        }

        // Cek status login saat halaman dimuat
        this.checkLoginStatus()
    }

    // Fungsi login
    login(username, password, rememberMe = false) {
        const users = JSON.parse(localStorage.getItem("users"))
        const user = users.find((u) => u.username === username && u.password === password)

        if (user) {
            // Simpan status login
            sessionStorage.setItem("isLoggedIn", "true")
            sessionStorage.setItem("currentUser", username)
            sessionStorage.setItem("userRole", user.role || "user")

            // Jika remember me dicentang
            if (rememberMe) {
                localStorage.setItem("rememberedUser", username)
            } else {
                localStorage.removeItem("rememberedUser")
            }

            return { success: true, user: user }
        } else {
            return { success: false, message: "Username atau password salah!" }
        }
    }

    // Fungsi logout
    logout() {
        sessionStorage.removeItem("isLoggedIn")
        sessionStorage.removeItem("currentUser")
        sessionStorage.removeItem("userRole")

        // Update UI
        this.updateAuthUI()

        // Redirect ke halaman utama jika di halaman login
        if (window.location.pathname.includes("login.html")) {
            window.location.href = "index.html"
        }
    }

    // Cek apakah user sudah login
    isLoggedIn() {
        return sessionStorage.getItem("isLoggedIn") === "true"
    }

    // Dapatkan user yang sedang login
    getCurrentUser() {
        return sessionStorage.getItem("currentUser")
    }

    // Dapatkan role user
    getUserRole() {
        return sessionStorage.getItem("userRole")
    }

    // Update UI berdasarkan status login
    updateAuthUI() {
        const loginButton = document.querySelector(".btn-login")
        const registerButton = document.querySelector(".btn-register")
        const userInfo = document.getElementById("userInfo")
        const usernameSpan = document.getElementById("username")

        if (this.isLoggedIn()) {
            // User sudah login
            if (loginButton) loginButton.style.display = "none"
            if (registerButton) registerButton.style.display = "none"
            if (userInfo) {
                userInfo.style.display = "block"
                if (usernameSpan) {
                    usernameSpan.textContent = this.getCurrentUser()
                }
            }
        } else {
            // User belum login
            if (loginButton) loginButton.style.display = "inline-block"
            if (registerButton) registerButton.style.display = "inline-block"
            if (userInfo) userInfo.style.display = "none"
        }
    }

    // Cek status login saat halaman dimuat
    checkLoginStatus() {
        this.updateAuthUI()

        // Setup logout button
        const logoutBtn = document.getElementById("logoutBtn")
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                this.logout()
            })
        }
    }

    // Registrasi user baru
    register(username, password, email = "", fullName = "") {
        const users = JSON.parse(localStorage.getItem("users"))

        // Cek apakah username sudah ada
        if (users.find((u) => u.username === username)) {
            return { success: false, message: "Username sudah digunakan!" }
        }

        // Cek apakah email sudah ada (jika email diisi)
        if (email && users.find((u) => u.email === email)) {
            return { success: false, message: "Email sudah digunakan!" }
        }

        // Tambah user baru
        const newUser = {
            username: username,
            password: password,
            email: email,
            fullName: fullName,
            role: "user",
            createdAt: new Date().toISOString(),
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        return { success: true, message: "Registrasi berhasil!" }
    }
}

// Inisialisasi AuthManager
const authManager = new AuthManager()

// Fungsi untuk halaman login
if (window.location.pathname.includes("login.html")) {
    document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.getElementById("loginForm")
        const errorMessage = document.getElementById("errorMessage")
        const successMessage = document.getElementById("successMessage")

        // Cek apakah ada user yang diingat
        const rememberedUser = localStorage.getItem("rememberedUser")
        if (rememberedUser) {
            document.getElementById("username").value = rememberedUser
            document.getElementById("rememberMe").checked = true
        }

        // Handle form submission
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault()

                const username = document.getElementById("username").value
                const password = document.getElementById("password").value
                const rememberMe = document.getElementById("rememberMe").checked

                const result = authManager.login(username, password, rememberMe)

                if (result.success) {
                    showSuccess("Login berhasil! Mengalihkan ke dashboard...")

                    // Redirect ke halaman utama setelah login
                    setTimeout(() => {
                        window.location.href = "index.html"
                    }, 1500)
                } else {
                    showError(result.message)
                }
            })
        }

        function showError(message) {
            if (errorMessage) {
                errorMessage.textContent = message
                errorMessage.style.display = "block"
                successMessage.style.display = "none"

                setTimeout(() => {
                    errorMessage.style.display = "none"
                }, 3000)
            }
        }

        function showSuccess(message) {
            if (successMessage) {
                successMessage.textContent = message
                successMessage.style.display = "block"
                errorMessage.style.display = "none"
            }
        }
    })
}

// Export untuk penggunaan di file lain
if (typeof module !== "undefined" && module.exports) {
    module.exports = AuthManager
}
