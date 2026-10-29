/* ============================================
   CONFIGURAÇÕES — EDITE AQUI
   ============================================ */
const WHATSAPP = '5511993265932'; // DDI + DDD + número (somente dígitos)
const NOME_LOJA = 'Doce Encanto';

// Seus produtos. Para usar foto real, troque "emoji" por "imagem: 'img/arquivo.jpg'"
const PRODUTOS = [
  { id: 1, nome: 'Bolo de Chocolate Belga', cat: 'bolos', preco: 89.9, emoji: '🍫', cor: '#f3d9cf', desc: 'Massa fofinha com recheio cremoso de brigadeiro belga. Serve 10 fatias.' },
  { id: 2, nome: 'Bolo Naked de Morango', cat: 'bolos', preco: 99.9, emoji: '🍓', cor: '#ffd9e0', desc: 'Camadas de pão de ló, chantilly e morangos frescos. Serve 10 fatias.' },
  { id: 3, nome: 'Bolo Red Velvet', cat: 'bolos', preco: 109.9, emoji: '🎂', cor: '#ffc9d3', desc: 'Clássico aveludado com cream cheese frosting. Serve 12 fatias.' },
  { id: 4, nome: 'Torta de Limão', cat: 'tortas', preco: 79.9, emoji: '🍋', cor: '#f6f2c4', desc: 'Base crocante, creme de limão e merengue maçaricado. Serve 8 fatias.' },
  { id: 5, nome: 'Torta de Chocolate com Avelã', cat: 'tortas', preco: 94.9, emoji: '🥧', cor: '#e8d3c4', desc: 'Ganache de chocolate meio amargo com crocante de avelã.' },
  { id: 6, nome: 'Cheesecake de Frutas Vermelhas', cat: 'tortas', preco: 89.9, emoji: '🍰', cor: '#ffd6dd', desc: 'Cremoso por dentro, com calda artesanal de frutas vermelhas.' },
  { id: 7, nome: 'Brigadeiros Gourmet (12 un.)', cat: 'doces', preco: 39.9, emoji: '🍬', cor: '#e9d5c9', desc: 'Sabores variados: tradicional, ninho, pistache e café.' },
  { id: 8, nome: 'Cento de Docinhos Finos', cat: 'doces', preco: 189.9, emoji: '🧁', cor: '#ffe3d1', desc: 'Ideal para festas: beijinho, brigadeiro, cajuzinho e mais.' },
  { id: 9, nome: 'Cookies Recheados (6 un.)', cat: 'doces', preco: 44.9, emoji: '🍪', cor: '#f5e1c0', desc: 'Crocantes por fora, macios por dentro, com recheio cremoso.' },
  { id: 10, nome: 'Caixa Presente Doce Encanto', cat: 'presentes', preco: 69.9, emoji: '🎁', cor: '#ffdde5', desc: 'Seleção de doces, mini bolo no pote e cartão personalizado.' },
  { id: 11, nome: 'Bolo no Pote (kit 4)', cat: 'presentes', preco: 49.9, emoji: '🫙', cor: '#f9e4cf', desc: 'Quatro sabores em potinhos, perfeitos para presentear.' },
  { id: 12, nome: 'Kit Festa Mini (20 doces + bolo)', cat: 'presentes', preco: 159.9, emoji: '🎉', cor: '#fdd9e8', desc: 'Para comemorações pequenas: bolo de 1 kg e 20 docinhos.' }
];

/* ============================================
   FUNÇÕES AUXILIARES
   ============================================ */
const $ = (sel) => document.querySelector(sel);
const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

let carrinho = [];
try { carrinho = JSON.parse(localStorage.getItem('carrinhoConfeitaria')) || []; } catch (e) { carrinho = []; }
const salvar = () => { try { localStorage.setItem('carrinhoConfeitaria', JSON.stringify(carrinho)); } catch (e) {} };

/* ============================================
   PRODUTOS + FILTROS
   ============================================ */
const listaEl = $('#listaProdutos');

function renderProdutos(cat = 'todos') {
  const lista = cat === 'todos' ? PRODUTOS : PRODUTOS.filter((p) => p.cat === cat);
  listaEl.innerHTML = lista.map((p) => `
    <article class="produto">
      <div class="produto__img" style="background:${p.cor}">
        ${p.imagem ? `<img src="${p.imagem}" alt="${p.nome}" style="width:100%;height:100%;object-fit:cover">` : p.emoji}
      </div>
      <div class="produto__corpo">
        <h3>${p.nome}</h3>
        <p>${p.desc}</p>
        <div class="produto__rodape">
          <span class="produto__preco">${brl(p.preco)}</span>
          <button class="btn btn--small" data-add="${p.id}">Adicionar</button>
        </div>
      </div>
    </article>
  `).join('');
}

