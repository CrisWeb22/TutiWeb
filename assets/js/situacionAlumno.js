document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);

    const dni = params.get("dni");

    // Mostrar el DNI desde la URL (para ir cargando algo)
    document.getElementById("dniAlumno").textContent = dni;
    document.getElementById("nombreAlumno").textContent = "[Cargando...]";
    document.getElementById("nombreTutor").textContent = "[Cargando tutor...]";

    try {
        const response = await fetch(`http://127.0.0.1:5000/alumnos/info/${dni}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            const nombre = data.nombrealu || data.nombre;
            const apellido = data.apealu || data.apellido;
            //const tutor = data.tutor || data.nombreTutor || "No informado";

            document.getElementById("nombreAlumno").textContent = `${nombre} ${apellido}`;
           // document.getElementById("nombreTutor").textContent = tutor;
        } else {
            document.getElementById("nombreAlumno").textContent = "[Error al cargar datos]";
            console.warn("⚠️ Error al obtener información del alumno:", data.error || data.message);
        }
    } catch (error) {
        console.error("❌ Error de red al obtener la información del alumno:", error);
        document.getElementById("nombreAlumno").textContent = "[Error de conexión]";
    }
});
