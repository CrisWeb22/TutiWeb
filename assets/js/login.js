document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const usuario = document.querySelector('input[type="text"]').value;
        const password = document.querySelector('input[type="password"]').value;

        try {
            const response = await fetch('http://127.0.0.1:5000/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "usuario": usuario,
                    "contrasenia": password
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Guardamos el token JWT que nos devuelve el backend
                localStorage.setItem('token', data.token);
                localStorage.setItem('nombre', data.nombre);
                
                // Redirigir según el rol del usuario
                switch(data.rol) {
                    case 'SUDO':
                        window.location.href = 'sudo/inicio.html';
                        break;
                    case 'PRECEPTOR':
                        window.location.href = 'precep/inicio.html';
                        break;
                    case 'ADMIN':
                        window.location.href = '/tutor/dashboard'; // VER A DONDE VA ESTA VERGA DUPLICAR VENTANAS DE SUDO
                        break;
                    case 'TUTOR':
                        window.location.href = 'tutor/inicioTutor.html';
                        break;
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al intentar iniciar sesión');
        }
    });
});