$('#filtros').addEventListener('click', (e) => {
  const btn = e.target.closest('.filtro');
  if (!btn) return;
  document.querySelectorAll('.filtro').forEach((f) => f.classList.remove('ativo'));
  btn.classList.add('ativo');
  renderProdutos(btn.dataset.cat);
});

listaEl.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add]');
  if (btn) adicionar(Number(btn.dataset.add));
});

/* ============================================
   CARRINHO
   ============================================ */
function adicionar(id) {
  const item = carrinho.find((i) => i.id === id);
  if (item) item.qtd++;
  else carrinho.push({ id, qtd: 1 });
  atualizar();
  toast('Adicionado ao carrinho ✔');
}

function alterarQtd(id, delta) {
  const item = carrinho.find((i) => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter((i) => i.id !== id);
  atualizar();
}

function total() {
  return carrinho.reduce((soma, i) => {
    const p = PRODUTOS.find((x) => x.id === i.id);
    return soma + (p ? p.preco * i.qtd : 0);
  }, 0);
}

function atualizar() {
  // Remove itens de produtos que não existem mais
  carrinho = carrinho.filter((i) => PRODUTOS.some((p) => p.id === i.id));
  salvar();

  $('#contadorCarrinho').textContent = carrinho.reduce((s, i) => s + i.qtd, 0);
  $('#totalCarrinho').textContent = brl(total());

  const el = $('#itensCarrinho');
  if (!carrinho.length) {
    el.innerHTML = '<div class="carrinho__vazio">🧁<br>Seu carrinho está vazio.<br>Escolha algo gostoso no cardápio!</div>';
    return;
  }
  el.innerHTML = carrinho.map((i) => {
    const p = PRODUTOS.find((x) => x.id === i.id);
    return `
      <div class="item">
        <span class="item__emoji">${p.emoji}</span>
        <div class="item__info"><strong>${p.nome}</strong><small>${brl(p.preco * i.qtd)}</small></div>
        <div class="item__qtd">
          <button data-menos="${p.id}" aria-label="Diminuir">−</button>
          <span>${i.qtd}</span>
          <button data-mais="${p.id}" aria-label="Aumentar">+</button>
        </div>
      </div>`;
  }).join('');
}

$('#itensCarrinho').addEventListener('click', (e) => {
  const mais = e.target.closest('[data-mais]');
  const menos = e.target.closest('[data-menos]');
  if (mais) alterarQtd(Number(mais.dataset.mais), 1);
  if (menos) alterarQtd(Number(menos.dataset.menos), -1);
});

const abrir = () => { $('#carrinho').classList.add('ativo'); $('#overlay').classList.add('ativo'); };
const fechar = () => { $('#carrinho').classList.remove('ativo'); $('#overlay').classList.remove('ativo'); };
$('#abrirCarrinho').addEventListener('click', abrir);
$('#fecharCarrinho').addEventListener('click', fechar);
$('#overlay').addEventListener('click', fechar);
$('#limparCarrinho').addEventListener('click', () => { carrinho = []; atualizar(); });

/* ============================================
   ENVIO PARA WHATSAPP
   ============================================ */
$('#finalizarPedido').addEventListener('click', () => {
  if (!carrinho.length) { toast('Adicione itens ao carrinho primeiro'); return; }

  const nome = $('#nomeCliente').value.trim();
  const data = $('#dataEntrega').value.trim();
  const obs = $('#obsPedido').value.trim();

  let msg = `Olá, ${NOME_LOJA}! Gostaria de fazer um pedido:\n\n`;
  carrinho.forEach((i) => {
    const p = PRODUTOS.find((x) => x.id === i.id);
    msg += `• ${i.qtd}x ${p.nome} — ${brl(p.preco * i.qtd)}\n`;
  });
  msg += `\n*Total: ${brl(total())}*`;
  if (nome) msg += `\n\nNome: ${nome}`;
  if (data) msg += `\nData desejada: ${data}`;
  if (obs) msg += `\nObservações: ${obs}`;

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

// Botões gerais de WhatsApp (hero, CTA, flutuante)
document.querySelectorAll('.js-whats').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá, ${NOME_LOJA}! Gostaria de fazer uma encomenda.`)}`;
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ============================================
   MENU MOBILE, TOAST, ANO
   ============================================ */
$('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('aberto'));
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => $('#nav').classList.remove('aberto')));

let toastTimer;
function toast(texto) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = texto;
  t.classList.add('ativo');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('ativo'), 1800);
}

$('#ano').textContent = new Date().getFullYear();

/* ============================================
   INICIAR
   ============================================ */
renderProdutos();
atualizar();
