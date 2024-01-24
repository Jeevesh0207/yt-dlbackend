const express=require('express')
const ytdl = require('ytdl-core')
const YT=express.Router()


    


YT.post('/',async(req,res)=>{
    const URL=req.body.URL
    const Data={
        title:"",
        thumbnails:"",
        duration:"",
        videoformats:[],
        audioformats:[],
        defaultaudio:"",
    }
    const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    const ID=URL.match(rx)[1]
    const info=await ytdl.getInfo(ID)
    const Title=info.videoDetails.title
    const Thumbnail=info.videoDetails.thumbnails
    const Len=Thumbnail.length
    const Audio=ytdl.chooseFormat(info.formats,{quality:'highestaudio'})
    Data.defaultaudio=Audio.url
    Data.duration=info.videoDetails.lengthSeconds
    Data.title=Title
    Data.thumbnails=Thumbnail[Len-1].url
    const AllData=info.formats
    AllData.map((item)=>{
        if(item.mimeType.includes('video')){
          if(item.contentLength){
            Data.videoformats.push({qualityLabel:item.qualityLabel,url:item.url,contentLength:item.contentLength})
          }
        }
        if(item.mimeType.includes('audio')){
            if(item.contentLength){
                Data.audioformats.push({url:item.url,contentLength:item.contentLength})
            }
        }
    })
    Data.videoformats.sort((a, b) => b.contentLength - a.contentLength);
    Data.audioformats.sort((a, b) => b.contentLength - a.contentLength);
    res.send(Data)
    res.end()
})

module.exports=YT