const express=require("express")
const app=express();
// const users=require('./user.js')
// const posts=require('./post.js')
// const cookieParser=require("cookie-parser")

const flash=require("connect-flash")

const session=require
("express-session")

const sessionOptions={secret:"mysupersecretstring",resave:false,saveUninitialized:true,
    cookies:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
    }
}


const path=require("path")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(
    session(sessionOptions))

app.use(flash());
app.get("/",(req,res)=>{
    res.send("test successful")
})

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success")
    res.locals.errorMsg=req.flash("error")
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","User not  registered")
    }
    else{
        req.flash("success","user registered successfully")
    }
    res.redirect("/hello")
    // console.log(req.session)
    // res.send(`${req.session.name}`)
})

app.get("/hello",(req,res)=>{
    // res.send(`hello ${req.session.name}`)
    res.render("page.ejs",{name:req.session.name})
})

// app.get("/reqCount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else
//     {
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`)
// })
// app.use(cookieParser("secretcode"));
// app.get("/",(req,res)=>{
//     res.send("Hii I am root.")
//     console.dir(req.cookies)
// })

// // app.get('/greet',(req,res)=>{
// //     let {name="anonymous"}=req.cookies;
// //     res.send(`Hi,${name}`)
// // })

// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("made-in","India",{signed:true})
//     res.send("Signed Cookie sent.")

// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("Verified.")
// })

// app.get('/getcookies',(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("made in ","India");
//     res.send("Send you some cookies!")
// })

// app.use("/posts",posts);
// app.use("/users",users);

app.listen(3000,()=>{
    console.log("Server is listening to 3000")
})