interface Props {
  data: any;
}

export default function Result({ data }: Props) {
  return (
    <div>
      <h1>{data}</h1>
    </div>
  );
}
