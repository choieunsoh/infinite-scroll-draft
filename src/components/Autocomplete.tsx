import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteInputChangeReason,
  FormControl,
  FormHelperText,
  AutocompleteProps as MUIAutocompleteProps,
  OutlinedTextFieldProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { Ref, useCallback, useMemo } from 'react';
import ListBox from './ListBox';
import LoadingPlaceholder from './LoadingPlaceholder';
type MuiAutocompleteProps = MUIAutocompleteProps<any, boolean, boolean, boolean>;

export interface AutocompleteProps {
  name: string;
  labelText?: string;
  required?: boolean;
  inputRef?: Ref<any>;
  allowNull?: boolean;
  isLoading?: boolean;
  disable?: boolean;
  options?: any[];
  className?: string;
  value: string | number | null | any[];
  accessor?: string;
  error?: string;
  filterOptions?: MuiAutocompleteProps['filterOptions'];
  selectOnFocus?: MuiAutocompleteProps['selectOnFocus'];
  freeSolo?: MuiAutocompleteProps['freeSolo'];
  outlinedTextFieldProps?: OutlinedTextFieldProps['InputProps'];
  textFieldProps?: TextFieldProps;
  filterSelectedOptions?: MuiAutocompleteProps['filterSelectedOptions'];
  showPlaceHolderOnLoading?: boolean | null;
  noOptionsText?: MuiAutocompleteProps['noOptionsText'];
  multiple?: boolean;
  /**
   * @default "None"
   */
  nullDisplay?: string;
  ListboxComponent?: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  virtualized?: boolean;
  name_accessor?: string;
  onInputChange?:
    | ((event: React.ChangeEvent<Record<string, any>>, value: string, reason: AutocompleteInputChangeReason) => void)
    | undefined;
  renderOption?: (data: any) => JSX.Element;
  renderTags?: MuiAutocompleteProps['renderTags'];
  onChange: (
    event: ChangeEvent<unknown>,
    value: any,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<any> | undefined
  ) => void;
  id?: string;
  classes?: MuiAutocompleteProps['classes'];
}

export default function MyAutocomplete({
  inputRef,
  name,
  labelText,
  required,
  allowNull = true,
  nullDisplay = 'None',
  value,
  isLoading,
  disable,
  options = [],
  className,
  accessor = 'id',
  error,
  showPlaceHolderOnLoading = true,
  virtualized = true,
  name_accessor = 'display_name',
  multiple = false,
  outlinedTextFieldProps = {},
  textFieldProps = {},
  ...props
}: AutocompleteProps): JSX.Element {
  const memoizedOptions = useMemo(
    () =>
      allowNull && !multiple
        ? [
            {
              [accessor]: '',
              [name_accessor]: nullDisplay,
              color: 'transparent',
            },
            ...options,
          ]
        : options,
    [options, nullDisplay, multiple]
  );
  const getOptionLabel = useCallback(
    (option: any) => {
      if (option === '') return nullDisplay;
      return (
        option[name_accessor] ??
        memoizedOptions.find((i: { [x: string]: unknown }) => i[accessor] == option)?.[name_accessor] ??
        option
      );
    },
    [memoizedOptions, nullDisplay, multiple, name]
  );

  /*const getOptionSelected = useCallback(
    (option: string, value: string) => {
      if (typeof option === 'string' && typeof value === 'string') return option === value;
      if (typeof option === 'object') {
        if (value && typeof value === 'object') return option[accessor] === value[accessor];
        return option[accessor] === value;
      }
      return false;
    },
    [accessor]
  );*/

  if (isLoading && showPlaceHolderOnLoading) return <LoadingPlaceholder />;
  if (virtualized) props.ListboxComponent = ListBox as React.ComponentType<React.HTMLAttributes<HTMLElement>>;

  return (
    <FormControl variant="outlined" className={className}>
      <Autocomplete
        style={{ width: '300px' }}
        {...props}
        autoComplete
        multiple={multiple}
        options={memoizedOptions}
        value={multiple ? value : !allowNull ? value : value ?? ''}
        clearOnBlur
        /*getOptionSelected={getOptionSelected}*/
        getOptionLabel={getOptionLabel}
        loading={isLoading}
        disabled={disable}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              {...textFieldProps}
              inputRef={inputRef}
              name={name}
              label={labelText}
              variant="outlined"
              required={required}
              InputProps={{
                ...outlinedTextFieldProps,
                ...params.InputProps,
                autoComplete: 'off',
              }}
            />
          );
        }}
      />
      <FormHelperText error={Boolean(error)}>{error}</FormHelperText>
    </FormControl>
  );
}
