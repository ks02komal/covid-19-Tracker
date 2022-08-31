// import React from 'react';
// import {Card, CardContent, Typography} from "@material-ui/core";

// function infoBox({tittle, cases, total}) {
//   return (
//     <Card className="infoBox">
//     <CardContent>
//         {/* Tittle i.e. Corornavirus cases */}
//         <Typography  className="infoBox_tittle" color="textSecondary">
//             {tittle}
//         </Typography>
//         {/* +120k Number of cases*/}
//         <h2 className='infoBox_cases'>{cases}</h2>

//         {/*1.2M total */}
//         <Typography className="infoBox_total" color="textSecondary">
//          {total} Total
            
//         </Typography>
//     </CardContent>
           
//     </Card>
//   )
// }

// export default infoBox


import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  console.log(title, active);
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
