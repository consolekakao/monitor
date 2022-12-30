import express from "express";
import cors from "cors";
import { exec } from "child_process";
import morgan from "morgan";
import { Request, Response } from "express-serve-static-core";

const app = express();
const port = 3333;
app.use(cors());
app.use(express.json());
app.use(
  morgan("dev", {
    skip: (req: Request, res: Response) => res.statusCode == 600,
  })
);
// use "combined" in product. you can see user ip.
// app.use(morgan("short"));

const ifconfig = "ifconfigd";
const sensors = "sensors";
const mkdir = "rm -rf test && mkdir test && ls -a;";

// This funcion remove favicon for morgan
app.get("/favicon.ico", function (req, res) {
  res.status(600);
  res.end();
});

app.get("/", async (req: Request, res: Response) => {
  exec(ifconfig, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    }
    console.log("err", err);
    console.log("stdout", stdout);
    console.log("stderr", stderr);
    res.send(stdout.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g));
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
