document.addEventListener('DOMContentLoaded', function () {
  // Cargar automáticamente los cursos al inicio
  cargarCursos();
  // Manejadores para los botones
  document.getElementById('btnAltaCurso').addEventListener('click', function () {
      cargarModal('/sudo/nuevoCurso.html', 'altaCursoModal', gestionarFormularioCurso);
  });

  // Reutilizar cargarModal con diferentes callbacks si es necesario
  document.getElementById('btnAltaAlumno').addEventListener('click', function () {
      cargarModal('/sudo/nuevoAlumno.html', 'altaAlumnoModal', null); //gestionarFormularioAlumno FALTA IMPLEMENTAR
  });

  document.getElementById('btnAltaEmpleado').addEventListener('click', function () {
      cargarModal('/sudo/nuevoEmpleado.html', 'altaEmpleadoModal', null); //gestionarFormularioEmpleado FALTA IMPLEMENTAR
  });

  document.getElementById('btnAltaTutor').addEventListener('click', function () {
    cargarModal('/sudo/nuevoTutor.html', 'altaTutorModal', null); //gestionarFormularioTutor FALTA IMPLEMENTAR
    });

  document.getElementById('btnSalir').addEventListener('click', function () {
      close();
  });
});

async function cargarCursos() {
    const tablaCursosBody = document.querySelector('#tablaCursos tbody');
    tablaCursosBody.innerHTML = ''; // Limpiar la tabla antes de cargar

    try {
        const token = localStorage.getItem('token'); // Obtener el token almacenado
        if (!token) {
            alert('No autorizado. Inicie sesión.');
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/cursos/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los cursos');
        }

        const data = await response.json();
        if (data.cursos && data.cursos.length > 0) {
            data.cursos.forEach(curso => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                    <td class="text-center">${curso.anio}</td>
                    <td class="text-center">${curso.nombre}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-primary" onclick="verDetalles(${curso.id})">Ver</button>
                    </td>
                `;

                tablaCursosBody.appendChild(fila);
            });
        } else {
            tablaCursosBody.innerHTML = '<tr><td colspan="3" class="text-center">No hay cursos disponibles</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        tablaCursosBody.innerHTML = '<tr><td colspan="3" class="text-center">Error al cargar los cursos</td></tr>';
    }
}

function verDetalles(id) {
    alert(`Ver detalles del curso ID: ${id}`);
}

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
                  cargarCursos();
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

// Función para gestionar el formulario del ALUMNO

// Función para gestionar el formulario del CARGO

// Función para gestionar el formulario del TUTOR

