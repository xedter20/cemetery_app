import { useEffect, useRef, useState } from "react";
import { BoxRectangle } from "./rectangleClass";
import PIN_START from "../../assets/green_pin_small.png";
import PIN_END from "../../assets/red_pin_small.png";
import imgCoffine from "../../assets/coffin.png";
import { Grid2, Box, Button, Drawer, Stack, IconButton, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MenuAppBar from "../../shared/Headers/MenuAppBar";
import "./mapRoutePage.css";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Example icon
import { useNavigate } from 'react-router-dom'; // Import the hook
const MODE = {
  read: "read",
  write: "write",
};

export const CemeteryCanvas = ({
  mapBackground,
  showMenuBar = false,
  menuBarTitle = "Title",
  goBack,
  onSave,
  allowGrid = false,
  location = '',
  initialData = null,
  deceasedInfo = null
}) => {
  const navigate = useNavigate(); // Get the navigate function

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous route
  };

  // console.log({ initialData })
  const [boxes, setBoxes] = useState([]);
  const [list, setList] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(1000);
  const [canvasWidth, setCanvasWidth] = useState(1500);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(true);
  const [activated, setActivated] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [posDown, setPosDown] = useState({ x: 0, y: 0 });
  const [locked, setLocked] = useState(false);
  const [pointer, setPointer] = useState(null);
  const [showGrid, setShowGrid] = useState(allowGrid);
  const [puntod, setPuntod] = useState([{ x: 560, y: 365, w: 10, h: 10 }]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [drawnImage, setDrawnImage] = useState(null); // To track the drawn image
  const [tooltip, setTooltip] = useState(null); // To show the tooltip
  const [base64Data, setBase64Data] = useState({
    entrance: {},
    destination: {},
    dots: [],
  });
  const [open, setOpen] = useState(false)


  useEffect(() => {
    console.log("deceasedInfo", deceasedInfo);
  }, [deceasedInfo]);

  useEffect(() => {
    if (initialData) {
      const newData = JSON.parse(initialData);
      console.log("newData", newData);
      setBase64Data({ ...newData });
      const newList = newData.dots.map((item) => new BoxRectangle(
        "",
        contextRef.current,
        "red",
        item?.x,
        item?.y,
        item?.w,
        item?.h
      ))
      setList(newList);
    }
  }, [initialData, canvasRef.current]);

  useEffect(() => {
    setShowGrid(allowGrid);
  }, [allowGrid]);

  const onDragging = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (locked == false) {
      setPos({ x, y });
    }

  };

  const drawThis = (x, y) => {
    const clickBox = new BoxRectangle(
      "",
      contextRef.current,
      "red",
      x,
      y,
      13,
      13
    );
    const item = getCollision(clickBox);

    if (item !== undefined) {
      const newList = list;
      const exist = newList.find((elem) => elem?.getId() === item?.getId());

      if (!exist) {
        const newRect = new BoxRectangle(
          item?.getId(),
          contextRef.current,
          "red",
          item?.getX(),
          item?.getY(),
          item?.getW(),
          item?.getH()
        );

        newList.push(newRect);
        setList([...newList]);
      }
    }
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsMouseDown(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!activated) {
      const destination = { ...base64Data.destination };
      const box1 = new BoxRectangle(
        "box1",
        contextRef.current,
        "",
        destination.x,
        destination.y,
        destination.w,
        destination.h
      );
      box1.draw();
      const box2 = new BoxRectangle(
        "box2",
        contextRef.current,
        "purple",
        x - 20,
        y - 20,
        10,
        10
      );
      if (box2.collision(box1)) {
        //this is for evaluation
        //setOpen(true);
      }
    }

    setPosDown({ x, y });
    setActivated(true);
  };

  const onMouseUp = (e) => {
    setIsMouseDown(false);
    setActivated(false);
  };

  const getCollision = (box) => {
    for (let i = 0; i < boxes.length; i++) {
      const hasCollide = boxes[i].collision(box);
      if (hasCollide) return boxes[i];
    }
    return null;
  };

  /**Change ng grid color, width, size*/
  const createGridTiles = () => {
    const context = contextRef.current;
    context.beginPath();
    for (let i = 5; i <= canvasWidth; i = i + 6) {
      context.moveTo(i, 5);
      context.lineTo(i, canvasHeight);

      context.moveTo(5, i);
      context.lineTo(canvasWidth, i);

      context.lineWidth = 0.25;
      context.strokeStyle = "transparent";
      context.stroke();
    }
  };

  const drawLine = () => {
    const tempBoxes = [];
    for (let a = 5; a < canvasHeight; a = a + 6) {
      for (let b = 5; b < canvasWidth; b = b + 6) {
        const box = new BoxRectangle(
          `${a}${b}`,
          contextRef.current,
          "transparent",
          b,
          a,
          5.4,
          5.4
        );
        box.draw();
        tempBoxes.push(box);
      }
    }
    setBoxes([...tempBoxes]);
  };

  const onClearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const updateCanvas = () => {

    const canvas = canvasRef.current;
    if (canvas) {
      if (showGrid) {
        createGridTiles();
      }

      setPointer({
        x: pos.x,
        y: pos.y,
        h: base64Data.entrance.w,
        w: base64Data.entrance.h,
      });

      drawThis(pos.x, pos.y);

      const rawBase64 = { ...base64Data };
      const endImage = new Image();
      endImage.src = PIN_END;

      if (pointer?.x && pointer?.y && activated) {
        rawBase64.destination = {
          x: pointer.x - 30,
          y: pointer.y - 40,
          w: rawBase64.destination.w,
          h: rawBase64.destination.h,
        };
        setBase64Data(rawBase64);

        endImage.onload = () => {
          contextRef.current.drawImage(
            endImage,
            pointer.x - 30,
            pointer.y - 40,
            60,
            60
          );
        };
      } else {
        endImage.onload = () => {
          setImageLoaded(true); // Image has loaded, update state
          contextRef.current.drawImage(
            endImage,
            rawBase64.destination.x,
            rawBase64.destination.y,
            60,
            60
          );

          setDrawnImage({
            x: rawBase64.destination.x,
            y: rawBase64.destination.y,
            width: 60,  // Image width
            height: 60  // Image height
          });

          // if (contextRef.current) {
          //   const context = contextRef.current.getContext('2d');
          //   contextRef.current = context;
          // }
        };

      }

      const startImage = new Image();
      startImage.src = PIN_START;
      startImage.onload = () => {
        contextRef.current.drawImage(
          startImage,
          base64Data.entrance.x,
          base64Data.entrance.y,
          60,
          60
        );
      };

      // puntod.map((item, index) => {
      //   const i = new BoxRectangle(
      //     `puntod-${index}`,
      //     contextRef.current,
      //     "purple",
      //     item.x,
      //     item.y,
      //     item.w,
      //     item.h
      //   );
      //   if (i.collision(pointer) && locked == false) {
      //     setLocked(true);
      //   }
      //   i.draw();
      // });

      list.map((item) => {
        item.draw();
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.stokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context;

      drawLine();

      setPointer({
        x: base64Data.destination.x,
        y: base64Data.destination.y,
        h: base64Data.destination.w,
        w: base64Data.destination.h,
      });

      updateCanvas();
    }

    const mouseEventDown = canvasRef.current?.addEventListener(
      "mousedown",
      onMouseDown
    );
    const mouseEventUp = canvasRef.current?.addEventListener(
      "mouseup",
      onMouseUp
    );
    const mouseEventDrag = canvasRef.current?.addEventListener(
      "mousemove",
      onDragging
    );

    return () => {
      if (mouseEventDown && mouseEventUp && mouseEventDrag) {
        canvasRef.current.removeEventListener("mousedown", onMouseDown);
        canvasRef.current.removeEventListener("mouseup", onMouseUp);
        canvasRef.current.removeEventListener("mousemove", onDragging);
      }
    };
  }, [canvasRef.current]);

  useEffect(() => {
    if (activated && isMouseDown) {
      onClearCanvas();
      updateCanvas();
    }
  }, [pos]);

  const onProcessData = () => {
    const newList = list.map((item) => ({
      x: item.getX(), y: item.getY(), h: item.getH(), w: item.getW()
    }))
    onSave({ ...base64Data, dots: newList });
  };

  const onSetStartingPoint = () => { };

  const onSetDestinationPoint = () => { };

  const onReset = () => {
    const shadowData = { ...base64Data };
    shadowData.dots = []
    shadowData.destination = shadowData.entrance;
    shadowData.dots.push(shadowData.destination);
    setBase64Data(shadowData);
    setLocked(false);
    setList([]);
    onClearCanvas();
    updateCanvas();
  };

  const onCrateLine = () => { };

  useEffect(() => {
    onClearCanvas()
    updateCanvas()
  }, [list]);

  const toggleDrawer = (val) => {
    setOpen(val);
  }


  // Handle canvas click event to check if the user clicked on the drawn image
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;

    console.log({ canvas })
    const rect = canvas.getBoundingClientRect(); // Get canvas bounds
    const x = event.clientX - rect.left; // Mouse click x position on canvas
    const y = event.clientY - rect.top;  // Mouse click y position on canvas

    if (
      drawnImage &&
      x >= drawnImage.x && x <= drawnImage.x + drawnImage.width &&
      y >= drawnImage.y && y <= drawnImage.y + drawnImage.height
    ) {
      console.log('Clicked on the drawn image!');
      // context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
      // context.drawImage(endImage, x - 30, y - 30, 60, 60); // Draw image at the calculated position
      // You can perform actions here (e.g., show an alert, change image, etc.)

      // Show tooltip at the position of the image inside the canvas
      setTooltip({
        x: x, // Tooltip position at the center of the image
        y: y, // Position it slightly above the clicked image
        text: 'This is the drawn image!' // Tooltip text
      });
    } else {
      setTooltip(null);
    }
  };

  return (
    <>
      {showMenuBar && (
        <MenuAppBar title={menuBarTitle} goBack={goBack}>
          <Box>
            <Stack direction={"row"} spacing={2}>
              {/* <Button
                variant="contained"
                color="secondary"
                onClick={onSetStartingPoint}
              >
                Set Starting Point
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onSetDestinationPoint}
              >
                Set Destination
              </Button>
             
              <Button variant="contained" color="error" onClick={onCrateLine}>
                Create Line
              </Button> */}

              <Button variant="contained" color="error" onClick={onReset}>
                Reset
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={onProcessData}
              >
                Save Changes
              </Button>
            </Stack>
          </Box>
        </MenuAppBar>
      )}

      <Grid2 container justifyContent={"center"}>
        {/* Left Column for Details */}
        <Grid2 item xs={12} md={6} lg={6}>
          <Box sx={{ width: 330 }}>
            <Box sx={{ display: "flex" }} justifyContent={"flex-start"}>
              <Button
                onClick={handleBackClick}
                // onClick={() => setOpen(true)}
                sx={{ mt: 2, mb: 2 }} // Adding margin-top (mt) and margin-bottom (mb)
                variant="contained"
                startIcon={<ArrowBackIcon />} // Adding the icon at the start of the button
              >
                Back
              </Button>
            </Box>
            <Stack direction={"column"}>
              <Box sx={{ width: "100%" }}>
                <img src={imgCoffine} style={{ width: "100%" }} />
              </Box>
              <Box
                justifyContent={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography variant="h6">{`${deceasedInfo?.firstName


                    || deceasedInfo?.FNAME

                    } ${deceasedInfo?.middleName || deceasedInfo?.MNAME} 
                    ${deceasedInfo?.lastName || deceasedInfo?.LNAME}`}</Typography>
                  <Typography variant="body2">NAME</Typography>
                </Stack>
              </Box>

              <Divider />

              <Box
                justifyContent={"space-between"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Box
                  justifyContent={"center"}
                  sx={{ padding: "1rem", display: "flex", width: "100%" }}
                >
                  <Stack direction={"column"} textAlign={"center"}>
                    <Typography variant="body1">BORN</Typography>
                    <Typography variant="h6">{deceasedInfo?.born
                      || deceasedInfo?.BORN
                    }</Typography>
                  </Stack>
                </Box>
                <Box
                  justifyContent={"center"}
                  sx={{ padding: "1rem", display: "flex", width: "100%" }}
                >
                  <Stack direction={"column"} textAlign={"center"}>
                    <Typography variant="body1">DIED</Typography>
                    <Typography variant="h6">{deceasedInfo?.died

                      || deceasedInfo?.DIED
                    }</Typography>
                  </Stack>
                </Box>
              </Box>

              <Divider />

              <Box
                justifyContent={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography variant="body1">Layer of niche</Typography>
                  <Typography variant="h6">
                    Layer {deceasedInfo?.layerNiche


                      || deceasedInfo?.LAYER_NICHE
                    }
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              <Box
                justifyContent={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography variant="body1">Cemetery Location</Typography>
                  <Typography variant="h6">
                    {deceasedInfo?.cemeteryLocation}
                  </Typography>
                </Stack>
              </Box>
              <Divider />
            </Stack>
          </Box>
        </Grid2>

        {/* Right Column for CemeteryCanvas */}
        <Grid2 item xs={12} md={6} lg={6}>
          {/* Your details component or content */}
          <Grid container  >

            <Box >
              <img src={mapBackground} width={canvasWidth} height={canvasHeight} />
            </Box>

            <Box sx={{ position: "absolute" }}>
              <canvas className="canvas-container-bar-char" ref={canvasRef} onClick={handleCanvasClick} />
            </Box>
          </Grid>
        </Grid2>
      </Grid2>
      {/* <Grid container justifyContent={"center"}>

      </Grid> */}

      {deceasedInfo && (
        <Drawer open={open} onClose={() => toggleDrawer(false)}>
          <Box sx={{ width: 400 }}>
            <Box sx={{ display: "flex" }} justifyContent={"flex-end"}>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
            <Stack direction={"column"}>
              <Box sx={{ width: "100%" }}>
                <img src={imgCoffine} style={{ width: "100%" }} />
              </Box>
              <Box
                justifyContent={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography variant="h6">{`${deceasedInfo?.firstName} ${deceasedInfo?.middleName}. ${deceasedInfo?.lastName}`}</Typography>
                  <Typography variant="body2">NAME</Typography>
                </Stack>
              </Box>

              <Divider />

              <Box
                justifyContent={"space-between"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Box
                  justifyContent={"center"}
                  sx={{ padding: "1rem", display: "flex", width: "100%" }}
                >
                  <Stack direction={"column"} textAlign={"center"}>
                    <Typography variant="body1">BORN</Typography>
                    <Typography variant="h6">{deceasedInfo?.born}</Typography>
                  </Stack>
                </Box>
                <Box
                  justifyContent={"center"}
                  sx={{ padding: "1rem", display: "flex", width: "100%" }}
                >
                  <Stack direction={"column"} textAlign={"center"}>
                    <Typography variant="body1">DIED</Typography>
                    <Typography variant="h6">{deceasedInfo?.died}</Typography>
                  </Stack>
                </Box>
              </Box>

              <Divider />

              <Box
                justifyContent={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography variant="body1">Layer of niche</Typography>
                  <Typography variant="h6">
                    Layer {deceasedInfo?.layerNiche}
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              <Box
                justifyContent={"center"}
                sx={{
                  width: "100%",
                  display: "flex",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                }}
              >
                <Stack direction={"column"} textAlign={"center"}>
                  <Typography variant="body1">Cemetery Location</Typography>
                  <Typography variant="h6">
                    {deceasedInfo?.cemeteryLocation}
                  </Typography>
                </Stack>
              </Box>
              <Divider />
            </Stack>
          </Box>
        </Drawer>
      )}

      {tooltip && (
        <div
          style={{
            position: 'absolute',
            top: tooltip.y,
            left: tooltip.x,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            pointerEvents: 'none', // Prevent tooltip from interfering with other clicks
            transform: 'translate(-50%, -100%)', // Center the tooltip above the image
          }}
        >
          {/* {tooltip.text} */}
          <div>
            <h4>Information:</h4>
            <p>Name: {deceasedInfo.firstName} {' '}
              {deceasedInfo.lastName
              }</p>
            <p>Born: {deceasedInfo.born}</p>
            <p>Died: {deceasedInfo.died}</p>
            <p>Location: {deceasedInfo.cemeteryLocation}</p>
          </div>
        </div>
      )}
    </>
  );
};
