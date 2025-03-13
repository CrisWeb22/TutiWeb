document.addEventListener('DOMContentLoaded', function () {
    // Obtener el parámetro cursoId de la URL
    const params = new URLSearchParams(window.location.search);
    const cursoId = params.get('cursoId');

    if (cursoId) {
        cargarDatosCurso(cursoId);
    } else {
        alert("No se recibió un ID de curso válido.");
    }
});

// Función para cargar datos del curso y alumnos
async function cargarDatosCurso(cursoId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/cursos/${cursoId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.querySelector("#nombrePreceptor").innerText = data.preceptor;
            document.querySelector("#nombreCurso").innerText = data.nombreCurso;

            llenarTablaPreceptores(data.preceptores);
            llenarTablaAlumnos(data.alumnos);
        } else {
            alert("Error al cargar datos del curso: " + data.message);
        }
    } catch (error) {
        console.error("Error en la carga de datos:", error);
    }
}

// Función para llenar la tabla de preceptores
function llenarTablaPreceptores(preceptores) {
    const tbody = document.querySelector("#tablaPreceptores tbody");
    tbody.innerHTML = "";
    preceptores.forEach(preceptor => {
        const fila = `<tr>
            <td>${preceptor.apellido}</td>
            <td>${preceptor.nombre}</td>
            <td><button class="btn btn-sm btn-primary">Asignar</button></td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

// Función para llenar la tabla de alumnos
function llenarTablaAlumnos(alumnos) {
    const tbody = document.querySelector("#tablaAlumnos tbody");
    tbody.innerHTML = "";
    alumnos.forEach(alumno => {
        const fila = `<tr>
            <td>${alumno.nombre}</td>
            <td>${alumno.apellido}</td>
            <td><button class="btn btn-sm btn-warning">Ver Situación</button></td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}