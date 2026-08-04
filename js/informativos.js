const CATS={
  "Conduta vedada":     {bg:"#dcfce7",tc:"#166534"},
  "Contas":             {bg:"#fef3c7",tc:"#92400e"},
  "Crimes eleitorais":  {bg:"#fee2e2",tc:"#991b1b"},
  "Desincompatib.":     {bg:"#ffedd5",tc:"#9a3412"},
  "Filiação/Mandato":   {bg:"#ede9fe",tc:"#5b21b6"},
  "Inelegibilidade":    {bg:"#d1fae5",tc:"#065f46"},
  "Processual":         {bg:"#dbeafe",tc:"#1e40af"},
  "Partido político":   {bg:"#fce7f3",tc:"#9d174d"},
  "Pesquisa eleitoral": {bg:"#f3f4f6",tc:"#374151"},
  "Propaganda":         {bg:"#ede9fe",tc:"#4c1d95"},
  "Registro":           {bg:"#fef3c7",tc:"#78350f"},
  "Org. judiciária":    {bg:"#f3f4f6",tc:"#4b5563"},
};
const RISK={
  "Máxima":{bg:"#fee2e2",tc:"#991b1b"},
  "Alta":   {bg:"#fef3c7",tc:"#92400e"},
  "Média":  {bg:"#dcfce7",tc:"#166534"},
  "Baixa":  {bg:"#f3f4f6",tc:"#4b5563"},
};

