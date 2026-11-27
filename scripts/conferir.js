// CONFERIR: testa a sua API do mesmo jeito que o professor vai testar.
//
// Como usar:
//   1. Num terminal, deixe a API rodando: npm run dev
//   2. Em OUTRO terminal: npm run conferir
//
// NAO mude este arquivo: na correcao, o professor usa a copia dele.

require("dotenv").config({ quiet: true });

const GRUPOS = {
  1: "Sprint 1 — Tarefas",
  2: "Sprint 2 — Categorias e relacionamento",
  bonus: "Bonus — desafios",
};

// ----- Ajudantes -----

function criarCliente(base) {
  return async function pedir(metodo, caminho, corpo, corpoCru) {
    const opcoes = { method: metodo, headers: {} };
    if (corpo !== undefined) {
      opcoes.headers["Content-Type"] = "application/json";
      opcoes.body = corpoCru ? corpo : JSON.stringify(corpo);
    }
    const resposta = await fetch(base + caminho, {
      ...opcoes,
      signal: AbortSignal.timeout(5000),
    });
    const texto = await resposta.text();
    let json = null;
    try {
      json = JSON.parse(texto);
    } catch {
      // resposta sem JSON (ex.: 204)
    }
    return { status: resposta.status, json };
  };
}

function veio(r) {
  return "veio " + r.status;
}

// 404 de verdade: a rota existe e nao achou o registro.
// O 404 "Rota nao encontrada" quer dizer que a rota ainda nao foi criada.
function eh404(r) {
  return r.status === 404 && !(r.json && r.json.erro === "Rota nao encontrada");
}

function veio404(r) {
  if (r.status === 404)
    return "veio 404 de rota que nao existe: falta criar a rota";
  return veio(r);
}

function temErro(r) {
  return r.json !== null && typeof r.json.erro === "string";
}

// ----- Os testes -----

