// register.js - Registrasi kembali ke halaman login

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

function setLoggedIn(userData) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        username: userData.username
    }));
}

function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (isLoggedIn === 'true' && currentPage.includes('Tampilanlogin.html')) {
        redirectToDashboard();
    }
    
    if (isLoggedIn !== 'true' && currentPage.includes('dashboard.html')) {
        window.location.href = 'Tampilanlogin.html';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    return phone.length >= 10 && phone.length <= 13 && /^\d+$/.test(phone);
}

function login(username, password) {
    const user = dummyUsers.find(u => 
        u.username === username || 
        u.email === username || 
        u.phone === username
    );
    
    if (user && user.password === password) {
        setLoggedIn(user);
        return { success: true, message: "Login berhasil! Mengarahkan ke dashboard..." };
    } else {
        return { success: false, message: "Username/Email/No HP atau password salah!" };
    }
}

function register(userData) {
    // Validasi email
    if (!isValidEmail(userData.email)) {
        return { success: false, message: "Format email tidak valid!" };
    }
    
    // Validasi nomor HP
    if (!isValidPhone(userData.phone)) {
        return { success: false, message: "Nomor HP harus 10-13 digit angka!" };
    }
    
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
    
    // Simulasi registrasi berhasil (TANPA LANGSUNG LOGIN)
    const newUser = {
        id: dummyUsers.length + 1,
        username: userData.phone,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        name: userData.name
    };
    dummyUsers.push(newUser);
    
    // ✅ Kembali ke halaman login, bukan langsung ke dashboard
    return { success: true, message: "Registrasi berhasil! Silakan login.", redirectToLogin: true };
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
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
    
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const regName = document.getElementById('regName');
    const regPhone = document.getElementById('regPhone');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const regConfirm = document.getElementById('regConfirm');
    
    function showAlert(alertElement, message, isError = true) {
        alertElement.textContent = message;
        alertElement.classList.remove('d-none', 'alert-success', 'alert-danger');
        alertElement.classList.add(isError ? 'alert-danger' : 'alert-success');
        setTimeout(() => {
            alertElement.classList.add('d-none');
        }, 3000);
    }
    
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
            
            // ✅ Kembali ke form login setelah registrasi berhasil
            setTimeout(() => {
                showLogin();
                // Kosongkan form registrasi
                regName.value = '';
                regPhone.value = '';
                regEmail.value = '';
                regPassword.value = '';
                regConfirm.value = '';
            }, 1500);
        } else {
            showAlert(regAlert, result.message, true);
        }
    }
    
    function showLogin() {
        loginCard.classList.remove('d-none');
        registerCard.classList.add('d-none');
        loginAlert.classList.add('d-none');
        regAlert.classList.add('d-none');
    }
    
    function showRegister() {
        loginCard.classList.add('d-none');
        registerCard.classList.remove('d-none');
        loginAlert.classList.add('d-none');
        regAlert.classList.add('d-none');
    }
    
    function handleForgot() {
        alert('Fitur reset password akan segera hadir! Silakan hubungi admin Groceer di WhatsApp: 0812-3456-7890');
    }
    
    function handleHelp() {
        alert('Butuh bantuan? Hubungi CS Groceer di WhatsApp: 0812-3456-7890');
    }
    
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (registerBtn) registerBtn.addEventListener('click', handleRegister);
    if (showRegisterLink) showRegisterLink.addEventListener('click', showRegister);
    if (showLoginLink) showLoginLink.addEventListener('click', showLogin);
    if (forgotBtn) forgotBtn.addEventListener('click', handleForgot);
    if (helpBtnLogin) helpBtnLogin.addEventListener('click', handleHelp);
    if (helpBtnRegister) helpBtnRegister.addEventListener('click', handleHelp);
    
    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin(e);
        });
    }
    if (regConfirm) {
        regConfirm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleRegister(e);
        });
    }
});