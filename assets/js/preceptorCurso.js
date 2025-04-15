document.addEventListener('DOMContentLoaded', async function() {
    // 1. Obtener parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = decodeURIComponent(params.get('nombreCurso') || '').trim();
    const anioCurso = params.get('anioCurso') || '';

    if (!nombreCurso || !anioCurso) {
        alert("Error: Faltan parámetros del curso");
        window.location.href = 'cursos.html';
        return;
    }

    // 2. Mostrar nombre del curso
    document.querySelector("#nombreCurso").textContent = `${nombreCurso} (${anioCurso})`;

    // 3. Cargar preceptor(es) asignado(s)
    await cargarPreceptorAsignado(nombreCurso, anioCurso);

    // 4. Cargar lista de preceptores disponibles
    if (document.querySelector("#tablaPreceptores")) {
        await cargarPreceptores();
    }

    // 5. Cargar alumnos del curso
    await cargarAlumnosCurso(nombreCurso, anioCurso);
});

document.querySelector("#tablaAlumnos tbody").addEventListener("click", (event) => {
    if (event.target.classList.contains("ver-situacion")) {
        const button = event.target;
        const id = button.dataset.id;
        const nombre = button.dataset.nombre;
        const apellido = button.dataset.apellido;

        const nombreCurso = decodeURIComponent(new URLSearchParams(window.location.search).get('nombreCurso'));
        const anioCurso = new URLSearchParams(window.location.search).get('anioCurso');

        const params = new URLSearchParams({
            id: id,
            nombre: nombre,
            apellido: apellido,
            nombreCurso: nombreCurso,
            anioCurso: anioCurso
        });

        window.location.href = `situacionAlumno.html?${params.toString()}`;
    }
});


// SUMAR ALUMNO
document.getElementById("btnSumarAlumno").addEventListener("click", () => {
    const modal = new bootstrap.Modal(document.getElementById('buscarAlumnoModal'));
    modal.show();
});

//BUSCAR ALUMNO
document.getElementById("btnBuscarAlumno").addEventListener("click", async () => {
    const dni = document.getElementById("dniAlumno").value.trim();
    if (!dni) {
        alert("Por favor ingrese un DNI");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/alumnos/info/${dni}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const alumno = await response.json();
            mostrarResultadoBusqueda(alumno);
        } else if (response.status === 404) {
            document.getElementById("resultadoBusqueda").innerHTML = `
                <div class="alert alert-warning">Alumno no encontrado</div>
            `;
        }
    } catch (error) {
        console.error("Error al buscar alumno:", error);
        alert("Error en la búsqueda");
    }
});

// ELIMINAR ALUMNO
document.querySelector("#btnDarDeBaja").addEventListener("click", async () => {
    const checkboxes = document.querySelectorAll(".seleccionar-alumno:checked");
    if (checkboxes.length === 0) {
        alert("Por favor seleccione al menos un alumno para dar de baja.");
        return;
    }

    if (!confirm("¿Está seguro que desea dar de baja al alumno seleccionado del curso?")) {
        return;
    }

    const nombreCurso = decodeURIComponent(new URLSearchParams(window.location.search).get('nombreCurso'));
    const anioCurso = new URLSearchParams(window.location.search).get('anioCurso');
    //console.log(nombreCurso);
    //console.log(anioCurso);
    

    for (const checkbox of checkboxes) {
        const idAlu = checkbox.dataset.id;
        //console.log(idAlu);

        try {
            const response = await fetch("http://127.0.0.1:5000/alumnos/desvincularCurso", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    idAlu: parseInt(idAlu),
                    nombreCurso: nombreCurso,
                    anio: anioCurso
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result.message);
            } else {
                console.warn(result.message || "Error al dar de baja al alumno");
            }

        } catch (error) {
            console.error("Error en la solicitud de baja:", error);
        }
    }

    // Refrescar tabla de alumnos luego de las bajas
    await cargarAlumnosCurso(nombreCurso, anioCurso);
});


