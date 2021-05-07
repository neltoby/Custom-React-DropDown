import {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  FormEvent,
  MouseEvent
} from "react";
import { makeStyles } from "@material-ui/styles";

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
  sm = "0.9rem",
  md = "1.1rem",
  lg = "1.3rem",
  xl = "1.5rem"
}

enum size {
  sm = "1.3rem",
  md = "1.6rem",
  lg = "1.9rem",
  xl = "2.2rem"
}

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
    visibility: "hidden",
    transition: "opacity 0.3s ease, visibility 0.3s ease, top 0.5s ease"
  },
  selected: {
    backgroundColor: (props: DropDownProp) => props.selectedColor
  },
  option: {
    display: "block",
    padding: "0.5rem 1rem",
    color: (props: DropDownProp) => props.fontColor,
    cursor: "pointer",
    lineHeight: (props: DropDownProp) =>
      props.height ? props.height : size.sm,
    fontSize: (props: DropDownProp) =>
      !props.height
        ? fontSize.sm
        : props.height === size.sm
        ? fontSize.sm
        : props.height === size.md
        ? fontSize.md
        : props.height === size.lg
        ? fontSize.lg
        : fontSize.xl,
    fontWeight: 500,
    "&:hover": {
      backgroundColor: (props: DropDownProp) => props.hoverColor
    }
  },
  open: {
    opacity: 1,
    visibility: "visible",
    top: "100%"
  }
});

export const DropDown: FunctionComponent<DropDownProp> = (props) => {
  const cs = useStyles(props);
  const { options, selected, placeholder, onChange } = props;
  const defaultSelected = selected
    ? options[selected]
    : { name: "", value: "" };

  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(defaultSelected);
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

  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
    setInputName(e.currentTarget.value);
    sortOptions(e.currentTarget.value);
    if (!e.currentTarget.value.length) {
      setCurrentSelected(defaultSelected);
      if (!currentSelected.value) setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const onClick = (item: option) => {
    setCurrentSelected(item);
    setInputName(item.name);
    onChange(item.value);
  };

  const toggleDropdown = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const optionsArr = sortFxn(options);
    setArrangedOptions(optionsArr);
  }, [currentSelected.name]);

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
      ref={containerRef}
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
        <div
          className={`${cs.allOptions} ${open ? cs.open : ""}`}
          onBlur={() => console.log("blur was called")}
        >
          {arrangedOptions.map((item: option, i: number) => {
            if (!item.value) {
              return (
                <span className={cs.option} onClick={toggleDropdown} key={i}>
                  {item.name}
                </span>
              );
            }
            return (
              <span
                className={`${cs.option} ${
                  item.value === currentSelected.value ? cs.selected : null
                }`}
                onClick={(e: MouseEvent) => {
                  console.log("click event");
                  onClick(item);
                }}
                key={i}
              >
                {item.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
