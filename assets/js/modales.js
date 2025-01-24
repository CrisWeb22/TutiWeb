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
        close();
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
/*
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const tablaCursosBody = document.querySelector('#tablaCursos tbody');
    const tablaAlumnosContainer = document.getElementById('alumnosContainer');
    const tablaAlumnosBody = document.querySelector('#tablaAlumnos tbody');
  
    // Cargar los cursos desde el servidor
    fetch('http://127.0.0.1:5000/cursos')
      .then((response) => response.json())
      .then((cursos) => {
        // Generar las filas dinámicamente
        cursos.forEach((curso) => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <th scope="row" class="text-center">${curso.anio}</th>
            <td class="text-center">${curso.division}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary" data-id="${curso.id}">Ver</button>
            </td>
          `;
          tablaCursosBody.appendChild(fila);
        });
      });
  
    // Evento para cargar alumnos al hacer clic en "Ver"
    tablaCursosBody.addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        const cursoId = event.target.getAttribute('data-id');
  
        // Mostrar alumnos del curso seleccionado
        fetch(`http://127.0.0.1:5000/alumnos/<nombrecurso>/<anio>`) // VER
          .then((response) => response.json())
          .then((alumnos) => {
            // Limpiar la tabla de alumnos
            tablaAlumnosBody.innerHTML = '';
  
            // Generar filas de alumnos
            alumnos.forEach((alumno) => {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                <td class="text-center">${alumno.nombre}</td>
                <td class="text-center">${alumno.apellido}</td>
                <td class="text-center">${alumno.dni}</td>
              `;
              tablaAlumnosBody.appendChild(fila);
            });
  
            // Mostrar la tabla de alumnos
            tablaAlumnosContainer.style.display = 'block';
          });
      }
    });
});*/