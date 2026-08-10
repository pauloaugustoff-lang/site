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
    "sigla do partido": "siglaPartido",
    "sigla": "siglaPartido",
    "cnpj do partido": "cnpjPartido",
    "tipo de cliente": "tipoCliente",
    "instancia partidaria": "tipoCliente",
    "nivel": "tipoCliente", // alias antigo (modelo pré-v3)
    "uf": "uf",
    "municipio": "municipio",
    "cargo pretendido": "cargoPretendido",
    "cargo": "cargoPretendido",
    "ano da eleicao": "anoEleicao",
    "ano eleicao": "anoEleicao",
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
    "houve recurso": "houveRecurso",
    "transito em julgado": "transitoJulgado",
    "houve transito em julgado": "transitoJulgado",
    "data do transito em julgado": "dataTransito",
    "data do transito": "dataTransito",
    "tipo de determinacao": "tipoDeterminacao",
    "tipo de obrigacao": "tipoDeterminacao", // alias antigo (modelo pré-v3)
    "descricao": "descricaoDeterminacao",
    "descricao texto livre": "descricaoDeterminacao",
    "valor": "valor",
    "exercicio de cumprimento": "exercicioCumprimento",
    "advogado responsavel": "responsavelProcesso",
    "responsavel do processo": "responsavelProcesso",
    "responsavel pela determinacao": "responsavelDeterminacao",
    "responsavel pelo cumprimento": "responsavelDeterminacao",
  };

  var TIPO_CLIENTE_MAP = {
    "diretorio nacional": "diretorio_nacional",
    nacional: "diretorio_nacional",
    "diretorio estadual": "diretorio_estadual",
    estadual: "diretorio_estadual",
    "diretorio municipal": "diretorio_municipal",
    municipal: "diretorio_municipal",
    candidato: "candidato",
    "pessoa fisica": "pessoa_fisica",
    "pessoa juridica": "pessoa_juridica",
  };

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

  var TIPO_DETERMINACAO_MAP = {
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

  function inferirTipoClientePorDocumento(documento) {
    if (!documento) return "pessoa_fisica";
    var digitos = String(documento).replace(/\D/g, "");
    return digitos.length === 14 ? "pessoa_juridica" : "pessoa_fisica";
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

  var BOOLEANO_MAP = { sim: true, s: true, verdadeiro: true, nao: false, n: false, falso: false };
  function parseBooleano(v) {
    if (v === null || v === undefined || v === "") return null;
    var chave = normalizar(v);
    return BOOLEANO_MAP[chave] !== undefined ? BOOLEANO_MAP[chave] : null;
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
        siglaPartido: texto(pega(linha, "siglaPartido")),
        cnpjPartido: texto(pega(linha, "cnpjPartido")),
        tipoCliente: texto(pega(linha, "tipoCliente")),
        uf: texto(pega(linha, "uf")),
        municipio: texto(pega(linha, "municipio")),
        cargoPretendido: texto(pega(linha, "cargoPretendido")),
        anoEleicao: parseInteiro(pega(linha, "anoEleicao")),
        numeroProcesso: texto(pega(linha, "numeroProcesso")),
        categoria: texto(pega(linha, "categoria")),
        subcategoria: texto(pega(linha, "subcategoria")),
        titulo: texto(pega(linha, "titulo")),
        ano: parseInteiro(pega(linha, "ano")),
        orgaoJulgador: texto(pega(linha, "orgaoJulgador")),
        status: texto(pega(linha, "status")),
        resultado: texto(pega(linha, "resultado")),
        houveRecurso: parseBooleano(pega(linha, "houveRecurso")),
        transitoJulgado: parseBooleano(pega(linha, "transitoJulgado")),
        dataTransito: parseData(pega(linha, "dataTransito")),
        tipoDeterminacao: texto(pega(linha, "tipoDeterminacao")),
        descricaoDeterminacao: texto(pega(linha, "descricaoDeterminacao")),
        valor: parseValor(pega(linha, "valor")),
        exercicioCumprimento: parseInteiro(pega(linha, "exercicioCumprimento")),
        responsavelProcesso: texto(pega(linha, "responsavelProcesso")),
        responsavelDeterminacao: texto(pega(linha, "responsavelDeterminacao")),
      });
    }
    return linhas;
  }

  // -----------------------------------------------------------
  // Preview
  // -----------------------------------------------------------
  var linhasParaImportar = [];

  // Só pra exibição — não toca no banco. Mesma regra de nome usada na
  // importação de verdade (BF.gerarNomeCliente), calculada aqui em cima
  // do texto puro da planilha (o nome oficial do partido, se ele já
  // existir com grafia diferente, é resolvido só na hora de importar).
  function nomeParaPreview(l) {
    if (l.nomeCliente) return l.nomeCliente;
    var tipo = mapear(l.tipoCliente, TIPO_CLIENTE_MAP, null);
    if (tipo && l.nomePartido) {
      var uf = l.uf ? l.uf.trim().toUpperCase() : null;
      var gerado = BF.gerarNomeCliente(l.nomePartido, tipo, uf, l.municipio);
      if (gerado) return gerado + " (gerado automaticamente)";
    }
    return "—";
  }

  function renderPreview(linhas) {
    document.querySelector("[data-preview-resumo]").textContent =
      linhas.length + " linha(s) reconhecida(s). Mostrando as primeiras 15 abaixo.";

    var tbody = document.querySelector("[data-preview-linhas]");
    tbody.innerHTML = linhas.slice(0, 15).map(function (l) {
      return "<tr>" +
        "<td>" + nomeParaPreview(l) + "</td>" +
        "<td>" + (l.nomePartido || "—") + "</td>" +
        "<td>" + (l.categoria || "—") + "</td>" +
        "<td>" + (l.ano || "—") + "</td>" +
        "<td>" + (l.numeroProcesso || "—") + "</td>" +
      "</tr>";
    }).join("");

    document.querySelector("[data-secao-preview]").hidden = false;
    document.querySelector("[data-secao-resultado]").hidden = true;
  }

  // -----------------------------------------------------------
  // Importação
  // -----------------------------------------------------------
  async function carregarAdvogados() {
    var { data, error } = await bfSupabase.from("perfis").select("id, nome").eq("role", "escritorio");
    if (error) { console.error(error); return new Map(); }
    var mapa = new Map();
    (data || []).forEach(function (a) { mapa.set(normalizar(a.nome), a.id); });
    return mapa;
  }

  function resolverResponsavel(nomeBruto, advogadosMap, avisos, numeroLinha, rotulo) {
    if (!nomeBruto) return null;
    var id = advogadosMap.get(normalizar(nomeBruto));
    if (!id) {
      avisos.push("Linha " + numeroLinha + ": " + rotulo + " '" + nomeBruto + "' não encontrado entre os usuários do escritório — deixado sem responsável (cadastre o usuário antes ou ajuste depois pela tela).");
      return null;
    }
    return id;
  }

  async function resolverPartido(nome, sigla, cnpj, caches, avisos, numeroLinha) {
    if (!nome) return null;
    var chave = normalizar(nome);
    if (caches.partidos.has(chave)) return caches.partidos.get(chave);

    var existente = await bfSupabase.from("partidos").select("id, nome").ilike("nome", nome).limit(1).maybeSingle();
    if (existente.data) {
      caches.partidos.set(chave, existente.data);
      return existente.data;
    }

    if (!sigla) {
      avisos.push("Linha " + numeroLinha + ": partido '" + nome + "' ainda não cadastrado e sem Sigla na planilha — não deu pra criar (sigla é obrigatória). Linha ignorada.");
      return null;
    }

    var criado = await bfSupabase.from("partidos").insert({ nome: nome, sigla: sigla, cnpj: cnpj || null }).select("id, nome").single();
    if (criado.error) {
      avisos.push("Linha " + numeroLinha + ": erro ao criar partido '" + nome + "' — " + criado.error.message);
      return null;
    }
    caches.partidos.set(chave, criado.data);
    caches.partidosCriados++;
    return criado.data;
  }

  // partido: objeto {id, nome} resolvido por resolverPartido, ou null
  async function resolverCliente(l, partido, caches, avisos) {
    var partidoId = partido ? partido.id : null;

    var tipoCliente = mapear(l.tipoCliente, TIPO_CLIENTE_MAP, null);
    if (l.tipoCliente && !tipoCliente) {
      avisos.push("Linha " + l.numeroLinha + ": tipo de cliente '" + l.tipoCliente + "' não reconhecido — inferido automaticamente pelo documento.");
    }
    if (!tipoCliente) tipoCliente = inferirTipoClientePorDocumento(l.documento);
    var ehDiretorio = tipoCliente === "diretorio_nacional" || tipoCliente === "diretorio_estadual" || tipoCliente === "diretorio_municipal";

    var uf = l.uf ? l.uf.trim().toUpperCase() : null;
    if (uf && !BF.UF_LISTA.some(function (u) { return u.sigla === uf; })) {
      avisos.push("Linha " + l.numeroLinha + ": UF '" + l.uf + "' não reconhecida — usada mesmo assim como digitada.");
    }

    // Diretório: nome do cliente é sempre gerado automaticamente (mesma
    // regra do cadastro manual), nunca lido da planilha.
    var nomeCliente = l.nomeCliente;
    if (ehDiretorio) {
      if (!partido) {
        avisos.push("Linha " + l.numeroLinha + ": diretório sem Nome do Partido — linha ignorada.");
        return null;
      }
      nomeCliente = BF.gerarNomeCliente(partido.nome, tipoCliente, uf, l.municipio);
      if (!nomeCliente) {
        avisos.push("Linha " + l.numeroLinha + ": não foi possível gerar o nome do cliente (confira Instância/UF/Município) — linha ignorada.");
        return null;
      }
    }
    if (!nomeCliente) {
      avisos.push("Linha " + l.numeroLinha + ": sem Nome do Cliente — linha ignorada.");
      return null;
    }

    var chaveBusca = l.documento ? "doc:" + normalizar(l.documento) : "nome:" + normalizar(nomeCliente);
    if (caches.clientes.has(chaveBusca)) return caches.clientes.get(chaveBusca);

    var query = bfSupabase.from("clientes").select("id").limit(1);
    query = l.documento ? query.eq("documento", l.documento) : query.ilike("nome", nomeCliente);
    var existente = await query.maybeSingle();
    if (existente.data) {
      caches.clientes.set(chaveBusca, existente.data.id);
      return existente.data.id;
    }

    // Hierarquia: acha sozinho a instância imediatamente superior do
    // mesmo partido (nacional p/ estadual; estadual da mesma UF p/
    // municipal) — inclusive entre linhas já criadas nesta mesma
    // importação, já que cada linha é processada e salva em sequência.
    var parentId = null;
    if (ehDiretorio && tipoCliente !== "diretorio_nacional") {
      var superior = await BF.encontrarSuperior(tipoCliente, partidoId, uf);
      if (superior) {
        parentId = superior.id;
      } else {
        avisos.push("Linha " + l.numeroLinha + ": instância superior ainda não encontrada para '" + nomeCliente + "' — criado sem hierarquia (dá pra ligar depois pela tela).");
      }
    }

    var payload = {
      nome: nomeCliente,
      documento: l.documento,
      partido_id: partidoId,
      tipo_cliente: tipoCliente,
      uf: uf,
      municipio: l.municipio,
      parent_id: parentId,
      cargo_disputado: tipoCliente === "candidato" ? l.cargoPretendido : null,
      ano_eleicao: tipoCliente === "candidato" ? l.anoEleicao : null,
    };
    var criado = await bfSupabase.from("clientes").insert(payload).select("id").single();
    if (criado.error) {
      avisos.push("Linha " + l.numeroLinha + ": erro ao criar cliente '" + nomeCliente + "' — " + criado.error.message);
      return null;
    }
    caches.clientes.set(chaveBusca, criado.data.id);
    caches.clientes.set("nome:" + normalizar(nomeCliente), criado.data.id);
    caches.clientesCriados++;
    return criado.data.id;
  }

  // Só retorna a mensagem: a chamadora decide se a linha inteira é rejeitada
  // ou só o campo. Listas fechadas — nada de texto livre nestes campos.
  var OPCOES_CATEGORIA = "Prestação de Contas, AIJE, Representação, Registro de Candidatura, DRAP, Outro";
  var OPCOES_STATUS = "Em andamento, Aguardando diligência, Concluído";
  var OPCOES_RESULTADO_CONTAS = "Aprovadas, Aprovadas com ressalvas, Desaprovadas, Não prestadas";
  var OPCOES_TIPO_DETERMINACAO = "Recolhimento à União, Aplicação em política da mulher, Aplicação em ações afirmativas / minorias, Multa, Outra";

  async function resolverProcesso(l, clienteId, categoria, status, resultado, responsavelId, caches, avisos) {
    // numero_processo é obrigatório e único no banco — identifica o processo sozinho
    var chave = normalizar(l.numeroProcesso);
    if (caches.processos.has(chave)) return caches.processos.get(chave);

    var existente = await bfSupabase.from("processos").select("id").eq("numero_processo", l.numeroProcesso).maybeSingle();
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
      houve_recurso: l.houveRecurso,
      transito_julgado: l.transitoJulgado,
      data_transito: l.dataTransito,
      responsavel_id: responsavelId,
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

  async function resolverDeterminacao(l, processoId, tipo, responsavelId, avisos, caches) {
    var payload = {
      processo_id: processoId,
      tipo: tipo,
      descricao: l.descricaoDeterminacao || l.tipoDeterminacao,
      valor: l.valor,
      exercicio_cumprimento: l.exercicioCumprimento,
      status: "pendente",
      responsavel_id: responsavelId,
    };
    var { error } = await bfSupabase.from("determinacoes").insert(payload);
    if (error) {
      avisos.push("Linha " + l.numeroLinha + ": erro ao criar determinação — " + error.message);
      return;
    }
    caches.determinacoesCriadas++;
  }

  async function importarTudo(linhas) {
    var caches = {
      partidos: new Map(),
      clientes: new Map(),
      processos: new Map(),
      partidosCriados: 0,
      clientesCriados: 0,
      processosCriados: 0,
      determinacoesCriadas: 0,
    };
    var avisos = [];
    var advogadosMap = await carregarAdvogados();

    for (var i = 0; i < linhas.length; i++) {
      var l = linhas[i];
      if (!l.categoria) {
        avisos.push("Linha " + l.numeroLinha + ": sem Categoria, linha ignorada.");
        continue;
      }
      if (!l.numeroProcesso) {
        avisos.push("Linha " + l.numeroLinha + ": sem Processo (nº), linha ignorada — todo processo precisa de número.");
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

      var partido = await resolverPartido(l.nomePartido, l.siglaPartido, l.cnpjPartido, caches, avisos, l.numeroLinha);
      var clienteId = await resolverCliente(l, partido, caches, avisos);
      if (!clienteId) continue;

      var responsavelProcessoId = resolverResponsavel(l.responsavelProcesso, advogadosMap, avisos, l.numeroLinha, "Advogado responsável");
      var processoId = await resolverProcesso(l, clienteId, categoria, status, resultado, responsavelProcessoId, caches, avisos);
      if (!processoId) continue;

      // --- Tipo de Determinação (opcional, lista fechada) ---
      if (l.tipoDeterminacao) {
        var tipoDeterminacao = mapear(l.tipoDeterminacao, TIPO_DETERMINACAO_MAP, null);
        if (!tipoDeterminacao) {
          avisos.push("Linha " + l.numeroLinha + ": tipo de determinação '" + l.tipoDeterminacao + "' inválido — determinação não importada (processo foi importado normalmente). Valores aceitos: " + OPCOES_TIPO_DETERMINACAO + ".");
        } else {
          var responsavelDeterminacaoId = resolverResponsavel(l.responsavelDeterminacao, advogadosMap, avisos, l.numeroLinha, "Responsável pela determinação");
          await resolverDeterminacao(l, processoId, tipoDeterminacao, responsavelDeterminacaoId, avisos, caches);
        }
      }
    }

    return {
      partidosCriados: caches.partidosCriados,
      clientesCriados: caches.clientesCriados,
      processosCriados: caches.processosCriados,
      determinacoesCriadas: caches.determinacoesCriadas,
      avisos: avisos,
    };
  }

  function renderResultado(resultado) {
    document.querySelector("[data-resultado-resumo]").innerHTML =
      '<div class="portal-stat"><span class="num">' + resultado.clientesCriados + '</span><span class="label">Clientes criados</span></div>' +
      '<div class="portal-stat"><span class="num">' + resultado.processosCriados + '</span><span class="label">Processos criados</span></div>' +
      '<div class="portal-stat"><span class="num">' + resultado.determinacoesCriadas + '</span><span class="label">Determinações criadas</span></div>' +
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

  // Lê um atributo de uma tag XML simples (ex: extrairAtributo('<sheet name="X" r:id="Y"/>', 'r:id') -> "Y").
  function extrairAtributo(tag, attr) {
    var m = new RegExp(attr + '="([^"]*)"').exec(tag);
    return m ? m[1] : null;
  }

  // O SheetJS free não escreve validação de dados (dropdown) — isso é
  // recurso pago (SheetJS Pro). Contorno: gera o .xlsx normalmente, abre o
  // zip com JSZip e injeta manualmente o bloco <dataValidations> no XML da
  // aba "Importação", apontando pra faixas de célula da aba "Listas de
  // valores". Resolve o caminho real do XML da aba via workbook.xml +
  // rels, em vez de assumir "sheet1.xml" (ordem interna do SheetJS não é
  // um contrato garantido).
  async function resolverCaminhoAba(zip, nomeAba) {
    var workbookXml = await zip.file("xl/workbook.xml").async("string");
    var tagAba = (workbookXml.match(/<sheet [^>]*\/>/g) || [])
      .filter(function (t) { return extrairAtributo(t, "name") === nomeAba; })[0];
    if (!tagAba) throw new Error("aba não encontrada no workbook: " + nomeAba);
    var rId = extrairAtributo(tagAba, "r:id");
    var relsXml = await zip.file("xl/_rels/workbook.xml.rels").async("string");
    var tagRel = (relsXml.match(/<Relationship [^>]*\/>/g) || [])
      .filter(function (t) { return extrairAtributo(t, "Id") === rId; })[0];
    if (!tagRel) throw new Error("relacionamento não encontrado: " + rId);
    return "xl/" + extrairAtributo(tagRel, "Target").replace(/^\.?\//, "");
  }

  async function baixarModelo() {
    var cabecalho = [
      "Nome do Cliente", "Nome do Partido", "Sigla do Partido", "CNPJ do Partido", "Instância Partidária", "UF", "Município", "Cargo Pretendido", "Ano da Eleição",
      "Categoria", "Subcategoria", "Título", "Ano", "Processo (nº)", "Órgão Julgador", "Status", "Resultado",
      "Houve recurso?", "Trânsito em julgado?", "Data do trânsito em julgado", "Advogado Responsável",
    ];
    var linhas = [
      cabecalho,
      [
        "", "Partido Exemplo", "PEX", "00.000.000/0001-00", "Nacional", "", "", "", "",
        "Prestação de Contas", "Anual", "Prestação de contas 2020", 2020, "0000000-00.2020.6.00.0000", "TSE", "Concluído", "Não prestadas",
        "Não", "Sim", new Date(2021, 8, 10), "Paulo Fortes",
      ],
      [
        "", "Partido Exemplo", "PEX", "", "Estadual", "BA", "", "", "",
        "AIJE", "", "Investigação judicial eleitoral", 2022, "0000001-11.2022.6.05.0000", "TRE-BA", "Em andamento", "",
        "", "", "", "Paulo Fortes",
      ],
      [
        "Maria da Silva", "Partido Exemplo", "PEX", "", "Candidato", "BA", "Salvador", "Prefeito", 2024,
        "Registro de Candidatura", "", "RCAND 2024", 2024, "0000002-22.2024.6.05.0000", "TRE-BA", "Em andamento", "",
        "", "", "", "Paulo Fortes",
      ],
    ];
    var sheet = XLSX.utils.aoa_to_sheet(linhas);

    // Listas em formato colunar (uma coluna por campo) — é o formato que
    // a validação de dados do Excel precisa pra referenciar uma faixa.
    var colunasListas = [
      { titulo: "Categoria", valores: ["Prestação de Contas", "AIJE", "Representação", "Registro de Candidatura", "DRAP", "Outro"] },
      { titulo: "Instância Partidária", valores: ["Nacional", "Estadual", "Municipal", "Candidato", "Pessoa Física", "Pessoa Jurídica"] },
      { titulo: "UF", valores: BF.UF_LISTA.map(function (u) { return u.sigla; }) },
      { titulo: "Cargo Pretendido", valores: BF.CARGOS.map(function (c) { return c.label; }) },
      { titulo: "Subcategoria (sugestão)", valores: ["Anual", "Eleitoral"] },
      { titulo: "Status", valores: ["Em andamento", "Aguardando diligência", "Concluído"] },
      { titulo: "Resultado (Prestação de Contas)", valores: ["Aprovadas", "Aprovadas com ressalvas", "Desaprovadas", "Não prestadas"] },
      { titulo: "Sim/Não", valores: ["Sim", "Não"] },
    ];
    var maxLinhas = colunasListas.reduce(function (max, c) { return Math.max(max, c.valores.length); }, 0);
    var listas = [colunasListas.map(function (c) { return c.titulo; })];
    for (var i = 0; i < maxLinhas; i++) {
      listas.push(colunasListas.map(function (c) { return c.valores[i] || ""; }));
    }
    var sheetListas = XLSX.utils.aoa_to_sheet(listas);

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Importação");
    XLSX.utils.book_append_sheet(wb, sheetListas, "Listas de valores");

    // Mapeia cada coluna do formulário de importação pra sua lista de
    // valores correspondente na aba "Listas de valores".
    var validacoes = [
      { coluna: "Instância Partidária", lista: "Instância Partidária" },
      { coluna: "UF", lista: "UF" },
      { coluna: "Cargo Pretendido", lista: "Cargo Pretendido" },
      { coluna: "Categoria", lista: "Categoria" },
      { coluna: "Subcategoria", lista: "Subcategoria (sugestão)" },
      { coluna: "Status", lista: "Status" },
      { coluna: "Resultado", lista: "Resultado (Prestação de Contas)" },
      { coluna: "Houve recurso?", lista: "Sim/Não" },
      { coluna: "Trânsito em julgado?", lista: "Sim/Não" },
    ];
    function refLista(tituloLista) {
      var idx = colunasListas.map(function (c) { return c.titulo; }).indexOf(tituloLista);
      var letra = XLSX.utils.encode_col(idx);
      var qtd = colunasListas[idx].valores.length;
      return "'Listas de valores'!$" + letra + "$2:$" + letra + "$" + (qtd + 1);
    }
    // showErrorMessage="0": mostra a setinha com as opções, mas não
    // bloqueia se o usuário digitar outro valor — os campos aqui são
    // sugestões, não um vocabulário fechado (ex: Subcategoria é texto
    // livre por design; Resultado muda de vocabulário fora de Prestação
    // de Contas).
    var blocoValidacoes = "<dataValidations count=\"" + validacoes.length + "\">" +
      validacoes.map(function (v) {
        var idx = cabecalho.indexOf(v.coluna);
        var letra = XLSX.utils.encode_col(idx);
        var sqref = letra + "2:" + letra + "1000";
        var formula = refLista(v.lista).replace(/&/g, "&amp;");
        return "<dataValidation type=\"list\" allowBlank=\"1\" showInputMessage=\"1\" showErrorMessage=\"0\" sqref=\"" + sqref + "\">" +
          "<formula1>" + formula + "</formula1></dataValidation>";
      }).join("") +
      "</dataValidations>";

    var arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    var zip = await JSZip.loadAsync(arrayBuffer);
    var caminhoAba = await resolverCaminhoAba(zip, "Importação");
    var xml = await zip.file(caminhoAba).async("string");
    xml = xml.indexOf("<pageMargins") !== -1
      ? xml.replace("<pageMargins", blocoValidacoes + "<pageMargins")
      : xml.replace("</worksheet>", blocoValidacoes + "</worksheet>");
    zip.file(caminhoAba, xml);

    var blob = await zip.generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "modelo-importacao-bessoni-fortes.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function iniciar() {
    document.querySelector("[data-baixar-modelo]").addEventListener("click", async function () {
      try {
        setMsg("modelo", "Gerando…", false);
        await baixarModelo();
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
