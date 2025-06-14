import React from "react";
import ReactDOM from "react-dom/client";
import Heading from "./Headings";
import App from './App';
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<><h1>I am very happy to learn React</h1>
// <p>i have successfully built a react project </p>
// </>);
// const curDate=new Date(2002,5,3,20);
// let time=curDate.getHours();
// let Greeting="";
// const cssStyle={
// };

// const displayStyle={
//     display:'flex',
//     justifyContent:'center',
//     backgroundColor:'blue',
//     borderRadius:'30%',
//     width:'25%',
//     margin:'25% 30% 0% 35%'
// };
// if(time>=1 && time<12){
//     Greeting = 'Good Morning';
//     cssStyle.color="orange";
// }else if(time>12 && time<19){
//  Greeting = 'Good Afternoon';
//  cssStyle.color="green";   
// }else{
//     Greeting = 'Good Night';
//     cssStyle.color="black";
// }

const root=ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
