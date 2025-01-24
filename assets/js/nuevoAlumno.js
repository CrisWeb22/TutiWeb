document.addEventListener('DOMContentLoaded', () => {
    const formAltaAlumno = document.getElementById('formAltaAlumno');
    const btnVerTutores = document.getElementById('btnVerTutores');
    const btnNuevoTutor = document.getElementById('btnNuevoTutor');
    const tutoresContainer = document.getElementById('tutoresContainer');
    const tutorSeleccionado = document.getElementById('tutorSeleccionado');

    // 1. Enviar datos de matriculación de alumno al servidor
    formAltaAlumno.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formAltaAlumno);

        try {
            const response = await fetch('/api/alumnos', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                alert('Alumno matriculado exitosamente');
                formAltaAlumno.reset();
            } else {
                const error = await response.json();
                alert(`Error al matricular alumno: ${error.message}`);
            }
        } catch (err) {
            console.error('Error al enviar los datos:', err);
            alert('Hubo un problema al conectar con el servidor.');
        }
    });

    // 2. Mostrar lista de tutores disponibles
    btnVerTutores.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/tutores');
            if (response.ok) {
                const tutores = await response.json();
                tutorSeleccionado.innerHTML = '<option value="">Seleccione un tutor</option>';
                tutores.forEach(tutor => {
                    const option = document.createElement('option');
                    option.value = tutor.id;
                    option.textContent = `${tutor.nombre} ${tutor.apellido}`;
                    tutorSeleccionado.appendChild(option);
                });
                tutoresContainer.style.display = 'block';
            } else {
                alert('Error al cargar la lista de tutores');
            }
        } catch (err) {
            console.error('Error al obtener tutores:', err);
        }
    });

    // 3. Mostrar modal de nuevo tutor
    btnNuevoTutor.addEventListener('click', async () => {
        const modalPlaceholder = document.createElement('div');
        document.body.appendChild(modalPlaceholder);
    
        try {
            const response = await fetch('/sudo/nuevoTutor.html'); // Asegúrate de que esta ruta sea válida
            if (response.ok) {
                const modalHtml = await response.text();
                modalPlaceholder.innerHTML = modalHtml;
    
                // Verifica que Bootstrap esté inicializado
                if (bootstrap && bootstrap.Modal) {
                    const nuevoTutorModal = new bootstrap.Modal(document.getElementById('altaTutorModal'));
                    nuevoTutorModal.show();
    
                    // Limpia el contenido dinámico después de cerrar el modal
                    document.getElementById('altaTutorModal').addEventListener('hidden.bs.modal', () => {
                        modalPlaceholder.remove();
                    });
                } else {
                    console.error('Bootstrap no está cargado o inicializado correctamente.');
                }
            } else {
                alert('Error al cargar el formulario de nuevo tutor');
            }
        } catch (err) {
            console.error('Error al cargar el modal:', err);
        }
    });
});