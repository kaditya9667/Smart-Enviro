// Firebase Authentication State & Firestore Progress Sync Manager

document.addEventListener('DOMContentLoaded', () => {
    // Wait until Firebase SDK module finishes loading
    const checkFirebase = setInterval(() => {
        if (window.firebaseServices) {
            clearInterval(checkFirebase);
            initAuthSync();
        }
    }, 100);
});

function initAuthSync() {
    const { onAuthChange, fetchUserData, saveUserData, logoutUser, signInWithEmail, signUpWithEmail, signInWithGoogle } = window.firebaseServices;

    // DOM Elements
    const authBtn = document.getElementById('nav-auth-btn');
    const userDropdown = document.getElementById('nav-user-dropdown');
    const userAvatar = document.getElementById('nav-user-avatar');
    const userNameEl = document.getElementById('nav-user-name');
    const userEmailEl = document.getElementById('nav-user-email');
    const logoutBtn = document.getElementById('nav-logout-btn');

    const authModal = document.getElementById('auth-modal');
    const authModalClose = document.getElementById('auth-modal-close');
    const tabLogin = document.getElementById('auth-tab-login');
    const tabRegister = document.getElementById('auth-tab-register');
    const formLogin = document.getElementById('auth-form-login');
    const formRegister = document.getElementById('auth-form-register');

    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const registerSubmitBtn = document.getElementById('register-submit-btn');
    const googleAuthBtn = document.getElementById('google-auth-btn');
    const authErrorEl = document.getElementById('auth-error-msg');

    let currentUser = null;
    let isSyncing = false;

    // Auth Guard: Enforce sign in to access protected pages (Dashboard / Map / Alerts)
    const currentPath = window.location.pathname.toLowerCase();
    const isProtectedPage = currentPath.includes('/dashboard') || currentPath.includes('/map') || currentPath.includes('/alerts');

    // Full-Screen Landing Page Click Handler
    const landingClickArea = document.getElementById('landing-page-click-area');
    if (landingClickArea) {
        landingClickArea.addEventListener('click', () => {
            if (currentUser) {
                window.location.href = '/Dashboard';
            } else if (authModal) {
                authModal.classList.remove('hidden');
                showError('');
            }
        });
    }

    // Listen to Firebase Auth State Changes
    onAuthChange(async (user) => {
        currentUser = user;
        if (user) {
            console.log("[AuthSync] User logged in:", user.email);
            updateUIForLoggedInUser(user);
            await syncCloudDataToLocal(user.uid);
            setupLocalStorageListeners(user.uid);

            // If user is on landing page and completes authentication, auto navigate to Dashboard
            if (currentPath === '/' || currentPath === '' || currentPath === '/index') {
                window.location.href = '/Dashboard';
            }
        } else {
            console.log("[AuthSync] User logged out.");
            updateUIForLoggedOutUser();

            // If user is trying to access protected routes while logged out, redirect to landing page and prompt auth
            if (isProtectedPage) {
                console.warn("[AuthSync] Protected page access attempted without authentication. Redirecting to home.");
                window.location.href = '/';
            }
        }
    });

    // Sync Cloud Firestore data into LocalStorage
    async function syncCloudDataToLocal(uid) {
        if (isSyncing) return;
        isSyncing = true;
        try {
            const cloudData = await fetchUserData(uid);
            if (cloudData) {
                console.log("[AuthSync] Loaded user cloud data:", cloudData);
                if (cloudData.cities && Array.isArray(cloudData.cities)) {
                    localStorage.setItem('smartenviro_cities', JSON.stringify(cloudData.cities));
                }
                if (cloudData.metricUnits !== undefined) {
                    localStorage.setItem('smartenviro_metric_units', cloudData.metricUnits);
                }
                if (cloudData.mapCenter) {
                    localStorage.setItem('smartenviro_map_center', JSON.stringify(cloudData.mapCenter));
                }
                if (cloudData.mapZoom) {
                    localStorage.setItem('smartenviro_map_zoom', cloudData.mapZoom);
                }

                // Dispatch custom event to refresh active page views (Dashboard/Map)
                window.dispatchEvent(new CustomEvent('smartenvirosync'));
            } else {
                console.log("[AuthSync] New user account. Initializing cloud data from local storage.");
                await syncLocalDataToCloud(uid);
            }
        } catch (e) {
            console.error("[AuthSync] Error syncing from cloud:", e);
        }
        isSyncing = false;
    }

    // Push local state (cities, settings, map) to Cloud Firestore
    async function syncLocalDataToCloud(uid) {
        if (!uid) return;
        try {
            let cities = ['Chandigarh', 'Delhi', 'Mumbai', 'London', 'Tokyo'];
            try {
                const saved = localStorage.getItem('smartenviro_cities');
                if (saved && JSON.parse(saved).length > 0) cities = JSON.parse(saved);
            } catch (e) { }

            let mapCenter = null;
            try {
                const savedCenter = localStorage.getItem('smartenviro_map_center');
                if (savedCenter) mapCenter = JSON.parse(savedCenter);
            } catch (e) { }

            const mapZoom = localStorage.getItem('smartenviro_map_zoom');
            const metricUnits = localStorage.getItem('smartenviro_metric_units');

            const payload = {
                uid: currentUser ? currentUser.uid : uid,
                email: currentUser ? currentUser.email : '',
                displayName: currentUser ? (currentUser.displayName || currentUser.email.split('@')[0]) : 'User',
                createdAt: currentUser && currentUser.metadata ? currentUser.metadata.creationTime : new Date().toISOString(),
                cities,
                metricUnits: metricUnits || 'enabled',
                mapCenter: mapCenter || { lat: 30.7333, lng: 76.7794 },
                mapZoom: mapZoom ? parseInt(mapZoom) : 13
            };

            await saveUserData(uid, payload);
            console.log("[AuthSync] User account & progress synced to database:", payload);
        } catch (e) {
            console.error("[AuthSync] Error syncing to cloud:", e);
        }
    }

    // Auto-sync to cloud when local storage changes
    function setupLocalStorageListeners(uid) {
        window.addEventListener('storage', () => syncLocalDataToCloud(uid));
        window.addEventListener('citieschanged', () => syncLocalDataToCloud(uid));
        window.addEventListener('unitschanged', () => syncLocalDataToCloud(uid));
    }

    // Update Header UI for Logged-In User
    function updateUIForLoggedInUser(user) {
        if (authBtn) authBtn.classList.add('hidden');
        if (userDropdown) userDropdown.classList.remove('hidden');

        const displayName = user.displayName || user.email.split('@')[0];
        if (userNameEl) userNameEl.textContent = displayName;
        if (userEmailEl) userEmailEl.textContent = user.email;

        // Custom avatar with initial or photoURL
        if (userAvatar) {
            if (user.photoURL) {
                userAvatar.src = user.photoURL;
            } else {
                userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;
            }
        }
        if (authModal) authModal.classList.add('hidden');
    }

    // Update Header UI for Logged-Out User
    function updateUIForLoggedOutUser() {
        if (authBtn) authBtn.classList.remove('hidden');
        if (userDropdown) userDropdown.classList.add('hidden');
    }

    // Auth Modal Handlers
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.remove('hidden');
            showError('');
        });
    }

    if (authModalClose) {
        authModalClose.addEventListener('click', () => {
            if (authModal) authModal.classList.add('hidden');
        });
    }

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.className = "flex-1 py-2 rounded-lg font-bold text-sm bg-primary text-white transition-all shadow";
            tabRegister.className = "flex-1 py-2 rounded-lg font-semibold text-sm bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all";
            formLogin.classList.remove('hidden');
            formRegister.classList.add('hidden');
            showError('');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.className = "flex-1 py-2 rounded-lg font-bold text-sm bg-primary text-white transition-all shadow";
            tabLogin.className = "flex-1 py-2 rounded-lg font-semibold text-sm bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all";
            formRegister.classList.remove('hidden');
            formLogin.classList.add('hidden');
            showError('');
        });
    }

    function showError(msg) {
        if (authErrorEl) {
            if (msg) {
                authErrorEl.textContent = msg;
                authErrorEl.classList.remove('hidden');
            } else {
                authErrorEl.classList.add('hidden');
            }
        }
    }

    // Email Login
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email')?.value.trim();
            const pass = document.getElementById('login-password')?.value;

            if (!email || !pass) return showError('Please fill in all fields.');

            loginSubmitBtn.disabled = true;
            loginSubmitBtn.textContent = 'Signing in...';
            showError('');

            try {
                await signInWithEmail(email, pass);
            } catch (err) {
                console.error("[Auth] Firebase Sign In Error Details:", err.code, err.message, err);
                showError(cleanAuthError(err.code || err.message));
            } finally {
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.textContent = 'Sign In';
            }
        });
    }

    // Email Registration
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name')?.value.trim();
            const email = document.getElementById('register-email')?.value.trim();
            const pass = document.getElementById('register-password')?.value;

            if (!email || !pass) return showError('Please fill in all fields.');
            if (pass.length < 6) return showError('Password must be at least 6 characters.');

            registerSubmitBtn.disabled = true;
            registerSubmitBtn.textContent = 'Creating Account...';
            showError('');

            try {
                await signUpWithEmail(name, email, pass);
            } catch (err) {
                console.error("[Auth] Firebase Sign Up Error Details:", err.code, err.message, err);
                showError(cleanAuthError(err.code || err.message));
            } finally {
                registerSubmitBtn.disabled = false;
                registerSubmitBtn.textContent = 'Create Account';
            }
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await logoutUser();
                location.reload();
            } catch (e) {
                console.error("Logout error", e);
            }
        });
    }

    function cleanAuthError(code) {
        if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
            return 'Invalid email or password.';
        }
        if (code.includes('email-already-in-use')) {
            return 'An account with this email already exists.';
        }
        if (code.includes('weak-password')) {
            return 'Password is too weak. Please use at least 6 characters.';
        }
        if (code.includes('configuration-not-found') || code.includes('operation-not-allowed')) {
            return 'Firebase Authentication is not activated yet for this project. Please go to your Firebase Console > Authentication > Get Started, and enable "Email/Password" under Sign-in method.';
        }
        return `Authentication Error: ${code.replace('auth/', '').replace(/-/g, ' ')}`;
    }
}
