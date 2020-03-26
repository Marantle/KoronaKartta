import { FeatureProperties } from "../../interfaces/corona";

export const popupHtml = ({
  healthCareDistrict,
  allInfections,
  currentInfections,
  curedInfections,
  deaths
}: FeatureProperties) => {
  const s = "border-bottom: 1px solid #ddd;";
  const ss = "text-align:right;";
  const sss = "text-align:center;";
  return `
  <table>
  
      <thead>
        <tr>
            <th colspan="2"style="${s + sss}">${healthCareDistrict}</th>
        </tr>
      </thead>
      <tbody>
          <tr>
              <td style="${s}">Sairaita: </td>
              <td style="${s + ss}">${currentInfections}</td>
          </tr>
          <tr>
              <td style="${s}">Parantuneita: </td>
              <td style="${s + ss}">${curedInfections}</td>
          </tr>
          <tr>
              <td style="${s}">Menehtyneitä: </td>
              <td style="${s + ss}">${deaths}</td>
          </tr>
          <tr>
              <td style="${s}">Tartuntoja kaikkiaan: </td>
              <td style="${s + ss}">${allInfections}</td>
          </tr>
      </tbody>
  </table>
  `;
};
