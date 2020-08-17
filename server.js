//we declare all imports


import Tesseract from 'tesseract.js' ;
import express from 'express';
const app=express();
var router=express.Router();
import fs from "fs";
import multer from "multer";



//storage info
const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"./uploads");

        },
        filename:(req,file,cb)=>{
            cb(null,file.originalname);
        }      

});

const upload=multer({storage:storage}).single("avatar");

app.set('view engine',"ejs");
app.use(express.static("public"));
//routes

app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/upload',(req,res)=>{
    upload(req,res,err =>{
        fs.readFile(`./uploads/${req.file.originalname}`,(err,data)=>{
            if(err) return console.log('this is your error',err);
            Tesseract
            .recognize(data,"eng",{tessjs_create_pdf: '1'})
            .progress(progress=>{
                console.log(progress);
            })
            .then(result=>{
                res.send(result.text);
               // res.redirect("/download");
            })
            .finally( ()=>{
                Tesseract.terminate()

            });

        });
        
    });
    
});
app.get("/download",(res,req)=>{
    const newLocal = `C:\Users\yuvra\OneDrive\Documents\.vscode\OCR\tesseract.js-ocr-result.pdf`;
    const file=newLocal;
   // res.download(file);
    res.sendFile(file);
    
    
})

 

 

const port=4000;
app.listen(port || process.env.port);
