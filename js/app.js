$(document).ready(function () {
    const haSidoVisitado = localStorage.getItem("bienvenidaMostrada");

    if (!haSidoVisitado) {
        alert("¡Bienvenido a Toho Cinemas! Para todos aquellos que aman las películas.");
        // Guardamos la marca para que no aparezca de nuevo
        localStorage.setItem("bienvenidaMostrada", "true");
    }
    
    // Tarea 5: Mostrar spinner y ocultar contenedor
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
                    // Lógica Tarea 4: Precios y Badge
                    const fechaE = new Date(peli.estreno);
                    const esEstreno = (hoy - fechaE) / (1000 * 60 * 60 * 24) <= 30;
                    const badge = esEstreno ? '<span class="badge bg-danger">ESTRENO</span>' : '<span class="badge bg-secondary">REGULAR</span>';
                    const precio = esEstreno ? peli.precios.estreno : peli.precios.normal;

                    html += `
                    <div class="col-md-4 mb-4">
                      <div class="card h-100 shadow">
                        <img src="${peli.imagen}" class="card-img-top" alt="${peli.titulo}">
                        <div class="card-body">
                          <h5 class="card-title">${peli.titulo} ${badge}</h5>
                          <p class="card-text"><strong>Géneros:</strong> ${peli.generos.join(", ")}</p>
                          <p class="card-text text-primary fw-bold">Precio: $${precio.toFixed(2)}</p>
                          <a href="pages/detalle.html?id=${peli.id}" class="btn btn-primary w-100">Ver más</a>
                        </div>
                      </div>
                    </div>`;
                });

                $("#loading-spinner").hide();
                $("#lista-peliculas").html(html).fadeIn(1000); // Tarea 10
            },
            error: function (xhr, status, error) {
                console.error("Error técnico:", error);
                $("#loading-spinner").hide(); 
                $("#lista-peliculas").html(`
                    <div class="col-12 text-center my-5">
                        <div class="alert alert-warning d-inline-block" role="alert">
                            <h4 class="alert-heading">¡Ups! Algo salió mal</h4>
                            <p>No pudimos conectar con la base de datos de CinePlus.</p>
                            <hr>
                            <p class="mb-0">Por favor, intenta recargar la página (F5).</p>
                        </div>
                    </div>
                `).show();
            }
        });
    }, 5000);
});