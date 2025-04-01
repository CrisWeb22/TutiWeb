document.addEventListener('DOMContentLoaded', function () {
  // Cargar automáticamente los cursos al inicio
  cargarCursos();

  // Manejadores para los botones
  document.getElementById('btnAltaCurso').addEventListener('click', function () {
      cargarModal('/sudo/nuevoCurso.html', 'altaCursoModal', gestionarFormularioCurso);
  });

  // Reutilizar cargarModal con diferentes callbacks si es necesario
  document.getElementById('btnAltaAlumno').addEventListener('click', function () {
      cargarModal('/sudo/nuevoAlumno.html', 'altaAlumnoModal', gestionarFormularioAlumno);
  });

  document.getElementById('btnAltaEmpleado').addEventListener('click', function () {
      cargarModal('/sudo/nuevoEmpleado.html', 'altaEmpleadoModal', gestionarFormularioEmpleado);
  });

  document.getElementById('btnAltaTutor').addEventListener('click', function () {
    cargarModal('/sudo/nuevoTutor.html', 'altaTutorModal', gestionarFormularioTutor); 
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
                        <button class="btn btn-sm btn-primary" onclick="verDetalles('${curso.nombre}', '${curso.anio}')">Ver</button>
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

function verDetalles(nombreCurso, anioCurso) {
    window.location.href = `preceptorCurso.html?nombreCurso=${nombreCurso}&anioCurso=${anioCurso}`;
}

async function cargarTutoresParaSeleccion() {
    try {
        const token = localStorage.getItem('token'); // Obtener el token almacenado
        if (!token) {
            alert('No autorizado. Inicie sesión.');
            return;
        }

        // Obtener el DNI ingresado por el usuario
        const dniTutor = document.getElementById('tutorAlumno').value.trim();

        if (!dniTutor) {
            alert('Por favor, ingrese el DNI del tutor.');
            return;
        }

        // Realizar la solicitud para buscar el tutor por DNI
        const response = await fetch(`http://127.0.0.1:5000/personas/${dniTutor}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al buscar el tutor');
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            // Si hay múltiples tutores, mostrar un modal para seleccionar uno
            mostrarModalTutores(data);
        } else {
            alert('No se encontró un tutor con el DNI proporcionado.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al buscar el tutor.');
    }
}

// Función para mostrar un modal con la lista de tutores
function mostrarModalTutores(tutores) {
    const listaTutores = document.getElementById('listaTutores');
    listaTutores.innerHTML = ''; // Limpiar la lista antes de cargar

    // Crear un elemento de lista por cada tutor
    tutores.forEach(tutor => {
        const item = document.createElement('li');
        item.className = 'list-group-item';
        item.innerText = `${tutor.nombre} ${tutor.apellido} (${tutor.usuario})`; // Mostrar nombre, apellido y usuario
        item.addEventListener('click', function () {
            // Actualizar el campo tutorAlumno con el nombre y apellido del tutor seleccionado
            document.getElementById('tutorAlumno').value = `${tutor.nombre} ${tutor.apellido}`;
            // Actualizar el campo oculto usuarioTutor con el nombre de usuario del tutor seleccionado
            document.getElementById('usuarioTutor').value = tutor.usuario;
            // Ocultar el modal
            bootstrap.Modal.getInstance(document.getElementById('seleccionarTutorModal')).hide();
        });
        listaTutores.appendChild(item);
    });

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('seleccionarTutorModal'));
    modal.show();
}

// Asignar la función al botón "Buscar Tutor"
document.getElementById('btnSeleccionarTutor').addEventListener('click', cargarTutoresParaSeleccion);

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
  
            // Agregar el event listener para el botón "btnSeleccionarTutor" "btnSeleccionarCurso"
            const btnSeleccionarTutor = document.getElementById('btnSeleccionarTutor');
            if (btnSeleccionarTutor) {
                btnSeleccionarTutor.addEventListener('click', function () {
                    cargarTutoresParaSeleccion();
                });
            }
  
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
function gestionarFormularioAlumno(modalId) {
    const form = document.getElementById('formAltaAlumno');
    console.log('Formulario del alumno encontrado:', form);

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            console.log('Submit del formulario capturado');

            // Obtener los valores del formulario
            const dniAlumno = document.getElementById('dni').value;
            const nombreAlumno = document.getElementById('nombreAlumno').value;
            const apellidoAlumno = document.getElementById('apellidoAlumno').value;
            const usuarioTutor = document.getElementById('usuarioTutor').value;
            const fechaNacimiento = document.getElementById('fechaNacimiento').value;

            console.log('Datos a enviar:', {
                dni: dniAlumno,
                nombre: nombreAlumno,
                apellido: apellidoAlumno,
                usuarioTutor: [usuarioTutor],
                fechNac: fechaNacimiento
            });

            try {
                const response = await fetch('http://127.0.0.1:5000/alumnos/registrar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        "dni": dniAlumno,
                        "nombre": nombreAlumno,
                        "apellido": apellidoAlumno,
                        "usuarioTutor": [usuarioTutor],
                        "fechNac": fechaNacimiento
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Alumno matriculado exitosamente');
                    form.reset();
                    bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
                    // Aquí podrías llamar a una función para recargar la lista de alumnos si es necesario
                } else {
                    alert(`Error al matricular alumno: ${data.message}`);
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                alert('Hubo un problema al intentar matricular al alumno.');
            }
        });
    }
}

// Función para gestionar el formulario del CARGO
function gestionarFormularioEmpleado(modalId){
    const form = document.getElementById('formAltaEmpleado');
    console.log('Formulario del empleado encontrado:', form);

    if (form){
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            console.log('submit del formulario capturado');

            // Obtener los valores del formulario
            const usuario = document.getElementById('usuarioEmpleado').value;
            const dni = document.getElementById('dni').value;
            const apellido = document.getElementById('apellidoEmpleado').value;
            const nombre = document.getElementById('nombreEmpleado').value;
            const contrasenia = document.getElementById('paswordEmpleado').value;
            const mail = document.getElementById('emailEmpleado').value;
            const rol = document.getElementById('rolEmpleado').value

            console.log('Datos a enviar:', { dni:dni, nombre:nombre, apellido:apellido, usuario:usuario, mail:mail, rol:rol, contrasenia:contrasenia });

            try{
                const response = await fetch('http://127.0.0.1:5000/personas/registrar', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        "usuario": usuario,
                        "dni": dni,
                        "apellido": apellido,
                        "nombre": nombre,
                        "contrasenia": contrasenia,
                        "mail": mail,
                        "rol": rol
                    })
                });
                const data = await response.json();

                if (response.ok){
                    alert('Empleado dado de alta exitosamente');
                    form.reset();
                    bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
                } else {
                    alert(`Error al dar de alta al empleado: ${data.message}`);
                }
            } catch (error) {
                console.error('Error al conectar con el servidor:', error);
                alert('Hubo un problema al intentar dar de alta al empleado.');
            }
        });
    }
}

// Función para gestionar el formulario del TUTOR
function gestionarFormularioTutor(modalId){
    const form = document.getElementById('formAltaTutor');
  console.log('Formulario del curso encontrado:', form);

  if (form) {
      form.addEventListener('submit', async function (event) {
          event.preventDefault();
          console.log('Submit del formulario capturado');

          // Obtener los valores del formulario
          const usuario = document.getElementById('usuarioTutor').value;
          const dni = document.getElementById('dni').value;
          const apellido = document.getElementById('apellidoTutor').value;
          const nombre = document.getElementById('nombreTutor').value;
          const contrasenia = document.getElementById('paswordTutor').value;
          const mail = document.getElementById('emailTutor').value;
          const rol = 'TUTOR'

          console.log('Datos a enviar:', { dni:dni, nombre:nombre, apellido:apellido, usuario:usuario, mail:mail, rol:rol, contrasenia:contrasenia });

          try {
              const response = await fetch('http://127.0.0.1:5000/personas/registrar', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({
                        "usuario": usuario,
                        "dni": dni,
                        "apellido": apellido,
                        "nombre": nombre,
                        "contrasenia": contrasenia,
                        "mail": mail,
                        "rol": rol
                  })
              });

              const data = await response.json();

              if (response.ok) {
                  alert('Tutor dado de alta exitosamente');
                  form.reset();
                  bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
              } else {
                  alert(`Error al dar de alta al tutor: ${data.message}`);
              }
          } catch (error) {
              console.error('Error al conectar con el servidor:', error);
              alert('Hubo un problema al intentar dar de alta al tutor.');
          }
      });
   }
}