document.addEventListener('DOMContentLoaded', function () {
  // Manejadores para los botones
  document.getElementById('btnAltaCurso').addEventListener('click', function () {
      cargarModal('/sudo/nuevoCurso.html', 'altaCursoModal', gestionarFormularioCurso);
  });

  // Reutilizar cargarModal con diferentes callbacks si es necesario
  document.getElementById('btnAltaAlumno').addEventListener('click', function () {
      cargarModal('/sudo/nuevoAlumno.html', 'altaAlumnoModal', null);
  });

  document.getElementById('btnAltaEmpleado').addEventListener('click', function () {
      cargarModal('/sudo/nuevoEmpleado.html', 'altaEmpleadoModal', null);
  });

  document.getElementById('btnSalir').addEventListener('click', function () {
      close();
  });
});

// Función para cargar y MOSTRAR EL MODAL
function cargarModal(url, modalId, callback) {
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

          // Ejecutar la lógica específica si se pasa un callback
          if (callback) callback(modalId);
      })
      .catch(error => console.error('Error al cargar el modal:', error));
}

// Función para gestionar el formulario del CURSO
function gestionarFormularioCurso(modalId) {
  const form = document.getElementById('formAltaCurso');
  console.log('Formulario del curso encontrado:', form);

  if (form) {
      form.addEventListener('submit', async function (event) {
          event.preventDefault();
          console.log('Submit del formulario capturado');

          // Obtener los valores del formulario
          const añoCurso = document.getElementById('añoCurso').value;
          const divisionCurso = document.getElementById('divisionCurso').value;

          console.log('Datos a enviar:', { nombre: añoCurso, anio: divisionCurso });

          try {
              const response = await fetch('http://127.0.0.1:5000/cursos/registrar', {
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
                  form.reset();
                  bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
              } else {
                  alert(`Error al crear curso: ${data.message}`);
              }
          } catch (error) {
              console.error('Error al conectar con el servidor:', error);
              alert('Hubo un problema al intentar crear el curso.');
          }
      });
  }
}

/*
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


function cargarModal(url, modalId, callback) {
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

          // Ejecutar la lógica específica si se pasa un callback
          if (callback) callback(modalId);
      })
      .catch(error => console.error('Error al cargar el modal:', error));
}

// Función para gestionar el formulario del curso
function gestionarFormularioCurso(modalId) {
  const form = document.getElementById('formAltaCurso');
  console.log('Formulario del curso encontrado:', form);

  if (form) {
      form.addEventListener('submit', async function (event) {
          event.preventDefault();
          console.log('Submit del formulario capturado');

          // Obtener los valores del formulario
          const añoCurso = document.getElementById('añoCurso').value;
          const divisionCurso = document.getElementById('divisionCurso').value;

          console.log('Datos a enviar:', { nombre: añoCurso, anio: divisionCurso });

          try {
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
                  form.reset();
                  bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
              } else {
                  alert(`Error al crear curso: ${data.message}`);
              }
          } catch (error) {
              console.error('Error al conectar con el servidor:', error);
              alert('Hubo un problema al intentar crear el curso.');
          }
      });
  }
}
*/


//----------------------------------------------------------------//


/*
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
*/

//----------------------------------------------------------------//

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