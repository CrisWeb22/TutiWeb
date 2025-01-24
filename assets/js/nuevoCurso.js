
document.addEventListener('DOMContentLoaded', function() {
    const formAltaCurso = document.getElementById('formAltaCurso');
 
    formAltaCurso.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Obtener los valores del formulario
        const añoCurso = document.getElementById('añoCurso').value;
        const divisionCurso = document.getElementById('divisionCurso').value;

        try {
            console.log('llegue');
            const response = await fetch('http://127.0.0.1:5000/cursos/registrar/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    "nombre": añoCurso,
                    "anio": divisionCurso
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Curso creado exitosamente');
                formAltaCurso.reset();
            } else {
                alert(`Error al crear curso: ${data.message}`);
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('Hubo un problema al intentar crear el curso.');
        }
    });
});