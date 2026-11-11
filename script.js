/* ============ DADOS DE MENTIRA (na Fase 2 virão do banco) ============ */
const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const receitasMes = [4200, 4350, 4100, 5200, 4800, 5600, 4900, 5100, 5300, 4700, 5800, 6200];
const despesasMes = [3100, 3400, 3250, 3900, 3600, 4100, 3700, 3500, 3950, 3300, 4200, 4600];

const despesasCategoria = {
  "Moradia": 1500, "Alimentacao": 900, "Transporte": 450,
  "Saude": 300, "Educacao": 380, "Lazer": 420, "Assinaturas": 150
};

const lancamentos = [
  { descricao: "Salário",           categoria: "Salario",     data: "05/11/2026", valor:  4200 },
  { descricao: "Aluguel",           categoria: "Moradia",     data: "06/11/2026", valor: -1500 },
  { descricao: "Projeto freelancer",categoria: "Freelancer",  data: "07/11/2026", valor:  1600 },
  { descricao: "Supermercado",      categoria: "Alimentacao", data: "07/11/2026", valor:  -380 },
  { descricao: "Streaming",         categoria: "Assinaturas", data: "08/11/2026", valor:   -45 }
];

/* ============ FUNÇÕES ============ */
const moeda = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const soma = lista => lista.reduce((total, n) => total + n, 0);

// Cards: usamos o último mês da lista
const receitaAtual = receitasMes[10], despesaAtual = despesasMes[10];
document.getElementById("totalReceitas").textContent = moeda(receitaAtual);
document.getElementById("totalDespesas").textContent = moeda(despesaAtual);
document.getElementById("saldo").textContent = moeda(receitaAtual - despesaAtual);

// Lista de lançamentos
document.getElementById("lista").innerHTML = lancamentos.map(l => `
  <div class="item">
    <div>${l.descricao}<span>${l.categoria} · ${l.data}</span></div>
    <div class="${l.valor > 0 ? "entrada" : "saida"}">${l.valor > 0 ? "+" : "−"} ${moeda(Math.abs(l.valor))}</div>
  </div>`).join("");

/* ============ GRÁFICOS (Chart.js) ============ */
Chart.defaults.color = "#C9CDE0";
Chart.defaults.font.family = "Sora, system-ui, sans-serif";
const grade = { color: "rgba(183,161,255,.12)" };

const linha = new Chart(document.getElementById("graficoLinha"), {
  type: "line",
  data: { labels: [], datasets: [
    { label: "Receitas", data: [], borderColor: "#C7FF5E", backgroundColor: "rgba(199,255,94,.25)", fill: true, tension: .4 },
    { label: "Despesas", data: [], borderColor: "#C9B8FF", backgroundColor: "rgba(183,161,255,.28)", fill: true, tension: .4 }
  ]},
  options: { maintainAspectRatio: false, scales: { x: { grid: grade }, y: { grid: grade } } }
});

new Chart(document.getElementById("graficoRosca"), {
  type: "doughnut",
  data: {
    labels: Object.keys(despesasCategoria),
    datasets: [{
      data: Object.values(despesasCategoria), borderWidth: 0,
      backgroundColor: ["#9B7BFF","#C7FF5E","#6F4DFF","#A8F03C","#D6C9FF","#E8FF9E","#5B3FE0"]
    }]
  },
  options: { maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } } }
});

// Mostra só os últimos N meses no gráfico de linha
function mostrarPeriodo(n) {
  linha.data.labels = meses.slice(12 - n);
  linha.data.datasets[0].data = receitasMes.slice(12 - n);
  linha.data.datasets[1].data = despesasMes.slice(12 - n);
  linha.update();
}
mostrarPeriodo(6);

document.getElementById("periodos").addEventListener("click", e => {
  const botao = e.target.closest("button");
  if (!botao) return;
  document.querySelectorAll("#periodos button").forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
  mostrarPeriodo(Number(botao.dataset.meses));
});

/* ============ MENU DESLIZANTE ============ */
const menu = document.getElementById("menu");
const conteudo = document.getElementById("conteudo");
document.getElementById("btnMenu").addEventListener("click", () => {
  if (window.innerWidth <= 900) {
    menu.classList.toggle("aberto-mobile");
  } else {
    menu.classList.toggle("fechado");
    conteudo.classList.toggle("expandido");
  }
});