const D=[
  {cat:"Propaganda", risk:"Máxima", info:"TSE n. 8 · mai 2025", badge:"Jurisprudência Hoje",
   num:"AgR-AREspe n. 060010127 e 060005975",
   title:"Omissão do nome do vice no HGPE",
   origem:"TRE-PA",
   proc:"Representação por propaganda eleitoral irregular · Agravo regimental em agravo em recurso especial eleitoral · Belém/PA",
   tese:"O Plenário do TSE manteve, por unanimidade, a multa aplicada ao prefeito e ao vice-prefeito eleitos em Belém/PA nas Eleições 2024. Ficou caracterizada propaganda eleitoral irregular pela omissão do nome do candidato a vice-prefeito nas inserções transmitidas no horário eleitoral gratuito. A regra do art. 36, §4º, da Lei 9.504/1997 impõe presença e proporcionalidade mínima do nome do vice em toda a propaganda da chapa, inclusive no HGPE, sob pena de multa.",
   fund:"Art. 36, §4º, Lei 9.504/1997",
   imp:"Revisar rigorosamente todos os roteiros e materiais de HGPE antes da veiculação. O nome do vice deve constar de forma legível e com proporção adequada em cada inserção. A ausência, ainda que em apenas algumas peças, configura ilícito objetivo.",
   ref:"Rel. Min. André Mendonça · julgado em 27/5/2025",
   integra:`"Eleições 2024. [...] Propaganda eleitoral irregular. Omissão do nome do candidato a vice-prefeito nas inserções do horário eleitoral gratuito. Multa. Manutenção.

O Plenário do TSE manteve, por unanimidade, a multa aplicada pelo Tribunal a quo ao prefeito e ao vice-prefeito eleitos, em Belém/PA, nas Eleições 2024. Os ministros entenderam que eles veicularam propaganda eleitoral irregular caracterizada pela omissão do nome do candidato a vice nas inserções transmitidas no horário eleitoral gratuito."

Ac. de 27/5/2025 nos AgR-AREspe n. 060010127 e 060005975, Belém/PA, rel. Min. André Mendonça, em sessão jurisdicional.`},

  {cat:"Processual", risk:"Máxima", info:"TSE n. 8 · mai 2025", badge:"Jurisprudência Ontem (2011)",
   num:"AgR-AI n. 254928",
   origem:"TRE-BA",
   title:"Litisconsórcio passivo necessário — AIME, AIJE, RCED e Representação",
   origem:"TRE-BA",
   conflito:{titulo:"TSE superou parcialmente esta exigência em 2021 para AIJEs de abuso de poder",texto:"O Informativo TSE Ano XXIII n. 8 (2021) noticiou que o Tribunal superou a exigência de litisconsórcio passivo necessário especificamente nas Ações de Investigação Judicial Eleitoral (AIJE) fundamentadas em abuso de poder. O entendimento firmado é que não se exige litisconsórcio entre o candidato beneficiado e o autor da conduta ilícita nessa modalidade de ação, pois a responsabilidade do candidato decorre do benefício auferido, não de coautoria no ato.\n\nA regra do litisconsórcio necessário permanece válida para AIME, RCED e Representação em geral, mas foi afastada para a AIJE por abuso de poder.\n\nFonte: Informativo TSE – Ano XXIII – n. 8 (2021). Disponível em: tse.jus.br/jurisprudencia/informativo-tse/arquivos/informativo-tse-ano-xxiii-n-8"},
   proc:"AIME (Ação de Impugnação de Mandato Eletivo) · Agravo interno em agravo de instrumento · Camamu/BA",
   tese:"A jurisprudência do TSE consolidou-se no sentido de que, nas ações eleitorais em que é prevista a pena de cassação de registro, diploma ou mandato — AIJE, representação, RCED e AIME —, há litisconsórcio passivo necessário entre o titular e o vice, dada a possibilidade de este ser afetado pela eficácia da decisão. Decorrido o prazo para a propositura da AIME sem inclusão do vice no polo passivo, não é possível emenda à inicial, o que acarreta a extinção do feito sem resolução do mérito. Trata-se de pressuposto processual de validade, não sanável após o prazo decadencial.",
   fund:"Jurisprudência consolidada do TSE — aplicável a AIJE, Representação, RCED e AIME",
   imp:"Ao propor qualquer ação que possa resultar em cassação de registro, diploma ou mandato, incluir obrigatoriamente o vice no polo passivo desde a petição inicial. Verificar o prazo decadencial antes do protocolo — para AIME, 15 dias após a diplomação.",
   ref:"Rel. Min. Arnaldo Versiani · julgado em 17/5/2011 · Disclaimer: reflete o posicionamento da Corte à época do julgamento.",
   integra:`"A jurisprudência do Tribunal consolidou-se no sentido de que, nas ações eleitorais em que é prevista a pena de cassação de registro, diploma ou mandato (investigação judicial eleitoral, representação, recurso contra expedição de diploma e Ação de Impugnação de Mandato Eletivo), há litisconsórcio passivo necessário entre o titular e o vice, dada a possibilidade de este ser afetado pela eficácia da decisão. Decorrido o prazo para a propositura de Ação de Impugnação de Mandado Eletivo sem inclusão do vice no polo passivo da demanda, não é possível emenda à inicial, o que acarreta a extinção do feito sem resolução de mérito."

Ac. de 17/5/2011 no AgR-AI n. 254928, Camamu/BA, rel. Min. Arnaldo Versiani.
Tags: AIME; litisconsórcio passivo necessário.`},

  {cat:"Conduta vedada", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060007034",
   title:"Publicidade institucional em redes sociais no período vedado — responsabilidade do gestor e do beneficiário",
   proc:"Representação por conduta vedada (art. 73, VI, 'b', Lei 9.504/97) · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reafirmou que o chefe do Poder Executivo, ainda que não tenha autorizado a manutenção de publicidade institucional em período vedado, é por ela responsável, pois tem o dever de fiscalizar o cumprimento das determinações legais. O beneficiário da conduta vedada também responde com multa, independentemente de autorização ou anuência (art. 73, §§4º e 8º). A interpretação do §8º do art. 73 é horizontal: tanto autores quanto beneficiários de condutas vedadas podem ser sancionados, sendo irrelevantes expedientes voltados à exclusão da responsabilidade.",
   fund:"Art. 73, VI, 'b', e §§4º e 8º, Lei 9.504/1997",
   imp:"Prefeitos pré-candidatos em 2026 devem providenciar varredura e remoção de publicidade institucional de todas as redes sociais da prefeitura a partir de 1º de julho de 2026 (3 meses antes das eleições). O candidato beneficiado responde ainda que não tenha solicitado a manutenção.",
   ref:"Rel. Min. Floriano de Azevedo Marques · julgado em 22/5/2025",
   integra:`"Eleições 2024. [...] Conduta vedada. Art. 73, VI, b, da Lei n. 9.504/1997. Caracterização. Prefeito e vice-prefeito, pré-candidato a prefeito. Permanência de publicidade institucional em redes sociais da prefeitura. Período vedado. Responsabilidade do gestor público e do candidato beneficiado. [...]

8. A orientação do Tribunal de origem está em consonância com a jurisprudência desta Corte Superior, firmada no sentido de que o chefe do Poder Executivo, ainda que não tenha autorizado a manutenção da publicidade institucional em período proscrito, é por ela responsável, porquanto tem o dever de zelar pela efetiva fiscalização e cumprimento das determinações legais.

9. Nos termos do art. 73, §§ 4º e 8º, da Lei n. 9.504/1997, o reconhecimento da conduta vedada implica aplicação de multa independentemente de autorização ou anuência do beneficiário com a prática do ato. [...]

10. A interpretação do § 8º do art. 73 da Lei n. 9.504/1997 é horizontal, aplicável a toda e qualquer demanda que verse sobre condenação por multa em sede de conduta vedada: nos termos legais, tanto autores quanto beneficiários de condutas vedadas podem ser sancionados, independentemente de autorização, anuência ou eventuais expedientes voltados à exclusão da responsabilidade. [...]."

Ac. de 22/5/2025 no AgR-AREspE n. 060007034, rel. Min. Floriano de Azevedo Marques.`},

  {cat:"Contas", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-RO-El n. 060000342",
   title:"Irregularidades contábeis na prestação de contas não configuram, por si sós, abuso do poder econômico",
   proc:"AIME (Ação de Impugnação de Mandato Eletivo) por abuso do poder econômico · Agravo regimental em recurso ordinário eleitoral · Eleições 2022",
   tese:"O TSE fixou duas teses: (1) a caracterização de abuso do poder econômico exige prova inequívoca e robusta da prática de atos que comprometam gravemente a igualdade de condições na disputa eleitoral; (2) irregularidades contábeis — mesmo que verificadas na prestação de contas de campanha —, sem potencial para comprometer a lisura do pleito, não ensejam a sanção de cassação de mandato. O requisito não é a existência de inconsistências formais, mas a demonstração de que tais inconsistências causaram grave desequilíbrio na disputa.",
   fund:"Art. 22, XIV, LC 64/1990",
   imp:"Em defesas de AIME lastreada em irregularidades contábeis, a estratégia central é demonstrar que as inconsistências são de natureza formal-contábil e não causaram desequilíbrio material no pleito. O ônus da prova de que as irregularidades comprometeram a legitimidade do resultado é do autor da ação.",
   ref:"Rel. Min. Nunes Marques · julgado em 15/5/2025",
   integra:`"Eleições 2022. [...] Ação de impugnação de mandato eletivo. Abuso do poder econômico. Falhas contábeis na prestação de contas. Não configuração. [...]

2. A controvérsia central reside em saber se as irregularidades contábeis apontadas na prestação de contas da campanha do agravado são suficientes para caracterizar abuso do poder econômico e ensejar a cassação do mandato, nos termos do art. 22, XIV, da Lei Complementar n. 64/1990. [...]

3. As inconsistências verificadas na prestação de contas da campanha eleitoral do agravado são de natureza contábil e não foram consideradas graves o suficiente para comprometer a legitimidade do pleito.

4. Não foram apresentados elementos probatórios robustos que comprovem a prática de abuso do poder econômico. A jurisprudência do TSE exige prova inequívoca para caracterização de abuso do poder econômico.

5. A jurisprudência também afasta a possibilidade de aplicação da cassação de mandato com base em meras irregularidades contábeis que não impliquem grave desequilíbrio na disputa eleitoral. [...]

Tese de julgamento:
1. A caracterização de abuso do poder econômico exige prova inequívoca e robusta da prática de atos que comprometam gravemente a igualdade de condições na disputa eleitoral.
2. Irregularidades contábeis, sem potencial para comprometer a lisura do pleito, não ensejam a aplicação da sanção de cassação de mandato. [...]."

Ac. de 15/5/2025 no AgR-RO-El n. 060000342, rel. Min. Nunes Marques.`},

  {cat:"Contas", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060543767",
   title:"Dívidas de campanha não quitadas e não assumidas pelo partido = desaprovação das contas",
   proc:"Prestação de contas de campanha eleitoral — deputado estadual · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2022",
   tese:"O TSE reiterou que a existência de dívidas de campanha não quitadas e não assumidas pelo órgão partidário constitui irregularidade grave, apta a ensejar a desaprovação das contas, por comprometer a transparência do ajuste contábil. O entendimento é consolidado e reiterado em vários precedentes. A mera existência da dívida sem cobertura — seja do candidato, seja do partido — já configura a irregularidade grave, independentemente de outros vícios na prestação.",
   fund:"Resolução TSE sobre prestação de contas de campanha eleitoral",
   imp:"Antes de protocolar a prestação de contas final, verificar se há fornecedores, prestadores ou colaboradores com valores pendentes. Se o partido não assumir formalmente as dívidas remanescentes, o candidato deve quitá-las ou registrá-las adequadamente para evitar a desaprovação.",
   ref:"Rel. Min. Isabel Gallotti · julgado em 9/5/2025",
   integra:`"Eleições 2022. Deputado estadual. [...] Prestação de contas. Desaprovação. Dívidas de campanha não assumidas pelo partido. Falha grave. [...]

3. Consoante entendimento jurisprudencial deste Tribunal, 'a existência de dívidas de campanha não quitadas e não assumidas pelo órgão partidário constitui irregularidade grave, apta a ensejar a desaprovação das contas, por comprometer a transparência do ajuste contábil'. Precedentes. [...]."

Ac. de 9/5/2025 no AgR-AREspE n. 060543767, rel. Min. Isabel Gallotti.`},

  {cat:"Contas", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060543767",
   title:"Documentos novos em embargos de declaração são inadmissíveis após inércia em diligência",
   proc:"Prestação de contas de campanha eleitoral — deputado estadual · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2022 (mesma ação do item anterior)",
   tese:"O TSE não admite a juntada de novos documentos protocolados apenas com os embargos de declaração quando o candidato havia sido regularmente intimado para se manifestar em sede de diligência e permaneceu inerte. Trata-se de preclusão processual: a inércia diante da intimação fecha a via para a juntada posterior de novos documentos, não sendo possível sanar a omissão em momento recursal subsequente.",
   fund:"Entendimento reiterado do TSE — princípio da preclusão processual",
   imp:"Monitorar sistematicamente todas as intimações decorrentes das prestações de contas. Responder sempre no prazo, ainda que parcialmente, pois a inércia veda completamente a juntada de documentos em embargos. Em especial, acompanhar as diligências da SGCE/Asepa dos TREs.",
   ref:"Rel. Min. Isabel Gallotti · julgado em 9/5/2025",
   integra:`"Eleições 2022. Deputado estadual. [...] Prestação de contas. Desaprovação. Dívidas de campanha não assumidas pelo partido. Falha grave. [...]

2. Não se admite a juntada de novos documentos protocolados apenas com os embargos de declaração, sobretudo porque o candidato havia sido intimado para se manifestar e permaneceu inerte. Precedentes. [...]."

Ac. de 9/5/2025 no AgR-AREspE n. 060543767, rel. Min. Isabel Gallotti.`},

  {cat:"Crimes eleitorais", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AREspE n. 060037989",
   title:"Competência eleitoral condicionada à existência de crime eleitoral — 3 teses (kompetenz-kompetenz)",
   proc:"Inquérito policial com pretensão de crimes eleitorais (Operação Minucius) · Recurso especial eleitoral sobre homologação de arquivamento parcial",
   tese:"O TSE firmou três teses: (1) a competência da Justiça Eleitoral é condicionada à existência de crime eleitoral — ainda que conexo com crimes comuns —, competindo à própria Justiça Eleitoral, com precedência sobre qualquer outra, verificar se há ou não justa causa para crime especial (kompetenz-kompetenz); (2) a ausência de justa causa para crime eleitoral autoriza o arquivamento parcial do procedimento investigatório e afasta a perpetuação da jurisdição eleitoral (perpetuatio jurisdictionis); (3) o declínio de competência para a Justiça Comum é válido quando não se verificar conexão entre os crimes comuns e o fato pretensamente tido por crime eleitoral — a condição de candidato ou o ambiente eleitoral, por si sós, não atraem a competência.",
   fund:"Art. 35, II, Código Eleitoral; STF Inq 4435; Rcl 51429/ES",
   imp:"Para argumentar a competência da Justiça Eleitoral, é indispensável demonstrar tipicidade concreta de crime eleitoral (CE ou legislação esparsa), não bastando o contexto eleitoral ou a qualidade de candidato do investigado. No sentido inverso, para afastar a competência eleitoral, demonstrar que os fatos não preenchem nenhum tipo penal eleitoral.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 8/5/2025",
   integra:`"Direito processual penal e direito eleitoral. [...] Inquérito policial. Arquivamento parcial. Operação minucius. Conexão de crimes comuns e pretensos crimes eleitorais. Não comprovação. Ausência de justa causa para crimes eleitorais. Inexistência de vis attractiva. Declínio de competência da Justiça Eleitoral para a Justiça Comum Federal. [...]

A competência da Justiça Eleitoral para processar e julgar crimes eleitorais e comuns conexos é regida pelo art. 35, II, do Código Eleitoral, em conformidade com a jurisprudência do STF (Inq n. 4435). Essa competência é condicionada à imprescindível presença de crime eleitoral e à existência de conexão com delitos comuns. [...]

A condição de candidato de um dos investigados ou o ambiente eleitoral à época dos fatos investigados não é suficiente, por si, para configurar crimes eleitorais, ausentes elementos que preencham os tipos penais previstos no Código Eleitoral ou em legislação esparsa eleitoral.

Teses de julgamento:
1. A competência da Justiça Eleitoral é condicionada à existência de crime eleitoral, ainda que conexo com crimes comuns, competindo a esta Justiça Especializada — com precedência sobre qualquer outra — proceder à análise se há ou não justa causa de crime especial (kompetenz-kompetenz).
2. A ausência de justa causa para a configuração de crime eleitoral autoriza o arquivamento parcial do procedimento e afasta a perpetuação da jurisdição eleitoral.
3. O declínio de competência para a Justiça Comum é válido quando não se verificar conexão entre os crimes comuns e o fato pretensamente tido por crime eleitoral."

Ac. de 8/5/2025 no AREspE n. 060037989, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Crimes eleitorais", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 4824",
   title:"Condenação penal pode se basear em provas colhidas no inquérito, desde que confirmadas em juízo",
   proc:"Ação penal eleitoral (arts. 340 e 350 do Código Eleitoral) · Agravo regimental em agravo em recurso especial eleitoral",
   tese:"O TSE reiterou que a condenação penal pode se fundamentar em provas colhidas na fase de inquérito policial, desde que confirmadas em juízo sob o crivo do contraditório e da ampla defesa. Não há vedação ao aproveitamento de provas pré-processuais, sendo o requisito essencial que tais provas sejam submetidas ao contraditório durante a instrução judicial e confirmadas perante o juízo.",
   fund:"Art. 5º, LV, CF; princípios do contraditório e ampla defesa",
   imp:"Em defesas criminais eleitorais: verificar se cada prova oriunda do inquérito foi efetivamente submetida ao contraditório em juízo e confirmada. Provas do inquérito não repetidas ou contraditadas em audiência podem ser contestadas como inaptas para fundamentar a condenação.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 22/5/2025",
   integra:`"[...] Crimes dos arts. 340 e 350 do Código Eleitoral. [...]

2. A condenação penal pode se fundamentar em provas colhidas na fase de inquérito, desde que confirmadas em juízo sob o crivo do contraditório e da ampla defesa."

Ac. de 22/5/2025 no AgR-AREspE n. 4824, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Crimes eleitorais", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060009427",
   title:"Art. 296 CE — desordem nos trabalhos eleitorais: prova testemunhal uníssona é suficiente para a condenação",
   proc:"Ação penal eleitoral (art. 296 do Código Eleitoral — desordem nos trabalhos eleitorais) · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2022",
   tese:"O TSE manteve a condenação pelo crime de desordem nos trabalhos eleitorais (art. 296 CE) com base em cinco depoimentos testemunhais colhidos em juízo, sob contraditório e ampla defesa, todos uníssonos em afirmar que a conduta do agente causou a paralisação dos trabalhos da seção eleitoral e o aumento da fila de eleitores, gerando situação caótica. O efetivo prejuízo aos trabalhos eleitorais é elemento essencial do tipo, e sua demonstração por prova testemunhal convergente é suficiente para a condenação.",
   fund:"Art. 296, Código Eleitoral",
   imp:"Na defesa por art. 296 CE: explorar contradições entre os depoimentos testemunhais, questionar a credibilidade das testemunhas, e demonstrar que não houve efetivo prejuízo aos trabalhos eleitorais — a mera alteração ou agitação, sem paralisação ou impacto concreto, pode não preencher o tipo.",
   ref:"Rel. Min. André Ramos Tavares · julgado em 15/5/2025",
   integra:`"[...] Eleições 2022. Desordem nos trabalhos eleitorais. Art. 296 do Código Eleitoral (CE). Condenação. Efetivo prejuízo aos trabalhos eleitorais. Prova testemunhal uníssona. Contraditório e ampla defesa. Comprovados. [...]

Como assentado na decisão agravada, o prejuízo aos trabalhos eleitorais é manifesto, visto que os 5 (cinco) depoimentos testemunhais, colhidos em juízo sob as garantias do contraditório e da ampla defesa, foram uníssonos no sentido de que a conduta perpetrada pelo agravante deu causa à paralisação dos trabalhos da seção eleitoral enquanto perdurou a desordem e, consequentemente, ocasionou aumento da fila de eleitores que aguardavam para votar, gerando situação caótica no local de votação. [...]."

Ac. de 15/5/2025 no AgR-AREspE n. 060009427, rel. Min. André Ramos Tavares.`},

  {cat:"Desincompatib.", risk:"Máxima", info:"TSE n. 8 · mai 2025",
   num:"REspEl n. 060029717",
   origem:"TRE-MG",
   title:"Secretário municipal: exoneração formal não basta — desincompatibilização exige afastamento real das funções",
   origem:"TRE-MG",
   proc:"Impugnação de registro de candidatura (IRRC) por ausência de desincompatibilização · Recurso especial eleitoral · Rio Pardo de Minas/MG · Eleições 2024",
   tese:"O TSE aplicou a Súmula 30 e confirmou o indeferimento do registro do candidato. Embora exonerado tempestivamente do cargo de secretário municipal de Assistência Social (5/4/2024), o candidato assinou diversas ordens de pagamento e notas de empenho com datas posteriores ao limite para desincompatibilização, configurando autênticos atos de gestão. A desincompatibilização exige afastamento formal E de fato das funções exercidas: o decreto de exoneração é necessário, mas insuficiente se o candidato continuar praticando atos inerentes ao cargo. A alegação de indução a erro pela administração não foi acolhida por ausência de prova inequívoca.",
   fund:"Art. 1º, III, 'b', 4, e VII, LC 64/1990; Súmula 30/TSE",
   imp:"Ao assessorar secretários municipais que pretendem ser candidatos: após a exoneração formal, NENHUM ato de gestão pode ser assinado, ainda que solicitado pela administração. Orientar expressamente o secretário, o prefeito e os servidores da secretaria sobre essa vedação imediatamente após a exoneração, documentando essa comunicação.",
   ref:"Rel. Min. Floriano de Azevedo Marques · julgado em 9/5/2025",
   integra:`"Eleições 2024. [...] Registro de candidatura indeferido na origem. Vereador. Desincompatibilização. Art. 1º, III, b, 4, e VII, da Lei Complementar n. 64/1990. Secretário municipal. Decreto de exoneração. Afastamento de fato não comprovado. Atos de gestão. [...]

5. No caso, de acordo com o aresto regional, embora o agravante tenha sido exonerado tempestivamente do cargo de secretário municipal de Assistência Social e Trabalho da prefeitura de Rio Pardo de Minas/MG, no dia 5/4/2024, a documentação colacionada aos autos demonstra que ele assinou diversas ordens de pagamento e notas de empenho com datas posteriores ao limite para a desincompatibilização, configurando autênticos atos de gestão.

6. A Corte de origem ressaltou que não ficou demonstrado de forma inequívoca que o agravante teria sido induzido a erro pela administração pública para praticar os atos inerentes ao cargo de secretário municipal e que, por incompreensão dos fatos, teria assinado as ordens de pagamento em data posterior à permitida. [...]

8. Incide a Súmula n. 30 do TSE, pois o entendimento do Tribunal de origem está de acordo com a jurisprudência dessa Corte no sentido de que a desincompatibilização do cargo de secretário municipal exige do candidato o afastamento formal e de fato das funções exercidas, o que não se verificou na espécie. [...]."

Ac. de 9/5/2025 no REspEl n. 060029717, rel. Min. Floriano de Azevedo Marques.`},

  {cat:"Filiação/Mandato", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"TutCautAnt n. 061337221",
   title:"Janela partidária não se estende a suplentes — partido tem direito às cadeiras proporcionais (6 teses)",
   proc:"Ação de justificação partidária / perda de mandato eletivo — suplente de vereador que migrou de partido · Tutela Cautelar Antecedente · Eleições 2020",
   tese:"O TSE firmou seis teses: (1) o art. 17, §6º, CF aplica-se exclusivamente a deputados e vereadores — quem detém mandato; (2) as hipóteses de justa causa para desfiliação, incluindo a janela partidária (art. 22-A, Lei 9.096/95), não são extensíveis a suplentes; (3) os partidos têm DIREITO — não mera expectativa — a que as cadeiras obtidas nas eleições proporcionais sejam por eles ocupadas durante a legislatura; (4) o suplente que migra de partido perde a possibilidade de ser convocado pelo partido pelo qual concorreu originariamente; (5) o efeito da anulação de votos (art. 222 CE) não retroage à data da eleição, mas se efetiva na nova totalização determinada pela Junta Eleitoral; (6) a Junta Eleitoral não pode mitigar o direito do partido às cadeiras, salvo nas hipóteses de anuência ou justa causa previstas no art. 17, §6º, CF.",
   fund:"Art. 17, §6º, CF; art. 22-A, Lei 9.096/1995; EC 111/2021; MSs 26.602, 26.603 e 26.604/STF; arts. 40 e 222, CE",
   imp:"Orientar todos os suplentes de vereadores e deputados sobre os riscos da migração partidária ANTES da janela de 2026. A troca de partido pelo suplente não acarreta perda automática de eventual mandato futuro, mas cancela a possibilidade de convocação pelo partido original. Partidos devem monitorar desfiliações de suplentes e acionar a Junta Eleitoral quando necessário.",
   ref:"Rel. Min. Floriano de Azevedo Marques, red. designado Min. Nunes Marques · julgado em 12/11/2024",
   integra:`"Eleições 2020. [...] Ação de justificação partidária ou perda de mandato eletivo. Justa causa. Ausência de extensão do direito ao suplente. Sucessão de suplentes. Competência da junta eleitoral. Necessidade de manutenção de filiação no partido político. [...]

Tese de julgamento:
1. O § 6º do art. 17 da Constituição Federal é aplicável exclusivamente aos deputados federais, estaduais, distritais e aos vereadores, pois apenas eles podem perder o mandato por infidelidade partidária, ou têm o direito de se desfiliarem do partido, com manutenção do mandato, nos casos de anuência do partido ou nas hipóteses de justa causa estabelecida em lei.
2. As hipóteses de justa causa para desfiliação partidária previstas no art. 22-A da Lei n. 9.096/1995 não são extensíveis aos suplentes em virtude de não exercerem mandato eletivo.
3. Os partidos políticos passaram a ter o direito, e não a mera expectativa, de que as cadeiras obtidas nas eleições proporcionais sejam por eles ocupadas durante a legislatura nas eleições para deputados e vereadores.
4. O suplente não é obrigado a se manter filiado ao partido político pelo qual concorreu, porém, caso opte por migrar para novo partido, deve ter em consideração que a filiação anterior será cancelada com todos os direitos e deveres a ela inerentes, entre os quais a possibilidade de ser convocado para exercer o mandato pelo partido por meio do qual concorreu originariamente.
5. O efeito jurídico da anulação de votos prevista no art. 222 do Código Eleitoral não retroage à data da eleição, mas efetiva-se na data de nova totalização determinada pela Junta Eleitoral nas eleições municipais.
6. A Junta Eleitoral, no exercício da respectiva competência para expedição de diploma, não pode mitigar o direito do partido político de manter o número de cadeiras obtidas nas eleições proporcionais, salvo nas hipóteses de anuência ou de justa causa previstas no § 6º do art. 17 da Constituição Federal. [...]."

Ac. de 12/11/2024 na TutCautAnt n. 061337221, rel. Min. Floriano de Azevedo Marques, red. designado Min. Nunes Marques.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-REspEl n. 060009522",
   title:"Suspensão de inelegibilidade imposta em AIJE exige pedido expresso e autônomo — não é efeito automático de liminar",
   proc:"AIJE (Ação de Investigação Judicial Eleitoral) — tutela cautelar antecedente sobre reconducão ao cargo e suspensão de inelegibilidade · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE decidiu que a jurisprudência exige pedido e deferimento expressos e específicos para a suspensão da inelegibilidade imposta como cominação autônoma em AIJE. A liminar que reconduziu o candidato ao cargo de prefeito — fundada em risco de descontinuidade administrativa — não produz efeito automático sobre a inelegibilidade, pois esta não foi objeto de pedido nem de causa de pedir na tutela cautelar. Estender os efeitos da liminar à inelegibilidade sem pedido configuraria decisão extra petita, violando o art. 492 do CPC e os princípios da inércia da jurisdição e do contraditório.",
   fund:"Art. 26, LC 64/1990; art. 492, CPC; princípios da inércia da jurisdição e do contraditório",
   imp:"Ao protocolar tutela cautelar antecedente em recurso de AIJE que tenha imposto cassação do mandato E inelegibilidade: formular dois pedidos autônomos e expressos — (a) recondução ao cargo, com causa de pedir na descontinuidade administrativa; (b) suspensão da inelegibilidade, com causa de pedir própria. A ausência do segundo pedido inviabiliza qualquer efeito da liminar sobre a inelegibilidade.",
   ref:"Rel. Min. André Ramos Tavares, red. designada Min. Isabel Gallotti · julgado em 6/5/2025",
   integra:`"Eleições 2024. [...] Inelegibilidade por abuso do poder econômico e captação ilícita de sufrágio. Limites objetivos da liminar concedida em tutela cautelar antecedente para recondução ao cargo. Ausência de pedido e deferimento específicos e expressos quanto à suspensão da inelegibilidade. Impossibilidade de extensão da suspensão à inelegibilidade aplicada de forma autônoma em AIJE. [...]

2. A questão em discussão consiste em verificar se a liminar concedida em tutela cautelar antecedente nas ações de investigação judicial eleitoral, que reconduziu o agravado ao cargo de prefeito, teve como efeito também a suspensão da inelegibilidade imposta nas AIJEs, ainda que não tenha havido pedido expresso nesse sentido.

3. A jurisprudência do TSE exige pedido e deferimento expressos e específicos para a suspensão da inelegibilidade imposta como cominação autônoma em AIJE, não se admitindo suspensão automática ou implícita com base em liminar que concede efeito suspensivo a recurso e verse apenas sobre a recondução do candidato ao cargo.

4. Na petição inicial da tutela cautelar antecedente, [...] não há pedido e tampouco causa de pedir de suspensão da inelegibilidade imposta nas AIJEs, de modo que a liminar deferida se restringiu à recondução do agravado ao cargo de prefeito, com base no risco de descontinuidade administrativa, sem qualquer menção à inelegibilidade.

5. O deferimento da liminar para permitir o exercício do cargo até o julgamento do recurso especial nas AIJEs não permite extensão automática de efeitos à inelegibilidade, sob pena de decisão extra petita, em violação ao art. 492 do CPC e aos princípios da inércia da jurisdição e do contraditório. [...]."

Ac. de 6/5/2025 no AgR-REspEl n. 060009522, rel. Min. André Ramos Tavares, red. designada Min. Isabel Gallotti.`},

  {cat:"Processual", risk:"Máxima", info:"TSE n. 8 · mai 2025",
   num:"REspEl n. 060035943",
   title:"Uso de julgados criados por IA generativa configura litigância de má-fé — 3 teses",
   proc:"Impugnação de registro de candidatura (IRRC) de prefeito eleito com incidente de litigância de má-fé · Recurso especial eleitoral · Eleições 2024",
   tese:"O TSE firmou três teses: (1) a realização de eleições pelo sistema majoritário não acarreta a perda do objeto recursal quando o recurso discute sanção (multa por má-fé) que não influencia o resultado do pleito; (2) o uso, emprego ou citação, em expediente processual, de julgados inexistentes no repositório de jurisprudência dos Tribunais — criados mediante IA generativa ou não — configura litigância de má-fé (art. 80, II, CPC: falsidade dos fatos com intenção de induzir o juízo a erro), possibilitando a aplicação de multa; (3) somente as partes processuais respondem pela multa por litigância de má-fé; os danos oriundos da atuação do advogado são apurados em ação própria e/ou pelo órgão de classe, a quem a autoridade judicial deve oficiar — com comunicação também ao MPE.",
   fund:"Arts. 80, II, e 81, CPC; art. 77, §6º, CPC; art. 32, par. único, Lei 8.906/1994",
   imp:"NUNCA citar julgado sem verificar sua existência no sistema oficial do TSE (tse.jus.br/jurisprudencia) ou de qualquer outro Tribunal. IA generativa pode alucinar precedentes com aparência de veracidade. A multa recai sobre a PARTE — que pode cobrar do advogado em ação regressiva. OAB e MPE serão comunicados pelo próprio juízo.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 13/2/2025",
   integra:`"Eleições 2024. [...] Impugnação de registro de candidatura de prefeito eleito julgada improcedente com imposição de multa por litigância de má-fé. Utilização de julgados inexistentes criados por inteligência artificial. [...]

4. O acórdão regional, diante da incontroversa utilização, na impugnação apresentada pela ora recorrente, de precedentes judiciais inexistentes, manteve a conclusão da sentença acerca do falseamento da verdade dos fatos com a intenção de induzir a erro o juízo (art. 80, II, do CPC). [...]

Mantida a multa por litigância de má-fé com determinação de ciência dos fatos à Ordem dos Advogados do Brasil e ao Ministério Público Eleitoral sobre a conduta da recorrente em fundamentar peça processual com base em julgados inexistentes no mundo jurídico, com o fim de induzir o juízo a erro, para que procedam como entender de direito.

Teses de julgamento:
1. A realização de eleições regidas pelo sistema majoritário não acarreta a perda do objeto recursal que visa a discutir sanção que não influencia a realização ou o resultado do pleito.
2. O uso, o emprego ou a citação, em expediente processual, de julgados inexistentes no repositório de jurisprudência dos Tribunais (criados mediante o uso de inteligência artificial generativa ou não) possibilita a aplicação de multa por litigância de má-fé.
3. Somente as partes processuais (autor, réu ou interveniente, em sentido amplo) podem — e devem — responder por litigância de má-fé, sujeitando-se à condenação ao pagamento da multa e à indenização de que trata o art. 81 do CPC, devendo os eventuais danos oriundos da atuação do advogado ser apurados em ação própria e/ou pelo respectivo órgão de classe, a quem a autoridade judicial oficiará."

Ac. de 13/2/2025 no REspEl n. 060035943, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Partido político", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"PC-PP n. 060066475",
   origem:"TSE",
   title:"Fundo Partidário: ausência de repasse aos diretórios estaduais e municipais = irregularidade grave",
   origem:"TSE (origem)",
   proc:"Prestação de contas partidária anual — diretório nacional · Exercício financeiro de 2019 · Processo de prestação de contas de partido político (PC-PP)",
   tese:"O TSE reiterou que a concentração de recursos do Fundo Partidário pelo diretório nacional, com ausência de repasse aos diretórios estaduais e municipais, constitui irregularidade grave apta a ensejar, por si só, a desaprovação das contas. O repasse não é mera recomendação da Asepa nem decisão interna do partido: é dever legal decorrente do princípio democrático e dos arts. 17, I, da CF e 44, I, da Lei dos Partidos Políticos. O entendimento é iterativo na jurisprudência do TSE.",
   fund:"Art. 17, I, CF; art. 44, I, Lei 9.096/1995; Res. TSE 23.546/2017",
   imp:"Na elaboração e conferência de prestações de contas partidárias: documentar os repasses percentuais aos diretórios estaduais e municipais com comprovantes bancários e demonstrativos. A ausência de qualquer repasse — ou repasse manifestamente insuficiente — é motivo autônomo de desaprovação, independentemente de outros vícios.",
   ref:"Rel. Min. André Mendonça · julgado em 15/5/2025",
   integra:`"Prestação de contas. Exercício financeiro de 2019. [...] Ausência de repasses de recursos do Fundo Partidário para diretórios estaduais e municipais. Gravidade. [...]

3.1 A jurisprudência desta Corte Superior é de que constitui irregularidade grave a concentração de recursos do Fundo Partidário pelo diretório nacional e a consequente ausência de repasse aos diretórios estaduais e municipais.

3.2 Na contramão do que alega o partido, o repasse de verbas não constitui mera recomendação da Assessoria de Exame de Contas Eleitorais e Partidárias (Asepa) e tampouco decisão restrita à política interna da agremiação, configurando dever decorrente do princípio democrático e das disposições do art. 17, inciso I, da Constituição Federal de 1988 e do art. 44, inciso I, da Lei dos Partidos Políticos.

3.3 Irregularidade de natureza grave, apta a ensejar, por si só, a desaprovação das contas, nos termos da iterativa jurisprudência do TSE. [...]."

Ac. de 15/5/2025 na PC-PP n. 060066475, rel. Min. André Mendonça.`},

  {cat:"Partido político", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"PC-PP n. 060066475",
   title:"Reembolso a pessoas físicas sem comprovação de vínculo com atividade partidária = despesa não comprovada",
   origem:"TSE (origem)",
   proc:"Prestação de contas partidária anual — diretório nacional · Exercício financeiro de 2019 · PC-PP (mesma ação do item anterior)",
   tese:"O TSE reiterou que a apresentação de documentação fiscal e declarações unilaterais elaboradas pelo próprio partido não é suficiente para regularizar despesas com reembolso a pessoas físicas a ele ligadas, quando ausente a comprovação objetiva do vínculo dos gastos com atividades partidárias. Despesas cujos documentos, em razão dos termos genéricos em que redigidos, não permitem identificar sua vinculação a atividades partidárias são consideradas não comprovadas.",
   fund:"Jurisprudência consolidada do TSE — Res. TSE sobre prestação de contas partidária",
   imp:"Para cada reembolso a pessoa física: documentar a atividade partidária específica a que se refere (evento, reunião, deslocamento, etc.), com data, local, pauta e relação com os objetivos do partido. Documentos internos genéricos não bastam — obter recibos dos beneficiários com descrição objetiva da atividade.",
   ref:"Rel. Min. André Mendonça · julgado em 15/5/2025",
   integra:`"Prestação de contas. Exercício financeiro de 2019. [...] Dispêndio com reembolso para pessoas físicas. Ausência de comprovação de vínculo com atividades partidárias. [...] Contas desaprovadas. [...]

4. Despesas com reembolso.
4.1 A apresentação de documentação fiscal e declarações unilaterais não é suficiente para regularizar despesas com reembolso a pessoas físicas ligadas ao partido quando ausente a comprovação do vínculo dos gastos com atividades partidárias.
4.2 Conforme orientação consolidada nesta Corte Superior, 'consideram-se não comprovadas as despesas cujos documentos fiscais ou recibos, em razão dos termos genéricos em que redigidos, não permitem identificar [...] sua vinculação a atividades partidárias' [...]."

Ac. de 15/5/2025 na PC-PP n. 060066475, rel. Min. André Mendonça.`},

  {cat:"Partido político", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"PC-PP n. 060066475",
   title:"Fundo Partidário não pode ser utilizado para pagamento de multas, juros ou correção monetária",
   origem:"TSE (origem)",
   proc:"Prestação de contas partidária anual — diretório nacional · Exercício financeiro de 2019 · PC-PP (mesma ação dos dois itens anteriores)",
   tese:"O TSE reiterou que o art. 17, §2º, da Res. TSE 23.546/2017 veda expressamente a utilização de recursos do Fundo Partidário para pagamentos de multa de mora, atualização monetária ou juros. Qualquer despesa dessa natureza lançada com recursos do Fundo Partidário é glosada na prestação de contas.",
   fund:"Art. 17, §2º, Res.-TSE n. 23.546/2017",
   imp:"Encargos financeiros, multas de mora e juros de qualquer natureza devem ser suportados por outras fontes de receita do partido (receitas próprias, doações, outros). Ao revisar a prestação de contas, classificar corretamente todas as despesas e identificar qualquer encargo que tenha sido pago com recursos do Fundo Partidário.",
   ref:"Rel. Min. André Mendonça · julgado em 15/5/2025",
   integra:`"Prestação de contas. Exercício financeiro de 2019. [...] Despesas com pagamento de multas. [...]

5.1 O art. 17, § 2º, da Res.-TSE n. 23.546/2017 dispõe que os recursos do Fundo Partidário não podem ser utilizados para pagamentos de multa de mora, atualização monetária ou juros. [...]."

Ac. 15/5/2025 na PC-PP n. 060066475, rel. Min. André Mendonça.`},

  {cat:"Partido político", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"ED-PC n. 060021809",
   origem:"TSE",
   title:"Contas partidárias: documentação unilateral é insuficiente e novos documentos em alegações finais são inadmissíveis após inércia",
   origem:"TSE (origem)",
   proc:"Prestação de contas partidária anual — Partido Socialista Brasileiro, exercício financeiro de 2018 · Embargos de declaração em prestação de contas de partido político (ED-PC)",
   tese:"O TSE reiterou duas regras: (1) a apresentação de documentos elaborados unilateralmente pela agremiação, desacompanhados de provas emitidas pelos fornecedores e prestadores de serviços, não é apta para sanar irregularidades na comprovação de despesas pagas com Fundo Partidário; (2) a jurisprudência do TSE não admite a juntada de documentos com alegações finais quando o partido já foi intimado para prestar diligências e quedou inerte. Ambos os entendimentos são reiterados em vários precedentes.",
   fund:"Jurisprudência reiterada do TSE — princípio da preclusão processual e da bilateralidade da prova",
   imp:"Na gestão do contencioso de prestações de contas partidárias: (a) sempre obter documentos diretamente dos fornecedores e prestadores — notas fiscais, recibos com CNPJ, contratos; (b) nunca ignorar intimações para diligências, pois a inércia impede qualquer juntada posterior em alegações finais ou embargos.",
   ref:"Rel. Min. Nunes Marques · julgado em 9/5/2025",
   integra:`"[...] Prestação de contas anual. Diretório nacional do Partido Socialista Brasileiro. Exercício financeiro de 2018. [...]

4. A apresentação de documentos elaborados unilateralmente pela agremiação, desacompanhados de provas emitidas pelos fornecedores e prestadores de serviços, não é apta para sanar irregularidades na comprovação de despesas pagas com Fundo Partidário. Precedentes.

5. A jurisprudência do TSE não admite a juntada de documentos com alegações finais quando o partido já foi intimado para prestar diligências. Precedentes. [...]."

Ac. de 9/5/2025 nos ED-PC n. 060021809, rel. Min. Nunes Marques.`},

  {cat:"Pesquisa eleitoral", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060008304",
   title:"Enquete apresentada como pesquisa nas redes sociais = pesquisa eleitoral; multa independe de potencialidade lesiva",
   proc:"Representação por divulgação de pesquisa eleitoral sem prévio registro na Justiça Eleitoral · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que o modo de apresentação dos dados é essencial para a caracterização como pesquisa eleitoral: enquetes apresentadas como pesquisas surtem o mesmo efeito e, assim, devem ser tratadas como tais. Para fins de aplicação da multa do art. 33, §3º, da Lei 9.504/1997, basta que a pesquisa sem registro prévio tenha sido dirigida ao conhecimento público — não importa o número de pessoas atingidas nem a aptidão para desequilibrar o pleito, sendo desnecessária a demonstração de potencialidade lesiva.",
   fund:"Art. 33, §3º, Lei 9.504/1997",
   imp:"Qualquer publicação nas redes sociais que simule ou se apresente como pesquisa de intenção de votos deve ter registro prévio na Justiça Eleitoral, independentemente de ser chamada de 'enquete', 'votação', 'poll' ou similar. Orientar equipes de comunicação digital dos candidatos e partidos sobre essa exigência para as eleições de 2026.",
   ref:"Rel. Min. André Mendonça · julgado em 22/5/2025",
   integra:`"Eleições 2024. [...] Pesquisa eleitoral sem prévio registro. Divulgação. Rede social. Procedência. Elementos caracterizadores. Potencialidade lesiva. Desnecessidade. [...]

1. A decisão recorrida harmoniza-se com a orientação deste Tribunal Superior de que 'o modo de apresentação dos referidos dados é essencial para a sua caracterização como pesquisa eleitoral. Como restou assinalado, enquetes apresentadas como pesquisas surtem o efeito delas e, assim sendo, devem ser tratadas como tais' [...].

2. Estão sujeitos ao pagamento de multa, nos termos do art. 33, § 3º, da Lei n. 9.504/1997, todos aqueles que divulgam pesquisa de intenção de votos sem prévio registro na Justiça Eleitoral. Precedente.

3. Basta que a pesquisa eleitoral sem registro prévio tenha sido dirigida para conhecimento público, não importando o número de pessoas atingidas ou a aptidão para desequilibrar o pleito [...]."

Ac. de 22/5/2025 no AgR-AREspE n. 060008304, rel. Min. André Mendonça.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-REspEl n. 060009970",
   title:"Jingle com número de urna + imagens de lançamento de pré-candidatura = propaganda eleitoral antecipada",
   proc:"Representação por propaganda eleitoral antecipada · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE firmou a tese de que a veiculação de jingle com menção ao número de urna, aliada a imagens do lançamento de pré-candidatura, configura propaganda eleitoral antecipada. A menção ao número de urna é elemento identificador direto da candidatura e apresenta a mesma carga semântica do pedido explícito de voto. A jurisprudência do TSE reconhece que a propaganda antecipada pode ser caracterizada tanto pelo pedido explícito quanto pela utilização de expressões com sentido semântico equivalente (palavras mágicas), incluindo referências ao número de urna.",
   fund:"Art. 36-A, Lei 9.504/1997",
   imp:"Orientar pré-candidatos e suas equipes de comunicação: o número de urna é identificador tão direto quanto o pedido de voto e não pode ser mencionado em jingles, materiais ou publicações antes do início do período de campanha. Verificar todo o conteúdo sonoro e audiovisual produzido na pré-campanha.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 9/5/2025",
   integra:`"[...] Representação por propaganda eleitoral antecipada. Postagem. Configuração do pedido explícito de voto mediante a utilização de 'palavras mágicas'. Menção expressa ao número de urna. [...]

A jurisprudência do TSE é firme no sentido de que a propaganda eleitoral antecipada prevista no art. 36-A da Lei n. 9.504/1997 pode se caracterizar pela utilização de expressões que contenham o mesmo sentido semântico do pedido explícito de voto. [...]

Tese de julgamento: A veiculação de jingle com menção ao número de urna aliado às imagens concernentes ao lançamento da pré-candidatura do agravante configura propaganda eleitoral antecipada. [...]."

Ac. de 9/5/2025 no AgR-REspEl n. 060009970, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"Ag-AREspE n. 060007809",
   title:"'Pode confiar na gente' e 'honrar essa confiança' = palavras mágicas configuradoras de propaganda antecipada",
   proc:"Representação por propaganda eleitoral antecipada · Agravo em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE manteve a condenação por propaganda eleitoral antecipada em razão da veiculação, no Instagram, das expressões 'pode confiar na gente' e 'a gente vai honrar essa confiança', proferidas em ambiente nitidamente eleitoral — com a proximidade do pleito e o diálogo estabelecido com possível eleitora. A jurisprudência reconhece que o pedido explícito de voto pode ser caracterizado por expressões com sentido semântico equivalente, não sendo necessário o pedido literal de voto.",
   fund:"Art. 36-A, Lei 9.504/1997; art. 3º-A, par. único, Res. TSE 23.610/2019",
   imp:"Revisar toda a produção de conteúdo dos pré-candidatos nas redes sociais quanto ao uso de expressões que possam ser interpretadas como pedido de voto, especialmente no contexto de proximidade com o pleito: 'pode confiar', 'vamos juntos', 'honrar a confiança', 'conto com seu apoio', 'faremos diferente' etc. O contexto (proximidade das eleições, público eleitor, plataforma de grande alcance) potencializa a caracterização.",
   ref:"Rel. Min. André Ramos Tavares · julgado em 15/5/2025",
   integra:`"[...] Eleições 2024. Representação. Propaganda eleitoral antecipada. Veiculação em perfil de rede social. Pedido explícito de voto. Uso de palavras com sentido semântico equivalente. Art. 3º-A, parágrafo único, da Res.-TSE n. 23.610/2019. Ilícito caracterizado. [...]

2. No caso, conforme o contexto fático delineado no acórdão regional, as expressões 'pode confiar na gente' e 'a gente vai honrar essa confiança', veiculadas em vídeo divulgado em perfil da rede social Instagram, foram proferidas em ambiente nitidamente eleitoral, considerando a proximidade do pleito e o diálogo estabelecido com possível eleitora.

3. A jurisprudência do TSE reconhece que o pedido explícito de votos, ensejador da propaganda antecipada irregular, pode ser caracterizado por expressões com sentido semântico equivalente, tais como 'vamos juntos' e 'conto com o seu apoio'. [...]."

Ac. de 15/5/2025 no Ag-AREspE n. 060007809, rel. Min. André Ramos Tavares.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060013204",
   title:"Evento aberto ao público com adereços partidários publicado no Instagram = propaganda eleitoral antecipada",
   proc:"Representação por propaganda eleitoral antecipada · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE manteve a condenação por propaganda antecipada decorrente da publicação, no Instagram, de fotos e vídeos do evento de lançamento de pré-candidatura a prefeito, com as expressões 'vamos juntos, vamos na vitória' e 'fazer a melhor gestão'. O evento ocorreu com portões abertos, quantidade expressiva de pessoas com bandeiras e adereços com cores e número do partido, com ares de comício. O pedido de apoio político em evento intrapartidário poderia ser tolerado; mas quando veiculado em rede social atingindo o eleitorado em geral, associado ao lançamento da candidatura, equivale a pedido explícito de votos.",
   fund:"Art. 36-A, caput e §2º, Lei 9.504/1997",
   imp:"Eventos de lançamento de pré-candidatura: não publicar nas redes sociais fotos ou vídeos que contenham adereços partidários (bandeiras, camisetas com número do partido) associados a expressões de sentido equivalente ao pedido de voto. O caráter aberto do evento e o alcance das redes sociais eliminam a proteção conferida aos eventos intrapartidários.",
   ref:"Rel. Min. André Ramos Tavares · julgado em 13/5/2025",
   integra:`"[...] Eleições 2024. Representação. Propaganda eleitoral irregular antecipada. Publicação. Internet. Rede social. Vídeos e fotos do evento de lançamento de pré-candidatura. Pedido explícito de votos. Uso de palavras e expressões com sentido semântico equivalente. Evento aberto ao público. Adereços com cores e número do partido. [...]

3. Nesse cenário, é importante ressaltar que o uso das referidas expressões exclusivamente no contexto de evento intrapartidário poderia, a princípio, ser considerado como mero pedido de apoio político, permitido no período de pré-campanha nos termos do art. 36-A, caput e § 2º, da Lei n. 9.504/1997, desde que não estivessem presentes outros elementos que evidenciassem a antecipação da campanha eleitoral propriamente dita.

4. No caso, contudo, a veiculação das referidas expressões por meio de rede social, atingindo o eleitorado de forma geral, associadas de forma clara à divulgação da futura candidatura, configura hipótese equivalente a pedido explícito de votos.

5. Ademais, [...] 'tampouco me parece que o evento se tratou de simples convenção intrapartidária para lançamento de pré-candidatura em ambiente fechado. Ao contrário, as imagens do vídeo demonstram o lugar com portões abertos e quantidade expressiva de pessoas com bandeiras e adereços que claramente fazem referência a cor e ao número do partido do candidato, com ares de comício'. [...]."

Ac. de 13/5/2025 no AgR-AREspE n. 060013204, rel. Min. André Ramos Tavares.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060005631",
   title:"Eventos tipo comício com palavras mágicas: multa pode ser fixada acima do mínimo legal quando devidamente fundamentada",
   proc:"Representação por propaganda eleitoral antecipada · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE manteve a multa fixada em patamar intermediário — acima do mínimo legal — por propaganda antecipada decorrente de eventos com grandes aglomerações, cânticos de apoio, locutores e palco, com expressões de carga semântica equivalente ao pedido de voto, veiculados em rede social. O porte dos eventos violou o princípio da igualdade de oportunidades entre os candidatos, fundamento autônomo de propaganda antecipada. A Súmula 30 do TSE obsta a revisão da multa fixada acima do mínimo quando a decisão estiver devidamente fundamentada.",
   fund:"Art. 36-A, Lei 9.504/1997; Súmula 30/TSE",
   imp:"Comícios de pré-candidatura — ainda que denominados 'lançamentos', 'festas de apoio' ou 'encontros partidários' — representam risco elevado de multa acima do mínimo legal, especialmente quando veiculados nas redes sociais. O princípio da igualdade de oportunidades é fundamento autônomo, independente das palavras mágicas.",
   ref:"Rel. Min. Floriano de Azevedo Marques · julgado em 9/5/2025",
   integra:`"Eleições 2024. [...] Representação. Propaganda eleitoral antecipada. Realização de eventos assemelhados a comícios. Utilização de expressões com carga semântica equivalente a pedido explícito de voto. Violação ao princípio da igualdade de oportunidades entre os candidatos. Divulgação em rede social. [...] Possibilidade de aplicação de multa acima do mínimo legal. [...]

3. Segundo a Corte de origem, houve violação ao princípio da igualdade de condições entre os candidatos, pois os eventos promovidos pelos agravantes incluíram grandes aglomerações, cânticos de apoio e a utilização de locutores para animar o público, tendo ao menos um deles sido realizado em espaço aberto e devidamente organizado, com expressivo apoio da multidão e instalação de um palco com banner do pré-candidato. [...]

5. Incide a Súmula n. 30 do TSE quanto à regularidade da fixação da multa na quantia intermediária prevista no dispositivo legal, de acordo com o livre convencimento fundamentado do juízo, a partir das circunstâncias do caso concreto, e com relação à impossibilidade de redução de multa aplicada acima do mínimo legal quando a decisão estiver devidamente fundamentada. [...]."

Ac. de 9/5/2025 no AgR-AREspE n. 060005631, rel. Min. Floriano de Azevedo Marques.`},

  {cat:"Propaganda", risk:"Máxima", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060043922, 060016681 e 060013358",
   title:"Endereços eletrônicos das redes sociais devem ser declarados no RRC ou DRAP — comunicação posterior não elide a multa (3 julgados reiterados)",
   proc:"Representação por propaganda eleitoral irregular (ausência de comunicação de endereço eletrônico) · Agravo regimental em agravo em recurso especial eleitoral · 3 julgados distintos — Instagram, TikTok e outros · Eleições 2024",
   tese:"O TSE reiterou, em três julgados distintos, que a comunicação dos endereços eletrônicos das redes sociais utilizados para propaganda eleitoral deve ocorrer impreterivelmente no Requerimento de Registro de Candidatura (RRC) ou no Demonstrativo de Regularidade de Atos Partidários (DRAP), nos prazos previstos no art. 28, §1º, I e II, da Res. TSE 23.610/2019. A comunicação posterior não elide a irregularidade já configurada. A ausência ou o atraso na comunicação configura conduta objetiva que ofende a transparência do processo eleitoral, sendo irrelevante a ausência de dolo.",
   fund:"Art. 57-B, IV, §§1º e 5º, Lei 9.504/1997; art. 28, §1º, Res. TSE 23.610/2019",
   imp:"Checklist obrigatório em 2026: ao protocolar o RRC e o DRAP, listar TODOS os perfis ativos nas redes sociais do candidato (Instagram, Facebook, TikTok, Twitter/X, YouTube, WhatsApp Business, Threads etc.). Criar protocolo de verificação periódica para identificar novos perfis criados após o protocolo e comunicar imediatamente à Justiça Eleitoral.",
   ref:"Rel. Min. André Mendonça (060043922, 20/5); Rel. Min. Antonio Carlos Ferreira (060016681, 9/5); Rel. Min. André Ramos Tavares (060013358, 9/5) · 2025",
   integra:`Três julgados reiterados com o mesmo entendimento:

"Eleições 2024. [...] Irregularidade na propaganda eleitoral. Endereço eletrônico não comunicado à Justiça Eleitoral. Art. 57-B da Lei n. 9.504/1997. Multa. [...] Na linha da jurisprudência desta Corte Superior, a comunicação do endereço eletrônico das redes sociais do candidato à Justiça Eleitoral deverá ocorrer impreterivelmente no Requerimento de Registro de Candidatura (RRC) ou no Demonstrativo de Regularidade de Atos Partidários (Drap), sob pena de incidência da multa prevista no § 5º do art. 57-B da Lei das Eleições. [...]."
Ac. de 20/5/2025 no AgR-AREspE n. 060043922, rel. Min. André Mendonça.

"[...] Eleições 2024. Representação. Propaganda eleitoral irregular. Comunicação tardia do endereço eletrônico de campanha. Imposição de multa. Art. 57-B, IV, §§ 1º e 5º, da Lei n. 9.504/1997. [...] 4. A ausência de comunicação do endereço eletrônico da rede social utilizada na campanha ou sua comunicação tardia justifica a imposição da multa a que alude o art. 57-B da Lei n. 9.504/1997, tratando-se de conduta objetiva que ofende a transparência do processo eleitoral e o acesso à informação do eleitorado. Precedente. [...]."
Ac. de 9/5/2025 no AgR-AREspE n. 060013358, rel. Min. André Ramos Tavares.

Também: Ac. de 9/5/2025 no AgR-AREspE n. 060016681, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Propaganda", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060034538",
   title:"Compartilhamento de vídeo crítico em grupos privados de WhatsApp sem ampla circulação = crítica política legítima",
   proc:"Representação por propaganda eleitoral irregular · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE manteve a improcedência da representação e reiterou que a atuação da Justiça Eleitoral para restringir a propaganda eleitoral e a liberdade de expressão deve ser medida excepcional. A divulgação de vídeo com críticas políticas em grupos privados de WhatsApp não configura propaganda eleitoral irregular quando: (a) o conteúdo permanece no campo da crítica política legítima; (b) não há prova de ofensas que ultrapassem os limites do debate democrático; (c) a divulgação se deu em grupos privados sem comprovação de ampla disseminação ou impacto eleitoral relevante.",
   fund:"Art. 33, §2º, Res. TSE 23.610/2019; liberdade de expressão e direito à informação",
   imp:"Em defesas contra representações por conteúdo em grupos privados de WhatsApp: demonstrar (a) o caráter efetivamente privado e fechado do grupo; (b) a ausência de prova de disseminação ampla e de impacto eleitoral concreto; (c) o caráter opinativo — não factual inverídico — do conteúdo. A simples difusão em grupo privado, sem prova de impacto, não é suficiente para caracterizar propaganda irregular.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 20/5/2025",
   integra:`"Eleições 2024. [...] Propaganda eleitoral irregular. Compartilhamento de vídeo em grupos privados de WhatsApp. Liberdade de expressão. Ausência de prova de ampla circulação ou impacto no pleito. [...]

De acordo com a moldura fática descrita no aresto regional, o conteúdo veiculado permanece no campo da crítica política legítima, não havendo comprovação de ofensas que ultrapassem o limite do debate democrático, e a divulgação se deu em grupos privados do aplicativo WhatsApp, sem comprovação de ampla disseminação ou impacto eleitoral relevante, o que afasta a caracterização de propaganda eleitoral irregular, à luz do art. 33, § 2º, da Res.-TSE n. 23.610/2019. [...]

Consoante jurisprudência desta Corte, a atuação da Justiça Eleitoral para restringir a propaganda eleitoral e a liberdade de expressão, com a remoção de conteúdos, deve ser medida excepcional, sob pena do comprometimento do próprio direito do eleitor ao acesso à informação. [...]."

Ac. de 20/5/2025 no AgR-AREspE n. 060034538, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060005821",
   title:"WhatsApp com 438 participantes: divulgar informações sigilosas e imputar crime sem prova = multa art. 57-D",
   proc:"Representação por propaganda eleitoral irregular (ofensa à honra na internet) · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE manteve a multa por propaganda irregular. O agravante divulgou, em grupo de WhatsApp com 438 participantes (dedicado a comentários políticos), arquivos com informações processuais sigilosas e imagem de pré-candidato sugerindo a prática de crime de estupro, sem apresentar prova concreta do ilícito. A multa do art. 57-D, §2º, aplica-se à hipótese de ofensa à honra via internet independentemente de anonimato. O elemento determinante é o conteúdo ofensivo e a ausência de prova — não apenas o porte do grupo.",
   fund:"Art. 57-D, caput e §2º, Lei 9.504/1997",
   imp:"O porte do grupo é relevante como contexto, mas não é o elemento determinante: o conteúdo (imputação de crime sem prova + informações sigilosas) é que configura o ilícito. Qualquer divulgação de imputação criminal sem prova — mesmo em grupos menores — pode ser enquadrada no art. 57-D se identificado o agente.",
   ref:"Rel. Min. Isabel Gallotti · julgado em 9/5/2025",
   integra:`"Eleições 2024. Prefeito. [...] Representação. Propaganda eleitoral irregular. Internet. Art. 57-D, caput e § 2º, da Lei n. 9.504/1997. Publicação. Rede social. WhatsApp. Prática de ilícitos. Ofensa à honra. Configuração. [...]

Nos termos do art. 57-D, caput, da Lei n. 9.504/1997 e da jurisprudência do TSE, no curso das campanhas eleitorais, a regra é a liberdade de manifestação do pensamento, inclusive na rede mundial de computadores, sendo certo que há transgressão dessa garantia constitucional na hipótese em que se veiculam mensagens ofensivas à honra, inverídicas, que configurem discurso de ódio ou ideias contrárias à ordem constitucional e ao Estado Democrático.

3. A multa prevista no art. 57-D, § 2º, da Lei n. 9.504/1997 é cabível na hipótese de abuso da liberdade de manifestação do pensamento em propaganda eleitoral na internet, independentemente da situação de anonimato.

4. No caso, o agravante divulgou em grupo de WhatsApp com 438 participantes, destinado a comentários de temas políticos, arquivos com informações processuais sigilosas e imagem de pré-candidato sugerindo que ele teria cometido crime de estupro, mas sem apresentar provas concretas do ilícito e de suposta condenação. [...]."

Ac. de 9/5/2025 no AgR-AREspE n. 060005821, rel. Min. Isabel Gallotti.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-REspEl n. 060004711",
   title:"Multa art. 57-D por desinformação não se limita ao anonimato — agente identificado também responde",
   proc:"Representação por propaganda eleitoral irregular (desinformação na internet) · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE firmou a orientação de que a multa prevista no art. 57-D, §2º, da Lei 9.504/1997 não se limita aos casos de anonimato, sendo plenamente aplicável quando há divulgação de conteúdo sabidamente falso por agente identificado. A liberdade de expressão não é absoluta e não pode ser utilizada para a disseminação de informações falsas que comprometam a integridade do processo eleitoral. A interpretação do dispositivo visa garantir a eficácia do bem jurídico tutelado — a honra dos candidatos e a lisura do pleito.",
   fund:"Art. 57-D, §2º, Lei 9.504/1997",
   imp:"Candidatos e equipes de campanha que divulgam fatos sabidamente falsos sobre adversários — mesmo identificados — respondem pela multa do art. 57-D, §2º. Toda informação factual sobre adversários utilizada em materiais de campanha deve ter fonte verificável e o candidato deve ter certeza razoável de sua veracidade antes da divulgação.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 15/5/2025",
   integra:`"Eleições 2024. [...] Propaganda eleitoral irregular na internet. Divulgação de conteúdo sabidamente falso. Aplicação de multa prevista no art. 57-D da Lei n. 9.504/1997. Possibilidade. [...]

A liberdade de expressão não é absoluta e não pode ser utilizada para disseminação de informações falsas que comprometam a integridade do processo eleitoral. Precedente.

Este Tribunal Superior firmou orientação de que a multa prevista no art. 57-D da Lei n. 9.504/1997 não se limita aos casos de anonimato, sendo aplicável também às situações em que há divulgação de conteúdo sabidamente falso por agente identificado. Precedente.

A interpretação conferida pelo TSE ao dispositivo legal busca garantir a eficácia do bem jurídico tutelado, protegendo a honra e a imagem dos candidatos e assegurando a lisura do pleito. [...]."

Ac. de 15/5/2025 no AgR-REspEl n. 060004711, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"REspEI n. 060007293",
   title:"Multa art. 57-D aplica-se ao HGPE de TV — interpretação teleológica amplia o alcance além da internet",
   proc:"Representação por propaganda eleitoral irregular (conteúdo inverídico e difamatório no horário eleitoral gratuito — televisão) · Recurso especial eleitoral inominado · Eleições 2024",
   tese:"O TSE reconheceu que a multa do art. 57-D, §2º, da Lei 9.504/1997 alcança a veiculação de informação inverídica e difamatória também no HGPE de televisão, não se restringindo à internet. O fundamento é a interpretação teleológica e sistemática do dispositivo, reforçada pelo entendimento já firmado de que a sanção alcança o carro de som — se alcança o carro de som, com mais razão alcança o HGPE televisivo, cujo alcance e potencial prejudicial são maiores. Os arts. 9º-C e 9º-H da Res. TSE 23.610/2019 proíbem fatos inverídicos em qualquer forma ou modalidade de propaganda.",
   fund:"Art. 57-D, §2º, Lei 9.504/1997; arts. 9º-C e 9º-H, Res. TSE 23.610/2019",
   imp:"Revisar todo afirmação factual sobre candidatos adversários presente no roteiro do HGPE antes de qualquer veiculação. A remoção posterior do conteúdo não impede a aplicação da multa. A interpretação a fortiori do TSE coloca o HGPE televisivo em patamar de maior risco do que o carro de som ou publicações na internet.",
   ref:"Rel. Min. Floriano de Azevedo Marques · julgado em 22/5/2025",
   integra:`"Eleições 2024. [...] Representação. Propaganda eleitoral irregular julgada procedente na origem. Extrapolação dos limites da liberdade de expressão. Difusão de fato sabidamente inverídico e gravemente ofensivo à honra e à imagem de candidato. Horário eleitoral gratuito. Violação ao art. 9º-C da Res.-TSE n. 23.610/2019. Interpretação teleológica e sistemática. Aplicação da multa prevista no art. 57-D, § 2º, da Lei n. 9.504/1997. [...]

3. No recente julgamento do Recurso Especial n. 0600036-54, de relatoria do Min. Antonio Carlos Ferreira, publicado no DJe de 11/4/2025, este Tribunal Superior Eleitoral rejeitou a tese de que o art. 57-D da Lei n. 9.504/1997 se restringe à aplicação de sanção aos casos de desinformação veiculada na internet, conferindo uma interpretação teleológica e sistemática ao dispositivo.

4. A partir da interpretação conferida por esta Corte ao art. 57-D da Lei n. 9.504/1997, que permitiu a aplicação da multa prevista no § 2º do referido dispositivo na hipótese de veiculação de informação inverídica em carro de som, com mais razão deve ser aplicada a sanção no caso em que esse tipo de conteúdo é veiculado no horário eleitoral gratuito na televisão, em violação ao art. 9º-C da Res.-TSE n. 23.610/2019, cujo alcance aos eleitores e potencial prejuízo à lisura do processo eleitoral se mostram mais evidente. [...]."

Ac. de 22/5/2025 no REspEI n. 060007293, rel. Min. Floriano de Azevedo Marques.`},

  {cat:"Propaganda", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-REspEl n. 060044163",
   title:"Fato controvertido sem falsidade objetiva e imediata não configura propaganda negativa por fato sabidamente inverídico",
   proc:"Representação por propaganda eleitoral negativa (fato sabidamente inverídico) · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE manteve a improcedência da representação, reiterando que a configuração de propaganda negativa fundada em fato sabidamente inverídico depende da demonstração imediata, inequívoca e objetiva da falsidade, sem necessidade de dilação probatória. O conteúdo politicamente incômodo ou severo, mas sem falsidade manifesta e objetivamente demonstrável, integra o debate democrático e está protegido pela liberdade de expressão. Manifestações opinativas no contexto eleitoral, ainda que severas, não se enquadram no art. 57-D.",
   fund:"Art. 57-D, Lei 9.504/1997; liberdade de expressão",
   imp:"Para propor representação por propaganda negativa fundada em fato inverídico: apresentar já na petição inicial a prova documental objetiva da falsidade, sem depender de dilação probatória. Fatos controvertidos — que exijam produção de prova para serem refutados — não atendem o requisito de falsidade manifesta. Na defesa: explorar o caráter controvertido ou opinativo do conteúdo.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 15/5/2025",
   integra:`"[...] Eleições 2024. Representação. Propaganda eleitoral negativa. Divulgação de informação controvertida sobre uso de fogos de artifício. Ausência de prova inequívoca de falsidade. [...]

A jurisprudência do TSE exige que a configuração de propaganda negativa por fato sabidamente inverídico dependa da demonstração imediata, inequívoca e objetiva da falsidade, sem necessidade de dilação probatória, o que, segundo o acórdão do Tribunal de origem, não ficou demonstrado nos autos. [...]

A decisão agravada observa o entendimento consolidado de que manifestações opinativas no contexto eleitoral, ainda que severas, integram o debate democrático e estão protegidas pela liberdade de expressão, salvo se comprovadamente falsas e dolosas. O conteúdo da publicação, embora politicamente incômodo, não apresenta falsidade manifesta nem extrapola os limites do discurso eleitoral legítimo, o que afasta a incidência do art. 57-D da Lei n. 9.504/1997. [...]."

Ac. de 15/5/2025 no AgR-REspEl n. 060044163, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Propaganda", risk:"Máxima", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060015307 e 060002792",
   title:"Impulsionamento de conteúdo negativo é vedado — o art. 57-C, §3º não admite exceções (2 julgados reiterados)",
   proc:"Representação por propaganda eleitoral irregular (impulsionamento de conteúdo negativo na internet) · Agravo regimental em agravo em recurso especial eleitoral · 2 julgados distintos · Eleições 2024",
   tese:"O TSE reiterou, em dois julgados distintos, que o impulsionamento de conteúdo de propaganda eleitoral na internet somente é admitido com a finalidade de promover ou beneficiar candidatos e suas legendas partidárias, não sendo permitido para a veiculação de conteúdo negativo — inclusive sob o viés de crítica a candidato adversário. A proibição é expressa no art. 57-C, §3º, da Lei 9.504/1997 e não viola a liberdade de expressão, pois não impede a crítica em si — apenas o seu impulsionamento pago.",
   fund:"Art. 57-C, §3º, Lei 9.504/1997",
   imp:"Regra absoluta para o gestor de tráfego pago da campanha: NUNCA impulsionar qualquer peça com conteúdo crítico a adversários, comparações desfavoráveis ou ataques. O impulsionamento é exclusivo para conteúdo positivo de promoção do candidato ou do partido. Verificar toda a política de impulsionamento configurada nas plataformas digitais.",
   ref:"Rel. Min. André Mendonça (060015307, 22/5); Rel. Min. Floriano de Azevedo Marques (060002792, 15/5) · 2025",
   integra:`Dois julgados com o mesmo entendimento:

"Eleições 2024. [...] Propaganda eleitoral irregular. Impulsionamento de conteúdo. Vedação na modalidade negativa. Art. 57-C, § 3º, da Lei n. 9.504/1997. [...]
2. O impulsionamento de conteúdo de propaganda eleitoral na internet somente é admitido com a finalidade de promover ou beneficiar candidatos e suas legendas partidárias, não sendo permitido para a veiculação de conteúdo negativo, inclusive sob o viés de crítica a candidato adversário, ex vi do art. 57-C da Lei n. 9.504/1997.
3. Consoante a compreensão firmada neste Tribunal Superior, 'a proibição de propagar, por meio de impulsionamento, propaganda eleitoral com conteúdo negativo não tolhe a garantia à liberdade de expressão'. [...]."
Ac. de 22/5/2025 no AgR-AREspE n. 060015307, rel. Min. André Mendonça.

"Eleições 2024. [...] Propaganda eleitoral antecipada negativa. Redes sociais. Impulsionamento de conteúdo. Críticas a adversário político. Utilização de meio proscrito pelo art. 57-C, § 3º, da Lei n. 9.504/1997. Ilícito caracterizado. [...]
5. A jurisprudência do Tribunal Superior Eleitoral é no sentido de que o impulsionamento de conteúdo de propaganda eleitoral na internet somente é admitido com a finalidade de promover ou beneficiar candidatos e suas legendas partidárias, não sendo permitido para a veiculação de conteúdo negativo, nem mesmo sob o viés de crítica a candidato adversário. [...]."
Ac. de 15/5/2025 no AgR-AREspE n. 060002792, rel. Min. Floriano de Azevedo Marques.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060011938",
   title:"Grafia do nome do vice em proporção inferior a 30% do titular: critério objetivo — multa independe de intenção",
   proc:"Representação por propaganda eleitoral irregular (material de campanha com nome do vice em proporção inferior ao mínimo legal) · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que a observância da proporção mínima de 30% do nome do vice-prefeito em relação ao nome do titular — estabelecida no art. 36, §4º, da Lei 9.504/1997 — é de aferição objetiva. Constatada a divulgação de material de publicidade sem o cumprimento dessa baliza normativa, impõe-se a aplicação da multa prevista no §3º do mesmo dispositivo, independentemente da intenção do candidato ou da boa-fé na produção dos materiais.",
   fund:"Art. 36, §3º e §4º, Lei 9.504/1997",
   imp:"Incluir no processo de aprovação de artes de campanha a verificação obrigatória da proporção do nome do vice em TODOS os materiais (santinhos, banners, outdoors, material digital, camisetas, objetos). A regra é objetiva: tamanho inferior a 30% gera multa automaticamente. Recomendável criar gabarito com a proporção mínima para uso pela equipe de comunicação.",
   ref:"Rel. Min. André Mendonça · julgado em 20/5/2025",
   integra:`"Eleições 2024. [...] Propaganda eleitoral irregular. Material de campanha. Grafia do nome do vice-prefeito em proporção inferior ao mínimo legal. Art. 36, § 4º, da Lei n. 9.504/1997. [...] Critério objetivo. [...]

2. O Tribunal Regional assentou a existência de material de campanha com a grafia do nome do vice-prefeito em proporção inferior ao mínimo legal de 30% em relação ao nome do titular, conforme fotografias que instruem os autos, em contrariedade ao art. 36, § 4º, da Lei n. 9.504/1997. [...]

3. Na linha da jurisprudência desta Corte Superior, a observância do art. 36, § 4º, da Lei n. 9.504/1997 é de aferição objetiva, de modo que, constatada divulgação de material de publicidade sem o cumprimento dessa baliza normativa, impõe-se a aplicação da multa prevista no § 3º do mesmo dispositivo legal [...]."

Ac. de 20/5/2025 no AgR-AREspE n. 060011938, rel. Min. André Mendonça.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-AREspE n. 060066249 e AgR-REspEI n. 060014080",
   title:"Efeito outdoor em fachada de comitê: banners ou placas acima de 4m² = propaganda irregular (2 julgados reiterados)",
   proc:"Representação por propaganda eleitoral irregular (efeito outdoor em fachada de comitê de campanha) · Agravo regimental em agravo em recurso especial eleitoral e em recurso especial eleitoral inominado · 2 julgados · Eleições 2024",
   tese:"O TSE reiterou, em dois julgados distintos, que a afixação de banners ou placas de propaganda em desacordo com os limites de 4m² estabelecidos no art. 39, §8º, da Lei 9.504/1997 e nos arts. 14 e 26 da Res. TSE 23.610/2019 caracteriza propaganda eleitoral irregular, mesmo quando fixados na fachada do comitê de campanha. O segundo julgado firmou tese expressa: a legislação eleitoral veda a propaganda em formato que gere efeito de outdoor, mesmo nas fachadas dos comitês, para evitar abuso e desequilíbrio na disputa.",
   fund:"Art. 39, §8º, Lei 9.504/1997; arts. 14 e 26, Res. TSE 23.610/2019",
   imp:"Ao planejar a montagem do comitê de campanha: dimensionar cada peça individualmente e garantir que nenhuma ultrapasse 4m². Fiscalizar os comitês adversários para eventual representação. Banners múltiplos de tamanho menor são permitidos, mas uma peça única de efeito outdoor não.",
   ref:"Rel. Min. André Ramos Tavares (060066249, 15/5); Rel. Min. Antonio Carlos Ferreira (060014080, 15/5) · 2025",
   integra:`Dois julgados com o mesmo entendimento:

"[...] Eleições 2024. Representação. Propaganda eleitoral irregular. Placas afixadas em comitê. Extrapolação do limite de 4m². Efeito outdoor. Art. 39, § 8º, da Lei n. 9.504/1997 e art. 26, § 1º, da Res.-TSE n. 23.610/2019. [...]
2. Consoante a jurisprudência do TSE, a afixação de banners ou placas de propaganda em desacordo com os limites impostos pelo § 8º do art. 39 da Lei n. 9.504/1997 e pelos arts. 14 e 26 da Res.-TSE n. 23.610/2019 caracteriza propaganda eleitoral irregular a atrair a aplicação da multa. [...]."
Ac. de 15/5/2025 no AgR-AREspE n. 060066249, rel. Min. André Ramos Tavares.

"[...] Propaganda eleitoral irregular. Efeito outdoor. [...] A configuração do efeito outdoor, mesmo em fachada de comitê de campanha, caracteriza propaganda irregular, conforme entendimento consolidado do TSE, uma vez que compromete o equilíbrio entre os candidatos. [...]
Tese de julgamento: A legislação eleitoral vetou a divulgação de propaganda em formato que se assemelhe ou gere efeito de outdoor, mesmo nas fachadas dos comitês, a fim de que sejam evitados o abuso e o desequilíbrio na disputa eleitoral. [...]."
Ac. de 15/5/2025 no AgR-REspEI n. 060014080, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Propaganda", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-REspEl n. 060014657",
   title:"Coligação majoritária tem legitimidade ativa para representar sobre propaganda das eleições proporcionais",
   proc:"Representação por propaganda eleitoral irregular — questão de legitimidade ativa · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que a única limitação à legitimidade de parte em representações eleitorais, por expressa disposição do art. 6º, §4º, da Lei 9.504/1997, é o ajuizamento de representação de forma isolada por partido coligado. Fora dessa hipótese, são legitimados para propor representação ou reclamação por descumprimento da Lei das Eleições: qualquer partido político, coligação, candidato e o Ministério Público. A coligação formada para a disputa majoritária tem legitimidade para propor representação sobre propaganda relativa às eleições proporcionais.",
   fund:"Art. 96, caput, Lei 9.504/1997; art. 6º, §4º, Lei 9.504/1997; art. 3º, caput, Res. TSE 23.547/2017",
   imp:"Na estratégia processual de campanha: a coligação formada para a disputa majoritária (chapa prefeito/vice) pode propor representações contra propaganda irregular de candidatos a vereador do campo adversário, sem necessidade de propor a ação em separado pelo partido.",
   ref:"Rel. Min. André Mendonça · julgado em 15/5/2025",
   integra:`"Eleições 2024. [...] Representação. Propaganda eleitoral irregular. Vereadores. Art. 96 da Lei das Eleições. Legitimidade ativa. Coligação majoritária. [...]

1. Como registrado na decisão ora agravada, nos termos do entendimento firmado por este Tribunal Superior, a única limitação possível à legitimidade de parte, por expressa disposição legal contida no art. 6º, § 4º, da Lei n. 9.504/1997, é o ajuizamento de representação, de forma isolada, por partido coligado.

2. Conforme a jurisprudência desta Corte Superior, 'são legitimados para propor representação ou reclamação relativa ao descumprimento dos preceitos da Lei das Eleições qualquer partido político, coligação, candidato e o Ministério Público, nos termos do art. 96, caput, da Lei n. 9.504/1997 e art. 3º, caput, da Res.-TSE n. 23.547/2017'. [...]

3. Consoante assentado no decisum ora combatido, impõe-se reconhecer a legitimidade da coligação ora agravada para propor a representação, ainda que tenha sido formada para a disputa majoritária e pretenda discutir a propaganda relativa às eleições proporcionais. [...]."

Ac. de 15/5/2025 no AgR-REspEl n. 060014657, rel. Min. André Mendonça.`},

  {cat:"Registro", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"AgR-RMS n. 060067319",
   title:"Número de vagas de vereadores se estabiliza na fase do registro de candidaturas — vedada alteração posterior",
   proc:"Mandado de segurança sobre definição do número de vagas da Câmara Municipal · Agravo regimental em recurso em mandado de segurança · Eleições 2024",
   tese:"O TSE reiterou que o número de vagas na Câmara Municipal se fixa no momento do registro de candidaturas e deve ser observado na etapa de diplomação. Ultrapassada a etapa de registro das candidaturas, revela-se inviável inaugurar discussão sobre eventual aumento do número de vagas a serem preenchidas na Câmara Municipal com base em alegado acréscimo populacional por projeção do IBGE. A diplomação dos eleitos deve seguir os critérios consolidados na fase do registro.",
   fund:"Jurisprudência consolidada do TSE — princípio da segurança jurídica no processo eleitoral",
   imp:"Em municípios que pretendam aumentar o número de vereadores com base no crescimento populacional (art. 29, IV, CF), o pleito judicial ou administrativo deve ser deduzido e decidido definitivamente ANTES do início do processo de registro de candidaturas. Após o registro, o número de vagas é imutável para aquele pleito.",
   ref:"Rel. Min. André Mendonça · julgado em 9/5/2025",
   integra:`"Eleições 2024. [...] Aumento do número de vagas na Câmara Municipal. Processo eleitoral. Parâmetro quantitativo adotado na fase do registro de candidatura. Observância na etapa da diplomação. Aderência do acórdão regional com a jurisprudência desta Corte Superior. Necessidade de estabilização do número de vagas a serem preenchidas. [...]

Não por outra razão, é da jurisprudência que 'a diplomação dos eleitos deve seguir os critérios consolidados na fase do registro de candidatos'. [...]

2. Ultrapassada a etapa de registro das candidaturas, revela-se inviável inaugurar discussão sobre eventual aumento do número de vagas a serem preenchidas na Câmara Municipal, em razão do alegado acréscimo populacional por projeção do IBGE. [...]."

Ac. de 9/5/2025 no AgR-RMS n. 060067319, rel. Min. André Mendonça.`},

  {cat:"Registro", risk:"Alta", info:"TSE n. 8 · mai 2025",
   num:"AgR-REspEI n. 060031795",
   title:"Condenado por constituição de milícia privada (art. 288-A CP): vedação de candidatura diretamente pela CF — norma de eficácia plena",
   proc:"Impugnação de registro de candidatura (IRRC) com fundamento no art. 17, §4º, CF · Agravo regimental em recurso especial eleitoral inominado · Eleições 2024",
   tese:"O TSE reiterou, para as Eleições 2024, a tese de que a proibição de candidatura de integrante de organização paramilitar ou similar advém diretamente do art. 17, §4º, da CF, norma de eficácia plena cujo comando não admite postergação. O candidato foi condenado à pena de 8 anos de reclusão em regime fechado pelo crime de constituição de milícia privada (art. 288-A CP). O registro foi indeferido independentemente do trânsito em julgado da condenação criminal, pois a vedação constitucional é direta e não exige a mediação de norma infraconstitucional.",
   fund:"Art. 17, §4º, CF; art. 288-A, CP",
   imp:"Na análise de elegibilidade de pré-candidatos: verificar o histórico criminal especificamente quanto ao art. 288-A do CP (constituição de milícia privada). A condenação — mesmo sem trânsito em julgado — fundamenta o indeferimento do registro com base direta na CF, sem necessidade de enquadramento na LC 64/90.",
   ref:"Rel. Min. André Ramos Tavares · julgado em 20/5/2025",
   integra:`"[...] Eleições 2024. Requerimento de registro de candidatura (RRC). Vereador. Indeferimento. Sentença penal condenatória. Constituição de milícia privada. Art. 288-A do Código Penal. Vida pregressa. Vedação à utilização de organização paramilitar ou congênere no processo eleitoral. Art. 17, § 4º, da Constituição do Brasil. Norma de eficácia plena. [...]

2. Depreende-se do acórdão regional que o candidato foi condenado à pena de 8 (oito) anos de reclusão, em regime fechado, pelo crime de constituição de milícia privada (art. 288-A do Código Penal).

3. Este Tribunal Superior fixou, para as Eleições 2024, a tese de que a proibição de candidatura de integrante de organização paramilitar ou similar advém diretamente do art. 17, § 4º, da CB, norma cuja eficácia não admite postergação, em comando que combate a interferência no processo eleitoral por parte de grupos criminosos organizados. Precedentes.

4. De fato, não é a incidência direta do referido art. 17, § 4º, da Constituição para fins de correto encaminhamento do caso que fere a Constituição, mas sim a tese oposta, que elabora amarras jurídicas inexistentes para impedir que os objetivos constitucionais se concretizem na plenitude. [...]."

Ac. de 20/5/2025 no AgR-REspEI n. 060031795, rel. Min. André Ramos Tavares.`},

  {cat:"Registro", risk:"Média", info:"TSE n. 8 · mai 2025",
   num:"REspEl n. 060035943",
   title:"Realização de eleição majoritária não prejudica recurso que discute apenas multa por litigância de má-fé",
   proc:"Impugnação de registro de candidatura (IRRC) com incidente de litigância de má-fé · Recurso especial eleitoral · Eleições 2024 (mesma ação do item sobre IA e má-fé)",
   tese:"O TSE decidiu que a realização de eleições regidas pelo sistema majoritário não acarreta a perda superveniente do objeto recursal quando o recurso visa discutir sanção — no caso, multa por litigância de má-fé — que não influencia a realização nem o resultado do pleito. A perda do objeto recursal reconhecida pelo TSE para impugnações de registro em pleitos majoritários se aplica ao pedido principal (o registro), mas não alcança questões sancionatórias autônomas que subsistem independentemente da eleição realizada.",
   fund:"Art. 224, §3º, CE",
   imp:"Em recursos que discutem tanto o registro de candidatura quanto sanções autônomas (multas, condenações por má-fé): separar expressamente os pedidos e fundamentar a autonomia da questão sancionatória para evitar que a extinção do pedido principal por prejudicialidade alcance a questão da sanção.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 13/2/2025",
   integra:`"Eleições 2024. [...] Impugnação de registro de candidatura de prefeito eleito julgada improcedente com imposição de multa por litigância de má-fé. Utilização de julgados inexistentes criados por inteligência artificial. [...]

3. A jurisprudência reconhece a perda superveniente do objeto recursal que versa sobre pedido de registro de candidatura relativo à eleição regida pelo sistema majoritário, tendo em vista que, caso anulados os votos do candidato eleito, a consequência será a realização de nova eleição, independentemente do número de votos anulados, conforme dispõe o art. 224, § 3º, do Código Eleitoral.

No caso, contudo, não há falar em perda do objeto recursal, visto que a multa por litigância de má-fé pode ser aplicada independentemente da realização ou do resultado das eleições. [...]

Teses de julgamento:
1. A realização de eleições regidas pelo sistema majoritário não acarreta a perda do objeto recursal que visa a discutir sanção que não influencia a realização ou o resultado do pleito. [...]."

Ac. de 13/2/2025 no REspEl n. 060035943, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Org. judiciária", risk:"Baixa", info:"TSE n. 8 · mai 2025",
   num:"PetCiv n. 060024312",
   origem:"TSE",
   title:"Desembargador no TRE: vedação à reeleição para o mesmo cargo diretivo em biênios consecutivos",
   origem:"TSE (origem)",
   proc:"Petição cível (PetCiv) — questão administrativa interna sobre reeleição para cargo diretivo em TRE",
   tese:"O TSE decidiu que é vedada a reeleição ou recondução de desembargador de TJ, na condição de membro efetivo do TRE, para o mesmo cargo diretivo (Presidência ou Vice-Presidência), em biênios consecutivos. A Constituição Federal assegura ao desembargador a permanência como membro do TRE por dois biênios, mas não o direito à reeleição para o mesmo cargo de direção. O direito à reconducão como membro e o direito ao cargo diretivo são matérias distintas, reguladas por normas diferentes: art. 121, §2º, CF (membros) e art. 102, LOMAN, e Res. TSE 23.493/2016 (direção).",
   fund:"Art. 121, §2º, CF; art. 102, LOMAN; art. 1º, Res. TSE 23.493/2016",
   imp:"Relevante para questões administrativo-eleitorais internas dos TREs: um desembargador pode cumprir dois biênios como membro do TRE, mas não pode presidir ou vice-presidir a Corte em ambos os biênios consecutivos se já ocupou esses cargos no biênio anterior.",
   ref:"Rel. Min. Isabel Gallotti · julgado em 8/5/2025",
   integra:`"[...] Eleição para cargos diretivos. Presidente e vice-presidente. Vedação à reeleição para o mesmo cargo. Interpretação lógico-sistemática dos arts. 121, § 2º, da CF, 102 da LOMAN e 1º da Res.-TSE n. 23.493/2016. [...]

3. A Constituição Federal (arts. 120 e 121) estabelece que os cargos diretivos dos TREs são exclusivos de desembargadores dos Tribunais de Justiça e que os membros desses Tribunais servirão por até dois biênios consecutivos, não tratando, porém, de reeleição para cargos diretivos.

4. A Lei Orgânica da Magistratura (LOMAN), ao regulamentar a organização dos Tribunais e escolha dos ocupantes dos cargos de direção, veda expressamente a reeleição de desembargadores para os mesmos cargos diretivos nos Tribunais (art. 102).

5. A Res.-TSE n. 23.493/2016 regulamenta a matéria no âmbito da Justiça Eleitoral e reafirma a vedação à reeleição para o mesmo cargo diretivo, ainda que permita a permanência do magistrado como membro do TRE por dois biênios consecutivos.

7. O direito à recondução para o segundo biênio como membro do TRE, assegurado constitucionalmente, não implica permissão à recondução para o mesmo cargo diretivo, que deve obedecer a diretrizes normativas próprias. [...]."

Ac. de 8/5/2025 na PetCiv n. 060024312, rel. Min. Isabel Gallotti.`},

  // ── TSE n. 4 · mar 2026 ─────────────────────────────────────────────────
  {cat:"Inelegibilidade", risk:"Máxima", badge:"Jurisprudência Hoje", info:"TSE n. 4 · mar 2026",
   num:"RO n. 060657047 e 060350714",
   title:"Caso Cláudio Castro (RJ): cassação de diploma, inelegibilidade e eleições indiretas",
   origem:"TRE-RJ",
   proc:"Recurso Ordinário (RO) — processo eleitoral do Rio de Janeiro · Julgado em sessão jurisdicional plenária · Rio de Janeiro/RJ",
   tese:"Por maioria, o TSE deu parcial provimento aos recursos do MPE para: (1) cassar o diploma de Rodrigo Bacellar (deputado estadual); (2) declarar a inelegibilidade de Cláudio Castro (ex-governador do RJ), Rodrigo Bacellar e Gabriel Lopes; (3) determinar a realização de eleições indiretas para os cargos majoritários do RJ; (4) retotalizar os votos para deputado estadual excluindo os votos de Rodrigo Bacellar; (5) aplicar multa no patamar máximo para Cláudio Castro, Rodrigo Bacellar e Gabriel Lopes e multa mínima para Thiago Pampolha; (6) remeter cópia ao MPE para aprofundar investigação dos gestores, inclusive da UERJ; e (7) determinar execução imediata da decisão.",
   fund:"Lei Complementar n. 64/1990 — abuso de poder; Código Eleitoral",
   imp:"Decisão de grande repercussão política no Rio de Janeiro. A realização de eleições indiretas para os cargos majoritários impacta diretamente o calendário político estadual. Acompanhar os desdobramentos quanto à retotalização dos votos para deputado estadual e à diplomação dos suplentes. Atenção à execução imediata determinada pelo TSE.",
   ref:"Rel. Min. Isabel Gallotti · julgado em 24/3/2026",
   integra:`"Os ministros negaram, por unanimidade, provimento aos recursos apresentados por Marcelo Freixo e pela coligação e, por maioria, deram parcial provimento aos recursos do Ministério Público Eleitoral, nos termos do voto da relatora, Ministra Isabel Gallotti, para: cassar o diploma de Rodrigo Bacellar do cargo de deputado estadual; declarar a inelegibilidade de Cláudio Castro (ex-governador do Rio de Janeiro), Rodrigo Bacellar e Gabriel Lopes; determinar a realização de eleições indiretas para os cargos majoritários, com a retotalização dos votos para o cargo de deputado estadual, excluindo-se os votos que tinham sido computados para Rodrigo Bacellar; aplicar multa individual no patamar máximo para Cláudio Castro, Rodrigo Bacellar e Gabriel Lopes e multa no patamar mínimo, prevista na legislação, para Thiago Pampolha; remeter cópia dos autos ao Ministério Público Eleitoral para aprofundar a investigação dos gestores, inclusive da Universidade do Estado do Rio de Janeiro (UERJ); e determinar a execução imediata da decisão, tendo em vista a perda do cargo de deputado estadual e a necessidade de retotalização dos votos."

RO n. 060657047 e n. 060350714, Rio de Janeiro/RJ, rel. Min. Isabel Gallotti, julgado em 24/3/2026, em sessão jurisdicional.
Tags: inelegibilidade; multa eleitoral; cassação de diploma.`},

  {cat:"Pesquisa eleitoral", risk:"Média", badge:"Jurisprudência Ontem (2011)", info:"TSE n. 4 · mar 2026",
   num:"Ag n. 8225",
   origem:"TRE-PA",
   title:"Representação por pesquisa sem registro: prazo máximo para ajuizamento é a data das eleições",
   origem:"TRE-PA",
   proc:"Agravo (Ag) em representação por divulgação de pesquisa eleitoral sem registro · Belém/PA",
   tese:"A representação pela divulgação de pesquisa eleitoral sem prévio registro deve ser proposta até a data das eleições, tal como a representação por propaganda eleitoral antecipada ou irregular. Ultrapassado o pleito, falta interesse de agir, pois a multa aplicável nesses casos não se revela instrumento apto ao restabelecimento da isonomia. No caso, a representação foi ajuizada antes das eleições, afastando a alegação de intempestividade.",
   fund:"Art. 33, §3º, Lei 9.504/1997 — interesse de agir; prazo para ajuizamento",
   imp:"Representações por pesquisa sem registro devem ser ajuizadas antes do dia das eleições. Após o pleito, o processo será extinto por falta de interesse de agir. Na defesa: verificar se a representação foi ajuizada antes ou depois da data das eleições — se posterior, arguir extinção por ausência de interesse de agir.",
   ref:"Rel. Min. Aldir Passarinho Junior · julgado em 24/3/2011 · Disclaimer: reflete posicionamento da Corte à época.",
   integra:`"A exemplo da representação pela prática de propaganda eleitoral antecipada ou irregular, a representação pela divulgação de pesquisa eleitoral sem o prévio registro também deve ser proposta até a data das eleições. Ultrapassado o pleito, faltaria interesse de agir, uma vez que a pena de multa aplicada para ambos os casos não se revela como instrumento apto ao restabelecimento da isonomia do pleito. Na espécie, considerando que a representação eleitoral foi ajuizada antes das eleições, a alegação de intempestividade não merece prosperar."

Ag n. 8225, Belém/PA, rel. Min. Aldir Passarinho Junior, julgado em 24/3/2011.
Tags: divulgação de pesquisa eleitoral sem registro; representação, data final para ajuizamento; interesse de agir.`},

  {cat:"Contas", risk:"Alta", info:"TSE n. 4 · mar 2026",
   num:"AgR-AREspE n. 060082648",
   title:"Depósito em espécie acima do limite legal: não comprova rastreabilidade e configura irregularidade grave com desaprovação das contas",
   proc:"Prestação de contas de campanha — prefeito e vice-prefeito · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE fixou duas teses complementares: (1) doações financeiras acima do limite regulamentar devem ser realizadas exclusivamente por transferência eletrônica entre contas bancárias ou por cheque cruzado e nominal — o depósito em espécie, ainda que identificado por CPF do doador, não supre a exigência de trânsito prévio pelo sistema bancário e não comprova a efetiva origem do numerário (art. 21, §1º, Res. TSE 23.607/2019); (2) doações em espécie acima do limite legal configuram irregularidade grave apta a ensejar a desaprovação das contas e o recolhimento dos valores ao Tesouro Nacional.",
   fund:"Art. 21, §1º, Res.-TSE n. 23.607/2019",
   imp:"Toda doação acima do limite regulamentar deve obrigatoriamente transitar por TED/PIX/DOC entre contas bancárias ou por cheque cruzado e nominal. Depósito em espécie na conta bancária da campanha — mesmo com CPF do doador identificado — não regulariza a doação e pode levar à desaprovação das contas com recolhimento ao Tesouro. Orientar doadores sobre essa exigência antes das Eleições 2026.",
   ref:"Rel. Min. Antonio Carlos Ferreira · julgado em 19/3/2026",
   integra:`"Eleições 2024. [...] Prestação de contas de campanha. Prefeito e vice-prefeito. Depósitos em espécie acima do limite legal. [...]

3. O art. 21, § 1º, da Res.-TSE n. 23.607/2019 exige que doações financeiras acima do limite regulamentar sejam realizadas exclusivamente por transferência eletrônica entre contas bancárias ou por cheque cruzado e nominal, como mecanismo objetivo de rastreabilidade.

4. O depósito em espécie, ainda que identificado por CPF, não supre a exigência de trânsito prévio dos recursos pelo sistema bancário, não sendo suficiente para comprovar a efetiva origem do numerário.[...]

7. A jurisprudência do Tribunal Superior Eleitoral é firme no sentido de que doações em espécie acima do limite legal configuram irregularidade grave apta a ensejar a desaprovação das contas e o recolhimento dos valores ao Tesouro Nacional.[...]."

Ac. de 19/3/2026 no AgR-AREspE n. 060082648, rel. Min. Antonio Carlos Ferreira.`},

  {cat:"Contas", risk:"Média", info:"TSE n. 4 · mar 2026",
   num:"AgR-AREspE n. 060036214",
   title:"Somente o cancelamento da nota fiscal comprova que serviços não foram prestados ou que houve erro na emissão",
   proc:"Prestação de contas de campanha — candidata a vereador · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que somente o cancelamento formal da nota fiscal é capaz de comprovar que os serviços contratados não foram prestados ou que houve erro na emissão, por se tratar de documento oficial que registra atividade comercial. Outros documentos unilaterais da campanha ou declarações dos próprios candidatos não suprem esse requisito. O entendimento é pacífico no TSE.",
   fund:"Jurisprudência pacífica do TSE sobre documentação em prestação de contas de campanha",
   imp:"Quando um candidato quiser contestar uma nota fiscal lançada em sua prestação de contas alegando que o serviço não foi prestado ou que a nota foi emitida com erro, a única prova aceita pelo TSE é o cancelamento formal da nota fiscal pelo fornecedor junto à Receita Federal/SEFAZ. Declarações unilaterais, e-mails e contratos de distrato são insuficientes.",
   ref:"Rel. Min. André Mendonça · julgado em 19/3/2026",
   integra:`"Eleições 2024 [...] Contas de campanha. Candidata ao cargo de vereador. Desaprovação. [...]

2. É pacífico o entendimento do Tribunal Superior Eleitoral (TSE) de que 'somente o cancelamento da nota fiscal é capaz de comprovar que os serviços não foram prestados ou que houve erro na emissão da nota fiscal pelo fornecedor, por se tratar de documento oficial que registra atividade comercial prestada por uma empresa' [...]."

Ac. de 19/3/2026 no AgR-AREspE n. 060036214, rel. Min. André Mendonça.`},

  {cat:"Registro", risk:"Média", info:"TSE n. 4 · mar 2026",
   num:"AgR-AREspE n. 060004474",
   title:"Domicílio eleitoral: conceito amplo — vínculos afetivo, familiar, profissional e social bastam; residência não é requisito",
   proc:"Alistamento e transferência de domicílio eleitoral · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que o conceito de domicílio eleitoral tem alcance amplo, englobando, além do local de residência ou moradia do eleitor, os locais com vínculo afetivo, familiar, profissional, social ou de qualquer natureza que seja suficiente para justificar a escolha da localidade. A residência efetiva não é requisito indispensável para o domicílio eleitoral — basta a demonstração de vínculo relevante com a localidade.",
   fund:"Art. 42, par. único, Código Eleitoral; art. 23, Res.-TSE n. 23.659",
   imp:"Em impugnações de transferência de domicílio eleitoral e análise de elegibilidade: o conceito amplo favorece o candidato que comprova qualquer espécie de vínculo com o município sem residência fixa. Para impugnar com sucesso, é necessário demonstrar ausência total de vínculo — profissional, afetivo, social ou familiar — não apenas a ausência de residência.",
   ref:"Rel. Min. André Mendonça · julgado em 19/3/2026",
   integra:`"Eleições 2024 [...] Alistamento e transferência de domicílio eleitoral. Vínculo com o município configurado. [...]

2. Na linha do entendimento firmado nesta Corte Superior, 'o conceito de domicílio eleitoral, previsto no parágrafo único do art. 42 do Código Eleitoral e no art. 23 da Res.-TSE n. 23.659, tem alcance amplo, englobando, além do local de residência ou moradia do eleitor, os locais com vínculo afetivo, familiar, profissional, social, entre outros que sejam suficientes para justificar a escolha daquela localidade' [...]."

Ac. de 19/3/2026 no AgR-AREspE n. 060004474, rel. Min. André Mendonça.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 4 · mar 2026",
   num:"RO-El n. 060163508",
   title:"AIJE — abuso do poder econômico: estrutura de compra de votos configura ilícito mesmo sem prática direta pelo candidato",
   proc:"AIJE (Ação de Investigação Judicial Eleitoral) por abuso do poder econômico e captação ilícita de sufrágio · Recurso Ordinário Eleitoral · Eleições 2022",
   tese:"O TSE reiterou que: (1) o abuso de poder econômico pode se caracterizar por condutas realizadas fora do período eleitoral, inclusive no ano anterior ao pleito, desde que haja gravidade em detrimento da legitimidade do processo; (2) a existência de estrutura organizada para o oferecimento de benesses a eleitores em situação de vulnerabilidade econômica caracteriza simultaneamente captação ilícita de sufrágio e abuso do poder econômico; (3) não se exige a prática direta da conduta pelo candidato — basta comprovar que se beneficiou dela; e (4) o nexo causal pode ser demonstrado por vínculo pessoal dos candidatos com o agente responsável direto.",
   fund:"Art. 22, XVI, LC 64/1990; art. 41-A, Lei 9.504/1997",
   imp:"Em defesas em AIJE por abuso econômico: (a) o fato de a conduta ter ocorrido antes do período eleitoral não afasta o ilícito se houver gravidade; (b) o candidato pode ser responsabilizado mesmo sem ter praticado diretamente os atos se houver prova de nexo causal e benefício; (c) a vulnerabilidade econômica dos eleitores agrava a conduta. Na acusação: demonstrar a estrutura organizada e o nexo pessoal.",
   ref:"Rel. Min. André Mendonça · julgado em 19/3/2026",
   integra:`"Eleições 2022. [...] Ação de investigação Judicial Eleitoral (AIJE). Abuso do Poder Econômico. [...]

2. No tocante ao abuso de poder econômico, este Tribunal entende que o ilícito se caracteriza por condutas realizadas fora do período eleitoral, inclusive no ano anterior ao pleito, desde que presente a gravidade das circunstâncias em detrimento da legitimidade do processo eleitoral. Precedente.

3. No caso, a existência de estrutura organizada para o oferecimento de benesses em troca de voto de eleitores em situação de vulnerabilidade econômica caracteriza captação ilícita de sufrágio e, ainda, abuso do poder econômico.

4. A jurisprudência do TSE não exige a prática direta da conduta pelo candidato para a configuração do abuso de poder, bastando a comprovação de que se tenha beneficiado dele.

5. Na espécie, o nexo causal entre a conduta e o resultado ficou demonstrado por meio de estreito e inafastável vínculo pessoal dos candidatos com o agente responsável direto.

6. A gravidade da conduta apurada nos autos – nas vertentes qualitativa e quantitativa – ficou seguramente demonstrada no intuito eleitoreiro e no emprego de elevada quantia para o oferecimento de bens/vantagens financeiras a eleitores, em detrimento da normalidade e legitimidade das eleições [...]."

Ac. de 19/3/2026 no RO-El n. 060163508, rel. Min. André Mendonça.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 4 · mar 2026",
   num:"AgR-REspEl n. 060000540",
   title:"Inelegibilidade reflexa: filiação socioafetiva para fins eleitorais exige prova robusta e exteriorização pública notória",
   proc:"Inelegibilidade reflexa por parentesco (art. 14, §7º, CF) — filiação socioafetiva · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE estabeleceu os requisitos para reconhecimento de filiação socioafetiva com efeitos eleitorais: (1) a inelegibilidade do art. 14, §7º, CF deve ser interpretada de forma estrita, por restringir direito fundamental de capacidade eleitoral passiva; (2) exige-se prova robusta e inequívoca do laço afetivo na condição de pai/mãe e filho/filha, com exteriorização pública e notória; (3) simples afeto ou proximidade familiar é insuficiente; (4) convivência com tios consanguíneos após falecimento do pai biológico, ainda que com apoio material e emocional, não caracteriza filiação socioafetiva; (5) uso de 'pai' ou 'mãe' em redes sociais, sem elementos concretos de exercício duradouro da parentalidade, é insuficiente.",
   fund:"Art. 14, §7º, CF — inelegibilidade reflexa; parentesco por afinidade",
   imp:"Para arguir inelegibilidade reflexa por filiação socioafetiva: não basta demonstrar proximidade ou afeto — é preciso provar exercício duradouro e público da parentalidade com reconhecimento social inequívoco. Para se defender: demonstrar ausência de exercício formal e duradouro da parentalidade e falta de exteriorização pública notória do vínculo.",
   ref:"Rel. Min. André Mendonça · julgado em 12/3/2026",
   integra:`"Eleições 2024. [...] Inelegibilidade reflexa. Filiação socioafetiva. [...]

2. A inelegibilidade prevista no art. 14, § 7º, da Constituição Federal deve ser interpretada de forma estrita, por restringir a capacidade eleitoral passiva, direito fundamental.

3. O reconhecimento da filiação socioafetiva para fins eleitorais exige prova robusta e inequívoca do laço afetivo na condição de pai/mãe e filho/filha, bem como sua exteriorização pública e notória, não se satisfazendo com demonstração de simples afeto ou proximidade familiar.

4. A convivência com tios consanguíneos após o falecimento do pai biológico, ainda que marcada por apoio material e emocional, não caracteriza, por si só, filiação socioafetiva com efeitos jurídicos eleitorais.

5. A utilização de expressões afetivas em redes sociais, como 'pai' ou 'mãe', desacompanhada de elementos concretos de exercício duradouro da parentalidade e reconhecimento social inequívoco, é insuficiente para comprovar vínculo de filiação socioafetiva. [...]."

Ac. de 12/3/2026 no AgR-REspEl n. 060000540, rel. Min. André Mendonça.`},

  {cat:"Partido político", risk:"Média", info:"TSE n. 4 · mar 2026",
   num:"AgR-AREspE n. 060018609",
   origem:"TSE",
   title:"Livro razão não supre extrato bancário; imóvel adquirido com Fundo Partidário sem registro em cartório = despesa não comprovada",
   origem:"TSE (origem)",
   proc:"Prestação de contas partidária — diretório estadual, exercício financeiro de 2021 · Agravo regimental em agravo em recurso especial eleitoral",
   tese:"O TSE fixou duas teses no mesmo acórdão: (1) o livro razão, por ser documento unilateral elaborado pela própria agremiação, não supre a ausência de extrato bancário — documento essencial à verificação da movimentação financeira e da origem dos recursos; (2) a aquisição de imóvel com recursos do Fundo Partidário não é regularmente comprovada se o imóvel não foi registrado em nome da legenda no Cartório de Registro de Imóveis — mesmo após mais de 4 anos da assinatura do contrato de promessa de compra e venda — pois o contrato não constitui prova suficiente da aquisição imobiliária (art. 1.245 do CC).",
   fund:"Art. 1.245, CC (transferência da propriedade pelo registro); princípio da rastreabilidade financeira partidária",
   imp:"Em prestações de contas partidárias: (a) sempre anexar extratos bancários originais — livros razão e controles internos não suprem essa exigência; (b) imóveis adquiridos com Fundo Partidário devem ser registrados em cartório em nome da legenda, e a ausência de registro impede o reconhecimento da despesa, independentemente de há quanto tempo o contrato foi assinado.",
   ref:"Rel. Min. Ricardo Villas Bôas Cueva · julgado em 5/3/2026",
   integra:`"Exercício financeiro de 2021. Partido político. Diretório estadual. [...] Prestação de contas. Desaprovação. Não comprovação de despesas com recursos públicos. [...]

3. O livro razão, por ser documento unilateral elaborado pela própria agremiação, não supre a ausência de extrato bancário, documento essencial à verificação da movimentação financeira e da origem dos recursos. [...]

NE (Trecho do voto do relator): 'Como se vê, passados mais de quatro anos desde a assinatura do contrato de promessa de compra e venda, o imóvel não foi registrado em nome da legenda na forma do disposto no art. 1.245 do Código Civil, segundo o qual a propriedade se transfere mediante o registro do título translativo no Registro de Imóveis. A contrário do que se alega, o contrato de compra e venda não constitui prova suficiente da aquisição imobiliária. [...] Desse modo, uma vez não apresentado o instrumento público devidamente registrado que comprove a transferência da propriedade em nome da agremiação, não há como reconhecer a regularidade da despesa realizada com recursos do Fundo Partidário.'

Ac. de 5/3/2026 no AgR-AREspE n. 060018609, rel. Min. Ricardo Villas Bôas Cueva.`},

  {cat:"Propaganda", risk:"Média", info:"TSE n. 4 · mar 2026",
   num:"AgR-REspEl n. 060064004",
   title:"Derrame de santinhos: infração instantânea — multa não pode ser retirada e notificação prévia é desnecessária",
   proc:"Representação por propaganda eleitoral irregular (derrame de santinhos) · Agravo regimental em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que o derramamento de santinhos constitui infração de caráter instantâneo, com duas consequências práticas: (1) afasta a possibilidade de restauração do bem ou retirada da multa após a prática, pois o ilícito já se consumou; e (2) torna desnecessária a realização de notificação prévia antes da aplicação da multa. A natureza instantânea da infração é entendimento consolidado em vários precedentes do TSE.",
   fund:"Art. 39, §8º, Lei 9.504/1997 — propaganda eleitoral irregular",
   imp:"Na defesa de representados por derrame de santinhos: a ausência de notificação prévia não é argumento que afasta a multa. Na acusação/fiscalização: não é necessário intimar o candidato antes de representar — basta a documentação fotográfica ou testemunhal do derramamento.",
   ref:"Rel. Min. Floriano de Azevedo Marques · julgado em 5/3/2026",
   integra:`"Eleições 2024. [...] Propaganda eleitoral irregular. Derrame de santinhos. [...]

5. O derramamento de santinhos afasta a possibilidade de restauração do bem ou retirada da multa, pois se trata de infração de caráter instantâneo, tornando desnecessária a realização de notificação. Precedentes. [...]."

Ac. de 5/3/2026 no AgR-REspEl n. 060064004, rel. Min. Floriano de Azevedo Marques.`},

  {cat:"Propaganda", risk:"Média", info:"TSE n. 4 · mar 2026",
   num:"AgR-AREspE n. 060002654",
   title:"Propaganda negativa: críticas políticas contundentes são legítimas — 3 requisitos alternativos para configurar o ilícito",
   proc:"Representação por propaganda eleitoral antecipada negativa · Agravo regimental em agravo em recurso especial eleitoral · Eleições 2024",
   tese:"O TSE reiterou que críticas políticas, ainda que ácidas e contundentes, fazem parte do jogo democrático e estão protegidas pela liberdade de expressão. A Justiça Eleitoral só deve intervir em casos excepcionais de abuso ou desinformação deliberada. Para configurar propaganda eleitoral antecipada negativa, o TSE exige a presença de pelo menos um dos três requisitos alternativos: (a) pedido explícito de não voto; (b) desqualificação da honra ou imagem do pré-candidato; ou (c) divulgação de fato sabidamente inverídico.",
   fund:"Art. 57-D, Lei 9.504/1997; art. 5º, IV, CF — liberdade de expressão",
   imp:"Para propor representação por propaganda negativa antecipada: identificar expressamente qual dos três requisitos alternativos está presente. A mera crítica política severa sem esses elementos não é ilícita. Na defesa: enquadrar o conteúdo como crítica política legítima e demonstrar ausência dos três requisitos, especialmente a ausência de falsidade objetivamente demonstrável.",
   ref:"Rel. Min. André Mendonça · julgado em 19/3/2026",
   integra:`"Eleições 2024. [...] Suposta propaganda eleitoral negativa. Publicação em jornal e em rede social. Prevalência da liberdade de expressão. Informações inverídicas. Não comprovação. Críticas políticas que são próprias da arena democrática. [...]

3. Conforme entendimento consolidado nesta Corte Superior, '[...] as críticas políticas não extrapolam os limites da liberdade de expressão, ainda que ácidas e contundentes, na medida em que fazem parte do jogo democrático e estão albergadas pelo pluralismo de ideias e pensamentos imanente à seara político-eleitoral'[...].

4. A jurisprudência deste Tribunal Superior é de que 'a liberdade de expressão é princípio fundamental que protege o debate político e restringe a atuação da Justiça Eleitoral apenas a casos excepcionais de abuso ou desinformação deliberada' [...].

5. Para a configuração de propaganda eleitoral antecipada negativa, o TSE exige a presença de três requisitos alternativos: (a) pedido explícito de não voto; (b) desqualificação da honra ou imagem do pré-candidato; ou (c) divulgação de fato sabidamente inverídico.[...]."

Ac. de 19/3/2026 no AgR-AREspE n. 060002654, rel. Min. André Mendonça.`},

  {cat:"Org. judiciária", risk:"Baixa", info:"TSE n. 4 · mar 2026",
   num:"LT n. 060094810",
   origem:"TRE-ES",
   title:"Lista tríplice (Res. TSE 23.746/2025): paridade de gênero deve ser verificada separadamente para membros efetivos e substitutos",
   origem:"TRE-ES",
   proc:"Lista Tríplice (LT) — vaga de advogado, classe de advogado, juiz efetivo · Tribunal Regional Eleitoral",
   tese:"O TSE determinou a devolução da lista tríplice para recomposição por inobservância da Res. TSE 23.746/2025, que exige que a formação das listas tríplices observe, sempre que possível, participação igualitária de mulheres e homens com perspectiva interseccional de raça e etnia. O equilíbrio de gênero deve ser observado separadamente para membros efetivos e substitutos. No caso, como o outro cargo de membro efetivo já era ocupado por um homem, a lista com 2 homens e 1 mulher não concretizava o espírito da norma.",
   fund:"Res.-TSE n. 23.746/2025 — paridade de gênero em listas tríplices para TREs",
   imp:"Tribunais de Justiça que elaborarem listas tríplices para TREs devem observar o equilíbrio de gênero de forma separada para efetivos e para substitutos. A mera presença de uma mulher na lista não é suficiente se a vaga em disputa é de efetivo e o outro cargo de efetivo já está ocupado por homem. Verificar a Res.-TSE n. 23.746/2025 antes de qualquer composição.",
   ref:"Rel. Min. Ricardo Villas Bôas Cueva · julgado em 12/3/2026",
   integra:`"Lista Tríplice. [...] Classe de advogado. Juiz efetivo. Lista mista. Paridade de gênero. Res.-TSE n. 23.746/2025. Inobservância. Devolução para recompor a lista. [...]

2. A Res.-TSE n. 23.746/2025 [...] determina que a formação das listas tríplices observe, sempre que possível, a participação de mulheres e homens, com perspectiva interseccional de raça e etnia, assegurando a ocupação igualitária de cargos por advogadas e advogados nos Tribunais Regionais Eleitorais.

3. A finalidade da norma é o enfrentamento da histórica sub-representação feminina nos cargos da Justiça Eleitoral, promovendo igualdade material que ultrapasse a mera formalidade.

4. A efetividade da ação afirmativa demanda equilíbrio de gênero a ser observado separadamente para os cargos de membro efetivo e para os de membro substituto. Precedentes.

5. No caso, a vaga em aberto é de membro efetivo e o outro cargo de membro efetivo já é ocupado por um homem. Dessa forma, a lista de composição mista – integrada por 2 homens e 1 mulher – não concretiza o espírito da norma. [...]."

Ac. de 12/3/2026 na LT n. 060094810, rel. Min. Ricardo Villas Bôas Cueva.`},

  {cat:"Org. judiciária", risk:"Baixa", info:"TSE n. 4 · mar 2026",
   num:"LT n. 060098707",
   origem:"TSE",
   title:"Lista tríplice: mandado de segurança extinto sem mérito com trânsito em julgado não impede indicação de advogado",
   origem:"TSE (origem)",
   proc:"Lista Tríplice (LT) — vaga de advogado, classe de advogado, juiz substituto",
   tese:"O TSE decidiu que a existência de mandado de segurança no qual a indicada figurou como autoridade coatora — posteriormente extinto sem resolução de mérito e com trânsito em julgado — não revela mácula à idoneidade moral nem constitui óbice à sua indicação em lista tríplice para TRE. O processo foi extinto sem análise do mérito, não havendo pronunciamento sobre a conduta da autoridade.",
   fund:"Requisitos de idoneidade moral para composição de lista tríplice para TREs",
   imp:"Processos nos quais o candidato à lista tríplice figurou como autoridade coatora em mandados de segurança extintos sem resolução de mérito não constituem impedimento à indicação. Para arguir mácula à idoneidade, é necessário que haja pronunciamento de mérito sobre a conduta do indicado.",
   ref:"Rel. Min. Ricardo Villas Bôas Cueva · julgado em 3/3/2026",
   integra:`"Lista tríplice. [...] Classe de advogado. Juiz substituto. [...]

6. A existência de mandado de segurança no qual a terceira indicada figurou como autoridade coatora, posteriormente extinto sem resolução de mérito e com trânsito em julgado, não revela mácula à idoneidade moral nem constitui óbice à sua indicação. [...]."

Ac. de 3/3/2026 na LT n. 060098707, rel. Min. Ricardo Villas Bôas Cueva.`},

  // ── TSE Ano XXI · 2019 ──────────────────────────────────────────────────

  {cat:"Propaganda", risk:"Máxima", info:"TSE n. 4 · abr 2019",
   num:"REspe n. 060022731",
   origem:"TRE-PE",
   title:"Outdoor para promoção pessoal de pré-candidato = propaganda antecipada (mudança jurisprudencial para Eleições 2018)",
   proc:"Representação por propaganda eleitoral antecipada e irregular · Recurso especial · TRE/PE · Eleições 2018 · Recife/PE",
   tese:"O TSE, alterando o entendimento das Eleições 2016, firmou que a promoção pessoal de pré-candidato veiculada em outdoor configura propaganda eleitoral antecipada. Para as Eleições 2018 em diante, o pré-candidato não pode utilizar meios proibidos durante o período eleitoral — mesmo que o conteúdo não contenha pedido explícito de voto. O art. 39, §8º, da Lei 9.504/1997 veda propaganda eleitoral via outdoor, e essa vedação aplica-se ao período de pré-campanha por interpretação sistemática do art. 36-A.",
   fund:"Art. 36-A c/c art. 39, §8º, Lei 9.504/1997",
   imp:"Para as Eleições 2026: qualquer material de pré-candidato em outdoor configura propaganda antecipada ilícita, independentemente de conter ou não pedido de voto. Veículos vedados no período eleitoral (outdoor, showmício) também são vedados na pré-campanha. Orientar pré-candidatos a evitar completamente o uso de outdoor para divulgação pessoal antes do período eleitoral oficial.",
   ref:"Rel. Min. Edson Fachin · julgado em 9/4/2019",
   integra:`"Promoção pessoal de pré-candidato veiculada em outdoor configura propaganda eleitoral antecipada. O Plenário, alterando o entendimento das Eleições 2016, entendeu que, para as eleições de 2018, o pré-candidato não pode utilizar, na divulgação de eventual candidatura, meios que são proibidos durante o período eleitoral. O § 8º do art. 39 da Lei nº 9.504/1997 veda a propaganda eleitoral mediante outdoors. Uma interpretação sistemática do art. 36-A conduz à conclusão de que as vedações relativas às modalidades de propaganda eleitoral (outdoor, showmício etc.) aplicam-se também na pré-campanha."

REspe nº 060022731, Recife/PE, rel. Min. Edson Fachin, julgado em 9/4/2019. Informativo TSE – Ano XXI – n. 4.`},

  {cat:"Partido político", risk:"Média", info:"TSE n. 4 · abr 2019",
   num:"PC n. 305-87",
   origem:"TSE",
   title:"Fundo Partidário: documentos fiscais não bastam para despesas de alto valor — exige-se vinculação com atividade partidária",
   proc:"Prestação de Contas de Partido Político · exercício financeiro de 2013 · Brasília/DF",
   tese:"A autonomia partidária não constitui barreira para que a Justiça Eleitoral fiscalize se o gasto com recursos do Fundo Partidário é manifestamente antieconômico. Para despesas de elevado valor — como locação de veículos por valor próximo ao de mercado dos próprios bens —, a mera apresentação de documentos fiscais não é suficiente. É necessária a apresentação de outros documentos que atestem a vinculação do gasto à atividade partidária. A ausência dessa comprovação enseja devolução dos valores ao erário.",
   fund:"Art. 44, Lei 9.096/1995",
   imp:"Na elaboração e revisão de prestações de contas partidárias: para despesas de alto valor (locação de veículos, equipamentos, imóveis), documentar expressamente a vinculação à atividade partidária, com atas, relatórios de uso, planilhas ou outros registros. Documentos fiscais isolados são insuficientes para despesas que possam ser reputadas antieconômicas.",
   ref:"Rel. Min. Luís Roberto Barroso · julgado em 21/3/2019",
   integra:`"A autonomia partidária não constitui barreira para que a Justiça Eleitoral fiscalize se o gasto realizado com recursos do Fundo Partidário é manifestamente antieconômico. No caso, o valor da despesa com a locação de três veículos foi semelhante ao de mercado dos automóveis locados, tratando-se de gasto absolutamente oneroso. Por conseguinte, além dos documentos fiscais, é necessária a apresentação de outros que atestem minimamente a vinculação do gasto à atividade partidária, o que não foi observado no caso, ensejando a devolução dos valores ao erário."

PC nº 305-87, Brasília/DF, rel. Min. Luís Roberto Barroso, julgada em 21/3/2019. Informativo TSE – Ano XXI – n. 4.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 6 · mai 2019",
   num:"REspE n. 142-42",
   origem:"TRE-MG",
   title:"Inelegibilidade constitucional (art. 14, §7º, CF) em RCED não sofre preclusão mesmo se preexistente ao registro",
   proc:"Recurso Contra a Expedição de Diploma (RCED) · candidato eleito a vereador · Presidente Juscelino/MG",
   tese:"A inelegibilidade constitucional, ainda que preexistente ao registro de candidatura, pode ser noticiada em RCED sem preclusão — conforme a Súmula TSE nº 47. O TSE distingue: (a) inelegibilidade constitucional → não preclude, pode ser arguida em RCED mesmo preexistente; (b) inelegibilidade infraconstitucional → preclude se não arguida no registro e não for superveniente. A densidade normativa constitucional impede a convalidação do vício.",
   fund:"Art. 14, §7º, CF; art. 262, CE; Súmula TSE nº 47",
   imp:"Inelegibilidade reflexa (parentesco) preexistente não arguida no registro ainda pode ser impugnada via RCED. Não há perda do prazo para arguição de inelegibilidades constitucionais. Estratégia: se a inelegibilidade constitucional for descoberta após a diplomação, o RCED é o instrumento cabível, sem preclusão.",
   ref:"Redator Min. Tarcisio Vieira de Carvalho Neto · julgado em 7/5/2019",
   integra:`"Mantida a jurisprudência do TSE quanto à não incidência de preclusão quando se tratar de causa de inelegibilidade estabelecida diretamente na Constituição. Assim, inelegibilidade constitucional, ainda que preexistente ao registro de candidatura, poderá ser noticiada em sede de Recurso Contra a Expedição de Diploma (RCED). A inelegibilidade constitucional não é afetada por preclusão, seja pela densidade normativa agregada, seja pela impossibilidade de convalidação de vício de tal natureza (arts. 259 e 262 do Código Eleitoral). Esse é o entendimento sufragado na Súmula-TSE nº 47."

REspE nº 142-42, Presidente Juscelino/MG, redator Min. Tarcisio Vieira de Carvalho Neto, julgado em 7/5/2019.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 6 · mai 2019",
   num:"REspE (TRE/SE, Eleições 2018)",
   origem:"TRE-SE",
   title:"WhatsApp em grupo restrito com pedido de votos: liberdade de expressão prevalece — sem propaganda antecipada",
   proc:"Representação por propaganda eleitoral antecipada · Recurso especial contra acórdão do TRE/SE · Eleições 2018",
   tese:"O pedido de votos em grupo restrito do WhatsApp não constitui propaganda eleitoral antecipada quando não objetivar o público em geral e não macular a igualdade de oportunidades entre candidatos. A conversa em grupo fechado está alcançada pelo exercício legítimo da liberdade de expressão. Não se pode penalizar condutas com base em conjecturas sobre eventual 'viralização' das mensagens — é necessário embasamento probatório concreto.",
   fund:"Art. 36-A, Lei 9.504/1997; art. 5º, IV e IX, CF",
   imp:"Grupo fechado de WhatsApp com pedido de voto durante pré-campanha não configura automaticamente propaganda antecipada. Para caracterizar o ilícito, é necessário demonstrar que o alcance extrapolou o grupo ou que houve impacto concreto na igualdade de oportunidades. Simples presunção de viralização não basta. Entendimento confirmado em 2025 (TSE n. 8 · mai 2025, AgR-AREspE n. 060034538).",
   ref:"Rel. Min. Rosa Weber · mai/2019",
   integra:`"A controvérsia cinge-se na verificação de existência ou não de propaganda eleitoral antecipada pela veiculação, em grupo restrito de WhatsApp, de pedido de votos a determinado candidato, durante período vedado pela legislação eleitoral. A relatora, Ministra Rosa Weber, deu provimento ao recurso por entender não caracterizada a propaganda eleitoral extemporânea, devendo prevalecer a liberdade de expressão. 'O pedido de votos realizado pela recorrente em ambiente restrito do aplicativo WhatsApp não objetivou o público em geral, de modo a macular a igualdade de oportunidade entre os candidatos, mas apenas os integrantes daquele grupo, enquanto conversa circunscrita aos seus usuários, alcançada, nesta medida, pelo exercício legítimo da liberdade de expressão.' Não se pode penalizar condutas sob argumentos calcados em conjecturas e presunções sobre possível viralização."

Informativo TSE – Ano XXI – n. 6, julgado em mai/2019.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 8 · jun 2019",
   num:"REspE (Eleições 2016)",
   origem:"N/D",
   title:"Inelegibilidade reflexa (art. 14, §7º, CF): restrita ao território do titular — município vizinho não está incluído",
   proc:"Recurso especial eleitoral · eleições municipais 2016",
   tese:"O cônjuge e os parentes de prefeito em segundo mandato são elegíveis em outra circunscrição eleitoral — ainda que em município vizinho —, desde que este não resulte de desmembramento, incorporação ou fusão realizada na legislatura imediatamente anterior ao pleito. A inelegibilidade reflexa está adstrita ao território de jurisdição do chefe do Poder Executivo e não abarca município adjacente.",
   fund:"Art. 14, §7º, CF",
   imp:"Parentes de prefeito podem candidatar-se em qualquer outro município, mesmo vizinho, desde que esse município não tenha sido originado de desmembramento/fusão/incorporação do município do titular. Ao verificar inelegibilidade reflexa, confirmar se o município candidato resultou de fusão ou desmembramento — essa é a única exceção territorial.",
   ref:"Julgado em jun/2019",
   integra:`"Para as eleições de 2016, o TSE entende que o cônjuge e os parentes de prefeito em segundo mandato são elegíveis em outra circunscrição eleitoral, ainda que em município vizinho, desde que este não resulte de desmembramento, incorporação ou fusão realizada na legislatura imediatamente anterior ao pleito. A inelegibilidade reflexa está adstrita ao território de jurisdição do chefe do Poder Executivo e, por conseguinte, não abarca município adjacente."

Informativo TSE – Ano XXI – n. 8, jun/2019.`},

  {cat:"Contas", risk:"Alta", info:"TSE n. 11 · set 2019",
   num:"REspE n. 0601193-81",
   origem:"TRE-AP",
   title:"Doação com Fundo Partidário para candidato de agremiação não coligada = fonte vedada (pessoa jurídica)",
   proc:"Recurso especial eleitoral · contas de campanha · deputado estadual · Eleições 2018 · Macapá/AP",
   tese:"A doação realizada com recursos do Fundo Partidário por partido político em benefício de candidato de agremiação que não formou coligação com o partido doador configura irregularidade grave e caracteriza recebimento de recursos de fonte vedada — especificamente de pessoa jurídica (arts. 31, II, Lei 9.096/1995 e 33, I, Res. TSE 23.553/2017). A legislação não autoriza que partido financie candidato de partido ou coligação concorrente. O donatário deve devolver os recursos ao doador.",
   fund:"Art. 31, II, Lei 9.096/1995; art. 33, I e §2º, Res.-TSE n. 23.553/2017",
   imp:"Candidatos não podem receber recursos do Fundo Partidário de partidos com os quais não estejam coligados. Na análise de prestações de contas: identificar todas as doações partidárias e verificar se o partido doador compunha a coligação. Doação de partido não coligado = fonte vedada — o donatário deve devolver os valores ao doador.",
   ref:"Rel. Min. Sérgio Banhos · julgado em 3/9/2019",
   integra:`"Doação realizada com recursos do Fundo Partidário por órgão nacional de partido político em benefício de campanha de candidato registrado por agremiação que não formou coligação com a grei doadora configura irregularidade grave e caracteriza o recebimento de recursos oriundos de fonte vedada, precisamente de pessoa jurídica, nos termos dos arts. 31, II, da Lei nº 9.096/1995 e 33, I, da Res.-TSE nº 23.553/2017. A situação fática não se enquadra em nenhuma das hipóteses legais que autorizam as agremiações partidárias a contribuírem para as campanhas de outros partidos."

REspE nº 0601193-81, Macapá/AP, rel. Min. Sérgio Banhos, julgado em 3/9/2019.`},

  {cat:"Registro", risk:"Máxima", info:"TSE n. 12 · set 2019",
   num:"REspE (AIJE, Eleições 2016)",
   origem:"N/D",
   title:"Fraude na cota de gênero com candidaturas 'laranjas' → cassação integral de todos os eleitos da coligação nas proporcionais",
   proc:"Ação de Investigação Judicial Eleitoral (AIJE) · eleições municipais 2016 · cargo de vereador",
   tese:"A fraude com candidaturas fictícias ('laranjas') femininas para atingir a cota de 30% de gênero enseja a cassação de TODOS os candidatos eleitos pela coligação nas eleições proporcionais — mesmo os que não participaram da fraude. O TSE firmou que: (1) não se exige prova da participação individual dos eleitos na fraude; (2) indeferir apenas as candidaturas fictícias sem cassar os demais eleitos configuraria incentivo à fraude; (3) a fraude nas proporcionais não compromete a higidez do pleito majoritário.",
   fund:"Art. 10, §3º, Lei 9.504/1997 (cota de gênero); art. 22, XVI, LC 64/1990; arts. 107 e 175, CE",
   imp:"Vereadores eleitos por coligação que tenha utilizado candidaturas fictícias femininas perdem o diploma, mesmo sem participação direta na fraude. Para os partidos: garantir que todas as candidatas femininas tenham efetiva participação na campanha — registros de despesas, materiais, atividades. A fiscalização ativa da autenticidade das candidaturas femininas é essencial para Eleições 2026.",
   ref:"Rel. Min. Jorge Mussi · set/2019",
   integra:`"O Plenário desta Corte firmou entendimento de que a fraude eleitoral que consiste em uso de candidaturas 'laranjas', com a finalidade de alcançar percentual mínimo por gênero, enseja a cassação de todos os candidatos eleitos pela coligação nas eleições proporcionais, mesmo que não tenham contribuído com a fraude. O Ministro Jorge Mussi, relator, destacou que, caracterizada a fraude, não se requer prova inconteste da participação ou anuência dos beneficiários. Ademais, indeferir apenas as candidaturas 'laranjas' e as com menor número de votos ensejaria inadmissível incentivo à fraude, por inexistir efeito prático desfavorável."

Informativo TSE – Ano XXI – n. 12, rel. Min. Jorge Mussi, set/2019.`},

  {cat:"Propaganda", risk:"Média", info:"TSE n. 12 · set 2019",
   num:"REspE n. 222-74",
   origem:"TRE-BA",
   title:"Direito de resposta aplicável a ofensas por carro de som — fundamento constitucional",
   proc:"Recurso especial eleitoral · pedido de direito de resposta · Caculé/BA",
   tese:"O direito de resposta é de extração constitucional (art. 5º, V, CF) e aplicável às ofensas por carro de som — ainda que ausente previsão específica na legislação eleitoral para esse meio. A opção do legislador de regular apenas parcela dos meios não retira a eficácia plena da norma constitucional. O entendimento aplica-se especificamente às ofensas por carro de som.",
   fund:"Art. 5º, V, CF; art. 58, §3º, Lei 9.504/1997",
   imp:"Candidatos ofendidos por meio de carro de som têm direito de resposta, com aplicação analógica dos prazos e procedimentos do art. 58 da Lei das Eleições. O pedido deve ser formulado com urgência perante a Justiça Eleitoral.",
   ref:"Redator Min. Luiz Edson Fachin · julgado em 24/9/2019",
   integra:`"O direito de resposta é de extração constitucional e, por conseguinte, aplicável às ofensas perpetradas com o uso de carro de som, ainda que ausente previsão desse direito na legislação eleitoral. O art. 5º, inciso V, da Constituição Federal, assegura a todos 'o direito de resposta, proporcional ao agravo, além da indenização por dano material, moral ou à imagem'. Ao final, o Plenário ressaltou que o entendimento assentado, no caso em exame, limita-se às ofensas perpetradas com o uso de carro de som."

REspE nº 222-74, Caculé/BA, redator Min. Luiz Edson Fachin, julgado em 24/9/2019.`},

  {cat:"Desincompatib.", risk:"Alta", info:"TSE n. 13 · nov 2019",
   num:"AgR em RO n. 0600763-96",
   origem:"TRE-PB",
   title:"Servidor em cargo em comissão na Câmara dos Deputados deve desincompatibilizar-se para concorrer a deputado federal",
   proc:"Agravo regimental em recurso ordinário · impugnação de IRRC a deputado federal · João Pessoa/PB · Eleições 2018",
   tese:"O candidato que exerça cargo em comissão na Câmara dos Deputados deve desincompatibilizar-se nos três meses anteriores ao pleito para concorrer ao cargo de deputado federal (art. 1º, II, 'l', LC 64/1990). A exigência aplica-se mesmo que o cargo em comissão seja exercido em circunscrição diversa da do pleito — a potencial influência do cargo federal sobre a campanha é suficiente para justificar o afastamento, independentemente da distância geográfica.",
   fund:"Art. 1º, II, 'l', LC 64/1990",
   imp:"Servidores em cargos em comissão do Legislativo, Executivo ou Judiciário Federal que pretendam candidatar-se a deputado federal devem desincompatibilizar-se 3 meses antes das eleições, independentemente do estado da candidatura. A distância entre o local do cargo e o estado candidato não afasta a exigência.",
   ref:"Redator Min. Tarcisio Vieira de Carvalho Neto · julgado em 24/10/2019",
   integra:`"O Plenário desta Corte entendeu que, para concorrer ao cargo de deputado federal, o candidato que exerça cargo em comissão na Câmara dos Deputados deverá se desincompatibilizar da função pública nos três meses anteriores ao pleito, nos termos do art. 1º, inciso II, alínea l, da Lei Complementar nº 64/1990. A finalidade da Lei é impedir a quebra da isonomia entre os candidatos, decorrente de potencial influência que o desempenho do cargo em comissão venha a exercer na disputa eleitoral."

AgR em RO nº 0600763-96, João Pessoa/PB, redator Min. Tarcisio Vieira de Carvalho Neto, julgado em 24/10/2019.`},

  // ── TSE Ano XXII · 2020 ──────────────────────────────────────────────────

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 2 · fev 2020",
   num:"(AIJE, Eleições 2014 — mudança de jurisprudência)",
   origem:"N/D",
   title:"Mudança de jurisprudência: encerramento do mandato não extingue o interesse de agir na AIJE quando há possibilidade de inelegibilidade",
   proc:"AIJE por abuso de poder econômico · candidatos eleitos a governador e vice-governador · Eleições 2014",
   tese:"O TSE alterou sua jurisprudência e passou a entender que o encerramento do mandato eletivo não acarreta a perda superveniente do interesse processual na AIJE quando o ilícito eleitoral em discussão puder implicar também a declaração de inelegibilidade. Anteriormente, o TSE reconhecia a perda do interesse de agir com o fim do mandato. Com a mudança, a AIJE pode prosseguir mesmo após o término do mandato, caso haja possibilidade de sanção de inelegibilidade.",
   fund:"Art. 22, LC 64/1990; art. 15, Código Eleitoral — AIJE e interesse de agir",
   imp:"AIJEs que discutam abuso de poder e possam resultar em inelegibilidade não perdem o objeto com o encerramento do mandato. Isso significa que candidatos eleitos em ciclos anteriores podem continuar sendo processados — e eventualmente declarados inelegíveis — mesmo após o término do mandato eletivo. Ficar atento a AIJEs pendentes de ciclos eleitorais anteriores que podem afetar a elegibilidade em 2026.",
   ref:"Rel. Min. Edson Fachin · fev/2020",
   integra:`"O encerramento do mandato eletivo não acarreta a perda superveniente do interesse processual no âmbito da Ação de Investigação Judicial Eleitoral (AIJE), quando o ilícito eleitoral em discussão puder implicar, também, a declaração de inelegibilidade. O relator, Ministro Edson Fachin, lembrou que a jurisprudência desta Corte, até então, é no sentido do reconhecimento da perda superveniente do interesse de agir em AIJE, em razão do encerramento do mandato. [Mudança de jurisprudência.]"

Informativo TSE – Ano XXII – n. 2, fev/2020.`},

  {cat:"Contas", risk:"Alta", info:"TSE n. 6 · jun 2020",
   num:"(Sessão por Meio Eletrônico, 2020)",
   origem:"TSE",
   title:"Despesas de natureza pessoal do candidato pagas com FEFC ou Fundo Partidário sujeitam-se à fiscalização da Justiça Eleitoral",
   proc:"Questão interpretativa sobre fiscalização de despesas · Sessão por Meio Eletrônico do TSE · 2020",
   tese:"As despesas de natureza pessoal do candidato pagas com recursos de origem pública (FEFC ou Fundo Partidário) sujeitam-se à fiscalização da Justiça Eleitoral, sendo inaplicável o art. 26, §3º, da Lei das Eleições (incluído pela Lei 13.488/2017), que exempta despesas pessoais de documentação fiscal para prestação de contas. A regra de isenção de documentação para despesas pessoais não se aplica quando os recursos utilizados são de origem pública.",
   fund:"Art. 26, §3º, Lei 9.504/1997 (inaplicável); arts. 16 e seguintes, Res.-TSE n. 23.607/2019",
   imp:"Candidatos que utilizem recursos do FEFC ou do Fundo Partidário para custear despesas pessoais (hospedagem, alimentação, transporte) devem documentá-las e submetê-las à fiscalização da Justiça Eleitoral normalmente. A isenção de documentação prevista no art. 26, §3º, aplica-se apenas a despesas custeadas com recursos próprios do candidato.",
   ref:"Sessão por Meio Eletrônico · TSE · 2020",
   integra:`"Despesas de natureza pessoal do candidato pagas com recursos de origem pública se sujeitam à fiscalização da Justiça Eleitoral. Inaplicabilidade do art. 26, § 3º, da Lei das Eleições, incluído pela Lei nº 13.488/2017. Quando os recursos utilizados para custear despesas pessoais têm origem pública (FEFC, Fundo Partidário), não incide a exceção documental prevista no dispositivo citado."

Informativo TSE – Ano XXII – n. 6, jun/2020.`},

  {cat:"Partido político", risk:"Média", info:"TSE n. 7 · jul 2020",
   num:"(Consulta, 2020)",
   origem:"TSE",
   title:"Assunção de dívida de campanha pelo partido é faculdade que depende de anuência do órgão nacional",
   proc:"Consulta formulada por partido político · Plenário do TSE · 2020",
   tese:"A responsabilidade solidária do partido político pelas dívidas de campanha de seus candidatos (art. 29, §§3º e 4º, Lei 9.504/1997) constitui faculdade conferida às agremiações — não obrigação. Para que o partido assuma as dívidas e responda solidariamente com o candidato, é necessária a anuência expressa do órgão nacional. Trata-se de mera previsão legal sem aplicabilidade imediata.",
   fund:"Art. 29, §§3º e 4º, Lei 9.504/1997",
   imp:"Partidos não são automaticamente responsáveis pelas dívidas de campanha de seus candidatos — a solidariedade depende de decisão expressa do órgão nacional. Na negociação de parcelamento ou quitação de dívidas de campanha com fornecedores, verificar se o partido formalizou a assunção da responsabilidade solidária.",
   ref:"Rel. Min. Edson Fachin · jul/2020",
   integra:`"A responsabilidade solidária do partido político pelas dívidas de campanha de seus candidatos, prevista nos §§ 3º e 4º do art. 29 da Lei nº 9.504/1997, constitui faculdade conferida às agremiações e depende da anuência do órgão nacional para que seja exercida. A previsão legal constitui mera faculdade, sem aplicabilidade imediata, a ser exercida mediante decisão do órgão nacional da agremiação."

Informativo TSE – Ano XXII – n. 7, jul/2020.`},

  {cat:"Filiação/Mandato", risk:"Alta", info:"TSE n. 7 · jul 2020",
   num:"(Plenário Virtual, 2020)",
   origem:"TSE",
   title:"Parlamentar expulso mediante regular processo disciplinar: tempo de antena e recursos do Fundo Partidário permanecem com o partido",
   proc:"Questão sobre expulsão de parlamentar e efeitos sobre direito de antena · Plenário Virtual do TSE · 2020",
   tese:"O parlamentar expulso de partido político mediante regular processo disciplinar não leva consigo o tempo de antena (rádio e TV) nem os recursos do Fundo Partidário/FEFC. Esses recursos pertencem ao partido — não ao parlamentar individual. A expulsão regular não gera direito do parlamentar a manter qualquer parcela dos recursos coletivos da agremiação.",
   fund:"Art. 17, §3º, CF; Lei 9.096/1995 (Lei dos Partidos Políticos)",
   imp:"Parlamentares que são expulsos ou saem do partido por qualquer motivo perdem o direito ao tempo de antena e aos recursos do Fundo Partidário alocados ao partido. Para os partidos: documentar rigorosamente o processo disciplinar de expulsão para garantir que o acervo de tempo de antena e recursos permaneça integralmente com a agremiação.",
   ref:"Plenário Virtual · TSE · jul/2020",
   integra:`"A expulsão de parlamentar mediante regular processo disciplinar não implica direito do parlamentar expulso a manter o tempo de antena ou recursos do Fundo Partidário. Esses recursos pertencem ao partido — não ao parlamentar individual. O tempo de antena e os recursos públicos permanecem com a agremiação."

Informativo TSE – Ano XXII – n. 7, jul/2020.`},

  {cat:"Propaganda", risk:"Máxima", info:"TSE n. 9 · ago 2020",
   num:"(Sessão Administrativa, ago/2020)",
   origem:"TSE",
   title:"Lives eleitorais equiparam-se ao showmício e são vedadas durante o período de campanha",
   proc:"Consulta administrativa · TSE · Eleições 2020",
   tese:"O TSE firmou que a realização de 'lives eleitorais' durante o período de campanha se equipara à figura do showmício e é, portanto, vedada pela legislação eleitoral. Lives que promovam candidatos com apresentações artísticas, shows ou eventos de entretenimento equivalem ao showmício mesmo que realizadas virtualmente. A proibição visa preservar a isonomia entre os candidatos, impedindo que recursos financeiros disponíveis para contratar artistas gerem vantagem eleitoral.",
   fund:"Art. 39, §7º, Lei 9.504/1997 (vedação ao showmício)",
   imp:"Candidatos e partidos não podem realizar lives com apresentações artísticas ou de entretenimento durante o período eleitoral. A transmissão virtual de evento com show ou artista convidado configura showmício vedado. Para o período de 2026: lives de candidatos podem conter debates, entrevistas e apresentações do programa de governo, mas não apresentações artísticas ou de entretenimento.",
   ref:"Sessão Administrativa · TSE · ago/2020",
   integra:`"É vedada a realização de 'lives eleitorais' por se equipararem à figura do showmício. Lives eleitorais que promovam candidatos com apresentações artísticas, shows ou eventos de entretenimento equivalem ao showmício mesmo que realizadas virtualmente, sendo vedadas nos termos do art. 39, § 7º, da Lei nº 9.504/1997."

Informativo TSE – Ano XXII – n. 9, ago/2020.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 9 · ago 2020",
   num:"REspE (Eleições 2016)",
   origem:"N/D",
   title:"Abuso de poder religioso não é categoria autônoma — deve ser enquadrado nas categorias existentes de abuso de poder",
   proc:"Recurso especial eleitoral · AIJE por abuso de poder religioso · Eleições 2016",
   tese:"O TSE, por maioria, reafirmou que o abuso de poder religioso não constitui categoria independente de abuso de poder para fins eleitorais. A conduta de líderes religiosos que influenciam eleitores deve ser enquadrada nas categorias já previstas em lei (abuso de poder econômico, abuso de poder político ou uso indevido dos meios de comunicação). A tese do relator para reconhecimento do abuso de poder religioso como categoria autônoma foi rejeitada pela maioria do Plenário.",
   fund:"Art. 22, LC 64/1990; art. 41-A, Lei 9.504/1997",
   imp:"Representações eleitorais baseadas em influência de líderes religiosos devem ser enquadradas nas categorias legais existentes (abuso de poder econômico, político ou uso de meios de comunicação), não em categoria autônoma. A simples influência religiosa, sem configuração de abuso nas categorias legais, não é suficiente para ensejar cassação. Atenção: este entendimento pode ser revertido pelo TSE — verificar julgamentos mais recentes.",
   ref:"Rel. Min. Edson Fachin · ago/2020",
   integra:`"O abuso de poder religioso não é, por ora, categoria independente de abuso de poder. O Plenário do Tribunal Superior Eleitoral (TSE), por unanimidade, deu provimento ao recurso especial eleitoral e, por maioria, rejeitou proposta de fixação de tese de possibilidade de exame jurídico do abuso de poder de autoridade religiosa em sede de Ações de Investigação Judicial Eleitoral (AIJEs) a partir das eleições de 2020."

Informativo TSE – Ano XXII – n. 9, ago/2020.`},

  {cat:"Propaganda", risk:"Alta", info:"TSE n. 12 · out 2020",
   num:"(Sessão Jurisdicional, out/2020)",
   origem:"N/D",
   title:"Uso do nome de candidato adversário como palavra-chave para impulsionamento de propaganda própria não infringe art. 57-C por si só",
   proc:"Questão interpretativa sobre propaganda eleitoral na internet · Sessão Jurisdicional do TSE · Eleições 2020",
   tese:"A utilização do nome de candidato adversário como palavra-chave (keyword) para fins de impulsionamento de propaganda eleitoral própria na internet não infringe, por si só, o art. 57-C da Lei 9.504/1997. O mero uso do nome de adversário como termo de busca para direcionar a propaganda do candidato ao público interessado não configura propaganda negativa nem viola a vedação do impulsionamento de conteúdo negativo.",
   fund:"Art. 57-C, Lei 9.504/1997",
   imp:"O uso estratégico do nome de adversários como palavras-chave em anúncios digitais (Google Ads, Meta Ads) para que a propaganda do candidato apareça quando o eleitor pesquisa pelo adversário é permitido. Contudo, atenção: o conteúdo da propaganda impulsionada não pode ser negativo (crítica ao adversário) — apenas positivo (promoção do próprio candidato).",
   ref:"Sessão Jurisdicional · TSE · out/2020",
   integra:`"A utilização do nome de candidato adversário como palavra-chave para o fim de impulsionamento de propaganda eleitoral na internet, por si só, não infringe o disposto no art. 57-C da Lei nº 9.504/1997."

Informativo TSE – Ano XXII – n. 12, out/2020.`},

  {cat:"Processual", risk:"Alta", info:"TSE n. 12 · out 2020",
   num:"(Recurso Ordinário, 2020)",
   origem:"N/D",
   title:"Cassação de candidato proporcional por ilícito eleitoral → anulação dos votos e recálculo do quociente eleitoral e partidário",
   proc:"Recurso ordinário do MPE · AIJE · sistema proporcional · 2020",
   tese:"A cassação de mandato ou diploma de candidato eleito pelo sistema proporcional em ação autônoma (pela prática de ilícitos eleitorais) enseja a anulação dos votos recebidos e, consequentemente, o recálculo dos quocientes eleitoral e partidário. Os votos do candidato cassado não são aproveitados pelo partido — afasta-se a incidência do art. 175, §4º, do Código Eleitoral, que normalmente aproveita os votos ao partido após eventual perda de registro.",
   fund:"Art. 175, §§3º e 4º, CE; art. 107, CE",
   imp:"A cassação de um vereador por ilícito eleitoral pode reduzir o quociente partidário do partido e afetar a distribuição de cadeiras para outras listas. Candidatos que estejam na posição de suplente de partido cujo eleito foi cassado devem verificar se houve recálculo do quociente — isso pode alterar a lista de convocação.",
   ref:"Rel. (MPE) · out/2020",
   integra:`"A cassação de mandato ou diploma de candidato eleito pelo sistema proporcional em ação autônoma pela prática dos ilícitos eleitorais enseja a anulação dos votos recebidos e, consequentemente, o recálculo dos quocientes eleitoral e partidário. Assim, será afastada a incidência do § 4º do art. 175 do Código Eleitoral (CE), e os votos recebidos pelo candidato cassado não serão aproveitados pelo partido pelo qual foi eleito."

Informativo TSE – Ano XXII – n. 12, out/2020.`},

  {cat:"Processual", risk:"Alta", info:"TSE n. 13 · nov 2020",
   num:"(Questão de Ordem, 2020)",
   origem:"TSE",
   title:"Efeito suspensivo automático (art. 257, §2º, CE) limita-se à cassação de registro/mandato — não alcança a inelegibilidade",
   proc:"Questão de ordem · Plenário do TSE · 2020",
   tese:"O efeito suspensivo automático previsto no art. 257, §2º, do Código Eleitoral — que suspende a execução da decisão recorrida enquanto pendente o julgamento do recurso — limita-se à cassação de registro, ao afastamento do titular ou à perda de mandato eletivo. O efeito suspensivo NÃO alcança a sanção de inelegibilidade imposta pela decisão recorrida. Portanto, declarada a inelegibilidade em primeira instância, ela produz efeitos imediatos mesmo havendo recurso pendente.",
   fund:"Art. 257, §2º, CE",
   imp:"Quando uma decisão impõe simultaneamente cassação E inelegibilidade, o efeito suspensivo automático do recurso protege apenas a cassação. A inelegibilidade começa a produzir efeitos imediatamente, mesmo com recurso pendente. Para garantir a suspensão da inelegibilidade, é necessário formular pedido expresso de tutela cautelar antecedente específica para esse efeito — não basta recorrer automaticamente.",
   ref:"Questão de Ordem · Plenário TSE · nov/2020",
   integra:`"O efeito suspensivo automático previsto no art. 257, § 2º, do Código Eleitoral (CE) se limita à cassação de registro, ao afastamento do titular ou à perda de mandato eletivo, não alcançando a inelegibilidade. A inelegibilidade declarada em decisão recorrida produz efeitos imediatos, independentemente da interposição de recurso com efeito suspensivo."

Informativo TSE – Ano XXII – n. 13, nov/2020.`},

  {cat:"Inelegibilidade", risk:"Alta", info:"TSE n. 14 · dez 2020",
   num:"(Reafirmação de jurisprudência, dez/2020)",
   origem:"N/D",
   title:"Inelegibilidade LC 64, art. 1º, I, 'l': exige cumulativamente dano ao erário E enriquecimento ilícito",
   proc:"Reafirmação de jurisprudência pelo Plenário do TSE · dez/2020",
   tese:"A incidência da causa de inelegibilidade prevista no art. 1º, I, 'l', da LC 64/1990 (condenação por abuso de autoridade e improbidade administrativa) pressupõe a comprovação cumulativa de dois requisitos: (1) dano ao erário E (2) enriquecimento ilícito. Não basta a existência de apenas um deles — ambos devem estar presentes para que a inelegibilidade da alínea 'l' seja declarada.",
   fund:"Art. 1º, I, 'l', LC 64/1990",
   imp:"Ao analisar a inelegibilidade da alínea 'l' de um pré-candidato: verificar se a condenação por improbidade ou abuso de autoridade reconhece os dois requisitos cumulativos. Se a condenação reconheceu apenas dano ao erário sem enriquecimento ilícito, ou vice-versa, a inelegibilidade da alínea 'l' não se aplica. Possível distinguir de outras alíneas que não exigem cumulatividade.",
   ref:"Reafirmação de jurisprudência · TSE · dez/2020",
   integra:`"Reafirmada a jurisprudência pela aplicação cumulativa dos requisitos do dano ao erário e do enriquecimento ilícito para fins de incidência da inelegibilidade prevista no art. 1º, I, l, da Lei Complementar (LC) nº 64/1990."

Informativo TSE – Ano XXII – n. 14, dez/2020.`},

  {cat:"Contas", risk:"Alta", info:"TSE n. 14 · dez 2020",
   num:"(Plenário Virtual, dez/2020)",
   origem:"N/D",
   title:"Prestação de contas apresentada em atraso e sem documentos essenciais ('contas fajutas') → desaprovação",
   proc:"Prestação de contas de campanha eleitoral · Plenário Virtual do TSE · dez/2020",
   tese:"A prestação de contas apresentada em atraso e desacompanhada de documentos e informações essenciais à fiscalização pela Justiça Eleitoral — denominada de 'contas fajutas' —, enseja a desaprovação da contabilidade eleitoral. A mera apresentação formal das contas, sem os documentos necessários para que a Justiça Eleitoral possa fiscalizar efetivamente a origem e destinação dos recursos, não é suficiente para aprovação.",
   fund:"Art. 30, Lei 9.504/1997; Res.-TSE sobre prestação de contas",
   imp:"A apresentação de contas incompletas ou sem documentação essencial é tão grave quanto a não apresentação. Verificar previamente se todos os documentos obrigatórios estão disponíveis antes de protocolar. A apresentação de 'contas fajutas' resulta em desaprovação com as mesmas consequências de contas rejeitadas.",
   ref:"Plenário Virtual · TSE · dez/2020",
   integra:`"Prestação de contas apresentada em atraso e desacompanhada de documentos e informações essenciais à fiscalização pela Justiça Eleitoral ('contas fajutas') enseja a desaprovação da contabilidade."

Informativo TSE – Ano XXII – n. 14, dez/2020.`},

];


// ════════════════════════════════════════════════════════════════════════════
// WORKFLOW — ADIÇÃO DE NOVOS INFORMATIVOS
// ════════════════════════════════════════════════════════════════════════════
// Ao processar um novo Informativo TSE e adicionar julgados ao array D[]:
//
// 1. INSERIR os novos cards em D[] com todos os campos obrigatórios:
//    cat, risk, info, badge?, num, origem, title, proc, tese, fund, imp, ref, integra
//
// 2. ANALISAR CONFLITOS: revisar TODOS os julgados existentes em D[] e
//    comparar com cada novo julgado, verificando se:
//    - A nova tese SUPERA ou MODIFICA entendimento anterior (mesmo tema/cat)
//    - A nova tese LIMITA ou EXPANDE o alcance de decisão anterior
//    - Há contradição direta entre teses de julgados do mesmo tema
//
// 3. Para conflito identificado: adicionar campo conflito:{titulo, texto}
//    ao card do julgado MAIS ANTIGO, explicando a evolução
//
// 4. IDENTIFICAR a `origem` (TRE-UF ou TSE) a partir do proc/ref do novo julgado
//
// 5. INCREMENTAR a versão: alterar VERSAO e DATA_VERSAO abaixo
//
// 6. ATUALIZAR o texto da Isenção de Responsabilidade se novos anos forem cobertos
// ════════════════════════════════════════════════════════════════════════════
const CARDS_PER_PAGE=15, PAGINATE_THRESHOLD=30;
let currentPage=1;
const VERSAO='1.0', DATA_VERSAO='Abr 2026';
let open=-1, filter=null, filterInfo=null, filterOrigem=new Set(), query='', openIntegra=new Set(), openConflito=new Set();

const cats=[...new Set(D.map(d=>d.cat))];
const infos=[...new Set(D.map(d=>d.info))].sort();

function pill(cat){const c=CATS[cat]||{bg:'#eee',tc:'#333'};return`<span class="pill" style="background:${c.bg};color:${c.tc}">${cat}</span>`;}
function rb(risk){const r=RISK[risk]||{bg:'#eee',tc:'#333'};return`<span class="rbadge" style="background:${r.bg};color:${r.tc}">${risk}</span>`;}

function matches(d, q){
  if(!q) return true;
  const s=q.toLowerCase();
  return [d.title,d.num,d.proc,d.tese,d.fund,d.imp,d.ref,d.integra,d.cat,d.info]
    .some(f=>f&&f.toLowerCase().includes(s));
}

function hl(text, q){
  if(!q||!text) return text;
  const escaped=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return text.replace(new RegExp(`(${escaped})`,'gi'),'<mark>$1</mark>');
}

function render(){
  const q=query.trim();
  const hasExtraFilter=!!(filter || filterOrigem.size>0 || q);
  const visible=D.map((d,i)=>i).filter(i=>{
    const d=D[i];
    if(filter && d.cat!==filter) return false;
    if(filterInfo && d.info!==filterInfo) return false;
    if(filterOrigem.size>0 && !filterOrigem.has(d.origem||'N/D')) return false;
    if(q && !matches(d,q)) return false;
    return true;
  });

  // Pagination logic:
  // - Single informativo selected: show all (no pagination)
  // - Todos + strong filter (result ≤ threshold): show all
  // - Todos + no filter or large result: paginate
  const shouldPaginate=!filterInfo && (visible.length>PAGINATE_THRESHOLD || !hasExtraFilter);
  let displayCards;
  let totalPages=1;
  if(shouldPaginate){
    totalPages=Math.ceil(visible.length/CARDS_PER_PAGE)||1;
    currentPage=Math.max(1,Math.min(currentPage,totalPages));
    const start=(currentPage-1)*CARDS_PER_PAGE;
    displayCards=visible.slice(start, start+CARDS_PER_PAGE);
  } else {
    displayCards=visible;
    currentPage=1;
  }

  // Result count display
  if(shouldPaginate){
    const from=(currentPage-1)*CARDS_PER_PAGE+1;
    const to=Math.min(currentPage*CARDS_PER_PAGE, visible.length);
    document.getElementById('resultCount').textContent=`Mostrando ${from}–${to} de ${visible.length} julgados`;
  } else {
    document.getElementById('resultCount').textContent=
      visible.length===D.length?`${D.length} julgados`:`${visible.length} de ${D.length} julgados`;
  }
  const cntEl=document.getElementById('infoSelectCount');
  if(cntEl) cntEl.textContent=filterInfo?`(${visible.length} julgados)`:`(${D.length} julgados)`;

  document.getElementById('list').innerHTML=displayCards.map(di=>{
    const d=D[di];
    const isOpen=(open==='all'||open===di);
    const intOpen=openIntegra.has(di);
    const hTitle=q?hl(d.title,q):d.title;
    const hNum=q?hl(d.num,q):d.num;
    const hProc=q?hl(d.proc,q):d.proc;
    const hTese=q?hl(d.tese,q):d.tese;
    const hFund=q?hl(d.fund,q):d.fund;
    const hImp=q?hl(d.imp,q):d.imp;
    const conflitoOpen=openConflito.has(di);
    return `
    <div class="card${isOpen?' open':''}" id="card-${di}">
      <div class="head" onclick="tog(${di})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();tog(${di})}" role="button" tabindex="0" aria-expanded="${isOpen}">
        ${pill(d.cat)}
        <span class="card-title">${hTitle}</span>
        ${d.badge?`<span class="rbadge" style="background:#f1f5f9;color:#475569;font-weight:500">${d.badge}</span>`:''}
        ${d.origem?`<span class="origem-badge">${d.origem}</span>`:''}
        <span class="rbadge" style="background:#e0e7ff;color:#3730a3;font-size:11px">${d.info}</span>
        ${rb(d.risk)}
        <span class="chev">▼</span>
      </div>
      <div class="body">
        <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:10px">
          <div><div class="lbl" style="margin-top:0">Informativo</div><div class="val-sm">${d.info}</div></div>
          <div style="flex:1;min-width:160px"><div class="lbl" style="margin-top:0">Número do processo</div><div class="val-sm">${hNum}${d.origem&&d.origem!=='N/D'?` <span style="font-size:12px;color:#0369a1;font-weight:600">· ${d.origem}</span>`:''}</div></div>
        </div>
        <div class="card-section">
          <div class="lbl">Tipo de processo</div>
          <div class="val-sm">${hProc}</div>
        </div>
        <div class="card-section">
          <div class="lbl">Resumo</div>
          <div class="val">${hTese}</div>
        </div>
        <div class="card-section card-section-alt">
          <div class="lbl">Fundamento legal</div>
          <div class="val-sm">${hFund}</div>
        </div>
        <div class="card-section">
          <div class="lbl">Impacto prático</div>
          <div class="val">${hImp}</div>
        </div>
        <div class="ref">${d.ref}</div>
        <div class="btn-row">
          <button class="integra-btn" onclick="toggleIntegra(event,${di})">
            <span>${intOpen?'Fechar íntegra':'Ver íntegra'}</span>
            <span class="iarrow" style="transform:${intOpen?'rotate(180deg)':'rotate(0deg)'}">▼</span>
          </button>          ${d.conflito?`<button class="conflict-btn" onclick="toggleConflito(event,${di})">⚠ Este julgado pode conflitar com entendimento mais recente</button>`:''}
        </div>
        <div class="integra-panel${intOpen?' visible':''}" id="integra-${di}">${escHtml(d.integra)}</div>

        ${d.conflito?`<div class="conflict-panel${conflitoOpen?' visible':''}" id="conflito-${di}"><h4>⚠ Atenção — Potencial evolução jurisprudencial identificada</h4><p><strong>${escHtml(d.conflito.titulo)}</strong></p><p style="margin-top:8px">${escHtml(d.conflito.texto).replace(/\n/g,'<br>')}</p>${d.conflito.numRef?`<button onclick="irParaConflito('${d.conflito.numRef}')" style="margin-top:12px;font-size:12px;padding:5px 14px;border-radius:6px;border:1px solid #dc2626;background:#fff;color:#dc2626;cursor:pointer;font-weight:600">🔍 Ver julgado mais recente</button>`:'<p style="margin-top:10px;font-size:12px;color:#6b7280;font-style:italic">O julgado mais recente ainda não está na base desta versão do portal.</p>'}<p style="margin-top:12px;font-size:12px;color:#7f1d1d;font-style:italic;border-top:1px solid #fca5a5;padding-top:8px">⚠ Potencial conflito e/ou evolução jurisprudencial identificada por inteligência artificial. Sempre verifique antes de utilizar.</p></div>`:''}
      </div>
    </div>`;
  }).join('');
  renderPagination(totalPages, shouldPaginate);
}

function renderPagination(totalPages, show){
  const pag=document.getElementById('pagination');
  if(!pag) return;
  if(!show || totalPages<=1){pag.innerHTML='';return;}
  let h='';
  h+=`<button class="pag-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹ Anterior</button>`;
  for(let p=1;p<=totalPages;p++){
    if(p===1||p===totalPages||(p>=currentPage-2&&p<=currentPage+2)){
      h+=`<button class="pag-btn${p===currentPage?' active':''}" onclick="goPage(${p})">${p}</button>`;
    } else if(p===currentPage-3||p===currentPage+3){
      h+='<span class="pag-ellipsis">…</span>';
    }
  }
  h+=`<button class="pag-btn" onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>Próxima ›</button>`;
  h+=`<div class="pag-info">Página ${currentPage} de ${totalPages}</div>`;
  pag.innerHTML=h;
}
function goPage(p){
  if(p<1) return;
  currentPage=p;
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

function escHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function irParaConflito(numRef){
  // Find card index by matching num field
  const idx = D.findIndex(d => d.num && d.num.includes(numRef));
  if(idx === -1){
    alert('Julgado referenciado ainda não está na base desta versão do portal.');
    return;
  }
  // Clear all filters so the card is visible
  filter = null;
  filterInfo = null;
  filterOrigem.clear();
  query = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchClear').classList.remove('visible');
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  document.querySelector('.tag')?.classList.add('active');
  document.querySelectorAll('.tre-tag').forEach(t => t.classList.remove('active'));
  document.querySelector('.tre-tag')?.classList.add('active');
  document.getElementById('infoSelect').value = '';
  // Open the target card
  open = idx;
  render();
  // Scroll to it
  setTimeout(() => {
    const el = document.getElementById('card-' + idx);
    if(el) el.scrollIntoView({behavior:'smooth', block:'center'});
  }, 100);
}

function tog(i){
  if(open==='all'){open=i;}
  else{open=open===i?-1:i;}
  render();
}
function expandAll(){open='all';render();}
function collapseAll(){open=-1;openIntegra.clear();openConflito.clear();render();}
function toggleIntegra(e,i){
  e.stopPropagation();
  if(openIntegra.has(i)){openIntegra.delete(i);}else{openIntegra.add(i);}
  render();
}

const TIPO_EXPANSAO={
  'AgR-AREspE':'AGRAVO REGIMENTAL EM AGRAVO EM RECURSO ESPECIAL ELEITORAL',
  'Ag-AREspE':'AGRAVO EM AGRAVO EM RECURSO ESPECIAL ELEITORAL',
  'AREspE':'AGRAVO EM RECURSO ESPECIAL ELEITORAL',
  'AgR-REspEl':'AGRAVO REGIMENTAL EM RECURSO ESPECIAL ELEITORAL',
  'AgR-REspEI':'AGRAVO REGIMENTAL EM RECURSO ESPECIAL ELEITORAL INOMINADO',
  'REspEl':'RECURSO ESPECIAL ELEITORAL',
  'REspEI':'RECURSO ESPECIAL ELEITORAL',
  'AgR-RO-El':'AGRAVO REGIMENTAL EM RECURSO ORDINÁRIO ELEITORAL',
  'RO-El':'RECURSO ORDINÁRIO ELEITORAL',
  'RO':'RECURSO ORDINÁRIO',
  'PC-PP':'PRESTAÇÃO DE CONTAS DE PARTIDO POLÍTICO',
  'ED-PC':'EMBARGOS DE DECLARAÇÃO EM PRESTAÇÃO DE CONTAS',
  'AgR-RMS':'AGRAVO REGIMENTAL EM RECURSO EM MANDADO DE SEGURANÇA',
  'TutCautAnt':'TUTELA CAUTELAR ANTECEDENTE',
  'PetCiv':'PETIÇÃO CÍVEL',
  'LT':'LISTA TRÍPLICE',
  'AgR-AREspE':'AGRAVO REGIMENTAL EM AGRAVO EM RECURSO ESPECIAL ELEITORAL',
};

function toggleConflito(e,i){
  e.stopPropagation();
  if(openConflito.has(i)){openConflito.delete(i);}else{openConflito.add(i);}
  render();
}

function showDisclaimer(){document.getElementById('disclaimerOverlay').classList.add('visible');document.body.style.overflow='hidden';}
function closeDisclaimer(){document.getElementById('disclaimerOverlay').classList.remove('visible');document.body.style.overflow='';}
document.addEventListener('keydown', e => { if(e.key==='Escape') closeDisclaimer(); });

function doSearch(){
  query=document.getElementById('searchInput').value.trim();
  currentPage=1;
  const clearBtn=document.getElementById('searchClear');
  if(clearBtn) clearBtn.classList.toggle('visible', query.length>0);
  render();
}
function clearSearch(){
  query='';
  currentPage=1;
  document.getElementById('searchInput').value='';
  const clearBtn=document.getElementById('searchClear');
  if(clearBtn) clearBtn.classList.remove('visible');
  render();
}
function onInfoChange(val){filterInfo=val||null;currentPage=1;render();}

// Build TRE/origem filter bar
(function(){
  const bar=document.getElementById('treBar');
  if(!bar)return;
  const label=document.createElement('span');
  label.className='tre-label';label.textContent='Tribunal de origem:';
  bar.appendChild(label);
  const allBtn=document.createElement('button');
  allBtn.className='tre-tag active';allBtn.textContent='Todos';
  allBtn.onclick=()=>{filterOrigem.clear();currentPage=1;bar.querySelectorAll('.tre-tag').forEach(t=>t.classList.remove('active'));allBtn.classList.add('active');render();};
  bar.appendChild(allBtn);
  const origens=[...new Set(D.map(d=>d.origem).filter(Boolean))].sort();
  origens.forEach(org=>{
    const n=D.filter(d=>d.origem===org).length;
    const b=document.createElement('button');
    b.className='tre-tag';b.innerHTML=org+'<span class="cnt"> '+n+'</span>';
    b.onclick=()=>{
      if(filterOrigem.has(org)){filterOrigem.delete(org);b.classList.remove('active');}
      else{filterOrigem.add(org);b.classList.add('active');}
      // Remove "Todos" active if any selection
      if(filterOrigem.size>0) allBtn.classList.remove('active');
      else allBtn.classList.add('active');
      currentPage=1;render();
    };
    bar.appendChild(b);
  });
})();

// Build info select dropdown grouped by year
(function(){
  const sel=document.getElementById('infoSelect');
  // Parse year from info string e.g. "TSE n. 8 · mai 2025" → "2025"
  const getYear=info=>{const m=info.match(/\d{4}$/);return m?m[0]:'?'};
  const byYear={};
  infos.forEach(info=>{
    const y=getYear(info);
    if(!byYear[y]) byYear[y]=[];
    byYear[y].push(info);
  });
  Object.keys(byYear).sort((a,b)=>b-a).forEach(year=>{
    const grp=document.createElement('optgroup');
    grp.label=year;
    byYear[year].forEach(info=>{
      const opt=document.createElement('option');
      opt.value=info;
      const n=D.filter(d=>d.info===info).length;
      opt.textContent=info+' ('+n+')';
      grp.appendChild(opt);
    });
    sel.appendChild(grp);
  });
  // Default: select most recent informativo
  (function(){
    const sorted=[...infos].sort((a,b)=>{
      const ya=parseInt((a.match(/\d{4}$/)||[0])[0]);
      const yb=parseInt((b.match(/\d{4}$/)||[0])[0]);
      if(yb!==ya) return yb-ya;
      const na=parseInt((a.match(/n\.\s*(\d+)/)||[0,0])[1]);
      const nb=parseInt((b.match(/n\.\s*(\d+)/)||[0,0])[1]);
      return nb-na;
    });
    const maisRecente=sorted[0]||null;
    if(maisRecente){filterInfo=maisRecente;sel.value=maisRecente;}
  })();
})();

// Build category filter bar
const fEl=document.getElementById('filters');
const allBtn=document.createElement('button');
allBtn.className='tag active';allBtn.textContent='Todas as categorias';
allBtn.onclick=()=>{filter=null;currentPage=1;document.querySelectorAll('.tag').forEach(t=>t.classList.remove('active'));allBtn.classList.add('active');render();};
fEl.appendChild(allBtn);
cats.forEach(cat=>{
  const n=D.filter(d=>d.cat===cat).length;
  const b=document.createElement('button');
  b.className='tag';b.innerHTML=cat+`<span class="cnt">${n}</span>`;
  b.onclick=()=>{filter=cat;currentPage=1;document.querySelectorAll('.tag').forEach(t=>t.classList.remove('active'));b.classList.add('active');render();};
  fEl.appendChild(b);
});

// Wire version info into the source bar and disclaimer footer
(function(){
  const vl=document.getElementById('versao-label');
  if(vl) vl.textContent='v'+VERSAO+' · '+DATA_VERSAO;
  const vd=document.getElementById('versao-disclaimer');
  if(vd) vd.textContent=VERSAO;
})();

render();
