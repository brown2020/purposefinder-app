export const selectStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: "black",
    backgroundColor: "#eeeeee",
    "&:hover": {
      backgroundColor: "#80bdff",
      color: "black",
    },
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
    border: "1px solid #ccc",
    borderRadius: "4px",

    "&:hover": {
      borderColor: "#80bdff",
      boxShadow: "none",
    },
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    color: "black",
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    color: "black",
    backgroundColor: "#eeeeee",
  }),
};
