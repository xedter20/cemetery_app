import React, { useRef, useState, useEffect } from "react";

import { BiEdit, BiSolidBank, BiMapPin, BiInfoCircle } from "react-icons/bi"; // Import icons from React Icons
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';



import {
  getToken,
  getUser,
  isNotEmpty,
  getPermission,
  getRole
} from './../../utility';
const DeceasedDetails = ({ data, handleReset, handleSave }) => {


  const responsePermission = getPermission();
  const token = getToken();
  const user = getUser();

  console.log(user?.accountType)

  let role = user?.accountType === 'admin' || user?.accountType === 'enterprise';
  console.log({ role })

  return (
    <div className="p-0 flex justify-center">
      {/* Card container with modern shadow and rounded corners */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-1xl font-bold text-gray-800 mb-4">Deceased Information</h2>

        {/* Deceased Information Table */}
        <table className="w-full border-collapse text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Cemetery</th>
              <td className="p-2 text-blue-900 font-bold">{data.cemeteryLocation}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Full Name</th>
              <td className="p-2">{`${data.firstName} ${data.middleName} ${data.lastName} ${data.suffix}`.trim()}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Address</th>
              <td className="p-2">{data.address}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Born</th>
              <td className="p-2">{data.born}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Died</th>
              <td className="p-2">{data.died}</td>
            </tr>

            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Nature of Application</th>
              <td className="p-2">{data.natureApp}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Layer/Niche</th>
              <td className="p-2">{`Layer ${data.layerNiche}, Address ${data.layerAddress}`}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Permit Date</th>
              <td className="p-2">{data.datePermit}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Status</th>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-white ${data.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {data.status === 1 ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        {
          role && <div className="flex flex-col space-y-2 mt-4">

            <button
              onClick={handleSave}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Reset
            </button>

          </div>
        }


        {/* Payee Information */}
        {/* <h3 className="text-xl font-semibold text-gray-700 mt-6">Payee Information</h3>
        <table className="w-full border-collapse text-sm mt-2">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Payee Name</th>
              <td className="p-2">{`${data.payeeFirstName} ${data.payeeMiddleName} ${data.payeeLastName} ${data.payeeSuffix}`.trim()}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Contact</th>
              <td className="p-2">{data.payeeContact}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Email</th>
              <td className="p-2">{data.payeeEmail}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="text-left p-2">Address</th>
              <td className="p-2">{data.payeeAddress}</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};


export const CemeteryCanvas = ({
  mapBackground,
  onSave,
  deceasedInfo,

}) => {

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState(JSON.parse(deceasedInfo.canvasMap || `[]`))

  const responsePermission = getPermission();
  const token = getToken();
  const user = getUser();

  console.log(user?.accountType)

  let role = user?.accountType === 'admin' || user?.accountType === 'enterprise';




  // Function to draw the background image and points
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = mapBackground;

    image.onload = () => {
      const imageRatio = image.width / image.height;
      const canvasWidth = window.innerWidth * 0.8;
      const canvasHeight = canvasWidth / imageRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw the background image
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      // Redraw all lines and points
      points.forEach((point, index) => {
        if (index === 0) {
          drawPoint(point.x, point.y, 'green'); // Start point
        } else {
          const previousPoint = points[index - 1];


          if (index === points.length - 1) {
            drawPoint(point.x, point.y, 'blue'); // Start point
          }


          drawLine(previousPoint.x, previousPoint.y, point.x, point.y);

        }
      });
    };
  };

  // Draw a point (circle) at the specified position
  const drawPoint = (x, y, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI); // Draw a circle at the point
    ctx.fillStyle = color;
    ctx.fill();
  };

  // Draw a line between two points (used for freehand drawing)
  const drawLine = (x1, y1, x2, y2) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round'; // Smooth the corners of the line
    ctx.lineCap = 'round'; // Smooth the edges of the line
    ctx.stroke();
  };

  useEffect(() => {
    drawCanvas(); // Redraw the canvas whenever the points change or the background image is updated
  }, [mapBackground, points]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastPosition({ x, y });
    setPoints([{ x, y }]); // Start drawing, set the first point
    drawPoint(x, y, 'green'); // Draw the start point (green)
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw the freehand line by connecting the previous position with the current one
    drawLine(lastPosition.x, lastPosition.y, x, y);

    // Save the current position in points
    setPoints((prevPoints) => [...prevPoints, { x, y }]);

    setLastPosition({ x, y }); // Update last position for the next move
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    // Draw the endpoint circle after finishing the drawing
    const lastPoint = points[points.length - 1];
    drawPoint(lastPoint.x, lastPoint.y, 'blue'); // Mark the stop point with a blue circle
  };

  const handleMouseOut = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = mapBackground;

    image.onload = () => {
      const imageRatio = image.width / image.height;
      const canvasWidth = window.innerWidth * 0.8;
      const canvasHeight = canvasWidth / imageRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Redraw the background image
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      // Reset the points
      setPoints([]);
    };
  };


  const handleSave = async () => {
    const canvas = canvasRef.current;
    const imageUrl = canvas.toDataURL('image/png'); // Get the image data URL

    // Create a temporary link element to trigger the download
    // const link = document.createElement('a');
    // link.href = imageUrl;
    // link.download = 'canvas_image.png'; // Set the name of the downloaded image
    // link.click(); // Trigger the download
    console.log({ deceasedInfo })

    let deceasedId = deceasedInfo.deceasedId

    let CANVAS_MAP = points;
    let formattedValues = {
      deceasedId,
      CANVAS_MAP
    }


    try {

      let res = await axios({
        method: 'POST',
        url: 'update_canvass_map',
        data: formattedValues
      });

      toast.success('Saved Successfully!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
      });

    } catch (error) {


      toast.error('Something went wrong', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        // transition: Bounce,
      });

    }



  };



  console.log({ dexxxx: user })
  let isDisabled = user?.accountType !== 'admin'
    && user?.accountType !== 'enterprise';
  return <div className="flex">
    {/* Canvas on the left */}
    <div className="flex flex-col justify-between p-4">
      <DeceasedDetails
        data={deceasedInfo}
        handleSave={handleSave}
        handleReset={handleReset}

      />


    </div>

    <div className="flex-1 relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-300"
        style={{ pointerEvents: isDisabled ? "none" : "auto" }} // Disables mouse events
        onMouseDown={isDisabled ? null : handleMouseDown}
        onMouseMove={isDisabled ? null : handleMouseMove}
        onMouseUp={isDisabled ? null : handleMouseUp}
        onMouseOut={isDisabled ? null : handleMouseOut}
      />
    </div>

    {/* Deceased details and buttons on the right */}

    <ToastContainer />
  </div>


};









