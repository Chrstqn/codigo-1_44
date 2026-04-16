$(document).ready(function() {
    let peliculasCache = [];

    $.getJSON("../data/peliculas.json", function(data) {
        peliculasCache = data;
        data.forEach(p => {
            $("#peliculas-seleccion").append(`<option value="${p.id}">${p.titulo}</option>`);
        });
    });

    $("#form-renta").on("submit", function(e) {
        e.preventDefault();

        const cliente = $("#cliente").val();
        const dias = parseInt($("#dias").val());
        const seleccionadas = $("#peliculas-seleccion").val();
        
        let total = 0;
        let listaHtml = "<ul>";

        seleccionadas.forEach(id => {
            const peli = peliculasCache.find(p => p.id == id);
            
            // Calculador del precio real (estreno o normal)
            const hoy = new Date();
            const fechaE = new Date(peli.estreno);
            const esEstreno = (hoy - fechaE) / (1000 * 60 * 60 * 24) <= 30;
            const precioUnitario = esEstreno ? peli.precios.estreno : peli.precios.normal;
            
            total += precioUnitario;
            listaHtml += `<li>${peli.titulo} ($${precioUnitario.toFixed(2)})</li>`;
        });

        listaHtml += "</ul>";
        const totalFinal = total * dias;

        $("#modal-body-renta").html(`
            <p><strong>Cliente:</strong> ${cliente}</p>
            <p><strong>Películas:</strong></p>
            ${listaHtml}
            <p><strong>Días de renta:</strong> ${dias}</p>
            <hr>
            <h4 class="text-success text-end">Total a pagar: $${totalFinal.toFixed(2)}</h4>
        `);

        const myModal = new bootstrap.Modal(document.getElementById('modalRenta'));
        myModal.show();
    });
});

function confirmarYLimpiar() {
    alert("¡Reserva confirmada! Gracias por elegir Toho Cinemas.");
    
    $("#form-renta")[0].reset();
    
    const modalElement = document.getElementById('modalRenta');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    
    setTimeout(() => {
        window.location.href = "../index.html";
    }, 3000);
}