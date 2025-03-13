document.addEventListener("DOMContentLoaded", function () {
    fetch(" ") // URL del backend con el curso correspondiente
        .then(response => response.json())
        .then(data => {
            const tablaAlumnos = document.getElementById("tablaAlumnos");
            tablaAlumnos.innerHTML = ""; // Limpiar la tabla antes de insertar datos

            data.alumnos.forEach((alumno, index) => {
                let fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${alumno.apellido}</td>
                    <td>${alumno.nombre}</td>
                    <td><input type="radio" name="asistencia${index}" value="Presente"></td>
                    <td><input type="radio" name="asistencia${index}" value="Ausente"></td>
                    <td><input type="radio" name="asistencia${index}" value="Tardanza"></td>
                `;
                tablaAlumnos.appendChild(fila);
            });
        })
        .catch(error => console.error("Error al cargar los alumnos:", error));
});