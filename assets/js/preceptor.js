document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos del preceptor
    cargarDatosPreceptor();
    
    // Cargar automáticamente los cursos al inicio
    cargarCursosPreceptor();
    
    // Configurar eventos
    document.getElementById('btnSalir').addEventListener('click', function () {
        close();
    });
    
    document.getElementById('btnBuscar').addEventListener('click', buscarAlumnoPorDNI);
    
    // También permitir búsqueda al presionar Enter en el campo de entrada
    document.getElementById('buscarAlumno').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarAlumnoPorDNI();
        }
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
  document.getElementById('btnBuscar').addEventListener('click', buscarAlumnoPorDNI);

async function buscarAlumnoPorDNI() {
    const dniInput = document.getElementById('buscarAlumno').value.trim();
    const resultadoContainer = document.getElementById('resultadoAlumno');
    const tablaResultado = document.getElementById('tablaResultadoAlumno');
    
    if (!dniInput) {
        alert('Por favor, ingrese un DNI');
        return;
    }
    
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No autorizado. Inicie sesión.');
            return;
        }
        
        const response = await fetch(`http://127.0.0.1:5000/alumnos/buscar/${dniInput}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al buscar alumno');
        }
        
        const data = await response.json();
        
        // Limpiar tabla de resultados
        tablaResultado.innerHTML = '';
        
        if (data.alumno) {
            const alumno = data.alumno;
            const fila = `
                <tr>
                    <td class="text-center">${alumno.nombre}</td>
                    <td class="text-center">${alumno.apellido}</td>
                    <td class="text-center">${alumno.dni}</td>
                    <td class="text-center">${alumno.curso || 'No asignado'}</td>
                </tr>
            `;
            tablaResultado.innerHTML = fila;
            resultadoContainer.style.display = 'block';
        } else {
            tablaResultado.innerHTML = '<tr><td colspan="4" class="text-center">No se encontró alumno con ese DNI</td></tr>';
            resultadoContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar alumno. Intente nuevamente.');
    }
}

async function cargarDatosPreceptor() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No autorizado. Inicie sesión.');
            return;
        }
        
        const response = await fetch('http://127.0.0.1:5000/preceptor/perfil', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener datos del preceptor');
        }
        
        const data = await response.json();
        if (data.nombre) {
            document.getElementById('nombreUsuario').textContent = data.nombre;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}