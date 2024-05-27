import Image from 'next/image';
import React, { useState } from 'react';

import {
  Button,
  SearchWrap,
} from '@/app/components/Simulation/ChampionSearch/styled';
import { InputSearchProp } from '@/app/components/Simulation/ChampionSearch/types';

import searchIcon from '@/assets/icons/ico-search-bk.svg';

export default function ChampionSearch({
  onSubmit,
  variant,
  ...props
}: InputSearchProp) {
  const [input, setInput] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <SearchWrap variant={variant} onSubmit={handleSubmit}>
      <input
        type="text"
        {...props}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <Button type="submit">
        <Image src={searchIcon} alt="검색" width={11} height={11} />
      </Button>
    </SearchWrap>
  );
}