function mostrarResultadoBusqueda(alumno) {
    const resultadoDiv = document.getElementById("resultadoBusqueda");
    const btnAsignar = document.getElementById("btnAsignarAlumno");

    resultadoDiv.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h5>${alumno.nombre} ${alumno.apellido}</h5>
                <p>DNI: ${alumno.dni}</p>
                <p>Estado: ${alumno.estado}</p>
            </div>
        </div>
    `;

    btnAsignar.disabled = false;
    btnAsignar.onclick = () => asignarAlumnoAlCurso(alumno.id); // ¡Usar alumno.id (no idalu)!
}

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

        // Verificar estado de la respuesta
        if (response.status === 401) {
            alert('No tienes permisos para ver esta información');
            window.location.href = '/index.html';
            return;
        }

        if (response.status === 404) {
            // No hay preceptores asignados (respuesta válida)
            document.querySelector("#nombrePreceptor").textContent = "No asignado";
            return;
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Verificar estructura de la respuesta
        if (!data.preceptores) {
            throw new Error('Formato de respuesta inválido');
        }

        // Mostrar preceptor(es)
        if (data.preceptores.length > 0) {
            const preceptor = data.preceptores[0]; // Tomamos el primero
            const nombreCompleto = `${preceptor.nombre} ${preceptor.apellido}`;
            document.querySelector("#nombrePreceptor").textContent = nombreCompleto;
            
            // Opcional: Mostrar indicación si hay más de uno
            if (data.preceptores.length > 1) {
                document.querySelector("#nombrePreceptor").textContent += ` (+${data.preceptores.length - 1})`;
            }
        } else {
            document.querySelector("#nombrePreceptor").textContent = "No asignado";
        }

    } catch (error) {
        console.error("Error al cargar preceptor:", error);
        document.querySelector("#nombrePreceptor").textContent = "Error al cargar";
        
        // Solo mostrar alerta para errores no manejados
        if (!error.message.includes('404')) {
            alert(`Error: ${error.message}`);
        }
    }
}

async function cargarAlumnosCurso(nombreCurso, anioCurso) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/alumnos/${nombreCurso}/${anioCurso}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const alumnos = await response.json();
            llenarTablaAlumnos(alumnos);
        } else {
            throw new Error("Error al cargar alumnos");
        }
    } catch (error) {
        console.error("Error en cargarAlumnosCurso:", error);
        alert("No se pudieron cargar los alumnos. Intente recargar la página.");
    }
}


// Función para cargar datos del curso y alumnos
async function cargarDatosCurso(nombreCurso, anioCurso) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/cursos/${nombreCurso}/${anioCurso}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.querySelector("#nombrePreceptor").innerText = data.preceptor || "No asignado";
            document.querySelector("#nombreCurso").innerText = `${nombreCurso} (${anioCurso})`;

            if (data.alumnos) {
                llenarTablaAlumnos(data.alumnos);
            }
        } else {
            alert("Error al cargar datos del curso: " + data.message);
        }
    } catch (error) {
        console.error("Error en la carga de datos:", error);
        alert("Error al cargar los datos del curso.");
    }
}

// Función para obtener la lista de preceptores
async function cargarPreceptores() {
    try {
        const response = await fetch('http://127.0.0.1:5000/personas/preceptores', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            llenarTablaPreceptores(data);
        } else {
            alert("Error al cargar la lista de preceptores: " + data.message);
        }
    } catch (error) {
        console.error("Error al obtener la lista de preceptores:", error);
        alert("Error al cargar los preceptores.");
    }
}

// Función para llenar la tabla de preceptores
function llenarTablaPreceptores(preceptores) {
    const tbody = document.querySelector("#tablaPreceptores tbody");
    tbody.innerHTML = "";
    const preceptorActual = document.querySelector("#nombrePreceptor").textContent;

    preceptores.forEach(preceptor => {
        const nombreCompleto = `${preceptor.nombre} ${preceptor.apellido}`;
        const estaAsignado = (nombreCompleto === preceptorActual);
        
        const btn = document.createElement('button');
        btn.className = `btn btn-sm ${estaAsignado ? 'btn-success' : 'btn-primary'}`;
        btn.textContent = estaAsignado ? '✔ Asignado' : 'Asignar';  //BOTON VERDE CHECK
        btn.disabled = estaAsignado;
        if (!estaAsignado) {
            btn.onclick = () => asignarPreceptor(preceptor.usuario);
        }

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="text-center">${preceptor.apellido}</td>
            <td class="text-center">${preceptor.nombre}</td>
            <td class="text-center"></td>
        `;
        fila.lastElementChild.appendChild(btn);
        tbody.appendChild(fila);
    });
}

