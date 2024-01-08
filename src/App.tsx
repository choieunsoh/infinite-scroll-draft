import { Box, Button, TextField, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import BookAutocomplete from './components/BookAutocomplete';
import ExampleWrapper, { InfiniteAutocompleteV2 } from './components/ExampleWrapper';
import InfiniteAutocomplete from './components/InfiniteAutocomplete';
import useBookSearch, { Book } from './hooks/useBookSearch';

function App() {
  return <Example />;
}

export default App;

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: number;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

function Example() {
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const { books, isLoading, isError } = useBookSearch(query, offset);
  const [currentBooks, setCurrentBooks] = useState<ReadonlyArray<Book>>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  useEffect(() => {
    setCurrentBooks((prevBooks) => [...prevBooks, ...books]);
  }, [books]);

  useEffect(() => {
    setCurrentBooks([]);
    setOffset(0);
  }, [query]);

  const handleSearchText = debounce((event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const searchText = event.target.value;
    setQuery(searchText);
    setOffset(0);
  }, 500);

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + 20);
  };

  function loadNextPage(startIndex: number, endIndex: number) {
    setHasNextPage(true);
    setOffset(startIndex);
  }

  return (
    <Box component="main">
      <Button variant="contained" onClick={handleNextPage}>
        Next Page
      </Button>
      <TextField defaultValue={query} onChange={handleSearchText} />
      <Typography>Total: {currentBooks.length}</Typography>

      <BookAutocomplete options={currentBooks} label="Book" />

      <InfiniteAutocomplete
        hasNextPage={hasNextPage}
        isNextPageLoading={isLoading}
        items={currentBooks}
        loadNextPage={loadNextPage}
      />

      <InfiniteAutocompleteV2
        hasNextPage={hasNextPage}
        isNextPageLoading={isLoading}
        items={currentBooks}
        loadNextPage={loadNextPage}
      />

      <ExampleWrapper
        hasNextPage={hasNextPage}
        isNextPageLoading={isLoading}
        items={currentBooks}
        loadNextPage={loadNextPage}
      />
    </Box>
  );
}
// https://codesandbox.io/p/sandbox/material-demo-0fbyb?file=%2Fdemo.js%3A89%2C25-89%2C37

// https://stackblitz.com/edit/react-dzmzy2?file=demo.tsx

// https://codesandbox.io/p/sandbox/my-app-6te1w?file=%2Fsrc%2FInfiniteLoader.tsx%3A6%2C1

// https://codesandbox.io/p/sandbox/wonderful-river-knn3r?file=%2Fsrc%2FInfiniteAutocomplete.js

// https://codesandbox.io/p/sandbox/material-demo-33l5y?file=%2Fdemo.js%3A618%2C10-618%2C28

/*

import React, { useEffect, useRef, forwardRef, useContext, ReactNode, HTMLAttributes } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme, Theme } from "@mui/material/styles";
import { VariableSizeList } from "react-window";
import { RenderRowProps } from '@/share/InterfaceTypes';
import '@/style/Slider.scss';
import '@/style/table.scss';
import { ListSubheader } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setIsLoadingList, } from "@/redux/getAutoCompleteSlice";

const LISTBOX_PADDING = 8; // px

function renderRow(props: RenderRowProps) {
    const { data, index, style } = props;
    return React.cloneElement(data[index] as React.ReactElement, {
        style: {
            ...style,
            top: +(style.top!) + LISTBOX_PADDING!,
            padding: LISTBOX_PADDING + 5
        },
    });
}


const OuterElementContext = React.createContext<Record<string, unknown>>({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache<T>(data: T[]) {
    const ref = useRef<VariableSizeList>(null);
    useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
interface CustomAutoListboxProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}
const CustomAutoListboxComponent = forwardRef<HTMLDivElement, CustomAutoListboxProps>((props, ref) => {
    const { children, ...other } = props;
    const dispatch: AppDispatch = useDispatch();
    const itemData = React.Children.toArray(children);
    const theme = useTheme<Theme>();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;
    const getItemSize = (child: any) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }
        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getItemSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache([itemCount]);

    return (
        <div   {...other} ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    onItemsRendered={({ visibleStopIndex }) => {
                        if (visibleStopIndex === itemData.length - 1) {
                            dispatch(setIsLoadingList(true))
                        } else {
                            dispatch(setIsLoadingList(false))
                        }
                    }}
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef as React.RefObject<VariableSizeList>}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={getItemSize}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
})

export default CustomAutoListboxComponent;
*/
