import { useEffect, useState } from "react";
import { MapView } from "../../map-view";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomModal from "../../../shared/Modal/CustomModal";
import { Box, Typography } from "@mui/material";
import {
  useAdminFetchDeceasedByIdQuery,
  useAdminPatchDeceasedByIdMutation,
} from "../../../service/adminService";
import { base64ToString } from "../../../utility";
import { MapViewComponent } from "../../../shared/Map-View";
import map_banban from "../../../assets/map_banban.png";
import map_poblacion from "../../../assets/map_poblacion.png";
import map_east_valencia from "../../../assets/EAST_VALENCIA_MAP.png";

export function MapSetting() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [base64Data, setBase64Data] = useState(null);
  const [searchParams] = useSearchParams();
  const [initialData, setInitialData] = useState();
  const [patchCall, { error, isLoading }] = useAdminPatchDeceasedByIdMutation();
  const { data } = useAdminFetchDeceasedByIdQuery(searchParams.get("id"));

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (data?.deceased?.canvasMap) {
      setInitialData(data?.deceased?.canvasMap);
    } else {
      setInitialData(
        JSON.stringify({
          entrance: getInitialEntrance(),
          destination: getInitialEntrance(),
          dots: [getInitialEntrance()],
        })
      );
    }
  }, [data]);

  const getInitialBg = () => {
    const location = searchParams.get("location");
    const isBanBan = location?.toLowerCase().includes("banban");
    const isPoblascion = location?.toLowerCase().includes("poblacion");
    const isEastVelencia = location?.toLowerCase().includes("east valencia");

    if (isBanBan) {
      return map_banban;
    } else if (isEastVelencia) {
      return map_east_valencia;
    } else if (isPoblascion) {
      return map_poblacion;
    } else {
      return map_banban;
    }
  };

  const getInitialEntrance = () => {
    const location = searchParams.get("location");
    const isBanBan = location?.toLowerCase().includes("banban");
    const isPoblascion = location?.toLowerCase().includes("poblacion");
    const isEastVelencia = location?.toLowerCase().includes("east valencia");

    if (isBanBan) {
      return { x: 930, y: 770, w: 20, h: 20 };
    } else if (isEastVelencia) {
      return { x: 470, y: 800, w: 20, h: 20 };
    } else if (isPoblascion) {
      return { x: 240, y: 330, w: 20, h: 20 };
    } else {
      return { x: 930, y: 770, w: 20, h: 20 };
    }
  };

  const onSave = (data) => {
    setBase64Data(data);
    setShowModal(true);
  };

  const confirm = async () => {
    setShowModal(false);
    const response = await patchCall({
      deceasedId: searchParams.get("id"),
      canvasMap: JSON.stringify(base64Data),
    });
    if (response.data) {
      navigate(-1);
    }
  };

  console.log("data", data);

  return (
    <>
      <MapViewComponent
        mapBackground={getInitialBg()}
        showMenuBar={true}
        menuBarTitle="Map Setting"
        goBack={goBack}
        onSave={onSave}
        allowGrid={true}
        initialData={initialData}
        deceasedInfo={data?.deceased}
      />
      <CustomModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onOk={() => confirm()}
        onCancel={() => setShowModal(false)}
      >
        <>
          <Box sx={{ padding: "1rem" }}>
            <Typography variant="h5">Save Routes</Typography>
            <Typography variant="subtitle1">
              Are you sure you want to save the map routes?
            </Typography>
          </Box>
        </>
      </CustomModal>
    </>
  );
}