// Función para llenar la tabla de alumnos
function llenarTablaAlumnos(alumnos) {
    const tbody = document.querySelector("#tablaAlumnos tbody");
    tbody.innerHTML = "";

    alumnos.forEach(alumno => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="text-center">
                <input type="checkbox" class="seleccionar-alumno" data-id="${alumno.idAlu}">
            </td>
            <td class="text-center">${alumno.nombre || alumno.nombrealu}</td>
            <td class="text-center">${alumno.apellido || alumno.apealu}</td>
            <td class="text-center">
                <button 
                    class="btn btn-warning btn-sm ver-situacion"
                    data-id="${alumno.idAlu}" 
                    data-nombre="${alumno.nombre || alumno.nombrealu}"
                    data-apellido="${alumno.apellido || alumno.apealu}"
                >
                    Ver Situación
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Función para asignar un preceptor a un curso
async function asignarPreceptor(preceptorNombre, preceptorApellido) {
    // 1. Obtener parámetros del curso
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = params.get('nombreCurso');
    const anioCurso = params.get('anioCurso');

    // 2. Validaciones iniciales
    if (!nombreCurso || !anioCurso) {
        alert("Error: No se detectó el curso actual");
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sesión expirada. Por favor ingrese nuevamente.');
        window.location.href = '/login.html';
        return;
    }

    // 3. Configurar la petición
    try {
        const response = await fetch('http://127.0.0.1:5000/cursos/asignarPreceptor', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreCurso: nombreCurso,
                anioCurso: anioCurso,
                usuarioPreceptor: [preceptorNombre] // IMPORTANTE: Enviamos solo el nombre de usuario
            })
        });

        // 4. Procesar respuesta
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || "Error desconocido");
        }

        // 5. Manejar diferentes códigos de estado
        switch(response.status) {
            case 201: // Todos asignados
                alert("Preceptor asignado correctamente");
                document.querySelector("#nombrePreceptor").textContent = `${preceptorNombre} ${preceptorApellido}`;
                break;
                
            case 207: // Algunos asignados
                alert(`Advertencia: ${data.message}\nNo asignados: ${data.preceptoresNoAsignados?.join(', ') || 'N/A'}`);
                if (!data.preceptoresNoAsignados?.includes(preceptorNombre)) {
                    document.querySelector("#nombrePreceptor").textContent = `${preceptorNombre} ${preceptorApellido}`;
                }
                break;
                
            default:
                throw new Error(data.message || "Respuesta inesperada del servidor");
        }

    } catch (error) {
        console.error("Error en asignación:", {
            error: error.message,
            stack: error.stack
        });
        
        // Mensajes específicos según tipo de error
        if (error.message.includes("llave duplicada")) {
            alert("Este preceptor ya está asignado al curso");
        } else {
            alert(`Error al asignar: ${error.message}`);
        }
    }
}

async function asignarAlumnoAlCurso(idAlumno) {  
    const params = new URLSearchParams(window.location.search);
    const nombreCurso = params.get('nombreCurso');
    const anioCurso = params.get('anioCurso');
    //console.log(idAlumno)
    //console.log(nombreCurso)
    //console.log(anioCurso)

    try {
        const response = await fetch("http://127.0.0.1:5000/alumnos/curso", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: Number(idAlumno), // Debe ser 15 (idalu), no 36852147 (DNI)
                curso: nombreCurso,
                anio: anioCurso
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error al asignar alumno");
        }

        alert("Alumno asignado correctamente");
        await cargarAlumnosCurso(nombreCurso, anioCurso);
        bootstrap.Modal.getInstance(document.getElementById('buscarAlumnoModal')).hide();
    } catch (error) {
        console.error("Error en asignarAlumnoAlCurso:", error);
        alert(`Error: ${error.message.includes("duplicada") ? "El alumno ya está en este curso" : error.message}`);
    }
}