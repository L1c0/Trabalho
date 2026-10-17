/**
 * Catalogo de tudo que existe em public/. Nenhuma cena escreve caminho
 * de arquivo na mao — toda cena pede uma peca daqui pelo id.
 *
 * tipo:
 *   'quadro'   — pagina de manga, preto e branco, opaca. Vai dentro
 *                de <Painel>, que desenha a moldura fina e o papel.
 *   'gravura'  — cinza+alfa, o branco do papel ja foi removido. A tinta
 *                pousa DIRETO no papel do filme. Sem moldura, nunca.
 *   'prancha'  — cinza+alfa com borda esfumada. Flutua no papel como
 *                prancha de livro. Sem moldura, nunca.
 *
 * IMPORTANTE — os arquivos de classico/ sao LA (cinza + alfa), nao RGB.
 * Eles NAO tem cor. A cor e aplicada no componente <Tingido>, que mapeia
 * o cinza no gradiente cor.tinta -> papel atual. E por isso que uma
 * prancha acompanha a mudanca de cor do papel ao longo do filme.
 * Se voce renderizar um desses direto num <Img>, sai cinza morto.
 */

export type Peca = {
  id: string;
  arq: string;
  tipo: 'quadro' | 'gravura' | 'prancha';
  nota: string;
};

export const manga: Peca[] = [
  { id: 'pernas',      arq: 'manga/m01-pernas-agata.png',       tipo: 'quadro',
    nota: 'So as pernas de agata no capim. A imagem-ancora da lista de trocas: fica em cena enquanto o papel muda de cor seis vezes.' },
  { id: 'pernaDet',    arq: 'manga/m01b-perna-detalhe.png',     tipo: 'quadro',
    nota: 'Vertical estreita. A perna dobrada, em detalhe.' },
  { id: 'rachadura',   arq: 'manga/m03a-rachadura.png',         tipo: 'quadro',
    nota: 'Quase todo preto. Cuidado: ja e escuro, nao escureca mais.' },
  { id: 'doacaoCabeca',arq: 'manga/m03b-doacao-cabeca.png',     tipo: 'quadro',
    nota: 'O momento da doacao da cabeca. Balao vazio de proposito.' },
  { id: 'aechmea',     arq: 'manga/m04a-aechmea-segura.png',    tipo: 'quadro',
    nota: 'Aechmea de costas segurando o Phos. De costas e melhor: ele e quem leva.' },
  { id: 'olhoPerola',  arq: 'manga/m04b-olho-perola.png',       tipo: 'quadro',
    nota: 'Tira larga e baixa, 2016x586. Sem balao. Use em corte de tela cheia, nao em painel pequeno.' },
  { id: 'escorrendo',  arq: 'manga/m05-cabeca-escorrendo.png',  tipo: 'quadro',
    nota: 'Fim do capitulo 96. A cabeca derretendo.' },
  { id: 'formaFinal',  arq: 'manga/m06-forma-final.png',        tipo: 'quadro',
    nota: 'Icone: frontal, simetrico, olhos fechados, halo. Guardado para o bloco do anatta. Nao gaste antes.' },
  { id: 'estilhaco1',  arq: 'manga/m08a-estilhaco-rosto.png',   tipo: 'quadro',
    nota: 'Os tres estilhacos entram em sequencia, cortes secos e curtos.' },
  { id: 'estilhaco2',  arq: 'manga/m08b-estilhaco-fragmento.png', tipo: 'quadro', nota: 'Segundo da sequencia.' },
  { id: 'estilhaco3',  arq: 'manga/m08c-estilhaco-agua.png',    tipo: 'quadro', nota: 'Terceiro: o respingo.' },
  { id: 'elenco',      arq: 'manga/m09-elenco-cor.png',         tipo: 'quadro',
    nota: 'UNICA imagem colorida do filme inteiro. So no triptico das tres especies, representando OSSO. Em nenhum outro lugar.' },
  { id: 'kongoRezando',arq: 'manga/m11-kongo-rezando.png',      tipo: 'quadro',
    nota: 'Kongo em lotus sobre as ondas. A imagem do bloco budista.' },
  { id: 'kongoRosto',  arq: 'manga/m11b-kongo-rosto.png',       tipo: 'quadro',
    nota: 'Tira larga e baixa. O rosto sereno.' },
  { id: 'phosMar',     arq: 'manga/m12-phos-mar.png',           tipo: 'quadro', nota: 'Phos na beira do mar, fim do capitulo 7.' },
  { id: 'phosVertical',arq: 'manga/m16-phos-vertical.png',      tipo: 'quadro', nota: 'Vertical muito estreita (932x2922). Pede coluna, nao quadro.' },
  { id: 'andYet',      arq: 'manga/m17-and-yet.png',            tipo: 'quadro',
    nota: 'Phos entre as gemas derretidas. Bloco do anatta.' },
  { id: 'descida',     arq: 'manga/m18-descida-lunarianos.png', tipo: 'quadro',
    nota: 'A formacao dos Lunarianos. Representa ALMA no triptico.' },
  { id: 'lunariano',   arq: 'manga/m19-lunariano-lotus.png',    tipo: 'quadro',
    nota: 'Close da cara de vagem de lotus. A prova visual do argumento budista.' },
  { id: 'admirabilis', arq: 'manga/m22-admirabilis.png',        tipo: 'quadro',
    nota: 'Representa CARNE no triptico das tres especies.' },
  { id: 'minuscula',   arq: 'manga/m23-figura-minuscula.png',   tipo: 'quadro',
    nota: 'Figura minima no capim estrelado. A ultima imagem do filme.' },
];

