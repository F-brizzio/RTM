function displayMessage(elementId, message, isSuccess) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;

        element.className = 'message ' + (isSuccess ? 'success' : 'error');
        
        if (message) {
             setTimeout(() => {
                element.textContent = '';
                element.className = 'message';
            }, 5000);
        }
       
    } else if (message) {
        console.error(`Error: Element with ID ${elementId} not found to display message: "${message}".`);
    }
}

/**
 *  * @returns {object|null}
 */
function checkAuthAndRedirect() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split("/").pop(); 

    if (!user) {
        if (currentPage === 'perfil.html') {
            console.log("Acceso denegado. Redirigiendo a isesion.html.");
            window.location.href = "isesion.html";
        }
        return null;
    }
    if (currentPage === 'perfil.html') {
        return user;
    }

    return user;
}


//isesion.

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

if (signUpButton && signInButton && container) {
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
        displayMessage('registerMessage', '', false); 
        displayMessage('loginMessage', '', false);
    });
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
        displayMessage('registerMessage', '', false);
        displayMessage('loginMessage', '', false);
    });
}

// Registro
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const pass = document.getElementById("regPass").value;
        const passConfirm = document.getElementById("regPassConfirm").value;

        const registerMessageId = 'registerMessage';
        
        if (pass !== passConfirm) {
            displayMessage(registerMessageId, "Las contraseñas no coinciden. Intenta de nuevo. ❌", false);
            return;
        }
        
        const user = { name, email, pass, userId: Date.now() }; 
        localStorage.setItem("user", JSON.stringify(user));

        displayMessage(registerMessageId, "Registro exitoso ✅ Ahora inicia sesión", true);
        registerForm.reset();
        
        setTimeout(() => {
            if (container) {
                container.classList.remove("right-panel-active"); 
                displayMessage(registerMessageId, '', false); 
            }
        }, 2000);
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const pass = document.getElementById("loginPass").value;
        
        const loginMessageId = 'loginMessage';

        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (!savedUser) {
            displayMessage(loginMessageId, "No hay usuarios registrados. Regístrate primero. ⚠️", false);
            return;
        }

        if (savedUser.email === email && savedUser.pass === pass) {
            // Guardar el objeto completo del usuario como logueado
            localStorage.setItem("currentUser", JSON.stringify(savedUser));

            displayMessage(loginMessageId, "Inicio de sesión exitoso. Redirigiendo... ✅", true);

            setTimeout(() => {
                window.location.href = "perfil.html";
            }, 1000);

        } else {
            displayMessage(loginMessageId, "Email o contraseña incorrectos ❌", false);
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    const user = checkAuthAndRedirect();

    if (!user) {
        return; 
    }

    document.getElementById('welcomeUserName').textContent = user.name || 'Usuario';
    
    const mockOrderCounts = {
        "No Pagado": 2,
        "Procesando": 1,
        "Enviado": 5,
        "Comentarios": 0,
        "Devolución": 0
    };
    document.getElementById('noPagadoCount').textContent = mockOrderCounts["No Pagado"];
    document.getElementById('procesandoCount').textContent = mockOrderCounts["Procesando"];
    document.getElementById('enviadoCount').textContent = mockOrderCounts["Enviado"];
    document.getElementById('comentariosCount').textContent = mockOrderCounts["Comentarios"];
    document.getElementById('devolucionCount').textContent = mockOrderCounts["Devolución"];
    
    const sections = document.querySelectorAll('#main-content section');
    const sidebarLinks = document.querySelectorAll('#sidebar a[data-section]');

    function setActiveSection(sectionId) {
        sections.forEach(section => {
            section.style.display = 'none';
            if (section.id === sectionId) {
                section.style.display = 'block';
            }
        });
    }

    function setActiveLink(clickedLink) {
         sidebarLinks.forEach(link => link.classList.remove('active-link'));
         clickedLink.classList.add('active-link');
    }
    
    setActiveSection('dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const statusFilter = this.getAttribute('data-status-filter');

            setActiveSection(sectionId);

            if (this.closest('#sidebar')) {
                setActiveLink(this);
            }

            if (sectionId === 'orders-list-section' && statusFilter) {
                document.getElementById('orderFilterTitle').textContent = statusFilter;

                document.getElementById('ordersListContainer').innerHTML = `<p>Cargando lista de pedidos con estado: <strong>${statusFilter}</strong>...</p>`;
            } else if (sectionId === 'orders-list-section') {
                 document.getElementById('orderFilterTitle').textContent = 'Todos';
                 document.getElementById('ordersListContainer').innerHTML = `<p>Cargando lista de todos los pedidos...</p>`;
            }

            // Lógica añadida: Cargar los datos del usuario cada vez que se navega a la sección de edición.
            if (sectionId === 'edit-profile-section') {
                document.getElementById('editName').value = user.name || '';
                const editEmail = document.getElementById('editEmail');
                if (editEmail) editEmail.value = user.email || ''; 
            }
        });
    });
    
    document.querySelectorAll('.order-status-card').forEach(card => {
         card.addEventListener('click', function() {
            const statusFilter = this.getAttribute('data-status-filter');
            
            setActiveSection('orders-list-section');
            
            document.getElementById('orderFilterTitle').textContent = statusFilter;
            document.getElementById('ordersListContainer').innerHTML = `<p>Cargando lista de pedidos con estado: <strong>${statusFilter}</strong>...</p>`;
            
            const targetLink = document.querySelector(`#sidebar a[data-section="orders-list-section"][data-status-filter="${statusFilter}"]`);
            if (targetLink) {
                 setActiveLink(targetLink);
            } else {
                const fallbackLink = document.querySelector(`#sidebar a[data-section="orders-list-section"]`);
                if (fallbackLink) setActiveLink(fallbackLink);
            }
        });
    });


    // 4. Lógica de Cerrar Sesión
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            // Limpiamos los ítems de sesión
            localStorage.removeItem("currentUser"); 
            localStorage.removeItem("userLogged");
            window.location.href = "index.html"; 
        });
    }

    // 5. Lógica del formulario de Edición de Perfil (Simulada)
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        // NOTA: La carga inicial de datos (nombre y email) se ha movido
        // al listener del sidebar para asegurar que se actualice cada vez
        // que entras a la sección.
        // document.getElementById('editName').value = user.name || ''; // ELIMINADO

        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newName = document.getElementById('editName').value.trim();
            const newPass = document.getElementById('editPassword').value;
            const newPassConfirm = document.getElementById('editPasswordConfirm').value;
            const profileMessageElementId = 'profileMessage';
            
            // No es necesario actualizar el email, ya que es la clave de autenticación
            let updatedUser = { ...user, name: newName };

            if (newPass) {
                if (newPass !== newPassConfirm) {
                    displayMessage(profileMessageElementId, "Las nuevas contraseñas no coinciden. ❌", false);
                    return;
                }
                updatedUser.pass = newPass;
            }

           
            localStorage.setItem("user", JSON.stringify(updatedUser)); 
            localStorage.setItem("currentUser", JSON.stringify(updatedUser)); 

            document.getElementById('welcomeUserName').textContent = updatedUser.name;
            document.getElementById('editPassword').value = '';
            document.getElementById('editPasswordConfirm').value = '';

            displayMessage(profileMessageElementId, "Cambios guardados con éxito. ✅", true);
        });
    }
});
