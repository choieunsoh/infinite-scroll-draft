import { Autocomplete, TextField, useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { cloneElement, forwardRef, useMemo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { ExampleWrapperProps } from './ExampleWrapper';

interface ListBoxProps {
  children?: React.ReactNode;
}

const withInfinite = ({ hasNextPage, isNextPageLoading, items, loadNextPage }: ExampleWrapperProps) => {
  const itemCount = hasNextPage ? items.length + 1 : items.length;
  const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  return forwardRef<HTMLDivElement, ListBoxProps>(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'));
    const itemSize = smUp ? 36 : 48;

    const outerElementType = useMemo(() => {
      return forwardRef<HTMLDivElement>((props2, ref2) => (
        <div ref={ref}>
          <div ref={ref2} {...props2} {...other} />
        </div>
      ));
    }, []);

    const renderRow = ({ data, index, style }: ListChildComponentProps) => {
      return !data || index >= data.length ? (
        <div />
      ) : (
        cloneElement(data[index], {
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
            ...style,
          },
        })
      );
    };

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems} threshold={5}>
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            style={{
              padding: 0,
              height: Math.min(8, itemCount) * itemSize,
              maxHeight: 'auto',
            }}
            itemData={children}
            height={250}
            width="100%"
            outerElementType={outerElementType}
            innerElementType="ul"
            itemSize={itemSize}
            itemCount={itemCount}
            onItemsRendered={onItemsRendered}
            ref={ref}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    );
  });
};

const useStyles: ReturnType<typeof makeStyles> = makeStyles({
  listbox: {
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

export default function InfiniteAutocomplete(props: ExampleWrapperProps) {
  const { hasNextPage, isNextPageLoading, items, loadNextPage } = props;
  const classes = useStyles();
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
      classes={classes}
      ListboxComponent={ListboxComponent}
      options={items}
      getOptionLabel={(option) => option.title}
      onChange={(_, option) => console.log(option)}
      renderInput={(params) => <TextField {...params} variant="outlined" label="Book" fullWidth />}
    />
  );
}