export const classico: Peca[] = [
  { id: 'navio',    arq: 'classico/c01-navio-exekias.png',   tipo: 'prancha',
    nota: 'Exekias, c. 530 a.C., Munique inv. 2044. Dioniso no barco.' },
  { id: 'plutarco', arq: 'classico/c02-busto-plutarco.png',  tipo: 'prancha',
    nota: 'Busto de Delfos, sec. II. NUNCA legendar como "Plutarco": a identificacao e so provavel.' },
  { id: 'leviata',  arq: 'classico/c03-leviata.png',         tipo: 'gravura',
    nota: 'Abraham Bosse, 1651. O gigante feito de gente. Zoom lento ate o torso. ATENCAO: fonte veio em 960px; se o zoom borrar, e isso. Peca scan maior.' },
  { id: 'hobbes',   arq: 'classico/c11-hobbes.png',          tipo: 'prancha',
    nota: 'John Michael Wright, c. 1669-70. Entra logo antes do Leviata: primeiro o homem, depois o livro dele, depois o zoom para dentro do livro.' },
  { id: 'locke',    arq: 'classico/c04-locke.png',           tipo: 'prancha',
    nota: 'Kneller, 1697. O menor arquivo do conjunto. So plano medio, nunca close.' },
  { id: 'hume',     arq: 'classico/c05-hume.png',            tipo: 'prancha',
    nota: 'Allan Ramsay, 1766.' },
  { id: 'treatise', arq: 'classico/c06-treatise-folha.png',  tipo: 'gravura',
    nota: 'Folha de rosto, 1739. Entra no momento do apendice.' },
  { id: 'bodhi',    arq: 'classico/c07-bodhisattva.png',     tipo: 'prancha', nota: 'Bodhisattva sentado.' },
  { id: 'vajra',    arq: 'classico/c08-vajra.png',           tipo: 'prancha',
    nota: 'O objeto ritual. Kongo = Kongo = vajra. Larga e baixa (2200x1251).' },
  { id: 'yama',     arq: 'classico/c09-yama.png',            tipo: 'prancha', nota: 'Yama sobre o bufalo.' },
  { id: 'teseu',    arq: 'classico/c10-teseu-minotauro.png', tipo: 'prancha',
    nota: 'Tondo circular, com as inscricoes gregas legiveis. Alfa ja e circular: nao corte em retangulo.' },
];

export const todas = [...manga, ...classico];
export const pega = (id: string): Peca => {
  const p = todas.find((x) => x.id === id);
  if (!p) throw new Error(`peca desconhecida: ${id}`);
  return p;
};
