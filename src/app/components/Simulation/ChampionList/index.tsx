import React from 'react';
import styled from 'styled-components';

import { ChampionData } from '@/app/types/champion';

interface Props {
  champions: ChampionData[];
  isInProgress: boolean;
  isMyTurn: boolean;
  onChampionClick: (d: { img_default: string; champion_id: number }) => void;
  selectedChampions: number[];
}

export default function ChampionList({
  champions,
  isMyTurn,
  isInProgress,
  selectedChampions,
  onChampionClick,
}: Props) {
  const checkSelectedChampion = (id: number) => {
    return selectedChampions.some(n => n === id);
  };

  const handleChampionClick = ({
    champion_id,
    img_default,
    isSelected,
  }: {
    champion_id: number;
    img_default: string;
    isSelected: boolean;
  }) => {
    if (!isMyTurn || !isInProgress || isSelected) return;
    onChampionClick({
      champion_id,
      img_default,
    });
  };

  return (
    <ChampionListLayout>
      {champions.map(({ id, img_default, name_kr }) => {
        const isSelected = checkSelectedChampion(id);

        return (
          <ChampionListItem
            key={id}
            className={isSelected ? 'selected' : ''}
            img_default={img_default}
            onClick={() => {
              handleChampionClick({
                champion_id: id,
                img_default,
                isSelected,
              });
            }}
          >
            <span>{name_kr}</span>
          </ChampionListItem>
        );
      })}
    </ChampionListLayout>
  );
}

const ChampionListLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  width: 100%;
  height: 100%;

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    cursor: pointer;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.3);
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const ChampionListItem = styled.div<{
  img_default: string;
}>`
  display: flex;
  align-items: flex-end;
  position: relative;
  width: 96px;
  height: 96px;
  margin: 4px 3px;
  background-image: url(${props =>
    `${process.env.RIOT_CDN_URL}/${props.img_default}`});
  background-size: cover;
  cursor: pointer;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -100;
    box-sizing: border-box;
    content: '';
    width: 100%;
    height: 100%;
    background: transparent;
  }

  &:hover::after {
    z-index: 0;
    box-shadow: 0 0 10px 3px #a61aff;
    border: solid 2px #7219ff;
  }

  &.selected::after {
    z-index: 100;
    box-shadow: none;
    border: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  span {
    display: block;
    width: 100%;
    height: 26px;
    padding: 0 10px;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 13px;
    font-weight: bold;
  }
`;
