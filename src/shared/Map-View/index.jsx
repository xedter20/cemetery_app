import { Grid2 } from "@mui/material";
import { CemeteryCanvas } from "../../shared";

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

  return (
    <Grid2>
      <Grid2>
        <CemeteryCanvas
          mapBackground={mapBackground}
          showMenuBar={showMenuBar}
          menuBarTitle={menuBarTitle}
          goBack={goBack}
          onSave={onSave}
          deceasedInfo={deceasedInfo}
          allowGrid={allowGrid}
          location={location}
          initialData={initialData}
        />
      </Grid2>
    </Grid2>
  );
};
