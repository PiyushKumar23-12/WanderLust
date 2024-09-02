const express = require('express');
const app=express();
const mongoose = require('mongoose');
// const Listing=require('./models/listing.js')

// const Review=require('./models/reviews.js')
let port=5000;

const session=require("express-session") 

const listingRouter=require('./routes/listing.js')
const userRouter=require("./routes/user.js")
const reviewRouter=require('./routes/review.js')

const ejsMate=require("ejs-mate")

const flash=require("connect-flash")

const methodOverride=require("method-override")

// const {listingSchema,reviewSchema}=require('./schema.js')
// const wrapAsync=require("./utils/wrapAsync.js")

const ExpressError=require("./utils/ExpressError.js")

const path=require("path")

const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user.js")

main().then((res) => {
    console.log("Connection successful")
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/SaleRent');
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname,"/public")))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));

app.listen(port,()=>{
    console.log(`App is listening on port ${port}`)
});

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.get('/',(req,res)=>{
    res.send("Hii I am Groot")
})

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    // console.log(res.locals.success)
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser)
// })

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)

// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body)
//     if(error){
//         let errMsg=error.details.map((el) => el.message).join(",")
//         throw new ExpressError(400,errMsg)
//     }else{
//         next();
//     }
// }
// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body)
//     if(error){
//         let errMsg=error.details.map((el) => el.message).join(",")
//         throw new ExpressError(400,errMsg)
//     }else{
//         next();
//     }
// }


// app.get("/listings",wrapAsync(async(req,res)=>{
//    const allListings= await Listing.find({});
//    res.render("./listings/index.ejs",{allListings})
// }))

// app.get("/listings/new",(req,res)=>{
//     res.render("./listings/new.ejs")
// })

// app.post("/listings",validateListing,wrapAsync(async(req,res)=>{
//     const newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// }));



// app.post("/listings",wrapAsync(async(req,res)=>{
//     if(!req.body.listing){
//         throw new ExpressError(400,"Send Valid data for listing.")
//     }
//     const newListing=new Listing(req.body.listing);
//     if(!req.body.listing.price){
//         throw new ExpressError(400,"Price is missing!");
//     }
//     if(!req.body.listing.description){
//         throw new ExpressError(400,"Description is missing!");
//     }
//     if(!req.body.listing.location){
//         throw new ExpressError(400,"Location is missing!");
//     }
//     await newListing.save();
//     res.redirect("/listings");
// }));


// app.post("/listings",async(req,res,next)=>{
//     try{
//         const newListing=new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     }catch(err){
//         next(err)
//     }
// })

// app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id)
//     res.render("./listings/edit.ejs",{listing})
// }))

// app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing})
//     res.redirect(`/listings/${id}`)
// }))

//Post Review Route
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
//     let listing = await Listing.findById(req.params.id)
//     let newReview=new Review(req.body.review)
//     listing.reviews.push(newReview)
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`)
// }))

// //Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull: {reviews : reviewId}})
//     await Review.findById(reviewId);
//     res.redirect(`/listings/${id}`)
// }))


// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let deletedListing=await Listing.findByIdAndDelete(id);
//     console.log(deletedListing)
//     res.redirect("/listings")
// }))

// app.get("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews")
//     res.render("./listings/show.ejs",{listing})
// }))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found."))
})

app.use((err,req,res,next)=>{
    let {status=500,message="Some Error Occured!"}=err;
    // res.send("Something went wrong.")
    // res.status(status).send(message)
    res.status(status).render("error.ejs",{err})
})