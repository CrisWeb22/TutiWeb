document.addEventListener('DOMContentLoaded', async function() {
    // 1. Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = decodeURIComponent(params.get('nombreCurso') || '').trim();
    const anioCurso = params.get('anioCurso') || '';

    if (!nombreCurso || !anioCurso) {
        alert("Error: Faltan parámetros del curso");
        window.location.href = 'inicio.html';
        return;
    }

    // 2. Mostrar nombre del curso
    document.getElementById('nombreCurso').textContent = `${nombreCurso} (${anioCurso})`;

    // 3. Cargar preceptor asignado
    await cargarPreceptorAsignado(nombreCurso, anioCurso);

    // 4. Cargar alumnos del curso
    await cargarAlumnosCurso(nombreCurso, anioCurso);

    // Configurar botón "Sumar alumno"
    document.getElementById("btnSumarAlumno").addEventListener("click", () => {
        const modal = new bootstrap.Modal(document.getElementById('buscarAlumnoModal'));
        modal.show();
    });

    cargarDatosCurso(nombreCurso, anioCurso);
});

// Función para cargar preceptor asignado (similar a tu ejemplo funcional)
async function cargarPreceptorAsignado(nombreCurso, anioCurso) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`http://127.0.0.1:5000/cursos/preceptor/${encodeURIComponent(nombreCurso)}/${anioCurso}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            alert('No tienes permisos para ver esta información');
            window.location.href = '/index.html';
            return;
        }

        if (response.status === 404) {
            document.querySelector("#nombrePreceptor").textContent = "No asignado";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.preceptores) {
            throw new Error('Formato de respuesta inválido');
        }

        if (data.preceptores.length > 0) {
            const preceptor = data.preceptores[0];
            const nombreCompleto = `${preceptor.nombre} ${preceptor.apellido}`;
            document.querySelector("#nombrePreceptor").textContent = nombreCompleto;
            
            if (data.preceptores.length > 1) {
                document.querySelector("#nombrePreceptor").textContent += ` (+${data.preceptores.length - 1})`;
            }
        } else {
            document.querySelector("#nombrePreceptor").textContent = "No asignado";
        }

    } catch (error) {
        console.error("Error al cargar preceptor:", error);
        document.querySelector("#nombrePreceptor").textContent = "Error al cargar";
        if (!error.message.includes('404')) {
            alert(`Error: ${error.message}`);
        }
    }
}

// Función para cargar alumnos del curso (similar a tu ejemplo)
async function cargarAlumnosCurso(nombreCurso, anioCurso) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`http://127.0.0.1:5000/cursos/alumnos/${encodeURIComponent(nombreCurso)}/${anioCurso}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const alumnos = await response.json();
            llenarTablaAlumnos(alumnos);
        } else {
            throw new Error('Error al obtener alumnos del curso');
        }
    } catch (error) {
        console.error("Error al cargar alumnos:", error);
        alert("No se pudieron cargar los alumnos");
    }
}

// Función para llenar la tabla de alumnos (igual a tu versión)
function llenarTablaAlumnos(alumnos) {
    const tbody = document.querySelector("#tablaAlumnos tbody");
    tbody.innerHTML = "";

    alumnos.forEach(alumno => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="text-center">${alumno.nombre}</td>
            <td class="text-center">${alumno.apellido}</td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm">Ver Situación</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

async function cargarDatosCurso(nombreCurso, anioCurso) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:5000/cursos/${encodeURIComponent(nombreCurso)}/${anioCurso}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            // Mostrar preceptor
            document.getElementById('nombrePreceptor').textContent = data.preceptor || "No asignado";
            
            // Mostrar alumnos si existen
            if (data.alumnos && data.alumnos.length > 0) {
                llenarTablaAlumnos(data.alumnos);
            }
        } else {
            throw new Error(data.message || "Error al cargar datos del curso");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar los datos del curso.");
    }
}