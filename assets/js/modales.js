document.addEventListener('DOMContentLoaded', () => {
    // Asociación de botones con sus ventanas modales
    const modales = {
        altaCurso: {
            buttonId: 'btnAltaCurso', // ID del botón que dispara la modal
            modalId: 'altaCursoModal', // ID de la ventana modal
        },
        altaAlumno: {
            buttonId: 'btnAltaAlumno',
            modalId: 'altaAlumnoModal',
        },
        altaEmpleado: {
            buttonId: 'btnAltaEmpleado',
            modalId: 'altaEmpleadoModal',
        },
    };

    // Función para inicializar los eventos de las modales
    const inicializarModales = () => {
        Object.values(modales).forEach(({ buttonId, modalId }) => {
            const button = document.getElementById(buttonId);
            const modalElement = document.getElementById(modalId);

            if (button && modalElement) {
                button.addEventListener('click', () => {
                    // Activar la modal utilizando Bootstrap
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                });
            } else {
                console.error(`No se encontraron elementos con IDs: ${buttonId} o ${modalId}`);
            }
        });
    };

    inicializarModales();
});