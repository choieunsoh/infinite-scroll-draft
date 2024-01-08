import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { ListChildComponentProps, VariableSizeList } from 'react-window';

const LISTBOX_PADDING = 8;
const DEFAULT_CELL_SIZE = 36;

const Row = ({
  data,
  index,
  setSize,
  style,
}: ListChildComponentProps & {
  setSize: (index: number, height: number) => void;
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!rowRef.current) return;
    setSize(index, rowRef.current.getBoundingClientRect().height);
  }, [setSize, index]);

  return (
    <div style={{ ...style, top: (style.top as number) + LISTBOX_PADDING }}>
      <div ref={rowRef}>{data[index]}</div>
    </div>
  );
};

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

OuterElementType.displayName = 'OuterElementType';

function useResetCache(data: any) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) ref.current.resetAfterIndex(0, true);
  }, [data]);
  return ref;
}

interface ListBoxProps {
  children?: React.ReactNode;
  size?: number;
  spacing?: number;
  listClassName?: string;
  dynamicHeight?: boolean;
  dynamicHeightRef?: React.RefObject<HTMLDivElement>;
}

const ListBox = forwardRef<HTMLDivElement, ListBoxProps>(function ListBox(
  {
    children,
    size = DEFAULT_CELL_SIZE,
    spacing = 0,
    listClassName,
    dynamicHeight = false,
    dynamicHeightRef,
    ...other
  }: ListBoxProps,
  ref
) {
  const itemData = useMemo(() => Children.toArray(children), [children]);
  const itemCount = itemData.length;
  const gridRef = useResetCache(itemCount);
  const sizeMap = useRef<{ [k: number]: number }>({});

  const getDynamicHeight = useCallback(
    (cell_size = DEFAULT_CELL_SIZE) => {
      if (dynamicHeight && dynamicHeightRef?.current) return dynamicHeightRef.current.offsetHeight;
      if (itemCount > 8) return 8 * cell_size;
      return itemData.map(() => cell_size).reduce((a, b) => a + b, 0);
    },
    [dynamicHeightRef?.current, itemCount]
  );

  const setSize = useCallback(
    (index: number, size: number) => {
      sizeMap.current = { ...sizeMap.current, [index]: size };
      if (!gridRef.current) return;
      gridRef.current.resetAfterIndex(index);
    },
    [size, gridRef.current]
  );

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getDynamicHeight(size) + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => (sizeMap.current[index] || DEFAULT_CELL_SIZE) + spacing}
          overscanCount={5}
          itemCount={itemCount}
          className={listClassName}
        >
          {({ data, index, style }) => <Row data={data} index={index} setSize={setSize} style={style} />}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

export default ListBox;
