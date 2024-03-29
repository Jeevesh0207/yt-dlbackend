const express = require('express')
const ytdl = require('ytdl-core')
const YT = express.Router()

YT.post('/', async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

    const URL = req.body.URL
    const Data = {
        title: "",
        thumbnails: "",
        duration: "",
        videoformats: [],
        audioformats: [],
        defaultaudio: "",
    }
    let ID = ""
    try {
        ID = ytdl.getURLVideoID(URL)
    } catch (err) {
        const regex = /(youtu.be\/|youtube.com\/(watch\?(.*&)?v=|(embed|v|shorts|live)\/))([^\?&"'>]+)/;
        const matches = URL.match(regex);
        ID = (matches ? matches[5] : null);
    }
    if (ID === null) {
        res.send("ERROR")
        res.end()
    }
    const info = await ytdl.getInfo(ID)
    const Title = info.videoDetails.title
    const Thumbnail = info.videoDetails.thumbnails
    const Len = Thumbnail.length
    const Audio = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    Data.defaultaudio = Audio.url
    Data.duration = info.videoDetails.lengthSeconds
    Data.title = Title
    Data.thumbnails = Thumbnail[Len - 1].url
    const AllData = info.formats
    AllData.map((item) => {
        if (item.mimeType.includes('video')) {
            if (item.contentLength) {
                Data.videoformats.push({ qualityLabel: item.qualityLabel, url: item.url, contentLength: item.contentLength })
            }
        }
        if (item.mimeType.includes('audio')) {
            if (item.contentLength) {
                Data.audioformats.push({ url: item.url, contentLength: item.contentLength })
            }
        }
    })
    Data.videoformats.sort((a, b) => b.contentLength - a.contentLength);
    Data.audioformats.sort((a, b) => b.contentLength - a.contentLength);
    res.send(Data)
    res.end()
})

module.exports = YT