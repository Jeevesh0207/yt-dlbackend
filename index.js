const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const YT=require('./routes/YT')

const app=express()

const CorsOptions={
    origin:'*',
    credential:true,
    optionSuccessStatus:200,
}

app.use(cors(CorsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/',YT)



const port=8000
const server=app.listen(port,()=>{
    console.log(`Backend Run on Port: ${port}`)
})