import { Autocomplete, TextField, useMediaQuery, useTheme } from '@mui/material';
import { ReactChild, createContext, forwardRef, useContext, useEffect, useRef } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Book } from '../hooks/useBookSearch';

export type LoadMoreItemFunction = (startIndex: number, stopIndex: number) => Promise<void> | void;
export type ExampleWrapperProps = {
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage: boolean;

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  isNextPageLoading: boolean;

  // Array of items loaded so far.
  items: ReadonlyArray<Book>;

  // Callback function responsible for loading the next page of items.
  loadNextPage: LoadMoreItemFunction;
};

type ItemProps = {
  index: number;
  style: React.CSSProperties;
};

const LISTBOX_PADDING = 8; // px

function useResetCache(data: any) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const withInfinite = ({ hasNextPage, isNextPageLoading, items, loadNextPage }: ExampleWrapperProps) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  const ListboxComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
      const { children, ...other } = props;
      const itemData: React.ReactChild[] = [];
      (children as React.ReactChild[]).forEach((item: React.ReactChild & { children?: React.ReactChild[] }) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
      });

      const theme = useTheme();
      const smUp = useMediaQuery(theme.breakpoints.up('sm'));
      const itemSize = smUp ? 36 : 48;

      const getChildSize = (child: ReactChild) => {
        return itemSize;
      };

      const getHeight = () => {
        if (itemCount > 8) {
          return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
      };

      const gridRef = useResetCache(itemCount);

      // Render an item or a loading indicator.
      const Item = ({ index, style }: ItemProps) => {
        let content;
        if (!isItemLoaded(index)) {
          content = 'Loading...';
        } else {
          content = items[index].title;
        }

        return (
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
              ...style,
            }}
          >
            {content}
          </div>
        );
      };

      return (
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems} threshold={5}>
          {({ onItemsRendered, ref }) => (
            <div ref={ref}>
              <OuterElementContext.Provider value={other}>
                <VariableSizeList
                  itemData={itemData}
                  height={getHeight() + 2 * LISTBOX_PADDING}
                  width="100%"
                  ref={gridRef}
                  outerElementType={OuterElementType}
                  innerElementType="ul"
                  itemSize={(index) => getChildSize(itemData[index])}
                  overscanCount={5}
                  itemCount={itemCount}
                  onItemsRendered={onItemsRendered}
                >
                  {Item}
                </VariableSizeList>
              </OuterElementContext.Provider>
            </div>
          )}
        </InfiniteLoader>
      );
    }
  );

  return ListboxComponent;
};

export default function ExampleWrapper(props: ExampleWrapperProps) {
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const itemSize = smUp ? 36 : 48;

  const { hasNextPage, isNextPageLoading, items, loadNextPage } = props;
  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const Item = ({ index, style }: ItemProps) => {
    let content;
    if (!isItemLoaded(index)) {
      content = 'Loading...';
    } else {
      content = items[index].title;
    }

    return (
      <li
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
          ...style,
        }}
      >
        {content}
      </li>
    );
  };

  return (
    <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
      {({ onItemsRendered, ref }) => (
        <List
          className="List"
          height={250}
          width="100%"
          innerElementType="ul"
          itemCount={itemCount}
          itemSize={itemSize}
          outerElementType={OuterElementType}
          onItemsRendered={onItemsRendered}
          ref={ref}
          style={{
            padding: 0,
            maxHeight: 'auto',
          }}
        >
          {Item}
        </List>
      )}
    </InfiniteLoader>
  );
}

export function InfiniteAutocompleteV2(props: ExampleWrapperProps) {
  const { hasNextPage, isNextPageLoading, items, loadNextPage } = props;
  const ListboxComponent = withInfinite({
    hasNextPage,
    isNextPageLoading,
    items,
    loadNextPage,
  });

  return (
    <Autocomplete
      style={{ width: 300 }}
      disableListWrap
      ListboxComponent={ListboxComponent}
      options={items}
      getOptionLabel={(option) => option.title}
      onChange={(_, option) => console.log(option)}
      renderInput={(params) => <TextField {...params} variant="outlined" label="Book" fullWidth />}
    />
  );
}
