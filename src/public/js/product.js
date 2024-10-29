const socket=io()
const productList=document.getElementById("productList")

function eliminarProducto(id) {
    socket.emit("eliminarProducto", id);
}


addProductForm.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const productName = document.getElementById("productName").value.trim();
    const productPrice = document.getElementById("productPrice").value.trim();

    if (productName && productPrice) {
        socket.emit("agregarProducto", { name: productName, price: parseFloat(productPrice) });

        addProductForm.reset();
        document.getElementById("productName").focus();
    }
});

socket.on("productoAgregado", (producto) => {
    const li = document.createElement("li");
    li.setAttribute("id", producto.id);
    li.innerHTML = `
        <div class="item-info">
            <span>${producto.id}</span>
            <span>${producto.name}</span>
            <span>$${producto.price}</span>
        </div>
        <button class="delete-button" data-id="${producto.id}">Eliminar</button>
    `;

    li.querySelector(".delete-button").addEventListener("click", () => {
        const productId = producto.id;
        socket.emit("eliminarProducto", productId); 
    });

    productList.appendChild(li);
});

socket.on("productoEliminado", (id) => {
    const itemToRemove = document.getElementById(id);
    if (itemToRemove) {
        itemToRemove.remove();
    }
});