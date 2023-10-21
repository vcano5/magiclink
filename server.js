import express from "express";
// import ejs from "ejs";
import router from "./routes/index.js"
import bodyParser from "body-parser";

let app = express();
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}))

app.use("/", router);


app.listen((process.env.PORT || 3000), () => {
    console.log(`Running on http://localhost:${(process.env.PORT || 3000)}`);
});
