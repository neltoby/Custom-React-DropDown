import {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  FormEvent,
  MouseEvent
} from "react";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import Backdrop from "@material-ui/core/Backdrop";

interface option {
  name: string;
  value: any;
}

enum bordered {
  outlined = "outlined",
  standard = "standard",
  filled = "filled"
}

enum fontSize {
  sm = "1.1rem",
  md = "1.3rem",
  lg = "1.5rem",
  xl = "1.7rem"
}

enum size {
  sm = "1.3rem",
  md = "1.6rem",
  lg = "1.9rem",
  xl = "2.2rem"
}

type inputBackdropProps = {
  placeholder: string;
  height?: size;
  inputNameBackdrop: string;
  handleOnChangeBackdrop: (val: string) => void;
};

type listType = {
  arrangedOptions: option[];
  currentSelected: option;
  height?: size;
  fontColor: string;
  selectedColor: string;
  hoverColor: string;
  onClick: (item: any) => void;
  toggleDropdown: () => void;
  modal: boolean;
};

type variants = "outlined" | "standard" | "filled";

type DropDownProp = {
  options: option[];
  onChange: Function;
  selectedColor: string;
  hoverColor: string;
  fontColor: string;
  placeholder: string;
  selected?: number;
  height?: size;
  variant?: variants;
};

const bdColor = "#ddd";

const useStylesInput = makeStyles({
  inputContainer: {
    display: "flex",
    flexGrow: 0.1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderBottom: "1px solid #ddd !important",
    backgroundColor: "inherit",
    "& input": {
      padding: "0.6rem 1rem",
      outline: "none",
      border: "none",
      width: "100%",
      height: "100%",
      backgroundColor: "inherit",
      fontSize: (props: inputBackdropProps) =>
        !props.height
          ? fontSize.sm
          : props.height === size.sm
          ? fontSize.sm
          : props.height === size.md
          ? fontSize.md
          : props.height === size.lg
          ? fontSize.lg
          : fontSize.xl
    }
  }
});

