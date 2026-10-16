import Image from "next/image";
import { release } from "@/data/content";

const clippings = [
  { file: "01", source: "Jornal na Net", description: "Grupo Equus Bipes de teatro apresenta: Quase 50 é pra rir ou chorar", width: 1200, height: 630 },
  { file: "02", source: "Guarulhos Cultural", description: "Nellva Sântana no Programa Mulheres que Cantam, no Teatro Adamastor", width: 1200, height: 630 },
  { file: "03", source: "Prefeitura de Taboão da Serra", description: "Divulgação de Quase 50 é pra rir ou chorar e ficha técnica com direção musical de Jorge Pereira e Nelva Santana", width: 1200, height: 630 },
  { file: "04", source: "O Taboanense · Gazeta de S. Paulo", description: "Recortes sobre Quase 50 é para rir ou chorar, com apresentação da trajetória musical de Nelva Santana", width: 1200, height: 630 },
  { file: "05", source: "Jornal SP Repórter", description: "Publicações sobre Quase 50 é para rir ou chorar no Cemur, acompanhadas da ficha técnica", width: 1200, height: 630 },
  { file: "06", source: "Prefeitura de Taboão da Serra · Kintê Notícias · SP Repórter", description: "Divulgação do pocket show Duo Intimè no Espaço Cultura no Beco, no Jardim Trianon", width: 1920, height: 1080 },
];

export function Press() {
  return <section className="press-chapter anchor-section" id="imprensa" tabIndex={-1}>
    <div><p className="eyebrow">Imprensa</p><h2>Informação clara.<br /><em>Identidade preservada.</em></h2></div>
    <nav className="press-categories" aria-label="Materiais de imprensa">
      <a href="#clipping">Clipping <span aria-hidden="true">↓</span></a>
      <a href="#release">Release <span aria-hidden="true">↓</span></a>
    </nav>
    <section className="clipping-content anchor-section" id="clipping" tabIndex={-1} aria-labelledby="clipping-title">
      <header><h3 id="clipping-title">Clipping— Publicações e Imprensa</h3><p>Registros e publicações que documentam minha presença artística, reunindo matérias em jornais, divulgações de instituições culturais e registros em canais oficiais de órgãos públicos.</p></header>
      <div className="clipping-publications">{clippings.map(item => <figure key={item.file}>
        <a href={`/images/imprensa/foto-${item.file}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Ampliar recorte: ${item.source} (abre em nova aba)`}>
          <Image src={`/images/imprensa/foto-${item.file}.png`} alt={item.description} width={item.width} height={item.height} sizes="(max-width: 760px) 92vw, 80vw" />
        </a>
        <figcaption><span>{item.source}</span><a className="text-link" href={`/images/imprensa/foto-${item.file}.png`} target="_blank" rel="noopener noreferrer" aria-label={`Ver imagem completa: ${item.source} (abre em nova aba)`}>Ver recorte <span aria-hidden="true">↗</span></a></figcaption>
      </figure>)}</div>
    </section>
    <section className="release-content anchor-section" id="release" tabIndex={-1} aria-labelledby="release-title"><p className="eyebrow">Material profissional</p><h3 id="release-title">Release</h3><div className="release-editorial">
      {/* Temporary existing photograph; the original gold-microphone portrait is pending. */}
      <figure className="release-photo"><Image src="/images/nellva-hero.jpg" alt="Nellva Sântana cantando ao microfone, de vestido floral" width={1357} height={2048} sizes="(max-width: 900px) 88vw, 36vw" /></figure>
      <div className="release-copy"><p className="release-signature" aria-label="Nellva Sântana">Nellva Sântana</p>{release.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </div></section>
  </section>;
}
