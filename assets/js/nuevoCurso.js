console.log('Archivo nuevoCurso.js cargado');


console.log('Formulario encontrado:', formAltaCurso);
document.addEventListener('DOMContentLoaded', function() {
    const formAltaCurso = document.getElementById('formAltaCurso');
    console.log('Archivo nuevoCurso.js cargado X2');



>>>>>>> origin/main
    formAltaCurso.addEventListener('submit', async function(event) {
        console.log('Ingresa al submit');
        event.preventDefault();
        console.log('El evento submit se ejecutó correctamente');
        // Obtener los valores del formulario
        const añoCurso = document.getElementById('añoCurso').value;
        const divisionCurso = document.getElementById('divisionCurso').value;
        console.log('Datos a enviar:', { nombre: añoCurso, anio: divisionCurso }); // Verificar datos
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


