document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ID del hijo desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const idHijo = urlParams.get('id');
  
    if (idHijo) {
      // Cargar los datos del tutor, el hijo y la asistencia
      cargarDatosTutor();
      cargarDatosHijo(idHijo);
      cargarAsistenciaHijo(idHijo);
    } else {
      console.error('No se proporcionó un ID de hijo en la URL.');
      alert('Error: No se proporcionó un ID de hijo.');
    }
  
    // Manejador para el botón "Volver"
    document.getElementById('btnVolver').addEventListener('click', function () {
      window.history.back(); // Regresar a la página anterior
    });
  
    // Manejador para el botón "Salir"
    document.getElementById('btnSalir').addEventListener('click', function () {
      close(); // Cerrar la ventana o finalizar la sesión
    });
  });
  
  // Función para cargar los datos del tutor
  async function cargarDatosTutor() {
    try {
      const token = localStorage.getItem('token'); // Obtener el token almacenado
      if (!token) {
        alert('No autorizado. Inicie sesión.');
        return;
      }
  
      // Realizar la solicitud para obtener los datos del tutor
      const response = await fetch('http://127.0.0.1:5000/tutor/datos', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos del tutor');
      }
  
      const data = await response.json();
      if (data.tutor) {
        // Mostrar el nombre del tutor en el h4
        document.getElementById('nombreTutor').textContent = data.tutor.nombre;
      } else {
        console.error('No se encontraron datos del tutor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al cargar los datos del tutor.');
    }
  }
  
  // Función para cargar los datos del hijo
  async function cargarDatosHijo(idHijo) {
    try {
      const token = localStorage.getItem('token'); // Obtener el token almacenado
      if (!token) {
        alert('No autorizado. Inicie sesión.');
        return;
      }
  
      // Realizar la solicitud para obtener los datos del hijo
      const response = await fetch(`http://127.0.0.1:5000/hijos/${idHijo}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener los datos del hijo');
      }
  
      const data = await response.json();
      if (data.hijo) {
        // Mostrar el nombre y DNI del hijo
        document.getElementById('nombreHijo').textContent = data.hijo.nombre;
        document.getElementById('dniHijo').textContent = data.hijo.dni;
      } else {
        console.error('No se encontraron datos del hijo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al cargar los datos del hijo.');
    }
  }
  
  // Función para cargar la asistencia del hijo
  async function cargarAsistenciaHijo(idHijo) {
    const tablaAsistenciaBody = document.querySelector('#tablaAsistencia tbody');
    tablaAsistenciaBody.innerHTML = ''; // Limpiar la tabla antes de cargar
  
    try {
      const token = localStorage.getItem('token'); // Obtener el token almacenado
      if (!token) {
        alert('No autorizado. Inicie sesión.');
        return;
      }
  
      // Realizar la solicitud para obtener la asistencia del hijo
      const response = await fetch(`http://127.0.0.1:5000/hijos/${idHijo}/asistencia`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener la asistencia del hijo');
      }
  
      const data = await response.json();
      if (data.asistencia && data.asistencia.length > 0) {
        // Llenar la tabla con los datos de asistencia
        data.asistencia.forEach(asistencia => {
          const fila = document.createElement('tr');
  
          fila.innerHTML = `
            <td class="text-center">${asistencia.dia}</td>
            <td class="text-center">${asistencia.fecha}</td>
            <td class="text-center">${asistencia.estado}</td>
          `;
  
          tablaAsistenciaBody.appendChild(fila);
        });
      } else {
        tablaAsistenciaBody.innerHTML = '<tr><td colspan="3" class="text-center">No hay registros de asistencia</td></tr>';
      }
    } catch (error) {
      console.error('Error:', error);
      tablaAsistenciaBody.innerHTML = '<tr><td colspan="3" class="text-center">Error al cargar la asistencia</td></tr>';
    }
  }