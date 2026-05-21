// Data dummy untuk simulasi login (bisa diganti dengan API call ke backend)
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


// Fungsi untuk menyimpan session/login state ke localStorage
// Tujuan: Agar user tetap login meskipun refresh halaman
function setLoggedIn(userData) {
    localStorage.setItem('isLoggedIn', 'true');           // Tandai user sudah login
    localStorage.setItem('userData', JSON.stringify({     // Simpan data user
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        username: userData.username
    }));
}


// Fungsi redirect ke halaman dashboard
// Dipanggil setelah login berhasil
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}


// FUNGSI CEK AUTENTIKASI

// Cek apakah user sudah login atau belum
// Dipanggil saat halaman login/dashboard dimuat
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Ambil status login
    const currentPage = window.location.pathname;          // Ambil nama halaman saat ini
    
    // Jika sudah login dan mencoba akses halaman login, redirect ke dashboard
    if (isLoggedIn === 'true' && currentPage.includes('Tampilanlogin.html')) {
        redirectToDashboard();
    }
    
    // Jika belum login dan mencoba akses dashboard, redirect ke login
    if (isLoggedIn !== 'true' && currentPage.includes('dashboard.html')) {
        window.location.href = 'Tampilanlogin.html';
    }
}


// FUNGSI VALIDASI INPUT

// Validasi format email menggunakan regex
// Contoh valid: user@example.com | Invalid: user@.com
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validasi nomor handphone (10-13 digit, hanya angka)
function isValidPhone(phone) {
    return phone.length >= 10 && phone.length <= 13 && /^\d+$/.test(phone);
}


// 6. FUNGSI LOGIN
// Proses login: mencari user berdasarkan username/email/no HP
// Memeriksa kecocokan password
function login(username, password) {
    // Cari user berdasarkan username/email/phone (salah satu cocok)
    const user = dummyUsers.find(u => 
        u.username === username || 
        u.email === username || 
        u.phone === username
    );
    
    // Jika user ditemukan DAN password cocok
    if (user && user.password === password) {
        setLoggedIn(user);  // Simpan session
        return { success: true, message: "Login berhasil! Mengarahkan ke dashboard..." };
    } else {
        return { success: false, message: "Username/Email/No HP atau password salah!" };
    }
}

// ============================================
// 7. FUNGSI REGISTRASI
// ============================================

// Proses pendaftaran akun baru
function register(userData) {
    // Validasi format email
    if (!isValidEmail(userData.email)) {
        return { success: false, message: "Format email tidak valid!" };
    }
    
    // Validasi nomor HP (10-13 digit, hanya angka)
    if (!isValidPhone(userData.phone)) {
        return { success: false, message: "Nomor HP harus 10-13 digit angka!" };
    }
    
    // Cek apakah email atau nomor HP sudah terdaftar
    const existingUser = dummyUsers.find(u => 
        u.email === userData.email || 
        u.phone === userData.phone
    );
    
    if (existingUser) {
        return { success: false, message: "Email atau No HP sudah terdaftar!" };
    }
    
    // Cek apakah password dan konfirmasi password sama
    if (userData.password !== userData.confirmPassword) {
        return { success: false, message: "Password dan konfirmasi password tidak cocok!" };
    }
    
    // Cek minimal panjang password (6 karakter)
    if (userData.password.length < 6) {
        return { success: false, message: "Password minimal 6 karakter!" };
    }
    
    // Simulasi registrasi berhasil (TANPA LANGSUNG LOGIN)
    // Buat objek user baru
    const newUser = {
        id: dummyUsers.length + 1,      // ID otomatis (increment)
        username: userData.phone,       // Username menggunakan nomor HP
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        name: userData.name
    };
    
    dummyUsers.push(newUser);  // Tambahkan ke array dummyUsers
    
    // ✅ Kembali ke halaman login, bukan langsung ke dashboard
    // redirectToLogin = true menandakan harus kembali ke form login
    return { success: true, message: "Registrasi berhasil! Silakan login.", redirectToLogin: true };
}

// ============================================
// 8. EVENT LISTENER & INITIALISASI
// ============================================

