/* ==========================================================
   LISTA DE FOTOGRAFIAS
   Para adicionar uma foto: copia o ficheiro para a pasta images/
   e acrescenta uma linha aqui.
   - proporcao: opcional, só serve para reservar espaço enquanto
     a imagem carrega (ex.: "3 / 2" paisagem, "4 / 5" retrato).
   ========================================================== */
   const fotografias = [
    { ficheiro: "images/foto-01.jpg", titulo: "Título da foto 1", categoria: "Paisagem", alt: "Descreve a foto 1", proporcao: "3 / 2" },
    { ficheiro: "images/foto-02.jpg", titulo: "Título da foto 2", categoria: "Rua",      alt: "Descreve a foto 2", proporcao: "4 / 5" },
    { ficheiro: "images/foto-03.jpg", titulo: "Título da foto 3", categoria: "Retrato",  alt: "Descreve a foto 3", proporcao: "4 / 5" },
    { ficheiro: "images/foto-04.jpg", titulo: "Título da foto 4", categoria: "Paisagem", alt: "Descreve a foto 4", proporcao: "16 / 9" },
    { ficheiro: "images/foto-05.jpg", titulo: "Título da foto 5", categoria: "Rua",      alt: "Descreve a foto 5", proporcao: "3 / 2" },
    { ficheiro: "images/foto-06.jpg", titulo: "Título da foto 6", categoria: "Retrato",  alt: "Descreve a foto 6", proporcao: "3 / 4" },
    { ficheiro: "images/foto-07.jpg", titulo: "Título da foto 7", categoria: "Paisagem", alt: "Descreve a foto 7", proporcao: "1 / 1" },
    { ficheiro: "images/foto-08.jpg", titulo: "Título da foto 8", categoria: "Rua",      alt: "Descreve a foto 8", proporcao: "4 / 5" },
    { ficheiro: "images/foto-09.jpg", titulo: "Título da foto 9", categoria: "Retrato",  alt: "Descreve a foto 9", proporcao: "3 / 2" }
  ];
  
  /* ---------- Comum às duas páginas ---------- */
  const anoEl = document.getElementById("ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();
  
  /* Marca como "sem imagem" qualquer foto cujo ficheiro não exista */
  function ligarEstadoDaImagem(img) {
    const caixa = img.closest(".foto");
    if (!caixa) return;
    const ok = () => {
      caixa.classList.remove("sem-imagem");
      caixa.classList.add("carregada");
    };
    const erro = () => caixa.classList.add("sem-imagem");
    img.addEventListener("load", ok);
    img.addEventListener("error", erro);
    // Só verifica se a imagem já tem endereço (sem src, "complete" é sempre verdadeiro)
    if (img.getAttribute("src") && img.complete) (img.naturalWidth ? ok : erro)();
  }
  
  document.querySelectorAll(".destaque img").forEach(ligarEstadoDaImagem);
  
  /* ---------- Galeria ---------- */
  const galeria = document.getElementById("galeria");
  
  if (galeria) {
    const filtros = document.getElementById("filtros");
    const lightbox = document.getElementById("lightbox");
    const lbImagem = document.getElementById("lb-imagem");
    const lbLegenda = document.getElementById("lb-legenda");
  
    let visiveis = fotografias;   // lista atual, depois de filtrar
    let atual = 0;                // índice da foto aberta no lightbox
  
    function desenharGaleria() {
      galeria.innerHTML = "";
  
      visiveis.forEach((foto, indice) => {
        const item = document.createElement("div");
        item.className = "item";
  
        const botao = document.createElement("button");
        botao.type = "button";
        botao.setAttribute("aria-label", "Ampliar: " + foto.titulo);
        botao.addEventListener("click", () => abrir(indice));
  
        const caixa = document.createElement("figure");
        caixa.className = "foto";
        caixa.dataset.titulo = foto.titulo;
        if (foto.proporcao) caixa.style.setProperty("--proporcao", foto.proporcao);
  
        const img = document.createElement("img");
        img.alt = foto.alt;
        img.loading = "lazy";
  
        caixa.appendChild(img);
        botao.appendChild(caixa);
        item.appendChild(botao);
        galeria.appendChild(item);
  
        ligarEstadoDaImagem(img);   // ligar os eventos antes de definir o src
        img.src = foto.ficheiro;
      });
    }
  
    function criarFiltros() {
      const categorias = ["Todas", ...new Set(fotografias.map(f => f.categoria))];
  
      categorias.forEach((nome, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = nome;
        b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        b.addEventListener("click", () => {
          filtros.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
          b.setAttribute("aria-pressed", "true");
          visiveis = nome === "Todas" ? fotografias : fotografias.filter(f => f.categoria === nome);
          desenharGaleria();
        });
        filtros.appendChild(b);
      });
    }
  
    /* ---------- Lightbox ---------- */
    function mostrar(indice) {
      atual = (indice + visiveis.length) % visiveis.length;
      const foto = visiveis[atual];
      lbImagem.src = foto.ficheiro;
      lbImagem.alt = foto.alt;
      lbLegenda.textContent = foto.titulo + " — " + foto.categoria;
    }
  
    function abrir(indice) {
      mostrar(indice);
      lightbox.showModal();
    }
  
    function fechar() { lightbox.close(); }
  
    lightbox.querySelector(".lb-fechar").addEventListener("click", fechar);
    lightbox.querySelector(".lb-anterior").addEventListener("click", () => mostrar(atual - 1));
    lightbox.querySelector(".lb-seguinte").addEventListener("click", () => mostrar(atual + 1));
  
    // Clicar fora da imagem fecha
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) fechar();
    });
  
    // Setas do teclado (Esc já fecha por defeito no <dialog>)
    document.addEventListener("keydown", (e) => {
      if (!lightbox.open) return;
      if (e.key === "ArrowLeft") mostrar(atual - 1);
      if (e.key === "ArrowRight") mostrar(atual + 1);
    });
  
    criarFiltros();
    desenharGaleria();
  }