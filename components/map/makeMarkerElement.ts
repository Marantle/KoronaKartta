import { Point } from "../../interfaces/corona";

export default (
  allPoint: Point,
  currentPoint: Point,
  recoveredPoint: Point,
  deceasedPoint: Point
) => {
  const container = document.createElement("div");
  container.className = "container";
  [allPoint, currentPoint, recoveredPoint, deceasedPoint].forEach(point => {
    const markerContainer = document.createElement("div");
    markerContainer.className = "marker-container";

    const markerImg = document.createElement("img");
    markerImg.className = "marker";
    markerImg.src = point.properties.type as string;

    const markerTxt = document.createElement("h1");
    markerTxt.className = "marker-text";
    markerTxt.innerText = String(point.properties.count);

    markerContainer.appendChild(markerImg);
    markerContainer.appendChild(markerTxt);
    container.appendChild(markerContainer);
  });
  return container;
};
