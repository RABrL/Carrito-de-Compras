const listaCursos = document.querySelector('#lista-cursos')
const contenedorCarrito = document.querySelector('#lista-carrito tbody')
const carrito = document.querySelector('#carrito')
const vaciarCarrito = document.querySelector('#vaciar-carrito')
let articulosCarrito

//Muestra los cursos del local Storage
document.addEventListener('DOMContentLoaded',()=>{
    articulosCarrito = JSON.parse(localStorage.getItem('articulos')) || [] 

    crearHTML()
})

listaCursos.addEventListener('click',agregarCurso)
carrito.addEventListener('click', eliminarCurso)
vaciarCarrito.addEventListener('click', () =>{
    articulosCarrito = [] //Reseteamos el arreglo
    sincronizarStorage()
    limpiarHTML()// Limpiamos el HTML
})

//Funciones
function agregarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement
        extraerInfoCurso(cursoSeleccionado)
    }
}

//Lee el contenido del HTML al que se le dio click y extrae la info
function extraerInfoCurso(info){
    const infoCurso = {
        imagen: info.querySelector('img').src,
        nombre: info.querySelector('h4').textContent,
        precio: info.querySelector('.precio span').textContent,
        id: info.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
    agregarCursoAlCarrito(infoCurso)
}

//Agregamos el objeto con la info del curso al array de articulosCarrito
function agregarCursoAlCarrito(curso){

    //Verificar si existe un elemento en el array de articulosCarrito con el mismo id del curso seleccionado
    const existe = articulosCarrito.some( x => x.id === curso.id)
    
    //Agregamos el curso seleccionado al array o aumentamos la cantidad si ya existe
    if(existe){
        articulosCarrito.forEach(x =>{
            if(x.id === curso.id){
                x.cantidad++
            }
        })
    }else {
        articulosCarrito.push(curso)
    }

    crearHTML()
}

//Creamos el HTML en el contenedor del carrito con el contenido del array de articulosCarrito
function crearHTML(){

    //Limpiar HTML
    limpiarHTML()

    //Recorrer el array de articulosCarrito y generar HTML
    articulosCarrito.forEach(x => {
        const { imagen,nombre,precio,cantidad,id } = x
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>
                <img src='${imagen}' width='100'>
            </td>
            <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td><a href='#' class='borrar-curso' data-id='${id}'>X</td>`

        //Agrega el html del carrito en el tbody
        contenedorCarrito.appendChild(row)
    });

    sincronizarStorage();
}

//Elimina los cursos del tbody
function limpiarHTML(){
    /* //Forma lenta
    contenedorCarrito.innerHTML = '' */

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.lastChild)
    }
}

//Agregamos el array del carrito al storage
function sincronizarStorage(){
    localStorage.setItem('articulos',JSON.stringify(articulosCarrito))
}

//Elimina un curso del carrito
function eliminarCurso(e){
    e.preventDefault()

    //Seleccionando el boton y eliminado ese curso del carrito
    if(e.target.classList.contains('borrar-curso')){
        const idCurso = e.target.getAttribute('data-id')

        //Elimina el curso del arreglo articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( x => x.id !== idCurso)

        crearHTML()//Volvemos a crear el HTML con el articulo eliminado
    }
}