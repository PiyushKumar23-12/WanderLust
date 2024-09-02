const express=require("express")
const router=express.Router();

//Posts
//Index  
router.get("/",(req,res)=>{
    res.send("Get for Posts")
})
//Show
router.get("/:id",(req,res)=>{
    res.send("Show for Posts.")
})
//POST
router.post("/",(req,res)=>{
    res.send("Post for Posts.")
})
//Delete
router.delete("/:id",(req,res)=>{
    res.send("Delete for Post id.")
})

module.exports=router;