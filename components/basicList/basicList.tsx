import React, { useState } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  Pagination,
  Stack,
  Typography,
  Grid,
} from "@mui/material";
import { BasicDataViewProps } from "../../types/basicDataView";
import { SearchInput } from "../searchInput";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { nixTypes } from "../../models/nix";
import { NixType } from "../../types/nix";

export type BasicListItem = {
  item: React.ReactNode;
  key: string;
};
export type BasicListProps = BasicDataViewProps & {
  handleFilter: (t: NixType, mode: "from" | "to") => void;
  preview: React.ReactNode;
};

interface SelectOptionProps {
  label: string;
  handleChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}

const SelectOption = (props: SelectOptionProps) => {
  const { label, handleChange, options } = props;
  const [value, setValue] = React.useState<NixType>("any");

  const _handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = (event.target as HTMLInputElement).value as NixType;
    setValue(newVal);
    handleChange(newVal);
  };
  const handleClear = () => {
    setValue("any");
    handleChange("any");
  };

  return (
    <FormControl>
      <FormLabel>
        <Box>
          <IconButton
            // disabled={value === ""}
            aria-label="clear-button"
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
          {label}
        </Box>
      </FormLabel>

      <RadioGroup sx={{ pl: 1.5 }} value={value} onChange={_handleChange}>
        {options.map(({ value, label }) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export function BasicList(props: BasicListProps) {
  const { items, pageCount = 1, handleSearch, handleFilter, preview } = props;
  // const [from, setFrom] = useState<NixType>("any");
  // const [to, setTo] = useState<NixType>("any");

  const [page, setPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const _handleFilter = (t: NixType, mode: "from" | "to") => {
    handleFilter(t, mode);
    setPage(1);
  };

  const _handleSearch = (term: string) => {
    handleSearch && handleSearch(term);
    setSearchTerm(term);
    setPage(1);
  };

  return (
    <Stack>
      <SearchInput
        placeholder="search nix functions"
        handleSearch={_handleSearch}
        clearSearch={() => _handleSearch("")}
      />
      <Box>
        <Grid container>
          <Grid item xs={12} lg={3}>
            <Stack direction="row">
              <SelectOption
                label="from type"
                handleChange={(value) => {
                  _handleFilter(value as NixType, "from");
                }}
                options={nixTypes.map((v) => ({ value: v, label: v }))}
              />
              <Typography
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <ChevronRightIcon />
              </Typography>
              <SelectOption
                label="to type"
                handleChange={(value) => {
                  _handleFilter(value as NixType, "to");
                }}
                options={nixTypes.map((v) => ({ value: v, label: v }))}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={9}>
            {preview}
          </Grid>
        </Grid>
      </Box>
      <List aria-label="basic-list" sx={{ pt: 0 }}>
        {items.map(({ item, key }) => (
          <ListItem key={key} aria-label={`item-${key}`} sx={{ px: 0 }}>
            {item}
          </ListItem>
        ))}
      </List>

      <Pagination
        sx={{ display: "flex", justifyContent: "center", mt: 1, mb: 10 }}
        count={pageCount}
        color="primary"
        page={page}
        onChange={handlePageChange}
      />
    </Stack>
  );
}
