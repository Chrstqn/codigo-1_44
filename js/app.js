$(document).ready(function () {
    const haSidoVisitado = localStorage.getItem("bienvenidaMostrada");

    if (!haSidoVisitado) {
        alert("¡Bienvenido a Toho Cinemas! Para todos aquellos que aman las películas.");
        localStorage.setItem("bienvenidaMostrada", "true");
    }
    
    $("#loading-spinner p").css("font-family", "'Bebas Neue', sans-serif").css("font-size", "1.5rem");
    $("#loading-spinner").show();
    $("#lista-peliculas").hide();

    setTimeout(function() {
        $.ajax({
            url: "data/peliculas.json",
            method: "GET",
            dataType: "json",
            success: function (peliculas) {
                let html = "";
                const hoy = new Date();

                peliculas.forEach(function (peli) {
                    const fechaE = new Date(peli.estreno);
                    const esEstreno = (hoy - fechaE) / (1000 * 60 * 60 * 24) <= 30;
                    const badge = esEstreno ? '<span class="badge bg-danger">ESTRENO</span>' : '<span class="badge bg-secondary">REGULAR</span>';
                    const precio = esEstreno ? peli.precios.estreno : peli.precios.normal;

                    html += `
                    <div class="col-md-3 mb-4"> <div class="card h-100 shadow border-0">
                        <img src="${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
                        <div class="card-body text-center">
                          <h6 class="card-title fw-bold">${peli.titulo} ${badge}</h6>
                          <p class="card-text small text-muted">${peli.generos.join(", ")}</p>
                          <p class="card-text text-success fw-bold">Precio: $${precio.toFixed(2)}</p>
                          
                          <button class="btn btn-outline-danger btn-sm mb-2 w-100 btn-trailer" 
                                  data-trailer="${peli.trailer}" 
                                  data-titulo="${peli.titulo}">
                            Ver Tráiler
                          </button>

                          <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary btn-sm w-100">Más detalles</a>
                        </div>
                      </div>
                    </div>`;
                });

                $("#loading-spinner").hide();
                $("#lista-peliculas").html(html).fadeIn(1000);
            },
            error: function (xhr, status, error) {
                console.error("Error técnico:", error);
                $("#loading-spinner").hide(); 
                $("#lista-peliculas").html(`
                    <div class="col-12 text-center my-5">
                        <div class="alert alert-warning d-inline-block" role="alert">
                            <h4 class="alert-heading">¡Ups! Algo salió mal</h4>
                            <p>No pudimos conectar con la base de datos de Toho Cinemas.</p>
                        </div>
                    </div>
                `).show();
            }
        });
    }, 5000);

    $(document).on("click", ".btn-trailer", function () {
        const url = $(this).data("trailer");
        const titulo = $(this).data("titulo");

        $("#tituloTrailer").text("Tráiler: " + titulo);
        $("#iframeTrailer").attr("src", url);

        const modalTrailer = new bootstrap.Modal(document.getElementById('modalTrailer'));
        modalTrailer.show();
    });

    $('#modalTrailer').on('hidden.bs.modal', function () {
        $("#iframeTrailer").attr("src", "");
    });
});