import { FeatureProperties } from "../../interfaces/corona";

export const popupHtml = ({
  healthCareDistrict,
  allInfections,
  currentInfections,
  curedInfections,
  deaths
}: FeatureProperties) => {
  const header = "padding-bottom: 10px;";
  const ss = "padding-left: 10px; text-align:right;";
  return `
  <table class="popuptable">
  
      <thead>
        <tr>
            <th colspan="2"style="${header}">${healthCareDistrict}</th>
        </tr>
      </thead>
      <tbody>
          <tr>
              <td>Sairaita </td>
              <td style="${ss}">${currentInfections}</td>
          </tr>
          <tr>
              <td>Parantuneita </td>
              <td style="${ss}">${curedInfections}</td>
          </tr>
          <tr>
              <td>Menehtyneitä </td>
              <td style="${ss}">${deaths}</td>
          </tr>
          <tr style="font-weight: bold;">
              <td>Tartuntoja kaikkiaan </td>
              <td style="${ss}">${allInfections}</td>
          </tr>
      </tbody>
  </table>
  `;
};
