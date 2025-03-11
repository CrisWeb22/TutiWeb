document.addEventListener('DOMContentLoaded', function () {
    // Cargar automáticamente los cursos al inicio
    cargarCursosPreceptor();
    
    document.getElementById('btnSalir').addEventListener('click', function () {
        close();
    });
  });
  
  async function cargarCursosPreceptor() {
      const tablaCursosBody = document.querySelector('#tablaCursos tbody');
      tablaCursosBody.innerHTML = ''; // Limpiar la tabla antes de cargar
  
      try {
          const token = localStorage.getItem('token'); // Obtener el token almacenado
          if (!token) {
              alert('No autorizado. Inicie sesión.');
              return;
          }
  
          const response = await fetch('http://127.0.0.1:5000/cursos/preceptor/', {
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
  
  
  
  // Función para buscar ALUMNO 
