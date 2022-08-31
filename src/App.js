/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
// import React, {useEffect, useState} from 'react';
// import {  MenuItem, FormControl, Select,}from "@material-ui/core";
// import infoBox from './infoBox';
// import Map from "./map";
// import "./App.css";

// function App() {
//   const [countries, setCounteries] = useState([]);
//   const [country, setCountry] = usesState('worldwide');
//   const[countryInfo, setCountryInfo] = useState({});


//   useEffect(() => {
//     const getCountriesData = async () => {
//       await fetch ("https://disease.sh/v3/covid-19/countries" )
//         .then((response) => response.json())
//         .then((data) => {


//           const countries = data.map((country) => (
//             {
//               name: country.country, // United States, United Kingdom
//               value: country.countryInfo.iso2 // UK,USA,FR
//           }));

//           setCounteries(countries);
//        });
//     };

//     getCounteriesData();
// }, []);

// const onCountryChnage = async (event) => {
//   const CountryCode = event.target.value;
//   setCountry(CountryCode);

//   const url = CountryCode === 'worldwide'
//   ?' https://disease.sh/v3/covid-19/all' 
//   :' https://disease.sh/v3/covid-19/countries/${CountryCode}';

   
//    await fetch(url)
//    .then(response => response.json())
//    .then(data => {
//     setCountry(CountryCode);
//     setCountryInfo(data);
//   })

// };
// console.log("COUNTRY INFO >>>", countryInfo);

// return (
//     <div className="app">  
//      <div className='app_left'>
//      <div className='app_header'>
//        <h1>COVID-19 TRACKER</h1>
//        <FormControl className="app_dropdown">
//          <select variant="outlined" onChange ={onCountryChnage} value={country}> 
//            <MenuItem value="worldwide">Worldwide</MenuItem>
//            {
//              Counteries.map(country => (
//                  <MenuItem value={country.value}>{country.name}</MenuItem>
//             ))}
//           </select>
//         </FormControl>
//       </div>

//       <div className='app_stats'>
//         <InfoBox 
//         tittle=" Coronavirus Cases" 
//         cases={countryInfo.todayCases} 
//         total={countryInfo.cases} />

//         <InfoBox
//          tittle=" Recovery Cases"
//           cases={countryInfo.todayRecovery} 
//           total={countryInfo.Recovered} />

//         <InfoBox 
//         tittle=" Deaths Cases" 
//         cases={countryInfo.todaydeaths} 
//         total={countryInfo.Deaths} />
//       </div>

//        <map/>
//       </div>
//       <Card className='app_right'>
//        <CardContent>
//          <h3>Live Cases by Country</h3>
//           {/* Table */}
//           <h3>Worldwide new cases</h3>
//           {/* Graph */}
//        </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./infoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;