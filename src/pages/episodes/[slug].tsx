import { api } from '../../services/api'
import { GetStaticPaths, GetStaticProps } from "next";
import ptBR from "date-fns/locale/pt-BR";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { format, parseISO } from "date-fns";
import styles from './episode.module.scss'
import Image from 'next/image';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  url: string;
  published_at: string;
  durationAsString: string;
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode ({ episode }: EpisodeProps ) {
 
    return (
        <div className={styles.episode}>
          <div className={styles.thumbnailContainer}>
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar"/>  
            </button>
            <Image 
            width={700} 
            height={160} 
            src={episode.thumbnail} 
            objectFit ="cover"
            />
            <button>
              <img src="/play.svg" alt="Tocar episódio" />
            </button>
          </div>

          <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.published_at}</span>
            <span>{episode.durationAsString}</span>
          </header>

          <div 
            className={styles.description} 
            dangerouslySetInnerHTML={{__html: episode.description}} 
          />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'  
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

    const {slug} = ctx.params

    const {data} = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        published_at: format(parseISO(data.published_at), "d MMM yy", {locale: ptBR,}),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
      };

    return {
        props: {
          episode,
        },
        revalidate: 60 * 60 * 24, //24 horas
    }
}