// Menjalankan kode setelah seluruh HTML selesai dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // 8a. CEK AUTENTIKASI SAAT LOAD
    checkAuth();  // Pastikan user tidak mengakses halaman yang tidak boleh
    
    // 8b. AMBIL SEMUA ELEMENT HTML YANG DIPERLUKAN
    // Kartu form (card)
    const loginCard = document.getElementById('loginCard');
    const registerCard = document.getElementById('registerCard');
    
    // Tombol
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const showLoginLink = document.getElementById('showLoginLink');
    const forgotBtn = document.getElementById('forgotBtn');
    const helpBtnLogin = document.getElementById('helpBtnLogin');
    const helpBtnRegister = document.getElementById('helpBtnRegister');
    
    // Alert/notifikasi
    const loginAlert = document.getElementById('loginAlert');
    const regAlert = document.getElementById('regAlert');
    
    // Input field untuk LOGIN
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    
    // Input field untuk REGISTRASI
    const regName = document.getElementById('regName');
    const regPhone = document.getElementById('regPhone');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const regConfirm = document.getElementById('regConfirm');
    
    // 8c. FUNGSI BANTUAN (Helper Functions)
    
    // Menampilkan alert/pesan notifikasi
    // isError = true  -> warna merah (alert-danger)
    // isError = false -> warna hijau (alert-success)
    function showAlert(alertElement, message, isError = true) {
        alertElement.textContent = message;
        alertElement.classList.remove('d-none', 'alert-success', 'alert-danger');
        alertElement.classList.add(isError ? 'alert-danger' : 'alert-success');
        setTimeout(() => {
            alertElement.classList.add('d-none');  // Sembunyikan setelah 3 detik
        }, 3000);
    }
    
    // 8d. HANDLER LOGIN
    // Fungsi yang dijalankan saat tombol LOGIN diklik
    function handleLogin(e) {
        e.preventDefault();  // Mencegah form submit (refresh halaman)
        
        const username = loginUsername.value.trim();  // Ambil value input
        const password = loginPassword.value.trim();
        
        // Validasi: field tidak boleh kosong
        if (!username || !password) {
            showAlert(loginAlert, 'Harap isi username/email/no HP dan password!', true);
            return;
        }
        
        const result = login(username, password);  // Proses login
        
        if (result.success) {
            showAlert(loginAlert, result.message, false);  // Tampilkan sukses
            setTimeout(() => {
                redirectToDashboard();  // Redirect setelah 1 detik
            }, 1000);
        } else {
            showAlert(loginAlert, result.message, true);  // Tampilkan error
        }
    }
    
    // 8e. HANDLER REGISTRASI
    // Fungsi yang dijalankan saat tombol DAFTAR diklik
    function handleRegister(e) {
        e.preventDefault();  // Mencegah form submit (refresh halaman)
        
        // Ambil semua value dari form registrasi
        const name = regName.value.trim();
        const phone = regPhone.value.trim();
        const email = regEmail.value.trim();
        const password = regPassword.value.trim();
        const confirmPassword = regConfirm.value.trim();
        
        // Validasi: semua field harus diisi
        if (!name || !phone || !email || !password || !confirmPassword) {
            showAlert(regAlert, 'Harap isi semua field!', true);
            return;
        }
        
        const result = register({  // Proses registrasi
            name: name,
            phone: phone,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        });
        
        if (result.success) {
            showAlert(regAlert, result.message, false);  // Tampilkan sukses
            
            // ✅ Kembali ke form login setelah registrasi berhasil
            setTimeout(() => {
                showLogin();  // Tampilkan form login
                
                // Kosongkan form registrasi
                regName.value = '';
                regPhone.value = '';
                regEmail.value = '';
                regPassword.value = '';
                regConfirm.value = '';
            }, 1500);
        } else {
            showAlert(regAlert, result.message, true);  // Tampilkan error
        }
    }
    
    // 8f. FUNGSI TOGGLE (Beralih antar form)
    
    // Tampilkan form login, sembunyikan form register
    function showLogin() {
        loginCard.classList.remove('d-none');   // Tampilkan login
        registerCard.classList.add('d-none');   // Sembunyikan register
        loginAlert.classList.add('d-none');     // Sembunyikan alert
        regAlert.classList.add('d-none');
    }
    
    // Tampilkan form register, sembunyikan form login
    function showRegister() {
        loginCard.classList.add('d-none');      // Sembunyikan login
        registerCard.classList.remove('d-none'); // Tampilkan register
        loginAlert.classList.add('d-none');
        regAlert.classList.add('d-none');
    }
    
    // 8g. HANDLER TOMBOL LAINNYA
    
    // Lupa password - menampilkan informasi kontak admin
    function handleForgot() {
        alert('Fitur reset password akan segera hadir! Silakan hubungi admin Groceer di WhatsApp: 0812-3456-7890');
    }
    
    // Bantuan - menampilkan kontak customer service
    function handleHelp() {
        alert('Butuh bantuan? Hubungi CS Groceer di WhatsApp: 0812-3456-7890');
    }
    
    // 8h. MEMASANG EVENT LISTENER
    
    // Tombol login & register
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (registerBtn) registerBtn.addEventListener('click', handleRegister);
    
    // Link toggle antar form
    if (showRegisterLink) showRegisterLink.addEventListener('click', showRegister);
    if (showLoginLink) showLoginLink.addEventListener('click', showLogin);
    
    // Tombol lupa password & bantuan
    if (forgotBtn) forgotBtn.addEventListener('click', handleForgot);
    if (helpBtnLogin) helpBtnLogin.addEventListener('click', handleHelp);
    if (helpBtnRegister) helpBtnRegister.addEventListener('click', handleHelp);
    
    // 8i. SUBMIT DENGAN TOMBOL ENTER
    
    // Di form login: tekan Enter akan menjalankan login
    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleLogin(e);
        });
    }
    
    // Di form register: tekan Enter akan menjalankan registrasi
    if (regConfirm) {
        regConfirm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleRegister(e);
        });
    }
});