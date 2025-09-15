// Botones de animación
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});
signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// -------- Registro --------
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPass").value;
    const passConfirm = document.getElementById("regPassConfirm").value;

    if (pass !== passConfirm) {
        alert("Las contraseñas no coinciden. Intenta de nuevo.");
        return;
    }

    // Guardar usuario en LocalStorage
    const user = { name, email, pass };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Registro exitoso ✅ Ahora inicia sesión");
    registerForm.reset();
    container.classList.remove("right-panel-active"); // Cambia a login automáticamente
});

// -------- Inicio de sesión --------
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
        alert("No hay usuarios registrados. Regístrate primero.");
        return;
    }

    if (savedUser.email === email && savedUser.pass === pass) {
        // Guardar que el usuario está logueado
		localStorage.setItem("userLogged", JSON.stringify(savedUser));

		// Redirigir a perfil
		window.location.href = "perfil.html";

    } else {
        alert("Email o contraseña incorrectos ❌");
    }
});
