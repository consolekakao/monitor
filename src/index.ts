import express from "express";
import cors from "cors";
import { exec } from "child_process";
import morgan from "morgan";
import { Request, Response } from "express-serve-static-core";
import { convertData } from "./lib";
const app = express();
const port = 3333;
const AlertUndefinedCommand = `Please Insert Defined Command!\nYou Can See Command List with @help`;

app.use(cors());
app.use(express.json());
app.use(
  morgan("dev", {
    skip: (req: Request, res: Response) => res.statusCode == 600,
  })
);
// use "combined" in product. you can see user ip.
// app.use(morgan("short"));

// This funcion remove favicon for morgan
app.get("/favicon.ico", function (req, res) {
  // we will make unknown status for debuging.
  res.status(600);
  res.end();
});

app.post("/", async (req: Request, res: Response) => {
  exec(req.body.command || "", (err, stdout, stderr) => {
    if (err) {
      console.log("err", err.code, err.message);
      res.send(AlertUndefinedCommand);
      return;
    }
    if (stderr) {
      console.log("stderr", stderr);
      res.send(stderr);
      return;
    }

    res.send(convertData(stdout));
    return;
  });
});

app.listen(port, () => {
  console.log(`
    ##############################################
    #          Server Start on ${port}              #
    ##############################################
    `);
});