const useStyle = makeStyles({
  selected: {
    backgroundColor: (props: listType) => props.selectedColor
  },
  optionsList: {
    borderBottom: "1px solid #ddd"
  },
  option: {
    display: "block",
    padding: "0.5rem 1rem",
    color: (props: listType) => props.fontColor,
    cursor: "pointer",
    lineHeight: (props: listType) => (props.height ? props.height : size.sm),
    fontSize: (props: listType) =>
      !props.height
        ? fontSize.sm
        : props.height === size.sm
        ? fontSize.sm
        : props.height === size.md
        ? fontSize.md
        : props.height === size.lg
        ? fontSize.lg
        : fontSize.xl,
    fontWeight: 600,
    "&:hover": {
      backgroundColor: (props: listType) => props.hoverColor
    }
  },
  radio: {
    marginRight: "1rem"
  }
});
const useStyles = makeStyles({
  root: {
    position: "relative",
    userSelect: "none",
    width: "100%",
    outline: "none"
  },
  container: {
    position: "relative",
    display: "flex",
    width: "100%",
    outline: "none"
  },
  chosen: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6rem 1rem",
    height: (props: DropDownProp) => (props.height ? props.height : size.sm),
    lineHeight: (props: DropDownProp) =>
      props.height ? props.height : size.sm,
    width: "100%",
    cursor: "pointer",
    border: (props: DropDownProp) =>
      !props.variant
        ? `1px solid ${bdColor}`
        : props.variant === bordered.standard ||
          props.variant === bordered.filled
        ? "none"
        : `1px solid ${bdColor}`,
    backgroundColor: (props: DropDownProp) =>
      !props.variant
        ? "#fff"
        : props.variant === bordered.outlined ||
          props.variant === bordered.standard
        ? "#fff"
        : bdColor,
    borderBottom: `1px solid ${bdColor} !important`,
    "& input": {
      outline: "none",
      border: "none",
      width: "98%",
      backgroundColor: "inherit",
      fontSize: (props: DropDownProp) =>
        !props.height
          ? fontSize.sm
          : props.height === size.sm
          ? fontSize.sm
          : props.height === size.md
          ? fontSize.md
          : props.height === size.lg
          ? fontSize.lg
          : fontSize.xl
    }
  },
  arrow: {
    position: "relative",
    height: "1%",
    width: "1%",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "9px",
      height: "100%",
      bottom: 0,
      transition: "all 0.5s ease",
      left: "-3px",
      transform: "rotate(45deg)",
      backgroundColor: "#394a6d"
    },
    "&::after": {
      content: '""',
      position: "absolute",
      width: "9px",
      height: "100%",
      bottom: 0,
      transition: "all 0.5s ease",
      left: "3px",
      transform: "rotate(-45deg)",
      backgroundColor: "#394a6d"
    }
  },
  arrowOpen: {
    "&::before": {
      left: "-3px",
      transform: "rotate(-45deg)"
    },
    "&::after": {
      left: "3px",
      transform: "rotate(45deg)"
    }
  },
  allOptions: {
    position: "absolute",
    maxHeight: "150px",
    overflowY: "scroll",
    width: "inherit !important",
    display: "block",
    top: 0,
    left: 0,
    right: 0,
    padding: "0",
    borderRight: `1px solid ${bdColor}`,
    borderLeft: `1px solid ${bdColor}`,
    borderBottom: `1px solid ${bdColor}`,
    opacity: 0,
    zIndex: 2,
    boxShadow: "3px 3px 5px #ddd",
    visibility: "hidden",
    transition: "opacity 0.3s ease, visibility 0.3s ease, top 0.5s ease"
  },
  open: {
    opacity: 1,
    visibility: "visible",
    top: "100%"
  },
  backdrop: {
    zIndex: 1000
  },
  selectContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    width: "90%",
    maxHeight: "100%",
    height: "90%",
    borderRadius: "0.3rem",
    overflowX: "auto"
  },
  backbutton: {
    flexGrow: 0.1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1da1f2",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "bold",
    padding: "0.4rem",
    textTransform: "uppercase"
  },
  optionContainer: {
    flexGrow: 0.8,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll"
  }
});

const DisplayedList = (props: listType) => {
  const cs = useStyle(props);
  const {
    arrangedOptions,
    toggleDropdown,
    currentSelected,
    onClick,
    modal
  } = props;
  return (
    <>
      {arrangedOptions.map((item: option, i: number) => {
        if (!item.value) {
          return (
            <span
              className={modal ? `${cs.option} ${cs.optionsList}` : cs.option}
              onClick={toggleDropdown}
              key={i}
            >
              {item.name}
            </span>
          );
        }
        return (
          <span
            className={
              modal
                ? `${cs.option} ${cs.optionsList} ${
                    item.value === currentSelected.value ? cs.selected : null
                  }`
                : `${cs.option} ${
                    item.value === currentSelected.value ? cs.selected : null
                  }`
            }
            onClick={(e: MouseEvent) => {
              console.log("click event");
              onClick(item);
            }}
            key={i}
          >
            {modal && (
              <input
                checked={item.value === currentSelected.value}
                className={cs.radio}
                type="radio"
                readOnly
              />
            )}
            {item.name}
          </span>
        );
      })}
    </>
  );
};

const BackdropInput: FunctionComponent<inputBackdropProps> = (props) => {
  const cs = useStylesInput(props);
  const inputRef = useRef(null);
  const { placeholder, inputNameBackdrop, handleOnChangeBackdrop } = props;

  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    handleOnChangeBackdrop(e.currentTarget.value);
  };

  const onFocus = (e: FocusEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const node = inputRef.current as any;
    node?.focus();
  });
  return (
    <div className={cs.inputContainer}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputNameBackdrop}
        onChange={handleOnChange}
        ref={inputRef}
        onFocus={onFocus}
      />
    </div>
  );
};