async function rodarTestes(base) {
  const pedir = criarCliente(base);
  const resultados = [];
  const ctx = {};

  async function teste(grupo, nome, fn) {
    let ok = false;
    let detalhe = "";
    try {
      const r = await fn();
      ok = r === true;
      if (!ok) detalhe = r || "falhou";
    } catch (erro) {
      detalhe = "erro: " + erro.message;
    }
    resultados.push({ grupo, nome, ok, detalhe });
  }

  async function apagarTarefa(r) {
    if (r && r.status === 201 && r.json && r.json.id)
      await pedir("DELETE", "/tarefas/" + r.json.id);
  }

  const tarefaBase = {
    titulo: "Tarefa de teste do conferir",
    prioridade: "alta",
    status: "fazendo",
  };

  // ===== SPRINT 1 =====

  await teste(1, "GET /tarefas responde 200 com uma lista", async () => {
    const r = await pedir("GET", "/tarefas");
    if (r.status !== 200) return "esperava 200, " + veio(r);
    if (!Array.isArray(r.json)) return "a resposta nao e uma lista [ ]";
    return true;
  });

  await teste(
    1,
    "POST /tarefas cadastra e responde 201 com a tarefa",
    async () => {
      const r = await pedir("POST", "/tarefas", tarefaBase);
      if (r.status !== 201) return "esperava 201, " + veio(r);
      const t = r.json || {};
      if (typeof t.id !== "number")
        return "a resposta nao tem o id da tarefa nova";
      ctx.id = t.id;
      if (t.titulo !== tarefaBase.titulo) return "titulo diferente do enviado";
      if (t.prioridade !== "alta") return "prioridade diferente da enviada";
      if (t.status !== "fazendo") return "status diferente do enviado";
      return true;
    },
  );

  await teste(1, "GET /tarefas/:id responde 200 com a tarefa", async () => {
    if (!ctx.id) return "nao deu para testar: o POST falhou";
    const r = await pedir("GET", "/tarefas/" + ctx.id);
    if (r.status !== 200) return "esperava 200, " + veio(r);
    if (!r.json || r.json.id !== ctx.id) return "veio outra tarefa";
    return true;
  });

  await teste(1, "GET /tarefas/99999 responde 404", async () => {
    const r = await pedir("GET", "/tarefas/99999");
    if (!eh404(r)) return "esperava 404, " + veio404(r);
    return true;
  });

  await teste(1, "GET /tarefas/abc responde 400", async () => {
    const r = await pedir("GET", "/tarefas/abc");
    if (r.status !== 400) return "esperava 400, " + veio(r);
    return true;
  });

  await teste(1, "PUT /tarefas/:id substitui a tarefa (200)", async () => {
    if (!ctx.id) return "nao deu para testar: o POST falhou";
    const r = await pedir("PUT", "/tarefas/" + ctx.id, {
      titulo: "Tarefa alterada pelo PUT",
      prioridade: "baixa",
      status: "a_fazer",
    });
    if (r.status !== 200) return "esperava 200, " + veio(r);
    const t = r.json || {};
    if (
      t.titulo !== "Tarefa alterada pelo PUT" ||
      t.prioridade !== "baixa" ||
      t.status !== "a_fazer"
    )
      return "a tarefa nao ficou com os dados novos";
    return true;
  });

  await teste(1, "PUT /tarefas/99999 responde 404", async () => {
    const r = await pedir("PUT", "/tarefas/99999", {
      titulo: "Nao existe",
      prioridade: "baixa",
      status: "a_fazer",
    });
    if (!eh404(r)) return "esperava 404, " + veio404(r);
    return true;
  });

  await teste(1, "PATCH /tarefas/:id muda so o status (200)", async () => {
    if (!ctx.id) return "nao deu para testar: o POST falhou";
    const r = await pedir("PATCH", "/tarefas/" + ctx.id, { status: "feita" });
    if (r.status !== 200) return "esperava 200, " + veio(r);
    if (!r.json || r.json.status !== "feita") return "o status nao mudou";
    if (r.json.titulo !== "Tarefa alterada pelo PUT")
      return "o PATCH mudou o titulo";
    return true;
  });

  await teste(1, "PATCH /tarefas/99999 responde 404", async () => {
    const r = await pedir("PATCH", "/tarefas/99999", { status: "feita" });
    if (!eh404(r)) return "esperava 404, " + veio404(r);
    return true;
  });

  await teste(1, "POST sem titulo responde 400 com { erro }", async () => {
    const r = await pedir("POST", "/tarefas", {
      prioridade: "alta",
      status: "a_fazer",
    });
    await apagarTarefa(r);
    if (r.status !== 400) return "esperava 400, " + veio(r);
    if (!temErro(r)) return 'a resposta nao tem { "erro": "..." }';
    return true;
  });

  await teste(1, 'POST com prioridade "urgente" responde 400', async () => {
    const r = await pedir("POST", "/tarefas", {
      ...tarefaBase,
      prioridade: "urgente",
    });
    await apagarTarefa(r);
    if (r.status !== 400) return "esperava 400, " + veio(r);
    return true;
  });

  await teste(1, 'POST com status "concluida" responde 400', async () => {
    const r = await pedir("POST", "/tarefas", {
      ...tarefaBase,
      status: "concluida",
    });
    await apagarTarefa(r);
    if (r.status !== 400) return "esperava 400, " + veio(r);
    return true;
  });

  await teste(
    1,
    "DELETE /tarefas/:id responde 204 e a tarefa some",
    async () => {
      if (!ctx.id) return "nao deu para testar: o POST falhou";
      const r = await pedir("DELETE", "/tarefas/" + ctx.id);
      if (r.status !== 204) return "esperava 204, " + veio(r);
      const r2 = await pedir("GET", "/tarefas/" + ctx.id);
      if (!eh404(r2))
        return "depois do DELETE, o GET deveria dar 404, " + veio404(r2);
      return true;
    },
  );

  await teste(
    1,
    "DELETE de uma tarefa que nao existe responde 404",
    async () => {
      const r = await pedir("DELETE", "/tarefas/99999");
      if (!eh404(r)) return "esperava 404, " + veio404(r);
      return true;
    },
  );

  // ===== SPRINT 2 =====

  await teste(2, "GET /categorias responde 200 com uma lista", async () => {
    const r = await pedir("GET", "/categorias");
    if (r.status !== 200) return "esperava 200, " + veio(r);
    if (!Array.isArray(r.json)) return "a resposta nao e uma lista [ ]";
    return true;
  });

  await teste(
    2,
    "POST /categorias cadastra e responde 201 com o id",
    async () => {
      const r = await pedir("POST", "/categorias", {
        nome: "Categoria do conferir",
      });
      if (r.status !== 201) return "esperava 201, " + veio(r);
      if (!r.json || typeof r.json.id !== "number")
        return "a resposta nao tem o id da categoria nova";
      ctx.catId = r.json.id;
      return true;
    },
  );

  await teste(
    2,
    "GET /categorias/:id responde 200, e /99999 responde 404",
    async () => {
      if (!ctx.catId) return "nao deu para testar: o POST de categoria falhou";
      const r = await pedir("GET", "/categorias/" + ctx.catId);
      if (r.status !== 200) return "esperava 200, " + veio(r);
      const r2 = await pedir("GET", "/categorias/99999");
      if (!eh404(r2)) return "/categorias/99999: esperava 404, " + veio404(r2);
      return true;
    },
  );

  await teste(2, "POST /categorias sem nome responde 400", async () => {
    const r = await pedir("POST", "/categorias", {});
    if (r.status === 201 && r.json && r.json.id)
      await pedir("DELETE", "/categorias/" + r.json.id);
    if (r.status !== 400) return "esperava 400, " + veio(r);
    return true;
  });

  await teste(
    2,
    "POST /tarefas com categoria_id traz o nome da categoria (JOIN)",
    async () => {
      if (!ctx.catId) return "nao deu para testar: o POST de categoria falhou";
      const r = await pedir("POST", "/tarefas", {
        ...tarefaBase,
        categoria_id: ctx.catId,
      });
      if (r.status !== 201) return "esperava 201, " + veio(r);
      ctx.idCat = r.json && r.json.id;
      if (!r.json || r.json.categoria !== "Categoria do conferir")
        return 'a tarefa nao veio com "categoria": "Categoria do conferir"';
      return true;
    },
  );

  await teste(
    2,
    "GET /tarefas e GET /tarefas/:id trazem o nome da categoria",
    async () => {
      if (!ctx.idCat) return "nao deu para testar: o POST com categoria falhou";
      const r = await pedir("GET", "/tarefas/" + ctx.idCat);
      if (r.status !== 200) return "GET /tarefas/:id: esperava 200, " + veio(r);
      if (r.json.categoria !== "Categoria do conferir")
        return "GET /tarefas/:id veio sem o nome da categoria";
      const r2 = await pedir("GET", "/tarefas");
      const t =
        Array.isArray(r2.json) && r2.json.find((x) => x.id === ctx.idCat);
      if (!t) return "a tarefa com categoria nao esta na lista";
      if (t.categoria !== "Categoria do conferir")
        return "GET /tarefas veio sem o nome da categoria";
      return true;
    },
  );

  await teste(
    2,
    "POST /tarefas com categoria que nao existe responde 400",
    async () => {
      const r = await pedir("POST", "/tarefas", {
        ...tarefaBase,
        categoria_id: 99999,
      });
      await apagarTarefa(r);
      if (r.status !== 400) return "esperava 400, " + veio(r);
      return true;
    },
  );

  await teste(
    2,
    "DELETE de categoria: 409 se tem tarefas, 204 se esta vazia",
    async () => {
      if (!ctx.idCat) return "nao deu para testar: o POST com categoria falhou";
      const r = await pedir("DELETE", "/categorias/" + ctx.catId);
      await pedir("DELETE", "/tarefas/" + ctx.idCat);
      if (r.status === 204) return "com tarefas: esperava 409, veio 204";
      const r2 = await pedir("DELETE", "/categorias/" + ctx.catId);
      if (r.status !== 409) return "com tarefas: esperava 409, " + veio404(r);
      if (r2.status !== 204) return "sem tarefas: esperava 204, " + veio404(r2);
      return true;
    },
  );

  // Se algo deu errado no meio, nao deixa lixo no banco
  if (ctx.idCat) await pedir("DELETE", "/tarefas/" + ctx.idCat);
  if (ctx.catId) await pedir("DELETE", "/categorias/" + ctx.catId);

  // ===== BONUS =====

  const tarefaFiltro = await pedir("POST", "/tarefas", tarefaBase);

  await teste("bonus", "Filtro: GET /tarefas?status=fazendo", async () => {
    const r = await pedir("GET", "/tarefas?status=fazendo");
    if (r.status !== 200 || !Array.isArray(r.json))
      return "esperava 200 com uma lista, " + veio(r);
    if (r.json.length === 0) return "a lista veio vazia";
    if (!r.json.every((t) => t.status === "fazendo"))
      return "veio tarefa com outro status";
    return true;
  });

  await teste("bonus", "Filtro: GET /tarefas?prioridade=alta", async () => {
    const r = await pedir("GET", "/tarefas?prioridade=alta");
    if (r.status !== 200 || !Array.isArray(r.json))
      return "esperava 200 com uma lista, " + veio(r);
    if (r.json.length === 0) return "a lista veio vazia";
    if (!r.json.every((t) => t.prioridade === "alta"))
      return "veio tarefa com outra prioridade";
    return true;
  });

  await apagarTarefa(tarefaFiltro);

  const cat = await pedir("POST", "/categorias", {
    nome: "Categoria do bonus",
  });
  const catBonus = cat.status === 201 && cat.json ? cat.json.id : null;

  await teste("bonus", "PUT /categorias/:id troca o nome (200)", async () => {
    if (!catBonus) return "nao deu para testar: o POST de categoria falhou";
    const r = await pedir("PUT", "/categorias/" + catBonus, {
      nome: "Nome do PUT",
    });
    if (r.status !== 200) return "esperava 200, " + veio404(r);
    if (!r.json || r.json.nome !== "Nome do PUT") return "o nome nao mudou";
    return true;
  });

  await teste("bonus", "PATCH /categorias/:id troca o nome (200)", async () => {
    if (!catBonus) return "nao deu para testar: o POST de categoria falhou";
    const r = await pedir("PATCH", "/categorias/" + catBonus, {
      nome: "Nome do PATCH",
    });
    if (r.status !== 200) return "esperava 200, " + veio404(r);
    if (!r.json || r.json.nome !== "Nome do PATCH") return "o nome nao mudou";
    return true;
  });

  if (catBonus) await pedir("DELETE", "/categorias/" + catBonus);

  await teste("bonus", "JSON mal escrito responde 400", async () => {
    const r = await pedir("POST", "/tarefas", '{ "titulo": "X", }', true);
    await apagarTarefa(r);
    if (r.status !== 400) return "esperava 400, " + veio(r);
    return true;
  });

  return resultados;
}

