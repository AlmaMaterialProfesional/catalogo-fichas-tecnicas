const contenedor = document.getElementById("secciones");

function el(tag, clase, texto) {
  const nodo = document.createElement(tag);
  if (clase) nodo.className = clase;
  if (texto) nodo.textContent = texto;
  return nodo;
}

function enlaceFicha(producto) {
  const params = new URLSearchParams({ f: producto.pdf, t: producto.title });
  return "ficha/?" + params.toString();
}

function renderProducto(producto) {
  const a = el("a", "producto");
  a.href = enlaceFicha(producto);

  const foto = el("span", "producto-foto");
  if (producto.image) {
    const img = el("img");
    img.src = producto.image;
    img.alt = "";
    img.loading = "lazy";
    foto.appendChild(img);
  }

  const textos = el("span", "producto-textos");
  textos.appendChild(el("span", "producto-nombre", producto.title));
  if (producto.subtitle) textos.appendChild(el("span", "producto-sub", producto.subtitle));

  const accion = el("span", "producto-accion", "Ver ficha");

  a.append(foto, textos, accion);
  return a;
}

function renderSeccion(seccion, indice) {
  const productos = Array.isArray(seccion.products) ? seccion.products : [];
  const details = el("details", "seccion");
  details.id = "s" + (indice + 1);

  const summary = el("summary", "seccion-cabecera");
  summary.appendChild(el("span", "seccion-num", String(indice + 1)));
  const titulos = el("span", "seccion-titulos");
  titulos.appendChild(el("span", "seccion-titulo", seccion.title));
  titulos.appendChild(el("span", "seccion-cuenta",
    productos.length ? productos.length + (productos.length === 1 ? " producto" : " productos") : "Próximamente"));
  summary.appendChild(titulos);
  summary.appendChild(el("span", "seccion-flecha"));
  details.appendChild(summary);

  const lista = el("div", "seccion-lista");
  if (productos.length) {
    productos.forEach((p) => lista.appendChild(renderProducto(p)));
  } else {
    lista.appendChild(el("p", "seccion-vacia", "Estamos preparando las fichas técnicas de esta sección. Muy pronto estarán disponibles."));
  }
  details.appendChild(lista);

  details.addEventListener("toggle", () => {
    if (!details.open) {
      if (location.hash === "#" + details.id) history.replaceState(null, "", location.pathname);
      return;
    }
    document.querySelectorAll("details.seccion[open]").forEach((otro) => {
      if (otro !== details) otro.open = false;
    });
    history.replaceState(null, "", "#" + details.id);
    const arriba = summary.getBoundingClientRect().top;
    if (arriba < 0 || arriba > window.innerHeight * 0.6) {
      summary.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  return details;
}

async function init() {
  let secciones = [];
  try {
    const respuesta = await fetch("content/products.json", { cache: "no-cache" });
    const datos = await respuesta.json();
    secciones = Array.isArray(datos.sections) ? datos.sections : [];
  } catch (e) {
    contenedor.innerHTML = "";
    contenedor.appendChild(el("p", "aviso", "No se han podido cargar las fichas técnicas. Inténtalo de nuevo en unos minutos."));
    return;
  }

  contenedor.innerHTML = "";
  secciones.forEach((s, i) => contenedor.appendChild(renderSeccion(s, i)));

  const abierta = location.hash && document.querySelector("details.seccion" + location.hash);
  if (abierta) abierta.open = true;
}

init();