export const DropDown: FunctionComponent<DropDownProp> = (props) => {
  const cs = useStyles(props);
  const { options, selected, placeholder, onChange } = props;
  const defaultSelected = selected
    ? options[selected]
    : { name: "", value: "" };

  const [open, setOpen] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(defaultSelected);
  const [inputNameBackdrop, setInputNameBackdrop] = useState(
    currentSelected.name
  );
  const [inputName, setInputName] = useState(currentSelected.name);
  const [arrangedOptions, setArrangedOptions] = useState([
    { name: `Loading options`, value: "" }
  ]);

  const sortFxn = (arr: option[]) => {
    arr.sort((a: option, b: option) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
    return arr;
  };

  const sortOptions = (value: string) => {
    if (value.trim().length) {
      const sliced = sortFxn(options.slice());

      const arr = sliced.filter((option) =>
        option.name.toLowerCase().includes(value)
      );
      if (arr.length) setArrangedOptions(arr);
      else
        setArrangedOptions([
          { name: `No match found for ${value}`, value: "" }
        ]);
    }
  };

  const alignOptions = () => {
    const optionsArr = sortFxn(options);
    setArrangedOptions(optionsArr);
  };

  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    setInputName(e.currentTarget.value);
    sortOptions(e.currentTarget.value.toLowerCase());
    if (!e.currentTarget.value.length) {
      setCurrentSelected(defaultSelected);
      if (!currentSelected.value) setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handleOnChangeBackdrop = (value: string) => {
    setInputNameBackdrop(value);
    sortOptions(value.toLowerCase());
    if (!value.trim().length) {
      setCurrentSelected(defaultSelected);
      if (!currentSelected.value) setOpen(false);
    } else {
      console.log(value, "is avlue");
      setOpen(true);
    }
  };

  const closeBackDrop = () => {
    setInputNameBackdrop("");
    alignOptions();
    setOpen(false);
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const onClick = (item: option) => {
    setInputNameBackdrop("");
    setCurrentSelected(item);
    setInputName(item.name);
    onChange(item.value);
  };

  useEffect(() => {
    alignOptions();
  }, [currentSelected.name]);

  useEffect(() => {
    if (!inputNameBackdrop) {
      alignOptions();
    }
  }, [inputNameBackdrop]);

  useEffect(() => {
    if (!inputName.length) {
      options.sort();
      setArrangedOptions(options);
    }
  }, [inputName]);

  return (
    <div
      className={cs.root}
      role="listbox"
      aria-label="Choose an option"
      onClick={toggleDropdown}
      tabIndex={1}
    >
      <div className={cs.container}>
        <div className={cs.chosen}>
          <input
            type="text"
            placeholder={placeholder}
            value={inputName}
            onChange={handleOnChange}
          />
          <div className={`${cs.arrow} ${open ? cs.arrowOpen : ""}`} />
        </div>
        <Hidden mdUp implementation="js">
          <Backdrop className={cs.backdrop} open={open} onClick={closeBackDrop}>
            <div className={cs.selectContainer}>
              <BackdropInput
                placeholder={placeholder}
                inputNameBackdrop={inputNameBackdrop}
                handleOnChangeBackdrop={handleOnChangeBackdrop}
              />
              <div className={cs.optionContainer}>
                <DisplayedList
                  arrangedOptions={arrangedOptions}
                  currentSelected={currentSelected}
                  height={props.height}
                  fontColor={props.fontColor}
                  onClick={onClick}
                  hoverColor={props.hoverColor}
                  selectedColor={props.selectedColor}
                  toggleDropdown={toggleDropdown}
                  modal={true}
                />
              </div>
              <div onClick={toggleDropdown} className={cs.backbutton}>
                Close
              </div>
            </div>
          </Backdrop>
        </Hidden>
        <Hidden smDown implementation="js">
          <div className={`${cs.allOptions} ${open ? cs.open : ""}`}>
            <DisplayedList
              arrangedOptions={arrangedOptions}
              currentSelected={currentSelected}
              height={props.height}
              fontColor={props.fontColor}
              onClick={onClick}
              hoverColor={props.hoverColor}
              selectedColor={props.selectedColor}
              toggleDropdown={toggleDropdown}
              modal={false}
            />
          </div>
        </Hidden>
      </div>
    </div>
  );
};
