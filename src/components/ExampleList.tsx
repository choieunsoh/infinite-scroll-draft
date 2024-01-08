import { FixedSizeList as List } from 'react-window';

interface Props {
  index: number;
  style: any;
}

function Row(props: Props) {
  const { index, style } = props;
  return <div style={style}>Row {index}</div>;
}

export default function ExampleList() {
  return (
    <List height={150} itemCount={1000} itemSize={35} width={300}>
      {Row}
    </List>
  );
}
