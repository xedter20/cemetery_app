import { Grid2 } from "@mui/material";
import { CemeteryCanvas } from "../../shared";

import {
  getToken,
  getUser,
  isNotEmpty,
  getPermission,
  getRole
} from './../../utility'


export function MapViewComponent({
  showMenuBar = false,
  menuBarTitle = "",
  goBack = null,
  onSave = null,
  allowGrid = false,
  location = "east valencia",
  initialData = null,
  mapBackground,
  deceasedInfo = null
}) {




  let role = getRole()

  console.log({ role })

  const keyMap = {
    "SEQ_NO": "seqNo",
    "DECEASED_ID": "deceasedId",
    "LABEL_NAME": "labelName",
    "LNAME": "lastName",
    "FNAME": "firstName",
    "MNAME": "middleName",
    "SUFFIX": "suffix",
    "ADDRESS": "address",
    "BORN": "born",
    "DIED": "died",
    "CMTRY_LOC": "cemeteryLocation",
    "DATE_PERMIT": "datePermit",
    "NATURE_APP": "natureApp",
    "LAYER_NICHE": "layerNiche",
    "LAYER_ADDR": "layerAddress",
    "PAYEE_LNAME": "payeeLastName",
    "PAYEE_FNAME": "payeeFirstName",
    "PAYEE_MNAME": "payeeMiddleName",
    "PAYEE_SUFFIX": "payeeSuffix",
    "PAYEE_CONTACT": "payeeContact",
    "PAYEE_EMAIL": "payeeEmail",
    "PAYEE_ADDRESS": "payeeAddress",
    "OPT_1": "opt1",
    "OPT_2": "opt2",
    "REMARKS": "remarks",
    "STATUS": "status",
    "CANVAS_MAP": "canvasMap",
    "REASON": "reason",
    "ADDED_BY": "addedBy",
    "ADDED_DATE": "addedDate",
    "MODIFIED_BY": "modifiedBy",
    "MODIFIED_DATE": "modifiedDate"
  };


  const mappedData = Object.keys(deceasedInfo || {}).reduce((acc, key) => {
    const newKey = keyMap[key] || key;  // If no mapping exists, keep the original key
    acc[newKey] = deceasedInfo[key];
    return acc;
  }, {});


  console.log({ mappedData })

  return mappedData && (mappedData.deceasedId) && (
    <Grid2>
      <Grid2>
        <CemeteryCanvas
          mapBackground={mapBackground}
          showMenuBar={showMenuBar}
          menuBarTitle={menuBarTitle}
          goBack={goBack}
          onSave={onSave}
          deceasedInfo={mappedData}
          allowGrid={allowGrid}
          location={location}
          initialData={initialData}
          role={role}
        />
      </Grid2>
    </Grid2>
  );
};
