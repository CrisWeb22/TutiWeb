document.addEventListener('DOMContentLoaded', function () {
    // Manejadores para los botones
    document.getElementById('btnAltaCurso').addEventListener('click', function () {
        cargarModal('/sudo/nuevoCurso.html', 'altaCursoModal');
    });

    document.getElementById('btnAltaAlumno').addEventListener('click', function () {
        cargarModal('/sudo/nuevoAlumno.html', 'altaAlumnoModal');
    });

    document.getElementById('btnAltaEmpleado').addEventListener('click', function () {
        cargarModal('/sudo/nuevoEmpleado.html', 'altaEmpleadoModal');
    });
    document.getElementById('btnSalir').addEventListener('click', function () {
        if (confirm('¿Estás seguro de que deseas salir del sistema?')) {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/index.html';  // Cambia '/login' por la ruta de tu página de inicio de sesión
                } else {
                    alert('Hubo un problema al cerrar la sesión. Inténtalo nuevamente.');
                }
            })
            .catch(err => {
                console.error('Error cerrando sesión:', err);
                alert('Hubo un error de conexión. Inténtalo nuevamente.');
            });
        }
    });
});

// Función para cargar y mostrar el modal
function cargarModal(url, modalId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            // Insertar el modal en el body
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = html;
            document.body.appendChild(modalContainer);

            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            modal.show();

            // Limpiar el modal del DOM al cerrarse
            document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
                modalContainer.remove();
            });
        })
        .catch(error => console.error('Error al cargar el modal:', error));
}