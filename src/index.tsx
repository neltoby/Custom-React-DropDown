import { render } from "react-dom";

import { DropDown } from "./components/dropdown";

const arr = [
  {
    name: "white",
    value: "#fff277"
  },
  {
    name: "black",
    value: "#000321"
  },
  {
    name: "yellow",
    value: "#ffff098"
  },
  {
    name: "dark",
    value: "#00000wew"
  },
  {
    name: "oral",
    value: "#fffghr22"
  },
  {
    name: "orange",
    value: "#00054333"
  },
  {
    name: "pink",
    value: "#fff78355"
  },
  {
    name: "brown",
    value: "#000ghe33"
  },
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
    variant="standard"
  />,
  rootElement
);
