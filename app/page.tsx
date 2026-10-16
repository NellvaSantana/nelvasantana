import Image from "next/image";
import type { CSSProperties } from "react";
import { Press } from "@/components/press";
import { VideoCard } from "@/components/video-card";
import { Booking } from "@/components/footer";
import { ScrollRail } from "@/components/scroll-rail";
import { SectionTitle } from "@/components/ui";
import { agendaEvents, musicPlatforms, biography, heroSocialLinks, identity, identityStyles, performanceImages, performances, projects, videos } from "@/data/content";
import { galleryGroups } from "@/data/gallery";

export default function Home() {
  return <>
    <section className="one-hero" id="inicio" tabIndex={-1}>
      <div className="one-hero-copy">
        <h1 aria-label="Nellva Sântana"><span className="hero-first-name"><span className="hero-initial">N</span>ellva</span>{" "}<span className="hero-surname">Sântana</span></h1>
        <p className="hero-line">Minha voz, meu canto...</p>
        <div className="hero-social-links">
          {heroSocialLinks.map(({ id, name, href }) => (
            <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} de Nellva Sântana`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                {id === "instagram" && <g stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></g>}
                {id === "youtube" && <><path d="M21 7.2a2.7 2.7 0 0 0-1.9-1.9C17.4 4.8 12 4.8 12 4.8s-5.4 0-7.1.5A2.7 2.7 0 0 0 3 7.2 28 28 0 0 0 2.5 12 28 28 0 0 0 3 16.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.1.5 7.1.5s5.4 0 7.1-.5a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .5-4.8 28 28 0 0 0-.5-4.8Z" stroke="currentColor" strokeWidth="1.7" /><path d="m10 8.5 6 3.5-6 3.5Z" fill="currentColor" /></>}
                {id === "facebook" && <path d="M14 22v-9h3l.5-3.5H14V7.3c0-1 .3-1.8 1.8-1.8H18V2.4a26 26 0 0 0-2.8-.2c-2.8 0-4.7 1.7-4.7 4.8v2.5H7V13h3.5v9Z" fill="currentColor" />}
              </svg>
            </a>
          ))}
        </div>
        <a className="hero-cue" href="#artista">A artista <span aria-hidden="true">↓</span></a>
      </div>
      <figure className="one-hero-photo"><Image src="/images/nellva-hero.jpg" alt="Nellva Sântana cantando ao microfone, de vestido floral" fill loading="eager" sizes="(max-width: 900px) 100vw, (max-width: 1440px) 66vw, 980px" /></figure>
      <p className="hero-origin">Nordeste, Brasil</p>
    </section>

    <section className="artist-chapter anchor-section" id="artista" tabIndex={-1}>
      <aside><p className="eyebrow">A artista</p><h2>Raízes<br /><em>profundas.</em></h2><p className="artist-motto">A mesma essência em cada canção.</p><dl><div><dt>Base</dt><dd>Nordeste, Brasil</dd></div><div><dt>Influências</dt><dd>Baião, Xote, MPB, Canção</dd></div></dl></aside>
      <div className="artist-copy">{biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </section>

    <section className="identity-chapter anchor-section" id="identidade" tabIndex={-1}>
      <figure><Image src="/images/nellva-identidade.jpg" alt="Nellva Sântana sorrindo e aplaudindo diante do microfone" width={1357} height={2048} sizes="(max-width: 760px) 100vw, 42vw" /></figure>
      <div><SectionTitle eyebrow="Essência">Sons da Diversidade<br /><em>Cultural Brasileira</em></SectionTitle>{identity.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <ul className="identity-styles" aria-label="Vertentes musicais">
        {identityStyles.map(({ symbol, name, description }) => (
          <li key={name} className="identity-style">
            <span className="identity-style-symbol" aria-hidden="true">{symbol}</span>
            <h3>{name}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    </section>

    <section className="performances-chapter anchor-section" id="performances" tabIndex={-1}>
      <SectionTitle eyebrow="A voz em cena" intro="Momentos em que música, cultura e presença artística se encontram.">Performances</SectionTitle>
      <div className="performance-stack">{performances.map((item, index) => {
        const asset = performanceImages[index];
        return <article key={item.id} className={asset ? "" : "text-only"}>{asset && <figure className="performance-photo"><Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes="(max-width: 760px) 100vw, 48vw" /></figure>}<div><p className="eyebrow">{item.place} · {item.year}</p><h3>{item.title}</h3><p>{item.text}</p></div></article>;
      })}</div>
    </section>

    <section className="videos-chapter anchor-section" id="videos" tabIndex={-1}>
      <div className="chapter-heading"><SectionTitle eyebrow="AUDIOVISUAL">Vídeos &amp; <em>Performances</em></SectionTitle></div>
      <ScrollRail label="Vídeos & Performances de Nellva Sântana" className="video-rail">{videos.map(video => <VideoCard key={video.id} video={video} />)}</ScrollRail>
    </section>

    <section className="projects-chapter anchor-section" id="projetos" tabIndex={-1}>
      <header className="section-title"><h2>Parcerias <em>Musicais</em></h2></header>
      <div className="one-projects">{projects.map((project) => (
        <article key={project.title}>
          <figure className="contain"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 760px) 100vw, 48vw" /></figure>
          <div>
            <h3>{project.title}</h3>
            <p className="project-summary">{project.summary}</p>
            <p>{project.text}</p>
            <div className="project-social-links">
              <a href={project.youtube} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} no YouTube`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path d="M21 7.2a2.7 2.7 0 0 0-1.9-1.9C17.4 4.8 12 4.8 12 4.8s-5.4 0-7.1.5A2.7 2.7 0 0 0 3 7.2 28 28 0 0 0 2.5 12 28 28 0 0 0 3 16.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.1.5 7.1.5s5.4 0 7.1-.5a2.7 2.7 0 0 0 1.9-1.9 28 28 0 0 0 .5-4.8 28 28 0 0 0-.5-4.8Z" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m10 8.5 6 3.5-6 3.5Z" fill="currentColor" />
                </svg>
              </a>
              <a href={project.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} no Instagram`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <g stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></g>
                </svg>
              </a>
            </div>
          </div>
        </article>
      ))}</div>
    </section>

    <section className="gallery-chapter anchor-section" id="galeria" tabIndex={-1}>
      <div className="chapter-heading gallery-opening"><SectionTitle eyebrow="MOMENTOS">Galeria</SectionTitle><p>Imagens que revelam diferentes dimensões da presença artística de Nellva Sântana.</p></div>
      <div className="chapter-heading"><SectionTitle eyebrow="Galeria">Presença, música <em>e expressão.</em></SectionTitle></div>
      {galleryGroups.map((group, index) => <section className="gallery-group" aria-labelledby={`gallery-${group.id}`} key={group.id}>
        <header className="gallery-group-heading"><span aria-hidden="true">0{index + 1}</span><h3 id={`gallery-${group.id}`}>{group.title}</h3></header>
        <ScrollRail label={`Galeria — ${group.title}`} className="gallery-rail gallery-curated">
          {group.images.map(image => {
            const ratio = image.width / image.height;
            return <figure key={image.src} style={{ "--photo-ratio": ratio } as CSSProperties}>
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={`(max-width: 760px) min(${Math.ceil(440 * ratio)}px, 84vw), min(${Math.ceil(480 * ratio)}px, 78vw)`} loading="lazy" />
            </figure>;
          })}
        </ScrollRail>
      </section>)}
    </section>

    <section className="agenda-chapter anchor-section" id="agenda" tabIndex={-1}><p className="eyebrow">Agenda</p>{agendaEvents.length ? <div className="agenda-events">{agendaEvents.map(event => <article key={event.id}><h3>{event.title}</h3><p><time dateTime={event.date}>{event.date}</time> · {event.place}</p>{event.href && <a className="text-link" href={event.href}>Detalhes</a>}</article>)}</div> : <h2>Novas apresentações<br /><em>serão anunciadas em breve.</em></h2>}</section>

    <section className="music-chapter anchor-section" id="musica" tabIndex={-1}>
      <p className="eyebrow">Música</p><h2>Sua música em<br /><em>todas as plataformas.</em></h2><p>Da canção brasileira ao repertório de concerto, descubra diferentes encontros com a voz de Nellva.</p><a className="text-link" href="#videos">Ouça nas apresentações <span>↑</span></a><div className="music-platforms">{musicPlatforms.map(platform => platform.href ? <a key={platform.name} href={platform.href} target="_blank" rel="noopener noreferrer">{platform.name}</a> : <div key={platform.name}><h3>{platform.name}</h3><p>Lançamento em breve</p></div>)}</div>
    </section>

    <Press />
    <Booking />
  </>;
}
