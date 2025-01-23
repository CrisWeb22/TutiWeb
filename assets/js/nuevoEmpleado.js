document.addEventListener('DOMContentLoaded', function() {
    fetch('/sudo/nuevoEmpleado.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            
            // Una vez cargado el modal, configuramos el manejador del formulario
            document.getElementById('formAltaAdmin').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    dni: document.getElementById('dni').value,
                    nombre: document.getElementById('nombreAdmin').value,
                    apellido: document.getElementById('apellido').value,
                    usuario: document.getElementById('usuario').value,
                    password: document.getElementById('password').value,
                    //fechaNacimiento: document.getElementById('fechaNacimiento').value,
                };

                console.log('Datos del formulario:', formData);
                // Aquí irá tu lógica para enviar los datos al servidor
            });
        });
});