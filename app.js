
var productos = [];

articulosCarrito = [];

const vaciarCarrito = document.querySelector('#vaciar-carrito');
const contenedorCarrito = document.querySelector('#lista-carrito');

let resultado = document.getElementById('resultado');


let input = document.getElementById('input');
const carritoContainer = document.getElementById("carrito-container");

$("#img-carrito").mouseover(() =>{
    carritoContainer.style.display = "block";
});

$("#carrito-container").mouseleave(() =>{
    carritoContainer.style.display = "none";
});

$('#btn').click(mostrar)


$('document').ready(() => {
    $.ajax({
        method: "GET",
        url: "./productos.json"
    }).done(rsp => {
        productos = rsp;
        crearTarjetasHTML(productos)
        articulosCarrito = JSON.parse( localStorage.getItem('carrito') ) || []
        carritoHTML()
    })
});

vaciarCarrito.addEventListener('click', () => {
    articulosCarrito = []; 
    carritoHTML(); 
})

$('#comprar-carrito').click(comprar)
$('.btn-close').click( () => $('#alert-compra').removeClass('show'))


function mostrar(){
    $('#titulo').attr('style',  'display:none');
    if(input.value == 'masculino'){
        $('#titulo').text('Zapatillas Para Hombres')
        crearTarjetasHTML(productos.filter(producto => producto.genero === 'masculino'))
    }else if ( input.value == 'femenino'){
        
        $('#titulo').text('Zapatillas Para Mujeres') 
        crearTarjetasHTML(productos.filter(producto => producto.genero === 'femenino'))
    }else{
        $('#titulo').text('Zapatillas')
        crearTarjetasHTML(productos)
    }
    evento();
    darEstilo();
    
};

function evento(){
    $('#titulo').slideDown()  
}

function comprar(){
    if(articulosCarrito.length != 0){
        $('#alert-compra').addClass('show')
        articulosCarrito = []; 
        carritoHTML(); 
    }
    
}

function agregarCarrito(id)
{
    const selected = productos.find(producto => producto.id === id);
    const inCart = articulosCarrito.find(producto => producto.id === selected.id);

    if(inCart == null){
        selected.cantidad = 1;
        selected.total = selected.precio;
        articulosCarrito.push(selected);
    }else{
        inCart.cantidad++;
        inCart.total = selected.precio*inCart.cantidad;
    }

    carritoHTML();

}

function crearTarjetasHTML(zapatillas){
    resultado.innerHTML = "";

    for(const producto of zapatillas){
        resultado.innerHTML += `
                                <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12" style="margin:20px 0">
                                    <div class="card product-card" >
                                                <img src=${producto.img} class="card-img-top product-image">
                                        <div class="card-body">
                                                <h5 class="card-title">${producto.nombre}</h5>
                                                <p class="card-text">Marca: ${producto.marca} <br> Precio: $${producto.precio}</p>
                                                <button class="btn btn-primary add-to-cart agregar-carrito" onclick="agregarCarrito(${producto.id})">Añadir Carrito</button>
                                        </div>
                                    </div>
                                </div>    
                                `
    }
};





function darEstilo(){
    if(input.value == 'masculino'){
        $('body').attr('style', 'background-color: #5240E8; color: whitesmoke')
    }else if(input.value == 'femenino'){
        $('body').attr('style', 'background-color: #F5EAF3')
    }else{
        $('body').attr('style', 'background-color: #fff')
    }
}




function carritoHTML(){
        //limpiar HTML
        limpiarHTML();
    
    
        //recorre el carrito y crea HTML
        articulosCarrito.forEach(zapatilla => {
            const { img, nombre, precio, cantidad, id } = zapatilla;

            const row = document.createElement('div')
            row.classList.add("cart-item");
            row.innerHTML = `
                <img src="${img}" width="100" />
                <span> ${nombre} </span>
                <span> ${precio} </span>
                <span> ${cantidad} </span>
                <span><div class="close-btn" onclick="eliminarProducto(${id})" >&times;</div></span>
            ` ;
    
            //agrega el HTML del carrito al tbody
            contenedorCarrito.appendChild(row);
        });

        //agregar el carrito al storage
        sincronizarStorage();

}
    
function eliminarProducto(id){
    articulosCarrito = articulosCarrito.filter(producto => producto.id != id);
    carritoHTML();  
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito))
}

function limpiarHTML(){
    while (contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}