// ----- Mostrar o placar -----

function mostrar(resultados) {
  for (const grupo of Object.keys(GRUPOS)) {
    const lista = resultados.filter((r) => String(r.grupo) === grupo);
    console.log("\n" + GRUPOS[grupo]);
    for (const r of lista) {
      if (r.ok) console.log("  ✅ " + r.nome);
      else console.log("  ❌ " + r.nome + "  →  " + r.detalhe);
    }
  }
  console.log("\n================ PLACAR ================");
  for (const grupo of Object.keys(GRUPOS)) {
    const lista = resultados.filter((r) => String(r.grupo) === grupo);
    const passou = lista.filter((r) => r.ok).length;
    console.log(`  ${GRUPOS[grupo]}: ${passou} de ${lista.length}`);
  }
  console.log("========================================\n");
}

async function principal() {
  const base = "http://localhost:" + (process.env.PORT || 3000);
  try {
    await fetch(base + "/", { signal: AbortSignal.timeout(3000) });
  } catch {
    console.log("\n❌ A API nao respondeu em " + base);
    console.log(
      "   Deixe a API rodando (npm run dev) num terminal e rode o conferir em OUTRO terminal.\n",
    );
    process.exit(1);
  }
  mostrar(await rodarTestes(base));
}

if (require.main === module) principal();

module.exports = { rodarTestes };
