import express from 'express';
import cors from 'cors';
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import path from "path"
import fs from "fs"
import {exec} from "child_process" //should not run on server... bad development
import { stderr, stdout } from 'process';

const app = express();

//multer middleware

const storage = multer.diskStorage({
    destination: function(req, file, cb){ //not arrow function because of 'this' keyword
        cb(null, "./uploads")
    },
    filename: function (req,file,cb){
        cb(null,file.fieldname + "-" + uuidv4() + path.extname(file.originalname)) //path.ext will give us the the file extension like .html, .mp4 of ouroriginalfile name
    }
})

//multer configuration
const upload = multer({storage:storage})

app.use(
    cors({
        origin: ["http://localhost:8000", "http://localhost:5173"],
        credentials: true,
    }));

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(express.json()); //allows json type data

app.use(express.urlencoded({extended: true})); //allows urlencoded data

app.use("/uploads", express.static("uploads")); //to access static files

app.get('/', (req,res)=>{
    res.json({message: "Hello from video streaming server"})
})

app.post("/upload", upload.single('file'), function(req, res){
    const lessonID =uuidv4()
    const videoPath = req.file.path
    const outputPath = `./uploads/course/${lessonID}`
    const hlsPath = `${outputPath}/index.m3u8`//.m3u8 is a playlist file format, not a video file itself. It’s a UTF-8 encoded playlist used in HTTP Live Streaming (HLS). M3U8 files are plain text files that can be used to store the URL paths of streaming audio or video
    console.log("hlsPath", hlsPath)

    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive : true})
    }

    //ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`

    //no queue cuz of POC, not good for production
    exec(ffmpegCommand, (error, stdout, stderr)=>{
        if (error) {
            console.log(`execution error: ${error}`)
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
        const videoUrl = `http://localhost:8000/uploads/courses/${lessonID}/index.m3u8`;
        res.json({
            message: "video converted to HLS format",
            videoUrl :  videoUrl,
            lessonID: lessonID
        })
    })
})

app.listen(8000, ()=>{
    console.log("Server started on port 8000");
})