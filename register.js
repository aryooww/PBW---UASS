// register.js - Login & Registrasi dengan redirect ke dashboard

// Data dummy untuk simulasi login (bisa diganti dengan API call)
const dummyUsers = [
    {
        id: 1,
        username: "reseller1",
        phone: "08123456789",
        email: "reseller@example.com",
        password: "123456",
        name: "Reseller Handal"
    },
    {
        id: 2,
        username: "groceer",
        phone: "08987654321",
        email: "groceer@example.com",
        password: "groceer123",
        name: "Groceer User"
    }
];

// Fungsi untuk menyimpan session/login state
function setLoggedIn(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        username: userData.username
    }));
}

// Fungsi redirect ke dashboard
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Cek apakah user sudah login (untuk halaman lain)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true' && window.location.pathname.includes('login.html')) {
        redirectToDashboard();
    }
}

// Fungsi login
function login(username, password) {
    // Cari user berdasarkan username/email/phone
    const user = dummyUsers.find(u => 
        u.username === username || 
        u.email === username || 
        u.phone === username
    );
    
    if (user && user.password === password) {
        setLoggedIn(user);
        return { success: true, message: "Login berhasil!" };
    } else {
        return { success: false, message: "Username/Email/No HP atau password salah!" };
    }
}

// Fungsi registrasi
function register(userData) {
    // Cek apakah user sudah ada
    const existingUser = dummyUsers.find(u => 
        u.email === userData.email || 
        u.phone === userData.phone
    );
    
    if (existingUser) {
        return { success: false, message: "Email atau No HP sudah terdaftar!" };
    }
    
    if (userData.password !== userData.confirmPassword) {
        return { success: false, message: "Password dan konfirmasi password tidak cocok!" };
    }
    
    if (userData.password.length < 6) {
        return { success: false, message: "Password minimal 6 karakter!" };
    }
    
    // Simulasi registrasi berhasil (di dunia nyata kirim ke backend)
    const newUser = {
        id: dummyUsers.length + 1,
        username: userData.phone,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        name: userData.name
    };
    dummyUsers.push(newUser);
    setLoggedIn(newUser);
    
    return { success: true, message: "Registrasi berhasil!" };
}

// Event Listener saat halaman load
document.addEventListener('DOMContentLoaded', function() {
    // Cek apakah sudah login
    checkAuth();
    
    // DOM Elements
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const forgotBtn = document.getElementById('forgotBtn');
    const helpBtnLogin = document.getElementById('helpBtnLogin');
    const helpBtnRegister = document.getElementById('helpBtnRegister');
    const loginAlert = document.getElementById('loginAlert');
    const regAlert = document.getElementById('regAlert');
    
    // Input fields
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const regName = document.getElementById('regName');
    const regPhone = document.getElementById('regPhone');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const regConfirm = document.getElementById('regConfirm');
    
    // Show alert helper
    function showAlert(alertElement, message, isError = true) {
        alertElement.textContent = message;
        alertElement.classList.remove('d-none', 'alert-success', 'alert-danger');
        alertElement.classList.add(isError ? 'alert-danger' : 'alert-success');
        setTimeout(() => {
            alertElement.classList.add('d-none');
        }, 3000);
    }
    
    // Login handler
    function handleLogin(e) {
        e.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();
        
        if (!username || !password) {
            showAlert(loginAlert, 'Harap isi username/email/no HP dan password!', true);
            return;
        }
        
        const result = login(username, password);
        
        if (result.success) {
            showAlert(loginAlert, result.message, false);
            setTimeout(() => {
                redirectToDashboard();
            }, 1000);
        } else {
            showAlert(loginAlert, result.message, true);
        }
    }
    
    // Register handler
    function handleRegister(e) {
        e.preventDefault();
        const name = regName.value.trim();
        const phone = regPhone.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value.trim();
        const confirmPassword = regConfirm.value.trim();
        
        if (!name || !phone || !email || !password || !confirmPassword) {
            showAlert(regAlert, 'Harap isi semua field!', true);
            return;
        }
        
        const result = register({
            name: name,
            phone: phone,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        });
        
        if (result.success) {
            showAlert(regAlert, result.message, false);
            setTimeout(() => {
                redirectToDashboard();
            }, 1000);
        } else {
            showAlert(regAlert, result.message, true);
        }
    }
    
    // Toggle between login and register forms
    function showLogin() {
        loginCard.classList.remove('d-none');
        registerCard.classList.add('d-none');
        // Clear alerts
        loginAlert.classList.add('d-none');
        regAlert.classList.add('d-none');
    }
    
    function showRegister() {
        loginCard.classList.add('d-none');
        registerCard.classList.remove('d-none');
        loginAlert.classList.add('d-none');
        regAlert.classList.add('d-none');
    }
    
    // Forgot password handler
    function handleForgot() {
        alert('Fitur reset password akan segera hadir! Silakan hubungi admin Groceer.');
    }
    
    // Help handler
    function handleHelp() {
        alert('Butuh bantuan? Hubungi CS Groceer di WhatsApp: 0812-3456-7890');
    }
    
    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    registerBtn.addEventListener('click', handleRegister);
    showRegisterLink.addEventListener('click', showRegister);
    showLoginLink.addEventListener('click', showLogin);
    forgotBtn.addEventListener('click', handleForgot);
    helpBtnLogin.addEventListener('click', handleHelp);
    helpBtnRegister.addEventListener('click', handleHelp);
    
    // Enter key submission
    loginPassword.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin(e);
    });
    regConfirm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleRegister(e);
    });
});