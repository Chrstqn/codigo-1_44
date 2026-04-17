$(document).ready(function () {
    // 1. Capturar ID de la URL
    const params = new URLSearchParams(window.location.search);
    const idActual = params.get('id');

    if (idActual) {
        cargarInformacionPelicula(idActual);
        cargarResenas(idActual);
    } else {
        window.location.href = "../index.html";
    }
});

// Función para cargar los detalles principales
function cargarInformacionPelicula(id) {
    $.getJSON("../data/peliculas.json", function (peliculas) {
        const peli = peliculas.find(p => p.id == id);

        if (peli) {
            $("#peli-titulo").text(peli.titulo);
            $("#peli-poster").attr("src", "../" + peli.imagen);
            $("#peli-sinopsis").text(peli.sinopsis);
            
            // Lógica de precio (Estreno vs Normal)
            const hoy = new Date();
            const fechaE = new Date(peli.estreno);
            const esEstreno = (hoy - fechaE) / (1000 * 60 * 60 * 24) <= 30;
            const precio = esEstreno ? peli.precios.estreno : peli.precios.normal;
            
            $("#peli-precio").text(`Precio: $${precio.toFixed(2)}`);
            $("#peli-info-meta").html(`<strong>Géneros:</strong> ${peli.generos.join(", ")} | <strong>Estreno:</strong> ${peli.estreno}`);
        }
    });
}

// Función para las reseñas (Punto 7)
function cargarResenas(id) {
    $.ajax({
        url: "../data/resenas.json",
        method: "GET",
        dataType: "json",
        success: function (resenas) {
            const filtradas = resenas.filter(r => r.peliId == id);
            let html = "";

            if (filtradas.length > 0) {
                filtradas.forEach(r => {
                    let estrellas = '<span class="text-warning">' + "★".repeat(r.estrellas) + "</span>" + 
                                    '<span class="text-muted">' + "☆".repeat(5 - r.estrellas) + "</span>";
                    
                    html += `
                        <div class="col-md-6 mb-3">
                            <div class="card h-100 border-0 shadow-sm bg-white">
                                <div class="card-body">
                                    <div class="mb-2">${estrellas}</div>
                                    <h6 class="fw-bold mb-1">${r.usuario}</h6>
                                    <p class="small text-muted mb-0 italic">"${r.comentario}"</p>
                                </div>
                            </div>
                        </div>`;
                });
            } else {
                // Caso: Película sin reseñas (Punto 8 del plan)
                html = `
                    <div class="col-12 text-center py-5 bg-white rounded shadow-sm">
                        <p class="text-muted mb-0">Aún no hay reseñas para esta película.</p>
                        <p class="fw-bold text-primary">¡Sé el primero en compartir tu opinión!</p>
                    </div>`;
            }
            $("#contenedor-resenas").html(html);
        }
    });
}