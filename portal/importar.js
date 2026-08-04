(function () {
  "use strict";

  // -----------------------------------------------------------
  // Normalização e mapeamento de colunas / valores
  // -----------------------------------------------------------
  function normalizar(s) {
    return String(s === null || s === undefined ? "" : s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  var ALIAS_COLUNAS = {
    "nome do cliente": "nomeCliente",
    "cliente": "nomeCliente",
    "cpf cnpj": "documento",
    "cpf": "documento",
    "cnpj": "documento",
    "nome do partido": "nomePartido",
    "partido": "nomePartido",
    "nivel": "nivel",
    "uf": "uf",
    "municipio": "municipio",
    "cliente superior": "clienteSuperior",
    "processo n": "numeroProcesso",
    "processo": "numeroProcesso",
    "no do processo": "numeroProcesso",
    "n do processo": "numeroProcesso",
    "numero do processo": "numeroProcesso",
    "categoria": "categoria",
    "subcategoria": "subcategoria",
    "titulo": "titulo",
    "ano": "ano",
    "orgao julgador": "orgaoJulgador",
    "status": "status",
    "resultado": "resultado",
    "data da decisao": "dataDecisao",
    "tipo de obrigacao": "tipoObrigacao",
    "descricao": "descricaoObrigacao",
    "descricao texto livre": "descricaoObrigacao",
    "valor": "valor",
    "exercicio de cumprimento": "exercicioCumprimento",
  };

  var NIVEL_MAP = { nacional: "nacional", estadual: "estadual", municipal: "municipal" };

  var CATEGORIA_MAP = {
    "prestacao de contas": "prestacao_contas",
    "prestacao contas": "prestacao_contas",
    pc: "prestacao_contas",
    aije: "aije",
    representacao: "representacao",
    "registro de candidatura": "registro_candidatura",
    rcand: "registro_candidatura",
    drap: "drap",
    outro: "outro",
  };

  var STATUS_MAP = {
    "em andamento": "em_andamento",
    "aguardando diligencia": "aguardando_diligencia",
    concluido: "concluido",
  };

  var RESULTADO_CONTAS_MAP = {
    aprovadas: "aprovadas",
    "aprovadas com ressalvas": "aprovadas_com_ressalvas",
    desaprovadas: "desaprovadas",
    "nao prestadas": "nao_prestadas",
  };

  var TIPO_OBRIGACAO_MAP = {
    "recolhimento a uniao": "recolhimento_uniao",
    "recolhimento uniao": "recolhimento_uniao",
    "aplicacao em politica da mulher": "aplicacao_politica_mulher",
    "politica da mulher": "aplicacao_politica_mulher",
    "aplicacao em acoes afirmativas": "aplicacao_minorias",
    "acoes afirmativas": "aplicacao_minorias",
    minorias: "aplicacao_minorias",
    multa: "multa",
    outra: "outra",
  };

  function mapear(valorBruto, mapa, fallback) {
    if (!valorBruto) return fallback;
    var chave = normalizar(valorBruto);
    return mapa[chave] !== undefined ? mapa[chave] : fallback;
  }

  function parseValor(v) {
    if (v === null || v === undefined || v === "") return null;
    if (typeof v === "number") return v;
    var s = String(v).trim().replace(/R\$/gi, "").replace(/\s/g, "");
    if (!s) return null;
    if (/,\d{1,2}$/.test(s)) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }

  function parseInteiro(v) {
    if (v === null || v === undefined || v === "") return null;
    var n = parseInt(String(v).trim(), 10);
    return isNaN(n) ? null : n;
  }

  function parseData(v) {
    if (!v) return null;
    if (v instanceof Date && !isNaN(v)) {
      var y = v.getFullYear();
      var m = String(v.getMonth() + 1).padStart(2, "0");
      var d = String(v.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + d;
    }
    var s = String(v).trim();
    var br = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (br) return br[3] + "-" + br[2].padStart(2, "0") + "-" + br[1].padStart(2, "0");
    var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (iso) return iso[0].slice(0, 10);
    return null;
  }

  function texto(v) {
    if (v === null || v === undefined) return null;
    var s = String(v).trim();
    return s === "" ? null : s;
  }

  // -----------------------------------------------------------
  // Leitura do arquivo
  // -----------------------------------------------------------
  function lerArquivo(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var wb = XLSX.read(e.target.result, { type: "array", cellDates: true });
          var sheet = wb.Sheets[wb.SheetNames[0]];
          var linhasBrutas = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null, raw: true });
          resolve(linhasBrutas);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = function () { reject(new Error("Não foi possível ler o arquivo.")); };
      reader.readAsArrayBuffer(file);
    });
  }

  function construirLinhas(linhasBrutas) {
    if (!linhasBrutas.length) return [];
    var cabecalho = linhasBrutas[0];
    var indicePorCampo = {};
    cabecalho.forEach(function (col, i) {
      var campo = ALIAS_COLUNAS[normalizar(col)];
      if (campo) indicePorCampo[campo] = i;
    });

    function pega(linha, campo) {
      var i = indicePorCampo[campo];
      return i === undefined ? null : linha[i];
    }

    var linhas = [];
    for (var r = 1; r < linhasBrutas.length; r++) {
      var linha = linhasBrutas[r];
      if (!linha || linha.every(function (c) { return c === null || c === ""; })) continue;

      linhas.push({
        numeroLinha: r + 1,
        nomeCliente: texto(pega(linha, "nomeCliente")),
        documento: texto(pega(linha, "documento")),
        nomePartido: texto(pega(linha, "nomePartido")),
        nivel: texto(pega(linha, "nivel")),
        uf: texto(pega(linha, "uf")),
        municipio: texto(pega(linha, "municipio")),
        clienteSuperior: texto(pega(linha, "clienteSuperior")),
        numeroProcesso: texto(pega(linha, "numeroProcesso")),
        categoria: texto(pega(linha, "categoria")),
        subcategoria: texto(pega(linha, "subcategoria")),
        titulo: texto(pega(linha, "titulo")),
        ano: parseInteiro(pega(linha, "ano")),
        orgaoJulgador: texto(pega(linha, "orgaoJulgador")),
        status: texto(pega(linha, "status")),
        resultado: texto(pega(linha, "resultado")),
        dataDecisao: parseData(pega(linha, "dataDecisao")),
        tipoObrigacao: texto(pega(linha, "tipoObrigacao")),
        descricaoObrigacao: texto(pega(linha, "descricaoObrigacao")),
        valor: parseValor(pega(linha, "valor")),
        exercicioCumprimento: parseInteiro(pega(linha, "exercicioCumprimento")),
      });
    }
    return linhas;
  }

  // -----------------------------------------------------------
  // Preview
  // -----------------------------------------------------------
  var linhasParaImportar = [];

  function renderPreview(linhas) {
    document.querySelector("[data-preview-resumo]").textContent =
      linhas.length + " linha(s) reconhecida(s). Mostrando as primeiras 15 abaixo.";

    var tbody = document.querySelector("[data-preview-linhas]");
    tbody.innerHTML = linhas.slice(0, 15).map(function (l) {
      return "<tr>" +
        "<td>" + (l.nomeCliente || "—") + "</td>" +
        "<td>" + (l.nomePartido || "—") + "</td>" +
        "<td>" + (l.categoria || "—") + "</td>" +
        "<td>" + (l.ano || "—") + "</td>" +
        "<td>" + (l.tipoObrigacao || "—") + "</td>" +
      "</tr>";
    }).join("");

    document.querySelector("[data-secao-preview]").hidden = false;
    document.querySelector("[data-secao-resultado]").hidden = true;
  }

  // -----------------------------------------------------------
  // Importação
  // -----------------------------------------------------------
  async function resolverPartido(nome, caches, avisos, numeroLinha) {
    if (!nome) return null;
    var chave = normalizar(nome);
    if (caches.partidos.has(chave)) return caches.partidos.get(chave);

    var existente = await bfSupabase.from("partidos").select("id").ilike("nome", nome).limit(1).maybeSingle();
    if (existente.data) {
      caches.partidos.set(chave, existente.data.id);
      return existente.data.id;
    }

    var criado = await bfSupabase.from("partidos").insert({ nome: nome }).select("id").single();
    if (criado.error) {
      avisos.push("Linha " + numeroLinha + ": erro ao criar partido '" + nome + "' — " + criado.error.message);
      return null;
    }
    caches.partidos.set(chave, criado.data.id);
    caches.partidosCriados++;
    return criado.data.id;
  }

  async function resolverCliente(l, partidoId, caches, avisos) {
    var chaveBusca = l.documento ? "doc:" + normalizar(l.documento) : "nome:" + normalizar(l.nomeCliente);
    if (caches.clientes.has(chaveBusca)) return caches.clientes.get(chaveBusca);

    var query = bfSupabase.from("clientes").select("id").limit(1);
    query = l.documento ? query.eq("documento", l.documento) : query.ilike("nome", l.nomeCliente);
    var existente = await query.maybeSingle();
    if (existente.data) {
      caches.clientes.set(chaveBusca, existente.data.id);
      return existente.data.id;
    }

    var parentId = null;
    if (l.clienteSuperior) {
      var chavePai = "nome:" + normalizar(l.clienteSuperior);
      if (caches.clientes.has(chavePai)) {
        parentId = caches.clientes.get(chavePai);
      } else {
        var pai = await bfSupabase.from("clientes").select("id").ilike("nome", l.clienteSuperior).maybeSingle();
        if (pai.data) {
          parentId = pai.data.id;
          caches.clientes.set(chavePai, pai.data.id);
        } else {
          avisos.push("Linha " + l.numeroLinha + ": cliente superior '" + l.clienteSuperior + "' não encontrado (ainda) — criado sem hierarquia.");
        }
      }
    }

    var nivel = mapear(l.nivel, NIVEL_MAP, null);
    if (l.nivel && !nivel) avisos.push("Linha " + l.numeroLinha + ": nível '" + l.nivel + "' não reconhecido, deixado em branco.");

    var payload = {
      nome: l.nomeCliente,
      documento: l.documento,
      partido_id: partidoId,
      nivel: nivel,
      uf: l.uf,
      municipio: l.municipio,
      parent_id: parentId,
      eh_candidato: false,
    };
    var criado = await bfSupabase.from("clientes").insert(payload).select("id").single();
    if (criado.error) {
      avisos.push("Linha " + l.numeroLinha + ": erro ao criar cliente '" + l.nomeCliente + "' — " + criado.error.message);
      return null;
    }
    caches.clientes.set(chaveBusca, criado.data.id);
    caches.clientes.set("nome:" + normalizar(l.nomeCliente), criado.data.id);
    caches.clientesCriados++;
    return criado.data.id;
  }

  // Só retorna a mensagem: a chamadora decide se a linha inteira é rejeitada
  // ou só o campo. Listas fechadas — nada de texto livre nestes 4 campos.
  var OPCOES_CATEGORIA = "Prestação de Contas, AIJE, Representação, Registro de Candidatura, DRAP, Outro";
  var OPCOES_STATUS = "Em andamento, Aguardando diligência, Concluído";
  var OPCOES_RESULTADO_CONTAS = "Aprovadas, Aprovadas com ressalvas, Desaprovadas, Não prestadas";
  var OPCOES_TIPO_OBRIGACAO = "Recolhimento à União, Aplicação em política da mulher, Aplicação em ações afirmativas / minorias, Multa, Outra";

  async function resolverProcesso(l, clienteId, categoria, status, resultado, caches, avisos) {
    var chave = clienteId + "|" + (l.numeroProcesso ? normalizar(l.numeroProcesso) : (normalizar(categoria) + "|" + (l.ano || "")));
    if (caches.processos.has(chave)) return caches.processos.get(chave);

    var query = bfSupabase.from("processos").select("id").eq("cliente_id", clienteId).limit(1);
    query = l.numeroProcesso ? query.eq("numero_processo", l.numeroProcesso) : query.eq("categoria", categoria).eq("ano", l.ano);
    var existente = await query.maybeSingle();
    if (existente.data) {
      caches.processos.set(chave, existente.data.id);
      return existente.data.id;
    }

    var payload = {
      cliente_id: clienteId,
      categoria: categoria,
      subcategoria: l.subcategoria,
      titulo: l.titulo,
      ano: l.ano,
      numero_processo: l.numeroProcesso,
      orgao_julgador: l.orgaoJulgador,
      status: status,
      resultado: resultado,
      data_decisao: l.dataDecisao,
    };
    var criado = await bfSupabase.from("processos").insert(payload).select("id").single();
    if (criado.error) {
      avisos.push("Linha " + l.numeroLinha + ": erro ao criar processo — " + criado.error.message);
      return null;
    }
    caches.processos.set(chave, criado.data.id);
    caches.processosCriados++;
    return criado.data.id;
  }

  async function resolverObrigacao(l, processoId, tipo, avisos, caches) {
    var payload = {
      processo_id: processoId,
      tipo: tipo,
      descricao: l.descricaoObrigacao || l.tipoObrigacao,
      valor: l.valor,
      exercicio_cumprimento: l.exercicioCumprimento,
      status: "pendente",
    };
    var { error } = await bfSupabase.from("obrigacoes").insert(payload);
    if (error) {
      avisos.push("Linha " + l.numeroLinha + ": erro ao criar obrigação — " + error.message);
      return;
    }
    caches.obrigacoesCriadas++;
  }

  async function importarTudo(linhas) {
    var caches = {
      partidos: new Map(),
      clientes: new Map(),
      processos: new Map(),
      partidosCriados: 0,
      clientesCriados: 0,
      processosCriados: 0,
      obrigacoesCriadas: 0,
    };
    var avisos = [];

    for (var i = 0; i < linhas.length; i++) {
      var l = linhas[i];
      if (!l.nomeCliente) {
        avisos.push("Linha " + l.numeroLinha + ": sem Nome do Cliente, linha ignorada.");
        continue;
      }
      if (!l.categoria) {
        avisos.push("Linha " + l.numeroLinha + ": sem Categoria, linha ignorada.");
        continue;
      }

      // --- Categoria (obrigatória, lista fechada) ---
      var categoria = mapear(l.categoria, CATEGORIA_MAP, null);
      if (!categoria) {
        avisos.push("Linha " + l.numeroLinha + ": categoria '" + l.categoria + "' inválida — linha não importada. Valores aceitos: " + OPCOES_CATEGORIA + ".");
        continue;
      }

      // --- Status (opcional, lista fechada) ---
      var status = "em_andamento";
      if (l.status) {
        var statusMapeado = mapear(l.status, STATUS_MAP, null);
        if (!statusMapeado) {
          avisos.push("Linha " + l.numeroLinha + ": status '" + l.status + "' inválido — linha não importada. Valores aceitos: " + OPCOES_STATUS + ".");
          continue;
        }
        status = statusMapeado;
      }

      // --- Resultado (lista fechada só quando categoria = Prestação de Contas) ---
      var resultado = null;
      if (categoria === "prestacao_contas") {
        if (l.resultado) {
          var resultadoMapeado = mapear(l.resultado, RESULTADO_CONTAS_MAP, null);
          if (!resultadoMapeado) {
            avisos.push("Linha " + l.numeroLinha + ": resultado '" + l.resultado + "' inválido para Prestação de Contas — linha não importada. Valores aceitos: " + OPCOES_RESULTADO_CONTAS + ".");
            continue;
          }
          resultado = resultadoMapeado;
        }
      } else {
        resultado = l.resultado; // sem lista fechada do sistema para as outras categorias
      }

      var partidoId = await resolverPartido(l.nomePartido, caches, avisos, l.numeroLinha);
      var clienteId = await resolverCliente(l, partidoId, caches, avisos);
      if (!clienteId) continue;

      var processoId = await resolverProcesso(l, clienteId, categoria, status, resultado, caches, avisos);
      if (!processoId) continue;

      // --- Tipo de Obrigação (opcional, lista fechada) ---
      if (l.tipoObrigacao) {
        var tipoObrigacao = mapear(l.tipoObrigacao, TIPO_OBRIGACAO_MAP, null);
        if (!tipoObrigacao) {
          avisos.push("Linha " + l.numeroLinha + ": tipo de obrigação '" + l.tipoObrigacao + "' inválido — obrigação não importada (processo foi importado normalmente). Valores aceitos: " + OPCOES_TIPO_OBRIGACAO + ".");
        } else {
          await resolverObrigacao(l, processoId, tipoObrigacao, avisos, caches);
        }
      }
    }

    return {
      partidosCriados: caches.partidosCriados,
      clientesCriados: caches.clientesCriados,
      processosCriados: caches.processosCriados,
      obrigacoesCriadas: caches.obrigacoesCriadas,
      avisos: avisos,
    };
  }

  function renderResultado(resultado) {
    document.querySelector("[data-resultado-resumo]").innerHTML =
      '<div class="portal-stat"><span class="num">' + resultado.clientesCriados + '</span><span class="label">Clientes criados</span></div>' +
      '<div class="portal-stat"><span class="num">' + resultado.processosCriados + '</span><span class="label">Processos criados</span></div>' +
      '<div class="portal-stat"><span class="num">' + resultado.obrigacoesCriadas + '</span><span class="label">Obrigações criadas</span></div>' +
      '<div class="portal-stat"><span class="num">' + resultado.partidosCriados + '</span><span class="label">Partidos criados</span></div>';

    var elAvisos = document.querySelector("[data-resultado-avisos]");
    elAvisos.innerHTML = resultado.avisos.length
      ? "<h3 style=\"font-family:var(--font-display); font-size:.9rem; text-transform:uppercase; letter-spacing:.06em; color:var(--slate); margin-bottom:.8rem;\">Avisos (" + resultado.avisos.length + ")</h3>" +
        resultado.avisos.map(function (a) { return '<div class="portal-inline-msg is-error" style="margin-bottom:.4rem;">' + a + "</div>"; }).join("")
      : '<p class="portal-inline-msg">Nenhum aviso — tudo importado sem problemas.</p>';

    document.querySelector("[data-secao-resultado]").hidden = false;
  }

  // -----------------------------------------------------------
  // Wiring
  // -----------------------------------------------------------
  function setMsg(key, text, isError) {
    var el = document.querySelector('[data-msg="' + key + '"]');
    el.textContent = text;
    el.classList.toggle("is-error", !!isError);
  }

  function baixarModelo() {
    var cabecalho = [
      "Nome do Cliente", "CPF/CNPJ", "Nome do Partido", "Nível", "UF", "Município", "Cliente Superior",
      "Processo (nº)", "Categoria", "Subcategoria", "Título", "Ano", "Órgão Julgador", "Status", "Resultado",
      "Data da decisão", "Tipo de Obrigação", "Descrição (Texto livre)", "Valor", "Exercício de cumprimento",
    ];
    var linhas = [
      cabecalho,
      [
        "Diretório Nacional", "", "Partido Exemplo", "Nacional", "", "", "",
        "0000000-00.2020.6.00.0000", "Prestação de Contas", "Anual", "Prestação de contas 2020", 2020, "TSE", "Concluído", "Não prestadas",
        new Date(2021, 5, 15), "Aplicação em política da mulher", "Aplicar em políticas de fomento à participação feminina", 2000000, 2021,
      ],
      [
        "Diretório Nacional", "", "Partido Exemplo", "", "", "", "",
        "0000000-00.2020.6.00.0000", "Prestação de Contas", "", "", "", "", "", "",
        "", "Recolhimento à União", "Recolher à conta única do Tesouro Nacional", 10000, 2021,
      ],
      [
        "Diretório Estadual da Bahia", "", "Partido Exemplo", "Estadual", "BA", "", "Diretório Nacional",
        "", "AIJE", "", "Investigação judicial eleitoral", 2022, "TRE-BA", "Em andamento", "",
        "", "", "", "", "",
      ],
    ];
    var sheet = XLSX.utils.aoa_to_sheet(linhas);

    var listas = [
      ["Coluna", "Valores aceitos (copie exatamente)"],
      ["Categoria", "Prestação de Contas"],
      ["Categoria", "AIJE"],
      ["Categoria", "Representação"],
      ["Categoria", "Registro de Candidatura"],
      ["Categoria", "DRAP"],
      ["Categoria", "Outro"],
      ["Nível", "Nacional"],
      ["Nível", "Estadual"],
      ["Nível", "Municipal"],
      ["Status", "Em andamento"],
      ["Status", "Aguardando diligência"],
      ["Status", "Concluído"],
      ["Resultado (só p/ Prestação de Contas)", "Aprovadas"],
      ["Resultado (só p/ Prestação de Contas)", "Aprovadas com ressalvas"],
      ["Resultado (só p/ Prestação de Contas)", "Desaprovadas"],
      ["Resultado (só p/ Prestação de Contas)", "Não prestadas"],
      ["Tipo de Obrigação", "Recolhimento à União"],
      ["Tipo de Obrigação", "Aplicação em política da mulher"],
      ["Tipo de Obrigação", "Aplicação em ações afirmativas / minorias"],
      ["Tipo de Obrigação", "Multa"],
      ["Tipo de Obrigação", "Outra"],
    ];
    var sheetListas = XLSX.utils.aoa_to_sheet(listas);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Importação");
    XLSX.utils.book_append_sheet(wb, sheetListas, "Listas de valores");
    XLSX.writeFile(wb, "modelo-importacao-bessoni-fortes.xlsx");
  }

  function iniciar() {
    document.querySelector("[data-baixar-modelo]").addEventListener("click", function () {
      try {
        setMsg("modelo", "Gerando…", false);
        baixarModelo();
        setMsg("modelo", "Baixado — confira a pasta de Downloads do navegador.", false);
      } catch (err) {
        console.error(err);
        setMsg("modelo", "Erro ao gerar o modelo: " + err.message, true);
      }
    });

    document.querySelector("[data-ler-planilha]").addEventListener("click", async function () {
      var input = document.getElementById("arquivo-planilha");
      var file = input.files[0];
      if (!file) { setMsg("leitura", "Escolha um arquivo primeiro.", true); return; }

      setMsg("leitura", "Lendo…", false);
      try {
        var linhasBrutas = await lerArquivo(file);
        linhasParaImportar = construirLinhas(linhasBrutas);
        if (!linhasParaImportar.length) {
          setMsg("leitura", "Nenhuma linha reconhecida — confira os nomes das colunas.", true);
          return;
        }
        setMsg("leitura", linhasParaImportar.length + " linha(s) lida(s).", false);
        renderPreview(linhasParaImportar);
      } catch (err) {
        console.error(err);
        setMsg("leitura", "Erro ao ler o arquivo: " + err.message, true);
      }
    });

    document.querySelector("[data-confirmar-importacao]").addEventListener("click", async function () {
      var btn = document.querySelector("[data-confirmar-importacao]");
      btn.disabled = true;
      setMsg("importacao", "Importando " + linhasParaImportar.length + " linha(s)… isso pode levar um tempo.", false);
      try {
        var resultado = await importarTudo(linhasParaImportar);
        setMsg("importacao", "Importação concluída.", false);
        renderResultado(resultado);
      } catch (err) {
        console.error(err);
        setMsg("importacao", "Erro durante a importação: " + err.message, true);
      }
      btn.disabled = false;
    });
  }

  async function init() {
    var session = await bfRequireSession("../login.html");
    if (!session) return;

    var perfil = await bfGetPerfil(session.user.id);
    if (!perfil || perfil.role !== "escritorio") {
      window.location.href = "painel.html";
      return;
    }

    document.querySelector("[data-user-nome]").textContent = perfil.nome;
    document.querySelector("[data-logout]").addEventListener("click", function () {
      bfLogout("../login.html");
    });

    iniciar();
  }

  init();
})();
