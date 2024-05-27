import styled from 'styled-components';

interface Props {
  title: string;
  link: string;
  color?: string;
}

export default function CopyLinkItem({ title, link }: Props) {
  const copyClipBoard = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert('복사 되었습니다.');
      })
      .catch(() => {
        alert('오류');
      });
  };

  return (
    <div
      style={{
        padding: '12px 0',
      }}
    >
      <h6>{title}</h6>
      <div onClick={copyClipBoard}>
        <div>{/*<MdContentCopy fontSize="large" color="#ffffff" />*/}</div>
        <div
          style={{
            color: '#fff',
          }}
        >
          <LinkText>{link}</LinkText>
        </div>
      </div>
    </div>
  );
}

const LinkText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
