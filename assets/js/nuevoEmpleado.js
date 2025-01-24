document.addEventListener('DOMContentLoaded', function() {
    fetch('/sudo/nuevoEmpleado.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            
            // Configurar la lógica de selección del rol
            let selectedRole = null;
            const dropdownItems = document.querySelectorAll('.dropdown-item');
            const dropdownButton = document.querySelector('.dropdown-toggle');

            dropdownItems.forEach(item => {
                item.addEventListener('click', function() {
                    selectedRole = this.textContent.trim();
                    dropdownButton.textContent = `Cargo seleccionado: ${selectedRole}`;
                });
            });

            // Configuramos el manejador del formulario
            document.getElementById('formAltaEmpleado').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Verificar si se seleccionó un rol
                if (!selectedRole) {
                    alert('Por favor, selecciona un rol antes de continuar.');
                    return;
                }

                // Crear el objeto con los datos del formulario
                const formData = {
                    dni: document.getElementById('dni').value,
                    nombre: document.getElementById('nombreEmpleado').value,
                    apellido: document.getElementById('apellidoEmpleado').value,
                    usuario: document.getElementById('usuarioEmpleado').value,
                    password: document.getElementById('paswordEmpleado').value,
                    rol: selectedRole // Agregar el rol seleccionado
                };

                console.log('Datos del formulario:', formData);

                // Enviar los datos al servidor (por ejemplo, usando fetch)
                fetch('/api/nuevoEmpleado', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (response.ok) {
                        alert('Empleado registrado con éxito.');
                        // Opcional: Cerrar el modal o resetear el formulario
                        document.getElementById('formAltaEmpleado').reset();
                        dropdownButton.textContent = 'Selección de cargo';
                        selectedRole = null;
                    } else {
                        return response.json().then(data => {
                            throw new Error(data.message || 'Error al registrar el empleado.');
                        });
                    }
                })
                .catch(error => {
                    alert('Error: ' + error.message);
                });
            });
        });
});
