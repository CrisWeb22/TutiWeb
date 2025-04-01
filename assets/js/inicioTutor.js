document.addEventListener('DOMContentLoaded', function () {
    // Cargar automáticamente los datos del tutor y los hijos al inicio
    cargarDatosTutor();
    cargarHijosAsociados();
  
    // Manejador para el botón de salir
    document.getElementById('btnSalir').addEventListener('click', function () {
        close(); // Cierra la ventana o finaliza la sesión
    });
  });
  
  // Función para cargar los datos del tutor
  async function cargarDatosTutor() {
    try {
        // Recuperar el nombre del tutor desde el localStorage
        const nombreTutor = localStorage.getItem('nombre');

        if (!nombreTutor) {
            alert('No se encontró el nombre del tutor en el almacenamiento local.');
            return;
        }

        // Mostrar el nombre del tutor en el h4
        document.getElementById('nombreTutor').textContent = nombreTutor;
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al cargar los datos del tutor.');
    }
}
  
  // Función para cargar los hijos asociados
  async function cargarHijosAsociados() {
    const tablaHijosBody = document.querySelector('#tablaHijos tbody');
    tablaHijosBody.innerHTML = ''; // Limpiar la tabla antes de cargar
  
    try {
        const token = localStorage.getItem('token'); // Obtener el token almacenado
        if (!token) {
            alert('No autorizado. Inicie sesión.');
            return;
        }
  
        // Realizar la solicitud para obtener los hijos asociados
        const response = await fetch('http://127.0.0.1:5000/tutores/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
  
        if (!response.ok) {
            throw new Error('Error al obtener los hijos asociados');
        }
  
        const data = await response.json();
        if (data.hijos && data.hijos.length > 0) {
            // Llenar la tabla con los datos de los hijos
            data.hijos.forEach(hijo => {
                const fila = document.createElement('tr');
  
                fila.innerHTML = `
                    <td class="text-center">${hijo.nombre}</td>
                    <td class="text-center">${hijo.apellido}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary btn-sm" onclick="verSituacion(${hijo.id})">Ver situación</button>
                    </td>
                `;
  
                tablaHijosBody.appendChild(fila);
            });
        } else {
            tablaHijosBody.innerHTML = '<tr><td colspan="3" class="text-center">No hay hijos asociados</td></tr>';
        }
    } catch (error) {
        console.error('Error:', error);
        tablaHijosBody.innerHTML = '<tr><td colspan="3" class="text-center">Error al cargar los hijos asociados</td></tr>';
    }
  }
  
  // Función para redirigir a la página de situación del hijo
  function verSituacion(idHijo) {
    // Redirigir a la página de situación del hijo con el ID como parámetro
    window.location.href = `situacionHijo.html?id=${idHijo}`;
  }