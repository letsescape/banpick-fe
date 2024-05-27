import CopyLinkItem from '@/app/components/Simulation/CopyLink/CopyLinkItem';
import { SimulationLinks } from '@/app/types/simulation';

interface Props {
  blue: string;
  red: string;
  links: SimulationLinks;
}

export default function CopyLink({ blue, red, links }: Props) {
  const getLink = (link: string) => process.env.APP_URL + link;

  return (
    <div>
      {links.blue && (
        <CopyLinkItem
          title={`${blue} 참가 링크`}
          link={getLink(links.blue)}
          color="#4A8ED4"
        />
      )}
      {links.red && (
        <CopyLinkItem
          title={`${red} 참가 링크`}
          link={getLink(links.red)}
          color="#E74C3C"
        />
      )}
    </div>
  );
}
