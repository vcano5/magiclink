import express from "express";
import multer from "multer";
import fs from "node:fs";
import uuidPkg from "uuidv4";

const router = express.Router();
const upload = multer({dest: "public/uploads/"})
const { v4 } = uuidPkg;

router.get("/", (req, res) => {
    res.render("pages/landing");
})

router.get("/new", (req, res) => {
    res.render("pages/formulario");
});

router.post("/new", upload.single("image"), async(req, res) => {
    let data = await saveToDB({
        title: req.body.title, 
        file: req.file
    });
    res.render("pages/postform", {
        enlace: data.file.filename
    })
})

router.get("/visor", async(req, res) => {
    if(req.query.id) {
        let { id } = req.query;
        let datos = await fetchFromDB(id);
        // let image = datos.file.path.replace(/\\/g, "/")
        let image = `${datos.file.destination}${datos.file.originalname}`.replace("public/", "")
        console.log(image)
        res.render("pages/viewer", { titulo: datos.title, image})

    }
})

router.get("/visor2", async(req, res) => {
    res.render("pages/viewer2", { titulo: "PRUEBA MODELO 3d"})
})

router.get("/qr", async(req, res) => {
    if(req.query.id) {
        let data = JSON.stringify({name: "Zacharie Happel",
            job:  "Student/Intern", 
            grade: "Senior"
        })
        res.setHeader("content-type", "image/png").send(await QRLogo.generateQRWithLogo(data, "hiro.png", {}, "Base64", "qrlogo.png", async(b64) => {
            console.log(b64)
            return b64
        }))
    }
})

const saveToDB = async(data) => {
    data.id = data.file.filename;
    
    let actual = JSON.parse(await fs.readFileSync("db.json"));
    await fs.renameSync(data.file.path, (`${data.file.destination}/${data.file.originalname}`))
    actual.push(data);
    await fs.writeFileSync("db.json", JSON.stringify(actual), { flag: "w"})
    return data;
}

const fetchFromDB = async(id) => {
    let db = JSON.parse(await fs.readFileSync("db.json"));
    return db.find((a) => a.id == id);
}


export default router;