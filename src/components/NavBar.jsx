import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { BarChart, Bar, Rectangle } from 'recharts';
const NavBar = ({count, mean, mode, time, priceRange, priceMean, data, dietData}) => {
    console.log(data);
    return (
    <div className="Side">
        <h3>Recipes Data</h3>
        <p>
        <strong>Total number of recipes: </strong> {count} <br />
        <strong>Average number of ingredients: </strong> {mean} <br />
        <strong>Most common ingredient: </strong> {mode}<br />
        <strong>Average cooking time: </strong> {time} min <br />
        <strong>Price Range: </strong> {priceRange} <br />
        <strong>Average Price: </strong> ${priceMean}
        </p>
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis/>
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="readyInMinutes" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="healthScore" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="90%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={dietData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="diet" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="#8884d8" stroke="white" />} />
        </BarChart>
      </ResponsiveContainer>
    </div>
    )
};
export default NavBar;