import { render } from "react-dom";

import { DropDown } from "./components/dropdown";

const arr = [
  {
    name: "white",
    value: "#fff"
  },
  {
    name: "black",
    value: "#000"
  },
  {
    name: "yellow",
    value: "#ffffff"
  },
  {
    name: "dark",
    value: "#00000"
  },
  {
    name: "oral",
    value: "#fffghr"
  },
  {
    name: "orange",
    value: "#000543"
  },
  {
    name: "pink",
    value: "#fff783"
  },
  {
    name: "brown",
    value: "#000ghe"
  }
];

const rootElement = document.getElementById("root");
render(
  <DropDown
    options={arr}
    onChange={(item: any) => console.log(item)}
    selectedColor="blue"
    fontColor="black"
    hoverColor="green"
    placeholder="Select an option"
    variant="filled"
  />,
  rootElement
);
