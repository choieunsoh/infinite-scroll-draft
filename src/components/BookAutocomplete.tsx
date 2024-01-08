import { Autocomplete, TextField } from '@mui/material';
import { forwardRef } from 'react';
import { Book } from '../hooks/useBookSearch';
import { VirtualizedList } from './VirtualizedList';

const ListboxComponent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  function ListboxComponent(props, ref) {
    return <VirtualizedList ref={ref} {...props} />;
  }
);

type BookAutocompleteProps = {
  options: ReadonlyArray<Book>;
  //filterOptions: ReadonlyArray<Book>;
  label: string;
  placeholder?: string;
  //onFilterOptions(values: ReadonlyArray<Book>): void;
};

export default function BookAutocomplete(props: BookAutocompleteProps) {
  const { options, label, placeholder } = props;
  return (
    <Autocomplete
      filterSelectedOptions={false}
      fullWidth
      getOptionLabel={(book) => book.title}
      options={options}
      renderInput={(params: any) => <TextField {...params} label={label} placeholder={placeholder} />}
    />
  );
}
